/**
 * МОДУЛ: ГЛАВНА ЛОГИКА
 * Инициализира играта и управлява системните функции.
 */

class Character {
    constructor(name, dynasty, role) {
        this.name = name;
        this.dynasty = dynasty;
        this.role = role;
        this.gold = 750;
        this.armySize = 100;
        this.heroPower = 50;
        this.xp = 0;
    }
}

window.initNewGame = function() {
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynName];
    const randomRuler = dynastyData.rulers[Math.floor(Math.random() * dynastyData.rulers.length)];

    window.currentHero = new Character(randomRuler.name, randomDynName, "Владетел");
    window.currentSpouse = null;
    window.playerRegions = ["Северна Тракия"];
    window.gameLang = "BG";

    window.updateTimeUI();
    window.updateCharacterUI(window.currentHero);
    window.logEvent(`Начало на управлението на Кан ${window.currentHero.name} от род ${window.currentHero.dynasty}.`, "royal");
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Грешка: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

window.onload = () => {
    window.initNewGame();
};
