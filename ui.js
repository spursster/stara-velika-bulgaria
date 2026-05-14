/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Актуализиран: Визуализация на йерархията на родовете и икони.
 */

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        // Извличаме иконата на управляващия род от world_data.js
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

        // Изписване на регионите с иконата на съответния род-управител
        const regions = window.playerRegions || [];
        regions.forEach(regName => {
            const regData = window.worldData.regions[regName];
            // Намираме първия nativeClan, който е присъединен, за да му сложим иконата
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

    // Обновяване на десния панел (Обединение на родовете)
    window.renderClanHierarchy();

    // Синхронизация на ресурсите в хедъра
    const goldElem = document.getElementById('gold-amount');
    const armyElem = document.getElementById('army-val');
    const powerElem = document.getElementById('hero-power-val');

    if (goldElem) goldElem.innerText = hero.gold;
    if (armyElem) armyElem.innerText = hero.armySize;
    if (powerElem) powerElem.innerText = hero.heroPower;
};

/**
 * Рендерира десния панел с йерархията на присъединените родове
 */
window.renderClanHierarchy = function() {
    const rightPanel = document.getElementById('events-center'); // Използваме съществуващия контейнер за логове за момента
    if (!rightPanel) return;

    // Вземаме само присъединените родове чрез логиката от world_data.js
    const joinedClansNames = window.recalculateClanHierarchy ? window.recalculateClanHierarchy() : [];
    
    let html = `<div style="font-family: 'Cinzel'; color: #d4af37; font-size: 12px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">ВЕЛИКО ОБЕДИНЕНИЕ</div>`;
    
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

    // Ако има празни места до 13, можем да ги визуализираме като "неоткрити"
    const missingCount = 13 - joinedClansNames.length;
    for(let i=0; i < missingCount; i++) {
        html += `<div style="height: 40px; border: 1px dashed #333; margin-bottom: 5px; opacity: 0.3; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #555;">ТЪРСИ СЪЮЗНИК...</div>`;
    }

    rightPanel.innerHTML = html;
};

window.clearMainArea = function() {
    const mainArea = document.getElementById('game-main-area');
    if (mainArea) mainArea.innerHTML = '';
};

/**
 * ПЕРСОНАЛИЗИРАНО СЪОБЩЕНИЕ ОТ СЪВЕТНИКА
 */
window.showAdvisorMsg = function(text) {
    const oldMsg = document.getElementById('advisor-msg');
    if (oldMsg) oldMsg.remove();

    const msgBox = document.createElement('div');
    msgBox.id = 'advisor-msg';
    msgBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #0a0a0a; border: 2px solid #d4af37; color: #eee;
        padding: 25px; z-index: 9999; width: 320px; text-align: center;
        box-shadow: 0 0 30px rgba(0,0,0,0.9); font-family: 'Cinzel', serif;
        border-radius: 4px;
    `;

    msgBox.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 15px;">📜</div>
        <div style="color: #d4af37; font-size: 11px; margin-bottom: 10px; letter-spacing: 1.5px; border-bottom: 1px solid #333; padding-bottom: 5px;">СЪВЕТНИКА ВИ КАЗА ЧЕ:</div>
        <div style="font-size: 14px; margin-bottom: 25px; line-height: 1.5; color: #fff;">${text}</div>
        <button onclick="this.parentElement.remove()" style="
            background: #d4af37; color: #000; border: none; padding: 10px;
            cursor: pointer; font-family: 'Cinzel'; font-weight: bold; width: 100%;
            transition: 0.3s;
        ">СЛУШАМ, ВЕЛИКИ КАНЕ</button>
    `;

    document.body.appendChild(msgBox);
};
