/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН) - Велика България
 * СТАТУС: СИНХРОНИЗИРАН С КОНТЕЙНЕР
 */

window.buyUnits = function() { // Тази функция се вика от бутона в footer-а
    const container = document.getElementById('barracks-container');
    if (!container) return;

    // Показваме контейнера
    container.style.display = 'block';
    window.renderBarracksContent();
};

window.renderBarracksContent = function() {
    const container = document.getElementById('barracks-container');
    const hero = window.currentHero;
    if (!hero || !container) return;

    // Изчисляване на цена
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    const baseCost = 250; 
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 100;

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">
            <h2 style="color: #d4af37; margin: 0; font-family: 'Cinzel'; letter-spacing: 2px;">ВОЕНЕН СТАН</h2>
            <button onclick="document.getElementById('barracks-container').style.display='none'" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:24px;">✕</button>
        </div>
        
        <p style="font-style: italic; color: #ccc; margin-bottom: 25px; font-size: 0.9em;">
            "Мечът решава споровете, които думите не могат. Подгответе вашите конници, Велики Кане!"
        </p>

        <div style="background: rgba(212,175,55,0.05); padding: 20px; border: 1px solid #444; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
            <div>
                <h3 style="margin: 0; color: #d4af37; font-family: 'Cinzel';">БЪЛГАРСКА КОННИЦА</h3>
                <p style="font-size: 0.8em; margin: 5px 0 0 0; color: #aaa;">Отряд от ${amount} елитни конници</p>
            </div>
            
            <div style="text-align: right;">
                <div style="font-size: 1.2em; font-weight: bold; color: #fff; margin-bottom: 10px;">${finalCost} 💰</div>
                <button onclick="window.executeRecruitment(${finalCost}, ${amount})" 
                        style="background: #d4af37; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 3px; text-transform: uppercase; font-size: 0.8em;">
                    Наеми
                </button>
            </div>
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between; padding: 12px; background: #000; border: 1px solid #333;">
            <span style="font-size: 11px; color: #aaa;">ХАЗНА: <b style="color: #ffd700;">${Math.floor(hero.gold)} 💰</b></span>
            <span style="font-size: 11px; color: #aaa;">АРМИЯ: <b style="color: #d4af37;">${hero.armySize} ⚔️</b></span>
        </div>
    `;
};

window.executeRecruitment = function(cost, amount) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        hero.armySize += amount;
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`УСПЕХ: Наети са нови ${amount} воини. Нашата мощ расте! ⚔️`);
        }
        
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        window.renderBarracksContent(); // Преначертаваме вътрешността с новите суми
    } else {
        alert("Нямате достатъчно злато!");
    }
};
