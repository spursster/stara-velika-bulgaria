/**
 * МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН, ИЗЧИСТЕН И СИНХРОНИЗИРАН
 * КОРЕКЦИЯ: Добавени са всички възможни HTML ID-та за визуализация на времето, за да изчезне "Зарежда се...".
 * Статистика на файловете в проекта: 15
 */

window.seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];

// Глобална функция за превъртане на ход от бутона в интерфейса
window.processTurn = function() {
    console.log("⏳ Превъртане на ход...");
    
    // Инициализираме gameTime, ако липсва в обекта window
    if (!window.gameTime) {
        window.gameTime = { seasonIndex: 0, year: 632, era: "от н.е." };
    }

    // Извикваме основната логика за времето
    window.processTime();
};

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
        if (window.currentHero) {
            window.currentHero.age = (window.currentHero.age || 50) + 1;
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⏳ СМЯНА НА ГОДИНАТА: Настъпи нов родов цикъл — ${window.gameTime.year} г. ${window.gameTime.era}.`);
        }
    }

    // 3. Обновяване на интерфейса
    window.updateTimeUI();

    // 4. Автоматично обновяване на мистичния портал при следващ сезон
    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
}; // Край на window.processTime

window.updateTimeUI = function() {
    if (!window.gameTime) return;
    if (typeof window.checkRandomAttack === 'function') window.checkRandomAttack();
    
    // Поддържаме абсолютно всички възможни вариации на ID-та от твоя index.html
    const timeDisplay = document.getElementById('current-time-info') || 
                        document.getElementById('stat-time') || 
                        document.getElementById('time-display') || 
                        document.getElementById('game-time') || 
                        document.getElementById('time-info');
                        
    if (!timeDisplay) {
        console.warn("⚠️ Предупреждение: Не е намерен HTML елемент за показване на времето. Проверете ID-то в index.html!");
        return;
    }

    const currentSeason = window.seasons[window.gameTime.seasonIndex] || "Сезон";
    timeDisplay.innerHTML = `${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};
