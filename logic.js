// Клас за персонаж
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

// Функция за инициализация на нова игра със случайна династия
window.initNewGame = function() {
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynastyName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynastyName];
    
    // Избиране на случаен владетел от избраната династия
    const allRulers = [...dynastyData.rulers, ...(dynastyData.branchRulers || [])];
    const randomRuler = allRulers[Math.floor(Math.random() * allRulers.length)];

    // Създаване на текущия герой (Кан)
    window.currentHero = new Character(
        randomRuler.name, 
        randomDynastyName, 
        "Владетел",
        randomRuler.years
    );
    
    // Празно състояние за съпруга до сключване на брак
    window.currentSpouse = null;
    
    // Начална провинция
    window.playerRegions = ["Северна Тракия"]; 
    
    // Обновяване на интерфейса
    window.updateCharacterUI(window.currentHero);
    console.log(`Старт: Кан ${randomRuler.name} от род ${randomDynastyName}`);
};

// При зареждане на страницата
window.onload = () => {
    window.initNewGame();
};
