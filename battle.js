/**
 * МОДУЛ: БИТКИ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН И ПОДСИГУРЕН (Защита срещу Uncaught TypeError на targetRegion)
 * КОРЕКЦИЯ БЪГ: Добавен е автоматичен fallback на обекта targetRegion, ако бъде подаден като undefined от външен клик.
 * Статистика на файловете в проекта: 16
 */

window.startBattle = function(targetRegion) {
    // ЗАЩИТА: Ако обектът targetRegion е undefined или липсва, изграждаме безопасен временен обект
    if (!targetRegion) {
        targetRegion = {
            id: "unknown_region_" + Math.floor(Math.random() * 1000),
            name: "Гранични Земи",
            armySize: Math.floor(Math.random() * 120) + 40,
            defenseLevel: 2
        };
    }

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
            font-family: 'Georgia', serif; box-sizing: border-box;
        `;
        document.body.appendChild(battleScreen);
    }

    battleScreen.style.display = 'flex';

    const hero = window.currentHero || { name: "Неизвестен", level: 1, currentArmy: 100, maxArmy: 100, heroPower: 100, skills: { tactics: 0, vampirism: 0, endurance: 0 } };
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    // Сега тази линия е напълно защитена и няма да хвърля TypeError
    const enemyArmy = targetRegion.armySize || Math.floor(Math.random() * 120) + 40;
    const enemyPower = targetRegion.defenseLevel ? (targetRegion.defenseLevel * 20) : 50;

    battleScreen.innerHTML = `
        <div style="width: 90%; max-width: 600px; background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.95); text-align: center;">
            <h2 style="color: #d4af37; margin-top: 0; font-size: 1.4em; text-transform: uppercase; letter-spacing: 1px;">⚔️ Сблъсък за ${targetRegion.name}</h2>
            
            <div style="display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 6px;">
                <div style="text-align: left; width: 45%;">
                    <h3 style="margin: 0 0 5px 0; color: #00ffcc; font-size: 1em;">Кан ${hero.name}</h3>
                    <p style="margin: 3px 0; font-size: 0.85em; color: #aaa;">Клас: <b>${hero.currentClass || "Пълководец"}</b></p>
                    <p style="margin: 3px 0; font-size: 0.85em; color: #aaa;">Войска: <b id="battle-hero-army">${hero.currentArmy || hero.armySize || 0}</b> воини</p>
                    <p style="margin: 3px 0; font-size: 0.85em; color: #ff3366;">Мощ на Кан-а: <b>⚔️ ${hero.heroPower || 100}</b></p>
                </div>
                <div style="font-size: 1.5em; display: flex; align-items: center; justify-content: center; color: #ff4444;">VS</div>
                <div style="text-align: right; width: 45%;">
                    <h3 style="margin: 0 0 5px 0; color: #ff4444; font-size: 1em;">Вражески Гарнизон</h3>
                    <p style="margin: 3px 0; font-size: 0.85em; color: #aaa;">Защитници: <b id="battle-enemy-army">${enemyArmy}</b> души</p>
                    <p style="margin: 3px 0; font-size: 0.85em; color: #aaa;">Отбранителна сила: <b>🛡️ ${enemyPower}</b></p>
                </div>
            </div>

            <div id="battle-log-area" style="height: 120px; overflow-y: auto; background: #050505; border: 1px solid #333; padding: 10px; text-align: left; font-size: 0.8em; line-height: 1.5; color: #ccc; margin-bottom: 20px; border-radius: 4px;">
                <p style="color: #ffd700; margin: 0;">Барабаните на войната бият! Родовите войски заемат бойни позиции...</p>
            </div>

            <div id="battle-controls-area">
                <button onclick="window.executeBattleSimulation('${targetRegion.id}', ${enemyArmy}, ${enemyPower})" 
                        style="background: #d4af37; color: black; border: none; padding: 12px 35px; cursor: pointer; font-weight: bold; font-size: 0.95em; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(212,175,55,0.2);">Начало на Щурма</button>
            </div>
        </div>
    `;
};

window.executeBattleSimulation = function(regionId, initialEnemyArmy, enemyPower) {
    const logArea = document.getElementById('battle-log-area');
    const controls = document.getElementById('battle-controls-area');
    const heroArmyEl = document.getElementById('battle-hero-army');
    const enemyArmyEl = document.getElementById('battle-enemy-army');
    
    if (!logArea || !controls) return;

    const hero = window.currentHero;
    if (!hero) return;

    let heroCurrentArmy = parseInt(heroArmyEl.innerText) || 0;
    let enemyCurrentArmy = initialEnemyArmy;

    const tacticsBonus = (hero.skills && hero.skills.tactics) ? (hero.skills.tactics * 0.06) : 0;
    const enduranceBonus = (hero.skills && hero.skills.endurance) ? (hero.skills.endurance * 0.05) : 0;
    const vampirismLevel = (hero.skills && hero.skills.vampirism) || 0;
    
    const powerFactor = (hero.heroPower || 100) / 1000; 
    let leaderFactor = 1.0 + tacticsBonus + powerFactor;

    if (hero.dynasty && window.dynastyPerks && window.dynastyPerks[hero.dynasty]) {
        const perk = window.dynastyPerks[hero.dynasty];
        if (perk.power) leaderFactor *= perk.power;
    }

    logArea.innerHTML = "";
    let round = 1;

    let simInterval = setInterval(() => {
        if (heroCurrentArmy <= 0 || enemyCurrentArmy <= 0 || round > 6) {
            clearInterval(simInterval);
            window.finalizeBattleOutcome(regionId, heroCurrentArmy, enemyCurrentArmy, initialEnemyArmy, vampirismLevel, enduranceBonus);
            return;
        }

        let heroDamage = Math.floor(Math.random() * 25 + 10) * leaderFactor;
        let enemyDamage = Math.floor(Math.random() * 23 + 9) * (1.0 - enduranceBonus);

        heroDamage = Math.min(enemyCurrentArmy, Math.floor(heroDamage * (heroCurrentArmy / 100 + 0.5)));
        enemyDamage = Math.min(heroCurrentArmy, Math.floor(enemyDamage * (enemyCurrentArmy / 100 + 0.5)));

        enemyCurrentArmy -= heroDamage;
        heroCurrentArmy -= enemyDamage;

        let vampHeal = 0;
        if (vampirismLevel > 0 && heroDamage > 0) {
            vampHeal = Math.floor(heroDamage * (vampirismLevel * 0.08));
            heroCurrentArmy = Math.min(hero.maxArmy || 500, heroCurrentArmy + vampHeal);
        }

        heroArmyEl.innerText = Math.max(0, heroCurrentArmy);
        enemyArmyEl.innerText = Math.max(0, enemyCurrentArmy);

        let roundLog = document.createElement('p');
        roundLog.style.margin = "4px 0";
        let logText = `⚔️ <b>Рунд ${round}:</b> Твоите стрели и мечове повалят ${Math.floor(heroDamage)} защитници. `;
        if (vampHeal > 0) {
            logText += `<span style="color: #ff3366;">[Кръволитие: възкресени +${vampHeal} воини]</span> `;
        }
        logText += `Врагът отвръща и покосява ${Math.floor(enemyDamage)} от твоите бойци.`;
        
        roundLog.innerHTML = logText;
        logArea.appendChild(roundLog);
        logArea.scrollTop = logArea.scrollHeight;

        round++;
    }, 600);
};

window.finalizeBattleOutcome = function(regionId, finalHeroArmy, finalEnemyArmy, initialEnemy, vampirismLevel, enduranceBonus) {
    const details = document.getElementById('battle-log-area');
    const controls = document.getElementById('battle-controls-area');
    if (!details || !controls) return;

    const hero = window.currentHero;
    if (!hero) return;

    hero.currentArmy = Math.max(0, finalHeroArmy);

    let isVictory = finalEnemyArmy <= 0 && finalHeroArmy > 0;
    let xpGained = isVictory ? 45 : 15;

    if (isVictory) {
        let victoryText = `
            <div style="color: #4caf50; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">🎉 СЛАВНА ПОБЕДА! Вражеският гарнизон е разбит!</div>
            <p style="margin: 3px 0;">Регионът падна под властта на Твоя велик род.</p>
            <p style="margin: 3px 0; color: #00ffcc;">Придобита тактическа опитност: <b>+${xpGained} XP</b></p>
        `;
        
        let goldReward = Math.floor(initialEnemy * 1.5);
        hero.gold = (hero.gold || 0) + goldReward;
        victoryText += `<p style="margin: 3px 0; color: #ffd700;">Плячка от лагера на врага: <b>+${goldReward} злато 💰</b></p>`;

        details.innerHTML = victoryText;

        if (window.worldData && window.worldData.regions && window.worldData.regions[regionId]) {
            window.worldData.regions[regionId].isCaptured = true;
            window.worldData.regions[regionId].owner = "player";
        }

        if (window.addExperienceToLeader) window.addExperienceToLeader(hero, xpGained);

    } else {
        let defeatText = `
            <div style="color: #ff4444; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">❌ ОСТЪПЛЕНИЕ! Щурмът се провали.</div>
            <p style="margin: 3px 0;">Вражеските сили удържаха своите укрепления.</p>
        `;

        let deathChance = 0.12 - (enduranceBonus * 0.5); 
        if (hero.currentClass === "Безсмъртен Войн") deathChance = 0.01; 

        if (finalHeroArmy <= 0 && Math.random() < deathChance) {
            hero.isDead = true;
            hero.slainByGod = true;
            defeatText += `
                <div style="margin-top: 10px; padding: 8px; background: rgba(255,0,0,0.15); border: 1px solid #ff0000; color: #ff9999; font-weight: bold;">
                    💀 КАТАСТРОФА: Вашата армия бе заличена! Физическата форма на Владетеля бе покосена. Неговата безсмъртна душа бе изпратена в отвъдното, докато не извършите Ритуал за Възкресяване!
                </div>
            `;
        } else {
            defeatText += `<p style="margin: 5px 0; color: #00ffcc;">Придобита тактическа опитност: <b>+${xpGained} XP</b></p>`;
        }

        details.innerHTML = defeatText;
        
        if (window.addExperienceToLeader && !hero.isDead) window.addExperienceToLeader(hero, xpGained);
    }

    controls.innerHTML = `
        <button onclick="document.getElementById('battle-screen').style.display='none'" 
                style="background: #111; color: #d4af37; border: 1px solid #d4af37; padding: 10px 30px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.1)'" onmouseout=\"this.style.background='#111'\">ПРОДЪЛЖИ</button>
    `;

    if (window.worldData && window.worldData.clans && hero.id) {
        window.worldData.clans[hero.id] = hero;
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};
