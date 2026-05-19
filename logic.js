/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ И ЕЛИТНАТА ЛЕНТА
 * НАДГРАДАНЕ: Защитена Auto-Save & Load система, съвместима с таймера за време.
 * КОРЕКЦИЯ: Премахнати фиктивни родове от механата и заменени с реални кланове.
 * Статистика на файловете в проекта: 15
 */

window.initNewGame = function() {
    // ПРОВЕРКА ЗА ЗАПИС: Първо се опитваме да заредим стара игра
    if (window.loadGreatBulgariaGame && window.loadGreatBulgariaGame()) {
        return; // Ако има успешен запис, спираме дотук
    }

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

    // Първоначално запазване при стартиране на нова игра
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

    // Добавяне в света, за да се класира в Топ 6 елитната лента веднага
    if (window.worldData && window.worldData.clans) {
        window.worldData.clans[randomClan] = purchasedHero;
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`👑 МЕХАНА: Новият водач ${randomName} от род ${randomClan} се присъедини!`);
    }

    // Автоматично запазване след покупка на герой
    if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
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
        console.log("💾 Прогресът на Велика България беше запазен успешно!");
    } catch (e) {
        console.error("Грешка при запис:", e);
    }
};

window.loadGreatBulgariaGame = function() {
    const saved = localStorage.getItem('GreatBulgaria_SaveGame');
    if (!saved) return false; 
    
    try {
        const parsed = JSON.parse(saved);
        
        // Подсигуряване на коректни обекти
        if (!parsed.currentHero || !parsed.currentHero.name) {
            localStorage.removeItem('GreatBulgaria_SaveGame'); // Трие дефектния запис
            return false;
        }

        window.currentHero = parsed.currentHero;
        window.unlockedHeroes = parsed.unlockedHeroes || [];
        
        // Безопасно пълнене на worldData.clans без да чупим time.js
        if (window.worldData && window.worldData.clans) {
            window.unlockedHeroes.forEach(hero => {
                if (hero && hero.clan) {
                    window.worldData.clans[hero.clan] = hero;
                }
            });
        }
        
        // Обновяваме целия интерфейс
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо! Твоето царство е заредено успешно.");
        }
        return true;
    } catch (e) {
        console.error("Критична грешка при зареждане, нулиране на кеша:", e);
        localStorage.removeItem('GreatBulgaria_SaveGame');
        return false;
    }
};

window.clearGreatBulgariaSave = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    console.log("🗑️ Записът беше изтрит.");
    location.reload();
};
