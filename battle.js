// Функция за симулиране на битка
function simulateBattle(hero, enemyCivName) {
    const enemy = window.worldCivs[enemyCivName];
    if (!enemy) return "Непознат враг!";

    console.log(`⚔️ БИТКА: ${hero.name} срещу ${enemyCivName}`);

    // Изчисляване на силата на врага (базирано на технологичното им ниво)
    let enemyPower = enemy.techLevel * 50;
    let heroPower = hero.armySize + (hero.level * 10);

    // Бонус от божествени единици (всяко божество дава огромен бонус)
    hero.divineUnits.forEach(unit => {
        heroPower += unit.stats.power * 2;
    });

    // Резултат от битката
    let logMessage = "";
    if (heroPower > enemyPower) {
        const loot = Math.floor(Math.random() * 100);
        logMessage = `🏆 ПОБЕДА! Легионите на ${hero.name} разгромиха ${enemyCivName}. Плячка: ${loot} злато.`;
        hero.levelUp(); // Победителите вдигат ниво
    } else if (heroPower === enemyPower) {
        logMessage = `🤝 РАВЕНСТВО! Двете армии се оттеглиха с тежки загуби.`;
    } else {
        // Проверка за божествено спасение (Точка 6)
        if (hero.divineUnits.length > 0) {
            logMessage = `🛡️ ЗАГУБА, но божествените единици защитиха владетеля от гибел!`;
        } else {
            hero.isAlive = false;
            logMessage = `💀 КАТАСТРОФА! ${hero.name} падна в битка срещу ${enemyCivName}.`;
        }
    }

    // Обновяване на събитията в интерфейса
    const eventLog = document.getElementById('event-log');
    if (eventLog) {
        const newEvent = document.createElement('p');
        newEvent.innerHTML = `<strong>[Година ${window.gameYear || ''}]</strong> ${logMessage}`;
        eventLog.prepend(newEvent);
    }

    updateCharacterUI(hero);
    return logMessage;
}

window.simulateBattle = simulateBattle;
