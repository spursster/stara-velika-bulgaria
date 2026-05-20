/**
МОДУЛ: ИКОНОМИКА И АВТОНОМНО РАЗВИТИЕ - Велика България
СТАТУС: ОБНОВЕН - ДОБАВЕНА АВТОНОМНА ИКОНОМИКА ЗА НЕ-ЛЮБИМИТЕ ГЕРОИ
КОРЕКЦИЯ: Героите извън любимите (до 5) сами събират данъци, купуват войски и трупат XP
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

    // РАЗХОДИ ЗА ПОДДРЪЖКА НА АРМИЯТА
    let armySize = hero.currentArmy || 0;
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
    
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            // Пропускаме главния герой на играча
            if (hero && key === hero.clan) continue;
            // Пропускаме любимите герои
            let isFavorite = favoriteHeroIds.includes(key) || favoriteNames.has(clan.leaderName || clan.name || key);
            if (isFavorite) continue;
            
            // Автономен доход за не-любимите герои (по-малък от този на играча)
            let autonomousIncome = 80 + Math.floor(Math.random() * 50);
            clan.gold = (clan.gold || 0) + autonomousIncome;
            
            // Автономно купуване на войски (ако има достатъчно злато)
            if ((clan.gold || 0) >= 150 && (clan.armySize || 0) < 800) {
                let cost = 100;
                let troopsBought = Math.floor(Math.random() * 30) + 15;
                clan.gold -= cost;
                clan.armySize = (clan.armySize || 0) + troopsBought;
                clan.currentArmy = clan.armySize;
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

    // Обновяване на портала
    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
};
