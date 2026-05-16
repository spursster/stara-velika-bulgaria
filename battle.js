/**
 * МОДУЛ: БИТКИ - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Връзка с 51 Региона, Екипирани Артефакти и Родови Бонуси)
 * Включва родови модификатори, система за завладяване на земи и бонуси от съкровищницата.
 * Статистика на файловете в проекта: 16
 */

window.startBattle = function(targetRegion) {
    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        battleScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.96); z-index: 20000; display: flex;
            align-items: center; justify-content: center; color: white;
            font-family: 'Georgia', serif;
        `;
        document.body.appendChild(battleScreen);
    }

    let enemyName = "Местни бунтовници";
    let enemyRegion = targetRegion || "Тракия";
    let powerMult = 1.0;

    // 1. ДИНАМИЧНА СИНХРОНИЗАЦИЯ С КАРТАТА И 51-ТЕ РЕГИОНА
    if (targetRegion && window.worldData && window.worldData.regions && window.worldData.regions[targetRegion]) {
        const reg = window.worldData.regions[targetRegion];
        enemyRegion = targetRegion;
        powerMult = (reg.difficulty || 100) / 100;
        
        if (reg.nativeClans && reg.nativeClans.length > 0) {
            // Избираме случаен от местните родове за опонент на база world_data.js
            enemyName = reg.nativeClans[Math.floor(Math.random() * reg.nativeClans.length)];
        }
    } else {
        // Резервен сценарий за съвместимост, ако функцията се извика без подаден регион
        const battleScenarios = [
            { name: "Ромеи", region: "Тракия", powerMult: 1.2 },
            { name: "Скити", region: "Сарматия", powerMult: 1.0 },
            { name: "Перси", region: "Месопотамия", powerMult: 1.4 },
            { name: "Авари", region: "Панония", powerMult: 1.1 },
            { name: "Даки", region: "Дакия", powerMult: 0.9 }
        ];
        const scenario = battleScenarios[Math.floor(Math.random() * battleScenarios.length)];
        enemyName = scenario.name;
        enemyRegion = scenario.region;
        powerMult = scenario.powerMult;
    }

    const enemyArmy = Math.floor(window.currentHero.armySize * (powerMult + Math.random() * 0.3));

    battleScreen.style.display = 'flex';
    battleScreen.innerHTML = `
        <div style="width: 90%; max-width: 500px; padding: 30px; border: 2px solid #d4af37; background: #050505; text-align: center; border-radius: 6px; box-shadow: 0 0 25px rgba(0,0,0,0.95);">
            <h2 style="color: #d4af37; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Военен Сблъсък</h2>
            <p style="font-size: 1em; color: #ccc;">Нашите съгледвачи докладват за вражеска войска по границите!</p>
            
            <div style="margin: 20px 0; padding: 15px; background: rgba(212,175,55,0.05); border: 1px solid #333; text-align: left; line-height: 1.5; font-size: 0.95em;">
                <div style="color: #ff4d4d; font-weight: bold; text-transform: uppercase;">⚔️ Опонент: <span style="color: #fff;">${enemyName}</span></div>
                <div>🗺️ Територия: <b style="color: #d4af37;">${enemyRegion}</b></div>
                <div>🏹 Численост: <b style="color: #fff;">~${enemyArmy}</b> воини</div>
            </div>
            
            <div id="battle-details" style="min-height: 50px; margin-bottom: 25px; font-size: 0.95em; color: #aaa;">
                <p>Ще поведете ли конницата и пехотата в съдбоносен бой, Велики Владетелю?</p>
            </div>
            
            <div id="battle-controls" style="display: flex; gap: 12px; justify-content: center;">
                <button onclick="window.processBattle(${enemyArmy}, '${enemyName}', '${enemyRegion}')" 
                        style="flex: 1; background: #7b1a1a; color: white; border: 1px solid #a32a2a; padding: 12px; font-weight: bold; cursor: pointer; text-transform: uppercase; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#992222'" onmouseout="this.style.background='#7b1a1a'">В АТАКА!</button>
                <button onclick="document.getElementById('battle-screen').style.display='none'" 
                        style="flex: 1; background: #1b1b1b; color: #ccc; border: 1px solid #333; padding: 12px; cursor: pointer; text-transform: uppercase; border-radius: 4px; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#ccc'">ОТСТЪПЛЕНИЕ</button>
            </div>
        </div>
    `;
};

window.processBattle = function(eArmy, eName, eRegion) {
    const hero = window.currentHero;
    const details = document.getElementById('battle-details');
    const controls = document.getElementById('battle-controls');
    
    if (!details || !controls) return;

    // 2. СИНХРОНИЗАЦИЯ С ЕКИПИРАНИ ПРЕДМЕТИ (АРТЕФАКТИ)
    // Преминаваме към window.equippedItems за пълна съвместимост с logic.js и economy.js
    let artifactBonusPower = 0;
    if (window.equippedItems && window.equippedItems.length > 0) {
        window.equippedItems.forEach(item => {
            if (item && item.bonus && item.bonus.heroPower) {
                // Всяка единица мощ от екипиран родов артефакт дава сериозно предимство
                artifactBonusPower += item.bonus.heroPower * 5;
            }
        });
    }

    // 3. ПРИЛАГАНЕ НА РОДОВИ БОНУСИ (от mechanics.js)
    let dynastyPowerBonus = window.getPerkValue ? window.getPerkValue('power') : 1.0;
    
    // Специфични допълнителни бонуси за родове съгласно твоите правила
    if (hero.dynasty === "Скити") dynastyPowerBonus *= 1.1; 
    if (hero.dynasty === "Македони") dynastyPowerBonus *= 1.05;

    // Изчисляване на общата военна мощ
    const playerStr = ((hero.armySize + (hero.heroPower * 2)) + artifactBonusPower) * dynastyPowerBonus;
    const enemyStr = eArmy;

    if (playerStr >= enemyStr) {
        // ПОБЕДА
        const loot = Math.floor(eArmy * 0.5);
        hero.gold += loot;
        
        // 4. СИНХРОНИЗАЦИЯ НА ЗАВЛАДЯВАНЕТО
        if (window.conquerRegion) {
            window.conquerRegion(eRegion);
        } else {
            // Сигурен предпазен механизъм за вписване на региона, в случай че функцията липсва в logic.js
            if (!window.playerRegions) window.playerRegions = [];
            let flat = window.playerRegions.flat();
            if (!flat.includes(eRegion)) {
                flat.push(eRegion);
                if (window.playerRegions.length > 0 && Array.isArray(window.playerRegions[0])) {
                    window.playerRegions = [flat];
                } else {
                    window.playerRegions = flat;
                }
            }
        }

        let victoryText = `
            <div style="color: #4CAF50; font-weight: bold; font-size: 1.1em; margin-bottom: 10px; text-transform: uppercase;"> ⚔️ ВЕЛИКА ПОБЕДА! ⚔️</div>
            <p style="margin: 5px 0;">Врагът <b style="color:#fff;">${eName}</b> беше напълно разбит при <b style="color:#d4af37;">${eRegion}</b>!</p>
            <p style="margin: 5px 0; color: #ffd700;">Спечелена плячка: <b>+${loot}</b> 💰</p>
        `;
        
        if (artifactBonusPower > 0) {
            victoryText += `<p style="color: #e5c158; font-size: 0.85em; font-style: italic; margin-top: 10px;">🛡️ Екипираните реликви осигуриха допълнителни +${artifactBonusPower} точки мощ в боя!</p>`;
        }
        
        details.innerHTML = victoryText;
    } else {
        // ПОРАЖЕНИЕ
        const losses = Math.floor(hero.armySize * 0.3);
        hero.armySize -= losses;
        
        details.innerHTML = `
            <div style="color: #ff4d4d; font-weight: bold; font-size: 1.1em; margin-bottom: 10px; text-transform: uppercase;">❌ ТЕЖКО ПОРАЖЕНИЕ ❌</div>
            <p style="margin: 5px 0;">Вашите воини бяха принудени да отстъпят пред численото превъзходство на <b style="color:#fff;">${eName}</b>.</p>
            <p style="margin: 5px 0; color: #ff8888;">Загуби на бойното поле: <b>-${losses}</b> воини 🏹</p>
        `;
    }

    controls.innerHTML = `
        <button onclick="document.getElementById('battle-screen').style.display='none'" 
                style="background: #111; color: #d4af37; border: 1px solid #d4af37; padding: 10px 30px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.1)'" onmouseout="this.style.background='#111'">ПРОДЪЛЖИ</button>
    `;

    // Синхронизираме новите финансови и военни данни в глобалната база данни на рода
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
        window.worldData.clans[hero.dynasty].armySize = hero.armySize;
        window.worldData.clans[hero.dynasty].gold = hero.gold;
    }

    // Незабавно обновяване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
