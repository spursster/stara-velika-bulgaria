// Функция за наемане на войска
window.recruitUnit = function(hero, type) {
    const costs = { 'ЛЕКА_ПЕХОТА': 100, 'КОННИЦА': 300, 'СТРЕЛЦИ': 150 };
    const sizes = { 'ЛЕКА_ПЕХОТА': 50, 'КОННИЦА': 30, 'СТРЕЛЦИ': 40 };

    if (window.gameGold >= costs[type]) {
        window.gameGold -= costs[type];
        hero.armySize += sizes[type];
        hero.updateRank();
        return `Успешно наехте ${type}. Армията ви нарасна!`;
    } return "Нямате достатъчно злато!";
};

// Функция за брак
window.proposeMarriage = function(hero, faction) {
    const success = Math.random() > 0.5;
    if (success) {
        window.gameGold += 200;
        return `Дипломатически брак с ${faction} е сключен! Зестра: 200🪙`;
    } return `Предложението за брак към ${faction} беше отхвърлено.`;
};

// Битка срещу Ромеите
window.simulateBattle = function(hero, enemyName) {
    const win = Math.random() < (0.5 + hero.level * 0.02);
    const log = document.getElementById('event-log');
    if (win) {
        let msg = "Победа над Ромеите!";
        if (window.availableProvinces.length > 0) {
            const p = window.availableProvinces.shift();
            window.playerRegions.push(p);
            msg += ` Завладяхте ${p.name}!`;
        }
        hero.levelUp();
        log.innerHTML += `<p style="color:#2ecc71;">⚔️ ${msg}</p>`;
    } else {
        hero.armySize = Math.floor(hero.armySize * 0.8);
        log.innerHTML += `<p style="color:#e74c3c;">⚔️ Поражение от Ромеите!</p>`;
    }
    window.updateCharacterUI(hero);
};

// Ритуал и Благословии
window.performAncientRitual = function(hero) {
    const gods = [{name:"Тангра", gift:"Небесна мощ"}, {name:"Бендида", gift:"Плодородие"}, {name:"Залмоксис", gift:"Безсмъртие"}];
    const god = gods[Math.floor(Math.random() * gods.length)];
    if (!hero.divineUnits.find(g => g.name === god.name)) {
        hero.divineUnits.push(god);
        return `Бог ${god.name} ви дари с ${god.gift}!`;
    } return `${god.name} вече ви е благословил.`;
};

window.advanceYear = function(hero) {
    window.gameYear += 1;
    window.gameGold += 150; // Годишен данък
    if (hero.age >= hero.maxAge) {
        hero.isAlive = false;
        window.showSuccessionMenu();
    } else {
        hero.age += 1;
    }
    window.updateCharacterUI(hero);
};
