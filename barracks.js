/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН И КЛАНОВИ ДОКОВЕ) - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (Корекция на свойствата за войска)
 * КОРЕКЦИЯ БЪГ: Синхронизиране на hero.currentArmy с hero.armySize за перфектна интеграция с битките и икономиката.
 * Статистика на файловете в проекта: 16
 */

window.buyUnits = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Инициализиране на RPG структурата, ако липсва
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    let skills = hero.skills || {};

    // 1. ИЗЧИСЛЯВАНЕ НА ЦЕНОВИЯ МОДИФИКАТОР (Родови бонуси + Diablo пасиви)
    let costModifier = 1.0;
    if (hero.dynasty && window.dynastyPerks && window.dynastyPerks[hero.dynasty]) {
        const perk = window.dynastyPerks[hero.dynasty];
        if (perk.armyCost) costModifier = perk.armyCost;
    }

    // Специфични бонуси за утвърдени военни родове (Комитопули и Гети)
    if (hero.dynasty === "Комитопули" || hero.dynasty === "Гети") {
        costModifier *= 0.90; // Допълнителни 10% отстъпка за набиране на родови воини
    }

    // Diablo пасив: Величие/Харизма (stature) намалява цената с 4% на всяка точка
    if ((skills.stature || 0) > 0) {
        costModifier -= (skills.stature * 0.04);
    }
    costModifier = Math.max(0.5, costModifier); // Максимална отстъпка до 50%

    // Базова цена за един воин
    const baseUnitCost = 4;
    const finalUnitCost = Math.max(1, Math.floor(baseUnitCost * costModifier));

    // Максимално количество единици, които Канът може да наеме спрямо златото си
    let maxAffordable = Math.floor((hero.gold || 0) / finalUnitCost);

    // 2. ИЗГРАЖДАНЕ НА КАЗАРМЕНИЯ ИНТЕРФЕЙС
    mainArea.innerHTML = `
        <div style="background: #050505; border: 2px solid #d4af37; padding: 25px; border-radius: 6px; font-family: 'Georgia', serif; color: white; max-width: 600px; margin: 20px auto; box-sizing: border-box;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 12px; letter-spacing: 1px;">⚔️ ВОЕНЕН СТАН И КАЗАРМИ ⚔️</h2>
            <p style="font-size: 0.9em; color: #ccc; line-height: 1.5; text-align: center;">
                Тук свиквате воините от вашите родови земи под знамената на Империята. Ветераните чакат вашата заповед.
            </p>

            <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.02); padding: 12px; border: 1px solid #222; border-radius: 4px; margin: 20px 0; font-size: 0.9em;">
                <div>Текущо злато: <b id="barracks-ui-gold" style="color: #ffd700;">${hero.gold || 0} 💰</b></div>
                <div>Вашата войска: <b id="barracks-ui-army" style="color: #4caf50;">${hero.armySize || 0} воини</b></div>
            </div>

            <div style="background: #000; border: 1px solid #222; padding: 15px; border-radius: 4px; margin-bottom: 20px; font-size: 0.85em;">
                <p style="margin: 0 0 10px 0; color: #d4af37; font-weight: bold; text-transform: uppercase;">📜 Ценоразпис за набиране:</p>
                <ul style="margin: 0; padding-left: 20px; color: #bbb; line-height: 1.6;">
                    <li>Базова такса за боец: <span style="color: #fff;">${baseUnitCost} злато</span></li>
                    <li>Модификатор на рода и пасиви: <span style="color: #ff4444;">${Math.round((1 - costModifier) * 100)}% отстъпка</span></li>
                    <li>Крайна цена за воин: <span style="color: #4caf50; font-weight: bold;">${finalUnitCost} злато</span></li>
                </ul>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; font-size: 0.85em; color: #aaa; margin-bottom: 8px;">Брой воини за наемане (Макс: ${maxAffordable}):</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="buy-amount-input" min="1" max="${maxAffordable}" value="${Math.min(10, maxAffordable)}" 
                           style="flex: 1; background: #111; border: 1px solid #444; color: white; padding: 10px; border-radius: 4px; font-size: 1em; text-align: center;">
                    <button onclick="window.setBarracksMax(${maxAffordable})" 
                            style="background: #222; color: #ffd700; border: 1px solid #ffd700; padding: 0 15px; cursor: pointer; border-radius: 4px; font-weight: bold; font-size: 0.8em;">МАКС</button>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.executeRecruitment(${finalUnitCost})" 
                        style="background: #a32a2a; color: white; border: 1px solid #ff4444; padding: 14px; font-size: 0.95em; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; box-shadow: 0 0 15px rgba(255,0,0,0.15);">
                    СВИКАЙ ПОД ЗНАМЕНАТА
                </button>
                
                <button onclick="if(window.showPalaceUI) window.showPalaceUI();" 
                        style="background: #111; color: #ccc; border: 1px solid #444; padding: 10px; font-size: 0.85em; cursor: pointer; border-radius: 4px; text-transform: uppercase;">
                    ВЪРНИ СЕ В ДВОРЕЦА
                </button>
            </div>
        </div>
    `;
};

/**
 * Помощна функция за автоматично запълване на максималния брой воини
 */
window.setBarracksMax = function(maxAmount) {
    const input = document.getElementById('buy-amount-input');
    if (input) {
        input.value = maxAmount;
    }
};

/**
 * Изпълнение на покупката и прецизна синхронизация с бойния и икономическия модул
 */
window.executeRecruitment = function(finalUnitCost) {
    const hero = window.currentHero;
    if (!hero) return;

    const input = document.getElementById('buy-amount-input');
    if (!input) return;

    let amount = parseInt(input.value);
    if (isNaN(amount) || amount <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🔮 СЪВЕТНИК: Моля, въведете валиден брой бойци за наемане!");
        return;
    }

    let totalCost = amount * finalUnitCost;

    if ((hero.gold || 0) < totalCost) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("📉 СЪВЕТНИК: Свещената хазна не разполага с достатъчно злато за толкова воини!");
        return;
    }

    // Изваждаме златото от хазната
    hero.gold -= totalCost;

    // КОРЕКЦИЯ БЪГ: Едновременно обновяване на armySize и currentArmy за пълна съвместимост с battle.js
    hero.armySize = (hero.armySize || 0) + amount;
    hero.currentArmy = (hero.currentArmy || 0) + amount;
    
    // Подсигуряване на максимума за армия при наемане
    if (hero.maxArmy && hero.currentArmy > hero.maxArmy) {
        hero.maxArmy = hero.currentArmy;
    } else {
        hero.maxArmy = hero.armySize; // Защитен бекъп в случай на липсващо свойство
    }

    // ArcheAge Проверка: Специфичен бонус за висши военни класове (Стратег, Пълководец)
    if (hero.currentClass === "Имперски Стратег" || hero.currentClass === "Родов Воевода") {
        // Допълнителни бонус ветерани от класовата специализация на водене
        let bonusUnits = Math.floor(amount * 0.05); // +5% безплатни елитни бойци
        if (bonusUnits > 0) {
            hero.armySize += bonusUnits;
            hero.currentArmy += bonusUnits;
            amount += bonusUnits;
        }
    }

    // СИНХРОНИЗАЦИЯ С ГЛОБАЛНАТА РОДОВА СТАТИСТИКА В worldData
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
        window.worldData.clans[hero.dynasty].armySize = hero.armySize;
        window.worldData.clans[hero.dynasty].currentArmy = hero.currentArmy;
        window.worldData.clans[hero.dynasty].gold = hero.gold;
    }

    // СИНХРОНИЗАЦИЯ С МАСИВА НА ОТКЛЮЧЕНИТЕ ЛИДЕРИ ЗА ТОП 6 UI КАРТИТЕ
    if (window.unlockedLeaders) {
        let ulArray = Array.isArray(window.unlockedLeaders) ? window.unlockedLeaders : Object.values(window.unlockedLeaders);
        ulArray.forEach(l => {
            if (l.name === hero.name || l.dynasty === hero.dynasty) {
                l.armySize = hero.armySize;
                l.gold = hero.gold;
            }
        });
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`⚔️ УСПЕХ: Нови ${amount} бойци преклониха глава пред Кан ${hero.name} и заеха боен пост!`);
    }

    // Моментално преначертаване на левия, горния панел и Топ 6 лидерите
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    // Директно обновяване на стойностите в текущо отворения интерфейс на казармата
    const goldUi = document.getElementById('barracks-ui-gold');
    const armyUi = document.getElementById('barracks-ui-army');
    if (goldUi) goldUi.innerText = `${hero.gold} 💰`;
    if (armyUi) armyUi.innerText = `${hero.armySize} воини`;

    // Преизчисляваме лимитите в инпута след покупката
    let newMaxAffordable = Math.floor(hero.gold / finalUnitCost);
    input.max = newMaxAffordable;
    input.value = Math.min(10, newMaxAffordable);
};
