// core-init.js
window.GameCore = window.GameCore || {};
window.GameHeroes = window.GameHeroes || {};

/**
 * Птолемеев герб
 */
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

// SVG Птолемеев герб за отображение в консоли (може да се добави в DOM или консоль)
const ptolemyLogo = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; margin-bottom: 10px;">
    <rect width="256" height="256" fill="#D4AF37" rx="16"/>
    <path d="M64,128 Q80,80 104,128 Q128,176 104,128 Q80,80 64,128" stroke="#1E90FF" stroke-width="4" fill="none"/>
    <path d="M80,100 L80,160 L100,140 L100,100 Z" stroke="#1E90FF" stroke-width="3"/>
    <path d="M104,128 L114,118 L114,138 L104,128 L94,138 L94,118 Z" stroke="#1E90FF" stroke-width="3"/>
    <text x="128" y="220" font-family="Arial" font-size="14" fill="#1E90FF" text-anchor="middle">ПТОЛЕМЕИ</text>
</svg>
`;

// Добавено изображение на герба в DOM
document.addEventListener('DOMContentLoaded', function() {
    const ptolemyIcon = document.createElement('img');
    ptolemyIcon.src = 'ptolemy_herb.svg';
    ptolemyIcon.alt = 'Герб династии Птолемеев';
    ptolemyIcon.className = 'hero-icon';
    document.body.insertBefore(ptolemyIcon, document.body.firstChild);
});

