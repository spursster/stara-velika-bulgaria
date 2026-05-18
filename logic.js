/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ И ЕЛИТНАТА ЛЕНТА
 * НАДГРАДАНЕ: Автоматично свързване на worldData.clans за визуализация в ui.js и зареждане на портала.
 * Статистика на файловете в проекта: 15
 */

window.initNewGame = function() {
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
    let poolClans = ["Птолемеи", "Дуло", "Скити", "Бесараб", "Даки"];

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
};
