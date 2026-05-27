// ==================== regions.js – НОВА ИНТЕРАКТИВНА КАРТА С РЕГИОНИ (ХАРМОНИЗИРАНА) ====================

// Помощна функция за показване на съобщения (попап или летопис)
function showRegionMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        alert(message);
    }
}

window.openRegionsMap = function() {
    const oldModal = document.getElementById('regions-map-overlay');
    if (oldModal) oldModal.remove();

    let regions = [];
    if (window.worldData && window.worldData.regions) {
        regions = Object.values(window.worldData.regions);
    } else {
        regions = [
            { name: "Плиска", armySize: 150, defenseLevel: 1, nativeClans: ["Дуло"] },
            { name: "Преслав", armySize: 200, defenseLevel: 2, nativeClans: ["Дуло"] },
            { name: "Търновград", armySize: 250, defenseLevel: 3, nativeClans: ["Асеневци"] }
        ];
    }

    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    function getRegionOwner(region) {
        if (ownedRegions.includes(region.name)) return "Вие";
        if (region.nativeClans && region.nativeClans.length > 0) {
            let ownerClan = region.nativeClans[0];
            if (window.worldData && window.worldData.clans && window.worldData.clans[ownerClan]) {
                return window.worldData.clans[ownerClan].name || window.worldData.clans[ownerClan].leaderName || ownerClan;
            }
            return ownerClan;
        }
        return "Независим";
    }

    function getRegionColor(region) {
        if (ownedRegions.includes(region.name)) return "#2c5a2a"; // Player - Green

        if (region.nativeClans && region.nativeClans.length > 0) {
            let ownerClan = region.nativeClans[0];
            let clanData = window.worldData && window.worldData.clans ? window.worldData.clans[ownerClan] : null;
            
            if (clanData) {
                // If it is a favorite hero, use a distinct color.
                if (clanData.isFavorite === true) return "#1a5a8a"; // Blue for favorite heroes
                return "#5a1a1a"; // Red for other heroes/non-favorite
            }
        }

        // Default difficulty-based fallback
        if (region.difficulty > 70) return "#5a1a1a";
        if (region.difficulty > 40) return "#4a2a1a";
        return "#2a2a3a";
    }

    const modal = document.createElement('div');
    modal.id = 'regions-map-overlay';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        z-index: 200000; display: flex; align-items: center; justify-content: center;
        font-family: 'Cinzel', serif; padding: 15px; box-sizing: border-box;
    `;

    let regionsHtml = '';
    regions.forEach(region => {
        const owner = getRegionOwner(region);
        const isOwned = ownedRegions.includes(region.name);
        const bgColor = getRegionColor(region);
        const borderStyle = isOwned ? "2px solid #ffd700" : "1px solid rgba(255,215,0,0.3)";
        regionsHtml += `
            <div class="region-card" data-region="${region.name}" style="
                background: ${bgColor};
                border: ${borderStyle};
                border-radius: 16px;
                padding: 12px;
                margin: 8px;
                width: 160px;
                display: inline-block;
                text-align: center;
                transition: all 0.2s ease;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                backdrop-filter: blur(4px);
            " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.3)';">
                <div style="font-size: 28px;">🏰</div>
                <div style="font-weight: bold; color: #ffd700; font-size: 1rem; margin: 5px 0;">${region.name}</div>
                <div style="font-size: 11px; color: #ddd;">Войска: ${region.armySize || 0}</div>
                <div style="font-size: 11px; color: #ccc;">Защита: ниво ${region.defenseLevel || 1}</div>
                <div style="font-size: 11px; margin-top: 5px; ${isOwned ? 'color: #88ff88;' : 'color: #ffaa88;'}">👑 ${owner}</div>
                ${!isOwned ? `<div style="margin-top: 8px;"><span style="background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 12px; font-size: 10px;">⚔️ Атакувай</span></div>` : `<div style="margin-top: 8px;"><span style="background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 12px; font-size: 10px;">🏠 Ваш регион</span></div>`}
            </div>
        `;
    });

    modal.innerHTML = `
        <div style="background: rgba(10,10,20,0.95); border: 2px solid #d4af37; border-radius: 28px; max-width: 95%; max-height: 90%; width: 100%; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d4af37; padding: 12px 20px; background: rgba(0,0,0,0.3); flex-shrink: 0;">
                <button id="closeMapBtnTopLeft" style="background: rgba(255,80,80,0.2); border: 1px solid #ff8888; color: #ff8888; font-size: 20px; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.background='rgba(255,80,80,0.4)';" onmouseout="this.style.background='rgba(255,80,80,0.2)';">✕</button>
                <h2 style="color: #ffd700; margin: 0; font-size: 1.4rem; text-align: center; flex: 1;">🗺️ ИНТЕРАКТИВНА КАРТА</h2>
                <div style="width: 36px;"></div>
            </div>
            <div style="padding: 20px; overflow-y: auto; text-align: center; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                ${regionsHtml}
            </div>
            <div style="text-align: center; padding: 15px; border-top: 1px solid rgba(255,215,0,0.3); flex-shrink: 0;">
                <button id="closeMapBtnBottom" style="background: #2c2c3a; border: 1px solid #d4af37; color: #ffd700; padding: 8px 20px; border-radius: 30px; cursor: pointer; font-weight: bold;">Затвори</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeMap = () => modal.remove();

    const closeBtnTop = document.getElementById('closeMapBtnTopLeft');
    const closeBtnBottom = document.getElementById('closeMapBtnBottom');
    if (closeBtnTop) closeBtnTop.addEventListener('click', closeMap);
    if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeMap);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeMap(); });

    document.querySelectorAll('.region-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const regionName = card.getAttribute('data-region');
            const isOwned = ownedRegions.includes(regionName);
            if (isOwned) {
                if (typeof window.inspectRegion === 'function') {
                    window.inspectRegion(regionName);
                } else {
                    showRegionMessage("ИНСПЕКЦИЯ", `Регион ${regionName} е ваш. Можете да го инспектирате от картата.`, "info");
                }
            } else {
                closeMap();
                if (typeof window.startBattle === 'function') {
                    window.startBattle(regionName);
                } else {
                    showRegionMessage("ГРЕШКА", `Битка за ${regionName} (системата за битка не е готова)`, "error");
                }
            }
        });
    });

    if (!document.getElementById('regions-map-responsive-style')) {
        const style = document.createElement('style');
        style.id = 'regions-map-responsive-style';
        style.textContent = `
            @media (max-width: 768px) {
                .region-card {
                    width: calc(50% - 20px) !important;
                    min-width: 120px !important;
                }
            }
            @media (max-width: 480px) {
                .region-card {
                    width: calc(100% - 20px) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// ==================== Функция за инспекция на регион (подобрена) ====================
window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions[regionName]) {
        showRegionMessage("ГРЕШКА", "Регионът не съществува!", "error");
        return;
    }
    const reg = window.worldData.regions[regionName];
    const hero = window.currentHero;
    if (!hero) return;

    const owned = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];
    const isOwned = owned.includes(regionName);
    const ownerName = isOwned ? "Ваш регион" : (reg.nativeClans ? reg.nativeClans[0] : "Независим");

    let upgradeCost = 500;
    if (hero.skills && hero.skills.economy) upgradeCost = Math.max(100, 500 * (1 - hero.skills.economy * 0.1));

    const oldOverlay = document.getElementById('region-inspect-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'region-inspect-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(6px);
        display: flex; justify-content: center; align-items: center;
        z-index: 50001; font-family: 'Cinzel', serif; padding: 15px;
        box-sizing: border-box;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: rgba(0,0,0,0.9); border-radius: 28px; padding: 20px;
        max-width: 450px; width: 100%; text-align: center;
        border: 1px solid #c9a87b; box-shadow: 0 20px 35px rgba(0,0,0,0.5);
        position: relative;
    `;

    content.innerHTML = `
        <button id="close-inspect-x" style="position: absolute; top: 12px; left: 12px; background: rgba(255,80,80,0.2); border: 1px solid #ff8888; color: #ff8888; font-size: 18px; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        <h3 style="color: #ffdd99; margin-top: 5px;">🏛️ Инспекция: ${regionName}</h3>
        <p>⛰️ Терен: ${reg.terrain || "Неизвестен"}</p>
        <p>💰 Ресурс: ${reg.resource || "Неизвестен"}</p>
        <p>🏴 Контролиращ Клан: ${ownerName}</p>
        <p>🛡️ Защита: Ниво ${reg.defenseLevel || 1}</p>
        <p>🏗️ Инфраструктура: Ниво ${reg.infrastructureLevel || 1}</p>
        <p>⚠️ Трудност: ${reg.difficulty || 50}%</p>
        <div id="action-div" style="margin: 20px 0;"></div>
        <button id="close-inspect-footer" style="background: #333; border: 1px solid #666; padding: 8px 20px; border-radius: 40px; color: #ffdd99; cursor: pointer; margin-top: 5px;">Затвори</button>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    const actionDiv = content.querySelector('#action-div');
    if (isOwned) {
        const upgradeBtn = document.createElement('button');
        upgradeBtn.innerText = `🏗️ Модернизирай (${upgradeCost} зл.)`;
        upgradeBtn.style.cssText = `background:#2c5a2a; border:none; border-bottom:2px solid #1e3a1e; padding:8px 20px; border-radius:40px; color:white; cursor:pointer; font-weight:bold; width:100%;`;
        upgradeBtn.onclick = () => {
            if (hero.gold >= upgradeCost) {
                hero.gold -= upgradeCost;
                reg.infrastructureLevel = (reg.infrastructureLevel || 1) + 1;
                reg.defenseLevel = (reg.defenseLevel || 1) + 1;
                showRegionMessage("МОДЕРНИЗАЦИЯ", `🏗️ Инфраструктурата на ${regionName} е модернизирана!`, "success");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                overlay.remove();
                window.openRegionsMap();
            } else {
                showRegionMessage("ГРЕШКА", "Нямате достатъчно злато!", "error");
            }
        };
        actionDiv.appendChild(upgradeBtn);
    } else {
        const attackBtn = document.createElement('button');
        attackBtn.innerText = '⚔️ ИЗПРАТИ ВОЙСКИ ЗА ЗАВЛАДЯВАНЕ ⚔️';
        attackBtn.style.cssText = `background:#7a2e1a; border:none; border-bottom:2px solid #5a1e0a; padding:8px 20px; border-radius:40px; color:#ffdd99; cursor:pointer; font-weight:bold; width:100%;`;
        attackBtn.onclick = () => {
            if (window.startBattle) {
                overlay.remove();
                window.startBattle(regionName);
            } else {
                showRegionMessage("ГРЕШКА", "Бойната система не е заредена!", "error");
            }
        };
        actionDiv.appendChild(attackBtn);
    }

    const closeX = content.querySelector('#close-inspect-x');
    const closeFooter = content.querySelector('#close-inspect-footer');
    const closeHandler = () => overlay.remove();
    if (closeX) closeX.addEventListener('click', closeHandler);
    if (closeFooter) closeFooter.addEventListener('click', closeHandler);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeHandler(); });
};

// ==================== Помощна функция за обновяване на картата ====================
window.refreshRegionsMap = function() {
    const modal = document.getElementById('regions-map-overlay');
    if (modal) {
        window.openRegionsMap();
    }
};
