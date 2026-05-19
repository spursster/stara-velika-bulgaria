/**
==========================================================================
МОДУЛ: RPG СИСТЕМА & ОПИТ (XP) - Велика България
СТАТУС: УНИВЕРСАЛЕН, БЕЗ ДУБЛИРАНЕ, СИНХРОНИЗИРАН
КОРЕКЦИЯ: Фиксирани нива, XP ленти, storedXP логика и clan/dynasty унификация.
==========================================================================
*/

window.rpgDatabase = window.rpgDatabase || {};

/**
📐 ФОРМУЛА ЗА ИЗЧИСЛЕНИЕ НА ИЗВАДАНИЯ ОПИТ
✅ Защита: Връща минимум 100, за да няма деление на нула или NaN в UI.
*/
window.rpgDatabase.getXPRequiredForLevel = function(level) {
    const base = (level || 1) * 150;
    return Math.max(100, Math.floor(base));
};

/**
🐾 БАЗА ДАННИ ЗА ДОМАШНИ ЛЮБИМЦИ (PETS SYSTEM)
✅ ИЗЧИСТЕНИ ВСИЧКИ ИНТЕРВАЛИ В КЛЮЧОВЕТЕ
*/
window.rpgDatabase.petsDatabase = {
    "falcon": { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." },
    "wolf": { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен Смазващ удар." },
    "stallion": { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." },
    "bear": { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." },
    "viper": { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." }
};

/**
🎯 СКИЛ ДЪРВЕТА И КЛАСОВИ РЕЦЕПТИ
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
🛡️ УНИВЕРСАЛНА ИНИЦИАЛИЗАЦИЯ НА ГЕРОЙ (ОТКРИТИЕ: СИНГЪЛТОЧЕН ИЗТОЧНИК)
✅ ПРЕМАХНАТО ДУБЛИРАНЕТО ОТ mechanics.js
✅ ЗАПАЗВА storedXP, isAuto, equipment БЕЗ ЗАГУБИ
*/
window.initializeHeroRPGData = function(leader) {
    if (!leader || leader.isRPGInitialized) return;

    leader.level = leader.level || 1;
    leader.xp = leader.xp || 0;
    leader.storedXP = leader.storedXP || 0;
    leader.skillPoints = leader.skillPoints || 0;
    leader.skills = leader.skills || {};
    leader.currentClass = leader.currentClass || "Багатур";
    leader.heroPower = leader.heroPower || 150;
    leader.isAuto = (leader.isAuto !== undefined) ? leader.isAuto : true;
    leader.equipment = Array.isArray(leader.equipment) ? leader.equipment : Array(9).fill(null);
    leader.pet = leader.pet || null;
    
    // Попълване на липсващи скиллове с 0
    if (window.rpgDatabase && window.rpgDatabase.skillTrees) {
        Object.keys(window.rpgDatabase.skillTrees).forEach(key => {
            if (leader.skills[key] === undefined) leader.skills[key] = 0;
        });
    }
    
    leader.isRPGInitialized = true;
};

/**
⏳ ГЛАВНА ЛОГИКА ЗА ТРУПАНЕ НА ОПИТ И ВДИГАНЕ НА НИВО
✅ ФИКС: Коректно прехвърляне между xp/storedXP, ресване на остатъка, защита срещу безкраен цикъл
*/
window.gainHeroXP = function(leader, amount) {
    if (!leader || amount <= 0) return;
    window.initializeHeroRPGData(leader);
    
    let gained = amount;
    let safetyLimit = 10; // Защита срещу безкраен while цикъл при бъг
    
    while (gained > 0 && safetyLimit-- > 0) {
        let reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        let currentPool = leader.isAuto ? leader.xp : leader.storedXP;
        
        if (currentPool >= reqXP) {
            // LEVEL UP
            let usedXP = reqXP;
            leader[leader.isAuto ? 'xp' : 'storedXP'] -= usedXP;
            
            leader.level++;
            leader.skillPoints++;
            leader.heroPower += 30;
            
            // Авто-разпределение само ако е в Auto режим
            if (leader.isAuto) {
                window.autoAssignSkillPoint(leader);
            }
            
            // Проверка за класова еволюция
            if (window.rpgDatabase && window.rpgDatabase.classRecipes) {
                window.checkArcheAgeClass(leader);
            }
        } else {
            // Няма достатъчно опит за още ниво -> излизаме от цикъла
            leader[leader.isAuto ? 'xp' : 'storedXP'] += gained;
            gained = 0;
        }
    }
    
    // Синхронизация с UI и глобални масиви
    if (window.updateCharacterUI && window.currentHero && window.currentHero.name === leader.name) {
        window.updateCharacterUI(window.currentHero);
    }
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
🔄 ПРЕВКЛЮЧВАНЕ НА AUTO РЕЖИМ
✅ ФИКС: Безопасно прехвърляне на storedXP -> xp при смяна на режима
*/
window.toggleHeroAutoMode = function(clanKey) {
    let leader = null;
    
    // Търсене в worldData.clans
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        leader = window.worldData.clans[clanKey];
    } 
    // Резервно търсене в unlockedLeaders
    else if (window.unlockedLeaders) {
        leader = window.unlockedLeaders.find(h => h.clan === clanKey || h.name === clanKey);
    }
    
    if (!leader) return;
    
    window.initializeHeroRPGData(leader);
    leader.isAuto = !leader.isAuto;
    
    // При превключване към Auto, целият storedXP се прехвърля в xp
    if (leader.isAuto && leader.storedXP > 0) {
        leader.xp = (leader.xp || 0) + leader.storedXP;
        leader.storedXP = 0;
        // Веднага проверяваме за level up
        window.gainHeroXP(leader, 0);
    }
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    // Ако модалът е отворен, обновяваме го
    const modal = document.getElementById('hero-rpg-modal');
    if (modal && modal.style.display === 'block') {
        window.openHeroRPGModal(clanKey);
    }
};

window.autoAssignSkillPoint = function(leader) {
    if (!leader || leader.skillPoints <= 0) return;
    const keys = Object.keys(window.rpgDatabase.skillTrees);
    const randomSkill = keys[Math.floor(Math.random() * keys.length)];
    leader.skills[randomSkill] = (leader.skills[randomSkill] || 0) + 1;
    leader.skillPoints--;
};

window.buySkillManual = function(clanKey, skillKey) {
    let leader = window.worldData?.clans?.[clanKey] || 
                 window.unlockedLeaders?.find(h => h.clan === clanKey || h.name === clanKey);
    if (!leader || leader.isAuto || leader.skillPoints <= 0) return;
    
    leader.skills[skillKey] = (leader.skills[skillKey] || 0) + 1;
    leader.skillPoints--;
    window.checkArcheAgeClass(leader);
    
    if (window.updateCharacterUI && window.currentHero?.name === leader.name) window.updateCharacterUI(window.currentHero);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

window.consumeStoredXPManual = function(clanKey) {
    let leader = window.worldData?.clans?.[clanKey] || 
                 window.unlockedLeaders?.find(h => h.clan === clanKey || h.name === clanKey);
    if (!leader) return;
    
    let req = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    if ((leader.storedXP || 0) < req) return;
    
    leader.storedXP -= req;
    leader.level++;
    leader.skillPoints++;
    leader.heroPower += 30;
    
    window.checkArcheAgeClass(leader);
    window.openHeroRPGModal(clanKey);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

window.checkArcheAgeClass = function(leader) {
    if (!leader || !window.rpgDatabase?.classRecipes) return;
    let pairs = Object.entries(leader.skills || {}).filter(([k,v]) => v > 0);
    pairs.sort((a,b) => b[1] - a[1]);
    let top = pairs.map(p => p[0]);
    
    let matches = window.rpgDatabase.classRecipes.filter(r => {
        if (leader.level < r.reqLevel) return false;
        return r.reqTrees.every(t => top.includes(t));
    });
    
    if (matches.length > 0) {
        matches.sort((a,b) => b.reqLevel - a.reqLevel);
        let newClass = matches[0].name;
        if (leader.currentClass !== newClass) {
            leader.currentClass = newClass;
            if (window.showAdvisorMsg) window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: ${leader.name} се издигна до клас "${newClass}"!`);
        }
    }
};

/**
🎒 РЕНДЕРИРАНЕ НА RPG МОДАЛА
✅ ПОПРАВЕНИ СЧУПЕНИ TEMPLATE LITERALS И ТУРБО ИДЕНТИФИКАЦИЯ
*/
window.openHeroRPGModal = function(clanKey) {
    const modal = document.getElementById('hero-rpg-modal');
    if (!modal) return;
    
    let leader = window.worldData?.clans?.[clanKey] || 
                 window.unlockedLeaders?.find(h => h.clan === clanKey || h.name === clanKey) ||
                 window.currentHero;
    if (!leader) return;
    
    window.initializeHeroRPGData(leader);
    
    document.getElementById('rpg-modal-title').innerText = `Водач ${leader.name || "Пълководец"}`;
    document.getElementById('rpg-modal-subtitle').innerText = `Клан ${leader.clan || clanKey} | Клас: ${leader.currentClass || "Багатур"} (Ниво ${leader.level || 1})`;
    document.getElementById('rpg-modal-points').innerText = leader.skillPoints || 0;
    
    const grid = document.getElementById('rpg-equipment-grid');
    if (grid) {
        grid.innerHTML = "";
        const slots = ["Шлем","Нагръдник","Оръжие","Щит","Ръкавици","Ботуши","Амулет","Пръстен 1","Пръстен 2"];
        for(let i=0; i<9; i++) {
            const item = leader.equipment[i];
            const box = document.createElement('div');
            box.className = "rpg-equip-box";
            box.style.cssText = "width:75px;height:75px;background:rgba(0,0,0,0.5);border:1px solid #d4af37;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:11px;color:#fff;";
            box.onclick = () => alert(`Оръжейна стая: Преместете предмет от съкровищницата в слот за ${slots[i]}.`);
            box.innerHTML = item ? `<div>${item.icon}</div><span style="font-size:8px;">${item.name.substring(0,6)}..</span>` : `<span style="opacity:0.25;font-size:20px;">🛡️</span><span style="font-size:9px;color:#aaa;">${slots[i]}</span>`;
            grid.appendChild(box);
        }
    }
    
    const petSlot = document.getElementById('rpg-pet-slot');
    if (petSlot) {
        if (leader.pet && window.rpgDatabase.petsDatabase[leader.pet]) {
            const p = window.rpgDatabase.petsDatabase[leader.pet];
            petSlot.innerHTML = `<div style="font-size:32px;">${p.icon}</div><span style="font-size:8px;color:#ffd700;font-weight:bold;">${p.name}</span>`;
            petSlot.title = p.desc;
            petSlot.onclick = () => { if(confirm(`Освободи ${p.name}?`)) { leader.pet = null; window.openHeroRPGModal(clanKey); }};
        } else {
            petSlot.innerHTML = `<span style="font-size:24px;opacity:0.3;">🐾</span><span style="font-size:8px;color:#666;">ПРАЗЕН</span>`;
            petSlot.title = "Няма зачислен любимец. Кликнете, за да изберете.";
            petSlot.onclick = () => {
                const keys = Object.keys(window.rpgDatabase.petsDatabase);
                let opts = "Изберете домашен любимец:\n";
                keys.forEach((k,i) => { let p = window.rpgDatabase.petsDatabase[k]; opts += `${i+1}. ${p.icon} ${p.name}\n`; });
                let c = prompt(opts);
                if(c && c > 0 && c <= keys.length) { leader.pet = keys[c-1]; window.openHeroRPGModal(clanKey); }
            };
        }
    }
    
    const skillsCont = document.getElementById('rpg-modal-skills-container');
    if (skillsCont) {
        skillsCont.innerHTML = "";
        let reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
        
        if (!leader.isAuto) {
            const btn = document.createElement('div');
            btn.style.cssText = "background:rgba(0,198,255,0.15);border:1px solid #00c6ff;padding:10px;border-radius:6px;text-align:center;margin-bottom:10px;color:#fff;font-size:12px;";
            btn.innerHTML = (leader.storedXP >= reqXP) 
                ? `<div>✨ Ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b></div><button onclick="window.consumeStoredXPManual('${clanKey}')" style="margin-top:5px;background:#0072ff;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-weight:bold;">КАЧИ НИВО ➔</button>`
                : `<div>⏳ Ръчен опит: <b>${leader.storedXP} / ${reqXP} XP</b> (Недостига)</div>`;
            skillsCont.appendChild(btn);
        }
        
        Object.entries(window.rpgDatabase.skillTrees).forEach(([key, data]) => {
            const lvl = leader.skills[key] || 0;
            const node = document.createElement('div');
            node.style.cssText = "background:rgba(20,20,20,0.8);border:1px solid #333;padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;color:#fff;";
            let buyBtn = (!leader.isAuto && leader.skillPoints > 0) ? `<button onclick="window.buySkillManual('${clanKey}','${key}')" style="background:#00ffcc;color:#000;border:none;padding:4px 8px;font-weight:bold;border-radius:4px;cursor:pointer;font-size:11px;">[+] Вдигни</button>` : "";
            node.innerHTML = `<div style="text-align:left;"><b style="color:#ffd700;font-size:12px;">${data.name} (Ниво ${lvl})</b><div style="font-size:11px;color:#aaa;margin-top:2px;">${data.desc}</div></div><div>${buyBtn}</div>`;
            skillsCont.appendChild(node);
        });
    }
    
    modal.style.display = "block";
};
