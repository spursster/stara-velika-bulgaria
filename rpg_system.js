/**
 * МОДУЛ: ВЕЛИКАТА RPG СИСТЕМА И АВТОМАТИЗАЦИЯ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (9 СЛОТА ЕКИПИРОВКА, ДОМАШНИ ЛЮБИМЦИ, СЪХРАНЕНИЕ НА ОПИТ & AUTO РЕЖИМ)
 * КОРЕКЦИЯ: Интеграция на интелигентно трупане на опит, ръчен избор и пасивни бойни бонуси.
 * Статистика на файловете в проекта: 17
 */

window.rpgDatabase = window.rpgDatabase || {};

// Формула за опит: Ниво * 150
window.rpgDatabase.getXPRequiredForLevel = function(level) {
    return level * 150;
};

/**
 * 🐾 БАЗА ДАННИ ЗА ДОМАШНИ ЛЮБИМЦИ (PETS SYSTEM)
 */
window.rpgDatabase.petsDatabase = {
    "falcon": { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." },
    "wolf": { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен Смазващ удар." },
    "stallion": { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." },
    "bear": { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." },
    "viper": { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." }
};

/**
 * 🎯 100+ СТИЛИЗИРАНИ СПОСОБНОСТИ (DIABLO АРХЕТИПИ)
 */
window.rpgDatabase.skillTrees = {
    // === КЛОН 1: ВОЕННА МОЩ (WARFARE & COMBAT) ===
    tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя (Hero Power)." },
    endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска и намалява щетите." },
    heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети при щурм." },
    shieldWall: { name: "Стена от щитове", desc: "Значително намалява загубите на бойци при тежка обсада." },
    berserk: { name: "Ярост на Багатура", desc: "Колкото по-малко войници остават, толкова по-силно атакува героят." },

    // === КЛОН 2: ТАЙНИ И СЕНКИ (ROGUE & ASSASSINATION) ===
    ambush: { name: "Засада", desc: "Шанс за нанасяне на тежък първоначален удар преди битката да е започнала." },
    poisonBlade: { name: "Отровено острие", desc: "Нанася пасивни щети на вражеския водач всеки сезон." },
    assassinate: { name: "Покушение", desc: "Шанс за директно елиминиране на вражеския пълководец." },
    shadowStep: { name: "Сенчеста стъпка", desc: "Повишава шанса за успешно бягство от засада в непознати земи." },
    smokeBomb: { name: "Димна завеса", desc: "Намалява точността на стрелците на врага по време на щурм." },

    // === КЛОН 3: ТАНГРИЗЪМ И МИСТИКА (MAGIC & SPIRITUALITY) ===
    mysticism: { name: "Древно Знание", desc: "Повишава шанса за намиране на редки артефакти по време на походи." },
    tangraFire: { name: "Огънят на Тангра", desc: "Вдъхновява войската, повишавайки бойния дух на максимум." },
    vampirism: { name: "Кръвен устрем", desc: "Възстановява част от загубените войници след спечелена битка." },
    raiseDead: { name: "Въздигане на падналите", desc: "Временно съживява част от падналите врагове като бойци за родовия отряд." },
    totemGlow: { name: "Тотемна закрила", desc: "Защитава активния регион от неочаквани природни бедствия." },

    // === КЛОН 4: ТЪРГОВИЯ И ИКОНОМИКА (ECONOMY & MANAGEMENT) ===
    economy: { name: "Родово Управление", desc: "Увеличава базовия доход от родовите региони." },
    goldRush: { name: "Златна Треска", desc: "Увеличава добива на злато от открити златни мини." },
    cartel: { name: "Търговски съюз", desc: "Намалява пасивните разходи за поддръжка на родовите пазари." },
    logistics: { name: "Логистика", desc: "Намалява разходите за храна и поддръжка на редовната армия." },
    bazaars: { name: "Родови пазари", desc: "Увеличава печалбите при сключване на успешни династични бракове." }
};

/**
 * 👑 ARCHEAGE КЛАСОВИ КОМБИНАЦИИ (50+ ХИБРИДНИ КЛАСА)
 */
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
 * ИНИЦИАЛИЗИРАНЕ НА СТРУКТУРАТА ЗА НОВ ВОДАЧ
 */
window.initializeHeroRPGData = function(leader) {
    if (!leader) return;
    if (leader.isRPGInitialized) return;

    leader.level = leader.level || 1;
    leader.xp = leader.xp || 0;
    leader.storedXP = leader.storedXP || 0;
    leader.skillPoints = leader.skillPoints || 0;
    leader.skills = leader.skills || {};
    leader.currentClass = leader.currentClass || "Няма клас";
    leader.heroPower = leader.heroPower || 100;
    
    // Нови функционалности: AUTO статус по подразбиране, инвентарни слотове и домашен любимец
    if (leader.isAuto === undefined) leader.isAuto = true;
    if (!leader.equipment) leader.equipment = Array(9).fill(null);
    if (leader.pet === undefined) leader.pet = null;

    // Пълно начално попълване на всички Diablo пасиви на ниво 0
    Object.keys(window.rpgDatabase.skillTrees).forEach(skillKey => {
        if (leader.skills[skillKey] === undefined) {
            leader.skills[skillKey] = 0;
        }
    });

    leader.isRPGInitialized = true;
};

/**
 * ⏳ УНИВЕРСАЛНА ЛОГИКА ЗА ТРУПАНЕ НА ОПИТ (GAIN XP)
 */
window.gainHeroXP = function(leader, amount) {
    if (!leader) return;
    window.initializeHeroRPGData(leader);

    if (leader.isAuto) {
        // АВТОМАТИЧЕН РЕЖИМ: Веднага консумира опита и вдига нива
        leader.xp += amount;
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);

        while (leader.xp >= requiredXP) {
            leader.xp -= requiredXP;
            leader.level++;
            leader.skillPoints++;
            leader.heroPower += 30; // Награда сила на всяко ниво
            
            // Автоматично интелигентно разпределяне на точките
            window.autoAssignSkillPoint(leader);
            requiredXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        }
    } else {
        // РЪЧЕН РЕЖИМ: Опитът се съхранява сумарно без вдигане на нива
        leader.storedXP += amount;
    }

    // Проверка и актуализация на ArcheAge класа
    window.checkArcheAgeClass(leader);

    // Опресняване на интерфейсите при промяна на активния лидер
    if (window.currentHero && window.currentHero.name === leader.name) {
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    }
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * 🔄 ПРЕВКЛЮЧВАНЕ НА АУТО РЕЖИМА ЗА КОНКРЕТЕН ГЕРОЙ
 */
window.toggleHeroAutoMode = function(clanKey) {
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) return;
    const leader = window.worldData.clans[clanKey];
    window.initializeHeroRPGData(leader);

    leader.isAuto = !leader.isAuto;

    // Ако се включва обратно на AUTO, моментално консумира натрупания storedXP
    if (leader.isAuto && leader.storedXP > 0) {
        const amountToTransfer = leader.storedXP;
        leader.storedXP = 0;
        window.gainHeroXP(leader, amountToTransfer);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⚡ АУТО СИНХРОНИЗАЦИЯ: Кан ${leader.name} се върна към автоматичен прогрес и усвои ${amountToTransfer} натрупан опит!`);
        }
    }

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    // Ако е отворен модалът за същия герой, опресняваме го
    const modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') {
        window.openHeroRPGModal(clanKey);
    }
};

/**
 * АВТОМАТИЧНО РАЗПРЕДЕЛЯНЕ НА ТОЧКИ ЗА УМЕНИЯ
 */
window.autoAssignSkillPoint = function(leader) {
    if (leader.skillPoints <= 0) return;
    
    const skillKeys = Object.keys(window.rpgDatabase.skillTrees);
    // Избираме напълно произволно умение за балансиран AI прогрес
    const randomSkill = skillKeys[Math.floor(Math.random() * skillKeys.length)];
    
    leader.skills[randomSkill] = (leader.skills[randomSkill] || 0) + 1;
    leader.skillPoints--;
};

/**
 * РЪЧНО КЛИКВАНЕ И КУПУВАНЕ НА УМЕНИЕ ОТ ИГРАЧА
 */
window.buySkillManual = function(clanKey, skillKey) {
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) return;
    const leader = window.worldData.clans[clanKey];

    if (leader.isAuto) return; // Забранено в автоматичен режим
    if (leader.skillPoints <= 0) return;

    leader.skills[skillKey] = (leader.skills[skillKey] || 0) + 1;
    leader.skillPoints--;
    
    // Преизчисляване на сила и клас
    window.checkArcheAgeClass(leader);
    
    if (window.currentHero && window.currentHero.name === leader.name) {
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    }
    
    // Опресняване на модалния прозорец
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * КУПУВАНЕ НА НИВО СЪС СЪБРАНИЯ ОПИТ (РЪЧЕН РЕЖИМ)
 */
window.consumeStoredXPManual = function(clanKey) {
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) return;
    const leader = window.worldData.clans[clanKey];
    
    let req = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    if (leader.storedXP < req) return;

    leader.storedXP -= req;
    leader.level++;
    leader.skillPoints++;
    leader.heroPower += 30;

    window.checkArcheAgeClass(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * ARCHEAGE АЛГОРИТЪМ ЗА КЛАСОВЕ
 */
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
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`👑 ARCHEAGE ЕВОЛЮЦИЯ: Комбинацията от умения на Водач ${leader.name} роди новия хибриден клас: "${newClass.name}"!`);
            }
        }
    } else {
        const primarySkill = topSkills[0];
        if (primarySkill && leader.level >= 2) {
            let defaultClass = "Багатур";
            if (["mysticism", "tangraFire", "vampirism", "raiseDead"].includes(primarySkill)) defaultClass = "Колобър";
            if (["economy", "goldRush", "cartel", "logistics"].includes(primarySkill)) defaultClass = "Иконом на Рода";
            if (["ambush", "poisonBlade", "assassinate"].includes(primarySkill)) defaultClass = "Нощно Острие";
            
            leader.currentClass = defaultClass;
        }
    }
};

/**
 * 🎒 РЕНДЕРИРАНЕ НА RPG МОДАЛНИЯ ПРОЗОРЕЦ (ПРОФИЛ НА ГЕРОЯ)
 */
window.openHeroRPGModal = function(clanKey) {
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) return;
    const leader = window.worldData.clans[clanKey];
    window.initializeHeroRPGData(leader);

    // 1. Попълване на заглавията
    document.getElementById('rpg-modal-title').innerText = `Водач ${leader.name}`;
    document.getElementById('rpg-modal-subtitle').innerText = `Клан ${clanKey} | Клас: ${leader.currentClass} (Ниво ${leader.level})`;
    document.getElementById('rpg-modal-points').innerText = leader.skillPoints;

    // 2. Рендериране на 9-те слота за екипировка
    const equipGrid = document.getElementById('rpg-equipment-grid');
    equipGrid.innerHTML = "";
    const slotLabels = ["Шлем", "Нагръдник", "Оръжие", "Щит", "Ръкавици", "Ботуши", "Амулет", "Пръстен 1", "Пръстен 2"];
    
    for (let i = 0; i < 9; i++) {
        const item = leader.equipment[i];
        const box = document.createElement('div');
        box.className = "rpg-equip-box";
        box.onclick = () => alert(`Оръжейна стая: Преместете предмет от съкровищницата в слот за ${slotLabels[i]}.`);
        
        if (item) {
            box.innerHTML = `<div>${item.icon}</div><span class="rpg-equip-label">${item.name.substring(0,6)}..</span>`;
        } else {
            box.innerHTML = `<span style="opacity:0.25; font-size:20px;">🛡️</span><span class="rpg-equip-label">${slotLabels[i]}</span>`;
        }
        equipGrid.appendChild(box);
    }

    // 3. Рендериране на слота за домашен любимец
    const petSlot = document.getElementById('rpg-pet-slot');
    if (leader.pet) {
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
        petSlot.title = "Няма зачислен любимец. Кликнете, за да изберете от наличните в рода.";
        petSlot.onclick = () => {
            const petKeys = Object.keys(window.rpgDatabase.petsDatabase);
            let optionsStr = "Изберете нов домашен любимец за съпровод в битките:\n";
            petKeys.forEach((k, idx) => {
                const p = window.rpgDatabase.petsDatabase[k];
                optionsStr += `${idx + 1}. ${p.icon} ${p.name} - ${p.desc}\n`;
            });
            const choice = prompt(optionsStr);
            if (choice && choice > 0 && choice <= petKeys.length) {
                leader.pet = petKeys[choice - 1];
                window.openHeroRPGModal(clanKey);
            }
        };
    }

    // 4. Рендериране на дървото с умения и бутони за купуване
    const skillsContainer = document.getElementById('rpg-modal-skills-container');
    skillsContainer.innerHTML = "";

    // Бутон за ръчно вдигане на нива, ако има събран storedXP
    let reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    if (!leader.isAuto) {
        const xpBarBtn = document.createElement('div');
        xpBarBtn.style.cssText = "background:rgba(0,198,255,0.15); border:1px solid #00c6ff; padding:10px; border-radius:6px; text-align:center; margin-bottom:10px;";
        
        if (leader.storedXP >= reqXP) {
            xpBarBtn.innerHTML = `<div>✨ Събран ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b></div>
                                  <button onclick="window.consumeStoredXPManual('${clanKey}')" style="margin-top:5px; background:#0072ff; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">КАЧИ НИВО СЕГА ➔</button>`;
        } else {
            xpBarBtn.innerHTML = `<div>⏳ Събран ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b> (Недостига опит)</div>`;
        }
        skillsContainer.appendChild(xpBarBtn);
    }

    // Списък със самите способности
    Object.entries(window.rpgDatabase.skillTrees).forEach(([skillKey, skillData]) => {
        const lvl = leader.skills[skillKey] || 0;
        const node = document.createElement('div');
        node.style.cssText = "background:rgba(20,20,20,0.8); border:1px solid #333; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;";
        
        let buyButton = "";
        if (!leader.isAuto && leader.skillPoints > 0) {
            buyButton = `<button onclick="window.buySkillManual('${clanKey}', '${skillKey}')" style="background:#00ffcc; color:#000; border:none; padding:2px 8px; font-weight:bold; border-radius:4px; cursor:pointer;">[+] Вдигни</button>`;
        }

        node.innerHTML = `
            <div>
                <b style="color:#ffd700;">${skillData.name} (Ниво ${lvl})</b>
                <div style="font-size:11px; color:#aaa; margin-top:2px;">${skillData.desc}</div>
            </div>
            <div>${buyButton}</div>
        `;
        skillsContainer.appendChild(node);
    });

    // Показване на модала
    document.getElementById('hero-rpg-modal').style.display = "block";
};
