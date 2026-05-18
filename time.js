/**
 * МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 * СТАТУС: НАПЪЛНО ОБНОВЕН И СИНХРОНИЗИРАН (ГЕРОИ И РОДОВИ ЦИКЛИ)
 * КОРЕКЦИЯ: Пречистване на терминологията за водачите в съгласие с глобалния стандарт на играта.
 * Статистика на файловете в проекта: 17 (Заедно с добавения времеви модул)
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

        // Всяка година героят / водачът пораства
        if (window.currentHero) window.currentHero.age++;

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⏳ СМЯНА НА ГОДИНАТА: Настъпи нов родов цикъл — ${window.gameTime.year} г. ${window.gameTime.era}.`);
        }
    }

    // 3. Обновяване на интерфейса
    window.updateTimeUI();

    // =======================================================================
    // НАДГРАЖДАНЕ: АВТОМАТИЧНО ОБНОВЯВАНЕ НА МИСТИЧНИЯ ПОРТАЛ ПРИ СЛЕДВАЩ СЕЗОН
    // =======================================================================
    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
}; // Край на window.processTime
};

window.updateTimeUI = function() {
    // Поддържаме и двата варианта на ID-та за сигурност в интерфейса
    const timeDisplay = document.getElementById('current-time-info') || document.getElementById('stat-time');
    if (!timeDisplay) return;

    const currentSeason = window.seasons[window.gameTime.seasonIndex] || "Сезон";
    timeDisplay.innerHTML = `${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};
