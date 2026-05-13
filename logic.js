/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    window.currentHero = {
        name: "Аспарух",
        dynasty: "Дуло",
        gold: 1500,
        armySize: 300,
        heroPower: 100
    };

    window.gameTime = { year: 681, seasonIndex: 0 };
    window.playerRegions = ["Долна Мизия"];
    window.currentSpouse = null;
    window.playerInventory = [];

    // Първо зареждаме данните, после UI
    if (window.initDiplomacy) window.initDiplomacy();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    
    window.logEvent(`Кан ${window.currentHero.name} започна своето управление!`, "royal");
};

window.onload = () => window.initNewGame();
