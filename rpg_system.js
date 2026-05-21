// =========================================================================
// ВЕЛИКА БЪЛГАРИЯ - rpg_system.js (ПЪЛЕН, КОРИГИРАН И СИНХРОНИЗИРАН)
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
    tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя (Hero Power).", maxLevel: 5 },
    endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска и намалява щетите.", maxLevel: 5 },
    heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети при щурм.", maxLevel: 5 },
    shieldWall: { name: "Стена от щитове", desc: "Значително намалява загубите на бойци при тежка обсада.", maxLevel: 5 },
    berserk: { name: "Ярост на Багатура", desc: "Колкото по-малко войници остават, толкова по-силно атакува героят.", maxLevel: 5 },
    ambush: { name: "Засада", desc: "Шанс за нанасяне на тежък първоначален удар преди битката да е започнала.", maxLevel: 5 },
    poisonBlade: { name: "Отровено острие", desc: "Нанася пасивни щети на вражеския водач всеки сезон.", maxLevel: 5 },
    assassinate: { name: "Покушение", desc: "Шанс за директно елиминиране на вражеския пълководец.", maxLevel: 3 },
    shadowStep: { name: "Сенчеста стъпка", desc: "Повишава шанса за успешно бягство от засада в непознати земи.", maxLevel: 5 },
    smokeBomb: { name: "Димна завеса", desc: "Намалява точността на стрелците на врага по време на щурм.", maxLevel: 5 },
    mysticism: { name: "Древно Знание", desc: "Повишава шанса за намиране на редки артефакти по време на походи.", maxLevel: 5 },
    tangraFire: { name: "Огънят на Тангра", desc: "Вдъхновява войската, повишавайки бойния дух на максимум.", maxLevel: 5 },
    vampirism: { name: "Кръвен устрем", desc: "Възстановява част от загубените войници след спечелена битка.", maxLevel: 5 },
    raiseDead: { name: "Въздигане на падналите", desc: "Временно съживява част от падналите врагове.", maxLevel: 3 },
    totemGlow: { name: "Тотемна закрила", desc: "Защитава активния регион от неочаквани природни бедствия.", maxLevel: 5 },
    economy: { name: "Родово Управление", desc: "Увеличава базовия доход от родовите региони.", maxLevel: 5 },
    goldRush: { name: "Златна Треска", desc: "Увеличава добива на злато от открити златни мини.", maxLevel: 5 },
    cartel: { name: "Търговски съюз", desc: "Намалява пасивните разходи за поддръжка на родовите пазари.", maxLevel: 5 },
    logistics: { name: "Логистика", desc: "Намалява разходите за храна и поддръжка на редовната армия.", maxLevel: 5 },
    bazaars: { name: "Родови пазари", desc: "Увеличава печалбите при сключване на успешни династични бракове.", maxLevel: 5 }
};

window.rpgDatabase.classRecipes = [
    { name: "Върховен Боил", reqLevel: 3, reqTrees: ["tactics", "endurance"] },
    { name: "Нощно Острие", reqLevel: 3, reqTrees: ["ambush", "poisonBlade"] },
    { name: "Колобър", reqLevel: 3, reqTrees: ["mysticism", "tangraFire"] },
    { name: "Иконом на Рода", reqLevel: 3, reqTrees: ["economy", "goldRush"] },
    { name: "Гвардеец на Тангра", reqLevel: 4, reqTrees: ["tactics", "tangraFire"] },
    { name: "Сенчест Търговец", reqLevel: 4, reqTrees: ["ambush", "cartel"] },
    { name: "Кръвожаден Воин", reqLevel: 5, reqTrees: ["heavyStrike", "vampirism"] },
    { name: "Пазител на Съкровища", reqLevel: 5, reqTrees: ["mysticism", "economy"] },
    { name: "Железният Хан", reqLevel: 6, reqTrees: ["tactics", "heavyStrike", "endurance"] },
    { name: "Тангра Пратеник", reqLevel: 6, reqTrees: ["mysticism", "tangraFire", "totemGlow"] }
];

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
    leader.isAuto = leader.isAuto !== undefined ? leader.isAuto : true; // Всички герои се развиват автоматично
    if (!leader.equipment) leader.equipment = Array(12).fill(null);
    if (!leader.inventory) leader.inventory = [];
    if (leader.pet === undefined) leader.pet = null;
    Object.keys(window.rpgDatabase.skillTrees).forEach(skillKey => {
        if (leader.skills[skillKey] === undefined) leader.skills[skillKey] = 0;
    });
    leader.isRPGInitialized = true;
};

window.gainHeroXP = function(leader, amount) {
    if (!leader) return;
    window.initializeHeroRPGData(leader);
    
    if (leader.isAuto) {
        leader.xp += amount;
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        let leveledUp = false;
        while (leader.xp >= requiredXP && leader.level < 100) {
            leader.xp -= requiredXP;
            leader.level++;
            leader.skillPoints++;
            leader.heroPower += 25;
            leveledUp = true;
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`🆙 ${leader.name} достигна Ниво ${leader.level}! (+1 Точка за умения)`);
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
            window.showAdvisorMsg(`📚 ${leader.name} натрупа ${amount} ръчен опит! (Общо: ${leader.storedXP})`);
        }
    }
    
    if (window.worldData && window.worldData.clans && leader.clan) window.worldData.clans[leader.clan] = leader;
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(leader);
    if (window.openHeroRPGModal && document.getElementById('hero-rpg-modal') && document.getElementById('hero-rpg-modal').style.display === 'block') {
        window.openHeroRPGModal(leader.clan);
    }
};

window.toggleHeroAutoMode = function(clanKey) {
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) leader = window.worldData.clans[clanKey];
    else if (window.unlockedLeaders) leader = window.unlockedLeaders.find(h => h.clan === clanKey || h.name === clanKey);
    else if (window.currentHero && window.currentHero.clan === clanKey) leader = window.currentHero;
    if (!leader) return;
    window.initializeHeroRPGData(leader);
    leader.isAuto = !leader.isAuto;
    
    if (!leader.isAuto && leader.xp > 0) {
        leader.storedXP += leader.xp;
        leader.xp = 0;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🔄 Режимът на ${leader.name} е сменен на РЪЧЕН. ${leader.storedXP} XP са прехвърлени в склад.`);
        }
    } else if (leader.isAuto && leader.storedXP > 0) {
        let amount = leader.storedXP;
        leader.storedXP = 0;
        window.gainHeroXP(leader, amount);
    }
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    const modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') window.openHeroRPGModal(clanKey);
};

window.autoAssignSkillPoint = function(leader) {
    if (leader.skillPoints <= 0) return;
    
    const skillKeys = Object.keys(window.rpgDatabase.skillTrees);
    const availableSkills = skillKeys.filter(skillKey => {
        const currentLevel = leader.skills[skillKey] || 0;
        const maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
        return currentLevel < maxLevel;
    });
    
    if (availableSkills.length === 0) return;
    
    const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    leader.skills[randomSkill] = (leader.skills[randomSkill] || 0) + 1;
    leader.skillPoints--;
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🤖 Автоматично: ${leader.name} научи ${window.rpgDatabase.skillTrees[randomSkill].name}!`);
    }
};

window.buySkillManual = function(clanKey, skillKey) {
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) leader = window.worldData.clans[clanKey];
    else if (window.currentHero && window.currentHero.clan === clanKey) leader = window.currentHero;
    if (!leader) return;
    if (leader.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🤖 Героят е в AUTO режим! Изключете автоматичното развитие за ръчно управление.`);
        return;
    }
    if (leader.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Нямате свободни точки за умения!`);
        return;
    }
    
    const currentLevel = leader.skills[skillKey] || 0;
    const maxLevel = window.rpgDatabase.skillTrees[skillKey].maxLevel || 5;
    if (currentLevel >= maxLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Умението ${window.rpgDatabase.skillTrees[skillKey].name} е достигнало максимално ниво ${maxLevel}!`);
        return;
    }
    
    leader.skills[skillKey] = currentLevel + 1;
    leader.skillPoints--;
    window.checkArcheAgeClass(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`✅ ${leader.name} научи ${window.rpgDatabase.skillTrees[skillKey].name} (Ниво ${leader.skills[skillKey]}/${maxLevel})!`);
    }
};

window.consumeStoredXPManual = function(clanKey) {
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) leader = window.worldData.clans[clanKey];
    else if (window.currentHero && window.currentHero.clan === clanKey) leader = window.currentHero;
    if (!leader) return;
    if (leader.isAuto) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🤖 Героят е в AUTO режим! Ръчното качване на ниво е забранено.`);
        return;
    }
    
    let req = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    if (leader.storedXP < req) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Недостатъчен опит! Нужни: ${req}, Имате: ${leader.storedXP}`);
        return;
    }
    
    leader.storedXP -= req;
    leader.level++;
    leader.skillPoints++;
    leader.heroPower += 25;
    window.checkArcheAgeClass(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🆙 ${leader.name} достигна Ниво ${leader.level} чрез ръчно развитие! (+1 Точка за умения)`);
    }
};

window.checkArcheAgeClass = function(leader) {
    let skillLevels = {};
    Object.keys(leader.skills).forEach(key => {
        if (leader.skills[key] > 0) skillLevels[key] = leader.skills[key];
    });
    
    const availableClasses = window.rpgDatabase.classRecipes.filter(recipe => {
        if (leader.level < recipe.reqLevel) return false;
        return recipe.reqTrees.every(tree => skillLevels[tree] && skillLevels[tree] > 0);
    });
    
    if (availableClasses.length > 0) {
        availableClasses.sort((a, b) => b.reqLevel - a.reqLevel);
        const newClass = availableClasses[0];
        if (leader.currentClass !== newClass.name) {
            const oldClass = leader.currentClass;
            leader.currentClass = newClass.name;
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: ${leader.name} се издигна от "${oldClass}" до клас "${leader.currentClass}"!`);
            }
        }
    }
};

window.openHeroRPGModal = function(clanKey) {
    const modalEl = document.getElementById('hero-rpg-modal');
    if (!modalEl) return;
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) leader = window.worldData.clans[clanKey];
    else if (window.currentHero && (window.currentHero.clan === clanKey || window.currentHero.name === clanKey)) leader = window.currentHero;
    if (!leader) leader = window.currentHero;
    if (!leader) return;
    window.initializeHeroRPGData(leader);
    
    const titleEl = document.getElementById('rpg-modal-title');
    const subtitleEl = document.getElementById('rpg-modal-subtitle');
    const pointsEl = document.getElementById('rpg-modal-points');
    const autoModeEl = document.getElementById('rpg-auto-mode-indicator');
    
    if (titleEl) titleEl.innerText = `Водач ${leader.name || "Пълководец"}`;
    if (subtitleEl) subtitleEl.innerText = `Клан ${leader.clan || clanKey} | Клас: ${leader.currentClass || "Багатур"} (Ниво ${leader.level || 1}) | Сила: ${leader.heroPower || 150}`;
    if (pointsEl) pointsEl.innerText = leader.skillPoints || 0;
    
    if (autoModeEl) {
        autoModeEl.innerHTML = leader.isAuto ? 
            '<span style="color:#00ff00;">🤖 AUTO режим (Активен)</span>' : 
            '<span style="color:#ff6600;">👆 РЪЧЕН режим (Активен)</span>';
    }
    
    const equipGrid = document.getElementById('rpg-equipment-grid');
    if (equipGrid) {
        equipGrid.innerHTML = "";
        const slotLabels = ["Шлем", "Нагръдник", "Оръжие", "Щит", "Ръкавици", "Ботуши", "Амулет", "Пръстен 1", "Пръстен 2", "Наколенки", "Пояс", "Плащ"];
        for (let i = 0; i < 12; i++) {
            const item = leader.equipment[i];
            const box = document.createElement('div');
            box.className = "rpg-equip-box";
            box.style.cssText = "width:70px; height:70px; background:rgba(0,0,0,0.5); border:1px solid #d4af37; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; font-size:11px; color:#fff; text-align:center;";
            box.onclick = () => alert(`Оръжейна стая: Преместете предмет от съкровищницата в слот за ${slotLabels[i]}.`);
            box.innerHTML = item ? 
                `<div style="font-size:20px;">${item.icon || '🏺'}</div><span style="font-size:8px;">${item.name.substring(0,8)}</span>` : 
                `<span style="opacity:0.25; font-size:20px;">🛡️</span><span style="font-size:8px; color:#aaa;">${slotLabels[i]}</span>`;
            equipGrid.appendChild(box);
        }
    }
    
    const petSlot = document.getElementById('rpg-pet-slot');
    if (petSlot) {
        if (leader.pet && window.rpgDatabase.petsDatabase[leader.pet]) {
            const activePet = window.rpgDatabase.petsDatabase[leader.pet];
            petSlot.innerHTML = `<div style="font-size:32px;">${activePet.icon}</div><span style="font-size:8px; color:#ffd700; font-weight:bold;">${activePet.name}</span>`;
            petSlot.title = activePet.desc;
            petSlot.onclick = () => {
                if(confirm(`Искате ли да освободите домашния любимец ${activePet.name}?`)) {
                    leader.pet = null;
                    window.openHeroRPGModal(clanKey);
                }
            };
        } else {
            petSlot.innerHTML = `<span style="font-size:24px; opacity:0.3;">🐾</span><span style="font-size:8px; color:#666;">ПРАЗЕН</span>`;
            petSlot.onclick = () => {
                const petKeys = Object.keys(window.rpgDatabase.petsDatabase);
                let optionsStr = "Изберете нов домашен любимец:\n";
                petKeys.forEach((k, idx) => {
                    const p = window.rpgDatabase.petsDatabase[k];
                    optionsStr += `${idx + 1}. ${p.icon} ${p.name}\n`;
                });
                const choice = prompt(optionsStr);
                if (choice && choice > 0 && choice <= petKeys.length) {
                    leader.pet = petKeys[choice - 1];
                    window.openHeroRPGModal(clanKey);
                }
            };
        }
    }
    
    const skillsContainer = document.getElementById('rpg-modal-skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = "";
        let reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        
        if (!leader.isAuto) {
            const xpBarBtn = document.createElement('div');
            xpBarBtn.style.cssText = "background:rgba(0,198,255,0.15); border:1px solid #00c6ff; padding:10px; border-radius:6px; text-align:center; margin-bottom:10px; color:#fff; font-size:12px;";
            if (leader.storedXP >= reqXP) {
                xpBarBtn.innerHTML = `<div>✨ Събран ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b></div>
                                      <button onclick="window.consumeStoredXPManual('${clanKey}')" style="margin-top:5px; background:#0072ff; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold; font-family:'Cinzel';">КАЧИ НИВО СЕГА ➔</button>`;
            } else {
                xpBarBtn.innerHTML = `<div>📊 Събран ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b> (не достига ${reqXP - leader.storedXP} XP)</div>`;
            }
            skillsContainer.appendChild(xpBarBtn);
        } else {
            const xpBarAuto = document.createElement('div');
            const currentXP = leader.xp;
            const xpPercent = (currentXP / reqXP) * 100;
            xpBarAuto.style.cssText = "background:rgba(0,0,0,0.5); border-radius:6px; padding:8px; margin-bottom:10px;";
            xpBarAuto.innerHTML = `<div style="font-size:11px; color:#aaa; margin-bottom:4px;">🎯 Опит до следващо ниво: ${currentXP} / ${reqXP} XP</div>
                                   <div style="background:#333; border-radius:4px; height:12px; overflow:hidden;"><div style="background:#00ffcc; width:${xpPercent}%; height:100%; transition:width 0.3s;"></div></div>`;
            skillsContainer.appendChild(xpBarAuto);
        }
        
        for (let [skillKey, skillData] of Object.entries(window.rpgDatabase.skillTrees)) {
            const lvl = leader.skills[skillKey] || 0;
            const maxLvl = skillData.maxLevel || 5;
            const node = document.createElement('div');
            node.style.cssText = "background:rgba(20,20,20,0.8); border:1px solid #333; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; color:#fff; margin-bottom:6px;";
            
            let buyButton = "";
            if (!leader.isAuto && leader.skillPoints > 0 && lvl < maxLvl) {
                buyButton = `<button onclick="window.buySkillManual('${clanKey}', '${skillKey}')" style="background:#00ffcc; color:#000; border:none; padding:4px 8px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;">[+] Вдигни (${lvl}/${maxLvl})</button>`;
            } else if (!leader.isAuto && lvl >= maxLvl) {
                buyButton = `<span style="font-size:9px; color:#00ff00;">✓ MAX (${lvl}/${maxLvl})</span>`;
            } else if (!leader.isAuto && leader.skillPoints <= 0) {
                buyButton = `<span style="font-size:9px; color:#666;">🔒 Няма точки (${lvl}/${maxLvl})</span>`;
            } else if (leader.isAuto) {
                buyButton = `<span style="font-size:9px; color:#888;">🤖 AUTO (${lvl}/${maxLvl})</span>`;
            }
            
            node.innerHTML = `<div style="text-align:left; flex:1;"><b style="color:#ffd700; font-size:12px;">${skillData.name}</b><div style="font-size:10px; color:#aaa;">${skillData.desc}</div></div><div>${buyButton}</div>`;
            skillsContainer.appendChild(node);
        }
    }
    
    modalEl.style.display = "block";
};

window.calculateArtifactSetBonuses = function(hero) {
    if (!hero || !hero.inventory) return {};
    const setsCollected = {};
    let totalSetBonus = { heroPower: 0, goldBonus: 0, defense: 0, armyBonus: 0, diplomacyBonus: 0, mysticismBonus: 0 };
    for (let item of hero.inventory) {
        if (item && item.set && window.historicalArtifacts && window.historicalArtifacts[item.id]) {
            const artifact = window.historicalArtifacts[item.id];
            if (!setsCollected[artifact.set]) setsCollected[artifact.set] = [];
            if (!setsCollected[artifact.set].includes(artifact.id)) setsCollected[artifact.set].push(artifact.id);
        }
    }
    for (let setKey in setsCollected) {
        if (window.artifactSetBonuses && window.artifactSetBonuses[setKey]) {
            const setInfo = window.artifactSetBonuses[setKey];
            if (setsCollected[setKey].length >= setInfo.pieces) {
                console.log(`✨ Активиран сет: ${setInfo.name}`);
                for (let bonus in setInfo.bonus) totalSetBonus[bonus] = (totalSetBonus[bonus] || 0) + setInfo.bonus[bonus];
            }
        }
    }
    return totalSetBonus;
};

window.recalculateHeroPower = function(hero) {
    if (!hero) return;
    let basePower = hero.baseHeroPower || hero.heroPower || 100;
    let artifactBonus = 0;
    let setBonus = 0;
    let skillBonus = 0;
    
    if (hero.inventory) {
        for (let item of hero.inventory) {
            if (item && item.bonus && item.bonus.heroPower) artifactBonus += item.bonus.heroPower;
        }
    }
    
    if (hero.skills && hero.skills.tactics) {
        skillBonus += hero.skills.tactics * 15;
    }
    
    const setBonuses = window.calculateArtifactSetBonuses(hero);
    setBonus = setBonuses.heroPower || 0;
    
    hero.heroPower = basePower + artifactBonus + setBonus + skillBonus;
    
    if (window.showAdvisorMsg && (artifactBonus > 0 || setBonus > 0 || skillBonus > 0)) {
        console.log(`📊 Сила на ${hero.name}: базова ${basePower} + артефакти ${artifactBonus} + сет ${setBonus} + умения ${skillBonus} = ${hero.heroPower}`);
    }
    return hero.heroPower;
};

window.getSkillLevel = function(hero, skillKey) {
    if (!hero || !hero.skills) return 0;
    return hero.skills[skillKey] || 0;
};

window.getHeroCombatBonus = function(hero, bonusType) {
    if (!hero || !hero.skills) return 0;
    let bonus = 0;
    
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
