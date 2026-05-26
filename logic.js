/**
 ==========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (ВЕРСИЯ 4.2 – ДИРЕКТНО ЗАДАВАНЕ НА HP)
 ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("🏛️ Инициализация на системата за запис на Велика България...");
    setTimeout(function() {
        const hasSave = localStorage.getItem('GreatBulgaria_SaveGame');
        if (hasSave) {
            window.loadGreatBulgariaGame();
        } else {
            window.startFreshGameLogic();
        }
    }, 150);
});

// ==================== ФУНКЦИЯ ЗА СЛУЧАЕН ГЕРОЙ ОТ DATABASE.JS ====================
function getRandomHeroFromDatabase() {
    if (typeof initializeAllHeroesFromDatabase === 'function') {
        initializeAllHeroesFromDatabase();
    }

    if (!window.worldData || !window.worldData.clans || Object.keys(window.worldData.clans).length === 0) {
        console.warn("⚠️ worldData.clans е празен, опитвам да инициализирам от bulgarianClans...");
        if (window.bulgarianClans) {
            for (let clanName in window.bulgarianClans) {
                let heroesList = window.bulgarianClans[clanName].heroes;
                if (heroesList) {
                    for (let heroName of heroesList) {
                        const heroId = `hero_${clanName}_${heroName.replace(/\s/g, '_')}`;
                        if (!window.worldData.clans[heroId]) {
                            let power = 100, gold = 1000, armySize = 200, className = "Воевода";
                            if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(heroName)) {
                                power = 180; gold = 2000; armySize = 400; className = "Легенда";
                            } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(heroName)) {
                                power = 150; gold = 1500; armySize = 300; className = "Герой";
                            }
                            window.worldData.clans[heroId] = {
                                name: heroName, clan: clanName, isJoined: false, isFavorite: false,
                                level: 1, xp: 0, heroPower: power, power: power, gold: gold,
                                armySize: armySize, currentArmy: armySize, currentClass: className,
                                className: className, age: 30, isAuto: true, skillPoints: 0,
                                skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
                                equipment: Array(12).fill(null), inventory: [], pet: null,
                                armyDetails: {
                                    infantry: Math.floor(armySize * 0.5),
                                    archers: Math.floor(armySize * 0.25),
                                    cavalry: Math.floor(armySize * 0.15),
                                    elite: Math.floor(armySize * 0.1)
                                }
                            };
                        }
                    }
                }
            }
        }
    }

    let availableHeroes = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero && hero.isJoined !== true) {
            availableHeroes.push({
                name: hero.name,
                clan: hero.clan,
                power: hero.heroPower,
                gold: hero.gold,
                armySize: hero.armySize
            });
        }
    }

    if (availableHeroes.length === 0) {
        console.warn("⚠️ Няма свободни герои, взимам всички герои (включително наети)");
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero) {
                availableHeroes.push({
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
        return { name: "Кубрат", clan: "Дуло", power: 180, gold: 2000, armySize: 400 };
    }

    const randomIndex = Math.floor(Math.random() * availableHeroes.length);
    const selected = availableHeroes[randomIndex];
    console.log(`🎲 Избран случаен герой от ${availableHeroes.length} налични: ${selected.name} (${selected.clan})`);
    return selected;
}

// ==================== ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ ГЕРОИ ОТ DATABASE.JS В СВЕТА ====================
function initializeAllHeroesFromDatabase() {
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    const clans = window.bulgarianClans || window.bulgarianDynasties;
    if (!clans) return;
    for (let clanName in clans) {
        const heroesList = clans[clanName].heroes || clans[clanName].rulers;
        if (!heroesList) continue;
        for (let heroName of heroesList) {
            const heroId = `hero_${clanName}_${heroName.replace(/\s/g, '_')}`;
            if (window.worldData.clans[heroId]) continue;
            let power = 100, gold = 1000, armySize = 200, className = "Воевода";
            if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(heroName)) {
                power = 180; gold = 2000; armySize = 400; className = "Легенда";
            } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(heroName)) {
                power = 150; gold = 1500; armySize = 300; className = "Герой";
            }
            const hero = {
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
                skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
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
            if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
            if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
            window.worldData.clans[heroId] = hero;
        }
    }
    console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} герои от database.js`);
}

// ==================== НОВА ИГРА ====================
window.startFreshGameLogic = function() {
    console.log("🔄 startFreshGameLogic извикана");

    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};

    if (typeof initializeAllHeroesFromDatabase === 'function') {
        initializeAllHeroesFromDatabase();
    } else {
        console.warn("initializeAllHeroesFromDatabase липсва, опитваме ръчно зареждане");
        if (window.bulgarianClans) {
            for (let clanName in window.bulgarianClans) {
                let heroesList = window.bulgarianClans[clanName].heroes;
                if (heroesList) {
                    for (let heroName of heroesList) {
                        const heroId = `hero_${clanName}_${heroName.replace(/\s/g, '_')}`;
                        if (!window.worldData.clans[heroId]) {
                            let power = 100, gold = 1000, armySize = 200, className = "Воевода";
                            if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(heroName)) {
                                power = 180; gold = 2000; armySize = 400; className = "Легенда";
                            } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(heroName)) {
                                power = 150; gold = 1500; armySize = 300; className = "Герой";
                            }
                            window.worldData.clans[heroId] = {
                                name: heroName, clan: clanName, isJoined: false, isFavorite: false,
                                level: 1, xp: 0, heroPower: power, power: power, gold: gold,
                                armySize: armySize, currentArmy: armySize, currentClass: className,
                                className: className, age: 30, isAuto: true, skillPoints: 0,
                                skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
                                equipment: Array(12).fill(null), inventory: [], pet: null,
                                armyDetails: { infantry: Math.floor(armySize * 0.5), archers: Math.floor(armySize * 0.25), cavalry: Math.floor(armySize * 0.15), elite: Math.floor(armySize * 0.1) }
                            };
                        }
                    }
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
    let selectedName = heroData.name;
    let selectedClan = heroData.clan;
    console.log(`🎲 Избран случаен герой: ${selectedName} от род ${selectedClan}`);

    let existingHero = null;
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.name === selectedName && h.clan === selectedClan) {
            existingHero = h;
            break;
        }
    }

    // Функция за директно задаване на HP
    function setHeroHP(hero) {
        let endurance = hero.skills?.endurance || 0;
        hero.maxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
        hero.hp = hero.maxHp;
        hero.isAlive = true;
        console.log(`💚 Зададен HP за ${hero.name}: ${hero.hp}/${hero.maxHp}`);
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
            skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
            inventory: [],
            isFavorite: true,
            isJoined: true,
            portrait: null,
            armyDetails: { infantry: Math.floor(heroData.armySize * 0.5), archers: Math.floor(heroData.armySize * 0.25), cavalry: Math.floor(heroData.armySize * 0.15), elite: Math.floor(heroData.armySize * 0.1) }
        };
        setHeroHP(window.currentHero);
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(window.currentHero);
        const heroId = `hero_${selectedClan}_${selectedName.replace(/\s/g, '_')}`;
        window.worldData.clans[heroId] = window.currentHero;
    }

    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(window.currentHero).catch(e => console.warn(e));
    }

    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero !== window.currentHero && hero.isJoined === true) {
            hero.isJoined = false;
            hero.isFavorite = false;
        }
    }

    window.unlockedHeroes = [window.currentHero];
    localStorage.setItem('barracksFavorites', JSON.stringify([window.currentHero.name]));
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
        console.log("🌍 Стартиране в СОЛО РЕЖИМ със случаен герой:", window.currentHero.name);
        window.companions = [];
        window.activeQuests = [];
        window.completedQuests = [];
        if (typeof window.addQuest === 'function') {
            window.addQuest({ title: "Първи стъпки", description: "Завладейте региона Плиска или посетете съседен регион.", reward: { gold: 100, xp: 50 } });
        }
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🌍 Добре дошли, ${window.currentHero.name} от рода ${window.currentHero.clan}!`);
        }
        if (typeof window.initSoloMode === 'function') window.initSoloMode();
    } else {
        console.log("🏰 Стартиране в КЛАСИЧЕСКИ РЕЖИМ със случаен герой:", window.currentHero.name);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🏰 Вие сте ${window.currentHero.name} от могъщия род ${window.currentHero.clan}.`);
        }
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    if (typeof window.saveGreatBulgariaGame === 'function') {
        window.saveGreatBulgariaGame();
    }

    console.log("✅ startFreshGameLogic завърши. Активен герой:", window.currentHero.name);
};

// ==================== ЗАПАЗВАНЕ И ЗАРЕЖДАНЕ ====================
window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    try {
        let allHeroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let hero = window.worldData.clans[key];
                if (hero.isJoined === true) {
                    let heroCopy = { ...hero };
                    if (hero.portrait) heroCopy.portrait = hero.portrait;
                    allHeroes.push(heroCopy);
                }
            }
        }
        let companionsCopy = [];
        if (window.companions && window.companions.length) {
            companionsCopy = window.companions.map(c => ({ ...c, portrait: c.portrait }));
        }
        const saveData = {
            currentHero: window.currentHero,
            unlockedHeroes: allHeroes,
            gameTime: window.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." },
            favoriteHeroes: localStorage.getItem('favoriteHeroesFinal'),
            autoState: localStorage.getItem('heroAutoState'),
            gameMode: window.gameMode,
            currentRegion: window.currentRegion,
            companions: companionsCopy,
            activeQuests: window.activeQuests,
            completedQuests: window.completedQuests,
            playerRegions: window.playerRegions
        };
        localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
        console.log("💾 Прогресът беше запазен (включително портрети).");
    } catch (e) {
        console.error(e);
    }
};

window.loadGreatBulgariaGame = function() {
    const saved = localStorage.getItem('GreatBulgaria_SaveGame');
    if (!saved) return false;
    try {
        const parsed = JSON.parse(saved);
        window.currentHero = parsed.currentHero;
        window.unlockedHeroes = parsed.unlockedHeroes || [];
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
        
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                if (!window.worldData.clans[key].isJoined && key !== window.currentHero?.clan) {
                    let found = window.unlockedHeroes.some(h => (h.clan === key || h.name === key));
                    if (!found && key !== window.currentHero?.clan) {
                        delete window.worldData.clans[key];
                    }
                }
            }
            window.unlockedHeroes.forEach(hero => {
                if (hero && hero.clan) {
                    window.worldData.clans[hero.clan] = hero;
                    window.worldData.clans[hero.clan].isJoined = true;
                }
            });
            const uniqueNames = new Map();
            for (let key in window.worldData.clans) {
                let hero = window.worldData.clans[key];
                let name = hero.name || hero.leaderName || key;
                if (!uniqueNames.has(name)) {
                    uniqueNames.set(name, hero);
                } else {
                    delete window.worldData.clans[key];
                    console.log(`Премахнат дублиращ се герой при зареждане: ${name}`);
                }
            }
        }
        
        if (parsed.unlockedHeroes) {
            parsed.unlockedHeroes.forEach(savedHero => {
                if (savedHero.portrait) {
                    for (let key in window.worldData.clans) {
                        let hero = window.worldData.clans[key];
                        if (hero.name === savedHero.name || hero.leaderName === savedHero.name) {
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
                    let comp = window.companions.find(c => c.name === savedComp.name);
                    if (comp) comp.portrait = savedComp.portrait;
                }
            });
        }
        
        if (parsed.favoriteHeroes) localStorage.setItem('favoriteHeroesFinal', parsed.favoriteHeroes);
        if (parsed.autoState) localStorage.setItem('heroAutoState', parsed.autoState);
        
        // Директно задаване на HP при зареждане (за всеки нает герой)
        function setHeroHP(hero) {
            if (!hero) return;
            let endurance = hero.skills?.endurance || 0;
            hero.maxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
            if (!hero.hp || isNaN(hero.hp) || hero.hp > hero.maxHp) hero.hp = hero.maxHp;
            if (typeof hero.isAlive === 'undefined') hero.isAlive = true;
        }
        if (window.currentHero) setHeroHP(window.currentHero);
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined === true) setHeroHP(hero);
        }
        if (window.companions) window.companions.forEach(comp => setHeroHP(comp));
        
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        if (window.updateTimeUI) window.updateTimeUI();
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо!");
        }
        
        if (window.gameMode === 'solo' && typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        }
        if (typeof window.ensureHeroesHavePortraits === 'function') {
            window.ensureHeroesHavePortraits();
        }
        
        return true;
    } catch (e) {
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

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
            console.log(`🎨 Генериране на портрет за ${hero.name}...`);
            try {
                if (typeof window.generateHeroPortrait === 'function') {
                    await window.generateHeroPortrait(hero);
                    window.saveGreatBulgariaGame();
                    await new Promise(r => setTimeout(r, 500));
                }
            } catch(e) {
                console.error(`Грешка при портрет за ${hero.name}`, e);
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
            window.showAdvisorPopup("ГРЕШКА", "Системата за наемане не е заредена правилно.", "error");
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
