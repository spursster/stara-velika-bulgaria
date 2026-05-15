/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: СИНХРОНИЗИРАН (Летопис ограничен до последните 5 събития + Ресурси)
 */

window.eventHistory = [];  

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
                                <span style="font-size: 0.85em; opacity: 0.8;">${clan.regions || 0} зем.</span>
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
    
    // Обновяваме Летописа при всяко опресняване на UI
    window.renderHistory();

    if (window.updateTimeUI) window.updateTimeUI();
};

/**
 * ДОБАВЯНЕ НА СЪОБЩЕНИЕ И ВИЗУАЛИЗАЦИЯ
 * Ограничено до точно 5 събития за поддържане на чист интерфейс.
 */
window.showAdvisorMsg = function(msg) {
    const year = window.gameTime ? window.gameTime.year : 1;
    const era = window.gameTime ? window.gameTime.era : "от н.е.";
    
    // Новите събития се добавят най-отгоре в масива
    window.eventHistory.unshift({ text: msg, time: `${year} ${era}` });
    
    // СИНХРОНИЗАЦИЯ: Пазим само последните 5 записа в Летописа
    if (window.eventHistory.length > 5) {
        window.eventHistory.pop(); // Премахва най-старото събитие
    }
    
    window.renderHistory();
};

window.renderHistory = function() {
    const logEl = document.getElementById('history-log');
    if (logEl) {
        logEl.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 4px; animation: fadeIn 0.3s ease;">
                <span style="color: #d4af37;">[${event.time} г.]:</span> ${event.text}
            </div>
        `).join('');
    }
};
