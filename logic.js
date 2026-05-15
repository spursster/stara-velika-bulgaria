/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО ВЪЗСТАНОВЕН И КОРЕКТЕН (Времето работи, Владетелите са безсмъртни)
 * Статистика на файловете в проекта: 16
 */

window.initNewGame = function() {
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60, // Остава постоянна базова стойност, без физическо стареене
        techLevel: 1
    };

    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    // Инициализираме RPG статуса на главния герой веднага при старт
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.showAdvisorMsg) window.showAdvisorMsg("Летоброенето започва от 1 г. от н.е.");
    
    if (window.renderExpeditionButton) window.renderExpeditionButton();
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. ОБРАБОТКА НА ВРЕМЕТО (Възстановено зареждане) + RPG ОПИТ ЗА ХОД
    if (window.processTime) window.processTime(); // Механиката за превъртане на сезони/години
    window.gameTime.turn++;

    // Главният владетел получава опит за управление на държавата всеки ход
    if (window.gainHeroXP) {
        window.gainHeroXP(window.currentHero, 5);
        if (window.checkAndAssignClass) window.checkAndAssignClass(window.currentHero);
    }

    // 2. Икономика и приходи
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100; 
    
    let goldArtifactModifier = 0;
    if (window.playerInventory && window.playerInventory.length > 0) {
        window.playerInventory.forEach(item => {
            if (item.bonus && item.bonus.goldBonus) {
                goldArtifactModifier += item.bonus.goldBonus;
            }
        });
    }
    
    let baseIncome = window.playerRegions.length * seasonalBonus;
    let artifactExtraGold = Math.floor(baseIncome * (goldArtifactModifier / 100));
    window.currentHero.gold += (baseIncome + artifactExtraGold);

    // 3. Логика за останалите родове
    Object.keys(window.activeDynasties).forEach(dyn => {
        if (dyn !== window.currentHero.dynasty) {
            window.activeDynasties[dyn].gold += 50;
            if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
        }
    });

    // 4. АКТИВИРАНЕ НА СЛУЧАЙНИ СЪБИТИЯ
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    // 5. НАПРЕДЪК НА АКТИВНИТЕ ЕКСПЕДИЦИИ
    if (window.updateExpeditionSystem) {
        window.updateExpeditionSystem();
    }

    // 6. Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
