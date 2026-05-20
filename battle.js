// ==================== battle.js – ФИНАЛНА ВЕРСИЯ С ИНДИКАТОР ЗА ПОРТАЛ ====================
(function() {
    if (!document.getElementById('battle-styles')) {
        const style = document.createElement('style');
        style.id = 'battle-styles';
        style.textContent = `
            .battle-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                backdrop-filter: blur(8px);
                z-index: 100000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'MedievalSharp', 'Georgia', monospace;
            }
            .battle-window {
                background: #1a1a2e;
                border: 3px solid #c9a87b;
                border-radius: 32px;
                padding: 20px;
                width: 500px;
                max-width: 90%;
                text-align: center;
                color: #ffdd99;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
            }
            .battle-armies {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                gap: 20px;
            }
            .army-card {
                background: rgba(0,0,0,0.6);
                border-radius: 20px;
                padding: 15px;
                flex: 1;
            }
            .hp-bar-bg {
                background: #330000;
                height: 12px;
                border-radius: 6px;
                margin: 10px 0;
                overflow: hidden;
            }
            .hp-bar-fill {
                background: #cc3333;
                height: 100%;
                width: 100%;
                transition: width 0.2s;
            }
            .battle-log {
                background: rgba(0,0,0,0.5);
                border-radius: 16px;
                padding: 10px;
                height: 150px;
                overflow-y: auto;
                text-align: left;
                font-size: 12px;
                margin: 15px 0;
            }
            .battle-btn {
                background: #2c1a0c;
                border: none;
                border-bottom: 3px solid #a05a2c;
                color: #ffdd99;
                font-size: 1.2rem;
                padding: 8px 24px;
                border-radius: 40px;
                margin: 5px;
                cursor: pointer;
                font-weight: bold;
            }
            .battle-btn:active {
                transform: translateY(2px);
                border-bottom-width: 1px;
            }
            .attack-btn {
                background: #7a2e1a;
                border-bottom-color: #cc5533;
            }
        `;
        document.head.appendChild(style);
    }

    window.startBattle = function(regionInput) {
        console.log("[БИТКА] Старт с:", regionInput);
        
        // ==================== СКРИВАНЕ НА ИНДИКАТОРА ПРИ БИТКА С ПОРТАЛ ====================
        let isPortal = false;
        if (typeof regionInput === 'string') {
            if (regionInput.includes('Портал') || regionInput.includes('портал')) isPortal = true;
        } else if (regionInput && typeof regionInput === 'object') {
            if (regionInput.name && (regionInput.name.includes('Портал') || regionInput.name.includes('портал'))) isPortal = true;
            if (regionInput.id && regionInput.id.includes('portal')) isPortal = true;
        }
        
        if (isPortal && typeof window.hidePortalIndicator === 'function') {
            window.hidePortalIndicator();
            console.log("🔴 Индикаторът за портал е скрит (битка с портал)");
        }
        
        // Премахване на стар екран
        const old = document.querySelector('.battle-overlay');
        if (old) old.remove();
        
        // Нормализиране на входа
        let regionName = "Регион";
        let enemyArmy = 200;
        if (typeof regionInput === 'string') {
            regionName = regionInput;
            if (window.worldData && window.worldData.regions && window.worldData.regions[regionInput]) {
                const reg = window.worldData.regions[regionInput];
                enemyArmy = reg.armySize || reg.difficulty * 12 || 200;
            }
        } else if (regionInput && typeof regionInput === 'object') {
            regionName = regionInput.name || regionInput.id || "Обект";
            enemyArmy = regionInput.armySize || regionInput.difficulty * 12 || 200;
        }
        
        // Определяне на армията на играча
        let playerArmy = 500;
        if (window.currentHero && window.currentHero.armySize > 0) playerArmy = window.currentHero.armySize;
        else if (window.worldData && window.worldData.clans) {
            for (let k in window.worldData.clans) {
                if (window.worldData.clans[k].isJoined && window.worldData.clans[k].armySize > 0) {
                    playerArmy = window.worldData.clans[k].armySize;
                    break;
                }
            }
        }
        
        // Създаване на UI
        const overlay = document.createElement('div');
        overlay.className = 'battle-overlay';
        overlay.innerHTML = `
            <div class="battle-window">
                <h2>⚔️ БИТКА ЗА ${regionName} ⚔️</h2>
                <div class="battle-armies">
                    <div class="army-card">
                        <div>🛡️ ТВОЯТА АРМИЯ</div>
                        <div class="hp-bar-bg"><div class="hp-bar-fill" id="player-hp-fill"></div></div>
                        <div id="player-army-num">${playerArmy}</div>
                    </div>
                    <div class="army-card">
                        <div>👹 ВРАГЪТ</div>
                        <div class="hp-bar-bg"><div class="hp-bar-fill" id="enemy-hp-fill"></div></div>
                        <div id="enemy-army-num">${enemyArmy}</div>
                    </div>
                </div>
                <div class="battle-log" id="battle-log"></div>
                <div>
                    <button class="battle-btn attack-btn" id="battle-attack">⚔️ АТАКА</button>
                    <button class="battle-btn" id="battle-retreat">🏃 ОТСТЪПЛЕНИЕ</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        let currentPlayer = playerArmy;
        let currentEnemy = enemyArmy;
        let active = true;
        const logDiv = overlay.querySelector('#battle-log');
        
        function addLog(msg) {
            const p = document.createElement('p');
            p.textContent = msg;
            p.style.margin = '4px';
            p.style.borderLeft = '2px solid #ffaa44';
            p.style.paddingLeft = '8px';
            logDiv.appendChild(p);
            logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        function updateUI() {
            const playerPercent = (currentPlayer / playerArmy) * 100;
            const enemyPercent = (currentEnemy / enemyArmy) * 100;
            overlay.querySelector('#player-hp-fill').style.width = Math.max(0, playerPercent) + '%';
            overlay.querySelector('#enemy-hp-fill').style.width = Math.max(0, enemyPercent) + '%';
            overlay.querySelector('#player-army-num').innerText = Math.floor(currentPlayer);
            overlay.querySelector('#enemy-army-num').innerText = Math.floor(currentEnemy);
            if (currentPlayer <= 0) {
                addLog("💀 ВАШАТА АРМИЯ Е УНИЩОЖЕНА! Загуба.");
                active = false;
                document.getElementById('battle-attack').disabled = true;
                setTimeout(() => overlay.remove(), 3000);
            } else if (currentEnemy <= 0) {
                addLog(`🏆 ПОБЕДА! Регионът ${regionName} е превзет!`);
                if (window.playerRegions && !window.playerRegions.includes(regionName)) window.playerRegions.push(regionName);
                if (window.currentHero) {
                    window.currentHero.gold = (window.currentHero.gold || 0) + 300;
                    window.currentHero.xp = (window.currentHero.xp || 0) + 50;
                }
                active = false;
                document.getElementById('battle-attack').disabled = true;
                setTimeout(() => overlay.remove(), 4000);
            }
        }
        
        function attack() {
            if (!active) return;
            const playerDamage = Math.floor(currentPlayer * (0.2 + Math.random() * 0.25));
            const enemyDamage = Math.floor(currentEnemy * (0.15 + Math.random() * 0.25));
            currentEnemy -= playerDamage;
            currentPlayer -= enemyDamage;
            if (currentEnemy < 0) currentEnemy = 0;
            if (currentPlayer < 0) currentPlayer = 0;
            addLog(`🗡️ Нанасяте ${playerDamage} щети. Врагът ви отвръща с ${enemyDamage}.`);
            updateUI();
        }
        
        function retreat() {
            if (!active) return;
            addLog("🏃 Отстъпвате от битката.");
            active = false;
            document.getElementById('battle-attack').disabled = true;
            setTimeout(() => overlay.remove(), 2000);
        }
        
        overlay.querySelector('#battle-attack').onclick = attack;
        overlay.querySelector('#battle-retreat').onclick = retreat;
        updateUI();
        addLog("⚔️ Битката започва! Натиснете АТАКА.");
    };
    
    console.log("✅ battle.js зареден (с поддръжка на индикатор за портал)");
})();
