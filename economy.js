/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: economy.js (ВЕРСИЯ 8.0 – МОДУЛНА, БЕЗ ГЛОБАЛНО ЗАМЪРСЯВАНЕ)
==========================================================================
*/

(function() {
    // ==================== ГЛОБАЛНИ НАСТРОЙКИ ====================
    if (!window.economySettings) {
        window.economySettings = {
            inflationRate: 0.01,
            investmentReturnBase: 0.12,
            tradeRouteBaseIncome: 50,
            randomEventChance: 0.15,
            autonomousUpgradeChance: 0.25
        };
    }

    if (!window.tradeRoutes) window.tradeRoutes = [];
    if (!window.investments) window.investments = [];
    if (!window.economyHistory) window.economyHistory = [];

    // ==================== ПОМОЩНИ ФУНКЦИИ ====================
    function flattenArray(arr) {
        if (!arr) return [];
        if (!Array.isArray(arr)) return [arr];
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                for (let j = 0; j < arr[i].length; j++) result.push(arr[i][j]);
            } else {
                result.push(arr[i]);
            }
        }
        return result;
    }

    function getMainEconomicHero() {
        if (window.gameMode === 'solo') return window.currentHero || null;
        if (typeof window.getStrongestHero === 'function') return window.getStrongestHero();
        if (typeof window.getSelectedHero === 'function') return window.getSelectedHero();
        return null;
    }

    function syncHeroGold(hero) {
        if (!hero) return;
        if (window.worldData && window.worldData.clans && hero.clan && window.worldData.clans[hero.clan]) {
            window.worldData.clans[hero.clan].gold = hero.gold;
        }
        const strongest = getMainEconomicHero();
        if (strongest && strongest.clan === hero.clan) {
            let goldSpan = document.getElementById('val-gold');
            if (goldSpan) goldSpan.innerText = hero.gold;
        }
    }

    function ensureArmyDetails(hero) {
        if (window.ensureCompleteArmyDetails) return window.ensureCompleteArmyDetails(hero);
        if (!hero.armyDetails) hero.armyDetails = {};
        return hero.armyDetails;
    }

    // ==================== ОСНОВЕН ДОХОД ====================
   function recalculateIncome(hero) {
    if (!hero) hero = getMainEconomicHero();
    if (!hero) return 0;
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let skills = hero.skills || {};
    let inventoryBonuses = window.getInventoryBonuses ? window.getInventoryBonuses(hero) : { goldBonus: 0 };
    let advancedBonuses = window.getAdvancedSkillBonuses ? window.getAdvancedSkillBonuses(hero) : {};
    // ========== ДОБАВЕНИ БОНУСИ ОТ ХАРАКТЕР ==========
    let personalityBonuses = window.getPersonalityBonuses ? window.getPersonalityBonuses(hero) : {};
    // =================================================
    
    let baseIncome = 200 + (hero.level || 1) * 10;
    if ((skills.goldRush || 0) > 0) baseIncome += (skills.goldRush * 25);
    if ((skills.bazaars || 0) > 0) baseIncome += (skills.bazaars * 15);
    
    let artifactBonusPercent = (inventoryBonuses.goldBonus || 0);
    let skillBonusPercent = (advancedBonuses.taxBonus || 0) + (advancedBonuses.goldDropBonus || 0);
    
    if (window.playerRegions) {
        let totalMarketBonus = 0;
        for (let r of window.playerRegions.flat()) {
            const region = window.worldData.regions[r];
            if (region && region.buildings) {
                totalMarketBonus += (region.buildings.market || 0) * 30;
            }
        }
        baseIncome += totalMarketBonus;
    }
    
    let regionIncome = 0;
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        const ownedRegionsFlat = flattenArray(window.playerRegions);
        ownedRegionsFlat.forEach(regionName => {
            const regData = window.worldData.regions[regionName];
            if (regData) {
                let infraLvl = regData.infrastructureLevel || 1;
                regionIncome += (infraLvl * 50);
                if (regData.resource === "Злато") regionIncome += 30;
                else if (regData.resource === "Сребро") regionIncome += 20;
                else if (regData.resource === "Желязо") regionIncome += 15;
            }
        });
    }
    
    if ((skills.economy || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + (skills.economy * 0.10)));
    }
    if ((advancedBonuses.conqueredIncomeBonus || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + advancedBonuses.conqueredIncomeBonus));
    }
    
    let tradeIncome = 0;
    if (window.tradeRoutes && hero.id) {
        window.tradeRoutes.forEach(route => {
            if (route.heroId === hero.id) {
                let fromRegion = window.worldData.regions[route.from];
                let toRegion = window.worldData.regions[route.to];
                if (fromRegion && toRegion) {
                    let fromInfra = fromRegion.infrastructureLevel || 1;
                    let toInfra = toRegion.infrastructureLevel || 1;
                    let routeIncome = window.economySettings.tradeRouteBaseIncome * (fromInfra + toInfra) / 2;
                    tradeIncome += Math.floor(routeIncome);
                } else {
                    tradeIncome += window.economySettings.tradeRouteBaseIncome;
                }
            }
        });
    }
    
    let investmentIncome = 0;
    if (window.investments && hero.id) {
        for (let i = window.investments.length-1; i >= 0; i--) {
            let inv = window.investments[i];
            if (inv.heroId === hero.id) {
                inv.turnsLeft--;
                if (inv.turnsLeft <= 0) {
                    investmentIncome += inv.returnAmount;
                    window.investments.splice(i,1);
                }
            }
        }
    }
    
    let totalIncome = baseIncome + regionIncome + tradeIncome + investmentIncome;
    // ========== ДОБАВЕНИ ПЕРСОНАЛНИ БОНУСИ ==========
    let percentBonus = 1 + (artifactBonusPercent / 100) + skillBonusPercent + (window.economySettings.inflationRate || 0)
                        + (personalityBonuses.goldBonus || 0) + (personalityBonuses.economyBonus || 0);
    totalIncome = Math.floor(totalIncome * percentBonus);
    
    let armySize = hero.armySize || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.05);
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));
    
    return 200; // винаги добавяме 200 злато на ход
    // ==================== ИНФЛАЦИЯ ====================
    function updateInflation() {
        let delta = (Math.random() - 0.6) * 0.02;
        window.economySettings.inflationRate += delta;
        window.economySettings.inflationRate = Math.min(0.05, Math.max(-0.02, window.economySettings.inflationRate));
    }

    // ==================== СЛУЧАЙНИ ИКОНОМИЧЕСКИ СЪБИТИЯ ====================
    function triggerRandomEconomicEvent() {
        if (Math.random() > window.economySettings.randomEventChance) return;
        const eventType = Math.floor(Math.random() * 5);
        const hero = getMainEconomicHero();
        if (!hero) return;
        
        let eventData = {};
        switch(eventType) {
            case 0: eventData = { title: "📈 ИКОНОМИЧЕСКИ БУМ", gain: 200 + Math.floor(Math.random() * 300), msg: "Търговията процъфтява!" }; break;
            case 1: eventData = { title: "📉 РЕЦЕСИЯ", loss: 100 + Math.floor(Math.random() * 200), msg: "Икономически спад!" }; break;
            case 2: eventData = { title: "🏛️ ДАНЪЧНА РЕФОРМА", gain: Math.floor(hero.gold * 0.05), msg: "Нови данъчни правила ви носят злато." }; break;
            case 3: eventData = { title: "💰 КРАЖБА НА ХАЗНАТА", loss: Math.floor(hero.gold * 0.1) + 50, msg: "Крадци задигнаха част от златото!" }; break;
            case 4: eventData = { title: "🛒 НОВ ПАЗАР", gain: 150 + Math.floor(Math.random() * 250), msg: "Открит е нов търговски път!" }; break;
        }
        
        if (window.ChronicleEvents && typeof window.ChronicleEvents.generateEconomicEvent === 'function') {
            const ev = window.ChronicleEvents.generateEconomicEvent(hero, eventData);
            window.showAdvisorMsg(ev.message, ev.buttons);
        } else {
            if (eventData.gain) hero.gold += eventData.gain;
            if (eventData.loss) hero.gold = Math.max(0, hero.gold - eventData.loss);
            syncHeroGold(hero);
        }
    }

    // ==================== РЪЧНА ИНВЕСТИЦИЯ ====================
    function investGold(hero, amount, turns = 5) {
        if (!hero) return false;
        if (amount <= 0 || amount > hero.gold) {
            return false;
        }
        let expectedReturn = Math.floor(amount * (1 + window.economySettings.investmentReturnBase * (turns / 4)));
        
        hero.gold -= amount;
        window.investments.push({ heroId: hero.id, amount: amount, turnsLeft: turns, returnAmount: expectedReturn });
        // Съобщението е закоментирано, за да не спами – може да се включи отново при нужда
        return true;
    }

    // ==================== ТЪРГОВСКИ МАРШРУТИ ====================
    function establishTradeRoute(hero, fromRegion, toRegion) {
        if (!hero || !fromRegion || !toRegion) return false;
        if (!window.playerRegions.includes(fromRegion) || !window.playerRegions.includes(toRegion)) {
            window.showAdvisorMsg("Можете да търгувате само между ваши региони!");
            return false;
        }
        if (fromRegion === toRegion) {
            window.showAdvisorMsg("Не можете да търгувате със себе си!");
            return false;
        }
        let existing = window.tradeRoutes.find(r => r.heroId === hero.id && ((r.from === fromRegion && r.to === toRegion) || (r.from === toRegion && r.to === fromRegion)));
        if (existing) {
            window.showAdvisorMsg("Този маршрут вече съществува!");
            return false;
        }
        let cost = 200;
        if (hero.gold < cost) {
            window.showAdvisorMsg(`Нямате достатъчно злато! Нужни: ${cost}`);
            return false;
        }
        hero.gold -= cost;
        window.tradeRoutes.push({
            heroId: hero.id,
            from: fromRegion,
            to: toRegion,
            established: window.gameTime ? `${window.gameTime.year} ${window.gameTime.era}` : "днес"
        });
        window.showAdvisorMsg(`✅ Установихте търговия между ${fromRegion} и ${toRegion}!`);
        return true;
    }

    // ==================== ОСНОВНА ИКОНОМИЧЕСКА ФУНКЦИЯ ====================
    function calculateEconomy() {
        window.normalizePlayerRegions();
        
        if (!window.playerRegions || !Array.isArray(window.playerRegions)) window.playerRegions = [];
        let normalized = [];
        for (let item of window.playerRegions) {
            if (Array.isArray(item)) {
                for (let sub of item) if (typeof sub === 'string') normalized.push(sub);
            } else if (typeof item === 'string') normalized.push(item);
        }
        window.playerRegions = normalized;
        if (window.playerRegions.length === 0 && window.currentRegion) window.playerRegions.push(window.currentRegion);
        
        const hero = getMainEconomicHero();
        if (!hero) return;
        
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
        ensureArmyDetails(hero);
        
        updateInflation();
        triggerRandomEconomicEvent();
        
        let finalProfit = recalculateIncome(hero);
        hero.gold = (hero.gold || 0) + finalProfit;
        if (hero.gold < 0) hero.gold = 0;
        syncHeroGold(hero);
        
        if (window.worldData && window.worldData.clans && hero.clan && window.worldData.clans[hero.clan]) {
            window.worldData.clans[hero.clan].gold = hero.gold;
        }
        
        // Автономна икономика за другите герои
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (hero && key === hero.clan) continue;
            ensureArmyDetails(clan);
            clan.gold = clan.gold || 0;
            clan.gold += 150 + Math.floor(Math.random() * 100);
            
            if (Math.random() < 0.15 && clan.gold > 300) {
                let investAmount = Math.min(500, Math.floor(clan.gold * 0.3));
                investGold(clan, investAmount, 2);
            }
            
            if (clan.gold >= 80 && (clan.armySize || 0) < 1500) {
                let cost = 80;
                let troopsBought = Math.floor(Math.random() * 60) + 30;
                if (clan.gold >= cost) {
                    clan.gold -= cost;
                    let troopTypes = window.ALL_TROOP_IDS || ["infantry", "archers", "cavalry", "elite"];
                    let selectedType = troopTypes[Math.floor(Math.random() * troopTypes.length)];
                    if (!clan.armyDetails[selectedType]) clan.armyDetails[selectedType] = 0;
                    clan.armyDetails[selectedType] += troopsBought;
                    let total = 0;
                    for (let t in clan.armyDetails) total += clan.armyDetails[t] || 0;
                    clan.armySize = total;
                    clan.currentArmy = total;
                }
            }
            
            if (window.gainHeroXP) window.gainHeroXP(clan, 25);
            else {
                clan.xp = (clan.xp || 0) + 25;
                let requiredXP = (clan.level || 1) * 150;
                if (clan.xp >= requiredXP) {
                    clan.xp -= requiredXP;
                    clan.level = (clan.level || 1) + 1;
                    clan.skillPoints = (clan.skillPoints || 0) + 1;
                    clan.heroPower = (clan.heroPower || 100) + 15;
                }
            }
            if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(clan);
        }
        
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(hero);
        if (window.advanceExpeditionsTurn) window.advanceExpeditionsTurn();
    }

    // ==================== ПУБЛИЧНО API ====================
    window.Economy = {
        recalcIncome: recalculateIncome,
        invest: investGold,
        trade: establishTradeRoute,
        run: calculateEconomy,
        syncGold: syncHeroGold,
        getMainHero: getMainEconomicHero
    };

    // Запазваме старите глобални имена за обратна съвместимост
    window.recalculateIncome = window.Economy.recalcIncome;
    window.investGold = window.Economy.invest;
    window.establishTradeRoute = window.Economy.trade;
    window.calculateEconomy = window.Economy.run;
    window.syncHeroGold = window.Economy.syncGold;

    console.log("✅ economy.js версия 8.0 – модулна, без глобално замърсяване");
})();
