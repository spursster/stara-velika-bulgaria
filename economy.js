/**
МОДУЛ: ИКОНОМИКА И АВТОНОМНО РАЗВИТИЕ - Велика България
ВЕРСИЯ: 5.2 - СЪВМЕСТИМОСТ И СТАБИЛНОСТ
*/

// Помощна функция за изглаждане на масив (замества Array.flat)
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

window.recalculateIncome = function(hero) {
    if (!hero) hero = window.currentHero;
    if (!hero) return 0;
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let skills = hero.skills || {};
    let inventoryBonuses = window.getInventoryBonuses ? window.getInventoryBonuses(hero) : { goldBonus: 0 };
    let advancedBonuses = window.getAdvancedSkillBonuses ? window.getAdvancedSkillBonuses(hero) : {};
    
    let baseIncome = 200;
    if ((skills.goldRush || 0) > 0) baseIncome += (skills.goldRush * 25);
    if ((skills.bazaars || 0) > 0) baseIncome += (skills.bazaars * 15);
    
    let artifactBonusPercent = (inventoryBonuses.goldBonus || 0);
    let skillBonusPercent = (advancedBonuses.taxBonus || 0) + (advancedBonuses.goldDropBonus || 0);
    
    let regionIncome = 0;
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        // Съвместимост без Array.flat()
        const ownedRegionsFlat = flattenArray(window.playerRegions);
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
    if ((advancedBonuses.conqueredIncomeBonus || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + advancedBonuses.conqueredIncomeBonus));
    }
    
    let totalIncome = baseIncome + regionIncome;
    let percentBonus = 1 + (artifactBonusPercent / 100) + skillBonusPercent;
    totalIncome = Math.floor(totalIncome * percentBonus);
    
    let armySize = hero.armySize || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.25);
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));
    
    let finalProfit = totalIncome - armyMaintenance;
    return finalProfit;
};

window.calculateEconomy = function() {
    if (!window.currentHero) return;

        // ========== ПРЕДПАЗНА ЛОГИКА ЗА playerRegions ==========
    // 1. Гарантираме, че playerRegions е масив
    if (!window.playerRegions || !Array.isArray(window.playerRegions)) {
        window.playerRegions = [];
    }
    
    // 2. Нормализиране – превръщаме всякакви вложени масиви в плоски низове
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
    
    // 3. Ако все още няма региони (или са изтрити), добавяме началния регион
    if (window.playerRegions.length === 0) {
        // Опитваме се да вземем региона от currentRegion (соло режим) или по подразбиране
        let defaultRegion = window.currentRegion || "Плиска";
        if (window.worldData && window.worldData.regions && window.worldData.regions[defaultRegion]) {
            window.playerRegions.push(defaultRegion);
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`🏠 Възстановен е началният регион: ${defaultRegion}`);
            }
        }
    }
    
    // 4. Допълнителна проверка – ако текущият регион (за соло) не е в списъка, добавяме го
    if (window.currentRegion && !window.playerRegions.includes(window.currentRegion)) {
        window.playerRegions.push(window.currentRegion);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🏠 Добавен е текущият регион: ${window.currentRegion}`);
        }
    }
    // ====================================================
    const hero = window.currentHero;

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    ensureArmyDetails(hero);

    let finalProfit = window.recalculateIncome(hero);
    
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0;
    syncHeroGold(hero);
    
    if (window.worldData && window.worldData.clans && hero.clan && window.worldData.clans[hero.clan]) {
        window.worldData.clans[hero.clan].gold = hero.gold;
    }

    // Автономна икономика за не-любими герои
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
            
            let isFavorite = favoriteNames.has(clan.leaderName || clan.name || key);
            if (isFavorite) continue;
            
            ensureArmyDetails(clan);
            
            // Уверяваме се, че златото е число
            clan.gold = clan.gold || 0;
            let autonomousIncome = 80 + Math.floor(Math.random() * 50);
            clan.gold += autonomousIncome;
            
            // Подобрено автономно купуване
            if (clan.gold >= 150 && (clan.armySize || 0) < 800) {
                let cost = 100;
                let troopsBought = Math.floor(Math.random() * 30) + 15;
                clan.gold -= cost;
                
                let troopTypes = window.ALL_TROOP_IDS || ["infantry", "archers", "cavalry", "elite"];
                let weights = {
                    "infantry": 40, "archers": 30, "cavalry": 20, "elite": 5,
                    "vampire": 2, "werewolf": 2, "highelf": 3, "troll": 2,
                    "dragon_young": 1, "wizard": 3, "lich": 1, "fairy_healer": 3,
                    "griffin": 2, "elf_archer": 3, "necromancer": 2
                };
                
                let totalWeight = 0;
                for (let type of troopTypes) totalWeight += weights[type] || 5;
                
                let random = Math.random() * totalWeight;
                let accumulated = 0;
                let selectedType = "infantry";
                
                for (let type of troopTypes) {
                    accumulated += weights[type] || 5;
                    if (random <= accumulated) {
                        selectedType = type;
                        break;
                    }
                }
                
                if (!clan.armyDetails[selectedType]) clan.armyDetails[selectedType] = 0;
                clan.armyDetails[selectedType] += troopsBought;
                
                let total = 0;
                for (let t in clan.armyDetails) total += clan.armyDetails[t] || 0;
                clan.armySize = total;
                clan.currentArmy = total;
                
                if (window.showAdvisorMsg && Math.random() < 0.1) {
                    let troopName = selectedType;
                    if (window.ALL_TROOP_TYPES) {
                        let found = window.ALL_TROOP_TYPES.find(t => t.id === selectedType);
                        if (found) troopName = found.name;
                    }
                    window.showAdvisorMsg(`📢 ${clan.leaderName || clan.name} нае ${troopsBought} × ${troopName}!`);
                }
            }
            
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
            
            if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
                window.armyMarket.sync(clan);
            }
        }
    }

    if (window.showAdvisorMsg) {
        let seasonName = "Текущ сезон";
        if (window.gameTime) {
            const seasons = ["Пролет", "Лято", "Есен", "Зима"];
            seasonName = seasons[window.gameTime.seasonIndex] || "Сезон";
        }
        let classTitle = (hero.currentClass && hero.currentClass !== "Няма клас") ? ` (${hero.currentClass})` : "";
        if (finalProfit >= 0) {
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Кан ${hero.name}${classTitle} събра +${finalProfit} злато.`);
        } else {
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Чист дефицит: ${finalProfit} злато.`);
        }
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
        window.armyMarket.sync(hero);
    }

    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
};

window.syncHeroGold = syncHeroGold;
