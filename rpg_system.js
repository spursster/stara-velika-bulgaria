// =========================================================================
// ВЕЛИКА БЪЛГАРИЯ - rpg_system.js (КОРИГИРАН – ПРАВИЛНО STOREDXP + ФИКС НА autoAssignSkillPoint)
// =========================================================================

window.rpgDatabase = window.rpgDatabase || {};

window.rpgDatabase.getXPRequiredForLevel = function(level) {
    return (level || 1) * 150;
};

window.rpgDatabase.petsDatabase = {
    "falcon": { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." },
    "wolf": { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен Смазващ удар." },
    "stallion": { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." },
    "bear": { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." },
    "viper": { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." }
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    if (hero.isRPGInitialized) return;
    hero.level = hero.level || 1;
    hero.xp = hero.xp || 0;
    hero.storedXP = hero.storedXP || 0;
    hero.skillPoints = hero.skillPoints || 0;
    hero.skills = hero.skills || {};
    hero.currentClass = hero.currentClass || "Багатур";
    hero.heroPower = hero.heroPower || 150;
    hero.isAuto = hero.isAuto !== undefined ? hero.isAuto : true;
    hero.army = hero.army || 0;
    hero.battlesWon = hero.battlesWon || 0;
    hero.battlesLost = hero.battlesLost || 0;
    if (!hero.equipment) hero.equipment = Array(12).fill(null);
    if (!hero.inventory) hero.inventory = [];
    if (hero.pet === undefined) hero.pet = null;
    if (hero.learnedSkills === undefined) hero.learnedSkills = {};
    hero.isRPGInitialized = true;
};

// ==================== ФУНКЦИЯ ЗА КОНСУМИРАНЕ НА STOREDXP ====================
window.consumeStoredXPForHero = function(hero) {
    if (!hero) return false;
    if (!hero.isAuto && hero.storedXP > 0) {
        let leveledUp = false;
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        
        while (hero.storedXP >= requiredXP && hero.level < 100) {
            hero.storedXP -= requiredXP;
            hero.level++;
            hero.skillPoints++;
            hero.heroPower += 25;
            leveledUp = true;
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`🆙 ${hero.name} достигна Ниво ${hero.level} (от натрупан опит)! +1 Точка за умения`);
            }
        }
        
        if (leveledUp) {
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            if (!hero.isAuto && hero.skillPoints > 0 && window.autoAssignSkillPoint) {
                window.autoAssignSkillPoint(hero);
            }
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
            if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        }
        
        return leveledUp;
    }
    return false;
};

// ==================== ОПИТ И НИВА ====================
window.gainHeroXP = function(hero, amount) {
    if (!hero) return;
    window.initializeHeroRPGData(hero);
    
    if (hero.isAuto) {
        // Автоматичен режим - XP отива директно в xp и се използва веднага
        hero.xp += amount;
        var requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        var leveledUp = false;
        
        while (hero.xp >= requiredXP && hero.level < 100) {
            hero.xp -= requiredXP;
            hero.level++;
            hero.skillPoints++;
            hero.heroPower += 25;
            leveledUp = true;
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg("🆙 " + hero.name + " достигна Ниво " + hero.level + "! (+1 Точка за умения)");
            }
        }
        
        if (leveledUp) {
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            if (hero.isAuto && hero.skillPoints > 0 && window.autoAssignSkillPoint) {
                window.autoAssignSkillPoint(hero);
            }
        }
    } else {
        // Ръчен режим - XP отива в storedXP
        hero.storedXP += amount;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("📚 " + hero.name + " натрупа " + amount + " ръчен опит! (Общо: " + hero.storedXP + ")");
        }
        // Опитваме се да консумираме storedXP за качване на ниво
        window.consumeStoredXPForHero(hero);
    }
    
    // Премахната грешната синхронизация (коментирано)
    // if (window.worldData && window.worldData.clans && hero.clan) window.worldData.clans[hero.clan] = hero;
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    
    if (window.openHeroRPGModal && document.getElementById('hero-rpg-modal') && 
        document.getElementById('hero-rpg-modal').style.display === 'block') {
        window.openHeroRPGModal(hero.clan);
    }
};

// ==================== АВТОМАТИЧЕН / РЪЧЕН РЕЖИМ ====================
window.toggleHeroAutoMode = function(clanKey) {
    var hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) hero = window.worldData.clans[clanKey];
    else if (window.unlockedLeaders) hero = window.unlockedLeaders.find(function(h) { return h.clan === clanKey || h.name === clanKey; });
    else if (window.currentHero && window.currentHero.clan === clanKey) hero = window.currentHero;
    if (!hero) return;
    window.initializeHeroRPGData(hero);
    hero.isAuto = !hero.isAuto;
    
    if (!hero.isAuto && hero.xp > 0) {
        hero.storedXP += hero.xp;
        hero.xp = 0;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔄 Режимът на " + hero.name + " е сменен на РЪЧЕН. " + hero.storedXP + " XP са прехвърлени в склад.");
        }
    } else if (hero.isAuto && hero.storedXP > 0) {
        var amount = hero.storedXP;
        hero.storedXP = 0;
        window.gainHeroXP(hero, amount);
    }
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    var modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') window.openHeroRPGModal(clanKey);
};

// ==================== НОВА СИСТЕМА ЗА АВТОМАТИЧНО УЧЕНЕ НА УМЕНИЯ ====================
window.autoAssignSkillPoint = function(hero) {
    if (hero.skillPoints <= 0) return;
    if (!window.advancedSkills) {
        console.warn("advancedSkills не е зареден – няма нови умения.");
        return;
    }
    if (!hero.learnedSkills) hero.learnedSkills = {};
    
    const allSkills = [];
    for (let treeKey in window.advancedSkills) {
        const tree = window.advancedSkills[treeKey];
        if (!tree || !tree.skills) continue;
        for (let skillKey in tree.skills) {
            const skill = tree.skills[skillKey];
            const currentLevel = hero.learnedSkills[skillKey] || 0;
            if (currentLevel < skill.maxLevel) {
                allSkills.push({ treeKey, skillKey, skill });
            }
        }
    }
    
    if (allSkills.length === 0) return;
    
    let attempts = 0;
    let learned = false;
    
    while (!learned && attempts < 10 && hero.skillPoints > 0 && allSkills.length > 0) {
        const random = allSkills[Math.floor(Math.random() * allSkills.length)];
        
        let pointsInTree = 0;
        for (let sk in hero.learnedSkills) {
            if (window.advancedSkills[random.treeKey] && window.advancedSkills[random.treeKey].skills[sk]) {
                pointsInTree += hero.learnedSkills[sk];
            }
        }
        
        if (hero.level >= random.skill.reqLevel && pointsInTree >= random.skill.reqPointsInTree) {
            hero.learnedSkills[random.skillKey] = (hero.learnedSkills[random.skillKey] || 0) + 1;
            hero.skillPoints--;
            learned = true;
            
            const effect = random.skill.effect(hero.learnedSkills[random.skillKey]);
            if (effect.attackBonus) hero.heroPower += effect.attackBonus;
            if (effect.defenseBonus) hero.defense = (hero.defense || 0) + effect.defenseBonus;
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`🤖 Автоматично: ${hero.name} научи "${random.skill.name}" (Ниво ${hero.learnedSkills[random.skillKey]})!`);
            }
        }
        attempts++;
    }
};

// ==================== НОВА КЛАСОВА ЕВОЛЮЦИЯ ====================
window.checkArcheAgeClass = function(hero) {
    if (!hero) return;
    if (!window.hybridClasses || !Array.isArray(window.hybridClasses)) {
        console.warn("hybridClasses не е зареден – няма нови класове.");
        return;
    }
    
    let skillLevels = {};
    for (let key in hero.skills) {
        if (hero.skills[key] > 0) skillLevels[key] = hero.skills[key];
    }
    
    const available = window.hybridClasses.filter(cls => {
        if (hero.level < cls.reqLevel) return false;
        return cls.reqSkills.every(skill => skillLevels[skill] >= 1);
    });
    
    if (available.length === 0) return;
    available.sort((a, b) => b.reqLevel - a.reqLevel);
    const newClass = available[0];
    
    if (hero.currentClass !== newClass.name) {
        const oldClass = hero.currentClass;
        hero.currentClass = newClass.name;
        if (window.applyClassBonuses) window.applyClassBonuses(hero, newClass.name);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: ${hero.name} се издигна от "${oldClass}" до "${hero.currentClass}" (${newClass.reqSkills.join(' + ')})!`);
        }
    }
};

// ==================== ПОМОЩНИ ФУНКЦИИ ====================
window.calculateArtifactSetBonuses = function(hero) {
    if (!hero || !hero.inventory) return {};
    var setsCollected = {};
    var totalSetBonus = { heroPower: 0, goldBonus: 0, defense: 0, armyBonus: 0, diplomacyBonus: 0, mysticismBonus: 0 };
    
    for (var i = 0; i < hero.inventory.length; i++) {
        var item = hero.inventory[i];
        if (item && item.set && window.historicalArtifacts && window.historicalArtifacts[item.id]) {
            var artifact = window.historicalArtifacts[item.id];
            if (!setsCollected[artifact.set]) setsCollected[artifact.set] = [];
            if (setsCollected[artifact.set].indexOf(artifact.id) === -1) setsCollected[artifact.set].push(artifact.id);
        }
    }
    
    for (var setKey in setsCollected) {
        if (window.artifactSetBonuses && window.artifactSetBonuses[setKey]) {
            var setInfo = window.artifactSetBonuses[setKey];
            if (setsCollected[setKey].length >= setInfo.pieces) {
                console.log("✨ Активиран сет: " + setInfo.name);
                for (var bonus in setInfo.bonus) {
                    totalSetBonus[bonus] = (totalSetBonus[bonus] || 0) + setInfo.bonus[bonus];
                }
            }
        }
    }
    return totalSetBonus;
};

window.recalculateHeroPower = function(hero) {
    if (!hero) return;
    var basePower = hero.baseHeroPower || hero.heroPower || 100;
    var artifactBonus = 0;
    var setBonus = 0;
    var skillBonus = 0;
    
    if (hero.inventory) {
        for (var i = 0; i < hero.inventory.length; i++) {
            var item = hero.inventory[i];
            if (item && item.bonus && item.bonus.heroPower) artifactBonus += item.bonus.heroPower;
        }
    }
    
    if (hero.learnedSkills) {
        const bonuses = window.getAdvancedSkillBonuses ? window.getAdvancedSkillBonuses(hero) : {};
        if (bonuses.attackBonus) skillBonus += bonuses.attackBonus;
    }
    
    var setBonuses = window.calculateArtifactSetBonuses(hero);
    setBonus = setBonuses.heroPower || 0;
    hero.heroPower = basePower + artifactBonus + setBonus + skillBonus;
    
    return hero.heroPower;
};

window.getSkillLevel = function(hero, skillKey) {
    if (!hero || !hero.learnedSkills) return 0;
    return hero.learnedSkills[skillKey] || 0;
};

window.getHeroCombatBonus = function(hero, bonusType) {
    if (!hero || !hero.learnedSkills) return 0;
    var bonus = 0;
    
    for (let sk in hero.learnedSkills) {
        const level = hero.learnedSkills[sk];
        for (let treeKey in window.advancedSkills) {
            const skill = window.advancedSkills[treeKey].skills[sk];
            if (skill) {
                const effect = skill.effect(level);
                if (bonusType === 'attack' && effect.attackBonus) bonus += effect.attackBonus;
                if (bonusType === 'defense' && effect.defenseBonus) bonus += effect.defenseBonus;
                if (bonusType === 'critical' && effect.critChance) bonus += effect.critChance;
                break;
            }
        }
    }
    return bonus;
};

console.log("✅ rpg_system.js зареден (финална версия – всички грешки са оправени)");
