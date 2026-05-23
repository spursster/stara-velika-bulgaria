/**
 ==========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (С ПОДДРЪЖКА ЗА НОВО МЕНЮ)
 ВЕРСИЯ: 2.2 - БЕЗ ИСКАЩИ ПРОЗОРЦИ
 ==========================================================================
 */

// ==================== 1. СТАРТИРАНЕ ПРИ ЗАРЕЖДАНЕ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏛️ Инициализация на системата за запис на Велика България...");
    setTimeout(function() {
        const hasSave = localStorage.getItem('GreatBulgaria_SaveGame');
        if (hasSave) {
            // Директно зареждане без въпроси
            if (typeof window.loadGreatBulgariaGame === 'function') {
                window.loadGreatBulgariaGame();
            }
        } else {
            window.startFreshGameLogic();
        }
    }, 150);
});

window.initNewGame = function() {};

// ==================== 2. НОВА ИГРА ====================
window.startFreshGameLogic = function() {
    // ----- 2.1 Избор на случаен герой и клан -----
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

    // ----- 2.2 Създаване на главния герой -----
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
        isFavoriteInBarracks: true
    };

    window.unlockedLeaders = [window.currentHero];

    // ----- 2.3 Записване в световните данни -----
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[selectedClan] = window.currentHero;

    const favorites = [selectedName];
    localStorage.setItem('barracksFavorites', JSON.stringify(favorites));

    // ----- 2.4 Начално време -----
    window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };

    // ----- 2.5 Генериране на процедурни региони -----
    if (typeof window.generateProceduralRegions === 'function') {
        window.generateProceduralRegions(30, true);
    } else {
        console.warn("generateProceduralRegions не е дефинирана – пропускам генерирането.");
    }

    // ==================== 3. ИЗБОР НА РЕЖИМ (от менюто) ====================
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

    // ==================== 4. ОБНОВЯВАНЕ НА ИНТЕРФЕЙСА ====================
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
                    // Копираме, за да включим portrait, ако съществува
                    let heroCopy = { ...clan };
                    if (clan.portrait) heroCopy.portrait = clan.portrait;
                    allHeroes.push(heroCopy);
                }
            }
        }
        // Добавяме и companions (ако са в отделен масив)
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
        console.log("💾 Прогресът беше запазен успешно (включително портрети).");
    } catch (e) {
        console.error(e);
    }
};

// ==================== 6. ЗАРЕЖДАНЕ НА ЗАПАЗЕНА ИГРА ====================
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

// ==================== 7. НАЕМАНЕ НА ГЕРОЙ ====================
window.buyHeroFromTavern = function() {
    if (typeof window.hireNewHero === 'function') {
        window.hireNewHero();
    } else {
        console.error("hireNewHero не е дефинирана!");
        alert("Системата за наемане не е заредена правилно.");
    }
};
window.buyNewHero = window.buyHeroFromTavern;

// ==================== 8. СТАРТОВ МОДАЛЕН ПРОЗОРЕЦ (ЗАПАЗЕН, НО НЕ СЕ ИЗПОЛЗВА) ====================
window.showStartChoiceModal = function() {
    // Функцията е запазена, но не се извиква никъде
};

// ==================== 9. ИЗБОР ОТ СТАРТОВИЯ ПРОЗОРЕЦ ====================
window.handleStartChoice = function(action) {
    // Запазена за съвместимост, но не се използва
};

// ==================== 10. ИЗЧИСТВАНЕ НА ЗАПАЗЕНИТЕ ДАННИ ====================
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
