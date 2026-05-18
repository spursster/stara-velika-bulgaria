/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ, ЛЕНТА НА ЕЛИТА И ИНСПЕКЦИЯ НА КЛАНОВЕТЕ)
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН
 * НАДГРАДАНЕ: Фиксиран бутон "Auto/Manual" (Ькшд) чрез добавяне на toggleHeroAutoMode.
 * Статистика на файловете в проекта: 15
 * ==========================================================================
 */

window.eventHistory = [];  

if (!window.autoLevelState) {
    window.autoLevelState = {};
}

/**
 * Глобална функция за превключване на Цял Екран (Full Screen)
 */
window.toggleGameFullScreen = function() {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) { docEl.requestFullscreen(); } 
        else if (docEl.mozRequestFullScreen) { docEl.mozRequestFullScreen(); } 
        else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); } 
        else if (docEl.msRequestFullscreen) { docEl.msRequestFullscreen(); }
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
    }
};

/**
 * 👑 ДИНАМИЧНО ЧЕРТАЕНЕ НА ЛЕНТАТА НА ЕЛИТА (ТОП 6 ГЕРОИ С НАЙ-ВИСОК ОПИТ)
 */
window.renderTop6HeroesUI = function() {
    const eliteBar = document.getElementById('top-elite-heroes-bar');
    if (!eliteBar) return;

    if (!window.worldData || !window.worldData.clans) return;

    let leaders = Object.entries(window.worldData.clans).map(([clanKey, data]) => {
        return { clanKey: clanKey, ...data };
    });

    leaders.sort((a, b) => {
        if ((b.level || 1) !== (a.level || 1)) {
            return (b.level || 1) - (a.level || 1);
        }
        return (b.xp || 0) - (a.xp || 0);
    });

    const top6 = leaders.slice(0, 6);
    eliteBar.innerHTML = ""; 

    top6.forEach(leader => {
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(leader);

        const card = document.createElement('div');
        card.className = "elite-hero-card";

        card.onclick = (e) => {
            if (e.target.classList.contains('auto-btn')) return; 
            if (window.openHeroRPGModal) window.openHeroRPGModal(leader.clanKey);
        };

        let currentXP = leader.xp || 0;
        let reqXP = 150;
        if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) {
            reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level || 1);
        }
        
        if (!leader.isAuto) {
            currentXP = leader.storedXP || 0;
        }
        
        let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));

        let petIcon = "";
        if (leader.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase[leader.pet]) {
            petIcon = window.rpgDatabase.petsDatabase[leader.pet].icon;
        }

        const autoClass = leader.isAuto ? "auto-btn active" : "auto-btn";
        const autoText = leader.isAuto ? "Auto" : "Manual";
        const heroName = leader.hero || leader.name || "Воевода";

        card.innerHTML = `
            <div style="font-size: 11px; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${petIcon} ${heroName}
            </div>
            <div style="font-size: 9px; color: #aaa;">Ниво ${leader.level || 1} | ${leader.currentClass || "Багатур"}</div>
            
            <div class="rpg-xp-container" title="Опит: ${currentXP}/${reqXP}">
                <div class="rpg-xp-fill" style="width: ${xpPercent}%; ${!leader.isAuto ? 'background: linear-gradient(90deg, #ffcc00, #ff6600) !important;' : ''}"></div>
            </div>
            
            <button class="${autoClass}" onclick="window.toggleHeroAutoMode('${leader.clanKey}')">
                ${autoText}
            </button>
        `;

        eliteBar.appendChild(card);
    });
};

/**
 * ОСНОВНО ОБНОВЯВАНЕ НА ЛЕВИЯ ПАНЕЛ (ТЕКУЩ АКТИВЕН ИГРАЧ / ВОДАЧ)
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;
    window.currentHero = hero;

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    const goldDisplay = document.getElementById('val-gold');
    if (goldDisplay) goldDisplay.innerText = hero.gold || 0;

    const armyDisplay = document.getElementById('val-army');
    if (armyDisplay) armyDisplay.innerText = hero.armySize || 0;

    const powerDisplay = document.getElementById('val-hero-power');
    if (powerDisplay) powerDisplay.innerText = hero.heroPower || 100;

    const nameDisplay = document.getElementById('active-character-profile');
    if (nameDisplay) {
        let petStatus = "Няма";
        if (hero.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase[hero.pet]) {
            const p = window.rpgDatabase.petsDatabase[hero.pet];
            petStatus = `${p.icon} ${p.name}`;
        }

        nameDisplay.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: bold; color: #ffd700; margin-bottom: 5px;">${hero.name || "Неизвестен"}</div>
            <div style="font-size: 0.85rem; color: #ccc; margin-bottom: 10px;">Род ${hero.clan || "Свободен"} | ${hero.currentClass || "Багатур"}</div>
            <div style="font-size:0.85rem; text-align: left; display: flex; flex-direction: column; gap: 4px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
                <div>Ниво: <strong>${hero.level || 1}</strong></div>
                <div>Възраст: <strong>${hero.age || 25} г.</strong></div>
                <div>Любимец: <strong style="color:#ffd700;">${petStatus}</strong></div>
            </div>
        `;
    }

    const leftPanel = document.getElementById('sidebar-left');
    if (leftPanel && !document.getElementById('open-rpg-modal-btn')) {
        const rpgBtn = document.createElement('button');
        rpgBtn.id = "open-rpg-modal-btn";
        rpgBtn.className = "menu-btn";
        rpgBtn.style.cssText = "width:100%; margin-top:10px; padding:8px; font-size:11px;";
        rpgBtn.innerText = "🎒 Управление на Героя";
        rpgBtn.onclick = () => {
            if (window.openHeroRPGModal) window.openHeroRPGModal(hero.clan);
        };
        leftPanel.appendChild(rpgBtn);
    }

    window.renderTop6HeroesUI();
};

/**
 * ДОБАВЯНЕ НА СЪБИТИЕ В ЖУРНАЛА НА СЪВЕТНИКА
 */
window.showAdvisorMsg = function(msg) {
    const journal = document.getElementById('advisor-journal');
    if (!journal) {
        console.log("Журнал съветник:", msg);
        return;
    }

    window.eventHistory.push(msg);
    if (window.eventHistory.length > 50) window.eventHistory.shift();

    journal.innerHTML = window.eventHistory.map(line => `
        <div style="margin-bottom: 8px; font-size: 12px; border-left: 2px solid #d4af37; padding-left: 8px; line-height: 1.4; font-family: 'Montserrat', sans-serif;">
            ${line}
        </div>
    `).reverse().join('');
};

/**
 * ИНСПЕКЦИЯ И ДЕТАЙЛЕН СТЪКЛЕН ПРОФИЛ НА ДИНАСТИЧЕН КЛАН
 */
window.inspectLeaderProfile = function(clanKey) {
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) {
        alert("Грешка: Неуспешно извличане на данни за избрания род.");
        return;
    }

    const leader = window.worldData.clans[clanKey];
    const oldProfile = document.getElementById('dynamic-leader-profile');
    if (oldProfile) oldProfile.remove();

    let skillsHTML = `<div style="margin-top:10px; background:rgba(255,255,255,0.02); padding:8px; border-radius:4px; border:1px solid #222;">
                        <h4 style="margin:0 0 5px 0; color:#ffd700; font-size:11px; font-family:'Cinzel'; text-transform:uppercase;">Придобити Способности:</h4>`;
    let hasSkills = false;
    if (leader.skills) {
        Object.entries(leader.skills).forEach(([sKey, sVal]) => {
            if (sVal > 0 && window.rpgDatabase && window.rpgDatabase.skillTrees[sKey]) {
                skillsHTML += `<div style="font-size:10px; color:#ccc; margin-bottom:2px;">• ${window.rpgDatabase.skillTrees[sKey].name}: Ниво ${sVal}</div>`;
                hasSkills = true;
            }
        });
    }
    if (!hasSkills) skillsHTML += `<div style="font-size:10px; color:#555; font-style:italic;">Все още няма развити умения.</div>`;
    skillsHTML += `</div>`;

    let inventoryHTML = `<div style="margin-top:8px; background:rgba(255,255,255,0.02); padding:8px; border-radius:4px; border:1px solid #222;">
                           <h4 style="margin:0 0 5px 0; color:#00ffcc; font-size:11px; font-family:'Cinzel'; text-transform:uppercase;">Налична Екипировка:</h4><div style="display:flex; gap:5px;">`;
    let hasEquipment = false;
    if (leader.equipment) {
        leader.equipment.forEach(item => {
            if (item) {
                inventoryHTML += `<span title="${item.name}" style="font-size:16px; background:#111; padding:4px; border-radius:4px; border:1px solid #333;">${item.icon}</span>`;
                hasEquipment = true;
            }
        });
    }
    if (!hasEquipment) inventoryHTML += `<div style="font-size:10px; color:#555; font-style:italic;">Няма екипирани предмети.</div>`;
    inventoryHTML += `</div></div>`;

    const overlay = document.createElement('div');
    overlay.id = "dynamic-leader-profile";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center; z-index: 5000;
    `;

    const currentHeroName = leader.hero || leader.name || "Воевода";

    overlay.innerHTML = `
        <div class="leader-card" style="width: 340px; background: rgba(15,15,15,0.95) !important; border: 2px solid #d4af37 !important; box-shadow: 0 0 30px rgba(0,0,0,0.9); flex-direction: column !important; gap: 12px !important;">
            <div style="display: flex; gap: 15px; width: 100%; border-bottom: 1px solid #222; padding-bottom: 10px;">
                <div style="width: 70px; height: 70px; border-radius: 6px; border: 1px solid #d4af37; overflow: hidden; background: #000;">
                    <img src="${leader.avatar || ''}" alt="" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div style="flex:1;">
                    <h3 style="margin: 0; font-family: 'Cinzel', serif; font-size: 15px; color: #ffd700;">${currentHeroName}</h3>
                    <div style="font-size: 11px; color: #888; margin-top: 2px;">Родов Водач</div>
                    <div style="font-size: 14px; color: #ff3366; font-weight: bold; margin-top: 5px;">⚔️ ${leader.heroPower || 100} Сила</div>
                </div>
            </div>
            
            <div style="font-size:11px; color:#aaa; display:grid; grid-template-columns:1fr 1fr; gap:5px; background:rgba(0,0,0,0.4); padding:8px; border-radius:4px; width:100%; box-sizing:border-box;">
                <div>Род: <strong>${clanKey}</strong></div>
                <div>Ниво: <strong>${leader.level || 1}</strong></div>
                <div>Лично злато: <strong>💰 ${leader.gold || 0}</strong></div>
                <div>Войска: <strong>⚔️ ${leader.armySize || leader.currentArmy || 0}</strong></div>
                <div style="grid-column: 1 / span 2;">Клас: <strong style="color:#ffd700;">${leader.currentClass || "Багатур"}</strong></div>
            </div>

            <div style="width:100%; text-align:left;">
                ${skillsHTML}
                ${inventoryHTML}
            </div>

            <button onclick="document.getElementById('dynamic-leader-profile').remove()" style="width: 100%; margin-top: 5px; padding: 10px; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; border-radius: 6px; color: #fff; font-family: 'Cinzel', serif; cursor: pointer; font-size: 11px; transition: background 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.3)'" onmouseout="this.style.background='rgba(212,175,55,0.15)'">
                ЗАТВОРИ ПРОФИЛА
            </button>
        </div>
    `;

    document.body.appendChild(overlay);
};

// =========================================================================
// ФИКС: МЕХАНИКА ЗА СМЕНЯНЕ НА АУТО / МАНУАЛ РЕЖИМ (ПОПРАВКА НА "Ькшд")
// =========================================================================
window.toggleHeroAutoMode = function(clanKey) {
    if (!window.worldData || !window.worldData.clans || !window.worldData.clans[clanKey]) {
        console.log("❌ Не бе намерен такъв Клан/Герой в базата данни.");
        return;
    }

    let leader = window.worldData.clans[clanKey];
    
    // Превключваме състоянието
    leader.isAuto = !leader.isAuto;

    // Инициализираме структурите при нужда, за да няма неопределени стойности (undefined)
    if (leader.isAuto === undefined) leader.isAuto = false;
    if (leader.storedXP === undefined) leader.storedXP = 0;

    console.log(`👑 Героят от род "${clanKey}" премина в режим: ${leader.isAuto ? "Автоматичен (Auto)" : "Ръчен (Manual)"}`);

    // Веднага преначертаваме лентата, за да се види обновеният цвят на бутона
    window.renderTop6HeroesUI();
};
