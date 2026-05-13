window.updateCharacterUI = function(hero) {
    const uiContainer = document.getElementById('character-panel');
    document.getElementById('game-year').innerText = window.gameYear + " г.";
    document.getElementById('game-gold').innerText = window.gameGold;
    
    if (!uiContainer || !hero || !hero.isAlive) return;

    // Благословии (Визуализация под името)
    let divineIcons = hero.divineUnits.map(g => `<span title="${g.gift}" style="color:#8e44ad; font-size:18px; margin:0 3px;">✨</span>`).join("");

    let provincesHTML = '<div class="provinces-container">';
    window.playerRegions.forEach(reg => {
        provincesHTML += `<div class="province-slot"><div class="province-name">${reg.name}</div><img src="${reg.img}" class="province-img"></div>`;
    });
    provincesHTML += '</div>';

    uiContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
            <h2 class="clickable-name" onclick="window.toggleCharacterModal(true)">Кан ${hero.name}</h2>
            <div>${divineIcons}</div>
            <small style="color: #ffd700;">Род ${hero.dynasty} | ${hero.trait}</small>
            <p style="color: #aaa; font-size: 12px;">${hero.armyRank}: ${hero.armySize} воини</p>
        </div>

        <button onclick="window.toggleFullScreen()" style="width:100%; background:#222; color:#555; border:1px solid #333; font-size:10px; margin-bottom:10px;">⛶ ЦЯЛ ЕКРАН</button>

        <h4 style="color:#d4af37; text-align:center; font-size:11px;">🗺️ ВЛАДЕНИЯ</h4>
        ${provincesHTML}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top:15px;">
            <button onclick="window.advanceYear(window.currentHero)" style="background:#333; color:white; padding:12px; cursor:pointer; border:1px solid #444;">⌛ Година +1</button>
            <button onclick="window.handleBattleClick()" style="background:#721c24; color:white; padding:12px; cursor:pointer; border:none;">⚔️ Битка</button>
            <button onclick="window.handleMarriageClick()" style="background:#1e7e34; color:white; padding:12px; cursor:pointer; border:none;">💍 Брак</button>
            <button onclick="window.handleRitualClick()" style="background:#8e44ad; color:white; padding:12px; cursor:pointer; border:none;">🔥 Ритуал</button>
        </div>

        <h4 style="color:#d4af37; text-align:center; margin-top:20px; font-size:11px;">⚔️ КАЗАРМА</h4>
        <div style="display:flex; flex-direction:column; gap:5px;">
            <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="background:#222; color:#ccc; padding:10px; text-align:left; border:1px solid #444;">🏹 Пехота (100🪙)</button>
            <button onclick="window.handleRecruit('КОННИЦА')" style="background:#222; color:#ccc; padding:10px; text-align:left; border:1px solid #444;">🏇 Конница (300🪙)</button>
        </div>
    `;
};

// Функция за Цял Екран
window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
};

window.handleBattleClick = () => window.simulateBattle(window.currentHero, 'Ромеи');
window.handleMarriageClick = () => {
    const res = window.proposeMarriage(window.currentHero, 'Ромеи');
    document.getElementById('event-log').innerHTML += `<p style="color:#1e7e34;">💍 ${res}</p>`;
    window.updateCharacterUI(window.currentHero);
};
window.handleRitualClick = () => {
    const res = window.performAncientRitual(window.currentHero);
    document.getElementById('event-log').innerHTML += `<p style="color:#8e44ad;">✨ ${res}</p>`;
    window.updateCharacterUI(window.currentHero);
};
window.handleRecruit = (t) => {
    const res = window.recruitUnit(window.currentHero, t);
    document.getElementById('event-log').innerHTML += `<p style="color:#ffd700;">⚔️ ${res}</p>`;
    window.updateCharacterUI(window.currentHero);
};

// Помощна функция за модалния прозорец (същата като преди)
window.toggleCharacterModal = (show) => {
    const m = document.getElementById('hero-modal-overlay');
    if (m) m.style.display = show ? 'flex' : 'none';
};
