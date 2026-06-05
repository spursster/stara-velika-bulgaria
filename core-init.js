// core-init.js
window.GameCore = window.GameCore || {};
window.GameHeroes = window.GameHeroes || {};

window.GameCore.initialize = function() {
    console.log("🚀 Стартиране на Core Initialization...");

    if (!window.worldData) window.worldData = { clans: {}, heroes: {} };
    if (!window.worldData.clans) window.worldData.clans = {};
    if (!window.worldData.heroes) window.worldData.heroes = {};

    // Инициализация на героите
    if (typeof window.GameHeroes.initializeAll === 'function') {
        window.GameHeroes.initializeAll();
    }

    console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} героя`);
    
    // След инициализация показваме най-силния герой в левия панел
    if (typeof window.updateStrongestHeroUI === 'function') {
        window.updateStrongestHeroUI();
    }
    
    return true;
};

window.startGameCore = function() {
    console.log("🚀 Стартиране на Core Initialization...");
    const success = window.GameCore.initialize();
    
    if (success && typeof window.startFreshGameLogic === 'function') {
        window.startFreshGameLogic();
    }
};
// ==================== ОПРАВЯНЕ НА TURN PROCESS ЗА ТУРНИРА ====================
if (typeof window.processTurn !== 'function') {
    console.warn("⚠️ processTurn не е дефиниран, създавам основна версия");
    window.processTurn = function() {
        console.log("🔄 Ход (основен)");
        if (window.gameTime) {
            window.gameTime.seasonIndex++;
            if (window.gameTime.seasonIndex > 3) {
                window.gameTime.seasonIndex = 0;
                if (window.gameTime.era === "пр.н.е." && window.gameTime.year > 0) {
                    window.gameTime.year--;
                    if (window.gameTime.year === 0) {
                        window.gameTime.year = 1;
                        window.gameTime.era = "от н.е.";
                    }
                } else {
                    window.gameTime.year++;
                }
            }
            if (typeof window.updateTimeUI === 'function') window.updateTimeUI();
        }
        if (typeof window.calculateEconomy === 'function') window.calculateEconomy();
        if (typeof window.autonomousRegionConquest === 'function') window.autonomousRegionConquest();
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
    };
}

// Опаковаме съществуващия processTurn, за да добавим турнирната логика
const originalProcessTurn = window.processTurn;
window.processTurn = function() {
    // Извикваме оригиналната логика
    originalProcessTurn();
    
    // Добавяме турнирна логика
    if (window.tournament) {
        if (window.tournament.isActive()) {
            window.tournament.advance();
        } else {
            window.tournament.checkAutoStart();
        }
    }
};
console.log("✅ processTurn обновен – турнирът ще напредва всеки ход");
