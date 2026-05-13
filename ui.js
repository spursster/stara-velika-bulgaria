/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 9px; color: #d4af37;">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 25px;">🏇</div>
                <div style="font-size: 12px; font-weight: bold; color: #fff;">Кан ${hero.name}</div>
            </div>
            <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel'; margin-bottom: 5px;">ВЛАДЕНИЯ:</div>
        `;

        (window.playerRegions || []).forEach(reg => {
            treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 6px; margin-bottom: 3px; border-left: 2px solid #d4af37; font-size: 10px;">${reg}</div>`;
        });

        // ФИКС: Показване на съпругата веднага
        if (window.currentSpouse) {
            treeHTML += `
                <div style="margin-top: 15px; text-align: center; padding: 8px; background: rgba(123, 26, 26, 0.2); border: 1px solid #7b1a1a; border-radius: 5px;">
                    <div style="font-size: 8px; color: #ff6b6b;">СЪЮЗ С РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <div style="font-size: 20px;">👸</div>
                    <div style="font-size: 10px; color: #fff;">Княгиня</div>
                </div>
            `;
        }
        leftSidebar.innerHTML = treeHTML;
    }

    if(document.getElementById('gold-amount')) document.getElementById('gold-amount').innerText = hero.gold;
    if(document.getElementById('army-val')) document.getElementById('army-val').innerText = hero.armySize;
    if(document.getElementById('hero-power-val')) document.getElementById('hero-power-val').innerText = hero.heroPower;
};
