/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    // 1. Дефиниране на началните данни
    window.currentHero = {
        name: "Аспарух", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 300,
        heroPower: 100
    };

    window.gameTime = { year: 480, seasonIndex: 0, era: "пр.н.е." };
    
    // КОРЕКЦИЯ: Използваме име на регион, който съществува в world_data.js
    window.playerRegions = ["Мизия"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    // 2. Инициализираме външните модули
    if (window.initDiplomacy) window.initDiplomacy();

    // 3. Синхронизация с UI
    setTimeout(() => {
        // Първо се уверяваме, че данните за началния регион са отразени в мощта на рода
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
        }

        if (window.updateCharacterUI) {
            window.updateCharacterUI(window.currentHero);
        }
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление започва. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
        }
    }, 100); 
};

/**
 * ФУНКЦИЯ ЗА СЛУЧАЙНИ СЪБИТИЯ
 * Вече проверява условията и показва модалния прозорец
 */
window.triggerRandomEvent = function() {
    if (!window.eventsDatabase || !window.showEventModal) return;

    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(window.currentHero));

    if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        window.showEventModal(availableEvents[randomIndex]);
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    if (window.processTime) window.processTime();
    if (window.calculateEconomy) window.calculateEconomy();
    
    // Сега събитията ще се задействат при всеки ход, ако условията са изпълнени
    window.triggerRandomEvent();

    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};

if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
