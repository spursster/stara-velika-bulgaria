/**
 * МОДУЛ: ОСНОВНИ ИГРОВИ МЕХАНИКИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН + АВТОНОМНО ЗАВЛАДЯВАНЕ НА РЕГИОНИ
 */

// База данни за родовите бонуси (Perks) на 13-те клана в играта
window.clanPerks = {
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.25, desc: "+25% Легитимност (Родът на Кановете)" },
    "Комитопули": { power: 1.15, defense: 1.15, desc: "+15% Защита на крепостите" },
    "Асеневци": { power: 1.0, recovery: 1.25, desc: "+25% Скорост на възстановяване на армията" },
    "Тертер": { power: 1.1, mobility: 1.15, desc: "+15% Скорост при поход" },
    "Даки": { power: 1.1, armyCost: 0.85, desc: "-15% Цена за наемане на войска" },
    "Уния Траки": { power: 1.15, gold: 1.15, desc: "+15% Добиви на скъпоценности и съкровища" },
    "Шишмановци": { power: 1.0, buildCost: 0.8, desc: "-20% Цена за строеж на сгради" },
    "Македони": { power: 1.2, empireTactics: 1.2, desc: "+20% Бойна ефективност при щурм" },
    "Птоломеи": { power: 1.0, gold: 1.3, desc: "+30% Приходи от търговия" },
    "Одриси": { power: 1.15, cavalryPower: 1.2, desc: "+20% Нападателна мощ на конницата" },
    "Бесараб": { power: 1.0, gold: 1.2, desc: "+20% Данъчен икономически бонус" },
    "Османци Дуло": { power: 1.1, vassalTax: 1.25, desc: "+25% Приходи от васали" },
    "Скити": { power: 1.1, horseArchers: 1.25, desc: "+25% Щети на конните стрелци" }
};

/**
 * ИНИЦИАЛИЗИРАНЕ НА НАЧАЛНИ RPG ХАРАКТЕРИСТИКИ ЗА ГЕРОЙ
 */
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    
    if (typeof hero.level === 'undefined') hero.level = 1;
    if (typeof hero.xp === 'undefined') hero.xp = 0;
    if (typeof hero.skillPoints === 'undefined') hero.skillPoints = 0;
    if (typeof hero.heroPower === 'undefined') hero.heroPower = 100;
    if (typeof hero.currentClass === 'undefined') hero.currentClass = "Багатур";
    if (typeof hero.inventory === 'undefined') hero.inventory = [];
    if (typeof hero.isDead === 'undefined') hero.isDead = false;

    if (!hero.skills) {
        hero.skills = {
            tactics: 0, endurance: 0, heavyStrike: 0, bloodbath: 0,
            economy: 0, goldRush: 0, bazaars: 0, cartel: 0,
            ambush: 0, poisonBlade: 0, shadowStep: 0, assassinate: 0,
            mysticism: 0, tangraFire: 0, vampirism: 0, raiseDead: 0
        };
    }
};

/**
 * ВДИГАНЕ НА НИВО НА КОНКРЕТНО DIABLO УМЕНИЕ НА ГЕРОЯ
 */
window.upgradeLeaderSkill = function(hero, skillKey) {
    if (!hero) return { success: false, msg: "Невалиден герой." };
    
    window.initializeHeroRPGData(hero);
    
    if ((hero.skillPoints || 0) <= 0) {
        return { success: false, msg: "Нямате свободни точки за разпределяне!" };
    }

    if (typeof hero.skills[skillKey] === 'undefined') {
        hero.skills[skillKey] = 0;
    }

    hero.skills[skillKey] += 1;
    hero.skillPoints -= 1;
    
    if (skillKey === "endurance") hero.heroPower = (hero.heroPower || 100) + 10;
    if (skillKey === "tactics") hero.heroPower = (hero.heroPower || 100) + 15;

    if (window.getInventoryBonuses) {
        let invBonuses = window.getInventoryBonuses(hero);
        hero.heroPower = (100 + (hero.level * 20) + (hero.skills.tactics * 15) + (hero.skills.endurance * 10)) + invBonuses.heroPower;
    }

    if (window.rpgDatabase && window.rpgDatabase.checkArcheAgeClass) {
        window.rpgDatabase.checkArcheAgeClass(hero);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    return { success: true, msg: `Успешно подобрихте умението ${skillKey}!` };
};

/**
 * КЛАСОВА ЕВОЛЮЦИЯ НА ГЕРОЯ (ARCHEAGE ХИБРИДИЗАЦИЯ)
 */
window.evolveLeaderClass = function(hero, targetClass) {
    if (!hero || (hero.level || 1) < 5) {
        return { success: false, msg: "Героят трябва да е достигнал поне 5-то ниво!" };
    }
    
    hero.currentClass = targetClass;
    hero.heroPower = (hero.heroPower || 100) + 50; 

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: Героят ${hero.name} прие новия клас: \"${targetClass}\"! Мощта му нарасна.`);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    return { success: true, msg: `Класът е успешно променен на ${targetClass}!` };
};

/**
 * РИТУАЛ ЗА ВЪЗКРЕСЯВАНЕ НА УБИТ ГЕРОЙ
 */
window.performResurrectionRitual = function(caster, deadHero) {
    if (!caster || !deadHero) return { success: false, msg: "Липсват данни за героя." };
    
    window.initializeHeroRPGData(caster);
    window.initializeHeroRPGData(deadHero);

    const mysticismLevel = caster.skills ? (caster.skills.mysticism || 0) : 0;
    
    let baseChance = 0.40 + (mysticismLevel * 0.15); 
    let roll = Math.random();

    if (roll <= baseChance) {
        deadHero.isDead = false;
        deadHero.currentArmy = 50; 
        deadHero.armySize = 50;

        if (window.worldData && window.worldData.clans && window.worldData.clans[deadHero.clan]) {
            window.worldData.clans[deadHero.clan].isDead = false;
            window.worldData.clans[deadHero.clan].currentArmy = 50;
            window.worldData.clans[deadHero.clan].armySize = 50;
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🔮 СЪДБА: Свещеният ритуал успя! Героят ${deadHero.name} се завърна на бойното поле!`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

        return { success: true, msg: `Успешно възкресяване!` };
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`📉 ПРОВАЛ: Ритуалът не върна героя ${deadHero.name}. Опитайте отново през следващия сезон.`);
        }
        return { success: false, msg: "Ритуалът се провали." };
    }
};

// ==================== АВТОНОМНО ЗАВЛАДЯВАНЕ НА РЕГИОНИ ====================

/**
 * Автономна битка за завладяване на регион (опростена)
 */
function autoConquestBattle(attacker, defenderPower, regionName) {
    const attackerPower = (attacker.heroPower || 100) * ((attacker.armySize || 200) / 200);
    const winChance = Math.min(0.75, attackerPower / (attackerPower + defenderPower));
    const isVictory = Math.random() < winChance;
    
    // Загуби в битката (10-40% от армията)
    const lossPercent = 0.1 + Math.random() * 0.3;
    attacker.armySize = Math.max(50, Math.floor((attacker.armySize || 200) * (1 - lossPercent)));
    attacker.currentArmy = attacker.armySize;
    
    if (isVictory) {
        // XP награда
        const xpGain = 20 + Math.floor(Math.random() * 40);
        if (window.gainHeroXP) {
            window.gainHeroXP(attacker, xpGain);
        } else {
            attacker.xp = (attacker.xp || 0) + xpGain;
        }
        
        if (window.showAdvisorMsg && Math.random() < 0.2) {
            window.showAdvisorMsg(`🏰 ${attacker.leaderName || attacker.name} завладя ${regionName}! +${xpGain} XP`);
        }
        return true;
    }
    
    if (window.showAdvisorMsg && Math.random() < 0.1) {
        window.showAdvisorMsg(`💔 ${attacker.leaderName || attacker.name} не успя да завладeе ${regionName}.`);
    }
    return false;
}

/**
 * Автономно завладяване на региони от не-любимите герои
 */
window.autonomousRegionConquest = function() {
    if (!window.worldData || !window.worldData.clans || !window.worldData.regions) return;
    
    // Вземаме списъка с любими герои
    let favoriteIds = new Set();
    if (window.favoriteHeroes && typeof window.favoriteHeroes.forEach === 'function') {
        window.favoriteHeroes.forEach(id => favoriteIds.add(id));
    }
    
    // 15% шанс някой не-любим герой да опита да завладее регион
    if (Math.random() > 0.15) return;
    
    // Събираме всички не-любими герои с достатъчно армия
    let potentialConquerors = [];
    for (let key in window.worldData.clans) {
        let clan = window.worldData.clans[key];
        if (clan.isJoined === true && !favoriteIds.has(key) && (clan.armySize || 0) > 150) {
            potentialConquerors.push(clan);
        }
    }
    
    if (potentialConquerors.length === 0) return;
    
    // Избираме случаен завоевател
    const conqueror = potentialConquerors[Math.floor(Math.random() * potentialConquerors.length)];
    
    // Избираме случаен регион (който не е владян от този герой)
    const regionKeys = Object.keys(window.worldData.regions);
    let availableRegions = regionKeys.filter(key => {
        const reg = window.worldData.regions[key];
        // Регионът не е владян от този завоевател
        return !(window.playerRegions && window.playerRegions.includes(key));
    });
    
    if (availableRegions.length === 0) return;
    
    const targetRegion = availableRegions[Math.floor(Math.random() * availableRegions.length)];
    const regionData = window.worldData.regions[targetRegion];
    const defenderPower = (regionData.armySize || 200) * (regionData.defenseLevel || 1);
    
    // Автономна битка
    const isVictory = autoConquestBattle(conqueror, defenderPower, targetRegion);
    
    if (isVictory) {
        // Маркираме региона като владян от този герой (добавяме към playerRegions)
        if (!window.playerRegions) window.playerRegions = [];
        if (!window.playerRegions.includes(targetRegion)) {
            window.playerRegions.push(targetRegion);
            
            // Обновяваме картата (ако е отворена)
            if (typeof window.openRegionsMap === 'function') {
                // Само обновяваме, без да отваряме наново
                const mapOverlay = document.getElementById('regions-map-overlay');
                if (mapOverlay) window.openRegionsMap();
            }
        }
        
        // 20% шанс за откриване на артефакт в региона
        if (Math.random() < 0.2 && window.historicalArtifacts) {
            const artifactKeys = Object.keys(window.historicalArtifacts);
            const randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
            const newArtifact = { ...window.historicalArtifacts[randomKey] };
            if (!conqueror.inventory) conqueror.inventory = [];
            if (conqueror.inventory.length < 30) {
                conqueror.inventory.push(newArtifact);
                if (window.showAdvisorMsg) {
                    window.showAdvisorMsg(`🎁 ${conqueror.leaderName || conqueror.name} намери артефакт в ${targetRegion}: ${newArtifact.name}!`);
                }
            }
        }
    }
    
    // Обновяваме UI
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

// Изпълняваме автономно завладяване на всеки ход (ако функцията се извиква от processTurn)
if (typeof window.autonomousRegionConquest === 'function') {
    // Функцията ще се извиква от time.js
}
