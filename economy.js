/**
 * МОДУЛ: ИКОНОМИКА И РОДОВИ РЕСУРСИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Интеграция на 100+ Diablo Способности & ArcheAge Класове)
 * КОРЕКЦИЯ БЪГ: Коригирано пасивното раздаване на опит и вдигане на нива на отключените герои според родовата структура.
 * Статистика на файловете в проекта: 16
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
        baseIncome += (skills.bazaars * 15); // +15 злато от панаири
    }

    let totalRegionIncome = 0;

    // 2. ИЗЧИСЛЯВАНЕ НА ДОХОД ОТ РЕГИОНИТЕ И СЕЗОННИТЕ ПРОМЕНИ
    let seasonalBonus = 200;
    if (window.gameTime) {
        if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; // Лято (Пик на реколтата)
        if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; // Зима (Студ и презапасяване)
    }

    if (window.playerRegions && window.worldData && window.worldData.regions) {
        const ownedRegionsFlat = window.playerRegions.flat();
        
        ownedRegionsFlat.forEach(regionName => {
            const regionData = window.worldData.regions[regionName];
            
            if (regionData) {
                let regionBase = seasonalBonus > 0 ? Math.floor(seasonalBonus * 0.3) : 60;
                
                // Diablo пасив: Управление на благата (economy skill) увеличава данъка от регионите с 5% на точка
                let economyModifier = 1 + ((skills.economy || 0) * 0.05);
                
                // Ранг на инфраструктурата на региона (ако има такъв)
                let infraLvl = regionData.infrastructureLevel || 1;
                
                totalRegionIncome += Math.floor(regionBase * infraLvl * economyModifier);
            }
        });
    }

    // Сбор на базовия и регионалния данък
    let totalIncome = baseIncome + totalRegionIncome;

    // 3. ТЪРГОВСКИ КАРТЕЛИ, КРАЛСКА ЛИХВА И РОДОВИ БОНУСИ
    // Diablo пасив: Кралска съкровищница (royalTreasury) - дава 2% пасивна лихва върху текущото злато
    if ((skills.royalTreasury || 0) > 0 && hero.gold > 0) {
        let interest = Math.floor(hero.gold * (skills.royalTreasury * 0.02));
        if (interest > 500) interest = 500; // Таван на лихвата за баланс
        totalIncome += interest;
    }

    // Diablo пасиви: Търговски картел (cartel) и Монопол (monopoly)
    let tradeBonusMultiplier = 1.0;
    if ((skills.cartel || 0) > 0) tradeBonusMultiplier += (skills.cartel * 0.04);
    if ((skills.monopoly || 0) > 0) tradeBonusMultiplier += (skills.monopoly * 0.05);
    totalIncome = Math.floor(totalIncome * tradeBonusMultiplier);

    // Оригинални родови бонуси от механиката (ЗАПАЗЕНИ НА 100%)
    let clanMultiplier = 1.0;
    if (window.dynastyPerks && window.dynastyPerks[hero.dynasty]) {
        if (window.dynastyPerks[hero.dynasty].gold) {
            clanMultiplier = window.dynastyPerks[hero.dynasty].gold;
        }
    } else if (window.getPerkValue) {
        clanMultiplier = window.getPerkValue('gold');
    }
    totalIncome = Math.floor(totalIncome * clanMultiplier);

    // Допълнителни 15% за специфични търговски родове (Бесараб и Ерми)
    if (hero.dynasty === "Бесараб" || hero.dynasty === "Ерми") {
        totalIncome = Math.floor(totalIncome * 1.15);
    }

    // 4. РАЗХОДИ ЗА ИЗДРЪЖКА С ДИПЛОМАТИЧЕСКА И ХЛЕБНА ЛОГИСТИКА
    let armyCostMultiplier = 1.0;
    if (window.dynastyPerks && window.dynastyPerks[hero.dynasty] && window.dynastyPerks[hero.dynasty].armyCost) {
        armyCostMultiplier = window.dynastyPerks[hero.dynasty].armyCost;
    } else if (window.getPerkValue) {
        armyCostMultiplier = window.getPerkValue('armyCost');
    }

    // Diablo пасиви: Обсадна логистика (supplyChain) и Хлебна логистика (grainLogistics)
    let logisticsReduction = ((skills.supplyChain || 0) * 0.03) + ((skills.grainLogistics || 0) * 0.04);
    
    // Специално предимство през Зимата: Хлебната логистика спасява от глад
    if (window.gameTime && window.gameTime.seasonIndex === 3 && (skills.grainLogistics || 0) > 0) {
        logisticsReduction += (skills.grainLogistics * 0.05); // Още по-висока спестовност в студа
    }
    
    armyCostMultiplier = Math.max(0.4, armyCostMultiplier - logisticsReduction);

    let armyMaintenanceBase = (hero.armySize || 0) * 0.15;
    let armyMaintenance = Math.floor(armyMaintenanceBase * armyCostMultiplier);
    let finalProfit = Math.floor(totalIncome - armyMaintenance);

    // ArcheAge Проверка: Специфичен бонус за висши финансови класове
    if (hero.currentClass === "Имперски ковчежник" || hero.currentClass === "Златен Алхимик") {
        finalProfit += 50; // Бонус за класова специализация
        totalIncome += 50;
    }

    // 5. АКТУАЛИЗАЦИЯ НА ХАЗНАТА НА КАНА СЪС ЗАЩИТА ПРОТИВ ФАЛИТ
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0; 

    // Записване на обновените финансови данни обратно в глобалния списък на родовете
    if (window.worldData && window.worldData.clans && hero.dynasty) {
        if (window.worldData.clans[hero.dynasty]) {
            window.worldData.clans[hero.dynasty].gold = hero.gold;
        }
    }

    // =========================================================================
    // 🎯 АВТОМАТИЧЕН RPG ПРОГРЕС И КАЧВАНЕ НА НИВА НА ВСИЧКИ ОТКЛЮЧЕНИ ГЕРОИ
    // =========================================================================
    if (window.worldData && window.worldData.clans) {
        Object.keys(window.worldData.clans).forEach(clanKey => {
            let clan = window.worldData.clans[clanKey];
            if (!clan) return;

            // Всеки водач/герой трупа опит, ако е изрично отключен или е текущият ни активен герой на играча
            let isActiveHeroClan = (hero.dynasty && clanKey === hero.dynasty) || (clan.name === hero.name);
            
            if (clan.isUnlocked || isActiveHeroClan) {
                // Подсигуряваме базовите стойности, ако липсват в обекта
                if (clan.xp === undefined) clan.xp = 0;
                if (clan.level === undefined) clan.level = 1;

                // Раздаваме пасивен опит за ход от успешно родово управление (между 20 и 45 XP)
                let xpGained = Math.floor(Math.random() * 26) + 20;
                clan.xp += xpGained;

                // Ако това е активният ни герой, добавяме опита веднага и към неговия основен обект
                if (isActiveHeroClan) {
                    hero.xp = (hero.xp || 0) + xpGained;
                }

                let requiredXP = clan.level * 150;

                // Цикъл за сигурно вдигане на нива (Level Up)
                while (clan.xp >= requiredXP) {
                    clan.xp -= requiredXP;
                    clan.level += 1;
                    clan.skillPoints = (clan.skillPoints || 0) + 1;

                    // Ако е активният ни герой, обновяваме главния интерфейсен обект
                    if (isActiveHeroClan) {
                        hero.level = clan.level;
                        hero.xp = clan.xp;
                        hero.skillPoints = (hero.skillPoints || 0) + 1;
                        if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
                    }

                    // Автоматично разпределяне на магии от rpg_system.js за пасивните лидери
                    if (window.autoAssignLeaderSkills) {
                        window.autoAssignLeaderSkills(clan);
                    }

                    if (window.showAdvisorMsg) {
                        window.showAdvisorMsg(`👑 ВЕЛИК ПРОГРЕС: Родовият водач ${clan.name} достигна Ниво ${clan.level}! Спечелена е точка за способности.`);
                    }

                    // Обновяваме прага на опита за следващото ниво вътре в цикъла
                    requiredXP = clan.level * 150;
                }
            }
        });
    }

    // 6. ЛЕТОПИС (Съобщение от Съветника за финансовото състояние)
    if (window.showAdvisorMsg) {
        let seasonName = "Текущ сезон";
        if (window.gameTime && window.gameTime.getSeasonName) {
            seasonName = window.gameTime.getSeasonName();
        } else if (window.gameTime) {
            const seasons = ["Пролет", "Лято", "Есен", "Зима"];
            seasonName = seasons[window.gameTime.seasonIndex] || "Сезон";
        }
        
        let classTitle = hero.currentClass && hero.currentClass !== "Няма клас" ? ` (${hero.currentClass})` : "";
        
        if (finalProfit >= 0) {
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Владетелят ${hero.name}${classTitle} събра +${totalIncome} злато от родови земи. След поддръжка на армията (-${armyMaintenance}), чистият профит е +${finalProfit} злато.`);
        } else {
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Разходите за войската (-${armyMaintenance}) надхвърлят приходите (+${totalIncome}). Хазната е на червено с ${finalProfit} злато!`);
        }
    }

    // Моментално опресняване на главния интерфейс и Топ 6 картите
    if (window.updateCharacterUI) {
        window.updateCharacterUI(hero);
    }
    if (window.renderTop6LeadersUI) {
        window.renderTop6LeadersUI();
    }
};
