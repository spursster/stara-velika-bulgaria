/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ И ЕЛИТНАТА ЛЕНТА
 * НАДГРАДАНЕ: Автоматично свързване на worldData.clans за визуализация в ui.js.
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

    window.unlockedHeroes = [window.currentHero];

    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    window.playerRegions = [["Крим"]];
    
    // Подсигуряваме структурата на worldData за ui.js лентата
    window.worldData = window.worldData || {};
    window.worldData.clans = window.worldData.clans || {};

    // Записваме играча в базата на клановете
    window.worldData.clans[selectedClan] = window.currentHero;

    window.activeClans = {};
    if (window.clans) {
        Object.keys(window.clans).forEach(name => {
            const cData = window.clans[name];
            const botHeroName = (cData.heroes && cData.heroes[0]) || "Воевода";

            // Стара съвместимост за активни фракции
            window.activeClans[name] = {
                name: name,
                hero: botHeroName,
                gold: 800,
                armySize: 300,
                regions: 1,
                isDead: false
            };

            // Синхронизация с големия свят на worldData.clans, за да се виждат в Топ 6 елита
            if (name !== selectedClan) {
                window.worldData.clans[name] = {
                    name: botHeroName,
                    hero: botHeroName,
                    clan: name,
                    gold: 800,
                    armySize: 300,
                    heroPower: 120 + Math.floor(Math.random() * 50),
                    age: 45,
                    level: 1,
                    xp: Math.floor(Math.random() * 80),
                    storedXP: 0,
                    isAuto: true,
                    equipment: Array(9).fill(null),
                    skills: {}
                };
            }
        });
    }

    if (window.initDiplomacy) {
        window.initDiplomacy();
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
};

window.nextTurn = function() {
    if (!window.currentHero) return;

    if (window.calculateEconomy) {
        window.calculateEconomy();
    }

    if (window.gameTime) {
        window.gameTime.turn += 1;
        window.gameTime.seasonIndex += 1;
        if (window.gameTime.seasonIndex > 3) {
            window.gameTime.seasonIndex = 0;
            window.gameTime.year += 1;
        }
    }

    if (window.processClanDiplomacy) {
        window.processClanDiplomacy();
    } else if (window.activeClans) {
        Object.keys(window.activeClans).forEach(cName => {
            if (cName !== window.currentHero.clan) {
                window.activeClans[cName].gold += 50;
                if (Math.random() > 0.9) window.activeClans[cName].regions += 1;
            }
        });
    }

    if (window.triggerRandomEvent) window.triggerRandomEvent();

    if (window.updateExpeditionSystem) window.updateExpeditionSystem();
    if (window.updateExpeditionBadge) window.updateExpeditionBadge();

    // Разпределяне на опит от регионите
    if (window.playerRegions && window.gainHeroXP) {
        const flatRegions = window.playerRegions.flat();
        const totalTerritoryXP = flatRegions.length * 10;

        if (totalTerritoryXP > 0) {
            // Опит за лидера на играча
            window.gainHeroXP(window.currentHero, totalTerritoryXP);
            
            // Опит за героите в експедиция
            if (window.activeExpeditions && window.activeExpeditions.length > 0) {
                window.activeExpeditions.forEach(exp => {
                    if (exp.heroData) window.gainHeroXP(exp.heroData, totalTerritoryXP);
                });
            }

            // Даваме малко пасивен опит и на компютърните ботове за конкуренция
            if (window.worldData && window.worldData.clans) {
                Object.keys(window.worldData.clans).forEach(cKey => {
                    if (cKey !== window.currentHero.clan) {
                        const bot = window.worldData.clans[cKey];
                        window.gainHeroXP(bot, 5 + Math.floor(Math.random() * 10));
                    }
                });
            }
        }
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
};

window.processTurn = function() {
    window.nextTurn();
};

// =========================================================================
// МЕХАНИКА ЗА ЗАКУПУВАНЕ НА НОВИ ГЕРОИ
// =========================================================================
window.buyNewHero = function() {
    if (!window.currentHero) return;

    const heroCost = 1000; 

    if (window.currentHero.gold < heroCost) {
        alert(`❌ Нямате достатъчно злато! Наемането струва 💰 ${heroCost} злато.`);
        return;
    }

    let poolNames = ["Птолемей I Сотер", "Аспарух", "Тервел", "Крум", "Омуртаг", "Пресиян"];
    let poolClans = ["Птолемеи", "Дуло", "Крумови", "Вокил", "Угаин"];

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
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`👑 Новият Герой ${randomName} от Клан ${randomClan} се присъедини към армията ви!`);
    } else {
        alert(`👑 Успешно наехте ${randomName} от Клан ${randomClan}!`);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
