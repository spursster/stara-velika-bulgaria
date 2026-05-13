/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Визуализира Династичното дърво (ляво) и Военното дело (дясно).
 */

window.updateCharacterUI = function(hero) {
    // --- ЛЯВ ПАНЕЛ: ДИНАСТИЧНО ДЪРВО И РЕГИОНИ ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let treeHTML = "";

        // 1. ИКОНА И ИНФО ЗА ВЛАДЕТЕЛЯ (Най-отгоре)
        treeHTML += `
            <div style="text-align: center; padding: 15px; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel', serif; letter-spacing: 1px;">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 45px; margin: 10px 0;">🏇</div>
                <div style="font-size: 14px; font-weight: bold; color: #fff; font-family: 'Cinzel', serif;">Кан ${hero.name}</div>
            </div>
        `;

        // 2. РЕГИОНИ НА СЪЩАТА ДИНАСТИЯ
        treeHTML += `<div style="font-size: 10px; color: #888; margin: 0 0 8px 5px; font-family: 'Cinzel', serif;">ВЛАДЕНИЯ НА РОДА:</div>`;
        window.playerRegions.forEach(reg => {
            treeHTML += `
                <div style="border: 1px solid #222; background: #0c0c0c; padding: 10px; margin-bottom: 6px; border-left: 4px solid #d4af37; font-size: 12px; color: #eee;">
                    <b>${reg}</b>
                </div>
            `;
        });

        // 3. СЪПРУГА И НЕЙНИТЕ РЕГИОНИ (Ако има брак)
        if (window.currentSpouse) {
            treeHTML += `
                <div style="margin-top: 25px; text-align: center; padding: 12px; background: rgba(123, 26, 26, 0.1); border: 1px solid #7b1a1a; border-radius: 5px; cursor: pointer; transition: 0.3s;" onclick="window.showSpouseMenu()">
                    <div style="font-size: 10px; color: #ff6b6b; font-family: 'Cinzel', serif;">РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <div style="font-size: 35px; margin: 5px 0;">👸</div>
                    <div style="font-size: 13px; font-weight: bold; color: #eee;">${window.currentSpouse.name}</div>
                </div>
            `;
            
            treeHTML += `<div style="font-size: 10px; color: #888; margin: 8px 0 8px 5px; font-family: 'Cinzel', serif;">СЪЮЗНИ ЗЕМИ (БРАК):</div>`;
            if (window.spouseRegions && window.spouseRegions.length > 0) {
                window.spouseRegions.forEach(reg => {
                    treeHTML += `
                        <div style="border: 1px solid #222; background: #0c0c0c; padding: 10px; margin-bottom: 6px; border-left: 4px solid #7b1a1a; font-size: 12px; color: #bbb;">
                            <b>${reg}</b>
                        </div>
                    `;
                });
            } else {
                treeHTML += `<div style="font-size: 10px; color: #444; padding-left: 10px; font-style: italic;">Няма териториален зестра</div>`;
            }
        }

        leftSidebar.innerHTML = treeHTML;
    }

    // --- ДЕСЕН ПАНЕЛ: ВОЕННО ДЕЛО ---
    const rightPanel = document.getElementById('character-panel');
    if (rightPanel) {
        rightPanel.innerHTML = `
            <h3 style="font-family: 'Cinzel', serif; font-size: 14px; border-bottom: 1px solid #333; padding-bottom: 8px; color: #d4af37; margin-top: 0; letter-spacing: 1px;">⚔️ ВОЕНЕН СТАТУС</h3>
            <div style="background: #111; padding: 15px; border: 1px solid #222; border-radius: 5px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px;">
                    <span style="color: #888;">Лична мощ:</span>
                    <b style="color: #ff4d4d;">${hero.heroPower}</b>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 13px;">
                    <span style="color: #888;">Войски:</span>
                    <b style="color: #eee;">${hero.armySize}🛡️</b>
                </div>
                <button onclick="window.buyUnits()" style="width: 100%; background: transparent; color: #d4af37; border: 1px solid #d4af37; padding: 10px; cursor: pointer; font-size: 11px; font-family: 'Cinzel', serif; text-transform: uppercase; transition: 0.3s;">Обучение на воини</button>
            </div>

            <div style="background: rgba(255,255,255,0.03); padding: 15px; border: 1px solid #1a1a1a; font-size: 12px; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #888;">🌟 Престиж на рода:</span>
                    <b style="color: #d4af37;">${hero.xp}</b>
                </div>
            </div>
        `;
    }

    // Синхронизация с хедъра (Командния център)
    const goldDisplay = document.getElementById('gold-amount');
    const armyDisplay = document.getElementById('army-total');
    if (goldDisplay) goldDisplay.innerText = hero.gold;
    if (armyDisplay) armyDisplay.innerText = hero.armySize;
};

// Функция при клик върху иконата на съпругата
window.showSpouseMenu = function() {
    if (window.currentSpouse) {
        window.logEvent(`Детайли за съпругата: ${window.currentSpouse.name} от династия ${window.currentSpouse.dynasty}. Тяхното влияние поддържа мира в съюзните региони.`, "royal");
    }
};
