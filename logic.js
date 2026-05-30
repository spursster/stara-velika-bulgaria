/**
 ========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (ВЕРСИЯ 5.1 – КЪСИ РЕДОВЕ, УНИКАЛНИ ID)
 ========================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏛️ DOM готов...");

    setTimeout(() => {
        const loaded = window.GameSave.load();
        
        if (!loaded) {
            window.startGameCore();   // новата функция от предишния бъг
        } else {
            // Ако е заредено успешно - обнови UI
            if (typeof window.updateAllUI === 'function') {
                window.updateAllUI();
            }
        }

        // Стартирай авто-save
        window.GameSave.startAutoSave();
    }, 150);
});

// ========== ФУНКЦИЯ ЗА СЛУЧАЕН ГЕРОЙ ОТ DATABASE ==========
function getRandomHeroFromDatabase() {
    if (typeof initializeAllHeroesFromDatabase === 'function') {
        initializeAllHeroesFromDatabase();
    }

    if (!window.worldData || !window.worldData.clans ||
        Object.keys(window.worldData.clans).length === 0) {
        console.warn("⚠️ worldData.clans е празен, инициализирам...");
        if (window.bulgarianClans) {
            for (let clanName in window.bulgarianClans) {
                let heroesList = window.bulgarianClans[clanName].heroes;
                if (!heroesList) continue;
                for (let heroName of heroesList) {
                    const heroId = "hero_" + clanName + "_" +
                        heroName.replace(/\s/g, '_');
                    if (window.worldData.clans[heroId]) continue;
                    let power = 100, gold = 1000, armySize = 200;
                    let className = "Воевода";
                    if (["Александър III Велики", "Симеон Велики",
                         "Кубрат", "Влад III Дракула"].includes(heroName)) {
                        power = 180; gold = 2000; armySize = 400;
                        className = "Легенда";
                    } else if (["Атила", "Филип II", "Самуил",
                                "Птолемей I Сотер"].includes(heroName)) {
                        power = 150; gold = 1500; armySize = 300;
                        className = "Герой";
                    }
                    const hero = {
                        id: heroId,
                        name: heroName,
                        clan: clanName,
                        isJoined: false,
                        isFavorite: false,
                        level: 1,
                        xp: 0,
                        heroPower: power,
                        power: power,
                        gold: gold,
                        armySize: armySize,
                        currentArmy: armySize,
                        currentClass: className,
                        className: className,
                        age: 30,
                        isAuto: true,
                        skillPoints: 0,
                        skills: {
                            tactics: 0, endurance: 0, economy: 0,
                            mysticism: 0, leadership: 0
                        },
                        equipment: Array(12).fill(null),
                        inventory: [],
                        pet: null,
                        armyDetails: {
                            infantry: Math.floor(armySize * 0.5),
                            archers: Math.floor(armySize * 0.25),
                            cavalry: Math.floor(armySize * 0.15),
                            elite: Math.floor(armySize * 0.1)
                        }
                    };
                    if (window.initializeHeroRPGData) {
                        window.initializeHeroRPGData(hero);
                    }
                    if (window.ensureCompleteArmyDetails) {
                        window.ensureCompleteArmyDetails(hero);
                    }
                    window.worldData.clans[heroId] = hero;
                }
            }
        }
    }

    let availableHeroes = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero && hero.isJoined !== true) {
            availableHeroes.push({
                id: key,
                name: hero.name,
                clan: hero.clan,
                power: hero.heroPower,
                gold: hero.gold,
                armySize: hero.armySize
            });
        }
    }

    if (availableHeroes.length === 0) {
        console.warn("⚠️ Няма свободни герои, взимам всички...");
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero) {
                availableHeroes.push({
                    id: key,
                    name: hero.name,
                    clan: hero.clan,
                    power: hero.heroPower,
                    gold: hero.gold,
                    armySize: hero.armySize
                });
            }
        }
    }

    if (availableHeroes.length === 0) {
        console.error("❌ Няма никакви герои! Връщам резервен Кубрат.");
        return {
            id: "hero_Dulo_Kubrat",
            name: "Кубрат",
            clan: "Дуло",
            power: 180,
            gold: 2000,
            armySize: 400
        };
    }

    const randomIndex = Math.floor(Math.random() * availableHeroes.length);
    const selected = availableHeroes[randomIndex];
    console.log("🎲 Избран случаен герой: " + selected.name +
                " (" + selected.clan + ")");
    return selected;
}

// === SAFE SAVE / LOAD SYSTEM ===
window.GameSave = window.GameSave || {};

window.GameSave.save = function() {
    try {
        const saveData = {
            version: "1.0.1",                    // увеличавай при големи промени
            timestamp: Date.now(),
            worldData: window.worldData,
            currentTurn: window.currentTurn || 1,
            // добави други важни глобални променливи ако имаш
        };

        localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
        console.log("💾 Играта е запазена успешно");
        return true;
    } catch (e) {
        console.error("❌ Грешка при запис:", e);
        return false;
    }
};

window.GameSave.load = function() {
    try {
        const saved = localStorage.getItem('GreatBulgaria_SaveGame');
        if (!saved) return false;

        const data = JSON.parse(saved);

        // Миграция при нова версия
        if (data.version && data.version !== "1.0.1") {
            console.warn("🔄 Стара версия на save-а. Прилагам миграция...");
        }

        if (data.worldData) {
            window.worldData = data.worldData;
        }

        if (data.currentTurn) window.currentTurn = data.currentTurn;

        console.log("✅ Играта е заредена успешно (версия " + (data.version || "неизвестна") + ")");
        return true;
    } catch (e) {
        console.error("💥 Save файлът е повреден!", e);
        alert("Save файлът е повреден. Ще започнеш нова игра.");
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

// Автоматичен save на всеки 30 секунди + при важни действия
window.GameSave.startAutoSave = function() {
    setInterval(() => {
        window.GameSave.save();
    }, 30000);
};

// ========== ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ ГЕРОИ ==========
function initializeAllHeroesFromDatabase() {
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    const clans = window.bulgarianClans;
    if (!clans) return;
    for (let clanName in clans) {
        const heroesList = clans[clanName].heroes;
        if (!heroesList) continue;
        for (let heroName of heroesList) {
            const heroId = "hero_" + clanName + "_" +
                heroName.replace(/\s/g, '_');
            if (window.worldData.clans[heroId]) continue;
            let power = 100, gold = 1000, armySize = 200;
            let className = "Воевода";
            if (["Александър III Велики", "Симеон Велики",
                 "Кубрат", "Влад III Дракула"].includes(heroName)) {
                power = 180; gold = 2000; armySize = 400;
                className = "Легенда";
            } else if (["Атила", "Филип II", "Самуил",
                        "Птолемей I Сотер"].includes(heroName)) {
                power = 150; gold = 1500; armySize = 300;
                className = "Герой";
            }
            const hero = {
                id: heroId,
                name: heroName,
                clan: clanName,
                isJoined: false,
                isFavorite: false,
                level: 1,
                xp: 0,
                heroPower: power,
                power: power,
                gold: gold,
                armySize: armySize,
                currentArmy: armySize,
                currentClass: className,
                className: className,
                age: 30 + Math.floor(Math.random() * 31),
                isAuto: true,
                skillPoints: 0,
                skills: {
                    tactics: 0, endurance: 0, economy: 0,
                    mysticism: 0, leadership: 0
                },
                equipment: Array(12).fill(null),
                inventory: [],
                pet: null,
                armyDetails: {
                    infantry: Math.floor(armySize * 0.5),
                    archers: Math.floor(armySize * 0.25),
                    cavalry: Math.floor(armySize * 0.15),
                    elite: Math.floor(armySize * 0.1)
                }
            };
            if (window.initializeHeroRPGData) {
                window.initializeHeroRPGData(hero);
            }
            if (window.ensureCompleteArmyDetails) {
                window.ensureCompleteArmyDetails(hero);
            }
            window.worldData.clans[heroId] = hero;
        }
    }
    console.log("✅ Инициализирани " +
                Object.keys(window.worldData.clans).length +
                " герои от database.js");
}

// ========== НОВА ИГРА ==========
window.startFreshGameLogic = function() {
    console.log("🔄 startFreshGameLogic извикана");

    if (!window.worldData) window.worldData = {};
    window.worldData.clans = {};

    if (typeof initializeAllHeroesFromDatabase === 'function') {
        initializeAllHeroesFromDatabase();
    } else {
        console.warn("initializeAllHeroesFromDatabase липсва");
        if (window.bulgarianClans) {
            for (let clanName in window.bulgarianClans) {
                let heroesList = window.bulgarianClans[clanName].heroes;
                if (!heroesList) continue;
                for (let heroName of heroesList) {
                    const heroId = "hero_" + clanName + "_" +
                        heroName.replace(/\s/g, '_');
                    if (window.worldData.clans[heroId]) continue;
                    let power = 100, gold = 1000, armySize = 200;
                    let className = "Воевода";
                    if (["Александър III Велики", "Симеон Велики",
                         "Кубрат", "Влад III Дракула"].includes(heroName)) {
                        power = 180; gold = 2000; armySize = 400;
                        className = "Легенда";
                    } else if (["Атила", "Филип II", "Самуил",
                                "Птолемей I Сотер"].includes(heroName)) {
                        power = 150; gold = 1500; armySize = 300;
                        className = "Герой";
                    }
                    const hero = {
                        id: heroId,
                        name: heroName,
                        clan: clanName,
                        isJoined: false,
                        isFavorite: false,
                        level: 1,
                        xp: 0,
                        heroPower: power,
                        power: power,
                        gold: gold,
                        armySize: armySize,
                        currentArmy: armySize,
                        currentClass: className,
                        className: className,
                        age: 30,
                        isAuto: true,
                        skillPoints: 0,
                        skills: {
                            tactics: 0, endurance: 0, economy: 0,
                            mysticism: 0, leadership: 0
                        },
                        equipment: Array(12).fill(null),
                        inventory: [],
                        pet: null,
                        armyDetails: {
                            infantry: Math.floor(armySize * 0.5),
                            archers: Math.floor(armySize * 0.25),
                            cavalry: Math.floor(armySize * 0.15),
                            elite: Math.floor(armySize * 0.1)
                        }
                    };
                    if (window.initializeHeroRPGData) {
                        window.initializeHeroRPGData(hero);
                    }
                    if (window.ensureCompleteArmyDetails) {
                        window.ensureCompleteArmyDetails(hero);
                    }
                    window.worldData.clans[heroId] = hero;
                }
            }
        }
    }

    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero) {
            hero.isJoined = false;
            hero.isFavorite = false;
        }
    }

    let heroData = getRandomHeroFromDatabase();
    let selectedId = heroData.id;
    let selectedName = heroData.name;
    let selectedClan = heroData.clan;
    console.log("🎲 Избран герой: " + selectedName +
                " (ID: " + selectedId + ") от род " + selectedClan);

    let existingHero = null;
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.id === selectedId ||
            (h.name === selectedName && h.clan === selectedClan)) {
            existingHero = h;
            break;
        }
    }

    function setHeroHP(hero) {
        if (!hero) return;
        let endurance = (hero.skills && hero.skills.endurance) || 0;
        hero.maxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
        hero.hp = hero.maxHp;
        hero.isAlive = true;
        console.log("💚 Зададен HP за " + hero.name + ": " +
                    hero.hp + "/" + hero.maxHp);
    }

    if (existingHero) {
        existingHero.isJoined = true;
        existingHero.isFavorite = true;
        existingHero.gold = heroData.gold;
        existingHero.armySize = heroData.armySize;
        existingHero.currentArmy = heroData.armySize;
        existingHero.heroPower = heroData.power;
        existingHero.power = heroData.power;
        window.currentHero = existingHero;
        setHeroHP(window.currentHero);
    } else {
        window.currentHero = {
            id: selectedId,
            name: selectedName,
            clan: selectedClan,
            gold: heroData.gold,
            armySize: heroData.armySize,
            currentArmy: heroData.armySize,
            heroPower: heroData.power,
            power: heroData.power,
            age: 30 + Math.floor(Math.random() * 31),
            techLevel: 1,
            level: 1,
            xp: 0,
            storedXP: 0,
            isAuto: true,
            skillPoints: 0,
            equipment: Array(12).fill(null),
            skills: {
                tactics: 0, endurance: 0, economy: 0,
                mysticism: 0, leadership: 0
            },
            inventory: [],
            isFavorite: true,
            isJoined: true,
            portrait: null,
            armyDetails: {
                infantry: Math.floor(heroData.armySize * 0.5),
                archers: Math.floor(heroData.armySize * 0.25),
                cavalry: Math.floor(heroData.armySize * 0.15),
                elite: Math.floor(heroData.armySize * 0.1)
            }
        };
        setHeroHP(window.currentHero);
        if (window.ensureCompleteArmyDetails) {
            window.ensureCompleteArmyDetails(window.currentHero);
        }
        window.worldData.clans[selectedId] = window.currentHero;
    }

    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(window.currentHero)
            .catch(e => console.warn(e));
    }

    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero !== window.currentHero) {
            hero.isJoined = false;
            hero.isFavorite = false;
        }
    }

    window.unlockedHeroes = [window.currentHero];
    if (window.gameMode === 'solo') {
        localStorage.setItem('barracksFavorites',
            JSON.stringify([window.currentHero.name]));
    } else {
        localStorage.setItem('barracksFavorites', JSON.stringify([]));
    }
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');

    if (window.gameMode === 'classic' && window._originalHireNewHero) {
        window.hireNewHero = window._originalHireNewHero;
    }
    if (window.gameMode === 'solo' && typeof initSoloMode === 'function') {
        initSoloMode();
    } else {
        window.companions = [];
        window.activeQuests = [];
        window.completedQuests = [];
    }

    window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };

    if (typeof window.generateProceduralRegions === 'function') {
        window.generateProceduralRegions(30, true);
    } else {
        console.warn("generateProceduralRegions не е дефинирана");
    }

    if (typeof window.buildRegionConnections === 'function') {
        window.buildRegionConnections();
    }

    window.playerRegions = ["Плиска"];
    window.currentRegion = "Плиска";

    if (!window.gameMode) window.gameMode = 'classic';

    if (window.gameMode === 'solo') {
        console.log("🌍 Старт в СОЛО РЕЖИМ: " + window.currentHero.name);
        if (typeof window.showAdvisorMsg === 'function') {
            window.showAdvisorMsg("🌍 Добре дошли, " +
                window.currentHero.name + " от рода " +
                window.currentHero.clan + "!");
        }
        if (typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        }
    } else {
        console.log("🏰 Старт в КЛАСИЧЕСКИ РЕЖИМ: " +
                    window.currentHero.name);
        if (typeof window.showAdvisorMsg === 'function') {
            window.showAdvisorMsg("🏰 Вие сте " +
                window.currentHero.name + " от могъщия род " +
                window.currentHero.clan + ".");
        }
    }

    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    if (typeof window.renderSingleBar === 'function') {
        window.renderSingleBar();
    }
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    if (typeof window.saveGreatBulgariaGame === 'function') {
        window.saveGreatBulgariaGame();
    }

    console.log("✅ startFreshGameLogic завърши. Активен герой: " +
                window.currentHero.name);
};

// ========== ЗАПАЗВАНЕ ==========
window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    try {
        let allHeroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let hero = window.worldData.clans[key];
                if (hero.isJoined === true || hero.isFavorite === true) {
                    let heroCopy = { ...hero };
                    if (hero.portrait) heroCopy.portrait = hero.portrait;
                    allHeroes.push(heroCopy);
                }
            }
        }
        let companionsCopy = [];
        if (window.companions && window.companions.length) {
            companionsCopy = window.companions.map(c => ({
                ...c,
                portrait: c.portrait
            }));
        }
        const saveData = {
            currentHero: window.currentHero,
            unlockedHeroes: allHeroes,
            gameTime: window.gameTime || {
                seasonIndex: 0, year: 480, era: "пр.н.е."
            },
            favoriteHeroes: localStorage.getItem('favoriteHeroesFinal'),
            autoState: localStorage.getItem('heroAutoState'),
            gameMode: window.gameMode,
            currentRegion: window.currentRegion,
            companions: companionsCopy,
            activeQuests: window.activeQuests,
            completedQuests: window.completedQuests,
            playerRegions: window.playerRegions
        };
        localStorage.setItem('GreatBulgaria_SaveGame',
            JSON.stringify(saveData));
        console.log("💾 Прогресът запазен (вкл. портрети).");
    } catch (e) {
        console.error(e);
    }
};

// ========== ЗАРЕЖДАНЕ ==========
window.loadGreatBulgariaGame = function() {
    const saved = localStorage.getItem('GreatBulgaria_SaveGame');
    if (!saved) return false;
    try {
        const parsed = JSON.parse(saved);

        window.currentHero = parsed.currentHero;
        window.unlockedHeroes = parsed.unlockedHeroes || [];
        window.gameTime = parsed.gameTime || {
            seasonIndex: 0, year: 480, era: "пр.н.е."
        };
        window.gameMode = parsed.gameMode || 'classic';
        window.currentRegion = parsed.currentRegion || "Плиска";
        window.companions = parsed.companions || [];
        window.activeQuests = parsed.activeQuests || [];
        window.completedQuests = parsed.completedQuests || [];

        let rawRegions = parsed.playerRegions || [];
        if (Array.isArray(rawRegions)) {
            let normalized = [];
            for (let item of rawRegions) {
                if (Array.isArray(item)) {
                    for (let sub of item) normalized.push(sub);
                } else if (typeof item === 'string') {
                    normalized.push(item);
                }
            }
            window.playerRegions = normalized;
        } else {
            window.playerRegions = [];
        }
        if (window.playerRegions.length === 0 && window.currentRegion) {
            window.playerRegions.push(window.currentRegion);
        }

        if (!window.worldData) window.worldData = {};
        if (!window.worldData.clans) window.worldData.clans = {};

        for (let key in window.worldData.clans) {
            delete window.worldData.clans[key];
        }

        window.unlockedHeroes.forEach(hero => {
            if (hero && (hero.id || hero.clan)) {
                hero.isJoined = true;
                if (hero.isFavorite === undefined) hero.isFavorite = false;
                const id = hero.id || ("hero_" + hero.clan + "_" +
                    hero.name.replace(/\s/g, '_'));
                hero.id = id;
                window.worldData.clans[id] = hero;
            }
        });

        if (window.currentHero && window.currentHero.id &&
            !window.worldData.clans[window.currentHero.id]) {
            window.currentHero.isJoined = true;
            if (window.currentHero.isFavorite === undefined) {
                window.currentHero.isFavorite = true;
            }
            window.worldData.clans[window.currentHero.id] = window.currentHero;
        } else if (window.currentHero && !window.currentHero.id) {
            window.currentHero.id = "hero_" + window.currentHero.clan + "_" +
                window.currentHero.name.replace(/\s/g, '_');
            window.currentHero.isJoined = true;
            window.worldData.clans[window.currentHero.id] = window.currentHero;
        }

        function migrateFavorites() {
            if (localStorage.getItem('favorites_migrated')) return;
            let changed = false;
            for (let key in window.worldData.clans) {
                let hero = window.worldData.clans[key];
                if (hero.isFavoriteInBarracks === true &&
                    hero.isFavorite !== true) {
                    hero.isFavorite = true;
                    changed = true;
                }
                delete hero.isFavoriteInBarracks;
            }
            if (changed && typeof window.saveGreatBulgariaGame === 'function') {
                window.saveGreatBulgariaGame();
            }
            localStorage.setItem('favorites_migrated', 'true');
        }
        migrateFavorites();

        if (parsed.unlockedHeroes) {
            parsed.unlockedHeroes.forEach(savedHero => {
                if (savedHero.portrait) {
                    for (let key in window.worldData.clans) {
                        let hero = window.worldData.clans[key];
                        if (hero.id === savedHero.id ||
                            hero.name === savedHero.name) {
                            hero.portrait = savedHero.portrait;
                            break;
                        }
                    }
                }
            });
        }
        if (parsed.companions) {
            parsed.companions.forEach(savedComp => {
                if (savedComp.portrait) {
                    let comp = window.companions.find(c =>
                        c.name === savedComp.name);
                    if (comp) comp.portrait = savedComp.portrait;
                }
            });
        }

        function setHeroHP(hero) {
            if (!hero) return;
            let endurance = (hero.skills && hero.skills.endurance) || 0;
            hero.maxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
            if (!hero.hp || isNaN(hero.hp) || hero.hp > hero.maxHp) {
                hero.hp = hero.maxHp;
            }
            if (typeof hero.isAlive === 'undefined') hero.isAlive = true;
        }
        if (window.currentHero) setHeroHP(window.currentHero);
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined === true) setHeroHP(hero);
        }
        if (window.companions) {
            window.companions.forEach(comp => setHeroHP(comp));
        }

        if (parsed.autoState) {
            localStorage.setItem('heroAutoState', parsed.autoState);
        }
        if (parsed.favoriteHeroes) {
            localStorage.setItem('favoriteHeroesFinal', parsed.favoriteHeroes);
        }

        if (window.updateCharacterUI) {
            window.updateCharacterUI(window.currentHero);
        }
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (typeof window.renderSingleBar === 'function') {
            window.renderSingleBar();
        }
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        if (window.updateTimeUI) window.updateTimeUI();

        if (window.gameMode === 'solo' &&
            typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        }

        if (typeof window.ensureHeroesHavePortraits === 'function') {
            window.ensureHeroesHavePortraits();
        }

        if (typeof window.showAdvisorMsg === 'function') {
            window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо!");
        }

        if (typeof window.saveGreatBulgariaGame === 'function') {
            window.saveGreatBulgariaGame();
        }

        return true;
    } catch (e) {
        console.error("Грешка при зареждане:", e);
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

// ========== НОРМАЛИЗАЦИЯ НА PLAYER REGIONS ==========
window.normalizePlayerRegions = function() {
    if (!window.playerRegions) {
        window.playerRegions = [];
        return [];
    }
    let flat = [];
    for (let item of window.playerRegions) {
        if (Array.isArray(item)) {
            for (let sub of item) {
                if (typeof sub === 'string' && sub.trim()) {
                    flat.push(sub.trim());
                }
            }
        } else if (typeof item === 'string' && item.trim()) {
            flat.push(item.trim());
        }
    }
    let unique = [...new Set(flat)];
    window.playerRegions = unique;
    return unique;
};

// Обвивки за автоматична нормализация
if (typeof window.loadGreatBulgariaGame === 'function') {
    const originalLoad = window.loadGreatBulgariaGame;
    window.loadGreatBulgariaGame = function() {
        let result = originalLoad();
        window.normalizePlayerRegions();
        return result;
    };
}
if (typeof window.startFreshGameLogic === 'function') {
    const originalStart = window.startFreshGameLogic;
    window.startFreshGameLogic = function() {
        originalStart();
        window.normalizePlayerRegions();
    };
}

// ========== ПОМОЩНИ ФУНКЦИИ ==========
window.ensureHeroesHavePortraits = async function() {
    let allHeroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true) allHeroes.push(hero);
        }
    }
    if (window.companions && window.companions.length) {
        allHeroes.push(...window.companions);
    }
    if (window.currentHero && !allHeroes.includes(window.currentHero)) {
        allHeroes.push(window.currentHero);
    }
    for (let hero of allHeroes) {
        if (!hero.portrait) {
            console.log("🎨 Генериране на портрет за " + hero.name + "...");
            try {
                if (typeof window.generateHeroPortrait === 'function') {
                    await window.generateHeroPortrait(hero);
                    window.saveGreatBulgariaGame();
                    await new Promise(r => setTimeout(r, 500));
                }
            } catch(e) {
                console.error("Грешка при портрет за " + hero.name, e);
            }
        }
    }
};

window.buyHeroFromTavern = function() {
    if (typeof window.hireNewHero === 'function') {
        window.hireNewHero();
    } else {
        console.error("hireNewHero не е дефинирана!");
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("ГРЕШКА",
                "Системата за наемане не е заредена правилно.", "error");
        } else {
            alert("Системата за наемане не е заредена правилно.");
        }
    }
};
window.buyNewHero = window.buyHeroFromTavern;

window.showStartChoiceModal = function() {};
window.handleStartChoice = function(action) {};

window.clearGreatBulgariaSaveWithoutReload = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');
    localStorage.removeItem('barracksFavorites');
};

window.clearGreatBulgariaSave = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');
    localStorage.removeItem('barracksFavorites');
    location.reload();
};
