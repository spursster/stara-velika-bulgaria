/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ | ФАЙЛ: ui.js (МОБИЛЕН АДАПТИВЕН ПРОФИЛ)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН И СИНХРОНИЗИРАН
КОРЕКЦИЯ: Всички прозорци сега са fullscreen на мобилни устройства с бутон ✕ горе вляво.
==========================================================================
*/
window.eventHistory = [];
if (!window.autoLevelState) window.autoLevelState = {};

window.toggleGameFullScreen = function() {
    const docEl = document.documentElement;
    if (!document.fullscreenElement) { docEl.requestFullscreen?.(); docEl.mozRequestFullScreen?.(); docEl.webkitRequestFullscreen?.(); } 
    else { document.exitFullscreen?.(); document.mozCancelFullScreen?.(); document.webkitExitFullscreen?.(); }
};

window.renderTop6LeadersUI = function() {
    const eliteBar = document.getElementById('top-elite-bar');
    if (!eliteBar) return;
    if (!window.worldData?.clans && window.currentHero) {
        window.worldData ||= {}; window.worldData.clans ||= {};
        window.worldData.clans[window.currentHero.clan] = window.currentHero;
    } else if (!window.worldData?.clans) return;

    let leaders = Object.entries(window.worldData.clans).map(([key, d]) => ({ clanKey: key, ...d }));
    leaders.sort((a, b) => (b.level || 1) !== (a.level || 1) ? (b.level || 1) - (a.level || 1) : (b.xp || 0) - (a.xp || 0));
    
    eliteBar.innerHTML = "";
    eliteBar.style.cssText = "display: flex; gap: 8px; width: 100%; overflow-x: auto; padding: 5px 0;";

    leaders.slice(0, 6).forEach(l => {
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(l);
        const card = document.createElement('div');
        card.className = "elite-hero-card";
        card.style.minWidth = "90px";
        card.onclick = (e) => e.target.classList.contains('auto-btn') || window.openHeroRPGModal?.(l.clanKey);
        
        let xp = l.isAuto ? (l.xp || 0) : (l.storedXP || 0);
        let req = window.rpgDatabase?.getXPRequiredForLevel?.(l.level || 1) || 150;
        let pct = Math.min(100, Math.floor((xp / req) * 100));
        let pet = l.pet && window.rpgDatabase?.petsDatabase?.[l.pet] ? window.rpgDatabase.petsDatabase[l.pet].icon : "🐾";
        
        card.innerHTML = `
            <div style="font-size:10px;font-weight:bold;color:#ffd700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pet} ${l.name}</div>
            <div class="rpg-xp-container" style="background:#222;height:4px;border-radius:2px;margin:4px 0;"><div class="rpg-xp-fill" style="width:${pct}%;background:${l.isAuto?'#00ffcc':'#ffcc00'};"></div></div>
            <button class="auto-btn ${l.isAuto?'active':''}" onclick="window.toggleHeroAutoMode('${l.clanKey}')" style="font-size:8px;padding:2px 4px;">${l.isAuto?'Auto':'Manual'}</button>
        `;
        eliteBar.appendChild(card);
    });
};
window.renderTop6HeroesUI = window.renderTop6LeadersUI;

window.updateCharacterUI = function(hero) {
    if (!hero) return;
    window.currentHero = hero;
    window.initializeHeroRPGData?.(hero);
    const g = document.getElementById('val-gold'); if(g) g.innerText = hero.gold || 0;
    const a = document.getElementById('val-army'); if(a) a.innerText = hero.armySize || 0;
    const p = document.getElementById('val-hero-power'); if(p) p.innerText = hero.heroPower || 100;
    
    const box = document.getElementById('active-character-profile');
    if (box) {
        let pet = hero.pet && window.rpgDatabase?.petsDatabase?.[hero.pet] ? `${window.rpgDatabase.petsDatabase[hero.pet].icon} ${window.rpgDatabase.petsDatabase[hero.pet].name}` : "Няма";
        box.innerHTML = `
            <div style="font-weight:bold;color:#ffd700;font-family:'Cinzel';">${hero.name}</div>
            <div style="font-size:10px;color:#ccc;margin:2px 0;">Род ${hero.clan} | ${hero.currentClass || "Багатур"}</div>
            <div id="hero-info-stats" style="font-size:10px;background:rgba(0,0,0,0.4);padding:6px;border-radius:4px;">
                Ниво: ${hero.level} | Точки: ${hero.skillPoints} | Любимец: ${pet}
            </div>
            <button class="menu-btn" onclick="window.openHeroRPGModal?.('${hero.clan}')" style="width:100%;margin-top:5px;padding:5px;font-size:10px;">🎒 RPG Меню</button>
        `;
    }
    window.renderTop6LeadersUI();
};

window.showAdvisorMsg = function(msg) {
    const j = document.getElementById('advisor-journal');
    if (!j) return;
    window.eventHistory.push(msg);
    if (window.eventHistory.length > 30) window.eventHistory.shift();
    j.innerHTML = window.eventHistory.map(l => `<div style="margin:3px 0;font-size:9px;border-left:2px solid #d4af37;padding-left:5px;">${l}</div>`).reverse().join('');
};

// 📱 МОБИЛЕН АДАПТИВЕН ПРОФИЛ (RPG МОДАЛ)
window.inspectLeaderProfile = function(clanKey) {
    const leader = window.worldData?.clans?.[clanKey] || window.currentHero;
    if (!leader) return;
    const old = document.getElementById('dynamic-leader-profile'); if (old) old.remove();

    let skills = "";
    Object.entries(leader.skills || {}).forEach(([k, v]) => {
        if (v > 0) skills += `<div style="font-size:10px;margin:2px 0;">• ${window.rpgDatabase?.skillTrees?.[k]?.name || k}: Ниво ${v}</div>`;
    });
    let inv = "";
    (leader.equipment || []).forEach(i => i ? inv += `<span style="font-size:14px;margin:2px;">${i.icon}</span>` : null);

    const overlay = document.createElement('div');
    overlay.id = "dynamic-leader-profile";
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);z-index:5000;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;`;
    
    overlay.innerHTML = `
        <button onclick="this.parentElement.remove()" style="position:absolute;top:10px;left:10px;width:40px;height:40px;background:#111;border:1px solid #ff3366;color:#ff3366;border-radius:50%;font-size:20px;z-index:5001;cursor:pointer;">✕</button>
        <div style="background:#0a0a0a;border:1px solid #d4af37;width:100%;max-width:400px;max-height:90vh;overflow-y:auto;padding:20px 15px;border-radius:8px;color:#fff;font-family:'Cinzel',serif;">
            <div style="display:flex;gap:10px;margin-bottom:10px;border-bottom:1px solid #333;padding-bottom:10px;">
                <div style="font-size:40px;">👑</div>
                <div><h3 style="margin:0;color:#ffd700;font-size:16px;">${leader.name}</h3><div style="font-size:11px;color:#aaa;">Ниво ${leader.level} | ${leader.currentClass}</div></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:11px;background:rgba(255,255,255,0.05);padding:8px;border-radius:4px;margin-bottom:10px;">
                <div>Злато: 💰${leader.gold}</div><div>Войска: ⚔️${leader.armySize}</div>
                <div>Сила: 🗡️${leader.heroPower}</div><div>Точки: ✨${leader.skillPoints}</div>
            </div>
            <h4 style="margin:5px 0;color:#ffcc00;font-size:12px;">Умения:</h4>
            <div style="margin-bottom:10px;font-size:10px;">${skills || "Няма развити умения."}</div>
            <h4 style="margin:5px 0;color:#00ffcc;font-size:12px;">Екипировка:</h4>
            <div style="display:flex;flex-wrap:wrap;gap:5px;">${inv || "Празна."}</div>
        </div>
    `;
    document.body.appendChild(overlay);
};
