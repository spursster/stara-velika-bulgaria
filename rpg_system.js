// =========================================================================
// ВЕЛИКА БЪЛГАРИЯ - rpg_system.js (ВЕРСИЯ 8.1 – С АВТОМАТИЧНА ЕКИПИРОВКА)
// =========================================================================

window.rpgDatabase = window.rpgDatabase || {};

// Хранилище за висящи точки умения (само за герои, на които е показан бутон)
if (!window._pendingSkillPoints) window._pendingSkillPoints = {};
// Хранилище за висящи предложения за еволюция на клас
if (!window._pendingClassEvolution) window._pendingClassEvolution = {};

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

// ==================== ИНИЦИАЛИЗАЦИЯ НА ГЕРОЙ ====================
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    hero.level = hero.level || 1;
    hero.xp = hero.xp || 0;
    hero.storedXP = hero.storedXP || 0;
    hero.skillPoints = hero.skillPoints || 0;
    hero.skills = hero.skills || {};
    hero.currentClass = hero.currentClass || "Багатур";
    hero.heroPower = hero.heroPower || 150;
    hero.isAuto = (hero.isAuto !== undefined) ? hero.isAuto : true;
    hero.army = hero.army || 0;
    hero.battlesWon = hero.battlesWon || 0;
    hero.battlesLost = hero.battlesLost || 0;
    if (!hero.equipment) hero.equipment = Array(12).fill(null);
    if (!hero.inventory) hero.inventory = [];
    if (hero.pet === undefined) hero.pet = null;
    if (hero.learnedSkills === undefined) hero.learnedSkills = {};
    if (hero.titles === undefined) hero.titles = [];
    if (hero.prestige === undefined) hero.prestige = 0;
    if (!hero.actionLog) hero.actionLog = [];
    if (hero.morale === undefined) hero.morale = 50;

    let endurance = (hero.skills && hero.skills.endurance) || 0;
    let levelBonus = (hero.level - 1) * 20;
    let newMaxHp = 100 + levelBonus + endurance * 15;
    if (isNaN(newMaxHp) || newMaxHp <= 0) newMaxHp = 100;
    hero.maxHp = newMaxHp;
    if (isNaN(hero.hp) || hero.hp === undefined || hero.hp > hero.maxHp) {
        hero.hp = hero.maxHp;
    }
    hero.isAlive = true;
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
        }
        if (hero.isFavorite === true && window.addHeroLog) {
            window.addHeroLog(hero, "⬆️", `Достигна ниво ${hero.level}`);
        }
        if (leveledUp) {
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            if (!hero.isAuto && hero.skillPoints > 0 && window.autoAssignSkillPoint) {
                window.autoAssignSkillPoint(hero);
            }
            if (hero.isAuto && typeof window.autoEquipHero === 'function') {
                window.autoEquipHero(hero);
            }
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
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
            let oldMaxHp = hero.maxHp;
            let endurance = hero.skills?.endurance || 0;
            let newMaxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
            hero.maxHp = newMaxHp;
            hero.hp = hero.hp + (newMaxHp - oldMaxHp);
            if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
            if (window.addHeroLog) window.addHeroLog(hero, "⬆️", `Достигна ниво ${hero.level}`);
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            
            // ⭐ АВТОМАТИЧНА ЕКИПИРОВКА ПРИ НИВЕЛИРАНЕ
            if (hero.isAuto && typeof window.autoEquipHero === 'function') {
                window.autoEquipHero(hero);
            }
            
            if (typeof isMyHero === 'function' && isMyHero(hero) && hero.skillPoints > 0) {
                window._pendingSkillPoints[hero.id] = hero.skillPoints;
                if (window.ChronicleEvents && typeof window.ChronicleEvents.generateSkillPointOffer === 'function') {
                    const ev = window.ChronicleEvents.generateSkillPointOffer(hero);
                    window.showAdvisorMsg(ev.message, ev.buttons);
                } else {
                    window.showAdvisorMsg(`⭐ ${hero.name} получи точка умение!`);
                }
            } else if (!(typeof isMyHero === 'function' && isMyHero(hero)) && hero.isAuto && hero.skillPoints > 0) {
                if (typeof window.autoAssignSkillPoint === 'function') window.autoAssignSkillPoint(hero);
            }
        }
    } else {
        // manual режим
        hero.storedXP += amount;
        let leveledUp = false;
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        while (hero.storedXP >= requiredXP && hero.level < 100) {
            hero.storedXP -= requiredXP;
            hero.level++;
            hero.skillPoints++;
            hero.heroPower += 25;
            leveledUp = true;
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        }
        if (leveledUp) {
            let oldMaxHp = hero.maxHp;
            let endurance = hero.skills?.endurance || 0;
            let newMaxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
            hero.maxHp = newMaxHp;
            hero.hp = hero.hp + (newMaxHp - oldMaxHp);
            if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
            if (window.addHeroLog) window.addHeroLog(hero, "⬆️", `Достигна ниво ${hero.level}`);
            if (window.checkArcheAgeClass) window.checkArcheAgeClass(hero);
            
            // ⭐ АВТОМАТИЧНА ЕКИПИРОВКА ПРИ НИВЕЛИРАНЕ (manual режим)
            if (hero.isAuto && typeof window.autoEquipHero === 'function') {
                window.autoEquipHero(hero);
            }
            
            if (typeof isMyHero === 'function' && isMyHero(hero) && hero.skillPoints > 0) {
                window._pendingSkillPoints[hero.id] = hero.skillPoints;
                if (window.ChronicleEvents && typeof window.ChronicleEvents.generateSkillPointOffer === 'function') {
                    const ev = window.ChronicleEvents.generateSkillPointOffer(hero);
                    window.showAdvisorMsg(ev.message, ev.buttons);
                } else {
                    window.showAdvisorMsg(`⭐ ${hero.name} получи точка умение!`);
                }
            }
        }
    }
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};

// ==================== АВТОМАТИЧЕН / РЪЧЕН РЕЖИМ ====================
window.toggleHeroAutoMode = function(heroId) {
    let hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[heroId]) {
        hero = window.worldData.clans[heroId];
    } else if (window.unlockedHeroes) {
        hero = window.unlockedHeroes.find(h => h.clan === heroId || h.name === heroId);
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
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    let modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') {
        if (typeof window.showHeroProfile === 'function') window.showHeroProfile(hero);
    }
};

// ==================== НОВА СИСТЕМА ЗА АВТОМАТИЧНО УЧЕНЕ НА УМЕНИЯ (ПО ЛИЧНОСТ) ====================
window.autoAssignSkillPoint = function(hero) {
    if (hero.skillPoints <= 0) return;
    if (!window.advancedSkills) return;
    if (!hero.learnedSkills) hero.learnedSkills = {};
    
    let priority = [];
    if (hero.personality?.some(p => p.categories?.includes("agg"))) priority = ["attack", "crit", "berserk"];
    else if (hero.personality?.some(p => p.categories?.includes("cautious"))) priority = ["defense", "hp", "endurance"];
    else if (hero.personality?.some(p => p.categories?.includes("dip"))) priority = ["economy", "trade", "diplomacy"];
    else priority = ["leadership", "tactics"];
    
    for (let p of priority) {
        for (let treeKey in window.advancedSkills) {
            for (let skillKey in window.advancedSkills[treeKey].skills) {
                let skill = window.advancedSkills[treeKey].skills[skillKey];
                if (skill.name.toLowerCase().includes(p) && (hero.learnedSkills[skillKey] || 0) < skill.maxLevel) {
                    let pointsInTree = 0;
                    for (let sk in hero.learnedSkills) {
                        if (window.advancedSkills[treeKey].skills[sk]) pointsInTree += hero.learnedSkills[sk];
                    }
                    if (hero.level >= skill.reqLevel && pointsInTree >= skill.reqPointsInTree) {
                        hero.learnedSkills[skillKey] = (hero.learnedSkills[skillKey] || 0) + 1;
                        hero.skillPoints--;
                        window.addHeroLog(hero, "🧠", `Научи ${skill.name} (приоритетно).`);
                        return;
                    }
                }
            }
        }
    }
    for (let treeKey in window.advancedSkills) {
        for (let skillKey in window.advancedSkills[treeKey].skills) {
            let skill = window.advancedSkills[treeKey].skills[skillKey];
            if ((hero.learnedSkills[skillKey] || 0) < skill.maxLevel) {
                hero.learnedSkills[skillKey] = (hero.learnedSkills[skillKey] || 0) + 1;
                hero.skillPoints--;
                window.addHeroLog(hero, "🧠", `Научи ${skill.name}.`);
                return;
            }
        }
    }
};

// ==================== НОВА КЛАСОВА ЕВОЛЮЦИЯ С БУТОНИ ====================
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
    if (hero.currentClass === newClass.name) return;
    
    if (typeof isMyHero === 'function' && isMyHero(hero)) {
        if (!window._pendingClassEvolution[hero.id]) {
            window._pendingClassEvolution[hero.id] = newClass.name;
            if (window.ChronicleEvents && typeof window.ChronicleEvents.generateClassEvolutionOffer === 'function') {
                const ev = window.ChronicleEvents.generateClassEvolutionOffer(hero, hero.currentClass, newClass.name);
                window.showAdvisorMsg(ev.message, ev.buttons);
            } else {
                window.showAdvisorMsg(`🌟 ${hero.name} може да се издигне до ${newClass.name}!`);
            }
        }
    } else {
        const oldClass = hero.currentClass;
        hero.currentClass = newClass.name;
        if (window.applyClassBonuses) window.applyClassBonuses(hero, newClass.name);
        showRPGMessage("ЕВОЛЮЦИЯ", `👑 ${hero.name} се издигна от "${oldClass}" до "${hero.currentClass}"!`, "success");
    }
};

// ==================== АВТОМАТИЧНО РЕШАВАНЕ НА ВИСЯЩИ ПРЕДЛОЖЕНИЯ (ВИКА СЕ В КРАЯ НА ХОД) ====================
window.resolvePendingChoices = function() {
    if (!window.worldData || !window.worldData.clans) return;
    
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (!hero.isJoined) continue;
        if (typeof isMyHero === 'function' && isMyHero(hero)) {
            // Точки умения
            if (window._pendingSkillPoints && window._pendingSkillPoints[hero.id] > 0 && hero.skillPoints > 0) {
                if (typeof window.autoAssignSkillPoint === 'function') {
                    window.autoAssignSkillPoint(hero);
                    if (window.addHeroLog) window.addHeroLog(hero, "🧠", `Автоматично разпредели точка умение (според личността).`);
                }
                delete window._pendingSkillPoints[hero.id];
            }
            // Еволюция на клас
            if (window._pendingClassEvolution && window._pendingClassEvolution[hero.id]) {
                let newClassName = window._pendingClassEvolution[hero.id];
                if (newClassName && hero.currentClass !== newClassName) {
                    hero.currentClass = newClassName;
                    if (window.applyClassBonuses) window.applyClassBonuses(hero, newClassName);
                    if (window.addHeroLog) window.addHeroLog(hero, "🌟", `Автоматично прие клас "${newClassName}" (без отговор).`);
                    if (window.showAdvisorMsg) window.showAdvisorMsg(`🤖 ${hero.name} автоматично прие клас "${newClassName}".`);
                    if (window.updateCharacterUI) window.updateCharacterUI(hero);
                    if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
                }
                delete window._pendingClassEvolution[hero.id];
            }
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

window.recalculateHeroPower = function(hero) {
    if (!hero) return 0;
    window.initializeHeroRPGData(hero);
    if (!hero.baseHeroPower) hero.baseHeroPower = (hero.heroPower || 100);
    let base = hero.baseHeroPower;
    let artifactBonus = 0, setBonus = 0, skillBonus = 0, petBonus = 0;
    hero.defense = 0;
    if (hero.inventory && Array.isArray(hero.inventory)) {
        hero.inventory.forEach(item => {
            if (item && item.bonus && item.bonus.heroPower) artifactBonus += item.bonus.heroPower;
        });
    }
    let setBonuses = window.calculateArtifactSetBonuses ? window.calculateArtifactSetBonuses(hero) : {};
    setBonus = setBonuses.heroPower || 0;
    if (hero.learnedSkills && window.getAdvancedSkillBonuses) {
        const b = window.getAdvancedSkillBonuses(hero);
        if (b.attackBonus) skillBonus += b.attackBonus;
    }
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
    if (heroId && window.worldData?.clans?.[heroId]) {
        hero = window.worldData.clans[heroId];
    } else {
        if (window.gameMode === 'solo' && window.currentHero) {
            hero = window.currentHero;
        } else {
            hero = window.getSelectedHero ? window.getSelectedHero() : (window.getStrongestHero ? window.getStrongestHero() : null);
        }
    }
    if (!hero) {
        console.warn("Няма избран герой за RPG модала");
        return;
    }
    if (typeof window.showHeroProfile === 'function') window.showHeroProfile(hero);
    else showRPGMessage("ГРЕШКА", "RPG системата не е напълно заредена", "error");
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
    }
}, 1500);

console.log("✅ rpg_system.js версия 8.1 зареден – с автоматична екипировка при нивелиране");
