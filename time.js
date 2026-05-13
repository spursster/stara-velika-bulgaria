/**
 * МОДУЛ: ВРЕМЕ
 */

window.gameTime = {
    year: -480,
    era: "Antiquity",
    seasonIndex: 0,
    seasons: [
        { nameBG: "Пролет", icon: "🌱" },
        { nameBG: "Лято", icon: "☀️" },
        { nameBG: "Есен", icon: "🍂" },
        { nameBG: "Зима", icon: "❄️" }
    ]
};

window.updateTimeUI = function() {
    const time = window.gameTime;
    const season = time.seasons[time.seasonIndex];
    
    let yearText = Math.abs(time.year) + (time.year < 0 ? " пр.н.е." : " сл.н.е.");
    const eraName = time.era === "Antiquity" ? "АНТИЧНОСТ" : "СРЕДНОВЕКОВИЕ";

    const timeElem = document.getElementById('current-time-info');
    if (timeElem) {
        timeElem.innerHTML = `${season.icon} ${season.nameBG}, ${yearText}`;
        // Обновяваме и подзаглавието за епохата, ако сме добавили такъв елемент
        const parent = timeElem.parentElement;
        if (parent.lastElementChild) {
            parent.lastElementChild.innerText = `ЕПОХА: ${eraName}`;
        }
    }
};
