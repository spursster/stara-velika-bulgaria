/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: КОРИГИРАН (Синхронизация на времето)
 */

window.eventQueue = [];    
window.eventHistory = [];  

window.updateCharacterUI = function(hero) {
    if (!hero || !window.gameTime) return;

    // 1. Ляв панел
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37; font-family: 'Cinzel', serif;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em;">Кан ${hero.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">${hero.age} г. | Род: ${hero.dynasty}</div>
            </div>
        `;
    }

    // 2. Време и Ресурси
    const timeEl = document.getElementById('current-time-info');
    const goldEl = document.getElementById('gold-amount');
    const eraEl = document.getElementById('era-display');

    if (timeEl) {
        const season = window.gameTime.seasons[window.gameTime.seasonIndex];
        const y = window.gameTime.year;
        const yearTxt = y < 0 ? Math.abs(y) + " пр.н.е." : y + " г.";
        timeEl.innerText = `${season}, ${yearTxt}`;
    }

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (eraEl) eraEl.innerText = window.gameTime.era;
};

// Проверка на всеки 300ms дали обектите са заредени, за да премахне "зарежда се"
const checkInterval = setInterval(() => {
    if (window.currentHero && window.gameTime) {
        window.updateCharacterUI(window.currentHero);
        if (document.getElementById('current-time-info')?.innerText !== "зарежда се...") {
            clearInterval(checkInterval);
        }
    }
}, 300);
