/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода & 51 региона)
 * Включва система за Летопис (десен панел) и управление на Вестите.
 */

window.eventQueue = [];    
window.eventHistory = [];  

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ (Владетел, Съвет и Владения) ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        const marriageIcon = window.currentSpouse ? ' <span title="Сключен династичен съюз" style="cursor:help;">💍</span>' : '';

        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37; font-size: 1.1em;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}${marriageIcon}</div>
                <div style="font-size: 0.85em; color: #aaa;">Род: ${hero.dynasty}</div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px;">СЪВЕТ НА СТАРЕЙШИНИТЕ</h4>
                <div style="font-size: 0.9em; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 5px;">
                    ${window.worldData.majorClans.map(clanName => {
                        const clan = window.worldData.clans[clanName];
                        const isPlayer = clanName === hero.dynasty;
                        const statusColor = clan.isJoined ? "#4CAF50" : "#888";
                        return `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: ${isPlayer ? '#d4af37' : '#fff'}">
                                <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                <span style="color: ${statusColor}; font-size: 0.8em;">${clan.regionsOwned} зем.</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div>
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px;">НАШИТЕ ЗЕМИ (${window.playerRegions.length})</h4>
                <div style="font-size: 0.85em; display: flex; flex-wrap: wrap; gap: 5px;">
                    ${window.playerRegions.map(reg => `<span style="background: #222; padding: 2px 6px; border-radius: 3px; border: 1px solid #444;">${reg}</span>`).join('')}
                </div>
            </div>
        `;
        leftSidebar.innerHTML = treeHTML;
    }

    // --- 2. ГОРЕН ПАНЕЛ (Ресурси) ---
    const goldEl = document.getElementById('stat-gold');
    const armyEl = document.getElementById('stat-army');
    const powerEl = document.getElementById('stat-power');
    const timeEl = document.getElementById('stat-time');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    if (timeEl && window.gameTime) {
        const seasons = ["Пролет", "Лято", "Есен", "Зима"];
        timeEl.innerText = `${seasons[window.gameTime.seasonIndex]}, ${window.gameTime.year} г. ${window.gameTime.era}`;
    }

    // --- 3. ДЕСЕН ПАНЕЛ (Летопис) ---
    const logContainer = document.getElementById('event-log');
    if (logContainer) {
        // Пазим само последните 7 записа в Летописа
        if (window.eventHistory.length > 7) {
            window.eventHistory = window.eventHistory.slice(-7);
        }

        logContainer.innerHTML = window.eventHistory.reverse().map(ev => `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-left: 2px solid #d4af37;">
                <div style="font-size: 0.7em; color: #d4af37; text-transform: uppercase;">${ev.title || "ВЕСТ"}</div>
                <div style="font-size: 0.85em; color: #ddd;">${ev.text}</div>
            </div>
        `).join('');
        // Връщаме реда за вътрешната логика
        window.eventHistory.reverse();
    }
};

/**
 * ФУНКЦИЯ ЗА ПОКАЗВАНЕ НА ВЕСТ (Advisor Message)
 */
window.showAdvisorMsg = function(msg) {
    // 1. Добавяме в Летописа (десния панел)
    window.eventHistory.push({ title: "Летопис", text: msg });
    
    // 2. Добавяме в опашката за Вести (бутона)
    window.eventQueue.push(msg);
    
    // 3. Опресняваме UI
    window.updateCharacterUI(window.currentHero);
    window.updateNotificationBadge();
};

/**
 * ОБНОВЯВАНЕ НА ЧЕРВЕНАТА ТОЧКА (Badge) НА ВЕСТИТЕ
 */
window.updateNotificationBadge = function() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        if (window.eventQueue.length > 0) {
            badge.innerText = window.eventQueue.length;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
};

/**
 * ОТВАРЯНЕ НА ОПАШКАТА С ВЕСТИ
 */
window.openNotifications = function() {
    if (window.eventQueue.length === 0) return;

    const msg = window.eventQueue.shift(); // Вземаме първата вест
    
    // Използваме вградения механизъм за събития, ако съществува
    if (window.showEventModal) {
        window.showEventModal("ВЕСТ ОТ СЪВЕТНИКА", msg);
    } else {
        alert(msg);
    }

    window.updateNotificationBadge();
};

/**
 * ЗАПИСВАНЕ НА БРАК В ЛЕТОПИСА
 */
window.logMarriageEvent = function(partnerName) {
    const marriageMsg = `Сключен бе свещен съюз между ${window.currentHero.name} и ${partnerName}. Родовете се сплотяват под общо знаме! 💍`;
    window.showAdvisorMsg(marriageMsg);
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};
