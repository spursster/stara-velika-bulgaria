/**
 * МОДУЛ: ВРЕМЕ - Велика България
 */
window.seasons = ["Пролет", "Лято", "Есен", "Зима"];

window.updateTimeUI = function() {
    const timeElem = document.getElementById('game-time-val');
    // Добавена защита: ако елементът или данните липсват, функцията спира без грешка
    if (!timeElem || !window.gameTime || !window.seasons) return;

    const seasonName = window.seasons[window.gameTime.seasonIndex];
    timeElem.innerText = `Година: ${window.gameTime.year}, ${seasonName}`;
};
