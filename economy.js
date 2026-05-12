window.gameGold = 500; 

function calculateYearlyIncome(hero) {
    // Базов доход от нивото на владетеля
    let baseIncome = 50 + (hero.level * 10);
    
    // Доходите от завладените региони (Мизия, Тракия и др.)
    let regionIncome = 0;
    if (typeof window.getRegionIncome === 'function') {
        regionIncome = window.getRegionIncome();
    }
    
    // Разходи за поддръжка на войската
    let upkeep = Math.floor(hero.armySize / 20);
    
    // Чиста печалба
    let totalNet = baseIncome + regionIncome - upkeep;
    window.gameGold += totalNet;

    return totalNet;
}

function updateGoldDisplay() {
    const goldElement = document.getElementById('gold-display');
    if (goldElement) {
        goldElement.innerText = `Злато: ${window.gameGold} 🪙`;
    }
}

window.calculateYearlyIncome = calculateYearlyIncome;
window.updateGoldDisplay = updateGoldDisplay;
