/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Синхронизиран: Визуализация на 50 региона, 13 династии и СИСТЕМА ЗА СЪБИТИЯ.
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
            
            if (!regData) {
                treeHTML += `
                    <div style="border: 1px solid #444; background: #1a0000; padding: 6px; margin-bottom: 3px; font-size: 10px; color: #ff6b6b;">
                        ⚠️ ${regName} (Непозната земя)
                    </div>`;
                return;
            }

            const managingClanName = regData.nativeClans.find(c => window.worldData.clans[c] && window.worldData.clans[c].isJoined) || hero.dynasty;
            const regClanIcon = window.worldData.clans[managingClanName]?.icon || "";

            treeHTML += `
                <div style="border: 1px solid #222; background: #0c0c0c; padding: 6px; margin-bottom: 3px; border-left: 2px solid #d4af37; font-size: 10px; display: flex; align-items: center;">
                    <img src="${regClanIcon}" style="width:14px; margin-right:8px; opacity: 0.8;" onerror="this.src='assets/icons/clans/default.png'">
                    <div style="flex-grow: 1;">
                        <div style="color: #fff;">${regName}</div>
                        <div style="font-size: 7px; color: #666;">Ресурс: ${regData.resource}</div>
                    </div>
                </div>`;
        });

        leftSidebar.innerHTML = treeHTML;
    }

    window.renderClanHierarchy();

    const elements = { 
        'gold-amount': hero.gold, 
        'army-val': hero.armySize, 
        'hero-power-val': hero.heroPower 
    };
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
                <img src="${clan.icon}" style="width: 24px; height: 24px; margin-right: 10px;" onerror="this.src='assets/icons/clans/default.png'">
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

/**
 * СИСТЕМА ЗА МОДАЛНИ ПРОЗОРЦИ (СЪБИТИЯ)
 */
window.showEventModal = function(event) {
    if (!event) return;

    let modal = document.getElementById('event-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; justify-content:center; align-items:center; z-index:9999; font-family: 'Cinzel', serif;";
        document.body.appendChild(modal);
    }

    let optionsHTML = event.options.map((opt, index) => `
        <button onclick="window.handleEventChoice(${index})" style="display:block; width:100%; padding:15px; margin-top:10px; background:#111; border:1px solid #d4af37; color:#d4af37; cursor:pointer; font-family:'Cinzel'; transition: 0.3s; font-size: 12px;" onmouseover="this.style.background='#d4af37'; this.style.color='#000'" onmouseout="this.style.background='#111'; this.style.color='#d4af37'">
            ${opt.text}
        </button>
    `).join('');

    modal.innerHTML = `
        <div style="background:#050505; border:2px solid #d4af37; padding:40px; max-width:550px; width:90%; text-align:center; box-shadow: 0 0 30px rgba(212,175,55,0.2);">
            <h2 style="color:#d4af37; margin-top:0; border-bottom:1px solid #d4af37; padding-bottom:15px; letter-spacing: 2px;">${event.title.toUpperCase()}</h2>
            <p style="color:#e0e0e0; line-height:1.7; margin:25px 0; font-size: 14px;">${event.text}</p>
            <div id="event-options">${optionsHTML}</div>
        </div>
    `;

    modal.style.display = 'flex';

    window.handleEventChoice = function(choiceIndex) {
        const option = event.options[choiceIndex];
        const resultText = option.action(window.currentHero);
        
        modal.innerHTML = `
            <div style="background:#050505; border:2px solid #d4af37; padding:40px; max-width:550px; width:90%; text-align:center;">
                <h2 style="color:#d4af37; letter-spacing: 2px;">СЛУЧИ СЕ:</h2>
                <p style="color:#fff; margin:25px 0; font-size: 15px; line-height:1.6;">${resultText}</p>
                <button onclick="document.getElementById('event-modal').style.display='none'; window.updateCharacterUI(window.currentHero);" style="padding:12px 30px; background:#d4af37; border:none; color:#000; cursor:pointer; font-weight:bold; font-family:'Cinzel'; letter-spacing: 1px;">Продължи</button>
            </div>
        `;
    };
};
