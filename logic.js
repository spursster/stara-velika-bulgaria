/**
 ==========================================================================
 ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 ФАЙЛ: logic.js (С ПОДДРЪЖКА ЗА АВТОМАТИЧЕН СОЛО РЕЖИМ)
 ВЕРСИЯ: 2.0 - ФИНАЛНА
 ==========================================================================
 */

// ==================== 1. СТАРТИРАНЕ ПРИ ЗАРЕЖДАНЕ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏛️ Инициализация на системата за запис на Велика България...");
    setTimeout(function() {
        const hasSave = localStorage.getItem('GreatBulgaria_SaveGame');
        if (hasSave) {
            window.showStartChoiceModal();  // Показва избор: Зареждане или Нова игра
        } else {
            window.startFreshGameLogic();   // Стартира нова игра
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
        // ==================== 3. ИЗБОР НА РЕЖИМ ====================
    let modeChoice = confirm("Изберете режим на игра:\n• OK – СОЛО РЕЖИМ (RPG приключение с един герой и спътници)\n• Cancel – КЛАСИЧЕСКИ РЕЖИМ (стратегия с множество герои)");
    window.gameMode = modeChoice ? 'solo' : 'classic';

    if (window.gameMode === 'solo') {
        console.log("🌍 Стартиране в СОЛО РЕЖИМ");

        // Премахваме всички други герои (освен главния)
        for (let key in window.worldData.clans) {
            if (key !== window.currentHero.clan) {
                window.worldData.clans[key].isJoined = false;
            }
        }

        // Настройки за соло режима
        window.currentRegion = "Плиска";
        window.companions = [];
        window.activeQuests = [];
        window.completedQuests = [];

        // Стартов куест (по желание)
        if (typeof window.addQuest === 'function') {
            window.addQuest("Първи стъпки", "Завладейте региона Плиска (той вече е ваш) или посетете съседен регион.", "100 злато + 50 XP", 1, function() { return true; });
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🌍 Добре дошли в соло режима! Изследвайте света, намирайте спътници и изпълнявайте куестове.");
        }
        
        // ⭐⭐⭐ ВАЖНО: Активиране на соло режима (добавя бутоните и функциите) ⭐⭐⭐
        if (typeof window.initSoloMode === 'function') {
            window.initSoloMode();
        } else {
            console.warn("initSoloMode не е дефинирана – соло режимът няма да се активира автоматично");
        }
    } else {
        console.log("🏰 Стартиране в КЛАСИЧЕСКИ РЕЖИМ");
    }
        // ==================== 4. ОБНОВЯВАНЕ НА ИНТЕРФЕЙСА ====================
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    // Обновяване на времето
    if (window.updateTimeUI) window.updateTimeUI();
    else {
        const timeDisplay = document.getElementById('current-time-info');
        if (timeDisplay) timeDisplay.innerHTML = "🌱 Пролет 480 г. пр.н.е.";
    }
    
    if (window.updatePortalContainerUI) window.updatePortalContainerUI();

    // Запазване на играта
    window.saveGreatBulgariaGame();
};
// ==================== 5. ЗАПАЗВАНЕ НА ИГРАТА ====================
window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    try {
        let allHeroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    allHeroes.push(clan);
                }
            }
        }
        const saveData = {
            currentHero: window.currentHero,
            unlockedLeaders: allHeroes,
            gameTime: window.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." },
            favoriteHeroes: localStorage.getItem('favoriteHeroesFinal'),
            autoState: localStorage.getItem('heroAutoState'),
            gameMode: window.gameMode,            // Запазваме режима
            currentRegion: window.currentRegion,  // Запазваме текущия регион
            companions: window.companions,        // Запазваме спътниците
            activeQuests: window.activeQuests,    // Запазваме активните куестове
            completedQuests: window.completedQuests
        };
        localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
        console.log("💾 Прогресът беше запазен успешно!");
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
        
        // Възстановяване на клановете
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

            // Премахване на дублиращи се герои
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
        
        // Обновяване на интерфейса
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        if (window.updateTimeUI) window.updateTimeUI();

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо!");
        }
        
        // АКО Е СОЛО РЕЖИМ, АКТИВИРАМЕ ГО ОТНОВО
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
// ==================== 8. СТАРТОВ МОДАЛЕН ПРОЗОРЕЦ ====================
window.showStartChoiceModal = function() {
    let choiceModal = document.getElementById('start-choice-modal');
    if (!choiceModal) {
        choiceModal = document.createElement('div');
        choiceModal.id = 'start-choice-modal';
        document.body.appendChild(choiceModal);
    }
    choiceModal.style.position = 'fixed';
    choiceModal.style.top = '0';
    choiceModal.style.left = '0';
    choiceModal.style.width = '100vw';
    choiceModal.style.height = '100vh';
    choiceModal.style.backgroundColor = 'rgba(5, 5, 5, 0.98)';
    choiceModal.style.zIndex = '100000';
    choiceModal.style.display = 'flex';
    choiceModal.style.justifyContent = 'center';
    choiceModal.style.alignItems = 'center';
    choiceModal.style.fontFamily = "'Cinzel', serif";

    choiceModal.innerHTML = `
        <div style="background: #111; border: 3px solid #d4af37; border-radius: 12px; padding: 40px; text-align: center; max-width: 450px; box-shadow: 0 0 50px rgba(212,175,55,0.2);">
            <h2 style="color: #ffd700; margin-top: 0; letter-spacing: 2px; font-size: 22px;">ВЕЛИКА БЪЛГАРИЯ</h2>
            <p style="color: #aaa; font-size: 14px; margin-bottom: 30px; line-height: 1.6;">Открит е съществуващ прогрес на Вашето царство в паметта на браузъра. Как желаете да постъпите?</p>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; font-weight: bold; border: 1px solid #fff; padding: 14px; border-radius: 6px; cursor: pointer; font-size: 14px; letter-spacing: 1px; font-family: 'Cinzel', serif;" 
                       onclick="window.handleStartChoice('load')">
                   🏰 ПРОДЪЛЖИ ЦАРСТВОТО
                </button>
                <button style="background: #222; color: #ff3366; font-weight: bold; border: 1px solid #ff3366; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 13px; letter-spacing: 1px; font-family: 'Cinzel', serif;" 
                       onclick="window.handleStartChoice('fresh')">
                   ⚔️ ЗАПОЧНИ НАЧИСТО
                </button>
            </div>
        </div>
    `;
};
// ==================== 9. ИЗБОР ОТ СТАРТОВИЯ ПРОЗОРЕЦ ====================
window.handleStartChoice = function(action) {
    const choiceModal = document.getElementById('start-choice-modal');
    if (choiceModal) choiceModal.remove();
    if (action === 'load') {
        window.loadGreatBulgariaGame();  // Зареждане на запазена игра
    } else {
        // Изтриване на старите данни и нова игра
        localStorage.removeItem('GreatBulgaria_SaveGame');
        localStorage.removeItem('favoriteHeroesFinal');
        localStorage.removeItem('heroAutoState');
        localStorage.removeItem('barracksFavorites');
        window.startFreshGameLogic();
    }
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
