/**
 * МОДУЛ: БИТКИ И ВОЕННИ ЩУРМОВЕ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (ИНТЕГРАЦИЯ НА DIABLO СПОСОБНОСТИ & БОНУСИ ОТ ДОМАШНИ ЛЮБИМЦИ)
 * КОРЕКЦИЯ: Щетите, критичните удари и защитата четат пасивите и любимците в реално време.
 * Статистика на файловете в проекта: 17
 */

window.startBattle = function(targetRegion) {
    if (!targetRegion) {
        targetRegion = {
            id: "unknown_region_" + Math.floor(Math.random() * 1000),
            name: "Гранични Земи",
            armySize: Math.floor(Math.random() * 120) + 40,
            defenseLevel: 2,
            difficulty: 20
        };
    }

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
        battleScreen.className = 'fullscreen-overlay';
        document.body.appendChild(battleScreen);
    }

    battleScreen.style.display = 'flex';
    battleScreen.innerHTML = `
        <div class="battle-box text-center" style="background: rgba(10, 10, 10, 0.95); border: 2px solid #d4af37; padding: 25px; border-radius: 8px; max-width: 500px; width: 90%;">
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 15px;">ВОЕНЕН ЩУРМ</h2>
            <p style="font-size: 14px; color: #aaa;">Твоята войска марширува към регион <b style="color:#fff;">"${targetRegion.name}"</b>!</p>
            
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #222; text-align: left;">
                <div style="color: #ffd700; font-weight: bold; margin-bottom: 5px; font-size: 13px;">⚔️ СЪОТНОШЕНИЕ НА СИЛИТЕ:</div>
                <div style="font-size: 12px; margin-bottom: 4px;">Твоята армия: <span id="battle-player-army" style="color:#00ffcc; font-weight:bold;">0</span> бойци</div>
                <div style="font-size: 12px;">Вражи гарнизон: <span style="color:#ff3366; font-weight:bold;">${targetRegion.armySize}</span> защитници</div>
            </div>

            <div id="battle-log" style="height: 120px; overflow-y: auto; background: #000; padding: 10px; border-radius: 4px; font-size: 11px; text-align: left; color: #00ff00; font-family: monospace; border: 1px solid #333; margin-bottom: 15px;">
                [Летопис]: Разузнавачите докладват за готовност...<br>
            </div>

            <button id="btn-execute-assault" class="action-btn" style="width: 100%; padding: 12px; font-weight: bold;" onclick="window.executeAssaultRound('${targetRegion.id}')">ВЛЕЗ В БИТКА</button>
        </div>
    `;

    const playerArmySpan = document.getElementById('battle-player-army');
    if (playerArmySpan && window.currentHero) {
        playerArmySpan.innerText = window.currentHero.currentArmy || 0;
    }
};

window.executeAssaultRound = function(regionId) {
    if (!window.currentHero || !window.worldData || !window.worldData.regions || !window.worldData.regions[regionId]) {
        window.closeBattleAndRefresh();
        return;
    }

    const hero = window.currentHero;
    const region = window.worldData.regions[regionId];
    const log = document.getElementById('battle-log');
    const btn = document.getElementById('btn-execute-assault');

    if (btn) btn.disabled = true;

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let skills = hero.skills || {};
    let pet = hero.pet || null;

    // 1. ИЗЧИСЛЯВАНЕ НА МОЩТА НА АТАКАТА (С ПАСИВИ И ЛЮБИМЦИ)
    let playerPower = (hero.currentArmy || 0) + (hero.heroPower || 100);
    
    // Способност: Военна Тактика (tactics)
    if ((skills.tactics || 0) > 0) {
        playerPower += (skills.tactics * 40);
    }

    // Любимец: Родов Сокол (+15% обща сила при щурм)
    if (pet === "falcon") {
        playerPower = Math.floor(playerPower * 1.15);
    }

    // Изчисляване на шанс за Критичен Смазващ Удар
    let critChance = (skills.heavyStrike || 0) * 0.05; // 5% на точка
    if (pet === "wolf") critChance += 0.10; // +10% от Вълк

    let isCrit = Math.random() < critChance;
    if (isCrit) {
        playerPower *= 2; // Брутални 200% щети
    }

    // Способност: Засада (ambush)
    if ((skills.ambush || 0) > 0 && Math.random() < 0.35) {
        playerPower += 150;
        if (log) log.innerHTML += `<span style="color:#ffd700;">[ЗАСАДА]: Твоите конници изненадаха врага в гръб! (+150 сила)</span><br>`;
    }

    // 2. ИЗЧИСЛЯВАНЕ НА МОЩТА НА ЗАЩИТАТА НА ВРАГА
    let enemyDefense = region.armySize * (1 + (region.defenseLevel || 1) * 0.2);
    
    // Любимец: Усойница (намалява защитата на врага с 5%)
    if (pet === "viper") {
        enemyDefense = Math.floor(enemyDefense * 0.95);
    }

    // 3. СЛУЧАЙНИ КОРЕКЦИИ (ДИНАМИКА НА СИМУЛАЦИЯТА)
    playerPower *= (Math.random() * 0.4 + 0.8);
    enemyDefense *= (Math.random() * 0.4 + 0.8);

    // 4. ОПРЕДЕЛЯНЕ НА СЪДБАТА НА БИТКАТА
    let victory = playerPower >= enemyDefense;

    // Изчисляване на загубите за играча
    let lossPercent = victory ? 0.25 : 0.60;
    
    // Модификатори за намаляване на загубите: Издръжливост (endurance) и Стена от щитове (shieldWall)
    let defenseDiscount = (skills.endurance || 0) * 0.05; // 5% на точка
    if ((skills.shieldWall || 0) > 0) defenseDiscount += 0.08;
    if (pet === "stallion") defenseDiscount += 0.15; // Степен Жребец
    if (pet === "bear") defenseDiscount += 0.20; // Мечка за защита

    lossPercent = Math.max(0.05, lossPercent - defenseDiscount);
    let playerLosses = Math.floor((hero.currentArmy || 0) * lossPercent);

    hero.currentArmy -= playerLosses;
    if (hero.currentArmy < 0) hero.currentArmy = 0;

    if (log) {
        if (isCrit) {
            log.innerHTML += `<span style="color:#ffcc00; font-weight:bold;">💥 СМАЗВАЩ УДАР! Нанесени са 200% критични щети!</span><br>`;
        }
        log.innerHTML += `Твоите сили дадоха ${playerLosses} свидни жертви.<br>`;
    }

    setTimeout(() => {
        if (victory) {
            region.armySize = 0; // Премахване на гарнизона
            
            // Завладяване на региона
            if (!window.playerRegions) window.playerRegions = [];
            const ownedRegionsFlat = window.playerRegions.flat();
            if (!ownedRegionsFlat.includes(region.name)) {
                window.playerRegions.push(region.name);
            }

            // Награда опит чрез официалната gainHeroXP система (Уважава Auto/Manual)
            let xpGained = 120;
            if (window.gainHeroXP) window.gainHeroXP(hero, xpGained);

            if (log) log.innerHTML += `<span style="color:#00ff00; font-weight:bold;">🎉 ТРИУМФ! Регионът бе превзет! Натрупан опит: +${xpGained} XP.</span><br>`;
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`⚔️ ПОБЕДА: Кан ${hero.name} завладя регион "${region.name}" и донесе вечна слава на рода си!`);
            }
        } else {
            // Врагът губи част от силите си
            region.armySize = Math.floor(region.armySize * 0.6);
            if (region.armySize < 5) region.armySize = 5;

            if (log) log.innerHTML += `<span style="color:#ff3366; font-weight:bold;">❌ ОТСТЪПЛЕНИЕ! Вражеската отбрана удържа щитовете си.</span><br>`;
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`📉 ЩУРМЪТ СЕ ПРОВАЛИ: Армията на род ${hero.dynasty} бе отблъсната при "${region.name}". Войската се прегрупира.`);
            }
        }

        // Обновяване на състоянието на лидера в глобалния списък на клановете
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
            const cData = window.worldData.clans[hero.dynasty];
            cData.currentArmy = hero.currentArmy;
            cData.armySize = hero.currentArmy;
        }

        // Синхронизация на извънредните лидери
        if (window.syncAllLeadersData) window.syncAllLeadersData();

        // Промяна на бутона за изход
        if (btn) {
            btn.disabled = false;
            btn.innerText = "ЗАТВОРИ ИЗГЛЕДА";
            btn.onclick = window.closeBattleAndRefresh;
        }
    }, 1200);
};

window.syncAllLeadersData = function() {
    if (!window.worldData || !window.worldData.clans) return;
    Object.entries(window.worldData.clans).forEach(([clanKey, clan]) => {
        if (window.currentHero && clanKey === window.currentHero.dynasty) {
            clan.currentArmy = window.currentHero.currentArmy;
            clan.level = window.currentHero.level;
            clan.xp = window.currentHero.xp;
            clan.storedXP = window.currentHero.storedXP;
            clan.skillPoints = window.currentHero.skillPoints;
            clan.currentClass = window.currentHero.currentClass;
            clan.pet = window.currentHero.pet;
        }
    });
};

window.closeBattleAndRefresh = function() {
    const screen = document.getElementById('battle-screen');
    if (screen) screen.style.display = 'none';

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI && window.currentHero) window.updateCharacterUI(window.currentHero);
    if (window.openRegionsMap && document.getElementById('regions-screen')) {
        window.openRegionsMap();
    }
};
