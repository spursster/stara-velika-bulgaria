/**
 * МОДУЛ: ИКОНОМИКА - Велика България
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    // Всеки регион (от битка или брак) носи злато
    const regionIncome = (window.playerRegions || []).length * 50;
    const baseIncome = 100;
    
    const totalIncome = baseIncome + regionIncome;
    window.currentHero.gold += totalIncome;

    if (window.logEvent) {
        window.logEvent(`Сезонен доход: +${totalIncome} злато от твоите владения.`, "action");
    }
};
