window.simulateBattle = function(hero, enemyName) {
    if (!hero || !hero.isAlive) return;

    // Подсигуряване, че масивът с региони съществува
    if (!window.playerRegions) {
        window.playerRegions = ["Одриско царство"];
    }

    let enemyPower = 200 + (hero.level * 50);
    let heroPower = hero.armySize + (hero.level * 20);
    
    const log = document.getElementById('event-log');
    let message = "";

    if (heroPower > enemyPower) {
        message = `<span style="color: #2ecc71;">⚔️ Победа! Ромеите отстъпиха пред мощта на рода ${hero.dynasty}.</span>`;
        window.gameGold += 300;
        
        // Шанс за завладяване на нов регион
        const possibleRegions = ["Мизия", "Тракия", "Македония", "Панония"];
        
        // Проверка: филтрираме само региони, които още не притежаваме
        const unowned = possibleRegions.filter(r => {
            return window.playerRegions && !window.playerRegions.includes(r);
        });
        
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
        message = `<span style="color: #e74c3c;">⚔️ Поражение! Твоята войска бе разбита от ромейските легиони.</span>`;
        hero.armySize = Math.floor(hero.armySize * 0.5);
    }

    if (log) {
        log.innerHTML = `<div style="border-bottom: 1px solid #444; padding: 5px;">${message}</div>` + log.innerHTML;
    }
    
    window.updateCharacterUI(hero);
};
