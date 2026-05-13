window.simulateBattle = function(hero, enemyName) {
    if (!hero || !hero.isAlive) return;

    // Използваме текущия език
    const lang = window.gameLang || 'bg';
    const t = window.translations[lang];

    // Подсигуряване на регионите
    if (!window.playerRegions) {
        window.playerRegions = ["Одриско царство"];
    }

    // Изчисляване на мощта
    let enemyPower = 200 + (hero.level * 50);
    let heroPower = hero.armySize + (hero.level * 20);
    
    const log = document.getElementById('event-log');
    let message = "";

    if (heroPower > enemyPower) {
        // Победа: Използваме ромейските (Rhomaioi) като врагове
        const winText = {
            bg: `⚔️ Победа! Ромеите отстъпиха пред мощта на рода ${hero.dynasty}.`,
            en: `⚔️ Victory! The Rhomaioi retreated before the might of clan ${hero.dynasty}.`,
            ru: `⚔️ Победа! Ромеи отступили пред мощью рода ${hero.dynasty}.`
        };
        
        message = `<span style="color: #2ecc71;">${winText[lang]}</span>`;
        window.gameGold += 300;
        
        // Логика за завладяване на нови региони
        const possibleRegions = ["Мизия", "Тракия", "Македония", "Панония"];
        const unowned = possibleRegions.filter(r => !window.playerRegions.includes(r));
        
        if (unowned.length > 0 && Math.random() > 0.5) {
            const newReg = unowned[Math.floor(Math.random() * unowned.length)];
            if (typeof window.captureRegion === 'function') {
                window.captureRegion(hero, newReg);
            }
        }
        
        if (typeof window.dropRandomLoot === 'function') {
            window.dropRandomLoot(hero);
        }
    } else {
        // Поражение
        const lossText = {
            bg: `⚔️ Поражение! Твоята войска бе разбита от ромейските легиони.`,
            en: `⚔️ Defeat! Your army was crushed by the Rhomaioi legions.`,
            ru: `⚔️ Поражение! Ваше войско было разбито ромейскими легионами.`
        };
        
        message = `<span style="color: #e74c3c;">${lossText[lang]}</span>`;
        hero.armySize = Math.floor(hero.armySize * 0.5);
    }

    // Обновяване на лога и интерфейса
    if (log) {
        log.innerHTML = `<div style="border-bottom: 1px solid #444; padding: 5px;">${message}</div>` + log.innerHTML;
    }
    
    window.updateGoldDisplay();
    window.updateCharacterUI(hero);
};
