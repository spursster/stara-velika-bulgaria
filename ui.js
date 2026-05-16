/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: ФИКСИРАН (Времето и блокът на владетеля работят безотказно при старт и нов ход)
 * Статистика на файловете в проекта: 16
 */

window.eventHistory = [];  
window.seasons = ["Пролет", "Лято", "Есен", "Зима"];

/**
 * Функция за динамично намиране на владетеля с най-голям опит в държавата
 */
window.getMostExperiencedRuler = function() {
    let leaders = [];
    
    // 1. Добавяме главния владетел (Кан)
    if (window.currentHero) {
        leaders.push({
            name: window.currentHero.name,
            dynasty: window.currentHero.dynasty,
            level: window.currentHero.level || 1,
            xp: window.currentHero.xp || 0,
            isMain: true
        });
    }
    
    // 2. Добавяме водачите от Палатата на експедициите, ако съществуват
    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach(ml => {
            leaders.push({
                name: ml.name,
                dynasty: ml.dynasty,
                level: ml.level || 1,
                xp: ml.xp || 0,
                isMain: false
            });
        });
    }
    
    if (leaders.length === 0) return null;
    
    // Сортираме в низходящ ред: първо по Ниво, а при равни нива — по XP
    leaders.sort((a, b) => {
        if (b.level !== a.level) {
            return b.level - a.level;
        }
        return b.xp - a.xp;
    });
    
    return leaders[0];
};

/**
 * Рендериране на блока за най-опитен владетел под лентата с времето
 */
window.renderMostExperiencedRulerUI = function() {
    // Търсим контейнера за времето, за да закачим блока под него
    const timeEl = document.getElementById('game-time-display');
    if (!timeEl) return;

    let leaderBox = document.getElementById('most-experienced-ruler-box');
    if (!leaderBox) {
        leaderBox = document.createElement('div');
        leaderBox.id = 'most-experienced-ruler-box';
        leaderBox.style.cssText = `
            margin: 10px auto;
            padding: 8px 12px;
            background: linear-gradient(135deg, #1c1401, #2b1f04);
            border: 1px solid #d4af37;
            border-radius: 6px;
            width: fit-content;
            min-width: 220px;
            text-align: center;
            box-shadow: 0 0 10px rgba(212,175,55,0.3);
            font-family: 'Georgia', serif;
        `;
        // Безопасно вмъкване веднага след времето
        timeEl.parentNode.insertBefore(leaderBox, timeEl.nextSibling);
    }

    const topLeader = window.getMostExperiencedRuler();
    if (!topLeader) {
        leaderBox.style.display = 'none';
        return;
    }

    leaderBox.style.display = 'block';
    
    // Икона: 🛡️ за главния герой, ⚔️ за останалите генерали
    let icon = topLeader.isMain ? "🛡️" : "⚔️";

    leaderBox.innerHTML = `
        <div style="font-size: 16px; line-height: 1; margin-bottom: 2px; filter: drop-shadow(0 0 3px #ffd700);">👑</div>
        <div style="font-size: 20px; margin: 2px 0;">${icon}</div>
        <div style="font-size: 0.85em; font-weight: bold; color: #ffd700; letter-spacing: 0.3px;">Кан ${topLeader.name}</div>
        <div style="font-size: 0.75em; color: #ccc; margin-top: 1px;">
            Род ${topLeader.dynasty} | <span style="color: #00ffcc; font-weight: bold;">Ниво ${topLeader.level}</span>
        </div>
    `;
};

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ (Владетел, Родове и Летопис) ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">Род: ${hero.dynasty} | ${hero.age} г.</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; letter-spacing: 1px;">СЪВЕТ НА РОДОВЕТЕ</h4>
                <div style="font-size: 0.85em; max-height: 150px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
                    ${Object.keys(window.activeDynasties || {}).map(clanName => {
                        const clan = window.activeDynasties[clanName];
                        const isPlayer = clanName === hero.dynasty;
                        return `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: ${isPlayer ? '#d4af37' : '#fff'}">
                                <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                <span style="font-size: 0.85em; opacity: 0.8;">${clan.regions || 0} зем.</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="history-log-container" style="border-top: 1px solid #333; padding-top: 10px;">
                <h4 style="color: #d4af37; font-size: 11px; margin-bottom: 10px; letter-spacing: 1px;">ЛЕТОПИС</h4>
                <div id="history-log" style="font-size: 10px; color: #aaa; max-height: 200px; overflow-y: auto; line-height: 1.4;">
                </div>
            </div>
        `;
    }

    // --- 2. ГОРЕН ПАНЕЛ (Ресурси) ---
    const goldEl = document.getElementById('stat-gold');
    const armyEl = document.getElementById('stat-army');
    const powerEl = document.getElementById('stat-power');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    // Обновяваме Летописа при всяко опресняване на UI
    window.renderHistory();

    // Защита и обновяване на времето + панела на владетеля
    window.updateTimeUI();
};

/**
 * ОБНОВЯВАНЕ НА ЛЕНТАТА С ВРЕМЕТО + ИЗВИКВАНЕ НА ТАБЛОТО ЗА ОПИТ
 */
window.updateTimeUI = function() {
    const timeEl = document.getElementById('game-time-display');
    
    // Защитен блок: Изпълнява се само ако gameTime съществува в глобалния контекст
    if (timeEl && window.gameTime) {
        let seasonName = window.seasons[window.gameTime.seasonIndex] || "Пролет";
        timeEl.innerHTML = `⏳ Година ${window.gameTime.year}, ${seasonName} (${window.gameTime.era}) | Ход: <b style="color:#00ffcc;">${window.gameTime.turn}</b>`;
    }

    // Независимо от всичко, извикваме рендерирането на най-опитния владетел под него
    window.renderMostExperiencedRulerUI();
};

/**
 * ДОБАВЯНЕ НА СЪОБЩЕНИЕ И ВИЗУАЛИЗАЦИЯ
 * Ограничено до точно 5 събития за поддържане на чист интерфейс.
 */
window.showAdvisorMsg = function(msg) {
    const year = window.gameTime ? window.gameTime.year : 1;
    const era = window.gameTime ? window.gameTime.era : "от н.е.";
    
    // Новите събития се добавят най-отгоре в масива
    window.eventHistory.unshift({ text: msg, time: `${year} ${era}` });
    
    // СИНХРОНИЗАЦИЯ: Пазим само последните 5 записа в Летописа
    if (window.eventHistory.length > 5) {
        window.eventHistory.pop(); // Премахва най-старото събитие
    }
    
    window.renderHistory();
};

window.renderHistory = function() {
    const logEl = document.getElementById('history-log');
    if (logEl) {
        logEl.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 4px; animation: fadeIn 0.3s ease;">
                <span style="color: #d4af37;">[${event.time} г.]:</span> ${event.text}
            </div>
        `).join('');
    }
};
