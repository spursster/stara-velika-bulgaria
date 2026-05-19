/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (ФИКСИРАНА БИТКА - БЕЗ СИНТАКСИЧНИ СРИВОВЕ)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН
КОРЕКЦИЯ: Премахнати всички heig ht, border-radi us, cl ash, wi ndow, & &. 
          Гарантирано визуализиране на екрана и работеща логика.
==========================================================================
*/

window.startBattle = function(targetRegion) {
    console.log("⚔️ Стартиране на битка...", targetRegion);

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

    let allLeaders = [];
    if (window.worldData && window.worldData.clans) {
        allLeaders = Object.entries(window.worldData.clans).map(([key, clan]) => ({
            clanKey: key,
            name: clan.leaderName || clan.name || key,
            clan: key,
            currentArmy: clan.armySize || clan.currentArmy || 0,
            initialArmyMax: Math.max(clan.maxArmy || 300, clan.armySize || 300),
            heroPower: clan.heroPower || 100,
            skills: clan.skills || {},
            pet: clan.pet || null,
            level: clan.level || 1,
            isFavorite: clan.isFavorite || false
        }));
    } else if (window.currentHero) {
        allLeaders.push({
            ...window.currentHero,
            clanKey: window.currentHero.clan,
            initialArmyMax: Math.max(300, window.currentHero.armySize || 300),
            isFavorite: true
        });
    }

    let battleGroup = allLeaders.filter(l => l.isFavorite).slice(0, 5);
    if (battleGroup.length === 0) {
        battleGroup = allLeaders.filter(l => l.currentArmy > 0).slice(0, 5);
    }

    let totalPlayerArmy = battleGroup.reduce((sum, h) => sum + h.currentArmy, 0);
    if (totalPlayerArmy === 0) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔮 Твоите избрани воеводи нямат войска! Попълни ги в Казармите!");
        }
        return;
    }

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

    // ✅ ФИКС: Валидни CSS свойства без интервали
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
                100% { transform: translate(1px, -2px) rotate(0deg); }
            }
            @keyframes clashLeft { 0% { transform: translateX(0); } 50% { transform: translateX(30px); } 100% { transform: translateX(0); } }
            @keyframes clashRight { 0% { transform: translateX(0); } 50% { transform: translateX(-30px); } 100% { transform: translateX(0); } }
            .clash-anim-left { animation: clashLeft 0.3s ease-in-out; }
            .clash-anim-right { animation: clashRight 0.3s ease-in-out; }
            .shake-effect { animation: shake 0.3s; }
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
    let playerLifeHP = Math.ceil((totalCurrentPlayerArmy / state.initialPlayerArmy) * 100);
    let enemyLifeHP = Math.ceil((state.enemyArmy / state.initialEnemyArmy) * 100);

    let teamLeadersHTML = '';
    state.group.forEach(hero => {
        let heroHpPercent = Math.min(100, Math.ceil((hero.currentArmy / hero.initialArmyMax) * 100));
        let barColor = heroHpPercent > 50 ? '#00ffcc' : (heroHpPercent > 20 ? '#ffcc00' : '#ff3366');
        let deadStatus = hero.currentArmy <= 0 ? 'filter: grayscale(1); opacity: 0.5;' : '';

        teamLeadersHTML += `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; gap: 10px; ${deadStatus}">
                <div style="font-size: 22px;">🎖️</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
                        <span style="font-weight: bold; color: #ffd700; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${hero.name}</span>
                        <span style="color: #aaa; font-size: 11px;">Ниво ${hero.level}</span>
                    </div>
                    <div style="width: 100%; background: #111; height: 6px; border-radius: 3px; overflow: hidden; border: 1px solid #333;">
                        <div style="width: ${heroHpPercent}%; background: ${barColor}; height: 100%; transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 11px; text-align: right; color: #fff; margin-top: 2px;">${hero.currentArmy} войници</div>
                </div>
                <span style="color: #ff3366; font-size: 12px;">❤️</span>
            </div>
        `;
    });

    battleScreen.innerHTML = `
        <div id="main-battle-box" class="heroes-battle-container" style="width: 96%; height: 94%; display: flex; background: radial-gradient(circle, #121212 0%, #050505 100%); border: 3px solid #d4af37; box-shadow: 0 0 40px rgba(0,0,0,0.9); border-radius: 12px; padding: 20px; box-sizing: border-box; color: #fff; font-family: 'Cinzel', serif; gap: 20px;">
            <div style="width: 280px; display: flex; flex-direction: column; border-right: 1px solid #222; padding-right: 15px;">
                <h3 style="color: #ffd700; margin: 0 0 5px 0; font-size: 14px; text-align: center; letter-spacing: 1px;">🛡️ ИЗБРАНА ПЕТИЦА</h3>
                <p style="font-size: 10px; color: #666; text-align: center; margin: 0 0 15px 0;">(Следят се в реално време)</p>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1; overflow-y: auto;">
                    ${teamLeadersHTML}
                </div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column;">
                <div style="text-align: center; border-bottom: 1px solid #222; padding-bottom: 8px;">
                    <h1 style="color: #ffd700; margin: 0; font-size: 22px; letter-spacing: 2px;">ВОЕНЕН ТАБОР — РУНД ${state.round}</h1>
                    <p style="color: #aaa; margin: 2px 0 0 0; font-size: 12px;">Щурмуван регион: <b style="color: #fff;">"${state.region.name}"</b></p>
                </div>

                <div style="display: flex; height: 150px; margin: 15px 0; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.6); border-radius: 8px; border: 1px solid #222; padding: 0 30px; position: relative;">
                    <div id="visual-player-army" style="text-align: center; width: 40%;">
                        <div style="font-size: 38px;">🛡️</div>
                        <div style="font-weight: bold; color: #00ffcc; font-size: 12px; margin-bottom: 4px;">ТВОИТЕ СИЛИ</div>
                        <div style="width: 100%; background: #222; height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid #444;">
                            <div style="width: ${playerLifeHP}%; background: linear-gradient(90deg, #00aa77, #00ffcc); height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <div style="font-size: 14px; margin-top: 4px; font-weight: bold;">${totalCurrentPlayerArmy} <span style="font-size: 10px; color:#666;">война</span></div>
                    </div>

                    <div id="battle-center-stage" style="width: 20%; text-align: center; font-size: 22px; font-weight: bold; color: #d4af37;">VS</div>

                    <div id="visual-enemy-army" style="text-align: center; width: 40%;">
                        <div style="font-size: 38px;">🏹</div>
                        <div style="font-weight: bold; color: #ff3366; font-size: 12px; margin-bottom: 4px;">ГАРНИЗОН НА ВРАГА</div>
                        <div style="width: 100%; background: #222; height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid #444;">
                            <div style="width: ${enemyLifeHP}%; background: linear-gradient(90deg, #ff3366, #aa0033); height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <div style="font-size: 14px; margin-top: 4px; font-weight: bold;">${state.enemyArmy} <span style="font-size: 10px; color:#666;">защитници</span></div>
                    </div>
                </div>

                <div id="heroes-battle-log" style="flex: 1; background: #000; border: 1px solid #222; padding: 12px; border-radius: 6px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #00ff00; line-height: 1.5; margin-bottom: 15px;">
                    ${state.logHistory.length === 0 ? '[Летопис]: Полковете на петицата са подредени. Чака се бойна заповед... <br>' : state.logHistory.join('')}
                </div>

                <div class="battle-controls" id="battle-controls-panel" style="display: flex; gap: 15px; justify-content: center;">
                    <button id="btn-main-assault" class="action-btn" style="background: linear-gradient(180deg, #8b0000 0%, #5a0000 100%); color: #fff; border: 1px solid #ff3333; padding: 12px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 14px;" onclick="window.processBattleAction('assault')">⚔️ ПРОДЪЛЖИ ЩУРМА</button>
                    <button id="btn-main-retreat" class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 12px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 14px;" onclick="window.processBattleAction('retreat')">🏃‍♂️ ОТСТЪПЛЕНИЕ</button>
                </div>
            </div>
        </div>
    `;

    const logDiv = document.getElementById('heroes-battle-log');
    if (logDiv) logDiv.scrollTop = logDiv.scrollHeight;
};

window.processBattleAction = function(actionType) {
    const state = window.currentBattleState;
    if (!state) return;
    const btnAssault = document.getElementById('btn-main-assault');
    const btnRetreat = document.getElementById('btn-main-retreat');
    if (btnAssault) btnAssault.disabled = true;
    if (btnRetreat) btnRetreat.disabled = true;

    if (actionType === 'retreat') {
        executeRetreatLogic();
        return;
    }

    const leftSide = document.getElementById('visual-player-army');
    const rightSide = document.getElementById('visual-enemy-army');
    const mainBox = document.getElementById('main-battle-box');
    const centerStage = document.getElementById('battle-center-stage');

    if (leftSide && rightSide) {
        leftSide.className = ''; 
        rightSide.className = '';
        void leftSide.offsetWidth; 
        leftSide.classList.add('clash-anim-left');
        rightSide.classList.add('clash-anim-right');
    }

    let roundLog = `<div style="border-left: 3px solid #d4af37; padding-left: 8px; margin-bottom: 12px; color: #fff;"> <b style="color: #ffd700;">--- РУНД ${state.round} ---</b> <br>`;
    let hasCritThisRound = false;

    if (actionType === 'chase_enemy') {
        let totalPlayerPower = state.group.reduce((sum, h) => sum + (h.currentArmy || 0), 0);
        let bonusDamage = Math.floor(totalPlayerPower * 0.30 * (Math.random() * 0.5 + 0.5));
        state.enemyArmy = Math.max(0, state.enemyArmy - bonusDamage);
        roundLog += `<span style="color: #ffd700; font-weight: bold;">🏹 ПРЕСЛЕДВАНЕ: Твоите конни орди застигнаха врага и съсякоха още ${bonusDamage} защитници!</span> <br>`;
        finishRoundCalculation(roundLog, false);
        return;
    }

    let totalRoundPlayerPower = 0;
    let totalRoundEnemyDefense = state.enemyArmy * (1 + (state.region.defenseLevel || 1) * 0.15);

    state.group.forEach(hero => {
        if (hero.currentArmy <= 0) return;
        let skills = hero.skills || {};
        let pet = hero.pet || null;
        let pPower = hero.currentArmy + (hero.heroPower || 100);

        if ((skills.tactics || 0) > 0) {
            pPower += (skills.tactics * 40);
            roundLog += `• [${hero.name}]: Военна Тактика добавя +${skills.tactics * 40} сила. <br>`;
        }
        if (pet === "falcon") {
            pPower = Math.floor(pPower * 1.15);
            roundLog += `• [${hero.name}]: Родов Сокол разузнава отгоре (+15% мощ). <br>`;
        }
        let critChance = (skills.heavyStrike || 0) * 0.05;
        if (pet === "wolf") critChance += 0.10;
        if (Math.random() < critChance) {
            pPower *= 2;
            hasCritThisRound = true;
            roundLog += `• <span style="color: #ffcc00; font-weight: bold;">[${hero.name}]: 💥 СМАЗВАЩ УДАР! Нанесени са 200% щети!</span> <br>`;
        }
        totalRoundPlayerPower += pPower;
    });

    totalRoundPlayerPower *= (Math.random() * 0.3 + 0.85);
    totalRoundEnemyDefense *= (Math.random() * 0.3 + 0.85);

    let playerLossesTotal = Math.floor(totalRoundEnemyDefense * 0.18);
    let enemyLossesTotal = Math.floor(totalRoundPlayerPower * 0.22);

    state.enemyArmy = Math.max(0, state.enemyArmy - enemyLossesTotal);
    roundLog += `<span style="color: #00ffcc; font-weight: bold;">⚔️ Избраната петица съсече ${enemyLossesTotal} вражески войници.</span> <br>`;

    let activeHeroesCount = state.group.filter(g => g.currentArmy > 0).length;
    if (activeHeroesCount > 0) {
        let lossPerHero = Math.floor(playerLossesTotal / activeHeroesCount);
        state.group.forEach(h => {
            if (h.currentArmy > 0) h.currentArmy = Math.max(0, h.currentArmy - lossPerHero);
        });
        roundLog += `<span style="color: #ff3366;">📉 Отпорът на крепостта погуби ${playerLossesTotal} от твоите бойци.</span> <br>`;
    }

    let totalPlayerArmyLeft = state.group.reduce((sum, h) => sum + h.currentArmy, 0);
    if (state.enemyArmy > 0 && totalPlayerArmyLeft > 0) {
        if (state.enemyArmy < (state.initialEnemyArmy * 0.35) && Math.random() < 0.50) {
            roundLog += `<span style="color: #ffcc00; font-weight: bold;">🏳️ РАЗКОЛЕБАВАНЕ: Защитниците губят кураж!</span> <br>`;
            state.enemyRetreating = true;
        }
    }
    roundLog += `</div>`;

    setTimeout(() => {
        if (mainBox) mainBox.classList.add('shake-effect');
        if (hasCritThisRound && centerStage) {
            centerStage.innerHTML = `<span style="color:#ffcc00; font-size:15px; text-shadow:0 0 5px #ff0000;">💥 CRITICAL!</span>`;
        } else if (centerStage) {
            centerStage.innerHTML = `<span style="color:#ff3333; font-size:18px;">⚔️ СЕЧ!</span>`;
        }

        setTimeout(() => {
            if (mainBox) mainBox.classList.remove('shake-effect');
            if (centerStage) centerStage.innerHTML = "VS";
            finishRoundCalculation(roundLog, totalPlayerArmyLeft <= 0);
        }, 300);

    }, 300);
};

function executeRetreatLogic() {
    const state = window.currentBattleState;
    let roundLog = `<div style="border-left: 3px solid #ff3333; padding-left: 8px; margin-bottom: 12px; color: #fff;"><b style="color: #ff3333;">--- ОТСТЪПЛЕНИЕ ---</b><br>`;
    let enemyChasingPower = state.enemyArmy * 0.20;
    let casualty = Math.floor(enemyChasingPower * (Math.random() * 0.5 + 0.5));
    roundLog += `<span style="color: #ff3366;">🚨 Ариергардът беше застигнат при изтеглянето! Загубени са ${casualty} бойци.</span> <br>`;
    state.group.forEach(h => {
        if (h.currentArmy > 0) {
            let share = Math.floor(casualty / state.group.filter(g => g.currentArmy > 0).length);
            h.currentArmy = Math.max(0, h.currentArmy - share);
        }
    });

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
                    <button class="action-btn" style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; border: 1px solid #fff; padding: 12px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 14px;" onclick="window.processBattleAction('chase_enemy')">🏹 ПРЕСЛЕДВАНЕ</button>
                    <button class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 12px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 14px;" onclick="window.processBattleAction('retreat')">🛑 ПУСНИ ГИ</button>
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
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.clan]) {
            const globalClan = window.worldData.clans[hero.clan];
            globalClan.currentArmy = hero.currentArmy;
            globalClan.armySize = hero.currentArmy;
        }
    });

    if (window.syncAllLeadersData) window.syncAllLeadersData();

    let finalLog = `<div style="text-align:center; padding: 12px; margin-top: 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid #333;">`;

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

        finalLog += `<h2 style="color: #00ff00; margin: 0 0 5px 0;">🎉 ВЕЛИКА ПОБЕДА! 🎉</h2>`;
        finalLog += `Регионът <b style="color:#fff;">"${state.region.name}"</b> премина под твой флаг! <br>`;
        finalLog += `Всички оцелели от петицата вземат по <b style="color:#ffd700;">+${xpReward} XP</b>!</div>`;
    } else {
        if (reason === "retreat") {
            finalLog += `<h2 style="color: #ffcc00; margin: 0 0 5px 0;">🏳️ ТАКТИЧЕСКО ИЗТЕГЛЯНЕ 🏳️</h2>`;
            finalLog += `Петицата запази основните си сили. Крепостта удържа.</div>`;
        } else {
            state.region.armySize = Math.floor(state.enemyArmy * 0.8);
            finalLog += `<h2 style="color: #ff3366; margin: 0 0 5px 0;">❌ ПОРАЖЕНИЕ ❌</h2>`;
            finalLog += `Твоят отряд бе отблъснат в прахта. Попълни редиците им в Казармите.</div>`;
        }
    }

    if (logDiv) { logDiv.innerHTML += finalLog; logDiv.scrollTop = logDiv.scrollHeight; }

    if (controls) {
        controls.innerHTML = `
            <button class="action-btn" style="background: #d4af37; color: #000; border: 1px solid #fff; padding: 12px 45px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px;" onclick="window.closeBattleAndRefresh()">ЗАТВОРИ БОЙНИЯ ЕКРАН</button>
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
