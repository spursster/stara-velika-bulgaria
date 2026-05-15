/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: КОРИГИРАН (Старт: 1 г. пр.н.е.)
 */

window.initNewGame = function() {
    // 1. Инициализация на Кан
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60,
        techLevel: 1
    };

    // 2. ВРЕМЕ - Коригирано да започва от 1 г. пр.н.е.
    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "пр.н.е.",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // Инициализация на родове
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    console.log("Играта започна от 1 г.");
    
    // Първоначално обновяване с леко забавяне за синхронизация
    setTimeout(() => {
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.updateTimeUI) window.updateTimeUI();
    }, 200);
};

/**
 * ГЛАВЕН ЦИКЪЛ НА ХОДА
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето (вика функцията от time.js)
    if (window.processTime) {
        window.processTime();
    }
    
    window.gameTime.turn++;

    // 2. Икономика
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100; 
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    // 3. AI Конкуренция
    if (window.activeDynasties) {
        Object.keys(window.activeDynasties).forEach(dyn => {
            if (dyn !== window.currentHero.dynasty) {
                window.activeDynasties[dyn].gold += 50;
                if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
            }
        });
    }

    // 4. Случайни събития
    if (window.triggerRandomEvent) {
        window.triggerRandomEvent();
    }

    // 5. Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.onload = () => {
    window.initNewGame();
};
