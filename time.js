let currentGameYear = -480; // Началото: Терес I
let timeSpeed = 1; // Колко години минават на един "ход"

function advanceYear(hero) {
    currentGameYear += timeSpeed;
    
    // Обновяване на дисплея за годината
    const dateDisplay = document.getElementById('game-date');
    if (dateDisplay) {
        let yearText = currentGameYear < 0 ? 
            Math.abs(currentGameYear) + " пр.н.е." : 
            currentGameYear + " н.е.";
        dateDisplay.innerText = `Година: ${yearText}`;
    }

    // На всеки 5 години се случва логично случайно събитие (Точка 3)
    if (currentGameYear % 5 === 0) {
        const eventText = window.triggerRandomEvent(hero);
        const eventLog = document.getElementById('event-log');
        if (eventLog) {
            const p = document.createElement('p');
            p.innerText = `📜 [${currentGameYear}] ${eventText}`;
            eventLog.prepend(p);
        }
    }

    // Логика за стареене (може да се добави по-късно)
    checkEraChange();
}

function checkEraChange() {
    if (currentGameYear === 0) console.log("Новата ера започна!");
    if (currentGameYear >= 2100) console.log("Навлизане в ерата на Космическата колонизация!");
}

window.advanceYear = advanceYear;
