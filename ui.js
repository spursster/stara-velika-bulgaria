/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ И ИНСПЕКЦИЯ НА ВЛАДЕТЕЛИТЕ)
 * ОПИСАНИЕ: Управление на UI. Времето е преместено отляво. Текстът на експедициите се скрива на телефон.
 * СТАТУС: СТАБИЛНА СТАРТОВА ВЕРСИЯ
 * Статистика на файловете в проекта: 15
 * ==========================================================================
 */

window.eventHistory = [];  

if (!window.autoLevelState) {
    window.autoLevelState = {};
}

/**
 * Глобална функция за превключване на Цял Екран (Full Screen)
 */
window.toggleGameFullScreen = function() {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        
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

/**
 * ГЛОБАЛЕН РЕНДЕР НА ТОП 6 КАРТИ НА ВЛАДЕТЕЛИТЕ
 */
window.renderTop6LeadersUI = function() {
    const container = document.getElementById('top6-leaders-container');
    if (!container) return;

    container.innerHTML = '';
    let allLeaders = [];

    // 1. Включване на текущия главен герой (ако съществува)
    if (window.currentHero) {
        let currentLvl = window.currentHero.level || 1;
        let xpReq = currentLvl * 150;
        let xpPct = Math.min(100, Math.floor(((window.currentHero.xp || 0) / xpReq) * 100));

        allLeaders.push({
            name: window.currentHero.name,
            dynasty: window.currentHero.dynasty || "Главен Род",
            heroPower: window.currentHero.heroPower || 100,
            gold: window.currentHero.gold || 0,
            armySize: window.currentHero.armySize || 0,
            age: window.currentHero.age || 30,
            isMain: true,
            level: currentLvl,
            xpPercent: xpPct,
            currentClass: window.currentHero.currentClass || "Пълководец"
        });
    }

    // 2. Събиране на останалите отключени/закупени водачи от глобалната база
    if (window.worldData && window.worldData.clans) {
        Object.values(window.worldData.clans).forEach(ml => {
            if (!ml || !ml.name) return;
            if (window.currentHero && ml.name === window.currentHero.name) return;
            
            if (ml.purchased || ml.owned || ml.isUnlocked || ml.isJoined) {
                let power = ml.heroPower || 100;
                let calculatedLevel = Math.max(1, Math.floor((power - 100) / 25) + 1);
                let xpReq = calculatedLevel * 150;
                let xpPct = ml.xpPercent !== undefined ? ml.xpPercent : (ml.xp ? Math.min(100, Math.floor((ml.xp / xpReq) * 100)) : 0);
                
                allLeaders.push({
                    name: ml.name,
                    dynasty: ml.dynasty || "Васал",
                    heroPower: power,
                    gold: ml.gold || 0,
                    armySize: ml.armySize || 0,
                    age: ml.age || 30,
                    isMain: false,
                    level: calculatedLevel,
                    xpPercent: xpPct,
                    currentClass: ml.currentClass || "Пълководец"
                });
            }
        });
    }

    // Вземане на първите 6 лидера за показване
    let displayLeaders = allLeaders.slice(0, 6);

    displayLeaders.forEach(leader => {
        if (window.autoLevelState[leader.name] === undefined) {
            window.autoLevelState[leader.name] = false;
        }
        let isAuto = window.autoLevelState[leader.name];

        let card = document.createElement('div');
        card.className = 'leader-rpg-card' + (leader.isMain ? ' main-hero-card' : '');
        if (leader.isMain) card.style.border = "2px solid #ffaa00";

        let safeName = encodeURIComponent(leader.name);

        card.innerHTML = `
            <div onclick="window.selectAndOpenLeaderInventory('${safeName}')" style="cursor:pointer; width:100%;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; color:${leader.isMain ? '#ffaa00' : '#d4af37'}; font-size:13px;">${leader.name}</span>
                    <span style="font-size:10px; opacity:0.7; background:rgba(0,0,0,0.3); padding:2px 5px; border-radius:3px;">${leader.dynasty}</span>
                </div>
                <div style="font-size:11px; color:#aaa; margin:2px 0;">${leader.currentClass}</div>
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-size:11px;">
                    <span>👑 Н. ${leader.level}</span>
                    <span>🛡️ Мощ: ${leader.heroPower}</span>
                </div>
                <div style="width:100%; background:#222; height:4px; border-radius:2px; margin-top:5px; overflow:hidden;">
                    <div style="width:${leader.xpPercent}%; background:#00ffcc; height:100%;"></div>
                </div>
            </div>
            <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center; width:100%;">
                <span style="font-size:10px; color:#888;">⚔️ ${leader.armySize} | 💰 ${leader.gold}</span>
                <button onclick="event.stopPropagation(); if(window.toggleAutoLevel){ window.toggleAutoLevel('${safeName}'); window.renderTop6LeadersUI(); }" 
                        style="padding:2px 6px; font-size:9px; cursor:pointer; background:${isAuto ? '#00ff55' : '#444'}; color:${isAuto ? '#000' : '#fff'}; border:none; border-radius:3px; font-weight:bold;">
                    ${isAuto ? 'AUTO ON' : 'AUTO OFF'}
                </button>
            </div>
        `;
        container.appendChild(card);
    });
};

/**
 * ПРЕВКЛЮЧВАНЕ НА АВТОМАТИЧНОТО LEVEL-UP СЪСТОЯНИЕ
 */
window.toggleAutoLevel = function(escapedName) {
    let name = decodeURIComponent(escapedName);
    if (!window.autoLevelState) window.autoLevelState = {};
    window.autoLevelState[name] = !window.autoLevelState[name];
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`⚙️ АВТОМАТИЗАЦИЯ: Автоматичното обучение за ${name} е ${window.autoLevelState[name] ? 'АКТИВИРАНО' : 'ДЕАКТИВИРАНО'}.`);
    }
};

/**
 * ОБНОВЯВАНЕ НА ИНТЕРФЕЙСА НА ВЛАДЕТЕЛИТЕ
 */
window.updateLeadersUI = function() {
    if (window.renderTop6LeadersUI) {
        window.renderTop6LeadersUI();
    }
};

/**
 * ИЗПЪЛНЕНИЕ НА АВТОМАТИЧНОТО КУПУВАНЕ НА УМЕНИЯ
 */
window.checkAndExecuteAutoLevel = function(leader) {
    if (!leader || !window.autoLevelState || !window.autoLevelState[leader.name]) return;
    
    if (leader.skillPoints && leader.skillPoints > 0 && window.rpgDatabase && window.rpgDatabase.skillTrees) {
        leader.skills = leader.skills || {};
        let availableSkills = Object.keys(window.rpgDatabase.skillTrees);
        
        if (availableSkills.length > 0) {
            let randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
            leader.skills[randomSkill] = (leader.skills[randomSkill] || 0) + 1;
            leader.skillPoints--;
            
            if (window.checkAndEvolutionClass) {
                window.checkAndEvolutionClass(leader);
            }
        }
    }
};

/**
 * ОТВАРЯНЕ НА ПРОФИЛА И ИНСПЕКЦИЯТА НА ДАДЕН ЛИДЕР
 */
window.selectAndOpenLeaderInventory = function(escapedName) {
    let name = decodeURIComponent(escapedName);
    let leader = null;

    if (window.currentHero && window.currentHero.name === name) {
        leader = window.currentHero;
    } else if (window.worldData && window.worldData.clans) {
        Object.values(window.worldData.clans).forEach(ml => {
            if (ml && ml.name === name) leader = ml;
        });
    }

    if (!leader) {
        if (window.unlockedLeaders && window.unlockedLeaders[name]) {
            leader = window.unlockedLeaders[name];
        }
    }

    if (!leader) {
        alert("Владетелят не е намерен в текущите анализи.");
        return;
    }

    const oldModal = document.getElementById('dynamic-leader-profile');
    if (oldModal) oldModal.remove();

    let power = leader.heroPower || 100;
    let currentClass = leader.currentClass || "Пълководец";

    let skillsHTML = '<div style="margin-top: 10px;"><strong style="color: #ffaa00; font-size: 11px;">РАЗВИТИ УМЕНИЯ:</strong>';
    if (leader.skills && Object.keys(leader.skills).length > 0) {
        skillsHTML += '<ul style="margin: 5px 0; padding-left: 15px; font-size: 11px; color: #ccc;">';
        Object.entries(leader.skills).forEach(([sKey, lvl]) => {
            if (lvl > 0) {
                let sName = (window.rpgDatabase && window.rpgDatabase.skillTrees[sKey]) ? window.rpgDatabase.skillTrees[sKey].name : sKey;
                skillsHTML += `<li>${sName}: Ниво ${lvl}</li>`;
            }
        });
        skillsHTML += '</ul>';
    } else {
        skillsHTML += '<div style="font-size: 11px; color: #666; font-style: italic;">Няма разпределени точки.</div>';
    }
    skillsHTML += '</div>';

    let inventoryHTML = '<div style="margin-top: 10px;"><strong style="color: #ffaa00; font-size: 11px;">СЪКРОВИЩНИЦА И ИНВЕНТАР:</strong>';
    if (leader.inventory && leader.inventory.length > 0) {
        inventoryHTML += '<div style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px;">';
        leader.inventory.forEach(item => {
            inventoryHTML += `<div style="background: rgba(255,255,255,0.05); border: 1px solid #444; padding: 4px 8px; border-radius: 4px; font-size: 10px; color: #fff;">📦 ${item.name || item}</div>`;
        });
        inventoryHTML += '</div>';
    } else {
        inventoryHTML += '<div style="font-size: 11px; color: #666; font-style: italic;">Празен инвентар.</div>';
    }
    inventoryHTML += '</div>';

    const profileModal = document.createElement('div');
    profileModal.id = 'dynamic-leader-profile';
    profileModal.style = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 320px; background: #111; border: 2px solid #d4af37; box-shadow: 0 0 20px rgba(0,0,0,0.8); z-index: 10000; border-radius: 8px; padding: 15px; font-family: sans-serif; color: #fff;";
    
    profileModal.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #333; padding-bottom: 8px;">
                <div>
                    <h3 style="margin: 0; color: #d4af37; font-size: 16px;">${leader.name || name}</h3>
                    <div style="font-size: 12px; color: #ffaa00; font-weight: bold; text-transform: uppercase; margin-top: 2px;">${currentClass}</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #888;">МОЩ</div>
                    <div style="font-size: 15px; color: #ff3366; font-weight: bold;">⚔️ ${power}</div>
                </div>
            </div>

            ${skillsHTML}
            ${inventoryHTML}

            <button onclick="document.getElementById('dynamic-leader-profile').remove()" style="width: 100%; margin-top: 15px; padding: 10px; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; border-radius: 6px; color: #fff; font-family: 'Cinzel', serif; cursor: pointer; font-size: 11px; transition: background 0.2s;" onmouseover=\"this.style.background='rgba(212,175,55,0.3)'\" onmouseout=\"this.style.background='rgba(212,175,55,0.15)'\">Затвори профила</button>
        </div>
    `;

    document.body.appendChild(profileModal);
};

const UI = {
    init() {
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.currentHero && window.updateCharacterUI) window.updateCharacterUI();
    }
};

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => { UI.init(); });
}
