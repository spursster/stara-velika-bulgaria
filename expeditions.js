/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С RPG_SYSTEM.JS И ИЗПРАВЕН ИНВЕНТАР ЗА ВСИЧКИ ВЛАДЕТЕЛИ
 * КОРЕКЦИЯ: Добавени глобални мостове към openExpeditionsMenu() и openInventory() за стабилност с index.html
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
            width: 85%; max-width: 440px; background: #161616; border: 2px solid ${currentBorder};
            box-shadow: 0 0 25px rgba(0,0,0,0.95); z-index: 40000; padding: 18px;
            color: white; font-family: 'Georgia', serif; border-radius: 6px; text-align: center;
            box-sizing: border-box;
        `;

        fallbackModal.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: ${currentBorder}; text-transform: uppercase; font-size:1.1em; letter-spacing:0.5px;">${title}</h3>
            <div style="font-size: 0.9em; line-height: 1.4; color: #ddd; margin-bottom: 15px; text-align: left;">${content}</div>
            <button onclick="document.getElementById('mystic-fallback-modal').remove()" style="
                width: 100%; background: ${currentBorder}; color: ${type === 'triumph' ? 'white' : 'black'};
                border: none; padding: 10px; font-weight: bold; cursor: pointer; text-transform: uppercase; border-radius: 4px; font-size:0.85em;
            ">Приеми</button>
        `;
        document.body.appendChild(fallbackModal);
    };
}

// Времеви масив за заредените водачи в Палатата (С подсигурени базови RPG полета)
window.mightyLeaders = window.mightyLeaders || [
    { name: "Аспарух", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 130, gold: 0, currentClass: "Чист Водач", skills: { endurance:0, vampirism:0, mysticism:0, tactics:0, diplomacy:0, scouting:0, alchemy:0, leadership:0 } },
    { name: "Самуил", dynasty: "Комитопули", level: 1, xp: 0, skillPoints: 0, heroPower: 125, gold: 0, currentClass: "Чист Водач", skills: { endurance:0, vampirism:0, mysticism:0, tactics:0, diplomacy:0, scouting:0, alchemy:0, leadership:0 } },
    { name: "Тервел", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 120, gold: 0, currentClass: "Чист Водач", skills: { endurance:0, vampirism:0, mysticism:0, tactics:0, diplomacy:0, scouting:0, alchemy:0, leadership:0 } }
];

const allCoreQuests = [
    {
        title: "Пътят на Коприната: Нефритената порта",
        destination: "Китай (Династия Хан)",
        description: "Вашите пратеници тръгват на изток през Памир, за да открият тайните на коприната и небесните коне.",
        duration: 24,
        steps: [
            "Керванът пресича Каспийско море под закрилата на Тангра.",
            "Преминаване през пустинята Такламакан – пясъчни духове пречат на пътя.",
            "Среща с Кушанските владетели – размяна на дарове и злато.",
            "Достигане до Нефритената порта. Китайските стражи са смаяни от българската конница."
        ],
        final: "Керванът се завръща натоварен с коприна и източни технологии!",
        reward: { gold: 5000, power: 150, item: "Китайски драконов печат" }
    },
    {
        title: "В търсене на Хиперборея",
        destination: "Северен океан",
        description: "Легендите говорят за златна земя на вечно слънце зад северните планини. Време е да разберем истината.",
        duration: 18,
        steps: [
            "Плавани по поречието на Днепър до непознати студени води.",
            "Пресичане на гъсти и усойни гори, където вълци вият в нощта.",
            "Откриване на древни каменни кръгове с непознати руни.",
            "Достигане до замръзнало море, където северното сияние сочи пътя."
        ],
        final: "Открити са свещени реликви и тайни карти на древните!",
        reward: { gold: 2000, power: 200, item: "Хиперборейска карта" }
    },
    {
        title: "Долината на Тракийските царе",
        destination: "Хемус (Казанлък)",
        description: "Разкопки и проучване на величествените могили за откриване на златни маски и оръжия на предците ни.",
        duration: 6,
        steps: [
            "Локализиране на голяма царска могила, пазена от каменни блокове.",
            "Влизане в дромоса (коридора) – стените са изрисувани с бойни коне.",
            "Справяне с древни капани и срутвания в погребалната камера.",
            "Разкриване на саркофага на велик одриски владетел."
        ],
        final: "Изнесени са несметни съкровища, които ще удивят света!",
        reward: { gold: 3000, power: 80, item: "Златен ритон с еленска глава" }
    },
    {
        title: "Светилището на Самотраки: Великите богове",
        destination: "Егейско море",
        description: "Пътуване до мистичния остров, за да се посветите в мистериите, които дават власт над моретата.",
        duration: 8,
        steps: [
            "Прекосяване на Тракийско море в бурни нощи.",
            "Навлизане в залата на Мистериите, където само посветените могат да стъпят.",
            "Преминаване през изпитания на духа и тялото в пълна тъмнина.",
            "Получаване на железен пръстен – знак за вечна защита."
        ],
        final: "Вие сте Кабир – посветен в тайните на земята и морето.",
        reward: { power: 200, army: 50, item: "Железен пръстен на Кабирите" }
    },
    {
        title: "Могилата Мал-тепе: Гробницата на гиганта",
        destination: "Южна Тракия",
        description: "Експедиция за проучване на най-голямата могила, която според слуховете крие колесницата на Слънцето.",
        duration: 5,
        steps: [
            "Организиране на стотици работници за преместване на земните маси.",
            "Разкриване на огромната крепида (каменна стена) на могилата.",
            "Откриване на петнадесетметрова каменна гробница.",
            "Проучване на златни нагръдници и царски оръжия."
        ],
        final: "Намерени са артефакти с неизмерима историческа стойност!",
        reward: { gold: 3500, power: 100, item: "Тракийски нагръдник" }
    },
    {
        title: "Светилището на Залмоксис",
        destination: "Карпати",
        description: "Изпратете хора до свещената пещера на Залмоксис, за да получат благословията на безсмъртието за вашите воини.",
        duration: 10,
        steps: [
            "Изкачване на стръмните и мъгливи зъбери на Карпатите.",
            "Среща с девствени жреци, пазещи тайния вход.",
            "Прекарване на три дни в пълна изолация в недрата на земята.",
            "Излизане от пещерата под звуците на свещени химни."
        ],
        final: "Вашите пратеници се завръщат, носят мистичното знание за отвъдния живот!",
        reward: { power: 250, army: 40, item: "Дакийски свещен нож" }
    }
];

if (window.legendaryQuests.length === 0) {
    window.legendaryQuests = allCoreQuests;
}

/**
 * СВИКВАНЕ НА ВОДАЧИ ОТ АБСОЛЮТНО ВСИЧКИ ДИНАСТИИ В DATABASE.JS
 */
window.rerollExpeditionLeaders = function() {
    const cost = 200;
    if (window.currentHero.gold < cost) {
        alert("Нямате достатъчно злато (Нужни са 200 💰)!");
        return;
    }
    
    let availablePool = [];
    if (window.bulgarianDynasties && Object.keys(window.bulgarianDynasties).length > 0) {
        Object.keys(window.bulgarianDynasties).forEach(dynastyName => {
            let dynData = window.bulgarianDynasties[dynastyName];
            if (dynData && dynData.rulers) {
                dynData.rulers.forEach(rName => {
                    if (rName !== window.currentHero.name) {
                        availablePool.push({ name: rName, dynasty: dynastyName });
                    }
                });
            }
        });
    }

    if (availablePool.length === 0) {
        availablePool = [
            { name: "Аспарух", dynasty: "Дуло" },
            { name: "Тервел", dynasty: "Дуло" },
            { name: "Самуил", dynasty: "Комитопули" }
        ];
    }

    window.currentHero.gold -= cost;
    window.mightyLeaders = [];

    for (let i = 0; i < 3; i++) {
        if (availablePool.length === 0) break;
        let randIdx = Math.floor(Math.random() * availablePool.length);
        let chosenData = availablePool.splice(randIdx, 1)[0]; 

        window.mightyLeaders.push({
            name: chosenData.name,
            dynasty: chosenData.dynasty,
            level: 1,
            xp: 0,
            skillPoints: 0,
            heroPower: Math.floor(Math.random() * 40) + 100,
            gold: 0,
            currentClass: "Чист Водач",
            skills: { endurance: 0, vampirism: 0, mysticism: 0, tactics: 0, diplomacy: 0, scouting: 0, alchemy: 0, leadership: 0 }
        });
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    window.openExpeditionCenter();
};

/**
 * ИНТЕРФЕЙС НА ПАЛАТАТА - МОБИЛНО ОПТИМИЗИРАН С БУТОНИ ЗА ЗАВЪРШВАНЕ
 */
window.openExpeditionCenter = function() {
    let modal = document.getElementById('expedition-center-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'expedition-center-modal';
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 95%; max-width: 860px; height: 85vh; background: #121212; border: 2px solid #d4af37;
        box-shadow: 0 0 35px rgba(0,0,0,0.95); z-index: 25000; display: flex;
        flex-direction: column; color: white; font-family: 'Georgia', serif; border-radius: 6px;
        box-sizing: border-box;
    `;

    let styleTag = document.getElementById('expedition-responsive-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'expedition-responsive-style';
        styleTag.innerHTML = `
            @media (max-width: 680px) {
                .exp-flex-body { flex-direction: column !important; overflow-y: auto !important; }
                .exp-left-pane { width: 100% !important; border-right: none !important; border-bottom: 2px solid #333 !important; overflow-y: visible !important; height: auto !important; }
                .exp-right-pane { width: 100% !important; overflow-y: visible !important; height: auto !important; }
                .exp-card-btn { width: 100% !important; padding: 12px !important; font-size: 0.95em !important; }
            }
        `;
        document.head.appendChild(styleTag);
    }

    const header = document.createElement('div');
    header.style.cssText = `
        padding: 12px; background: linear-gradient(90deg, #1f1f1f, #2d2d2d);
        border-bottom: 1px solid #d4af37; display: flex; justify-content: space-between; align-items: center;
    `;
    header.innerHTML = `
        <h2 style="margin:0; color:#d4af37; letter-spacing:0.5px; text-transform:uppercase; font-size:1.1em;">🌍 Палата на Експедициите</h2>
        <div style="font-size:0.85em; color:#aaa;">Активни: <b style="color:#00ffcc;">${window.activeExpeditions.length}/3</b></div>
    `;
    modal.appendChild(header);

    const body = document.createElement('div');
    body.className = 'exp-flex-body';
    body.style.cssText = `display: flex; flex: 1; overflow: hidden;`;

    // ЛЯВА ЧАСТ: Списък с Мисии
    const questList = document.createElement('div');
    questList.className = 'exp-left-pane';
    questList.style.cssText = `width: 55%; padding: 12px; overflow-y: auto; border-right: 1px solid #333; background: #161616; box-sizing: border-box;`;
    
    window.legendaryQuests.forEach((q, idx) => {
        const activeIdx = window.activeExpeditions.findIndex(e => e.title === q.title);
        const qCard = document.createElement('div');
        qCard.style.cssText = `background: #222; border: 1px solid #444; padding: 10px; margin-bottom: 10px; border-radius: 4px;`;

        if (activeIdx !== -1) {
            const activeInstance = window.activeExpeditions[activeIdx];
            let isDone = activeInstance.currentProgress >= activeInstance.duration;
            let pct = Math.min(Math.floor((activeInstance.currentProgress / activeInstance.duration) * 100), 100);
            
            if (isDone) {
                qCard.style.border = "2px solid #ffd700";
                qCard.style.background = "linear-gradient(135deg, #221a02, #111)";
                qCard.innerHTML = `
                    <h3 style="margin:0 0 4px 0; color:#ffd700; font-size:1em;">🎉 ГОТОВА: ${q.title}</h3>
                    <div style="font-size:0.8em; color:#fff; margin-bottom:4px;"><b>Водач:</b> ${activeInstance.leader.name} (${activeInstance.leader.dynasty}) — Ниво ${activeInstance.leader.level || 1}</div>
                    <div style="font-size:0.85em; color:#00ffcc; font-weight:bold; margin-bottom:8px;">✅ Експедицията се завърна успешно!</div>
                `;
                
                const claimBtn = document.createElement('button');
                claimBtn.className = 'exp-card-btn';
                claimBtn.innerText = "ПРИЕМИ ЕКСПЕДИЦИЯТА";
                claimBtn.style.cssText = `
                    width: 100%; background: #4caf50; color: white; border: none; padding: 10px;
                    font-weight: bold; font-size: 0.85em; cursor: pointer; border-radius: 4px; text-transform: uppercase;
                    box-shadow: 0 0 10px rgba(76,175,80,0.5);
                `;
                claimBtn.onclick = () => {
                    window.completeSpecificExpedition(activeIdx);
                };
                qCard.appendChild(claimBtn);
            } else {
                qCard.style.border = "1px solid #00ffcc";
                qCard.style.background = "#152220";
                qCard.innerHTML = `
                    <h3 style="margin:0 0 4px 0; color:#00ffcc; font-size:1em;">${q.title}</h3>
                    <div style="font-size:0.8em; color:#fff; margin-bottom:4px;"><b>Водач:</b> ${activeInstance.leader.name} (${activeInstance.leader.dynasty})</div>
                    <div style="font-size:0.8em; color:#ffd700; margin-bottom:6px;">⏳ Оставащи ходове: <b>${activeInstance.duration - activeInstance.currentProgress} х.</b></div>
                    <div style="width:100%; background:#222; height:6px; border-radius:3px; overflow:hidden;">
                        <div style="width:${pct}%; background:#00ffcc; height:100%;"></div>
                    </div>
                `;
            }
        } else {
            qCard.innerHTML = `
                <h3 style="margin:0 0 4px 0; color:#ffd700; font-size:1em;">${q.title}</h3>
                <div style="font-size:0.75em; color:#00ffcc; margin-bottom:4px;">📍 Направление: ${q.destination} | ⏳ ${q.duration} х.</div>
                <p style="margin:0 0 8px 0; font-size:0.8em; color:#ccc; line-height:1.2;">${q.description}</p>
                <div style="font-size:0.75em; color:#aaa; margin-bottom:8px;">🎁 Награда: ${q.reward.gold ? `💰 ${q.reward.gold} ` : ''}${q.reward.item ? `⭐ [${q.reward.item}]` : ''}</div>
            `;

            if (window.activeExpeditions.length < 3) {
                const startBtn = document.createElement('button');
                startBtn.className = 'exp-card-btn';
                startBtn.innerText = "ИЗПРАТИ ПОХОД";
                startBtn.style.cssText = `
                    background:#d4af37; color:black; border:none; padding: 8px 14px;
                    font-weight:bold; font-size:0.8em; cursor:pointer; border-radius:3px; text-transform:uppercase;
                `;
                startBtn.onclick = () => {
                    const selectedLeader = window.getSelectedExpeditionLeader();
                    window.startSelectedExpedition(idx, selectedLeader);
                    window.openExpeditionCenter(); 
                };
                qCard.appendChild(startBtn);
            }
        }
        questList.appendChild(qCard);
    });
    body.appendChild(questList);

    // ДЯСНА ЧАСТ: Водачи
    const leaderPanel = document.createElement('div');
    leaderPanel.className = 'exp-right-pane';
    leaderPanel.style.cssText = `width: 45%; padding: 12px; background: #111; overflow-y: auto; display:flex; flex-direction:column; box-sizing: border-box;`;
    leaderPanel.innerHTML = `
        <h3 style="margin:0 0 8px 0; color:#d4af37; font-size:0.95em; border-bottom:1px solid #444; padding-bottom:4px; text-transform:uppercase;">👥 Избор на Водач</h3>
        <button onclick="window.rerollExpeditionLeaders()" style="width:100%; background:#8a2387; color:white; border:1px solid #ffd700; padding:8px; font-weight:bold; font-size:0.8em; border-radius:4px; cursor:pointer; margin-bottom:10px;">🔄 СВИКАЙ ОТ ВСИЧКИ РОДОВЕ (-200 💰)</button>
    `;

    const leadersContainer = document.createElement('div');
    leadersContainer.style.cssText = `flex:1;`;

    const mainHero = window.currentHero;
    const isHeroRunning = window.activeExpeditions.some(e => e.leader && e.leader.name === mainHero.name);
    const hRadio = document.createElement('div');
    hRadio.style.cssText = `background: rgba(214,175,55,0.1); border: 1px solid #d4af37; padding: 8px; margin-bottom: 8px; border-radius: 4px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;`;
    if (isHeroRunning) hRadio.style.opacity = "0.4";
    
    let hInfoHtml = `
        <div style="display:flex; align-items:center;" onclick="if(!isHeroRunning) window.selectExpeditionLeader('main_hero')">
            <input type="radio" name="exp_leader_sel" id="exp_l_main" ${isHeroRunning ? 'disabled' : 'checked'} style="margin-right:10px; transform: scale(1.2);">
            <div>
                <b style="color:#ffd700;">${mainHero.name} (Текущ)</b>
                <div style="font-size:0.75em; color:#ccc;">Род: ${mainHero.dynasty} | Сила: ${mainHero.heroPower} | Нв: ${mainHero.level || 1}</div>
            </div>
        </div>
        <button onclick="event.stopPropagation(); window.toggleSpecificRulerInventory('main_hero')" style="background:#222; border:1px solid #ffd700; color:#ffd700; padding:4px 8px; font-size:11px; cursor:pointer; border-radius:3px;">🎒</button>
    `;
    hRadio.innerHTML = hInfoHtml;
    leadersContainer.appendChild(hRadio);

    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach((ml, mIdx) => {
            const isLeaderRunning = window.activeExpeditions.some(e => e.leader && e.leader.name === ml.name);
            const lRadio = document.createElement('div');
            lRadio.style.cssText = `background: #1e1e1e; border: 1px solid #333; padding: 8px; margin-bottom: 8px; border-radius: 4px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;`;
            if (isLeaderRunning) lRadio.style.opacity = "0.4";
            
            lRadio.innerHTML = `
                <div style="display:flex; align-items:center;" onclick="if(!isLeaderRunning) window.selectExpeditionLeader('mighty_${mIdx}')">
                    <input type="radio" name="exp_leader_sel" id="exp_l_mighty_${mIdx}" ${isLeaderRunning ? 'disabled' : ''} style="margin-right:10px; transform: scale(1.2);">
                    <div>
                        <b style="color:#fff;">${ml.name}</b>
                        <div style="font-size:0.75em; color:#aaa;">Род: <span style="color:#ffd700;">${ml.dynasty}</span> | Сила: ${ml.heroPower} | Нв: ${ml.level || 1}</div>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); window.toggleSpecificRulerInventory('mighty_${mIdx}')" style="background:#222; border:1px solid #ffd700; color:#ffd700; padding:4px 8px; font-size:11px; cursor:pointer; border-radius:3px;">🎒</button>
            `;
            leadersContainer.appendChild(lRadio);
        });
    }

    leaderPanel.appendChild(leadersContainer);
    body.appendChild(leaderPanel);
    modal.appendChild(body);

    const footer = document.createElement('div');
    footer.style.cssText = `padding: 10px; background: #1a1a1a; border-top: 1px solid #333; text-align: right;`;
    footer.innerHTML = `
        <button onclick="document.getElementById('expedition-center-modal').remove()" style="
            background:#444; color:white; border:none; padding:10px 20px; font-weight:bold; cursor:pointer; border-radius:4px; font-size:0.85em; text-transform:uppercase;
        ">Затвори</button>
    `;
    modal.appendChild(footer);

    document.body.appendChild(modal);
    window.currentSelectedLeaderType = isHeroRunning ? 'mighty_0' : 'main_hero';
    window.selectExpeditionLeader(window.currentSelectedLeaderType);
};

window.selectExpeditionLeader = function(type) {
    window.currentSelectedLeaderType = type;
    if (type === 'main_hero') {
        const el = document.getElementById('exp_l_main');
        if (el) el.checked = true;
    } else if (type.startsWith('mighty_')) {
        const idx = type.split('_')[1];
        const el = document.getElementById(`exp_l_mighty_${idx}`);
        if (el) el.checked = true;
    }
};

window.getSelectedExpeditionLeader = function() {
    const type = window.currentSelectedLeaderType || 'main_hero';
    if (type === 'main_hero') {
        return window.currentHero;
    } else if (type.startsWith('mighty_')) {
        const idx = parseInt(type.split('_')[1]);
        if (window.mightyLeaders && window.mightyLeaders[idx]) {
            return window.mightyLeaders[idx];
        }
    }
    return window.currentHero;
};

window.startSelectedExpedition = function(questIndex, leader) {
    if (window.activeExpeditions.length >= 3) {
        alert("Можете да провеждате най-много 3 мисии едновременно!");
        return;
    }
    const quest = window.legendaryQuests[questIndex];
    if (!quest) return;

    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(leader);
    }

    const newExp = {
        title: quest.title,
        destination: quest.destination,
        description: quest.description,
        duration: quest.duration,
        currentProgress: 0,
        steps: [...quest.steps],
        final: quest.final,
        reward: { ...quest.reward },
        leader: leader
    };

    window.activeExpeditions.push(newExp);
    window.showMysticModal("Мисията Започна!", `Водач: <b>${leader.name}</b> от род ${leader.dynasty} потегли към ${quest.destination}.`, "expedition");
    window.renderExpeditionButton();
};

/**
 * АВТОМАТИЧНО ОБНОВЯВАНЕ ПРИ ВСЕКИ ХОД
 */
window.updateExpeditionSystem = function() {
    if (window.activeExpeditions.length === 0) return;

    for (let i = window.activeExpeditions.length - 1; i >= 0; i--) {
        let exp = window.activeExpeditions[i];
        
        if (exp.currentProgress < exp.duration) {
            exp.currentProgress++;

            if (window.gainHeroXP) {
                window.gainHeroXP(exp.leader, 15);
            }

            let stepInterval = Math.floor(exp.duration / exp.steps.length) || 1;
            if (exp.currentProgress % stepInterval === 0) {
                let stepIdx = Math.floor(exp.currentProgress / stepInterval) - 1;
                if (stepIdx >= 0 && stepIdx < exp.steps.length) {
                    window.showAdvisorMsg(`🌍 [Мисия] ${exp.leader.name} в ${exp.destination}: ${exp.steps[stepIdx]}`);
                }
            }
            
            if (exp.currentProgress >= exp.duration) {
                window.showAdvisorMsg(`🎉 Експедицията на ${exp.leader.name} в "${exp.title}" приключи! Отворете Палатата за награда.`);
            }
        }
    }

    if (document.getElementById('expedition-center-modal')) {
        window.openExpeditionCenter();
    }
    window.renderExpeditionButton();
};

/**
 * РЪЧНО ИЗВИКВАНЕ ПРИ КЛИКВАНЕ ВЪРХУ БУТОНА „ПРИЕМИ ЕКСПЕДИЦИЯТА“
 */
window.completeSpecificExpedition = function(index) {
    const exp = window.activeExpeditions[index];
    if (!exp) return;

    const hero = exp.leader;
    const goldReward = exp.reward.gold || 0;
    const powerReward = exp.reward.power || 0;

    if (window.gainHeroXP) {
        window.gainHeroXP(hero, 300);
    }
    
    if (window.checkAndAssignClass) {
        window.checkAndAssignClass(hero);
    }

    let rewardSummary = `+${goldReward} 💰, +${powerReward} ⚔️`;
    const finalContent = `
        ${exp.final}<br><br>
        <b>Бонус опит за водача:</b> <span style="color: #00ffff;">+300 XP</span> ✨<br>
        <b>Род:</b> ${hero.dynasty}<br>
        <b>Текущ Клас:</b> <span style="color: #ffd700;">${hero.currentClass || "Чист Водач"}</span><br>
        <b>Спечелени блага:</b> ${rewardSummary}<br>
        <b>Донесен артефакт:</b> <span style="color: #ffd700;">${exp.reward.item || "Няма"}</span>
    `;

    window.showMysticModal(`Успешен Край!`, finalContent, "triumph");

    window.currentHero.gold += goldReward;
    if (hero.name === window.currentHero.name) {
        window.currentHero.heroPower += powerReward;
    } else {
        hero.heroPower += powerReward;
    }

    if (exp.reward.item && window.acquireArtifact) {
        window.acquireArtifact(exp.reward.item);
    }

    window.activeExpeditions.splice(index, 1);
    
    window.openExpeditionCenter();
    window.renderExpeditionButton();
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.completeExpedition = function() {
    if (window.activeExpeditions.length > 0) {
        window.completeSpecificExpedition(0);
    }
};

/**
 * ДИНАМИЧНО ДОСИЕ И ИНВЕНТАР ЗА ВСЕКИ ОТДЕЛЕН ВЛАДЕТЕЛ
 */
window.toggleSpecificRulerInventory = function(leaderKey) {
    let hero = window.currentHero;
    if (leaderKey.startsWith('mighty_')) {
        let idx = parseInt(leaderKey.split('_')[1]);
        if (window.mightyLeaders && window.mightyLeaders[idx]) {
            hero = window.mightyLeaders[idx];
        }
    }

    let inventoryModal = document.getElementById('inventory-modal');
    if (inventoryModal) {
        inventoryModal.remove();
        return;
    }

    let reqXP = 150;
    if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) {
        reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level || 1);
    } else {
        reqXP = (hero.level || 1) * 150;
    }
    
    let xpPercent = Math.min(((hero.xp || 0) / reqXP) * 100, 100);

    inventoryModal = document.createElement('div');
    inventoryModal.id = 'inventory-modal';
    inventoryModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; max-width: 420px; background: #1a1a1a; border: 2px solid #d4af37;
        box-shadow: 0 0 25px rgba(0,0,0,0.9); z-index: 30000; padding: 15px;
        color: white; font-family: 'Arial', sans-serif; border-radius: 8px; box-sizing: border-box;
    `;

    let rpgDashboardHTML = `
        <div style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 12px; margin-bottom: 12px;">
            <h2 style="margin: 0 0 5px 0; color: #ffd700; font-family: 'Georgia', serif; font-size:1.1em;">RPG ДОСИЕ НА ВЛАДЕТЕЛЯ</h2>
            <div style="font-size: 11px; color: #aaa; text-transform: uppercase;">Име: <b>${hero.name}</b> | Род: <b>${hero.dynasty}</b></div>
            <div style="font-size: 1em; font-weight: bold; color: #00ffff; margin-top: 4px; margin-bottom: 6px;">Клас: ${hero.currentClass || "Чист Водач"}</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85em; margin-bottom: 4px; color: #ccc;">
                <span><b>Ниво:</b> ${hero.level || 1}</span>
                <span>${hero.xp || 0} / ${reqXP} XP</span>
            </div>
            <div style="width: 100%; background: #333; height: 10px; border-radius: 5px; border: 1px solid #555; overflow: hidden;">
                <div style="width: ${xpPercent}%; background: linear-gradient(90deg, #00c6ff, #0072ff); height: 100%;"></div>
            </div>
        </div>
    `;

    let slotsHTML = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px;">`;
    for (let i = 0; i < 9; i++) {
        let item = window.playerInventory && window.playerInventory[i];
        if (item) {
            slotsHTML += `
                <div style="background: #2a2a2a; border: 1px solid #ffd700; height: 85px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; padding: 4px; text-align: center; box-sizing: border-box;">
                    <span style="font-size: 22px; margin-bottom: 2px;">🏺</span>
                    <b style="color: #fff;">${item.name}</b>
                </div>`;
        } else {
            slotsHTML += `<div style="background: rgba(0,0,0,0.4); border: 1px dashed #444; height: 85px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #555;">🔒</div>`;
        }
    }
    slotsHTML += `</div>`;

    inventoryModal.innerHTML = rpgDashboardHTML + slotsHTML + `<button onclick="document.getElementById('inventory-modal').remove()" style="width: 100%; background: #d4af37; color: black; border: none; padding: 10px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size:0.85em;">Затвори</button>`;
    document.body.appendChild(inventoryModal);
};

window.toggleRulerInventory = function() {
    window.toggleSpecificRulerInventory('main_hero');
};

/**
 * РЕНДЕРИРАНЕ НА БУТОНА С ОПТИМИЗИРАН КЛАС ЗА МОБИЛНИ УСТРОЙСТВА
 */
window.renderExpeditionButton = function() {
    let btn = document.getElementById('btn-expeditions');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'btn-expeditions';
        btn.style.cssText = `
            position: fixed; bottom: 80px; right: 20px; padding: 12px 24px;
            background: linear-gradient(135deg, #8a2387, #e94057); color: white;
            font-weight: bold; border: 2px solid #ffd700; border-radius: 30px;
            cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 10000;
            font-family: 'Georgia', serif; letter-spacing: 0.5px;
        `;
        btn.onclick = () => { window.openExpeditionCenter(); };
        document.body.appendChild(btn);
    }

    if (window.activeExpeditions.length > 0) {
        let shortStatus = window.activeExpeditions.map(e => {
            let left = e.duration - e.currentProgress;
            return `• ${e.title.substring(0,10)}... (${left <= 0 ? 'Готова' : left + 'х'})`;
        }).join(' | ');
        
        btn.innerHTML = `🌍 <span class="expedition-btn-text">Мисии (${window.activeExpeditions.length}/3)</span><br><span class="expedition-btn-status" style="font-size: 10px; color: #00ffcc; font-family: Arial;">${shortStatus}</span>`;
        btn.style.background = "linear-gradient(135deg, #1f4037, #99f2c8)";
        btn.style.color = "#fff";
    } else {
        btn.innerHTML = `🌍 <span class="expedition-btn-text">Експедиции (0/3)</span>`;
        btn.style.background = "linear-gradient(135deg, #8a2387, #e94057)";
        btn.style.color = "white";
    }
};

/**
 * ГЛОБАЛНИ МОСТОВЕ (ALIASES) ЗА ПОДСИГУРЯВАНЕ НА ОНКЛИК СЪБИТИЯТА В INDEX.HTML
 */
window.openExpeditionsMenu = function() {
    window.openExpeditionCenter();
};

window.openInventory = function() {
    window.toggleRulerInventory();
};

/**
 * АВТОМАТИЧНО САМОЗАДЕЙСТВАНЕ ПРИ ЗАРЕЖДАНЕ
 */
(function() {
    if (typeof window.renderExpeditionButton === 'function') {
        window.renderExpeditionButton();
    }
    setTimeout(() => {
        if (typeof window.renderExpeditionButton === 'function') {
            window.renderExpeditionButton();
        }
    }, 500);
})();
