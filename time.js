/**
 * МОДУЛ: ВРЕМЕ - Велика България
 */
window.seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];

// Тази функция липсваше и затова времето не се движеше
window.processTime = function() {
    if (!window.gameTime) return;

    // 1. Напредване на сезона
    window.gameTime.seasonIndex++;

    // 2. Проверка за смяна на годината
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        
        // Логика за Античността: годините пр.н.е. намаляват
        if (window.gameTime.era === "пр.н.е.") {
            window.gameTime.year--;
        } else {
            window.gameTime.year++;
        }
    }

    // 3. Обновяване на екрана
    window.updateTimeUI();
};

window.updateTimeUI = function() {
    // Корекция: Търсим 'current-time-info' от твоя index.html
    const timeDisplay = document.getElementById('current-time-info');
    if (!timeDisplay || !window.gameTime) return;

    const seasonName = window.seasons[window.gameTime.seasonIndex];
    const year = window.gameTime.year;
    const era = window.gameTime.era || "пр.н.е.";

    timeDisplay.innerText = `${seasonName}, ${year} ${era}`;
};
