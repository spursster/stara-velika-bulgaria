/**
 * МОДУЛ: БИТКИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (Корекция на родовите лидери)
 * КОРЕКЦИЯ БЪГ: Пренасочване на clan.name към clan.leader и интеграция на isJoined за дълбоката синхронизация.
 * Статистика на файловете в проекта: 16
 */

window.startBattle = function(targetRegion) {
    // ЗАЩИТА: Ако обектът targetRegion е undefined или липсва, изграждаме безопасен временен обект
    if (!targetRegion) {
        targetRegion = {
            id: "unknown_region_" + Math.floor(Math.random() * 1000),
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

    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        battleScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.96); z-index: 20000; display: flex;
            align-items: center; justify-content: center; color: white;
            font-family: 'Georgia', serif; box-sizing: border-box; padding: 10px;
        `;
        document.body.appendChild(battleScreen);
    }

    battleScreen.style.display = 'flex';

    const hero = window.currentHero || { name: "Неизвестен Кан", armySize: 100, dynasty: "Дуло", gold: 0, skills: {} };
    
    // Вземаме името на региона правилно спрямо структурата (стринг или обект)
    const regionName = typeof targetRegion === 'string' ? targetRegion : (targetRegion.name || "Чужди земи");
    
    // Зареждаме реалните данни за врага от worldData, ако съществуват
    let enemyArmy = 150;
    let defenseLvl = 1;
    if (window.worldData && window.worldData.regions && window.worldData.regions[regionName]) {
        enemyArmy = window.worldData.regions[regionName].armySize || enemyArmy;
        defenseLvl = window.worldData.regions[regionName].defenseLevel || defenseLvl;
    } else if (targetRegion && targetRegion.armySize) {
        enemyArmy = targetRegion.armySize;
        defenseLvl = targetRegion.defenseLevel || defenseLvl;
    }

    // Инициализираме RPG променливите на героя, за да сме сигурни, че способностите съществуват
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }

    battleScreen.innerHTML = `
        <div style="width: 100%; max-width: 500px; background: #050505; border: 2px solid #d4af37; padding: 20px; box-sizing: border-box; border-radius: 6px; max-height: 95vh; overflow-y: auto;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px; text-transform: uppercase; font-size: 1.2em; letter-spacing: 1px;">⚔️ ВОЕНЕН СЪВЕТ ⚔️</h2>
            <p style="text-align: center; font-size: 0.9em; color: #aaa; margin-bottom: 20px;">Настъпление срещу регион: <b style="color: #fff;">${regionName}</b></p>
            
            <div style="display: flex; justify-content: space-between; background: rgba(255,255,255,0.02); padding: 12px; border: 1px solid #222; border-radius: 4px; margin-bottom: 15px; font-size: 0.85em;">
                <div style="text-align: left;">
                    <span style="color: #4caf50; font-weight: bold;">Твоята Войска</span><br>
                    <span id="player-battle-army" style="font-size: 1.2em; font-weight: bold;">${hero.armySize}</span> воини
                </div>
                <div style="text-align: right;">
                    <span style="color: #ff4444; font-weight: bold;">Вражески Гарнизон</span><br>
                    <span id="enemy-battle-army" style="font-size: 1.2em; font-weight: bold;">${enemyArmy}</span> воини
                </div>
            </div>

            <div id="battle-log-details" style="background: #000; border: 1px solid #333; padding: 12px; min-height: 120px; max-height: 250px; overflow-y: auto; font-size: 0.8em; color: #ccc; line-height: 1.4; border-radius: 3px; margin-bottom: 15px;">
                <p style="color: #ffd700; font-style: italic; margin: 0;">Разузнавачите докладват: Врагът заема отбранителни позиции и укрепление Ранг ${defenseLvl}...</p>
            </div>

            <div id="battle-controls" style="text-align: center;">
                <button onclick="window.executeBattleSimulation('${regionName}', ${enemyArmy}, ${defenseLvl})" 
                        style="background: #a32a2a; color: white; border: 1px solid #ff4444; padding: 12px 30px; font-size: 0.95em; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; box-shadow: 0 0 10px rgba(255,0,0,0.2); width: 100%;">ВЛЕЗ В БИТКА</button>
            </div>
        </div>
    `;
};

window.executeBattleSimulation = function(regionName, enemyArmy, defenseLvl) {
    const hero = window.currentHero;
    if (!hero) return;

    const logBox = document.getElementById('battle-log-details');
    const controls = document.getElementById('battle-controls');
    if (!logBox || !controls) return;

    logBox.innerHTML = ""; // Изчистваме първоначалния текст
    let battleReport = "";

    // === ДИАГНОСТИКА НА DIABLO СПОСОБНОСТИТЕ ПРЕДИ БИТКАТА (ПРЕДВАРИТЕЛНА ФАЗА) ===
    let skills = hero.skills || {};

    // 1. Умение Sabotage (Саботаж)
    if ((skills.sabotage || 0) > 0) {
        let reduction = Math.min(defenseLvl, Math.floor(skills.sabotage * 0.5) + 1);
        defenseLvl = Math.max(1, defenseLvl - reduction);
        battleReport += `<p style="color: #ff3366;">👤 [САБОТАЖ]: Сенчестите шпиони увреждат палисадите! Защитата на региона падна на Ранг ${defenseLvl}.</p>`;
    }

    // 2. Умение Ambush (Скрита засада) & Blitzkrieg (Стремителен удар)
    if ((skills.ambush || 0) > 0 || (skills.blitzkrieg || 0) > 0) {
        let ambushDamage = Math.floor(((skills.ambush || 0) * 8) + ((skills.blitzkrieg || 0) * 12));
        enemyArmy = Math.max(5, enemyArmy - ambushDamage);
        battleReport += `<p style="color: #00ffcc;">⚔️ [ЗАСАДА]: Тактиката на светкавичен удар покоси ${ambushDamage} врагове преди боя!</p>`;
    }

    // 3. Магически способности: Тангристки огън, Верижна светкавица, Падаща звезда
    let magicLevel = (skills.tangraFire || 0) + (skills.chainLightning || 0) + (skills.meteorStrike || 0);
    if (magicLevel > 0) {
        let spellDamage = Math.floor(magicLevel * 10 * (1 + ((skills.mysticism || 0) * 0.1)));
        enemyArmy = Math.max(5, enemyArmy - spellDamage);
        battleReport += `<p style="color: #ff9900;">🔮 [МАГИЯ]: Колобърски заклинания обсипват врага! ${spellDamage} войници изгоряха в Тангристки огън.</p>`;
    }

    // === РУНДОВА СИМУЛАЦИЯ С КРИТИЧНИ УДАРИ И ЖЕЛЯЗНА КОЖА ===
    let round = 1;
    let playerArmy = hero.armySize;
    let initialPlayerArmy = playerArmy;
    let initialEnemyArmy = enemyArmy;

    // Вземаме базовите родови модификатори от mechanics.js
    const playerAttackMod = window.getPerkValue ? window.getPerkValue('attack') : 1.0;
    const playerDefenseMod = window.getPerkValue ? window.getPerkValue('defense') : 1.0;

    while (playerArmy > 0 && enemyArmy > 0 && round <= 6) {
        // --- Твоята базова изчислителна формула (ЗАПАЗЕНА) ---
        let basePlayerDmg = (playerArmy * 0.25) * playerAttackMod;
        let baseEnemyDmg = (enemyArmy * 0.20) * (1 + (defenseLvl * 0.1));

        // НАДГРАЖДАНЕ: Diablo Проверки за Смазващ удар и Критичен разрез
        let critChance = 0.05 + ((skills.criticalStrike || 0) * 0.03) + ((skills.martialFocus || 0) * 0.02);
        if (Math.random() < critChance) {
            let multiplier = ((skills.execute || 0) > 0 && (enemyArmy / initialEnemyArmy) < 0.3) ? 3 : 2;
            basePlayerDmg *= multiplier;
            battleReport += `<p style="color: #ffcc00; font-weight:bold;">💥 Рунд ${round}: КРИТИЧЕН СМАЗВАЩ УДАР (${multiplier}x щети)!</p>`;
        }

        // НАДГРАЖДАНЕ: Diablo Проверки за Кървав гняв (Атаката расте при ниско здраве)
        if ((skills.bloodRage || 0) > 0) {
            let lostRatio = 1 - (playerArmy / initialPlayerArmy);
            basePlayerDmg *= (1 + (lostRatio * (skills.bloodRage * 0.15)));
        }

        // НАДГРАЖДАНЕ: Желязна кожа и Костна броня (Защитни пасиви)
        let dmgReduction = ((skills.ironSkin || 0) * 0.03) + ((skills.boneShield || 0) * 0.04);
        baseEnemyDmg *= Math.max(0.5, 1 - dmgReduction);

        // Прилагане на финалните щети за рунда
        let roundPlayerLoss = Math.floor(baseEnemyDmg / playerDefenseMod);
        let roundEnemyLoss = Math.floor(basePlayerDmg);

        // Защита против отрицателни стойности
        if (roundPlayerLoss < 1) roundPlayerLoss = 1;
        if (roundEnemyLoss < 1) roundEnemyLoss = 1;

        playerArmy -= roundPlayerLoss;
        enemyArmy -= roundEnemyLoss;
        round++;
    }

    // Подсигуряваме, че стойностите не падат под нулата
    if (playerArmy < 0) playerArmy = 0;
    if (enemyArmy < 0) enemyArmy = 0;

    // === ФАЗА ВАМПИРИЗЪМ И НЕКРОМАНТИЯ (ЖЪТВА СЛЕД БИТКАТА) ===
    let totalEnemyKilled = initialEnemyArmy - enemyArmy;
    
    // Вграден висш вампиризъм
    let vampirismLvl = (skills.vampirism || 0);
    if (vampirismLvl > 0 && playerArmy > 0) {
        let armyHealed = Math.floor(totalEnemyKilled * (vampirismLvl * 0.04));
        playerArmy = Math.min(initialPlayerArmy, playerArmy + armyHealed);
        battleReport += `<p style="color: #ff3333; font-weight:bold;">🧛 [ВАМПИРИЗЪМ]: Абсорбирана кръв възстанови +${armyHealed} воини!</p>`;
    }

    // Некромантия: Raise Dead (Възкресяване на падналите врагове)
    if ((skills.raiseDead || 0) > 0 && playerArmy > 0) {
        let raisedSkeletons = Math.floor(totalEnemyKilled * (skills.raiseDead * 0.05));
        playerArmy += raisedSkeletons;
        battleReport += `<p style="color: #9933ff;">💀 [НЕКРОМАНТИЯ]: ${raisedSkeletons} паднали врагове станаха от гроба и се присъединиха към теб!</p>`;
    }

    // === ОПРЕДЕЛЯНЕ НА КРАЙНИЯ РЕЗУЛТАТ ===
    let isVictory = playerArmy > enemyArmy && playerArmy > 0;
    let xpGained = 0;

    if (isVictory) {
        xpGained = Math.floor((initialEnemyArmy * 3) + 50);
        
        // Награда от Икономическото дърво: Ловец на глави (Bounty Hunter)
        let goldBonus = 0;
        if ((skills.bountyHunter || 0) > 0) {
            goldBonus = Math.floor(totalEnemyKilled * (skills.bountyHunter * 2));
            hero.gold += goldBonus;
        }

        battleReport += `
            <div style="margin-top: 15px; padding: 10px; background: rgba(76,175,80,0.15); border: 1px solid #4caf50; color: #a9dfbf;">
                🎉 ВЕЛИКА ПОБЕДА! Вражеският гарнизон е разбит. Оцелели воини: <b>${playerArmy}</b>.
                ${goldBonus > 0 ? `<br>💰 [ЛОВЕЦ НА ГЛАВИ]: Събрана плячка от врага: +${goldBonus} злато!` : ""}
            </div>
        `;
        
        // Присвояваме новата войска на Кана
        hero.armySize = playerArmy;

        // Добавяне на региона към териториите на играча
        if (!window.playerRegions) window.playerRegions = [];
        const ownedRegionsFlat = window.playerRegions.flat();
        if (!ownedRegionsFlat.includes(regionName)) {
            window.playerRegions.push(regionName);
        }

        // Обновяване на състоянието на региона в глобалните данни на картата
        if (window.worldData && window.worldData.regions && window.worldData.regions[regionName]) {
            window.worldData.regions[regionName].armySize = Math.floor(Math.random() * 50) + 30; // Нов гарнизон
            
            // Ако регионът е имал владетел, увеличаваме териториите на твоя род
            if (window.worldData.clans && window.worldData.clans[hero.dynasty]) {
                window.worldData.clans[hero.dynasty].regionsOwned = window.playerRegions.flat().length;
            }
        }

    } else {
        // ИЗБЯГВАНЕ НА СМЪРТТА (Evasion / Smoke Bomb)
        let survivalChance = ((skills.evasion || 0) * 0.15) + ((skills.smokeBomb || 0) * 0.20);
        let cheatDeath = Math.random() < survivalChance;

        xpGained = Math.floor(initialEnemyArmy * 1);
        hero.armySize = 0; // Армията е заличена

        if (cheatDeath) {
            battleReport += `
                <div style="margin-top: 15px; padding: 10px; background: rgba(255,215,0,0.15); border: 1px solid #ffd700; color: #f9e79f;">
                    💨 [ИЗБЯГВАНЕ НА СМЪРТТА]: Димна завеса и светкавични рефлекси спасиха Кана от гибел! Избягахте обратно в Двореца без армия.
                </div>
            `;
        } else {
            hero.isDead = true;
            hero.slainByGod = true;
            battleReport += `
                <div style="margin-top: 15px; padding: 10px; background: rgba(255,0,0,0.15); border: 1px solid #ff0000; color: #ff9999; font-weight: bold;">
                    💀 КАТАСТРОФА: Твоята войска бе заличена! Безсмъртната душа на Кана бе отнесена в отвъдното, докато не извършите Ритуал за Възкресяване!
                </div>
            `;
        }
    }

    // Извеждане на финалния доклад в кутията
    logBox.innerHTML = battleReport;
    logBox.scrollTop = logBox.scrollHeight; // Автоматичен скрол до долу

    // Обновяване на визуалните цифри за войската в горния панел на екрана
    const pArmyText = document.getElementById('player-battle-army');
    const eArmyText = document.getElementById('enemy-battle-army');
    if (pArmyText) pArmyText.innerText = playerArmy;
    if (eArmyText) eArmyText.innerText = enemyArmy;

    // Раздаване на опит за текущия активен лидер (вика функцията от rpg_system.js с пълна родова защита)
    if (window.gainHeroXP && !hero.isDead) {
        window.gainHeroXP(hero, xpGained);
    }

    // Промяна на бутона за затваряне
    controls.innerHTML = `
        <button onclick="window.closeBattleAndRefresh()" 
                style="background: #111; color: #d4af37; border: 1px solid #d4af37; padding: 12px 30px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; width: 100%;">ПРОДЪЛЖИ СЪДБАТА СИ</button>
    `;

    // === КРИТИЧНО ИЗПРАВЛЕНИЕ: ДЪЛБОКА ГЛОБАЛНА СИНХРОНИЗАЦИЯ НА ВСИЧКИ ОТКЛЮЧЕНИ И КУПЕНИ ГЕРОИ ===
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            
            // 1. Синхронизация на текущия активен герой (Ниво, Опит, Умения, Войска, Злато)
            if (key === hero.dynasty || key === hero.id || clan.leader === hero.name || (hero.dynasty && clan.dynasty === hero.dynasty)) {
                clan.armySize = hero.armySize;
                clan.gold = hero.gold;
                clan.isDead = hero.isDead;
                clan.level = hero.level || clan.level || 1;
                clan.xp = hero.xp || clan.xp || 0;
                clan.skills = JSON.parse(JSON.stringify(hero.skills || {}));
            }
            
            // 2. ПАСИВЕН ОПИТ ЗА ОСТАНАЛИТЕ ЗАКУПЕНИ/ОТКЛЮЧЕНИ ГЕРОИ (С включена проверка за съвместимост на водачите)
            if ((clan.isUnlocked || clan.purchased || clan.unlocked || clan.isJoined) && clan.leader !== hero.name) {
                let passiveXP = Math.floor((xpGained || 0) * 0.5); // 50% пасивен опит
                clan.xp = (clan.xp || 0) + passiveXP;
                
                // Автоматично и сигурно вдигане на нива в базата данни
                let nextLevelXP = (clan.level || 1) * 100;
                while (clan.xp >= nextLevelXP) {
                    clan.xp -= nextLevelXP;
                    clan.level = (clan.level || 1) + 1;
                    nextLevelXP = (clan.level || 1) * 100; // Рекалкулиране за следващото ниво
                }
            }
        }
    }

    // КОРЕКЦИЯ: Пълна синхронизация и с масива window.unlockedLeaders, тъй като Топ 6 UI картите четат от него!
    if (window.unlockedLeaders) {
        let ulArray = Array.isArray(window.unlockedLeaders) ? window.unlockedLeaders : Object.values(window.unlockedLeaders);
        ulArray.forEach(l => {
            if (window.worldData && window.worldData.clans) {
                for (let key in window.worldData.clans) {
                    let clan = window.worldData.clans[key];
                    if (clan.leader === l.name || key === l.dynasty) {
                        l.level = clan.level;
                        l.xp = clan.xp;
                        if (clan.skills) {
                            l.skills = JSON.parse(JSON.stringify(clan.skills));
                        }
                        // Прехвърляне на бойния статус
                        if (l.name === hero.name) {
                            l.armySize = hero.armySize;
                            l.isDead = hero.isDead;
                        } else {
                            l.armySize = clan.armySize;
                            l.isDead = clan.isDead;
                        }
                    }
                }
            }
        });
    }

    // МОМЕНТАЛНО ФОРСИРАНЕ НА ОБНОВЯВАНЕТО НА ИНТЕРФЕЙСА НА ТОП 6 КАРТИТЕ
    if (window.renderTop6LeadersUI) {
        try { window.renderTop6LeadersUI(); } catch(e) { console.log("Грешка при рендер на Топ 6 лидери:", e); }
    }
    if (window.updateLeadersUI) {
        try { window.updateLeadersUI(); } catch(e) { console.log("Грешка при обновяване на лидери:", e); }
    }
};

/**
 * ЧИСТО ЗАТВАРЯНЕ НА БОЙНИЯ ЕКРАН И ОБНОВЯВАНЕ НА ИГРАТА
 */
window.closeBattleAndRefresh = function() {
    const screen = document.getElementById('battle-screen');
    if (screen) screen.style.display = 'none';

    // Пълно форсирано рендериране на интерфейса за лидерите при затваряне
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateLeadersUI) window.updateLeadersUI();

    // Ако сме завладели регион, преначертаваме картата, за да светне правилно
    if (window.openRegionsMap && document.getElementById('regions-screen')) {
        window.openRegionsMap();
    }
    
    if (window.updateCharacterUI && window.currentHero) {
        // Връщане в двореца с обновен интерфейс
        window.updateCharacterUI(window.currentHero);
    }
};
