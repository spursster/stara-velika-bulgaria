/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */

window.toggleFullScreen = function() {
    const elem = document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
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
        // Икономическа логика
        const totalReg = (window.playerRegions ? window.playerRegions.length : 0) + (window.spouseRegions ? window.spouseRegions.length : 0);
        const income = 50 + (totalReg * 15);
        window.currentHero.gold += income;
        
        // 1. ПРОВЕРКА ЗА СЛУЧАЙНО СЪБИТИЕ (Ново!)
        if (window.triggerRandomEvent) {
            window.triggerRandomEvent();
        }

        // 2. АВТОМАТИЧНО НАМИРАНЕ НА АРТЕФАКТИ (Рядко)
        if (Math.random() < 0.05 && window.acquireArtifact) {
            const artKeys = Object.keys(window.artifactsDatabase || {});
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
    // Вероятност за смяна на владетеля при края на годината
    if (Math.random() < 0.03) {
        if (window.logEvent) window.logEvent(`Кан ${window.currentHero.name} приключи земния си път. Вечна слава!`, "death");
        window.initNewGame();
    }
}

window.initNewGame = function() {
    // Вземане на данни от династиите
    const dynasties = Object.keys(window.bulgarianDynasties || { "Дуло": { rulers: [{name: "Авитохол"}] } });
    const randomDynName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynName];
    const randomRuler = dynastyData.rulers[Math.floor(Math.random() * dynastyData.rulers.length)];

    window.currentHero = {
        name: randomRuler.name,
        dynasty: randomDynName,
        gold: 800,
        armySize: 150,
        heroPower: 60,
        xp: 0
    };
    
    window.playerInventory = [];
    window.newArtifactsCount = 0;
    window.playerRegions = ["Долна Мизия"];
    window.spouseRegions = [];
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
};

// Старт на играта
window.onload = () => window.initNewGame();
