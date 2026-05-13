/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */

window.advanceTurn = function() {
    if (window.gameTime) {
        window.gameTime.seasonIndex++;
        if (window.gameTime.seasonIndex > 3) {
            window.gameTime.seasonIndex = 0;
            window.gameTime.year++;
            checkSuccession();
        }
        if (window.updateTimeUI) window.updateTimeUI();
    }

    if (window.currentHero) {
        // Икономика
        if (window.calculateEconomy) {
            window.calculateEconomy();
        }

        // Събития
        if (window.triggerRandomEvent) {
            window.triggerRandomEvent();
        }

        window.updateCharacterUI(window.currentHero);
    }
};

window.initNewGame = function() {
    const dynasties = Object.keys(window.bulgarianDynasties || {});
    const randomDynName = dynasties.length > 0 ? dynasties[Math.floor(Math.random() * dynasties.length)] : "Дуло";
    const randomRuler = window.bulgarianDynasties[randomDynName].rulers[0];

    window.currentHero = {
        name: randomRuler.name,
        dynasty: randomDynName,
        gold: 1000,
        armySize: 200,
        heroPower: 70
    };
    
    window.currentSpouse = null; // Нулиране на брак
    window.spouseRegions = [];
    window.playerRegions = ["Долна Мизия"];
    window.playerInventory = [];
    window.newArtifactsCount = 0;
    
    window.updateCharacterUI(window.currentHero);
};

window.toggleFullScreen = function() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
};

window.onload = () => window.initNewGame();
