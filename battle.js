/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (АДАПТИВНА МОБИЛНА БИТКА - СЛОТОВЕ ГОРЕ, HP БАРОВЕ, STICKY БУТОНИ)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН И СИНХРОНИЗИРАН
КОРЕКЦИЯ: 
1. Премахнати всички синтактични грешки (интервали в оператори, ключови думи).
2. Използва се САМО clan (без dynasty).
3. Мобилен layout: слотове горе → HP барове → VS ред → скролируем лог → залепени бутони долу.
==========================================================================
*/

// 1. СТАРТИРАНЕ НА БИТКА
window.startBattle = function(targetRegion) {
    if (!targetRegion && window.currentSelectedRegion) targetRegion = window.currentSelectedRegion;
    if (!targetRegion || typeof targetRegion === 'string') {
        targetRegion = {
            id: "random_region_" + Math.floor(Math.random() * 1000),
            name: typeof targetRegion === 'string' ? targetRegion : "Гранични Земи",
            armySize: Math.floor(Math.random() * 400) + 100,
            defenseLevel: 2,
            difficulty: 25
        };
    }

    // Събиране на играчовите герои (само фаворитите, макс 5)
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
    if (battleGroup.length === 0) battleGroup = allLeaders.filter(l => l.currentArmy > 0).slice(0, 5);

    let totalPlayerArmy = battleGroup.reduce((sum, h) => sum + h.currentArmy, 0);
    if (totalPlayerArmy === 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🔮 Твоите избрани воеводи нямат войска! Попълни ги в Казармите!");
        return;
    }

    window.currentBattleState = {
        region: targetRegion,
        group: battleGroup,
        enemyArmy: targetRegion.armySize,
        initialEnemyArmy: targetRegion.armySize,
        initialPlayerArmy: totalPlayerArmy,
        round: 1,
        playerLog: [],
        enemyLog: []
    };

    let battleScreen = document.getElementById('battle-screen');
    if (!battleScreen) {
        battleScreen = document.createElement('div');
        battleScreen.id = 'battle-screen';
        document.body.appendChild(battleScreen);
    }

    // Инжектиране на адаптивен CSS (само веднъж)
    if (!document.getElementById('battle-mobile-css')) {
        const style = document.createElement('style');
        style.id = 'battle-mobile-css';
        style.innerHTML = `
            .battle-wrapper { display:flex; flex-direction:column; height:100vh; width:100vw; background:radial-gradient(circle,#121212 0%,#050505 100%); color:#fff; font-family:'Cinzel',serif; overflow:hidden; }
            .battle-header { padding:8px 10px; text-align:center; border-bottom:1px solid #333; flex-shrink:0; background:rgba(0,0,0,0.5); }
            .slots-row { display:flex; gap:8px; overflow-x:auto; padding:10px; background:rgba(0,0,0,0.3); flex-shrink:0; }
            .slots-row::-webkit-scrollbar { height:4px; }
            .slots-row::-webkit-scrollbar-thumb { background:#d4af37; border-radius:2px; }
            
            .hero-slot { flex:0 0 auto; width:90px; background:#111; border:1px solid #444; border-radius:8px; padding:6px 4px; text-align:center; }
            .slot-name { font-size:10px; color:#ffd700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:bold; }
            .slot-lvl { font-size:8px; color:#aaa; margin-top:2px; }
            .hp-track { width:100%; height:5px; background:#222; border-radius:3px; margin-top:4px; overflow:hidden; }
            .hp-fill { height:100%; transition:width 0.3s; }
            .slot-army { font-size:9px; margin-top:3px; color:#ccc; }

            .vs-row { display:flex; align-items:center; justify-content:center; gap:8px; padding:6px 10px; font-size:11px; color:#ccc; flex-shrink:0; background:rgba(0,0,0,0.2); }
            .vs-track { flex:1; height:8px; background:#222; border-radius:4px; overflow:hidden; }
            .vs-fill { height:100%; transition:width 0.4s; }
            .vs-text { font-weight:bold; color:#d4af37; min-width:30px; text-align:center; }

            .log-box { flex:1; display:flex; flex-direction:column; overflow:hidden; padding:0 10px; min-height:0; }
            .log-content { flex:1; background:#000; border:1px solid #333; border-radius:6px; padding:8px; overflow-y:auto; font-size:11px; line-height:1.5; }
            .log-content div { margin-bottom:4px; word-wrap:break-word; }

            .actions-bar { padding:10px; background:rgba(0,0,0,0.9); border-top:1px solid #444; display:flex; gap:10px; flex-shrink:0; z-index:10; }
            .btn-fight { flex:1; padding:14px 8px; border:none; border-radius:6px; font-weight:bold; font-size:14px; cursor:pointer; font-family:'Cinzel',serif; }
            .btn-atk { background:linear-gradient(180deg,#8b0000,#5a0000); color:#fff; border:1px solid #ff4444; }
            .btn-ret { background:#222; color:#aaa; border:1px solid #555; }
            .btn-fight:disabled { opacity:0.5; cursor:not-allowed; }

            @media(min-width:768px) {
                .hero-slot { width:110px; padding:8px; }
                .btn-fight { padding:16px; font-size:16px; }
                .log-content { font-size:13px; }
            }
        `;
        document.head.appendChild(style);
    }

    window.renderBattleLayout();
};

// 2. РЕНДЕРИРАНЕ НА ЛЕЙАУТА
window.renderBattleLayout = function() {
    const state = window.currentBattleState;
    const screen = document.getElementById('battle-screen');
    if (!state || !screen) return;

    // Генериране на слотове (като в казармите)
    let slotsHTML = state.group.map(hero => {
        const hp = Math.max(0, Math.ceil((hero.currentArmy / hero.initialArmyMax) * 100));
        const color = hp > 50 ? '#00ffcc' : hp > 20 ? '#ffcc00' : '#ff3366';
        const dead = hero.currentArmy <= 0 ? 'opacity:0.4;filter:grayscale(0.8);' : '';
        return `
            <div class="hero-slot" style="${dead}">
                <div class="slot-name">🛡️ ${hero.name}</div>
                <div class="slot-lvl">Нив. ${hero.level || 1}</div>
                <div class="hp-track"><div class="hp-fill" style="width:${hp}%;background:${color}"></div></div>
                <div class="slot-army">⚔️ ${hero.currentArmy || 0}</div>
            </div>`;
    }).join('');

    // VS Индикатори
    const playerTotal = state.group.reduce((s, h) => s + (h.currentArmy || 0), 0);
    const playerHP = Math.max(0, Math.ceil((playerTotal / state.initialPlayerArmy) * 100));
    const enemyHP = Math.max(0, Math.ceil((state.enemyArmy / state.initialEnemyArmy) * 100));

    screen.innerHTML = `
        <div class="battle-wrapper">
            <div class="battle-header">
                <div style="font-size:16px;color:#ffd700;font-weight:bold;">⚔️ РУНД ${state.round}</div>
                <div style="font-size:11px;color:#aaa;">${state.region.name}</div>
            </div>
            
            <div class="slots-row">${slotsHTML}</div>

            <div class="vs-row">
                <span style="color:#00ffcc;">Ти</span>
                <div class="vs-track"><div class="vs-fill" style="width:${playerHP}%;background:#00ffcc;"></div></div>
                <div class="vs-text">VS</div>
                <div class="vs-track"><div class="vs-fill" style="width:${enemyHP}%;background:#ff3366;"></div></div>
                <span style="color:#ff3366;">Враг</span>
            </div>

            <div class="log-box">
                <div class="log-content" id="battle-log-content">
                    ${state.playerLog.length === 0 ? '<div style="color:#666;">⏳ Чака се заповед за атака...</div>' : state.playerLog.join('')}
                </div>
            </div>

            <div class="actions-bar" id="battle-actions-container">
                <button class="btn-fight btn-atk" onclick="window.processBattleAction('assault')">⚔️ АТАКА</button>
                <button class="btn-fight btn-ret" onclick="window.processBattleAction('retreat')">🏃 ОТСТЪПЛЕНИЕ</button>
            </div>
        </div>
    `;

    // Auto-scroll лога
    const logDiv = screen.querySelector('.log-content');
    if (logDiv) logDiv.scrollTop = logDiv.scrollHeight;
};

// 3. ОБРАБОТКА НА ДЕЙСТВИЕ
window.processBattleAction = function(actionType) {
    const state = window.currentBattleState;
    if (!state) return;

    const btnA = document.querySelector('.btn-atk');
    const btnR = document.querySelector('.btn-ret');
    if (btnA) btnA.disabled = true;
    if (btnR) btnR.disabled = true;

    if (actionType === 'retreat') {
        state.playerLog.push(`<div style="color:#aaa;">🏳️ <b>Отстъпление!</b> Войските се изтеглят...</div>`);
        window.endBattle(false, "retreat");
        return;
    }

    state.playerLog.push(`<div style="color:#fff;">⚔️ <b>РУНД ${state.round}:</b> Атаката започва!</div>`);

    let totalPlayerPower = 0;
    state.group.forEach(hero => {
        if (!hero || hero.currentArmy <= 0) return;
        let p = hero.currentArmy + (hero.heroPower || 100);
        if (hero.skills) {
            if ((hero.skills.tactics || 0) > 0) p += hero.skills.tactics * 40;
            if ((hero.skills.heavyStrike || 0) > 0 && Math.random() < hero.skills.heavyStrike * 0.05) {
                p *= 2;
                state.playerLog.push(`<div style="color:#ffd700;">💥 <b>${hero.name}</b> нанася СМАЗВАЩ УДАР!</div>`);
            }
        }
        totalPlayerPower += p;
    });
    totalPlayerPower *= (Math.random() * 0.3 + 0.85);

    let totalEnemyPower = state.enemyArmy * (1 + (state.region.defenseLevel || 1) * 0.15) * (Math.random() * 0.3 + 0.85);
    let playerLosses = Math.floor(totalEnemyPower * 0.18);
    let enemyLosses = Math.floor(totalPlayerPower * 0.22);

    state.enemyArmy = Math.max(0, state.enemyArmy - enemyLosses);
    state.playerLog.push(`<div style="color:#ff3366;">🏹 Врагът губи <b>${enemyLosses}</b> бойци.</div>`);

    let active = state.group.filter(h => h && h.currentArmy > 0).length;
    if (active > 0) {
        let lossPer = Math.floor(playerLosses / active);
        state.group.forEach(h => { if (h.currentArmy > 0) h.currentArmy = Math.max(0, h.currentArmy - lossPer); });
        state.playerLog.push(`<div style="color:#aaa;">📉 Твоите загуби: <b>${playerLosses}</b>.</div>`);
    }

    state.round++;
    setTimeout(() => {
        let totalPlayerLeft = state.group.reduce((s, h) => s + (h.currentArmy || 0), 0);
        if (state.enemyArmy <= 0 && totalPlayerLeft > 0) window.endBattle(true);
        else if (totalPlayerLeft <= 0) window.endBattle(false, "defeat");
        else {
            window.renderBattleLayout();
            if (btnA) btnA.disabled = false;
            if (btnR) btnR.disabled = false;
        }
    }, 400);
};

// 4. КРАЙ НА БИТКА
window.endBattle = function(isVictory, reason) {
    const state = window.currentBattleState;
    if (!state) return;

    state.group.forEach(hero => {
        if (hero && hero.clan && window.worldData?.clans?.[hero.clan]) {
            window.worldData.clans[hero.clan].currentArmy = hero.currentArmy;
            window.worldData.clans[hero.clan].armySize = hero.currentArmy;
        }
    });

    if (isVictory) {
        state.region.armySize = 0;
        if (!window.playerRegions) window.playerRegions = [];
        const flat = window.playerRegions.flat();
        if (!flat.includes(state.region.name)) window.playerRegions.push(state.region.name);
        state.playerLog.push(`<div style="color:#00ffcc;font-weight:bold;text-align:center;margin-top:5px;">🎉 ВЕЛИКА ПОБЕДА!</div>`);
        state.group.forEach(h => h.currentArmy > 0 && window.gainHeroXP?.(h, 150));
        state.playerLog.push(`<div style="color:#ffd700;">🌟 Всеки оцелял герой получава +150 XP!</div>`);
    } else {
        state.playerLog.push(`<div style="color:${reason==='retreat'?'#ffcc00':'#ff3366'};font-weight:bold;text-align:center;">${reason==='retreat'?'🏳️ ТАКТИЧЕСКО ИЗТЕГЛЯНЕ':'❌ ПОРАЖЕНИЕ'}</div>`);
    }

    // Заменяме бутоните с "ЗАТВОРИ"
    const actions = document.getElementById('battle-actions-container');
    if (actions) {
        actions.innerHTML = `<button class="btn-fight btn-atk" onclick="window.closeBattle()" style="flex:1;width:100%;">ЗАТВОРИ БОЯ</button>`;
    }
    window.renderBattleLayout();
};

// 5. ЗАТВАРЯНЕ НА БОЯ
window.closeBattle = function() {
    const screen = document.getElementById('battle-screen');
    if (screen) screen.style.display = 'none';
    window.currentBattleState = null;
    window.renderTop6LeadersUI?.();
    window.updateCharacterUI?.(window.currentHero);
};
