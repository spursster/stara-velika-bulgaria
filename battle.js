/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (ФИНАЛЕН – СПЕЦИАЛНИ УМЕНИЯ НА ВОЙНИЦИТЕ + ДОМАШНИ ЛЮБИМЦИ)
ВЕРСИЯ: 5.2
==========================================================================
*/

(function() {
    // ==================== СТИЛОВЕ ====================
    if (!document.getElementById('battle-styles-v2')) {
        const style = document.createElement('style');
        style.id = 'battle-styles-v2';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

            .ultimate-battle {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                z-index: 100000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Cinzel', 'MedievalSharp', serif;
                animation: battleFadeIn 0.3s ease;
                padding: 15px;
                box-sizing: border-box;
                overflow-y: auto;
            }

            @keyframes battleFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .battle-container {
                width: 100%;
                max-width: 1200px;
                background: rgba(0,0,0,0.75);
                backdrop-filter: blur(12px);
                border-radius: 32px;
                border: 2px solid #c9a87b;
                box-shadow: 0 0 50px rgba(0,0,0,0.8);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 95vh;
                position: relative;
            }

            .close-battle-btn {
                position: absolute;
                top: 12px;
                left: 12px;
                width: 36px;
                height: 36px;
                background: rgba(0,0,0,0.6);
                border: 1px solid #ff4444;
                color: #ff4444;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                z-index: 101;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .close-battle-btn:hover {
                background: rgba(255,68,68,0.2);
                transform: scale(1.05);
            }

            .battle-header {
                background: linear-gradient(135deg, #1a1a2e, #0d0d1a);
                padding: 12px 20px;
                text-align: center;
                border-bottom: 2px solid #c9a87b;
                flex-shrink: 0;
            }

            .battle-header h1 {
                margin: 0;
                color: #ffdd99;
                font-size: 1.4rem;
                letter-spacing: 2px;
            }

            .battle-header p {
                margin: 3px 0 0;
                color: #ccaa77;
                font-size: 0.75rem;
            }

            .heroes-section {
                padding: 15px;
                background: rgba(0,0,0,0.3);
                flex-shrink: 0;
            }

            .heroes-title {
                color: #ffdd99;
                font-size: 0.85rem;
                margin-bottom: 10px;
                padding-bottom: 4px;
                border-bottom: 1px solid #c9a87b;
                display: inline-block;
            }

            .heroes-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 10px;
            }

            .hero-card {
                background: linear-gradient(145deg, rgba(30,25,20,0.9), rgba(20,15,10,0.95));
                border-radius: 14px;
                padding: 8px;
                text-align: center;
                border: 1px solid rgba(201,168,123,0.4);
                transition: all 0.2s;
            }

            .hero-icon {
                font-size: 28px;
            }

            .hero-name {
                font-weight: bold;
                color: #ffdd99;
                font-size: 11px;
            }

            .hero-class {
                font-size: 8px;
                color: #ccaa77;
            }

            .hp-bar-bg {
                background: #2a1a0a;
                height: 6px;
                border-radius: 3px;
                margin: 6px 0;
                overflow: hidden;
            }

            .hp-bar-fill {
                background: linear-gradient(90deg, #cc3333, #ff5555);
                height: 100%;
                width: 100%;
                border-radius: 3px;
                transition: width 0.3s ease;
            }

            .hero-hp-text {
                font-size: 9px;
                color: #ffaa66;
            }

            .hero-power {
                font-size: 8px;
                color: #aa8866;
                margin-top: 3px;
            }

            .action-buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
                padding: 15px;
                flex-wrap: wrap;
                flex-shrink: 0;
            }

            .battle-btn {
                background: #2c1a0c;
                border: none;
                border-bottom: 3px solid #a05a2c;
                color: #ffdd99;
                font-size: 0.9rem;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 40px;
                cursor: pointer;
                transition: 0.1s linear;
                font-family: inherit;
                min-width: 110px;
            }

            .battle-btn:active {
                transform: translateY(2px);
                border-bottom-width: 1px;
            }

            .attack-btn {
                background: #7a2e1a;
                border-bottom-color: #cc5533;
            }

            .vs-section {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px 15px;
                flex-shrink: 0;
            }

            .monster-card {
                background: linear-gradient(145deg, rgba(50,20,20,0.95), rgba(30,10,10,0.98));
                border-radius: 20px;
                padding: 15px;
                text-align: center;
                flex: 1;
                max-width: 300px;
                margin: 0 auto;
                border: 2px solid #ff4444;
            }

            .monster-icon {
                font-size: 40px;
            }

            .monster-name {
                font-size: 16px;
                font-weight: bold;
                color: #ff6666;
            }

            .monster-power {
                font-size: 11px;
                color: #cc8888;
            }

            .battle-log-section {
                padding: 12px 15px;
                background: rgba(0,0,0,0.4);
                flex-shrink: 0;
            }

            .battle-log-title {
                color: #ffdd99;
                font-size: 11px;
                margin-bottom: 6px;
            }

            .battle-log {
                background: rgba(0,0,0,0.5);
                border-radius: 12px;
                padding: 8px;
                height: 100px;
                overflow-y: auto;
                font-size: 10px;
                font-family: monospace;
            }

            .battle-log p {
                margin: 3px 0;
                border-left: 2px solid #ffaa44;
                padding-left: 6px;
                color: #ddccaa;
            }

            @media (max-width: 700px) {
                .ultimate-battle { padding: 8px; }
                .heroes-grid { gap: 5px; }
                .hero-icon { font-size: 20px; }
                .hero-name { font-size: 9px; }
                .hero-class { font-size: 7px; }
                .hero-power { font-size: 7px; }
                .monster-icon { font-size: 30px; }
                .monster-name { font-size: 13px; }
                .battle-btn { padding: 6px 12px; font-size: 0.75rem; min-width: 80px; }
                .action-buttons { gap: 8px; padding: 10px; }
                .battle-log { height: 80px; font-size: 9px; }
                .close-battle-btn { width: 30px; height: 30px; font-size: 14px; top: 8px; left: 8px; }
            }

            @media (max-width: 480px) {
                .heroes-grid { grid-template-columns: repeat(5, 1fr); gap: 4px; }
                .hero-card { padding: 4px; }
                .hero-icon { font-size: 16px; }
                .hero-name { font-size: 7px; }
                .battle-btn { padding: 5px 8px; font-size: 0.65rem; min-width: 65px; }
                .monster-card { padding: 10px; }
                .monster-icon { font-size: 24px; }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== ПОМОЩНА ФУНКЦИЯ ЗА ЕФЕКТИТЕ НА ВОЙНИЦИТЕ ====================
    function getTroopSpecialEffects(hero) {
        if (!hero || !hero.armyDetails || !window.ALL_TROOP_TYPES) return {};
        let effects = {
            lifeSteal: 0,
            critChanceBonus: 0,
            damageReduction: 0,
            firstStrikeBonus: 0,
            nightFuryBonus: 0,
            hasSplash: false,
            hasDoubleCast: false,
            hasInvincibleOnce: false,
            hasTimeSkip: false,
            hasArmyShrink: false
        };
        for (let troop of window.ALL_TROOP_TYPES) {
            let count = hero.armyDetails[troop.id] || 0;
            if (count > 0 && troop.special) {
                let parts = troop.special.split(':');
                let key = parts[0];
                let value = parts[1] ? parseFloat(parts[1]) : null;
                switch(key) {
                    case "lifeSteal": if (value) effects.lifeSteal = Math.max(effects.lifeSteal, value); break;
                    case "critChance": if (value) effects.critChanceBonus = Math.max(effects.critChanceBonus, value); break;
                    case "damageReduction": if (value) effects.damageReduction = Math.max(effects.damageReduction, value); break;
                    case "firstStrikeBonus": if (value) effects.firstStrikeBonus = Math.max(effects.firstStrikeBonus, value); break;
                    case "nightFury": if (value) effects.nightFuryBonus = Math.max(effects.nightFuryBonus, value); break;
                    case "splashDamage": effects.hasSplash = true; break;
                    case "doubleCast": effects.hasDoubleCast = true; break;
                    case "invincibleOnce": effects.hasInvincibleOnce = true; break;
                    case "timeSkip": effects.hasTimeSkip = true; break;
                    case "armyShrink": effects.hasArmyShrink = true; break;
                }
            }
        }
        return effects;
    }

    // ==================== ПОМОЩНА ФУНКЦИЯ ЗА ЕФЕКТИТЕ НА ДОМАШЕН ЛЮБИМЕЦ ====================
    function getPetEffects(hero) {
        if (!hero || !hero.clanObj || !hero.clanObj.pet) return {};
        let petId = hero.clanObj.pet;
        let effects = {
            reviveChance: 0,
            extraTurnChance: 0,
            damageBonus: 0,
            critChanceBonus: 0,
            lifeSteal: 0,
            damageReduction: 0,
            goldBonus: 0,
            fireDamage: 0,
            coldDamage: 0,
            healAllies: 0
        };
        if (window.divinePets && window.divinePets[petId]) {
            let pet = window.divinePets[petId];
            if (pet.bonus) {
                if (pet.bonus.reviveChance) effects.reviveChance = pet.bonus.reviveChance;
                if (pet.bonus.extraTurn) effects.extraTurnChance = pet.bonus.extraTurn;
                if (pet.bonus.fireDamage) effects.fireDamage = pet.bonus.fireDamage;
                if (pet.bonus.coldDamage) effects.coldDamage = pet.bonus.coldDamage;
                if (pet.bonus.critChance) effects.critChanceBonus = pet.bonus.critChance;
                if (pet.bonus.lifeSteal) effects.lifeSteal = pet.bonus.lifeSteal;
                if (pet.bonus.damageReduction) effects.damageReduction = pet.bonus.damageReduction;
                if (pet.bonus.goldBonus) effects.goldBonus = pet.bonus.goldBonus;
                if (pet.bonus.healAllies) effects.healAllies = pet.bonus.healAllies;
            }
        } else if (window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[petId]) {
            let pet = window.rpgDatabase.petsDatabase[petId];
            if (pet.name === "Родов Сокол") effects.damageBonus = 0.15;
            if (pet.name === "Вълк Единак") effects.critChanceBonus = 0.10;
            if (pet.name === "Степен Жребец") effects.damageReduction = 0.15;
            if (pet.name === "Балканска Мечка") { /* defense bonus handled in recalculateHeroPower */ }
        }
        return effects;
    }

    // ==================== ОСНОВНА ФУНКЦИЯ ====================
    window.startBattle = function(regionInput) {
        console.log("⚔️ startBattle извикана с:", regionInput);

        let regionName = "Регион";
        let enemyPower = 200;
        let enemyHp = 200;

        if (typeof regionInput === 'string') {
            regionName = regionInput;
            if (window.worldData && window.worldData.regions && window.worldData.regions[regionInput]) {
                const reg = window.worldData.regions[regionInput];
                let basePower = reg.armySize || 100;
                let defenseBonus = (reg.defenseLevel || 1) * 10;
                enemyPower = Math.max(50, basePower + defenseBonus);
                enemyHp = enemyPower;
                regionName = reg.name || regionInput;
            }
        } else if (regionInput && typeof regionInput === 'object') {
            regionName = regionInput.name || regionInput.id || "Портал";
            enemyPower = regionInput.armySize || regionInput.difficulty * 12 || 200;
            enemyHp = enemyPower;
        }

        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(clan);
                    let calculatedPower = clan.heroPower || 100;
                    if (window.recalculateHeroPower) calculatedPower = window.recalculateHeroPower(clan);
                    let classBonus = 1.0;
                    if (clan.classBonuses && clan.currentClass) {
                        const classData = window.hybridClasses?.find(c => c.name === clan.currentClass);
                        if (classData?.bonuses?.heroPower) calculatedPower += classData.bonuses.heroPower;
                        if (classData?.bonuses?.armyBonus) classBonus += classData.bonuses.armyBonus;
                    }
                    let armySize = clan.armySize || clan.currentArmy || 300;
                    let finalPower = Math.floor(calculatedPower * classBonus * (armySize / 300));
                    finalPower = Math.max(50, finalPower);
                    heroes.push({
                        id: key,
                        name: clan.leaderName || clan.name || key,
                        className: clan.currentClass || "Воевода",
                        power: finalPower,
                        hp: 100,
                        maxHp: 100,
                        icon: "⚔️",
                        armySize: armySize,
                        clanObj: clan,
                        troopEffects: getTroopSpecialEffects(clan)
                    });
                }
            }
        }

        if (heroes.length === 0 && window.currentHero) {
            let heroPower = window.currentHero.heroPower || 100;
            let armySize = window.currentHero.armySize || 300;
            heroes.push({
                id: window.currentHero.clan || "hero",
                name: window.currentHero.name || "Воевода",
                className: window.currentHero.currentClass || "Багатур",
                power: Math.max(50, heroPower),
                hp: 100,
                maxHp: 100,
                icon: "⚔️",
                armySize: armySize,
                clanObj: window.currentHero,
                troopEffects: getTroopSpecialEffects(window.currentHero)
            });
        }

        const battleHeroes = heroes.slice(0, 5);
        if (battleHeroes.length === 0) {
            if (window.showAdvisorMsg) window.showAdvisorMsg("Нямате отключени герои за битка!");
            return;
        }

        window._lastBattleHeroes = battleHeroes;
        window.currentBattleState = { group: battleHeroes, monster: null };

        const monster = {
            name: regionName,
            power: enemyPower,
            hp: enemyHp,
            maxHp: enemyHp,
            icon: "👹"
        };
        if (window.currentBattleState) window.currentBattleState.monster = monster;

        const oldScreen = document.getElementById('ultimate-battle-screen');
        if (oldScreen) oldScreen.remove();

        const battleScreen = document.createElement('div');
        battleScreen.id = 'ultimate-battle-screen';
        battleScreen.className = 'ultimate-battle';

        let heroesHtml = '';
        for (let i = 0; i < 5; i++) {
            let hero = battleHeroes[i];
            if (hero) {
                heroesHtml += `
                    <div class="hero-card" data-id="${hero.id}">
                        <div class="hero-icon">${hero.icon}</div>
                        <div class="hero-name">${hero.name.substring(0, 12)}</div>
                        <div class="hero-class">${hero.className}</div>
                        <div class="hp-bar-bg">
                            <div class="hp-bar-fill" id="hp-${hero.id}" style="width: 100%"></div>
                        </div>
                        <div class="hero-hp-text" id="hp-text-${hero.id}">❤️ ${hero.hp}/${hero.maxHp}</div>
                        <div class="hero-power">⚔️ ${hero.power}</div>
                    </div>
                `;
            } else {
                heroesHtml += `
                    <div class="hero-card" style="opacity: 0.5;">
                        <div class="hero-icon">❓</div>
                        <div class="hero-name">Празен слот</div>
                        <div class="hero-class">---</div>
                        <div class="hp-bar-bg"><div class="hp-bar-fill" style="width: 0%"></div></div>
                        <div class="hero-hp-text">❤️ 0/0</div>
                        <div class="hero-power">⚔️ 0</div>
                    </div>
                `;
            }
        }

        battleScreen.innerHTML = `
            <div class="battle-container">
                <button class="close-battle-btn" id="close-battle-btn">✕</button>
                <div class="battle-header">
                    <h1>⚔️ ЕПИЧНА БИТКА ⚔️</h1>
                    <p>${battleHeroes.length} войни срещу ${monster.name}</p>
                </div>
                <div class="heroes-section">
                    <div class="heroes-title">🏰 ВОЙНИТЕ НА КАНА 🏰</div>
                    <div class="heroes-grid" id="heroes-grid">${heroesHtml}</div>
                </div>
                <div class="action-buttons">
                    <button class="battle-btn attack-btn" id="battle-attack">⚔️ АТАКА ⚔️</button>
                    <button class="battle-btn" id="battle-retreat">🏃 ОТСТЪПЛЕНИЕ</button>
                    <button class="battle-btn" id="battle-reset">🔄 НОВА БИТКА</button>
                </div>
                <div class="vs-section">
                    <div class="monster-card">
                        <div class="monster-icon">${monster.icon}</div>
                        <div class="monster-name">${monster.name}</div>
                        <div class="monster-power">💪 ${monster.power} сила</div>
                        <div class="hp-bar-bg" style="margin-top: 8px;">
                            <div class="hp-bar-fill" id="monster-hp-fill" style="width: 100%; background: linear-gradient(90deg, #dd4444, #ff6666);"></div>
                        </div>
                        <div class="hero-hp-text" id="monster-hp-text">❤️ ${monster.hp}/${monster.maxHp}</div>
                    </div>
                </div>
                <div class="battle-log-section">
                    <div class="battle-log-title">📜 БОЕН ДНЕВНИК</div>
                    <div class="battle-log" id="battle-log"></div>
                </div>
            </div>
        `;

        document.body.appendChild(battleScreen);
        document.getElementById('close-battle-btn').onclick = () => battleScreen.remove();

        let currentHeroes = battleHeroes.map(h => ({ ...h }));
        let currentMonster = { ...monster };
        let battleActive = true;
        let currentRound = 1;
        let invincibleUsed = {};

        function updateUI() {
            currentHeroes.forEach(hero => {
                const fillEl = document.getElementById(`hp-${hero.id}`);
                const textEl = document.getElementById(`hp-text-${hero.id}`);
                if (fillEl) {
                    const percent = (hero.hp / hero.maxHp) * 100;
                    fillEl.style.width = `${Math.max(0, percent)}%`;
                }
                if (textEl) textEl.innerHTML = `❤️ ${Math.max(0, hero.hp)}/${hero.maxHp}`;
            });
            const monsterFill = document.getElementById('monster-hp-fill');
            const monsterText = document.getElementById('monster-hp-text');
            if (monsterFill) {
                const percent = (currentMonster.hp / currentMonster.maxHp) * 100;
                monsterFill.style.width = `${Math.max(0, percent)}%`;
            }
            if (monsterText) monsterText.innerHTML = `❤️ ${Math.max(0, currentMonster.hp)}/${currentMonster.maxHp}`;
        }

        function addLog(message, isError = false) {
            const logDiv = document.getElementById('battle-log');
            if (logDiv) {
                const p = document.createElement('p');
                p.innerHTML = message;
                if (isError) p.style.color = '#ff8888';
                logDiv.appendChild(p);
                logDiv.scrollTop = logDiv.scrollHeight;
                while (logDiv.children.length > 15) logDiv.removeChild(logDiv.firstChild);
            }
        }

        function screenShake() {
            const container = document.querySelector('.battle-container');
            if (container) {
                container.style.transform = 'translateX(4px)';
                setTimeout(() => container.style.transform = 'translateX(-3px)', 50);
                setTimeout(() => container.style.transform = 'translateX(2px)', 100);
                setTimeout(() => container.style.transform = 'translateX(0)', 150);
            }
        }

        function animateHero(heroId) {
            const card = document.querySelector(`.hero-card[data-id="${heroId}"]`);
            if (card) {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.style.transform = '', 120);
            }
        }

        function animateMonster() {
            const monsterCard = document.querySelector('.monster-card');
            if (monsterCard) {
                monsterCard.style.transform = 'scale(0.97)';
                setTimeout(() => monsterCard.style.transform = '', 120);
            }
        }

        function applyArmyLossFromDamage(hero, damagePercent) {
            if (!hero.clanObj) return;
            let armyLossPercent = damagePercent * 0.5;
            let currentArmy = hero.clanObj.armySize || hero.armySize || 300;
            let newArmy = Math.max(10, Math.floor(currentArmy * (1 - armyLossPercent)));
            hero.clanObj.armySize = newArmy;
            hero.clanObj.currentArmy = newArmy;
            hero.armySize = newArmy;
            if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero.clanObj);
            addLog(`   📉 ${hero.name} загуби ${Math.floor(armyLossPercent * 100)}% от армията си! Остава: ${newArmy} войници.`);
        }

        function heroesAttack() {
            if (!battleActive) return false;
            let totalDamage = 0;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            if (aliveHeroes.length === 0) return false;

            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`🏹 РУНД ${currentRound} - ГЕРОИТЕ АТАКУВАТ!`);

            let isNight = true;
            if (window.gameTime) isNight = (window.gameTime.seasonIndex === 3);

            aliveHeroes.forEach(hero => {
                if (currentMonster.hp <= 0) return;
                let baseDamage = Math.max(1, Math.floor(hero.power * (0.5 + Math.random() * 0.7)));
                let effects = hero.troopEffects || {};
                let damageMultiplier = 1.0;
                let critChance = 0.15;
                let isFirstStrike = (currentRound === 1);
                
                if (effects.firstStrikeBonus && isFirstStrike) {
                    damageMultiplier += effects.firstStrikeBonus;
                    addLog(`   ⚡ ${hero.name} използва Пикиране (първи удар)!`);
                }
                if (effects.nightFuryBonus && isNight) {
                    damageMultiplier += effects.nightFuryBonus;
                    addLog(`   🌙 ${hero.name} активира Нощна ярост!`);
                }
                if (effects.critChanceBonus) critChance += effects.critChanceBonus;
                
                // Пет ефекти
                let petEffects = getPetEffects(hero);
                if (petEffects.damageBonus) {
                    damageMultiplier += petEffects.damageBonus;
                    addLog(`   🐾 ${hero.name} получава бонус щети от любимеца си!`);
                }
                if (petEffects.critChanceBonus) critChance += petEffects.critChanceBonus;
                if (petEffects.fireDamage) {
                    let fireBonus = petEffects.fireDamage;
                    addLog(`   🔥 ${hero.name} добавя ${fireBonus} огнени щети от любимеца!`);
                    baseDamage += fireBonus;
                }
                
                let finalDamage = Math.floor(baseDamage * damageMultiplier);
                let isCrit = Math.random() < critChance;
                if (isCrit) finalDamage = Math.floor(finalDamage * 1.8);
                
                // Life steal от войници и от pet
                let totalLifeSteal = effects.lifeSteal;
                if (petEffects.lifeSteal) totalLifeSteal += petEffects.lifeSteal;
                if (totalLifeSteal > 0) {
                    let healAmount = Math.floor(finalDamage * totalLifeSteal);
                    if (healAmount > 0) {
                        hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
                        addLog(`   💚 ${hero.name} възстановява ${healAmount} живот (Кръвопиец/Любимец)!`);
                    }
                }
                
                totalDamage += finalDamage;
                currentMonster.hp = Math.max(0, currentMonster.hp - finalDamage);
                addLog(`   ⚔️ ${hero.name} нанася ${finalDamage} щети${isCrit ? ' 💥 КРИТИЧЕН!' : ''}`);
                animateHero(hero.id);
            });

            addLog(`📊 ОБЩО: ${totalDamage} щети`);

            if (currentMonster.hp <= 0) {
                addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                addLog(`🏆 ПОБЕДА! ${monster.name} е победен! 🏆`);
                
                let totalXP = 50 + Math.floor(Math.random() * 100);
                let totalGold = 100 + Math.floor(Math.random() * 200);
                const livingHeroes = currentHeroes.filter(h => h.hp > 0);
                livingHeroes.forEach(hero => {
                    let heroXP = Math.floor(totalXP / livingHeroes.length);
                    let heroGold = Math.floor(totalGold / livingHeroes.length);
                    if (window.gainHeroXP) window.gainHeroXP(hero.clanObj, heroXP);
                    else hero.clanObj.xp = (hero.clanObj.xp || 0) + heroXP;
                    hero.clanObj.gold = (hero.clanObj.gold || 0) + heroGold;
                    addLog(`   🎁 ${hero.name} получава +${heroXP} XP и +${heroGold} злато!`);
                });
                
                if (typeof regionName === 'string' && regionName !== "Портал") {
                    if (!window.playerRegions) window.playerRegions = [];
                    let ownedRegions = window.playerRegions.flat();
                    if (!ownedRegions.includes(regionName)) {
                        window.playerRegions.push(regionName);
                        addLog(`   🏰 ${regionName} е добавен към вашите владения!`);
                        if (window.addWorldEvent) window.addWorldEvent(`🏰 ЗАВЛАДЯВАНЕ`, `Вие завладяхте ${regionName}!`, "🏰");
                        if (window.worldData && window.worldData.regions && window.worldData.regions[regionName]) {
                            window.worldData.regions[regionName].armySize = 0;
                        }
                    } else {
                        addLog(`   ℹ️ ${regionName} вече е ваш.`);
                    }
                }
                
                if (Math.random() < 0.2 && window.historicalArtifacts) {
                    const artifactKeys = Object.keys(window.historicalArtifacts);
                    const randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
                    const newArtifact = { ...window.historicalArtifacts[randomKey] };
                    const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                    if (randomHero && randomHero.clanObj) {
                        if (!randomHero.clanObj.inventory) randomHero.clanObj.inventory = [];
                        randomHero.clanObj.inventory.push(newArtifact);
                        addLog(`   🏺 ${randomHero.name} намери артефакт: ${newArtifact.name}!`);
                        if (window.addWorldEvent) window.addWorldEvent(`🏺 НАМЕРЕН АРТЕФАКТ`, `${randomHero.name} намери ${newArtifact.name} след битката!`, "🏺");
                    }
                }
                
                if (Math.random() < 0.15 && window.fantasyRaces && window.fantasyRaces.length > 0) {
                    const randomRace = window.fantasyRaces[Math.floor(Math.random() * window.fantasyRaces.length)];
                    const prisoner = {
                        id: Date.now() + "_" + Math.random(),
                        name: randomRace.name,
                        raceId: randomRace.id,
                        icon: randomRace.icon,
                        desc: randomRace.desc,
                        bonus: randomRace.bonus,
                        capturedFrom: monster.name
                    };
                    if (!window.prisoners) window.prisoners = [];
                    window.prisoners.push(prisoner);
                    addLog(`   👸 Взехте пленник: ${prisoner.name}! Може да се ожените в дипломацията.`);
                    if (window.addWorldEvent) window.addWorldEvent(`👸 ПЛЕННИК`, `След битката с ${monster.name}, взехте ${prisoner.name} като пленник!`, "👸");
                }
                
                if (regionInput && regionInput.isPortalWorld) {
                    const extraBonus = 50 + Math.floor(Math.random() * 100);
                    const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                    if (randomHero) {
                        randomHero.clanObj.gold += extraBonus;
                        addLog(`   🌌 ПОРТАЛЕН БОНУС: ${randomHero.name} получава +${extraBonus} злато от мистичния свят!`);
                    }
                }
                
                if (window.addWorldEvent) window.addWorldEvent(`🏆 ПОБЕДА В БИТКА`, `${battleHeroes.map(h => h.name).join(', ')} победиха ${monster.name}!`, "🏆");
                
                battleActive = false;
                const attackBtn = document.getElementById('battle-attack');
                if (attackBtn) attackBtn.disabled = true;
                if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
                if (typeof window.renderTop6LeadersUI === 'function') window.renderTop6LeadersUI();
                if (typeof window.hidePortalIndicator === 'function') window.hidePortalIndicator();
                if (typeof window.endGroupBattle === 'function') window.endGroupBattle(true, 'victory');
                window.currentBattleState = null;
                window._lastBattleHeroes = null;
                return true;
            }
            updateUI();
            return true;
        }

        function monsterAttack() {
            if (!battleActive) return false;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            if (aliveHeroes.length === 0) return false;
            
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            let damage = Math.floor(currentMonster.power * (0.35 + Math.random() * 0.55));
            damage = Math.max(1, damage);
            
            let effects = target.troopEffects || {};
            if (effects.damageReduction) {
                let reduced = Math.floor(damage * (1 - effects.damageReduction));
                addLog(`   🛡️ ${target.name} намалява щетите с ${Math.floor(effects.damageReduction*100)}% (Каменна кожа)!`);
                damage = reduced;
            }
            
            // Проверка за invincibleOnce
            if (effects.hasInvincibleOnce && !invincibleUsed[target.id]) {
                invincibleUsed[target.id] = true;
                damage = 0;
                addLog(`   ✨ ${target.name} става непробиваем този рунд (Каменен трол)!`);
            }
            
            // Пет ефект за намаляване на щетите
            let petEffects = getPetEffects(target);
            if (petEffects.damageReduction) {
                damage = Math.floor(damage * (1 - petEffects.damageReduction));
                addLog(`   🛡️ ${target.name} намалява щетите с ${Math.floor(petEffects.damageReduction*100)}% от любимеца!`);
            }
            
            let damagePercent = damage / target.maxHp;
            target.hp = Math.max(0, target.hp - damage);
            applyArmyLossFromDamage(target, damagePercent);
            
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`👹 ЧУДОВИЩЕТО АТАКУВА ${target.name.toUpperCase()}!`);
            addLog(`   💔 Нанася ${damage} щети (${Math.floor(damagePercent * 100)}% от живота)`);
            animateMonster();
            screenShake();
            
            if (target.hp <= 0) {
                // Опит за възкресение от pet
                let petEffects = getPetEffects(target);
                if (petEffects.reviveChance && Math.random() < petEffects.reviveChance) {
                    target.hp = Math.floor(target.maxHp * 0.3);
                    addLog(`   🔥 ${target.name} се възкресява от любимеца си! (${target.hp} HP)`);
                } else {
                    addLog(`   💀 ${target.name} е нокаутиран! 💀`, true);
                    applyArmyLossFromDamage(target, 0.5);
                }
            }
            
            updateUI();
            
            const stillAlive = currentHeroes.some(h => h.hp > 0);
            if (!stillAlive) {
                addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                addLog(`💀 ЗАГУБА! Всички герои са победени! 💀`, true);
                battleActive = false;
                const attackBtn = document.getElementById('battle-attack');
                if (attackBtn) attackBtn.disabled = true;
                if (typeof window.endGroupBattle === 'function') window.endGroupBattle(false, 'defeat');
                window.currentBattleState = null;
                window._lastBattleHeroes = null;
                return false;
            }
            return true;
        }

        async function battleTurn() {
            if (!battleActive) {
                addLog(`Битката е приключила! Натисни "НОВА БИТКА".`);
                return;
            }
            heroesAttack();
            if (currentMonster.hp <= 0) return;
            await new Promise(r => setTimeout(r, 250));
            monsterAttack();
            currentRound++;
            updateUI();
        }

        function retreat() {
            if (!battleActive) { addLog(`Битката вече е приключила.`); return; }
            addLog(`🏃 Отстъпление! Героите се изтеглят...`);
            currentHeroes.forEach(hero => {
                if (hero.hp > 0) applyArmyLossFromDamage(hero, 0.2);
            });
            battleActive = false;
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = true;
            if (typeof window.endGroupBattle === 'function') window.endGroupBattle(false, 'retreat');
            window.currentBattleState = null;
            window._lastBattleHeroes = null;
            setTimeout(() => battleScreen.remove(), 1500);
        }

        function resetBattle() {
            currentHeroes = battleHeroes.map(h => ({ ...h, hp: h.maxHp, armySize: h.armySize }));
            currentMonster = { ...monster };
            battleActive = true;
            currentRound = 1;
            invincibleUsed = {};
            updateUI();
            const logDiv = document.getElementById('battle-log');
            if (logDiv) logDiv.innerHTML = '';
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`✨ БИТКАТА ЗАПОЧВА ОТНОВО! ✨`);
            addLog(`🏰 ${battleHeroes.length} войни срещу ${monster.name}!`);
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = false;
        }

        document.getElementById('battle-attack').onclick = () => battleTurn();
        document.getElementById('battle-retreat').onclick = () => retreat();
        document.getElementById('battle-reset').onclick = () => resetBattle();

        addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        addLog(`⚔️ БИТКАТА ЗАПОЧВА! ⚔️`);
        addLog(`🏰 ${battleHeroes.length} войни срещу ${monster.name}!`);
        addLog(`📌 Натисни "АТАКА" за рунд!`);
        addLog(`⚠️ ВНИМАНИЕ: Загубата на живот намалява армията ви!`);
        updateUI();
        console.log("✅ Битката е готова (с поддръжка на специални умения и домашни любимци)!");
    };
    console.log("✅ battle.js зареден (финална версия с поддръжка на домашни любимци)");
})();
