/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (ПЪЛНО ОБНОВЯВАНЕ & СИНХРОНИЗАЦИЯ С МОБИЛЕН И ДЕСКТОП ИЗГЛЕД)
 * ОПИСАНИЕ: Управление на потребителския интерфейс без дублиращи се панели
 * СТАТУС: КОРИГИРАН (Изчистен конфликт в хедъра, съобразен за всякакви екрани)
 * Статистика на файловете в проекта: 16
 * ==========================================================================
 */

window.eventHistory = [];  

if (!window.autoLevelState) {
    window.autoLevelState = {};
}

const UI = {
    // Инициализиране на интерфейса при старт
    init() {
        this.updatePlayerStats();
        this.renderProvincesList();
        this.setupEventListeners();
        this.cleanExpeditionButtonText();
    },

    // Обновяване на основните статистики в хедъра и левия панел
    updatePlayerStats() {
        const goldEl = document.getElementById('stat-gold');
        const powerEl = document.getElementById('stat-power');
        const armyEl = document.getElementById('stat-army');
        const clanEl = document.getElementById('current-clan-name');
        const rulerEl = document.getElementById('current-ruler-name');

        if (goldEl && window.gameState && window.gameState.player) {
            goldEl.textContent = Math.floor(window.gameState.player.gold);
        }
        if (powerEl && window.gameState && window.gameState.player) {
            powerEl.textContent = window.gameState.player.power;
        }
        if (armyEl && window.gameState && window.gameState.player) {
            armyEl.textContent = window.gameState.player.armySize;
        }
        if (clanEl && window.gameState && window.gameState.player && window.gameState.player.clan) {
            clanEl.textContent = window.gameState.player.clan.toUpperCase();
        }
        if (rulerEl && window.gameState && window.gameState.player && window.gameState.player.rulerName) {
            rulerEl.textContent = window.gameState.player.rulerName;
        }

        // Синхронизация, ако се чете от променливата window.currentHero
        if (window.currentHero) {
            if (goldEl) goldEl.innerText = Math.floor(window.currentHero.gold);
            if (armyEl) armyEl.innerText = window.currentHero.armySize;
            if (powerEl) powerEl.innerText = window.currentHero.heroPower;
        }
    },

    // Рендериране на списъка с провинции (Владения) в левия панел
    renderProvincesList() {
        const listContainer = document.getElementById('provinces-list');
        if (!listContainer) return;

        listContainer.innerHTML = `<h3 style="font-family:'Cinzel'; font-size:12px; color:#d4af37; border-bottom:1px solid #333; padding-bottom:5px;">ВЛАДЕНИЯ</h3>`;

        if (window.worldData && window.worldData.provinces) {
            window.worldData.provinces.forEach(province => {
                const provinceDiv = document.createElement('div');
                provinceDiv.style.cssText = "padding: 6px 0; font-size: 11px; color: #eee; border-bottom: 1px solid rgba(255,255,255,0.05);";
                provinceDiv.innerHTML = `📍 <strong>${province.name}</strong> (Данък: ${province.taxIncome} 💰)`;
                listContainer.appendChild(provinceDiv);
            });
        }
    },

    // Динамично премахване на текстове по долните бутони за чист мобилен изглед
    cleanExpeditionButtonText() {
        const expBtn = document.getElementById('btn-expeditions');
        if (expBtn) {
            const badge = expBtn.querySelector('.mission-badge') || document.getElementById('expedition-badge');
            const badgeCount = badge ? badge.textContent : '3';
            expBtn.innerHTML = `🧭 <div id="expedition-badge" class="mission-badge">${badgeCount}</div>`;
        }
    },

    // Закачане на събития и слушатели
    setupEventListeners() {
        window.addEventListener('gameStateUpdated', () => {
            this.updatePlayerStats();
        });
    }
};

/**
 * Глобални функции за управление съвместими с ядрото на играта
 */
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

window.toggleAutoLevel = function(leaderName) {
    window.autoLevelState[leaderName] = !window.autoLevelState[leaderName];
};

window.showAdvisorMsg = function(msg) {
    const year = window.gameTime ? window.gameTime.year : 681;
    const era = window.gameTime ? window.gameTime.era : "г.";
    window.eventHistory.unshift({ text: msg, time: `${year} ${era}` });
    if (window.eventHistory.length > 5) window.eventHistory.pop();
    window.renderHistory();
};

window.renderHistory = function() {
    const logEl = document.getElementById('history-log');
    if (logEl) {
        logEl.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 4px; font-size: 11px;">
                <span style="color: #d4af37;">[${event.time}]:</span> ${event.text}
            </div>
        `).join('');
    }
};

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

// Запазване на празни функции, ако ядрото ги търси, за да няма конзолни грешки
window.renderTop6LeadersUI = function() { };
window.updateCharacterUI = function(hero) { 
    if (hero) UI.updatePlayerStats();
};

// Експортиране на обекта
window.UI = UI;

// Автоматичен старт при зареждане
document.addEventListener('DOMContentLoaded', () => {
    window.UI.init();
    window.updateExpeditionBadge();
});
