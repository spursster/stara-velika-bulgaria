/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */

window.initNewGame = function() {
    const dynNames = Object.keys(window.bulgarianDynasties);
    const selectedDyn = dynNames[Math.floor(Math.random() * dynNames.length)];
    const rulers = window.bulgarianDynasties[selectedDyn].rulers;

    window.currentHero = {
        name: rulers[Math.floor(Math.random() * rulers.length)],
        dynasty: selectedDyn,
        gold: 1200,
        armySize: 250,
        heroPower: 80,
        xp: 0
    };

    window.gameTime = { year: 681, seasonIndex: 0 };
    window.playerRegions = ["Долна Мизия"];
    window.spouseRegions = [];
    window.playerInventory = [];
    window.currentSpouse = null;

    // Инициализация на отношенията между всички родове едновременно
    if (window.initDiplomacy) window.initDiplomacy();
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    
    window.logEvent(`Кан ${window.currentHero.name} от род ${selectedDyn} поема управлението!`, "royal");
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    // Напредък на времето
    window.gameTime.seasonIndex++;
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year++;
    }

    // Икономика: всяка територия носи доход
    const income = 100 + (window.playerRegions.length * 20);
    window.currentHero.gold += income;

    // Вероятност за събитие
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    window.updateCharacterUI(window.currentHero);
    window.updateTimeUI();
};

window.onload = () => window.initNewGame();
