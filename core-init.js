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

window.startGameCore = function() {
    console.log("🚀 Стартиране на Core Initialization...");

    if (!window.worldData) window.worldData = { clans: {}, heroes: {} };
    window.initializeAllHeroesInWorld();
}
*/

// === НОВАТА ВЕРСИЯ (сложи това вместо горното) ===
window.GameHeroes.initializeAll();

    console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} героя`);
    return true;
};

window.startGameCore = function() {
    console.log("🚀 Стартиране на Core Initialization...");

    if (!window.worldData) window.worldData = { clans: {}, heroes: {} };

    window.GameHeroes.initializeAll();     // ← новата система

    if (typeof window.startFreshGameLogic === 'function') {
        window.startFreshGameLogic();
    }
};

// === HERO PORTRAIT & INITIALIZATION SYSTEM ===
window.GameHeroes = window.GameHeroes || {};

window.GameHeroes.generatePortrait = function(heroName, heroClass) {
    return new Promise((resolve) => {
        const seed = heroName + heroClass + Date.now();
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
            `medieval bulgarian ${heroClass} warrior, ${heroName}, realistic portrait, detailed face, historical bulgarian style`
        )}?seed=${seed}&width=256&height=256`;

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => resolve(url);
        img.onerror = () => {
            console.warn(`⚠️ Портретът за ${heroName} не се зареди. Използвам fallback.`);
            resolve("https://via.placeholder.com/256x256/8B4513/FFFFFF?text=" + heroName.substring(0,2));
        };

        img.src = url;
    });
};

// Основна функция за инициализация на един герой
window.GameHeroes.initializeHero = function(heroData) {
    if (!heroData.id) heroData.id = heroData.name.toLowerCase().replace(/\s+/g, '_');

    // Portrait
    if (!heroData.portrait || heroData.portrait.includes("placeholder")) {
        window.GameHeroes.generatePortrait(heroData.name, heroData.class || "warrior")
            .then(url => {
                heroData.portrait = url;
                if (typeof window.refreshAllHeroUI === 'function') {
                    window.refreshAllHeroUI();
                }
            });
    }

    return heroData;
};

// Инициализация на всички герои (извиква се само веднъж)
window.GameHeroes.initializeAll = function() {
    if (!window.worldData || !window.bulgarianClans) return;

    console.log("🛡️ Инициализирам всички герои...");

    Object.keys(window.bulgarianClans).forEach(clanKey => {
        const clan = window.bulgarianClans[clanKey];
        if (!window.worldData.clans[clanKey]) {
            window.worldData.clans[clanKey] = { ...clan, heroes: {} };
        }

        clan.heroes.forEach(hero => {
            const heroId = hero.name.toLowerCase().replace(/\s+/g, '_');
            if (!window.worldData.heroes[heroId]) {
                window.worldData.heroes[heroId] = window.GameHeroes.initializeHero({...hero});
            }
        });
    });

    console.log(`✅ Инициализирани ${Object.keys(window.worldData.heroes).length} героя`);
};
