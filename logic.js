/**
 * МОДУЛ: ГЛАВНА ИГРОВА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (СВОЙСТВА: ГЕРОИ И КЛАНОВЕ)
 * КОРЕКЦИЯ: Използват се само 'name' и 'clan'. Автоматичен старт при зареждане.
 * Статистика на файловете в проекта: 15
 */

/**
 * ИНИЦИАЛИЗИРАНЕ НА НОВА ИГРА И СИНГУЛЯРЕН ИЗБОР НА ГЕРОЙ И КЛАН
 */
window.initNewGame = function() {
    let selectedName = "Кубрат"; 
    let selectedClan = "Дуло"; 

    // Автоматичен подбор от наличната база данни в database.js (window.clans)
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

    // Твърдо задаване на структурите (Изчистени от стари дефиниции)
    window.currentHero = {
        name: selectedName, 
        clan: selectedClan, // Единен стандарт за родова принадлежност
        gold: 1500,
        armySize: 500,
        currentArmy: 500,
        heroPower: 150,
        level: 1,
        xp: 0,
        skillPoints: 0,
        age: 50, 
        techLevel: 1,
        inventory: [],
        isDead: false
    };

    // Подсигуряваме, че играта не стартира с празен списък - главният герой е първият отключен
    window.unlockedLeaders = [window.currentHero];

    // Инициализиране на RPG данните, ако модулът съществува
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    // Времева ос на играта
    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    // Стартови територии на играча
    window.playerRegions = [["Крим"]];
    
    // Инициализиране на автономните активни кланове за ИИ процесите
    window.activeClans = {};
    if (window.clans) {
        Object.keys(window.clans).forEach(name => {
            const cData = window.clans[name];
            window.activeClans[name] = {
                name: name,
                leader: (cData.heroes && cData.heroes[0]) || "Воевода",
                gold: 800,
                armySize: 300,
                regions: 1,
                isDead: false
            };
        });
    }

    // Стартиране на дипломатическата мрежа за 13-те клана
    if (window.initDiplomacy) {
        window.initDiplomacy();
    }

    console.log(`🎮 Нова игра: Успешно инициализиран Герой ${window.currentHero.name} от Клан ${window.currentHero.clan}.`);
};

/**
 * СИСТЕМНО ПРЕВЪРТАНЕ НА ХОДА (СЛЕДВАЩ СЕЗОН)
 * Движи икономиката, експедициите, ИИ на клановете и трупането на опит
 */
window.nextTurn = function() {
    if (!window.currentHero) return;

    // 1. Проверка за състоянието на героя
    if (window.currentHero.isDead) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔮 ВНИМАНИЕ: Вашият Герой е в отвъдното! Трябва да извършите Ритуал за Възкресяване в меню Механики.");
        }
        return;
    }

    // 2. Икономически изчисления и събиране на данъци
    if (window.calculateEconomy) {
        window.calculateEconomy();
    }

    // 3. Напредък на времето и сезоните
    if (window.gameTime) {
        window.gameTime.turn += 1;
        window.gameTime.seasonIndex += 1;
        if (window.gameTime.seasonIndex > 3) {
            window.gameTime.seasonIndex = 0;
            window.gameTime.year += 1;
        }
    }

    // 4. Дипломатически стъпки и автономен ИИ на компютърните кланове
    if (window.processClanDiplomacy) {
        window.processClanDiplomacy();
    } else if (window.activeClans) {
        // Резервен ИИ за баланс при автономните кланове
        Object.keys(window.activeClans).forEach(cName => {
            if (cName !== window.currentHero.clan) {
                window.activeClans[cName].gold += 50;
                if (Math.random() > 0.9) window.activeClans[cName].regions += 1;
            }
        });
    }

    // 5. Задействане на случайни събития от събитийния генератор
    if (window.triggerRandomEvent) {
        window.triggerRandomEvent();
    }

    // 6. Актуализиране на изпратените експедиции и техните таймери
    if (window.updateExpeditionSystem) {
        window.updateExpeditionSystem();
    }
    if (window.updateExpeditionBadge) {
        window.updateExpeditionBadge();
    }

    // 7. Териториален прогрес: Героят печели XP пасивно на база брой контролирани земи
    if (window.playerRegions && window.gainHeroXP) {
        const flatRegions = window.playerRegions.flat();
        const totalTerritoryXP = flatRegions.length * 10;

        if (totalTerritoryXP > 0) {
            window.gainHeroXP(window.currentHero, totalTerritoryXP);
            
            // Прехвърляне на опит и към героите, намиращи се в експедиция
            if (window.activeExpeditions && window.activeExpeditions.length > 0) {
                window.activeExpeditions.forEach(exp => {
                    if (exp.leaderData) {
                        window.gainHeroXP(exp.leaderData, totalTerritoryXP);
                    }
                });
            }
            console.log(`🦅 Спечелен териториален опит от ${flatRegions.length} региона: +${totalTerritoryXP} XP.`);
        }
    }

    // 8. Пълно моментално опресняване на графичния интерфейс
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

// =========================================================================
// АВТОМАТИЧНО СТАРТИРАНЕ НА ИГРАТА ПРИ ЗАРЕЖДАНЕ НА СТРАНИЦАТА В БРАУЗЪРА
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
