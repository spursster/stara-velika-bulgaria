/**
 * МОДУЛ: БИТКИ - Велика България (Обновен с подкрепа от родове)
 */

window.startBattle = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Проверка за съюзническа помощ
    let allyBonus = 0;
    let allyMessage = "Нямате съюзници в тази битка.";
    
    for (let clan in window.clanRelations) {
        if (window.clanRelations[clan] > 80) {
            allyBonus += 40;
            allyMessage = `Род ${clan} изпрати свои конници на ваша страна! (+40 Мощ)`;
            break; 
        }
    }

    const enemies = ["Авари", "Хазари", "Ромеи"];
    const enemyName = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyArmy = Math.floor(window.currentHero.armySize * (0.6 + Math.random()));
    const enemyPower = Math.floor(Math.random() * 70);

    const battleOverlay = document.createElement('div');
    battleOverlay.id = "battle-screen";
    battleOverlay.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: #050505; z-index: 1500; padding: 20px; box-sizing: border-box;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        border: 2px solid #ff4d4d;
    `;

    battleOverlay.innerHTML = `
        <h2 style="font-family: 'Cinzel'; color: #ff4d4d;">БОЙНО ПОЛЕ</h2>
        <p style="font-size: 11px; color: #d4af37;">${allyMessage}</p>
        <div style="display: flex; width: 100%; justify-content: space-around; margin: 20px 0;">
            <div style="text-align: center;">
                <div style="font-size: 40px;">🏇</div>
                <div style="font-family: 'Cinzel'; color: #d4af37;">КАН ${window.currentHero.name.toUpperCase()}</div>
                <div>Сила: ${window.currentHero.armySize + window.currentHero.heroPower + allyBonus}</div>
            </div>
            <div style="font-size: 30px; align-self: center;">VS</div>
            <div style="text-align: center;">
                <div style="font-size: 40px;">🏹</div>
                <div style="font-family: 'Cinzel'; color: #ff4d4d;">${enemyName.toUpperCase()}</div>
                <div>Сила: ${enemyArmy + enemyPower}</div>
            </div>
        </div>
        <div id="battle-log" style="width: 85%; height: 80px; background: #111; border: 1px solid #333; padding: 10px; font-size: 11px; overflow-y: auto; margin-bottom: 15px;">
            Войските са в очакване на вашата заповед...
        </div>
        <button id="resolve-battle-btn" onclick="window.resolveBattle(${enemyArmy}, ${enemyPower}, '${enemyName}', ${allyBonus})" style="
            padding: 12px 35px; background: #7b1a1a; color: white; border: none; 
            font-family: 'Cinzel'; cursor: pointer;
        ">АТАКУВАЙ!</button>
    `;

    mainArea.appendChild(battleOverlay);
};

window.resolveBattle = function(eArmy, ePower, eName, aBonus) {
    const hero = window.currentHero;
    const log = document.getElementById('battle-log');
    const btn = document.getElementById('resolve-battle-btn');
    btn.disabled = true;

    const playerTotal = hero.armySize + hero.heroPower + aBonus;
    const enemyTotal = eArmy + ePower;

    setTimeout(() => {
        if (playerTotal >= enemyTotal) {
            const loot = Math.floor(eArmy * 0.4);
            hero.gold += loot;
            hero.xp += 15;
            log.innerHTML = `<b style="color: #d4af37;">СЛАВНА ПОБЕДА! Плячка: ${loot} 💰.</b>`;
        } else {
            const losses = Math.floor(hero.armySize * 0.25);
            hero.armySize -= losses;
            log.innerHTML = `<b style="color: #ff4d4d;">ОТСТЪПЛЕНИЕ! Загубихте ${losses} воини.</b>`;
        }
        
        btn.innerText = "Към управлението";
        btn.disabled = false;
        btn.onclick = () => {
            document.getElementById('battle-screen').remove();
            window.updateCharacterUI(hero);
        };
    }, 1200);
};
