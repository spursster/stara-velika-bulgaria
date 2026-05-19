/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (АДАПТИВНА МОБИЛНА БИТКА - СЛОТОВЕ ГОРЕ, HP БАРОВЕ, STICKY БУТОНИ)
СТАТУС: НАПЪЛНО ФУНКЦИОНАЛЕН И ОПТИМИЗИРАН
========================================================================== */

(function() {
    // Уникален CSS за битката (добавя се само веднъж)
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
                background: rgba(0,0,0,0.85);
                backdrop-filter: blur(8px);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                font-family: 'MedievalSharp', 'Georgia', serif;
                color: #ffdd99;
            }
            .battle-header {
                padding: 10px;
                text-align: center;
                background: rgba(0,0,0,0.5);
                border-bottom: 1px solid #c9a87b;
            }
            .heroes-slots {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                padding: 15px;
                gap: 10px;
                background: rgba(30,20,15,0.6);
            }
            .hero-slot {
                background: rgba(0,0,0,0.6);
                border-radius: 12px;
                padding: 8px;
                width: 100px;
                text-align: center;
                border: 1px solid #c9a87b;
            }
            .hero-slot-name {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .hp-bar-container {
                width: 100%;
                height: 8px;
                background: #330000;
                border-radius: 4px;
                overflow: hidden;
                margin: 5px 0;
            }
            .hp-bar-fill {
                height: 100%;
                width: 100%;
                background: #cc3333;
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            .vs-section {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 20px;
                background: rgba(0,0,0,0.4);
                margin: 10px;
                border-radius: 20px;
            }
            .army-card {
                text-align: center;
                background: rgba(0,0,0,0.5);
                padding: 15px;
                border-radius: 16px;
                min-width: 150px;
            }
            .vs-divider {
                font-size: 2rem;
                font-weight: bold;
                text-shadow: 0 0 5px red;
            }
            .battle-log {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
                margin: 10px;
                background: rgba(0,0,0,0.5);
                border-radius: 12px;
                font-size: 12px;
                font-family: monospace;
                max-height: 200px;
            }
            .battle-log p {
                margin: 4px 0;
                border-left: 2px solid #ffaa44;
                padding-left: 8px;
            }
            .battle-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                padding: 15px;
                background: rgba(0,0,0,0.7);
                position: sticky;
                bottom: 0;
            }
            .battle-btn {
                background: #2c1a0c;
                border: none;
                border-bottom: 3px solid #a05a2c;
                color: #ffdd99;
                font-size: 1.2rem;
                font-weight: bold;
                padding: 10px 24px;
                border-radius: 40px;
                cursor: pointer;
                transition: 0.1s linear;
            }
            .battle-btn:active {
                transform: translateY(2px);
                border-bottom-width: 1px;
            }
            .battle-btn.attack {
                background: #7a2e1a;
                border-bottom-color: #cc5533;
            }
        `;
        document.head.appendChild(style);
    }

    // Глобална променлива за състоянието на битката
    window.currentBattleState = null;

    // Функция за показване на съобщения (съвместимост със съществуващия код)
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

    // СТАРТИРАНЕ НА БИТКА
    window.startBattle = function(targetRegion) {
        console.log("startBattle извикана", targetRegion);
        
        // Вземане на целевия регион
        if (!targetRegion && window.currentSelectedRegion) {
            targetRegion = window.currentSelectedRegion;
        }
        if (!targetRegion) {
            window.showAdvisorMsg("Моля, изберете регион за атака!");
            return;
        }

        // Събиране на играчовите герои (само любими, макс 5)
        let allLeaders = [];
        
        if (window.worldData && window.worldData.clans) {
            allLeaders = Object.entries(window.worldData.clans)
                .filter(([key, clan]) => clan.isJoined === true || clan.isFavorite === true)
                .map(([key, clan]) => ({
                    clanKey: key,
                    name: clan.leaderName || clan.name || key,
                    clan: key,
                    currentArmy: clan.currentArmy || clan.armySize || 0,
                    initialArmyMax: clan.initialArmyMax || clan.maxArmy || 300,
                    heroPower: clan.heroPower || 100,
                    level: clan.level || 1,
                    isFavorite: clan.isFavorite || false
                }));
        } else if (window.currentHero) {
            allLeaders.push({
                clanKey: window.currentHero.clan,
                name: window.currentHero.name,
                currentArmy: window.currentHero.armySize || 0,
                initialArmyMax: 300,
                heroPower: 100,
                isFavorite: true
            });
        }

        // Филтриране на бойната група
        let battleGroup = allLeaders.filter(l => l.isFavorite === true).slice(0, 5);
        if (battleGroup.length === 0) {
            battleGroup = allLeaders.filter(l => l.currentArmy > 0).slice(0, 5);
        }

        let totalPlayerArmy = battleGroup.reduce((sum, h) => sum + h.currentArmy, 0);
        
        if (totalPlayerArmy === 0) {
            window.showAdvisorMsg("Твоите избрани воеводи нямат войска! Попълни ги в Казармите!");
            return;
        }

        // Създаване на обект за състоянието на битката
        window.currentBattleState = {
            region: targetRegion,
            group: battleGroup,
            enemyArmy: targetRegion.armySize || 200,
            initialEnemyArmy: targetRegion.armySize || 200,
            initialPlayerArmy: totalPlayerArmy,
            round: 1,
            battleLog: [],
            isPlayerTurn: true,
            battleActive: true
        };

        // Рендиране на битката
        window.renderBattleLayout();
    };

    // РЕНДИРАНЕ НА БИТКАТА
    window.renderBattleLayout = function() {
        const state = window.currentBattleState;
        if (!state) return;

        let battleScreen = document.getElementById('battle-screen');
        if (!battleScreen) {
            battleScreen = document.createElement('div');
            battleScreen.id = 'battle-screen';
            document.body.appendChild(battleScreen);
        }

        // Изчисляване на проценти живот за героите
        const heroHpPercentages = state.group.map(hero => {
            const maxArmy = hero.initialArmyMax || 300;
            return Math.max(0, (hero.currentArmy / maxArmy) * 100);
        });

        const playerHpPercent = (state.initialPlayerArmy > 0) 
            ? (state.group.reduce((sum, h) => sum + h.currentArmy, 0) / state.initialPlayerArmy) * 100 
            : 0;
        const enemyHpPercent = (state.initialEnemyArmy > 0) 
            ? (state.enemyArmy / state.initialEnemyArmy) * 100 
            : 0;

        battleScreen.innerHTML = `
            <div class="battle-header">
                <h2>⚔️ БИТКА ЗА ${state.region.name || state.region || "ЗЕМИТЕ"} ⚔️</h2>
                <div>Рунд ${state.round}</div>
            </div>
            <div class="heroes-slots" id="heroes-slots">
                ${state.group.map((hero, idx) => `
                    <div class="hero-slot">
                        <div class="hero-slot-name">${hero.name || "Воевода"}</div>
                        <div class="hp-bar-container">
                            <div class="hp-bar-fill" style="width: ${heroHpPercentages[idx]}%"></div>
                        </div>
                        <div style="font-size:10px">${Math.floor(hero.currentArmy)}/${Math.floor(hero.initialArmyMax)} войска</div>
                    </div>
                `).join('')}
            </div>
            <div class="vs-section">
                <div class="army-card">
                    <div>🛡️ ТВОЯТА АРМИЯ 🛡️</div>
                    <div class="hp-bar-container" style="width:200px; margin:10px auto;">
                        <div class="hp-bar-fill" style="width: ${playerHpPercent}%; background:#44aa44;"></div>
                    </div>
                    <div>Сила: ${Math.floor(state.group.reduce((sum, h) => sum + h.currentArmy, 0))}</div>
                </div>
                <div class="vs-divider">VS</div>
                <div class="army-card">
                    <div>👹 НЕПРИЯТЕЛ 👹</div>
                    <div class="hp-bar-container" style="width:200px; margin:10px auto;">
                        <div class="hp-bar-fill" style="width: ${enemyHpPercent}%; background:#dd4444;"></div>
                    </div>
                    <div>Сила: ${Math.floor(state.enemyArmy)}</div>
                </div>
            </div>
            <div class="battle-log" id="battle-log">
                <div id="battle-log-content">
                    ${state.battleLog.map(msg => `<p>${msg}</p>`).join('')}
                    <p>⚔️ Битката започва! ⚔️</p>
                </div>
            </div>
            <div class="battle-buttons">
                <button class="battle-btn attack" id="battle-attack-btn">⚔️ АТАКА ⚔️</button>
                <button class="battle-btn" id="battle-retreat-btn">🏃 ОТСТЪПЛЕНИЕ</button>
            </div>
        `;

        // Добавяне на функционалност към бутоните
        const attackBtn = document.getElementById('battle-attack-btn');
        const retreatBtn = document.getElementById('battle-retreat-btn');
        
        if (attackBtn) {
            attackBtn.onclick = () => window.processBattleTurn('attack');
        }
        if (retreatBtn) {
            retreatBtn.onclick = () => window.retreatFromBattle();
        }
    };

    // ОБРАБОТВАНЕ НА БИТКА
    window.processBattleTurn = function(action) {
        const state = window.currentBattleState;
        if (!state || !state.battleActive) return;

        if (action === 'attack') {
            // Изчисляване на щетите
            let playerTotal = state.group.reduce((sum, h) => sum + h.currentArmy, 0);
            let damageToEnemy = Math.floor(playerTotal * (0.2 + Math.random() * 0.2));
            let damageToPlayer = Math.floor(state.enemyArmy * (0.15 + Math.random() * 0.25));
            
            // Прилагане на щетите
            damageToEnemy = Math.min(damageToEnemy, state.enemyArmy);
            damageToPlayer = Math.min(damageToPlayer, playerTotal);
            
            state.enemyArmy -= damageToEnemy;
            
            // Разпределяне на щетите между героите пропорционално
            let remainingDamage = damageToPlayer;
            for (let hero of state.group) {
                if (remainingDamage <= 0) break;
                let heroShare = Math.min(remainingDamage, hero.currentArmy);
                hero.currentArmy -= heroShare;
                remainingDamage -= heroShare;
            }
            
            // Добавяне на лог
            state.battleLog.unshift(`🗡️ Нанасяш ${damageToEnemy} щети на врага!`);
            state.battleLog.unshift(`💔 Врагът ти отвръща с ${damageToPlayer} щети!`);
            
            // Проверка за край на битката
            let playerAlive = state.group.some(h => h.currentArmy > 0);
            let enemyAlive = state.enemyArmy > 0;
            
            if (!enemyAlive) {
                state.battleActive = false;
                state.battleLog.unshift(`🏆 ПОБЕДА! 🏆 Регионът ${state.region.name || state.region} е превзет!`);
                window.endBattle(true);
                return;
            }
            
            if (!playerAlive) {
                state.battleActive = false;
                state.battleLog.unshift(`💀 ЗАГУБА! 💀 Армията ти е разбита!`);
                window.endBattle(false);
                return;
            }
            
            state.round++;
            window.renderBattleLayout();
        }
    };

    // ОТСТЪПЛЕНИЕ
    window.retreatFromBattle = function() {
        const state = window.currentBattleState;
        if (state && state.battleActive) {
            state.battleActive = false;
            state.battleLog.unshift(`🏃 Отстъпваш от битката! Войската ти се оттегля.`);
            window.endBattle(false);
        }
    };

    // ПРИКЛЮЧВАНЕ НА БИТКАТА
    window.endBattle = function(isVictory) {
        const state = window.currentBattleState;
        if (!state) return;
        
        if (isVictory && state.region) {
            // Маркиране на региона като превзет (ако системата го поддържа)
            if (window.worldData && window.worldData.regions) {
                const regionIndex = window.worldData.regions.findIndex(r => r.id === state.region.id);
                if (regionIndex !== -1) {
                    window.worldData.regions[regionIndex].controlledBy = "player";
                }
            }
            
            // Добавяне на награди
            let goldReward = Math.floor(state.enemyArmy * 0.5);
            if (window.currentHero) {
                window.currentHero.gold = (window.currentHero.gold || 0) + goldReward;
                window.currentHero.xp = (window.currentHero.xp || 0) + 50;
            }
            window.showAdvisorMsg(`Победа! Получаваш ${goldReward} злато и 50 опит!`);
        } else {
            window.showAdvisorMsg("Битката приключи. Войската ти се нуждае от почивка.");
        }
        
        // Затваряне на екрана
        const battleScreen = document.getElementById('battle-screen');
        if (battleScreen) {
            battleScreen.style.display = 'none';
        }
        
        // Обновяване на интерфейса
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updateCharacterUI && window.currentHero) window.updateCharacterUI(window.currentHero);
        
        window.currentBattleState = null;
    };
})();
