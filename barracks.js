/**
 * МОДУЛ: КАЗАРМИ - Велика България (Синхронизиран)
 */

window.openBarracks = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    // Вземаме бонуса за цена от механиките (напр. Куригир дават 0.8)
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    
    const baseCost = 100;
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 50;

    mainArea.innerHTML = `
        <div id="barracks-screen" style="padding:20px; background: rgba(10,10,10,0.95); border: 1px solid #d4af37; border-radius: 5px;">
            <h2 style="font-family:'Cinzel'; color:#d4af37; margin-top:0;">ВОЕНЕН СТАН</h2>
            <p style="font-size: 14px; color: #ccc;">Тук събирате своите конници за предстоящите походи.</p>
            
            <div style="background:#1a1a1a; padding:15px; border-left: 3px solid #d4af37; margin-bottom:20px;">
                <b style="color:#fff;">Обучение на тежка конница</b><br>
                <span style="font-size:12px; color:#888;">Брой: ${amount} воини</span><br>
                <span style="font-size:12px; color:#d4af37;">Цена: ${finalCost} злато ${costModifier < 1 ? '(Родова отстъпка!)' : ''}</span>
            </div>

            <button onclick="window.buyUnits(${finalCost}, ${amount})" 
                style="padding:12px 25px; background:#d4af37; color:#000; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold; width:100%;">
                НАЕМИ ВОЙСКА
            </button>
            
            <p style="font-size:10px; color:#555; margin-top:10px; text-align:center;">Текуща армия: ${hero.armySize} | Налично злато: ${hero.gold}</p>
        </div>
    `;
};

window.buyUnits = function(cost, amount) {
    const hero = window.currentHero;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        hero.armySize += amount;
        
        if (window.logEvent) {
            window.logEvent(`Обучени са ${amount} нови конници. Платени: ${cost} 💰`, "action");
        }
        
        // Обновяваме веднага UI и екрана на казармата
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        window.openBarracks(); 
    } else {
        alert("Нямате достатъчно злато в хазната!");
    }
};
