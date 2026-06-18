// core-init.js
window.GameCore = window.GameCore || {};
window.GameHeroes = window.GameHeroes || {};

// В core-init.js, във функцията window.GameCore.initialize
window.GameCore.initialize = function() {
    console.log("🚀 Стартиране на Core Initialization...");

    if (!window.worldData) window.worldData = { clans: {}, heroes: {} };
    if (!window.worldData.clans) window.worldData.clans = {};
    if (!window.worldData.heroes) window.worldData.heroes = {};
    if (window.GameHeroes && typeof window.GameHeroes.initializeAll === 'function') {
        window.GameHeroes.initializeAll();
    } else {
        console.warn("⚠️ GameHeroes не е дефиниран. Пропускам инициализация на героите.");
        // Ако имаш нужда да създадеш героите по друг начин, направи го тук
        if (typeof window.initializeAllHeroesInWorld === 'function') {
            window.initializeAllHeroesInWorld();
        }
    }

    console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} героя`);
    
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

