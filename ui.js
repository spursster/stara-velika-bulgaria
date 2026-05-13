const INVENTORY_SLOTS = [
    { id: 'head', label: 'Шлем' }, { id: 'neck', label: 'Амулет' },
    { id: 'body', label: 'Доспехи' }, { id: 'mainHand', label: 'Оръжие' },
    { id: 'offHand', label: 'Щит' }, { id: 'ring1', label: 'Пръстен 1' },
    { id: 'ring2', label: 'Пръстен 2' }, { id: 'feet', label: 'Ботуши' },
    { id: 'relic', label: 'Артефакт' }
];

window.updateCharacterUI = function(hero) {
    const uiContainer = document.getElementById('character-panel');
    const yearEl = document.getElementById('game-year');
    const goldEl = document.getElementById('game-gold');
    
    if (!uiContainer || !hero) return;
    if (yearEl) yearEl.innerText = window.gameYear || 1;
    if (goldEl) goldEl.innerText = window.gameGold || 0;

    if (!hero.isAlive) {
        window.showSuccessionMenu();
        return;
    }

    // 1. Генериране на адаптивната мрежа за провинции (2 или 3 колони чрез CSS)
    let provincesHTML = '<div class="provinces-container">';
    window.playerRegions.forEach(reg => {
        provincesHTML += `
            <div class="province-slot">
                <div class="province-name">${reg.name}</div>
                <img src="${reg.img}" class="province-img">
            </div>`;
    });
    provincesHTML += '</div>';

    // 2. Рендиране на UI (Картата е под събитията и над бутоните)
    uiContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px;">
            <h2 class="clickable-name" onclick="window.toggleCharacterModal(true)">👑 Кан ${hero.name}</h2>
            <small style="color: #ffd700;">Род ${hero.dynasty} | ${hero.trait}</small>
            <p style="margin: 5px 0; color: #aaa; font-size: 13px;">${hero.armyRank} (${hero.armySize} бойци)</p>
        </div>

        <h4 style="color: #d4af37; margin: 10px 0; text-align: center; font-size: 12px;">🗺️ ВЛАДЕНИЯ</h4>
        ${provincesHTML}

        <h4 style="color: #d4af37; margin: 15px 0 5px 0; font-size: 12px; text-align: center;">📜 УПРАВЛЕНИЕ</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.advanceYear(window.currentHero)" style="background: #333; color: white; border: 1px solid #444; padding: 12px; cursor: pointer;">⌛ Година +1</button>
            <button onclick="window.levelUpCurrentHero()" style="background: #333; color: white; border: 1px solid #444; padding: 12px; cursor: pointer;">🏋️ Тренировка</button>
            <button onclick="window.handleBattleClick()" style="background: #721c24; color: white; border: none; padding: 12px; cursor: pointer;">⚔️ Битка</button>
            <button onclick="window.handleMarriageClick()" style="background: #1e7e34; color: white; border: none; padding: 12px; cursor: pointer;">💍 Брак</button>
            <button onclick="window.handleRitualClick()" style="background: #8e44ad; color: white; border: none; padding: 12px; cursor: pointer; grid-column: span 2;">🔥 Древен Ритуал</button>
        </div>

        <h4 style="color: #d4af37; margin: 20px 0 5px 0; font-size: 12px; text-align: center;">⚔️ КАЗАРМИ</h4>
        <div style="display: flex; flex-direction: column; gap: 5px; background: #1a1a1a; padding: 10px; border-radius: 5px;">
            <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="text-align: left; padding: 10px; font-size: 11px; cursor: pointer; background: #222; color: #ccc; border: 1px solid #444;">🏹 Пехота (100🪙)</button>
            <button onclick="window.handleRecruit('КОННИЦА')" style="text-align: left; padding: 10px; font-size: 11px; cursor: pointer; background: #222; color: #ccc; border: 1px solid #444;">🏇 Конница (300🪙)</button>
            <button onclick="window.handleRecruit('СТРЕЛЦИ')" style="text-align: left; padding: 10px; font-size: 11px; cursor: pointer; background: #222; color: #ccc; border: 1px solid #444;">🎯 Стрелци (150🪙)</button>
        </div>
    `;

    window.renderCharacterModal(hero);
};

window.renderCharacterModal = function(hero) {
    let modal = document.getElementById('hero-modal-overlay');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hero-modal-overlay';
        modal.className = 'modal-overlay';
        modal.onclick = (e) => { if(e.target === modal) window.toggleCharacterModal(false); };
        document.body.appendChild(modal);
    }

    let inventoryHTML = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 15px;">';
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div style="background: #111; border: 1px solid #444; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px;">
                <span style="color: #666;">${slot.label}</span>
                <div style="color: #d4af37; font-weight: bold; text-align: center;">${item ? item.name : '---'}</div>
            </div>`;
    });
    inventoryHTML += '</div>';

    modal.innerHTML = `
        <div class="character-modal">
            <h2 style="color: #d4af37; text-align: center; margin-top: 0;">Кан ${hero.name}</h2>
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px;">
                <span>Възраст: ${hero.age} г.</span>
                <span>Ниво: ${hero.level}</span>
            </div>
            <h4 style="color: #d4af37; border-bottom: 1px solid #444; margin-bottom: 10px; text-align: center;">🛡️ ЕКИПИРОВКА</h4>
            ${inventoryHTML}
            <button onclick="window.toggleCharacterModal(false)" style="width: 100%; margin-top: 20px; padding: 10px; background: #d4af37; border: none; cursor: pointer; font-weight: bold;">ЗАТВОРИ</button>
        </div>
    `;
};

window.toggleCharacterModal = (show) => {
    const modal = document.getElementById('hero-modal-overlay');
    if (modal) modal.style.display = show ? 'flex' : 'none';
};

window.handleBattleClick = () => window.simulateBattle(window.currentHero, 'Ромеи');
window.handleMarriageClick = () => window.proposeMarriage(window.currentHero, 'Ромеи');
window.levelUpCurrentHero = () => { window.currentHero.levelUp(); window.updateCharacterUI(window.currentHero); };
window.handleRitualClick = () => {
    const res = window.performAncientRitual(window.currentHero);
    const log = document.getElementById('event-log');
    if (log) log.innerHTML += `<p style="color: #8e44ad;">[Ритуал] ${res}</p>`;
};
window.handleRecruit = (t) => {
    const m = window.recruitUnit(window.currentHero, t);
    const log = document.getElementById('event-log');
    if (log) log.innerHTML += `<p style="color: #ffd700;">[Армия] ${m}</p>`;
};

window.showSuccessionMenu = function() {
    const uiContainer = document.getElementById('character-panel');
    let html = `<div style="background: #111; padding: 15px; border: 1px solid #d4af37; border-radius: 5px;">
        <h3 style="color: #d4af37; text-align: center;">👑 Избор на Наследник</h3>`;
    window.potentialSuccessors.forEach((s, i) => {
        html += `<button onclick="window.selectSuccessor(${i})" style="width: 100%; background: #222; color: white; border: 1px solid #444; padding: 12px; margin-bottom: 8px; cursor: pointer;">
            <strong>${s.name}</strong> (${s.trait})</button>`;
    });
    uiContainer.innerHTML = html + `</div>`;
};

window.selectSuccessor = function(index) {
    const chosen = window.potentialSuccessors[index];
    if (window.familyLegacy) chosen.inventory = { ...window.familyLegacy };
    window.currentHero = chosen;
    window.updateCharacterUI(chosen);
};

window.advanceYear = function(hero) {
    window.gameYear = (window.gameYear || 1) + 1;
    window.gameGold = (window.gameGold || 0) + 100; // Данъци
    window.handleAging(hero);
    window.updateCharacterUI(hero);
};
