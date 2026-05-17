/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Всички 26 мисии от цял свят + RPG система за нива на владетелите)
 * КОРЕКЦИЯ БЪГ: Баджът свети в зелено и показва ЧИСЛО само при завършени мисии, чакащи награда.
 * Статистика на файловете в проекта: 16
 */

window.activeExpeditions = window.activeExpeditions || [];
window.legendaryQuests = window.legendaryQuests || [];

// АВТОМАТИЧЕН ЗАЩИТЕН FALLBACK АКО ОСТАНАЛИТЕ ФАЙЛОВЕ НЕМАТ РАЗПИСАНА SHOWMYSTICMODAL
if (typeof window.showMysticModal !== 'function') {
    window.showMysticModal = function(title, content, type) {
        let fallbackModal = document.getElementById('mystic-fallback-modal');
        if (fallbackModal) fallbackModal.remove();

        fallbackModal = document.createElement('div');
        fallbackModal.id = 'mystic-fallback-modal';
        
        let borderColors = {
            triumph: '#4caf50',
            expedition: '#d4af37'
        };
        let currentBorder = borderColors[type] || '#d4af37';

        fallbackModal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 85%; max-width: 400px; background: #0a0a0a; border: 2px solid ${currentBorder};
            padding: 20px; color: white; text-align: center; z-index: 40000; font-family: 'Georgia', serif;
            border-radius: 6px; box-shadow: 0 0 25px rgba(0,0,0,0.95);
        `;

        fallbackModal.innerHTML = `
            <h3 style="color:${currentBorder}; margin-top:0; font-size:1.1em; text-transform:uppercase;">${title}</h3>
            <p style="font-size:0.9em; line-height:1.5; color:#ccc; margin-bottom:20px;">${content}</p>
            <button onclick="document.getElementById('mystic-fallback-modal').remove()" style="
                background:#111; color:#d4af37; border:1px solid #d4af37; padding:8px 20px; cursor:pointer; font-weight:bold; border-radius:4px; text-transform:uppercase; font-size:0.8em;
            ">Приеми</button>
        `;
        document.body.appendChild(fallbackModal);
    };
}

/**
 * ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИТЕ 26 КУЕСТА ОТ ЦЯЛ СВЯТ
 */
window.initLegendaryQuests = function() {
    window.legendaryQuests = [
        { id: "q1", name: "Пътят на коприната", duration: 3, cost: 200, danger: 15, reward: "Злато и Рядък артефакт" },
        { id: "q2", name: "Тайната на Родопите", duration: 2, cost: 100, danger: 10, reward: "Древен български амулет" },
        { id: "q3", name: "Понтийско плаване", duration: 4, cost: 350, danger: 30, reward: "Богатства от Ромейската empire" },
        { id: "q4", name: "Кримска мисия", duration: 5, cost: 500, danger: 45, reward: "Легендарен меч на Кан" },
        { id: "q5", name: "Кавказки поход", duration: 4, cost: 400, danger: 35, reward: "Планински кристали и Слава" },
        { id: "q6", name: "Волжка мисия", duration: 6, cost: 600, danger: 40, reward: "Търговски договори и Злато" },
        { id: "q7", name: "Панонийски набег", duration: 3, cost: 300, danger: 25, reward: "Коне и Оръжия за армията" },
        { id: "q8", name: "Римски преговори", duration: 5, cost: 450, danger: 20, reward: "Имперски печат и Дипломация" },
        { id: "q9", name: "Египетска тайна", duration: 7, cost: 700, danger: 50, reward: "Артефакт на Птолемеите от Сотер" },
        { id: "q10", name: "Мисия до Балтийско море", duration: 8, cost: 850, danger: 55, reward: "Северен Кехлибар и Богатства" },
        { id: "q11", name: "Персийски коридор", duration: 5, cost: 550, danger: 30, reward: "Персийски килим и Подправки" },
        { id: "q12", name: "Индийски поход", duration: 9, cost: 1000, danger: 60, reward: "Свещен Индийски Слон и Скулптура" },
        { id: "q13", name: "Скандинавски фьордове", duration: 6, cost: 650, danger: 40, reward: "Северна Брадва и Рунически камък" },
        { id: "q14", name: "Британски експедиционен корпус", duration: 8, cost: 800, danger: 50, reward: "Келтски шлем и Сребърни дарове" },
        { id: "q15", name: "Пътят на тамяна", duration: 4, cost: 400, danger: 25, reward: "Екзотични масла и Златни монети" },
        { id: "q16", name: "Картагенски руини", duration: 6, cost: 500, danger: 35, reward: "Африкански Скрижали и Древни монети" },
        { id: "q17", name: "Хиспански мини", duration: 5, cost: 600, danger: 30, reward: "Чисто Сребро и Мечове от Толедо" },
        { id: "q18", name: "Галски гори", duration: 4, cost: 350, danger: 20, reward: "Друидски амулет и Дивеч" },
        { id: "q19", name: "Месопотамски разкопки", duration: 7, cost: 750, danger: 45, reward: "Вавилонска Глинена плочка" },
        { id: "q20", name: "Оракулът на Делфи", duration: 3, cost: 300, danger: 15, reward: "Пророчески свитък и Влияние" },
        { id: "q21", name: "Империята на инките", duration: 10, cost: 1200, danger: 65, reward: "Свещено Злато на Слънцето от Андите" },
        { id: "q22", name: "Земите на маите", duration: 9, cost: 1100, danger: 60, reward: "Астрономически Календар и Нефрит" },
        { id: "q23", name: "Мистичната Атлантида", duration: 12, cost: 1500, danger: 75, reward: "Орихалково Острие и Изгубено Знание" },
        { id: "q24", name: "Кралство Аксум", duration: 7, cost: 750, danger: 40, reward: "Етиопски Скъпоценности и Слонова Кост" },
        { id: "q25", name: "Китайската империя", duration: 11, cost: 1350, danger: 55, reward: "Императорски Нефритен Печат" },
        { id: "q26", name: "Японските острови", duration: 10, cost: 1250, danger: 50, reward: "Уникално Стоманено Катано Острие" }
    ];
};

/**
 * ОТВАРЯНЕ НА ЕКСПЕДИЦИОННИЯ ЦЕНТЪР
 */
window.openExpeditionCenter = function() {
    if (window.legendaryQuests.length === 0) window.initLegendaryQuests();

    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Подсигуряване на RPG статистика за текущия активен владетел
    const hero = window.currentHero;
    if (hero) {
        hero.expeditionLevel = hero.expeditionLevel || 1;
        hero.expeditionXP = hero.expeditionXP || 0;
    }

    let contentHtml = `
        <div id="expedition-ui-container" style="padding:20px; background:rgba(8,8,8,0.98); border:2px solid #d4af37; color:white; font-family:'Georgia',serif; box-sizing:border-box; height:100%; overflow-y:auto; border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                <h2 style="margin:0; color:#d4af37; font-size:1.3em; text-transform:uppercase; letter-spacing:1px;">🧭 Експедиционен Корпус</h2>
                <div style="font-size:0.85em; color:#00ffcc; border:1px solid #00ffcc; padding:4px 8px; border-radius:4px; background:rgba(0,255,204,0.05);">
                    🎖️ Кан ${hero ? hero.name : ''}: Ниво ${hero ? hero.expeditionLevel : 1} (${hero ? hero.expeditionXP : 0}/100 XP)
                </div>
                <button onclick="window.closeExpeditionCenter()" style="background:none; border:1px solid #d4af37; color:#d4af37; cursor:pointer; padding:3px 8px; font-weight:bold; border-radius:4px;">X</button>
            </div>
            
            <div style="margin-bottom:20px; display:flex; gap:10px;">
                <button onclick="window.toggleRulerInventory()" style="background:#111; color:#00ffcc; border:1px solid #00ffcc; padding:8px 12px; cursor:pointer; font-weight:bold; border-radius:4px; text-transform:uppercase; font-size:0.8em; flex:1;">
                    🎒 Скулптурен Инвентар и Съкровищница
                </button>
            </div>

            <h3 style="color:#d4af37; font-size:1em; margin-bottom:10px; text-transform:uppercase;">Достъпни дестинации по света:</h3>
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:25px;">
    `;

    window.legendaryQuests.forEach(q => {
        let isRunning = window.activeExpeditions.find(e => e.id === q.id);
        
        if (isRunning) {
            let remains = q.duration - isRunning.currentProgress;
            let isDone = remains <= 0;

            contentHtml += `
                <div style="border:1px dashed #555; padding:12px; background:rgba(255,255,255,0.02); border-radius:6px;">
                    <div style="font-weight:bold; color:#aaa;">${q.name}</div>
                    <div style="font-size:0.85em; margin:5px 0;">
                        ${isDone 
                            ? `<span style="color:#4caf50; font-weight:bold;">✓ МИСИЯТА Е ЗАВЪРШЕНА ВЛАДЕТЕЛЮ!</span>` 
                            : `Статус: Водачът трупа опит... (Остават: <b style="color:#ffd700;">${remains} хода</b>)`}
                    </div>
                    ${isDone 
                        ? `<button onclick="window.claimExpeditionReward('${q.id}')" style="width:100%; background:#4caf50; color:white; border:none; padding:8px; cursor:pointer; font-weight:bold; text-transform:uppercase; border-radius:4px; font-size:0.8em; margin-top:5px;">Прибери в Съкровищницата</button>`
                        : `<button disabled style="width:100%; background:#222; color:#555; border:1px solid #333; padding:6px; border-radius:4px; font-size:0.8em; margin-top:5px;">Владетелят пътува и води бой...</button>`}
                </div>
            `;
        } else {
            // Нивото на владетеля намалява риска от засада
            let levelBonus = hero ? (hero.expeditionLevel - 1) * 3 : 0;
            let currentDanger = Math.max(5, q.danger - levelBonus);

            contentHtml += `
                <div style="border:1px solid #d4af37; padding:12px; background:rgba(214,175,55,0.03); border-radius:6px; display:flex; flex-direction:column; gap:4px;">
                    <div style="font-weight:bold; color:#ffd700; font-size:0.95em;">${q.name}</div>
                    <div style="font-size:0.8em; color:#ccc;">Времетраене: <b>${q.duration} сезона</b> | Разходи: <b style="color:#ffd700;">${q.cost} 💰</b></div>
                    <div style="font-size:0.8em; color:#ff4444;">Риск от засада: <b>${currentDanger}%</b> ${levelBonus > 0 ? `<i>(-${levelBonus}% от Опит)</i>` : ''}</div>
                    <div style="font-size:0.8em; color:#00ffcc; margin-bottom:5px;">Реликва за Съкровищницата: <i>${q.reward}</i></div>
                    <button onclick="window.startExpedition('${q.id}')" style="background:#111; color:#d4af37; border:1px solid #d4af37; padding:6px; cursor:pointer; font-weight:bold; text-transform:uppercase; border-radius:4px; font-size:0.8em; transition:background 0.2s;" onmouseover="this.style.background='#222'" onmouseout="this.style.background='#111'">
                        Изпрати Дружина начело с Кан ${hero ? hero.name : ''}
                    </button>
                </div>
            `;
        }
    });

    contentHtml += `</div></div>`;
    mainArea.innerHTML = contentHtml;
};

window.closeExpeditionCenter = function() {
    const mainArea = document.getElementById('game-main-area');
    if (mainArea) {
        mainArea.innerHTML = `<div style="padding:20px; color:#aaa; text-align:center; font-family:Georgia,serif; margin-top:40px;">Кликнете върху регион от картата или изберете действие от страничния панел, за да управлявате Велика България.</div>`;
    }
};

/**
 * СТАРТИРАНЕ НА МИСИЯ
 */
window.startExpedition = function(questId) {
    if (window.legendaryQuests.length === 0) window.initLegendaryQuests();
    const quest = window.legendaryQuests.find(q => q.id === questId);
    const hero = window.currentHero;

    if (!quest || !hero) return;

    if (hero.gold < quest.cost) {
        alert("Нямате достатъчно злато в държавната хазна за тази експедиция!");
        return;
    }

    hero.gold -= quest.cost;
    window.activeExpeditions.push({
        id: quest.id,
        currentProgress: 0,
        duration: quest.duration,
        rulerName: hero.name // Обвързваме мисията с името на конкретния владетел
    });

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.showAdvisorMsg) window.showAdvisorMsg(`🧭 Кан ${hero.name} лично оглави експедицията "${quest.name}"!`);
    
    window.updateExpeditionBadge();
    window.openExpeditionCenter();
};

/**
 * СЪБИРАНЕ НА НАГРАДАТА ПРИ ЗАВЪРШВАНЕ
 */
window.claimExpeditionReward = function(questId) {
    const quest = window.legendaryQuests.find(q => q.id === questId);
    const hero = window.currentHero;
    if (!quest || !hero) return;

    window.activeExpeditions = window.activeExpeditions.filter(e => e.id !== questId);

    let baseGoldReward = 300;
    let artifactGenerated = "Древен Свитък";

    if (questId === "q1") { baseGoldReward = 450; artifactGenerated = "Копринен плащ"; }
    if (questId === "q2") { baseGoldReward = 200; artifactGenerated = "Родопски Кръст"; }
    if (questId === "q3") { baseGoldReward = 600; artifactGenerated = "Ромейска Монета"; }
    if (questId === "q4") { baseGoldReward = 800; artifactGenerated = "Меч на Атила"; }
    if (questId === "q5") { baseGoldReward = 500; artifactGenerated = "Кавказки Кинжал"; }
    if (questId === "q6") { baseGoldReward = 700; artifactGenerated = "Волжки Хрисовул"; }
    if (questId === "q7") { baseGoldReward = 400; artifactGenerated = "Панонийски Шлем"; }
    if (questId === "q8") { baseGoldReward = 650; artifactGenerated = "Сенаторски Пръстен"; }
    if (questId === "q9") { baseGoldReward = 900; artifactGenerated = "Амулет на Птолемеите"; }
    if (questId === "q10") { baseGoldReward = 1000; artifactGenerated = "Северен Кехлибарен Нагръдник"; }
    if (questId === "q11") { baseGoldReward = 550; artifactGenerated = "Персийски Кинжал"; }
    if (questId === "q12") { baseGoldReward = 1200; artifactGenerated = "Индийска Скулптура от Слонска Кост"; }
    if (questId === "q13") { baseGoldReward = 650; artifactGenerated = "Скандинавски Рунически Амулет"; }
    if (questId === "q14") { baseGoldReward = 750; artifactGenerated = "Келтски Нагръдник"; }
    if (questId === "q15") { baseGoldReward = 500; artifactGenerated = "Флакон с Тамян от Оман"; }
    if (questId === "q16") { baseGoldReward = 600; artifactGenerated = "Финикийски Медальон"; }
    if (questId === "q17") { baseGoldReward = 800; artifactGenerated = "Меч от Толедо"; }
    if (questId === "q18") { baseGoldReward = 400; artifactGenerated = "Друидски Дървен Жезъл"; }
    if (questId === "q19") { baseGoldReward = 850; artifactGenerated = "Вавилонски Свитък"; }
    if (questId === "q20") { baseGoldReward = 450; artifactGenerated = "Пророческа Златна Чаша"; }
    if (questId === "q21") { baseGoldReward = 1500; artifactGenerated = "Слънчев Диск на Инките"; }
    if (questId === "q22") { baseGoldReward = 1300; artifactGenerated = "Нефритова Маска на Маите"; }
    if (questId === "q23") { baseGoldReward = 2000; artifactGenerated = "Орихалково Острие"; }
    if (questId === "q24") { baseGoldReward = 950; artifactGenerated = "Аксумитски Свещен Рог"; }
    if (questId === "q25") { baseGoldReward = 1600; artifactGenerated = "Нефритен Императорски Печат"; }
    if (questId === "q26") { baseGoldReward = 1400; artifactGenerated = "Японска Стоманена Катана"; }

    hero.gold += baseGoldReward;

    // Реликвата отива директно в инвентара на активния владетел
    hero.inventory = hero.inventory || [];
    hero.inventory.push(artifactGenerated);

    // Добавяне на бонус опит при успешно завръщане
    hero.expeditionXP += 40;
    let leveledUp = false;
    if (hero.expeditionXP >= 100) {
        hero.expeditionLevel += 1;
        hero.expeditionXP -= 100;
        leveledUp = true;
    }

    let modalMsg = `Кан ${hero.name} се завърна триумфално от "${quest.name}"! Донесено злато: +${baseGoldReward} 💰.\nВ инвентара и съкровищницата е добавено: [${artifactGenerated}] 🏆.`;
    if (leveledUp) {
        modalMsg += `\n\n🌟 ВЕЛИКО СЪБИТИЕ: Твоят владетел вдигна ниво! Сега е Ниво ${hero.expeditionLevel}, което трайно намалява риска при следващи походи!`;
    }

    window.showMysticModal("🎉 ТРИУМФ НА ВЛАДЕТЕЛЯ", modalMsg, "triumph");

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    
    window.updateExpeditionBadge();
    window.openExpeditionCenter();
};

/**
 * ОСНОВЕН ДВИГАТЕЛ: Смяна на ход (Вика се автоматично от events.js)
 * ТУК СЕ СЛУЧВА ВДИГАНЕТО НА НИВО НА ВСЕКИ ХОД
 */
window.updateExpeditionSystem = function() {
    if (!window.activeExpeditions || window.activeExpeditions.length === 0) {
        window.updateExpeditionBadge();
        return;
    }

    const hero = window.currentHero;

    window.activeExpeditions.forEach(exp => {
        if (exp.currentProgress < exp.duration) {
            exp.currentProgress += 1;
            
            // Ако текущият пътуващ владетел съвпада с активния, получава опит на всеки ход
            if (hero && exp.rulerName === hero.name) {
                hero.expeditionXP = hero.expeditionXP || 0;
                hero.expeditionLevel = hero.expeditionLevel || 1;
                
                hero.expeditionXP += 25; // Трупане на опит на ход
                if (hero.expeditionXP >= 100) {
                    hero.expeditionLevel += 1;
                    hero.expeditionXP -= 100;
                    if (window.showAdvisorMsg) {
                        window.showAdvisorMsg(`🌟 Кан ${hero.name} увеличи своя опит по време на похода и достигна Ниво ${hero.expeditionLevel}!`);
                    }
                }
            }
        }
    });

    if (hero && window.updateCharacterUI) window.updateCharacterUI(hero);
    window.updateExpeditionBadge();
};

/**
 * АДАПТИРАН БАДЖ: СЛЕДИ И ИЗПИСВА ЧИСЛО ЕДИНСТВЕНО ПРИ ЗАВЪРШЕНИ МИСИИ
 */
window.updateExpeditionBadge = function() {
    const badge = document.getElementById('expeditions-badge');
    if (!badge) return;

    let completedMissionsCount = window.activeExpeditions.filter(e => e.currentProgress >= e.duration).length;

    if (completedMissionsCount > 0) {
        badge.innerText = completedMissionsCount;
        badge.style.display = 'flex';
        badge.style.background = "#4caf50";
        badge.style.color = "white";
    } else {
        badge.innerText = "0";
        badge.style.display = 'none'; 
    }
};

/**
 * ИНВЕНТАРНА СИСТЕМА И СЪКРОВИЩНИЦА
 */
window.toggleRulerInventory = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    hero.inventory = hero.inventory || [];

    let invHtml = `
        <div style="padding:20px; background:rgba(10,10,10,0.98); border:2px solid #00ffcc; color:white; font-family:'Georgia',serif; box-sizing:border-box; height:100%; overflow-y:auto; border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #00ffcc; padding-bottom:10px; margin-bottom:15px;">
                <h2 style="margin:0; color:#00ffcc; font-size:1.1em; text-transform:uppercase; letter-spacing:1px;">👑 Държавна Съкровищница на Кан ${hero.name}</h2>
                <button onclick="window.openExpeditionCenter()" style="background:none; border:1px solid #00ffcc; color:#00ffcc; cursor:pointer; padding:2px 6px; border-radius:4px;">Назад</button>
            </div>
            <p style="font-size:0.85em; color:#aaa; margin-bottom:15px;">Тези артефакти са притежание на твоя личен инвентар и вдигат божествения ти статус пред останалите родове.</p>
    `;

    if (hero.inventory.length === 0) {
        invHtml += `<div style="text-align:center; padding:30px; color:#555; font-style:italic; font-size:0.9em;">Съкровищницата в момента е празна. Изпрати Кан ${hero.name} на експедиция, за да открие ценни реликви.</div>`;
    } else {
        invHtml += `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">`;
        hero.inventory.forEach((item, index) => {
            invHtml += `
                <div style="border:1px solid #333; padding:10px; background:rgba(255,255,255,0.01); text-align:center; border-radius:4px;">
                    <div style="font-size:1.3em; margin-bottom:3px;">🏆</div>
                    <div style="font-size:0.85em; font-weight:bold; color:#00ffcc;">${item}</div>
                    <div style="font-size:0.75em; color:#777; margin-top:2px;">Свещена реликва от поход</div>
                </div>
            `;
        });
        invHtml += `</div>`;
    }

    invHtml += `</div>`;
    mainArea.innerHTML = invHtml;
};

window.openExpeditionsMenu = function() {
    window.openExpeditionCenter();
};

window.openInventory = function() {
    window.toggleRulerInventory();
};

setTimeout(() => {
    window.updateExpeditionBadge();
}, 800);
