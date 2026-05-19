// ==================== regions.js – КАРТА И ИНСПЕКЦИЯ ====================
window.openRegionsMap = function() {
    if (!window.worldData || !window.worldData.regions) {
        console.error("Няма региони");
        return;
    }
    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);
    const owned = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];

    let overlay = document.getElementById('regions-map-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'regions-map-overlay';
    overlay.style.cssText = `position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); backdrop-filter:blur(8px); z-index:50000; display:flex; justify-content:center; align-items:center; font-family:'Cinzel',serif; overflow:auto; padding:20px;`;
    
    const container = document.createElement('div');
    container.style.cssText = `background:rgba(0,0,0,0.85); border-radius:32px; border:1px solid #c9a87b; max-width:800px; width:100%; max-height:90vh; overflow:auto; padding:20px;`;
    container.innerHTML = `<h2 style="color:#ffdd99; text-align:center;">🗺️ Карта на Регионите</h2><div id="regions-grid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; margin-top:20px;"></div><button id="close-map-btn" style="display:block; margin:20px auto 0; background:#2c1a0c; border:none; border-bottom:2px solid #a05a2c; padding:8px 24px; border-radius:40px; color:#ffdd99; cursor:pointer;">🔒 Затвори</button>`;
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    const grid = container.querySelector('#regions-grid');
    regionKeys.forEach(key => {
        const reg = regions[key];
        const isOwned = owned.includes(key);
        const controllingClan = (reg.nativeClans && reg.nativeClans[0]) || "Независим";
        const border = isOwned ? "2px solid #00ffcc" : "1px solid #c9a87b";
        const bg = isOwned ? "rgba(0,255,204,0.1)" : "rgba(0,0,0,0.5)";
        const card = document.createElement('div');
        card.style.cssText = `border:${border}; background:${bg}; border-radius:12px; padding:10px; cursor:pointer;`;
        card.innerHTML = `<div style="font-size:1.2rem;">🏰 ${key}</div><div style="font-size:0.8rem;">🏴 ${controllingClan}</div><div style="font-size:0.8rem;">💰 ${reg.resource}</div>`;
        card.onclick = () => {
            window.inspectRegion(key);
            overlay.remove();
        };
        grid.appendChild(card);
    });
    container.querySelector('#close-map-btn').onclick = () => overlay.remove();
};

window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions[regionName]) return;
    const reg = window.worldData.regions[regionName];
    const hero = window.currentHero;
    if (!hero) return;
    const owned = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    const isOwned = owned.includes(regionName);
    let upgradeCost = 500;
    if (hero.skills && hero.skills.economy) upgradeCost = Math.max(100, 500 * (1 - hero.skills.economy * 0.1));
    const nativeClan = (reg.nativeClans && reg.nativeClans[0]) || "Независим";
    
    const old = document.getElementById('region-inspect-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'region-inspect-overlay';
    overlay.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); display:flex; justify-content:center; align-items:center; z-index:50001; font-family:'Cinzel',serif; padding:15px;`;
    const content = document.createElement('div');
    content.style.cssText = `background:rgba(0,0,0,0.9); border-radius:32px; padding:20px; max-width:450px; width:100%; text-align:center; border:1px solid #c9a87b;`;
    content.innerHTML = `
        <h3 style="color:#ffdd99;">🏛️ Инспекция: ${regionName}</h3>
        <p>⛰️ Терен: ${reg.terrain}</p>
        <p>💰 Ресурс: ${reg.resource}</p>
        <p>🏴 Контролиращ Клан: ${nativeClan}</p>
        <p>🛡️ Защита: Ниво ${reg.defenseLevel || 1}</p>
        <p>🏗️ Инфраструктура: Ниво ${reg.infrastructureLevel || 1}</p>
        <p>⚠️ Трудност: ${reg.difficulty}%</p>
        <div id="action-div" style="margin:20px 0;"></div>
        <button id="close-inspect" style="background:#333; border:none; border-bottom:2px solid #666; padding:8px 20px; border-radius:40px; color:#ffdd99; cursor:pointer;">🔒 Затвори</button>
    `;
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    const actionDiv = content.querySelector('#action-div');
    if (isOwned) {
        const upgradeBtn = document.createElement('button');
        upgradeBtn.innerText = `🏗️ Модернизирай (${upgradeCost} зл.)`;
        upgradeBtn.style.cssText = `background:#2c5a2a; border:none; border-bottom:2px solid #1e3a1e; padding:8px 20px; border-radius:40px; color:white; cursor:pointer;`;
        upgradeBtn.onclick = () => {
            if (hero.gold >= upgradeCost) {
                hero.gold -= upgradeCost;
                reg.infrastructureLevel = (reg.infrastructureLevel || 1) + 1;
                reg.defenseLevel = (reg.defenseLevel || 1) + 1;
                if (window.showAdvisorMsg) window.showAdvisorMsg(`🏗️ Инфраструктурата на ${regionName} е модернизирана!`);
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
            } else {
                if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато!");
            }
            overlay.remove();
        };
        actionDiv.appendChild(upgradeBtn);
    } else {
        const attackBtn = document.createElement('button');
        attackBtn.innerText = '⚔️ ИЗПРАТИ ВОЙСКИ ЗА ЗАВЛАДЯВАНЕ ⚔️';
        attackBtn.style.cssText = `background:#7a2e1a; border:none; border-bottom:2px solid #5a1e0a; padding:8px 20px; border-radius:40px; color:#ffdd99; cursor:pointer;`;
        attackBtn.onclick = () => {
            if (window.startBattle) window.startBattle(regionName);
            else alert("Бойната система не е заредена!");
            overlay.remove();
        };
        actionDiv.appendChild(attackBtn);
    }
    content.querySelector('#close-inspect').onclick = () => overlay.remove();
};

window.upgradeRegionInfrastructure = function(regionName, cost) {
    const hero = window.currentHero;
    if (!hero) return;
    if (hero.gold >= cost) {
        hero.gold -= cost;
        const reg = window.worldData.regions[regionName];
        if (reg) {
            reg.infrastructureLevel = (reg.infrastructureLevel || 1) + 1;
            reg.defenseLevel = (reg.defenseLevel || 1) + 1;
        }
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🏗️ Инфраструктурата на ${regionName} е подобрена!`);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато!");
    }
};
