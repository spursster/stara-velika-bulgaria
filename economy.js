/**
 * МОДУЛ: ИКОНОМИКА И РОДОВИ РЕСУРСИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (СИНХРОНИЗАЦИЯ С DIABLO ПАСИВИ & AUTO/MANUAL XP СИСТЕМА)
 * КОРЕКЦИЯ: Икономическите изчисления четат уменията, а пасивният опит ползва gainHeroXP.
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
        baseIncome += (skills.bazaars * 15); // +15 злато от пазари
    }

    // 2. ДИНАМИЧЕН ПРИХОД ОТ ВЛАДЕНИТЕ РЕГИОНИ
    let regionIncome = 0;
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        const ownedRegionsFlat = window.playerRegions.flat();
        ownedRegionsFlat.forEach(regionName => {
            const regData = window.worldData.regions[regionName];
            if (regData) {
                let infraLvl = regData.infrastructureLevel || 1;
                regionIncome += (infraLvl * 50); // Сезонен данък спрямо инфраструктурата
            }
        });
    }

    // Diablo пасив: Родово Управление (economy) - Увеличава с 10% общия приход от регионите за всяка точка
    if ((skills.economy || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + (skills.economy * 0.10)));
    }

    let totalIncome = baseIncome + regionIncome;

    // 3. РАЗХОДИ ЗА ПОДДРЪЖКА НА АРМИЯТА
    let armySize = hero.currentArmy || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.25); // Базова цена на войник

    // Diablo пасив: Логистика (logistics) - Намалява разходите за войска с 5% на всяка точка (макс 50%)
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));

    // 4. ФИНАЛНО БАЛАНСИРАНЕ НА ХАЗНАТА
    let finalProfit = totalIncome - armyMaintenance;
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0; // Защита против фалит

    // Синхронизация с глобалната база данни worldData за текущия род на играча
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
        window.worldData.clans[hero.dynasty].gold = hero.gold;
    }

    // 5. ПАСИВЕН ПРОГРЕС ЗА ОСТАНАЛИТЕ АВТОНОМНИ КЛАНОВЕ
    // Ползваме официалната gainHeroXP функция, за да уважим Manual/Auto режимите им
    if (window.worldData && window.worldData.clans) {
        Object.entries(window.worldData.clans).forEach(([clanKey, clan]) => {
            if (clanKey !== hero.dynasty) {
                // Пасивен доход за останалите родове, за да купуват войска
                clan.gold = (clan.gold || 0) + 120;
                
                // Всеки сезон извънредните водачи получават по +35 точки пасивен опит
                if (window.gainHeroXP) {
                    window.gainHeroXP(clan, 35);
                } else {
                    // Сигурен пасивен fallback ако модулът не е заредил навреме
                    clan.xp = (clan.xp || 0) + 35;
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

    // 6. ЛЕТОПИС (Известие на Съветника)
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
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Разходите за войската (-${armyMaintenance}) надхвърлиха сезонните данъци. Взети са спешни резерви от хазната на рода. Чист дефицит: ${finalProfit} злато.`);
        }
    }

    // Опресняване на интерфейсите
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    // =======================================================================
    // НАДГРАЖДАНЕ: АВТОМАТИЧНО ОБНОВЯВАНЕ НА МИСТИЧНИЯ ПОРТАЛ ПРИ СЛЕДВАЩ ХОД
    // =======================================================================
    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
};
