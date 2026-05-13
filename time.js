/**
 * МОДУЛ: ВРЕМЕ, СЕЗОНИ И ЕПОХИ
 * Управлява цикъла на годините и прехода между историческите периоди.
 */

window.gameTime = {
    currentYear: -480, // Започваме от 480 г. пр.н.е.
    era: "Antiquity",  // Текуща епоха
    seasonIndex: 0,
    seasons: [
        { nameBG: "Пролет", nameUS: "Spring", icon: "🌱" },
        { nameBG: "Лято", nameUS: "Summer", icon: "☀️" },
        { nameBG: "Есен", nameUS: "Autumn", icon: "🍂" },
        { nameBG: "Зима", nameUS: "Winter", icon: "❄️" }
    ],
    // Граници на епохите
    eraBenchmarks: {
        medieval: 476 // Преход към Средновековие (сл.н.е.)
    }
};

/**
 * Основна функция за превъртане на времето.
 * Вика се при всяко голямо действие (битка, строеж, дипломация).
 */
window.advanceTime = function() {
    const time = window.gameTime;
    const lang = window.gameLang;

    // 1. Напредване на сезона
    time.seasonIndex++;
    if (time.seasonIndex >= time.seasons.length) {
        time.seasonIndex = 0;
        time.currentYear++; // Нова година
    }

    // 2. Проверка за смяна на епохата
    checkEraTransition();

    // 3. Обновяване на UI
    updateTimeUI();
};

function checkEraTransition() {
    const time = window.gameTime;
    
    // Ако годината премине 476 г. (след новата ера)
    if (time.currentYear >= time.eraBenchmarks.medieval && time.era === "Antiquity") {
        time.era = "Medieval";
        const msg = window.gameLang === "BG" 
            ? "📜 ЕПОХАЛНА ПРОМЯНА: Светът навлиза в Средновековието! Старите родове се превръщат в мощни феодални династии." 
            : "📜 ERA TRANSITION: The world enters the Medieval period! Old clans transform into powerful feudal dynasties.";
        
        window.logEvent(msg, "success");
        
        // Бонус при смяна на епохата
        window.currentHero.gold += 1000;
        window.currentHero.xp += 100;
    }
}

function updateTimeUI() {
    const time = window.gameTime;
    const season = time.seasons[time.seasonIndex];
    const lang = window.gameLang;

    // Форматиране на годината (пр.н.е. или сл.н.е.)
    let yearDisplay = "";
    if (time.currentYear < 0) {
        yearDisplay = Math.abs(time.currentYear) + (lang === "BG" ? " г. пр.н.е." : " BC");
    } else {
        yearDisplay = time.currentYear + (lang === "BG" ? " г. сл.н.е." : " AD");
    }

    const eraDisplay = lang === "BG" 
        ? (time.era === "Antiquity" ? "Античност" : "Средновековие")
        : time.era;

    // Поставяме информацията в хедъра на играта
    const timeElement = document.getElementById("game-stats-time");
    if (timeElement) {
        timeElement.innerHTML = `${season.icon} ${yearDisplay} | ${eraDisplay}`;
    }
}

console.log("Time.js: Системата за сезони и еволюция на епохите е активна.");
