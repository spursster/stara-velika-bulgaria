// Езикови настройки
window.setLanguage = function(lang) {
    window.gameLang = lang;
    if (window.currentHero) {
        window.updateCharacterUI(window.currentHero);
        // Обновяваме датата в горния панел без да превъртаме годината
        const dateDisplay = document.getElementById('game-date');
        if (dateDisplay) {
            let y = window.currentGameYear;
            const suffix = { bg: y < 0 ? " пр.н.е." : " н.е.", en: y < 0 ? " BC" : " AD", ru: y < 0 ? " до н.э." : " н.э." };
            const label = { bg: "Година: ", en: "Year: ", ru: "Год: " };
            dateDisplay.innerText = `${label[lang]}${Math.abs(y)}${suffix[lang]}`;
        }
    }
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
};

// Икономика: Изчисляване на годишните приходи
window.calculateYearlyIncome = function(hero) {
    // Базов данък + бонус от всяка провинция
    let income = 100 + (window.playerRegions.length * 50);
    window.gameGold += income;
    
    // Поддръжка на армията (по 1 злато на всеки 10 воини)
    let upkeep = Math.floor(hero.armySize / 10);
    window.gameGold -= upkeep;
    
    if (window.gameGold < 0) window.gameGold = 0;
};

// Стареене и здраве
window.handleAging = function(hero) {
    hero.age += 1;
    if (hero.age >= hero.maxAge) {
        hero.isAlive = false;
        const deathMsgs = {
            bg: "Владетелят се пресели в отвъдното.",
            en: "The ruler has passed into the afterlife.",
            ru: "Правитель ушел в мир иной."
        };
        alert(deathMsgs[window.gameLang]);
        location.reload(); // Рестарт при смърт
    }
};

window.recruitUnit = function(hero, type) {
    const costs = { 'ЛЕКА_ПЕХОТА': 100, 'КОННИЦА': 300, 'СТРЕЛЦИ': 150 };
    const sizes = { 'ЛЕКА_ПЕХОТА': 50, 'КОННИЦА': 30, 'СТРЕЛЦИ': 40 };
    
    if (window.gameGold >= costs[type]) {
        window.gameGold -= costs[type];
        hero.armySize += sizes[type];
        return true;
    }
    return false;
};

window.simulateBattle = function(hero) {
    const win = Math.random() > 0.4;
    const lang = window.gameLang || 'bg';
    
    const messages = {
        victory: { bg: "Велика победа!", en: "Great Victory!", ru: "Великая победа!" },
        defeat: { bg: "Поражение!", en: "Defeat!", ru: "Поражение!" }
    };

    if (win) {
        if (window.availableProvinces.length > 0) {
            window.playerRegions.push(window.availableProvinces.shift());
        }
        hero.levelUp();
        return messages.victory[lang];
    } else {
        hero.armySize = Math.floor(hero.armySize * 0.8);
        return messages.defeat[lang];
    }
};

window.performAncientRitual = function(hero) {
    const gods = [
        { bg: "Тангра", en: "Tangra", ru: "Тангра" }, 
        { bg: "Бендида", en: "Bendis", ru: "Бендида" },
        { bg: "Залмоксис", en: "Zalmoxis", ru: "Залмоксис" }
    ];
    
    const god = gods[Math.floor(Math.random() * gods.length)];
    const lang = window.gameLang || 'bg';

    // Проверка дали вече имаме благословията на този бог
    if (!hero.divineUnits.find(g => g.bg === god.bg)) {
        hero.divineUnits.push(god);
        return god[lang];
    }
    return null;
};
