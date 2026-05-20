/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: rpg_system.js (ДВИГАТЕЛ ЗА НИВА И УМЕНИЯ)
СТАТУС: ФИКСИРАН ЛОГИЧЕСКИ БЪГ ПРИ НАДГРАЖДАНЕ
КОРЕКЦИЯ: Динамично преизчисляване на XP вътре в цикъла, задължителна инициализация на skillPoints.
==========================================================================
*/

window.rpgDatabase = window.rpgDatabase || {};

// Формула за опит: Ниво * 150
window.rpgDatabase.getXPRequiredForLevel = function(level) {
    return (level || 1) * 150;
};

/**
🐾 БАЗА ДАННИ ЗА ДОМАШНИ ЛЮБИМЦИ
*/
window.rpgDatabase.petsDatabase = {
    "falcon": { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." },
    "wolf": { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен Смазващ удар." },
    "stallion": { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." },
    "bear": { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." },
    "viper": { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." }
};

/**
🎯 СКИЛ ДЪРВЕТА
*/
window.rpgDatabase.skillTrees = {
    tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя (Hero Power)." },
    endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска и намалява щетите." },
    heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети при щурм." },
    shieldWall: { name: "Стена от щитове", desc: "Значително намалява загубите на бойци при тежка обсада." },
    berserk: { name: "Ярост на Багатура", desc: "Колкото по-малко войници остават, толкова по-силно атакува героят." },
    ambush: { name: "Засада", desc: "Шанс за нанасяне на тежък първоначален удар преди битката да е започнала." },
    poisonBlade: { name: "Отровено острие", desc: "Нанася пасивни щети на вражеския водач всеки сезон." },
    assassinate: { name: "Покушение", desc: "Шанс за директно елиминиране на вражеския пълководец." },
    shadowStep: { name: "Сенчеста стъпка", desc: "Повишава шанса за успешно бягство от засада в непознати земи." },
    smokeBomb: { name: "Димна завеса", desc: "Намалява точността на стрелците на врага по време на щурм." },
    mysticism: { name: "Древно Знание", desc: "Повишава шанса за намиране на редки артефакти по време на походи." },
    tangraFire: { name: "Огънят на Тангра", desc: "Вдъхновява войската, повишавайки бойния дух на максимум." },
    vampirism: { name: "Кръвен устрем", desc: "Възстановява част от загубените войници след спечелена битка." },
    raiseDead: { name: "Въздигане на падналите", desc: "Временно съживява част от падналите врагове каквито и да са те." },
    totemGlow: { name: "Тотемна закрила", desc: "Защитава активния регион от неочаквани природни бедствия." },
    economy: { name: "Родово Управление", desc: "Увеличава базовия доход от родовите региони." },
    goldRush: { name: "Златна Треска", desc: "Увеличава добива на злато от открити златни мини." },
    cartel: { name: "Търговски съюз", desc: "Намалява пасивните разходи за поддръжка на родовите пазари." },
    logistics: { name: "Логистика", desc: "Намалява разходите за храна и поддръжка на редовната армия." },
    bazaars: { name: "Родови пазари", desc: "Увеличава печалбите при сключване на успешни династични бракове." }
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

/**
🛡️ ИНИЦИАЛИЗИРАНЕ НА ГЕРОЙ (САМО ЕДИН ИЗТОЧНИК)
*/
window.initializeHeroRPGData = function(leader) {
    if (!leader) return;
    if (leader.isRPGInitialized) return;

    leader.level = leader.level || 1;
    leader.xp = leader.xp || 0;
    leader.storedXP = leader.storedXP || 0;
    leader.skillPoints = leader.skillPoints || 0; // ФИКС: Задължителна инициализация на 0
    leader.skills = leader.skills || {};
    leader.currentClass = leader.currentClass || "Багатур";
    leader.heroPower = leader.heroPower || 150;
    
    if (leader.isAuto === undefined) leader.isAuto = true; // Default to Auto
    
    if (!leader.equipment) leader.equipment = Array(9).fill(null);
    if (leader.pet === undefined) leader.pet = null;
    
    // Попълване на липсващи скиллове
    Object.keys(window.rpgDatabase.skillTrees).forEach(skillKey => {
        if (leader.skills[skillKey] === undefined) {
            leader.skills[skillKey] = 0;
        }
    });
    
    leader.isRPGInitialized = true;
};

/**
⏳ ДВИГАТЕЛ ЗА ТРУПАНЕ НА ОПИТ И НИВА (ОПРАВЕН)
*/
window.gainHeroXP = function(leader, amount) {
    if (!leader) return;
    
    // 1. Инициализация (гарантира, че няма NaN грешки)
    window.initializeHeroRPGData(leader);
    
    // 2. Логика Auto vs Manual
    if (leader.isAuto) {
        leader.xp += amount;
        
        // 3. ЦИКЪЛ ЗА НИВО (Динамично пресмятане)
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        while (leader.xp >= requiredXP) {
            leader.xp -= requiredXP;          // Изваждаме текущия опит
            leader.level++;                   // Вдигаме ниво
            leader.skillPoints += 1;          // ДАВАМЕ ТОЧКА ЗА УМЕНИЯ (КРИТИЧНО)
            leader.heroPower += 25;           // Визуален буст на силата
            
            // Пресмятаме новия необходим опит за СЛЕДВАЩОТО ниво
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`🆙 ${leader.name} достигна Ниво ${leader.level}! (+1 Точка за умения)`);
            }
        }
    } else {
        // Manual режим: просто трупаме в "склада"
        leader.storedXP += amount;
    }

    // 4. Синхронизация на глобалните обекти (ако е подаден обект от масив)
    // Това гарантира, че промените се пазят
    if (window.worldData && window.worldData.clans && leader.clan) {
        // Ако leader е референция, това е излишно, но за сигурност:
        window.worldData.clans[leader.clan] = leader;
    }

    // 5. Опресняване на Интерфейса (ВИЗУАЛИЗАЦИЯ)
    window.checkArcheAgeClass(leader);
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(leader);
    if (window.openHeroRPGModal && document.getElementById('hero-rpg-modal') && document.getElementById('hero-rpg-modal').style.display === 'block') {
        window.openHeroRPGModal(leader.clan);
    }
};

/**
🔄 ПРЕВКЛЮЧВАНЕ НА AUTO РЕЖИМ
*/
window.toggleHeroAutoMode = function(clanKey) {
    let leader = null;
    // Търсене в worldData
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } 
    // Търсене в unlockedLeaders
    else if (window.unlockedLeaders) {
        leader = window.unlockedLeaders.find(h => h.clan === clanKey || h.name === clanKey);
    }
    // Търсене в currentHero
    else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    
    if (!leader) return;
    
    window.initializeHeroRPGData(leader);
    leader.isAuto = !leader.isAuto;
    
    // Ако минаваме на Auto, прехвърляме събрания ръчен опит
    if (leader.isAuto && leader.storedXP > 0) {
        const amount = leader.storedXP;
        leader.storedXP = 0;
        window.gainHeroXP(leader, amount); // Веднага го обработваме
    }
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    const modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') {
        window.openHeroRPGModal(clanKey);
    }
};

window.autoAssignSkillPoint = function(leader) {
    if (leader.skillPoints <= 0) return;
    const skillKeys = Object.keys(window.rpgDatabase.skillTrees);
    const randomSkill = skillKeys[Math.floor(Math.random() * skillKeys.length)];
    leader.skills[randomSkill] = (leader.skills[randomSkill] || 0) + 1;
    leader.skillPoints--;
};

window.buySkillManual = function(clanKey, skillKey) {
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    
    if (!leader) return;
    if (leader.isAuto) return; 
    if (leader.skillPoints <= 0) return;

    leader.skills[skillKey] = (leader.skills[skillKey] || 0) + 1;
    leader.skillPoints--;

    window.checkArcheAgeClass(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

window.consumeStoredXPManual = function(clanKey) {
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && window.currentHero.clan === clanKey) {
        leader = window.currentHero;
    }
    if (!leader) return;
    
    let req = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    if (leader.storedXP < req) return;

    leader.storedXP -= req;
    leader.level++;
    leader.skillPoints++;
    leader.heroPower += 25;

    window.checkArcheAgeClass(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

window.checkArcheAgeClass = function(leader) {
    let skillPairs = Object.entries(leader.skills).filter(([k, v]) => v > 0);
    skillPairs.sort((a, b) => b[1] - a[1]);
    let topSkills = skillPairs.map(p => p[0]);
    
    const availableClasses = window.rpgDatabase.classRecipes.filter(recipe => {
        if (leader.level < recipe.reqLevel) return false;
        return recipe.reqTrees.every(tree => topSkills.includes(tree));
    });

    if (availableClasses.length > 0) {
        availableClasses.sort((a, b) => b.reqLevel - a.reqLevel);
        const newClass = availableClasses[0];
        if (leader.currentClass !== newClass.name) {
            leader.currentClass = newClass.name;
            if (window.showAdvisorMsg) window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: ${leader.name} се издигна до клас "${leader.currentClass}"!`);
        }
    }
};

/**
🎒 РЕНДЕРИРАНЕ НА RPG МОДАЛА
*/
window.openHeroRPGModal = function(clanKey) {
    const modalEl = document.getElementById('hero-rpg-modal');
    if (!modalEl) return;
    
    let leader = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } else if (window.currentHero && (window.currentHero.clan === clanKey || window.currentHero.name === clanKey)) {
        leader = window.currentHero;
    }
    
    if (!leader) leader = window.currentHero;
    if (!leader) return;
    
    window.initializeHeroRPGData(leader);
    
    // 1. Заглавия
    const titleEl = document.getElementById('rpg-modal-title');
    const subtitleEl = document.getElementById('rpg-modal-subtitle');
    const pointsEl = document.getElementById('rpg-modal-points');
    
    if (titleEl) titleEl.innerText = `Водач ${leader.name || "Пълководец"}`;
    if (subtitleEl) subtitleEl.innerText = `Клан ${leader.clan || clanKey} | Клас: ${leader.currentClass || "Багатур"} (Ниво ${leader.level || 1})`;
    if (pointsEl) pointsEl.innerText = leader.skillPoints || 0;

    // 2. Екипировка
    const equipGrid = document.getElementById('rpg-equipment-grid');
    if (equipGrid) {
        equipGrid.innerHTML = "";
        const slotLabels = ["Шлем", "Нагръдник", "Оръжие", "Щит", "Ръкавици", "Ботуши", "Амулет", "Пръстен 1", "Пръстен 2"];
        for (let i = 0; i < 9; i++) {
            const item = leader.equipment[i];
            const box = document.createElement('div');
            box.className = "rpg-equip-box";
            box.style.cssText = "width:75px; height:75px; background:rgba(0,0,0,0.5); border:1px solid #d4af37; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; font-size:11px; color:#fff;";
            box.onclick = () => alert(`Оръжейна стая: Преместете предмет от съкровищницата в слот за ${slotLabels[i]}.`);
            box.innerHTML = item ? `<div>${item.icon}</div><span style="font-size:8px;">${item.name.substring(0,6)}..</span>` : `<span style="opacity:0.25; font-size:20px;">🛡️</span><span style="font-size:9px; color:#aaa;">${slotLabels[i]}</span>`;
            equipGrid.appendChild(box);
        }
    }

    // 3. Любимец
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

    // 4. Умения
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
                xpBarBtn.innerHTML = `<div> Събран ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b> (Недостига опит)</div>`;
            }
            skillsContainer.appendChild(xpBarBtn);
        }

        Object.entries(window.rpgDatabase.skillTrees).forEach(([skillKey, skillData]) => {
            const lvl = leader.skills[skillKey] || 0;
            const node = document.createElement('div');
            node.style.cssText = "background:rgba(20,20,20,0.8); border:1px solid #333; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; color:#fff;";

            let buyButton = "";
            if (!leader.isAuto && leader.skillPoints > 0) {
                buyButton = `<button onclick="window.buySkillManual('${clanKey}', '${skillKey}')" style="background:#00ffcc; color:#000; border:none; padding:4px 8px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;">[+] Вдигни</button>`;
            }

            node.innerHTML = `
                <div style="text-align:left;">
                    <b style="color:#ffd700; font-size:12px;">${skillData.name} (Ниво ${lvl})</b>
                    <div style="font-size:11px; color:#aaa; margin-top:2px;">${skillData.desc}</div>
                </div>
                <div>${buyButton}</div>
            `;
            skillsContainer.appendChild(node);
        });
    }
    modalEl.style.display = "block";
};

// ==================== ИЗЧИСЛЯВАНЕ НА СЕТ БОНУСИ ОТ АРТЕФАКТИ ====================
window.calculateArtifactSetBonuses = function(hero) {
    if (!hero || !hero.inventory) return {};
    
    const setsCollected = {};
    let totalSetBonus = { heroPower: 0, goldBonus: 0, defense: 0, armyBonus: 0, diplomacyBonus: 0, mysticismBonus: 0 };
    
    for (let item of hero.inventory) {
        if (item && item.set && window.historicalArtifacts && window.historicalArtifacts[item.id]) {
            const artifact = window.historicalArtifacts[item.id];
            if (!setsCollected[artifact.set]) setsCollected[artifact.set] = [];
            if (!setsCollected[artifact.set].includes(artifact.id)) {
                setsCollected[artifact.set].push(artifact.id);
            }
        }
    }
    
    for (let setKey in setsCollected) {
        if (window.artifactSetBonuses && window.artifactSetBonuses[setKey]) {
            const setInfo = window.artifactSetBonuses[setKey];
            if (setsCollected[setKey].length >= setInfo.pieces) {
                console.log(`✨ Активиран сет: ${setInfo.name}`);
                for (let bonus in setInfo.bonus) {
                    totalSetBonus[bonus] = (totalSetBonus[bonus] || 0) + setInfo.bonus[bonus];
                }
            }
        }
    }
    
    return totalSetBonus;
};

// Преизчисляване на силата на героя с артефакти и сетове
window.recalculateHeroPower = function(hero) {
    if (!hero) return;
    
    let basePower = hero.baseHeroPower || hero.heroPower || 100;
    let artifactBonus = 0;
    let setBonus = 0;
    
    if (hero.inventory) {
        for (let item of hero.inventory) {
            if (item && item.bonus && item.bonus.heroPower) {
                artifactBonus += item.bonus.heroPower;
            }
        }
    }
    
    const setBonuses = window.calculateArtifactSetBonuses(hero);
    setBonus = setBonuses.heroPower || 0;
    
    hero.heroPower = basePower + artifactBonus + setBonus;
    
    if (window.showAdvisorMsg && (artifactBonus > 0 || setBonus > 0)) {
        console.log(`📊 Сила на ${hero.name}: базова ${basePower} + артефакти ${artifactBonus} + сет ${setBonus} = ${hero.heroPower}`);
    }
    
    return hero.heroPower;
};
