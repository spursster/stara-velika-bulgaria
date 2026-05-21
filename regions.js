// ==================== regions.js – КАРТА И ИНСПЕКЦИЯ (КОРИГИРАН – СТАРТИРА БИТКА) ====================
window.openRegionsMap = function() {
    const oldModal = document.getElementById('regions-map-overlay');
    if (oldModal) oldModal.remove();

    const regions = window.worldData?.regions ? Object.values(window.worldData.regions) : [
        { name: "Мизия", armySize: 150, defenseLevel: 1 },
        { name: "Тракия", armySize: 200, defenseLevel: 2 }
    ];

    const modal = document.createElement('div');
    modal.id = 'regions-map-overlay';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        z-index: 200000; display: flex; align-items: center; justify-content: center;
        font-family: 'Cinzel', serif; padding: 20px; box-sizing: border-box;
    `;

    let regionsHtml = '';
    regions.forEach(region => {
        regionsHtml += `<div style="background:rgba(20,20,30,0.6); border:1px solid #d4af37; border-radius:12px; padding:10px; margin:8px; text-align:center; width:140px; display:inline-block;">
            <div style="font-size:24px;">🏰</div>
            <div style="font-weight:bold; color:#ffd700;">${region.name}</div>
            <div style="font-size:10px; color:#aaa;">⚔️ ${region.armySize || 0} войска</div>
            <button class="conquer-btn" data-region="${region.name}" style="background:#7a2e1a; border:none; padding:4px 8px; border-radius:20px; color:#ffdd99; margin-top:6px; cursor:pointer;">⚔️ Завладяй</button>
        </div>`;
    });

    modal.innerHTML = `
        <div style="background:#0a0a1a; border:2px solid #d4af37; border-radius:24px; max-width:90%; max-height:90%; overflow-y:auto; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                <h2 style="color:#ffd700;">🗺️ Карта на регионите</h2>
                <button id="closeMapBtn" style="background:rgba(255,80,80,0.2); border:none; color:#ff8888; font-size:24px; cursor:pointer; width:36px; height:36px; border-radius:50%;">✕</button>
            </div>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">${regionsHtml}</div>
            <div style="text-align:center; margin-top:20px;">
                <button id="closeMapFooter" style="background:#2c2c3a; border:1px solid #d4af37; color:#ffd700; padding:8px 20px; border-radius:30px; cursor:pointer;">Затвори</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('#closeMapBtn')?.addEventListener('click', close);
    modal.querySelector('#closeMapFooter')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    
    // ФИКС: Стартира битка, а не предупреждение
    modal.querySelectorAll('.conquer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const regionName = btn.getAttribute('data-region');
            close(); // затваря картата
            if (typeof window.startBattle === 'function') {
                window.startBattle(regionName);
            } else {
                console.error("startBattle не е дефинирана!");
                alert("Битката не може да започне – липсва функция startBattle.");
            }
        });
    });
};

// ==================== ОСТАНАЛИТЕ ФУНКЦИИ (НЕПРОМЕНЕНИ) ====================
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
