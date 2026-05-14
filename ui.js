/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Актуализиран: Стабилна визуализация и йерархия на родовете.
 */

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        const currentClanData = window.worldData.clans[hero.dynasty];
        const clanIcon = currentClanData ? `<img src="${currentClanData.icon}" style="width:20px; vertical-align:middle; margin-right:5px;">` : '🏇';
        const marriageIcon = window.currentSpouse ? ' <span title="Сключен династичен съюз" style="cursor:help;">💍</span>' : '';

        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 9px; color: #d4af37;">УПРАВЛЯВАЩ РОД: ${hero.dynasty.toUpperCase()}</div>
                <div style="font-size: 25px; margin: 5px 0;">${clanIcon}</div>
                <div style="font-size: 12px; font-weight: bold; color: #fff;">Кан ${hero.name}${marriageIcon}</div>
            </div>
            <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel'; margin-bottom: 5px;">ВЛАДЕНИЯ И УПРАВИТЕЛИ:</div>
        `;

        const regions = window.playerRegions || [];
        regions.forEach(regName => {
            const regData = window.worldData.regions[regName];
            
            // ЗАЩИТА: Ако регионът не съществува в world_data.js, показваме го без икона на род
            if (!regData) {
                treeHTML += `
                    <div style="border: 1px solid #444; background: #1a0000; padding: 6px; margin-bottom: 3px; font-size: 10px; color: #ff6b6b;">
                        ⚠️ ${regName} (Липсват данни)
                    </div>`;
                return;
            }

            const managingClanName = regData.nativeClans.find(c => window.worldData.clans[c] && window.worldData.clans[c].isJoined) || hero.dynasty;
            const regClanIcon = window.worldData.clans[managingClanName]?.icon || "";

            treeHTML += `
                <div style="border: 1px solid #222; background: #0c0c0c; padding: 6px; margin-bottom: 3px; border-left: 2px solid #d4af37; font-size: 10px; display: flex; align-items: center;">
                    <img src="${regClanIcon}" style="width:14px; margin-right:8px; opacity: 0.8;">
                    <span>${regName}</span>
                </div>`;
        });

        if (window.currentSpouse) {
            const spouseClanIcon = window.worldData.clans[window.currentSpouse.dynasty]?.icon || "👸";
            treeHTML += `
                <div style="margin-top: 15px; text-align: center; padding: 8px; background: rgba(123, 26, 26, 0.2); border: 1px solid #7b1a1a; border-radius: 5px;">
                    <div style="font-size: 8px; color: #ff6b6b;">СЪЮЗ С РОД ${window.currentSpouse.dynasty.toUpperCase()}</div>
                    <img src="${spouseClanIcon}" style="width:18px; margin: 5px 0;">
                    <div style="font-size: 10px; color: #fff;">Княгиня</div>
                </div>
            `;
        }
        leftSidebar.innerHTML = treeHTML;
    }

    // Обновяване на десния панел
    window.renderClanHierarchy();

    // Синхронизация на ресурсите
    const elements = { 'gold-amount': hero.gold, 'army-val': hero.armySize, 'hero-power-val': hero.heroPower };
    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }
};

window.renderClanHierarchy = function() {
    const rightPanel = document.getElementById('events-center');
    if (!rightPanel) return;

    const joinedClansNames = window.recalculateClanHierarchy ? window.recalculateClanHierarchy() : [];
    
    let html = `<div style="font-family: 'Cinzel'; color: #d4af37; font-size: 12px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px; text-align:center;">ВЕЛИКО ОБЕДИНЕНИЕ</div>`;
    
    joinedClansNames.forEach(name => {
        const clan = window.worldData.clans[name];
        const isRuler = name === window.currentHero.dynasty;
        
        html += `
            <div style="display: flex; align-items: center; padding: 8px; background: ${isRuler ? 'rgba(212,175,55,0.1)' : '#0a0a0a'}; border: 1px solid ${isRuler ? '#d4af37' : '#222'}; margin-bottom: 5px; border-radius: 3px;">
                <img src="${clan.icon}" style="width: 24px; height: 24px; margin-right: 10px;">
                <div style="flex-grow: 1;">
                    <div style="font-size: 11px; color: #fff; font-weight: bold;">${clan.leader}</div>
                    <div style="font-size: 8px; color: #aaa;">Род ${name}</div>
                </div>
                <div style="font-size: 10px; color: #d4af37;">${clan.regionsOwned} 🏰</div>
            </div>
        `;
    });

    const missingCount = Math.max(0, 13 - joinedClansNames.length);
    for(let i=0; i < missingCount; i++) {
        html += `<div style="height: 40px; border: 1px dashed #333; margin-bottom: 5px; opacity: 0.3; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #555;">ТЪРСИ СЪЮЗНИК...</div>`;
    }

    rightPanel.innerHTML = html;
};

// ... (showAdvisorMsg и clearMainArea остават същите)
