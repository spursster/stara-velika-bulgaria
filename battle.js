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
    const enemyArmy = Math.floor(window.currentHero.armySize * (0.7 + Math.random()));
    const enemyPower = Math.floor(Math.random() * 60);

    const battleOverlay = document.createElement('div');
    battleOverlay.id = "battle-screen";
    battleOverlay.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: #050505; z-index: 2000; padding: 20px; box-sizing: border-box;
        border: 2px solid #ff4d4d; color: #fff; display: flex; flex-direction: column;
    `;

    battleOverlay.innerHTML = `
        <h2 style="text-align:center; font-family:'Cinzel'; color:#ff4d4d;">ВОЕНЕН СЪВЕТ</h2>
        <div style="display:flex; justify-content:space-around; margin:20px 0;">
            <div style="text-align:center;">
                <p style="color:#d4af37;">КАН ${window.currentHero.name.toUpperCase()}</p>
                <p>Войска: ${window.currentHero.armySize}</p>
            </div>
            <div style="font-size:24px; align-self:center;">VS</div>
            <div style="text-align:center;">
                <p style="color:#ff4d4d;">${enemy.name.toUpperCase()}</p>
                <p>Войска: ${enemyArmy}</p>
            </div>
        </div>
        <div id="battle-details" style="flex-grow:1; background:#111; border:1px solid #333; padding:15px; font-size:12px; overflow-y:auto;">
            Разузнавачите докладват: Врагът заема позиции в ${enemy.region}...
        </div>
        <button id="fight-btn" onclick="window.processBattle(${enemyArmy}, ${enemyPower}, '${enemy.name}', '${enemy.region}')" 
            style="width:100%; padding:15px; background:#7b1a1a; color:white; font-family:'Cinzel'; border:none; cursor:pointer; margin-top:10px;">
            ЗА ПРЕДЦИТЕ!
        </button>
    `;
    mainArea.appendChild(battleOverlay);
};

window.processBattle = function(eArmy, ePower, eName, eRegion) {
    const hero = window.currentHero;
    const details = document.getElementById('battle-details');
    const playerStrength = hero.armySize + (hero.heroPower * 1.5);
    const enemyStrength = eArmy + (ePower * 1.5);

    details.innerHTML = "Битката започна! Конницата атакува фланговете...<br>";

    setTimeout(() => {
        if (playerStrength >= enemyStrength) {
            const loot = Math.floor(eArmy * 0.6);
            hero.gold += loot;
            // Вземане на територия
            if (!window.playerRegions.includes(eRegion)) {
                window.playerRegions.push(eRegion);
            }
            details.innerHTML += `<br><b style="color:#d4af37;">ПОБЕДА!</b><br>Завладян регион: ${eRegion}<br>Плячка: ${loot} 💰`;
            window.logEvent(`Славна победа над ${eName}! Превзета е ${eRegion}.`, "royal");
        } else {
            const losses = Math.floor(hero.armySize * 0.4);
            hero.armySize -= losses;
            details.innerHTML += `<br><b style="color:#ff4d4d;">ПОРАЖЕНИЕ!</b><br>Загубени воини: ${losses}`;
            window.logEvent(`Загуба в битка срещу ${eName}.`, "death");
        }

        const btn = document.getElementById('fight-btn');
        btn.innerText = "КЪМ ПРЕСТОЛА";
        btn.onclick = () => {
            document.getElementById('battle-screen').remove();
            window.updateCharacterUI(hero);
        };
    }, 1500);
};
