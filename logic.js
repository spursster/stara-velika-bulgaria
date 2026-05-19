/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ И ЕЛИТНАТА ЛЕНТА
 * НАДГРАДАНЕ: Интегриран нов инструмент LocalStorage (Auto-Save & Load система).
 * КОРЕКЦИЯ: Премахнати фиктивни родове от механата и заменени с реални кланове.
 * Статистика на файловете в проекта: 15
 */

window.initNewGame = function() {
    // ПРОВЕРКА ЗА ЗАПИС: Първо се опитваме да заредим стара игра
    if (window.loadGreatBulgariaGame && window.loadGreatBulgariaGame()) {
        return; // Ако има запис, спираме дотук и играчът продължава оттам
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
    
    // КОРЕКЦИЯ: Използваме само реално съществуващи кланове от играта
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

    // ИНСТРУМЕНТ: Автоматично запазване след покупка на герой
    if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
};

// =======================================================================
// ИНСТРУМЕНТ: СИСТЕМА ЗА АВТОМАТИЧНО ЗАПАЗВАНЕ И ЗАРЕЖДАНЕ (LocalStorage)
// =======================================================================

window.saveGreatBulgariaGame = function() {
    if (!window.currentHero) return;
    
    const saveData = {
        currentHero: window.currentHero,
        unlockedHeroes: window.unlockedHeroes || []
    };
    
    localStorage.setItem('GreatBulgaria_SaveGame', JSON.stringify(saveData));
    console.log("💾 Прогресът на Велика България беше запазен успешно!");
};

window.loadGreatBulgariaGame = function() {
    const saved = localStorage.getItem('GreatBulgaria_SaveGame');
    if (!saved) return false; // Няма намерен запис, стартира изцяло нова игра
    
    try {
        const parsed = JSON.parse(saved);
        window.currentHero = parsed.currentHero;
        window.unlockedHeroes = parsed.unlockedHeroes || [];
        
        // Презареждаме унаследените обекти в света за Топ 6 лентата
        if (window.worldData && window.worldData.clans) {
            window.unlockedHeroes.forEach(hero => {
                if (hero.clan) {
                    window.worldData.clans[hero.clan] = hero;
                }
            });
        }
        
        // Обновяваме целия интерфейс веднага с натоварените данни
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updatePortalContainerUI) window.updatePortalContainerUI();
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("👑 Добре дошъл обратно, Воеводо! Твоето царство е заредено успешно.");
        }
        console.log("💾 Записът беше зареден успешно от LocalStorage.");
        return true;
    } catch (e) {
        console.error("Грешка при зареждане на файла:", e);
        return false;
    }
};

window.clearGreatBulgariaSave = function() {
    localStorage.removeItem('GreatBulgaria_SaveGame');
    console.log("🗑️ Записът беше изтрит. Играта ще започне на чисто при следващия рестарт.");
    location.reload();
};
