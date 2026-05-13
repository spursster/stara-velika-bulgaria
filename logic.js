/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * Управлява ходовете, наследяването и системните функции.
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

// Глобални променливи за текущото състояние
window.currentHero = null;
window.currentSpouse = null;
window.playerRegions = [];
window.spouseRegions = []; // Региони на рода на съпругата

window.advanceTurn = function() {
    if (window.gameTime) {
        // Напредване на сезоните (всеки ход е 3 месеца)
        window.gameTime.seasonIndex++;
        if (window.gameTime.seasonIndex > 3) {
            window.gameTime.seasonIndex = 0;
            window.gameTime.year++;
            
            // Проверка за събития при смяна на годината (наследяване)
            checkSuccession();
        }
        window.updateTimeUI();
    }

    if (window.currentHero) {
        // Икономика: Базов приход + бонус от всички региони под контрол
        const totalControlledRegions = window.playerRegions.length + (window.spouseRegions ? window.spouseRegions.length : 0);
        const income = 50 + (totalControlledRegions * 10);
        window.currentHero.gold += income;
        
        window.logEvent(`Сезонна ревизия: +${income} злато в хазната.`, "economy");
        window.updateCharacterUI(window.currentHero);
    }
};

function checkSuccession() {
    // Шанс за естествена смърт на владетеля (напр. 2% годишно)
    if (Math.random() < 0.02) {
        window.logEvent(`Кан ${window.currentHero.name} напусна този свят. Земите се разпределят според волята на родовите старейшини.`, "death");
        window.initNewGame(); // Генерира нов владетел и преразпределя земите
    }
}

window.initNewGame = function() {
    // Избор на нова династия от базата данни
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynName];
    const randomRuler = dynastyData.rulers[Math.floor(Math.random() * dynastyData.rulers.length)];

    // Създаване на новия Кан
    window.currentHero = new Character(randomRuler.name, randomDynName, "Владетел");
    window.currentSpouse = null;
    window.playerRegions = ["Мизия"]; // Начален регион за новия Кан
    window.spouseRegions = [];
    
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

// Инициализация при зареждане
window.onload = () => {
    if (typeof window.initNewGame === "function") {
        window.initNewGame();
    }
};
