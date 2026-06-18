/**
 ========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (ВЕРСИЯ 8.2 – ПОДДРЪЖКА ЗА РАЗНООБРАЗНИ НАЧАЛНИ КЛАСОВЕ)
 ========================================================================
 */

(function() {
    // ==================== GAME SAVE SYSTEM ====================
    window.GameSave = window.GameSave || {};

    window.GameSave.save = function() {
        try {
            const saveData = {
                version: "2.0.0",
                timestamp: Date.now(),
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
            
            if (data.worldData) window.worldData = data.worldData;
            if (data.gameTime) window.gameTime = data.gameTime;
            if (data.gameMode) window.gameMode = data.gameMode;
            if (data.currentRegion) window.currentRegion = data.currentRegion;
            if (data.companions) window.companions = data.companions;
            if (data.activeQuests) window.activeQuests = data.activeQuests;
            if (data.completedQuests) window.completedQuests = data.completedQuests;
            if (data.currentTurn) window.currentTurn = data.currentTurn;
            
            if (data.playerRegions) {
                let rawRegions = data.playerRegions;
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
            } else {
                window.playerRegions = [];
            }
            if (window.playerRegions.length === 0 && window.currentRegion) {
                window.playerRegions.push(window.currentRegion);
            }
            
            if (window.gameMode === 'solo' && data.currentHero) {
                window.currentHero = data.currentHero;
            } else if (window.currentHero) {
                delete window.currentHero;
            }
            
            if (window.worldData && window.worldData.clans) {
                for (let key in window.worldData.clans) {
                    let hero = window.worldData.clans[key];
                    if (hero && hero.isJoined === true) {
                        let endurance = (hero.skills && hero.skills.endurance) || 0;
                        hero.maxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
                        if (!hero.hp || isNaN(hero.hp) || hero.hp > hero.maxHp) hero.hp = hero.maxHp;
                        if (typeof hero.isAlive === 'undefined') hero.isAlive = true;
                    }
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
            
            console.log("✅ Играта е заредена успешно (версия " + (data.version || "неизвестна") + ")");
            return true;
        } catch (e) {
            console.error("💥 Save файлът е повреден!", e);
            alert("Save файлът е повреден. Ще започнеш нова игра.");
            localStorage.removeItem('GreatBulgaria_SaveGame');
            return false;
        }
    };

    window.GameSave.startAutoSave = function() {
        setInterval(() => {
            window.GameSave.save();
        }, 30000);
    };

    // ==================== ЦЕНТРАЛНА ФУНКЦИЯ ЗА СЪЗДАВАНЕ НА ГЕРОЙ ====================
    function createHeroObject(name, clan, options = {}) {
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
        let isSpecial = false;
        if (specials[name]) {
            finalOptions.heroPower = specials[name].power;
            finalOptions.power = specials[name].power;
            finalOptions.gold = specials[name].gold;
            finalOptions.armySize = specials[name].armySize;
            finalOptions.currentArmy = specials[name].armySize;
            finalOptions.className = specials[name].className;
            finalOptions.currentClass = specials[name].className;
            isSpecial = true;
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

        // *** НОВО: Прилагане на случаен начален клас, ако не е специален герой ***
        if (!isSpecial && hero.currentClass === "Воевода" && typeof window.getRandomStarterClass === 'function') {
            const starterClass = window.getRandomStarterClass();
            if (starterClass) {
                hero.currentClass = starterClass.name;
                hero.className = starterClass.name;
                hero.classIcon = starterClass.icon;
                if (starterClass.bonuses && typeof window.applyClassToHero === 'function') {
                    window.applyClassToHero(hero, starterClass);
                } else if (starterClass.bonuses) {
                    // Ръчно прилагане на бонуси, ако applyClassToHero липсва
                    for (let [stat, value] of Object.entries(starterClass.bonuses)) {
                        if (stat === 'heroPower') hero.heroPower = (hero.heroPower || 100) + value;
                        else if (stat === 'attackBonus') hero.attackBonus = (hero.attackBonus || 0) + value;
                        else if (stat === 'defenseBonus') hero.defenseBonus = (hero.defenseBonus || 0) + value;
                        else if (stat === 'defense') hero.defense = (hero.defense || 0) + value;
                        else if (stat === 'critChance') hero.critChanceBonus = (hero.critChanceBonus || 0) + value;
                        else if (stat === 'critDamage') hero.critDamageBonus = (hero.critDamageBonus || 0) + value;
                        else if (stat === 'dodgeChance') hero.dodgeChance = (hero.dodgeChance || 0) + value;
                        else if (stat === 'mysticismBonus') hero.mysticismBonus = (hero.mysticismBonus || 0) + value;
                        else if (stat === 'armyBonus') hero.armyBonus = (hero.armyBonus || 0) + value;
                        else if (stat === 'moraleBonus') hero.morale = Math.min(100, (hero.morale || 50) + value);
                    }
                }
                console.log(`🎭 Герой ${hero.name} получи начален клас: ${starterClass.name}`);
            }
        }
        // *** КРАЙ НА ПРОМЯНАТА ***

        if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
        return hero;
    }

    // ========== ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ ГЕРОИ ОТ DATABASE ==========
function initializeAllHeroesFromDatabase() {
    if (!window.bulgarianClans) {
        console.error("❌ window.bulgarianClans липсва! Няма герои за инициализация.");
        return;
    }
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    const clans = window.bulgarianClans;
    for (let clanName in clans) {
        const heroesList = clans[clanName].heroes;
        if (!heroesList) continue;
        for (let heroName of heroesList) {
            const heroId = "hero_" + clanName + "_" + heroName.replace(/\s/g, '_');
            if (window.worldData.clans[heroId]) continue;
            const hero = createHeroObject(heroName, clanName);
            hero.isJoined = false;
            hero.isFavorite = false;
            window.worldData.clans[heroId] = hero;
        }
    }
    console.log("✅ Инициализирани " + Object.keys(window.worldData.clans).length + " герои от database.js");
}
    // ========== СЛУЧАЕН ГЕРОЙ ОТ БАЗАТА ==========
    function getRandomHeroFromDatabase() {
        initializeAllHeroesFromDatabase();

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
    function startFreshGameLogic() {
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
            startingHero = createHeroObject(selectedName, selectedClan, {
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
        localStorage.removeItem('barracksFavorites');
        localStorage.removeItem('tournament_last_year');
        if (window.tournament && typeof window.tournament.resetLastYear === 'function') {
            window.tournament.resetLastYear();
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
    }

    // ========== ЗАПАЗВАНЕ ==========
    function saveGreatBulgariaGame() {
        return window.GameSave.save();
    }

    // ========== ЗАРЕЖДАНЕ ==========
    function loadGreatBulgariaGame() {
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

            // Възстановяване на companions в worldData.clans
            if (window.companions && window.companions.length > 0) {
                for (let comp of window.companions) {
                    let exists = false;
                    for (let key in window.worldData.clans) {
                        if (window.worldData.clans[key].id === comp.id || window.worldData.clans[key].name === comp.name) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        const newId = comp.id || `companion_${comp.name.replace(/\s/g, '_')}_${Date.now()}`;
                        comp.id = newId;
                        if (!comp.armyDetails) comp.armyDetails = { infantry: 80, archers: 30, cavalry: 25, elite: 15 };
                        if (!comp.skills) comp.skills = { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 };
                        if (!comp.equipment) comp.equipment = Array(12).fill(null);
                        if (!comp.inventory) comp.inventory = [];
                        if (!comp.learnedSkills) comp.learnedSkills = {};
                        if (!comp.pet) comp.pet = null;
                        let endurance = comp.skills?.endurance || 0;
                        comp.maxHp = 100 + (comp.level - 1) * 20 + endurance * 15;
                        if (!comp.hp || comp.hp > comp.maxHp) comp.hp = comp.maxHp;
                        comp.isAlive = true;
                        comp.isJoined = true;
                        comp.isCompanion = true;
                        window.worldData.clans[newId] = comp;
                    }
                }
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

            if (window.worldData && window.worldData.regions) {
                for (let name in window.worldData.regions) {
                    if (window.worldData.regions[name].ancientOwner === undefined) {
                        window.worldData.regions[name].ancientOwner = null;
                    }
                }
            }
            return true;
        } catch (e) {
            console.error("Грешка при зареждане:", e);
            localStorage.removeItem('GreatBulgaria_SaveGame');
            return false;
        }
    }

    // ========== НОРМАЛИЗАЦИЯ НА PLAYER REGIONS ==========
    function normalizePlayerRegions() {
        if (!window.playerRegions) window.playerRegions = [];
        let flat = [];
        for (let item of window.playerRegions) {
            if (Array.isArray(item)) {
                for (let sub of item) if (typeof sub === 'string' && sub.trim()) flat.push(sub.trim());
            } else if (typeof item === 'string' && item.trim()) flat.push(item.trim());
        }
        window.playerRegions = [...new Set(flat)];
        return window.playerRegions;
    }

    // ========== ПОМОЩНИ ФУНКЦИИ ==========
    async function ensureHeroesHavePortraits() {
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
                    saveGreatBulgariaGame();
                    await new Promise(r => setTimeout(r, 500));
                } catch(e) { console.error(e); }
            }
        }
    }

    function buyHeroFromTavern() {
        if (typeof window.hireNewHero === 'function') window.hireNewHero();
        else console.error("hireNewHero не е дефинирана!");
    }

    function clearGreatBulgariaSave() {
        localStorage.removeItem('GreatBulgaria_SaveGame');
        localStorage.removeItem('favoriteHeroesFinal');
        localStorage.removeItem('heroAutoState');
        localStorage.removeItem('barracksFavorites');
        location.reload();
    }

    // ==================== СИСТЕМА ЗА ОФЕРТИ ПРИ ЛИПСА НА ЖИВ ГЕРОЙ ====================
    function hasAnyAliveHero() {
        if (!window.worldData || !window.worldData.clans) return false;
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true && hero.isAlive !== false) return true;
        }
        return false;
    }

    function getRandomUnhiredHero() {
        let available = [];
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (!hero.isJoined && hero.isAlive !== false) available.push({ id: key, ...hero });
        }
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    function reviveFromAshes() {
        console.warn("🔥 Няма свободни герои за наемане! Създавам нов начален герой.");
        let newHeroData = getRandomHeroFromDatabase();
        let newId = "hero_ashes_" + Date.now();
        let newHero = createHeroObject(newHeroData.name, newHeroData.clan, {
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
    }

    function showJoinOffer() {
        if (hasAnyAliveHero()) return;
        let candidate = getRandomUnhiredHero();
        if (!candidate) { reviveFromAshes(); return; }
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
    }

    function monitorHeroesAlive() {
        if (!hasAnyAliveHero()) {
            showJoinOffer();
            if (!window._heroMonitorInterval) {
                window._heroMonitorInterval = setInterval(() => {
                    if (!hasAnyAliveHero()) showJoinOffer();
                    else if (window._heroMonitorInterval) clearInterval(window._heroMonitorInterval);
                }, 30000);
            }
        }
    }

    // ==================== ПУБЛИЧНО API ====================
    window.GameLogic = {
        createHeroObject: createHeroObject,
        startFreshGame: startFreshGameLogic,
        saveGame: saveGreatBulgariaGame,
        loadGame: loadGreatBulgariaGame,
        normalizeRegions: normalizePlayerRegions,
        ensurePortraits: ensureHeroesHavePortraits,
        buyHero: buyHeroFromTavern,
        clearSave: clearGreatBulgariaSave,
        hasAliveHero: hasAnyAliveHero,
        getRandomUnhired: getRandomUnhiredHero,
        revive: reviveFromAshes,
        showJoinOffer: showJoinOffer,
        monitorHeroes: monitorHeroesAlive
    };

    window.createHeroObject = window.GameLogic.createHeroObject;
    window.startFreshGameLogic = window.GameLogic.startFreshGame;
    window.saveGreatBulgariaGame = window.GameLogic.saveGame;
    window.loadGreatBulgariaGame = window.GameLogic.loadGame;
    window.normalizePlayerRegions = window.GameLogic.normalizeRegions;
    window.ensureHeroesHavePortraits = window.GameLogic.ensurePortraits;
    window.buyHeroFromTavern = window.GameLogic.buyHero;
    window.buyNewHero = window.buyHeroFromTavern;
    window.clearGreatBulgariaSave = window.GameLogic.clearSave;
    window.hasAnyAliveHero = window.GameLogic.hasAliveHero;
    window.getRandomUnhiredHero = window.GameLogic.getRandomUnhired;
    window.reviveFromAshes = window.GameLogic.revive;
    window.showJoinOffer = window.GameLogic.showJoinOffer;

    const originalLoad = window.loadGreatBulgariaGame;
    window.loadGreatBulgariaGame = function() {
        let result = originalLoad();
        normalizePlayerRegions();
        return result;
    };
    const originalStart = window.startFreshGameLogic;
    window.startFreshGameLogic = function() {
        originalStart();
        normalizePlayerRegions();
    };

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

    // ==================== Puter.js ОБЛАЧНО ЗАПАЗВАНЕ ====================
    window.saveGameToCloud = async function() {
        if (typeof puter === 'undefined') {
            console.warn("Puter.js не е зареден");
            return false;
        }
        try {
            const saveData = {
                version: "2.0.0",
                timestamp: Date.now(),
                worldData: window.worldData,
                gameTime: window.gameTime,
                gameMode: window.gameMode,
                currentRegion: window.currentRegion,
                companions: window.companions,
                activeQuests: window.activeQuests,
                completedQuests: window.completedQuests,
                playerRegions: window.playerRegions,
                currentHero: window.currentHero
            };
            await puter.kv.set('GreatBulgaria_SaveGame', JSON.stringify(saveData));
            console.log("💾 Играта е запазена в облака (Puter)");
            if (window.showAdvisorPopup) {
                window.showAdvisorPopup("Облачно запазване", "Играта е запазена успешно в облака!", "success");
            }
            return true;
        } catch (err) {
            console.error("Грешка при облачно запазване:", err);
            return false;
        }
    };

    window.loadGameFromCloud = async function() {
        if (typeof puter === 'undefined') {
            console.warn("Puter.js не е зареден");
            return false;
        }
        try {
            const saved = await puter.kv.get('GreatBulgaria_SaveGame');
            if (!saved) {
                console.log("Няма запазена игра в облака.");
                return false;
            }
            const data = JSON.parse(saved);
            if (data.worldData) window.worldData = data.worldData;
            if (data.gameTime) window.gameTime = data.gameTime;
            if (data.gameMode) window.gameMode = data.gameMode;
            if (data.currentRegion) window.currentRegion = data.currentRegion;
            if (data.companions) window.companions = data.companions;
            if (data.activeQuests) window.activeQuests = data.activeQuests;
            if (data.completedQuests) window.completedQuests = data.completedQuests;
            if (data.playerRegions) window.playerRegions = data.playerRegions;
            if (window.gameMode === 'solo' && data.currentHero) window.currentHero = data.currentHero;
            
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
            if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
            if (typeof window.updateTimeUI === 'function') window.updateTimeUI();
            if (typeof window.updatePortalContainerUI === 'function') window.updatePortalContainerUI();
            
            console.log("✅ Играта е заредена от облака");
            if (window.showAdvisorPopup) {
                window.showAdvisorPopup("Облачно зареждане", "Играта е заредена успешно от облака!", "success");
            }
            return true;
        } catch (err) {
            console.error("Грешка при облачно зареждане:", err);
            return false;
        }
    };

    console.log("✅ logic.js версия 8.2 – поддръжка за разнообразни начални класове");
})();
