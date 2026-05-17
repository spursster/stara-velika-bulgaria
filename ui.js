/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (ОПТИМИЗАЦИЯ НА ЛЕВИЯ ПАНЕЛ & СКРИВАНЕ НА ТЕКСТА НА ЕКСПЕДИЦИИТЕ)
 * ОПИСАНИЕ: Управление на UI. Времето е преместени отляво. Текстът на експедициите се скрива на телефон.
 * СТАТУС: КОРИГИРАН (Скриване на текстовия етикет на експедициите само за мобилни)
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
 * Глобална функция за превключване на AUTO режима
 */
window.toggleAutoLevel = function(leaderName) {
    window.autoLevelState[leaderName] = !window.autoLevelState[leaderName];
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * ГЕНЕРАТОР НА RPG СТАТИСТИКИ: Изчислява виртуално ниво и XP прогрес на база реалния heroPower
 */
function getCalculatedLeaderStats(leader) {
    if (!leader) return { level: 1, xpPercent: 0 };

    let power = leader.heroPower || 100;
    let calculatedLevel = Math.max(1, Math.floor((power - 100) / 25) + 1);
    
    let pointsInCurrentLevel = (power - 100) % 25;
    if (power < 100) pointsInCurrentLevel = 0;

    let percent = Math.min(100, Math.floor((pointsInCurrentLevel / 25) * 100));
    leader.level = calculatedLevel;

    return {
        level: calculatedLevel,
        xpPercent: percent
    };
}

/**
 * AUTO-LEVEL ИЗПЪЛНИТЕЛ: Автоматично разпределяне на бонуси при качено ниво
 */
function checkAndExecuteAutoLevel(leader, currentLevel) {
    if (!leader || !window.autoLevelState[leader.name]) return;

    if (!leader.lastProcessedLevel) {
        leader.lastProcessedLevel = currentLevel;
        return;
    }

    if (currentLevel > leader.lastProcessedLevel) {
        let levelsGained = currentLevel - leader.lastProcessedLevel;
        let currentClass = leader.currentClass || "Пълководец";

        if (currentClass === "Велик Кан") {
            leader.gold = (leader.gold || 0) + (levelsGained * 300);
        } else {
            leader.armySize = (leader.armySize || 0) + (levelsGained * 75);
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Кан ${leader.name} качи ниво и автоматично разпредели бонуси за род ${leader.dynasty}!`);
        }

        leader.lastProcessedLevel = currentLevel;
    }
}

/**
 * РЕНДЕРИРАНЕ НА ТОП 6 ЛЕНТАТА
 */
window.renderTop6LeadersUI = function() {
    let mainContainer = document.getElementById('game-container');
    let targetContainer = mainContainer ? mainContainer.parentNode : document.body;
    if (!targetContainer) return;

    let styleSheet = document.getElementById('top-6-responsive-style');
    if (!styleSheet) {
        styleSheet = document.createElement("style");
        styleSheet.id = 'top-6-responsive-style';
        styleSheet.innerText = `
            #top-6-leaders-bar::-webkit-scrollbar { display: none; }
            #top-6-leaders-bar { -ms-overflow-style: none; scrollbar-width: none; }
            .leader-rpg-card { flex: 1; min-width: 95px; }
            @media (max-width: 768px) {
                #top-6-leaders-bar { justify-content: flex-start !important; padding: 6px 4px !important; gap: 8px !important; margin: 4px auto !important; }
                .leader-rpg-card { flex: 0 0 calc(25% - 6px) !important; min-width: 72px !important; }
                .leader-avatar-box { width: 44px !important; height: 44px !important; font-size: 18px !important; }
                .leader-name-text { font-size: 0.60em !important; max-width: 70px !important; }
                .leader-class-text { font-size: 0.48em !important; max-width: 70px !important; }
                .leader-xp-bar-container { width: 55px !important; }
                .expedition-btn-text { display: none !important; } /* Скрива текста на телефона */
            }
        `;
        document.head.appendChild(styleSheet);
    }

    let leadersBar = document.getElementById('top-6-leaders-bar');
    if (!leadersBar) {
        leadersBar = document.createElement('div');
        leadersBar.id = 'top-6-leaders-bar';
        leadersBar.style.cssText = `
            margin: 6px auto; padding: 8px 10px; background: rgba(20, 20, 20, 0.65);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid #d4af37; border-radius: 8px; width: 96%; max-width: 900px;
            display: flex; justify-content: center; align-items: flex-start; gap: 14px;
            overflow-x: auto; scroll-snap-type: x mandatory; box-shadow: 0 0 15px rgba(212,175,55,0.2);
            font-family: 'Montserrat', sans-serif; box-sizing: border-box; z-index: 999; -webkit-overflow-scrolling: touch;
        `;
        
        if (mainContainer) {
            targetContainer.insertBefore(leadersBar, mainContainer);
        } else {
            targetContainer.insertBefore(leadersBar, targetContainer.firstChild);
        }
    }

    let allLeaders = [];
    
    if (window.currentHero) {
        let rpgStats = getCalculatedLeaderStats(window.currentHero);
        allLeaders.push({ 
            name: window.currentHero.name,
            dynasty: window.currentHero.dynasty,
            heroPower: window.currentHero.heroPower,
            gold: window.currentHero.gold,
            armySize: window.currentHero.armySize,
            age: window.currentHero.age,
            isMain: true, 
            level: rpgStats.level, 
            xpPercent: rpgStats.xpPercent, 
            currentClass: window.currentHero.currentClass || "Велик Кан" 
        });
    }
    
    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach(ml => { 
            let rpgStats = getCalculatedLeaderStats(ml);
            allLeaders.push({ 
                name: ml.name,
                dynasty: ml.dynasty,
                heroPower: ml.heroPower,
                gold: ml.gold,
                armySize: ml.armySize,
                age: ml.age,
                isMain: false, 
                level: rpgStats.level, 
                xpPercent: rpgStats.xpPercent, 
                currentClass: ml.currentClass || "Пълководец" 
            }); 
        });
    }

    if (allLeaders.length === 0) {
        leadersBar.style.display = 'none';
        return;
    }
    leadersBar.style.display = 'flex';

    allLeaders.sort((a, b) => b.level - a.level || b.xpPercent - a.xpPercent);
    const top6 = allLeaders.slice(0, 6);

    leadersBar.innerHTML = top6.map((leader) => {
        let icon = leader.isMain ? "🛡️" : "⚔️";
        let originalLeaderObj = leader.isMain ? window.currentHero : window.mightyLeaders.find(l => l.name === leader.name);
        if (originalLeaderObj) {
            checkAndExecuteAutoLevel(originalLeaderObj, leader.level);
        }

        let isAutoOn = window.autoLevelState[leader.name] || false;
        let autoBtnBg = isAutoOn ? "#00ffcc" : "rgba(212,175,55,0.12)";
        let autoBtnColor = isAutoOn ? "#000" : "#ffd700";
        let autoBtnBorder = isAutoOn ? "1px solid #00ffcc" : "1px solid rgba(212,175,55,0.4)";

        return `
            <div class="leader-rpg-card" onclick="window.inspectSpecificRulerByName('${leader.name}')" style="text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; scroll-snap-align: start;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <div class="leader-name-text" style="font-size: 0.72em; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 92px; line-height: 1.2;">${leader.name}</div>
                <div class="leader-class-text" style="font-size: 0.58em; color: #aaa; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 92px;">${leader.currentClass}</div>
                
                <div style="position: relative; display: flex; flex-direction: column; align-items: center; margin-bottom: 3px;">
                    <div style="font-size: 12px; opacity: 0.7; line-height: 1; margin-bottom: -3px; z-index: 2;">👑</div>
                    <div class="leader-avatar-box" style="width: 54px; height: 54px; background: rgba(0,0,0,0.5); border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 22px; box-sizing: border-box; border: 1px solid #d4af37;">${icon}</div>
                </div>

                <div style="font-size: 0.68em; font-weight: bold; color: #00ffcc; line-height: 1.1; margin-bottom: 3px;">Н. ${leader.level}</div>
                
                <button onclick="event.stopPropagation(); window.toggleAutoLevel('${leader.name}')" style="font-size: 8px; font-weight: bold; padding: 1px 5px; background: ${autoBtnBg}; color: ${autoBtnColor}; border: ${autoBtnBorder}; border-radius: 3px; cursor: pointer; margin-bottom: 5px; transition: all 0.15s;">
                    AUTO
                </button>

                <div class="leader-xp-bar-container" style="width: 66px; height: 4px; background: #333; border-radius: 2px; overflow: hidden; border: 1px solid rgba(212,175,55,0.2); box-sizing: border-box;">
                    <div style="width: ${leader.xpPercent}%; height: 100%; background: linear-gradient(90deg, #00ccff, #00ffcc);"></div>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * ИНСПЕКТИРАНЕ НА ИНВЕНТАР ПО ИМЕ
 */
window.inspectSpecificRulerByName = function(name) {
    let realLeader = null;
    if (window.currentHero && window.currentHero.name === name) {
        realLeader = window.currentHero;
    } else if (window.mightyLeaders) {
        realLeader = window.mightyLeaders.find(l => l.name === name);
    }

    if (!realLeader) return;

    if (typeof window.toggleRulerInventory === 'function') {
        const existingModal = document.getElementById('inventory-modal');
        if (existingModal) existingModal.remove();

        let previousHero = window.currentHero;
        window.currentHero = realLeader;

        window.toggleRulerInventory();

        setTimeout(() => {
            const modal = document.getElementById('inventory-modal');
            if (modal) {
                let ownerHeader = document.getElementById('inventory-owner-title');
                if (!ownerHeader) {
                    ownerHeader = document.createElement('div');
                    ownerHeader.id = 'inventory-owner-title';
                    ownerHeader.style.cssText = `
                        text-align: center; padding: 8px; margin: -5px auto 12px auto;
                        background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37;
                        border-radius: 6px; width: 90%; font-family: 'Georgia', serif; box-sizing: border-box;
                    `;
                    modal.insertBefore(ownerHeader, modal.firstChild);
                }
                ownerHeader.innerHTML = `
                    <span style="color: #ccc; font-size: 0.8em; letter-spacing: 1px;">ИНВЕНТАР НА:</span><br>
                    <strong style="color: #ffd700; font-size: 1.1em;">Кан ${realLeader.name}</strong> 
                    <span style="color: #00ffcc; font-size: 0.9em;">(Н. ${realLeader.level})</span>
                `;

                const closeBtn = modal.querySelector("button");
                if (closeBtn) {
                    closeBtn.onclick = function() {
                        if (modal) modal.remove();
                        window.currentHero = previousHero;
                        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
                    };
                }
            }
        }, 80);
    }
};

/**
 * ОБНОВЯВАНЕ НА ЛЕВИЯ СТРАНИЧЕН ПАНЕЛ
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    let stats = getCalculatedLeaderStats(hero);
    const leftSidebar = document.getElementById('provinces-list');

    let currentYear = window.gameTime ? window.gameTime.year : 681;
    let currentEra = window.gameTime ? window.gameTime.era : "г.";

    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div style="padding: 10px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 6px; margin-bottom: 12px; font-family: 'Montserrat', sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 5px; margin-bottom: 6px;">
                    <span style="color: #aaa; font-size: 10px; letter-spacing: 0.5px;">ЛЕТОБРОЕНЕ:</span>
                    <strong id="sidebar-time-display" style="color: #ffd700; font-size: 13px; font-family: 'Cinzel', serif;">${currentYear} ${currentEra}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                    <span style="color: #eee;">💰 Скарби (Злато):</span>
                    <strong id="sidebar-gold-display" style="color: #00ffcc; font-size: 12px;">${Math.floor(hero.gold)}</strong>
                </div>
            </div>

            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.08); border: 1px solid #d4af37; border-radius: 6px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 5px 0; color: #d4af37; font-family: 'Cinzel'; font-size: 11px; letter-spacing: 1px;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.15em; font-weight: bold; color: #fff; font-family: 'Cinzel', serif;">Кан ${hero.name}</div>
                <div style="font-size: 0.8em; color: #bbb; margin-top: 2px;">Род: ${hero.dynasty} | ${hero.age} г.</div>
                <div style="font-size: 0.85em; color: #00ffcc; font-weight: bold; margin-top: 4px;">Ниво ${stats.level}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center; font-family: 'Cinzel'; font-size: 11px; margin-top: 0;">
                    <span>СЪВЕТ НА РОДОВЕТЕ</span>
                    <span onclick="window.toggleGameFullScreen()" title="Цял Екран" style="cursor: pointer; font-size: 12px; padding: 1px 5px; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; border-radius: 4px;">📺</span>
                </h4>
                <div style="font-size: 0.85em; max-height: 130px; overflow-y: auto; background: rgba(0,0,0,0.25); padding: 6px; border-radius: 4px;">
                    ${Object.keys(window.activeDynasties || {}).map(clanName => {
                        const clan = window.activeDynasties[clanName];
                        const isPlayer = clanName === hero.dynasty;
                        return `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: ${isPlayer ? '#d4af37' : '#eee'}">
                                <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                <span style="font-size: 0.85em; opacity: 0.8;">${clan ? clan.regions || 0 : 0} зем.</span>
                            </div>
                        `;
                   }).join('')}
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <button id="btn-expeditions" onclick="window.openExpeditionsMenu()" style="width: 100%; padding: 8px; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; border-radius: 6px; color: #fff; font-family: 'Cinzel', serif; font-size: 11px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; position: relative;">
                    <span>🧭 ЕКСПЕДИЦИИ</span>
                    <div id="expedition-badge" class="mission-badge" style="position: absolute; right: 10px; background: #ff3333; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; justify-content: center; align-items: center; font-weight: bold;">0</div>
                </button>
            </div>
        

            <div id="history-log-container" style="border-top: 1px solid #333; padding-top: 10px;">
                <h4 style="color: #d4af37; font-size: 10px; margin-bottom: 8px; letter-spacing: 0.5px; font-family: 'Cinzel';">ЛЕТОПИС</h4>
            </div>

            <div id="history-log-container" style="border-top: 1px solid #333; padding-top: 10px;">
                <h4 style="color: #d4af37; font-size: 10px; margin-bottom: 8px; letter-spacing: 0.5px; font-family: 'Cinzel';">ЛЕТОПИС</h4>
                <div id="history-log" style="font-size: 10px; color: #aaa; max-height: 180px; overflow-y: auto; line-height: 1.4;"></div>
                <div style="margin-bottom: 15px;">
                <button id="btn-expeditions" onclick="window.openExpeditionsMenu()" style="width: 100%; padding: 8px; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; border-radius: 6px; color: #fff; font-family: 'Cinzel', serif; font-size: 11px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; position: relative; transition: background 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.3)'" onmouseout="this.style.background='rgba(212,175,55,0.15)'">
                   <span>🧭 ЕКСПЕДИЦИИ</span>
                    <div id="expedition-badge" class="mission-badge" style="position: absolute; right: 10px; background: #ff3333; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; justify-content: center; align-items: center; font-weight: bold;">3</div>
                </button>
            </div>
        `;
    }

    const goldEl = document.getElementById('stat-gold');
    const armyEl = document.getElementById('stat-army');
    const powerEl = document.getElementById('stat-power');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    window.renderHistory();
    window.renderTop6LeadersUI();

    if (window.updateTimeUI) window.updateTimeUI();
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
            <div style="margin-bottom: 6px; border-bottom: 1px solid #222; padding-bottom: 4px;">
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

const UI = {
    init() {
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.currentHero && window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        this.cleanExpeditionButtonText();
    },
    cleanExpeditionButtonText() {
        // Остава напълно празна, за да не търси стария бутон долу вляво 
        // и да не създава втория голям бутон на екрана.
    }
};

window.UI = UI;

document.addEventListener('DOMContentLoaded', () => {
    window.UI.init();
    if (typeof window.updateExpeditionBadge === 'function') {
        window.updateExpeditionBadge();
    }
});
