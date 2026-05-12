window.gameGold = 500; // Начален капитал

function calculateYearlyIncome(hero) {
    // Базов данък + бонус от нивото на владетеля
    let income = 50 + (hero.level * 10);
    
    // Армията изисква поддръжка (колкото по-голяма е, толкова повече струва)
    let upkeep = Math.floor(hero.armySize / 20);
    
    let totalNet = income - upkeep;
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
