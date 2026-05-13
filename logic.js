/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България (Икономическа версия)
 */

window.advanceTurn = function() {
    if (window.gameTime) {
        window.gameTime.seasonIndex++;
        if (window.gameTime.seasonIndex > 3) {
            window.gameTime.seasonIndex = 0;
            window.gameTime.year++;
            checkSuccession(); // Проверка за наследяване
        }
        if (window.updateTimeUI) window.updateTimeUI();
    }

    if (window.currentHero) {
        // Използваме новия икономически модул
        const econ = window.calculateEconomy();
        
        if (window.logEvent) {
            window.logEvent(`Сезонен отчет: Приход +${econ.income} 💰, Издръжка -${econ.expenses} 💰.`, "action");
        }

        // Проверка за случайни събития
        if (window.triggerRandomEvent) {
            window.triggerRandomEvent();
        }

        window.updateCharacterUI(window.currentHero);
    }
};

function checkSuccession() {
    // Вероятност за смяна на владетеля при края на годината (според историческите династии)
    if (Math.random() < 0.03) {
        if (window.logEvent) window.logEvent(`Кан ${window.currentHero.name} предаде властта на наследника си.`, "death");
        window.initNewGame();
    }
}

window.initNewGame = function() {
    const dynasties = Object.keys(window.bulgarianDynasties || {});
    const randomDynName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynName];
    const randomRuler = dynastyData.rulers[Math.floor(Math.random() * dynastyData.rulers.length)];

    window.currentHero = {
        name: randomRuler.name,
        dynasty: randomDynName,
        gold: 1000,
        armySize: 200,
        heroPower: 70,
        xp: 0
    };
    
    window.playerInventory = [];
    window.playerRegions = ["Долна Мизия"]; // Начален регион
    window.spouseRegions = [];
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.onload = () => window.initNewGame();
