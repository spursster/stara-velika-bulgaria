/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 */

window.eventQueue = [];    
window.eventHistory = [];  

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">Род: ${hero.dynasty} | ${hero.age} г.</div>
            </div>
            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px;">СЪВЕТ НА СТАРЕЙШИНИТЕ</h4>
                <div style="font-size: 0.9em; max-height: 150px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 5px;">
                    ${Object.keys(window.activeDynasties || {}).map(clanName => {
                        const clan = window.activeDynasties[clanName];
                        const isPlayer = clanName === hero.dynasty;
                        return `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: ${isPlayer ? '#d4af37' : '#fff'}">
                                <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                <span style="font-size: 0.8em;">${clan.regions || 0} зем.</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // --- 2. ГОРЕН ПАНЕЛ (Ресурси) ---
    const goldEl = document.getElementById('stat-gold') || document.getElementById('gold-amount');
    const armyEl = document.getElementById('stat-army') || document.getElementById('army-val');
    const powerEl = document.getElementById('stat-power') || document.getElementById('hero-power-val');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    // Викаме времето от time.js
    if (window.updateTimeUI) window.updateTimeUI();
};

window.showAdvisorMsg = function(msg) {
    window.eventHistory.push({ title: "Летопис", text: msg });
    window.updateCharacterUI(window.currentHero);
};
