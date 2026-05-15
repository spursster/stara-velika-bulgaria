/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: КОРИГИРАН (Старт: 480 пр.н.е.)
 */

window.initNewGame = function() {
    // 1. Данни за Кана
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60
    };

    // 2. Време и Сезони (пр.н.е. логика)
    window.gameTime = { 
        year: -480, 
        seasonIndex: 0, 
        seasons: ["Пролет", "Лято", "Есен", "Зима"],
        era: "АНТИЧНОСТ",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // Инициализация на рода в световните данни
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regionsOwned: 1 };
        });
    }

    console.log("Логика: Зареждане на играта от 480 пр.н.е.");
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

    // Определяне на Ерата спрямо годината
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

    // Икономически бонус
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100;
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

// Стартиране
window.onload = () => {
    window.initNewGame();
};
