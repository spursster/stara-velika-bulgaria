/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (НОВ ДИЗАЙН - ПЪЛЕН ЕКРАН)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН И СИНХРОНИЗИРАН
КОРЕКЦИЯ: Премахнати всички синтактични грешки. Използва се само "clan".
          Бутонът без аргументи стартира случайна битка.
==========================================================================
*/

// ==========================================
// 1. СТАРТИРАНЕ НА БИТКА
// ==========================================
window.startBattle = function(targetRegion) {
    // Ако няма подаден регион, проверяваме дали има избран от картата
    if (!targetRegion && window.currentSelectedRegion) {
        targetRegion = window.currentSelectedRegion;
    }

    // Ако все още няма регион, създаваме случаен за "Бърза битка"
    if (!targetRegion || typeof targetRegion === 'string') {
        targetRegion = {
            id: "random_battle_" + Math.floor(Math.random() * 1000),
            name: typeof targetRegion === 'string' ? targetRegion : "Гранични Земи",
            armySize: Math.floor(Math.random() * 300) + 100,
            defenseLevel: 2,
            difficulty: 20
        };
    }

    // --- Събиране на играчовите герои (само фаворитите, макс 5) ---
    let allLeaders = [];
    if (window.worldData && window.worldData.clans) {
        allLeaders = Object.entries(window.worldData.clans).map(([key, clan]) => ({
            clanKey: key,
            name: clan.leaderName || clan.name || key,
            clan: key, // ✅ ФИКС: използваме clan вместо dynasty
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

    // --- Генериране на вражески герои (случайни имена, НЕ от 13-те кланове) ---
    const enemyHeroes = window.generateEnemyHeroes(targetRegion);
    let totalEnemyArmy = enemyHeroes.reduce((sum, h) => sum + h.currentArmy, 0);

    window.currentBattleState = {
        region: targetRegion,
        group: battleGroup,
        enemyGroup: enemyHeroes,
        enemyArmy: totalEnemyArmy,
        initialEnemyArmy: totalEnemyArmy,
        initialPlayerArmy: totalPlayerArmy,
        round: 1,
        playerLog: [],
        enemyLog: []
    };

    // Създаване на бойния екран
    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        document.body.appendChild(battleScreen);
    }
    battleScreen.className = 'fullscreen-battle-overlay';

    // Инжектиране на анимациите (ако липсват)
    if (!document.getElementById('battle-effects-style')) {
        const style = document.createElement('style');
        style.id = 'battle-effects-style';
        style.innerHTML = `
            @keyframes battleShake {
                0%,100% { transform: translate(0,0); }
                25% { transform: translate(-4px,2px); }
                50% { transform: translate(4px,-2px); }
                75% { transform: translate(-2px,4px); }
            }
            .battle-shake { animation: battleShake 0.3s ease; }
        `;
        document.head.appendChild(style);
    }

    window.renderBattleLayout();
};

// ==========================================
// 2. ГЕНЕРИРАНЕ НА ВРАЖЕСКИ ГЕРОИ
// ==========================================
window.generateEnemyHeroes = function(targetRegion) {
    const enemyNamesPool = [
        "Роган", "Бран", "Торин", "Варго", "Зоран", "Келтан", 
        "Мордред", "Силвър", "Драко", "Фенрик", "Уркан", "Грок"
    ];
    const enemyTitles = [
        "Разбойник", "Мерценар", "Пират", "Бунтовник", "Варварин", "Наемник"
    ];

    const count = 3 + Math.floor(Math.random() * 3); // 3 до 5 врага
    const enemies = [];
    const usedNames = new Set();

    for (let i = 0; i < count; i++) {
        let name, title;
        do {
            name = enemyNamesPool[Math.floor(Math.random() * enemyNamesPool.length)];
            title = enemyTitles[Math.floor(Math.random() * enemyTitles.length)];
        } while (usedNames.has(name));
        usedNames.add(name);

        const army = Math.floor(Math.random() * 150) + 50;
        const level = 1 + Math.floor(Math.random() * 4);

        enemies.push({
            name: name,
            title: title,
            clan: "Враждебен род", // ✅ ФИКС: използваме clan
            currentArmy: army,
            initialArmyMax: army,
            heroPower: 80 + Math.floor(Math.random() * 60),
            level: level,
            skills: {},
            pet: null,
            isEnemy: true
        });
    }
    return enemies;
};

// ==========================================
// 3. РЕНДЕРИРАНЕ НА БОЙНИЯ ЛЕЙАУТ
// ==========================================
window.renderBattleLayout = function() {
    const state = window.currentBattleState;
    const screen = document.getElementById('battle-screen');
    if (!state || !screen) return;

    const totalPlayerArmy = state.group.reduce((sum, h) => sum + (h.currentArmy || 0), 0);
    const totalEnemyArmy = state.enemyGroup.reduce((sum, h) => sum + (h.currentArmy || 0), 0);

    const playerPct = state.initialPlayerArmy > 0 ? Math.max(0, Math.ceil((totalPlayerArmy / state.initialPlayerArmy) * 100)) : 0;
    const enemyPct = state.initialEnemyArmy > 0 ? Math.max(0, Math.ceil((totalEnemyArmy / state.initialEnemyArmy) * 100)) : 0;

    // --- Генериране на играчовата елитна лента (горе) ---
    let playerSlotsHTML = '';
    state.group.forEach(hero => {
        const hpPct = hero.initialArmyMax > 0 ? Math.max(0, Math.ceil((hero.currentArmy / hero.initialArmyMax) * 100)) : 0;
        const color = hpPct > 50 ? '#00ffcc' : hpPct > 20 ? '#ffcc00' : '#ff3366';
        const dead = hero.currentArmy <= 0 ? 'filter:grayscale(1);opacity:0.4;' : '';
        playerSlotsHTML += `
            <div class="battle-hero-slot" style="${dead}">
                <div class="bhs-name">️ ${hero.name}</div>
                <div class="bhs-level">Ниво ${hero.level || 1}</div>
                <div class="bhs-bar-bg"><div class="bhs-bar" style="width:${hpPct}%;background:${color}"></div></div>
                <div class="bhs-army">${hero.currentArmy || 0} ⚔️</div>
            </div>`;
    });

    // --- Генериране на вражеските слотове (долу) ---
    let enemySlotsHTML = '';
    state.enemyGroup.forEach(hero => {
        const hpPct = hero.initialArmyMax > 0 ? Math.max(0, Math.ceil((hero.currentArmy / hero.initialArmyMax) * 100)) : 0;
        const color = hpPct > 50 ? '#ff6644' : hpPct > 20 ? '#ff9900' : '#ff3366';
        const dead = hero.currentArmy <= 0 ? 'filter:grayscale(1);opacity:0.4;' : '';
        enemySlotsHTML += `
            <div class="battle-hero-slot enemy-slot" style="${dead}">
                <div class="bhs-name">🏹 ${hero.name}</div>
                <div class="bhs-level">${hero.title || ''} Нив.${hero.level || 1}</div>
                <div class="bhs-bar-bg"><div class="bhs-bar" style="width:${hpPct}%;background:${color}"></div></div>
                <div class="bhs-army">${hero.currentArmy || 0} ⚔️</div>
            </div>`;
    });

    // --- Логове ---
    const playerLogHTML = state.playerLog.length > 0
        ? state.playerLog.map(l => `<div class="log-line player-log">${l}</div>`).join('')
        : '<div class="log-line empty-log">⏳ Чака се заповед за атака...</div>';

    const enemyLogHTML = state.enemyLog.length > 0
        ? state.enemyLog.map(l => `<div class="log-line enemy-log">${l}</div>`).join('')
        : '<div class="log-line empty-log">🏹 Врагът е готов за отбрана...</div>';

    // --- Централен VS ---
    const vsCenter = `
        <div class="battle-vs-section">
            <div class="battle-vs-label player-side">
                <div class="vs-army-label">🛡️ ТВОИТЕ СИЛИ</div>
                <div class="vs-bar-track"><div class="vs-bar-fill" style="width:${playerPct}%;background:linear-gradient(90deg,#00aa77,#00ffcc)"></div></div>
                <div class="vs-army-count">${totalPlayerArmy} войници</div>
            </div>
            <div class="battle-vs-divider">
                <div class="vs-badge">VS</div>
                <div class="vs-round">РУНД ${state.round}</div>
                <div class="vs-region">${state.region.name}</div>
            </div>
            <div class="battle-vs-label enemy-side">
                <div class="vs-army-label">🏹 ВРАГ</div>
                <div class="vs-bar-track"><div class="vs-bar-fill" style="width:${enemyPct}%;background:linear-gradient(90deg,#cc3300,#ff6644)"></div></div>
                <div class="vs-army-count">${totalEnemyArmy} врагове</div>
            </div>
        </div>`;

    // --- Бутони ---
    const buttonsHTML = `
        <div class="battle-buttons-row">
            <button id="btn-battle-assault" class="battle-btn assault" onclick="window.processBattleAction('assault')">⚔️ ПРОДЪЛЖИ ЩУРМА</button>
            <button id="btn-battle-retreat" class="battle-btn retreat" onclick="window.processBattleAction('retreat')">🏃 ОТСТЪПЛЕНИЕ</button>
        </div>`;

    // --- Сглобяване на пълния екран ---
    screen.innerHTML = `
        <div class="battle-full-container">
            <!-- ГОРНА ЛЕНТА: ЕЛИТНИ ГЕРОИ -->
            <div class="battle-elite-row">
                <div class="battle-elite-label">👑 ТВОИ ВОЕВОДИ</div>
                <div class="battle-elite-slots">${playerSlotsHTML}</div>
            </div>

            <!-- ГОРЕН ЛОГ: ДЕЙСТВИЯ НА ГЕРОИТЕ -->
            <div class="battle-log-panel top-log">
                <div class="battle-log-title">📜 ЛЕТОПИС — ДЕЙСТВИЯ НА ВОЕВОДИТЕ</div>
                <div class="battle-log-content">${playerLogHTML}</div>
            </div>

            <!-- ЦЕНТЪР: VS ИНДИКАТОР + БУТОНИ -->
            <div class="battle-center-section">
                ${vsCenter}
                ${buttonsHTML}
            </div>

            <!-- ДОЛЕН ЛОГ: ДЕЙСТВИЯ НА ВРАГА -->
            <div class="battle-log-panel bottom-log">
                <div class="battle-log-title">🏹 ЛЕТОПИС — ДЕЙСТВИЯ НА ВРАГА</div>
                <div class="battle-log-content">${enemyLogHTML}</div>
            </div>

            <!-- ДОЛНА ЛЕНТА: ВРАЖЕСКИ ГЕРОИ -->
            <div class="battle-elite-row enemy-row">
                <div class="battle-elite-label">☠️ ВРАЖЕСКИ ОТРЯД</div>
                <div class="battle-elite-slots">${enemySlotsHTML}</div>
            </div>
        </div>
    `;
};

// ==========================================
// 4. ОБРАБОТКА НА ДЕЙСТВИЕ (АТАКА / ОТСТЪПЛЕНИЕ)
// ==========================================
window.processBattleAction = function(actionType) {
    const state = window.currentBattleState;
    if (!state) return;

    const btnA = document.getElementById('btn-battle-assault');
    const btnR = document.getElementById('btn-battle-retreat');
    if (btnA) btnA.disabled = true;
    if (btnR) btnR.disabled = true;

    if (actionType === 'retreat') {
        state.playerLog.push("🏳️ <b>Отстъпление!</b> Войските се изтеглят от боя...");
        state.enemyLog.push("🏹 Врагът наблюдава изтеглянето...");
        window.endBattle(false, "retreat");
        return;
    }

    // --- Анимация на треперене ---
    const container = document.querySelector('.battle-full-container');
    if (container) {
        container.classList.add('battle-shake');
        setTimeout(() => container.classList.remove('battle-shake'), 300);
    }

    let hasCrit = false;
    let totalPlayerPower = 0;

    // --- Изчисляване на силата на играча ---
    state.group.forEach(hero => {
        if (!hero || hero.currentArmy <= 0) return;
        let p = hero.currentArmy + (hero.heroPower || 100);
        if (hero.skills) {
            if ((hero.skills.tactics || 0) > 0) p += hero.skills.tactics * 40;
            if ((hero.skills.heavyStrike || 0) > 0 && Math.random() < hero.skills.heavyStrike * 0.05) {
                p *= 2; hasCrit = true;
                state.playerLog.push(`💥 <b>${hero.name}</b> нанася <b>СМАЗВАЩ УДАР</b> — 200% щети!`);
            }
        }
        if (hero.pet === 'falcon') { p = Math.floor(p * 1.15); state.playerLog.push(`🦅 ${hero.name}: Соколът засилва атаката!`); }
        if (hero.pet === 'wolf') { if (Math.random() < 0.10) { p *= 2; hasCrit = true; state.playerLog.push(`🐺 ${hero.name}: Критичен удар от вълка!`); } }
        totalPlayerPower += p;
    });

    totalPlayerPower *= (Math.random() * 0.3 + 0.85);

    // --- Изчисляване на силата на врага ---
    let totalEnemyPower = state.enemyArmy * (1 + (state.region.defenseLevel || 1) * 0.15);
    totalEnemyPower *= (Math.random() * 0.3 + 0.85);

    let playerLosses = Math.floor(totalEnemyPower * 0.18);
    let enemyLosses = Math.floor(totalPlayerPower * 0.22);

    // --- Прилагане на щети ---
    state.enemyArmy = Math.max(0, state.enemyArmy - enemyLosses);
    state.enemyLog.push(`⚔️ Вражеският отряд губи <b>${enemyLosses}</b> бойци!`);

    let activeHeroes = state.group.filter(h => h && h.currentArmy > 0).length;
    if (activeHeroes > 0 && playerLosses > 0) {
        let lossPer = Math.floor(playerLosses / activeHeroes);
        state.group.forEach(h => {
            if (h && h.currentArmy > 0) h.currentArmy = Math.max(0, h.currentArmy - lossPer);
        });
        state.playerLog.push(`📉 Загубени са <b>${playerLosses}</b> твои бойци.`);
    }

    // --- Вражески герои губят войска пропорционално ---
    let aliveEnemies = state.enemyGroup.filter(h => h && h.currentArmy > 0);
    if (aliveEnemies.length > 0 && enemyLosses > 0) {
        let lossPer = Math.floor(enemyLosses / aliveEnemies.length);
        aliveEnemies.forEach(h => {
            if (h && h.currentArmy > 0) h.currentArmy = Math.max(0, h.currentArmy - lossPer);
        });
    }

    // --- Проверка за бягство на врага ---
    let totalPlayerLeft = state.group.reduce((sum, h) => sum + (h.currentArmy || 0), 0);
    if (state.enemyArmy > 0 && totalPlayerLeft > 0 && state.enemyArmy < state.initialEnemyArmy * 0.30 && Math.random() < 0.5) {
        state.enemyRetreating = true;
        state.enemyLog.push("🏳️ Врагът <b>губи кураж</b> и започва да бяга!");
    }

    // --- Край на рунда ---
    state.round++;
    setTimeout(() => {
        if (state.enemyArmy <= 0 && totalPlayerLeft > 0) {
            window.endBattle(true);
        } else if (totalPlayerLeft <= 0) {
            window.endBattle(false, "defeat");
        } else {
            window.renderBattleLayout();
            // Пренастройка на бутоните
            if (state.enemyRetreating) {
                const btnA2 = document.getElementById('btn-battle-assault');
                const btnR2 = document.getElementById('btn-battle-retreat');
                if (btnA2) { btnA2.innerText = "🏹 ПРЕСЛЕДВАНЕ"; btnA2.onclick = () => window.processBattleAction('chase'); btnA2.disabled = false; }
                if (btnR2) { btnR2.innerText = "🛑 ПУСНИ ГИ"; btnR2.onclick = () => window.endBattle(true, "retreat"); btnR2.disabled = false; }
            } else {
                if (btnA) btnA.disabled = false;
                if (btnR) btnR.disabled = false;
            }
        }
    }, 400);
};

// --- Преследване ---
window.processBattleAction = function(actionType) {
    if (actionType === 'chase') {
        const state = window.currentBattleState;
        let bonus = Math.floor(state.enemyArmy * 0.5);
        state.enemyArmy = 0;
        state.playerLog.push(`🏹 <b>Преследване!</b> Унищожени са още <b>${bonus}</b> бягащи врагове!`);
        window.endBattle(true, "chase");
    }
};

// ==========================================
// 5. КРАЙ НА БИТКАТА
// ==========================================
window.endBattle = function(isVictory, reason) {
    const state = window.currentBattleState;
    if (!state) return;

    // Записване на оцелелите войски обратно в worldData
    state.group.forEach(hero => {
        if (hero && hero.clan && window.worldData && window.worldData.clans[hero.clan]) {
            window.worldData.clans[hero.clan].currentArmy = hero.currentArmy;
            window.worldData.clans[hero.clan].armySize = hero.currentArmy;
        }
    });

    let finalMsg = '';
    if (isVictory) {
        state.region.armySize = 0;
        if (!window.playerRegions) window.playerRegions = [];
        const flat = window.playerRegions.flat();
        if (!flat.includes(state.region.name)) window.playerRegions.push(state.region.name);

        state.playerLog.push(`🎉 <b>ПОБЕДА!</b> Регионът <b>${state.region.name}</b> е завладян!`);
        state.enemyLog.push("💀 Вражеският отряд е унищожен...");

        // XP награда
        state.group.forEach(hero => {
            if (hero && hero.currentArmy > 0 && window.gainHeroXP) {
                window.gainHeroXP(hero, 150);
            }
        });
        state.playerLog.push("🌟 Всеки оцелял герой получава <b>+150 XP</b>!");
    } else {
        if (reason === "retreat") {
            state.playerLog.push("🏳️ <b>Тактическо изтегляне.</b> Основните сили са запазени.");
            state.enemyLog.push("🏹 Врагът удържа позициите си.");
        } else {
            state.region.armySize = Math.floor(state.enemyArmy * 0.7);
            state.playerLog.push("❌ <b>ПОРАЖЕНИЕ!</b> Отрядът е отблъснат.");
            state.enemyLog.push("⚔️ Врагът празнува победата си!");
        }
    }

    // Показване на финален екран
    const container = document.querySelector('.battle-full-container');
    if (container) {
        const btnRow = container.querySelector('.battle-buttons-row');
        if (btnRow) {
            btnRow.innerHTML = `
                <div style="text-align:center;width:100%;padding:15px 0;">
                    <div style="font-size:24px;margin-bottom:10px;">${isVictory ? '🎉' : '💀'}</div>
                    <div style="font-size:16px;font-weight:bold;color:${isVictory ? '#00ffcc' : '#ff3366'};margin-bottom:10px;">
                        ${isVictory ? 'ВЕЛИКА ПОБЕДА!' : (reason === 'retreat' ? 'ИЗТЕГЛЯНЕ' : 'ПОРАЖЕНИЕ')}
                    </div>
                    <button class="battle-btn assault" onclick="window.closeBattle()" style="margin-top:5px;">ЗАТВОРИ БОЯ</button>
                </div>`;
        }
    }
};

// ==========================================
// 6. ЗАТВАРЯНЕ НА БОЙНИЯ ЕКРАН
// ==========================================
window.closeBattle = function() {
    const screen = document.getElementById('battle-screen');
    if (screen) screen.style.display = 'none';
    window.currentBattleState = null;
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI && window.currentHero) window.updateCharacterUI(window.currentHero);
    if (window.openRegionsMap && document.getElementById('regions-screen')) {
        window.openRegionsMap();
    }
};
