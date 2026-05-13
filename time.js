/**
 * МОДУЛ: ВРЕМЕ, СЕЗОНИ И ЕПОХИ
 * Управлява цикъла на ходовете (3 месеца) и историческите периоди.
 */

window.gameTime = {
    year: -480, // 480 пр.н.е.
    era: "Antiquity",
    seasonIndex: 0,
    seasons: [
        { nameBG: "Пролет", nameUS: "Spring", icon: "🌱" },
        { nameBG: "Лято", nameUS: "Summer", icon: "☀️" },
        { nameBG: "Есен", nameUS: "Autumn", icon: "🍂" },
        { nameBG: "Зима", nameUS: "Winter", icon: "❄️" }
    ]
};

window.advanceTurn = function() {
    const time = window.gameTime;

    // 1. Напредване на сезона
    time.seasonIndex++;
    if (time.seasonIndex >= 4) {
        time.seasonIndex = 0;
        time.year++;
    }

    // 2. Проверка за преход към Средновековие
    if (time.year >= 476 && time.era === "Antiquity") {
        time.era = "Medieval";
        const transitionMsg = window.gameLang === "BG" 
            ? "📜 ЕПОХАЛНА ПРОМЯНА: Навлизаме в Средновековието!" 
            : "📜 ERA TRANSITION: Entering the Medieval age!";
        window.logEvent(transitionMsg, "success");
    }

    // 3. Икономически приход на всеки ход
    if (typeof window.calculateYearlyIncome === "function") {
        const econ = window.calculateYearlyIncome();
        window.logEvent(econ.log, "success");
    }

    // 4. Случайно събитие
    if (typeof window.generateRandomEvent === "function") {
        window.generateRandomEvent();
    }

    // 5. Обновяване на интерфейса
    window.updateTimeUI();
    window.updateCharacterUI(window.currentHero);
};

window.updateTimeUI = function() {
    const time = window.gameTime;
    const season = time.seasons[time.seasonIndex];
    const lang = window.gameLang;

    let yearText = Math.abs(time.year) + (time.year < 0 
        ? (lang === "BG" ? " пр.н.е." : " BC") 
        : (lang === "BG" ? " сл.н.е." : " AD"));

    const seasonName = lang === "BG" ? season.nameBG : season.nameUS;
    const eraName = lang === "BG" 
        ? (time.era === "Antiquity" ? "Античност" : "Средновековие")
        : time.era;

    const displayStr = `${season.icon} ${seasonName}, ${yearText} | ${eraName}`;
    
    // Обновяваме елемента в index.html
    const timeElem = document.getElementById('current-time-info');
    if (timeElem) {
        timeElem.innerText = displayStr;
    }
};
