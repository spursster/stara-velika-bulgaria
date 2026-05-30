// core-init.js
window.GameCore = window.GameCore || {};

window.GameCore.initialize = function() {
    console.log("🚀 Стартиране на Core Initialization...");

    // 1. Гарантирано създаване на worldData
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    if (!window.worldData.heroes) window.worldData.heroes = {};

    // 2. Зареди clans ако липсват
    if (!window.bulgarianClans) {
        console.error("❌ bulgarianClans не е зареден!");
        return false;
    }

    // 3. Инициализирай героите **веднъж**
    if (typeof window.initializeAllHeroesFromDatabase === 'function') {
        window.initializeAllHeroesFromDatabase();
    } else if (typeof window.initializeAllHeroesInWorld === 'function') {
        window.initializeAllHeroesInWorld();
    }

    console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} героя`);
    return true;
};

// Главна точка за старт
window.startGameCore = function() {
    const success = window.GameCore.initialize();
    if (success && typeof window.startFreshGameLogic === 'function') {
        window.startFreshGameLogic();
    }
};
