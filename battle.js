/** ==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (УНИВЕРСАЛНА ВЕРСИЯ – РАБОТИ С РЕГИОНИ И ПОРТАЛИ)
========================================================================== */
(function() {
    if (!document.getElementById('battle-styles')) {
        const style = document.createElement('style');
        style.id = 'battle-styles';
        style.textContent = `
            #battle-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                font-family: 'MedievalSharp', 'Georgia', serif;
                color: #ffdd99;
            }
            .battle-header { padding: 10px; text-align: center; background: rgba(0,0,0,0.6); border-bottom: 1px solid #c9a87b; }
            .heroes-slots { display: flex; justify-content: space-around; flex-wrap: wrap; padding: 15px; gap: 10px; background: rgba(30,20,15,0.6); }
            .hero-slot { background: rgba(0,0,0,0.6); border-radius: 12px; padding: 8px; width: 100px; text-align: center; border: 1px solid #c9a87b; }
            .hero-slot-name { font-size: 12px; font-weight: bold; margin-bottom: 5px; }
            .hp-bar-container { width: 100%; height: 8px; background: #330000; border-radius: 4px; overflow: hidden; margin: 5px 0; }
            .hp-bar-fill { height: 100%; width: 100%; background: #cc3333; border-radius: 4px; transition: width 0.3s ease; }
            .vs-section { display: flex; justify-content: space-around; align-items: center; padding: 20px; background: rgba(0,0,0,0.4); margin: 10px; border-radius: 20px; }
            .army-card { text-align: center; background: rgba(0,0,0,0.5); padding: 15px; border-radius: 16px; min-width: 150px; }
            .vs-divider { font-size: 2rem; font-weight: bold; text-shadow: 0 0 5px red; }
            .battle-log { flex: 1; overflow-y: auto; padding: 10px; margin: 10px; background: rgba(0,0,0,0.5); border-radius: 12px; font-size: 12px; font-family: monospace; max-height: 200px; }
            .battle-log p { margin: 4px 0; border-left: 2px solid #ffaa44; padding-left: 8px; }
            .battle-buttons { display: flex; gap: 15px; justify-content: center; padding: 15px; background: rgba(0,0,0,0.7); position: sticky; bottom: 0; }
            .battle-btn { background: #2c1a0c; border: none; border-bottom: 3px solid #a05a2c; color: #ffdd99; font-size: 1.2rem; font-weight: bold; padding: 10px 24px; border-radius: 40px; cursor: pointer; transition: 0.1s linear; }
            .battle-btn:active { transform: translateY(2px); border-bottom-width: 1px; }
            .battle-btn.attack { background: #7a2e1a; border-bottom-color: #cc5533; }
        `;
        document.head.appendChild(style);
    }

    window.currentBattleState = null;
    window.showAdvisorMsg = window.showAdvisorMsg || function(msg) {
        console.log("СЪВЕТНИК: " + msg);
        const battleLog = document.getElementById('battle-log-content');
        if (battleLog) {
            const p = document.createElement('p');
            p.innerHTML = `📢 ${msg}`;
            battleLog.appendChild(p);
            battleLog.scrollTop = battleLog.scrollHeight;
        } else {
            alert(msg);
        }
    };

    window.startBattle = function(regionInput) {
        console.log("startBattle получи:", regionInput);
        if (!regionInput) {
            window.showAdvisorMsg("Не е посочен регион за атака!");
            return;
        }

        let regionObj = null;
        // Ако е низ, вземаме от worldData
        if (typeof regionInput === 'string') {
            if (window.worldData && window.worldData.regions && window.worldData.regions[regionInput]) {
                regionObj = window.worldData.regions[regionInput];
                regionObj.name = regionInput;
            } else {
                // Ако не е в worldData, но е низ, създаваме временен обект
                regionObj = { name: regionInput, armySize: 200, difficulty: 20 };
            }
        } 
        // Ако е обект (портал или друг)
        else if (typeof regionInput === 'object') {
            regionObj = regionInput;
            if (!regionObj.name && regionObj.id) regionObj.name = regionObj.id;
            if (!regionObj.name) regionObj.name = "Неизвестен обект";
            if (!regionObj.armySize) regionObj.armySize = 200;
            if (!regionObj.difficulty) regionObj.difficulty = 20;
        }

        if (!regionObj) {
            window.showAdvisorMsg("Невалиден регион!");
            return;
        }

        // --- Събиране на войските (разширено) ---
        let battleGroup = [];

        // 1. От текущия герой
        if (window.currentHero) {
            let army = window.currentHero.armySize || window.currentHero.currentArmy || 0;
            if (army > 0) {
                battleGroup.push({
                    name: window.currentHero.name || "Кан",
                    currentArmy: army,
                    initialArmyMax: window.currentHero.maxArmy || army,
                    isFavorite: true
                });
            }
        }

        // 2. От всички кланове в worldData
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                let army = clan.currentArmy || clan.armySize || 0;
                if (army > 0 && !battleGroup.some(h => h.name === (clan.leaderName || clan.name))) {
                    battleGroup.push({
                        name: clan.leaderName || clan.name || key,
                        currentArmy: army,
                        initialArmyMax: clan.initialArmyMax || clan.maxArmy || army,
                        isFavorite: clan.isFavorite || false
                    });
                }
            }
        }

        // 3. Ако няма войски, създаваме тестова армия
        if (battleGroup.length === 0) {
            battleGroup.push({
                name: "Кан Кубрат (Временна армия)",
                currentArmy: 500,
                initialArmyMax: 500,
                isFavorite: true
            });
            console.warn("Няма реални войски – използва се тестова армия от 500 души.");
        }

        // Филтрираме любимите (до 5)
        let finalGroup = battleGroup.filter(h => h.isFavorite === true).slice(0, 5);
        if (finalGroup.length === 0) finalGroup = battleGroup.slice(0, 5);

        let totalPlayerArmy = finalGroup.reduce((s, h) => s + h.currentArmy, 0);
        if (totalPlayerArmy === 0) {
            window.showAdvisorMsg("Нямате войска! Наемете войници в Казармите.");
            return;
        }

        let enemyArmy = regionObj.armySize || (regionObj.difficulty ? regionObj.difficulty * 15 : 200);
        
        window.currentBattleState = {
            region: regionObj,
            group: finalGroup,
            enemyArmy: enemyArmy,
            initialEnemyArmy: enemyArmy,
            initialPlayerArmy: totalPlayerArmy,
            round: 1,
            battleLog: [],
            battleActive: true
        };
        
        window.renderBattleLayout();
    };

    window.renderBattleLayout = function() {
        const state = window.currentBattleState;
        if (!state) return;

        let battleScreen = document.getElementById('battle-screen');
        if (!battleScreen) {
            battleScreen = document.createElement('div');
            battleScreen.id = 'battle-screen';
            document.body.appendChild(battleScreen);
        }

        const heroPercent = state.group.map(h => {
            let max = h.initialArmyMax || 300;
            return Math.max(0, (h.currentArmy / max) * 100);
        });
        let curPlayerTotal = state.group.reduce((s, h) => s + h.currentArmy, 0);
        let playerPercent = (state.initialPlayerArmy > 0) ? (curPlayerTotal / state.initialPlayerArmy) * 100 : 0;
        let enemyPercent = (state.initialEnemyArmy > 0) ? (state.enemyArmy / state.initialEnemyArmy) * 100 : 0;

        battleScreen.innerHTML = `
            <div class="battle-header">
                <h2>⚔️ БИТКА ЗА ${state.region.name || "региона"} ⚔️</h2>
                <div>Рунд ${state.round}</div>
            </div>
            <div class="heroes-slots">
                ${state.group.map((h, i) => `
                    <div class="hero-slot">
                        <div class="hero-slot-name">${h.name}</div>
                        <div class="hp-bar-container"><div class="hp-bar-fill" style="width:${heroPercent[i]}%"></div></div>
                        <div>${Math.floor(h.currentArmy)}/${Math.floor(h.initialArmyMax)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="vs-section">
                <div class="army-card">
                    <div>🛡️ ВАШАТА АРМИЯ</div>
                    <div class="hp-bar-container" style="width:200px;"><div class="hp-bar-fill" style="width:${playerPercent}%; background:#44aa44;"></div></div>
                    <div>Сила: ${Math.floor(curPlayerTotal)}</div>
                </div>
                <div class="vs-divider">VS</div>
                <div class="army-card">
                    <div>👹 НЕПРИЯТЕЛ</div>
                    <div class="hp-bar-container" style="width:200px;"><div class="hp-bar-fill" style="width:${enemyPercent}%; background:#dd4444;"></div></div>
                    <div>Сила: ${Math.floor(state.enemyArmy)}</div>
                </div>
            </div>
            <div class="battle-log"><div id="battle-log-content">
                ${state.battleLog.map(m => `<p>${m}</p>`).join('')}
                <p>⚔️ Битката започва!</p>
            </div></div>
            <div class="battle-buttons">
                <button class="battle-btn attack" id="battle-attack-btn">⚔️ АТАКА</button>
                <button class="battle-btn" id="battle-retreat-btn">🏃 ОТСТЪПЛЕНИЕ</button>
            </div>
        `;

        document.getElementById('battle-attack-btn').onclick = () => window.processBattleTurn();
        document.getElementById('battle-retreat-btn').onclick = () => window.retreatFromBattle();
    };

    window.processBattleTurn = function() {
        const state = window.currentBattleState;
        if (!state || !state.battleActive) return;

        let playerTotal = state.group.reduce((s, h) => s + h.currentArmy, 0);
        let dmgEnemy = Math.floor(playerTotal * (0.2 + Math.random() * 0.25));
        let dmgPlayer = Math.floor(state.enemyArmy * (0.15 + Math.random() * 0.25));

        dmgEnemy = Math.min(dmgEnemy, state.enemyArmy);
        state.enemyArmy -= dmgEnemy;

        let remain = dmgPlayer;
        for (let h of state.group) {
            if (remain <= 0) break;
            let take = Math.min(remain, h.currentArmy);
            h.currentArmy -= take;
            remain -= take;
        }

        state.battleLog.unshift(`🗡️ Вие нанасяте ${dmgEnemy} щети!`);
        state.battleLog.unshift(`💔 Врагът ви нанася ${dmgPlayer} щети!`);

        let playerAlive = state.group.some(h => h.currentArmy > 0);
        let enemyAlive = state.enemyArmy > 0;

        if (!enemyAlive) {
            state.battleActive = false;
            state.battleLog.unshift(`🏆 ПОБЕДА! ${state.region.name} е превзет!`);
            window.endBattle(true);
            return;
        }
        if (!playerAlive) {
            state.battleActive = false;
            state.battleLog.unshift(`💀 ЗАГУБА! Армията ви е унищожена!`);
            window.endBattle(false);
            return;
        }

        state.round++;
        window.renderBattleLayout();
    };

    window.retreatFromBattle = function() {
        const state = window.currentBattleState;
        if (state && state.battleActive) {
            state.battleActive = false;
            state.battleLog.unshift(`🏃 Отстъпление! Войските се изтеглят.`);
            window.endBattle(false);
        }
    };

    window.endBattle = function(isVictory) {
        const state = window.currentBattleState;
        if (!state) return;

        if (isVictory && state.region && state.region.name) {
            if (!window.playerRegions) window.playerRegions = [];
            if (!window.playerRegions.includes(state.region.name)) {
                window.playerRegions.push(state.region.name);
            }
            let goldReward = Math.floor(state.enemyArmy * 0.8);
            if (window.currentHero) {
                window.currentHero.gold = (window.currentHero.gold || 0) + goldReward;
                window.currentHero.xp = (window.currentHero.xp || 0) + 50;
            }
            window.showAdvisorMsg(`Победа! +${goldReward} злато, +50 опит.`);
        } else {
            window.showAdvisorMsg("Битката приключи. Възстановете се.");
        }

        const screen = document.getElementById('battle-screen');
        if (screen) screen.style.display = 'none';
        
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updateCharacterUI && window.currentHero) window.updateCharacterUI(window.currentHero);
        window.currentBattleState = null;
    };
})();
