/**
 * МОДУЛ: ГЛАВНА ИГРОВА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (ГЕРОИ И КЛАНОВЕ)
 * КОРЕКЦИЯ: Елиминиран риск от 'undefined' ресурси. Пълна синхронизация на 13-те клана без външни филтри.
 * Статистика на файловете в проекта: 17
 */

/**
 * ИНИЦИАЛИЗИРАНЕ НА НОВА ИГРА И СИНГУЛЯРЕН ИЗБОР НА ГЕРОЙ И КЛАН
 */
window.initNewGame = function() {
    let selectedName = "Болгарос"; 
    let selectedClan = "Дуло"; 

    // Автоматичен подбор от наличните данни в световната матрица
    if (window.worldData && window.worldData.clans) {
        const clanKeys = Object.keys(window.worldData.clans);
        if (clanKeys.length > 0) {
            // Избираме произволен стартиращ клан за играча, ако не е избран ръчно
            selectedClan = clanKeys[Math.floor(Math.random() * clanKeys.length)];
            selectedName = window.worldData.clans[selectedClan].leader || "Воевода";
        }
    }

    // КОРЕКЦИЯ: Твърдо задаване на структурите, за да се избегне 'undefined' в икономиката
    window.currentHero = {
        name: selectedName, 
        dynasty: selectedClan, // Единен стандарт за родова принадлежност
        gold: 1500,
        armySize: 500,
        currentArmy: 500,
        heroPower: 150,
        level: 1,
        xp: 0,
        skillPoints: 0,
        age: 35, 
        techLevel: 1,
        inventory: [],
        isDead: false
    };

    // Инициализиране на Diablo дървото с умения за новия Герой
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    // Времева ос на играта
    window.gameTime = { 
        year: 1, \n        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    // Стартови територии на играча
    window.playerRegions = [["Мизия"]];
    
    // Инициализиране на автономните активни кланове за ИИ процесите
    window.activeClans = {};
    if (window.worldData && window.worldData.clans) {
        Object.keys(window.worldData.clans).forEach(name => {
            const cData = window.worldData.clans[name];
            window.activeClans[name] = {
                name: name,
                leader: cData.leader,
                gold: cData.gold || 500,
                armySize: cData.armySize || 250,
                regions: cData.regionsOwned || 1,
                isDead: false
            };
        });
    }

    // Стартиране на дипломатическата мрежа за 13-те клана
    if (window.initDiplomacy) {
        window.initDiplomacy();
    }

    console.log("🎮 Нова игра: Успешно инициализиран Герой и 13-те автономни клана.");
};

/**
 * СИСТЕМНО ПРЕВЪРТАНЕ НА ХОДА (СЛЕДВАЩ СЕЗОН)
 * Движи икономиката, експедициите, ИИ на клановете и трупането на териториален опит
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
        // Резервен ИИ за баланс на златото при автономните кланове
        Object.keys(window.activeClans).forEach(cName => {
            if (cName !== window.currentHero.dynasty) {
                window.activeClans[cName].gold += 75;
                if (Math.random() > 0.92) window.activeClans[cName].armySize += 30;
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
        const totalTerritoryXP = flatRegions.length * 15; // +15 XP за всеки регион

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
            console.log(`🦅 Териториален бонус: +${totalTerritoryXP} XP генерирани от контролираните региони.`);
        }
    }

    // 8. Пълно моментално опресняване на графичния интерфейс
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};
