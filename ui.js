/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        // Проверка за активен брак и добавяне на икона пръстен до името
        const marriageIcon = window.currentSpouse ? ' <span title="Сключен династичен съюз" style="cursor:help;">💍</span>' : '';

        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 9px; color: #d4af37;">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 25px;">🏇</div>
                <div style="font-size: 12px; font-weight: bold; color: #fff;">Кан ${hero.name}${marriageIcon}</div>
            </div>
            <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel'; margin-bottom: 5px;">ВЛАДЕНИЯ:</div>
        `;

        // Изписване на регионите
        const regions = window.playerRegions || [];
        regions.forEach(reg => {
            treeHTML += `<div style="border: 1px solid #222; background: #0c0c0c; padding: 6px; margin-bottom: 3px; border-left: 2px solid #d4af37; font-size: 10px;">${reg}</div>`;
        });

        // Показване на Княгинята, ако има брак
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

    // Синхронизация на ресурсите в хедъра
    const goldElem = document.getElementById('gold-amount');
    const armyElem = document.getElementById('army-val');
    const powerElem = document.getElementById('hero-power-val');

    if (goldElem) goldElem.innerText = hero.gold;
    if (armyElem) armyElem.innerText = hero.armySize;
    if (powerElem) powerElem.innerText = hero.heroPower;
};

// Функция за изчистване на главната зона
window.clearMainArea = function() {
    const mainArea = document.getElementById('game-main-area');
    if (mainArea) mainArea.innerHTML = '';
};

/**
 * ПЕРСОНАЛИЗИРАНО СЪОБЩЕНИЕ ОТ СЪВЕТНИКА (Замества стандартния alert)
 */
window.showAdvisorMsg = function(text) {
    const oldMsg = document.getElementById('advisor-msg');
    if (oldMsg) oldMsg.remove();

    const msgBox = document.createElement('div');
    msgBox.id = 'advisor-msg';
    msgBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #0a0a0a; border: 2px solid #d4af37; color: #eee;
        padding: 25px; z-index: 9999; width: 320px; text-align: center;
        box-shadow: 0 0 30px rgba(0,0,0,0.9); font-family: 'Cinzel', serif;
        border-radius: 4px;
    `;

    msgBox.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 15px;">📜</div>
        <div style="color: #d4af37; font-size: 11px; margin-bottom: 10px; letter-spacing: 1.5px; border-bottom: 1px solid #333; padding-bottom: 5px;">СЪВЕТНИКА ВИ КАЗА ЧЕ:</div>
        <div style="font-size: 14px; margin-bottom: 25px; line-height: 1.5; color: #fff;">${text}</div>
        <button onclick="this.parentElement.remove()" style="
            background: #d4af37; color: #000; border: none; padding: 10px;
            cursor: pointer; font-family: 'Cinzel'; font-weight: bold; width: 100%;
            transition: 0.3s;
        ">СЛУШАМ, ВЕЛИКИ КАНЕ</button>
    `;

    document.body.appendChild(msgBox);
};
