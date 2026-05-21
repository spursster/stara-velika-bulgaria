// ЧАСТ 1 - БАЗА ДАННИ
window.rpgDatabase = window.rpgDatabase || {};
window.rpgDatabase.getXPRequiredForLevel = function(level) { return (level || 1) * 150; };
window.rpgDatabase.petsDatabase = { falcon: { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." }, wolf: { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен Смазващ удар." }, stallion: { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." }, bear: { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." }, viper: { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." } };
window.rpgDatabase.skillTrees = { tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя.", maxLevel: 5 }, endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска.", maxLevel: 5 }, heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети.", maxLevel: 5 }, shieldWall: { name: "Стена от щитове", desc: "Намалява загубите на бойци.", maxLevel: 5 }, berserk: { name: "Ярост на Багатура", desc: "Колкото по-малко войници, толкова по-силна атака.", maxLevel: 5 }, ambush: { name: "Засада", desc: "Шанс за тежък първоначален удар.", maxLevel: 5 }, poisonBlade: { name: "Отровено острие", desc: "Нанася пасивни щети всеки сезон.", maxLevel: 5 }, assassinate: { name: "Покушение", desc: "Шанс за директно елиминиране.", maxLevel: 3 }, shadowStep: { name: "Сенчеста стъпка", desc: "Повишава шанса за бягство.", maxLevel: 5 }, smokeBomb: { name: "Димна завеса", desc: "Намалява точността на стрелците.", maxLevel: 5 }, mysticism: { name: "Древно Знание", desc: "Повишава шанса за редки артефакти.", maxLevel: 5 }, tangraFire: { name: "Огънят на Тангра", desc: "Вдига бойния дух на максимум.", maxLevel: 5 }, vampirism: { name: "Кръвен устрем", desc: "Възстановява част от загубените войници.", maxLevel: 5 }, raiseDead: { name: "Въздигане на падналите", desc: "Временно съживява част от враговете.", maxLevel: 3 }, totemGlow: { name: "Тотемна закрила", desc: "Защитава от природни бедствия.", maxLevel: 5 }, economy: { name: "Родово Управление", desc: "Увеличава базовия доход.", maxLevel: 5 }, goldRush: { name: "Златна Треска", desc: "Увеличава добива на злато.", maxLevel: 5 }, cartel: { name: "Търговски съюз", desc: "Намалява разходите за поддръжка.", maxLevel: 5 }, logistics: { name: "Логистика", desc: "Намалява разходите за храна.", maxLevel: 5 }, bazaars: { name: "Родови пазари", desc: "Увеличава печалбите от бракове.", maxLevel: 5 } };
window.rpgDatabase.classRecipes = [{ name: "Върховен Боил", reqLevel: 3, reqTrees: ["tactics", "endurance"] }, { name: "Нощно Острие", reqLevel: 3, reqTrees: ["ambush", "poisonBlade"] }, { name: "Колобър", reqLevel: 3, reqTrees: ["mysticism", "tangraFire"] }, { name: "Иконом на Рода", reqLevel: 3, reqTrees: ["economy", "goldRush"] }, { name: "Гвардеец на Тангра", reqLevel: 4, reqTrees: ["tactics", "tangraFire"] }, { name: "Сенчест Търговец", reqLevel: 4, reqTrees: ["ambush", "cartel"] }, { name: "Кръвожаден Воин", reqLevel: 5, reqTrees: ["heavyStrike", "vampirism"] }, { name: "Пазител на Съкровища", reqLevel: 5, reqTrees: ["mysticism", "economy"] }];
console.log("✅ Част 1 заредена - База данни");
// ЧАСТ 2 - ОСНОВНИ ФУНКЦИИ ЗА ГЕРОИТЕ
window.initializeHeroRPGData = function(leader) {
    if (!leader) return;
    if (leader.isRPGInitialized) return;
    leader.level = leader.level || 1;
    leader.xp = leader.xp || 0;
    leader.storedXP = leader.storedXP || 0;
    leader.skillPoints = leader.skillPoints || 0;
    leader.skills = leader.skills || {};
    leader.currentClass = leader.currentClass || "Багатур";
    leader.heroPower = leader.heroPower || 150;
    leader.isAuto = leader.isAuto !== undefined ? leader.isAuto : true;
    leader.army = leader.army || 0;
    leader.battlesWon = leader.battlesWon || 0;
    leader.battlesLost = leader.battlesLost || 0;
    if (!leader.equipment) leader.equipment = Array(12).fill(null);
    if (!leader.inventory) leader.inventory = [];
    if (leader.pet === undefined) leader.pet = null;
    Object.keys(window.rpgDatabase.skillTrees).forEach(function(skillKey) {
        if (leader.skills[skillKey] === undefined) leader.skills[skillKey] = 0;
    });
    leader.isRPGInitialized = true;
};

window.gainHeroXP = function(leader, amount) {
    if (!leader) return;
    window.initializeHeroRPGData(leader);
    
    if (leader.isAuto) {
        leader.xp += amount;
        var requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        var leveledUp = false;
        while (leader.xp >= requiredXP && leader.level < 100) {
            leader.xp -= requiredXP;
            leader.level++;
            leader.skillPoints++;
            leader.heroPower += 25;
            leveledUp = true;
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg("🆙 " + leader.name + " достигна Ниво " + leader.level + "! (+1 Точка за умения)");
            }
        }
        if (leveledUp) {
            window.checkArcheAgeClass(leader);
            if (leader.isAuto && leader.skillPoints > 0) {
                window.autoAssignSkillPoint(leader);
            }
        }
    } else {
        leader.storedXP += amount;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("📚 " + leader.name + " натрупа " + amount + " ръчен опит! (Общо: " + leader.storedXP + ")");
        }
    }
    
    if (window.worldData && window.worldData.clans && leader.clan) window.worldData.clans[leader.clan] = leader;
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(leader);
};

window.toggleHeroAutoMode = function(clanKey) {
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) leader = window.worldData.clans[clanKey];
    else if (window.unlockedLeaders) leader = window.unlockedLeaders.find(function(h) { return h.clan === clanKey || h.name === clanKey; });
    else if (window.currentHero && window.currentHero.clan === clanKey) leader = window.currentHero;
    if (!leader) return;
    window.initializeHeroRPGData(leader);
    leader.isAuto = !leader.isAuto;
    
    if (!leader.isAuto && leader.xp > 0) {
        leader.storedXP += leader.xp;
        leader.xp = 0;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔄 Режимът на " + leader.name + " е сменен на РЪЧЕН. " + leader.storedXP + " XP са прехвърлени в склад.");
        }
    } else if (leader.isAuto && leader.storedXP > 0) {
        var amount = leader.storedXP;
        leader.storedXP = 0;
        window.gainHeroXP(leader, amount);
    }
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

window.autoAssignSkillPoint = function(leader) {
    if (leader.skillPoints <= 0) return;
    
    var skillKeys = Object.keys(window.rpgDatabase.skillTrees);
    var availableSkills = [];
    for (var i = 0; i < skillKeys.length; i++) {
        var skillKey = skillKeys[i];
        var currentLevel = leader.skills[skillKey] || 0;
        var maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
        if (currentLevel < maxLevel) {
            availableSkills.push(skillKey);
        }
    }
    
    if (availableSkills.length === 0) return;
    
    var randomIndex = Math.floor(Math.random() * availableSkills.length);
    var randomSkill = availableSkills[randomIndex];
    leader.skills[randomSkill] = (leader.skills[randomSkill] || 0) + 1;
    leader.skillPoints--;
    window.recalculateHeroPower(leader);
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("🤖 Автоматично: " + leader.name + " научи " + window.rpgDatabase.skillTrees[randomSkill].name + "!");
    }
};

window.checkArcheAgeClass = function(leader) {
    var skillLevels = {};
    for (var key in leader.skills) {
        if (leader.skills[key] > 0) skillLevels[key] = leader.skills[key];
    }
    
    var availableClasses = [];
    for (var i = 0; i < window.rpgDatabase.classRecipes.length; i++) {
        var recipe = window.rpgDatabase.classRecipes[i];
        if (leader.level < recipe.reqLevel) continue;
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
        if (leader.currentClass !== newClass.name) {
            var oldClass = leader.currentClass;
            leader.currentClass = newClass.name;
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg("👑 ЕВОЛЮЦИЯ: " + leader.name + " се издигна от \"" + oldClass + "\" до клас \"" + leader.currentClass + "\"!");
            }
        }
    }
};

console.log("✅ Част 2 заредена - Основни функции за героите");
// ЧАСТ 3 - ПРОФИЛ НА ГЕРОЯ И КУПУВАНЕ НА АРМИЯ
window.showHeroProfile = function(clanKey) {
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    } else if (window.unlockedLeaders) {
        for (var i = 0; i < window.unlockedLeaders.length; i++) {
            if (window.unlockedLeaders[i].clan === clanKey || window.unlockedLeaders[i].name === clanKey) {
                leader = window.unlockedLeaders[i];
                break;
            }
        }
    }
    
    if (!leader) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Героят не е намерен!");
        return;
    }
    
    window.initializeHeroRPGData(leader);
    
    var modal = document.getElementById('hero-profile-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hero-profile-modal';
        modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif;";
        document.body.appendChild(modal);
    }
    
    var armyCost = {
        peasanter: { name: "Селянин", cost: 10, power: 5 },
        soldier: { name: "Войник", cost: 50, power: 20 },
        archer: { name: "Стрелец", cost: 75, power: 25 },
        horseman: { name: "Конник", cost: 150, power: 45 },
        boyar: { name: "Болярин", cost: 500, power: 100 }
    };
    
    var currentGold = leader.gold || (window.getClanGold ? window.getClanGold(leader.clan) : 0);
    var currentArmy = leader.army || 0;
    var totalXP = (leader.xp || 0) + (leader.storedXP || 0);
    var petName = "";
    if (leader.pet && window.rpgDatabase.petsDatabase[leader.pet]) {
        petName = window.rpgDatabase.petsDatabase[leader.pet].name;
    }
    
    var buttonsHtml = "";
    for (var unitKey in armyCost) {
        var unit = armyCost[unitKey];
        buttonsHtml += '<button onclick="window.buyArmyForHero(\'' + clanKey + '\', \'' + unitKey + '\')" style="background:rgba(0,0,0,0.6); border:1px solid #d4af37; border-radius:8px; padding:10px; cursor:pointer; color:#fff; text-align:left; margin:5px; width:calc(50% - 12px);">' +
            '<div style="font-weight:bold;">' + unit.name + '</div>' +
            '<div style="font-size:11px; color:#ffd700;">💰 ' + unit.cost + ' злато</div>' +
            '<div style="font-size:10px; color:#aaa;">⚔️ +' + unit.power + ' сила</div>' +
            '</button>';
    }
    
    modal.innerHTML = '<div style="background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border:2px solid #d4af37; border-radius:16px; width:500px; max-width:90%; max-height:90%; overflow-y:auto; box-shadow:0 0 30px rgba(0,0,0,0.5);">' +
        '<div style="padding:20px; border-bottom:1px solid #d4af37; background:rgba(0,0,0,0.5); text-align:center; position:relative;">' +
        '<button onclick="document.getElementById(\'hero-profile-modal\').style.display=\'none\'" style="position:absolute; right:15px; top:15px; background:red; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; font-size:18px;">✕</button>' +
        '<h2 style="color:#d4af37; margin:0;">' + (leader.name || "Пълководец") + '</h2>' +
        '<p style="color:#aaa; margin:5px 0;">' + (leader.currentClass || "Багатур") + ' | Ниво ' + leader.level + ' | Сила: ' + leader.heroPower + '</p>' +
        '<p style="color:#ffd700; margin:5px 0;">💰 Злато: ' + currentGold + ' | ⚔️ Армия: ' + currentArmy + '</p>' +
        '<div style="margin-top:10px;">' +
        '<button id="toggleModeBtn" style="background:' + (leader.isAuto ? '#00ffcc' : '#ff6600') + '; color:#000; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold; margin:0 5px;">' + (leader.isAuto ? '🤖 AUTO режим' : '👆 РЪЧЕН режим') + '</button>' +
        '<button onclick="window.openHeroRPGModal(\'' + clanKey + '\')" style="background:#d4af37; color:#000; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold; margin:0 5px;">⭐ Умения & Артефакти</button>' +
        '</div>' +
        '</div>' +
        '<div style="padding:20px;">' +
        '<h3 style="color:#d4af37; margin-top:0;">🛒 КУПУВАЙ АРМИЯ</h3>' +
        '<div style="display:flex; flex-wrap:wrap; margin-bottom:20px;">' + buttonsHtml + '</div>' +
        '<div style="background:rgba(0,0,0,0.5); border-radius:8px; padding:15px; margin-bottom:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">' +
        '<span>⚔️ Бързо попълване:</span>' +
        '<div>' +
        '<button onclick="window.buyArmyForHero(\'' + clanKey + '\', \'soldier\', 10)" style="background:#0072ff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; color:#fff; margin:5px;">+10 Войници (500💰)</button>' +
        '<button onclick="window.buyArmyForHero(\'' + clanKey + '\', \'horseman\', 5)" style="background:#00ffcc; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; color:#000; margin:5px;">+5 Конници (750💰)</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<h3 style="color:#d4af37;">📊 СТАТИСТИКИ</h3>' +
        '<div style="background:rgba(0,0,0,0.5); border-radius:8px; padding:15px;">' +
        '<p>📈 Общ опит: ' + totalXP + ' XP</p>' +
        '<p>⭐ Свободни точки умения: ' + (leader.skillPoints || 0) + '</p>' +
        '<p>🏆 Спечелени битки: ' + (leader.battlesWon || 0) + '</p>' +
        '<p>💀 Загубени битки: ' + (leader.battlesLost || 0) + '</p>' +
        (petName ? '<p>🐾 Домашен любимец: ' + petName + '</p>' : '') +
        '</div>' +
        '</div>' +
        '</div>';
    
    modal.style.display = 'flex';
    
    var toggleBtn = document.getElementById('toggleModeBtn');
    if (toggleBtn) {
        toggleBtn.onclick = function() {
            window.toggleHeroAutoMode(clanKey);
            window.showHeroProfile(clanKey);
        };
    }
};

window.buyArmyForHero = function(clanKey, unitType, quantity) {
    if (quantity === undefined) quantity = 1;
    
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    
    if (!leader) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Героят не е намерен!");
        return;
    }
    
    var armyUnits = {
        peasanter: { name: "Селянин", cost: 10, power: 5 },
        soldier: { name: "Войник", cost: 50, power: 20 },
        archer: { name: "Стрелец", cost: 75, power: 25 },
        horseman: { name: "Конник", cost: 150, power: 45 },
        boyar: { name: "Болярин", cost: 500, power: 100 }
    };
    
    var unit = armyUnits[unitType];
    if (!unit) return;
    
    var totalCost = unit.cost * quantity;
    var currentGold = leader.gold || (window.getClanGold ? window.getClanGold(leader.clan) : 0);
    
    if (currentGold < totalCost) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато! Нужни: " + totalCost + ", Имате: " + currentGold);
        return;
    }
    
    if (window.spendClanGold) {
        window.spendClanGold(leader.clan, totalCost);
    } else if (leader.gold) {
        leader.gold -= totalCost;
    }
    
    leader.army = (leader.army || 0) + (unit.power * quantity);
    
    var tacticsBonus = (leader.skills.tactics || 0) * 0.05;
    var enduranceBonus = (leader.skills.endurance || 0) * 0.03;
    var totalBonus = 1 + tacticsBonus + enduranceBonus;
    leader.army = Math.floor(leader.army * totalBonus);
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("✅ " + leader.name + " купи " + quantity + " \u00d7 " + unit.name + " за " + totalCost + " злато! (+" + (unit.power * quantity) + " армия)");
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(leader);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    var profileModal = document.getElementById('hero-profile-modal');
    if (profileModal && profileModal.style.display === 'flex') {
        window.showHeroProfile(clanKey);
    }
};

console.log("✅ Част 3 заредена - Профил и армия");
// ЧАСТ 4 - УМЕНИЯ И RPG МОДАЛ
window.buySkillManual = function(clanKey, skillKey) {
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    if (!leader) return;
    
    if (leader.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🤖 Героят е в AUTO режим! Изключете автоматичното развитие за ръчно управление.");
        return;
    }
    if (leader.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате свободни точки за умения!");
        return;
    }
    
    var currentLevel = leader.skills[skillKey] || 0;
    var maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
    if (currentLevel >= maxLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Умението " + window.rpgDatabase.skillTrees[skillKey].name + " е достигнало максимално ниво " + maxLevel + "!");
        return;
    }
    
    leader.skills[skillKey] = currentLevel + 1;
    leader.skillPoints--;
    window.checkArcheAgeClass(leader);
    window.recalculateHeroPower(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("✅ " + leader.name + " научи " + window.rpgDatabase.skillTrees[skillKey].name + " (Ниво " + leader.skills[skillKey] + "/" + maxLevel + ")!");
    }
};

window.consumeStoredXPManual = function(clanKey) {
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    if (!leader) return;
    
    if (leader.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🤖 Героят е в AUTO режим! Ръчното качване на ниво е забранено.");
        return;
    }
    
    var req = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    if (leader.storedXP < req) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Недостатъчен опит! Нужни: " + req + ", Имате: " + leader.storedXP);
        return;
    }
    
    leader.storedXP -= req;
    leader.level++;
    leader.skillPoints++;
    leader.heroPower += 25;
    window.checkArcheAgeClass(leader);
    window.recalculateHeroPower(leader);
    
    if (leader.skillPoints > 0 && !leader.isAuto) {
        if (window.showAdvisorMsg) {
            setTimeout(function() {
                if (confirm(leader.name + " достигна Ниво " + leader.level + "! Искате ли да изберете умение сега?")) {
                    window.manualSkillChoiceOnLevelUp(clanKey);
                }
            }, 100);
        }
    }
    
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("🆙 " + leader.name + " достигна Ниво " + leader.level + " чрез ръчно развитие! (+1 Точка за умения)");
    }
};

window.manualSkillChoiceOnLevelUp = function(clanKey) {
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    
    if (!leader) return;
    if (leader.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🤖 Героят е в AUTO режим! Изключете го за ръчно избиране на умения.");
        return;
    }
    if (leader.skillPoints <= 0) {
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
    for (var key in window.rpgDatabase.skillTrees) {
        var currentLevel = leader.skills[key] || 0;
        var maxLevel = window.rpgDatabase.skillTrees[key].maxLevel || 5;
        if (currentLevel < maxLevel) {
            availableSkills.push(key);
        }
    }
    
    var skillsHtml = "";
    for (var i = 0; i < availableSkills.length; i++) {
        var skillKey = availableSkills[i];
        var data = window.rpgDatabase.skillTrees[skillKey];
        var currentLevel = leader.skills[skillKey] || 0;
        var maxLevel = data.maxLevel || 5;
        skillsHtml += '<button onclick="window.applyManualSkill(\'' + clanKey + '\', \'' + skillKey + '\')" style="width:100%; background:rgba(0,0,0,0.6); border:1px solid #d4af37; border-radius:8px; padding:12px; margin-bottom:10px; cursor:pointer; text-align:left; color:#fff;">' +
            '<div style="font-weight:bold; color:#ffd700;">' + data.name + '</div>' +
            '<div style="font-size:11px; color:#aaa;">' + data.desc + '</div>' +
            '<div style="font-size:10px; color:#00ffcc;">Ниво: ' + currentLevel + '/' + maxLevel + '</div>' +
            '</button>';
    }
    
    if (availableSkills.length === 0) {
        skillsHtml = '<p style="color:red; text-align:center;">📛 Всички умения са на максимум!</p>';
    }
    
    modal.innerHTML = '<div style="background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border:2px solid #d4af37; border-radius:16px; width:450px; max-width:90%; max-height:80%; overflow-y:auto;">' +
        '<div style="padding:20px; border-bottom:1px solid #d4af37; text-align:center; position:relative;">' +
        '<button onclick="document.getElementById(\'skill-choice-modal\').style.display=\'none\'" style="position:absolute; right:15px; top:15px; background:red; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">✕</button>' +
        '<h2 style="color:#d4af37; margin:0;">⭐ Избор на умение</h2>' +
        '<p style="color:#aaa;">' + leader.name + ' - Ниво ' + leader.level + '</p>' +
        '<p style="color:#ffd700;">🎯 Свободни точки: ' + leader.skillPoints + '</p>' +
        '</div>' +
        '<div style="padding:20px;">' + skillsHtml + '</div>' +
        '</div>';
    
    modal.style.display = 'flex';
};

window.applyManualSkill = function(clanKey, skillKey) {
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    
    if (!leader) return;
    if (leader.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате точки за умения!");
        var modal = document.getElementById('skill-choice-modal');
        if (modal) modal.style.display = 'none';
        return;
    }
    
    var currentLevel = leader.skills[skillKey] || 0;
    var maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
    
    if (currentLevel >= maxLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Умението е на максимум (" + maxLevel + "/" + maxLevel + ")!");
        return;
    }
    
    leader.skills[skillKey] = currentLevel + 1;
    leader.skillPoints--;
    window.checkArcheAgeClass(leader);
    window.recalculateHeroPower(leader);
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("✅ " + leader.name + " научи " + window.rpgDatabase.skillTrees[skillKey].name + " (Ниво " + leader.skills[skillKey] + "/" + maxLevel + ")!");
    }
    
    var modal = document.getElementById('skill-choice-modal');
    if (modal) modal.style.display = 'none';
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(leader);
    
    var rpgModal = document.getElementById('hero-rpg-modal');
    if (rpgModal && rpgModal.style.display === 'block') {
        window.openHeroRPGModal(clanKey);
    }
    
    var profileModal = document.getElementById('hero-profile-modal');
    if (profileModal && profileModal.style.display === 'flex') {
        window.showHeroProfile(clanKey);
    }
};

console.log("✅ Част 4 заредена - Умения и RPG модал");
// ЧАСТ 5 - RPG МОДАЛ И ПОМОЩНИ ФУНКЦИИ (ФИНАЛНА)
window.openHeroRPGModal = function(clanKey) {
    var modalEl = document.getElementById('hero-rpg-modal');
    if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'hero-rpg-modal';
        modalEl.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10002; display:none; align-items:center; justify-content:center; font-family:'Cinzel',serif;";
        document.body.appendChild(modalEl);
    }
    
    var leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && (window.currentHero.clan === clanKey || window.currentHero.name === clanKey)) {
        leader = window.currentHero;
    }
    if (!leader) leader = window.currentHero;
    if (!leader) return;
    
    window.initializeHeroRPGData(leader);
    
    var reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    var totalXP = (leader.xp || 0) + (leader.storedXP || 0);
    var xpPercent = 0;
    if (leader.isAuto) {
        xpPercent = (leader.xp / reqXP) * 100;
    } else {
        xpPercent = (leader.storedXP / reqXP) * 100;
        if (xpPercent > 100) xpPercent = 100;
    }
    
    var skillsHtml = "";
    for (var skillKey in window.rpgDatabase.skillTrees) {
        var skillData = window.rpgDatabase.skillTrees[skillKey];
        var lvl = leader.skills[skillKey] || 0;
        var maxLvl = skillData.maxLevel || 5;
        
        var buyButton = "";
        if (!leader.isAuto && leader.skillPoints > 0 && lvl < maxLvl) {
            buyButton = '<button onclick="window.buySkillManual(\'' + clanKey + '\', \'' + skillKey + '\')" style="background:#00ffcc; color:#000; border:none; padding:4px 8px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;">[+] Вдигни (' + lvl + '/' + maxLvl + ')</button>';
        } else if (!leader.isAuto && lvl >= maxLvl) {
            buyButton = '<span style="font-size:9px; color:#00ff00;">✓ MAX (' + lvl + '/' + maxLvl + ')</span>';
        } else if (!leader.isAuto && leader.skillPoints <= 0) {
            buyButton = '<span style="font-size:9px; color:#666;">🔒 Няма точки (' + lvl + '/' + maxLvl + ')</span>';
        } else if (leader.isAuto) {
            buyButton = '<span style="font-size:9px; color:#888;">🤖 AUTO (' + lvl + '/' + maxLvl + ')</span>';
        }
        
        skillsHtml += '<div style="background:rgba(20,20,20,0.8); border:1px solid #333; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; color:#fff; margin-bottom:6px;">' +
            '<div style="text-align:left; flex:1;"><b style="color:#ffd700; font-size:12px;">' + skillData.name + '</b><div style="font-size:10px; color:#aaa;">' + skillData.desc + '</div></div>' +
            '<div>' + buyButton + '</div>' +
            '</div>';
    }
    
    var equipmentHtml = "";
    var slotLabels = ["Шлем", "Нагръдник", "Оръжие", "Щит", "Ръкавици", "Ботуши", "Амулет", "Пръстен 1", "Пръстен 2", "Наколенки", "Пояс", "Плащ"];
    for (var i = 0; i < 12; i++) {
        var item = leader.equipment[i];
        equipmentHtml += '<div class="rpg-equip-box" style="width:65px; height:65px; background:rgba(0,0,0,0.5); border:1px solid #d4af37; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; font-size:10px; color:#fff; text-align:center;" onclick="alert(\'Оръжейна стая: Слот за ' + slotLabels[i] + '\');">' +
            (item ? '<div style="font-size:18px;">' + (item.icon || '🏺') + '</div><span style="font-size:7px;">' + (item.name.substring(0,6) || '...') + '</span>' : '<span style="opacity:0.25; font-size:18px;">🛡️</span><span style="font-size:7px; color:#aaa;">' + slotLabels[i] + '</span>') +
            '</div>';
    }
    
    var petHtml = "";
    var canChangePet = true;
    if (leader.pet && window.rpgDatabase.petsDatabase[leader.pet]) {
        var activePet = window.rpgDatabase.petsDatabase[leader.pet];
        petHtml = '<div style="font-size:32px;">' + activePet.icon + '</div><span style="font-size:8px; color:#ffd700; font-weight:bold;">' + activePet.name + '</span>';
    } else {
        petHtml = '<span style="font-size:24px; opacity:0.3;">🐾</span><span style="font-size:8px; color:#666;">ПРАЗЕН</span>';
    }
    
    var xpSection = "";
    if (!leader.isAuto) {
        xpSection = '<div style="background:rgba(0,198,255,0.15); border:1px solid #00c6ff; padding:10px; border-radius:6px; text-align:center; margin-bottom:10px;">' +
            '<div>✨ Събран ръчен опит: <b>' + leader.storedXP + ' / ' + reqXP + ' XP</b></div>' +
            (leader.storedXP >= reqXP ? '<button onclick="window.consumeStoredXPManual(\'' + clanKey + '\')" style="margin-top:8px; background:#0072ff; color:#fff; border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">⬆️ КАЧИ НИВО ⬆️</button>' : '<div style="font-size:10px; color:#ff6600; margin-top:5px;">🔥 Нужни още ' + (reqXP - leader.storedXP) + ' XP за следващо ниво</div>') +
            '</div>';
    } else {
        xpSection = '<div style="background:rgba(0,0,0,0.5); border-radius:6px; padding:8px; margin-bottom:10px;">' +
            '<div style="font-size:11px; color:#aaa; margin-bottom:4px;">🎯 Опит до следващо ниво: ' + leader.xp + ' / ' + reqXP + ' XP</div>' +
            '<div style="background:#333; border-radius:4px; height:12px; overflow:hidden;"><div style="background:#00ffcc; width:' + xpPercent + '%; height:100%;"></div></div>' +
            '</div>';
    }
    
    modalEl.innerHTML = '<div style="background:linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%); border:2px solid #d4af37; border-radius:16px; width:550px; max-width:95%; max-height:90%; overflow-y:auto;">' +
        '<div style="padding:15px; border-bottom:1px solid #d4af37; background:rgba(0,0,0,0.6); text-align:center; position:relative;">' +
        '<button onclick="document.getElementById(\'hero-rpg-modal\').style.display=\'none\'" style="position:absolute; right:10px; top:10px; background:#8b0000; color:white; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:16px;">✕</button>' +
        '<h2 style="color:#d4af37; margin:0;">⚔️ ' + (leader.name || "Пълководец") + ' ⚔️</h2>' +
        '<p style="color:#aaa; margin:5px 0;">' + (leader.currentClass || "Багатур") + ' | Ниво ' + leader.level + ' | Сила: ' + leader.heroPower + '</p>' +
        '<p style="color:#ffd700; margin:5px 0;">💰 Злато: ' + (leader.gold || 0) + ' | ⚔️ Армия: ' + (leader.army || 0) + '</p>' +
        '<div>' +
        '<span id="rpg-auto-mode-indicator" style="background:' + (leader.isAuto ? '#006400' : '#8b4513') + '; padding:3px 10px; border-radius:20px; font-size:11px; display:inline-block;">' + (leader.isAuto ? '🤖 AUTO' : '👆 РЪЧЕН') + '</span>' +
        '<button onclick="window.toggleHeroAutoMode(\'' + clanKey + '\'); window.openHeroRPGModal(\'' + clanKey + '\');" style="margin-left:8px; background:#444; border:1px solid #d4af37; padding:3px 10px; border-radius:20px; cursor:pointer; font-size:10px; color:#fff;">🔄 Превключи</button>' +
        '<button onclick="window.showHeroProfile(\'' + clanKey + '\'); document.getElementById(\'hero-rpg-modal\').style.display=\'none\';" style="margin-left:8px; background:#d4af37; border:none; padding:3px 10px; border-radius:20px; cursor:pointer; font-size:10px; color:#000; font-weight:bold;">📊 ПРОФИЛ</button>' +
        '</div>' +
        '</div>' +
        '<div style="padding:15px;">' +
        '<h4 style="color:#d4af37; margin:0 0 10px 0;">🐾 Домашен любимец</h4>' +
        '<div id="rpg-pet-slot" style="background:rgba(0,0,0,0.5); border:1px dashed #d4af37; border-radius:8px; padding:10px; text-align:center; cursor:pointer; margin-bottom:15px;">' + petHtml + '</div>' +
        '<h4 style="color:#d4af37; margin:0 0 10px 0;">🛡️ Екипировка</h4>' +
        '<div id="rpg-equipment-grid" style="display:grid; grid-template-columns:repeat(6,1fr); gap:5px; margin-bottom:15px;">' + equipmentHtml + '</div>' +
        '<h4 style="color:#d4af37; margin:0 0 10px 0;">⭐ Дърво на уменията <span style="font-size:12px; color:#aaa;">(Точки: ' + (leader.skillPoints || 0) + ')</span></h4>' +
        xpSection +
        '<div id="rpg-modal-skills-container" style="max-height:300px; overflow-y:auto;">' + skillsHtml + '</div>' +
        '</div>' +
        '</div>';
    
    var petSlotDiv = document.getElementById('rpg-pet-slot');
    if (petSlotDiv) {
        petSlotDiv.onclick = function() {
            var petKeys = [];
            for (var pk in window.rpgDatabase.petsDatabase) {
                petKeys.push(pk);
            }
            var optionsStr = "Изберете нов домашен любимец:\n";
            for (var idx = 0; idx < petKeys.length; idx++) {
                var p = window.rpgDatabase.petsDatabase[petKeys[idx]];
                optionsStr += (idx + 1) + ". " + p.icon + " " + p.name + "\n";
            }
            var choice = prompt(optionsStr);
            if (choice && choice > 0 && choice <= petKeys.length) {
                leader.pet = petKeys[choice - 1];
                window.openHeroRPGModal(clanKey);
            }
        };
    }
    
    modalEl.style.display = 'flex';
};

window.calculateArtifactSetBonuses = function(hero) {
    if (!hero || !hero.inventory) return {};
    var setsCollected = {};
    var totalSetBonus = { heroPower: 0, goldBonus: 0, defense: 0, armyBonus: 0, diplomacyBonus: 0, mysticismBonus: 0 };
    
    for (var i = 0; i < hero.inventory.length; i++) {
        var item = hero.inventory[i];
        if (item && item.set && window.historicalArtifacts && window.historicalArtifacts[item.id]) {
            var artifact = window.historicalArtifacts[item.id];
            if (!setsCollected[artifact.set]) setsCollected[artifact.set] = [];
            if (setsCollected[artifact.set].indexOf(artifact.id) === -1) {
                setsCollected[artifact.set].push(artifact.id);
            }
        }
    }
    
    for (var setKey in setsCollected) {
        if (window.artifactSetBonuses && window.artifactSetBonuses[setKey]) {
            var setInfo = window.artifactSetBonuses[setKey];
            if (setsCollected[setKey].length >= setInfo.pieces) {
                if (window.console) console.log("✨ Активиран сет: " + setInfo.name);
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
            if (item && item.bonus && item.bonus.heroPower) {
                artifactBonus += item.bonus.heroPower;
            }
        }
    }
    
    if (hero.skills && hero.skills.tactics) {
        skillBonus += hero.skills.tactics * 15;
    }
    if (hero.skills && hero.skills.heavyStrike) {
        skillBonus += hero.skills.heavyStrike * 10;
    }
    if (hero.skills && hero.skills.berserk) {
        skillBonus += hero.skills.berserk * 8;
    }
    
    var setBonuses = window.calculateArtifactSetBonuses(hero);
    setBonus = setBonuses.heroPower || 0;
    
    hero.heroPower = basePower + artifactBonus + setBonus + skillBonus;
    
    if (window.showAdvisorMsg && (artifactBonus > 0 || setBonus > 0 || skillBonus > 0)) {
        if (window.console) console.log("📊 Сила на " + hero.name + ": базова " + basePower + " + артефакти " + artifactBonus + " + сет " + setBonus + " + умения " + skillBonus + " = " + hero.heroPower);
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
        case 'morale':
            bonus += (hero.skills.tangraFire || 0) * 10;
            break;
        case 'mysticism':
            bonus += (hero.skills.mysticism || 0) * 8;
            break;
    }
    
    return bonus;
};

console.log("✅ Част 5 заредена - RPG модал и помощни функции (ФИНАЛНА)");
console.log("🎉 ВСИЧКИ 5 ЧАСТИ СА ЗАРЕДЕНИ! Системата е готова за работа!");
