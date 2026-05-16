/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: ФИКСИРАН (Лентата за Топ 6 се инжектира автономно и работи при всеки ход)
 * Статистика на файловете в проекта: 16
 */

window.eventHistory = [];  

/**
 * Функция за динамично генериране на Топ 6 най-опитни владетели
 */
window.renderTop6LeadersUI = function() {
    // Намираме сигурен родителски контейнер - централния панел или самия body, за да не се чупи играта
    let targetContainer = document.getElementById('game-time-display')?.parentNode || document.querySelector('.main-content') || document.body;
    if (!targetContainer) return;

    let leadersBar = document.getElementById('top-6-leaders-bar');
    if (!leadersBar) {
        leadersBar = document.createElement('div');
        leadersBar.id = 'top-6-leaders-bar';
        leadersBar.style.cssText = `
            margin: 15px auto;
            padding: 6px;
            background: linear-gradient(180deg, #121212, #211902);
            border: 2px solid #d4af37;
            border-radius: 8px;
            width: 95%;
            max-width: 800px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            box-shadow: 0 0 20px rgba(212,175,55,0.3);
            font-family: 'Georgia', serif;
            box-sizing: border-box;
        `;
        
        // Инжектираме го на сигурно място - ако има време, под него, ако не - най-отгоре в контейнера
        const timeEl = document.getElementById('game-time-display');
        if (timeEl) {
            timeEl.parentNode.insertBefore(leadersBar, timeEl.nextSibling);
        } else {
            targetContainer.insertBefore(leadersBar, targetContainer.firstChild);
        }
    }

    // Събиране на водачите от играта
    let allLeaders = [];
    if (window.currentHero) {
        allLeaders.push({ 
            ...window.currentHero, 
            isMain: true,
            level: window.currentHero.level || 1,
            xp: window.currentHero.xp || 0
        });
    }
    
    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach(ml => { 
            allLeaders.push({ 
                ...ml, 
                isMain: false,
                level: ml.level || 1,
                xp: ml.xp || 0
            }); 
        });
    }

    // Защита: Ако все още няма водачи, лентата остава скрита, докато не се появят
    if (allLeaders.length === 0) {
        leadersBar.style.display = 'none';
        return;
    }

    leadersBar.style.display = 'flex';

    // Сортиране по ниво и опит
    allLeaders.sort((a, b) => (b.level !== a.level) ? (b.level - a.level) : (b.xp - a.xp));
    const top6 = allLeaders.slice(0, 6);
    
    window.realMainHeroReference = window.currentHero;

    leadersBar.innerHTML = top6.map((leader, index) => {
        let icon = leader.isMain ? "🛡️" : "⚔️";
        let crownSize = index === 0 ? "20px" : "16px";
        let glow = index === 0 ? "filter: drop-shadow(0 0 6px #ffd700);" : "";

        return `
            <div onclick="window.inspectSpecificRuler(${index}, ${JSON.stringify(leader).replace(/"/g, '&quot;')})" 
                 style="text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;" 
                 onmouseover="this.style.transform='scale(1.05)'" 
                 onmouseout="this.style.transform='scale(1)'">
                <div style="font-size: ${crownSize}; ${glow}; line-height: 1; margin-bottom: -4px; z-index: 2;">👑</div>
                <div style="
                    width: 70px;
                    height: 70px;
                    background: rgba(0,0,0,0.6);
                    border: 2px solid ${index === 0 ? '#ffd700' : '#d4af37'};
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-shadow: ${index === 0 ? '0 0 10px rgba(255,215,0,0.4)' : '0 0 6px rgba(0,0,0,0.5)'};
                    overflow: hidden;
                    box-sizing: border-box;
                    padding: 4px;
                ">
                    <div style="font-size: 20px; margin-bottom: 2px;">${icon}</div>
                    <div style="font-size: 0.65em; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px; line-height: 1.1;">${leader.name}</div>
                    <div style="font-size: 0.58em; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60px; line-height: 1.1;">Род ${leader.dynasty} [cite: 2026-02-03]</div>
                    <div style="font-size: 0.65em; font-weight: bold; color: #00ffcc; margin-top: 1px;">Н. ${leader.level}</div>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * Интелигентно превключване за инспектиране на инвентар
 */
window.inspectSpecificRuler = function(index, leaderData) {
    if (!leaderData) return;
    window.currentHero = leaderData;

    if (typeof window.toggleRulerInventory === 'function') {
        const existingModal = document.getElementById('inventory-modal');
        if (existingModal) existingModal.remove();

        window.toggleRulerInventory();

        setTimeout(() => {
            const closeBtn = document.querySelector("#inventory-modal button");
            if (closeBtn) {
                closeBtn.onclick = function() {
                    const modal = document.getElementById('inventory-modal');
                    if (modal) modal.remove();
                    
                    if (window.realMainHeroReference) {
                        window.currentHero = window.realMainHeroReference;
                    }
                    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
                };
            }
        }, 100);
    } else {
        alert(`Кан ${leaderData.name}\nРод ${leaderData.dynasty}\nНиво: ${leaderData.level}`);
    }
};

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ (Владетел, Родове и Летопис) ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">Род: ${hero.dynasty} | ${hero.age} г.</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; letter-spacing: 1px;">СЪВЕТ НА РОДОВЕТЕ</h4>
                <div style="font-size: 0.85em; max-height: 150px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
                    ${Object.keys(window.activeDynasties || {}).map(clanName => {
                        const clan = window.activeDynasties[clanName];
                        const isPlayer = clanName === hero.dynasty;
                        return `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: ${isPlayer ? '#d4af37' : '#fff'}">
                                <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                <span style="font-size: 0.85em; opacity: 0.8;">${clan ? clan.regions || 0 : 0} зем.</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="history-log-container" style="border-top: 1px solid #333; padding-top: 10px;">
                <h4 style="color: #d4af37; font-size: 11px; margin-bottom: 10px; letter-spacing: 1px;">ЛЕТОПИС</h4>
                <div id="history-log" style="font-size: 10px; color: #aaa; max-height: 200px; overflow-y: auto; line-height: 1.4;">
                </div>
            </div>
        `;
    }

    // --- 2. ГОРЕН ПАНЕЛ (Ресурси) ---
    const goldEl = document.getElementById('stat-gold');
    const armyEl = document.getElementById('stat-army');
    const powerEl = document.getElementById('stat-power');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    window.renderHistory();

    // ВИКА СЕ АВТОНОМНО - ВИНАГИ НАМИРА МЯСТО НА ЕКРАНА
    window.renderTop6LeadersUI();

    if (window.updateTimeUI) window.updateTimeUI();
};

/**
 * ДОБАВЯНЕ НА СЪОБЩЕНИЕ И ВИЗУАЛИЗАЦИЯ
 */
window.showAdvisorMsg = function(msg) {
    const year = window.gameTime ? window.gameTime.year : 1;
    const era = window.gameTime ? window.gameTime.era : "от н.е.";
    
    window.eventHistory.unshift({ text: msg, time: `${year} ${era}` });
    
    if (window.eventHistory.length > 5) {
        window.eventHistory.pop();
    }
    
    window.renderHistory();
};

window.renderHistory = function() {
    const logEl = document.getElementById('history-log');
    if (logEl) {
        logEl.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 4px;">
                <span style="color: #d4af37;">[${event.time} г.]:</span> ${event.text}
            </div>
        `).join('');
    }
};
