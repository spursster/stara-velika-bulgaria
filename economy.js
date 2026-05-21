/**
МОДУЛ: ИКОНОМИКА И АВТОНОМНО РАЗВИТИЕ - Велика България
ВЕРСИЯ: 3.0 - ПЪЛНА СИНХРОНИЗАЦИЯ С ARMY MARKET И БАРАКИ
КОРЕКЦИИ: 
- Добавена инициализация на armyDetails за всички герои
- Синхронизация с armyMarket.sync()
- Автономното купуване на войски се отразява в armyDetails (пехотинци)
- Защита срещу липсващи обекти
*/

window.calculateEconomy = function() {
    if (!window.currentHero) return;
    const hero = window.currentHero;

    // Подсигуряваме, че RPG структурата на способностите съществува
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }

    let skills = hero.skills || {};
    const activeClanKey = hero.clan || hero.dynasty;

    // ==================== 1. ИКОНОМИКА НА ИГРАЧА ====================
    
    // БАЗОВ ПРИХОД
    let baseIncome = 200;
    if ((skills.goldRush || 0) > 0) baseIncome += (skills.goldRush * 25);
    if ((skills.bazaars || 0) > 0) baseIncome += (skills.bazaars * 15);

    // ПРИХОД ОТ ВЛАДЕНИТЕ РЕГИОНИ
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

    // РАЗХОДИ ЗА ПОДДРЪЖКА НА АРМИЯТА (използваме актуалния размер от armyDetails)
    let armySize = hero.armySize || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.25);
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));

    let finalProfit = totalIncome - armyMaintenance;
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0;

    // Синхронизация с worldData
    if (window.worldData && window.worldData.clans && activeClanKey && window.worldData.clans[activeClanKey]) {
        window.worldData.clans[activeClanKey].gold = hero.gold;
    }

    // ==================== 2. АВТОНОМНА ИКОНОМИКА ЗА НЕ-ЛЮБИМИТЕ ГЕРОИ ====================
    
    // Вземаме списъка с любими герои (от favoriteHeroes Set в ui.js)
    let favoriteHeroIds = [];
    if (window.favoriteHeroes && typeof window.favoriteHeroes.forEach === 'function') {
        window.favoriteHeroes.forEach(id => favoriteHeroIds.push(id));
    }
    
    // Също така проверяваме и isFavoriteInBarracks (за съвместимост)
    let favoriteNames = new Set();
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isFavoriteInBarracks === true) {
                favoriteNames.add(clan.leaderName || clan.name || key);
            }
        }
    }
    
    // Помощна функция за инициализация на armyDetails (ако липсва)
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
        if (!clan.armyDetails.infantry && clan.armyDetails.infantry !== 0) clan.armyDetails.infantry = 0;
        // Ако има стара стойност armySize, но armyDetails са празни, разпределяме я приблизително
        if (clan.armySize > 0 && (clan.armyDetails.infantry + clan.armyDetails.archers + clan.armyDetails.cavalry + clan.armyDetails.elite) === 0) {
            clan.armyDetails.infantry = Math.floor(clan.armySize * 0.5);
            clan.armyDetails.archers = Math.floor(clan.armySize * 0.25);
            clan.armyDetails.cavalry = Math.floor(clan.armySize * 0.15);
            clan.armyDetails.elite = clan.armySize - (clan.armyDetails.infantry + clan.armyDetails.archers + clan.armyDetails.cavalry);
        }
    }
    
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            // Пропускаме главния герой на играча
            if (hero && key === hero.clan) continue;
            // Пропускаме любимите герои
            let isFavorite = favoriteHeroIds.includes(key) || favoriteNames.has(clan.leaderName || clan.name || key);
            if (isFavorite) continue;
            
            // Инициализираме armyDetails, ако липсва
            ensureArmyDetails(clan);
            
            // Автономен доход за не-любимите герои (по-малък от този на играча)
            let autonomousIncome = 80 + Math.floor(Math.random() * 50);
            clan.gold = (clan.gold || 0) + autonomousIncome;
            
            // Автономно купуване на войски (ако има достатъчно злато и не е достигнал лимит 800)
            if ((clan.gold || 0) >= 150 && (clan.armySize || 0) < 800) {
                let cost = 100;
                let troopsBought = Math.floor(Math.random() * 30) + 15;
                clan.gold -= cost;
                // Разпределяме войниците като пехотинци (за простота)
                clan.armyDetails.infantry = (clan.armyDetails.infantry || 0) + troopsBought;
                // Актуализираме общия размер на армията
                let total = 0;
                for (let t in clan.armyDetails) total += clan.armyDetails[t] || 0;
                clan.armySize = total;
                clan.currentArmy = total;
                
                if (window.showAdvisorMsg && Math.random() < 0.1) {
                    window.showAdvisorMsg(`📢 ${clan.leaderName || clan.name} нае ${troopsBought} войници!`);
                }
            }
            
            // Автономно трупане на опит (по-бавно от играча)
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
            
            // Синхронизация с armyMarket (ако съществува)
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
