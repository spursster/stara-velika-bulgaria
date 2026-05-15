/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ФИКСИРАН (Старт: 480 пр.н.е.)
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
        year: -480, 
        seasonIndex: 0, 
        seasons: ["Пролет", "Лято", "Есен", "Зима"],
        era: "АНТИЧНОСТ",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // Инициализация на 13-те рода
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regionsOwned: 1 };
        });
    }

    console.log("Логика: Играта стартира от 480 пр.н.е.");
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.processTime = function() {
    if (!window.gameTime) return;

    window.gameTime.seasonIndex++;
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year++; 
        if (window.currentHero) window.currentHero.age++;
    }

    // Определяне на Ерата
    let yr = window.gameTime.year;
    if (yr > 2100) window.gameTime.era = "КОСМИЧЕСКА ЕРА";
    else if (yr > 1900) window.gameTime.era = "ИНДУСТРИАЛНА ЕРА";
    else if (yr > 632) window.gameTime.era = "СРЕДНОВЕКОВИЕ";
    else window.gameTime.era = "АНТИЧНОСТ";
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    window.processTime();
    window.gameTime.turn++;

    // Икономика
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100;
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

// Изпълнение при зареждане
window.onload = () => window.initNewGame();
