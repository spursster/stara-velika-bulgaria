/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * Синхронизиран с 50 региона, автоматизирана икономика и система за АВТОНОМНИ РОДОВЕ.
 */
window.initNewGame = function() {
    // 1. Дефиниране на началните данни за Кана
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150
    };

    window.gameTime = { year: 632, seasonIndex: 0, era: "от н.е." };
    
    // Начален регион
    window.playerRegions = ["Крим"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    if (window.initDiplomacy) window.initDiplomacy();

    // 2. Първоначална синхронизация със световните данни
    setTimeout(() => {
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
            window.worldData.clans[window.currentHero.dynasty].isJoined = true;
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        // Съобщението при започване влиза в Летописа
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление започва в ${window.playerRegions[0]}. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
        }
    }, 100); 
};

/**
 * СИСТЕМА ЗА АВТОНОМНИ ДЕЙСТВИЯ (AI) НА РОДОВЕТЕ
 * Позволява на лидерите да действат автоматично според ресурсите си.
 */
window.processClanAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.keys(window.worldData.clans).forEach(clanName => {
        // Пропускаме рода на играча - той се управлява ръчно
        if (window.currentHero && window.currentHero.dynasty === clanName) return;

        let clan = window.worldData.clans[clanName];

        // 1. АВТОНОМНА ИКОНОМИКА: Приход на злато според броя региони
        clan.gold = (clan.gold || 0) + (clan.regionsOwned * 20);

        // 2. АВТОНОМНО ВОЙСКОНАЕМАНЕ: Ако имат над 200 злато, купуват армия
        if (clan.gold >= 200) {
            clan.armySize = (clan.armySize || 100) + 50;
            clan.gold -= 200;
        }

        // 3. АВТОНОМНА ЕКСПАНЗИЯ: Опит за завземане на неутрални територии
        // Ако армията им е достатъчно голяма (напр. над 300)
        if (clan.armySize > 300) {
            // Тук в бъдеще ще добавим логика за избор на съседен регион от regions.js
            // Засега симулираме успех при 20% шанс на ход за по-реалистично темпо
            if (Math.random() < 0.2) {
                clan.regionsOwned += 1;
                if (window.showAdvisorMsg) {
                    window.showAdvisorMsg(`ВЕСТ: Родът ${clanName} разшири влиянието си и завзе нови земи!`);
                }
            }
        }
    });

    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
};

/**
 * ФУНКЦИЯ ЗА СЛУЧАЙНИ СЪБИТИЯ
 */
window.triggerRandomEvent = function() {
    if (!window.eventsDatabase) return;

    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(window.currentHero));

    if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        const selectedEvent = availableEvents[randomIndex];
        
        if (window.eventQueue) {
            window.eventQueue.push(selectedEvent);
            if (window.updateNotificationBadge) window.updateNotificationBadge();
        }
    }
};

/**
 * ФУНКЦИЯ ЗА ПРИСЪЕДИНЯВАНЕ НА РЕГИОН (ЗА ИГРАЧА)
 */
window.conquerRegion = function(regionName) {
    const regionData = window.worldData.regions[regionName];
    
    if (!regionData) return;

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        regionData.nativeClans.forEach(clanName => {
            if (window.worldData.clans[clanName]) {
                window.worldData.clans[clanName].regionsOwned += 1;
            }
        });

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Слава на Кана! Земята ${regionName} вече е под наш контрол.`);
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето
    if (window.processTime) window.processTime();
    
    // 2. Изчисляване на икономиката на играча
    if (window.calculateEconomy) window.calculateEconomy();

    // 3. АВТОМАТИЗАЦИЯ НА ДРУГИТЕ РОДОВЕ (Нова стъпка)
    window.processClanAutomation();
    
    // 4. Проверка за събития
    window.triggerRandomEvent();

    // 5. Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateNotificationBadge) window.updateNotificationBadge();
};

// Автоматично стартиране
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
