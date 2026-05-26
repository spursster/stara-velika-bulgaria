/**
 ==========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (ВЕРСИЯ 4.0 – ХАРМОНИЗИРАН, ВСИЧКИ СА ГЕРОИ)
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
    if (!window.bulgarianClans && !window.bulgarianDynasties) {
        console.error("bulgarianClans не е зареден! Използвам резервен герой.");
        return { name: "Кубрат", clan: "Дуло", power: 130, gold: 1500, armySize: 400 };
    }
    // Използваме bulgarianClans (който е alias на bulgarianDynasties за съвместимост)
    const clans = window.bulgarianClans || window.bulgarianDynasties;
    let allHeroes = [];
    let heroToClan = {};
    for (let clanName in clans) {
        let heroesList = clans[clanName].heroes || clans[clanName].rulers;
        if (heroesList && heroesList.length) {
            for (let hero of heroesList) {
                allHeroes.push(hero);
                heroToClan[hero] = clanName;
            }
        }
    }
    if (allHeroes.length === 0) {
        return { name: "Кубрат", clan: "Дуло", power: 130, gold: 1500, armySize: 400 };
    }
    let randomName = allHeroes[Math.floor(Math.random() * allHeroes.length)];
    let clan = heroToClan[randomName];
    return {
        name: randomName,
        clan: clan,
        power: 130,
        gold: 1500,
        armySize: 400,
        currentArmy: 400,
        heroPower: 130
    };
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
    console.log("🔄 startFreshGameLogic извикана (версия за мобилни устройства)");

    // 1. Подготовка на worldData и clans
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};

    // 2. Инициализираме всички герои от базата (ако още не са)
    if (typeof initializeAllHeroesFromDatabase === 'function') {
        initializeAllHeroesFromDatabase();
    } else {
        console.warn("initializeAllHeroesFromDatabase липсва, опитваме ръчно зареждане");
        // Ако функцията липсва, използваме bulgarianClans директно
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

    // 3. Нулиране на флаговете на всички герои (всички стават ненаети)
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero) {
            hero.isJoined = false;
            hero.isFavorite = false;
        }
    }

    // 4. Избираме случаен герой от базата
    let heroData = getRandomHeroFromDatabase();
    let selectedName = heroData.name;
    let selectedClan = heroData.clan;
    console.log(`🎲 Избран случаен герой: ${selectedName} от род ${selectedClan}`);

    // Търсим съществуващ герой със същото име и клан
    let existingHero = null;
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.name === selectedName && h.clan === selectedClan) {
            existingHero = h;
            break;
        }
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
    } else {
        // Ако не съществува (рядко), създаваме нов
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
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(window.currentHero);
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(window.currentHero);
        const heroId = `hero_${selectedClan}_${selectedName.replace(/\s/g, '_')}`;
        window.worldData.clans[heroId] = window.currentHero;
    }

    // 5. Генериране на портрет за активния герой (асинхронно, не блокира)
    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(window.currentHero).catch(e => console.warn(e));
    }

    // 6. ФИЛТЪР – премахваме всички останали наети герои освен activeHero
    let heroesToRemove = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero !== window.currentHero && hero.isJoined === true) {
            hero.isJoined = false;
            hero.isFavorite = false;
            heroesToRemove.push(hero.name);
        }
    }
    if (heroesToRemove.length > 0) {
        console.log(`❗ Премахнати допълнителни наети герои: ${heroesToRemove.join(', ')}`);
    }

    // 7. Инициализираме списъка с отключени герои (само активния)
    window.unlockedHeroes = [window.currentHero];

    // 8. Изчистване на localStorage от стари любимци
    localStorage.setItem('barracksFavorites', JSON.stringify([window.currentHero.name]));
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');

    // 9. Време
    window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };

    // 10. Генериране на региони
    if (typeof window.generateProceduralRegions === 'function') {
        window.generateProceduralRegions(30, true);
    } else {
        console.warn("generateProceduralRegions не е дефинирана – пропускам генерирането.");
    }

    // 11. Свързаност на регионите
    if (typeof window.buildRegionConnections === 'function') {
        window.buildRegionConnections();
    }

    // 12. Режим на игра
    if (!window.gameMode) window.gameMode = 'classic';

    if (window.gameMode === 'solo') {
        console.log("🌍 Стартиране в СОЛО РЕЖИМ със случаен герой:", window.currentHero.name);
        for (let key in window.worldData.clans) {
            if (key !== window.currentHero.clan) {
                window.worldData.clans[key].isJoined = false;
            }
        }
        window.currentRegion = "Плиска";
        window.companions = [];
        window.activeQuests = [];
        window.completedQuests = [];
        if (typeof window.addQuest === 'function') {
            window.addQuest({ title: "Първи стъпки", description: "Завладейте региона Плиска или посетете съседен регион.", reward: { gold: 100, xp: 50 } });
        }
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🌍 Добре дошли, ${window.currentHero.name} от рода ${window.currentHero.clan}! Изследвайте света, намирайте спътници и изпълнявайте куестове.`);
        }
        if (typeof window.initSoloMode === 'function') window.initSoloMode();
    } else {
        console.log("🏰 Стартиране в КЛАСИЧЕСКИ РЕЖИМ със случаен герой:", window.currentHero.name);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🏰 Вие сте ${window.currentHero.name} от могъщия род ${window.currentHero.clan}. Водихте народа си към нова ера!`);
        }
    }

    // 13. Обновяване на UI
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (window.updateTimeUI) window.updateTimeUI();
    else {
        const timeDisplay = document.getElementById('current-time-info');
        if (timeDisplay) timeDisplay.innerHTML = "🌱 Пролет 480 г. пр.н.е.";
    }
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    // 14. Запазване
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
        
        // Нормализиране на playerRegions
        let rawRegions = parsed.playerRegions || [];
        if (Array.isArray(rawRegions)) {
            let normalized = [];
            for (let item of rawRegions) {
                if (Array.isArray(item)) {
                    for (let sub of item) {
                        if (typeof sub === 'string') normalized.push(sub);
                    }
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
            // Премахване на дублиращи се имена
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
        
        // Възстановяване на портретите
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
