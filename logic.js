/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ОБНОВЕН (Интеграция на Expeditions)
 */

window.initNewGame = function() {
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60,
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

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.showAdvisorMsg) window.showAdvisorMsg("Летоброенето започва от 1 г. от н.е.");
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Обработка на времето
    if (window.processTime) window.processTime();
    window.gameTime.turn++;

    // 2. Икономика и приходи
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100; 
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    // 3. Логика за останалите родове
    Object.keys(window.activeDynasties).forEach(dyn => {
        if (dyn !== window.currentHero.dynasty) {
            window.activeDynasties[dyn].gold += 50;
            if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
        }
    });

    // 4. АКТИВИРАНЕ НА СЛУЧАЙНИ СЪБИТИЯ
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    // 5. АКТИВИРАНЕ НА ЕКСПЕДИЦИИ И КУЕСТОВЕ (Стъпка 3)
    if (window.checkForQuest) {
        window.checkForQuest();
    }

    // 6. Обновяване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.onload = () => window.initNewGame();
