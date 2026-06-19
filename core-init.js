<!DOCTYPE html>
<html>
<head>
    <title>Велика България</title>
    <!-- Lazy loading for skills.js -->
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
</head>
<body>
    <!-- Загрузка всех основных скриптов -->
<script src="core-init.js"></script>
<script src="logic.js"></script>
<script src="gameState.js"></script>
<script src="database.js"></script>

    <!-- Инициализация на Core -->
<script>
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

            console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} героя`;

            if (typeof window.updateStrongestHeroUI === 'function') {
                window.updateStrongestHeroUI();
            }
        };
</script>

<!-- core-init.js -->
    <script>
    window.GameCore = {
        initialize: function() {
            window.gameState = {};
            window.config = {};
            return true;
        }
    };
    </script>

<!-- Основная функция инициализации с проверками -->
<script>
    window.startGameCore = function() {
        // Инициализация core
        window.GameCore.initialize();

        // Загрузка skills.js с обработкой ошибок
        window.loadSkills().then(() => {
            // Если skills.js загружен, запускаем логику
            if (window.startFreshGameLogic) {
                window.startFreshGameLogic();
            }
        });
    };
</script>

<!-- Инициализация на асинхронната загрузка на skills.js (не дублируем, оставил оригинальный) -->
<script>
    if (window.startGameCore) {
        window.startGameCore();
    }
</script>
</body>
</html>

