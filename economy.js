/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: economy.js (ВЕРСИЯ 6.0 – РАЗШИРЕНА ИКОНОМИКА С ТЪРГОВИЯ, ИНФЛАЦИЯ, ИНВЕСТИЦИИ)
==========================================================================
*/

// ==================== ГЛОБАЛНИ НАСТРОЙКИ ====================
if (!window.economySettings) {
    window.economySettings = {
        inflationRate: 0.01,           // 1% базовa инфлация на ход
        investmentReturnBase: 0.12,    // 12% възвращаемост на инвестиции (годишно)
        tradeRouteBaseIncome: 50,      // базов доход от търговски маршрут
        randomEventChance: 0.15,       // 15% шанс за случайно икономическо събитие на ход
        autonomousUpgradeChance: 0.1   // 10% шанс не-любим герой да модернизира регион
    };
}

// Инициализиране на нови глобални структури
if (!window.tradeRoutes) window.tradeRoutes = [];        // { from, to, income, heroId }
if (!window.investments) window.investments = [];       // { heroId, amount, turnsLeft, returnAmount }
if (!window.economyHistory) window.economyHistory = []; // запис на икономически събития

// Помощна функция за изглаждане на масив
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

// Помощна функция за показване на съобщения (попап или летопис)
function showEconomyMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        console.log(`${title}: ${message}`);
    }
}

function syncHeroGold(hero) {
    if (!hero) return;
    if (window.worldData && window.worldData.clans && hero.clan && window.worldData.clans[hero.clan]) {
        window.worldData.clans[hero.clan].gold = hero.gold;
    }
    if (window.currentHero && window.currentHero.clan === hero.clan) {
        let goldSpan = document.getElementById('val-gold');
        if (goldSpan) goldSpan.innerText = hero.gold;
    }
}

function ensureArmyDetails(hero) {
    if (window.ensureCompleteArmyDetails) {
        return window.ensureCompleteArmyDetails(hero);
    }
    if (!hero.armyDetails) hero.armyDetails = {};
    return hero.armyDetails;
}
// ==================== ОСНОВЕН ДОХОД ОТ РЕГИОНИ + ТЪРГОВИЯ + ИНВЕСТИЦИИ ====================
window.recalculateIncome = function(hero) {
    if (!hero) hero = window.currentHero;
    if (!hero) return 0;
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let skills = hero.skills || {};
    let inventoryBonuses = window.getInventoryBonuses ? window.getInventoryBonuses(hero) : { goldBonus: 0 };
    let advancedBonuses = window.getAdvancedSkillBonuses ? window.getAdvancedSkillBonuses(hero) : {};
    
    // База (нараства с ниво)
    let baseIncome = 200 + (hero.level || 1) * 10;
    if ((skills.goldRush || 0) > 0) baseIncome += (skills.goldRush * 25);
    if ((skills.bazaars || 0) > 0) baseIncome += (skills.bazaars * 15);
    
    let artifactBonusPercent = (inventoryBonuses.goldBonus || 0);
    let skillBonusPercent = (advancedBonuses.taxBonus || 0) + (advancedBonuses.goldDropBonus || 0);
    
    // Доходи от региони
    let regionIncome = 0;
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        const ownedRegionsFlat = flattenArray(window.playerRegions);
        ownedRegionsFlat.forEach(regionName => {
            const regData = window.worldData.regions[regionName];
            if (regData) {
                let infraLvl = regData.infrastructureLevel || 1;
                regionIncome += (infraLvl * 50);
                // Бонус от ресурси
                if (regData.resource === "Злато") regionIncome += 30;
                else if (regData.resource === "Сребро") regionIncome += 20;
                else if (regData.resource === "Желязо") regionIncome += 15;
            }
        });
    }
    
    // Бонус от икономически умения
    if ((skills.economy || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + (skills.economy * 0.10)));
    }
    if ((advancedBonuses.conqueredIncomeBonus || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + advancedBonuses.conqueredIncomeBonus));
    }
    
    // ========== ТЪРГОВСКИ МАРШРУТИ ==========
    let tradeIncome = 0;
    if (window.tradeRoutes && hero.id) {
        window.tradeRoutes.forEach(route => {
            if (route.heroId === hero.id) {
                // Доходът зависи от нивото на инфраструктура на двата региона
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
    
    // ========== ИНВЕСТИЦИИ (печалба от предходни инвестиции) ==========
    let investmentIncome = 0;
    if (window.investments && hero.id) {
        for (let i = window.investments.length-1; i >= 0; i--) {
            let inv = window.investments[i];
            if (inv.heroId === hero.id) {
                inv.turnsLeft--;
                if (inv.turnsLeft <= 0) {
                    investmentIncome += inv.returnAmount;
                    window.investments.splice(i,1);
                    //showEconomyMessage("ИНВЕСТИЦИЯ", `💰 Вашата инвестиция от ${inv.amount} злато ви донесе ${inv.returnAmount} злато!`, "success");
                }
            }
        }
    }
    
    let totalIncome = baseIncome + regionIncome + tradeIncome + investmentIncome;
    let percentBonus = 1 + (artifactBonusPercent / 100) + skillBonusPercent + (window.economySettings.inflationRate || 0);
    totalIncome = Math.floor(totalIncome * percentBonus);
    
    // Поддръжка на армия
    let armySize = hero.armySize || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.25);
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));
    
    let finalProfit = totalIncome - armyMaintenance;
    return finalProfit;
};
// ==================== ИНФЛАЦИЯ И СЛУЧАЙНИ СЪБИТИЯ ====================
function updateInflation() {
    // Инфлацията варира леко (от -0.5% до +2% на ход)
    let delta = (Math.random() - 0.6) * 0.02;
    window.economySettings.inflationRate += delta;
    // Ограничаваме между -0.02 и 0.05
    window.economySettings.inflationRate = Math.min(0.05, Math.max(-0.02, window.economySettings.inflationRate));
    if (Math.abs(delta) > 0.005) {
        let percent = (window.economySettings.inflationRate * 100).toFixed(1);
        showEconomyMessage("ИКОНОМИКА", `📈 Инфлацията се промени на ${percent}%.`, "info");
    }
}

function triggerRandomEconomicEvent() {
    if (Math.random() > window.economySettings.randomEventChance) return;
    const eventType = Math.floor(Math.random() * 5); // 0-4
    const hero = window.currentHero;
    if (!hero) return;
    
    switch(eventType) {
        case 0: // Икономически бум
            let boomBonus = 200 + Math.floor(Math.random() * 300);
            hero.gold += boomBonus;
            showEconomyMessage("ИКОНОМИЧЕСКИ БУМ", `📈 Търговията процъфтява! Получавате +${boomBonus} злато.`, "success");
            break;
        case 1: // Рецесия
            let recessionLoss = 100 + Math.floor(Math.random() * 200);
            hero.gold = Math.max(0, hero.gold - recessionLoss);
            showEconomyMessage("РЕЦЕСИЯ", `📉 Икономически спад! Губите ${recessionLoss} злато.`, "error");
            break;
        case 2: // Данъчна реформа
            let taxBonus = Math.floor(hero.gold * 0.05);
            hero.gold += taxBonus;
            showEconomyMessage("ДАНЪЧНА РЕФОРМА", `🏛️ Нови данъчни правила ви носят +${taxBonus} злато.`, "success");
            break;
        case 3: // Кражба на хазната
            let stolen = Math.floor(hero.gold * 0.1) + 50;
            hero.gold = Math.max(0, hero.gold - stolen);
            showEconomyMessage("КРАЖБА НА ХАЗНАТА", `💰 Крадци задигнаха ${stolen} злато!`, "error");
            break;
        case 4: // Откриване на нов пазар
            let newMarketGold = 150 + Math.floor(Math.random() * 250);
            hero.gold += newMarketGold;
            showEconomyMessage("НОВ ПАЗАР", `🛒 Открит е нов търговски път! +${newMarketGold} злато.`, "success");
            break;
    }
    syncHeroGold(hero);
}
// ==================== ТЪРГОВСКИ МАРШРУТИ ====================
window.establishTradeRoute = function(hero, fromRegion, toRegion) {
    if (!hero || !fromRegion || !toRegion) return false;
    if (!window.playerRegions.includes(fromRegion) || !window.playerRegions.includes(toRegion)) {
        showEconomyMessage("ГРЕШКА", "Можете да търгувате само между ваши региони!", "error");
        return false;
    }
    if (fromRegion === toRegion) {
        showEconomyMessage("ГРЕШКА", "Не можете да търгувате със себе си!", "error");
        return false;
    }
    let existing = window.tradeRoutes.find(r => r.heroId === hero.id && ((r.from === fromRegion && r.to === toRegion) || (r.from === toRegion && r.to === fromRegion)));
    if (existing) {
        showEconomyMessage("ГРЕШКА", "Този маршрут вече съществува!", "error");
        return false;
    }
    let cost = 200;
    if (hero.gold < cost) {
        showEconomyMessage("ГРЕШКА", `Нямате достатъчно злато! Нужни: ${cost}`, "error");
        return false;
    }
    hero.gold -= cost;
    window.tradeRoutes.push({
        heroId: hero.id,
        from: fromRegion,
        to: toRegion,
        established: window.gameTime ? `${window.gameTime.year} ${window.gameTime.era}` : "днес"
    });
    showEconomyMessage("ТЪРГОВСКИ МАРШРУТ", `✅ Установихте търговия между ${fromRegion} и ${toRegion}!`, "success");
    return true;
};

window.investGold = function(hero, amount, turns = 5) {
    if (!hero) return false;
    if (amount <= 0 || amount > hero.gold) {
        showEconomyMessage("ГРЕШКА", "Невалидна сума!", "error");
        return false;
    }
    let expectedReturn = Math.floor(amount * (1 + window.economySettings.investmentReturnBase * (turns / 4)));
    hero.gold -= amount;
    window.investments.push({
        heroId: hero.id,
        amount: amount,
        turnsLeft: turns,
        returnAmount: expectedReturn
    });
    //showEconomyMessage("ИНВЕСТИЦИЯ", `💰 Инвестирахте ${amount} злато за ${turns} хода. Очаквана печалба: ${expectedReturn}`, "info");
    return true;
};
// ==================== ОСНОВНА ИКОНОМИЧЕСКА ФУНКЦИЯ ====================
window.calculateEconomy = function() {
    if (!window.currentHero) return;

    // Нормализиране на playerRegions
    if (!window.playerRegions || !Array.isArray(window.playerRegions)) {
        window.playerRegions = [];
    }
    let normalized = [];
    for (let item of window.playerRegions) {
        if (Array.isArray(item)) {
            for (let sub of item) {
                if (typeof sub === 'string') normalized.push(sub);
            }
        } else if (typeof item === 'string') {
            normalized.push(item);
        }
    }
    window.playerRegions = normalized;
    if (window.playerRegions.length === 0 && window.currentRegion) {
        window.playerRegions.push(window.currentRegion);
    }
    
    const hero = window.currentHero;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    ensureArmyDetails(hero);

    // Инфлация
    updateInflation();
    
    // Случайно икономическо събитие
    triggerRandomEconomicEvent();
    
    let finalProfit = window.recalculateIncome(hero);
    
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0;
    syncHeroGold(hero);
    
    if (window.worldData && window.worldData.clans && hero.clan && window.worldData.clans[hero.clan]) {
        window.worldData.clans[hero.clan].gold = hero.gold;
    }

    // ========== АВТОНОМНА ИКОНОМИКА ЗА НЕ-ЛЮБИМИ ГЕРОИ (подобрена) ==========
    let favoriteNames = new Set();
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let heroData = window.worldData.clans[key];
            if (heroData.isFavorite === true || heroData.isFavoriteInBarracks === true) {
                favoriteNames.add(heroData.name || heroData.leaderName || key);
            }
        }
    }
    
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (hero && key === hero.clan) continue;
            let isFavorite = favoriteNames.has(clan.name || clan.leaderName || key);
            if (isFavorite) continue;
            
            ensureArmyDetails(clan);
            clan.gold = clan.gold || 0;
            
            // Автономен доход
            let autonomousIncome = 80 + Math.floor(Math.random() * 70);
            clan.gold += autonomousIncome;
            
            // Автономни инвестиции (рядко)
            if (Math.random() < 0.05 && clan.gold > 500) {
                let investAmount = Math.min(300, Math.floor(clan.gold * 0.2));
                window.investGold(clan, investAmount, 3);
            }
            
            // Автономно купуване на войски
            if (clan.gold >= 150 && (clan.armySize || 0) < 1000) {
                let cost = 100;
                let troopsBought = Math.floor(Math.random() * 40) + 20;
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
            
            // Автономно модернизиране на регион (ако притежава)
            if (Math.random() < window.economySettings.autonomousUpgradeChance && window.playerRegions && window.playerRegions.length > 0 && clan.gold >= 300) {
                let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
                let region = window.worldData.regions[regionName];
                if (region && region.infrastructureLevel < 5) {
                    let upgradeCost = 200 + region.infrastructureLevel * 50;
                    if (clan.gold >= upgradeCost) {
                        clan.gold -= upgradeCost;
                        region.infrastructureLevel++;
                        showEconomyMessage("МОДЕРНИЗАЦИЯ", `🏗️ ${clan.name || clan.leaderName} подобри инфраструктурата на ${regionName} до ниво ${region.infrastructureLevel}!`, "info");
                    }
                }
            }
            
            // Автономен опит
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
                }
            }
            
            if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
                window.armyMarket.sync(clan);
            }
        }
    }

    // Съобщение за активния герой
    let seasonName = "Текущ сезон";
    if (window.gameTime) {
        const seasons = ["Пролет", "Лято", "Есен", "Зима"];
        seasonName = seasons[window.gameTime.seasonIndex] || "Сезон";
    }
    let classTitle = (hero.currentClass && hero.currentClass !== "Няма клас") ? ` (${hero.currentClass})` : "";
    if (finalProfit >= 0) {
       // showEconomyMessage("ИКОНОМИКА", `💰 ${seasonName}: ${hero.name}${classTitle} събра +${finalProfit} злато.`, "info");
    } else {
        showEconomyMessage("ИКОНОМИКА", `📉 ${seasonName}: ${hero.name}${classTitle} загуби ${Math.abs(finalProfit)} злато.`, "warning");
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
        window.armyMarket.sync(hero);
    }

    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
};

window.syncHeroGold = syncHeroGold;
// ==================== ЕКСПОРТ НА НОВИТЕ ФУНКЦИИ ====================
window.establishTradeRoute = window.establishTradeRoute;
window.investGold = window.investGold;
window.showEconomyMessage = showEconomyMessage; // вътрешна, но може да се използва

console.log("✅ economy.js версия 6.0 зареден – с търговия, инвестиции, инфлация, случайни събития и пълна синхронизация.");
