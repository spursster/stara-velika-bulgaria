/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ, ЛЕНТА НА ЕЛИТА)
ВЕРСИЯ: 3.0 - СЪВМЕСТИМ С НОВИТЕ КЛАСОВЕ И УМЕНИЯ (classes.js, skills.js)
========================================================================== */ 

window.eventHistory = []; 
if (!window.autoLevelState) { window.autoLevelState = {}; }

// ==================== ПРЕВКЛЮЧВАНЕ НА ЦЯЛ ЕКРАН ====================
window.toggleGameFullScreen = function() { 
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { 
        const docEl = document.documentElement; 
        if (docEl.requestFullscreen) { docEl.requestFullscreen(); } 
        else if (docEl.mozRequestFullScreen) { docEl.mozRequestFullScreen(); } 
        else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); } 
        else if (docEl.msRequestFullscreen) { docEl.msRequestFullscreen(); } 
    } else { 
        if (document.exitFullscreen) { document.exitFullscreen(); } 
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); } 
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } 
        else if (document.msExitFullscreen) { document.msExitFullscreen(); } 
    } 
};

// ==================== ЛЮБИМИ (FAVORITES) ====================
let favoriteHeroes = new Set();
try {
    let saved = localStorage.getItem('favoriteHeroesFinal');
    if (saved) JSON.parse(saved).forEach(id => favoriteHeroes.add(id));
} catch(e) {}
function saveFavorites() { localStorage.setItem('favoriteHeroesFinal', JSON.stringify([...favoriteHeroes])); }
function isFavorite(id) { return favoriteHeroes.has(id); }
function toggleFavorite(id) {
    if (favoriteHeroes.has(id)) favoriteHeroes.delete(id);
    else favoriteHeroes.add(id);
    saveFavorites();
    renderSingleBar();
}

// ==================== AUTO СИСТЕМА ====================
let autoState = {};
try {
    let saved = localStorage.getItem('heroAutoState');
    if (saved) autoState = JSON.parse(saved);
} catch(e) {}
function saveAuto() { localStorage.setItem('heroAutoState', JSON.stringify(autoState)); }
function isAuto(id) { return autoState[id] === true; }
function setAuto(id, enabled) {
    if (enabled) autoState[id] = true;
    else delete autoState[id];
    saveAuto();
}

// ==================== НАЕМАНЕ НА ГЕРОИ (ОТ DATABASE.JS) ====================
function getAllHeroesFromDatabase() {
    let heroesList = [];
    let heroesSource = window.clansDatabase || window.clans;
    if (!heroesSource) return heroesList;
    for (let clanName in heroesSource) {
        let clanData = heroesSource[clanName];
        if (clanData.heroes && Array.isArray(clanData.heroes)) {
            clanData.heroes.forEach(heroName => {
                let power = 130;
                let cost = 800;
                let className = "Воевода";
                if (heroName.includes("Александър") || heroName.includes("Симеон") || heroName.includes("Кубрат") || heroName.includes("Влад")) {
                    power = 190; cost = 1500; className = "Легенда";
                } else if (heroName.includes("Атила") || heroName.includes("Филип") || heroName.includes("Самуил") || heroName.includes("Птолемей")) {
                    power = 165; cost = 1200; className = "Герой";
                } else if (heroName.includes("Аспарух") || heroName.includes("Тервел") || heroName.includes("Крум")) {
                    power = 140; cost = 1000; className = "Войн";
                }
                heroesList.push({ name: heroName, clan: clanName, power: power, cost: cost, className: className });
            });
        }
    }
    return heroesList;
}

window.hireNewHero = function() {
    if (!window.currentHero) { alert("Няма активен герой!"); return; }
    let allHeroes = getAllHeroesFromDatabase();
    if (allHeroes.length === 0) { alert("Няма налични герои за наемане!"); return; }
    let hiredNames = new Set();
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) hiredNames.add(clan.leaderName || clan.name || key);
        }
    }
    if (window.currentHero) hiredNames.add(window.currentHero.name);
    let available = allHeroes.filter(h => !hiredNames.has(h.name));
    if (available.length === 0) { alert("Всички герои вече са наети!"); return; }
    let randomHero = available[Math.floor(Math.random() * available.length)];
    if (window.currentHero.gold < randomHero.cost) {
        alert(`❌ Недостатъчно злато! Нужни: ${randomHero.cost}`);
        return;
    }
    let newId = "hero_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    let newHero = {
        name: randomHero.name, leaderName: randomHero.name, clan: randomHero.clan, isJoined: true,
        level: 1, xp: 0, heroPower: randomHero.power, power: randomHero.power, gold: 1500,
        armySize: 200, currentArmy: 200, currentClass: randomHero.className, className: randomHero.className,
        skills: { tactics:0, endurance:0, economy:0, mysticism:0, leadership:0 },
        skillPoints:0, storedXP:0, isAuto: true, equipment: Array(12).fill(null), inventory: Array(12).fill(null),
        pet: null, age: 30, learnedSkills: {} // за новите умения
    };
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(newHero);
    window.currentHero.gold -= randomHero.cost;
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newId] = newHero;
    if (!window.unlockedLeaders) window.unlockedLeaders = [];
    window.unlockedLeaders.push(newHero);
    let goldSpan = document.getElementById('val-gold');
    if (goldSpan) goldSpan.innerText = window.currentHero.gold;
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    alert(`✅ Нает: ${newHero.name} от род ${newHero.clan}\n💰 Останало злато: ${window.currentHero.gold}\n⚔️ Бойна сила: ${newHero.power}`);
    if (newHero.isAuto && typeof window.startAutoTimer === 'function') window.startAutoTimer(newId);
};

// ==================== ДАННИ ЗА ГЕРОИТЕ ====================
function getAllHeroes() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) {
                heroes.push({
                    id: key,
                    name: clan.leaderName || clan.name || key,
                    level: clan.level || 1,
                    className: clan.currentClass || "Воевода",
                    xp: clan.xp || 0,
                    power: clan.heroPower || 100,
                    gold: clan.gold || 1500,
                    army: clan.armySize || 300,
                    skills: clan.skills || {},
                    pet: clan.pet || null,
                    skillPoints: clan.skillPoints || 0,
                    equipment: clan.equipment || Array(12).fill(null)
                });
            }
        }
    }
    if (heroes.length === 0 && window.currentHero) {
        heroes.push({
            id: window.currentHero.clan || "hero",
            name: window.currentHero.name || "Воевода",
            level: window.currentHero.level || 1,
            className: window.currentHero.currentClass || "Багатур",
            xp: window.currentHero.xp || 0,
            power: window.currentHero.heroPower || 100,
            gold: window.currentHero.gold || 1500,
            army: window.currentHero.armySize || 500,
            skills: window.currentHero.skills || {},
            pet: window.currentHero.pet || null,
            skillPoints: window.currentHero.skillPoints || 0,
            equipment: window.currentHero.equipment || Array(12).fill(null)
        });
    }
    heroes.sort((a,b) => b.level - a.level);
    return heroes;
}

// ==================== СТАРИТЕ УМЕНИЯ (SKILLTREE) СА ПРЕМАХНАТИ – НОВИТЕ УМЕНИЯ СА В skills.js ====================

// ==================== ПРОФИЛ С 12 СЛОТА + АРТЕФАКТИ (БЕЗ СТАРИ УМЕНИЯ) ====================
function showHeroProfile(hero) {
    let needXP = 100 + (hero.level - 1) * 50;
    let xpPercent = Math.min(100, Math.floor((hero.xp / needXP) * 100));
    let autoOn = isAuto(hero.id);
    let slotNames = ["⚔️ ОРЪЖИЕ", "🛡️ ЩИТ", "🪖 ШЛЕМ", "🦺 НАГРЪДНИК", "🧤 РЪКАВИЦИ", "👖 КРАЧОЛИ", "👢 БОТУШИ", "💍 ПРЪСТЕН", "💍 ПРЪСТЕН 2", "📿 АМУЛЕТ", "🧣 НАМЕТАЛО", "🔱 РЕЛИКВИЯ"];
    
    let inventoryHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🎒 ИНВЕНТАР</h4><div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">';
    for (let i = 0; i < 12; i++) {
        let item = hero.equipment && hero.equipment[i] ? hero.equipment[i] : null;
        let slotName = slotNames[i];
        if (item) {
            inventoryHtml += `<div style="background:#2c1a0c; border-radius:8px; padding:8px; text-align:center; border:1px solid #c9a87b;"><div style="font-size:20px;">${item.icon || '🔮'}</div><div style="font-size:8px; color:#ffdd99;">${item.name || 'Артефакт'}</div><div style="font-size:7px; color:#aa8866;">${slotName}</div></div>`;
        } else {
            inventoryHtml += `<div style="background:#1a1a2e; border-radius:8px; padding:8px; text-align:center; border:1px dashed #555;"><div style="font-size:16px; opacity:0.4;">❓</div><div style="font-size:7px; color:#555;">${slotName}</div></div>`;
        }
    }
    inventoryHtml += '</div></div>';
    
    let artifactsHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🏺 СЪБРАНИ АРТЕФАКТИ</h4><div style="display:flex; flex-wrap:wrap; gap:8px;">';
    if (hero.inventory && hero.inventory.length > 0) {
        hero.inventory.forEach(artifact => {
            if (artifact && artifact.id) {
                artifactsHtml += `<div style="background:#2c1a0c; border-radius:8px; padding:6px; text-align:center; min-width:60px; border:1px solid #c9a87b;" title="${artifact.name} (${artifact.era || 'Исторически'})">
                    <div style="font-size:20px;">${artifact.icon || '🏺'}</div>
                    <div style="font-size:7px; color:#ffdd99;">${artifact.name.length > 10 ? artifact.name.substring(0,8)+'..' : artifact.name}</div>
                </div>`;
            }
        });
    } else {
        artifactsHtml += '<div style="color:#aa8866; padding:8px;">Няма събрани артефакти</div>';
    }
    artifactsHtml += '</div></div>';
    
    let petHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🐾 ДОМАШЕН ЛЮБИМЕЦ</h4>';
    if (hero.pet && window.rpgDatabase?.petsDatabase?.[hero.pet]) {
        let pet = window.rpgDatabase.petsDatabase[hero.pet];
        petHtml += `<div style="display:flex; align-items:center; gap:12px;"><span style="font-size:32px;">${pet.icon}</span><div><div style="color:#ffaa66;">${pet.name}</div><div style="font-size:10px;">${pet.desc || 'Специален бонус'}</div></div></div>`;
    } else {
        petHtml += '<div style="color:#aa8866; text-align:center;">Няма любимец<br><button id="adopt-pet-btn" style="background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; padding:4px 12px; margin-top:8px; cursor:pointer;">➕ ОСИНОВИ</button></div>';
    }
    petHtml += '</div>';
    
    // Вместо старите умения – бутон към новата система
    let skillsHtml = `
        <div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;">
            <h4 style="color:#ffdd99; margin:0 0 10px 0;">⭐ НОВА СИСТЕМА ЗА УМЕНИЯ</h4>
            <p style="font-size:11px; color:#ccc;">Свободни точки: <strong style="color:#ffd700;">${hero.skillPoints}</strong></p>
            <button id="open-new-skills-btn" style="width:100%; background:#daa520; border:none; border-radius:30px; padding:6px; color:#000; font-weight:bold; cursor:pointer;">⭐ ОТВОРИ ДЪРВЕТАТА НА УМЕНИЯТА</button>
        </div>
    `;
    
    let autoBtnHtml = `<button id="auto-mode-btn" style="background:${autoOn ? '#4a6a2a' : '#2c1a0c'}; border:none; border-radius:20px; color:#ffdd99; padding:8px 16px; margin-top:10px; cursor:pointer; width:100%;">${autoOn ? '✅ AUTO РЕЖИМ: ВКЛЮЧЕН' : '🤖 AUTO РЕЖИМ: ИЗКЛЮЧЕН'}</button>`;
    
    let oldModal = document.getElementById('ultimate-profile-modal');
    if (oldModal) oldModal.remove();
    let modal = document.createElement('div');
    modal.id = 'ultimate-profile-modal';
    modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:100000; display:flex; justify-content:center; align-items:center; font-family:'Cinzel',serif;`;
    modal.innerHTML = `
        <div style="background:#1a1a2e; border-radius:24px; padding:20px; max-width:500px; width:90%; max-height:85vh; overflow-y:auto; border:2px solid #c9a87b;">
            <div style="text-align:center;">
                <div style="font-size:48px;">⚔️</div>
                <div style="font-size:22px; font-weight:bold; color:#ffdd99;">${hero.name}</div>
                <div style="color:#ccaa77;">${hero.currentClass} · Ниво ${hero.level}</div>
                <div style="background:#2a1a0a; height:8px; border-radius:4px; margin:10px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:4px;"></div></div>
                <div style="font-size:11px; color:#ffaa66;">⚡ ${Math.floor(hero.xp)}/${needXP} XP</div>
                <div style="margin-top:15px; display:flex; justify-content:space-between; gap:10px;">
                    <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>💰 Злато</div><div style="color:#ffdd99;">${hero.gold}</div></div>
                    <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>⚔️ Армия</div><div style="color:#ffdd99;">${hero.army}</div></div>
                    <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>💪 Сила</div><div style="color:#ffdd99;">${hero.power}</div></div>
                </div>
                ${inventoryHtml}
                ${artifactsHtml}
                ${petHtml}
                ${skillsHtml}
                ${autoBtnHtml}
                <button id="close-profile-modal" style="background:#2c1a0c; border:none; padding:8px 20px; border-radius:40px; color:#ffdd99; margin-top:15px; cursor:pointer; width:100%;">🔒 ЗАТВОРИ</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('#close-profile-modal').onclick = () => modal.remove();
    
    let autoBtnElem = modal.querySelector('#auto-mode-btn');
    if (autoBtnElem) {
        autoBtnElem.onclick = () => {
            let newState = !isAuto(hero.id);
            setAuto(hero.id, newState);
            if (window.worldData && window.worldData.clans && window.worldData.clans[hero.id]) window.worldData.clans[hero.id].isAuto = newState;
            if (window.currentHero && window.currentHero.id === hero.id) window.currentHero.isAuto = newState;
            hero.isAuto = newState;
            if (newState && typeof window.startAutoTimer === 'function') window.startAutoTimer(hero.id);
            else if (!newState && typeof window.stopAutoTimer === 'function') window.stopAutoTimer(hero.id);
            autoBtnElem.textContent = newState ? '✅ AUTO РЕЖИМ: ВКЛЮЧЕН' : '🤖 AUTO РЕЖИМ: ИЗКЛЮЧЕН';
            autoBtnElem.style.background = newState ? '#4a6a2a' : '#2c1a0c';
        };
    }
    
    let adoptBtn = modal.querySelector('#adopt-pet-btn');
    if (adoptBtn) {
        adoptBtn.onclick = () => {
            let pets = [{ id: "wolf", name: "Вълк", icon: "🐺", bonus: "+10% атака" }, { id: "bear", name: "Мечка", icon: "🐻", bonus: "+15% защита" }, { id: "falcon", name: "Сокол", icon: "🦅", bonus: "+5% прецизност" }, { id: "horse", name: "Кон", icon: "🐎", bonus: "+10% скорост" }];
            let randomPet = pets[Math.floor(Math.random() * pets.length)];
            hero.pet = randomPet.id;
            if (!window.rpgDatabase) window.rpgDatabase = {};
            if (!window.rpgDatabase.petsDatabase) window.rpgDatabase.petsDatabase = {};
            window.rpgDatabase.petsDatabase[randomPet.id] = { name: randomPet.name, icon: randomPet.icon, desc: randomPet.bonus };
            modal.remove(); showHeroProfile(hero);
        };
    }
    
    let openSkillsBtn = modal.querySelector('#open-new-skills-btn');
    if (openSkillsBtn) {
        openSkillsBtn.onclick = () => {
            modal.remove();
            if (typeof window.openSkillsUI === 'function') window.openSkillsUI();
            else alert("Интерфейсът за умения не е зареден (skills-ui.js).");
        };
    }
}

// ==================== ОРИГИНАЛНА ЛЕНТА НА ЕЛИТА ====================
window.renderTop6LeadersUI = function() { 
    const eliteBar = document.getElementById('top-elite-bar'); 
    if (!eliteBar) return; 
    if (!window.worldData || !window.worldData.clans) { 
        if (window.currentHero) { 
            window.worldData = window.worldData || {}; 
            window.worldData.clans = window.worldData.clans || {}; 
            window.worldData.clans[window.currentHero.clan] = window.currentHero; 
        } else { return; } 
    } 
    let leaders = Object.entries(window.worldData.clans).map(([clanKey, data]) => { return { clanKey: clanKey, ...data }; }); 
    leaders.sort((a, b) => { if ((b.level || 1) !== (a.level || 1)) { return (b.level || 1) - (a.level || 1); } return (b.xp || 0) - (a.xp || 0); }); 
    const top6 = leaders.slice(0, 6); 
    eliteBar.innerHTML = ""; 
    eliteBar.style.cssText = "display: flex; gap: 10px; overflow-x: auto; padding: 10px; background: rgba(0,0,0,0.4);"; 
    top6.forEach(leader => { 
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(leader); 
        const card = document.createElement('div'); 
        card.className = "elite-hero-card"; 
        card.style.cssText = "background: rgba(0,0,0,0.6); border-radius: 12px; padding: 6px 12px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b; flex-shrink: 0;";
        card.onclick = (e) => { if (e.target.classList.contains('auto-btn')) return; if (window.openHeroRPGModal) window.openHeroRPGModal(leader.clanKey); }; 
        let currentXP = leader.xp || 0; 
        let reqXP = 150; 
        if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) { reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level || 1); } 
        if (!leader.isAuto) { currentXP = leader.storedXP || 0; } 
        if (reqXP <= 0) reqXP = 1; 
        let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100)); 
        let petIcon = ""; 
        if (leader.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[leader.pet]) { petIcon = window.rpgDatabase.petsDatabase[leader.pet].icon; } 
        const autoClass = leader.isAuto ? "auto-btn active" : "auto-btn"; 
        const autoText = leader.isAuto ? "Auto" : "Manual"; 
        card.innerHTML = petIcon + '<div style="font-weight:bold;color:#ffdd99;">' + (leader.name || leader.hero || "Воевода") + '</div><div style="font-size:10px;color:#ccaa77;">Ниво ' + (leader.level || 1) + ' | ' + (leader.currentClass || "Багатур") + '</div><div style="background:#2a1a0a;height:3px;border-radius:2px;margin:4px 0;"><div style="background:#44aa44;height:100%;width:' + xpPercent + '%;border-radius:2px;"></div></div><button class="' + autoClass + '" style="background:#2c1a0c;border:none;font-size:9px;padding:2px 6px;border-radius:20px;color:#ffdd99;margin-top:4px;cursor:pointer;">' + autoText + '</button>'; 
        eliteBar.appendChild(card); 
    }); 
}; 

window.renderTop6HeroesUI = window.renderTop6LeadersUI; 

// ==================== ОСНОВНО ОБНОВЯВАНЕ НА ЛЕВИЯ ПАНЕЛ ====================
window.updateCharacterUI = function(hero) { 
    if (!hero) return; 
    window.currentHero = hero; 
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero); 
    const goldDisplay = document.getElementById('val-gold'); if (goldDisplay) goldDisplay.innerText = hero.gold || 0; 
    const armyDisplay = document.getElementById('val-army'); if (armyDisplay) armyDisplay.innerText = hero.armySize || 0; 
    const powerDisplay = document.getElementById('val-hero-power'); if (powerDisplay) powerDisplay.innerText = hero.heroPower || 100; 
    const profileBox = document.getElementById('active-character-profile'); 
    if (profileBox) { 
        let petStatus = "Няма"; 
        if (hero.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase[hero.pet]) { const p = window.rpgDatabase.petsDatabase[hero.pet]; petStatus = p.icon + " " + p.name; } 
        profileBox.innerHTML = '<div style="text-align:center;"><div style="font-weight:bold;font-size:1.2rem;">' + (hero.name || "Неизвестен") + '</div><div>Род ' + (hero.clan || "Свободен") + ' | Клас: ' + (hero.currentClass || "Багатур") + '</div><div>Ниво: ' + (hero.level || 1) + '</div><div>Възраст: ' + (hero.age || 50) + ' г.</div><div>Бойна Сила: ⚔️ ' + (hero.heroPower || 150) + '</div><div>Свободни точки: ' + (hero.skillPoints || 0) + '</div><div>Любимец: ' + petStatus + '</div></div>'; 
    } 
    if (profileBox && !document.getElementById('open-rpg-modal-btn')) { 
        const rpgBtn = document.createElement('button'); 
        rpgBtn.id = "open-rpg-modal-btn"; 
        rpgBtn.className = "menu-btn"; 
        rpgBtn.style.cssText = "width:100%; margin-top:10px; padding:8px; font-size:11px; font-family:'Cinzel';"; 
        rpgBtn.innerText = " Управление на Героя"; 
        rpgBtn.onclick = function() { if (window.openHeroRPGModal) window.openHeroRPGModal(window.currentHero.clan); }; 
        profileBox.appendChild(rpgBtn); 
    } 
    window.renderTop6LeadersUI(); 
}; 

// ==================== ЖУРНАЛ НА СЪВЕТНИКА ====================
window.showAdvisorMsg = function(msg) { 
    const journal = document.getElementById('advisor-journal'); 
    if (!journal) { console.log("Журнал съветник:", msg); return; } 
    window.eventHistory.push(msg); 
    if (window.eventHistory.length > 50) window.eventHistory.shift(); 
    journal.innerHTML = window.eventHistory.map(function(line) { return '<p style="margin:4px 0; border-left:2px solid #ffaa44; padding-left:8px;">📜 ' + line + '</p>'; }).reverse().join(''); 
}; 

// ==================== ИНСПЕКЦИЯ НА КЛАН (без старите skillTrees) ====================
window.inspectLeaderProfile = function(clanKey) { 
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) { alert("Грешка: Неуспешно извличане на данни за избрания род."); return; } 
    const leader = window.worldData.clans[clanKey]; 
    const oldProfile = document.getElementById('dynamic-leader-profile'); if (oldProfile) oldProfile.remove(); 
    let skillsHTML = "<h4>Придобити Способности (нови):</h4><ul>"; 
    let hasSkills = false; 
    if (leader.learnedSkills) { 
        for (let skillKey in leader.learnedSkills) { 
            let level = leader.learnedSkills[skillKey];
            if (level > 0) {
                // търсим името на умението от advancedSkills
                let skillName = skillKey;
                for (let treeKey in window.advancedSkills) {
                    if (window.advancedSkills[treeKey].skills[skillKey]) {
                        skillName = window.advancedSkills[treeKey].skills[skillKey].name;
                        break;
                    }
                }
                skillsHTML += "<li>• " + skillName + " (Ниво " + level + ")</li>"; 
                hasSkills = true;
            }
        }
    } 
    if (!hasSkills) skillsHTML += "<li>Все още няма научени нови умения.</li>"; 
    skillsHTML += "</ul>"; 
    
    let inventoryHTML = "<h4>Налична Екипировка:</h4><div>"; 
    let hasEquipment = false; 
    if (leader.equipment) { 
        for (let i = 0; i < leader.equipment.length; i++) { 
            let item = leader.equipment[i];
            if (item) { inventoryHTML += item.icon + " "; hasEquipment = true; } 
        } 
    } 
    if (!hasEquipment) inventoryHTML += "Няма екипирани предмети."; 
    inventoryHTML += "</div>"; 
    const overlay = document.createElement('div'); 
    overlay.id = "dynamic-leader-profile"; 
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000; padding: 10px; box-sizing: border-box;"; 
    overlay.innerHTML = '<div style="background: rgba(0,0,0,0.9); border-radius: 32px; padding: 20px; max-width: 400px; width: 100%; text-align: center; border: 1px solid #c9a87b;"><h3 style="color:#ffdd99;">' + (leader.name || leader.hero) + '</h3><p>⚔️ ' + (leader.heroPower || 100) + ' Сила</p><p>Род: ' + clanKey + '</p><p>Ниво: ' + (leader.level || 1) + '</p><p>Лично злато: ' + (leader.gold || 0) + '</p><p>Войска: ⚔️ ' + (leader.armySize || 0) + '</p><p>Клас: ' + (leader.currentClass || "Багатур") + '</p>' + skillsHTML + inventoryHTML + '<button id="close-profile-btn" style="background:#333; border:none; padding:8px 20px; border-radius:40px; color:#ffdd99; cursor:pointer;margin-top:15px;">🔒 ЗАТВОРИ</button></div>'; 
    document.body.appendChild(overlay); 
    document.getElementById('close-profile-btn').onclick = function() { overlay.remove(); }; 
};

// ==================== АДАПТИВНА ЛЕНТА С ГЕРОИ ====================
let startIdx = 0;
let perPage = 3;
let currentContainer = null;

function createHeroCard(hero, isMobile) {
    let card = document.createElement('div');
    let needXP = 100 + (hero.level - 1) * 50;
    let xpPercent = Math.min(100, Math.floor((hero.xp / needXP) * 100));
    let fav = isFavorite(hero.id);
    
    if (isMobile) {
        card.style.cssText = `background: rgba(20,15,10,0.9); border-radius: 12px; padding: 6px 10px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b; flex-shrink: 0;`;
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:bold; color:#ffdd99; font-size:10px;">⚔️ ${hero.name.substring(0,10)}</div>
                <button class="favorite-btn" data-id="${hero.id}" style="background:transparent; border:none; font-size:14px; cursor:pointer; color:${fav ? '#ff4466' : '#aaa'};">${fav ? '❤️' : '🤍'}</button>
            </div>
            <div style="font-size:8px; color:#ccaa77;">Ниво ${hero.level}</div>
            <div style="background:#2a1a0a; height:3px; border-radius:2px; margin:4px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:2px;"></div></div>
            <div style="font-size:8px; color:#ffaa66;">💪 ${hero.power}</div>
            <div style="margin-top: 4px;">
                <div style="background: #2a1a0a; height: 3px; border-radius: 2px; overflow: hidden;">
                    <div style="background: #d4a373; height: 100%; width: ${xpPercent}%;"></div>
                </div>
                <div style="font-size: 6px; color: #aa8866; margin-top: 2px;">⚡ ${Math.floor(hero.xp)}/${needXP} XP</div>
            </div>
        `;
    } else {
        card.style.cssText = `background: rgba(20,15,10,0.9); border-radius: 12px; padding: 8px 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; border: 1px solid #c9a87b; margin-bottom: 6px;`;
        card.innerHTML = `
            <div style="font-size:22px;">⚔️</div>
            <div style="flex:1;">
                <div style="font-weight:bold; color:#ffdd99; font-size:13px;">${hero.name}</div>
                <div style="font-size:10px; color:#ccaa77;">Ниво ${hero.level} · ${hero.className}</div>
                <div style="background:#2a1a0a; height:4px; border-radius:2px; margin:4px 0;">
                    <div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:2px;"></div>
                </div>
                <div style="margin-top: 4px;">
                    <div style="background: #2a1a0a; height: 3px; border-radius: 2px; overflow: hidden;">
                        <div style="background: #d4a373; height: 100%; width: ${xpPercent}%;"></div>
                    </div>
                    <div style="font-size: 7px; color: #aa8866; margin-top: 2px;">⚡ ${Math.floor(hero.xp)}/${needXP} XP</div>
                </div>
            </div>
            <div style="font-size:11px; font-weight:bold; color:#ffaa66;">💪 ${hero.power}</div>
            <div style="font-size:10px; color:#ffd700;">💰 ${hero.gold}</div>
            <button class="favorite-btn" data-id="${hero.id}" style="background:transparent; border:none; font-size:18px; cursor:pointer; color:${fav ? '#ff4466' : '#aaa'};">${fav ? '❤️' : '🤍'}</button>
        `;
    }
    card.onclick = (e) => { if (e.target.classList.contains('favorite-btn')) return; showHeroProfile(hero); };
    let favBtn = card.querySelector('.favorite-btn');
    if (favBtn) { favBtn.onclick = (e) => { e.stopPropagation(); let hid = favBtn.getAttribute('data-id'); toggleFavorite(hid); }; }
    return card;
}

function renderSingleBar() {
    let heroes = getAllHeroes();
    if (heroes.length === 0) return;
    let isMobile = window.innerWidth <= 768;
    if (currentContainer) currentContainer.remove();
    currentContainer = document.createElement('div');
    currentContainer.id = 'single-hero-bar';
    if (isMobile) {
        currentContainer.style.cssText = `position: sticky; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid #c9a87b; padding: 6px 12px; overflow-x: auto; white-space: nowrap; z-index: 1000;`;
        let topBar = document.querySelector('#top-bar');
        if (topBar && topBar.parentNode) topBar.insertAdjacentElement('afterend', currentContainer);
        else document.body.insertBefore(currentContainer, document.body.firstChild);
    } else {
        currentContainer.style.cssText = `margin-top: 15px; background: transparent;`;
        let target = document.getElementById('clans-container');
        if (target && target.parentNode) target.insertAdjacentElement('afterend', currentContainer);
        else document.body.appendChild(currentContainer);
    }
    let listContainer = document.createElement('div');
    listContainer.style.cssText = isMobile ? `display: flex; gap: 10px; flex-direction: row;` : `display: flex; gap: 8px; flex-direction: column;`;
    currentContainer.appendChild(listContainer);
    let loadBtn = document.createElement('button');
    loadBtn.textContent = '📜 ЗАРЕДИ ОЩЕ';
    loadBtn.style.cssText = `background:#2c1a0c; border:none; border-bottom:2px solid #a05a2c; color:#ffdd99; font-size:10px; padding:5px; border-radius:30px; cursor:pointer; margin-top:8px; width:100%;`;
    currentContainer.appendChild(loadBtn);
    if (startIdx >= heroes.length) startIdx = 0;
    let page = heroes.slice(startIdx, startIdx + perPage);
    listContainer.innerHTML = '';
    page.forEach(hero => { listContainer.appendChild(createHeroCard(hero, isMobile)); });
    let hasMore = startIdx + perPage < heroes.length;
    loadBtn.style.display = hasMore ? 'block' : 'none';
    loadBtn.textContent = hasMore ? `📜 ЗАРЕДИ ОЩЕ (${heroes.length - startIdx - perPage} остават)` : '🏁 КРАЙ';
    loadBtn.onclick = () => { if (startIdx + perPage < heroes.length) { startIdx += perPage; renderSingleBar(); } };
}

// ==================== СТАРТИРАНЕ НА ЛЕНТАТА ====================
function initHeroBar() {
    renderSingleBar();
    window.addEventListener('resize', () => renderSingleBar());
}

// ==================== АВТОМАТИЧНО ДОБАВЯНЕ НА НАВИГАЦИОННИ БУТОНИ ====================
setTimeout(function addNavButtonsAutomatically() {
    const heroBar = document.getElementById('single-hero-bar');
    if (!heroBar) { setTimeout(addNavButtonsAutomatically, 500); return; }
    if (document.getElementById('hero-nav-prev')) return;
    
    const btnStyle = `
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        background: rgba(30, 25, 20, 0.5);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(201, 168, 123, 0.4);
        border-radius: 50%;
        color: rgba(255, 221, 153, 0.8);
        font-size: 14px;
        cursor: pointer;
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
        opacity: 0.6;
    `;
    const prevBtn = document.createElement('button');
    prevBtn.id = 'hero-nav-prev';
    prevBtn.innerHTML = '←';
    prevBtn.style.cssText = btnStyle + 'left: -12px;';
    prevBtn.title = 'Предишни герои';
    const nextBtn = document.createElement('button');
    nextBtn.id = 'hero-nav-next';
    nextBtn.innerHTML = '→';
    nextBtn.style.cssText = btnStyle + 'right: -12px;';
    nextBtn.title = 'Следващи герои';
    prevBtn.onmouseenter = () => { prevBtn.style.opacity = '1'; prevBtn.style.background = 'rgba(60, 50, 40, 0.7)'; prevBtn.style.borderColor = '#c9a87b'; prevBtn.style.transform = 'translateY(-50%) scale(1.05)'; };
    prevBtn.onmouseleave = () => { prevBtn.style.opacity = '0.6'; prevBtn.style.background = 'rgba(30, 25, 20, 0.5)'; prevBtn.style.borderColor = 'rgba(201, 168, 123, 0.4)'; prevBtn.style.transform = 'translateY(-50%) scale(1)'; };
    nextBtn.onmouseenter = () => { nextBtn.style.opacity = '1'; nextBtn.style.background = 'rgba(60, 50, 40, 0.7)'; nextBtn.style.borderColor = '#c9a87b'; nextBtn.style.transform = 'translateY(-50%) scale(1.05)'; };
    nextBtn.onmouseleave = () => { nextBtn.style.opacity = '0.6'; nextBtn.style.background = 'rgba(30, 25, 20, 0.5)'; nextBtn.style.borderColor = 'rgba(201, 168, 123, 0.4)'; nextBtn.style.transform = 'translateY(-50%) scale(1)'; };
    heroBar.style.position = 'relative';
    heroBar.appendChild(prevBtn);
    heroBar.appendChild(nextBtn);
    
    let currentIndex = 0;
    let allHeroes = [];
    let pageSize = 3;
    function updateHeroesList() {
        allHeroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    allHeroes.push({
                        id: key, name: clan.leaderName || clan.name || key, level: clan.level || 1,
                        className: clan.currentClass || "Воевода", xp: clan.xp || 0,
                        power: clan.heroPower || 100, gold: clan.gold || 1500, army: clan.armySize || 300
                    });
                }
            }
        }
        if (allHeroes.length === 0 && window.currentHero) {
            allHeroes.push({
                id: window.currentHero.clan || "hero", name: window.currentHero.name || "Воевода",
                level: window.currentHero.level || 1, className: window.currentHero.currentClass || "Багатур",
                xp: window.currentHero.xp || 0, power: window.currentHero.heroPower || 100,
                gold: window.currentHero.gold || 1500, army: window.currentHero.armySize || 500
            });
        }
        allHeroes.sort((a,b) => b.level - a.level);
        const isMobile = window.innerWidth <= 768;
        const listContainer = heroBar.querySelector('.hero-list-single, .hero-list-final, div[style*="flex"]');
        if (listContainer) {
            const start = currentIndex;
            const end = Math.min(start + pageSize, allHeroes.length);
            const page = allHeroes.slice(start, end);
            listContainer.innerHTML = '';
            page.forEach(hero => { const card = createHeroCard(hero, isMobile); listContainer.appendChild(card); });
            prevBtn.style.opacity = currentIndex > 0 ? '0.6' : '0.2';
            nextBtn.style.opacity = currentIndex + pageSize < allHeroes.length ? '0.6' : '0.2';
            prevBtn.style.cursor = currentIndex > 0 ? 'pointer' : 'default';
            nextBtn.style.cursor = currentIndex + pageSize < allHeroes.length ? 'pointer' : 'default';
        }
    }
    prevBtn.onclick = () => { if (currentIndex > 0) { currentIndex = Math.max(0, currentIndex - pageSize); updateHeroesList(); } };
    nextBtn.onclick = () => { if (currentIndex + pageSize < allHeroes.length) { currentIndex = Math.min(allHeroes.length - pageSize, currentIndex + pageSize); updateHeroesList(); } };
    updateHeroesList();
    window.addEventListener('resize', () => updateHeroesList());
    console.log("✅ Навигационните бутони са добавени автоматично");
}, 1000);

// Стартиране на лентата, когато страницата е готова
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroBar);
} else {
    initHeroBar();
}
