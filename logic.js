/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода & 51 региона)
 * Поддържа автоматизация на новите династии и стриктно спазване на титлата "Кан".
 */

window.initNewGame = function() {
    // 1. ДЕФИНИРАНЕ НА НАЧАЛНИТЕ ДАННИ ЗА КАНА
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150
    };

    window.gameTime = { year: 632, seasonIndex: 0, era: "от н.е." };
    
    // Начален регион (Фанагория/Крим)
    window.playerRegions = ["Крим"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    // Инициализация на дипломатическите отношения за 13-те рода
    if (window.initDiplomacy) window.initDiplomacy();

    // 2. ПЪРВОНАЧАЛНА СИНХРОНИЗАЦИЯ
    setTimeout(() => {
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            let myClan = window.worldData.clans[window.currentHero.dynasty];
            myClan.regionsOwned = window.playerRegions.length;
            myClan.isJoined = true;
            myClan.gold = window.currentHero.gold;
            myClan.armySize = window.currentHero.armySize;
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление започва в ${window.playerRegions[0]}. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
        }
    }, 100); 
};

/**
 * СИСТЕМА ЗА АВТОНОМНИ ДЕЙСТВИЯ (AI) НА 13-ТЕ РОДА
 * Лидерите на династиите действат автоматично според новата икономическа логика.
 */
window.processClanAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.keys(window.worldData.clans).forEach(clanName => {
        // Пропускаме рода на играча
        if (window.currentHero && window.currentHero.dynasty === clanName) return;

        let clan = window.worldData.clans[clanName];

        // 1. АВТОНОМНА ИКОНОМИКА: Приход спрямо регионите
        clan.gold = (clan.gold || 0) + (clan.regionsOwned * 25);

        // 2. АВТОНОМНО ВОЙСКОНАЕМАНЕ: Динамично спрямо рода
        if (clan.gold >= 250) {
            clan.armySize = (clan.armySize || 100) + 60;
            clan.gold -= 250;
        }

        // 3. АВТОНОМНА ЕКСПАНЗИЯ: Опит за завземане на 51-те региона
        if (clan.armySize > 350) {
            if (Math.random() < 0.18) {
                clan.regionsOwned += 1;
                clan.armySize -= 40; 
                
                if (window.showAdvisorMsg) {
                    window.showAdvisorMsg(`ВЕСТ: Лидерът ${clan.leader} от род ${clanName} завзе нови земи в името на своя род!`);
                }
            }
        }
    });

    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
};

/**
 * ФУНКЦИЯ ЗА ПРИСЪЕДИНЯВАНЕ НА РЕГИОН (ЗА ИГРАЧА)
 */
window.conquerRegion = function(regionName) {
    const regionData = window.worldData.regions[regionName];
    
    if (!regionData) {
        console.error(`ГРЕШКА: Регион "${regionName}" не съществува.`);
        return;
    }

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Актуализираме собствеността за рода на играча
        if (window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
        }

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Слава на Кана! Земята ${regionName} вече е под наш контрол. 🏹`);
    }
};

/**
 * ГЛАВЕН ЦИКЪЛ НА ХОДА
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Време
    if (window.processTime) window.processTime();
    
    // 2. Икономика на играча
    if (window.calculateEconomy) window.calculateEconomy();

    // 3. AI на останалите 12 рода
    window.processClanAutomation();

    // 4. AI Дипломация
    if (window.processClanDiplomacyAutomation) {
        window.processClanDiplomacyAutomation();
    }
    
    // 5. Събития
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    // 6. UI Опресняване
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateNotificationBadge) window.updateNotificationBadge();
};

// Старт
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
