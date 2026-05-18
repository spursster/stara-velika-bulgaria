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

    // Главният герой автоматично става първият отключен в играта
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

    console.log(`🎮 Нова игра: Успешно инициализиран Герой ${window.currentHero.name} от Клан ${window.currentHero.clan}.`);
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

    if (window.updateExpeditionSystem) {
        window.updateExpeditionSystem();
    }

    if (window.updateExpeditionBadge) {
        window.updateExpeditionBadge();
    }

    if (window.playerRegions && window.gainHeroXP) {
        const flatRegions = window.playerRegions.flat();
        const totalTerritoryXP = flatRegions.length * 10;

        if (totalTerritoryXP > 0) {
            window.gainHeroXP(window.currentHero, totalTerritoryXP);
            
            if (window.activeExpeditions && window.activeExpeditions.length > 0) {
                window.activeExpeditions.forEach(exp => {
                    if (exp.heroData) {
                        window.gainHeroXP(exp.heroData, totalTerritoryXP);
                    }
                });
            }
            console.log(`🦅 Спечелен териториален опит от ${flatRegions.length} региона: +${totalTerritoryXP} XP.`);
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
// НАДГРАЖДАНЕ: МЕХАНИКА ЗА ЗАКУПУВАНЕ НА НОВИ ГЕРОИ ОСТАНАЛИТЕ КЛАНОВЕ
// =========================================================================
window.buyNewHero = function() {
    if (!window.currentHero) return;

    const heroCost = 1000; // Цена за наемане на елитен войн

    if (window.currentHero.gold < heroCost) {
        alert(`❌ Нямате достатъчно злато! Наемането струва 💰 ${heroCost} злато.`);
        return;
    }

    // Списък с възможни имена и кланове за новия герой
    let poolNames = ["Птолемей I Сотер", "Аспарух", "Тервел", "Крум", "Омуртаг", "Пресиян"];
    let poolClans = ["Птолемеи", "Дуло", "Крумови", "Вокил", "Угаин"];

    let randomName = poolNames[Math.floor(Math.random() * poolNames.length)];
    let randomClan = poolClans[Math.floor(Math.random() * poolClans.length)];

    // Създаваме новия закупен герой с базови бойни показатели
    let purchasedHero = {
        name: randomName,
        clan: randomClan,
        level: 2, // Стартира с малко по-високо ниво като награда
        xp: 0,
        heroPower: 200,
        gold: 300,
        armySize: 150,
        age: 30,
        currentClass: "Багатур"
    };

    // Икономическа транзакция
    window.currentHero.gold -= heroCost;

    // Добавяме го към отключените герои на играча
    if (!window.unlockedHeroes) window.unlockedHeroes = [];
    window.unlockedHeroes.push(purchasedHero);

    // Вкарваме го в глобалния свят (worldData), за да може ui.js веднага да го покаже в Топ 6
    if (window.worldData && window.worldData.clans) {
        window.worldData.clans[randomClan] = purchasedHero;
    }

    // Опресняваме целия интерфейс веднага
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`👑 Новият Герой ${randomName} от Клан ${randomClan} се присъедини към армията ви!`);
    } else {
        alert(`👑 Успешно наехте ${randomName} от Клан ${randomClan}!`);
    }
};

// Автоматично извикване при първоначално зареждане на браузъра
window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
