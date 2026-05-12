window.currentGameYear = -480;

function advanceYear(hero) {
    if (!hero || !hero.isAlive) return;
    window.currentGameYear += 1;
    window.handleAging(hero);
    
    const dateDisplay = document.getElementById('game-date');
    if (dateDisplay) {
        let y = window.currentGameYear;
        dateDisplay.innerText = `Година: ${y < 0 ? Math.abs(y) + ' пр.н.е.' : y + ' н.е.'}`;
    }

    if (window.currentGameYear % 5 === 0) {
        const log = document.getElementById('event-log');
        if (log) log.innerHTML = `<p>📜 Година ${window.currentGameYear}: Мирна година.</p>` + log.innerHTML;
    }
    updateCharacterUI(hero);
}
window.advanceYear = advanceYear;
