/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 */

window.newArtifactsCount = 0;

window.updateCharacterUI = function(hero) {
    // 1. ЛЯВ ПАНЕЛ: ДИНАСТИЧНО ДЪРВО
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let treeHTML = `
            <div style="text-align: center; padding: 15px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel', serif;">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 40px; margin: 5px 0;">🏇</div>
                <div style="font-size: 13px; font-weight: bold; color: #fff;">Кан ${hero.name}</div>
            </div>
        `;

        window.playerRegions.forEach(reg => {
            treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 10px; margin-bottom: 5px; border-left: 3px solid #d4af37; font-size: 11px;"><b>${reg}</b></div>`;
        });

        if (window.currentSpouse) {
            treeHTML += `
                <div style="margin-top: 20px; text-align: center; padding: 10px; background: rgba(123, 26, 26, 0.1); border: 1px solid #7b1a1a; border-radius: 5px;">
                    <div style="font-size: 9px; color: #ff6b6b; font-family: 'Cinzel', serif;">РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <div style="font-size: 30px;">👸</div>
                    <div style="font-size: 12px; font-weight: bold;">${window.currentSpouse.name}</div>
                </div>
            `;
            window.spouseRegions.forEach(reg => {
                treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 10px; margin-bottom: 5px; border-left: 3px solid #7b1a1a; font-size: 11px; opacity: 0.8;"><b>${reg}</b></div>`;
            });
        }
        leftSidebar.innerHTML = treeHTML;
    }

    // 2. ОБНОВЯВАНЕ НА ACTION BAR
    if(document.getElementById('hero-power-val')) document.getElementById('hero-power-val').innerText = hero.heroPower;
    if(document.getElementById('army-val')) document.getElementById('army-val').innerText = hero.armySize;
    if(document.getElementById('gold-amount')) document.getElementById('gold-amount').innerText = hero.gold;

    // 3. УПРАВЛЕНИЕ НА ИНДИКАТОРА ЗА НОВИ ПРЕДМЕТИ
    const badge = document.getElementById('new-item-badge');
    if (window.newArtifactsCount > 0) {
        badge.innerText = window.newArtifactsCount;
        badge.style.display = "block";
    } else {
        badge.style.display = "none";
    }
};

window.toggleTreasury = function() {
    const overlay = document.getElementById('treasury-overlay');
    const isOpening = overlay.style.display === "none";
    
    overlay.style.display = isOpening ? "block" : "none";
    
    if (isOpening) {
        window.newArtifactsCount = 0; 
        window.updateCharacterUI(window.currentHero);
        
        const grid = document.getElementById('treasury-grid');
        grid.innerHTML = window.playerInventory.map(item => `
            <div style="background: #111; border: 1px solid #d4af37; padding: 20px; text-align: center; border-radius: 8px; transition: 0.3s; cursor: help;" title="${item.description}">
                <div style="font-size: 40px; margin-bottom: 10px;">${item.icon}</div>
                <div style="font-size: 11px; font-weight: bold; color: #d4af37; font-family: 'Cinzel', serif;">${item.name.toUpperCase()}</div>
                <div style="font-size: 9px; color: #888; margin-top: 5px;">Мощ: +${item.bonus.heroPower || 0}</div>
            </div>
        `).join('') || "<p style='color: #444; font-size: 14px;'>Няма открити артефакти в съкровищницата.</p>";
    }
};
