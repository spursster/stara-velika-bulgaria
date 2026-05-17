/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (26 мисии + Владетелско отключване + RPG система за опит и нива)
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
        { id: "q1", name: "Пътят на коприната", duration: 3, cost: 200, danger: 15, reward: "Злато и Копринен плащ" },
        { id: "q2", name: "Тайната на Родопите", duration: 2, cost: 100, danger: 10, reward: "Древен български амулет" },
        { id: "q3", name: "Понтийско плаване", duration: 4, cost: 350, danger: 30, reward: "Ромейска Монета" },
        { id: "q4", name: "Кримска мисия", duration: 5, cost: 500, danger: 45, reward: "Легендарен меч на Кан / Меч на Атила" },
        { id: "q5", name: "Кавказки поход", duration: 4, cost: 400, danger: 35, reward: "Кавказки Кинжал и Кристали" },
        { id: "q6", name: "Волжка мисия", duration: 6, cost: 600, danger: 40, reward: "Волжки Хрисовул и Злато" },
        { id: "q7", name: "Панонийски набег", duration: 3, cost: 300, danger: 25, reward: "Панонийски Шлем и Оръжия" },
        { id: "q8", name: "Римски преговори", duration: 5, cost: 450, danger: 20, reward: "Сенаторски Пръстен и Печат" },
        { id: "q9", name: "Египетска тайна", duration: 7, cost: 700, danger: 50, reward: "Амулет на Птолемеите от Сотер" },
        { id: "q10", name: "Мисия до Балтийско море", duration: 8, cost: 850, danger: 55, reward: "Северен Кехлибарен Нагръдник" },
        { id: "q11", name: "Персийски коридор", duration: 5, cost: 550, danger: 30, reward: "Персийски Кинжал и Подправки" },
        { id: "q12", name: "Индийски поход", duration: 9, cost: 1000, danger: 60, reward: "Индийска Скулптура от Слонска Кост" },
        { id: "q13", name: "Скандинавски фьордове", duration: 6, cost: 650, danger: 40, reward: "Скандинавски Рунически Амулет" },
        { id: "q14", name: "Британски експедиционен корпус", duration: 8, cost: 800, danger: 50, reward: "Келтски Нагръдник и Дарове" },
        { id: "q15", name: "Пътят на тамяна", duration: 4, cost: 400, danger: 25, reward: "Флакон с Тамян от Оман" },
        { id: "q16", name: "Картагенски руини", duration: 6, cost: 500, danger: 35, reward: "Финикийски Медальон" },
        { id: "q17", name: "Хиспански мини", duration: 5, cost: 600, danger: 30, reward: "Легендарен Меч от Толедо" },
        { id: "q18", name: "Галски гори", duration: 4, cost: 350, danger: 20, reward: "Друидски Дървен Жезъл" },
        { id: "q19", name: "Месопотамски разкопки", duration: 7, cost: 750, danger: 45, reward: "Вавилонски Свитък" },
        { id: "q20", name: "Оракулът на Делфи", duration: 3, cost: 300, danger: 15, reward: "Пророческа Златна Чаша" },
        { id: "q21", name: "Империята на инките", duration: 10, cost: 1200, danger: 65, reward: "Слънчев Диск на Инките" },
        { id: "q22", name: "Земите на маите", duration: 9, cost: 1100, danger: 60, reward: "Нефритова Маска на Маите" },
        { id: "q23", name: "Мистичната Атлантида", duration: 12, cost: 1500, danger: 75, reward: "Орихалково Мече Острие" },
        { id: "q24", name: "Кралство Аксум", duration: 7, cost: 750, danger: 40, reward: "Аксумитски Свещен Рог" },
        { id: "q25", name: "Китайската empire", duration: 11, cost: 1350, danger: 55, reward: "Нефритен Императорски Печат" },
        { id: "q26", name: "Японските острови", duration: 10, cost: 1250, danger: 50, reward: "Японска Стоманена Катана" }
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

    // 1. ЗАЛА НА СЛАВАТА: Намиране и сортиране на отключените владетели с най-голям опит
    let topRulers = [];
    if (window.worldData && window.worldData.clans) {
        // Четем директно от споделената база данни
        topRulers = Object.values(window.worldData.clans);
    } else if (window.gameDatabase && window.gameDatabase.rulers) {
        topRulers = Object.values(window.gameDatabase.rulers).filter(r => r.unlocked);
    } else {
        topRulers = [hero];
    }

    // Подсигуряване на базови нива, за да няма празни полета, и сортиране в низходящ ред
    topRulers.forEach(r => { r.expeditionLevel = r.expeditionLevel || 1; });
    topRulers.sort((a, b) => b.expeditionLevel - a.expeditionLevel);

    let topBarHtml = `
        <div style="background: rgba(214,175,55,0.06); border: 1px solid #d4af37; padding: 12px; margin-bottom: 15px; border-radius: 6px; box-sizing: border-box;">
            <span style="color: #ffd700; font-weight: bold; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.5px;">🏆 Зала на Славата (Владетели с най-голям опит):</span>
            <div style="display: flex; gap: 12px; margin-top: 8px; overflow-x: auto; padding-bottom: 4px;">
    `;
    topRulers.slice(0, 3).forEach((r, idx) => {
        let medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉";
        topBarHtml += `
            <div style="background: #0d0d0d; padding: 6px 12px; border-radius: 4px; border: 1px solid #d4af37; font-size: 0.8em; white-space: nowrap; display: flex; align-items: center; gap: 5px;">
                ${medal} <b>Кан ${r.name}</b> <span style="color: #00ffcc;">Ниво ${r.expeditionLevel}</span>
            </div>
        `;
    });
    topBarHtml += `</div></div>`;

    // СТАРТ НА UI КОНТЕНТА
    let contentHtml = `
        <div id="expedition-ui-container" style="padding:20px; background:rgba(8,8,8,0.98); border:2px solid #d4af37; color:white; font-family:'Georgia',serif; box-sizing:border-box; height:100%; overflow-y:auto; border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                <h2 style="margin:0; color:#d4af37; font-size:1.3em; text-transform:uppercase; letter-spacing:1px;">🧭 Експедиционен Корпус</h2>
                <div style="font-size:0.85em; color:#00ffcc; border:1px solid #00ffcc; padding:4px 8px; border-radius:4px; background:rgba(0,255,204,0.05);">
                    🎖️ Кан ${hero ? hero.name : ''}: Ниво ${hero ? hero.expeditionLevel : 1} (${hero ? hero.expeditionXP : 0}/100 XP)
                </div>
                <button onclick="window.closeExpeditionCenter()" style="background:none; border:1px solid #d4af37; color:#d4af37; cursor:pointer; padding:3px 8px; font-weight:bold; border-radius:4px;">X</button>
            </div>
    `;

    // Добавяне на Залата на славата горе
    contentHtml += topBarHtml;

    // Връзка към съкровищницата
    contentHtml += `
            <div style="margin-bottom:20px;">
                <button onclick="window.toggleRulerInventory()" style="background:#111; color:#00ffcc; border:1px solid #00ffcc; padding:8px 12px; cursor:pointer; font-weight:bold; border-radius:4px; text-transform:uppercase; font-size:0.8em; width:100%;">
                    🎒 Отвори Скулптурна Родова Съкровищница
                </button>
            </div>
    `;

    // 2. СЕКЦИЯ ОТКЛЮЧВАНЕ НА НОВИ ВЛАДЕТЕЛИ (Връзка с database.js / Родове)
    contentHtml += `
        <h3 style="color:#00ffcc; font-size:0.95em; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">📜 Привличане на нови владетели във Вашата Династия:</h3>
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
    `;

    // Динамичен масив с владетели за отключване
    let potentiallyLocked = [
        { id: "r_tervel", name: "Тервел", cost: 1500, perk: "+15% злато от Римски и Ромейски преговори" },
        { id: "r_krum", name: "Крум", cost: 2200, perk: "-10% риск в Европейските експедиции" },
        { id: "r_omurtag", name: "Омуртаг", cost: 3000, perk: "-2 сезона времетраене за далечни дестинации" }
    ];

    let showAnyLocked = false;
    potentiallyLocked.forEach(rl => {
        // Проверяваме дали вече не съществува такъв отключен владетел в родовата система
        let alreadyExists = window.worldData && window.worldData.clans && window.worldData.clans[rl.id];
        if (!alreadyExists) {
            showAnyLocked = true;
            contentHtml += `
                <div style="border:1px solid #00ffcc; padding:10px; background:rgba(0,255,204,0.02); border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b style="color:#00ffcc;">Кан ${rl.name}</b><br>
                        <small style="color:#aaa; font-style:italic;">Умение: ${rl.perk}</small>
                    </div>
                    <button onclick="window.unlockNewRuler('${rl.id}', '${rl.name}', ${rl.cost})" style="background:#111; color:#00ffcc; border:1px solid #00ffcc; padding:6px 12px; cursor:pointer; font-weight:bold; border-radius:4px; font-size:0.8em; text-transform:uppercase;">
                        Привлечи (💰 ${rl.cost})
                    </button>
                </div>
            `;
        }
    });

    if (!showAnyLocked) {
        contentHtml += `<div style="font-size:0.85em; color:#777; font-style:italic; padding:5px;">Всички легендарни владетели от родовата база данни са успешно привлечени под твоите знамена.</div>`;
    }
    contentHtml += `</div>`;

    // 3. ДОСТЪПНИ ЕКСПЕДИЦИИ (26 МИСИИ)
    contentHtml += `
            <h3 style="color:#d4af37; font-size:1em; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">🧭 Достъпни световни дестинации:</h3>
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
                            : `Водач: <b style="color:#00ffcc;">Кан ${isRunning.rulerName}</b> | Статус: Пътува и трупа опит... (Остават: <b style="color:#ffd700;">${remains} хода</b>)`}
                    </div>
                    ${isDone 
                        ? `<button onclick="window.claimExpeditionReward('${q.id}')" style="width:100%; background:#4caf50; color:white; border:none; padding:8px; cursor:pointer; font-weight:bold; text-transform:uppercase; border-radius:4px; font-size:0.8em; margin-top:5px;">Прибери Плячката в Съкровищницата</button>`
                        : `<button disabled style="width:100%; background:#222; color:#555; border:1px solid #333; padding:6px; border-radius:4px; font-size:0.8em; margin-top:5px;">Кан ${isRunning.rulerName} води бой...</button>`}
                </div>
            `;
        } else {
            // Намаляване на опасността на база ниво на владетеля
            let levelBonus = hero ? (hero.expeditionLevel - 1) * 3 : 0;
            let currentDanger = Math.max(5, q.danger - levelBonus);

            contentHtml += `
                <div style="border:1px solid #d4af37; padding:12px; background:rgba(214,175,55,0.03); border-radius:6px; display:flex; flex-direction:column; gap:4px;">
                    <div style="font-weight:bold; color:#ffd700; font-size:0.95em;">${q.name}</div>
                    <div style="font-size:0.8em; color:#ccc;">Времетраене: <b>${q.duration} сезона</b> | Хазна: <b style="color:#ffd700;">${q.cost} 💰</b></div>
                    <div style="font-size:0.8em; color:#ff4444;">Риск от засада: <b>${currentDanger}%</b> ${levelBonus > 0 ? `<i>(-${levelBonus}% от Ниво)</i>` : ''}</div>
                    <div style="font-size:0.8em; color:#00ffcc; margin-bottom:5px;">Артефакт за Съкровищница: <i>${q.reward}</i></div>
                    <button onclick="window.startExpedition('${q.id}')" style="background:#111; color:#d4af37; border:1px solid #d4af37; padding:6px; cursor:pointer; font-weight:bold; text-transform:uppercase; border-radius:4px; font-size:0.8em; transition:background 0.2s;" onmouseover="this.style.background='#222'" onmouseout="this.style.background='#111'">
                        Изпрати Кан ${hero ? hero.name : ''}
                    </button>
                </div>
            `;
        }
    });

    contentHtml += `</div></div>`;
    mainArea.innerHTML = contentHtml;
};

/**
 * ФУНКЦИЯ ЗА ОТКЛЮЧВАНЕ НА НОВИ ВЛАДЕТЕЛИ ОТ ДАТАБАЗАТА
 */
window.unlockNewRuler = function(rulerId, rulerName, cost) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold < cost) {
        alert("Нямате достатъчно злато в хазната, за да привлечете този владетел!");
        return;
    }

    hero.gold -= cost;

    // Вграждане и записване на новия владетел в споделената база данни worldData
    window.worldData = window.worldData || {};
    window.worldData.clans = window.worldData.clans || {};
    
    window.worldData.clans[rulerId] = {
        id: rulerId,
        name: rulerName,
        expeditionLevel: 1,
        expeditionXP: 0,
        inventory: []
    };

    window.showMysticModal(
        "📜 РОДОВ СЪЮЗ ТРИУМФ",
        `Великият Кан ${rulerName} прие Вашето злато и се присъедини към съюза на родовете! Сега той е записан в Залата на славата и неговият опит ще расте при бъдещи походи.`,
        "triumph"
    );

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    window.openExpeditionCenter();
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
        rulerName: hero.name
    });

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.showAdvisorMsg) window.showAdvisorMsg(`🧭 Кан ${hero.name} лично потегли на поход към "${quest.name}"!`);
    
    window.updateExpeditionBadge();
    window.openExpeditionCenter();
};

/**
 * СЪБИРАНЕ НА НАГРАДАТА И АРТЕФАКТИТЕ В СЪКРОВИЩНИЦАТА
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
    if (questId === "q23") { baseGoldReward = 2000; artifactGenerated = "Орихалково Мече Острие"; }
    if (questId === "q24") { baseGoldReward = 950; artifactGenerated = "Аксумитски Свещен Рог"; }
    if (questId === "q25") { baseGoldReward = 1600; artifactGenerated = "Нефритен Императорски Печат"; }
    if (questId === "q26") { baseGoldReward = 1400; artifactGenerated = "Японска Стоманена Катана"; }

    hero.gold += baseGoldReward;

    // Реликвата отива в личния инвентар на активния владетел
    hero.inventory = hero.inventory || [];
    hero.inventory.push(artifactGenerated);

    // Добавяне на допълнителен финален бонус опит
    hero.expeditionXP += 40;
    let leveledUp = false;
    if (hero.expeditionXP >= 100) {
        hero.expeditionLevel += 1;
        hero.expeditionXP -= 100;
        leveledUp = true;
    }

    let modalMsg = `Кан ${hero.name} се завърна успешно! Хазната нарасна с +${baseGoldReward} 💰.\n\nВ родовата съкровищница бе прибрана ценна реликва: [${artifactGenerated}] 🏆.`;
    if (leveledUp) {
        modalMsg += `\n\n🌟 УВЕЛИЧЕНО ВЛИЯНИЕ: Твоят владетел достигна Опитност Ниво ${hero.expeditionLevel}!`;
    }

    window.showMysticModal("🎉 ТРИУМФАЛНО ЗАВРЪЩАНЕ", modalMsg, "triumph");

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    
    window.updateExpeditionBadge();
    window.openExpeditionCenter();
};

/**
 * ОСНОВЕН ДВИГАТЕЛ: Смяна на ход (Трупане на опит на всеки ход)
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
            
            // Проверка за трупане на опит на ход, ако владетелят пътува в момента
            if (hero && exp.rulerName === hero.name) {
                hero.expeditionXP = hero.expeditionXP || 0;
                hero.expeditionLevel = hero.expeditionLevel || 1;
                
                hero.expeditionXP += 25; // +25 XP на ход
                if (hero.expeditionXP >= 100) {
                    hero.expeditionLevel += 1;
                    hero.expeditionXP -= 100;
                    if (window.showAdvisorMsg) {
                        window.showAdvisorMsg(`🌟 Родовият опит нараства! Кан ${hero.name} достигна Експедиционно Ниво ${hero.expeditionLevel}.`);
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
        badge.style.background = "#4caf50"; // Свети в зелено
        badge.style.color = "white";
    } else {
        badge.innerText = "0";
        badge.style.display = 'none'; 
    }
};

/**
 * ИНВЕНТАРНА СИСТЕМА / СЪКРОВИЩНИЦА
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
            <p style="font-size:0.85em; color:#aaa; margin-bottom:15px;">Тези артефакти са трайно притежание на твоя род и вдигат божествения статус на Велика България пред останалите родове.</p>
    `;

    if (hero.inventory.length === 0) {
        invHtml += `<div style="text-align:center; padding:30px; color:#555; font-style:italic; font-size:0.9em;">Съкровищницата в момента е празна. Изпрати владетел на експедиция по света, за да откриеш реликви.</div>`;
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
