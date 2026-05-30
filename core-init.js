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
    return true;
};

window.startGameCore = function() {
    console.log("🚀 Стартиране на Core Initialization...");
    const success = window.GameCore.initialize();
    
    if (success && typeof window.startFreshGameLogic === 'function') {
        window.startFreshGameLogic();
    }
};
