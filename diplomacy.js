const diplomacyActions = {
    "ROYAL_WEDDING": { label: "Династичен брак", minLevel: 5, goldCost: 500 },
    "NON_AGGRESSION": { label: "Пакт за ненападение", minLevel: 3, goldCost: 200 },
    "TRADE_AGREEMENT": { label: "Търговско споразумение", minLevel: 2, goldCost: 100 }
};

function proposeMarriage(hero, targetCivName) {
    const civ = window.worldCivs[targetCivName];
    if (!civ) return "Непозната империя.";

    // Логика за шанс за успех (базирана на ниво и ранг на армията)
    let successChance = (hero.level * 5) + (civ.relation / 2);
    if (hero.armyRank === "Легион") successChance += 20;

    let roll = Math.random() * 100;
    
    const eventLog = document.getElementById('event-log');
    let message = "";

    if (roll < successChance) {
        civ.relation += 30; // Подобряваме отношенията
        message = `💍 УСПЕХ! ${hero.name} сключи брак с принцеса от ${targetCivName}. Отношенията ни се подобриха!`;
        // Бонус: Династичен подарък (предмет)
        if (window.dropRandomLoot) window.dropRandomLoot(hero);
    } else {
        civ.relation -= 10;
        message = `💔 ОТКАЗ! Императорът на ${targetCivName} не смята нашия род за достатъчно престижен.`;
    }

    if (eventLog) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>[Дипломация]</strong> ${message}`;
        eventLog.prepend(p);
    }
    
    window.updateCharacterUI(hero);
    return message;
}

window.proposeMarriage = proposeMarriage;
