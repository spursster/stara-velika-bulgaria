// window.gameGold е дефинирано в logic.js, тук само го управляваме

function calculateYearlyIncome(hero) {
    if (!hero) return 0; // Защита срещу грешки при незареден герой

    // Базов доход от нивото на владетеля
    let baseIncome = 50 + (hero.level * 10);
    
    // Доходите от завладените региони
    let regionIncome = 0;
    if (typeof window.getRegionIncome === 'function') {
        regionIncome = window.getRegionIncome();
    }
    
    // Разходи за поддръжка на войската (1 злато на 20 воини)
    let upkeep = Math.floor(hero.armySize / 20);
    
    // Чиста печалба
    let totalNet = baseIncome + regionIncome - upkeep;
    window.gameGold += totalNet;

    // Автоматично обновяване на интерфейса след изчисление
    window.updateGoldDisplay();

    return totalNet;
}

function updateGoldDisplay() {
    const goldElement = document.getElementById('gold-display');
    if (goldElement) {
        const lang = window.gameLang || 'bg'; // Използваме системния език
        const t = window.translations[lang]; // Взимаме превода от logic.js
        
        // Показваме преведения текст (Злато / Gold / Золото)
        goldElement.innerText = `${t.gold}: ${window.gameGold} 🪙`;
    }
}

// Изнасяне на функциите в глобалния обхват за достъп от другите файлове
window.calculateYearlyIncome = calculateYearlyIncome;
window.updateGoldDisplay = updateGoldDisplay;
