/**
 * МОДУЛ: ИКОНОМИКА - Велика България
 */

window.calculateEconomy = function() {
    const hero = window.currentHero;
    let totalIncome = 50; // Базов доход от столицата
    let totalMaintenance = Math.floor(hero.armySize * 0.1); // Разход за поддръжка на войската

    // Доход от всички региони (твоите и на съпругата)
    const allRegions = [...(window.playerRegions || []), ...(window.spouseRegions || [])];
    
    allRegions.forEach(regName => {
        if (window.worldRegions[regName]) {
            totalIncome += window.worldRegions[regName].income;
        }
    });

    const netProfit = totalIncome - totalMaintenance;
    hero.gold += netProfit;

    return {
        income: totalIncome,
        expenses: totalMaintenance,
        profit: netProfit
    };
};
