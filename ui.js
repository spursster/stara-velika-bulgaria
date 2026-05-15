/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: ФИКСИРАН (Поправка на "зарежда се")
 */

window.eventQueue = [];    
window.eventHistory = [];  

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    try {
        // --- 1. ЛЯВ ПАНЕЛ ---
        const leftSidebar = document.getElementById('provinces-list');
        if (leftSidebar) {
            leftSidebar.innerHTML = `
                <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #d4af37; font-size: 1.1em; font-family: 'Cinzel', serif;">ВЛАДЕТЕЛ</h3>
                    <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}</div>
                    <div style="font-size: 0.85em; color: #aaa;">${hero.age} г. | Род: ${hero.dynasty}</div>
                </div>
            `;
        }

        // --- 2. ГОРЕН ПАНЕЛ ---
        const elements = {
            gold: document.getElementById('gold-amount'),
            army: document.getElementById('army-val'),
            power: document.getElementById('hero-power-val'),
            time: document.getElementById('current-time-info'),
            era: document.getElementById('era-display')
        };

        if (elements.gold) elements.gold.innerText = Math.floor(hero.gold);
        if (elements.army) elements.army.innerText = hero.armySize;
        if (elements.power) elements.power.innerText = hero.heroPower;
        
        if (elements.time && window.gameTime) {
            const currentSeason = window.gameTime.seasons[window.gameTime.seasonIndex];
            let y = window.gameTime.year;
            let displayYear = y < 0 ? Math.abs(y) + " пр.н.е." : y + " г.";
            elements.time.innerText = `${currentSeason}, ${displayYear}`;
        }
        if (elements.era && window.gameTime) {
            elements.era.innerText = window.gameTime.era;
        }
    } catch (e) {
        console.error("UI Error:", e);
    }
};

// ФУНКЦИЯ ЗА ДЕБНЕНЕ: Ако "зарежда се" още стои, я премахваме насила
const uiWatcher = setInterval(() => {
    if (window.currentHero && window.gameTime) {
        window.updateCharacterUI(window.currentHero);
        if (document.getElementById('current-time-info')?.innerText !== "зарежда се...") {
            clearInterval(uiWatcher);
        }
    }
}, 500);

window.showAdvisorMsg = function(msg) {
    window.eventHistory.push({ title: "ВЕСТ", text: msg });
    window.updateCharacterUI(window.currentHero);
};
