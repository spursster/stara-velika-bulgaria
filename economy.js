/**
МОДУЛ: ИКОНОМИКА И АВТОНОМНО РАЗВИТИЕ - Велика България
ВЕРСИЯ: 5.0 - КОРИГИРАНА ВЕРСИЯ С ПРАВИЛНО ПРЕИЗЧИСЛЯВАНЕ
*/

// Помощна функция за синхронизиране на златото
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

// Помощна функция за осигуряване на armyDetails
function ensureArmyDetails(hero) {
    if (window.ensureCompleteArmyDetails) {
        return window.ensureCompleteArmyDetails(hero);
    }
    if (!hero.armyDetails) hero.armyDetails = {};
    return hero.armyDetails;
}

// Функция за преизчисляване на доходите (извиква се след завоевания)
window.recalculateIncome = function(hero) {
    if (!hero) hero = window.currentHero;
    if (!hero) return 0;
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let skills = hero.skills || {};
    let inventoryBonuses = window.getInventoryBonuses ? window.getInventoryBonuses(hero) : { goldBonus: 0 };
    let advancedBonuses = window.getAdvancedSkillBonuses ? window.getAdvancedSkillBonuses(hero) : {};
    
    // 1. Базов доход
    let baseIncome = 200;
    if ((skills.goldRush || 0) > 0) baseIncome += (skills.goldRush * 25);
    if ((skills.bazaars || 0) > 0) baseIncome += (skills.bazaars * 15);
    
    // 2. Бонус от артефакти
    let artifactBonusPercent = (inventoryBonuses.goldBonus || 0);
    
    // 3. Бонус от умения
    let skillBonusPercent = (advancedBonuses.taxBonus || 0) + (advancedBonuses.goldDropBonus || 0);
    
    // 4. Доходи от региони
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
    
    // 5. Бонуси към регионите
    if ((skills.economy || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + (skills.economy * 0.10)));
    }
    if ((advancedBonuses.conqueredIncomeBonus || 0) > 0) {
        regionIncome = Math.floor(regionIncome * (1 + advancedBonuses.conqueredIncomeBonus));
    }
    
    // 6. Общ доход
    let totalIncome = baseIncome + regionIncome;
    let percentBonus = 1 + (artifactBonusPercent / 100) + skillBonusPercent;
    totalIncome = Math.floor(totalIncome * percentBonus);
    
    // 7. Разходи за поддръжка
    let armySize = hero.armySize || 0;
    let baseMaintenanceCost = Math.floor(armySize * 0.25);
    let logisticsDiscount = Math.min(0.50, (skills.logistics || 0) * 0.05);
    let armyMaintenance = Math.floor(baseMaintenanceCost * (1 - logisticsDiscount));
    
    // 8. Чиста печалба
    let finalProfit = totalIncome - armyMaintenance;
    
    return finalProfit;
};

window.calculateEconomy = function() {
    if (!window.currentHero) return;
    const hero = window.currentHero;

    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }
    
    ensureArmyDetails(hero);

    let finalProfit = window.recalculateIncome(hero);
    
    // Прилагане на печалбата
    hero.gold = (hero.gold || 0) + finalProfit;
    if (hero.gold < 0) hero.gold = 0;
    
    // Синхронизация
    syncHeroGold(hero);
    
    if (window.worldData && window.worldData.clans && hero.clan && window.worldData.clans[hero.clan]) {
        window.worldData.clans[hero.clan].gold = hero.gold;
    }

    // ==================== 2. АВТОНОМНА ИКОНОМИКА ЗА НЕ-ЛЮБИМИТЕ ГЕРОИ ====================
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
            
            // Автономен доход
            let autonomousIncome = 80 + Math.floor(Math.random() * 50);
            clan.gold = (clan.gold || 0) + autonomousIncome;
            
            // Автономно купуване на войски
            if ((clan.gold || 0) >= 150 && (clan.armySize || 0) < 800) {
                let cost = 100;
                let troopsBought = Math.floor(Math.random() * 30) + 15;
                clan.gold -= cost;
                
                // Разпределяме войниците пропорционално
                if (window.ALL_TROOP_IDS) {
                    let basicTypes = ["infantry", "archers", "cavalry", "elite"];
                    let type = basicTypes[Math.floor(Math.random() * basicTypes.length)];
                    clan.armyDetails[type] = (clan.armyDetails[type] || 0) + troopsBought;
                } else {
                    clan.armyDetails.infantry = (clan.armyDetails.infantry || 0) + troopsBought;
                }
                
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
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Кан ${hero.name}${classTitle} събра +${finalProfit} злато.`);
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

// Експорт на helper функциите
window.syncHeroGold = syncHeroGold;
window.recalculateIncome = window.recalculateIncome;
