// core-init.js
window.GameCore = window.GameCore || {};
window.GameCore.initialize = function() {
    console.log("🚀 Стартиране на Core Initialization...");

    if (!window.worldData) window.worldData = { clans: {}, heroes: {} };
    if (!window.worldData.clans) window.worldData.clans = {};
    if (!window.worldData.heroes) window.worldData.heroes = {};
    window.gameState = {};
    window.config = {};

    if (window.GameHeroes && typeof window.GameHeroes.initializeAll === 'function') {
        window.GameHeroes.initializeAll();
    } else {
        console.warn("⚠️ GameHeroes не е дефиниран. Пропускам инициализация на героите.");
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

<!-- Убедитесь, что скрипти загружават се в правилен редок -->
<script src="core-init.js"></script>
<script src="logic.js"></script>
<script src="gameState.js"></script>
<script src="database.js"></script>

<!-- Инициализация на асинхронната загрузка на skills.js -->
<script>
    window.loadSkills = function() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'skills.js';
            script.onload = () => {
                console.log("✅ skills.js загружен");
                resolve();
            };
            script.onerror = () => reject(new Error("skills.js не загрузился"));
            document.head.appendChild(script);
        });
    };
</script>

<!-- Инициализация игре -->
<script>
    window.startGameCore();
</script>

