// =========================================================================
// ВЕЛИКА БЪЛГАРИЯ - rpg_system.js (ПЪЛЕН, hero вместо leader)
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

window.rpgDatabase.skillTrees = {
    tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя.", maxLevel: 5 },
    endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска.", maxLevel: 5 },
    heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети.", maxLevel: 5 },
    shieldWall: { name: "Стена от щитове", desc: "Намалява загубите на бойци.", maxLevel: 5 },
    berserk: { name: "Ярост на Багатура", desc: "Колкото по-малко войници, толкова по-силна атака.", maxLevel: 5 },
    ambush: { name: "Засада", desc: "Шанс за тежък първоначален удар.", maxLevel: 5 },
    poisonBlade: { name: "Отровено острие", desc: "Нанася пасивни щети всеки сезон.", maxLevel: 5 },
    assassinate: { name: "Покушение", desc: "Шанс за директно елиминиране.", maxLevel: 3 },
    shadowStep: { name: "Сенчеста стъпка", desc: "Повишава шанса за бягство.", maxLevel: 5 },
    smokeBomb: { name: "Димна завеса", desc: "Намалява точността на стрелците.", maxLevel: 5 },
    mysticism: { name: "Древно Знание", desc: "Повишава шанса за редки артефакти.", maxLevel: 5 },
    tangraFire: { name: "Огънят на Тангра", desc: "Вдига бойния дух на максимум.", maxLevel: 5 },
    vampirism: { name: "Кръвен устрем", desc: "Възстановява част от загубените войници.", maxLevel: 5 },
    raiseDead: { name: "Въздигане на падналите", desc: "Временно съживява част от враговете.", maxLevel: 3 },
    totemGlow: { name: "Тотемна закрила", desc: "Защитава от природни бедствия.", maxLevel: 5 },
    economy: { name: "Родово Управление", desc: "Увеличава базовия доход.", maxLevel: 5 },
    goldRush: { name: "Златна Треска", desc: "Увеличава добива на злато.", maxLevel: 5 },
    cartel: { name: "Търговски съюз", desc: "Намалява разходите за поддръжка.", maxLevel: 5 },
    logistics: { name: "Логистика", desc: "Намалява разходите за храна.", maxLevel: 5 },
    bazaars: { name: "Родови пазари", desc: "Увеличава печалбите от бракове.", maxLevel: 5 }
};

window.rpgDatabase.classRecipes = [
    { name: "Върховен Боил", reqLevel: 3, reqTrees: ["tactics", "endurance"] },
    { name: "Нощно Острие", reqLevel: 3, reqTrees: ["ambush", "poisonBlade"] },
    { name: "Колобър", reqLevel: 3, reqTrees: ["mysticism", "tangraFire"] },
    { name: "Иконом на Рода", reqLevel: 3, reqTrees: ["economy", "goldRush"] },
    { name: "Гвардеец на Тангра", reqLevel: 4, reqTrees: ["tactics", "tangraFire"] },
    { name: "Сенчест Търговец", reqLevel: 4, reqTrees: ["ambush", "cartel"] },
    { name: "Кръвожаден Воин", reqLevel: 5, reqTrees: ["heavyStrike", "vampirism"] },
    { name: "Пазител на Съкровища", reqLevel: 5, reqTrees: ["mysticism", "economy"] }
];

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
    Object.keys(window.rpgDatabase.skillTrees).forEach(function(skillKey) {
        if (hero.skills[skillKey] === undefined) hero.skills[skillKey] = 0;
    });
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

// ==================== Умения ====================
window.autoAssignSkillPoint = function(hero) {
    if (hero.skillPoints <= 0) return;
    var skillKeys = Object.keys(window.rpgDatabase.skillTrees);
    var availableSkills = [];
    for (var i = 0; i < skillKeys.length; i++) {
        var skillKey = skillKeys[i];
        var currentLevel = hero.skills[skillKey] || 0;
        var maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
        if (currentLevel < maxLevel) availableSkills.push(skillKey);
    }
    if (availableSkills.length === 0) return;
    var randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    hero.skills[randomSkill] = (hero.skills[randomSkill] || 0) + 1;
    hero.skillPoints--;
    window.recalculateHeroPower(hero);
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("🤖 Автоматично: " + hero.name + " научи " + window.rpgDatabase.skillTrees[randomSkill].name + "!");
    }
};

window.buySkillManual = function(clanKey, skillKey) {
    var hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) hero = window.worldData.clans[clanKey];
    else if (window.currentHero && window.currentHero.clan === clanKey) hero = window.currentHero;
    if (!hero) return;
    if (hero.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🤖 Героят е в AUTO режим! Изключете автоматичното развитие за ръчно управление.");
        return;
    }
    if (hero.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате свободни точки за умения!");
        return;
    }
    var currentLevel = hero.skills[skillKey] || 0;
    var maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
    if (currentLevel >= maxLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Умението " + window.rpgDatabase.skillTrees[skillKey].name + " е достигнало максимално ниво " + maxLevel + "!");
        return;
    }
    hero.skills[skillKey] = currentLevel + 1;
    hero.skillPoints--;
    window.checkArcheAgeClass(hero);
    window.recalculateHeroPower(hero);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("✅ " + hero.name + " научи " + window.rpgDatabase.skillTrees[skillKey].name + " (Ниво " + hero.skills[skillKey] + "/" + maxLevel + ")!");
    }
};

window.consumeStoredXPManual = function(clanKey) {
    var hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) hero = window.worldData.clans[clanKey];
    else if (window.currentHero && window.currentHero.clan === clanKey) hero = window.currentHero;
    if (!hero) return;
    if (hero.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🤖 Героят е в AUTO режим! Ръчното качване на ниво е забранено.");
        return;
    }
    var req = window.rpgDatabase.getXPRequiredForLevel(hero.level);
    if (hero.storedXP < req) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Недостатъчен опит! Нужни: " + req + ", Имате: " + hero.storedXP);
        return;
    }
    hero.storedXP -= req;
    hero.level++;
    hero.skillPoints++;
    hero.heroPower += 25;
    window.checkArcheAgeClass(hero);
    window.recalculateHeroPower(hero);
    if (hero.skillPoints > 0 && !hero.isAuto) {
        if (window.showAdvisorMsg) {
            setTimeout(function() {
                if (confirm(hero.name + " достигна Ниво " + hero.level + "! Искате ли да изберете умение сега?")) {
                    window.manualSkillChoiceOnLevelUp(clanKey);
                }
            }, 100);
        }
    }
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("🆙 " + hero.name + " достигна Ниво " + hero.level + " чрез ръчно развитие! (+1 Точка за умения)");
    }
};

window.checkArcheAgeClass = function(hero) {
    var skillLevels = {};
    for (var key in hero.skills) {
        if (hero.skills.hasOwnProperty(key) && hero.skills[key] > 0) skillLevels[key] = hero.skills[key];
    }
    var availableClasses = [];
    for (var i = 0; i < window.rpgDatabase.classRecipes.length; i++) {
        var recipe = window.rpgDatabase.classRecipes[i];
        if (hero.level < recipe.reqLevel) continue;
        var hasAll = true;
        for (var j = 0; j < recipe.reqTrees.length; j++) {
            if (!skillLevels[recipe.reqTrees[j]]) {
                hasAll = false;
                break;
            }
        }
        if (hasAll) availableClasses.push(recipe);
    }
    if (availableClasses.length > 0) {
        availableClasses.sort(function(a, b) { return b.reqLevel - a.reqLevel; });
        var newClass = availableClasses[0];
        if (hero.currentClass !== newClass.name) {
            var oldClass = hero.currentClass;
            hero.currentClass = newClass.name;
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg("👑 ЕВОЛЮЦИЯ: " + hero.name + " се издигна от \"" + oldClass + "\" до клас \"" + hero.currentClass + "\"!");
            }
        }
    }
};

// ==================== РЪЧЕН ИЗБОР НА УМЕНИЕ ПРИ КАЧВАНЕ ====================
window.manualSkillChoiceOnLevelUp = function(clanKey) {
    var hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) hero = window.worldData.clans[clanKey];
    else if (window.currentHero && window.currentHero.clan === clanKey) hero = window.currentHero;
    if (!hero) return;
    if (hero.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🤖 Героят е в AUTO режим! Изключете го за ръчно избиране на умения.");
        return;
    }
    if (hero.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате свободни точки за умения!");
        return;
    }
    var modal = document.getElementById('skill-choice-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'skill-choice-modal';
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10001; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif;";
        document.body.appendChild(modal);
    }
    var availableSkills = [];
    for (var sk in window.rpgDatabase.skillTrees) {
        if (window.rpgDatabase.skillTrees.hasOwnProperty(sk)) {
            var current = hero.skills[sk] || 0;
            var maxLvl = window.rpgDatabase.skillTrees[sk].maxLevel || 5;
            if (current < maxLvl) availableSkills.push(sk);
        }
    }
    var skillsHtml = "";
    for (var i = 0; i < availableSkills.length; i++) {
        var sKey = availableSkills[i];
        var data = window.rpgDatabase.skillTrees[sKey];
        var curLvl = hero.skills[sKey] || 0;
        var maxLvl = data.maxLevel || 5;
        skillsHtml += '<button onclick="window.applyManualSkill(\'' + clanKey + '\', \'' + sKey + '\')" style="width:100%; background:rgba(0,0,0,0.6); border:1px solid #d4af37; border-radius:8px; padding:12px; margin-bottom:10px; cursor:pointer; text-align:left; color:#fff;">' +
            '<div style="font-weight:bold; color:#ffd700;">' + data.name + '</div>' +
            '<div style="font-size:11px; color:#aaa;">' + data.desc + '</div>' +
            '<div style="font-size:10px; color:#00ffcc;">Ниво: ' + curLvl + '/' + maxLvl + '</div>' +
            '</button>';
    }
    if (availableSkills.length === 0) {
        skillsHtml = '<p style="color:red; text-align:center;">📛 Всички умения са на максимум!</p>';
    }
    modal.innerHTML = '<div style="background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border:2px solid #d4af37; border-radius:16px; width:450px; max-width:90%; max-height:80%; overflow-y:auto;">' +
        '<div style="padding:20px; border-bottom:1px solid #d4af37; text-align:center; position:relative;">' +
        '<button onclick="document.getElementById(\'skill-choice-modal\').style.display=\'none\'" style="position:absolute; right:15px; top:15px; background:red; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">✕</button>' +
        '<h2 style="color:#d4af37; margin:0;">⭐ Избор на умение</h2>' +
        '<p style="color:#aaa;">' + hero.name + ' - Ниво ' + hero.level + '</p>' +
        '<p style="color:#ffd700;">🎯 Свободни точки: ' + hero.skillPoints + '</p>' +
        '</div>' +
        '<div style="padding:20px;">' + skillsHtml + '</div>' +
        '</div>';
    modal.style.display = 'flex';
};

window.applyManualSkill = function(clanKey, skillKey) {
    var hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) hero = window.worldData.clans[clanKey];
    else if (window.currentHero && window.currentHero.clan === clanKey) hero = window.currentHero;
    if (!hero) return;
    if (hero.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате точки за умения!");
        var modal = document.getElementById('skill-choice-modal');
        if (modal) modal.style.display = 'none';
        return;
    }
    var currentLevel = hero.skills[skillKey] || 0;
    var maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
    if (currentLevel >= maxLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Умението е на максимум (" + maxLevel + "/" + maxLevel + ")!");
        return;
    }
    hero.skills[skillKey] = currentLevel + 1;
    hero.skillPoints--;
    window.checkArcheAgeClass(hero);
    window.recalculateHeroPower(hero);
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("✅ " + hero.name + " научи " + window.rpgDatabase.skillTrees[skillKey].name + " (Ниво " + hero.skills[skillKey] + "/" + maxLevel + ")!");
    }
    var modal = document.getElementById('skill-choice-modal');
    if (modal) modal.style.display = 'none';
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    var rpgModal = document.getElementById('hero-rpg-modal');
    if (rpgModal && rpgModal.style.display === 'block') {
        window.openHeroRPGModal(clanKey);
    }
    var profileModal = document.getElementById('hero-profile-modal');
    if (profileModal && profileModal.style.display === 'flex') {
        if (window.showHeroProfile) window.showHeroProfile(clanKey);
    }
};

// ==================== RPG МОДАЛ ====================
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
    var skillsContainer = document.getElementById('rpg-modal-skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = "";
        var reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        if (!hero.isAuto) {
            var xpBarBtn = document.createElement('div');
            xpBarBtn.style.cssText = "background:rgba(0,198,255,0.15); border:1px solid #00c6ff; padding:10px; border-radius:6px; text-align:center; margin-bottom:10px; color:#fff; font-size:12px;";
            if (hero.storedXP >= reqXP) {
                xpBarBtn.innerHTML = "<div>✨ Събран ръчен опит: <b>" + hero.storedXP + " / " + reqXP + " XP</b></div><button onclick=\"window.consumeStoredXPManual('" + clanKey + "')\" style=\"margin-top:5px; background:#0072ff; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold; font-family:'Cinzel';\">КАЧИ НИВО СЕГА ➔</button>";
            } else {
                xpBarBtn.innerHTML = "<div>📊 Събран ръчен опит: <b>" + hero.storedXP + " / " + reqXP + " XP</b> (не достига опит)</div>";
            }
            skillsContainer.appendChild(xpBarBtn);
        }
        for (var skillKey in window.rpgDatabase.skillTrees) {
            if (window.rpgDatabase.skillTrees.hasOwnProperty(skillKey)) {
                var skillData = window.rpgDatabase.skillTrees[skillKey];
                var lvl = hero.skills[skillKey] || 0;
                var node = document.createElement('div');
                node.style.cssText = "background:rgba(20,20,20,0.8); border:1px solid #333; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; color:#fff;";
                var buyButton = "";
                if (!hero.isAuto && hero.skillPoints > 0) {
                    buyButton = "<button onclick=\"window.buySkillManual('" + clanKey + "', '" + skillKey + "')\" style=\"background:#00ffcc; color:#000; border:none; padding:4px 8px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;\">[+] Вдигни (" + lvl + "/5)</button>";
                } else if (!hero.isAuto && hero.skillPoints <= 0) {
                    buyButton = "<span style=\"font-size:9px; color:#666;\">🔒 Няма точки</span>";
                } else if (hero.isAuto) {
                    buyButton = "<span style=\"font-size:9px; color:#888;\">🤖 AUTO режим</span>";
                }
                node.innerHTML = "<div style=\"text-align:left; flex:1;\"><b style=\"color:#ffd700; font-size:12px;\">" + skillData.name + "</b><div style=\"font-size:10px; color:#aaa;\">" + skillData.desc + "</div></div><div>" + buyButton + "</div>";
                skillsContainer.appendChild(node);
            }
        }
    }
    modalEl.style.display = "block";
};

// ==================== Помощни ====================
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
    if (hero.skills && hero.skills.tactics) skillBonus += hero.skills.tactics * 15;
    var setBonuses = window.calculateArtifactSetBonuses(hero);
    setBonus = setBonuses.heroPower || 0;
    hero.heroPower = basePower + artifactBonus + setBonus + skillBonus;
    if (window.showAdvisorMsg && (artifactBonus > 0 || setBonus > 0 || skillBonus > 0)) {
        console.log("📊 Сила на " + hero.name + ": базова " + basePower + " + артефакти " + artifactBonus + " + сет " + setBonus + " + умения " + skillBonus + " = " + hero.heroPower);
    }
    return hero.heroPower;
};

window.getSkillLevel = function(hero, skillKey) {
    if (!hero || !hero.skills) return 0;
    return hero.skills[skillKey] || 0;
};

window.getHeroCombatBonus = function(hero, bonusType) {
    if (!hero || !hero.skills) return 0;
    var bonus = 0;
    switch(bonusType) {
        case 'attack':
            bonus += (hero.skills.heavyStrike || 0) * 10;
            bonus += (hero.skills.berserk || 0) * 5;
            break;
        case 'defense':
            bonus += (hero.skills.endurance || 0) * 8;
            bonus += (hero.skills.shieldWall || 0) * 12;
            break;
        case 'critical':
            bonus += (hero.skills.ambush || 0) * 5;
            break;
        case 'economy':
            bonus += (hero.skills.economy || 0) * 10;
            bonus += (hero.skills.goldRush || 0) * 15;
            bonus += (hero.skills.cartel || 0) * 8;
            break;
    }
    return bonus;
};
