/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ, ЛЕНТА НА ЕЛИТА
 И ИНСПЕКЦИЯ НА КЛАНОВЕТЕ) 
СТАТУС: НАПЪЛНО ОБНОВЕН + hireNewHero
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


// Извикваме при стартиране
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        startAllAutoTimers();
        syncAutoStateWithHeroes();
    });
} else {
    startAllAutoTimers();
    syncAutoStateWithHeroes();
}
// ==================== НАЕМАНЕ НА ГЕРОИ ====================
window.hireNewHero = function() {
    console.log("📢 hireNewHero извикана");
    
    if (!window.currentHero) {
        alert("Няма активен герой!");
        return;
    }
    
    let cost = 500;
    if (window.currentHero.gold < cost) {
        alert("❌ Нямате достатъчно злато! Нужни: " + cost);
        return;
    }
    
    let heroesList = [
        { name: "Аспарух", clan: "Дуло", power: 130, class: "Войн" },
        { name: "Тервел", clan: "Комитопули", power: 125, class: "Стрелец" },
        { name: "Крум", clan: "Асеневци", power: 140, class: "Рицар" },
        { name: "Омуртаг", clan: "Тертер", power: 120, class: "Маг" },
        { name: "Борис I", clan: "Шишмановци", power: 135, class: "Лечител" },
        { name: "Симеон Велики", clan: "Дуло", power: 150, class: "Багатур" },
        { name: "Самуил", clan: "Комитопули", power: 145, class: "Вълхв" }
    ];
    
    let randomHero = heroesList[Math.floor(Math.random() * heroesList.length)];
    let newId = "hero_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    
    // ✅ ФИКС: Добавени всички задължителни свойства
    let newHero = {
        name: randomHero.name,
        leaderName: randomHero.name,
        clan: randomHero.clan,
        isJoined: true,
        level: 1,
        xp: 0,
        heroPower: randomHero.power,
        power: randomHero.power,
        gold: 1500,
        armySize: 200,
        currentArmy: 200,
        currentClass: randomHero.class,
        className: randomHero.class,
        skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
        skillPoints: 0,
        storedXP: 0,
        isAuto: false,  // ✅ ФИКС: isAuto = false (ръчен режим, играчът да реши)
        equipment: Array(12).fill(null),
        inventory: Array(12).fill(null),
        pet: null,
        age: 30
    };


     // Инициализираме RPG структурата
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(newHero);
    }
    
    window.currentHero.gold -= cost;
    
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newId] = newHero;
    
    if (!window.unlockedLeaders) window.unlockedLeaders = [];
    window.unlockedLeaders.push(newHero);
    
    // ✅ ФИКС: Обновяваме UI и лентата
    const goldSpan = document.getElementById('val-gold');
    if (goldSpan) goldSpan.innerText = window.currentHero.gold;
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    alert(`✅ Нает: ${newHero.name} от род ${newHero.clan}\n💰 Останало злато: ${window.currentHero.gold}`);
    
    // ✅ ФИКС: АКО ИМА AUTO ТАЙМЕРИ, СТАРТИРАМЕ ЗА НОВИЯ ГЕРОЙ
    if (typeof window.startAutoTimer === 'function') {
        window.startAutoTimer(newId);
    }
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

// ==================== УМЕНИЯ ====================
const skillTree = {
    tactics: { name: "🎯 Военна Тактика", desc: "Увеличава бойната мощ с +15", cost: 1 },
    endurance: { name: "🛡️ Издръжливост", desc: "Увеличава защитата на армията", cost: 1 },
    economy: { name: "💰 Родово Управление", desc: "Увеличава дохода от региони", cost: 1 },
    mysticism: { name: "🔮 Мистицизъм", desc: "Увеличава шанса за артефакти", cost: 1 },
    leadership: { name: "🏆 Лидерство", desc: "Увеличава максималния брой войници", cost: 1 }
};

// ==================== ПРОФИЛ С 12 СЛОТА + АРТЕФАКТИ ====================
function showHeroProfile(hero) {
    let needXP = 100 + (hero.level - 1) * 50;
    let xpPercent = Math.min(100, Math.floor((hero.xp / needXP) * 100));
    let autoOn = isAuto(hero.id);
    let slotNames = ["⚔️ ОРЪЖИЕ", "🛡️ ЩИТ", "🪖 ШЛЕМ", "🦺 НАГРЪДНИК", "🧤 РЪКАВИЦИ", "👖 КРАЧОЛИ", "👢 БОТУШИ", "💍 ПРЪСТЕН", "💍 ПРЪСТЕН 2", "📿 АМУЛЕТ", "🧣 НАМЕТАЛО", "🔱 РЕЛИКВИЯ"];
    
    // ==================== ИНВЕНТАР (12 слота) ====================
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
    
    // ==================== АРТЕФАКТИ (ИСТОРИЧЕСКИ) ====================
    let artifactsHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🏺 СЪБРАНИ АРТЕФАКТИ</h4><div style="display:flex; flex-wrap:wrap; gap:8px;">';
    if (hero.inventory && hero.inventory.length > 0) {
        let artifactCount = 0;
        hero.inventory.forEach(artifact => {
            if (artifact && artifact.id) {
                artifactCount++;
                artifactsHtml += `<div style="background:#2c1a0c; border-radius:8px; padding:6px; text-align:center; min-width:60px; border:1px solid #c9a87b;" title="${artifact.name} (${artifact.era || 'Исторически'})">
                    <div style="font-size:20px;">${artifact.icon || '🏺'}</div>
                    <div style="font-size:7px; color:#ffdd99;">${artifact.name.length > 10 ? artifact.name.substring(0,8)+'..' : artifact.name}</div>
                </div>`;
            }
        });
        if (artifactCount === 0) artifactsHtml += '<div style="color:#aa8866; padding:8px;">Няма събрани артефакти</div>';
    } else {
        artifactsHtml += '<div style="color:#aa8866; padding:8px;">Няма събрани артефакти</div>';
    }
    artifactsHtml += '</div></div>';
    
    // ==================== ДОМАШЕН ЛЮБИМЕЦ ====================
    let petHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🐾 ДОМАШЕН ЛЮБИМЕЦ</h4>';
    if (hero.pet && window.rpgDatabase?.petsDatabase?.[hero.pet]) {
        let pet = window.rpgDatabase.petsDatabase[hero.pet];
        petHtml += `<div style="display:flex; align-items:center; gap:12px;"><span style="font-size:32px;">${pet.icon}</span><div><div style="color:#ffaa66;">${pet.name}</div><div style="font-size:10px;">${pet.desc || 'Специален бонус'}</div></div></div>`;
    } else {
        petHtml += '<div style="color:#aa8866; text-align:center;">Няма любимец<br><button id="adopt-pet-btn" style="background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; padding:4px 12px; margin-top:8px; cursor:pointer;">➕ ОСИНОВИ</button></div>';
    }
    petHtml += '</div>';
    
    // ==================== УМЕНИЯ ====================
    let skillsHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">📖 ДЪРВО НА УМЕНИЯТА</h4><div style="color:#ffaa66; font-size:11px; margin-bottom:8px;">✨ Свободни точки: ' + (hero.skillPoints || 0) + '</div>';
    for (let [key, skill] of Object.entries(skillTree)) {
        let currentLevel = hero.skills?.[key] || 0;
        let maxLevel = 5;
        skillsHtml += `<div style="margin-bottom:12px; border-bottom:1px solid #2a1a0a; padding-bottom:8px;">
            <div style="display:flex; justify-content:space-between;">
                <span style="color:#ffaa66;">${skill.name}</span>
                <span style="color:#ccaa77;">Ниво ${currentLevel}/${maxLevel}</span>
            </div>
            <div style="font-size:10px; color:#aa8866;">${skill.desc}</div>
            <button class="upgrade-skill-btn" data-skill="${key}" style="background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; font-size:9px; padding:2px 10px; margin-top:5px; cursor:pointer;">📈 ПОВИШИ</button>
        </div>`;
    }
    skillsHtml += '</div>';
    
    // ==================== AUTO БУТОН ====================
    let autoBtnHtml = `<button id="auto-mode-btn" style="background:${autoOn ? '#4a6a2a' : '#2c1a0c'}; border:none; border-radius:20px; color:#ffdd99; padding:8px 16px; margin-top:10px; cursor:pointer; width:100%;">${autoOn ? '✅ AUTO РЕЖИМ: ВКЛЮЧЕН' : '🤖 AUTO РЕЖИМ: ИЗКЛЮЧЕН'}</button>`;
    
    // ==================== МОДАЛЕН ПРОЗОРЕЦ ====================
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
                <div style="color:#ccaa77;">${hero.className} · Ниво ${hero.level}</div>
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
    
    // ==================== ЗАТВАРЯНЕ ====================
    modal.querySelector('#close-profile-modal').onclick = () => modal.remove();
    
    // ==================== AUTO БУТОН (ФУНКЦИОНАЛНОСТ) ====================
    let autoBtnElem = modal.querySelector('#auto-mode-btn');
    if (autoBtnElem) {
        autoBtnElem.onclick = () => {
            let newState = !isAuto(hero.id);
            setAuto(hero.id, newState);
            
            if (window.worldData && window.worldData.clans && window.worldData.clans[hero.id]) {
                window.worldData.clans[hero.id].isAuto = newState;
            }
            if (window.currentHero && window.currentHero.id === hero.id) {
                window.currentHero.isAuto = newState;
            }
            hero.isAuto = newState;
            
            if (newState && typeof window.startAutoTimer === 'function') {
                window.startAutoTimer(hero.id);
            } else if (!newState && typeof window.stopAutoTimer === 'function') {
                window.stopAutoTimer(hero.id);
            }
            
            autoBtnElem.textContent = newState ? '✅ AUTO РЕЖИМ: ВКЛЮЧЕН' : '🤖 AUTO РЕЖИМ: ИЗКЛЮЧЕН';
            autoBtnElem.style.background = newState ? '#4a6a2a' : '#2c1a0c';
        };
    }
    
    // ==================== ОСИНОВЯВАНЕ НА ЛЮБИМЕЦ ====================
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
    
    // ==================== ПОВИШАВАНЕ НА УМЕНИЯ ====================
    let upgradeBtns = modal.querySelectorAll('.upgrade-skill-btn');
    upgradeBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            let skillKey = btn.getAttribute('data-skill');
            if ((hero.skillPoints || 0) > 0) {
                if (!hero.skills) hero.skills = {};
                hero.skills[skillKey] = (hero.skills[skillKey] || 0) + 1;
                hero.skillPoints--;
                if (skillKey === 'tactics') hero.power = (hero.power || 100) + 15;
                if (skillKey === 'endurance') hero.army = (hero.army || 300) + 50;
                modal.remove(); showHeroProfile(hero);
            } else { alert("❌ Нямате свободни точки!"); }
        };
    });
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

// ==================== ИНСПЕКЦИЯ НА КЛАН ====================
window.inspectLeaderProfile = function(clanKey) { 
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) { alert("Грешка: Неуспешно извличане на данни за избрания род."); return; } 
    const leader = window.worldData.clans[clanKey]; 
    const oldProfile = document.getElementById('dynamic-leader-profile'); if (oldProfile) oldProfile.remove(); 
    let skillsHTML = "<h4>Придобити Способности:</h4><ul>"; 
    let hasSkills = false; 
    if (leader.skills) { 
        for (let sKey in leader.skills) { 
            let sVal = leader.skills[sKey];
            if (sVal > 0 && window.rpgDatabase && window.rpgDatabase.skillTrees && window.rpgDatabase.skillTrees[sKey]) { skillsHTML += "<li>• " + window.rpgDatabase.skillTrees[sKey].name + ": Ниво " + sVal + "</li>"; hasSkills = true; } 
        } 
    } 
    if (!hasSkills) skillsHTML += "<li>Все още няма развити умения.</li>"; 
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
        `;
    } else {
        card.style.cssText = `background: rgba(20,15,10,0.9); border-radius: 12px; padding: 8px 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; border: 1px solid #c9a87b; margin-bottom: 6px;`;
        card.innerHTML = `
            <div style="font-size:22px;">⚔️</div>
            <div style="flex:1;"><div style="font-weight:bold; color:#ffdd99; font-size:13px;">${hero.name}</div><div style="font-size:10px; color:#ccaa77;">Ниво ${hero.level} · ${hero.className}</div><div style="background:#2a1a0a; height:4px; border-radius:2px; margin:4px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:2px;"></div></div></div>
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

// Стартираме, когато страницата е готова
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroBar);
} else {
    initHeroBar();
}
