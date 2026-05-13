/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */

window.toggleFullScreen = function() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) { elem.requestFullscreen(); }
        else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
        else if (elem.mozRequestFullScreen) { elem.mozRequestFullScreen(); }
        else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT); }
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    }
};

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
        const totalRegions = window.playerRegions.length + (window.spouseRegions ? window.spouseRegions.length : 0);
        const income = 50 + (totalRegions * 10);
        window.currentHero.gold += income;
        
        if (Math.random() < 0.10 && typeof window.acquireArtifact === "function") {
            const artKeys = Object.keys(window.artifactsDatabase);
            const randomArt = artKeys[Math.floor(Math.random() * artKeys.length)];
            if (!window.playerInventory.find(i => i.id === randomArt)) {
                window.newArtifactsCount++;
                window.acquireArtifact(randomArt);
            }
        }
        window.updateCharacterUI(window.currentHero);
    }
};

function checkSuccession() {
    if (Math.random() < 0.02) {
        if (window.logEvent) window.logEvent(`Кан ${window.currentHero.name} се пресели в отвъдното.`, "death");
        window.initNewGame();
    }
}

window.initNewGame = function() {
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynName];
    const randomRuler = dynastyData.rulers[Math.floor(Math.random() * dynastyData.rulers.length)];

    window.currentHero = {
        name: randomRuler.name,
        dynasty: randomDynName,
        gold: 750,
        armySize: 100,
        heroPower: 50,
        xp: 0
    };
    
    window.playerInventory = [];
    window.newArtifactsCount = 0;
    window.playerRegions = ["Долна Мизия"];
    window.spouseRegions = [];
    
    window.updateCharacterUI(window.currentHero);
};

window.onload = () => window.initNewGame();
