/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С УНАКВИЧЕНИТЕ КЛАНОВЕ
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
            window.activeClans[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    
    console.log(`👑 Играта започна с Върховен Лидер: ${window.currentHero.name} от Клан ${window.currentHero.clan}!`);
};

window.nextTurn = function() {
    window.gameTime.turn += 1;
    window.gameTime.seasonIndex += 1;
    
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year += 1;
    }

    if (window.processTime) {
        window.processTime();
    }

    let seasonalBonus = 200;
    if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; 
    if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; 

    let goldArtifactModifier = 0;
    if (window.equippedItems) {
        window.equippedItems.forEach(item => {
            if (item && item.bonus && item.bonus.goldBonus) {
                goldArtifactModifier += item.bonus.goldBonus;
            }
        });
    }
    
    let baseIncome = window.playerRegions.length * seasonalBonus;
    let artifactExtraGold = Math.floor(baseIncome * (goldArtifactModifier / 100));
    window.currentHero.gold += (baseIncome + artifactExtraGold);

    if (window.activeClans) {
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
                    if (exp.leaderData) {
                        window.gainHeroXP(exp.leaderData, totalTerritoryXP);
                    }
                });
            }
            console.log(`🦅 Спечелен териториален опит от ${flatRegions.length} региона: +${totalTerritoryXP} XP.`);
        }
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
};

window.advanceTurn = window.nextTurn;

window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
