/**
 * МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ
 * Управлява смяната на сезоните и годишните цикли.
 */

window.seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];

/**
 * ГЛАВНА ФУНКЦИЯ ЗА НАПРЕДВАНЕ НА ВРЕМЕТО
 */
window.processTime = function() {
    if (!window.gameTime) {
        // Дефолтни начални стойности, ако не са зададени
        window.gameTime = { year: 632, seasonIndex: 0, era: "от н.е." };
    }

    // 1. Напредване на сезона
    window.gameTime.seasonIndex++;

    // 2. Проверка за смяна на годината (след Зима идва Пролет на следващата година)
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        
        // Логика за годините: пр.н.е. намаляват, от н.е. растат
        if (window.gameTime.era === "пр.н.е.") {
            window.gameTime.year--;
            // Ако достигнем година 0 пр.н.е., преминаваме в 1 г. от н.е.
            if (window.gameTime.year <= 0) {
                window.gameTime.year = 1;
                window.gameTime.era = "от н.е.";
            }
        } else {
            window.gameTime.year++;
        }

        // Годишно съобщение в Летописа
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Настъпи нова година — ${window.gameTime.year} ${window.gameTime.era}. Нека боговете бдят над родовете!`);
        }
    }

    // 3. Обновяване на интерфейса
    window.updateTimeUI();
};

/**
 * ВИЗУАЛИЗАЦИЯ НА ВРЕМЕТО
 */
window.updateTimeUI = function() {
    // Търсим елемента в горния панел (stat-time или current-time-info)
    const timeDisplay = document.getElementById('stat-time') || document.getElementById('current-time-info');
    if (!timeDisplay || !window.gameTime) return;

    const seasonName = window.seasons[window.gameTime.seasonIndex];
    const year = window.gameTime.year;
    const era = window.gameTime.era;

    // Форматиране на изгледа: "☀️ Лято, 632 г. от н.е."
    timeDisplay.innerText = `${seasonName}, ${year} г. ${era}`;
};

/**
 * ПОМОЩНА ФУНКЦИЯ ЗА ВЗЕМАНЕ НА ТЕКУЩ СЕЗОН (за икономика/битки)
 */
window.getCurrentSeason = function() {
    if (!window.gameTime) return "Пролет";
    return window.seasons[window.gameTime.seasonIndex].split(' ')[1];
};
