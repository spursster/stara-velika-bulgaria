window.simulateBattle = function(hero, enemyName) {
    if (!hero || !hero.isAlive) return;

    const winChance = 0.5 + (hero.level * 0.02);
    const win = Math.random() < winChance;
    const log = document.getElementById('event-log');

    if (win) {
        let rewardMsg = "Победа! Врагът е разбит.";
        
        // Автоматично завладяване при победа
        if (window.availableProvinces.length > 0) {
            const newProvince = window.availableProvinces.shift(); 
            window.playerRegions.push(newProvince);
            rewardMsg = `Победа! Завладяхте провинция **${newProvince.name}**! Виж новата карта на екрана.`;
        }

        hero.levelUp();
        if (log) log.innerHTML = `<p style="color: #2ecc71;">⚔️ ${rewardMsg}</p>` + log.innerHTML;
    } else {
        hero.armySize = Math.floor(hero.armySize * 0.7);
        // Използваме "ромейски" за периода
        if (log) log.innerHTML = `<p style="color: #e74c3c;">⚔️ Поражение! Ромейската войска отблъсна атаката.</p>` + log.innerHTML;
    }
    window.updateCharacterUI(hero);
};

window.performAncientRitual = function(hero) {
    if (!hero || !hero.isAlive) return "Няма жив владетел.";
    if (!hero.divineUnits) hero.divineUnits = [];

    // Използваме антична българска митология
    const gods = [
        { name: "Тангра", effect: "Небесна сила" },
        { name: "Бендида", effect: "Великата майка" },
        { name: "Залмоксис", effect: "Безсмъртие" }
    ];
    
    const god = gods[Math.floor(Math.random() * gods.length)];
    const alreadyBlessed = hero.divineUnits.find(g => g.name === god.name);
    
    if (!alreadyBlessed) {
        hero.divineUnits.push(god);
        if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(hero);
        return `Боговете се отзоваха! ${god.name} дари рода ${hero.dynasty} със своята благословия.`;
    } else {
        return `${god.name} вече бди над теб, владетелю.`;
    }
};
