/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН) - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода)
 * Включва визуална синхронизация и динамично изчисляване на разходите.
 */

window.openBarracks = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // ИЗЧИСЛЯВАНЕ НА ЦЕНАТА СПРЯМО РОДОВИТЕ БОНУСИ
    // Род "Даки" и др. имат намаление чрез getPerkValue('armyCost')
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    const baseCost = 250; // Базова цена за отряд
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 100; // Численост на един отряд

    mainArea.innerHTML = `
        <div id="barracks-screen" style="padding:25px; background: rgba(5,5,5,0.95); border: 1px solid #d4af37; border-radius: 5px; border-left: 5px solid #d4af37; color: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <h2 style="color: #d4af37; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Военен Стан</h2>
                <button onclick="document.getElementById('barracks-screen').remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:20px;">✕</button>
            </div>
            
            <p style="font-style: italic; color: #ccc; margin-bottom: 25px;">
                "Мечът решава споровете, които думите не могат. Подгответе вашите конници, Велики Кане!"
            </p>

            <div style="background: rgba(212,175,55,0.05); padding: 20px; border: 1px solid #444; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <h3 style="margin: 0; color: #d4af37;">Българска Конница</h3>
                    <p style="font-size: 0.9em; margin: 5px 0 0 0; color: #aaa;">Един отряд: +${amount} воини</p>
                </div>
                
                <div style="text-align: right;">
                    <div style="font-size: 1.2em; font-weight: bold; color: #fff; margin-bottom: 10px;">${finalCost} 💰</div>
                    <button onclick="window.buyUnits(${finalCost}, ${amount})" 
                            style="background: #d4af37; color: #000; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 3px; text-transform: uppercase;">
                        Наеми Войска
                    </button>
                </div>
            </div>

            <div style="margin-top: 30px; display: flex; justify-content: space-between; padding: 10px; background: #111; border: 1px solid #d4af37;">
                <span style="font-size: 11px; color: #aaa;">ВАШАТА ХАЗНА: <b style="color: #d4af37;">${Math.floor(hero.gold)} 💰</b></span>
                <span style="font-size: 11px; color: #aaa;">ТЕКУЩА АРМИЯ: <b style="color: #d4af37;">${hero.armySize} 🏹</b></span>
            </div>
        </div>
    `;
};

/**
 * ИЗПЪЛНЕНИЕ НА ПОКУПКАТА
 */
window.buyUnits = function(cost, amount) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        hero.armySize += amount;
        
        // Актуализираме и данните в worldData за съответния род
        if (window.worldData && window.worldData.clans[hero.dynasty]) {
            window.worldData.clans[hero.dynasty].armySize = hero.armySize;
            window.worldData.clans[hero.dynasty].gold = hero.gold;
        }

        // Запис в летописа
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`УСПЕХ: Наети са нови ${amount} воини. Нашата мощ расте! ⚔️`);
        }
        
        // Обновяване на всички интерфейси
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        window.openBarracks(); // Опресняваме прозореца на казармата
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("ГРЕШКА: Хазната е празна! Не можем да платим на нови воини. 🪙");
        }
    }
};
