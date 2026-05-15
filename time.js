/**
 * МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 */

window.seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];

window.processTime = function() {
    if (!window.gameTime) return;

    // 1. Напредване на сезона
    window.gameTime.seasonIndex++;

    // 2. Проверка за смяна на годината
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        
        if (window.gameTime.era === "пр.н.е.") {
            window.gameTime.year--; // Годините пр.н.е. намаляват
            if (window.gameTime.year <= 0) {
                window.gameTime.year = 1;
                window.gameTime.era = "от н.е.";
            }
        } else {
            window.gameTime.year++;
        }

        if (window.currentHero) window.currentHero.age++;

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Настъпи нова година — ${window.gameTime.year} ${window.gameTime.era}.`);
        }
    }

    // 3. Обновяване на интерфейса
    window.updateTimeUI();
};

window.updateTimeUI = function() {
    // Поддържаме и двата варианта на ID-та за сигурност
    const timeDisplay = document.getElementById('current-time-info') || document.getElementById('stat-time');
    if (!timeDisplay || !window.gameTime) return;

    const seasonName = window.seasons[window.gameTime.seasonIndex];
    const year = window.gameTime.year;
    const era = window.gameTime.era;

    timeDisplay.innerText = `${seasonName}, ${year} г. ${era}`;
};
