/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Управлява Династичното дърво на владенията в левия панел.
 */

window.updateCharacterUI = function(hero) {
    // 1. ОБНОВЯВАНЕ НА ЛЕВИЯ ПАНЕЛ (Владетел + Региони по Династии)
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        let htmlContent = "";

        // СЕКЦИЯ: ВЛАДЕТЕЛ (КАН) - Винаги най-отгоре
        htmlContent += `
            <div style="text-align: center; padding: 15px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 10px;">
                <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel', serif;">РОД ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 40px; margin: 5px 0;">🏇</div>
                <div style="font-size: 14px; font-weight: bold; color: #eee;">Кан ${hero.name}</div>
            </div>
        `;

        // СЕКЦИЯ: РЕГИОНИ НА КАНА (Директни владения)
        htmlContent += `<div style="font-size: 10px; color: #555; margin: 5px 0 5px 5px; font-family: 'Cinzel', serif;">ЗЕМИ НА РОДА:</div>`;
        window.playerRegions.forEach(reg => {
            htmlContent += `
                <div style="border: 1px solid #222; background: #0a0a0a; padding: 8px; margin-bottom: 5px; border-left: 3px solid #d4af37; font-size: 12px;">
                    <b>${reg}</b>
                </div>
            `;
        });

        // СЕКЦИЯ: СЪПРУГА И НЕЙНИТЕ РЕГИОНИ (Ако има брак)
        if (window.currentSpouse) {
            htmlContent += `
                <div style="margin-top: 20px; text-align: center; padding: 10px; background: rgba(123, 26, 26, 0.1); border: 1px solid #7b1a1a; border-radius: 5px; cursor: pointer;" onclick="window.showSpouseDetails()">
                    <div style="font-size: 10px; color: #ff6b6b; font-family: 'Cinzel', serif;">РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <div style="font-size: 30px;">👸</div>
                    <div style="font-size: 12px; font-weight: bold;">${window.currentSpouse.name}</div>
                </div>
            `;
            
            // Тук ще се показват регионите на нейната династия (ако има такива под неин контрол)
            htmlContent += `<div style="font-size: 10px; color: #555; margin: 5px 0 5px 5px; font-family: 'Cinzel', serif;">ЗЕМИ НА СЪЮЗНИЯ РОД:</div>`;
            if (window.spouseRegions && window.spouseRegions.length > 0) {
                window.spouseRegions.forEach(reg => {
                    htmlContent += `
                        <div style="border: 1px solid #222; background: #0a0a0a; padding: 8px; margin-bottom: 5px; border-left: 3px solid #7b1a1a; font-size: 12px; opacity: 0.8;">
                            <b>${reg}</b>
                        </div>
                    `;
                });
            } else {
                htmlContent += `<div style="font-size: 10px; color: #333; padding-left: 10px;">Няма териториални претенции</div>`;
            }
        }

        leftSidebar.innerHTML = htmlContent;
    }

    // 2. ОБНОВЯВАНЕ НА ДЕСНИЯ ПАНЕЛ (ИНФОРМАЦИЯ И КАЗАРМА)
    const rightPanel = document.getElementById('character-panel');
    if (rightPanel) {
        rightPanel.innerHTML = `
            <h3 style="font-family: 'Cinzel', serif; font-size: 15px; border-bottom: 1px solid #333; padding-bottom: 5px; color: #d4af37;">⚔️ ВОЕНЕН СТАТУС</h3>
            <div style="background: #111; padding: 15px; border: 1px solid #222; border-radius: 5px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <span>Бойна мощ:</span>
                    <b style="color: #ff4d4d;">${hero.heroPower}</b>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                    <span>Армия:</span>
                    <b>${hero.armySize} воини</b>
                </div>
                <button onclick="window.buyUnits()" style="width: 100%; background: transparent; color: #d4af37; border: 1px solid #d4af37; padding: 8px; cursor: pointer; font-size: 11px; font-family: 'Cinzel', serif;">ОБУЧЕНИЕ</button>
            </div>

            <div style="background: rgba(0,0,0,0.5); padding: 12px; border: 1px solid #1a1a1a; font-size: 12px; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>🌟 Престиж:</span>
                    <span style="color: #eee;">${hero.xp}</span>
                </div>
            </div>
        `;
    }

    // Синхронизация на ресурсите горе
    document.getElementById('gold-amount').innerText = hero.gold;
    document.getElementById('army-total').innerText = hero.armySize;
};

// Функция за детайли при клик върху съпругата
window.showSpouseDetails = function() {
    if (window.currentSpouse) {
        window.logEvent(`Съпруга: ${window.currentSpouse.name} от рода ${window.currentSpouse.dynasty}. Този брак осигурява легитимност над съюзните земи.`, "royal");
    }
};
