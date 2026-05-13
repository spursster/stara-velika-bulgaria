/**
 * МОДУЛ: ВРЕМЕ И СЕЗОНИ
 * Управлява ходовете, годините и сезонните цикли на Империята.
 */

window.gameTime = {
    year: -480, // 480 пр.н.е.
    seasonIndex: 0,
    seasons: [
        { nameBG: "Пролет", nameUS: "Spring", icon: "🌱" },
        { nameBG: "Лято", nameUS: "Summer", icon: "☀️" },
        { nameBG: "Есен", nameUS: "Autumn", icon: "🍂" },
        { nameBG: "Зима", nameUS: "Winter", icon: "❄️" }
    ]
};

window.advanceTurn = function() {
    // 1. Увеличаваме индекса на сезона
    window.gameTime.seasonIndex++;

    // 2. Ако минат 4 сезона, сменяме годината
    if (window.gameTime.seasonIndex >= 4) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year++;
    }

    // 3. Изчисляваме икономиката на всеки ход (или на всяка година по избор)
    const economyResult = window.calculateYearlyIncome();
    window.logEvent(economyResult.log, "success");

    // 4. Генерираме случайно събитие за новия ход
    window.generateRandomEvent();

    // 5. Обновяваме UI
    window.updateTimeUI();
    window.updateCharacterUI(window.currentHero);
};

window.updateTimeUI = function() {
    const yearDisplay = document.getElementById('current-year');
    const epochDisplay = document.getElementById('epoch-name');
    
    const currentSeason = window.gameTime.seasons[window.gameTime.seasonIndex];
    const seasonName = window.gameLang === "BG" ? currentSeason.nameBG : currentSeason.nameUS;
    
    // Форматиране на годината (пр.н.е. / сл.н.е.)
    let yearText = Math.abs(window.gameTime.year) + (window.gameTime.year < 0 ? " пр.н.е." : " сл.н.е.");
    
    if (yearDisplay) {
        yearDisplay.innerHTML = `${currentSeason.icon} ${seasonName}, ${yearText}`;
    }
};
