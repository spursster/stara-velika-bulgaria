// core-init.js
window.GameCore = window.GameCore || {};
window.GameHeroes = window.GameHeroes || {};

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
    
    if (success) {
        window.loadSkills().then(() => {
            if (typeof window.startFreshGameLogic === 'function') {
        window.startFreshGameLogic();
    }
        });
    }
};

// Lazy loading for skills.js
<script>
    (function() {
        let skillsLoaded = false, skillsLoading = null;
        window.loadSkills = function() {
            if (skillsLoaded) return Promise.resolve();
            if (skillsLoading) return skillsLoading;
            skillsLoading = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'skills.js';
                script.onload = () => {
                    skillsLoaded = true;
                    console.log("✅ skills.js зареден");
                    resolve();
                };
                script.onerror = () => reject(new Error("Грешка при зареждане на skills.js"));
                document.head.appendChild(script);
            });
            return skillsLoading;
        };
        // Proxy functions to handle async loading
        const originalOpenSkillsUI = window.openSkillsUI;
        if (originalOpenSkillsUI) window.openSkillsUI = async (...args) => {
            await window.loadSkills();
            return originalOpenSkillsUI(...args);
        };
    })();
</script>

