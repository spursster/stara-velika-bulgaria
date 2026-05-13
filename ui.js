/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 */

window.updateCharacterUI = function(hero) {
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 9px; color: #d4af37; font-family: 'Cinzel';">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 30px; margin: 5px 0;">🏇</div>
                <div style="font-size: 12px; font-weight: bold; color: #fff;">Кан ${hero.name}</div>
            </div>
            <div style="font-size: 10px; color: #d4af37; margin-bottom: 5px; font-family: 'Cinzel';">ВАШИТЕ ЗЕМИ:</div>
        `;

        (window.playerRegions || []).forEach(reg => {
            treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 8px; margin-bottom: 4px; border-left: 3px solid #d4af37; font-size: 10px;"><b>${reg}</b></div>`;
        });

        if (window.currentSpouse) {
            treeHTML += `
                <div style="margin-top: 20px; text-align: center; padding: 10px; background: rgba(123, 26, 26, 0.1); border: 1px solid #7b1a1a; border-radius: 5px; margin-bottom: 10px;">
                    <div style="font-size: 8px; color: #ff6b6b; font-family: 'Cinzel';">СЪЮЗЕН РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <div style="font-size: 25px; margin: 5px 0;">👸</div>
                    <div style="font-size: 11px; font-weight: bold; color: #eee;">${window.currentSpouse.name}</div>
                </div>
            `;
            (window.spouseRegions || []).forEach(reg => {
                treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 8px; margin-bottom: 4px; border-left: 3px solid #7b1a1a; font-size: 10px; opacity: 0.9;"><b>${reg}</b></div>`;
            });
        } else {
            treeHTML += `<div style="margin-top: 15px; text-align: center; color: #444; font-size: 10px; font-style: italic;">Нямате сключен брак</div>`;
        }
        leftSidebar.innerHTML = treeHTML;
    }

    if(document.getElementById('hero-power-val')) document.getElementById('hero-power-val').innerText = hero.heroPower;
    if(document.getElementById('army-val')) document.getElementById('army-val').innerText = hero.armySize;
    if(document.getElementById('gold-amount')) document.getElementById('gold-amount').innerText = hero.gold;

    const badge = document.getElementById('new-item-badge');
    if (badge) {
        badge.style.display = (window.newArtifactsCount > 0) ? "block" : "none";
        badge.innerText = window.newArtifactsCount;
    }
};

window.updateTimeUI = function() {
    const timeDisplay = document.getElementById('current-time-info');
    if (timeDisplay && window.gameTime) {
        const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
        timeDisplay.innerText = `${seasons[window.gameTime.seasonIndex]}, ${window.gameTime.year} пр.н.е.`;
    }
};
