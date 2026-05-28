/**
 * МОДУЛ: ОСНОВНИ ИГРОВИ МЕХАНИКИ - Велика България
 * ВЕРСИЯ: 5.0 – ХАРМОНИЗИРАНА (ВСИЧКИ СА ГЕРОИ)
 */

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

// Помощна функция за показване на съобщения (попап или летопис)
function showGameMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        console.log(`${title}: ${message}`);
    }
}

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

window.upgradeHeroSkill = function(hero, skillKey) {
    if (!hero) return { success: false, msg: "Невалиден герой." };
    window.initializeHeroRPGData(hero);
    if ((hero.skillPoints || 0) <= 0) return { success: false, msg: "Нямате свободни точки!" };
    if (typeof hero.skills[skillKey] === 'undefined') hero.skills[skillKey] = 0;
    hero.skills[skillKey] += 1;
    hero.skillPoints -= 1;
    if (skillKey === "endurance") hero.heroPower = (hero.heroPower || 100) + 10;
    if (skillKey === "tactics") hero.heroPower = (hero.heroPower || 100) + 15;
    if (window.getInventoryBonuses) {
        let invBonuses = window.getInventoryBonuses(hero);
        hero.heroPower = (100 + (hero.level * 20) + (hero.skills.tactics * 15) + (hero.skills.endurance * 10)) + invBonuses.heroPower;
    }
    if (window.rpgDatabase && window.rpgDatabase.checkArcheAgeClass) window.rpgDatabase.checkArcheAgeClass(hero);
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    return { success: true, msg: `Успешно подобрихте умението ${skillKey}!` };
};
// Старо име за съвместимост
window.upgradeLeaderSkill = window.upgradeHeroSkill;

window.evolveHeroClass = function(hero, targetClass) {
    if (!hero || (hero.level || 1) < 5) return { success: false, msg: "Ниво 5 е необходимо!" };
    hero.currentClass = targetClass;
    hero.heroPower = (hero.heroPower || 100) + 50;
    showGameMessage("ЕВОЛЮЦИЯ", `👑 Героят ${hero.name} прие клас "${targetClass}"!`, "success");
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    return { success: true, msg: `Класът е променен на ${targetClass}!` };
};
// Старо име за съвместимост
window.evolveLeaderClass = window.evolveHeroClass;

window.performResurrectionRitual = function(caster, deadHero) {
    if (!caster || !deadHero) return { success: false, msg: "Липсват данни." };
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
        showGameMessage("СЪДБА", `🔮 Ритуалът успя! ${deadHero.name} се завърна!`, "success");
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        return { success: true, msg: "Успешно възкресяване!" };
    } else {
        showGameMessage("ПРОВАЛ", `📉 Ритуалът не върна ${deadHero.name}.`, "error");
        return { success: false, msg: "Ритуалът се провали." };
    }
};

// ==================== АВТОНОМНО ЗАВЛАДЯВАНЕ НА РЕГИОНИ ====================
function autoConquestBattle(attacker, defenderPower, regionName) {
    const attackerPower = (attacker.heroPower || 100) * ((attacker.armySize || 200) / 200);
    const winChance = Math.min(0.75, attackerPower / (attackerPower + defenderPower));
    const isVictory = Math.random() < winChance;
    const lossPercent = 0.1 + Math.random() * 0.3;
    attacker.armySize = Math.max(50, Math.floor((attacker.armySize || 200) * (1 - lossPercent)));
    attacker.currentArmy = attacker.armySize;
    
    if (isVictory) {
        const xpGain = 20 + Math.floor(Math.random() * 40);
        if (window.gainHeroXP) window.gainHeroXP(attacker, xpGain);
        else attacker.xp = (attacker.xp || 0) + xpGain;
        
        if (window.addConquestLog) window.addConquestLog(attacker.name || attacker.leaderName, regionName, xpGain);
        
        if (Math.random() < 0.2) {
            showGameMessage("ЗАВЛАДЯВАНЕ", `🏰 ${attacker.name || attacker.leaderName} завладя ${regionName}! +${xpGain} XP`, "success");
        }
        return true;
    }
    if (Math.random() < 0.1) {
        showGameMessage("ПРОВАЛ", `💔 ${attacker.name || attacker.leaderName} не успя да завладeе ${regionName}.`, "error");
    }
    return false;
}

window.autonomousRegionConquest = function() {
    if (!window.worldData || !window.worldData.clans || !window.worldData.regions) return;
    
    if (Math.random() > 0.35) return;
    
    let potentialConquerors = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        // Условие: герой е нает, НЕ Е любим, има достатъчно армия
        if (hero.isJoined === true && hero.isFavorite !== true && (hero.armySize || 0) > 80) {
            potentialConquerors.push(hero);
        }
    }
    if (potentialConquerors.length === 0) return;
    
    const conqueror = potentialConquerors[Math.floor(Math.random() * potentialConquerors.length)];
    const regionKeys = Object.keys(window.worldData.regions);
    let availableRegions = regionKeys.filter(key => !(window.playerRegions && window.playerRegions.includes(key)));
    if (availableRegions.length === 0) return;
    
    const targetRegion = availableRegions[Math.floor(Math.random() * availableRegions.length)];
    const regionData = window.worldData.regions[targetRegion];
    const defenderPower = (regionData.armySize || 200) * (regionData.defenseLevel || 1);
    const isVictory = autoConquestBattle(conqueror, defenderPower, targetRegion);
    
    if (isVictory) {
        if (!window.playerRegions) window.playerRegions = [];
        if (!window.playerRegions.includes(targetRegion)) {
            window.playerRegions.push(targetRegion);
            const mapOverlay = document.getElementById('regions-map-overlay');
            if (mapOverlay) window.openRegionsMap();
        }
        if (Math.random() < 0.2 && window.historicalArtifacts) {
            const artifactKeys = Object.keys(window.historicalArtifacts);
            const randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
            const newArtifact = { ...window.historicalArtifacts[randomKey] };
            if (!conqueror.inventory) conqueror.inventory = [];
            if (conqueror.inventory.length < 30) {
                conqueror.inventory.push(newArtifact);
                // Запис в летописа вместо попап
                if (window.addWorldEvent) {
                    window.addWorldEvent("🏺 АРТЕФАКТ", `${conqueror.name} намери ${newArtifact.name} в ${targetRegion}!`, "🏺");
                }
            }
        }
    }
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
};

window.triggerAutomatedHeroActions = function() {
    if (!window.worldData || !window.worldData.clans) return;
    
    // Choose a non-favorite hero
    let candidates = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        // Ensure hero object is consistent, and isJoined/isFavorite are set if possible
        if (hero.name && hero.isJoined === true && hero.isFavorite !== true) {
            candidates.push(hero);
        }
    }
    if (candidates.length === 0) return;
    
    const hero = candidates[Math.floor(Math.random() * candidates.length)];
    const actions = [
        { 
            title: "⚔️ Тренировки", 
            desc: `${hero.name} тренира своята армия, повишавайки бойния им дух.`, 
            icon: "⚔️" 
        },
        { 
            title: "💰 Търговска сделка", 
            desc: `${hero.name} добави злато в хазната чрез успешна търговия.`, 
            icon: "💰" 
        },
        {
            title: "📜 Дипломатическа мисия",
            desc: `${hero.name} укрепи връзките с местни старейшини.`,
            icon: "📜"
        },
        {
            title: "🏗️ Строителство",
            desc: `${hero.name} надзирава строителството на нови постройки в земите си.`,
            icon: "🏗️"
        }
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    if (window.addWorldEvent) {
        const yearStr = (window.gameTime ? `${window.gameTime.year} г. ${window.gameTime.era}` : "");
        window.addWorldEvent(action.title, action.desc, action.icon, yearStr);
    }
};

window.recalculateHeroMaxHp = function(hero) {
    if (!hero) return;
    let endurance = hero.skills?.endurance || 0;
    let levelBonus = (hero.level - 1) * 20;
    let enduranceBonus = endurance * 15;
    let newMaxHp = 100 + levelBonus + enduranceBonus;
    // Бонус от артефакти
    if (hero.inventory) {
        hero.inventory.forEach(item => {
            if (item.bonus && item.bonus.health) newMaxHp += item.bonus.health;
        });
    }
    // Бонус от клас
    if (hero.classBonuses && hero.currentClass) {
        let classBonus = hero.classBonuses[hero.currentClass]?.health || 0;
        newMaxHp += classBonus;
    }
    hero.maxHp = Math.max(1, newMaxHp);
    if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
    return hero.maxHp;
};
