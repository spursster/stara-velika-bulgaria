/**
 * МОДУЛ: ИКОНОМИКА И РОДОВИ РЕСУРСИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Интеграция на 100+ Diablo Способности & ArcheAge Класове)
 * КОРЕКЦИЯ БЪГ: Премахната синтактичната грешка при извикването на обекта на героя в летописа.
 * Статистика на файловете в проекта: 17
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    const hero = window.currentHero;
    
    // Подсигуряваме, че RPG структурата на способностите съществува
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }

    let skills = hero.skills || {};

    // 1. БАЗОВ ПРИХОД И ДИАБЛО МОДИФИКАТОРИ НА СТОЛИЦАТА
    let baseIncome = 200; // Базов приход на родовата столица
    
    // Diablo пасиви: Златна треска (goldRush) и Родови пазари (bazaars)
    if ((skills.goldRush || 0) > 0) {
        baseIncome += (skills.goldRush * 25); // +25 злато за всяко ниво от златни мини
    }
    if ((skills.bazaars || 0) > 0) {
        baseIncome += (skills.bazaars * 15); // +15 злато от търговски обекти
    }

    let totalIncome = baseIncome;

    // 2. ДОБАВЯНЕ НА ПРИХОДИ ОТ ВСИЧКИ ЗАВЛАДЕНИ РЕГИОНИ
    if (window.worldData && window.worldData.regions && window.playerRegions) {
        const ownedRegionsFlat = window.playerRegions.flat();
        ownedRegionsFlat.forEach(regionName => {
            if (window.worldData.regions[regionName]) {
                const reg = window.worldData.regions[regionName];
                let regIncome = reg.baseIncome || 50;
                
                // Бонус от инфраструктурно ниво на региона
                let infra = reg.infrastructureLevel || 1;
                regIncome += (infra * 20);

                // Diablo пасив: Търговски съюз (cartel) вдига регионалния приход
                if ((skills.cartel || 0) > 0) {
                    regIncome += (skills.cartel * 10);
                }

                totalIncome += regIncome;
            }
        });
    }

    // 3. ИЗЧИСЛЯВАНЕ НА ПОДДРЪЖКАТА НА АРМИЯТА (Логистика пасив)
    let baseArmySize = hero.armySize || hero.currentArmy || 0;
    let baseMaintenance = Math.floor(baseArmySize * 0.5); // 0.5 злато на боец

    // Diablo пасив: Логистика (logistics) намалява поддръжката с 10% на всяко ниво (до макс 50%)
    let logisticsLevel = skills.logistics || 0;
    let reduction = Math.min(logisticsLevel * 0.10, 0.50);
    let armyMaintenance = Math.floor(baseMaintenance * (1 - reduction));

    // 4. ПРИЛАГАНЕ НА КРАЙНИТЕ РЕЗУЛТАТИ КЪМ ХАЗНАТА
    let finalProfit = totalIncome - armyMaintenance;
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0; // Предотвратяваме отрицателно злато

    // Синхронизация с глобалните данни на активния клан
    if (window.worldData && window.worldData.clans && hero.dynasty && window.worldData.clans[hero.dynasty]) {
        window.worldData.clans[hero.dynasty].gold = hero.gold;
    }

    // 5. ПАСИВНО СЕЗОННО РАЗВИТИЕ НА ОСТАНАЛИТЕ ОТКЛЮЧЕНИ ВОДАЧИ В СЪЮЗА
    if (window.worldData && window.worldData.clans) {
        Object.keys(window.worldData.clans).forEach(clanKey => {
            const clan = window.worldData.clans[clanKey];
            if (clan && clan.isUnlocked && clanKey !== hero.dynasty) {
                // Използваме универсалния метод за добавяне на опит от rpg_system.js
                if (window.gainHeroXP) {
                    window.gainHeroXP(clan, 25); // Получават пасивен тренировъчен опит
                } else {
                    clan.xp = (clan.xp || 0) + 25;
                    let requiredXP = (clan.level || 1) * 150;
                    if (clan.xp >= requiredXP) {
                        clan.xp -= requiredXP;
                        clan.level = (clan.level || 1) + 1;
                        clan.skillPoints = (clan.skillPoints || 0) + 1;
                        clan.heroPower = (clan.heroPower || 100) + 30;
                    }
                }
            }
        });
    }

    // 6. ЛЕТОПИС (Известие на Съветника без синтактични грешки)
    if (window.showAdvisorMsg) {
        let seasonName = "Текущ сезон";
        if (window.gameTime) {
            const seasons = ["Пролет", "Лято", "Есен", "Зима"];
            seasonName = seasons[window.gameTime.seasonIndex] || "Сезон";
        }
        
        let classTitle = hero.currentClass && hero.currentClass !== "Няма клас" ? ` (${hero.currentClass})` : "";
        
        if (finalProfit >= 0) {
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Водачът Кан ${hero.name}${classTitle} събра +${totalIncome} злато от родови земи. След поддръжка на армията (-${armyMaintenance}), чистият профит е +${finalProfit} злато.`);
        } else {
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Разходите за войската (-${armyMaintenance}) надхвърлят приходите (+${totalIncome}). Хазната е на червено с ${finalProfit} злато!`);
        }
    }

    // Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
