// ==================== ТЪРГОВИЯ МЕЖДУ ГЕРОИ ====================
// Показва модал за търговия с друг герой
window.openTradeWithHero = function(targetHero) {
    let currentHero = null;
    if (window.gameMode === 'solo' && window.currentHero) {
        currentHero = window.currentHero;
    } else {
        currentHero = window.getSelectedHero ? window.getSelectedHero() : (window.getStrongestHero ? window.getStrongestHero() : null);
    }
    if (!currentHero || !targetHero || currentHero === targetHero) return;

    let modal = document.createElement('div');
    modal.id = 'trade-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:500000; display:flex; justify-content:center; align-items:center;';
    modal.innerHTML = `
        <div style="background:#1a1a2e; border:2px solid #c9a87b; border-radius:24px; padding:20px; max-width:400px; width:90%; color:#ffdd99;">
            <h3 style="text-align:center;">🤝 Търговия с ${targetHero.name}</h3>
            <div style="display:flex; gap:10px; margin:15px 0;">
                <div style="flex:1; background:#0d0a07; border-radius:12px; padding:10px;">
                    <div><strong>${currentHero.name}</strong></div>
                    <div>💰 ${currentHero.gold} злато</div>
                    <div>⚔️ ${currentHero.armySize} войски</div>
                    <input type="number" id="trade-gold-offer" placeholder="Злато за предлагане" style="width:100%; margin-top:8px; padding:4px;">
                </div>
                <div style="flex:1; background:#0d0a07; border-radius:12px; padding:10px;">
                    <div><strong>${targetHero.name}</strong></div>
                    <div>💰 ${targetHero.gold} злато</div>
                    <div>⚔️ ${targetHero.armySize} войски</div>
                    <input type="number" id="trade-gold-request" placeholder="Злато за искане" style="width:100%; margin-top:8px; padding:4px;">
                </div>
            </div>
            <button id="execute-trade-btn" style="width:100%; background:#daa520; border:none; border-radius:30px; padding:8px; color:#000; font-weight:bold; cursor:pointer;">📦 Предложи търговия</button>
            <button id="close-trade-modal" style="width:100%; margin-top:10px; background:#2c1a0c; border:none; border-radius:30px; padding:6px; cursor:pointer;">Затвори</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('execute-trade-btn').onclick = () => {
        let offerGold = parseInt(document.getElementById('trade-gold-offer').value) || 0;
        let requestGold = parseInt(document.getElementById('trade-gold-request').value) || 0;
        if (offerGold > currentHero.gold) {
            window.showAdvisorPopup("ГРЕШКА", "Нямате толкова злато!", "error");
            return;
        }
        if (requestGold > targetHero.gold) {
            window.showAdvisorPopup("ГРЕШКА", `${targetHero.name} няма толкова злато!`, "error");
            return;
        }
        // Извършване на размяната
        currentHero.gold -= offerGold;
        targetHero.gold += offerGold;
        targetHero.gold -= requestGold;
        currentHero.gold += requestGold;
        
        if (window.addHeroLog) {
            window.addHeroLog(currentHero, "📦", `Търгува с ${targetHero.name}: даде ${offerGold}, получи ${requestGold} злато.`);
            window.addHeroLog(targetHero, "📦", `Търгува с ${currentHero.name}: даде ${requestGold}, получи ${offerGold} злато.`);
        }
        if (typeof window.updateCharacterUI === 'function') {
            window.updateCharacterUI(currentHero);
            window.updateCharacterUI(targetHero);
        }
        if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
        if (typeof window.updateAllUI === 'function') window.updateAllUI();
        window.showAdvisorPopup("ТЪРГОВИЯ", "Размяната е успешна!", "success");
        modal.remove();
    };
    document.getElementById('close-trade-modal').onclick = () => modal.remove();
};

// AI търговия – автоматично търгува, ако има голям дисбаланс
window.aiTrade = function(hero, otherHero) {
    if (!hero.isAuto || !otherHero.isAuto) return;
    let heroGold = hero.gold;
    let otherGold = otherHero.gold;
    if (heroGold > otherGold * 1.5 && heroGold > 500) {
        let gift = Math.min(200, Math.floor(heroGold * 0.1));
        hero.gold -= gift;
        otherHero.gold += gift;
        if (window.addHeroLog) window.addHeroLog(hero, "📦", `Изпрати ${gift} злато на ${otherHero.name} (търговски жест).`);
        if (window.addHeroLog) window.addHeroLog(otherHero, "📦", `Получи ${gift} злато от ${hero.name} (търговски жест).`);
    }
};

// ==================== ДИНАМИЧНИ СЪБИТИЯ ====================
window.dynamicEvents = [
    { name: "⭐ Метеоритен дъжд", effect: (hero) => { hero.heroPower += 15; return "+15 бойна мощ"; }, minLevel: 5, weight: 10 },
    { name: "🐺 Нападение на вълци", effect: (hero) => { hero.armySize = Math.max(50, hero.armySize - 50); return "-50 войници"; }, minLevel: 1, weight: 15 },
    { name: "🏆 Царски дар", effect: (hero) => { hero.gold += 300; return "+300 злато"; }, minLevel: 3, weight: 12 },
    { name: "📖 Древни знания", effect: (hero) => { hero.xp += 150; return "+150 опит"; }, minLevel: 4, weight: 10 },
    { name: "💔 Чума", effect: (hero) => { hero.hp = Math.max(1, hero.hp - 30); hero.armySize = Math.max(50, hero.armySize - 80); return "-30 HP, -80 войници"; }, minLevel: 2, weight: 8 },
    { name: "🤝 Дипломатическа мисия", effect: (hero) => { hero.morale = Math.min(100, hero.morale + 20); return "+20 морал"; }, minLevel: 2, weight: 12 },
    { name: "💰 Търговски керван", effect: (hero) => { hero.gold += 200; return "+200 злато"; }, minLevel: 1, weight: 15 },
    { name: "⚔️ Бунт в армията", effect: (hero) => { hero.armySize = Math.max(100, hero.armySize - 100); return "-100 войници"; }, minLevel: 3, weight: 10 }
];

window.triggerDynamicEvent = function(hero) {
    if (!hero || !hero.isAuto) return;
    let available = window.dynamicEvents.filter(e => hero.level >= e.minLevel);
    if (available.length === 0) return;
    let totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
    let rand = Math.random() * totalWeight;
    let cumulative = 0;
    for (let event of available) {
        cumulative += event.weight;
        if (rand <= cumulative) {
            let effectMsg = event.effect(hero);
            if (window.addHeroLog) window.addHeroLog(hero, "🌍", `${event.name}: ${effectMsg}`);
            if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(hero);
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
            if (typeof window.updateAllUI === 'function') window.updateAllUI();
            break;
        }
    }
};

// ==================== ИНИЦИАЛИЗАЦИЯ – ПЕРИОДИЧНИ СЪБИТИЯ ====================
setInterval(() => {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined && hero.isAuto && hero.isAlive !== false) heroes.push(hero);
        }
    }
    // Случайно събитие за един герой на всеки 2 минути
    if (heroes.length > 0 && Math.random() < 0.2) {
        let randomHero = heroes[Math.floor(Math.random() * heroes.length)];
        window.triggerDynamicEvent(randomHero);
    }
    // AI търговия – на всеки 5 минути произволна двойка
    if (heroes.length >= 2 && Math.random() < 0.3) {
        let idx1 = Math.floor(Math.random() * heroes.length);
        let idx2 = (idx1 + 1 + Math.floor(Math.random() * (heroes.length - 1))) % heroes.length;
        window.aiTrade(heroes[idx1], heroes[idx2]);
    }
}, 120000); // 2 минути

console.log("✅ trade_events.js зареден – търговия между герои и динамични събития");
