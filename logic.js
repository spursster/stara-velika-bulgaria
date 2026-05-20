/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: logic.js (ГЛАВНА ЛОГИКА, ИНИЦИАЛИЗАЦИЯ И ЗАПАЗВАНЕ)
СТАТУС: ОБНОВЕН - СИНХРОНИЗИРАН С НОВАТА СИСТЕМА (12 СЛОТА, hireNewHero)
==========================================================================
*/

// Автоматичен спусък при зареждане на страницата
document.addEventListener('DOMContentLoaded', function() {
    console.log("🏛️ Инициализация на системата за запис на Велика България...");
    setTimeout(function() {
        const hasSave = localStorage.getItem('GreatBulgaria_SaveGame');
        if (hasSave) {
            window.showStartChoiceModal();
        } else {
            window.startFreshGameLogic();
        }
    }, 150);
});

window.initNewGame = function() {
    // Поддържа се за съвместимост с HTML
};

// Функция за стартиране на чисто нова игра
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

    // ✅ ОБНОВЕНО: 12 слота вместо 9
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
        equipment: Array(12).fill(null),  // 12 слота (беше 9)
        skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
        inventory: Array(12).fill(null)
    };

    // Подсигуряваме оригиналния масив от базата данни
    window.unlockedLeaders = [window.currentHero];

    if (window.worldData && window.worldData.clans) {
        window.worldData.clans[selectedClan] = window.currentHero;
    }

    // Задаване на историческото време: 480 г. пр.н.е.
    window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };

    // Обновяваме целия графичен интерфейс
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    // Обновяваме адаптивната лента (ако съществува)
    if (typeof window.renderSingleBar === 'function') {
        window.renderSingleBar();
    }

    if (window.updateTimeUI) {
        window.updateTimeUI();
    } else {
        const timeDisplay = document.getElementById('current-time-info');
        if (timeDisplay) timeDisplay.innerHTML = "🌱 Пролет 480 г. пр.н.е.";
    }

    if (window.updatePortalContainerUI) {
        window.updatePortalContainerUI();
    }

    // Извършваме чист първоначален запис
    window.saveGreatBulgariaGame();
};

// =======================================================================
// ЗАПАЗВАНЕ И ЗАРЕЖДАНЕ - ОБНОВЕНИ ЗА 12 СЛОТА И worldData.clans
// =======================================================================
window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    try {
        // Записваме всички герои от worldData.clans
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
            unlockedLeaders: allHeroes,  // Записваме всички отключени герои
            gameTime: window.gameTime || { seasonIndex: 0, year: 480, era: "пр.н.е." },
            favoriteHeroes: localStorage.getItem('favoriteHeroesFinal'),
            autoState: localStorage.getItem('heroAutoState')
        };
        localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
        console.log("💾 Прогресът беше запазен успешно! (включва всички герои)");
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
        
        // Възстановяваме всички герои в worldData.clans
        if (window.worldData && window.worldData.clans) {
            // Първо изчистваме несъществуващите
            for (let key in window.worldData.clans) {
                if (!window.worldData.clans[key].isJoined && key !== window.currentHero?.clan) {
                    // Запазваме само ако са в запазените
                    let found = window.unlockedLeaders.some(h => h.clan === key || h.name === key);
                    if (!found && key !== window.currentHero?.clan) {
                        delete window.worldData.clans[key];
                    }
                }
            }
            // Добавяме/обновяваме запазените герои
            window.unlockedLeaders.forEach(hero => {
                if (hero && hero.clan) {
                    window.worldData.clans[hero.clan] = hero;
                    window.worldData.clans[hero.clan].isJoined = true;
                }
            });
        }
        
        // Възстановяваме любимите и AUTO състоянието
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
        return true;
    } catch (e) {
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

// =======================================================================
// ОРИГИНАЛНИТЕ ФУНКЦИИ ЗА НАЕМАНЕ - ПРЕНАСОЧВАТ КЪМ НОВАТА СИСТЕМА
// =======================================================================
window.buyHeroFromTavern = function() {
    // Пренасочваме към новата функция hireNewHero (от ui.js)
    if (typeof window.hireNewHero === 'function') {
        window.hireNewHero();
    } else {
        console.error("hireNewHero не е дефинирана!");
        alert("Системата за наемане не е заредена правилно.");
    }
};

// СИНХРОНИЗАЦИОНЕН МОСТ
window.buyNewHero = window.buyHeroFromTavern;

// =======================================================================
// ИНСТРУМЕНТ: СТАРТОВ МОДАЛЕН ПРОЗОРЕЦ ЗА ИЗБОР НА ИГРАЧА
// =======================================================================
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

// Самостоятелна функция за обработка на избора без външни зависимости
window.handleStartChoice = function(action) {
    const choiceModal = document.getElementById('start-choice-modal');
    if (choiceModal) choiceModal.remove();
    if (action === 'load') {
        window.loadGreatBulgariaGame();
    } else {
        // Директно изчистване на стария прогрес на място, за да няма сривове
        localStorage.removeItem('GreatBulgaria_SaveGame');
        localStorage.removeItem('favoriteHeroesFinal');
        localStorage.removeItem('heroAutoState');
        window.startFreshGameLogic();
    }
};

window.clearGreatBulgariaSaveWithoutReload = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');
};

window.clearGreatBulgariaSave = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    localStorage.removeItem('favoriteHeroesFinal');
    localStorage.removeItem('heroAutoState');
    location.reload();
};
