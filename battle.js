/**
 * МОДУЛ: БИТКИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Интеграция на 100+ Diablo Способности, ArcheAge Класове & Прогрес на лидери)
 * КОРЕКЦИЯ БЪГ: Интегрирана е автоматична система за раздаване на пасивен опит и нива на всички купени лидери при битка.
 * Статистика на файловете в проекта: 16
 */

window.startBattle = function(targetRegion) {
    // ЗАЩИТА: Ако обектът targetRegion е undefined или липсва, изграждаме безопасен временен обект
    if (!targetRegion) {
        targetRegion = {
            id: "unknown_region_\" + Math.floor(Math.random() * 1000)",
            name: "Гранични Земи",
            armySize: Math.floor(Math.random() * 120) + 40,
            defenseLevel: 2,
            difficulty: 20
        };
    }

    // Проверка дали текущият владетел не е убит и чака възкресяване
    if (window.currentHero && window.currentHero.isDead) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🔮 ${window.currentHero.name} е в отвъдното! Извършете Ритуал за Възкресяване, преди да водите битки!`);
        }
        return;
    }

    // =========================================================================
    // 🎯 АВТОМАТИЧЕН RPG ПРОГРЕС НА ВСИЧКИ КУПЕНИ/ОТКЛЮЧЕНИ ЛИДЕРИ ПРИ БИТКА
    // =========================================================================
    if (window.worldData && window.worldData.clans) {
        const hero = window.currentHero;
        const clans = window.worldData.clans;

        Object.keys(clans).forEach(key => {
            let leader = clans[key];

            // Филтрираме обектите на лидерите в clans (като r_tervel и други с наличен прогрес)
            if (leader && leader.id && (key.startsWith('r_') || leader.xp !== undefined)) {
                // Опит получават лидери от нашия род, изрично отключени или служебни активни като Тервел
                if (leader.dynasty === hero.dynasty || leader.isUnlocked || key === 'r_tervel') {
                    
                    let xpGained = Math.floor(Math.random() * 20) + 20; // 20-40 XP от бойна тактика
                    leader.xp = (leader.xp || 0) + xpGained;
                    
                    let currentLevel = leader.level || 1;
                    let requiredXP = currentLevel * 150; // Формула: ниво * 150 XP

                    // Логика за изкачване на ниво (Level Up)
                    if (leader.xp >= requiredXP) {
                        leader.xp -= requiredXP;
                        leader.level = currentLevel + 1;
                        leader.skillPoints = (leader.skillPoints || 0) + 1;

                        // Автоматично наливане на точки в магии и атрибути от rpg_system.js
                        if (window.autoAssignLeaderSkills) {
                            window.autoAssignLeaderSkills(leader);
                        }

                        if (window.showAdvisorMsg) {
                            window.showAdvisorMsg(`⚔️ БОЕН ПРОГРЕС: Лидер ${leader.name} от род ${leader.dynasty} достигна Ниво ${leader.level}!`);
                        }
                    }
                }
            }
        });

        // Моментално обновяване на интерфейсите, за да се види новият опит веднага в Топ 6 картите
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updateCharacterUI && hero) window.updateCharacterUI(hero);
    }

    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        battleScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.95); z-index: 25000; display: flex;
            align-items: center; justify-content: center; color: white; font-family: 'Georgia', serif;
            box-sizing: border-box; padding: 20px;
        `;
        document.body.appendChild(battleScreen);
    }

    battleScreen.style.display = 'flex';
    battleScreen.innerHTML = `
        <div style="width: 100%; max-width: 800px; background: #050505; border: 2px solid #d4af37; padding: 25px; border-radius: 5px; box-shadow: 0 0 30px rgba(214,175,55,0.2); max-height: 90vh; overflow-y: auto;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 15px; text-transform: uppercase; letter-spacing: 2px; font-size: 1.4em;">⚔️ ВОЕНЕН СБЛЪСЪК: ${targetRegion.name} ⚔️</h2>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px; gap: 15px;">
                <div style="flex: 1; background: rgba(214,175,55,0.05); border: 1px solid #d4af37; padding: 15px; text-align: center; border-radius: 4px;">
                    <h3 style="color: #ffd700; margin-top: 0; font-size: 1em; text-transform: uppercase;">Вашата Армия</h3>
                    <div style="font-size: 1.8em; font-weight: bold; margin: 10px 0; color: #fff;">${window.currentHero.currentArmy || 0} 👤</div>
                    <span style="font-size: 0.8em; color: #aaa;">Бойна Мощ: ${window.currentHero.heroPower || 100}</span>
                </div>
                
                <div style="flex: 1; background: rgba(255,68,68,0.05); border: 1px solid #ff4444; padding: 15px; text-align: center; border-radius: 4px;">
                    <h3 style="color: #ff4444; margin-top: 0; font-size: 1em; text-transform: uppercase;">Противник</h3>
                    <div style="font-size: 1.8em; font-weight: bold; margin: 10px 0; color: #fff;">${targetRegion.armySize || 50} 👤</div>
                    <span style="font-size: 0.8em; color: #aaa;">Ниво на Отбрана: ${targetRegion.defenseLevel || 1}</span>
                </div>
            </div>

            <div id="battle-log-details" style="margin-top: 20px; background: #111; border: 1px solid #222; padding: 15px; min-height: 150px; max-height: 250px; overflow-y: auto; font-family: monospace; font-size: 0.85em; color: #ccc; line-height: 1.5;">
                <p style="color: #888; text-align: center;">... Нареждате бойните редици и призовавате силата на Тангра ...</p>
            </div>

            <div id="battle-controls" style="margin-top: 25px; display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.resolveBattleSimulation(${JSON.stringify(targetRegion).replace(/"/g, '&quot;')})" 
                        style="background: #7b1a1a; color: white; border: 1px solid #ff4444; padding: 12px 35px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; font-size: 0.9em; width: 100%;">ВЛЕЗ В СРАЖЕНИЕ</button>
            </div>
        </div>
    `;
};

/**
 * ИЗЧИСЛЯВАНЕ И СИМУЛАЦИЯ НА РЕЗУЛТАТА ОТ БИТКАТА
 */
window.resolveBattleSimulation = function(targetRegion) {
    const details = document.getElementById('battle-log-details');
    const controls = document.getElementById('battle-controls');
    if (!details || !controls) return;

    const hero = window.currentHero;
    let playerArmy = hero.currentArmy || 0;
    let enemyArmy = targetRegion.armySize || 0;

    details.innerHTML = "";
    let log = `<p style="color: #ffd700; font-weight: bold;">[НАЧАЛО] Тръбите възвещават атака! Войските се сблъскват!</p>`;

    // Влияние на уменията (Tactics увеличи мощта)
    let tacticsBonus = (hero.skills && hero.skills.tactics || 0) * 5;
    let playerRoll = (hero.heroPower || 100) + tacticsBonus + Math.floor(Math.random() * 50);
    let enemyRoll = (targetRegion.defenseLevel * 40) + Math.floor(Math.random() * 50);

    log += `<p>⚔️ Вашата тактическа оценка на терена: <b>${playerRoll}</b> точки мощ.</p>`;
    log += `<p>🛡️ Противникова отбранителна готовност: <b>${enemyRoll}</b> точки мощ.</p>`;

    let playerLosses = 0;
    let enemyLosses = 0;

    if (playerRoll >= enemyRoll) {
        // Успешна победа
        playerLosses = Math.floor(playerArmy * (Math.random() * 0.2)); // 0-20% загуби
        enemyLosses = enemyArmy; // Пълно заличаване на врага
        
        hero.currentArmy = Math.max(0, playerArmy - playerLosses);
        hero.armySize = hero.currentArmy; 
        
        // Добавяне на завоювания регион
        if (!window.playerRegions) window.playerRegions = [];
        const ownedFlat = window.playerRegions.flat();
        if (!ownedFlat.includes(targetRegion.name)) {
            window.playerRegions.push(targetRegion.name);
        }

        // Плячка: Злато от победата
        let goldGained = Math.floor(enemyArmy * 1.5) + Math.floor(Math.random() * 100);
        hero.gold = (hero.gold || 0) + goldGained;

        log += `<p style="color: #4caf50; font-weight: bold; margin-top: 10px;">🏆 ВЕЛИКА ПОБЕДА! Вие сломихте врага и установихте контрол над регион: ${targetRegion.name}!</p>`;
        log += `<p style="margin: 5px 0;">🩸 Загуби на Вашата войска: <b>-${playerLosses}</b> воини.</p>`;
        log += `<p style="margin: 5px 0;">💰 Заграбено бойно богатство: <b>+${goldGained} злато</b>.</p>`;

        details.innerHTML = log;
    } else {
        // Поражение
        playerLosses = Math.floor(playerArmy * (Math.random() * 0.6 + 0.2)); // 20-80% загуби
        enemyLosses = Math.floor(enemyArmy * (Math.random() * 0.3));

        hero.currentArmy = Math.max(0, playerArmy - playerLosses);
        hero.armySize = hero.currentArmy;

        log += `<p style="color: #ff4444; font-weight: bold; margin-top: 10px;">❌ ОТСТЪПЛЕНИЕ! Врагът удържа позициите си чрез свирепа съпротива!</p>`;
        log += `<p style="margin: 5px 0;">🩸 Загуби на Вашата войска: <b>-${playerLosses}</b> воини.</p>`;

        // Проверка за фатално събитие според здравето на лидера
        if (hero.currentArmy <= 0) {
            hero.isDead = true;
            hero.slainByGod = true;
            log += `
                <div style="margin-top: 10px; padding: 8px; background: rgba(255,0,0,0.15); border: 1px solid #ff0000; color: #ff9999; font-weight: bold;">
                    💀 КАТАСТРОФА: Вашата армия бе заличена! Душата на Владетеля премина в отвъдното до извършване на Ритуал!
                </div>
            `;
        }
        details.innerHTML = log;
    }

    // Придобиване на личен опит за Кана (вика функцията от rpg_system.js с пълна родова защита)
    if (window.gainHeroXP && !hero.isDead) {
        let mainHeroXp = playerRoll >= enemyRoll ? 100 : 40;
        window.gainHeroXP(hero, mainHeroXp);
    }

    // Промяна на бутона за затваряне
    controls.innerHTML = `
        <button onclick="window.closeBattleAndRefresh()" 
                style="background: #111; color: #d4af37; border: 1px solid #d4af37; padding: 12px 30px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; width: 100%;">ПРОДЪЛЖИ СЪДБАТА СИ</button>
    `;

    // Синхронизация на променените показатели с базата данни на клановете в worldData
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.id]) {
        window.worldData.clans[hero.id].armySize = hero.armySize;
        window.worldData.clans[hero.id].currentArmy = hero.currentArmy;
        window.worldData.clans[hero.id].gold = hero.gold;
        window.worldData.clans[hero.id].isDead = hero.isDead;
    }
};

/**
 * ЧИСТО ЗАТВАРЯНЕ НА БОЙНИЯ ЕКРАН И ОБНОВЯВАНЕ НА ИГРАТА
 */
window.closeBattleAndRefresh = function() {
    const screen = document.getElementById('battle-screen');
    if (screen) screen.style.display = 'none';

    // Пълно преначертаване на UI таблата
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI && window.currentHero) window.updateCharacterUI(window.currentHero);
};
