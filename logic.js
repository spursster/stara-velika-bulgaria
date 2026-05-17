/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ОБНОВЕН СЪС СЛУЧАЕН ВЪРХОВЕН ЛИДЕР И СИНХРОНИЗАЦИЯ НА ХОДОВЕТЕ
 * При всяко стартиране Върховният владетел се избира напълно случайно от database.js!
 * НАДГРАЖДАНЕ: Добавена система за автоматичен териториален опит на всеки ход за героя и водачите.
 * Статистика на файловете в проекта: 16
 */

window.initNewGame = function() {
    // 1. АЛГОРИТЪМ ЗА ИЗБОР НА СЛУЧАЕН ВЪРХОВЕН ВЛАДЕТЕЛ (От твоя окончателен списък)
    let selectedName = "Кубрат"; // Fallback по подразбиране при грешка в базата данни
    let selectedDynasty = "Дуло"; // Fallback по подразбиране при грешка в базата данни

    if (window.bulgarianDynasties) {
        const dynastiesKeys = Object.keys(window.bulgarianDynasties);
        if (dynastiesKeys.length > 0) {
            // Избираме случайна династия от 13-те налични
            selectedDynasty = dynastiesKeys[Math.floor(Math.random() * dynastiesKeys.length)];
            const rulersList = window.bulgarianDynasties[selectedDynasty].rulers;
            
            if (rulersList && rulersList.length > 0) {
                // Избираме случаен владетел от тази династия
                selectedName = rulersList[Math.floor(Math.random() * rulersList.length)];
            }
        }
    }

    // 2. ИНИЦИАЛИЗАЦИЯ НА ОБЕКТА НА ВЛАДЕТЕЛЯ (ГЕРОЯ)
    window.currentHero = {
        name: selectedName,
        dynasty: selectedDynasty,
        age: 24,
        gold: 1200,
        armySize: 450,
        fame: 50,
        level: 1,
        xp: 0,
        skillPoints: 0,
        heroPower: 150,
        skills: { endurance: 1, vampirism: 0, mysticism: 0, tactics: 1, diplomacy: 0, scouting: 0 }
    };

    // Подсигуряваме RPG структурите в паметта, ако има нужда
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    // 3. НАЧАЛНИ ТЕРИТОРИИ И СИНХРОНИЗАЦИЯ НА СВЕТА
    window.playerRegions = ["Мизия"]; // Начален регион
    if (window.worldData && window.worldData.clans) {
        Object.keys(window.worldData.clans).forEach(c => {
            window.worldData.clans[c].isJoined = (c === selectedDynasty);
        });
    }

    // Начално време
    window.gameTime = {
        year: 632,
        era: "от н.е.",
        seasonIndex: 0
    };

    // Старт на дипломацията
    if (window.initDiplomacy) window.initDiplomacy();

    // Първоначално опресняване на екрана
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    if (window.updateExpeditionBadge) window.updateExpeditionBadge();
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    console.log(`🎮 Нова игра стартира успешно с Кан ${selectedName} от род ${selectedDynasty}!`);
};

/**
 * ГЛАВЕН КЛИК: СМЯНА НА ХОДА
 */
window.nextTurnClick = function() {
    if (!window.currentHero) return;

    // 1. НАПРЕДВАНЕ НА ЛЕТОБРОЕНЕТО И СЕЗОНИТЕ
    if (window.processTime) {
        window.processTime();
    }

    // 2. ФИНАНСОВ И ИКОНОМИЧЕСКИ ЦИКЪЛ
    if (window.calculateEconomy) {
        window.calculateEconomy();
    } else {
        // Резервен икономически баланс, ако economy.js закъснее
        let seasonalBonus = 200;
        if (window.gameTime) {
            if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; // Лято
            if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; // Зима
        }
        
        let goldArtifactModifier = 0;
        if (window.playerInventory) {
            window.playerInventory.forEach(itemData => {
                if (itemData && itemData.bonus && itemData.bonus.goldBonus) {
                    goldArtifactModifier += itemData.bonus.goldBonus;
                }
            });
        }
        
        let baseIncome = window.playerRegions.length * seasonalBonus;
        let artifactExtraGold = Math.floor(baseIncome * (goldArtifactModifier / 100));
        window.currentHero.gold += (baseIncome + artifactExtraGold);
    }

    // 3. Логика за останалите родове (AI автоматизация)
    if (window.activeDynasties) {
        Object.keys(window.activeDynasties).forEach(dyn => {
            if (dyn !== window.currentHero.dynasty) {
                window.activeDynasties[dyn].gold += 50;
                if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
            }
        });
    } else if (window.worldData && window.worldData.clans) {
        // Защитен мост към структурата в world_data.js
        Object.keys(window.worldData.clans).forEach(dyn => {
            if (dyn !== window.currentHero.dynasty) {
                window.worldData.clans[dyn].gold += 60;
                if (Math.random() > 0.93) window.worldData.clans[dyn].regionsOwned += 1;
            }
        });
    }

    if (window.processClanDiplomacyAutomation) {
        window.processClanDiplomacyAutomation();
    }

    // 4. НАДГРАЖДАНЕ: ТЕРИТОРИАЛЕН ОПИТ НА ХОД (RPG СИСТЕМA)
    // Всеки контролиран регион носи +10 XP на ход за главния Върховен владетел
    const flatRegions = window.playerRegions ? window.playerRegions.flat() : [];
    const totalTerritoryXP = flatRegions.length * 10;

    if (totalTerritoryXP > 0 && window.gainHeroXP) {
        window.gainHeroXP(window.currentHero, totalTerritoryXP);
        
        // Същият териториален опит се дава и на водачите, които в момента провеждат експедиция по света
        if (window.activeExpeditions && window.activeExpeditions.length > 0) {
            window.activeExpeditions.forEach(exp => {
                if (exp.leaderData) {
                    window.gainHeroXP(exp.leaderData, totalTerritoryXP);
                }
            });
        }
    }

    // 5. АКТИВИРАНЕ НА СЛУЧАЙНИ СЪБИТИЯ
    if (window.triggerRandomEvent) {
        window.triggerRandomEvent();
    }

    // 6. НАПРЕДЪК НА АКТИВНИТЕ ЕКСПЕДИЦИИ ПО СВЕТА
    if (window.updateExpeditionSystem) {
        window.updateExpeditionSystem();
    }

    // Опресняване на графичния бадж на бутона за експедиции
    if (window.updateExpeditionBadge) {
        window.updateExpeditionBadge();
    }

    // 7. ОПРЕСНЯВАНЕ НА ИНТЕРФЕЙСА (Задължително опресняване на героя и горните ленти)
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    console.log(`🦅 Ходът премина успешно. Спечелен териториален опит: +${totalTerritoryXP} XP.`);
};
