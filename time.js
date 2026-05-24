/**
МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
ВЕРСИЯ: КОРИГИРАНА (САМО ФИКСОВЕ НА СИНТАКСИС И ДУБЛАЖИ)
*/

window.updateTimeUI = function() {
    if (!window.gameTime) return;
    
    // Обединих проверките от двете версии в една, за да няма конфликти
    const timeDisplay = document.getElementById('current-time-info') || 
                        document.getElementById('stat-time') || 
                        document.getElementById('time-display') || 
                        document.getElementById('game-time') || 
                        document.getElementById('time-info');
                        
    if (!timeDisplay) {
        console.warn("⚠️ Елемент за време не е намерен");
        return;
    }

    const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
    const currentSeason = seasons[window.gameTime.seasonIndex] || "Сезон";
    timeDisplay.innerHTML = `${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};

// Инициализираме gameTime, ако липсва
if (!window.gameTime) {
    window.gameTime = { seasonIndex: 0, year: 632, era: "от н.е." };
}

// ✅ ПОПРАВКА: Премахната е грешната скоба "};" и извикването е забавено, 
// за да не срива играта при зареждане на другите модули.
setTimeout(() => {
    window.processTime();
}, 500);

window.processTime = function() {
    if (!window.gameTime) return;
    // 1. Напредване на сезона
    window.gameTime.seasonIndex++;

    // 2. Проверка за смяна на годината
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        
        if (window.gameTime.era === "пр.н.е.") {
            window.gameTime.year--;
            if (window.gameTime.year <= 0) {
                window.gameTime.year = 1;
                window.gameTime.era = "от н.е.";
            }
        } else {
            window.gameTime.year++;
        }

        if (window.currentHero) window.currentHero.age = (window.currentHero.age || 50) + 1;
        if (window.showAdvisorMsg) window.showAdvisorMsg(`⏳ СМЯНА НА ГОДИНАТА: Настъпи нов родов цикъл — ${window.gameTime.year} г. ${window.gameTime.era}.`);
    }

    // 3. Обновяване на интерфейса
    window.updateTimeUI();

    // 4. Автоматично обновяване на мистичния портал
    if (window.advanceExpeditionsTurn) window.advanceExpeditionsTurn();

    // ==================== АВТОНОМНИ ДЕЙСТВИЯ ====================
    if (typeof window.autonomousRegionConquest === 'function') window.autonomousRegionConquest();
    if (typeof window.checkRandomAttack === 'function') window.checkRandomAttack();
};
