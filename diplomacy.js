/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България
 */

window.clanRelations = {
    "Дуло": 100,
    "Вокил": 50,
    "Угаин": 40,
    "Ерми": 60
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const diplomacyScreen = document.createElement('div');
    diplomacyScreen.id = "diplomacy-screen";
    diplomacyScreen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: #080808; z-index: 1500; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; color: #eee;
    `;

    let clansHTML = Object.keys(window.clanRelations).map(clan => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #222;">
            <div>
                <b style="color: #d4af37; font-family: 'Cinzel';">Род ${clan}</b>
                <div style="font-size: 10px;">Отношения: ${window.clanRelations[clan]}%</div>
            </div>
            <div>
                <button onclick="window.sendGift('${clan}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 5px 10px; cursor: pointer; font-size: 11px;">Дари злато (-100 💰)</button>
            </div>
        </div>
    `).join('');

    diplomacyScreen.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <h2 style="font-family: 'Cinzel'; color: #d4af37; margin: 0;">СЪВЕТ НА РОДОВЕТЕ</h2>
            <button onclick="document.getElementById('diplomacy-screen').remove()" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 20px;">✕</button>
        </div>
        <p style="font-size: 13px; margin: 15px 0;">Укрепвайте връзките с другите български родове, за да си осигурите подкрепа в трудни времена.</p>
        <div style="margin-top: 20px;">${clansHTML}</div>
    `;

    mainArea.appendChild(diplomacyScreen);
};

window.sendGift = function(clan) {
    const hero = window.currentHero;
    if (hero.gold >= 100) {
        hero.gold -= 100;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        if (window.logEvent) window.logEvent(`Изпратихте дарове на род ${clan}. Отношенията се подобриха.`, "action");
        document.getElementById('diplomacy-screen').remove();
        window.openDiplomacy(); // Refresh
        window.updateCharacterUI(hero);
    } else {
        alert("Нямате достатъчно злато!");
    }
};
