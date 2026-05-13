/**
 * МОДУЛ: БИТКИ - Велика България
 */
window.startBattle = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const enemies = [
        { name: "Ромеи", region: "Тракия" },
        { name: "Авари", region: "Панония" },
        { name: "Хазари", region: "Кавказ" }
    ];
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyArmy = Math.floor(window.currentHero.armySize * (0.8 + Math.random()));

    mainArea.innerHTML = `
        <div id="battle-screen" style="position:absolute; top:0; left:0; width:100%; height:100%; background:#050505; z-index:2000; padding:20px; box-sizing:border-box; border:2px solid #ff4d4d;">
            <h2 style="text-align:center; font-family:'Cinzel'; color:#ff4d4d;">ВОЕНЕН СЪВЕТ</h2>
            <div id="battle-details" style="background:#111; border:1px solid #333; padding:15px; height:200px; overflow-y:auto; margin-bottom:10px;">
                Вражеската войска на ${enemy.name} е забелязана в ${enemy.region}.
            </div>
            <button id="battle-action-btn" onclick="window.processBattle(${enemyArmy}, '${enemy.name}', '${enemy.region}')" 
                style="width:100%; padding:15px; background:#7b1a1a; color:white; border:none; cursor:pointer;">АТАКУВАЙ!</button>
        </div>
    `;
};

window.processBattle = function(eArmy, eName, eRegion) {
    const hero = window.currentHero;
    const details = document.getElementById('battle-details');
    const btn = document.getElementById('battle-action-btn');
    
    if (!details || !btn) return;

    const playerStr = hero.armySize + (hero.heroPower * 2);
    const enemyStr = eArmy + 50;

    if (playerStr >= enemyStr) {
        const loot = Math.floor(eArmy * 0.5);
        hero.gold += loot;
        if (!window.playerRegions.includes(eRegion)) window.playerRegions.push(eRegion);
        details.innerHTML = `<b style="color:#d4af37;">ПОБЕДА!</b><br>Завзета земя: ${eRegion}<br>Плячка: ${loot} злато.`;
    } else {
        const losses = Math.floor(hero.armySize * 0.3);
        hero.armySize -= losses;
        details.innerHTML = `<b style="color:#ff4d4d;">ПОРАЖЕНИЕ!</b><br>Загуби: ${losses} воини.`;
    }

    btn.innerText = "КЪМ СЪВЕТА";
    btn.onclick = () => {
        const screen = document.getElementById('battle-screen');
        if (screen) screen.remove();
        window.updateCharacterUI(hero);
    };
};
