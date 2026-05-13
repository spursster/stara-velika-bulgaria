/**
 * МОДУЛ: ГЛАВНА ЛОГИКА
 * Инициализира играта със случаен старт и управлява обекта на героя.
 */

class Character {
    constructor(name, dynasty, role, years = "") {
        this.name = name;
        this.dynasty = dynasty;
        this.role = role;
        this.years = years;
        this.level = 1;
        this.xp = 0;
        this.gold = 750;
        this.armySize = 100;
        this.heroPower = 50;
    }
}

window.initNewGame = function() {
    // 1. Избор на случайна династия от базата данни
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynastyName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynastyName];
    
    // 2. Избор на случаен владетел (Кан) от рода
    const allRulers = [...dynastyData.rulers, ...(dynastyData.branchRulers || [])];
    const randomRuler = allRulers[Math.floor(Math.random() * allRulers.length)];

    window.currentHero = new Character(
        randomRuler.name, 
        randomDynastyName, 
        "Владетел",
        randomRuler.years
    );
    
    window.currentSpouse = null;
    window.playerRegions = ["Северна Тракия"]; 
    
    // 3. Начално установяване на времето и езика
    window.gameLang = "BG";
    window.updateTimeUI();
    window.updateCharacterUI(window.currentHero);
    
    window.logEvent(`Начало на управлението на Кан ${window.currentHero.name} от род ${window.currentHero.dynasty}.`, "royal");
};

window.onload = () => {
    window.initNewGame();
};
