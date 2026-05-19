/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ, ЛЕНТА НА ЕЛИТА И ИНСПЕКЦИЯ НА КЛАНОВЕТЕ)
 * СТАТУС: НАПЪЛНО НАДГРАДЕН, ИЗЧИСТЕН И СИНХРОНИЗИРАН
 * КОРЕКЦИЯ: Премахната синтактична грешка на ред 20 (излишен символ \), активирани нива и XP ленти!
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
 * 👑 НАДГРАЖДАНЕ: ГЕНЕРИРАНЕ И ИЗРИСУВАНЕ НА ТОП ЛЕНТАТА С ВОДАЧИТЕ (ЛЕНТА НА ЕЛИТА)
 * Показва нивата и прогреса на водачите в реално време!
 */
window.renderTop6LeadersUI = function() {
    const container = document.getElementById('top-leaders-bar-container');
    if (!container) return;

    // Взимаме списъка с отключени водачи
    let leaders = window.unlockedLeaders || [];
    
    if (leaders.length === 0 && window.currentHero) {
        window.unlockedLeaders = [window.currentHero];
        leaders = window.unlockedLeaders;
    }

    container.innerHTML = "";

    leaders.forEach((leader, index) => {
        if (!leader) return;

        // Определяне на родов клан и икона
        const clanKey = leader.clan || leader.dynasty || "Дуло";
        let isMain = (window.currentHero && window.currentHero.name === leader.name);
        
        // Изчисляване на прогреса за XP лентата
        let currentLvl = leader.level || 1;
        let currentXP = leader.xp || 0;
        let reqXP = currentLvl * 150; // Формула от rpg_system.js
        let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));

        const card = document.createElement('div');
        card.className = `leader-bar-card ${isMain ? 'active-main-leader' : ''}`;
        card.style.cssText = `
            background: ${isMain ? 'rgba(214, 175, 55, 0.15)' : 'rgba(20, 20, 20, 0.7)'};
            border: 1px solid ${isMain ? '#d4af37' : '#333'};
            padding: 6px 10px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            position: relative;
            min-width: 160px;
            transition: all 0.2s ease;
            box-shadow: ${isMain ? '0 0 10px rgba(214,175,55,0.2)' : 'none'};
        `;

        // Добавяме маркер за Любим в тактическата петица (сърце)
        let heartTag = leader.isFavoriteInBarracks ? `<span style="color:#ff3366; font-size:11px; position:absolute; top:2px; right:4px;">❤️</span>` : "";
        
        card.innerHTML = `
            ${heartTag}
            <div style="font-size: 20px; filter: drop-shadow(0 0 3px rgba(255,255,255,0.2));">👑</div>
            <div style="flex: 1; text-align: left;">
                <div style="font-size: 11px; font-weight: bold; color: ${isMain ? '#ffd700' : '#fff'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;">
                    ${leader.name}
                </div>
                <div style="font-size: 10px; color: #aaa; display: flex; justify-content: space-between; margin-top: 1px;">
                    <span style="color: #00ffcc; font-weight:bold;">Ниво ${currentLvl}</span>
                    <span>⚔️ ${leader.heroPower || 100}</span>
                </div>
                <div style="width: 100%; height: 3px; background: #222; border-radius: 2px; margin-top: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: ${xpPercent}%; height: 100%; background: linear-gradient(90deg, #00ffcc, #0099ff); transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;

        // При клик отваряме подробния профил за инспекция
        card.onclick = function() {
            window.openDynamicLeaderProfile(leader);
        };

        container.appendChild(card);
    });
};

/**
 * 📑 ДИНАМИЧЕН ИНСПЕКТОР: ПОКАЗВАНЕ НА ПЪЛЕН ПРОФИЛ НА ИЗБРАН ВОДАЧ
 */
window.openDynamicLeaderProfile = function(leader) {
    if (!leader) return;

    // Премахваме предишен отворен профил, ако съществува
    const oldModal = document.getElementById('dynamic-leader-profile');
    if (oldModal) oldModal.remove();

    const clanKey = leader.clan || leader.dynasty || "Дуло";
    let currentLvl = leader.level || 1;
    let currentXP = leader.xp || 0;
    let reqXP = currentLvl * 150;
    let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));

    const modal = document.createElement('div');
    modal.id = 'dynamic-leader-profile';
    modal.style.cssText = `
        position: fixed;
        top: 55px;
        right: 15px;
        width: 310px;
        background: rgba(10, 10, 10, 0.98);
        border: 2px solid #d4af37;
        border-radius: 8px;
        padding: 15px;
        color: white;
        font-family: 'Cinzel', serif;
        z-index: 10005;
        box-shadow: 0 0 30px rgba(0,0,0,0.8);
        box-sizing: border-box;
        animation: fadeInRight 0.25s ease-out;
    `;

    // Изграждане на списък с екипировка
    let itemsHTML = "";
    if (leader.equipment && Array.isArray(leader.equipment)) {
        leader.equipment.forEach((slot, i) => {
            if (slot) {
                itemsHTML += `<div style="background:rgba(214,175,55,0.1); border:1px solid #d4af37; padding:3px 6px; border-radius:4px; font-size:10px; margin-bottom:2px;">🛡️ Slot ${i+1}: ${slot.name || "Предмет"}</div>`;
            }
        });
    }
    if (itemsHTML === "") itemsHTML = "<div style='color:#666; font-size:11px; font-style:italic;'>Оръжейната е празна</div>";

    // Изграждане на списък с разпределени RPG умения
    let skillsHTML = "";
    if (leader.skills) {
        Object.entries(leader.skills).forEach(([sKey, sVal]) => {
            if (sVal > 0) {
                skillsHTML += `<div style="font-size:11px; color:#00ffcc;">• ${sKey}: Ниво ${sVal}</div>`;
            }
        });
    }
    if (skillsHTML === "") skillsHTML = "<div style='color:#666; font-size:11px; font-style:italic;'>Няма развити родови пасиви</div>";

    modal.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:8px; margin-bottom:12px;">
            <h3 style="margin:0; color:#ffd700; font-size:14px; letter-spacing:1px; text-transform:uppercase;">Профил на Водач</h3>
            <span style="cursor:pointer; color:#ff3366; font-weight:bold; font-size:16px;" onclick="document.getElementById('dynamic-leader-profile').remove()">✕</span>
        </div>

        <div style="text-align:center; margin-bottom:12px; background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid #222;">
            <div style="font-size:26px; margin-bottom:4px;">👑</div>
            <strong style="color:#fff; font-size:15px; display:block; letter-spacing:0.5px;">${leader.name}</strong>
            <span style="font-size:11px; color:#aaa;">Род ${clanKey} | ${leader.currentClass || "Багатур"}</span>
            
            <div style="margin-top:10px; font-size:11px; color:#ffd700; display:flex; justify-content:space-between; font-weight:bold;">
                <span>Ниво ${currentLvl}</span>
                <span style="color:#00ffcc;">${currentXP} / ${reqXP} XP</span>
            </div>
            <div style="width:100%; height:6px; background:#111; border-radius:3px; margin-top:4px; overflow:hidden; border:1px solid #333;">
                <div style="width: ${xpPercent}%; height:100%; background:linear-gradient(90deg, #00ffcc 0%, #0099ff 100%); transition: width 0.3s ease;"></div>
            </div>
        </div>

        <div style="font-size:11px; color:#ccc; display:grid; grid-template-columns:1fr 1fr; gap:6px; background:rgba(0,0,0,0.3); padding:8px; border-radius:4px; margin-bottom:10px;">
            <div>⚔️ Обща Мощ: <strong style="color:#ff3366;">${leader.heroPower || 100}</strong></div>
            <div>💰 Бойно Злато: <strong style="color:#ffd700;">💰 ${leader.gold || 0}</strong></div>
            <div>👥 Размер войска: <strong style="color:#fff;">🛡️ ${leader.armySize || 0}</strong></div>
            <div>⏳ Възраст: <strong style="color:#aaa;">🎂 ${leader.age || 30} г.</strong></div>
        </div>

        <div style="text-align:left; background:rgba(0,0,0,0.2); padding:8px; border-radius:4px; border:1px solid #1a1a1a; margin-bottom:10px;">
            <div style="font-size:11px; font-weight:bold; color:#ffd700; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Родови Способности:</div>
            ${skillsHTML}
        </div>

        <div style="text-align:left; background:rgba(0,0,0,0.2); padding:8px; border-radius:4px; border:1px solid #1a1a1a; margin-bottom:12px;">
            <div style="font-size:11px; font-weight:bold; color:#ffd700; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">Слотове Артефакти:</div>
            ${itemsHTML}
        </div>

        <button onclick="document.getElementById('dynamic-leader-profile').remove()" style="width:100%; padding:8px; background:rgba(214,175,55,0.12); border:1px solid #d4af37; border-radius:4px; color:#fff; font-family:'Cinzel', serif; cursor:pointer; font-size:11px; letter-spacing:1px; transition:all 0.2s;">
            ЗАТВОРИ ИНСПЕКЦИЯТА
        </button>
    `;

    document.body.appendChild(modal);
};

/**
 * 👑 ОБНОВЯВАНЕ НА ОСНОВНИЯ ГРАФИЧЕН ИНТЕРФЕЙС НА ГЛАВНИЯ ГЕРОЙ В ТЕКУЩИЯ ХОД
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // Попълване на базовите индикатори на горната адаптивна лента
    const statGold = document.getElementById('stat-gold');
    if (statGold) statGold.innerText = hero.gold !== undefined ? hero.gold : 1500;

    const statArmy = document.getElementById('stat-army');
    if (statArmy) statArmy.innerText = `${hero.currentArmy || 500} / ${hero.armySize || 500}`;

    const statPower = document.getElementById('stat-power');
    if (statPower) statPower.innerText = hero.heroPower || 150;

    // Насищане на основните текстови панели на таблото
    const heroNameEl = document.getElementById('hero-name');
    if (heroNameEl) heroNameEl.innerText = hero.name || "Кубрат";

    const heroClanEl = document.getElementById('hero-clan');
    if (heroClanEl) heroClanEl.innerText = hero.clan || "Дуло";

    const heroAgeEl = document.getElementById('hero-age');
    if (heroAgeEl) heroAgeEl.innerText = `${hero.age || 50} г.`;

    const heroLevelEl = document.getElementById('hero-level');
    if (heroLevelEl) heroLevelEl.innerText = hero.level || 1;

    // Синхронизация на бутона за автоматично разпределяне на нивата (Auto-Level)
    const autoBtn = document.getElementById('auto-level-toggle-btn');
    if (autoBtn) {
        if (hero.isAuto) {
            autoBtn.innerText = "АВТОМАТИЧНО ВДИГАНЕ: ВКЛ";
            autoBtn.style.background = "linear-gradient(180deg, #222 0%, #111 100%)";
            autoBtn.style.color = "#00ffcc";
            autoBtn.style.borderColor = "#00ffcc";
        } else {
            autoBtn.innerText = "РЪЧНО РАЗПРЕДЕЛЕНИЕ: ВКЛ";
            autoBtn.style.background = "linear-gradient(180deg, #222 0%, #111 100%)";
            autoBtn.style.color = "#ffd700";
            autoBtn.style.borderColor = "#d4af37";
        }
    }
};

/**
 * 📝 ДОБАВЯНЕ НА ИЗВЕСТИЕ ИЛИ ЛЕТОПИС В ИСТОРИЯТА НА СЪВЕТНИКА
 */
window.showAdvisorMsg = function(msg) {
    if (!msg) return;
    
    // Запазваме събитието в хронологията
    window.eventHistory.push(msg);
    if (window.eventHistory.length > 40) window.eventHistory.shift();

    const logContainer = document.getElementById('advisor-log-content');
    if (!logContainer) return;

    const msgNode = document.createElement('div');
    msgNode.style.cssText = "padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 11.5px; line-height: 1.4; color: #eee; text-align: left; font-family: 'Montserrat', sans-serif;";
    msgNode.innerHTML = msg;

    logContainer.appendChild(msgNode);
    logContainer.scrollTop = logContainer.scrollHeight;
};
