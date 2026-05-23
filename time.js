/**
 * МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН + АВТОНОМНИ ДЕЙСТВИЯ
 * КОРЕКЦИЯ: Добавени автономно завладяване и автономни портали
 */
window.updateTimeUI = function() {
    if (!window.gameTime) return;
    
    // Търсим span-а с id="current-time-info" (който е вътре в .stat-box)
    const timeDisplay = document.getElementById('current-time-info');
    if (!timeDisplay) {
        console.warn("⚠️ Елемент #current-time-info не е намерен");
        return;
    }

    const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
    const currentSeason = seasons[window.gameTime.seasonIndex] || "Сезон";
    timeDisplay.innerHTML = `${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};
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

    // 4. Автоматично обновяване на мистичния портал
    if (window.advanceExpeditionsTurn) {
        window.advanceExpeditionsTurn();
    }
    
    // ==================== АВТОНОМНИ ДЕЙСТВИЯ ====================
    
    // 5. Автономно завладяване на региони от не-любимите герои
    if (typeof window.autonomousRegionConquest === 'function') {
        window.autonomousRegionConquest();
    }
    
    // 6. Автономно нападение ( rivalry система - 3% шанс)
    if (typeof window.checkRandomAttack === 'function') {
        window.checkRandomAttack();
    }
    
    // 7. Автономни портали (вече се извикват в advanceExpeditionsTurn, но добавяме и тук за всеки случай)
    // Автономното влизане в портали вече е вградено в attemptAutonomousPortalEntry() в expeditions.js
}; // Край на window.processTime

window.updateTimeUI = function() {
    if (!window.gameTime) return;
    
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
