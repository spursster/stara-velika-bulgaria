/**
 * МОДУЛ: БИТКИ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода & 51 региона)
 * Включва родови модификатори и система за завладяване на земи.
 */

window.startBattle = function() {
    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        battleScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.95); z-index: 20000; display: flex;
            align-items: center; justify-content: center; color: white;
        `;
        document.body.appendChild(battleScreen);
    }

    // СИНХРОНИЗИРАНИ ВРАГОВЕ СПРЯМО 51-ТЕ РЕГИОНА
    const battleScenarios = [
        { name: "Ромеи", region: "Тракия", powerMult: 1.2 },
        { name: "Скити", region: "Сарматия", powerMult: 1.0 },
        { name: "Перси", region: "Месопотамия", powerMult: 1.4 },
        { name: "Авари", region: "Панония", powerMult: 1.1 },
        { name: "Даки", region: "Дакия", powerMult: 0.9 }
    ];
    
    const enemy = battleScenarios[Math.floor(Math.random() * battleScenarios.length)];
    const enemyArmy = Math.floor(window.currentHero.armySize * (enemy.powerMult + Math.random() * 0.3));

    battleScreen.style.display = 'flex';
    battleScreen.innerHTML = `
        <div style="width: 90%; max-width: 500px; padding: 30px; border: 2px solid #d4af37; background: #050505; text-align: center;">
            <h2 style="color: #d4af37; text-transform: uppercase;">Военен Сблъсък</h2>
            <p style="font-size: 1.1em;">Нашите съгледвачи докладват за вражеска войска!</p>
            <div style="margin: 20px 0; padding: 15px; background: rgba(212,175,55,0.1); border: 1px solid #444;">
                <div style="color: #ff4d4d; font-weight: bold;">ВРАГ: ${enemy.name}</div>
                <div>МЕСТОПОЛОЖЕНИЕ: ${enemy.region}</div>
                <div>ЧИСЛЕНОСТ: ~${enemyArmy} воини</div>
            </div>
            <div id="battle-details" style="min-height: 50px; margin-bottom: 20px;">
                <p>Ще поведете ли родовете в бой, Велики Кане?</p>
            </div>
            <div id="battle-controls">
                <button onclick="window.processBattle(${enemyArmy}, '${enemy.name}', '${enemy.region}')" 
                        style="background: #d4af37; color: black; border: none; padding: 12px 25px; font-weight: bold; cursor: pointer; margin-right: 10px;">В АТАКА!</button>
                <button onclick="document.getElementById('battle-screen').style.display='none'" 
                        style="background: #333; color: white; border: none; padding: 12px 25px; cursor: pointer;">ОТСТЪПЛЕНИЕ</button>
            </div>
        </div>
    `;
};

window.processBattle = function(eArmy, eName, eRegion) {
    const hero = window.currentHero;
    const details = document.getElementById('battle-details');
    const controls = document.getElementById('battle-controls');
    
    if (!details || !controls) return;

    // ПРИЛАГАНЕ НА РОДОВИ БОНУСИ
    let dynastyPowerBonus = window.getPerkValue ? window.getPerkValue('power') : 1.0;
    
    // Специални бонуси
    if (hero.dynasty === "Скити") dynastyPowerBonus *= 1.1; // Допълнителен бонус за конница
    if (hero.dynasty === "Македони") dynastyPowerBonus *= 1.05;

    const playerStr = (hero.armySize + (hero.heroPower * 2)) * dynastyPowerBonus;
    const enemyStr = eArmy;

    if (playerStr >= enemyStr) {
        // ПОБЕДА
        const loot = Math.floor(eArmy * 0.5);
        hero.gold += loot;
        
        // Завладяване на региона
        if (window.conquerRegion) window.conquerRegion(eRegion);

        details.innerHTML = `
            <h3 style="color: #4CAF50;">ВЕЛИКА ПОБЕДА!</h3>
            <p>Врагът ${eName} е разбит при ${eRegion}!</p>
            <p>Плячка: <b>${loot}</b> 💰</p>
        `;
    } else {
        // ПОРАЖЕНИЕ
        const losses = Math.floor(hero.armySize * 0.3);
        hero.armySize -= losses;
        
        details.innerHTML = `
            <h3 style="color: #ff4d4d;">ТЕЖКО ПОРАЖЕНИЕ</h3>
            <p>Вашите воини отстъпиха пред ${eName}.</p>
            <p>Загуби: <b>${losses}</b> воини 🏹</p>
        `;
    }

    controls.innerHTML = `
        <button onclick="document.getElementById('battle-screen').style.display='none'" 
                style="background: #d4af37; color: black; border: none; padding: 10px 30px; cursor: pointer; font-weight: bold;">ПРОДЪЛЖИ</button>
    `;

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
