/**
 * МОДУЛ: ИКОНОМИКА И РЕСУРСИ
 * Управлява приходите от провинции и разходите на Империята на три езика.
 */

window.calculateYearlyIncome = function() {
    const hero = window.currentHero;
    const dynasty = hero.dynasty;

    // 1. Базов приход от всяка провинция (напр. 50 злато на регион)
    let baseIncomePerRegion = 50;
    let totalBaseIncome = window.playerRegions.length * baseIncomePerRegion;

    // 2. Прилагане на Династични бонуси (от mechanics.js)
    // Бонус за род Смилец: +15% приход
    let taxedIncome = window.applyPerk(totalBaseIncome, "gold", dynasty);

    // 3. Разходи за поддръжка на армията
    let baseMaintenance = hero.armySize * 0.1; 
    
    // Бонус за род Османци Дуло: -15% поддръжка
    let actualMaintenance = window.applyPerk(baseMaintenance, "maintenance", dynasty);

    // 4. Финален баланс за годината
    let netProfit = Math.floor(taxedIncome - actualMaintenance);

    // Актуализиране на златото на владетеля
    hero.gold += netProfit;

    // Съобщение на три езика (пример за BG)
    let message = "";
    if (window.gameLang === "BG") {
        message = `Годишен отчет: Приход от ${window.playerRegions.length} провинции: +${Math.floor(taxedIncome)} 💰. Поддръжка на армията: -${Math.floor(actualMaintenance)} ⚔️. Нетна печалба: ${netProfit} 💰.`;
    } else if (window.gameLang === "US") {
        message = `Yearly Report: Income from ${window.playerRegions.length} provinces: +${Math.floor(taxedIncome)} 💰. Army maintenance: -${Math.floor(actualMaintenance)} ⚔️. Net profit: ${netProfit} 💰.`;
    } else {
        message = `Годовой отчет: Доход от ${window.playerRegions.length} провинций: +${Math.floor(taxedIncome)} 💰. Содержание армии: -${Math.floor(actualMaintenance)} ⚔️. Чистая прибыль: ${netProfit} 💰.`;
    }

    return {
        profit: netProfit,
        log: message
    };
};

/**
 * Логика за наемане на нови воини (Barracks integration)
 */
window.buyUnits = function() {
    const unitCost = 5; // 5 злато за 1 воин
    const maxAffordable = Math.floor(window.currentHero.gold / unitCost);
    
    if (maxAffordable <= 0) {
        alert(window.gameLang === "BG" ? "Нямате достатъчно злато!" : "Not enough gold!");
        return;
    }

    let amount = prompt(window.gameLang === "BG" ? `Колко воини ще наемете? (Макс: ${maxAffordable})` : `How many units? (Max: ${maxAffordable})`, maxAffordable);
    amount = parseInt(amount);

    if (amount > 0 && amount <= maxAffordable) {
        window.currentHero.gold -= amount * unitCost;
        window.currentHero.armySize += amount;
        alert(window.gameLang === "BG" ? `Наети са ${amount} нови воини.` : `Recruited ${amount} new units.`);
        window.updateCharacterUI(window.currentHero);
    } else {
        alert(window.gameLang === "BG" ? "Невалидно количество." : "Invalid amount.");
    }
};

console.log("Модул Economy.js е зареден и синхронизиран с 13-те династии.");
