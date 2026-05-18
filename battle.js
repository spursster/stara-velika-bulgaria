/**
 * МОДУЛ: БИТКИ И ВОЕННИ ЩУРМОВЕ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (HEROES СТИЛ - ГРУПОВИ БИТКИ НА ЦЯЛ ЕКРАН)
 * КОРЕКЦИЯ: Автоматично събиране на до 50 най-силни водачи, рундова система, тактики за отстъпление и преследване.
 * Статистика на файловете в проекта: 15
 */

window.startBattle = function(targetRegion) {
    // 🛡️ ЗАЩИТА: Автоматично подсигуряване на регион
    if (!targetRegion && window.currentSelectedRegion) {
        targetRegion = window.currentSelectedRegion;
    }
    if (!targetRegion || typeof targetRegion === 'string') {
        targetRegion = {
            id: "unknown_region_" + Math.floor(Math.random() * 1000),
            name: typeof targetRegion === 'string' ? targetRegion : "Гранични Земи",
            armySize: Math.floor(Math.random() * 500) + 150, // По-големи армии за групови битки
            defenseLevel: 3,
            difficulty: 35
        };
    }

    // 1. АВТОМАТИЧНО СЪБИРАНЕ НА НАЙ-СИЛНИТЕ ГЕРОИ (ДО 50 ВОДАЧА)
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

    // Сортиране по големина на армията и сила (в низходящ ред)
    availableLeaders.sort((a, b) => b.currentArmy - a.currentArmy);
    
    // Вземаме най-силните герои (без лимит нагоре до 50, ако има по-малко от 5 играе с наличните)
    let battleGroup = availableLeaders.filter(l => l.currentArmy > 0).slice(0, 50);

    if (battleGroup.length === 0) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔮 Всички твои воеводи са без войска! Собери армия в казармите преди щурм!");
        }
        return;
    }

    // Изчисляване на общата начална армия на групата
    let totalPlayerArmy = battleGroup.reduce((sum, h) => sum + h.currentArmy, 0);

    // Инициализиране на глобалното бойно състояние
    window.currentBattleState = {
        region: targetRegion,
        group: battleGroup,
        enemyArmy: targetRegion.armySize,
        initialEnemyArmy: targetRegion.armySize,
        initialPlayerArmy: totalPlayerArmy,
        round: 1,
        logHistory: []
    };

    // 2. СЪЗДАВАНЕ НА ИНТЕРФЕЙС НА ЦЯЛ ЕКРАН (FULLSCREEN OVERLAY)
    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        document.body.appendChild(battleScreen);
    }

    // Прилагане на стилове за цял екран
    battleScreen.className = 'fullscreen-overlay';
    battleScreen.style.position = 'fixed';
    battleScreen.style.top = '0';
    battleScreen.style.left = '0';
    battleScreen.style.width = '100vw';
    battleScreen.style.height = '100vh';
    battleScreen.style.backgroundColor = 'rgba(5, 5, 5, 0.98)';
    battleScreen.style.zIndex = '99999';
    battleScreen.style.display = 'flex';
    battleScreen.style.justifyContent = 'center';
    battleScreen.style.alignItems = 'center';
    battleScreen.style.overflow = 'hidden';

    window.renderBattleLayout();
};

window.renderBattleLayout = function() {
    const state = window.currentBattleState;
    const battleScreen = document.getElementById('battle-screen');
    if (!state || !battleScreen) return;

    let totalCurrentPlayerArmy = state.group.reduce((sum, h) => sum + h.currentArmy, 0);

    battleScreen.innerHTML = `
        <div class="heroes-battle-container" style="width: 95%; height: 90%; display: flex; flex-direction: column; background: #0c0c0c; border: 3px solid #d4af37; box-shadow: 0 0 30px rgba(212,175,55,0.2); border-radius: 12px; padding: 20px; box-sizing: border-box; color: #fff; font-family: 'Cinzel', serif;">
            
            <div class="battle-header" style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 28px; letter-spacing: 2px;">ЕПИЧЕН СБЛЪСЪК: РУНД ${state.round}</h1>
                <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">Бойно поле: Превземане на регион <b style="color: #fff;">"${state.region.name}"</b></p>
            </div>

            <div class="battle-factions" style="display: flex; justify-content: space-between; margin: 20px 0; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px solid #222;">
                <div class="faction-player" style="text-align: left; width: 45%;">
                    <h3 style="color: #00ffcc; margin: 0 0 5px 0;">⚔️ ОБЩА АРМИЯ НА ГЕРОИТЕ</h3>
                    <div style="font-size: 24px; font-weight: bold; color: #fff;">${totalCurrentPlayerArmy} <span style="font-size: 14px; color: #666;">/ ${state.initialPlayerArmy}</span></div>
                    <div style="font-size: 12px; color: #aaa; margin-top: 5px;">Активни водачи в бойния строй: <b>${state.group.filter(g => g.currentArmy > 0).length}</b></div>
                </div>
                
                <div class="faction-versus" style="display: flex; align-items: center; justify-content: center; font-size: 24px; color: #d4af37; font-weight: bold;">VS</div>

                <div class="faction-enemy" style="text-align: right; width: 45%;">
                    <h3 style="color: #ff3366; margin: 0 0 5px 0;">🛡️ ВРАЖЕ СЪПРОТИВЛЕНИЕ</h3>
                    <div style="font-size: 24px; font-weight: bold; color: #fff;">${state.enemyArmy} <span style="font-size: 14px; color: #666;">/ ${state.initialEnemyArmy}</span></div>
                    <div style="font-size: 12px; color: #aaa; margin-top: 5px;">Ниво на отбрана: <b>${state.region.defenseLevel || 1}</b></div>
                </div>
            </div>

            <div id="heroes-battle-log" style="flex: 1; background: #000; border: 1px solid #333; padding: 15px; border-radius: 6px; overflow-y: auto; font-family: monospace; font-size: 13px; color: #00ff00; line-height: 1.6; margin-bottom: 20px; box-shadow: inset 0 0 10px rgba(0,0,0,0.8);">
                ${state.logHistory.length === 0 ? '[Летопис]: Войските са разгърнати на позиции. Чака се заповед за атака...<br>' : state.logHistory.join('')}
            </div>

            <div class="battle-controls" id="battle-controls-panel" style="display: flex; gap: 15px; justify-content: center;">
                <button class="action-btn" style="background: #8b0000; color: #fff; border: 1px solid #ff3333; padding: 15px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px; transition: 0.2s;" onclick="window.processBattleAction('assault')">⚔️ ПРОДЪЛЖИ ЩУРМА</button>
                <button class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 15px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px; transition: 0.2s;" onclick="window.processBattleAction('retreat')">🏃‍♂️ ОТСТЪПЛЕНИЕ</button>
            </div>
        </div>
    `;

    // Автоматично скролиране до долу на лога
    const logDiv = document.getElementById('heroes-battle-log');
    if (logDiv) logDiv.scrollTop = logDiv.scrollHeight;
};

window.processBattleAction = function(actionType) {
    const state = window.currentBattleState;
    if (!state) return;

    const logDiv = document.getElementById('heroes-battle-log');
    let roundLog = `<div style="border-left: 2px solid #d4af37; padding-left: 8px; margin-bottom: 12px; color: #fff;"><b style="color: #ffd700;">--- РУНД ${state.round} ---</b><br>`;

    if (actionType === 'retreat') {
        // Изчисляване на риск при отстъпление на играча
        let enemyChasingPower = state.enemyArmy * 0.25;
        let chaseRoll = Math.random();
        
        if (chaseRoll < 0.40) { // 40% Шанс врагът да ни преследва
            let casualty = Math.floor(enemyChasingPower * (Math.random() * 0.5 + 0.5));
            roundLog += `<span style="color: #ff3366;">🚨 ВРАГЪТ ПРЕДПРИЕ ПРЕСЛЕДВАНЕ! Докато твоите герои организираха отстъпление, ариергардът беше застигнат! Загубени са ${casualty} бойци.</span><br>`;
            
            // Разпределяне на загубите по героите
            state.group.forEach(h => {
                if (h.currentArmy > 0) {
                    let share = Math.floor(casualty / state.group.filter(g => g.currentArmy > 0).length);
                    h.currentArmy = Math.max(0, h.currentArmy - share);
                }
            });
        } else {
            roundLog += `<span style="color: #00ffcc;">✅ УСПЕШНО МАНЕВРИРАНЕ: Воеводите организираха перфектно тактическо оттегляне без допълнителни жертви.</span><br>`;
        }
        
        roundLog += `<span style="color: #aaa;">Битката е прекратена. Армиите се завръщат в лагерите си.</span></div>`;
        state.logHistory.push(roundLog);
        window.endGroupBattle(false, "retreat");
        return;
    }

    if (actionType === 'chase_enemy') {
        // Героите преследват бягащия враг
        let totalPlayerPower = state.group.reduce((sum, h) => sum + (h.currentArmy || 0), 0);
        let bonusDamage = Math.floor(totalPlayerPower * 0.30 * (Math.random() * 0.5 + 0.5));
        
        state.enemyArmy = Math.max(0, state.enemyArmy - bonusDamage);
        roundLog += `<span style="color: #ffd700; font-weight: bold;">🏹 БЕЗМИЛОСТНО ПРЕСЛЕДВАНЕ: Твоите конни орди застигнаха отстъпващите врагове и съсякоха още ${bonusDamage} защитници!</span><br>`;
        
        if (state.enemyArmy <= 0) {
            roundLog += `<span style="color: #00ff00;">💀 Вражеската армия бе напълно унищожена по време на бягството!</span><br>`;
        }
        
        roundLog += `</div>`;
        state.logHistory.push(roundLog);
        
        if (state.enemyArmy <= 0) {
            window.endGroupBattle(true);
        } else {
            state.round++;
            window.renderBattleLayout();
        }
        return;
    }

    // СТАНДАРТЕН ЩУРМ (РУНД С БИТКА)
    let totalRoundPlayerPower = 0;
    let totalRoundEnemyDefense = state.enemyArmy * (1 + (state.region.defenseLevel || 1) * 0.15);

    // Влияние на индивидуалните способности на всеки жив воевода в групата
    state.group.forEach(hero => {
        if (hero.currentArmy <= 0) return;

        let skills = hero.skills || {};
        let pet = hero.pet || null;

        // Изчисляване базова мощ на водача
        let pPower = hero.currentArmy + (hero.heroPower || 100);

        // 💥 Способност: Военна Тактика
        if ((skills.tactics || 0) > 0) {
            let bonus = skills.tactics * 40;
            pPower += bonus;
            roundLog += `• [${hero.name}]: Военна Тактика добавя +${bonus} сила на полка.<br>`;
        }

        // 💥 Любимец: Родов Сокол (+15% мощ при щурм)
        if (pet === "falcon") {
            pPower = Math.floor(pPower * 1.15);
            roundLog += `• [${hero.name}]: Родов Сокол се рее над врага! (+15% мощ)<br>`;
        }

        // 💥 Критичен Смазващ Удар (Heavy Strike)
        let critChance = (skills.heavyStrike || 0) * 0.05;
        if (pet === "wolf") critChance += 0.10;
        if (Math.random() < critChance) {
            pPower *= 2;
            roundLog += `• <span style="color: #ffcc00;">[${hero.name}]: 💥 СМАЗВАЩ УДАР! Нанесени са 200% критични щети!</span><br>`;
        }

        // 💥 Способност: Засада
        if ((skills.ambush || 0) > 0 && Math.random() < 0.30) {
            pPower += 120;
            roundLog += `• <span style="color: #ffd700;">[${hero.name}]: [ЗАСАДА] Конница изненада фланга! (+120 сила)</span><br>`;
        }

        totalRoundPlayerPower += pPower;
    });

    // Модификатори за вражеската защита от любимци
    state.group.forEach(hero => {
        if (hero.currentArmy > 0 && hero.pet === "viper") {
            totalRoundEnemyDefense = Math.floor(totalRoundEnemyDefense * 0.98); // всяка усойница намалява с 2%
        }
    });

    // Случайни амплитуди на битката
    totalRoundPlayerPower *= (Math.random() * 0.3 + 0.85);
    totalRoundEnemyDefense *= (Math.random() * 0.3 + 0.85);

    // Пресмятане на щетите за този рунд
    let playerLossesTotal = Math.floor(totalRoundEnemyDefense * 0.18);
    let enemyLossesTotal = Math.floor(totalRoundPlayerPower * 0.22);

    // Намаляване на щетите за играча благодарение на Издръжливост и Стена от щитове
    state.group.forEach(hero => {
        if (hero.currentArmy <= 0) return;
        let skills = hero.skills || {};
        let discount = (skills.endurance || 0) * 0.04;
        if ((skills.shieldWall || 0) > 0) discount += 0.06;
        if (hero.pet === "stallion") discount += 0.10;
        if (hero.pet === "bear") discount += 0.15;

        if (discount > 0) {
            playerLossesTotal = Math.max(10, Math.floor(playerLossesTotal * (1 - discount)));
        }
    });

    // Прилагане на щетите върху врага
    state.enemyArmy = Math.max(0, state.enemyArmy - enemyLossesTotal);
    roundLog += `<span style="color: #00ffcc; font-weight: bold;">⚔️ Твоята елитна група нанесе ${enemyLossesTotal} поражения на врага.</span><br>`;

    // Разпределяне на загубите пропорционално между активните герои
    let activeHeroesCount = state.group.filter(g => g.currentArmy > 0).length;
    if (activeHeroesCount > 0) {
        let lossPerHero = Math.floor(playerLossesTotal / activeHeroesCount);
        state.group.forEach(h => {
            if (h.currentArmy > 0) {
                h.currentArmy = Math.max(0, h.currentArmy - lossPerHero);
            }
        });
        roundLog += `<span style="color: #ff3366;">📉 Вражият отпор погуби общо ${playerLossesTotal} твои бойци в този рунд.</span><br>`;
    }

    // Проверка за тактическо състояние в края на рунда
    let totalPlayerArmyLeft = state.group.reduce((sum, h) => sum + h.currentArmy, 0);

    if (state.enemyArmy > 0 && totalPlayerArmyLeft > 0) {
        // Шанс врагът да започне да бяга/отстъпва, ако е загубил над 65% от армията си
        if (state.enemyArmy < (state.initialEnemyArmy * 0.35) && Math.random() < 0.50) {
            roundLog += `<span style="color: #ffcc00; font-weight: bold;">🏳️ РАЗКОЛЕБАВАНЕ: Вражеските защитници губят кураж и започват да отстъпват!</span><br>`;
            state.enemyRetreating = true;
        }
    }

    roundLog += `</div>`;
    state.logHistory.push(roundLog);

    // Проверка за край на битката
    if (state.enemyArmy <= 0 && totalPlayerArmyLeft > 0) {
        window.endGroupBattle(true);
    } else if (totalPlayerArmyLeft <= 0) {
        window.endGroupBattle(false, "defeat");
    } else {
        // Продължаваме към следващ рунд - обновяваме панела за контроли
        state.round++;
        window.renderBattleLayout();
        
        // Ако врагът отстъпва, сменяме бутоните за избор на играча
        if (state.enemyRetreating) {
            const controls = document.getElementById('battle-controls-panel');
            if (controls) {
                controls.innerHTML = `
                    <button class="action-btn" style="background: #ffd700; color: #000; border: 1px solid #fff; padding: 15px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px;" onclick="window.processBattleAction('chase_enemy')">🏹 ПРЕСЛЕДВАЙ ВРАГА</button>
                    <button class="action-btn" style="background: #222; color: #aaa; border: 1px solid #444; padding: 15px 35px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 15px;" onclick="window.processBattleAction('retreat')">🛑 ПОЗВОЛИ ИМ ДА ИЗБЯГАТ</button>
                `;
            }
        }
    }
};

window.endGroupBattle = function(isVictory, reason = "") {
    const state = window.currentBattleState;
    if (!state) return;

    const controls = document.getElementById('battle-controls-panel');
    const logDiv = document.getElementById('heroes-battle-log');
    
    // Синхронизираме оцелелите армии обратно в паметта на играта за всеки клан
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
        // Превземане на региона
        state.region.armySize = 0;
        if (!window.playerRegions) window.playerRegions = [];
        const ownedRegionsFlat = window.playerRegions.flat();
        if (!ownedRegionsFlat.includes(state.region.name)) {
            window.playerRegions.push(state.region.name);
        }

        // Раздаване на опит на всички участници, които са оцелели
        let xpReward = 150;
        state.group.forEach(hero => {
            if (hero.currentArmy > 0 && window.gainHeroXP) {
                window.gainHeroXP(hero, xpReward);
            }
        });

        finalLog += `<h2 style="color: #00ff00; margin: 0 0 10px 0;">🎉 БЛИСТАТЕЛЕН ТРИУМФ! 🎉</h2>`;
        finalLog += `Регионът <b style="color:#fff;">"${state.region.name}"</b> е изцяло под твой контрол!<br>`;
        finalLog += `Всички оцелели воеводи получават по <b style="color:#ffd700;">+${xpReward} XP</b> за вечната слава на рода!</div>`;
        
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
            finalLog += `Твоите армии бяха напълно разбити. Оцелелите водачи се изтеглят да лижат рани.</div>`;
        }
    }

    if (logDiv) {
        logDiv.innerHTML += finalLog;
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    // Промяна на контролите за изход
    if (controls) {
        controls.innerHTML = `
            <button class="action-btn" style="background: #d4af37; color: #000; border: 1px solid #fff; padding: 15px 50px; font-weight: bold; cursor: pointer; border-radius: 4px; font-size: 16px;" onclick="window.closeBattleAndRefresh()">ЗАТВОРИ БОЙНИЯ ЕКРАН</button>
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
