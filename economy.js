/**
МОДУЛ: ИКОНОМИКА И АВТОНОМНО РАЗВИТИЕ - Велика България
ВЕРСИЯ: 4.0 - МАЩАБНО НАДГРАДЕНА (АВТОМАТИЧНО КАЧВАНЕ НА НИВА ОТ STOREDXP)
КОРЕКЦИИ: 
- Автономните герои вече използват натрупания опит (storedXP), за да качват нива
- Подобрена синхронизация с armyMarket
- Добавени логове при автоматично качване на ниво
- Защита срещу липсващи обекти
*/

// Помощна функция за инициализация на armyDetails (ако липсва) – изнесена извън цикъла
function ensureArmyDetails(clan) {
    if (!clan.armyDetails) {
        clan.armyDetails = {
            infantry: 0, archers: 0, cavalry: 0, elite: 0,
            vampire: 0, werewolf: 0, highelf: 0, troll: 0, dragon_young: 0,
            wizard: 0, lich: 0, fairy_healer: 0, bear_ancient: 0, harpy: 0,
            mermaid: 0, genie: 0, vampire_queen: 0, ice_dragon: 0, ogre_mage: 0,
            dark_elf: 0, alpha_werewolf: 0, stone_troll: 0, archmage: 0, demon: 0,
            ancient_vampire: 0, weird_witch: 0, griffin: 0, golden_dragon: 0,
            elf_archer: 0, swamp_troll: 0, necromancer: 0, vampire_samurai: 0,
            bronze_dragon: 0, titan: 0
        };
    }
    if (clan.armyDetails.infantry === undefined) clan.armyDetails.infantry = 0;
    // Ако има стара стойност armySize, но armyDetails са празни, разпределяме я приблизително
    if (clan.armySize > 0 && (clan.armyDetails.infantry + clan.armyDetails.archers + clan.armyDetails.cavalry + clan.armyDetails.elite) === 0) {
        clan.armyDetails.infantry = Math.floor(clan.armySize * 0.5);
        clan.armyDetails.archers = Math.floor(clan.armySize * 0.25);
        clan.armyDetails.cavalry = Math.floor(clan.armySize * 0.15);
        clan.armyDetails.elite = clan.armySize - (clan.armyDetails.infantry + clan.armyDetails.archers + clan.armyDetails.cavalry);
    }
}

// Функция за автоматично изразходване на storedXP (ако има достатъчно за качване на ниво)
function consumeStoredXPForHero(hero) {
    if (!hero) return false;
    let leveledUp = false;
    let req = (hero.level || 1) * 150;
    while (hero.storedXP >= req && hero.level < 100) {
        hero.storedXP -= req;
        hero.level++;
        hero.skillPoints++;
        hero.heroPower = (hero.heroPower || 100) + 25;
        leveledUp = true;
        req = (hero.level || 1) * 150;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🆙 ${hero.leaderName || hero.name} достигна Ниво ${hero.level} (автоматично от натрупан опит)!`);
        }
        console.log(`🆙 ${hero.leaderName || hero.name} качи ниво от storedXP: ниво ${hero.level}`);
    }
    return leveledUp;
}

window.calculateEconomy = function() {
    if (!window.currentHero) return;
    const hero = window.currentHero;

    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }

    let skills = hero.skills || {};
    const activeClanKey = hero.clan || hero.dynasty;

    // ==================== 1. ИКОНОМИКА НА ИГРАЧА ====================
    let baseIncome = 200;
    if ((skills.goldRush || 0) > 0) baseIncome += (skills.goldRush * 25);
    if ((skills.bazaars || 0) > 0) baseIncome += (skills.bazaars * 15);

    let regionIncome = 0;
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        const ownedRegionsFlat = window.playerRegions.flat();
        ownedRegionsFlat.forEach(regionName => {
            const regData = window.worldData.regions[regionName];
            if (regData) {
                let infraLvl = regData.infrastructureLevel || 1;
                regionIncome += (infraLvl * 50);
            }
        });
    }

    if ((skills.economy || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + (skills.economy * 0.10)));
    }

    let totalIncome = baseIncome + regionIncome;

    let armySize = hero.armySize || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.25);
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));

    let finalProfit = totalIncome - armyMaintenance;
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0;

    if (window.worldData && window.worldData.clans && activeClanKey && window.worldData.clans[activeClanKey]) {
        window.worldData.clans[activeClanKey].gold = hero.gold;
    }

    // ==================== 2. АВТОНОМНА ИКОНОМИКА ЗА НЕ-ЛЮБИМИТЕ ГЕРОИ ====================
    let favoriteHeroIds = [];
    if (window.favoriteHeroes && typeof window.favoriteHeroes.forEach === 'function') {
        window.favoriteHeroes.forEach(id => favoriteHeroIds.push(id));
    }
    
    let favoriteNames = new Set();
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isFavoriteInBarracks === true) {
                favoriteNames.add(clan.leaderName || clan.name || key);
            }
        }
    }
    
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (hero && key === hero.clan) continue;
            let isFavorite = favoriteHeroIds.includes(key) || favoriteNames.has(clan.leaderName || clan.name || key);
            if (isFavorite) continue;
            
            ensureArmyDetails(clan);
            
            // Автономен доход
            let autonomousIncome = 80 + Math.floor(Math.random() * 50);
            clan.gold = (clan.gold || 0) + autonomousIncome;
            
            // Автономно купуване на войски
            if ((clan.gold || 0) >= 150 && (clan.armySize || 0) < 800) {
                let cost = 100;
                let troopsBought = Math.floor(Math.random() * 30) + 15;
                clan.gold -= cost;
                clan.armyDetails.infantry = (clan.armyDetails.infantry || 0) + troopsBought;
                let total = 0;
                for (let t in clan.armyDetails) total += clan.armyDetails[t] || 0;
                clan.armySize = total;
                clan.currentArmy = total;
                if (window.showAdvisorMsg && Math.random() < 0.1) {
                    window.showAdvisorMsg(`📢 ${clan.leaderName || clan.name} нае ${troopsBought} войници!`);
                }
            }
            
            // Автономно трупане на опит
            if (window.gainHeroXP) {
                window.gainHeroXP(clan, 12);
            } else {
                clan.xp = (clan.xp || 0) + 12;
                let requiredXP = (clan.level || 1) * 150;
                if (clan.xp >= requiredXP) {
                    clan.xp -= requiredXP;
                    clan.level = (clan.level || 1) + 1;
                    clan.skillPoints = (clan.skillPoints || 0) + 1;
                    clan.heroPower = (clan.heroPower || 100) + 15;
                    if (window.showAdvisorMsg) {
                        window.showAdvisorMsg(`🆙 ${clan.leaderName || clan.name} достигна Ниво ${clan.level}!`);
                    }
                }
            }
            
            // НОВО: Ако героят има натрупан опит (storedXP), опитваме се да качи ниво
            if (clan.storedXP > 0) {
                consumeStoredXPForHero(clan);
            }
            
            // Синхронизация с armyMarket
            if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
                window.armyMarket.sync(clan);
            }
        }
    }

    // ==================== 3. ЛЕТОПИС ====================
    if (window.showAdvisorMsg) {
        let seasonName = "Текущ сезон";
        if (window.gameTime) {
            const seasons = ["Пролет", "Лято", "Есен", "Зима"];
            seasonName = seasons[window.gameTime.seasonIndex] || "Сезон";
        }
        let classTitle = (hero.currentClass && hero.currentClass !== "Няма клас") ? ` (${hero.currentClass})` : "";
        if (finalProfit >= 0) {
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Кан ${hero.name}${classTitle} събра +${totalIncome} злато. Чист профит: +${finalProfit} злато.`);
        } else {
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Чист дефицит: ${finalProfit} злато.`);
        }
    }

    // Опресняване на интерфейсите
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    // Синхронизация на основния герой с armyMarket
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
        window.armyMarket.sync(hero);
    }

    // Обновяване на портала
    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
};
