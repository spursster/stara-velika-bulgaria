// ==================== regions.js – НОВА ИНТЕРАКТИВНА КАРТА С РЕГИОНИ ====================
window.openRegionsMap = function() {
    const oldModal = document.getElementById('regions-map-overlay');
    if (oldModal) oldModal.remove();

    // Вземаме регионите от worldData или създаваме примерни
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

    // Определяме кои региони са завладени от играча
    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    // Функция за получаване на името на владетеля (кой контролира региона)
    function getRegionOwner(region) {
        if (ownedRegions.includes(region.name)) return "Вие";
        if (region.nativeClans && region.nativeClans.length > 0) {
            let ownerClan = region.nativeClans[0];
            // Ако кланът е в worldData.clans и има лидер, покажи лидера
            if (window.worldData && window.worldData.clans && window.worldData.clans[ownerClan]) {
                return window.worldData.clans[ownerClan].leaderName || ownerClan;
            }
            return ownerClan;
        }
        return "Независим";
    }

    // Функция за получаване на цвят на картата (за визуален контраст)
    function getRegionColor(region) {
        if (ownedRegions.includes(region.name)) return "#2c5a2a";
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
            <!-- Заглавие с бутон за затваряне най-отгоре вляво -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d4af37; padding: 12px 20px; background: rgba(0,0,0,0.3); flex-shrink: 0;">
                <button id="closeMapBtnTopLeft" style="background: rgba(255,80,80,0.2); border: 1px solid #ff8888; color: #ff8888; font-size: 20px; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.background='rgba(255,80,80,0.4)';" onmouseout="this.style.background='rgba(255,80,80,0.2)';">✕</button>
                <h2 style="color: #ffd700; margin: 0; font-size: 1.4rem; text-align: center; flex: 1;">🗺️ ИНТЕРАКТИВНА КАРТА</h2>
                <div style="width: 36px;"></div> <!-- баланс -->
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

    // Функция за затваряне
    const closeMap = () => modal.remove();

    // Добавяне на слушатели за затваряне
    const closeBtnTop = document.getElementById('closeMapBtnTopLeft');
    const closeBtnBottom = document.getElementById('closeMapBtnBottom');
    if (closeBtnTop) closeBtnTop.addEventListener('click', closeMap);
    if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeMap);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeMap(); });

    // Добавяне на функционалност към регионите – при клик стартира битка или инспекция
    document.querySelectorAll('.region-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const regionName = card.getAttribute('data-region');
            const isOwned = ownedRegions.includes(regionName);
            if (isOwned) {
                // Ако регионът е наш, отваряме инспекция (може да се извика inspectRegion)
                if (typeof window.inspectRegion === 'function') {
                    window.inspectRegion(regionName);
                } else {
                    alert(`Регион ${regionName} е ваш. Можете да го инспектирате от картата.`);
                }
            } else {
                // Стартира битка за завладяване
                closeMap(); // затваряме картата преди битка
                if (typeof window.startBattle === 'function') {
                    window.startBattle(regionName);
                } else {
                    alert(`Битка за ${regionName} (системата за битка не е готова)`);
                }
            }
        });
    });

    // Добавяне на адаптивни стилове за мобилни устройства (ако не съществуват)
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
        alert("Регионът не съществува!");
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
                if (window.showAdvisorMsg) window.showAdvisorMsg(`🏗️ Инфраструктурата на ${regionName} е модернизирана!`);
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                overlay.remove();
                window.openRegionsMap(); // опреснява картата
            } else {
                if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато!");
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
                alert("Бойната система не е заредена!");
            }
        };
        actionDiv.appendChild(attackBtn);
    }

    const closeX = content.querySelector('#close-inspect-x');
    const closeFooter = content.querySelector('#close-inspect-footer');
    const closeHandler = () => overlay.remove();
    if (closeX) closeX.addEventListener('click', closeHandler);
    if (closeFooter) closeFooter.addEventListener('click', closeHandler);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
};

// ==================== Помощна функция за обновяване на картата (ако е отворена) ====================
window.refreshRegionsMap = function() {
    const modal = document.getElementById('regions-map-overlay');
    if (modal) {
        window.openRegionsMap(); // презарежда картата
    }
};
