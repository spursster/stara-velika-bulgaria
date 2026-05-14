/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Промяна: Въвеждане на система за Летопис (десен панел) и Опашка от събития (бутон Вести).
 * Лимит на съобщенията в летописа: 7.
 */

// Глобални масиви за новата логика
window.eventQueue = [];    // Опашка за важни събития, чакащи отговор
window.eventHistory = [];  // История на събитията за десния панел (Летопис)

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ (Владетел, Съвет и Владения) ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        const currentClanData = window.worldData.clans[hero.dynasty];
        const clanIcon = currentClanData ? `<img src="${currentClanData.icon}" style="width:20px; vertical-align:middle; margin-right:5px;">` : '🏇';
        const marriageIcon = window.currentSpouse ? ' <span title="Сключен династичен съюз" style="cursor:help;">💍</span>' : '';

        let treeHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <div style="font-size: 9px; color: #d4af37;">ВЕЛИК КАН</div>
                <div style="font-size: 25px; margin: 5px 0;">${clanIcon}</div>
                <div style="font-size: 12px; font-weight: bold; color: #fff;">${hero.name}${marriageIcon}</div>
                <div style="font-size: 8px; color: #666; margin-top: 2px;">род ${hero.dynasty}</div>
            </div>
        `;

        const joinedClansNames = window.recalculateClanHierarchy ? window.recalculateClanHierarchy() : [];
        if (joinedClansNames.length > 1) {
            treeHTML += `<div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel'; margin-bottom: 8px; border-bottom: 1px solid #333;">СЪВЕТ НА РОДОВЕТЕ:</div>`;
            joinedClansNames.forEach(name => {
                if (name === hero.dynasty) return;
                const clan = window.worldData.clans[name];
                treeHTML += `
                    <div style="display: flex; align-items: center; padding: 5px; background: rgba(255,255,255,0.03); border: 1px solid #222; margin-bottom: 4px; border-radius: 3px;">
                        <img src="${clan.icon}" style="width: 18px; height: 18px; margin-right: 8px; opacity: 0.9;" onerror="this.src='assets/icons/clans/default.png'">
                        <div style="flex-grow: 1;">
                            <div style="font-size: 9px; color: #fff;">${clan.leader}</div>
                            <div style="font-size: 7px; color: #666;">род ${name}</div>
                        </div>
                    </div>`;
            });
        }

        treeHTML += `<div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel'; margin: 15px 0 8px 0; border-bottom: 1px solid #333;">ВЛАДЕНИЯ:</div>`;
        const regions = window.playerRegions || [];
        regions.forEach(regName => {
            const regData = window.worldData.regions[regName];
            const managingClanName = regData?.nativeClans.find(c => window.worldData.clans[c]?.isJoined) || hero.dynasty;
            const regClanIcon = window.worldData.clans[managingClanName]?.icon || "";

            treeHTML += `
                <div style="border: 1px solid #222; background: #0c0c0c; padding: 6px; margin-bottom: 3px; border-left: 2px solid #d4af37; font-size: 10px; display: flex; align-items: center;">
                    <img src="${regClanIcon}" style="width:14px; margin-right:8px; opacity: 0.8;" onerror="this.src='assets/icons/clans/default.png'">
                    <div style="flex-grow: 1;">
                        <div style="color: #fff;">${regName}</div>
                        <div style="font-size: 7px; color: #666;">${regData?.resource || "Земи"}</div>
                    </div>
                </div>`;
        });
        leftSidebar.innerHTML = treeHTML;
    }

    // --- 2. ДЕСЕН ПАНЕЛ (Летопис на събитията - Лимит 7) ---
    const rightPanel = document.getElementById('events-center');
    if (rightPanel) {
        let historyHTML = `<div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel'; text-align:center; margin-bottom:10px; letter-spacing:1px; border-bottom:1px solid #333; padding-bottom:5px;">ЛЕТОПИС НА ДЪРЖАВАТА</div>`;
        
        // Показваме само последните 7 събития, подредени от най-новото отгоре
        const displayHistory = window.eventHistory.slice(-7).reverse();
        
        if (displayHistory.length === 0) {
            historyHTML += `<div style="height: 100%; display: flex; align-items: center; justify-content: center; opacity: 0.2; font-size: 30px;">🛡️</div>`;
        } else {
            displayHistory.forEach(ev => {
                historyHTML += `
                    <div style="background: rgba(212,175,55,0.05); border: 1px solid #222; border-left: 2px solid #d4af37; padding: 10px; margin-bottom: 8px; border-radius: 2px; animation: slideIn 0.3s ease;">
                        <div style="font-size: 9px; color: #d4af37; font-weight: bold; margin-bottom: 4px; font-family: 'Cinzel';">${ev.title.toUpperCase()}</div>
                        <div style="font-size: 10px; color: #ccc; line-height: 1.4;">${ev.text}</div>
                    </div>`;
            });
        }
        rightPanel.innerHTML = historyHTML;
    }

    // --- 3. ОБНОВЯВАНЕ НА БУТОНА ЗА ИЗВЕСТИЯ (ВЕСТИ) ---
    window.updateNotificationBadge();

    // Обновяване на ресурсите
    const elements = { 'gold-amount': hero.gold, 'army-val': hero.armySize, 'hero-power-val': hero.heroPower };
    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }
};

/**
 * ФУНКЦИЯ ЗА ОБНОВЯВАНЕ НА БРОЯЧА НА ВЕСТИТЕ
 */
window.updateNotificationBadge = function() {
    let btn = document.getElementById('notif-btn');
    if (!btn) {
        // Намираме контейнера на контролите (бутоните до Следващ ход)
        const controls = document.querySelector('.controls');
        if (controls) {
            btn = document.createElement('button');
            btn.id = 'notif-btn';
            btn.onclick = window.popNextEvent;
            btn.style = "position:relative; padding:10px 15px; background:#111; border:1px solid #d4af37; color:#d4af37; cursor:pointer; font-family:'Cinzel'; margin-right:10px; font-size:12px; transition: 0.3s;";
            btn.onmouseover = () => btn.style.background = "#d4af37"; btn.onmouseover = () => { btn.style.background = "#d4af37"; btn.style.color = "#000"; };
            btn.onmouseout = () => { btn.style.background = "#111"; btn.style.color = "#d4af37"; };
            controls.insertBefore(btn, controls.firstChild);
        }
    }
    
    if (btn) {
        const count = window.eventQueue.length;
        btn.innerHTML = `📜 ВЕСТИ <span style="background:red; color:white; border-radius:50%; padding:1px 6px; font-size:10px; margin-left:5px; display:${count > 0 ? 'inline' : 'none'}">${count}</span>`;
    }
};

/**
 * СИСТЕМА ЗА ПОКАЗВАНЕ НА СЛЕДВАЩОТО ВАЖНО СЪБИТИЕ
 */
window.popNextEvent = function() {
    if (window.eventQueue.length === 0) return;
    const event = window.eventQueue[0]; 
    window.showEventModal(event, true);
};

/**
 * МОДИФИЦИРАН МОДАЛЕН ПРОЗОРЕЦ
 */
window.showEventModal = function(event, isFromQueue = false) {
    if (!event) return;

    let modal = document.getElementById('event-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; justify-content:center; align-items:center; z-index:9999; font-family: 'Cinzel', serif;";
        document.body.appendChild(modal);
    }

    // Бутоните за избор
    let optionsHTML = event.options.map((opt, index) => `
        <button onclick="window.handleEventChoice(${index}, ${isFromQueue})" style="display:block; width:100%; padding:15px; margin-top:10px; background:#111; border:1px solid #d4af37; color:#d4af37; cursor:pointer; font-family:'Cinzel'; transition: 0.3s; font-size: 12px;">
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

    window.handleEventChoice = function(choiceIndex, wasQueued) {
        const option = event.options[choiceIndex];
        const resultText = option.action(window.currentHero);
        
        // Записваме резултата в Летописа (десния панел)
        window.eventHistory.push({ title: event.title, text: resultText });
        
        // Ако е било от опашката, премахваме първото събитие
        if (wasQueued) window.eventQueue.shift();

        modal.style.display = 'none';
        
        // Обновяваме всичко, за да се види новия запис в летописа и намаления брой вести
        window.updateCharacterUI(window.currentHero);
    };
};

/**
 * ФУНКЦИЯ ЗА СЪОБЩЕНИЯ ОТ СТАРЕЙШИНИ/СЪВЕТНИЦИ
 */
window.showAdvisorMsg = function(msg) {
    // Съобщенията от съветници влизат директно в летописа без да искат избор
    window.eventHistory.push({ title: "ВЕСТ ОТ СЪВЕТНИКА", text: msg });
    window.updateCharacterUI(window.currentHero);
};


/**
 * Функция за изпращане на предложение от играча към движещата се лента
 */
window.submitSuggestion = function() {
    const inputField = document.getElementById('player-suggestion-text');
    const text = inputField.value.trim();

    if (text.length > 3) {
        // Извикваме функцията от suggestions.js
        if (window.addPlayerSuggestion) {
            // Добавяме името на текущия Кан за тежест
            const fullEntry = `${window.currentHero.name}: ${text}`;
            window.addPlayerSuggestion(fullEntry);
            
            // Изчистваме полето и даваме обратна връзка
            inputField.value = '';
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg("Твоето предложение бе вписано в Книгата на старейшините!");
            }
        }
    } else {
        alert("Предложението е твърде кратко!");
    }
};
