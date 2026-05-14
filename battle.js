/**
 * МОДУЛ: БИТКИ - Велика България (Синхронизиран - Версия 2.0)
 */
window.startBattle = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Списък с антични противници и техните територии (480 г. пр.н.е.)
    const enemies = [
        { name: "Ромеи", region: "Тракия", powerMult: 1.1 },
        { name: "Перси", region: "Мала Азия", powerMult: 1.3 },
        { name: "Скити", region: "Скития", powerMult: 0.9 },
        { name: "Дардани", region: "Дардания", powerMult: 1.0 }
    ];
    
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyArmy = Math.floor(window.currentHero.armySize * (enemy.powerMult + Math.random() * 0.2));

    mainArea.innerHTML = `
        <div id="battle-screen" style="position:absolute; top:0; left:0; width:100%; height:100%; background:#050505; z-index:2000; padding:20px; box-sizing:border-box; border:2px solid #7b1a1a;">
            <h2 style="text-align:center; font-family:'Cinzel'; color:#ff4d4d; margin-bottom:20px;">ВОЕНЕН СЪВЕТ</h2>
            <div id="battle-details" style="background:#111; border:1px solid #333; padding:15px; height:220px; overflow-y:auto; margin-bottom:15px; font-family: 'Cinzel'; border-left: 4px solid #7b1a1a;">
                <p style="color: #d4af37;">Нашите съгледвачи докладват!</p>
                <p>Вражеската войска на <b>${enemy.name}</b> е навлязла в <b>${enemy.region}</b>.</p>
                <p>Тяхната численост е около <b>${enemyArmy}</b> воини.</p>
                <p style="font-size: 11px; color: #888;">Вашата мощ се влияе от вашия род и артефакти.</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button id="battle-action-btn" onclick="window.processBattle(${enemyArmy}, '${enemy.name}', '${enemy.region}')" 
                    style="flex:1; padding:15px; background:#7b1a1a; color:white; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold;">АТАКУВАЙ!</button>
                <button id="battle-retreat-btn" onclick="document.getElementById('battle-screen').remove()" 
                    style="flex:1; padding:15px; background:#333; color:white; border:none; cursor:pointer; font-family:'Cinzel';">ОТСТЪПИ</button>
            </div>
        </div>
    `;
};

window.processBattle = function(eArmy, eName, eRegion) {
    const hero = window.currentHero;
    const details = document.getElementById('battle-details');
    const btnContainer = document.querySelector('#battle-screen div:last-child');
    
    if (!details || !btnContainer) return;

    // Използваме бонуса от механиките
    const dynastyPowerBonus = window.getPerkValue ? window.getPerkValue('power') : 1.0;
    const playerStr = (hero.armySize + (hero.heroPower * 2)) * dynastyPowerBonus;
    const enemyStr = eArmy;

    let battleResultHTML = "";

    if (playerStr >= enemyStr) {
        const loot = Math.floor(eArmy * 0.4);
        hero.gold += loot;
        if (!window.playerRegions.includes(eRegion)) window.playerRegions.push(eRegion);
        
        battleResultHTML = `
            <h3 style="color:#d4af37; font-family:'Cinzel';">ВЕЛИКА ПОБЕДА!</h3>
            <p>Врагът е разбит при ${eRegion}!</p>
            <p>Плячка: <b>${loot}</b> 💰</p>
            <p>Нова земя под ваш контрол: <b>${eRegion}</b></p>
        `;
        window.logEvent(`Кан ${hero.name} победи ${eName} при ${eRegion}!`, "royal");
    } else {
        const losses = Math.floor(hero.armySize * 0.25);
        hero.armySize -= losses;
        
        battleResultHTML = `
            <h3 style="color:#ff4d4d; font-family:'Cinzel';">ПОРАЖЕНИЕ...</h3>
            <p>Вашите воини не издържаха на натиска на ${eName}.</p>
            <p>Загуби в жива сила: <b>${losses}</b> воини.</p>
        `;
        window.logEvent(`Поражение срещу ${eName}. Загубени ${losses} воини.`, "warning");
    }

    details.innerHTML = battleResultHTML;

    // ПРЕВРЪЩАМЕ БУТОНИТЕ В ЕДИН ЗА ИЗХОД
    btnContainer.innerHTML = `
        <button onclick="document.getElementById('battle-screen').remove()" 
            style="width:100%; padding:15px; background:#d4af37; color:#000; border:none; cursor:pointer; font-family:'Cinzel'; font-weight:bold;">
            ПРОДЪЛЖИ НАПРЕД
        </button>
    `;

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
