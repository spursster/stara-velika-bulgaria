/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: КОРИГИРАН И НАПЪЛНО СИНХРОНИЗИРАН СЪС ЗАКОНА НА DATABASE.JS (Едно към едно)
 * ОПИСАНИЕ: Всички термини "династия" са изтрити. Използват се единствено Кланове и Герои.
 * Статистика на файловете в проекта: 16
 */

window.initNewGame = function() {
    // 1. АЛГОРИТЪМ ЗА ИЗБОР НА СЛУЧАЕН ГЕРОЙ ОТ СЛУЧАЕН КЛАН (От законния обект window.clans)
    let selectedName = "Кубрат"; // Fallback по подразбиране
    let selectedClan = "Дуло"; // Fallback по подразбиране

    if (window.clans) {
        const clanKeys = Object.keys(window.clans);
        if (clanKeys.length > 0) {
            // Избираме случаен Клан от 13-те налични в базата данни
            selectedClan = clanKeys[Math.floor(Math.random() * clanKeys.length)];
            const heroesList = window.clans[selectedClan].heroes;
            
            if (heroesList && heroesList.length > 0) {
                // Избираме случаен Герой от този клан
                selectedName = heroesList[Math.floor(Math.random() * heroesList.length)];
            }
        }
    }

    // 2. ИНИЦИАЛИЗАЦИЯ НА ГЛАВНИЯ ГЕРОЙ
    window.currentHero = {
        name: selectedName, 
        clan: selectedClan, // Използва се само clan, без династии
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 50,
        techLevel: 1
    };

    // 3. ИНИЦИАЛИЗАЦИЯ НА ВРЕМЕТО
    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    // Намиране на коренния регион за избрания Клан от световните данни
    let startRegion = "Мизия";
    if (window.worldData && window.worldData.regions) {
        const foundRegion = Object.keys(window.worldData.regions).find(regKey => 
            window.worldData.regions[regKey].nativeClans && 
            window.worldData.regions[regKey].nativeClans.includes(selectedClan)
        );
        if (foundRegion) startRegion = foundRegion;
    }
    window.playerRegions = [[startRegion]];
    
    // Активните кланове се взимат директно от базата данни
    window.activeClans = {};
    if (window.clans) {
        Object.keys(window.clans).forEach(name => {
            window.activeClans[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    // Инициализиране на RPG статуса на главния герой при старт
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    
    console.log(`👑 Играта започна със случаен Герой: ${window.currentHero.name} от Клан: ${window.currentHero.clan}! Стартов регион: ${startRegion}`);
};

/**
 * ==========================================================================
 * ПРЕХВЪРЛЯНЕ НА ХОД
 * ==========================================================================
 */
window.nextTurn = function() {
    // 1. НАПРЕДЪК НА ВРЕМЕТО
    window.gameTime.turn += 1;
    window.gameTime.seasonIndex += 1;
    
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year += 1;
    }

    // Извикване на механиките за времеви процеси
    if (window.processTime) {
        window.processTime();
    }

    // 2. ИКОНОМИКА: СЕЗОННИ ПРИХОДИ
    let seasonalBonus = 200;
    if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; // Лято
    if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; // Зима

    let goldArtifactModifier = 0;
    if (window.equippedItems) {
        window.equippedItems.forEach(item => {
            if (item && item.bonus && item.bonus.goldBonus) {
                goldArtifactModifier += item.bonus.goldBonus;
            }
        });
    }
    
    let baseIncome = window.playerRegions.length * seasonalBonus;
    let artifactExtraGold = Math.floor(baseIncome * (goldArtifactModifier / 100));
    window.currentHero.gold += (baseIncome + artifactExtraGold);

    // 3. ЛОГИКА ЗА ОСТАНАЛИТЕ КЛАНОВЕ
    if (window.activeClans) {
        Object.keys(window.activeClans).forEach(cName => {
            if (cName !== window.currentHero.clan) {
                window.activeClans[cName].gold += 50;
                if (Math.random() > 0.9) window.activeClans[cName].regions += 1;
            }
        });
    }

    // 4. СЛУЧАЙНИ СЪБИТИЯ
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    // 5. НАПРЕДЪК НА ЕКСПЕДИЦИИТЕ
    if (window.updateExpeditionSystem) {
        window.updateExpeditionSystem();
    }

    if (window.updateExpeditionBadge) {
        window.updateExpeditionBadge();
    }

    // 6. ТЕРИТОРИАЛЕН ОПИТ НА ХОД
    if (window.playerRegions && window.gainHeroXP) {
        const flatRegions = window.playerRegions.flat();
        const totalTerritoryXP = flatRegions.length * 10;

        if (totalTerritoryXP > 0) {
            window.gainHeroXP(window.currentHero, totalTerritoryXP);
            
            if (window.activeExpeditions && window.activeExpeditions.length > 0) {
                window.activeExpeditions.forEach(exp => {
                    if (exp.leaderData) {
                        window.gainHeroXP(exp.leaderData, totalTerritoryXP);
                    }
                });
            }
            console.log(`🦅 Спечелен териториален опит от ${flatRegions.length} региона: +${totalTerritoryXP} XP.`);
        }
    }

    // 7. ОПРЕСНЯВАНЕ НА ИНТЕРФЕЙСА
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
};

window.advanceTurn = window.nextTurn;

window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
