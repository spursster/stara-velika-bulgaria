// ==================== СЪВЕТНИК ПОПАП (ЗАМЕНЯ STANDARD ALERT) ====================
window.showAdvisorPopup = function(title, message, type = "info") {
    // Премахваме стар попап, ако има
    const oldPopup = document.getElementById('advisor-popup');
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'advisor-popup';
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 300000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        animation: fadeIn 0.2s ease;
    `;

    // Икона според типа
    let icon = "📜";
    if (type === "success") icon = "✅";
    else if (type === "error") icon = "❌";
    else if (type === "warning") icon = "⚠️";

    popup.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #0a0a1a, #0a0a1a);
            border: 2px solid #d4af37;
            border-radius: 28px;
            max-width: 400px;
            width: 90%;
            padding: 24px 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.3);
            position: relative;
        ">
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #0a0a1a; padding: 0 12px;">
                <span style="font-size: 2rem;">📢</span>
            </div>
            <div style="margin-top: 10px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #ffd700; letter-spacing: 1px;">${icon} ${title}</div>
                <div style="height: 2px; width: 80px; background: #d4af37; margin: 12px auto;"></div>
                <div style="font-size: 1rem; color: #f0e6d0; line-height: 1.5; margin: 15px 0;">
                    ${message}
                </div>
                <button id="close-advisor-popup" style="
                    background: linear-gradient(135deg, #2c1a0c, #1f1207);
                    border: 1px solid #d4af37;
                    border-radius: 40px;
                    padding: 8px 24px;
                    color: #ffd700;
                    font-family: 'Cinzel', serif;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                ">РАЗБРАХ, ВОЕВОДО</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('#close-advisor-popup');
    const closeHandler = () => popup.remove();
    closeBtn.addEventListener('click', closeHandler);
    popup.addEventListener('click', (e) => { if (e.target === popup) closeHandler(); });
};

// ==================== ДУЕЛЕН МОДАЛ (ПРЕДИЗВИКАТЕЛСТВО ОТ НЕЛЮБИМ ГЕРОЙ) ====================
window.showDuelChallenge = function(attackerHero) {
    // Премахваме стар модал, ако има
    const oldModal = document.getElementById('duel-modal');
    if (oldModal) oldModal.remove();

    // Генерираме HTML за армията на атакуващия
    let armyHtml = '';
    if (attackerHero.armyDetails && window.ALL_TROOP_TYPES) {
        armyHtml = '<div style="margin-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 12px;"><h4 style="color:#ffd700; margin: 0 0 8px 0;">⚔️ НЕГОВАТА АРМИЯ ⚔️</h4>';
        for (let troop of window.ALL_TROOP_TYPES) {
            let count = attackerHero.armyDetails[troop.id] || 0;
            if (count > 0) {
                armyHtml += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 11px;">
                                <span>${troop.icon} ${troop.name}</span>
                                <span style="color: #ffaa66;">${count} бр.</span>
                             </div>`;
            }
        }
        armyHtml += '</div>';
    } else {
        armyHtml = '<p style="margin-top: 15px; color: #aaa;">Армията му не е известна</p>';
    }

    const modal = document.createElement('div');
    modal.id = 'duel-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 300001;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        animation: fadeIn 0.2s ease;
    `;

    // Име и клас на противника
    const attackerName = attackerHero.leaderName || attackerHero.name || "Непознат";
    const attackerClass = attackerHero.currentClass || "Войн";
    const attackerPower = attackerHero.heroPower || 100;
    const portraitUrl = attackerHero.portrait || '';

    const portraitHtml = portraitUrl ? 
        `<img src="${portraitUrl}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #d4af37; margin: 0 auto 10px auto; object-fit: cover;">` :
        `<div style="font-size: 48px; margin-bottom: 10px;">${window.getClassIcon ? window.getClassIcon(attackerClass) : '⚔️'}</div>`;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #0a0a1a, #0a0a1a);
            border: 2px solid #d4af37;
            border-radius: 28px;
            max-width: 450px;
            width: 90%;
            padding: 24px 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.3);
            position: relative;
        ">
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #0a0a1a; padding: 0 12px;">
                <span style="font-size: 2rem;">⚔️</span>
            </div>
            <div style="margin-top: 10px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #ffd700; letter-spacing: 1px;">ДВУБОЙ</div>
                <div style="height: 2px; width: 80px; background: #d4af37; margin: 12px auto;"></div>
                
                ${portraitHtml}
                <div style="font-size: 1.2rem; font-weight: bold; color: #ffdd99;">${attackerName}</div>
                <div style="font-size: 0.9rem; color: #ccaa77;">${attackerClass} · ⚔️ Сила: ${attackerPower}</div>
                
                ${armyHtml}
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                    <button id="accept-duel" style="
                        background: linear-gradient(135deg, #7a2e1a, #5a1e0a);
                        border: 1px solid #d4af37;
                        border-radius: 40px;
                        padding: 10px 24px;
                        color: #ffdd99;
                        font-family: 'Cinzel', serif;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">⚔️ ПРИЕМИ</button>
                    <button id="flee-duel" style="
                        background: linear-gradient(135deg, #2c1a0c, #1f1207);
                        border: 1px solid #d4af37;
                        border-radius: 40px;
                        padding: 10px 24px;
                        color: #ffdd99;
                        font-family: 'Cinzel', serif;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">🏃 ИЗБЯГАЙ</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Обработка на бутоните
    const acceptBtn = modal.querySelector('#accept-duel');
    const fleeBtn = modal.querySelector('#flee-duel');

    acceptBtn.onclick = () => {
        modal.remove();
        // Стартираме битка срещу този герой
        startBattleAgainstHero(attackerHero);
    };

    fleeBtn.onclick = () => {
        modal.remove();
        // Може да добавите наказание – например загуба на малко злато или армия
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🏃‍♂️ Избягахте от двубоя с ${attackerName}!`);
        // Евентуално намаляване на армията с 5% като "наказание за бягство"
        if (window.currentHero && window.currentHero.armySize) {
            let loss = Math.floor(window.currentHero.armySize * 0.05);
            window.currentHero.armySize = Math.max(10, window.currentHero.armySize - loss);
            window.currentHero.currentArmy = window.currentHero.armySize;
            if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
            if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        }
    };
};
