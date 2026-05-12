window.simulateBattle = function(hero, enemyName) {
    if (!hero || !hero.isAlive) return;

    let enemyPower = 200 + (hero.level * 50);
    let heroPower = hero.armySize + (hero.level * 20);
    
    const log = document.getElementById('event-log');
    let message = "";

    if (heroPower > enemyPower) {
        message = `<span style="color: #2ecc71;">⚔️ Победа! Ромеите отстъпиха пред мощта на рода ${hero.dynasty}.</span>`;
        window.gameGold += 300;
        
        // Шанс за завладяване на нов регион
        const possibleRegions = ["Мизия", "Тракия", "Македония", "Панония"];
        const unowned = possibleRegions.filter(r => !window.playerRegions.includes(r));
        
        if (unowned.length > 0 && Math.random() > 0.5) {
            const newReg = unowned[Math.floor(Math.random() * unowned.length)];
            window.captureRegion(hero, newReg);
        }
        
        // Шанс за плячка (артефакт)
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
