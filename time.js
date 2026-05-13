/**
 * МОДУЛ: ВРЕМЕ - Велика България
 */
window.seasons = ["Пролет", "Лято", "Есен", "Зима"];

window.updateTimeUI = function() {
    const timeElem = document.getElementById('game-time-val');
    if (!timeElem || !window.gameTime) return;

    const seasonName = window.seasons[window.gameTime.seasonIndex] || "Пролет";
    timeElem.innerText = `Година: ${window.gameTime.year}, ${seasonName}`;
};
