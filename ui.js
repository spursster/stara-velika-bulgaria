/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: ui.js (ВЕРСИЯ 3.7 – АДАПТИВЕН ХОРИЗОНТАЛЕН ПАНЕЛ + ИКОНКИ)
========================================================================== */ 
// ==================== ОБНОВЯВАНЕ НА ВРЕМЕТО ====================
window.updateTimeUI = function() {
    if (!window.gameTime) return;
    
    const timeDisplay = document.getElementById('current-time-info');
    if (!timeDisplay) {
        // Ако няма елемент, опитваме да го намерим по друг начин
        const fallback = document.querySelector('.stat-box:last-child');
        if (fallback) {
            window.timeElement = fallback;
        } else {
            console.warn("⚠️ Елемент за време не е намерен");
            return;
        }
    }
    
    const targetEl = timeDisplay || window.timeElement;
    if (!targetEl) return;
    
    const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
    const currentSeason = seasons[window.gameTime.seasonIndex] || "Сезон";
    targetEl.innerHTML = `⏳ ${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};

window.eventHistory = []; 
if (!window.autoLevelState) { window.autoLevelState = {}; }

// ==================== ИКОНКА ЗА КЛАС ====================
// Връща емоджи иконка според името на класа (поддържа и женски варианти)
function getClassIcon(className) {
    if (!className) return "⚔️";
    const lower = className.toLowerCase();
    // Магически класове
    if (lower.includes("маг") || lower.includes("колобър") || lower.includes("мистик") || lower.includes("wizard") || lower.includes("mage")) return "🧙";
    if (lower.includes("магьосница")) return "🧙‍♀️";
    // Стрелци
    if (lower.includes("стрелец") || lower.includes("арчер") || lower.includes("archer") || lower.includes("ranger")) return "🏹";
    // Владетелски класове
    if (lower.includes("върховен") || lower.includes("боил") || lower.includes("king") || lower.includes("lord") || lower.includes("владетел")) return "👑";
    if (lower.includes("владетелка")) return "👸";
    if (lower.includes("жрица")) return "🕊️";
    // Бойни класове
    if (lower.includes("воителка")) return "⚔️";
    if (lower.includes("лечителка")) return "💚";
    if (lower.includes("търговка")) return "💰";
    if (lower.includes("паладинка")) return "🛡️";
    if (lower.includes("нощен") || lower.includes("острие") || lower.includes("сенчест") || lower.includes("shadow") || lower.includes("assassin")) return "🗡️";
    if (lower.includes("иконом") || lower.includes("търговец") || lower.includes("merchant") || lower.includes("trader")) return "💰";
    if (lower.includes("кръвожаден") || lower.includes("blood")) return "🩸";
    if (lower.includes("пазител") || lower.includes("guardian") || lower.includes("paladin")) return "🛡️";
    if (lower.includes("берсерк") || lower.includes("berserker")) return "😠";
    if (lower.includes("воевод") || lower.includes("voivode")) return "⚔️";
    if (lower.includes("легенда") || lower.includes("legend")) return "⭐";
    if (lower.includes("герой") || lower.includes("hero")) return "🏅";
    return "⚔️";
}
// Експортиране за другите модули (soloMode.js)
window.getClassIcon = getClassIcon;

// ==================== ПРЕВКЛЮЧВАНЕ НА ЦЯЛ ЕКРАН ====================
window.toggleGameFullScreen = function() { 
    // ... останалият код остава същият ...
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
    renderSingleBar();  // Обновява лентата с герои
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
// ==================== НАЕМАНЕ НА ГЕРОИ ====================
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
                } else if (heroName.includes("Аспарух") || heroName.includes("Тервель") || heroName.includes("Крум")) {
                    power = 140; cost = 1000; className = "Войн";
                }
                heroesList.push({ name: heroName, clan: clanName, power: power, cost: cost, className: className });
            });
        }
    }
    return heroesList;
}

window.hireNewHero = function() {
    // Блокиране в соло режим
    if (window.gameMode === 'solo') {
        alert("В соло режим не можете да наемате герои. Можете да намирате спътници в регионите (до 4).");
        return;
    }
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
        pet: null, age: 30, learnedSkills: {}
    };
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(newHero);
    
    const oldHero = window.currentHero;
    oldHero.gold -= randomHero.cost;
    
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newId] = newHero;
    if (!window.unlockedLeaders) window.unlockedLeaders = [];
    window.unlockedLeaders.push(newHero);
    
    // Осигуряване, че активният герой е в любимите
    if (typeof ensureActiveHeroInBarracks === 'function') {
        ensureActiveHeroInBarracks();
    } else {
        oldHero.isJoined = true;
        oldHero.isFavoriteInBarracks = true;
        if (!window.worldData.clans[oldHero.clan]) {
            window.worldData.clans[oldHero.clan] = oldHero;
        } else {
            window.worldData.clans[oldHero.clan].isJoined = true;
            window.worldData.clans[oldHero.clan].isFavoriteInBarracks = true;
        }
        let favs = [];
        for (let k in window.worldData.clans) {
            const c = window.worldData.clans[k];
            if (c.isJoined && c.isFavoriteInBarracks) favs.push(c.name);
        }
        if (!favs.includes(oldHero.name)) favs.push(oldHero.name);
        localStorage.setItem('barracksFavorites', JSON.stringify(favs));
    }
    
    // Обновяване на UI
    let goldSpan = document.getElementById('val-gold');
    if (goldSpan) goldSpan.innerText = oldHero.gold;
    if (window.updateCharacterUI) window.updateCharacterUI(oldHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    alert(`✅ Нает: ${newHero.name} от род ${newHero.clan}\n💰 Останало злато: ${oldHero.gold}\n⚔️ Бойна сила: ${newHero.power}`);
    if (newHero.isAuto && typeof window.startAutoTimer === 'function') window.startAutoTimer(newId);
    
    if (document.getElementById('barracks-screen') && document.getElementById('barracks-screen').style.display === 'flex') {
        if (typeof window.renderBarracksLayout === 'function') window.renderBarracksLayout();
    }
};
// ==================== ДАННИ ЗА ГЕРОИТЕ ====================
// Връща масив с всички наети герои и спътници. В соло режим филтрира до главен герой + спътници.
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
                    storedXP: clan.storedXP || 0,
                    isAuto: clan.isAuto !== undefined ? clan.isAuto : true,
                    power: clan.heroPower || 100,
                    gold: clan.gold || 1500,
                    army: clan.armySize || 300,
                    skills: clan.skills || {},
                    pet: clan.pet || null,
                    skillPoints: clan.skillPoints || 0,
                    equipment: clan.equipment || Array(12).fill(null),
                    isCompanion: clan.isCompanion === true   // за соло режим
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
            storedXP: window.currentHero.storedXP || 0,
            isAuto: window.currentHero.isAuto !== undefined ? window.currentHero.isAuto : true,
            power: window.currentHero.heroPower || 100,
            gold: window.currentHero.gold || 1500,
            army: window.currentHero.armySize || 500,
            skills: window.currentHero.skills || {},
            pet: window.currentHero.pet || null,
            skillPoints: window.currentHero.skillPoints || 0,
            equipment: window.currentHero.equipment || Array(12).fill(null),
            isCompanion: window.currentHero.isCompanion === true
        });
    }
    // Филтриране за соло режим
    if (window.gameMode === 'solo') {
        let mainId = window.currentHero ? (window.currentHero.clan || "hero") : null;
        heroes = heroes.filter(h => h.id === mainId || h.isCompanion === true);
    }
    heroes.sort((a,b) => b.level - a.level);
    return heroes;
}
// ==================== ЕКИПИРОВКА ====================
function equipArtifact(hero, artifact, slotIndex) {
    if (!hero.equipment) hero.equipment = Array(12).fill(null);
    let oldArtifact = hero.equipment[slotIndex];
    if (oldArtifact) {
        if (!hero.inventory) hero.inventory = [];
        hero.inventory.push(oldArtifact);
    }
    hero.equipment[slotIndex] = artifact;
    let idx = hero.inventory.indexOf(artifact);
    if (idx !== -1) hero.inventory.splice(idx, 1);
    if (window.recalculateHeroPower) window.recalculateHeroPower(hero);
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.armyMarket && window.armyMarket.sync) window.armyMarket.sync(hero);
    else if (window.saveHeroData) window.saveHeroData(hero);
}

// ==================== ПРОФИЛ НА ГЕРОЯ (модален прозорец) ====================
// Показва детайли, екипировка, артефакти, любимец, умения
function showHeroProfile(hero) {
    let needXP = 100 + (hero.level - 1) * 50;
    let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
    let xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
    let autoOn = isAuto(hero.id);
    let slotNames = ["⚔️ ОРЪЖИЕ", "🛡️ ЩИТ", "🪖 ШЛЕМ", "🦺 НАГРЪДНИК", "🧤 РЪКАВИЦИ", "👖 КРАЧОЛИ", "👢 БОТУШИ", "💍 ПРЪСТЕН", "💍 ПРЪСТЕН 2", "📿 АМУЛЕТ", "🧣 НАМЕТАЛО", "🔱 РЕЛИКВИЯ"];
    
    function renderEquipmentSlots() {
        let html = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🎒 ЕКИПИРОВКА</h4><div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">';
        for (let i = 0; i < 12; i++) {
            let item = hero.equipment && hero.equipment[i] ? hero.equipment[i] : null;
            let slotName = slotNames[i];
            html += `<div class="equip-slot" data-slot="${i}" style="background:#2c1a0c; border-radius:8px; padding:8px; text-align:center; border:1px solid #c9a87b; cursor:pointer;">
                        <div style="font-size:20px;">${item ? (item.icon || '🔮') : '⬜'}</div>
                        <div style="font-size:8px; color:#ffdd99;">${item ? (item.name.length>10?item.name.substring(0,8)+'..':item.name) : slotName}</div>
                        ${item ? `<div style="font-size:7px; color:#88ff88;">+${item.bonus?.heroPower || item.bonus?.goldBonus || 0}</div>` : ''}
                    </div>`;
        }
        html += '</div></div>';
        return html;
    }
    
    function renderArtifacts() {
        let html = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🏺 СЪБРАНИ АРТЕФАКТИ</h4><div style="display:flex; flex-wrap:wrap; gap:8px;">';
        if (hero.inventory && hero.inventory.length > 0) {
            hero.inventory.forEach((artifact, idx) => {
                if (artifact && artifact.id) {
                    let bonusText = artifact.bonus ? Object.entries(artifact.bonus).map(([k,v]) => `${k}+${v}`).join(', ') : 'няма';
                    html += `<div class="artifact-item" data-artifact-idx="${idx}" style="background:#2c1a0c; border-radius:8px; padding:6px; text-align:center; min-width:60px; border:1px solid #c9a87b; cursor:pointer;" title="${artifact.name} (${artifact.era || 'Исторически'}) - Бонус: ${bonusText}">
                                <div style="font-size:20px;">${artifact.icon || '🏺'}</div>
                                <div style="font-size:7px; color:#ffdd99;">${artifact.name.length > 10 ? artifact.name.substring(0,8)+'..' : artifact.name}</div>
                            </div>`;
                }
            });
        } else {
            html += '<div style="color:#aa8866; padding:8px;">Няма събрани артефакти</div>';
        }
        html += '</div></div>';
        return html;
    }
    
    let inventoryHtml = renderEquipmentSlots();
    let artifactsHtml = renderArtifacts();
    
    let petHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🐾 ДОМАШЕН ЛЮБИМЕЦ</h4>';
    if (hero.pet && window.rpgDatabase?.petsDatabase?.[hero.pet]) {
        let pet = window.rpgDatabase.petsDatabase[hero.pet];
        petHtml += `<div style="display:flex; align-items:center; gap:12px;"><span style="font-size:32px;">${pet.icon}</span><div><div style="color:#ffaa66;">${pet.name}</div><div style="font-size:10px;">${pet.desc || 'Специален бонус'}</div></div></div>`;
    } else {
        petHtml += '<div style="color:#aa8866; text-align:center;">Няма любимец<br><button id="adopt-pet-btn" style="background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; padding:4px 12px; margin-top:8px; cursor:pointer;">➕ ОСИНОВИ</button></div>';
    }
    petHtml += '</div>';
    
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
                <div style="color:#ccaa77;">${getClassIcon(hero.currentClass)} ${hero.currentClass} · Ниво ${hero.level}</div>
                <div style="background:#2a1a0a; height:8px; border-radius:4px; margin:10px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:4px;"></div></div>
                <div style="font-size:11px; color:#ffaa66;">⚡ ${Math.floor(currentXP)}/${needXP} XP</div>
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
    
    // Клик върху екипировъчен слот
    modal.querySelectorAll('.equip-slot').forEach(slotDiv => {
        slotDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            let slotIndex = parseInt(slotDiv.getAttribute('data-slot'));
            if (isNaN(slotIndex)) return;
            let artifacts = hero.inventory.filter(a => a && a.id);
            if (artifacts.length === 0) {
                alert("Нямате артефакти в инвентара за екипиране!");
                return;
            }
            let options = artifacts.map((a, idx) => `${idx}: ${a.name} (бонуси: ${Object.entries(a.bonus || {}).map(([k,v])=>`${k}+${v}`).join(', ')})`).join('\n');
            let choice = prompt(`Избери артефакт за слот ${slotNames[slotIndex]}:\n${options}\n\nВъведи номера (0-${artifacts.length-1}) или 'cancel' за отказ:`);
            if (choice === null || isNaN(parseInt(choice))) return;
            let idx = parseInt(choice);
            if (idx < 0 || idx >= artifacts.length) { alert("Невалиден номер"); return; }
            let artifact = artifacts[idx];
            equipArtifact(hero, artifact, slotIndex);
            modal.remove();
            showHeroProfile(hero);
        });
    });
    
    // Клик върху артефакт в инвентара
    modal.querySelectorAll('.artifact-item').forEach(artDiv => {
        artDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            let artifactIdx = parseInt(artDiv.getAttribute('data-artifact-idx'));
            if (isNaN(artifactIdx)) return;
            let artifact = hero.inventory[artifactIdx];
            if (!artifact) return;
            let slotOptions = slotNames.map((name, i) => `${i}: ${name} ${hero.equipment[i] ? '(заето с ' + hero.equipment[i].name + ')' : '(празно)'}`).join('\n');
            let choice = prompt(`Къде да екипираме "${artifact.name}"?\n${slotOptions}\n\nВъведи номера на слота (0-11) или 'cancel' за отказ:`);
            if (choice === null || isNaN(parseInt(choice))) return;
            let slot = parseInt(choice);
            if (slot < 0 || slot > 11) { alert("Невалиден слот"); return; }
            equipArtifact(hero, artifact, slot);
            modal.remove();
            showHeroProfile(hero);
        });
    });
    
    modal.querySelector('#close-profile-modal').onclick = () => modal.remove();
    
    // Бутон за авто режим
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
    
    // Бутон за осиновяване на любимец
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
    
    // Бутон за отваряне на дърветата с умения
    let openSkillsBtn = modal.querySelector('#open-new-skills-btn');
    if (openSkillsBtn) {
        openSkillsBtn.onclick = () => {
            modal.remove();
            if (typeof window.openSkillsUI === 'function') window.openSkillsUI();
            else alert("Интерфейсът за умения не е зареден (skills-ui.js).");
        };
    }
}
// ==================== ЛЕНТА НА ЕЛИТА (5 ГЕРОЯ) С ЦВЕТНИ КАНТОВЕ ====================
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
    
    // Филтриране за соло режим
    if (window.gameMode === 'solo') {
        let mainClan = window.currentHero ? window.currentHero.clan : null;
        leaders = leaders.filter(l => l.clanKey === mainClan || l.isCompanion === true);
    }
    
    leaders.sort((a, b) => {
        if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
        let xpA = a.isAuto ? (a.xp || 0) : (a.storedXP || 0);
        let xpB = b.isAuto ? (b.xp || 0) : (b.storedXP || 0);
        return xpB - xpA;
    });
    
    // Показваме само 5 героя
    const top5 = leaders.slice(0, 5); 
    eliteBar.innerHTML = ""; 
    eliteBar.style.cssText = "display: flex; gap: 10px; overflow-x: auto; padding: 10px; background: rgba(0,0,0,0.4);"; 
    top5.forEach(leader => { 
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(leader); 
        const card = document.createElement('div'); 
        card.className = "elite-hero-card"; 
        card.style.cssText = "background: rgba(0,0,0,0.6); border-radius: 12px; padding: 6px 12px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b; flex-shrink: 0;";
        
        // ⭐⭐⭐ ДОБАВЯМЕ АТРИБУТ data-class ЗА ЦВЕТНИТЕ КАНТОВЕ ⭐⭐⭐
        card.setAttribute('data-class', leader.currentClass || '');
        
        card.onclick = (e) => { if (e.target.classList.contains('auto-btn')) return; if (window.openHeroRPGModal) window.openHeroRPGModal(leader.clanKey); }; 
        
        let currentXP = leader.isAuto ? (leader.xp || 0) : (leader.storedXP || 0);
        let reqXP = 150; 
        if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) { 
            reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level || 1); 
        } 
        if (reqXP <= 0) reqXP = 1; 
        let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100)); 
        let petIcon = ""; 
        if (leader.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[leader.pet]) { 
            petIcon = window.rpgDatabase.petsDatabase[leader.pet].icon; 
        } 
        const autoClass = leader.isAuto ? "auto-btn active" : "auto-btn"; 
        const autoText = leader.isAuto ? "Auto" : "Manual"; 
        
        // Добавяме иконка на класа преди името
        const classIcon = getClassIcon(leader.currentClass);
        
        card.innerHTML = petIcon + '<div style="font-weight:bold;color:#ffdd99;">' + classIcon + ' ' + (leader.name || leader.hero || "Воевода") + '</div><div style="font-size:10px;color:#ccaa77;">Ниво ' + (leader.level || 1) + ' | ' + (leader.currentClass || "Багатур") + '</div><div style="background:#2a1a0a;height:3px;border-radius:2px;margin:4px 0;"><div style="background:#44aa44;height:100%;width:' + xpPercent + '%;border-radius:2px;"></div></div><button class="' + autoClass + '" style="background:#2c1a0c;border:none;font-size:9px;padding:2px 6px;border-radius:20px;color:#ffdd99;margin-top:4px;cursor:pointer;">' + autoText + '</button>'; 
        eliteBar.appendChild(card); 
    }); 
}; 

window.renderTop6HeroesUI = window.renderTop6LeadersUI;

// ==================== ОСНОВНО ОБНОВЯВАНЕ НА ЛЕВИЯ ПАНЕЛ ====================
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    const isActive = window.currentHero &&
        (window.currentHero.name === hero.name && window.currentHero.clan === hero.clan);

    if (isActive) {
        window.currentHero = hero;
    } else if (!window.currentHero) {
        window.currentHero = hero;
    } else {
        return;
    }

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    // Обновяваме горните статистики
    const goldDisplay = document.getElementById('val-gold');
    if (goldDisplay) goldDisplay.innerText = hero.gold || 0;

    const armyDisplay = document.getElementById('val-army');
    if (armyDisplay) armyDisplay.innerText = hero.armySize || 0;

    const powerDisplay = document.getElementById('val-hero-power');
    if (powerDisplay) powerDisplay.innerText = hero.heroPower || 100;

    // Обновяваме левия панел с профила
    const profileBox = document.getElementById('active-character-profile');
    if (profileBox) {
        let petStatus = "Няма";
        if (hero.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[hero.pet]) {
            const p = window.rpgDatabase.petsDatabase[hero.pet];
            petStatus = p.icon + " " + p.name;
        }
        profileBox.innerHTML = '<div style="text-align:center;">' +
            '<div style="font-weight:bold;font-size:1.2rem;">' + (hero.name || "Неизвестен") + '</div>' +
            '<div>Род ' + (hero.clan || "Свободен") + ' | ' + getClassIcon(hero.currentClass) + ' Клас: ' + (hero.currentClass || "Багатур") + '</div>' +
            '<div>Ниво: ' + (hero.level || 1) + '</div>' +
            '<div>Възраст: ' + (hero.age || 50) + ' г.</div>' +
            '<div>Бойна Сила: ⚔️ ' + (hero.heroPower || 150) + '</div>' +
            '<div>Свободни точки: ' + (hero.skillPoints || 0) + '</div>' +
            '<div>Любимец: ' + petStatus + '</div>' +
            '</div>';
    }

    // Добавяме бутон за управление на героя, ако липсва
    if (profileBox && !document.getElementById('open-rpg-modal-btn')) {
        const rpgBtn = document.createElement('button');
        rpgBtn.id = "open-rpg-modal-btn";
        rpgBtn.className = "menu-btn";
        rpgBtn.style.cssText = "width:100%; margin-top:10px; padding:8px; font-size:11px; font-family:'Cinzel';";
        rpgBtn.innerText = " Управление на Героя";
        rpgBtn.onclick = function() {
            if (window.openHeroRPGModal) window.openHeroRPGModal(window.currentHero.clan);
        };
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
    let skillsHTML = "<h4>Придобити Способности (нови):</h4><ul>"; 
    let hasSkills = false; 
    if (leader.learnedSkills) { 
        for (let skillKey in leader.learnedSkills) { 
            let level = leader.learnedSkills[skillKey];
            if (level > 0) {
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
// ==================== АДАПТИВНА ХОРИЗОНТАЛНА ЛЕНТА С ГЕРОИ ====================
let currentContainer = null;

// Създава карта за един герой (с иконка на клас)
function createHeroCard(hero, isMobile) {
    let card = document.createElement('div');
    let needXP = 100 + (hero.level - 1) * 50;
    let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
    let xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
    let fav = isFavorite(hero.id);
    const classIcon = getClassIcon(hero.className);
    
    if (isMobile) {
        card.style.cssText = `background: rgba(20,15,10,0.9); border-radius: 12px; padding: 6px 10px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b; flex-shrink: 0;`;
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:bold; color:#ffdd99; font-size:10px;">${classIcon} ${hero.name.substring(0,10)}</div>
                <button class="favorite-btn" data-id="${hero.id}" style="background:transparent; border:none; font-size:14px; cursor:pointer; color:${fav ? '#ff4466' : '#aaa'};">${fav ? '❤️' : '🤍'}</button>
            </div>
            <div style="font-size:8px; color:#ccaa77;">Ниво ${hero.level}</div>
            <div style="background:#2a1a0a; height:3px; border-radius:2px; margin:4px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:2px;"></div></div>
            <div style="font-size:8px; color:#ffaa66;">💪 ${hero.power}</div>
        `;
    } else {
        card.style.cssText = `background: rgba(20,15,10,0.9); border-radius: 12px; padding: 8px 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; border: 1px solid #c9a87b; margin-bottom: 6px;`;
        card.innerHTML = `
            <div style="font-size:22px;">${classIcon}</div>
            <div style="flex:1;">
                <div style="font-weight:bold; color:#ffdd99; font-size:13px;">${hero.name}</div>
                <div style="font-size:10px; color:#ccaa77;">Ниво ${hero.level} · ${hero.className}</div>
                <div style="background:#2a1a0a; height:4px; border-radius:2px; margin:4px 0;">
                    <div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:2px;"></div>
                </div>
                <div style="font-size:7px; color:#aa8866; margin-top:2px;">⚡ ${Math.floor(currentXP)}/${needXP} XP</div>
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

// Рендира цялата лента с герои (хоризонтална на мобилни, вертикална на десктоп)
function renderSingleBar() {
    let heroes = getAllHeroes();
    if (heroes.length === 0) return;
    
    let isMobile = window.innerWidth <= 768;
    
    // Премахваме стария контейнер, ако има
    if (currentContainer) currentContainer.remove();
    currentContainer = document.createElement('div');
    currentContainer.id = 'single-hero-bar';
    currentContainer.style.cssText = isMobile ? 
        `position: sticky; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid #c9a87b; padding: 6px 12px; overflow-x: auto; white-space: nowrap; z-index: 1000;` : 
        `margin-top: 15px; background: transparent;`;
    
    // Поставяме контейнера на правилното място
    if (isMobile) {
        let topBar = document.querySelector('#top-bar');
        if (topBar && topBar.parentNode) topBar.insertAdjacentElement('afterend', currentContainer);
        else document.body.insertBefore(currentContainer, document.body.firstChild);
    } else {
        let target = document.getElementById('clans-container');
        if (target && target.parentNode) target.insertAdjacentElement('afterend', currentContainer);
        else document.body.appendChild(currentContainer);
    }
    
    // Контейнер за списъка с герои (хоризонтален или вертикален)
    let listContainer = document.createElement('div');
    listContainer.style.cssText = isMobile ? `display: flex; gap: 10px; flex-direction: row;` : `display: flex; gap: 8px; flex-direction: column;`;
    currentContainer.appendChild(listContainer);
    
    // Показваме всички герои (без бутон "Зареди още" и без скрол при вертикален изглед)
    heroes.forEach(hero => { listContainer.appendChild(createHeroCard(hero, isMobile)); });
}

// ==================== СТАРТИРАНЕ НА ЛЕНТАТА ====================
function initHeroBar() {
    renderSingleBar();
    window.addEventListener('resize', () => renderSingleBar());
}

// Стартираме лентата, когато страницата е готова
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroBar);
} else {
    initHeroBar();
}
// ==================== АВТОМАТИЧНО ДОБАВЯНЕ НА НАВИГАЦИОННИ БУТОНИ ====================
// Тези бутони са активни само на десктоп и позволяват превъртане на лентата с герои
setTimeout(function addNavButtonsAutomatically() {
    const heroBar = document.getElementById('single-hero-bar');
    if (!heroBar) { setTimeout(addNavButtonsAutomatically, 500); return; }
    if (document.getElementById('hero-nav-prev')) return;
    
    // Не добавяме бутони на мобилни устройства (вече има хоризонтален скрол)
    if (window.innerWidth <= 768) return;
    
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
    
    heroBar.style.position = 'relative';
    heroBar.appendChild(prevBtn);
    heroBar.appendChild(nextBtn);
    
    let currentIndex = 0;
    let allHeroes = [];
    let pageSize = 3;
    
    function updateHeroesList() {
        allHeroes = getAllHeroes();
        if (allHeroes.length === 0) return;
        
        const listContainer = heroBar.querySelector('div:first-child');
        if (!listContainer) return;
        
        const start = currentIndex;
        const end = Math.min(start + pageSize, allHeroes.length);
        const page = allHeroes.slice(start, end);
        listContainer.innerHTML = '';
        page.forEach(hero => { listContainer.appendChild(createHeroCard(hero, false)); });
        
        prevBtn.style.opacity = currentIndex > 0 ? '0.6' : '0.2';
        nextBtn.style.opacity = currentIndex + pageSize < allHeroes.length ? '0.6' : '0.2';
        prevBtn.style.cursor = currentIndex > 0 ? 'pointer' : 'default';
        nextBtn.style.cursor = currentIndex + pageSize < allHeroes.length ? 'pointer' : 'default';
    }
    
    prevBtn.onclick = () => { if (currentIndex > 0) { currentIndex = Math.max(0, currentIndex - pageSize); updateHeroesList(); } };
    nextBtn.onclick = () => { if (currentIndex + pageSize < allHeroes.length) { currentIndex = Math.min(allHeroes.length - pageSize, currentIndex + pageSize); updateHeroesList(); } };
    
    updateHeroesList();
    window.addEventListener('resize', () => updateHeroesList());
}, 1000);
// ==================== АДАПТИВНИ БУТОНИ (ЦЯЛ ЕКРАН И ОТКРИЙ) ====================
function setupResponsiveButtons() {
    // Бутон за цял екран
    let fullscreenBtn = document.querySelector('button[onclick*="toggleGameFullScreen"]');
    if (!fullscreenBtn) {
        const btns = document.querySelectorAll('.glass-btn');
        for (let b of btns) {
            if (b.innerText.includes('⬚') || b.innerHTML.includes('⬚')) {
                fullscreenBtn = b;
                break;
            }
        }
    }
    
    // Бутон за нови земи
    let discoverBtn = document.getElementById('discover-lands-btn');
    if (!discoverBtn && document.querySelector('.top-bar-controls')) {
        discoverBtn = document.createElement('button');
        discoverBtn.id = 'discover-lands-btn';
        discoverBtn.className = 'glass-btn';
        discoverBtn.title = 'Открий нови земи';
        discoverBtn.onclick = function() {
            if (typeof window.generateProceduralRegions === 'function') {
                let count = 5 + Math.floor(Math.random() * 6);
                let generated = window.generateProceduralRegions(count, true);
                if (window.showAdvisorMsg) {
                    window.showAdvisorMsg(`🌍 Открихте ${generated} нови непознати земи!`);
                } else {
                    alert(`Открихте ${generated} нови региона!`);
                }
                if (document.getElementById('regions-map-overlay') && typeof window.openRegionsMap === 'function') {
                    window.openRegionsMap();
                }
            } else {
                alert("Системата за генериране на региони не е заредена.");
            }
        };
        document.querySelector('.top-bar-controls').appendChild(discoverBtn);
    }
    
    function updateButtons() {
        const isMobile = window.innerWidth <= 768;
        if (fullscreenBtn) {
            if (isMobile) {
                fullscreenBtn.innerHTML = '⬚';
                fullscreenBtn.style.cssText = 'font-size:1.2rem; padding:0; width:36px; height:36px; display:flex; align-items:center; justify-content:center;';
            } else {
                fullscreenBtn.innerHTML = '⬚ Цял екран';
                fullscreenBtn.style.cssText = '';
            }
        }
        if (discoverBtn) {
            if (isMobile) {
                discoverBtn.innerHTML = '🌍';
                discoverBtn.style.cssText = 'font-size:1.2rem; padding:0; width:36px; height:36px; display:flex; align-items:center; justify-content:center;';
            } else {
                discoverBtn.innerHTML = '🌍 Открий';
                discoverBtn.style.cssText = '';
            }
        }
    }
    
    updateButtons();
    window.addEventListener('resize', updateButtons);
}

// Стартиране на адаптивните бутони
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupResponsiveButtons);
} else {
    setupResponsiveButtons();
}

(function addEliteHeroesButtonFinal() {
    console.log("🏆 Добавяне на бутон за елитни герои (финална версия)...");
    
    // Списък с 10 елитни героя (можете да добавите още или да ги заредите от gameData)
    const eliteHeroes = [
        { name: "Кубрат Велики", class: "Владетел", power: 190, level: 12, icon: "👑" },
        { name: "Аспарух", class: "Воевода", power: 170, level: 10, icon: "⚔️" },
        { name: "Тервел", class: "Паладин", power: 175, level: 11, icon: "🛡️" },
        { name: "Крум Страшни", class: "Берсерк", power: 185, level: 13, icon: "🗡️" },
        { name: "Симеон Велики", class: "Маг", power: 180, level: 12, icon: "🔮" },
        { name: "Борис Покръстител", class: "Свещеник", power: 160, level: 9, icon: "✝️" },
        { name: "Иван Асен", class: "Владетел", power: 165, level: 10, icon: "👑" },
        { name: "Калоян", class: "Ромеобоец", power: 185, level: 14, icon: "🐉" },
        { name: "Александър Македонски", class: "Завоевател", power: 200, level: 15, icon: "🏆" },
        { name: "Владислав Варненчик", class: "Кръстоносец", power: 175, level: 11, icon: "⚔️" }
    ];
    
    // Функция за намиране на герой в worldData.clans по име
    function findHeroInGame(heroName) {
        if (!window.worldData || !window.worldData.clans) return null;
        for (let key in window.worldData.clans) {
            const clan = window.worldData.clans[key];
            if (clan.name === heroName || clan.leaderName === heroName) {
                return clan;
            }
        }
        return null;
    }
    
    // Функция за отваряне на модал с елитните герои
    function showEliteHeroesModal() {
        const oldModal = document.getElementById('eliteHeroesModal');
        if (oldModal) oldModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'eliteHeroesModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            z-index: 200000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
        `;
        
        modal.innerHTML = `
            <div style="background: #0a0a0a; border: 2px solid #d4af37; border-radius: 8px; max-width: 500px; width: 90%; max-height: 85vh; overflow-y: auto; padding: 20px; box-sizing: border-box; position: relative;">
                <button id="closeEliteModalX" style="position: absolute; top: 10px; left: 10px; background: rgba(255,80,80,0.2); border: none; color: #ff8888; font-size: 18px; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
                <h3 style="margin-top: 0; color: #ffd700; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; text-align: center;">🏆 ЕЛИТНИ ГЕРОИ</h3>
                <p style="font-size: 12px; color: #aaa; text-align: center; margin-bottom: 15px;">Най-могъщите герои (2 реда по 5)</p>
                <div id="eliteHeroesGridFinal" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;"></div>
                <button id="closeEliteModalFooter" class="menu-btn" style="width: 100%; margin-top: 15px;">ЗАТВОРИ</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const grid = modal.querySelector('#eliteHeroesGridFinal');
        
        eliteHeroes.forEach(hero => {
            const heroInGame = findHeroInGame(hero.name);
            const isInGame = heroInGame !== null;
            
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(20,20,30,0.6);
                border: 1px solid rgba(212,175,55,0.3);
                border-radius: 8px;
                padding: 8px;
                text-align: center;
                cursor: ${isInGame ? 'pointer' : 'default'};
                transition: all 0.2s;
                opacity: ${isInGame ? 1 : 0.7};
            `;
            
            if (isInGame) {
                card.onmouseenter = () => {
                    card.style.transform = 'translateY(-2px)';
                    card.style.borderColor = '#ffd700';
                    card.style.boxShadow = '0 0 8px rgba(212,175,55,0.3)';
                };
                card.onmouseleave = () => {
                    card.style.transform = 'translateY(0)';
                    card.style.borderColor = 'rgba(212,175,55,0.3)';
                    card.style.boxShadow = 'none';
                };
                card.onclick = () => {
                    modal.remove();
                    if (typeof window.showHeroProfile === 'function') {
                        window.showHeroProfile(heroInGame);
                    } else {
                        alert(`Профилът на ${hero.name} не може да бъде отворен`);
                    }
                };
            } else {
                card.style.opacity = '0.6';
                card.onclick = () => {
                    alert(`${hero.name} – ще се появи в играта след като бъде нает.`);
                };
            }
            
            card.innerHTML = `
                <div style="font-size: 28px;">${hero.icon}</div>
                <div style="font-size: 11px; font-weight: bold; color: #ffd700;">${hero.name}</div>
                <div style="font-size: 9px; color: #aaa;">${hero.class}</div>
                <div style="font-size: 9px; color: #ffaa66;">⚔️ ${hero.power}</div>
                <div style="font-size: 8px; color: #88ff88;">Ниво ${hero.level}</div>
                ${!isInGame ? '<div style="font-size: 7px; color: #ff8888; margin-top: 3px;">(не е нает)</div>' : ''}
            `;
            grid.appendChild(card);
        });
        
        // Адаптивност за малки екрани
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 700px) {
                #eliteHeroesGridFinal {
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 8px !important;
                }
            }
            @media (max-width: 480px) {
                #eliteHeroesGridFinal {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
        `;
        modal.appendChild(style);
        
        const closeX = modal.querySelector('#closeEliteModalX');
        const closeFooter = modal.querySelector('#closeEliteModalFooter');
        const closeModal = () => modal.remove();
        closeX.onclick = closeModal;
        closeFooter.onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    }
    
    // Добавяме бутон в горната лента (ако не съществува)
    const container = document.querySelector('.top-bar-controls');
    if (container && !document.getElementById('eliteHeroesBtn')) {
        const btn = document.createElement('button');
        btn.id = 'eliteHeroesBtn';
        btn.className = 'glass-btn';
        btn.innerHTML = '🏆 Елит';
        btn.style.fontSize = '0.8rem';
        btn.style.padding = '4px 10px';
        btn.onclick = showEliteHeroesModal;
        container.appendChild(btn);
        console.log("✅ Бутон '🏆 Елит' е добавен в горната лента");
    } else {
        console.log("Бутонът вече съществува");
    }
    
    console.log("✅ Функцията е активна. Натиснете '🏆 Елит', за да видите 10-те елитни героя.");
})();

// ==================== ГЕНЕРИРАНЕ НА ПОРТРЕТ С Pollinations.ai ====================
(async function initPortraitGenerator() {
    // Изчакваме играта да се инициализира
    if (!window.currentHero) {
        setTimeout(initPortraitGenerator, 500);
        return;
    }
    
    // Функция за генериране на портрет
    window.generatePortraitPollinations = async function(hero, onSuccess) {
        if (!hero) return;
        const prompt = `fantasy rpg character portrait of ${hero.name} the ${hero.currentClass || hero.className || "warrior"}, digital painting, D&D style, face front, detailed, cinematic lighting, high quality`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&seed=${Math.floor(Math.random()*10000)}`;
        
        // Тестваме дали изображението се зарежда (опционално)
        const img = new Image();
        img.onload = () => {
            hero.portrait = url;
            if (onSuccess) onSuccess(url);
            // Запазваме портрета в localStorage (по име на герой)
            try {
                const portraits = JSON.parse(localStorage.getItem('heroPortraits') || '{}');
                portraits[hero.name] = url;
                localStorage.setItem('heroPortraits', JSON.stringify(portraits));
            } catch(e) {}
            if (window.showAdvisorMsg) window.showAdvisorMsg(`🎨 Портретът на ${hero.name} е генериран!`);
            // Обновяваме UI
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
            if (typeof window.renderTop6LeadersUI === 'function') window.renderTop6LeadersUI();
            if (window.currentHero === hero && typeof window.updateCharacterUI === 'function') {
                window.updateCharacterUI(hero);
            }
        };
        img.onerror = () => {
            console.warn(`Неуспешно генериране на портрет за ${hero.name}`);
            if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Неуспешно генериране на портрет за ${hero.name}. Опитайте отново.`);
        };
        img.src = url;
    };
    
    // Функция за зареждане на запазени портрети
    window.loadHeroPortraits = function() {
        try {
            const portraits = JSON.parse(localStorage.getItem('heroPortraits') || '{}');
            for (let name in portraits) {
                // Намираме героя по име в worldData.clans
                if (window.worldData && window.worldData.clans) {
                    for (let key in window.worldData.clans) {
                        const hero = window.worldData.clans[key];
                        if (hero.name === name) {
                            hero.portrait = portraits[name];
                            break;
                        }
                    }
                }
                // Ако е текущият герой
                if (window.currentHero && window.currentHero.name === name) {
                    window.currentHero.portrait = portraits[name];
                }
            }
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
            if (typeof window.renderTop6LeadersUI === 'function') window.renderTop6LeadersUI();
            if (window.currentHero && typeof window.updateCharacterUI === 'function') window.updateCharacterUI(window.currentHero);
        } catch(e) {}
    };
    
    // Добавяме бутон за генериране на портрет в профила на героя
    // Патчваме showHeroProfile, за да добавим бутон
    const originalShowHeroProfile = window.showHeroProfile;
    if (originalShowHeroProfile) {
        window.showHeroProfile = function(hero) {
            originalShowHeroProfile(hero);
            // След като модалът се покаже, добавяме бутон "Генерирай портрет"
            setTimeout(() => {
                const modal = document.getElementById('ultimate-profile-modal');
                if (!modal) return;
                // Проверяваме дали бутонът вече съществува
                if (modal.querySelector('.generate-portrait-btn')) return;
                const btn = document.createElement('button');
                btn.className = 'generate-portrait-btn';
                btn.innerText = '🎨 Генерирай портрет';
                btn.style.cssText = 'background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; padding:6px 12px; margin-top:8px; width:100%; cursor:pointer;';
                btn.onclick = async () => {
                    btn.innerText = '⏳ Генериране...';
                    btn.disabled = true;
                    await window.generatePortraitPollinations(hero, (url) => {
                        // Обновяваме иконката в модала, ако има
                        const iconDiv = modal.querySelector('.equip-slot:first-child div:first-child');
                        if (iconDiv) {
                            iconDiv.innerHTML = `<img src="${url}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">`;
                        }
                        // Може да обновим и основния профил
                        if (window.currentHero === hero && typeof window.updateCharacterUI === 'function') {
                            window.updateCharacterUI(hero);
                        }
                        btn.innerText = '✅ Портретът е готов';
                        setTimeout(() => btn.remove(), 1500);
                    });
                };
                // Намираме място за бутона (например след autoBtnHtml)
                const autoBtn = modal.querySelector('#auto-mode-btn');
                if (autoBtn) {
                    autoBtn.insertAdjacentElement('afterend', btn);
                } else {
                    const closeBtn = modal.querySelector('#close-profile-modal');
                    if (closeBtn) closeBtn.insertAdjacentElement('beforebegin', btn);
                }
            }, 100);
        };
    }
    
    // Зареждаме запазените портрети при старт
    window.loadHeroPortraits();
    
    // Наблюдаваме за нови герои (спътници), за да им заредим портрети
    const observer = new MutationObserver(() => window.loadHeroPortraits());
    if (window.worldData && window.worldData.clans) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    console.log("✅ Pollinations.ai портрет генераторът е активен. Отворете профила на герой и натиснете 'Генерирай портрет'.");
})();
