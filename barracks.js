/**
 * МОДУЛ: КАЗАРМИ - Велика България (Синхронизиран и Коригиран)
 */

window.openBarracks = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Изчисляваме цената
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    const baseCost = 100;
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 50;

    mainArea.innerHTML = `
        <div id="barracks-screen" style="padding:20px; background: rgba(10,10,10,0.95); border: 1px solid #d4af37; border-radius: 5px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-family:'Cinzel'; color:#d4af37; margin: 0;">ВОЕНЕН СТАН</h2>
                <button onclick="document.getElementById('barracks-screen').remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:18px;">✕</button>
            </div>
            
            <p style="font-size: 14px; color: #ccc;">Тук събирате своите конници за предстоящите походи.</p>
            
            <div style="background:#1a1a1a; padding:15px; border-left: 3px solid #d4af37; margin-bottom:20px;">
                <b style="color:#fff;">Обучение на тежка конница</b><br>
                <span style="font-size:12px; color:#888;">Брой: ${amount} воини</span><br>
                <span style="font-size:12px; color:#d4af37;">Цена: <span id="display-cost">${finalCost}</span> злато ${costModifier < 1 ? '(Родова отстъпка!)' : ''}</span>
            </div>

            <button onclick="window.buyUnits(${finalCost}, ${amount})" 
                style="padding:12px 25px; background:#d4af37; color:#000; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold; width:100%;">
                НАЕМИ ВОЙСКА
            </button>
            
            <div style="margin-top:15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 4px; text-align: center;">
                <span style="font-size:11px; color:#aaa;">Вашата хазна: <b style="color:#d4af37;">${hero.gold} 💰</b></span>
            </div>
        </div>
    `;
};

window.buyUnits = function(cost, amount) {
    const hero = window.currentHero;
    if (!hero) return;

    // Уверяваме се, че cost и amount са числа
    const numericCost = Number(cost);
    const numericAmount = Number(amount);

    if (isNaN(numericCost)) {
        console.error("Грешка: Цената не е дефинирана правилно!");
        return;
    }

    if (Number(hero.gold) >= numericCost) {
        hero.gold -= numericCost;
        hero.armySize += numericAmount;
        
        if (window.logEvent) {
            window.logEvent(`Обучени са ${numericAmount} нови конници. Разход: ${numericCost} 💰`, "action");
        }
        
        // Обновяване на всички интерфейси
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        
        // Преначертаваме прозореца на казармата, за да се види новото злато
        window.openBarracks(); 
    } else {
        alert(`Недостиг на злато! Имате ${hero.gold}, а са нужни ${numericCost}.`);
    }
};
