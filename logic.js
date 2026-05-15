/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: КОРИГИРАН (Старт: 1 г. от н.е. + Events)
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

    // Стартово съобщение
    setTimeout(() => {
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.showAdvisorMsg) window.showAdvisorMsg("Добре дошъл, Кане! Летоброенето започва от 1 г. от н.е.");
    }, 300);
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    if (window.processTime) window.processTime();
    window.gameTime.turn++;

    // Икономика
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100; 
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    // AI родове
    if (window.activeDynasties) {
        Object.keys(window.activeDynasties).forEach(dyn => {
            if (dyn !== window.currentHero.dynasty) {
                window.activeDynasties[dyn].gold += 50;
                if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
            }
        });
    }

    // АКТИВИРАНЕ НА СЪБИТИЯ
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.onload = () => window.initNewGame();
