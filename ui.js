// Глобални манипулатори на събития, за да няма грешки в конзолата
window.handleBattleClick = () => { window.simulateBattle(window.currentHero); window.updateCharacterUI(window.currentHero); };
window.handleMarriageClick = () => { window.gameGold += 100; window.updateCharacterUI(window.currentHero); };
window.handleRitualClick = () => { window.performAncientRitual(window.currentHero); window.updateCharacterUI(window.currentHero); };
window.handleRecruit = (type) => { window.recruitUnit(window.currentHero, type); window.updateCharacterUI(window.currentHero); };

window.updateCharacterUI = function(hero) {
    const uiContainer = document.getElementById('character-panel');
    const t = window.translations[window.gameLang];
    
    document.getElementById('game-year').innerText = `${window.gameYear} ${t.year}`;
    document.getElementById('game-gold').innerText = window.gameGold;
    
    if (!uiContainer || !hero) return;

    let divineIcons = hero.divineUnits.map(g => `<span style="color:#8e44ad; font-size:18px;">✨</span>`).join("");

    let provincesHTML = '<div class="provinces-container">';
    window.playerRegions.forEach(reg => {
        provincesHTML += `<div class="province-slot"><div class="province-name">${reg.name[window.gameLang]}</div><img src="${reg.img}" class="province-img"></div>`;
    });
    provincesHTML += '</div>';

    uiContainer.innerHTML = `
        <div class="language-switcher" style="display:flex; justify-content:center; gap:15px; margin-bottom:10px; font-size:20px;">
            <span style="cursor:pointer" onclick="window.setLanguage('bg')">🇧🇬</span>
            <span style="cursor:pointer" onclick="window.setLanguage('en')">🇺🇸</span>
            <span style="cursor:pointer" onclick="window.setLanguage('ru')">🇷🇺</span>
        </div>

        <div style="text-align: center; margin-bottom: 10px;">
            <h2 style="cursor:pointer; color:#d4af37;" onclick="window.toggleCharacterModal(true)">Кан ${hero.name}</h2>
            <div>${divineIcons}</div>
            <p style="color: #aaa; font-size: 12px;">${hero.armySize} ${t.army}</p>
        </div>

        <button onclick="window.toggleFullScreen()" style="width:100%; background:#222; color:#555; border:1px solid #333; font-size:10px; margin-bottom:10px; padding:5px;">⛶ ${t.fs}</button>

        <h4 style="color:#d4af37; text-align:center; font-size:11px; margin:10px 0;">🗺️ ${t.domains}</h4>
        ${provincesHTML}

        <h4 style="color:#d4af37; text-align:center; margin-top:15px; font-size:11px;">📜 ${t.infra}</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.advanceYear(window.currentHero)" style="background:#333; color:white; padding:12px; cursor:pointer; border:1px solid #444;">${t.yearPlus}</button>
            <button onclick="window.handleBattleClick()" style="background:#721c24; color:white; padding:12px; cursor:pointer; border:none;">${t.battle}</button>
            <button onclick="window.handleMarriageClick()" style="background:#1e7e34; color:white; padding:12px; cursor:pointer; border:none;">${t.marriage}</button>
            <button onclick="window.handleRitualClick()" style="background:#8e44ad; color:white; padding:12px; cursor:pointer; border:none;">${t.ritual}</button>
        </div>

        <h4 style="color:#d4af37; text-align:center; margin-top:20px; font-size:11px;">⚔️ ${t.recruit}</h4>
        <div style="display:flex; flex-direction:column; gap:5px;">
            <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="background:#222; color:#ccc; padding:10px; text-align:left; border:1px solid #444;">🏹 ${t.inf} (100🪙)</button>
            <button onclick="window.handleRecruit('КОННИЦА')" style="background:#222; color:#ccc; padding:10px; text-align:left; border:1px solid #444;">🏇 ${t.cav} (300🪙)</button>
            <button onclick="window.handleRecruit('СТРЕЛЦИ')" style="background:#222; color:#ccc; padding:10px; text-align:left; border:1px solid #444;">🎯 ${t.arc} (150🪙)</button>
        </div>
    `;

    window.renderCharacterModal(hero);
};

window.renderCharacterModal = function(hero) {
    let modal = document.getElementById('hero-modal-overlay');
    const t = window.translations[window.gameLang];
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hero-modal-overlay';
        modal.style.cssText = "display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999; justify-content:center; align-items:center;";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background:#1a1a1a; border:2px solid #d4af37; padding:20px; width:80%; max-width:300px; border-radius:10px; color:white;">
            <h3 style="color:#d4af37; text-align:center;">Кан ${hero.name}</h3>
            <p>${t.level}: ${hero.level}</p>
            <p>${t.age}: ${hero.age}</p>
            <p>${t.dynasty}: ${hero.dynasty}</p>
            <button onclick="window.toggleCharacterModal(false)" style="width:100%; padding:10px; background:#d4af37; border:none; margin-top:10px; cursor:pointer; font-weight:bold;">${t.close}</button>
        </div>
    `;
};

window.toggleCharacterModal = (show) => {
    const m = document.getElementById('hero-modal-overlay');
    if (m) m.style.display = show ? 'flex' : 'none';
};

window.advanceYear = function(hero) {
    window.gameYear += 1;
    window.gameGold += 150;
    hero.age += 1;
    window.updateCharacterUI(hero);
};
