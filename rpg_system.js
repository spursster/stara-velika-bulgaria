// =========================================================================
// ВЕЛИКА БЪЛГАРИЯ - rpg_system.js (НОВА ВЕРСИЯ – САМО НОВИ КЛАСОВЕ И УМЕНИЯ)
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
    hero.skills = hero.skills || {};         // запазваме за обратна съвместимост (но не се използва)
    hero.currentClass = hero.currentClass || "Багатур";
    hero.heroPower = hero.heroPower || 150;
    hero.isAuto = hero.isAuto !== undefined ? hero.isAuto : true;
    hero.army = hero.army || 0;
    hero.battlesWon = hero.battlesWon || 0;
    hero.battlesLost = hero.battlesLost || 0;
    if (!hero.equipment) hero.equipment = Array(12).fill(null);
    if (!hero.inventory) hero.inventory = [];
    if (hero.pet === undefined) hero.pet = null;
    // Инициализация на новите умения (ако липсва)
    if (hero.learnedSkills === undefined) hero.learnedSkills = {};
    hero.isRPGInitialized = true;
};

// ==================== Опит и нива ====================
window.gainHeroXP = function(hero, amount) {
    if (!hero) return;
    window.initializeHeroRPGData(hero);
    
    if (hero.isAuto) {
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
            window.checkArcheAgeClass(hero);
            if (hero.isAuto && hero.skillPoints > 0) {
                window.autoAssignSkillPoint(hero);
            }
        }
    } else {
        hero.storedXP += amount;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("📚 " + hero.name + " натрупа " + amount + " ръчен опит! (Общо: " + hero.storedXP + ")");
        }
    }
    
    if (window.worldData && window.worldData.clans && hero.clan) window.worldData.clans[hero.clan] = hero;
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.openHeroRPGModal && document.getElementById('hero-rpg-modal') && document.getElementById('hero-rpg-modal').style.display === 'block') {
        window.openHeroRPGModal(hero.clan);
    }
};

// ==================== Автоматичен / Ръчен режим ====================
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
    // Събираме всички умения, които не са на максимално ниво
    const allSkills = [];
    for (let treeKey in window.advancedSkills) {
        const tree = window.advancedSkills[treeKey];
        for (let skillKey in tree.skills) {
            const skill = tree.skills[skillKey];
            const currentLevel = hero.learnedSkills[skillKey] || 0;
            if (currentLevel < skill.maxLevel) {
                allSkills.push({ treeKey, skillKey, skill });
            }
        }
    }
    if (allSkills.length === 0) return;
    const random = allSkills[Math.floor(Math.random() * allSkills.length)];
    // Проверяваме изискванията (ниво, точки в дървото)
    let pointsInTree = 0;
    for (let sk in hero.learnedSkills) {
        if (window.advancedSkills[random.treeKey] && window.advancedSkills[random.treeKey].skills[sk]) {
            pointsInTree += hero.learnedSkills[sk];
        }
    }
    if (hero.level >= random.skill.reqLevel && pointsInTree >= random.skill.reqPointsInTree) {
        hero.learnedSkills[random.skillKey] = (hero.learnedSkills[random.skillKey] || 0) + 1;
        hero.skillPoints--;
        // Прилагане на бонусите (опростено – може да се разшири)
        const effect = random.skill.effect(hero.learnedSkills[random.skillKey]);
        if (effect.attackBonus) hero.heroPower += effect.attackBonus;
        if (effect.defenseBonus) hero.defense = (hero.defense || 0) + effect.defenseBonus;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🤖 Автоматично: ${hero.name} научи "${random.skill.name}" (Ниво ${hero.learnedSkills[random.skillKey]})!`);
        }
    } else {
        // Ако няма достъпни умения (напр. всички са заключени), опитайте с друг
        if (allSkills.length > 1) window.autoAssignSkillPoint(hero);
    }
};

// ==================== НОВА КЛАСОВА ЕВОЛЮЦИЯ (САМО ХИБРИДНИ КЛАСОВЕ) ====================
window.checkArcheAgeClass = function(hero) {
    if (!hero) return;
    if (!window.hybridClasses || !Array.isArray(window.hybridClasses)) {
        console.warn("hybridClasses не е зареден – няма нови класове.");
        return;
    }
    let skillLevels = {};
    // Трябва да използваме старите `hero.skills` за определяне на класа,
    // защото новите умения не влияят на класовата еволюция (все пак класовете зависят от 3-те основни дървета)
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

// ==================== РЪЧЕН ИЗБОР НА УМЕНИЕ (за старите умения – вече не се използва) ====================
// Запазваме празни функции, за да не се счупи нищо, ако някой ги извиква.
window.manualSkillChoiceOnLevelUp = function(clanKey) {
    if (window.showAdvisorMsg) window.showAdvisorMsg("⭐ Новото дърво на уменията е достъпно от RPG модала (⭐ УМЕНИЯ (НОВИ) ⭐).");
};
window.applyManualSkill = function(clanKey, skillKey) {
    if (window.showAdvisorMsg) window.showAdvisorMsg("⭐ Моля, използвайте новия интерфейс за умения (⭐ УМЕНИЯ (НОВИ) ⭐).");
};
window.buySkillManual = function(clanKey, skillKey) {
    if (window.showAdvisorMsg) window.showAdvisorMsg("⭐ Новите умения се научават от специалния прозорец. Отворете го от RPG модала.");
};

// ==================== RPG МОДАЛ (без старите умения) ====================
window.openHeroRPGModal = function(clanKey) {
    var modalEl = document.getElementById('hero-rpg-modal');
    if (!modalEl) return;
    var hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) hero = window.worldData.clans[clanKey];
    else if (window.currentHero && (window.currentHero.clan === clanKey || window.currentHero.name === clanKey)) hero = window.currentHero;
    if (!hero) hero = window.currentHero;
    if (!hero) return;
    window.initializeHeroRPGData(hero);
    var titleEl = document.getElementById('rpg-modal-title');
    var subtitleEl = document.getElementById('rpg-modal-subtitle');
    var pointsEl = document.getElementById('rpg-modal-points');
    if (titleEl) titleEl.innerText = "Водач " + (hero.name || "Пълководец");
    if (subtitleEl) subtitleEl.innerText = "Клан " + (hero.clan || clanKey) + " | Клас: " + (hero.currentClass || "Багатур") + " (Ниво " + (hero.level || 1) + ")";
    if (pointsEl) pointsEl.innerText = hero.skillPoints || 0;
    
    // Показваме инвентар и екипировка
    var equipGrid = document.getElementById('rpg-equipment-grid');
    if (equipGrid) {
        equipGrid.innerHTML = "";
        var slotLabels = ["Шлем", "Нагръдник", "Оръжие", "Щит", "Ръкавици", "Ботуши", "Амулет", "Пръстен 1", "Пръстен 2"];
        for (var i = 0; i < 9; i++) {
            var item = hero.equipment[i];
            var box = document.createElement('div');
            box.className = "rpg-equip-box";
            box.style.cssText = "width:75px; height:75px; background:rgba(0,0,0,0.5); border:1px solid #d4af37; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; font-size:11px; color:#fff;";
            box.onclick = (function(idx) { return function() { alert("Оръжейна стая: Преместете предмет от съкровищницата в слот за " + slotLabels[idx] + "."); }; })(i);
            box.innerHTML = item ? ("<div>" + item.icon + "</div><span style=\"font-size:8px;\">" + (item.name.substring(0,6) || "..") + "</span>") : ("<span style=\"opacity:0.25; font-size:20px;\">🛡️</span><span style=\"font-size:9px; color:#aaa;\">" + slotLabels[i] + "</span>");
            equipGrid.appendChild(box);
        }
    }
    var petSlot = document.getElementById('rpg-pet-slot');
    if (petSlot) {
        if (hero.pet && window.rpgDatabase.petsDatabase[hero.pet]) {
            var activePet = window.rpgDatabase.petsDatabase[hero.pet];
            petSlot.innerHTML = "<div style=\"font-size:32px;\">" + activePet.icon + "</div><span style=\"font-size:8px; color:#ffd700; font-weight:bold;\">" + activePet.name + "</span>";
            petSlot.title = activePet.desc;
            petSlot.onclick = (function(h) { return function() { if (confirm("Искате ли да освободите домашния любимец " + activePet.name + "?")) { h.pet = null; window.openHeroRPGModal(clanKey); } }; })(hero);
        } else {
            petSlot.innerHTML = "<span style=\"font-size:24px; opacity:0.3;\">🐾</span><span style=\"font-size:8px; color:#666;\">ПРАЗЕН</span>";
            petSlot.onclick = function() {
                var petKeys = Object.keys(window.rpgDatabase.petsDatabase);
                var optionsStr = "Изберете нов домашен любимец:\n";
                for (var idx = 0; idx < petKeys.length; idx++) {
                    var p = window.rpgDatabase.petsDatabase[petKeys[idx]];
                    optionsStr += (idx + 1) + ". " + p.icon + " " + p.name + "\n";
                }
                var choice = prompt(optionsStr);
                if (choice && choice > 0 && choice <= petKeys.length) {
                    hero.pet = petKeys[choice - 1];
                    window.openHeroRPGModal(clanKey);
                }
            };
        }
    }
    // Секцията за старите умения вече не се показва – вместо това бутон към новите умения
    var skillsContainer = document.getElementById('rpg-modal-skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="color:#ffd700;">⭐ Новата система за умения е достъпна!</p>
                <p>Вашите точки за умения: <strong>${hero.skillPoints}</strong></p>
                <p>Отворете дърветата на уменията чрез бутона по-долу.</p>
            </div>
        `;
    }
    // Добавяме бутон за новите умения (ако не съществува)
    if (!modalEl.querySelector('.skills-ui-btn')) {
        const skillsBtn = document.createElement('button');
        skillsBtn.className = 'skills-ui-btn';
        skillsBtn.innerHTML = '⭐ УМЕНИЯ (НОВИ) ⭐';
        skillsBtn.style.cssText = 'margin-top:15px; width:100%; background:#daa520; border:none; border-radius:30px; padding:8px; color:#000; font-weight:bold; cursor:pointer; font-family:"Cinzel",serif;';
        skillsBtn.onclick = () => {
            modalEl.style.display = 'none';
            if (typeof window.openSkillsUI === 'function') window.openSkillsUI();
            else alert("Интерфейсът за умения не е зареден (skills-ui.js).");
        };
        modalEl.querySelector('.modal-content > div:last-child')?.appendChild(skillsBtn);
    }
    modalEl.style.display = "block";
};

// ==================== ПОМОЩНИ ФУНКЦИИ (без промяна) ====================
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
    // Бонус от новите умения (само attackBonus засега)
    if (hero.learnedSkills) {
        const bonuses = window.getAdvancedSkillBonuses ? window.getAdvancedSkillBonuses(hero) : {};
        if (bonuses.attackBonus) skillBonus += bonuses.attackBonus;
        // Може да се добавят и други бонуси
    }
    var setBonuses = window.calculateArtifactSetBonuses(hero);
    setBonus = setBonuses.heroPower || 0;
    hero.heroPower = basePower + artifactBonus + setBonus + skillBonus;
    if (window.showAdvisorMsg && (artifactBonus > 0 || setBonus > 0 || skillBonus > 0)) {
        console.log("📊 Сила на " + hero.name + ": базова " + basePower + " + артефакти " + artifactBonus + " + сет " + setBonus + " + умения " + skillBonus + " = " + hero.heroPower);
    }
    return hero.heroPower;
};

window.getSkillLevel = function(hero, skillKey) {
    if (!hero || !hero.learnedSkills) return 0;
    return hero.learnedSkills[skillKey] || 0;
};

window.getHeroCombatBonus = function(hero, bonusType) {
    if (!hero || !hero.learnedSkills) return 0;
    var bonus = 0;
    // Тук може да се сканират всички научени нови умения и да се сумират бонуси
    for (let sk in hero.learnedSkills) {
        const level = hero.learnedSkills[sk];
        // Намираме умението в дърветата
        for (let treeKey in window.advancedSkills) {
            const skill = window.advancedSkills[treeKey].skills[sk];
            if (skill) {
                const effect = skill.effect(level);
                if (bonusType === 'attack' && effect.attackBonus) bonus += effect.attackBonus;
                if (bonusType === 'defense' && effect.defenseBonus) bonus += effect.defenseBonus;
                if (bonusType === 'critical' && effect.critChance) bonus += effect.critChance;
                // ... други бонуси
                break;
            }
        }
    }
    return bonus;
};
