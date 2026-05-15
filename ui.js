/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: СИНХРОНИЗИРАН (Време пр.н.е. & Родове)
 */

window.eventQueue = [];    
window.eventHistory = [];  

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ (Владетел и Родове) ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37; font-size: 1.1em;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">${hero.age} г. | Род: ${hero.dynasty}</div>
            </div>
            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px;">СЪВЕТ НА РОДОВЕТЕ</h4>
                <div style="font-size: 0.85em; max-height: 150px; overflow-y: auto;">
                    ${Object.keys(window.activeDynasties || {}).map(name => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                            <span>${name === hero.dynasty ? '👑 ' : ''}${name}</span>
                            <span style="color:#888;">${window.activeDynasties[name].regionsOwned} зем.</span>
                        </div>
                    `).join('')}
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

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    if (timeEl && window.gameTime) {
        const currentSeason = window.gameTime.seasons[window.gameTime.seasonIndex];
        let yearVal = window.gameTime.year;
        let yearSuffix = yearVal < 0 ? Math.abs(yearVal) + " пр.н.е." : yearVal + " г.";
        timeEl.innerText = `${currentSeason}, ${yearSuffix}`;
    }
    if (eraEl && window.gameTime) {
        eraEl.innerText = window.gameTime.era;
    }

    // --- 3. ДЕСЕН ПАНЕЛ (Летопис) ---
    const logContainer = document.getElementById('events-center');
    if (logContainer) {
        logContainer.innerHTML = window.eventHistory.slice().reverse().map(ev => `
            <div style="margin-bottom: 8px; padding: 5px; border-left: 2px solid #d4af37; background: rgba(255,255,255,0.02);">
                <div style="font-size: 0.7em; color: #d4af37;">${ev.title}</div>
                <div style="font-size: 0.8em;">${ev.text}</div>
            </div>
        `).join('');
    }
};

window.showAdvisorMsg = function(msg) {
    window.eventHistory.push({ title: "ЛЕТОПИС", text: msg });
    window.updateCharacterUI(window.currentHero);
};

// Автоматичен старт на UI
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.currentHero) window.updateCharacterUI(window.currentHero);
    }, 300);
});
