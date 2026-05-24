/** МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България */

window.updateTimeUI = function() {
    if (!window.gameTime) return;
    const timeDisplay = document.getElementById('current-time-info') || 
                        document.getElementById('stat-time') || 
                        document.getElementById('time-display') || 
                        document.getElementById('game-time') || 
                        document.getElementById('time-info');
    if (!timeDisplay) return;

    const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
    const currentSeason = seasons[window.gameTime.seasonIndex] || "Сезон";
    timeDisplay.innerHTML = `${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};

if (!window.gameTime) {
    window.gameTime = { seasonIndex: 0, year: 632, era: "от н.е." };
}

window.processTime = function() {
    if (!window.gameTime) return;
    window.gameTime.seasonIndex++;

    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        if (window.gameTime.era === "пр.н.е.") {
            window.gameTime.year--;
            if (window.gameTime.year <= 0) { window.gameTime.year = 1; window.gameTime.era = "от н.е."; }
        } else { window.gameTime.year++; }
        if (window.currentHero) window.currentHero.age = (window.currentHero.age || 50) + 1;
        if (window.showAdvisorMsg) window.showAdvisorMsg(`⏳ СМЯНА НА ГОДИНАТА: ${window.gameTime.year} г. ${window.gameTime.era}.`);
    }

    window.updateTimeUI();
    if (window.advanceExpeditionsTurn) window.advanceExpeditionsTurn();
    if (typeof window.autonomousRegionConquest === 'function') window.autonomousRegionConquest();
    if (typeof window.checkRandomAttack === 'function') window.checkRandomAttack();
};

// Безопасно стартиране след зареждане на страницата
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => window.processTime(), 600));
} else {
    setTimeout(() => window.processTime(), 600);
}
