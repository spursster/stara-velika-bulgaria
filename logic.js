/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ
 * НАДГРАДАНЕ: Добавена система за купуване/наемане на нови Герои.
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

    window.currentHero = {
        name: selectedName, 
        clan: selectedClan,
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 50, 
        techLevel: 1,
        level: 1,
        xp: 0
    };

    window.unlockedHeroes = [window.currentHero];

    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    window.playerRegions = [["Крим"]];
    
    window.activeClans = {};
    if (window.clans) {
        Object.keys(window.clans).forEach(name => {
            const cData = window.clans[name];
            window.activeClans[name] = {
                name: name,
                hero: (cData.heroes && cData.heroes[0]) || "Воевода",
                gold: 800,
                armySize: 300,
                regions: 1,
                isDead: false
            };
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

    if (window.playerRegions && window.gainHeroXP) {
        const flatRegions = window.playerRegions.flat();
        const totalTerritoryXP = flatRegions.length * 10;

        if (totalTerritoryXP > 0) {
            window.gainHeroXP(window.currentHero, totalTerritoryXP);
            if (window.activeExpeditions && window.activeExpeditions.length > 0) {
                window.activeExpeditions.forEach(exp => {
                    if (exp.heroData) window.gainHeroXP(exp.heroData, totalTerritoryXP);
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
        hero: randomName, // Синхронизирано свойство за ui.js
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
        equipment: [],
        skills: {}
    };

    window.currentHero.gold -= heroCost;

    if (!window.unlockedHeroes) window.unlockedHeroes = [];
    window.unlockedHeroes.push(purchasedHero);

    // Добавяне в света, за да се класира в Топ 6 елитната лента
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
