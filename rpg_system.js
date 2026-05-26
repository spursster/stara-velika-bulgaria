// =========================================================================
// ВЕЛИКА БЪЛГАРИЯ - rpg_system.js (ВЕРСИЯ 7.0 – ФИКСАНА ИНИЦИАЛИЗАЦИЯ НА HP)
// =========================================================================

window.rpgDatabase = window.rpgDatabase || {};

// Нова формула за XP (по-балансирана)
window.rpgDatabase.getXPRequiredForLevel = function(level) {
    return Math.floor(100 + (level - 1) * 50 + Math.pow(level - 1, 1.5) * 5);
};

// Разширена база с питомци (добавени нови)
window.rpgDatabase.petsDatabase = {
    "falcon": { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." },
    "wolf": { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен удар." },
    "stallion": { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." },
    "bear": { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." },
    "viper": { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." },
    // Нови питомци
    "dragonling": { id: "dragonling", name: "Млад дракон", icon: "🐉", desc: "Огнено дихание: +20% щети при атака." },
    "phoenix": { id: "phoenix", name: "Феникс", icon: "🔥", desc: "Възкресение: 30% шанс да се съживи след смърт." }
};

// Помощна функция за показване на съобщения
function showRPGMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        console.log(`${title}: ${message}`);
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ НА ГЕРОЙ (С НОВИ ПОЛЕТА) ====================
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    
    // Премахваме проверката isRPGInitialized, за да може да се извиква повторно (заради стари запазени игри)
    // Но запазваме другите инициализации, ако липсват.
    
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
    if (hero.titles === undefined) hero.titles = [];
    if (hero.prestige === undefined) hero.prestige = 0;
    
    // === ИНИЦИАЛИЗАЦИЯ НА HP (ФИКСАНА, без да се разчита на isRPGInitialized) ===
    // Проверяваме дали hp липсва или е NaN
    if (hero.hp === undefined || hero.hp === null || isNaN(hero.hp)) {
        let endurance = hero.skills?.endurance || 0;
        let levelBonus = (hero.level - 1) * 20;
        hero.maxHp = 100 + levelBonus + endurance * 15;
        hero.hp = hero.maxHp;
        console.log(`✅ Инициализиран HP за ${hero.name}: ${hero.hp}/${hero.maxHp}`);
    }
    if (hero.isAlive === undefined) hero.isAlive = true;
    
    // Маркираме като инициализиран, но не пречи на повторно извикване
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
           // showRPGMessage("НИВО НАГОРЕ", `🆙 ${hero.name} достигна Ниво ${hero.level} (от натрупан опит)! +1 Точка за умения`, "success");
        }
        if (hero === window.currentHero || hero.isFavorite === true) {
    showRPGMessage("НИВО НАГОРЕ", `🆙 ${hero.name} достигна Ниво ${hero.level} (от натрупан опит)! +1 Точка за умения`, "success");
}
        if (leveledUp) {
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            if (!hero.isAuto && hero.skillPoints > 0 && window.autoAssignSkillPoint) {
                window.autoAssignSkillPoint(hero);
            }
            // Автоматична екипировка (ако съществува функцията от items.js)
            if (hero.isAuto && typeof window.autoEquipHero === 'function') {
                window.autoEquipHero(hero);
            }
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        }
        return leveledUp;
    }
    return false;
};

// ==================== ОПИТ И НИВА (ОСНОВНА ФУНКЦИЯ) ====================
window.gainHeroXP = function(hero, amount) {
    if (!hero) return;
    window.initializeHeroRPGData(hero);
    if (hero.isAuto) {
        hero.xp += amount;
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        let leveledUp = false;
        while (hero.xp >= requiredXP && hero.level < 100) {
            hero.xp -= requiredXP;
            hero.level++;
            hero.skillPoints++;
            hero.heroPower += 25;
            leveledUp = true;
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        }
        if (leveledUp) {
            // Преизчисляване на maxHp
            let oldMaxHp = hero.maxHp;
            let endurance = hero.skills?.endurance || 0;
            let newMaxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
            hero.maxHp = newMaxHp;
            hero.hp = hero.hp + (newMaxHp - oldMaxHp);
            if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
            
            if (window.addWorldEvent) {
                window.addWorldEvent("🆙 НИВО НАГОРЕ", `${hero.name} достигна Ниво ${hero.level}! (+1 точка умения)`, "🆙");
            }
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            if (hero.isAuto && hero.skillPoints > 0 && window.autoAssignSkillPoint) {
                window.autoAssignSkillPoint(hero);
            }
            if (hero.isAuto && typeof window.autoEquipHero === 'function') {
                window.autoEquipHero(hero);
            }
        }
    } else {
        hero.storedXP += amount;
        window.consumeStoredXPForHero(hero);
    }
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};

// ==================== АВТОМАТИЧЕН / РЪЧЕН РЕЖИМ ====================
window.toggleHeroAutoMode = function(heroId) {
    let hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[heroId]) {
        hero = window.worldData.clans[heroId];
    } else if (window.unlockedHeroes) {
        hero = window.unlockedHeroes.find(h => h.clan === heroId || h.name === heroId);
    } else if (window.currentHero && window.currentHero.clan === heroId) {
        hero = window.currentHero;
    }
    if (!hero) return;
    window.initializeHeroRPGData(hero);
    hero.isAuto = !hero.isAuto;
    if (!hero.isAuto && hero.xp > 0) {
        hero.storedXP += hero.xp;
        hero.xp = 0;
        showRPGMessage("РЕЖИМ", `🔄 Режимът на ${hero.name} е сменен на РЪЧЕН. ${hero.storedXP} XP са прехвърлени в склад.`, "info");
    } else if (hero.isAuto && hero.storedXP > 0) {
        let amount = hero.storedXP;
        hero.storedXP = 0;
        window.gainHeroXP(hero, amount);
    }
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
    let modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') window.openHeroRPGModal(heroId);
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
            showRPGMessage("АВТО-УМЕНИЕ", `🤖 ${hero.name} научи "${random.skill.name}" (Ниво ${hero.learnedSkills[random.skillKey]})!`, "info");
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
        showRPGMessage("ЕВОЛЮЦИЯ", `👑 ${hero.name} се издигна от "${oldClass}" до "${hero.currentClass}" (${newClass.reqSkills.join(' + ')})!`, "success");
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

function getPetBonuses(hero) {
    if (!hero || !hero.pet) return {};
    let petId = hero.pet;
    if (window.divinePets && window.divinePets[petId]) {
        return window.divinePets[petId].bonus || {};
    }
    if (window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[petId]) {
        let pet = window.rpgDatabase.petsDatabase[petId];
        let petName = (pet.name || "").trim().toLowerCase();
        if (petName === "родов сокол") return { attackBonusPercent: 0.15 };
        if (petName === "вълк единак") return { critChanceBonus: 0.10 };
        if (petName === "степен жребец") return { damageReduction: 0.15 };
        if (petName === "балканска мечка") return { defenseBonus: 20 };
        if (petName === "млад дракон") return { attackBonusPercent: 0.20, fireDamage: 15 };
        if (petName === "феникс") return { reviveChance: 0.30, fireDamage: 20 };
    }
    return {};
}

// Преизчисляване на мощ (с поддръжка на новите бонуси)
window.recalculateHeroPower = function(hero) {
    if (!hero) return 0;
    window.initializeHeroRPGData(hero);
    if (!hero.baseHeroPower) hero.baseHeroPower = (hero.heroPower || 100);
    let base = hero.baseHeroPower;
    let artifactBonus = 0, setBonus = 0, skillBonus = 0, petBonus = 0;
    hero.defense = 0;
    // Артефакти
    if (hero.inventory && Array.isArray(hero.inventory)) {
        hero.inventory.forEach(item => {
            if (item && item.bonus && item.bonus.heroPower) artifactBonus += item.bonus.heroPower;
        });
    }
    // Сет бонуси
    let setBonuses = window.calculateArtifactSetBonuses ? window.calculateArtifactSetBonuses(hero) : {};
    setBonus = setBonuses.heroPower || 0;
    // Умения
    if (hero.learnedSkills && window.getAdvancedSkillBonuses) {
        const b = window.getAdvancedSkillBonuses(hero);
        if (b.attackBonus) skillBonus += b.attackBonus;
    }
    // Питомци
    const petB = getPetBonuses(hero);
    if (petB.heroPower) petBonus += petB.heroPower;
    if (petB.attackBonusPercent) petBonus += Math.floor(base * petB.attackBonusPercent);
    if (petB.defenseBonus) hero.defense += petB.defenseBonus;
    hero.heroPower = Math.max(10, base + artifactBonus + setBonus + skillBonus + petBonus);
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

// ==================== RPG МОДАЛ ====================
window.openHeroRPGModal = function(heroId) {
    let hero = null;
    if (heroId && window.worldData?.clans?.[heroId]) hero = window.worldData.clans[heroId];
    else if (window.currentHero) hero = window.currentHero;
    if (!hero) {
        console.warn("Няма избран герой за RPG модала");
        return;
    }
    if (typeof window.showHeroProfile === 'function') window.showHeroProfile(hero);
    else showRPGMessage("ГРЕШКА", "RPG системата не е напълно заредена, но можете да управлявате героя от профила", "error");
};

// Автоматично извикване на autoEquipHero при старт (за всички авто герои)
setTimeout(() => {
    if (window.worldData && window.worldData.clans && typeof window.autoEquipHero === 'function') {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined && hero.isAuto && hero.inventory && hero.inventory.length > 0) {
                window.autoEquipHero(hero);
            }
        }
        if (window.currentHero && window.currentHero.isAuto) {
            window.autoEquipHero(window.currentHero);
        }
    }
}, 1500);

console.log("✅ rpg_system.js версия 7.0 зареден – с фиксирана инициализация на HP.");
