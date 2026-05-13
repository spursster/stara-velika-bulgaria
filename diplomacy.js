/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България
 */

window.clanRelations = {};

window.initDiplomacy = function() {
    // Всички династии присъстват едновременно
    Object.keys(window.bulgarianDynasties).forEach(dyn => {
        window.clanRelations[dyn] = (dyn === window.currentHero.dynasty) ? 100 : 40;
    });
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    screen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: #080808; z-index: 1500; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto;
    `;

    let clansHTML = Object.keys(window.clanRelations).map(clan => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #222; background: ${clan === window.currentHero.dynasty ? 'rgba(212,175,55,0.1)' : 'transparent'}">
            <div>
                <b style="color: #d4af37; font-family: 'Cinzel';">Род ${clan}</b>
                <div style="font-size: 10px;">Отношения: ${window.clanRelations[clan]}%</div>
            </div>
            <div>
                <button onclick="window.sendGift('${clan}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 5px 10px; cursor: pointer; font-size: 10px;">Дари злато</button>
                <button onclick="window.openMarriageMenu('${clan}')" style="background: #7b1a1a; color: #fff; border: none; padding: 5px 10px; cursor: pointer; font-size: 10px; margin-left: 5px;">💍 Брак</button>
            </div>
        </div>
    `).join('');

    screen.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <h2 style="font-family: 'Cinzel'; color: #d4af37; margin: 0;">ВЕЛИКИ БЪЛГАРСКИ РОДОВЕ</h2>
            <button onclick="document.getElementById('diplomacy-screen').remove()" style="color: #ff4d4d; background:none; border:none; cursor:pointer; font-size:20px;">✕</button>
        </div>
        <div style="margin-top: 15px;">${clansHTML}</div>
    `;
    mainArea.appendChild(screen);
};

window.sendGift = function(clan) {
    if (window.currentHero.gold >= 100) {
        window.currentHero.gold -= 100;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        window.logEvent(`Изпратихте дарове на род ${clan}.`, "action");
        document.getElementById('diplomacy-screen').remove();
        window.openDiplomacy();
        window.updateCharacterUI(window.currentHero);
    }
};

window.openMarriageMenu = function(clan) {
    if (window.currentSpouse) {
        alert("Вече имате сключен съюз чрез брак!");
        return;
    }
    if (window.clanRelations[clan] < 60) {
        alert(`Род ${clan} не ви вярва достатъчно за брак. Подобрете отношенията!`);
        return;
    }
    
    // Сключване на брак
    window.currentSpouse = { name: "Принцеса", dynasty: clan };
    window.clanRelations[clan] = 100;
    window.logEvent(`Сключихте съюз с род ${clan}!`, "royal");
    document.getElementById('diplomacy-screen').remove();
    window.updateCharacterUI(window.currentHero);
};
