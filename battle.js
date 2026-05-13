/**
 * МОДУЛ: БИТКИ - Велика България
 */

window.startBattle = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Генериране на случаен враг (съседни родове или чужди сили)
    const enemies = ["Авари", "Хазари", "Ромеи", "Местни враждебни родове"];
    const enemyName = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyArmy = Math.floor(window.currentHero.armySize * (0.5 + Math.random()));
    const enemyPower = Math.floor(Math.random() * 80);

    // Създаване на боен интерфейс
    const battleOverlay = document.createElement('div');
    battleOverlay.id = "battle-screen";
    battleOverlay.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: #050505; z-index: 1500; padding: 20px; box-sizing: border-box;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        border: 2px solid #ff4d4d;
    `;

    battleOverlay.innerHTML = `
        <h2 style="font-family: 'Cinzel'; color: #ff4d4d;">ГОЛЯМА БИТКА</h2>
        <div style="display: flex; width: 100%; justify-content: space-around; margin: 30px 0;">
            <div style="text-align: center;">
                <div style="font-size: 50px;">🏇</div>
                <div style="font-family: 'Cinzel'; color: #d4af37;">КАН ${window.currentHero.name.toUpperCase()}</div>
                <div>Войска: ${window.currentHero.armySize}</div>
                <div>Мощ: ${window.currentHero.heroPower}</div>
            </div>
            <div style="font-size: 40px; align-self: center;">VS</div>
            <div style="text-align: center;">
                <div style="font-size: 50px;">🏹</div>
                <div style="font-family: 'Cinzel'; color: #ff4d4d;">${enemyName.toUpperCase()}</div>
                <div>Войска: ${enemyArmy}</div>
                <div>Мощ: ${enemyPower}</div>
            </div>
        </div>
        <div id="battle-log" style="width: 80%; height: 100px; background: #111; border: 1px solid #333; padding: 10px; font-size: 12px; overflow-y: auto; margin-bottom: 20px;">
            Войските се подреждат в боен ред...
        </div>
        <button id="resolve-battle-btn" onclick="window.resolveBattle(${enemyArmy}, ${enemyPower}, '${enemyName}')" style="
            padding: 15px 40px; background: #7b1a1a; color: white; border: none; 
            font-family: 'Cinzel'; cursor: pointer; font-size: 18px;
        ">ВЛЕЗ В БОЙ!</button>
    `;

    mainArea.appendChild(battleOverlay);
};

window.resolveBattle = function(eArmy, ePower, eName) {
    const hero = window.currentHero;
    const log = document.getElementById('battle-log');
    const btn = document.getElementById('resolve-battle-btn');
    btn.disabled = true;

    // Изчисляване на бойна сила
    const playerStrength = hero.armySize + (hero.heroPower * 2);
    const enemyStrength = eArmy + (ePower * 2);

    setTimeout(() => {
        let resultMsg = "";
        let style = "";

        if (playerStrength >= enemyStrength) {
            const loot = Math.floor(eArmy * 0.5);
            hero.gold += loot;
            hero.xp += 20;
            resultMsg = `ПОБЕДА! Разгромихте ${eName}. Плячка: ${loot} 💰.`;
            style = "royal";
            if (window.logEvent) window.logEvent(`Славна победа над ${eName}!`, "royal");
        } else {
            const losses = Math.floor(hero.armySize * 0.3);
            hero.armySize -= losses;
            resultMsg = `ПОРАЖЕНИЕ! ${eName} ви принудиха да отстъпите. Загуби: ${losses} воини.`;
            style = "death";
            if (window.logEvent) window.logEvent(`Горчиво поражение от ${eName}.`, "death");
        }

        log.innerHTML = `<b style="color: #d4af37;">${resultMsg}</b>`;
        
        // Бутон за изход
        btn.innerText = "Продължи";
        btn.disabled = false;
        btn.onclick = () => {
            document.getElementById('battle-screen').remove();
            window.updateCharacterUI(hero);
        };
    }, 1500);
};
