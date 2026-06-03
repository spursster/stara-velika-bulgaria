/**
 ========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (ВЕРСИЯ 7.0 – ЦЕНТРАЛИЗИРАНА ИНИЦИАЛИЗАЦИЯ НА ГЕРОИ)
 ========================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏛️ DOM готов...");

    setTimeout(() => {
        const loaded = window.GameSave.load();
        if (!loaded) {
            window.startGameCore();
        } else {
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
            if (typeof window.updateAllUI === 'function') window.updateAllUI();
        }
        window.GameSave.startAutoSave();
        setTimeout(() => monitorHeroesAlive(), 1000);
    }, 150);
});

// ========== ЦЕНТРАЛНА ФУНКЦИЯ ЗА СЪЗДАВАНЕ НА ГЕРОЙ ==========
window.createHeroObject = function(name, clan, options = {}) {
    const defaults = {
        isJoined: false,
        isFavorite: false,
        level: 1,
        xp: 0,
        storedXP: 0,
        heroPower: 100,
        power: 100,
        gold: 1000,
        armySize: 200,
        currentArmy: 200,
        currentClass: "Воевода",
        className: "Воевода",
        age: 30 + Math.floor(Math.random() * 31),
        isAuto: true,
        skillPoints: 0,
        skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
        equipment: Array(12).fill(null),
        inventory: [],
        pet: null,
        armyDetails: {
            infantry: 100,
            archers: 50,
            cavalry: 30,
            elite: 20
        }
    };

    // Специални герои (Легенди, Герои, Войни)
    const specials = {
        "Александър III Велики": { power: 180, gold: 2000, armySize: 400, className: "Легенда" },
        "Симеон Велики": { power: 180, gold: 2000, armySize: 400, className: "Легенда" },
        "Кубрат": { power: 180, gold: 2000, armySize: 400, className: "Легенда" },
        "Влад III Дракула": { power: 180, gold: 2000, armySize: 400, className: "Легенда" },
        "Атила": { power: 150, gold: 1500, armySize: 300, className: "Герой" },
        "Филип II": { power: 150, gold: 1500, armySize: 300, className: "Герой" },
        "Самуил": { power: 150, gold: 1500, armySize: 300, className: "Герой" },
        "Птолемей I Сотер": { power: 150, gold: 1500, armySize: 300, className: "Герой" }
    };

    let finalOptions = { ...defaults, ...options };
    if (specials[name]) {
        finalOptions.heroPower = specials[name].power;
        finalOptions.power = specials[name].power;
        finalOptions.gold = specials[name].gold;
        finalOptions.armySize = specials[name].armySize;
        finalOptions.currentArmy = specials[name].armySize;
        finalOptions.className = specials[name].className;
        finalOptions.currentClass = specials[name].className;
    }

    const hero = {
        name: name,
        clan: clan,
        isJoined: finalOptions.isJoined,
        isFavorite: finalOptions.isFavorite,
        level: finalOptions.level,
        xp: finalOptions.xp,
        storedXP: finalOptions.storedXP,
        heroPower: finalOptions.heroPower,
        power: finalOptions.power,
        gold: finalOptions.gold,
        armySize: finalOptions.armySize,
        currentArmy: finalOptions.currentArmy,
        currentClass: finalOptions.currentClass,
        className: finalOptions.className,
        age: finalOptions.age,
        isAuto: finalOptions.isAuto,
        skillPoints: finalOptions.skillPoints,
        skills: finalOptions.skills,
        equipment: finalOptions.equipment,
        inventory: finalOptions.inventory,
        pet: finalOptions.pet,
        armyDetails: finalOptions.armyDetails
    };

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
    return hero;
};

// ========== ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ ГЕРОИ ОТ DATABASE ==========
function initializeAllHeroesFromDatabase() {
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    const clans = window.bulgarianClans;
    if (!clans) return;
    for (let clanName in clans) {
        const heroesList = clans[clanName].heroes;
        if (!heroesList) continue;
        for (let heroName of heroesList) {
            const heroId = "hero_" + clanName + "_" + heroName.replace(/\s/g, '_');
            if (window.worldData.clans[heroId]) continue;
            const hero = window.createHeroObject(heroName, clanName);
            hero.isJoined = false;
            hero.isFavorite = false;
            window.worldData.clans[heroId] = hero;
        }
    }
    console.log("✅ Инициализирани " + Object.keys(window.worldData.clans).length + " герои от database.js");
}

// ========== СЛУЧАЕН ГЕРОЙ ОТ БАЗАТА ==========
function getRandomHeroFromDatabase() {
    initializeAllHeroesFromDatabase(); // гарантираме, че всички съществуват

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
                armySize: hero.armySize,
                className: hero.className
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
                    armySize: hero.armySize,
                    className: hero.className
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
            armySize: 400,
            className: "Легенда"
        };
    }

    const randomIndex = Math.floor(Math.random() * availableHeroes.length);
    const selected = availableHeroes[randomIndex];
    console.log("🎲 Избран случаен герой: " + selected.name + " (" + selected.clan + ")");
    return selected;
}

// ========== НОВА ИГРА ==========
window.startFreshGameLogic = function() {
    console.log("🔄 startFreshGameLogic извикана");

    if (!window.worldData) window.worldData = {};
    window.worldData.clans = {};

    initializeAllHeroesFromDatabase();

    let heroData = getRandomHeroFromDatabase();
    let selectedId = heroData.id;
    let selectedName = heroData.name;
    let selectedClan = heroData.clan;

    let existingHero = null;
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.id === selectedId || (h.name === selectedName && h.clan === selectedClan)) {
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
    }

    let startingHero = null;
    if (existingHero) {
        existingHero.isJoined = true;
        existingHero.isFavorite = true;
        existingHero.gold = heroData.gold;
        existingHero.armySize = heroData.armySize;
        existingHero.currentArmy = heroData.armySize;
        existingHero.heroPower = heroData.power;
        existingHero.power = heroData.power;
        startingHero = existingHero;
        setHeroHP(startingHero);
    } else {
        startingHero = window.createHeroObject(selectedName, selectedClan, {
            isJoined: true,
            isFavorite: true,
            gold: heroData.gold,
            armySize: heroData.armySize,
            currentArmy: heroData.armySize,
            heroPower: heroData.power,
            power: heroData.power,
            className: heroData.className,
            currentClass: heroData.className
        });
        setHeroHP(startingHero);
        window.worldData.clans[selectedId] = startingHero;
    }

    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(startingHero).catch(e => console.warn(e));
    }

    if (window.gameMode === 'solo') {
        window.currentHero = startingHero;
    } else {
        if (typeof window.getStrongestHero !== 'function') {
            window.getStrongestHero = function() { return startingHero; };
        }
        if (typeof window.updateStrongestHeroUI === 'function') {
            window.updateStrongestHeroUI();
        }
    }

    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero !== startingHero) {
            hero.isJoined = false;
            hero.isFavorite = false;
        }
    }

    window.unlockedHeroes = [startingHero];
    if (window.gameMode === 'solo') {
        localStorage.setItem('barracksFavorites', JSON.stringify([startingHero.name]));
    } else {
        localStorage.setItem('barracksFavorites', JSON.stringify([]));
    }
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');

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
        console.log("🌍 Старт в СОЛО РЕЖИМ: " + startingHero.name);
        if (typeof window.showAdvisorMsg === 'function') {
            window.showAdvisorMsg("🌍 Добре дошли, " + startingHero.name + " от рода " + startingHero.clan + "!");
        }
        if (typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        }
    } else {
        console.log("🏰 Старт в КЛАСИЧЕСКИ РЕЖИМ");
        if (typeof window.showAdvisorMsg === 'function') {
            window.showAdvisorMsg("🏰 Вие сте " + startingHero.name + " от могъщия род " + startingHero.clan + ".");
        }
    }

    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();

    console.log("✅ startFreshGameLogic завърши. Начален герой: " + startingHero.name);
};

// ========== ЗАПАЗВАНЕ ==========
window.saveGreatBulgariaGame = function() {
    try {
        const saveData = {
            version: "2.0.0",
            worldData: window.worldData,
            gameTime: window.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." },
            gameMode: window.gameMode,
            currentRegion: window.currentRegion,
            companions: window.companions || [],
            activeQuests: window.activeQuests || [],
            completedQuests: window.completedQuests || [],
            playerRegions: window.playerRegions || []
        };
        if (window.gameMode === 'solo' && window.currentHero) {
            saveData.currentHero = window.currentHero;
        }
        localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
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
        if (parsed.worldData) window.worldData = parsed.worldData;
        window.gameTime = parsed.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." };
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
                } else if (typeof item === 'string') normalized.push(item);
            }
            window.playerRegions = normalized;
        } else {
            window.playerRegions = [];
        }
        if (window.playerRegions.length === 0 && window.currentRegion) window.playerRegions.push(window.currentRegion);

        if (window.gameMode === 'solo' && parsed.currentHero) {
            window.currentHero = parsed.currentHero;
        } else {
            if (window.currentHero) delete window.currentHero;
        }

        if (!window.worldData.clans) window.worldData.clans = {};
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined === true) {
                let endurance = (hero.skills && hero.skills.endurance) || 0;
                hero.maxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
                if (!hero.hp || isNaN(hero.hp) || hero.hp > hero.maxHp) hero.hp = hero.maxHp;
                if (typeof hero.isAlive === 'undefined') hero.isAlive = true;
            }
        }
        if (window.companions) {
            window.companions.forEach(comp => {
                let endurance = (comp.skills && comp.skills.endurance) || 0;
                comp.maxHp = 100 + (comp.level - 1) * 20 + endurance * 15;
                if (!comp.hp || isNaN(comp.hp) || comp.hp > comp.maxHp) comp.hp = comp.maxHp;
                comp.isAlive = true;
            });
        }

        if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        if (window.updateTimeUI) window.updateTimeUI();

        if (window.gameMode === 'solo' && typeof window.initSoloMode === 'function') window.initSoloMode();
        if (typeof window.ensureHeroesHavePortraits === 'function') window.ensureHeroesHavePortraits();
        if (typeof window.showAdvisorMsg === 'function') window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо!");
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
        return true;
    } catch (e) {
        console.error("Грешка при зареждане:", e);
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

// ========== НОРМАЛИЗАЦИЯ НА PLAYER REGIONS ==========
window.normalizePlayerRegions = function() {
    if (!window.playerRegions) window.playerRegions = [];
    let flat = [];
    for (let item of window.playerRegions) {
        if (Array.isArray(item)) {
            for (let sub of item) if (typeof sub === 'string' && sub.trim()) flat.push(sub.trim());
        } else if (typeof item === 'string' && item.trim()) flat.push(item.trim());
    }
    window.playerRegions = [...new Set(flat)];
    return window.playerRegions;
};

// Обвивки
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
    if (window.companions && window.companions.length) allHeroes.push(...window.companions);
    for (let hero of allHeroes) {
        if (!hero.portrait && typeof window.generateHeroPortrait === 'function') {
            try {
                await window.generateHeroPortrait(hero);
                window.saveGreatBulgariaGame();
                await new Promise(r => setTimeout(r, 500));
            } catch(e) { console.error(e); }
        }
    }
};

window.buyHeroFromTavern = function() {
    if (typeof window.hireNewHero === 'function') window.hireNewHero();
    else console.error("hireNewHero не е дефинирана!");
};
window.buyNewHero = window.buyHeroFromTavern;
window.clearGreatBulgariaSave = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');
    localStorage.removeItem('barracksFavorites');
    location.reload();
};

// ==================== СИСТЕМА ЗА ОФЕРТИ ПРИ ЛИПСА НА ЖИВ ГЕРОЙ ====================
window.hasAnyAliveHero = function() {
    if (!window.worldData || !window.worldData.clans) return false;
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero.isJoined === true && hero.isAlive !== false) return true;
    }
    return false;
};

window.getRandomUnhiredHero = function() {
    let available = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (!hero.isJoined && hero.isAlive !== false) available.push({ id: key, ...hero });
    }
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
};

window.reviveFromAshes = function() {
    console.warn("🔥 Няма свободни герои за наемане! Създавам нов начален герой.");
    let newHeroData = getRandomHeroFromDatabase();
    let newId = "hero_ashes_" + Date.now();
    let newHero = window.createHeroObject(newHeroData.name, newHeroData.clan, {
        isJoined: true,
        isFavorite: true,
        gold: 800,
        armySize: 200,
        heroPower: newHeroData.power,
        power: newHeroData.power
    });
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newId] = newHero;
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
    if (typeof window.updateAllUI === 'function') window.updateAllUI();
    if (window.showAdvisorPopup) window.showAdvisorPopup("ВЪЗКРЕСЕНИЕ", `Духът на прадедите ви изпраща ${newHero.name} от ${newHero.clan}!`, "info");
};

window.showJoinOffer = function() {
    if (window.hasAnyAliveHero()) return;
    let candidate = window.getRandomUnhiredHero();
    if (!candidate) { if (window.reviveFromAshes) window.reviveFromAshes(); return; }
    let baseCost = 800;
    if (candidate.heroPower > 170) baseCost = 2000;
    else if (candidate.heroPower > 140) baseCost = 1200;
    let personality = candidate.personality || [];
    let greedy = personality.some(p => p.categories && p.categories.includes("greedy"));
    let generous = personality.some(p => p.categories && p.categories.includes("dip"));
    if (greedy) baseCost = Math.floor(baseCost * 1.5);
    if (generous) baseCost = Math.floor(baseCost * 0.7);
    if (window.ChronicleEvents && window.ChronicleEvents.generateHeroOffer) {
        let ev = window.ChronicleEvents.generateHeroOffer(candidate, baseCost);
        window.showAdvisorMsg(ev.message, ev.buttons);
    } else {
        alert("Оферта: " + candidate.name + " иска " + baseCost + " злато.");
    }
};

function monitorHeroesAlive() {
    if (!window.hasAnyAliveHero()) {
        window.showJoinOffer();
        if (!window._heroMonitorInterval) {
            window._heroMonitorInterval = setInterval(() => {
                if (!window.hasAnyAliveHero()) window.showJoinOffer();
                else if (window._heroMonitorInterval) clearInterval(window._heroMonitorInterval);
            }, 30000);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monitorHeroesAlive);
} else {
    monitorHeroesAlive();
}

console.log("✅ logic.js версия 7.0 – централизирана инициализация на герои, без дублиране");
