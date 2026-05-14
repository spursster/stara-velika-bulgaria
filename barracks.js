/**
 * МОДУЛ: КАЗАРМИ - Велика България (Синхронизиран и Коригиран)
 */

window.openBarracks = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Изчисляваме локално само за показване в интерфейса
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    const baseCost = 100;
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 50;

    mainArea.innerHTML = `
        <div id="barracks-screen" style="padding:20px; background: rgba(10,10,10,0.95); border: 1px solid #d4af37; border-radius: 5px; position: relative; border-left: 4px solid #d4af37;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="font-family:'Cinzel'; color:#d4af37; margin: 0;">ВОЕНЕН СТАН</h2>
                <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:18px; font-weight:bold;">✕</button>
            </div>
            
            <p style="font-size: 14px; color: #ccc; font-family: 'Cinzel';">Тук събирате своите конници за предстоящите походи.</p>
            
            <div style="background:#1a1a1a; padding:15px; border: 1px solid #333; margin-bottom:20px;">
                <b style="color:#fff; font-family: 'Cinzel';">Обучение на тежка конница</b><br>
                <span style="font-size:12px; color:#888;">Брой: ${amount} воини</span><br>
                <span style="font-size:13px; color:#d4af37; font-weight:bold;">Цена: ${finalCost} злато ${costModifier < 1 ? '(Родова отстъпка!)' : ''}</span>
            </div>

            <button onclick="window.buyUnits()" 
                style="padding:15px; background:#d4af37; color:#000; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold; width:100%; letter-spacing:1px;">
                НАЕМИ ВОЙСКА
            </button>
            
            <div style="margin-top:15px; padding: 10px; background: rgba(212,175,55,0.1); border-radius: 4px; text-align: center; border: 1px dashed #d4af37;">
                <span style="font-size:11px; color:#aaa;">Вашата хазна: <b style="color:#d4af37;">${hero.gold} 💰</b></span>
            </div>
        </div>
    `;
};

window.buyUnits = function() {
    const hero = window.currentHero;
    if (!hero) return;

    // ПРЕЦИЗНО ИЗЧИСЛЕНИЕ ВЪТРЕ ВЪВ ФУНКЦИЯТА (за избягване на undefined)
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    const baseCost = 100;
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 50;

    const currentGold = Number(hero.gold);

    if (currentGold >= finalCost) {
        hero.gold = currentGold - finalCost;
        hero.armySize = Number(hero.armySize) + amount;
        
        if (window.logEvent) {
            window.logEvent(`Обучени са ${amount} нови конници за ${finalCost} злато.`, "action");
        }
        
        // 1. Обновяваме UI на главния екран
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        
        // 2. Преначертаваме прозореца на казармата с новото злато
        window.openBarracks(); 
    } else {
        // ИНТЕГРАЦИЯ СЪС СЪВЕТНИКА: Заместваме стария alert
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Велики Кане, хазната е празна! Разполагате само с ${hero.gold} злато, а обучението на тези воини изисква ${finalCost}.`);
        } else {
            alert(`Недостиг на злато! Вашето злато: ${hero.gold}, нужна сума: ${finalCost}`);
        }
    }
};
