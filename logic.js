/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
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

// Поправена функция за следващ ход (3 месеца на ход)
window.advanceTurn = function() {
    if (window.gameTime) {
        // Напредване на сезоните
        window.gameTime.seasonIndex++;
        if (window.gameTime.seasonIndex > 3) {
            window.gameTime.seasonIndex = 0;
            window.gameTime.year++; // Напредване на годината
        }
        
        // Обновяване на интерфейса за време
        if (typeof window.updateTimeUI === "function") {
            window.updateTimeUI();
        }
    }

    // Икономически приход за новия сезон
    if (window.currentHero) {
        const baseIncome = 50;
        const regionBonus = (window.playerRegions ? window.playerRegions.length : 1) * 10;
        const totalIncome = baseIncome + regionBonus;
        
        window.currentHero.gold += totalIncome;
        
        // Логване на събитието в хрониката
        if (typeof window.logEvent === "function") {
            window.logEvent(`Нов сезон. Приходи в хазната: +${totalIncome} злато.`, "economy");
        }
        
        // Обновяване на целия интерфейс
        window.updateCharacterUI(window.currentHero);
    }
};

window.initNewGame = function() {
    // Избор на династия и владетел без титлата "хан"
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynName];
    const randomRuler = dynastyData.rulers[Math.floor(Math.random() * dynastyData.rulers.length)];

    window.currentHero = new Character(randomRuler.name, randomDynName, "Владетел");
    window.currentSpouse = null;
    window.playerRegions = ["Северна Тракия"]; // Използване на родове вместо племена
    
    window.updateTimeUI();
    window.updateCharacterUI(window.currentHero);
    
    if (typeof window.logEvent === "function") {
        window.logEvent(`Кан ${window.currentHero.name} пое управлението на рода ${window.currentHero.dynasty}.`, "royal");
    }
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Грешка при превключване: ${err.message}`);
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
