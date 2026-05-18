/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ
 * НАДГРАДАНЕ: Пълна интеграция на Герои вместо старите лидери.
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
        techLevel: 1
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
                hero: (cData.heroes && cData.heroes[0]) || "Воевода", // Напълно уеднаквено свойство за Герои
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

    // Опресняване на интерфейса веднага при първото стартиране
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    
    // НАДГРАЖДАНЕ: Използваме уеднаквеното име за Герои
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
    
    // НАДГРАЖДАНЕ: Опресняване на лентата на героите
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
};

// Глобален мост за бутона от index.html
window.processTurn = function() {
    window.nextTurn();
};

// Автоматично извикване при първоначално зареждане на браузъра
window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
