/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 */

window.newArtifactsCount = 0;

window.updateCharacterUI = function(hero) {
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 10px;">
                <div style="font-size: 9px; color: #d4af37; font-family: 'Cinzel';">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 30px; margin: 5px 0;">🏇</div>
                <div style="font-size: 11px; font-weight: bold; color: #fff;">Кан ${hero.name}</div>
            </div>
        `;

        (window.playerRegions || []).forEach(reg => {
            treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 8px; margin-bottom: 4px; border-left: 3px solid #d4af37; font-size: 10px;"><b>${reg}</b></div>`;
        });

        if (window.currentSpouse) {
            treeHTML += `
                <div style="margin-top: 15px; text-align: center; padding: 8px; background: rgba(123, 26, 26, 0.1); border: 1px solid #7b1a1a; border-radius: 5px;">
                    <div style="font-size: 8px; color: #ff6b6b; font-family: 'Cinzel';">РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <div style="font-size: 25px;">👸</div>
                    <div style="font-size: 10px; font-weight: bold;">${window.currentSpouse.name}</div>
                </div>
            `;
            (window.spouseRegions || []).forEach(reg => {
                treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 8px; margin-bottom: 4px; border-left: 3px solid #7b1a1a; font-size: 10px; opacity: 0.8;"><b>${reg}</b></div>`;
            });
        }
        leftSidebar.innerHTML = treeHTML;
    }

    if(document.getElementById('hero-power-val')) document.getElementById('hero-power-val').innerText = hero.heroPower;
    if(document.getElementById('army-val')) document.getElementById('army-val').innerText = hero.armySize;
    if(document.getElementById('gold-amount')) document.getElementById('gold-amount').innerText = hero.gold;

    const badge = document.getElementById('new-item-badge');
    if (badge) {
        if (window.newArtifactsCount > 0) {
            badge.innerText = window.newArtifactsCount;
            badge.style.display = "block";
        } else {
            badge.style.display = "none";
        }
    }
};

window.toggleTreasury = function() {
    const overlay = document.getElementById('treasury-overlay');
    if (!overlay) return;
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "block";
        window.newArtifactsCount = 0;
        window.updateCharacterUI(window.currentHero);
        const grid = document.getElementById('treasury-grid');
        if (grid) {
            const inventory = window.playerInventory || [];
            if (inventory.length > 0) {
                grid.innerHTML = inventory.map(item => `
                    <div style="background: #111; border: 1px solid #d4af37; padding: 15px; text-align: center; border-radius: 8px;">
                        <div style="font-size: 35px; margin-bottom: 5px;">${item.icon}</div>
                        <div style="font-size: 10px; font-weight: bold; color: #d4af37; font-family: 'Cinzel';">${item.name}</div>
                        <div style="font-size: 8px; color: #888; margin-top: 5px;">+${item.bonus.heroPower || 0} Мощ</div>
                    </div>
                `).join('');
            } else {
                grid.innerHTML = "<p style='color: #444; font-size: 12px; grid-column: 1/-1; text-align: center;'>Съкровищницата е празна.</p>";
            }
        }
    } else {
        overlay.style.display = "none";
    }
};

window.updateTimeUI = function() {
    const timeDisplay = document.getElementById('current-time-info');
    if (timeDisplay && window.gameTime) {
        const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
        const currentSeason = seasons[window.gameTime.seasonIndex];
        timeDisplay.innerText = `${currentSeason}, ${window.gameTime.year} пр.н.е.`;
    }
};
