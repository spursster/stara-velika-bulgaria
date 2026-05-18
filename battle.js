/**
 * МОДУЛ: БИТКИ И ВОЕННИ ЩУРМОВЕ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (ВИЗУАЛНА АРЕНА С КОМАНДЕН ЩАБ И СИСТЕМА ЗА ФАВОРИТИ)
 * КОРЕКЦИЯ: Добавени интерактивни сърца за наблюдение и управление на прогреса на воеводите в реално време.
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
                initialArmyMax: clan.maxArmy || 300, // Служебен таван за прогрес лентата
                heroPower: clan.heroPower || 100,
                skills: clan.skills || {},
                pet: clan.pet || null,
                level: clan.level || 1,
                isFavorite: clan.isFavorite || false
            };
        });
    } else if (window.currentHero) {
        availableLeaders.push({
            ...window.currentHero,
            clanKey: window.currentHero.dynasty,
            initialArmyMax: 300,
            isFavorite: window.currentHero.isFavorite || false
        });
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
                100% { transform: translate(1px, -2px) rotate(0deg); }
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
            .clash-anim-left { animation: clashLeft 0.3s ease-in-out; }
            .clash-anim-right { animation: clashRight 0.3s ease-in-out; }
            .shake-effect { animation: shake 0.3s; }
            .fav-heart-btn { cursor: pointer; transition: transform 0.1s; }
            .fav-heart-btn:hover { transform: scale(1.2); }
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

    // Генериране на HTML списъка с Наблюдавани воеводи (Фаворити)
    let favoriteLeadersHTML = '';
    state.group.forEach(hero => {
        if (hero.isFavorite) {
            let heroHpPercent = Math.min(100, Math.ceil((hero.currentArmy / hero.initialArmyMax) * 100));
            let barColor = heroHpPercent > 50 ? '#00ffcc' : (heroHpPercent > 20 ? '#ffcc00' : '#ff3366');
            
            favoriteLeadersHTML += `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 6px; padding: 10px; display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <div style="font-size: 20px;">🎖️</div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
                            <span style="font-weight: bold; color: #ffd700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${hero.name} (Ниво ${hero.level})</span>
                            <span style="color: #fff; font-size: 11px;">${hero.currentArmy} д.</span>
                        </div>
                        <div style="width: 100%; background: #222; height: 8px; border-radius: 4px; border: 1px solid #444; overflow: hidden;">
                            <div style="width: ${heroHpPercent}%; background: ${barColor}; height: 100%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <span class="fav-heart-btn" onclick="window.toggleLeaderFavorite('${hero.clanKey}')">❤️</span>
                </div>
            `;
        }
    });

    if (favoriteLeadersHTML === '') {
        favoriteLeadersHTML = `<div style="color: #666; font-size: 12px; text-align: center; padding: 20px; font-style: italic;">Няма добавени водачи във фаворити.<br>Маркирай ги със сърце от списъка по-долу, за да следиш прогреса им тук.</div>`;
    }

    // Генериране на пълния списък с всички участващи воеводи (за бърз контрол и добавяне)
    let allGroupLeadersHTML = state.group.map(hero => {
        let heart = hero.isFavorite ? '❤️' : '🤍';
        let statusColor = hero.currentArmy > 0 ? '#00ffcc' : '#ff3366';
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 5px 8px; border-radius: 4px; border: 1px solid #1a1a1a; font-size: 12px;">
                <span style="color: ${statusColor}; font-weight: bold;">${hero.name} (${hero.currentArmy} бойци)</span>
                <span class="fav-heart-btn" onclick="window.toggleLeaderFavorite('${hero.clanKey}')">${heart}</span>
            </div>
        `;
    }).join('');

    battleScreen.innerHTML = `
        <div id="main-battle-box" class="heroes-battle-container" style="width: 96%; height: 94%; display: flex; background: radial-gradient(circle, #151515 0%, #070707 100%); border: 3px solid #d4af37; box-shadow: 0 0 40px rgba(0,0,0,0.9); border-radius: 12px; padding: 20px; box-sizing: border-box; color: #fff; font-family: 'Cinzel', serif; gap: 20px;">
            
            <div style="width: 300px; display: flex; flex-direction: column; border-right: 1px solid #222; padding-right: 15px;">
                <h3 style="color: #ffd700; margin: 0 0 10px 0; font-size: 15px; border-bottom: 1px solid #333; padding-bottom: 5px; text-align: center;">📋 КОМАНДЕН ЩАБ</h3>
                
                <div style="font-size: 11px; color: #888; margin-bottom: 10px; text-align: center;">НАБЛЮДАВАНИ ФАВОРИТИ:</div>
                <div style="flex: 1; overflow-y: auto; margin-bottom: 15px; padding-right: 5px;">
                    ${favoriteLeadersHTML}
                </div>

                <h4 style="color: #aaa; margin: 0 0 8px 0; font-size: 12px; text-align: center; border-top: 1px solid #222; padding-top: 10px;">Всички воеводи (${state.group.length}):</h4>
                <div style="height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; background: rgba(255,255,255,0.01); padding: 5px; border-radius: 4px; border: 1px solid #222;">
                    ${allGroupLeadersHTML}
                </div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column;">
                
                <div style="text-align: center; border-bottom: 1px solid #222; padding-bottom: 10px;">
                    <h1 style="color: #ffd700; margin: 0; font-size: 24px; letter-spacing: 2px;">ВОЕНЕН ТАБОР: РУНД ${state.round}</h1>
                    <p style="color: #aaa; margin: 3px 0 0 0; font-size: 13px;">Направление на щурма: <b style="color: #fff;">"${state.region.name}"</b></p>
                </div>

                <div style="display: flex; height: 160px; margin: 15px 0; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.5); border-radius: 8px; border: 1px solid #333; padding: 0 30px; position: relative; overflow: hidden;">
                    
                    <div id="visual-player-army" style="text-align: center; width: 38%;">
                        <div style="font-size: 40px;">🛡️</div>
                        <div style="font-weight: bold; color: #00ffcc; font-size: 13px; margin-bottom: 5px;">ОБЕДИНЕНА ОРДА</div>
                        <div style="width: 100%; background: #222; height: 12px; border-radius: 6px; border: 1px solid #444; overflow: hidden;">
                            <div style="width: ${playerLifeHP}%; background: linear-gradient(90deg, #00aa77, #00ffcc); height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <div style="font-size: 15px; margin-top: 5px; font-weight: bold;">${totalCurrentPlayerArmy} <span style="font-size: 11px; color:#666;">бойци</span></div>
                    </div>

                    <div id="battle-center-stage" style="width: 20%; text-align: center; font-size: 24px; font-weight: bold; color: #d4af37;">
                        VS
                    </div>

                    <div id="visual-enemy-army" style="text-align: center; width: 38%;">
                        <div style="font-size: 40px;">🏹</div>
                        <div style="font-weight: bold; color: #ff3366; font-size: 13px; margin-bottom: 5px;">ГАРНИЗОН НА КРЕПОСТТА</div>
                        <div style="width: 100%; background: #222; height: 12px; border-radius: 6px; border: 1px solid #444; overflow: hidden;">
                            <div style="width: ${enemyLifeHP}%; background: linear-gradient(90deg, #ff3366, #aa0033); height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <div style="font-size: 15px; margin-top: 5px; font-weight: bold;">${state.enemyArmy} <span style="font-size: 11px; color:#666;">защитници</span></div>
                    </div>
                </div>

                <div id="heroes-battle-log" style="flex: 1; background: #000; border: 1px solid #222; padding: 12px; border-radius: 6px; overflow-y: auto; font-family: monospace; font-size: 12px; color: #00ff00; line-height: 1.5; margin-bottom: 15px;">
                    ${state.logHistory.length === 0 ? '[Летопис]: Полковете заемат позиции. Очаква се бойна заповед...<br>' : state.logHistory.join('')}
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

// Функция за превключване на фаворит статус в реално време
window.toggleLeaderFavorite = function(clanKey) {
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        let clan = window.worldData.clans[clanKey];
        clan.isFavorite = !clan.isFavorite;
        
        // Синхронизираме и в текущото бойно състояние
        if (window.currentBattleState && window.currentBattleState.group) {
            let hero = window.currentBattleState.group.find(h => h.clanKey === clanKey);
            if (hero) hero.isFavorite = clan.isFavorite;
        }
        
        // Преначертаваме прозореца веднага, за да се види промяната на сърцето и слотовете
        window.renderBattleLayout();
    }
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
        void leftSide.offsetWidth; // Принудително рестартиране на CSS анимация
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
            roundLog += `• [${hero.name}]: Военна Тактика добавя +${skills.tactics * 40} сила.<br>`;
        }
        if (pet === "falcon") {
            pPower = Math.floor(pPower * 1.15);
            roundLog += `• [${hero.name}]: Родов Сокол разузнава отгоре (+15% мощ).<br>`;
        }
        let critChance = (skills.heavyStrike || 0) * 0.05;
        if (pet === "wolf") critChance += 0.10;
        if (Math.random() < critChance) {
            pPower *= 2;
            hasCritThisRound = true;
            roundLog += `• <span style="color: #ffcc00; font-weight: bold;">[${hero.name}]: 💥 СМАЗВАЩ УДАР! Нанесени са двойни щети!</span><br>`;
        }
        if ((skills.ambush || 0) > 0 && Math.random() < 0.30) {
            pPower += 120;
            roundLog += `• <span style="color: #ffd700;">[${hero.name}]: [ЗАСАДА] Изненадващ флангови удар! (+120 сила)</span><br>`;
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
            roundLog += `<span style="color: #ffcc00; font-weight: bold;">🏳️ РАЗКОЛЕБАВАНЕ: Защитниците губят кураж и отстъпват!</span><br>`;
            state.enemyRetreating = true;
        }
    }
    roundLog += `</div>`;

    setTimeout(() => {
        if (mainBox) mainBox.classList.add('shake-effect');
        if (hasCritThisRound && centerStage) {
            centerStage.innerHTML = `<span style="color:#ffcc00; font-size:16px; text-shadow:0 0 6px #ff0000;">💥 CRITICAL!</span>`;
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
    let roundLog = `<div style="border-left: 3px solid #ff3333; padding-left: 8px; margin-bottom: 12px; color: #fff;"><b style="color: #ff3333;">--- ТАКТИЧЕСКО ОТСТЪПЛЕНИЕ ---</b><br>`;
    let enemyChasingPower = state.enemyArmy * 0.25;
    
    if (Math.random() < 0.40) {
        let casualty = Math.floor(enemyChasingPower * (Math.random() * 0.5 + 0.5));
        roundLog += `<span style="color: #ff3366;">🚨 ВРАГЪТ НИ ПРЕСЛЕДВА! Застигнат ариергард! Погубени са ${casualty} бойци.</span><br>`;
        state.group.forEach(h => {
            if (h.currentArmy > 0) {
                let share = Math.floor(casualty / state.group.filter(g => g.currentArmy > 0).length);
                h.currentArmy = Math.max(0, h.currentArmy - share);
            }
        });
    } else {
        roundLog += `<span style="color: #00ffcc;">✅ СЛАВНО МАНЕВРИРАНЕ: Изтегляне без никакви загуби.</span><br>`;
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
                    <button class="action-btn" style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; border: 1px solid #fff; padding: 12px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 14px;" onclick="window.processBattleAction('chase_enemy')">🏹 ПРЕСЛЕДВАЙ ВРАГА</button>
                    <button class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 12px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 14px;" onclick="window.processBattleAction('retreat')">🛑 ПОЗВОЛИ ИМ ДА ИЗБЯГАТ</button>
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

    let finalLog = `<div style="text-align:center; padding: 12px; margin-top: 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid #333; font-size: 13px;">`;

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

        finalLog += `<h2 style="color: #00ff00; margin: 0 0 5px 0;">🎉 БЛИСТАТЕЛЕН ТРИУМФ! 🎉</h2>`;
        finalLog += `Регионът <b style="color:#fff;">"${state.region.name}"</b> е превзет!<br>`;
        finalLog += `Всички участвали воеводи получават по <b style="color:#ffd700;">+${xpReward} XP</b>!</div>`;
        
        if (window.showAdvisorMsg && window.currentHero) {
            window.showAdvisorMsg(`⚔️ ВЕЛИКА ПОБЕДА: Обединените сили разгромиха врага при "${state.region.name}"!`);
        }
    } else {
        if (reason === "retreat") {
            finalLog += `<h2 style="color: #ffcc00; margin: 0 0 5px 0;">🏳️ ТАКТИЧЕСКО ОТТЕГЛЯНЕ 🏳️</h2>`;
            finalLog += `Войската запази основните си сили. Регионът остава непревзет.</div>`;
        } else {
            state.region.armySize = Math.floor(state.enemyArmy * 0.8);
            finalLog += `<h2 style="color: #ff3366; margin: 0 0 5px 0;">❌ ПОРАЖЕНИЕ ❌</h2>`;
            finalLog += `Армиите са разбити. Водачите се изтеглят за прегрупиране.</div>`;
        }
    }

    if (logDiv) {
        logDiv.innerHTML += finalLog;
        logDiv.scrollTop = logDiv.scrollHeight;
    }

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
