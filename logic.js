/**
 ==========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (С ПОДДРЪЖКА ЗА ПОРТРЕТИ НА ГЕРОИ)
 ВЕРСИЯ: 2.3 - ПОРТРЕТИ ОТ POLLINATIONS.AI
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

window.initNewGame = function() {};

window.startFreshGameLogic = function() {
    let selectedName = "Кубрат";
    let selectedClan = "Дуло";

    if (window.clans) {
        const clanKeys = Object.keys(window.clans);
        if (clanKeys.length > 0) {
            selectedClan = clanKeys[Math.floor(Math.random() * clanKeys.length)];
            const heroesList = window.clans[selectedClan].heroes;
            if (heroesList && heroesList.length > 0) {
                selectedName = heroesList[Math.floor(Math.random() * heroesList.length)];
            }
        }
    }

    // ========== НАЧАЛО НА ПОПРАВКАТА ==========
    // 1. Нулираме флаговете на всички кланове (и в worldData.clans, и във всички обекти)
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan) {
                clan.isJoined = false;
                clan.isFavoriteInBarracks = false;
            }
        }
    } else {
        if (!window.worldData) window.worldData = {};
        if (!window.worldData.clans) window.worldData.clans = {};
    }

    // 2. Създаваме активния герой
    window.currentHero = {
        name: selectedName, 
        clan: selectedClan,
        gold: 1500,
        armySize: 500,
        currentArmy: 500,
        heroPower: 150,
        age: 50, 
        techLevel: 1,
        level: 1,
        xp: 0,
        storedXP: 0,
        isAuto: true,
        skillPoints: 0,
        equipment: Array(12).fill(null),
        skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
        inventory: Array(12).fill(null),
        isFavoriteInBarracks: true,   // само активният герой е любим
        isJoined: true
    };

    // 3. Добавяме активния герой в worldData.clans
    window.worldData.clans[selectedClan] = window.currentHero;

    // 4. Запазваме списъка с любими само с името на активния герой
    const favorites = [selectedName];
    localStorage.setItem('barracksFavorites', JSON.stringify(favorites));

    // 5. Задължително изтриваме и другите ключове, свързани с любими (за всеки случай)
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');

    window.unlockedLeaders = [window.currentHero];
    // ========== КРАЙ НА ПОПРАВКАТА ==========

    window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };

    if (typeof window.generateProceduralRegions === 'function') {
        window.generateProceduralRegions(30, true);
    } else {
        console.warn("generateProceduralRegions не е дефинирана – пропускам генерирането.");
    }

    if (!window.gameMode) {
        window.gameMode = 'classic';
    }

    if (window.gameMode === 'solo') {
        console.log("🌍 Стартиране в СОЛО РЕЖИМ");

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
            window.showAdvisorMsg("🌍 Добре дошли в соло режима! Изследвайте света, намирайте спътници и изпълнявайте куестове.");
        }
        
        if (typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        } else {
            console.warn("initSoloMode не е дефинирана");
        }
    } else {
        console.log("🏰 Стартиране в КЛАСИЧЕСКИ РЕЖИМ");
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    if (window.updateTimeUI) window.updateTimeUI();
    else {
        const timeDisplay = document.getElementById('current-time-info');
        if (timeDisplay) timeDisplay.innerHTML = "🌱 Пролет 480 г. пр.н.е.";
    }
    
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    window.saveGreatBulgariaGame();
};

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
        
        return true;
    } catch (e) {
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
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
