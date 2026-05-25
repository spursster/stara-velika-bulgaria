/**
 ==========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (ВЕРСИЯ 3.0 - СЛУЧАЕН ГЕРОЙ, НУЛИРАНЕ НА ФЛАГОВЕ, РАВНОПОСТАВЕНИ ГЕРОИ)
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
    // Вземаме всички владетели от всички династии (дефинирани в database.js)
    if (!window.bulgarianDynasties) {
        console.error("bulgarianDynasties не е зареден! Използвам резервен герой.");
        return { name: "Кубрат", clan: "Дуло", power: 130, gold: 1500, armySize: 400 };
    }
    
    let allRulers = [];
    let rulerToDynasty = {};
    
    for (let dynastyName in window.bulgarianDynasties) {
        let rulers = window.bulgarianDynasties[dynastyName].rulers;
        if (rulers && rulers.length) {
            for (let ruler of rulers) {
                allRulers.push(ruler);
                rulerToDynasty[ruler] = dynastyName;
            }
        }
    }
    
    if (allRulers.length === 0) {
        return { name: "Кубрат", clan: "Дуло", power: 130, gold: 1500, armySize: 400 };
    }
    
    let randomName = allRulers[Math.floor(Math.random() * allRulers.length)];
    let dynasty = rulerToDynasty[randomName];
    
    // Еднакви базови стойности за ВСИЧКИ герои (без "легендарни" бонуси)
    let power = 130;
    let gold = 1500;
    let army = 400;
    
    return {
        name: randomName,
        clan: dynasty,
        power: power,
        gold: gold,
        armySize: army,
        currentArmy: army,
        heroPower: power
    };
}

window.startFreshGameLogic = function() {
 // В startFreshGameLogic, след като сте създали window.worldData и window.worldData.clans (но преди да създадете currentHero)
function initializeAllHeroesFromDatabase() {
    if (!window.bulgarianDynasties) return;
    const allHeroes = {};
    for (let dynastyName in window.bulgarianDynasties) {
        const rulers = window.bulgarianDynasties[dynastyName].rulers;
        for (let ruler of rulers) {
            const heroId = `hero_${dynastyName}_${ruler.replace(/\s/g, '_')}`;
            // Проверяваме дали вече съществува (за да не дублираме)
            if (!window.worldData.clans[heroId]) {
                // Базови статистики – могат да се разнообразят според силата на владетеля
                let power = 100;
                let gold = 1000;
                let armySize = 200;
                let className = "Воевода";
                if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(ruler)) {
                    power = 180; gold = 2000; armySize = 400; className = "Легенда";
                } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(ruler)) {
                    power = 150; gold = 1500; armySize = 300; className = "Герой";
                }
                const hero = {
                    name: ruler,
                    leaderName: ruler,
                    clan: dynastyName,
                    isJoined: false,          // ⭐ Не е нает – чака в кръчмата
                    isFavoriteInBarracks: false,
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
    }
    console.log(`✅ Инициализирани ${Object.keys(window.worldData.clans).length} герои от database.js`);
}

// Извикайте функцията в startFreshGameLogic, след като worldData.clans е готов (но преди да добавите currentHero)
initializeAllHeroesFromDatabase();
    // ----- 1. СЛУЧАЕН ГЕРОЙ -----
    let heroData = getRandomHeroFromDatabase();
    let selectedName = heroData.name;
    let selectedClan = heroData.clan;
    let startGold = heroData.gold;
    let startArmy = heroData.armySize;
    let startPower = heroData.heroPower;

    // ----- 2. НУЛИРАНЕ НА ВСИЧКИ ФЛАГОВЕ В WORLD DATA -----
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    
    // Обхождаме всички съществуващи кланове (от world_data.js) и ги нулираме
    for (let key in window.worldData.clans) {
        let clan = window.worldData.clans[key];
        if (clan) {
            clan.isJoined = false;
            clan.isFavoriteInBarracks = false;
        }
    }
    
    // Ако има други обекти (напр. от предишна игра) – изтриваме всички, за да започнем начисто
    // Но запазваме структурата, защото worldData.clans идва от world_data.js
    // Просто гарантираме, че няма остатъчни флагове.

    // ----- 3. СЪЗДАВАНЕ НА АКТИВНИЯ ГЕРОЙ -----
    window.currentHero = {
        name: selectedName,
        clan: selectedClan,
        gold: startGold,
        armySize: startArmy,
        currentArmy: startArmy,
        heroPower: startPower,
        age: 30 + Math.floor(Math.random() * 31),  // случайна възраст 30-60
        techLevel: 1,
        level: 1,
        xp: 0,
        storedXP: 0,
        isAuto: true,
        skillPoints: 0,
        equipment: Array(12).fill(null),
        skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
        inventory: Array(12).fill(null),
        isFavoriteInBarracks: true,   // само активният е любим
        isJoined: true
    };

     // Автоматично генериране на портрет за активния герой (асинхронно)
    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(window.currentHero).catch(e => console.warn(e));
    }

    // ----- 4. ДОБАВЯНЕ В WORLD DATA -----
    window.worldData.clans[selectedClan] = window.currentHero;
    window.unlockedLeaders = [window.currentHero];

    // ----- 5. ИЗЧИСТВАНЕ НА LOCALSTORAGE -----
    const favorites = [selectedName];
    localStorage.setItem('barracksFavorites', JSON.stringify(favorites));
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');
    // (GreatBulgaria_SaveGame ще се запази след малко)

    // ----- 6. ВРЕМЕ -----
    window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };

    // ----- 7. ГЕНЕРИРАНЕ НА РЕГИОНИ (ако има функция) -----
    if (typeof window.generateProceduralRegions === 'function') {
        window.generateProceduralRegions(30, true);
    } else {
        console.warn("generateProceduralRegions не е дефинирана – пропускам генерирането.");
    }

 // след като регионите са готови (в startFreshGameLogic)
if (typeof window.buildRegionConnections === 'function') {
    window.buildRegionConnections();
}

    // ----- 8. РЕЖИМ НА ИГРА -----
    if (!window.gameMode) {
        window.gameMode = 'classic';
    }

    if (window.gameMode === 'solo') {
        console.log("🌍 Стартиране в СОЛО РЕЖИМ със случаен герой:", selectedName);
        // В соло режим деактивираме всички други кланове (освен активния)
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
            window.addQuest("Първи стъпки", "Завладейте региона Плиска (той вече е ваш) или посетете съседен регион.", "100 злато + 50 XP", 1, function() { return true; });
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🌍 Добре дошли, ${selectedName} от рода ${selectedClan}! Изследвайте света, намирайте спътници и изпълнявайте куестове.`);
        }
        
        if (typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        } else {
            console.warn("initSoloMode не е дефинирана");
        }
    } else {
        console.log("🏰 Стартиране в КЛАСИЧЕСКИ РЕЖИМ със случаен герой:", selectedName);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🏰 Вие сте ${selectedName} от могъщия род ${selectedClan}. Водихте народа си към нова ера!`);
        }
    }

    // ----- 9. ОБНОВЯВАНЕ НА UI -----
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    if (window.updateTimeUI) window.updateTimeUI();
    else {
        const timeDisplay = document.getElementById('current-time-info');
        if (timeDisplay) timeDisplay.innerHTML = "🌱 Пролет 480 г. пр.н.е.";
    }
    
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    // ----- 10. ЗАПАЗВАНЕ НА ИГРАТА -----
    window.saveGreatBulgariaGame();
};

// ==================== ОСТАНАЛИТЕ ФУНКЦИИ (ЗАПАЗВАНЕ/ЗАРЕЖДАНЕ) ОСТАВЯМЕ БЕЗ ПРОМЯНА ====================

window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    try {
        let allHeroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    let heroCopy = { ...clan };
                    if (clan.portrait) heroCopy.portrait = clan.portrait;
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
            unlockedLeaders: allHeroes,
            gameTime: window.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." },
            favoriteHeroes: localStorage.getItem('favoriteHeroesFinal'),
            autoState: localStorage.getItem('heroAutoState'),
            gameMode: window.gameMode,
            currentRegion: window.currentRegion,
            companions: companionsCopy,
            activeQuests: window.activeQuests,
            completedQuests: window.completedQuests
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
        window.unlockedLeaders = parsed.unlockedLeaders || [];
        window.gameTime = parsed.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." };
        window.gameMode = parsed.gameMode || 'classic';
        window.currentRegion = parsed.currentRegion || "Плиска";
        window.companions = parsed.companions || [];
        window.activeQuests = parsed.activeQuests || [];
        window.completedQuests = parsed.completedQuests || [];
        
        // ========== НОРМАЛИЗИРАНЕ НА playerRegions ==========
        let rawRegions = parsed.playerRegions || [];
        if (Array.isArray(rawRegions)) {
            let normalized = [];
            for (let item of rawRegions) {
                if (Array.isArray(item)) {
                    // ако е масив, взимаме всички низове от него
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
        // Ако няма запазени региони, но има текущ регион – добавяме го (по избор)
        if (window.playerRegions.length === 0 && window.currentRegion) {
            window.playerRegions.push(window.currentRegion);
        }
        // ====================================================
        
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                if (!window.worldData.clans[key].isJoined && key !== window.currentHero?.clan) {
                    let found = window.unlockedLeaders.some(h => h.clan === key || h.name === key);
                    if (!found && key !== window.currentHero?.clan) {
                        delete window.worldData.clans[key];
                    }
                }
            }
            window.unlockedLeaders.forEach(hero => {
                if (hero && hero.clan) {
                    window.worldData.clans[hero.clan] = hero;
                    window.worldData.clans[hero.clan].isJoined = true;
                }
            });

            const uniqueClans = new Map();
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                let name = clan.leaderName || clan.name || key;
                if (!uniqueClans.has(name)) {
                    uniqueClans.set(name, clan);
                } else {
                    delete window.worldData.clans[key];
                    console.log(`Премахнат дублиращ се герой при зареждане: ${name}`);
                }
            }
        }
        
        // Възстановяване на портретите от запазените данни
        if (parsed.unlockedLeaders) {
            parsed.unlockedLeaders.forEach(savedHero => {
                if (savedHero.portrait) {
                    for (let key in window.worldData.clans) {
                        let clan = window.worldData.clans[key];
                        if (clan.name === savedHero.name || clan.leaderName === savedHero.name) {
                            clan.portrait = savedHero.portrait;
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
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
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
                 await new Promise(r => setTimeout(r, 500)); // половин секунда пауза между портретите
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
        alert("Системата за наемане не е заредена правилно.");
    }
};
window.buyNewHero = window.buyHeroFromTavern;

window.showStartChoiceModal = function() {
    // Запазена за съвместимост, но не се използва
};

window.handleStartChoice = function(action) {
    // Запазена за съвместимост
};

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
