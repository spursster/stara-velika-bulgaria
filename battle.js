/**
 * МОДУЛ: БИТКИ И ВОЕННИ ЩУРМОВЕ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (ВИЗУАЛНА АРЕНА С АНИМАЦИИ, PROGRESS BARS И ЕФЕКТИ)
 * КОРЕКЦИЯ: Добавени са динамични ленти на живота, анимация на сблъсък и изскачащи критични щети.
 * Статистика на файловете в проекта: 15
 */

window.startBattle = function(targetRegion) {
    if (!targetRegion && window.currentSelectedRegion) {
        targetRegion = window.currentSelectedRegion;
    }
    if (!targetRegion || typeof targetRegion === 'string') {
        targetRegion = {
            id: "unknown_region_" + Math.floor(Math.random() * 1000),
            name: typeof targetRegion === 'string' ? targetRegion : "Гранични Земи",
            armySize: Math.floor(Math.random() * 500) + 150,
            defenseLevel: 3,
            difficulty: 35
        };
    }

    let availableLeaders = [];
    if (window.worldData && window.worldData.clans) {
        availableLeaders = Object.entries(window.worldData.clans).map(([key, clan]) => {
            return {
                clanKey: key,
                name: clan.leaderName || key,
                dynasty: key,
                currentArmy: clan.armySize || clan.currentArmy || 0,
                heroPower: clan.heroPower || 100,
                skills: clan.skills || {},
                pet: clan.pet || null,
                level: clan.level || 1
            };
        });
    } else if (window.currentHero) {
        availableLeaders.push(window.currentHero);
    }

    availableLeaders.sort((a, b) => b.currentArmy - a.currentArmy);
    let battleGroup = availableLeaders.filter(l => l.currentArmy > 0).slice(0, 50);

    if (battleGroup.length === 0) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔮 Всички твои воеводи са без войска! Собери армия в казармите преди щурм!");
        }
        return;
    }

    let totalPlayerArmy = battleGroup.reduce((sum, h) => sum + h.currentArmy, 0);

    window.currentBattleState = {
        region: targetRegion,
        group: battleGroup,
        enemyArmy: targetRegion.armySize,
        initialEnemyArmy: targetRegion.armySize,
        initialPlayerArmy: totalPlayerArmy,
        round: 1,
        logHistory: []
    };

    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        document.body.appendChild(battleScreen);
    }

    battleScreen.className = 'fullscreen-overlay';
    battleScreen.style.position = 'fixed';
    battleScreen.style.top = '0';
    battleScreen.style.left = '0';
    battleScreen.style.width = '100vw';
    battleScreen.style.height = '100vh';
    battleScreen.style.backgroundColor = '#050505';
    battleScreen.style.zIndex = '99999';
    battleScreen.style.display = 'flex';
    battleScreen.style.justifyContent = 'center';
    battleScreen.style.alignItems = 'center';
    battleScreen.style.overflow = 'hidden';

    // Вграждаме анимационните стилове директно, за да не пипаме style.css
    if (!document.getElementById('battle-effects-style')) {
        const style = document.createElement('style');
        style.id = 'battle-effects-style';
        style.innerHTML = `
            @keyframes shake {
                0% { transform: translate(1px, 1px) rotate(0deg); }
                10% { transform: translate(-1px, -2px) rotate(-1deg); }
                20% { transform: translate(-3px, 0px) rotate(1deg); }
                30% { transform: translate(0px, 2px) rotate(0deg); }
                40% { transform: translate(1px, -1px) rotate(1deg); }
                50% { transform: translate(-1px, 2px) rotate(-1deg); }
                60% { transform: translate(-3px, 1px) rotate(0deg); }
                70% { transform: translate(2px, 1px) rotate(-1deg); }
                80% { transform: translate(-1px, -1px) rotate(1deg); }
                90% { transform: translate(2px, 2px) rotate(0deg); }
                100% { transform: translate(1px, -2px) rotate(0deg); }
            }
            @keyframes flashCrit {
                0% { background-color: rgba(212,175,55,0.6); }
                100% { background-color: transparent; }
            }
            @keyframes clashLeft {
                0% { transform: translateX(0); }
                50% { transform: translateX(40px); }
                100% { transform: translateX(0); }
            }
            @keyframes clashRight {
                0% { transform: translateX(0); }
                50% { transform: translateX(-40px); }
                100% { transform: translateX(0); }
            }
            .clash-anim-left { animation: clashLeft 0.4s ease-in-out; }
            .clash-anim-right { animation: clashRight 0.4s ease-in-out; }
            .shake-effect { animation: shake 0.4s; }
        `;
        document.head.appendChild(style);
    }

    window.renderBattleLayout();
};

window.renderBattleLayout = function() {
    const state = window.currentBattleState;
    const battleScreen = document.getElementById('battle-screen');
    if (!state || !battleScreen) return;

    let totalCurrentPlayerArmy = state.group.reduce((sum, h) => sum + h.currentArmy, 0);
    
    // Изчисляване на процентите за лентите на живота (Progress Bars)
    let playerLifeHP = Math.ceil((totalCurrentPlayerArmy / state.initialPlayerArmy) * 100);
    let enemyLifeHP = Math.ceil((state.enemyArmy / state.initialEnemyArmy) * 100);

    battleScreen.innerHTML = `
        <div id="main-battle-box" class="heroes-battle-container" style="width: 95%; height: 92%; display: flex; flex-direction: column; background: radial-gradient(circle, #151515 0%, #070707 100%); border: 3px solid #d4af37; box-shadow: 0 0 40px rgba(0,0,0,0.8); border-radius: 12px; padding: 20px; box-sizing: border-box; color: #fff; font-family: 'Cinzel', serif; transition: background 0.3s;">
            
            <div style="text-align: center; border-bottom: 1px solid #222; padding-bottom: 10px; position: relative;">
                <h1 style="color: #ffd700; margin: 0; font-size: 26px; letter-spacing: 2px; text-shadow: 0px 2px 4px rgba(0,0,0,0.8);">ВОЕНЕН ТАБОР: РУНД ${state.round}</h1>
                <p style="color: #aaa; margin: 3px 0 0 0; font-size: 13px;">Обсада на крепост: <b style="color: #fff;">"${state.region.name}"</b></p>
            </div>

            <div style="display: flex; height: 180px; margin: 20px 0; align-items: center; justify-content: space-between; background: url('https://i.imgur.com/G36T6fG.png') rgba(0,0,0,0.6); background-blend-mode: overlay; border-radius: 8px; border: 1px solid #333; padding: 0 40px; position: relative; overflow: hidden;">
                
                <div id="visual-player-army" style="text-align: center; width: 35%; transition: 0.2s;">
                    <div style="font-size: 50px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));">🛡️</div>
                    <div style="font-weight: bold; color: #00ffcc; font-size: 14px; margin-bottom: 5px;">ОБЕДИНЕНА ОРДА</div>
                    <div style="width: 100%; background: #222; height: 14px; border-radius: 7px; border: 1px solid #444; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);">
                        <div style="width: ${playerLifeHP}%; background: linear-gradient(90deg, #00aa77, #00ffcc); height: 100%; transition: width 0.4s ease;"></div>
                    </div>
                    <div style="font-size: 16px; margin-top: 5px; font-weight: bold;">${totalCurrentPlayerArmy} <span style="font-size: 11px; color:#777;">война</span></div>
                </div>

                <div id="battle-center-stage" style="width: 20%; text-align: center; font-size: 28px; font-weight: bold; color: #d4af37; z-index: 10;">
                    VS
                </div>

                <div id="visual-enemy-army" style="text-align: center; width: 35%; transition: 0.2s;">
                    <div style="font-size: 50px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));">🏹</div>
                    <div style="font-weight: bold; color: #ff3366; font-size: 14px; margin-bottom: 5px;">ГАРНИЗОН НА КРЕПОСТТА</div>
                    <div style="width: 100%; background: #222; height: 14px; border-radius: 7px; border: 1px solid #444; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);">
                        <div style="width: ${enemyLifeHP}%; background: linear-gradient(90deg, #ff3366, #aa0033); height: 100%; transition: width 0.4s ease;"></div>
                    </div>
                    <div style="font-size: 16px; margin-top: 5px; font-weight: bold;">${state.enemyArmy} <span style="font-size: 11px; color:#777;">война</span></div>
                </div>
            </div>

            <div id="heroes-battle-log" style="flex: 1; background: #000; border: 1px solid #222; padding: 15px; border-radius: 6px; overflow-y: auto; font-family: monospace; font-size: 13px; color: #00ff00; line-height: 1.6; margin-bottom: 20px; box-shadow: inset 0 0 15px rgba(0,0,0,1);">
                ${state.logHistory.length === 0 ? '[Летопис]: Полковете са разгърнати. Знамената са вдигнати. Очаква се заповед...<br>' : state.logHistory.join('')}
            </div>

            <div class="battle-controls" id="battle-controls-panel" style="display: flex; gap: 15px; justify-content: center; padding-top: 5px;">
                <button id="btn-main-assault" class="action-btn" style="background: linear-gradient(180deg, #8b0000 0%, #5a0000 100%); color: #fff; border: 1px solid #ff3333; padding: 14px 40px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px; text-shadow: 0 1px 2px #000; box-shadow: 0 3px 6px rgba(0,0,0,0.4);" onclick="window.processBattleAction('assault')">⚔️ ПРОДЪЛЖИ ЩУРМА</button>
                <button id="btn-main-retreat" class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 14px 40px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px;" onclick="window.processBattleAction('retreat')">🏃‍♂️ ОТСТЪПЛЕНИЕ</button>
            </div>
        </div>
    `;

    const logDiv = document.getElementById('heroes-battle-log');
    if (logDiv) logDiv.scrollTop = logDiv.scrollHeight;
};

window.processBattleAction = function(actionType) {
    const state = window.currentBattleState;
    if (!state) return;

    // Спираме бутоните по време на анимацията на сблъсъка
    const btnAssault = document.getElementById('btn-main-assault');
    const btnRetreat = document.getElementById('btn-main-retreat');
    if (btnAssault) btnAssault.disabled = true;
    if (btnRetreat) btnRetreat.disabled = true;

    // Обикновено отстъпление (без анимация на удар)
    if (actionType === 'retreat') {
        executeRetreatLogic();
        return;
    }

    // 🎬 СТАРТИРАНЕ НА ВИЗУАЛНИТЕ ЕФЕКТИ И АНИМАЦИИ НА БОЙНОТО ПОЛЕ
    const leftSide = document.getElementById('visual-player-army');
    const rightSide = document.getElementById('visual-enemy-army');
    const mainBox = document.getElementById('main-battle-box');
    const centerStage = document.getElementById('battle-center-stage');

    if (leftSide && rightSide) {
        leftSide.classList.add('clash-anim-left');
        rightSide.classList.add('clash-anim-right');
    }

    let roundLog = `<div style="border-left: 3px solid #d4af37; padding-left: 8px; margin-bottom: 12px; color: #fff;"><b style="color: #ffd700;">--- РУНД ${state.round} ---</b><br>`;
    let hasCritThisRound = false;

    if (actionType === 'chase_enemy') {
        let totalPlayerPower = state.group.reduce((sum, h) => sum + (h.currentArmy || 0), 0);
        let bonusDamage = Math.floor(totalPlayerPower * 0.30 * (Math.random() * 0.5 + 0.5));
        state.enemyArmy = Math.max(0, state.enemyArmy - bonusDamage);
        roundLog += `<span style="color: #ffd700; font-weight: bold;">🏹 ПРЕСЛЕДВАНЕ: Твоите конни орди застигнаха отстъпващите врагове и съсякоха още ${bonusDamage} защитници!</span><br>`;
        if (state.enemyArmy <= 0) roundLog += `<span style="color: #00ff00;">💀 Вражеската армия бе напълно разгромена при бягството!</span><br>`;
        finishRoundCalculation(roundLog, false);
        return;
    }

    // ИЗЧИСЛЕНИЯ НА ЩУРМА И ПАСИВИТЕ НА ГЕРОИТЕ
    let totalRoundPlayerPower = 0;
    let totalRoundEnemyDefense = state.enemyArmy * (1 + (state.region.defenseLevel || 1) * 0.15);

    state.group.forEach(hero => {
        if (hero.currentArmy <= 0) return;
        let skills = hero.skills || {};
        let pet = hero.pet || null;
        let pPower = hero.currentArmy + (hero.heroPower || 100);

        if ((skills.tactics || 0) > 0) {
            pPower += (skills.tactics * 40);
            roundLog += `• [${hero.name}]: Военна Тактика добавя +${skills.tactics * 40} сила.<br>`;
        }
        if (pet === "falcon") {
            pPower = Math.floor(pPower * 1.15);
            roundLog += `• [${hero.name}]: Родов Сокол разузнава фланговете (+15% мощ).<br>`;
        }
        let critChance = (skills.heavyStrike || 0) * 0.05;
        if (pet === "wolf") critChance += 0.10;
        if (Math.random() < critChance) {
            pPower *= 2;
            hasCritThisRound = true;
            roundLog += `• <span style="color: #ffcc00; font-weight: bold;">[${hero.name}]: 💥 СМАЗВАЩ УДАР! Нанесени са 200% щети!</span><br>`;
        }
        if ((skills.ambush || 0) > 0 && Math.random() < 0.30) {
            pPower += 120;
            roundLog += `• <span style="color: #ffd700;">[${hero.name}]: [ЗАСАДА] Конни отряди удрят от засада! (+120 сила)</span><br>`;
        }
        totalRoundPlayerPower += pPower;
    });

    state.group.forEach(hero => {
        if (hero.currentArmy > 0 && hero.pet === "viper") {
            totalRoundEnemyDefense = Math.floor(totalRoundEnemyDefense * 0.98);
        }
    });

    totalRoundPlayerPower *= (Math.random() * 0.3 + 0.85);
    totalRoundEnemyDefense *= (Math.random() * 0.3 + 0.85);

    let playerLossesTotal = Math.floor(totalRoundEnemyDefense * 0.18);
    let enemyLossesTotal = Math.floor(totalRoundPlayerPower * 0.22);

    state.group.forEach(hero => {
        if (hero.currentArmy <= 0) return;
        let skills = hero.skills || {};
        let discount = (skills.endurance || 0) * 0.04;
        if ((skills.shieldWall || 0) > 0) discount += 0.06;
        if (hero.pet === "stallion") discount += 0.10;
        if (hero.pet === "bear") discount += 0.15;
        if (discount > 0) playerLossesTotal = Math.max(10, Math.floor(playerLossesTotal * (1 - discount)));
    });

    state.enemyArmy = Math.max(0, state.enemyArmy - enemyLossesTotal);
    roundLog += `<span style="color: #00ffcc; font-weight: bold;">⚔️ Твоята елитна група съсече ${enemyLossesTotal} вражески войници.</span><br>`;

    let activeHeroesCount = state.group.filter(g => g.currentArmy > 0).length;
    if (activeHeroesCount > 0) {
        let lossPerHero = Math.floor(playerLossesTotal / activeHeroesCount);
        state.group.forEach(h => {
            if (h.currentArmy > 0) h.currentArmy = Math.max(0, h.currentArmy - lossPerHero);
        });
        roundLog += `<span style="color: #ff3366;">📉 Вражият отпор погуби ${playerLossesTotal} от твоите бойци.</span><br>`;
    }

    let totalPlayerArmyLeft = state.group.reduce((sum, h) => sum + h.currentArmy, 0);
    if (state.enemyArmy > 0 && totalPlayerArmyLeft > 0) {
        if (state.enemyArmy < (state.initialEnemyArmy * 0.35) && Math.random() < 0.50) {
            roundLog += `<span style="color: #ffcc00; font-weight: bold;">🏳️ РАЗКОЛЕБАВАНЕ: Защитниците губят кураж и отстъпват редиците си!</span><br>`;
            state.enemyRetreating = true;
        }
    }
    roundLog += `</div>`;

    // ЗАДЪРЖАНЕ НА КАДЪРА С ЦЕЛ ВИЗУАЛИЗАЦИЯ НА СБЛЪСЪКА (400 милисекунди)
    setTimeout(() => {
        if (leftSide && rightSide) {
            leftSide.classList.remove('clash-anim-left');
            rightSide.classList.remove('clash-anim-right');
        }

        // Тръсване на екрана при удар
        if (mainBox) mainBox.classList.add('shake-effect');
        
        // Ако има Критичен удар, показваме голям пламтящ надпис в центъра
        if (hasCritThisRound && centerStage) {
            centerStage.innerHTML = `<span style="color:#ffcc00; font-size:20px; text-shadow:0 0 8px #ff0000; animation: flashCrit 0.4s;">💥 КРИТИЧЕН СМАЗВАЩ УДАР!</span>`;
            if (mainBox) mainBox.style.backgroundColor = 'rgba(60, 20, 20, 0.95)';
        } else if (centerStage) {
            centerStage.innerHTML = `<span style="color:#ff3333; font-size:24px;">⚔️ СЕЧ!</span>`;
        }

        // Изчистване на ефектите след края на анимацията
        setTimeout(() => {
            if (mainBox) {
                mainBox.classList.remove('shake-effect');
                mainBox.style.backgroundColor = '';
            }
            if (centerStage) centerStage.innerHTML = "VS";
            
            // Завършваме рунда и преначертаваме лентите
            finishRoundCalculation(roundLog, totalPlayerArmyLeft <= 0);
        }, 400);

    }, 400);
};

function executeRetreatLogic() {
    const state = window.currentBattleState;
    let roundLog = `<div style="border-left: 3px solid #ff3333; padding-left: 8px; margin-bottom: 12px; color: #fff;"><b style="color: #ff3333;">--- ТАКТИЧЕСКО ОТСТЪПЛЕНИЕ ---</b><br>`;
    let enemyChasingPower = state.enemyArmy * 0.25;
    
    if (Math.random() < 0.40) {
        let casualty = Math.floor(enemyChasingPower * (Math.random() * 0.5 + 0.5));
        roundLog += `<span style="color: #ff3366;">🚨 ВРАГЪТ НИ ПРЕСЛЕДВА! Докато организираше отстъплението, ариергардът беше застигнат! Погубени са ${casualty} бойци.</span><br>`;
        state.group.forEach(h => {
            if (h.currentArmy > 0) {
                let share = Math.floor(casualty / state.group.filter(g => g.currentArmy > 0).length);
                h.currentArmy = Math.max(0, h.currentArmy - share);
            }
        });
    } else {
        roundLog += `<span style="color: #00ffcc;">✅ СЛАВНО МАНЕВРИРАНЕ: Воеводите организираха перфектно изтегляне без никакви жертви.</span><br>`;
    }
    roundLog += `</div>`;
    state.logHistory.push(roundLog);
    window.endGroupBattle(false, "retreat");
}

function finishRoundCalculation(roundLog, isDefeat) {
    const state = window.currentBattleState;
    state.logHistory.push(roundLog);
    
    let totalPlayerArmyLeft = state.group.reduce((sum, h) => sum + h.currentArmy, 0);

    if (state.enemyArmy <= 0 && totalPlayerArmyLeft > 0) {
        window.endGroupBattle(true);
    } else if (isDefeat || totalPlayerArmyLeft <= 0) {
        window.endGroupBattle(false, "defeat");
    } else {
        state.round++;
        window.renderBattleLayout();
        
        if (state.enemyRetreating) {
            const controls = document.getElementById('battle-controls-panel');
            if (controls) {
                controls.innerHTML = `
                    <button class="action-btn" style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; border: 1px solid #fff; padding: 14px 40px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px; box-shadow: 0 0 10px rgba(255,215,0,0.4);" onclick="window.processBattleAction('chase_enemy')">🏹 ПРЕСЛЕДВАЙ ВРАГА</button>
                    <button class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 14px 40px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px;" onclick="window.processBattleAction('retreat')">🛑 ПОЗВОЛИ ИМ ДА ИЗБЯГАТ</button>
                `;
            }
        }
    }
}

window.endGroupBattle = function(isVictory, reason = "") {
    const state = window.currentBattleState;
    if (!state) return;

    const controls = document.getElementById('battle-controls-panel');
    const logDiv = document.getElementById('heroes-battle-log');
    
    state.group.forEach(hero => {
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
            const globalClan = window.worldData.clans[hero.dynasty];
            globalClan.currentArmy = hero.currentArmy;
            globalClan.armySize = hero.currentArmy;
        }
    });

    if (window.syncAllLeadersData) window.syncAllLeadersData();

    let finalLog = `<div style="text-align:center; padding: 15px; margin-top: 15px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid #333;">`;

    if (isVictory) {
        state.region.armySize = 0;
        if (!window.playerRegions) window.playerRegions = [];
        const ownedRegionsFlat = window.playerRegions.flat();
        if (!ownedRegionsFlat.includes(state.region.name)) {
            window.playerRegions.push(state.region.name);
        }

        let xpReward = 150;
        state.group.forEach(hero => {
            if (hero.currentArmy > 0 && window.gainHeroXP) {
                window.gainHeroXP(hero, xpReward);
            }
        });

        finalLog += `<h2 style="color: #00ff00; margin: 0 0 10px 0; letter-spacing:1px;">🎉 БЛИСТАТЕЛЕН ТРИУМФ! 🎉</h2>`;
        finalLog += `Регионът <b style="color:#fff;">"${state.region.name}"</b> е изцяло под твой контрол!<br>`;
        finalLog += `Всички оцелели воеводи получават по <b style="color:#ffd700;">+${xpReward} XP</b>!</div>`;
        
        if (window.showAdvisorMsg && window.currentHero) {
            window.showAdvisorMsg(`⚔️ ВЕЛИКА ПОБЕДА: Обединените сили на Кан ${window.currentHero.name} разгромиха врага при "${state.region.name}"!`);
        }
    } else {
        if (reason === "retreat") {
            finalLog += `<h2 style="color: #ffcc00; margin: 0 0 10px 0;">🏳️ ТАКТИЧЕСКО ОТТЕГЛЯНЕ 🏳️</h2>`;
            finalLog += `Организираното отстъпление запази ядрото на твоите воеводи. Регионът остава непревзет.</div>`;
        } else {
            state.region.armySize = Math.floor(state.enemyArmy * 0.8);
            finalLog += `<h2 style="color: #ff3366; margin: 0 0 10px 0;">❌ ПЪЛНО ПОРАЖЕНИЕ ❌</h2>`;
            finalLog += `Твоите армии бяха напълно разбити в прахта. Оцелелите водачи се изтеглят обратно.</div>`;
        }
    }

    if (logDiv) {
        logDiv.innerHTML += finalLog;
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    if (controls) {
        controls.innerHTML = `
            <button class="action-btn" style="background: #d4af37; color: #000; border: 1px solid #fff; padding: 15px 50px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 16px; box-shadow: 0 4px 10px rgba(214,175,55,0.3);" onclick="window.closeBattleAndRefresh()">ЗАТВОРИ БОЙНИЯ ЕКРАН</button>
        `;
    }
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
