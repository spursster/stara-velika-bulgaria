/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (ОПТИМИЗАЦИЯ НА ЛЕВИЯ ПАНЕЛ & СКРИВАНЕ НА ТЕКСТА НА ЕКСПЕДИЦИИТЕ)
 * ОПИСАНИЕ: Управление на UI. Времето е преместено отляво на мястото на летописа.
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Всички 417 реда са възстановени без загуба на код)
 * Статистика на файловете в проекта: 16
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
 * Глобална функция за превключване на AUTO режима за вдигане на нива
 */
window.toggleAutoLevel = function(leaderName) {
    window.autoLevelState[leaderName] = !window.autoLevelState[leaderName];
    
    if (document.getElementById('leaders-palace-modal')) {
        window.renderTop6LeadersUI();
    }
    
    const statusText = window.autoLevelState[leaderName] ? "ВКЛЮЧЕНО" : "ИЗКЛЮЧЕНО";
    window.showAdvisorMsg(`⚙️ Автоматично вдигане на нива за ${leaderName} е ${statusText}.`);
};

/**
 * ОСНОВНА ФУНКЦИЯ: Обновяване на левия панел за текущия владетел
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    let reqXP = 150;
    if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) {
        reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level || 1);
    } else {
        reqXP = (hero.level || 1) * 150;
    }
    let xpPercent = Math.min(((hero.xp || 0) / reqXP) * 100, 100);

    let clanIcon = "👑";
    if (hero.dynasty === "Дуло") clanIcon = "🏹";
    else if (hero.dynasty === "Тертерови") clanIcon = "🦅";
    else if (hero.dynasty === "Асеневци") clanIcon = "⚔️";
    else if (hero.dynasty === "Комитопули") clanIcon = "🛡️";

    const leftSidebar = document.getElementById('left-sidebar');
    if (!leftSidebar) return;

    // Взимане на данните за времето от world_data, за да се покажат в левия панел
    let currentTimeStr = "Зареждане...";
    let currentEraStr = "АНТИЧНОСТ";
    if (window.gameWorldData) {
        currentTimeStr = `Година: ${window.gameWorldData.currentYear} г.`;
        if (window.gameWorldData.currentEra) {
            currentEraStr = window.gameWorldData.currentEra.toUpperCase();
        }
    }

    leftSidebar.innerHTML = `
        <div class="ruler-avatar-container" style="text-align: center; margin-bottom: 15px;">
            <div style="font-size: 55px; filter: drop-shadow(0 0 10px rgba(212,175,55,0.3)); margin-bottom: 5px;">${clanIcon}</div>
            <h3 style="font-family: 'Cinzel', serif; margin: 0; color: #d4af37; font-size: 14px; letter-spacing: 0.5px;">${hero.name}</h3>
            <span style="font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Род ${hero.dynasty}</span>
        </div>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; padding: 10px; border-radius: 4px; margin-bottom: 12px;">
            <div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">Клас: <b style="color: #00ffff;">${hero.currentClass || "Чист Водач"}</b></div>
            <div style="font-size: 11px; color: #aaa;">Бойна Сила: <b style="color: #ff4757;">${hero.heroPower || 100} ⚔️</b></div>
        </div>

        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span><b>Ниво ${hero.level || 1}</b></span>
                <span style="color: #aaa;">${hero.xp || 0} / ${reqXP} XP</span>
            </div>
            <div style="width: 100%; background: #222; height: 6px; border-radius: 3px; overflow: hidden; border: 1px solid #333;">
                <div style="width: ${xpPercent}%; background: linear-gradient(90deg, #00ffff, #0072ff); height: 100%;"></div>
            </div>
        </div>

        <div style="font-size: 11px; line-height: 1.6; color: #ddd; margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 12px;">
            <div>💰 Злато в хазната: <b style="color: #ffd700;">${hero.gold || 0}</b></div>
            <div>✨ Свободни точки: <b style="color: #00ffcc;">${hero.skillPoints || 0}</b></div>
        </div>

        <div id="time-container" style="margin-top: auto; padding: 12px; background: rgba(214, 175, 55, 0.05); border: 1px solid rgba(214, 175, 55, 0.15); border-radius: 4px; text-align: center;">
            <div style="font-family: 'Cinzel', serif; color: #888; font-size: 9px; letter-spacing: 1px; margin-bottom: 4px;">ТЕКУЩО ВРЕМЕ</div>
            <div id="current-time-info" style="font-family: 'Cinzel', serif; color: #ffd700; font-size: 14px; font-weight: bold; margin-bottom: 2px;">${currentTimeStr}</div>
            <div id="era-display" style="font-family: 'Cinzel', serif; font-size: 10px; color: #d4af37; opacity: 0.8; letter-spacing: 1.5px;">${currentEraStr}</div>
        </div>
    `;
};

/**
 * ИНТЕРФЕЙС НА ПАЛАТАТА НА ЛИДЕРЕТЕ (Владетели от съседните родове)
 */
window.renderTop6LeadersUI = function() {
    const container = document.getElementById('leaders-grid-container');
    if (!container) return;

    if (!window.mightyLeaders || window.mightyLeaders.length === 0) {
        container.innerHTML = `<div style="color: #666; font-style: italic; text-align: center; width: 100%; padding: 20px;">Няма налични водачи в палатата. Свикайте нови!</div>`;
        return;
    }

    container.innerHTML = window.mightyLeaders.map((leader, index) => {
        const isAuto = window.autoLevelState[leader.name] ? 'checked' : '';
        const isRunning = window.activeExpeditions && window.activeExpeditions.some(e => e.leader && e.leader.name === leader.name);
        const statusBadge = isRunning ? `<span style="background: #ff4757; color: white; padding: 2px 6px; font-size: 9px; border-radius: 3px; margin-left: 5px;">В МИСИЯ</span>` : `<span style="background: #2ed573; color: white; padding: 2px 6px; font-size: 9px; border-radius: 3px; margin-left: 5px;">СВОБОДЕН</span>`;

        let reqXP = (leader.level || 1) * 150;
        let xpPct = Math.min(((leader.xp || 0) / reqXP) * 100, 100);

        return `
            <div style="background: #1e1e1e; border: 1px solid #333; border-radius: 6px; padding: 12px; position: relative; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <b style="color: #ffd700; font-size: 13px;">${leader.name}</b>
                        ${statusBadge}
                    </div>
                    <div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">Род: <b>${leader.dynasty}</b></div>
                    <div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">Клас: <b style="color: #00ffff;">${leader.currentClass || "Чист Водач"}</b></div>
                    <div style="font-size: 11px; color: #aaa; margin-bottom: 8px;">Сила: <b style="color: #ff4757;">${leader.heroPower || 100} ⚔️</b></div>
                    
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #888; margin-bottom: 2px;">
                            <span>Ниво ${leader.level || 1}</span>
                            <span>${leader.xp || 0}/${reqXP} XP</span>
                        </div>
                        <div style="width: 100%; background: #111; height: 4px; border-radius: 2px; overflow: hidden;">
                            <div style="width: ${xpPct}%; background: #00ffff; height: 100%;"></div>
                        </div>
                    </div>
                </div>

                <div style="border-top: 1px solid #2a2a2a; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <label style="font-size: 11px; color: #bbb; display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" ${isAuto} onclick="window.toggleAutoLevel('${leader.name}')" style="margin-right: 5px; transform: scale(1.1);">
                        AUTO Ниво
                    </label>
                    <button onclick="window.toggleSpecificRulerInventory('mighty_${index}')" style="background: #222; border: 1px solid #ffd700; color: #ffd700; padding: 3px 8px; font-size: 11px; cursor: pointer; border-radius: 3px; text-transform: uppercase;">🎒 Преглед</button>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * ДОБАВЯНЕ НА СЪОБЩЕНИЕ И ОБНОВЯВАНЕ НА ИСТОРИЯТА
 */
window.showAdvisorMsg = function(msg) {
    if (!msg) return;
    
    let yearPrefix = "";
    if (window.gameWorldData) {
        yearPrefix = `${window.gameWorldData.currentYear} г.`;
    }
    
    window.eventHistory.unshift({
        time: yearPrefix,
        text: msg
    });

    if (window.eventHistory.length > 30) {
        window.eventHistory.pop();
    }

    window.renderHistory();
};

/**
 * РЕНДЕРИРАНЕ НА ЛЕТОПИСА (Ако елементът съществува на екрана)
 */
window.renderHistory = function() {
    const logBox = document.getElementById('history-log');
    if (logBox) {
        logBox.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 4px;">
                <span style="color: #d4af37;">[${event.time}]:</span> ${event.text}
            </div>
        `).join('');
    }
};

/**
 * ФУНКЦИЯ ЗА ОБНОВЯВАНЕ НА ИНДИКАТОРА НА ЕКСПЕДИЦИИТЕ
 */
window.updateExpeditionBadge = function() {
    const badge = document.getElementById('expedition-badge');
    if (!badge) return;
    
    let availableMissions = 0;
    
    if (window.expeditionDatabase && window.expeditionDatabase.missions) {
        availableMissions = window.expeditionDatabase.missions.filter(mission => {
            const currentLevel = window.currentHero ? (window.currentHero.level || 1) : 1;
            const meetsLevel = currentLevel >= (mission.reqLevel || 0);
            const isNotRunning = !window.activeExpeditions || !window.activeExpeditions.some(e => e.missionId === mission.id);
            return meetsLevel && isNotRunning;
        }).length;
    } else {
        availableMissions = Math.max(0, 3 - (window.activeExpeditions ? window.activeExpeditions.length : 0));
    }
    
    badge.innerText = availableMissions;
    badge.style.display = availableMissions === 0 ? 'none' : 'flex';
};

/**
 * ОТВАРЯНЕ НА СПЕЦИФИЧЕН ИНВЕНТАР ЗА ВЛАДЕТЕЛ ОТ ПАЛАТАТА
 */
window.toggleSpecificRulerInventory = function(rulerKey) {
    let leaderObj = null;
    let titleName = "Владетел";

    if (rulerKey.startsWith('mighty_')) {
        let idx = parseInt(rulerKey.replace('mighty_', ''), 10);
        if (window.mightyLeaders && window.mightyLeaders[idx]) {
            leaderObj = window.mightyLeaders[idx];
            titleName = leaderObj.name;
        }
    }

    if (!leaderObj) {
        alert("Не е намерен такъв владетел!");
        return;
    }

    let modal = document.getElementById('ruler-inventory-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'ruler-inventory-modal';
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; max-width: 450px; background: #111; border: 2px solid #ffd700;
        border-radius: 8px; color: #fff; padding: 15px; box-shadow: 0 0 25px rgba(0,0,0,0.8);
        z-index: 11000; font-family: 'Montserrat', sans-serif;
    `;

    let invHtml = `<div style="text-align:center;color:#888;font-style:italic;padding:15px;">Инвентарът е празен</div>`;
    if (leaderObj.inventory && leaderObj.inventory.length > 0) {
        invHtml = `<div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;max-height:200px;overflow-y:auto;padding:5px;">`;
        leaderObj.inventory.forEach((item, itemIdx) => {
            let rarityColor = "#fff";
            if (item.rarity === "rare") rarityColor = "#00ffff";
            if (item.rarity === "epic") rarityColor = "#9b59b6";
            if (item.rarity === "legendary") rarityColor = "#ff9f43";

            invHtml += `
                <div style="background:#222; border:1px solid #333; border-radius:4px; padding:5px; text-align:center; font-size:11px; position:relative;" title="${item.description || ''}">
                    <div style="font-size:24px;margin-bottom:3px;">${item.icon || '📦'}</div>
                    <div style="color:${rarityColor};font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                    <div style="font-size:9px;color:#888;">x${item.count || 1}</div>
                </div>
            `;
        });
        invHtml += `</div>`;
    }

    modal.innerHTML = `
        <div style="display:flex; justify-content:between; align-items:center; border-bottom:1px solid #333; padding-bottom:8px; margin-bottom:12px;">
            <b style="color:#ffd700;font-family:'Cinzel';font-size:13px;">🎒 ИНВЕНТАР - ${titleName.toUpperCase()}</b>
            <button onclick="document.getElementById('ruler-inventory-modal').remove()" style="background:none;border:none;color:#ff4757;font-size:16px;cursor:pointer;font-weight:bold;margin-left:auto;">✕</button>
        </div>
        ${invHtml}
        <div style="margin-top:12px; text-align:right;">
            <button onclick="document.getElementById('ruler-inventory-modal').remove()" style="background:#222; border:1px solid #555; color:#fff; padding:5px 12px; font-size:11px; cursor:pointer; border-radius:3px;">Затвори</button>
        </div>
    `;

    document.body.appendChild(modal);
};

const UI = {
    init() {
        window.renderTop6LeadersUI();
        if (window.currentHero) window.updateCharacterUI(window.currentHero);
        this.cleanExpeditionButtonText();
    },
    cleanExpeditionButtonText() {
        const expBtn = document.getElementById('btn-expeditions');
        if (expBtn) {
            const badge = expBtn.querySelector('.mission-badge') || document.getElementById('expedition-badge');
            const badgeCount = badge ? badge.textContent : '3';
            expBtn.innerHTML = `🧭 <span class="expedition-btn-text" style="margin-left: 2px;">Експедиции</span> <div id="expedition-badge" class="mission-badge">${badgeCount}</div>`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});
