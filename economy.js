/**
 * МОДУЛ: ИКОНОМИКА И РОДОВИ РЕСУРСИ - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН И НАДГРАДЕН (Връзка с 13-те Династии, Епохи и RPG рангове)
 * КОРЕКЦИЯ: Поправено грешното викане на getPerkValue. Директно обвързване с window.dynastyPerks и нивата на Кана.
 * Статистика на файловете в проекта: 16
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    const hero = window.currentHero;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    let baseIncome = 200; // Базов приход на родовата столица
    let totalRegionIncome = 0;

    // 1. ИЗЧИСЛЯВАНЕ НА ДОХОД ОТ РЕГИОНИТЕ И СЕЗОННИТЕ ПРОМЕНИ (Основа от logic.js)
    let seasonalBonus = 200;
    if (window.gameTime) {
        if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; // Лято (Пик на реколтата)
        if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; // Зима (Студ и презапасяване)
    }

    if (window.playerRegions && window.worldData && window.worldData.regions) {
        window.playerRegions.forEach(regionName => {
            const regionData = window.worldData.regions[regionName];
            if (regionData) {
                let regionBase = seasonalBonus > 0 ? Math.floor(seasonalBonus * 0.3) : 60;
                let infrastructure = regionData.infrastructureLevel || 1;
                totalRegionIncome += regionBase * infrastructure;
            }
        });
    }

    let totalIncome = baseIncome + totalRegionIncome;

    // 2. НАДГРАЖДАНЕ: ЕПОХАЛЕН RPG МОДИФИКАТОР (За преход от Древност към Космическо бъдеще)
    // По-високото RPG ниво на Кана отразява по-напреднали икономически структури
    let epochModifier = 1.0;
    if (hero.level >= 5 && hero.level < 10) {
        epochModifier = 1.15; // Имперска ера (+15% доходи)
    } else if (hero.level >= 10) {
        epochModifier = 1.35; // Ера на Квантов и Звезден разцвет (+35% доходи)
    }
    totalIncome = Math.floor(totalIncome * epochModifier);

    // 3. СИНХРОНИЗАЦИЯ СЪС ЗАКОНА НА 13-ТЕ ДИНАСТИИ (от mechanics.js)
    let goldMultiplier = 1.0;
    let armyCostMultiplier = 1.0;

    if (hero.dynasty && window.dynastyPerks && window.dynastyPerks[hero.dynasty]) {
        const perk = window.dynastyPerks[hero.dynasty];
        if (perk.gold) goldMultiplier = perk.gold;
        if (perk.armyCost) armyCostMultiplier = perk.armyCost;
    }

    // Прилагане на родовия икономически бонус (напр. Уния Траки +20% или Лизимах +15%)
    totalIncome = Math.floor(totalIncome * goldMultiplier);
    
    // Специален търговски бонус за определени стратегически родови линии от закона
    if (hero.dynasty === "Бесараб" || hero.dynasty === "Лизимах") {
        totalIncome = Math.floor(totalIncome * 1.15); // Допълнителни 15% за търговски унии
    }

    // 4. РАЗХОДИ ЗА ИЗДРЪЖКА НА АРМИЯТА (Влияе се от числеността и родовите отстъпки)
    // Поддържаме синхронизация както с hero.currentArmy, така и с hero.armySize
    let activeArmy = hero.currentArmy || hero.armySize || 0;
    let armyMaintenanceBase = activeArmy * 0.15;
    
    // Прилагане на отстъпката за поддръжка (напр. Даки купуват и издържат по-евтино)
    let armyMaintenance = Math.floor(armyMaintenanceBase * armyCostMultiplier);
    let finalProfit = Math.floor(totalIncome - armyMaintenance);

    // 5. АКТУАЛИЗАЦИЯ НА ХАЗНАТА НА КАНА СЪС ЗАЩИТА ПРОТИВ ФАЛИТ
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0; 

    // Записване на обновените данни обратно в глобалния обект на родовите линии
    if (window.worldData && window.worldData.clans && hero.id) {
        window.worldData.clans[hero.id].gold = hero.gold;
    }

    // 6. ЛЕТОПИС (Съобщение от Съветника за финансовото състояние)
    if (window.showAdvisorMsg) {
        let seasonName = "Текущ сезон";
        if (window.gameTime && window.gameTime.getSeasonName) {
            seasonName = window.gameTime.getSeasonName();
        }
        
        if (finalProfit >= 0) {
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Родовата хазна събра +${totalIncome} злато. След поддръжката на войската (-${armyMaintenance}), чистият профит е +${finalProfit} злато.`);
        } else {
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Издръжката на Вашата армия (${armyMaintenance}) надхвърля приходите (${totalIncome}). Загуба: ${finalProfit} злато!`);
        }
    }

    // 7. МОМЕНТАЛНО ОБНОВЯВАНЕ НА ИНТЕРФЕЙСА (Синхрон с ui.js)
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};
