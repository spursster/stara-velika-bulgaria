/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (Интеграция с events.js и time.js)
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

    // 2. ВРЕМЕ - Стриктно от 480 пр.н.е.
    window.gameTime = { 
        year: 480, 
        seasonIndex: 0, 
        era: "пр.н.е.",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // Инициализация на 13-те рода
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    console.log("Играта започна от 480 пр.н.е.");
    
    // Първоначално обновяване на всички модули
    setTimeout(() => {
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.updateTimeUI) window.updateTimeUI();
    }, 100);
};

/**
 * ГЛАВЕН ЦИКЪЛ НА ХОДА
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето (от time.js)
    if (window.processTime) {
        window.processTime();
    }
    
    window.gameTime.turn++;

    // 2. Икономика (Сезонен приход)
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

    // 4. СЛУЧАЙНИ СЪБИТИЯ (Интеграция с events.js)
    if (window.triggerRandomEvent) {
        window.triggerRandomEvent();
    }

    // 5. Опресняване на интерфейса
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};

// Стартиране на логиката при пълно зареждане на прозореца
window.onload = () => {
    window.initNewGame();
};
