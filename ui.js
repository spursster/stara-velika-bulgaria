/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: ui.js (ВЕРСИЯ 7.0 – С HP ИНДИКАТОРИ, ЖИВОТ И СМЪРТ)
========================================================================== */ 

// ==================== ОБНОВЯВАНЕ НА ВРЕМЕТО ====================
window.updateTimeUI = function() {
    if (!window.gameTime) return;
    
    const timeDisplay = document.getElementById('current-time-info');
    if (!timeDisplay) {
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
function getClassIcon(className) {
    if (!className) return "⚔️";
    const lower = className.toLowerCase();
    if (lower.includes("маг") || lower.includes("колобър") || lower.includes("мистик") || lower.includes("wizard") || lower.includes("mage")) return "🧙";
    if (lower.includes("магьосница")) return "🧙‍♀️";
    if (lower.includes("стрелец") || lower.includes("арчер") || lower.includes("archer") || lower.includes("ranger")) return "🏹";
    if (lower.includes("върховен") || lower.includes("боил") || lower.includes("king") || lower.includes("lord") || lower.includes("владетел")) return "👑";
    if (lower.includes("владетелка")) return "👸";
    if (lower.includes("жрица")) return "🕊️";
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
window.getClassIcon = getClassIcon;
window.addHeroLog = function(hero, icon, message) {
    if (!hero) return;
    if (!hero.actionLog) hero.actionLog = [];
    hero.actionLog.unshift({ icon, message, time: Date.now() });
    if (hero.actionLog.length > 15) hero.actionLog.pop(); // пазим последните 15
    // Ако героят е активният, обновяваме профила (ако е отворен)
    if (hero === window.currentHero && window.updateCharacterUI) window.updateCharacterUI(hero);
};

// ==================== ГЕНЕРИРАНЕ НА ПОРТРЕТ С POLLINATIONS.AI ====================
window.generateHeroPortrait = async function(hero, retries = 2) {
    if (!hero) return;
    if (hero.portrait) return hero.portrait;
    
    const prompt = `fantasy rpg character portrait of ${hero.name} the ${hero.currentClass || hero.className || "warrior"}, digital painting, D&D style, face front, detailed, cinematic lighting, high quality, 512x512`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&seed=${Math.floor(Math.random()*10000)}`;
    
    const attempt = async (remaining) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                hero.portrait = url;
                if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
                if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
                if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
                if (window.currentHero === hero && typeof window.updateCharacterUI === 'function') {
                    window.updateCharacterUI(hero);
                }
                resolve(url);
            };
            img.onerror = () => {
                if (remaining > 0) {
                    console.log(`⚠️ Портрет за ${hero.name} не успя, опитвам отново след 1.5 сек... (остават ${remaining} опита)`);
                    setTimeout(() => attempt(remaining - 1).then(resolve).catch(reject), 1500);
                } else {
                    reject(new Error(`Грешка при зареждане на портрет за ${hero.name} след няколко опита`));
                }
            };
            img.src = url;
        });
    };
    
    try {
        return await attempt(retries);
    } catch(e) {
        console.warn(`❌ ${e.message}`);
        return null;
    }
};

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
window.favoriteHeroes = favoriteHeroes;
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

// ==================== НАЕМАНЕ НА ГЕРОИ ====================
function getAllHeroesFromDatabase() {
    let heroesList = [];
   let heroesSource = window.bulgarianClans; // Препратка към реалния обект от database.js
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
    if (window.gameMode === 'solo') {
        window.showAdvisorPopup("СОЛО РЕЖИМ", "В соло режим не можете да наемате герои. Можете да намирате спътници в регионите (до 4).", "warning");
        return;
    }
    if (!window.currentHero) { 
        window.showAdvisorPopup("ГРЕШКА", "Няма активен герой!", "error");
        return; 
    }
    let allHeroes = getAllHeroesFromDatabase();
    if (allHeroes.length === 0) { 
        window.showAdvisorPopup("ГРЕШКА", "Няма налични герои за наемане!", "error");
        return; 
    }
    let hiredNames = new Set();
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) hiredNames.add(clan.name || clan.leaderName || key);
        }
    }
    if (window.currentHero) hiredNames.add(window.currentHero.name);
    let available = allHeroes.filter(h => !hiredNames.has(h.name));
    if (available.length === 0) { 
        window.showAdvisorPopup("ВНИМАНИЕ", "Всички герои вече са наети!", "warning");
        return; 
    }
    let randomHero = available[Math.floor(Math.random() * available.length)];
    if (window.currentHero.gold < randomHero.cost) {
        window.showAdvisorPopup("ГРЕШКА", `Недостатъчно злато! Нужни: ${randomHero.cost}`, "error");
        return;
    }
    let newId = "hero_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    let newHero = {
        name: randomHero.name,
        clan: randomHero.clan,
        isJoined: true,
        isFavorite: false,
        level: 1,
        xp: 0,
        heroPower: randomHero.power,
        power: randomHero.power,
        gold: 1500,
        armySize: 200,
        currentArmy: 200,
        currentClass: randomHero.className,
        className: randomHero.className,
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
    if (!window.unlockedHeroes) window.unlockedHeroes = [];
    window.unlockedHeroes.push(newHero);
    
    if (typeof ensureActiveHeroInBarracks === 'function') {
        ensureActiveHeroInBarracks();
    } else {
        oldHero.isJoined = true;
        oldHero.isFavorite = true;
        if (!window.worldData.clans[oldHero.clan]) {
            window.worldData.clans[oldHero.clan] = oldHero;
        } else {
            window.worldData.clans[oldHero.clan].isJoined = true;
            window.worldData.clans[oldHero.clan].isFavorite = true;
        }
        let favs = [];
        for (let k in window.worldData.clans) {
            const c = window.worldData.clans[k];
            if (c.isJoined && c.isFavorite) favs.push(c.name);
        }
        if (!favs.includes(oldHero.name)) favs.push(oldHero.name);
        localStorage.setItem('barracksFavorites', JSON.stringify(favs));
    }
    
    let goldSpan = document.getElementById('val-gold');
    if (goldSpan) goldSpan.innerText = oldHero.gold;
    if (window.updateCharacterUI) window.updateCharacterUI(oldHero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    window.showAdvisorPopup(
        "УСПЕШНО НАЕМАНЕ",
        `✨ ${newHero.name} от род ${newHero.clan} се закле във вярност!<br><br>💰 Останало злато: ${oldHero.gold}<br>⚔️ Бойна сила: ${newHero.power}`,
        "success"
    );
    
    if (newHero.isAuto && typeof window.startAutoTimer === 'function') window.startAutoTimer(newId);
    
    if (document.getElementById('barracks-screen') && document.getElementById('barracks-screen').style.display === 'flex') {
        if (typeof window.renderBarracksLayout === 'function') window.renderBarracksLayout();
    }
};

// ==================== ДАННИ ЗА ГЕРОИТЕ ====================
function getAllHeroes() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let heroData = window.worldData.clans[key];
            if (heroData.isJoined === true && heroData.isAlive !== false) {
                heroes.push({
                    id: key,
                    name: heroData.name || heroData.leaderName || key,
                    level: heroData.level || 1,
                    className: heroData.currentClass || "Воевода",
                    xp: heroData.xp || 0,
                    storedXP: heroData.storedXP || 0,
                    isAuto: heroData.isAuto !== undefined ? heroData.isAuto : true,
                    power: heroData.heroPower || 100,
                    gold: heroData.gold || 1500,
                    army: heroData.armySize || 300,
                    skills: heroData.skills || {},
                    pet: heroData.pet || null,
                    skillPoints: heroData.skillPoints || 0,
                    equipment: heroData.equipment || Array(12).fill(null),
                    isCompanion: heroData.isCompanion === true,
                    isFavorite: heroData.isFavorite || heroData.isFavoriteInBarracks || false,
                    portrait: heroData.portrait,
                    hp: heroData.hp || heroData.maxHp || 100,
                    maxHp: heroData.maxHp || 100
                });
            }
        }
    }
    if (heroes.length === 0 && window.currentHero && window.currentHero.isAlive !== false) {
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
            isCompanion: window.currentHero.isCompanion === true,
            isFavorite: window.currentHero.isFavorite || false,
            portrait: window.currentHero.portrait,
            hp: window.currentHero.hp || window.currentHero.maxHp || 100,
            maxHp: window.currentHero.maxHp || 100
        });
    }
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
    if (window.recalculateHeroMaxHp) window.recalculateHeroMaxHp(hero);
}

function showHeroProfile(hero) {
    const armyValue = hero.armySize !== undefined ? hero.armySize : (hero.army || 0);
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
    let generatePortraitBtnHtml = `<button id="generate-portrait-btn" style="background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; padding:6px 12px; margin-top:8px; width:100%; cursor:pointer;">🎨 Генерирай портрет</button>`;
    let shareBtnHtml = `<button id="share-hero-btn" style="background:#2c1a0c; border:none; border-radius:20px; color:#ffdd99; padding:6px 12px; margin-top:8px; width:100%; cursor:pointer;">📤 Сподели визитка</button>`;
    
    // HP лента
    let hpPercent = (hero.hp / hero.maxHp) * 100;
    let hpBarColor = hpPercent > 70 ? "#4caf50" : (hpPercent > 30 ? "#ff9800" : "#f44336");
    let hpHtml = `
        <div style="margin: 5px 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>❤️</span>
                <span>Здраве</span>
                <div style="flex:1; background:#c4a67a; height:6px; border-radius:3px;">
                    <div style="background:${hpBarColor}; width:${hpPercent}%; height:100%; border-radius:3px;"></div>
                </div>
                <span>${hero.hp}/${hero.maxHp}</span>
            </div>
        </div>
    `;

    // Morale лента
    let moralePercent = (hero.morale || 50);
    let moraleBarColor = moralePercent > 70 ? "#2196f3" : (moralePercent > 30 ? "#ff9800" : "#f44336");
    let moraleHtml = `
        <div style="margin: 5px 0;" title="Моралът влияе на възстановяването след битка">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>😊</span>
                <span>Морал</span>
                <div style="flex:1; background:#c4a67a; height:6px; border-radius:3px;">
                    <div style="background:${moraleBarColor}; width:${moralePercent}%; height:100%; border-radius:3px;"></div>
                </div>
                <span>${moralePercent}%</span>
            </div>
        </div>
    `;
    
    // Портрет
    let portraitHtml = '';
    if (hero.portrait) {
        portraitHtml = `<div style="text-align: center; margin: 0 auto 10px auto;">
                            <img src="${hero.portrait}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #ffd700; object-fit: cover; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
                        </div>`;
    } else {
        portraitHtml = `<div style="font-size: 48px; text-align: center; margin-bottom: 5px;">⚔️</div>`;
    }

        // ========== ГЕРОИЧЕСКИ ДНЕВНИК ==========
    let logHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 8px 0;">📜 ГЕРОИЧЕСКИ ДНЕВНИК</h4><div style="max-height:140px; overflow-y:auto; font-size:10px;">';
    if (hero.actionLog && hero.actionLog.length) {
        hero.actionLog.forEach(log => {
            logHtml += `<div style="border-bottom:1px solid #2a1a0a; padding:4px 0;"><span style="font-size:14px; margin-right:8px;">${log.icon}</span> ${log.message}</div>`;
        });
    } else {
        logHtml += '<i style="color:#aa8866;">Все още няма записи</i>';
    }
    logHtml += '</div></div>';
    
    let oldModal = document.getElementById('ultimate-profile-modal');
    if (oldModal) oldModal.remove();
    let modal = document.createElement('div');
    modal.id = 'ultimate-profile-modal';
    modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:100000; display:flex; justify-content:center; align-items:center; font-family:'Cinzel',serif;`;
    modal.innerHTML = `
        <div style="background:#1a1a2e; border-radius:24px; padding:20px; max-width:500px; width:90%; max-height:85vh; overflow-y:auto; border:2px solid #c9a87b;">
            <div style="text-align:center;">
                ${portraitHtml}
                <div style="font-size:22px; font-weight:bold; color:#ffdd99;">${hero.name}</div>
                <div style="color:#ccaa77;">${getClassIcon(hero.currentClass)} ${hero.currentClass} · Ниво ${hero.level}</div>
                <div style="background:#2a1a0a; height:8px; border-radius:4px; margin:10px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:4px;"></div></div>
                <div style="font-size:11px; color:#ffaa66;">⚡ ${Math.floor(currentXP)}/${needXP} XP</div>
                ${hpHtml}
                ${moraleHtml}
                <div style="margin-top:15px; display:flex; justify-content:space-between; gap:10px;">
    <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>💰 Злато</div><div style="color:#ffdd99;">${hero.gold}</div></div>
    <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>⚔️ Армия</div><div style="color:#ffdd99;">${armyValue}</div></div>
    <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>💪 Сила</div><div style="color:#ffdd99;">${hero.power}</div></div>
</div>
                ${inventoryHtml}
                ${artifactsHtml}
                ${petHtml}
                ${skillsHtml}
                ${autoBtnHtml}
                ${generatePortraitBtnHtml}
                ${shareBtnHtml}
                ${logHtml}
                <button id="close-profile-modal" style="background:#2c1a0c; border:none; padding:8px 20px; border-radius:40px; color:#ffdd99; margin-top:15px; cursor:pointer; width:100%;">🔒 ЗАТВОРИ</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // --- ВСИЧКИ СЛУШАТЕЛИ ---
    modal.querySelectorAll('.equip-slot').forEach(slotDiv => {
        slotDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            let slotIndex = parseInt(slotDiv.getAttribute('data-slot'));
            if (isNaN(slotIndex)) return;
            let artifacts = hero.inventory.filter(a => a && a.id);
            if (artifacts.length === 0) {
                window.showAdvisorPopup("ВНИМАНИЕ", "Нямате артефакти в инвентара за екипиране!", "warning");
                return;
            }
            let options = artifacts.map((a, idx) => `${idx}: ${a.name} (бонуси: ${Object.entries(a.bonus || {}).map(([k,v])=>`${k}+${v}`).join(', ')})`).join('\n');
            let choice = prompt(`Избери артефакт за слот ${slotNames[slotIndex]}:\n${options}\n\nВъведи номера (0-${artifacts.length-1}) или 'cancel' за отказ:`);
            if (choice === null || isNaN(parseInt(choice))) return;
            let idx = parseInt(choice);
            if (idx < 0 || idx >= artifacts.length) { window.showAdvisorPopup("ГРЕШКА", "Невалиден номер", "error"); return; }
            let artifact = artifacts[idx];
            equipArtifact(hero, artifact, slotIndex);
            modal.remove();
            showHeroProfile(hero);
        });
    });
    
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
            if (slot < 0 || slot > 11) { window.showAdvisorPopup("ГРЕШКА", "Невалиден слот", "error"); return; }
            equipArtifact(hero, artifact, slot);
            modal.remove();
            showHeroProfile(hero);
        });
    });
    
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
    
    const genBtn = modal.querySelector('#generate-portrait-btn');
    if (genBtn) {
        genBtn.onclick = async () => {
            genBtn.innerText = '⏳ Генериране...';
            genBtn.disabled = true;
            try {
                await window.generateHeroPortrait(hero);
                const portraitContainer = modal.querySelector('div[style*="text-align:center"] > div:first-child');
                if (portraitContainer && hero.portrait) {
                    portraitContainer.innerHTML = `<img src="${hero.portrait}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #ffd700; object-fit: cover; box-shadow: 0 0 15px rgba(0,0,0,0.5);">`;
                }
                genBtn.innerText = '✅ Портретът е готов';
                setTimeout(() => genBtn.remove(), 1500);
            } catch(e) {
                genBtn.innerText = '❌ Грешка, опитай отново';
                genBtn.disabled = false;
            }
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
            modal.remove();
            showHeroProfile(hero);
        };
    }
    
    let openSkillsBtn = modal.querySelector('#open-new-skills-btn');
    if (openSkillsBtn) {
        openSkillsBtn.onclick = () => {
            modal.remove();
            if (typeof window.openSkillsUI === 'function') window.openSkillsUI();
            else window.showAdvisorPopup("ГРЕШКА", "Интерфейсът за умения не е зареден (skills-ui.js).", "error");
        };
    }
    
    const shareBtn = modal.querySelector('#share-hero-btn');
    if (shareBtn) {
        shareBtn.onclick = async () => {
            modal.remove();
            await window.shareHeroCard(hero);
        };
    }
}

// ==================== ЛЕНТА С ЛЮБИМИ ГЕРОИ (5 СЛОТА, XP, HP, AUTO/РЪЧЕН) ====================
window.renderFavoriteHeroesBar = function() {
    const container = document.getElementById('favorite-heroes-bar');
    if (!container) return;
    
    let favoriteHeroesList = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true && hero.isFavorite === true && hero.isAlive !== false) {
                favoriteHeroesList.push(hero);
            }
        }
    }
    favoriteHeroesList.sort((a,b) => (b.level || 1) - (a.level || 1));
    const top5 = favoriteHeroesList.slice(0, 5);
    
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const hero = top5[i];
        const slot = document.createElement('div');
        slot.className = 'favorite-slot';
        
        if (hero) {
            let borderColor = "#c9a87b";
            if (window.getClassBorderColor) {
                borderColor = window.getClassBorderColor(hero.currentClass);
            } else if (hero.classColor) {
                borderColor = hero.classColor;
            }
            slot.style.borderColor = borderColor;
            slot.style.borderWidth = "2px";
            slot.style.borderStyle = "solid";
            
            const classIcon = getClassIcon(hero.currentClass);
            const portraitHtml = hero.portrait ? 
                `<img src="${hero.portrait}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; margin-bottom: 4px;">` : 
                `<div class="hero-icon" style="font-size: 28px;">${classIcon}</div>`;
            
            let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
            let reqXP = 150;
            if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) {
                reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level || 1);
            }
            if (reqXP <= 0) reqXP = 1;
            let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));
            const fillGrad = hero.isAuto ? "linear-gradient(90deg, #00ffcc, #0072ff)" : "linear-gradient(90deg, #ffcc00, #ff6600)";
            
            // HP лента
            let hpPercent = (hero.hp / hero.maxHp) * 100;
            let hpColor = hpPercent > 70 ? "#4caf50" : (hpPercent > 30 ? "#ff9800" : "#f44336");
            
            const isAutoMode = hero.isAuto !== undefined ? hero.isAuto : true;
            const autoIcon = isAutoMode ? "🤖" : "👤";
            const autoTitle = isAutoMode ? "Автоматичен (Auto)" : "Ръчен (Manual) – може да учи умения";
            
            const toggleAuto = () => {
                if (window.setAuto) window.setAuto(hero.id, !isAutoMode);
                hero.isAuto = !isAutoMode;
                if (!isAutoMode && hero.xp > 0) {
                    hero.storedXP = (hero.storedXP || 0) + hero.xp;
                    hero.xp = 0;
                } else if (isAutoMode && hero.storedXP > 0) {
                    let amount = hero.storedXP;
                    hero.storedXP = 0;
                    if (window.gainHeroXP) window.gainHeroXP(hero, amount);
                }
                if (window.renderFavoriteHeroesBar) window.renderFavoriteHeroesBar();
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
                if (window.saveAuto) window.saveAuto();
            };
            
            const skillsBtnHtml = !isAutoMode ? 
                `<button class="skills-toggle" style="background: none; border: none; font-size: 12px; cursor: pointer; margin-left: 4px; color: #ffd700;" title="Отвори дърветата с умения">⭐</button>` : '';
            
            const skillsHandler = (e) => {
                e.stopPropagation();
                const originalHero = window.currentHero;
                window.currentHero = hero;
                if (typeof window.openSkillsUI === 'function') {
                    window.openSkillsUI();
                } else {
                    window.showAdvisorPopup("ГРЕШКА", "Системата за умения не е заредена.", "error");
                }
                window.currentHero = originalHero;
            };
            
            slot.innerHTML = `
                <div style="position: relative; width: 100%;">
                    <button class="favorite-heart-btn" data-name="${hero.name}" style="position: absolute; top: 0; right: 0; background: none; border: none; font-size: 14px; cursor: pointer; color: #ff4466; z-index: 10;">❤️</button>
                    <button class="auto-toggle" style="position: absolute; top: 0; left: 0; z-index: 10; font-size: 8px; border: 1px solid #d4af37; border-radius: 4px; padding: 1px; ${isAutoMode ? 'background: #4a6a2a; color: #fff;' : 'background: #2c1a0c; color: #ffdd99;'}" title="${autoTitle}">${isAutoMode ? 'AUTO' : 'MAN'}</button>
                    ${portraitHtml}
                    <div class="hero-name" title="${hero.name}">${hero.name.substring(0, 10)}</div>
                    <div class="hero-level">Ниво ${hero.level || 1}</div>
                    <div class="xp-bar-container" style="background: #2a1a0a; height: 4px; border-radius: 2px; margin: 4px 0; overflow: hidden;" title="Опит (XP): ${xpPercent}%">
                        <div class="xp-bar-fill" style="background: ${fillGrad}; width: ${xpPercent}%; height: 100%;"></div>
                    </div>
                    <div style="background: #2a1a0a; height: 3px; border-radius: 2px; margin: 2px 0; overflow: hidden;">
                        <div style="background: ${hpColor}; width: ${hpPercent}%; height: 100%;"></div>
                    </div>
                    <div style="background: #2a1a0a; height: 3px; border-radius: 2px; margin: 2px 0; overflow: hidden;" title="Морал: ${hero.morale || 50}%">
                        <div style="background: ${hero.morale > 70 ? '#2196f3' : (hero.morale > 30 ? '#ff9800' : '#f44336')}; width: ${hero.morale || 50}%; height: 100%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px;">
                        <div class="hero-power" style="font-size: 8px; color: #ffaa66;">💪 ${hero.heroPower || 100}</div>
                        ${skillsBtnHtml}
                    </div>
                </div>
            `;
            
            slot.onclick = (e) => {
                if (e.target.classList.contains('favorite-heart-btn')) return;
                if (e.target.classList.contains('auto-toggle')) return;
                if (e.target.classList.contains('skills-toggle')) return;
                if (window.showHeroProfile) window.showHeroProfile(hero);
            };
            
            const heartBtn = slot.querySelector('.favorite-heart-btn');
            if (heartBtn) {
                heartBtn.onclick = (e) => {
                    e.stopPropagation();
                    hero.isFavorite = false;
                    if (typeof window.saveFavoriteHeroes === 'function') window.saveFavoriteHeroes();
                    if (typeof window.saveFavorites === 'function') window.saveFavorites();
                    window.renderFavoriteHeroesBar();
                    if (typeof window.renderBarracksLayout === 'function') window.renderBarracksLayout();
                };
            }
            
            const autoBtn = slot.querySelector('.auto-toggle');
            if (autoBtn) {
                autoBtn.onclick = (e) => {
                    e.stopPropagation();
                    toggleAuto();
                };
            }
            
            const skillsBtn = slot.querySelector('.skills-toggle');
            if (skillsBtn) {
                skillsBtn.onclick = skillsHandler;
            }
            
        } else {
            slot.classList.add('empty');
            slot.innerHTML = '<div style="font-size: 24px;">➕</div><div style="font-size: 9px;">Добави</div>';
            slot.onclick = () => {
                if (favoriteHeroesList.length >= 5) {
                    window.showAdvisorPopup("ВНИМАНИЕ", "Можеш да имаш максимум 5 любими героя! Премахни любим от някой герой, за да добавиш нов.", "warning");
                    return;
                }
                if (typeof window.showHeroSelectionModal === 'function') {
                    window.showHeroSelectionModal();
                } else {
                    window.showAdvisorPopup("ИНФО", "Можете да добавите любими от казармите (🏹).", "info");
                }
            };
        }
        container.appendChild(slot);
    }
};

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

    const goldDisplay = document.getElementById('val-gold');
    if (goldDisplay) goldDisplay.innerText = hero.gold || 0;

    const armyDisplay = document.getElementById('val-army');
    if (armyDisplay) armyDisplay.innerText = hero.armySize || 0;

    const powerDisplay = document.getElementById('val-hero-power');
    if (powerDisplay) powerDisplay.innerText = hero.heroPower || 100;

    const profileBox = document.getElementById('active-character-profile');
    if (profileBox) {
        let petStatus = "Няма";
        if (hero.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[hero.pet]) {
            const p = window.rpgDatabase.petsDatabase[hero.pet];
            petStatus = p.icon + " " + p.name;
        }
        profileBox.innerHTML = '<div style="text-align:center;">' +
            '<div style="font-weight:bold;font-size:1.2rem;">' + (hero.name || "Неизвестен") + '</div>' +
            '<div>Клан ' + (hero.clan || "Свободен") + ' | ' + getClassIcon(hero.currentClass) + ' Клас: ' + (hero.currentClass || "Багатур") + '</div>' +
            '<div>Ниво: ' + (hero.level || 1) + '</div>' +
            '<div>Възраст: ' + (hero.age || 50) + ' г.</div>' +
            '<div>Бойна Сила: ⚔️ ' + (hero.heroPower || 150) + '</div>' +
            '<div>Свободни точки: ' + (hero.skillPoints || 0) + '</div>' +
            '<div>Любимец: ' + petStatus + '</div>' +
            '</div>';
    }

    if (hero.portrait) {
        const profileBox = document.getElementById('active-character-profile');
        if (profileBox) {
            let existingImg = profileBox.querySelector('.hero-portrait-img');
            if (!existingImg) {
                const img = document.createElement('img');
                img.className = 'hero-portrait-img';
                img.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px; border: 2px solid #d4af37; object-fit: cover;';
                profileBox.insertBefore(img, profileBox.firstChild);
                existingImg = img;
            }
            existingImg.src = hero.portrait;
        }
    } else {
        const profileBox = document.getElementById('active-character-profile');
        if (profileBox) {
            const oldImg = profileBox.querySelector('.hero-portrait-img');
            if (oldImg) oldImg.remove();
        }
    }

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

    if (typeof window.renderFavoriteHeroesBar === 'function') {
        window.renderFavoriteHeroesBar();
    }
    
    const mobileProfile = document.getElementById('mobile-profile-section');
    if (mobileProfile) {
        const profileBox = mobileProfile.querySelector('#active-character-profile');
        if (profileBox) {
            const originalProfile = document.getElementById('active-character-profile');
            if (originalProfile) {
                profileBox.innerHTML = originalProfile.innerHTML;
                const rpgBtn = profileBox.querySelector('#open-rpg-modal-btn');
                if (rpgBtn && !rpgBtn.hasAttribute('data-mobile-fixed')) {
                    rpgBtn.onclick = function() {
                        if (window.openHeroRPGModal) window.openHeroRPGModal(window.currentHero.clan);
                    };
                    rpgBtn.setAttribute('data-mobile-fixed', 'true');
                }
            }
        }
    }
};

// ==================== ЖУРНАЛ НА СЪВЕТНИКА ====================
window.showAdvisorMsg = function(msg) { 
    const journal = document.getElementById('advisor-journal'); 
    if (!journal) { console.log("Журнал съветник:", msg); return; } 
    window.eventHistory.push(msg); 
    if (window.eventHistory.length > 50) window.eventHistory.shift(); 
    journal.innerHTML = window.eventHistory.map(function(line) { return '<p style="margin:4px 0; border-left:2px solid #ffaa44; padding-left:8px;">📜 ' + line + '</p>'; }).reverse().join(''); 
}; 

// ==================== ИНСПЕКЦИЯ НА ГЕРОЙ ====================
window.inspectHeroProfile = function(clanKey) { 
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) { 
        window.showAdvisorPopup("ГРЕШКА", "Неуспешно извличане на данни за избрания герой.", "error");
        return; 
    } 
    const hero = window.worldData.clans[clanKey]; 
    const oldProfile = document.getElementById('dynamic-hero-profile'); if (oldProfile) oldProfile.remove(); 
    let skillsHTML = "<h4>Придобити Способности (нови):</h4><ul>"; 
    let hasSkills = false; 
    if (hero.learnedSkills) { 
        for (let skillKey in hero.learnedSkills) { 
            let level = hero.learnedSkills[skillKey];
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
    if (hero.equipment) { 
        for (let i = 0; i < hero.equipment.length; i++) { 
            let item = hero.equipment[i];
            if (item) { inventoryHTML += item.icon + " "; hasEquipment = true; } 
        } 
    } 
    if (!hasEquipment) inventoryHTML += "Няма екипирани предмети."; 
    inventoryHTML += "</div>"; 
    
    const overlay = document.createElement('div'); 
    overlay.id = "dynamic-hero-profile"; 
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 5000; padding: 10px; box-sizing: border-box;"; 
    overlay.innerHTML = '<div style="background: rgba(0,0,0,0.9); border-radius: 32px; padding: 20px; max-width: 400px; width: 100%; text-align: center; border: 1px solid #c9a87b;"><h3 style="color:#ffdd99;">' + (hero.name || hero.hero) + '</h3><p>⚔️ ' + (hero.heroPower || 100) + ' Сила</p><p>Клан: ' + clanKey + '</p><p>Ниво: ' + (hero.level || 1) + '</p><p>Лично злато: ' + (hero.gold || 0) + '</p><p>Войска: ⚔️ ' + (hero.armySize || 0) + '</p><p>Клас: ' + (hero.currentClass || "Багатур") + '</p>' + skillsHTML + inventoryHTML + '<button id="close-profile-btn" style="background:#333; border:none; padding:8px 20px; border-radius:40px; color:#ffdd99; cursor:pointer;margin-top:15px;">🔒 ЗАТВОРИ</button></div>'; 
    document.body.appendChild(overlay); 
    document.getElementById('close-profile-btn').onclick = function() { overlay.remove(); }; 
};
window.inspectLeaderProfile = window.inspectHeroProfile;

// ==================== АДАПТИВНА ХОРИЗОНТАЛНА ЛЕНТА С ГЕРОИ (за десктоп) ====================
let currentContainer = null;

function createHeroCard(hero, isMobile) {
    let card = document.createElement('div');
    let needXP = 100 + (hero.level - 1) * 50;
    let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
    let xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
    let fav = isFavorite(hero.id);
    const classIcon = getClassIcon(hero.className);
    
    const portraitHtml = hero.portrait ? 
        `<div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #2c1a0c; flex-shrink: 0;">
            <img src="${hero.portrait}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>` : 
        `<div style="font-size:22px; flex-shrink: 0;">${classIcon}</div>`;
    
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
            ${portraitHtml}
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

function renderSingleBar() {
    let heroes = getAllHeroes();
    if (heroes.length === 0) return;
    
    let isMobile = window.innerWidth <= 768;
    
    if (currentContainer) currentContainer.remove();
    currentContainer = document.createElement('div');
    currentContainer.id = 'single-hero-bar';
    currentContainer.style.cssText = isMobile ? 
        `position: sticky; top: 0; left: 0; right: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid #c9a87b; padding: 6px 12px; overflow-x: auto; white-space: nowrap; z-index: 1000;` : 
        `margin-top: 15px; background: transparent;`;
    
    if (isMobile) {
        let topBar = document.querySelector('#top-bar');
        if (topBar && topBar.parentNode) topBar.insertAdjacentElement('afterend', currentContainer);
        else document.body.insertBefore(currentContainer, document.body.firstChild);
    } else {
        let target = document.getElementById('clans-container');
        if (target && target.parentNode) target.insertAdjacentElement('afterend', currentContainer);
        else document.body.appendChild(currentContainer);
    }
    
    let listContainer = document.createElement('div');
    listContainer.style.cssText = isMobile ? `display: flex; gap: 10px; flex-direction: row;` : `display: flex; gap: 8px; flex-direction: column;`;
    currentContainer.appendChild(listContainer);
    
    heroes.forEach(hero => { listContainer.appendChild(createHeroCard(hero, isMobile)); });
}

// ==================== СТАРТИРАНЕ НА ЛЕНТАТА ====================
function initHeroBar() {
    renderSingleBar();
    window.addEventListener('resize', () => renderSingleBar());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroBar);
} else {
    initHeroBar();
}

// ==================== АВТОМАТИЧНО ДОБАВЯНЕ НА НАВИГАЦИОННИ БУТОНИ ====================
setTimeout(function addNavButtonsAutomatically() {
    const heroBar = document.getElementById('single-hero-bar');
    if (!heroBar) { setTimeout(addNavButtonsAutomatically, 500); return; }
    if (document.getElementById('hero-nav-prev')) return;
    
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

// ==================== АДАПТИВНИ БУТОНИ (ЦЯЛ ЕКРАН, ОТКРИЙ, ЕЛИТ) ====================
function setupResponsiveButtons() {
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
    
    let discoverBtn = document.getElementById('discover-lands-btn');
    if (!discoverBtn && document.querySelector('.top-bar-controls') && window.innerWidth > 600) {
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
                    window.showAdvisorPopup("ОТКРИТИЕ", `Открихте ${generated} нови региона!`, "info");
                }
                if (document.getElementById('regions-map-overlay') && typeof window.openRegionsMap === 'function') {
                    window.openRegionsMap();
                }
            } else {
                window.showAdvisorPopup("ГРЕШКА", "Системата за генериране на региони не е заредена.", "error");
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupResponsiveButtons);
} else {
    setupResponsiveButtons();
}

// ==================== МОБИЛНА АДАПТАЦИЯ – БЕЗ ДУБЛИРАНЕ НА ЛЕНТИ ====================
let isMobileLayoutActive = false;

function setupMobileLayout() {
    const isMobile = window.innerWidth <= 600;
    
    if (isMobile && !isMobileLayoutActive) {
        isMobileLayoutActive = true;
        
        const topBarControls = document.querySelector('.top-bar-controls');
        if (!topBarControls) return;
        
        const newGameContainer = document.querySelector('.new-game-menu-container');
        if (newGameContainer && topBarControls.firstChild !== newGameContainer) {
            topBarControls.insertBefore(newGameContainer, topBarControls.firstChild);
        }
        
        if (newGameContainer) {
            const newGameBtn = newGameContainer.querySelector('.glass-btn');
            if (newGameBtn) {
                newGameBtn.innerHTML = '🎮';
                newGameBtn.style.fontSize = '1.2rem';
                newGameBtn.style.padding = '0';
                newGameBtn.style.width = '36px';
                newGameBtn.style.height = '36px';
                newGameBtn.style.display = 'flex';
                newGameBtn.style.alignItems = 'center';
                newGameBtn.style.justifyContent = 'center';
            }
        }
        
      
        
        if (!document.querySelector('.all-heroes-btn')) {
            const allHeroesBtn = document.createElement('button');
            allHeroesBtn.className = 'glass-btn all-heroes-btn';
            allHeroesBtn.innerHTML = '👥';
            allHeroesBtn.setAttribute('aria-label', 'Всички герои');
            allHeroesBtn.onclick = () => showAllHeroesModal();
            topBarControls.appendChild(allHeroesBtn);
        }
        
        const discoverBtn = document.getElementById('discover-lands-btn');
        if (discoverBtn) discoverBtn.remove();
        
        moveSidebarContentToMain();
        
    } else if (!isMobile && isMobileLayoutActive) {
        isMobileLayoutActive = false;
        
        const newGameContainer = document.querySelector('.new-game-menu-container');
        if (newGameContainer) {
            const newGameBtn = newGameContainer.querySelector('.glass-btn');
            if (newGameBtn) {
                newGameBtn.innerHTML = '🎮 Нова игра / Продължи';
                newGameBtn.style.cssText = '';
            }
        }
        
        const menuBtn = document.querySelector('.menu-toggle');
        if (menuBtn) menuBtn.remove();
        
        const allHeroesBtn = document.querySelector('.all-heroes-btn');
        if (allHeroesBtn) allHeroesBtn.remove();
        
        if (typeof setupResponsiveButtons === 'function') {
            setupResponsiveButtons();
        }
        
        restoreSidebarContent();
        
        const mobileMenu = document.getElementById('mobile-menu-panel');
        if (mobileMenu) mobileMenu.remove();
    }
}

function toggleMobileMenu() {
    let menu = document.getElementById('mobile-menu-panel');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'mobile-menu-panel';
        const buttonsToClone = document.querySelectorAll('.top-bar-controls .glass-btn:not(.menu-toggle):not(.all-heroes-btn)');
        buttonsToClone.forEach(btn => {
            if (btn.closest('.new-game-menu-container')) return;
            const clone = btn.cloneNode(true);
            if (btn.onclick) clone.onclick = btn.onclick;
            else if (btn.getAttribute('onclick')) clone.setAttribute('onclick', btn.getAttribute('onclick'));
            menu.appendChild(clone);
        });
        document.body.appendChild(menu);
    } else {
        menu.remove();
    }
}

function moveSidebarContentToMain() {
    const mainArea = document.getElementById('game-main-area');
    const leftSidebar = document.getElementById('sidebar-left');
    const rightSidebar = document.getElementById('sidebar-right');
    if (!mainArea || !leftSidebar || !rightSidebar) return;
    
    if (!document.getElementById('mobile-profile-section') && leftSidebar.innerHTML.trim() !== '') {
        const profileClone = leftSidebar.cloneNode(true);
        profileClone.id = 'mobile-profile-section';
        profileClone.classList.add('mobile-section');
        mainArea.prepend(profileClone);
    }
    
    if (!document.getElementById('mobile-portal-section') && rightSidebar.innerHTML.trim() !== '') {
        const portalClone = rightSidebar.cloneNode(true);
        portalClone.id = 'mobile-portal-section';
        portalClone.classList.add('mobile-section');
        mainArea.appendChild(portalClone);
    }
    
    leftSidebar.style.display = 'none';
    rightSidebar.style.display = 'none';
    
    const mobileProfile = document.getElementById('mobile-profile-section');
    if (mobileProfile) {
        const rpgBtn = mobileProfile.querySelector('#open-rpg-modal-btn');
        if (rpgBtn && !rpgBtn.hasAttribute('data-mobile-fixed')) {
            rpgBtn.onclick = function() {
                if (window.openHeroRPGModal) window.openHeroRPGModal(window.currentHero.clan);
            };
            rpgBtn.setAttribute('data-mobile-fixed', 'true');
        }
    }
}

function restoreSidebarContent() {
    const leftSidebar = document.getElementById('sidebar-left');
    const rightSidebar = document.getElementById('sidebar-right');
    if (leftSidebar) leftSidebar.style.display = '';
    if (rightSidebar) rightSidebar.style.display = '';
    
    const mobileProfile = document.getElementById('mobile-profile-section');
    const mobilePortal = document.getElementById('mobile-portal-section');
    if (mobileProfile) mobileProfile.remove();
    if (mobilePortal) mobilePortal.remove();
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => setupMobileLayout(), 150);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupMobileLayout());
} else {
    setupMobileLayout();
}

function showAllHeroesModal() {
    const heroes = getAllHeroes();
    if (!heroes.length) return;

    let modal = document.getElementById('all-heroes-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'all-heroes-modal';
    modal.className = 'market-modal';
    modal.style.cssText = 'z-index: 200001;';

    let gridHtml = '<div class="modal-content all-heroes-grid" style="max-width: 95%; width: 95%; padding: 15px; overflow-y: auto; max-height: 85vh;">';
    gridHtml += '<h3 style="color:#ffd700; text-align:center;">🏰 Всички герои</h3>';
    gridHtml += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">';

    heroes.forEach(hero => {
        const needXP = 100 + (hero.level - 1) * 50;
        const currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
        const xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
        const classIcon = getClassIcon(hero.className);
        const isFavoriteHero = hero.isFavorite || false;
        const favoriteIcon = isFavoriteHero ? '❤️' : '🤍';

        gridHtml += `
            <div class="hero-grid-card" data-id="${hero.id}" data-class="${hero.className}" style="background: rgba(0,0,0,0.6); border: 1px solid #c9a87b; border-radius: 12px; padding: 8px; cursor: pointer; transition: 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 24px;">${classIcon}</div>
                    <button class="favorite-toggle" data-id="${hero.id}" style="background: none; border: none; font-size: 18px; cursor: pointer;">${favoriteIcon}</button>
                </div>
                <div style="font-weight: bold; color: #ffdd99; font-size: 12px;">${hero.name}</div>
                <div style="font-size: 9px; color: #ccaa77;">${hero.className} · Ниво ${hero.level}</div>
                <div style="background: #2a1a0a; height: 4px; border-radius: 2px; margin: 4px 0;">
                    <div style="background: #44aa44; height: 100%; width: ${xpPercent}%; border-radius: 2px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; margin-top: 4px;">
                    <span>💪 ${hero.power}</span>
                    <span>💰 ${hero.gold}</span>
                    <span>⚔️ ${hero.army}</span>
                </div>
                <div style="font-size: 7px; color: #aaa;">${hero.isAuto ? '🤖 Auto' : '👤 Manual'}</div>
            </div>
        `;
    });

    gridHtml += '</div><button class="close-modal-btn" style="margin-top: 15px; background: #2c1a0c; border: none; border-radius: 30px; padding: 8px; color: #ffdd99; cursor: pointer; width: 100%;">Затвори</button></div>';
    modal.innerHTML = gridHtml;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal-btn').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll('.favorite-toggle').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const heroId = btn.getAttribute('data-id');
            const hero = heroes.find(h => h.id == heroId);
            if (hero) {
                if (typeof window.toggleHeroFavoriteInBarracks === 'function') {
                    window.toggleHeroFavoriteInBarracks(hero.name);
                } else {
                    hero.isFavorite = !hero.isFavorite;
                    if (window.saveFavoriteHeroes) window.saveFavoriteHeroes();
                }
                btn.innerText = hero.isFavorite ? '❤️' : '🤍';
            }
        };
    });

    modal.querySelectorAll('.hero-grid-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-toggle')) return;
            const heroId = card.getAttribute('data-id');
            const hero = heroes.find(h => h.id == heroId);
            if (hero && typeof window.showHeroProfile === 'function') {
                modal.remove();
                window.showHeroProfile(hero);
            }
        });
    });
}

// ==================== ФОРСИРАНО ДОБАВЯНЕ НА ХАМБУРГЕР МЕНЮ ЗА ТЕЛЕФОНИ ====================
(function forceHamburgerMenu() {
    function createHamburgerButton() {
        if (document.querySelector('.menu-toggle')) {
            return;
        }
        
        const topBarControls = document.querySelector('.top-bar-controls');
        if (!topBarControls) {
            setTimeout(createHamburgerButton, 500);
            return;
        }
        
        const menuBtn = document.createElement('button');
        menuBtn.className = 'glass-btn menu-toggle';
        menuBtn.innerHTML = '☰';
        menuBtn.setAttribute('aria-label', 'Меню');
        menuBtn.style.cssText = `
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 1.6rem !important;
            background: rgba(212, 175, 55, 0.4) !important;
            border-radius: 50% !important;
            margin: 0 5px !important;
            color: #ffd700 !important;
            border: 1px solid #d4af37 !important;
            cursor: pointer !important;
            z-index: 1000 !important;
        `;
        
        const newGameContainer = document.querySelector('.new-game-menu-container');
        if (newGameContainer) {
            newGameContainer.insertAdjacentElement('afterend', menuBtn);
        } else {
            topBarControls.prepend(menuBtn);
        }
        
        menuBtn.onclick = function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        };
    }
    
    if (typeof window.toggleMobileMenu !== 'function') {
        window.toggleMobileMenu = function() {
            let menu = document.getElementById('mobile-menu-panel');
            if (!menu) {
                menu = document.createElement('div');
                menu.id = 'mobile-menu-panel';
                menu.style.cssText = `
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(12px);
                    border-top: 2px solid #d4af37;
                    z-index: 200000;
                    padding: 12px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 10px;
                    border-radius: 20px 20px 0 0;
                `;
                const buttonsToClone = document.querySelectorAll('.top-bar-controls .glass-btn:not(.menu-toggle):not(.all-heroes-btn)');
                buttonsToClone.forEach(btn => {
                    if (btn.closest('.new-game-menu-container')) return;
                    const clone = btn.cloneNode(true);
                    if (btn.onclick) clone.onclick = btn.onclick;
                    else if (btn.getAttribute('onclick')) clone.setAttribute('onclick', btn.getAttribute('onclick'));
                    menu.appendChild(clone);
                });
                document.body.appendChild(menu);
            } else {
                menu.remove();
            }
        };
    }
    
    function init() {
        if (window.innerWidth <= 600) {
            createHamburgerButton();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 600 && !document.querySelector('.menu-toggle')) {
            createHamburgerButton();
        } else if (window.innerWidth > 600 && document.querySelector('.menu-toggle')) {
            const btn = document.querySelector('.menu-toggle');
            if (btn) btn.remove();
            const menu = document.getElementById('mobile-menu-panel');
            if (menu) menu.remove();
        }
    });
})();

// ==================== ИНИЦИАЛИЗАЦИЯ НА НОВАТА ЛЕНТА С ЛЮБИМИ ГЕРОИ ====================
setTimeout(() => {
    if (typeof window.renderFavoriteHeroesBar === 'function') {
        window.renderFavoriteHeroesBar();
    }
}, 500);

window.openHeroRPGModal = function(heroId) {
    let hero = null;
    if (heroId && window.worldData?.clans?.[heroId]) hero = window.worldData.clans[heroId];
    else if (window.currentHero) hero = window.currentHero;
    if (!hero) return;
    if (typeof window.showHeroProfile === 'function') window.showHeroProfile(hero);
    else console.warn("showHeroProfile не е дефинирана");
};
