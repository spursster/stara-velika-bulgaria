/**
 * МОДУЛ: БИТКИ - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Връзка с RPG умения, вампиризъм и система за смърт/възкресяване)
 * Включва родови модификатори, тактики, издръжливост, висш вампиризъм и риск от митична смърт.
 * Статистика на файловете в проекта: 16
 */

window.startBattle = function(targetRegion) {
    // Проверка дали текущият владетел не е убит и чака възкресяване
    if (window.currentHero && window.currentHero.isDead) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🔮 ${window.currentHero.name} е в отвъдното! Извършете Ритуал за Възкресяване, преди да водите битки!`);
        }
        return;
    }

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
            enemyName = reg.nativeClans[Math.floor(Math.random() * reg.nativeClans.length)];
        }
    } else {
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

    // Защита за размера на армията на играча
    const playerArmySize = window.currentHero.armySize || window.currentHero.currentArmy || 100;
    const enemyArmy = Math.floor(playerArmySize * (powerMult + Math.random() * 0.3));

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

    // Инициализация на RPG данни, ако липсват за сигурност
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    // Извличане на нивата на RPG способностите от rpg_system.js
    const tacticsLevel = (hero.skills && hero.skills.tactics) || 0;
    const enduranceLevel = (hero.skills && hero.skills.endurance) || 0;
    const vampirismLevel = (hero.skills && hero.skills.vampirism) || 0;

    // 2. СИНХРОНИЗАЦИЯ С ЕКИПИРАНИ ПРЕДМЕТИ (АРТЕФАКТИ)
    let artifactBonusPower = 0;
    if (window.equippedItems && window.equippedItems.length > 0) {
        window.equippedItems.forEach(item => {
            if (item && item.bonus && item.bonus.heroPower) {
                artifactBonusPower += item.bonus.heroPower * 5;
            }
        });
    }

    // 3. ПРИЛАГАНЕ НА РОДОВИ БОНУСИ И ТАКТИКА
    let dynastyPowerBonus = window.getPerkValue ? window.getPerkValue('power') : 1.0;
    if (hero.dynasty === "Скити") dynastyPowerBonus *= 1.1; 
    if (hero.dynasty === "Македони") dynastyPowerBonus *= 1.05;

    // Модификатор от RPG умение "Военна Тактика" (+8% мощ на ниво)
    const tacticsModifier = 1 + (tacticsLevel * 0.08);

    const playerArmySize = hero.armySize || hero.currentArmy || 100;
    const playerStr = (((playerArmySize + (hero.heroPower * 2)) + artifactBonusPower) * dynastyPowerBonus) * tacticsModifier;
    const enemyStr = eArmy;

    if (playerStr >= enemyStr) {
        // --- ПОБЕДА ---
        const loot = Math.floor(eArmy * 0.5);
        hero.gold += loot;
        
        // Изчисляване на натрупания опит (XP) на база трудността на победения враг
        const xpGained = Math.floor(100 * (eArmy / (playerArmySize || 1)));
        
        if (window.conquerRegion) {
            window.conquerRegion(eRegion);
        } else {
            if (!window.playerRegions) window.playerRegions = [];
            let flat = window.playerRegions.flat();
            if (!flat.includes(eRegion)) {
                flat.push(eRegion);
                window.playerRegions = flat;
            }
        }

        let victoryText = `
            <div style="color: #4CAF50; font-weight: bold; font-size: 1.1em; margin-bottom: 10px; text-transform: uppercase;"> ⚔️ ВЕЛИКА ПОБЕДА! ⚔️</div>
            <p style="margin: 5px 0;">Врагът <b style="color:#fff;">${eName}</b> беше напълно разбит при <b style="color:#d4af37;">${eRegion}</b>!</p>
            <p style="margin: 5px 0; color: #ffd700;">Спечелена плячка: <b>+${loot}</b> 💰</p>
            <p style="margin: 5px 0; color: #4af;"> Спечелен опит: <b>+${xpGained} XP</b> ✨</p>
        `;
        
        if (artifactBonusPower > 0) {
            victoryText += `<p style="color: #e5c158; font-size: 0.85em; font-style: italic; margin-top: 10px;">🛡️ Екипираните реликви осигуриха допълнителни +${artifactBonusPower} точки мощ в боя!</p>`;
        }
        
        details.innerHTML = victoryText;
        
        // Даване на XP чрез RPG ядрото
        if (window.gainHeroXP) window.gainHeroXP(hero, xpGained);

    } else {
        // --- ПОРАЖЕНИЕ ---
        // Базови загуби от 35%, намаляващи с 3% за всяко ниво на "Издръжливост" (минимално 10% загуби)
        const lossReduction = enduranceLevel * 0.03;
        const lossPercent = Math.max(0.10, 0.35 - lossReduction);
        
        let losses = Math.floor(playerArmySize * lossPercent);
        let vampirismHeal = 0;

        // Механика Вампиризъм: Възстановява 5% от загубените воини на ниво от падналия враг
        if (vampirismLevel > 0) {
            vampirismHeal = Math.floor(losses * (vampirismLevel * 0.05));
            losses -= vampirismHeal;
        }

        // Нанасяне на загубите
        if (hero.armySize !== undefined) hero.armySize = Math.max(0, hero.armySize - losses);
        if (hero.currentArmy !== undefined) hero.currentArmy = Math.max(0, hero.currentArmy - losses);

        // Малък утешителен опит
        const xpGained = 25;

        let defeatText = `
            <div style="color: #ff4d4d; font-weight: bold; font-size: 1.1em; margin-bottom: 10px; text-transform: uppercase;">❌ ТЕЖКО ПОРАЖЕНИЕ ❌</div>
            <p style="margin: 5px 0;">Вашите воини бяха принудени да отстъпят пред численото превъзходство на <b style="color:#fff;">${eName}</b>.</p>
            <p style="margin: 5px 0; color: #ff8888;">Загуби на бойното поле: <b>-${losses}</b> воини 🏹</p>
        `;

        if (vampirismHeal > 0) {
            defeatText += `<p style="color: #cc0000; font-size: 0.9em; font-style: italic;">🩸 Вампиризмът съживи обратно ${vampirismHeal} от падналите ви бойци чрез кръвта на врага!</p>`;
        }

        // РИСК ОТ МИТИЧНА СМЪРТ: Ако армията падне под 5 воини, безсмъртният владетел губи физическата си форма
        const currentCheckArmy = hero.armySize !== undefined ? hero.armySize : (hero.currentArmy || 0);
        if (currentCheckArmy <= 5) {
            hero.isDead = true;
            defeatText += `
                <div style="margin-top: 15px; padding: 10px; border: 1px solid #ff0000; background: rgba(255,0,0,0.15); color: #ff9999; font-weight: bold;">
                    💀 КАТАСТРОФА: Вашата армия бе заличена! Физическата форма на Владетеля бе покосена. Неговата безсмъртна душа бе изпратена в отвъдното, докато не извършите Ритуал за Възкресяване!
                </div>
            `;
        } else {
            defeatText += `<p style="margin: 5px 0; color: #4af;">Придобита тактическа опитност: <b>+${xpGained} XP</b></p>`;
        }

        details.innerHTML = defeatText;
        
        if (window.gainHeroXP && !hero.isDead) window.gainHeroXP(hero, xpGained);
    }

    controls.innerHTML = `
        <button onclick="document.getElementById('battle-screen').style.display='none'" 
                style="background: #111; color: #d4af37; border: 1px solid #d4af37; padding: 10px 30px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.1)'" onmouseout="this.style.background='#111'">ПРОДЪЛЖИ</button>
    `;

    // Синхронизация на променените стойности с глобалния обект на рода
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
        window.worldData.clans[hero.dynasty].armySize = hero.armySize !== undefined ? hero.armySize : hero.currentArmy;
        window.worldData.clans[hero.dynasty].gold = hero.gold;
    }

    // Незабавно опресняване на графичния интерфейс
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
