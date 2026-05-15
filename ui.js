/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: НАДГРАЖДАНЕ (Автоматична синхронизация на времето)
 * Поправка на "зарежда се" и изобразяване на сезоните.
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
                <h3 style="margin: 0; color: #d4af37; font-size: 1.1em; font-family: 'Cinzel', serif;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}${marriageIcon}</div>
                <div style="font-size: 0.9em; color: #d4af37;">${hero.age || 60} години</div>
                <div style="font-size: 0.85em; color: #aaa;">Род: ${hero.dynasty}</div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; font-family: 'Cinzel', serif;">СЪВЕТ НА РОДОВЕТЕ</h4>
                <div style="font-size: 0.9em; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 5px;">
                    ${Object.keys(window.activeDynasties || {}).length > 0 ? 
                        Object.keys(window.activeDynasties).map(clanName => {
                            const clan = window.activeDynasties[clanName];
                            const isPlayer = clanName === hero.dynasty;
                            return `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: ${isPlayer ? '#d4af37' : '#fff'}">
                                    <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                    <span style="color: #888; font-size: 0.8em;">${clan.regionsOwned || 0} зем.</span>
                                </div>
                            `;
                        }).join('') : '<div style="color:#666;">Търсене на родове...</div>'}
                </div>
            </div>

            <div>
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; font-family: 'Cinzel', serif;">НАШИТЕ ЗЕМИ (${window.playerRegions ? window.playerRegions.length : 0})</h4>
                <div style="font-size: 0.85em; display: flex; flex-wrap: wrap; gap: 5px;">
                    ${window.playerRegions ? window.playerRegions.map(reg => `<span style="background: #222; padding: 2px 6px; border-radius: 3px; border: 1px solid #444;">${reg}</span>`).join('') : ''}
                </div>
            </div>
        `;
        leftSidebar.innerHTML = treeHTML;
    }

    // --- 2. ГОРЕН ПАНЕЛ (Ресурси и Време) ---
    const goldEl = document.getElementById('gold-amount');
    const armyEl = document.getElementById('army-val');
    const powerEl = document.getElementById('hero-power-val');
    const timeEl = document.getElementById('current-time-info');
    const eraEl = document.getElementById('era-display');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold || 0);
    if (armyEl) armyEl.innerText = hero.armySize || 0;
    if (powerEl) powerEl.innerText = hero.heroPower || 0;
    
    // ПОПРАВКА НА ВРЕМЕТО
    if (timeEl && window.gameTime) {
        const seasons = ["Пролет", "Лято", "Есен", "Зима"];
        const currentSeason = seasons[window.gameTime.seasonIndex] || "Пролет";
        timeEl.innerText = `${currentSeason}, ${window.gameTime.year} г.`;
    }

    if (eraEl && window.gameTime) {
        eraEl.innerText = window.gameTime.era || "АНТИЧНОСТ";
    }

    // --- 3. ДЕСЕН ПАНЕЛ (Летопис) ---
    const logContainer = document.getElementById('events-center');
    if (logContainer) {
        logContainer.innerHTML = window.eventHistory.slice().reverse().map(ev => `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(212, 175, 55, 0.05); border-left: 2px solid #d4af37;">
                <div style="font-size: 0.7em; color: #d4af37; text-transform: uppercase; font-family: 'Cinzel', serif;">${ev.title || "ВЕСТ"}</div>
                <div style="font-size: 0.85em; color: #ddd;">${ev.text}</div>
            </div>
        `).join('');
    }
};

/**
 * ФУНКЦИЯ ЗА ПОКАЗВАНЕ НА ВЕСТ
 */
window.showAdvisorMsg = function(msg) {
    window.eventHistory.push({ title: "Летопис", text: msg });
    window.eventQueue.push(msg);
    window.updateCharacterUI(window.currentHero);
    window.updateNotificationBadge();
};

/**
 * ОБНОВЯВАНЕ НА БАДЖА
 */
window.updateNotificationBadge = function() {
    const badge = document.getElementById('new-item-badge');
    if (badge) {
        badge.innerText = window.eventQueue.length;
        badge.style.display = window.eventQueue.length > 0 ? 'block' : 'none';
    }
};

window.toggleTreasury = function() {
    const overlay = document.getElementById('treasury-overlay');
    if (overlay) overlay.style.display = (overlay.style.display === 'block' ? 'none' : 'block');
};

/**
 * НАДГРАЖДАНЕ: АВТОМАТИЧНО ПРЕМАХВАНЕ НА "ЗАРЕЖДА СЕ"
 * Проверява на всеки 100мс дали данните от logic.js са пристигнали.
 */
const syncInterval = setInterval(() => {
    if (window.currentHero && window.gameTime) {
        window.updateCharacterUI(window.currentHero);
        console.log("UI.js: Времето е успешно заредено.");
        clearInterval(syncInterval); // Спираме проверката, щом веднъж зареди
    }
}, 100);
