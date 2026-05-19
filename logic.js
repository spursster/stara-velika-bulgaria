/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ И ЕЛИТНАТА ЛЕНТА
 * НАДГРАДАНЕ: Интегриран стартов диалог (Продължи / Нова Игра) за избягване на конфликти с таймера.
 * КОРЕКЦИЯ: Премахнати фиктивни родове от механата и заменени с реални кланове.
 * Статистика на файловете в проекта: 15
 */

window.initNewGame = function() {
    // Проверяваме дали изобщо съществува запис в браузъра
    const hasSave = localStorage.getItem('GreatBulgaria_SaveGame');

    if (hasSave) {
        // Ако има запис, извеждаме красив стартов прозорец за избор
        window.showStartChoiceModal();
    } else {
        // Ако няма запис, директно стартираме чисто нова игра
        window.startFreshGameLogic();
    }
};

// Функция, която съдържа чистата първоначална логика за старт
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

    // Създаване на главния герой на играча
    window.currentHero = {
        name: selectedName, 
        clan: selectedClan,
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 50, 
        techLevel: 1,
        level: 1,
        xp: 0,
        storedXP: 0,
        isAuto: true,
        equipment: Array(9).fill(null),
        skills: {}
    };

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    // Първоначално изчертаване на Портала при старт
    if (window.updatePortalContainerUI) {
        window.updatePortalContainerUI();
    }

    // Правим първоначален чист запис
    if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
};

window.buyHeroFromTavern = function() {
    if (!window.currentHero) return;

    let heroCost = 500;

    if (window.currentHero.gold < heroCost) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато за нов водач!");
        }
        return;
    }

    let poolNames = ["Птолемей I Сотер", "Аспарух", "Тервел", "Крум", "Омуртаг", "Пресиян"];
    let poolClans = ["Птоломеи", "Дуло", "Комитопули", "Асеневци", "Шишмановци"];

    let randomName = poolNames[Math.floor(Math.random() * poolNames.length)];
    let randomClan = poolClans[Math.floor(Math.random() * poolClans.length)];

    let purchasedHero = {
        hero: randomName, 
        name: randomName,
        clan: randomClan,
        level: 2, 
        xp: 0,
        heroPower: 220,
        gold: 300,
        armySize: 150,
        age: 32,
        currentClass: "Багатур",
        isAuto: false,
        storedXP: 0,
        equipment: Array(9).fill(null),
        skills: {}
    };

    window.currentHero.gold -= heroCost;

    if (!window.unlockedHeroes) window.unlockedHeroes = [];
    window.unlockedHeroes.push(purchasedHero);

    if (window.worldData && window.worldData.clans) {
        window.worldData.clans[randomClan] = purchasedHero;
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`👑 МЕХАНА: Новият водач ${randomName} от род ${randomClan} се присъедини!`);
    }

    if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
};

// =======================================================================
// НОВ ИНСТРУМЕНТ: СТАРТОВ МОДАЛЕН ПРОЗОРЕЦ ЗА ИЗБОР НА ИГРАЧА
// =======================================================================

window.showStartChoiceModal = function() {
    let choiceModal = document.getElementById('start-choice-modal');
    if (!choiceModal) {
        choiceModal = document.createElement('div');
        choiceModal.id = 'start-choice-modal';
        choiceModal.className = 'fullscreen-overlay';
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

window.handleStartChoice = function(action) {
    const choiceModal = document.getElementById('start-choice-modal');
    if (choiceModal) choiceModal.remove();

    if (action === 'load') {
        window.loadGreatBulgariaGame();
    } else {
        window.clearGreatBulgariaSaveWithoutReload();
        window.startFreshGameLogic();
    }
};

// =======================================================================
// ИНСТРУМЕНТ: ЗАЩИТЕНА СИСТЕМА ЗА АВТОМАТИЧНО ЗАПАЗВАНЕ И ЗАРЕЖДАНЕ
// =======================================================================

window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    try {
        const saveData = {
            currentHero: window.currentHero,
            unlockedHeroes: window.unlockedHeroes || []
        };
        localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
        console.log("💾 Прогресът беше запазен!");
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
        
        if (window.worldData && window.worldData.clans) {
            window.unlockedHeroes.forEach(hero => {
                if (hero && hero.clan) {
                    window.worldData.clans[hero.clan] = hero;
                }
            });
        }
        
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо!");
        }
        return true;
    } catch (e) {
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

window.clearGreatBulgariaSaveWithoutReload = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
};

window.clearGreatBulgariaSave = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    location.reload();
};
