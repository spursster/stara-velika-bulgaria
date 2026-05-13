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
        window.updateTimeUI();
    }

    if (window.currentHero) {
        const totalControlledRegions = window.playerRegions.length + (window.spouseRegions ? window.spouseRegions.length : 0);
        const income = 50 + (totalControlledRegions * 10);
        window.currentHero.gold += income;
        
        // 5% шанс за намиране на случаен артефакт при всеки ход
        if (Math.random() < 0.05 && typeof window.acquireArtifact === "function") {
            const artKeys = Object.keys(window.artifactsDatabase);
            const randomArt = artKeys[Math.floor(Math.random() * artKeys.length)];
            window.acquireArtifact(randomArt);
        }

        window.updateCharacterUI(window.currentHero);
    }
};

function checkSuccession() {
    if (Math.random() < 0.02) {
        window.logEvent(`Кан ${window.currentHero.name} приключи своя земен път.`, "death");
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
    
    window.currentSpouse = null;
    window.playerRegions = ["Мизия"];
    window.spouseRegions = [];
    window.playerInventory = []; // Нулиране на инвентара при нова игра
    
    if (window.updateTimeUI) window.updateTimeUI();
    window.updateCharacterUI(window.currentHero);
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
};

window.onload = () => window.initNewGame();
