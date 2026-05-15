/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * Синхронизиран с 50 региона, автоматизирана икономика и система за АВТОНОМНИ РОДОВЕ.
 * Стриктно спазване на титлата "Кан" и родовата структура.
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
    
    // Начален регион (съобразен с Крим/Фанагория)
    window.playerRegions = ["Крим"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    // Инициализация на дипломатическите отношения
    if (window.initDiplomacy) window.initDiplomacy();

    // 2. Първоначална синхронизация със световните данни
    setTimeout(() => {
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
            window.worldData.clans[window.currentHero.dynasty].isJoined = true;
            window.worldData.clans[window.currentHero.dynasty].gold = window.currentHero.gold;
            window.worldData.clans[window.currentHero.dynasty].armySize = window.currentHero.armySize;
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
 * Позволява на лидерите (лидери на династии) да действат автоматично според ресурсите си.
 */
window.processClanAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.keys(window.worldData.clans).forEach(clanName => {
        // Пропускаме рода на играча - той се управлява ръчно
        if (window.currentHero && window.currentHero.dynasty === clanName) return;

        let clan = window.worldData.clans[clanName];

        // 1. АВТОНОМНА ИКОНОМИКА: Приход на злато според броя региони
        // Всеки регион носи по 20 злато на ход
        clan.gold = (clan.gold || 0) + (clan.regionsOwned * 20);

        // 2. АВТОНОМНО ВОЙСКОНАЕМАНЕ: Ако имат над 200 злато, автоматично купуват армия
        if (clan.gold >= 200) {
            clan.armySize = (clan.armySize || 100) + 50;
            clan.gold -= 200;
        }

        // 3. АВТОНОМНА ЕКСПАНЗИЯ: Опит за завземане на територии
        // Ако армията им е над 300, родът се опитва да завладее нов регион
        if (clan.armySize > 300) {
            // Симулираме успех при 20% шанс на ход за по-балансирано темпо на играта
            if (Math.random() < 0.2) {
                clan.regionsOwned += 1;
                clan.armySize -= 30; // Загуби при битката
                
                if (window.showAdvisorMsg) {
                    window.showAdvisorMsg(`ВЕСТ: Лидерът ${clan.leader} от род ${clanName} разшири влиянието си и завзе нови земи!`);
                }
            }
        }
    });

    // Обновяване на йерархията след промените
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
    
    if (!regionData) {
        console.error(`ГРЕШКА: Регион "${regionName}" не съществува в базата данни.`);
        return;
    }

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Актуализираме собствеността в световните данни за рода на играча
        if (window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
        }

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Слава на Кана! Земята ${regionName} вече е под наш контрол.`);
    }
};

/**
 * ГЛАВЕН ЦИКЪЛ НА ХОДА
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето (година и сезон)
    if (window.processTime) window.processTime();
    
    // 2. Изчисляване на икономиката на играча
    if (window.calculateEconomy) window.calculateEconomy();

    // 3. АВТОМАТИЗАЦИЯ НА ОСТАНАЛИТЕ РОДОВЕ (Икономика и Армия)
    window.processClanAutomation();

    // 4. АВТОНОМНА ДИПЛОМАЦИЯ (Дарства и отношения от лидерите на родовете)
    if (window.processClanDiplomacyAutomation) {
        window.processClanDiplomacyAutomation();
    }
    
    // 5. Проверка за случайни събития
    window.triggerRandomEvent();

    // 6. Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateNotificationBadge) window.updateNotificationBadge();
};

// Инициализация при зареждане
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
