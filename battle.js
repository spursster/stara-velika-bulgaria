/**
 * МОДУЛ: БИТКИ - Велика България (Синхронизиран - Мобилен Фикс)
 */
window.startBattle = function() {
    // Вече не търсим mainArea, а добавяме директно към body за абсолютен приоритет
    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        document.body.appendChild(battleScreen);
    }

    const enemies = [
        { name: "Ромеи", region: "Тракия", powerMult: 1.1 },
        { name: "Перси", region: "Мала Азия", powerMult: 1.3 },
        { name: "Скити", region: "Скития", powerMult: 0.9 },
        { name: "Дардани", region: "Дардания", powerMult: 1.0 }
    ];
    
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyArmy = Math.floor(window.currentHero.armySize * (enemy.powerMult + Math.random() * 0.2));

    // Показваме екрана и прилагаме стила за целия екран
    battleScreen.style.display = 'flex';
    battleScreen.innerHTML = `
        <div class="modal-content" style="width: 100%; max-width: 600px; padding: 20px;">
            <h2 style="text-align:center; font-family:'Cinzel'; color:#ff4d4d; margin-bottom:20px;">ВОЕНЕН СЪВЕТ</h2>
            <div id="battle-details" style="background:#111; border:1px solid #333; padding:15px; height:220px; overflow-y:auto; margin-bottom:15px; font-family: 'Cinzel'; border-left: 4px solid #7b1a1a;">
                <p style="color: #d4af37;">Нашите съгледвачи докладват!</p>
                <p>Вражеската войска на <b>${enemy.name}</b> е навлязла в <b>${enemy.region}</b>.</p>
                <p>Тяхната численост е около <b>${enemyArmy}</b> воини.</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button id="battle-action-btn" onclick="window.processBattle(${enemyArmy}, '${enemy.name}', '${enemy.region}')" 
                    style="flex:1; padding:15px; background:#7b1a1a; color:white; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold;">АТАКУВАЙ!</button>
                <button id="battle-retreat-btn" onclick="window.closeBattle();" 
                    style="flex:1; padding:15px; background:#333; color:white; border:none; cursor:pointer; font-family:'Cinzel';">ОТСТЪПИ</button>
            </div>
        </div>
    `;
};

window.closeBattle = function() {
    const battleScreen = document.getElementById('battle-screen');
    if (battleScreen) {
        battleScreen.style.display = 'none';
        battleScreen.innerHTML = '';
    }
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.processBattle = function(eArmy, eName, eRegion) {
    const hero = window.currentHero;
    const details = document.getElementById('battle-details');
    const btnContainer = document.querySelector('#battle-screen .modal-content div:last-child');
    
    if (!details || !btnContainer) return;

    const dynastyPowerBonus = window.getPerkValue ? window.getPerkValue('power') : 1.0;
    const playerStr = (hero.armySize + (hero.heroPower * 2)) * dynastyPowerBonus;
    const enemyStr = eArmy;

    if (playerStr >= enemyStr) {
        const loot = Math.floor(eArmy * 0.4);
        hero.gold += loot;
        if (!window.playerRegions.includes(eRegion)) window.playerRegions.push(eRegion);
        details.innerHTML = `<h3 style="color:#d4af37; font-family:'Cinzel';">ВЕЛИКА ПОБЕДА!</h3><p>Врагът е разбит при ${eRegion}!</p><p>Плячка: <b>${loot}</b> 💰</p>`;
    } else {
        const losses = Math.floor(hero.armySize * 0.25);
        hero.armySize -= losses;
        details.innerHTML = `<h3 style="color:#ff4d4d; font-family:'Cinzel';">ПОРАЖЕНИЕ...</h3><p>Вашите воини отстъпиха при ${eRegion}.</p><p>Загуби: <b>${losses}</b> воини.</p>`;
    }

    btnContainer.innerHTML = `
        <button onclick="window.closeBattle();" 
            style="width:100%; padding:15px; background:#d4af37; color:#000; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold;">
            ПРОДЪЛЖИ НАПРЕД
        </button>
    `;
};
