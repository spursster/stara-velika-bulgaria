/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: КОРИГИРАН И ОПТИМИЗИРАН (Ходовете се движат, водачите се сменят, добавен е статус)
 * СТАТИСТИКА НА ФАЙЛОВЕТЕ В ПРОЕКТА: 16
 */

window.activeExpeditions = window.activeExpeditions || [];
window.legendaryQuests = window.legendaryQuests || [];

// Външна или вътрешна база данни за случайни български велможи
window.mightyLeaders = window.mightyLeaders || [
    { name: "Баян", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 110, gold: 0 },
    { name: "Котраг", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 115, gold: 0 },
    { name: "Аспарух", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 130, gold: 0 },
    { name: "Алцек", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 105, gold: 0 },
    { name: "Кубер", dynasty: "Дуло", level: 1, xp: 0, skillPoints: 0, heroPower: 120, gold: 0 }
];

const allCoreQuests = [
    // --- ПАКЕТ 1 ---
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
    // --- ПАКЕТ 2 ---
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
    // --- ПАКЕТ 3 ---
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
        final: "Вашите пратеници се завръщат, носейки мистичното знание за отвъдния живот!",
        reward: { power: 250, army: 40, item: "Дакийски свещен нож" }
    },
    // --- ПАКЕТ 4 ---
    {
        title: "Походът до Палмира: Изгубеният оазис",
        destination: "Сирийска пустиня",
        description: "Мисия през сухите пясъци до великия търговски център на царица Зенобия за сключване на съюз.",
        duration: 12,
        steps: [
            "Прекосяване на Босфора и навлизане в сухите земи на Анатолия.",
            "Битка с бедуински мародери при изворите на Ефрат.",
            "Пясъчна буря заслепява конницата – оцеляване благодарение на опитни водачи.",
            "Триумфално влизане през монументалната арка на Палмира."
        ],
        final: "Сключен е вечен търговски пакт и керваните тръгват на север!",
        reward: { gold: 4500, power: 120, army: 30, item: "Палмирски свитък" }
    },
    {
        title: "Александрия: Светилището на Серапис",
        destination: "Египет",
        description: "Експедиция до делтата на Нил за изследване на Серапеума и древните мистерии на Птолемеите.",
        duration: 14,
        steps: [
            "Пътуване с кораби по вълните на Средизенно море.",
            "Пристигане в Александрия – посещение на Голямата библиотека.",
            "Слизане в подземните катакомби на Серапеума в пълна тъмнина.",
            "Дешифриране на йероглифи, разкриващи изгубена алхимия."
        ],
        final: "Посветените се завръщат с папируси, съдържащи древни тайни!",
        reward: { gold: 3800, power: 140, item: "Папирус на Серапис" }
    },
    // --- ПАКЕТ 5 ---
    {
        title: "Царските гробници в Саламания",
        destination: "Кавказ",
        description: "Проучване на най-старите царски кургани в подножието на Кавказ, където почиват първия конници.",
        duration: 16,
        steps: [
            "Преминаване през Кубанската степ при тежки метеорологични условия.",
            "Откриване на скритите входове на каменните гробници под вечния сняг.",
            "Възстановяване на сребърни конски амуниции и древни бойни брадви.",
            "Отдаване на почит пред костите на старите владетели."
        ],
        final: "Кръвната връзка с предците е възобновена, духът на армията е несломим!",
        reward: { gold: 2500, power: 180, army: 60, item: "Кавказка сребърна брадва" }
    },
    {
        title: "Свещеният остров Левке (Змийски остров)",
        destination: "Черно море",
        description: "Морска експедиция до светилището на Ахил, пазено от хиляди бели птици сред вълните.",
        duration: 7,
        steps: [
            "Построяване на здрави дървени кораби в пристанището на Одесос.",
            "Навигиране през коварните черноморски течения на север.",
            "Акостиране на белите скали на Левке под крясъците на морските птици.",
            "Намиране на руините на храма и олтара на легендарния герой."
        ],
        final: "Открит е щитът на героя, носещ нечувана сила при обсада!",
        reward: { gold: 4000, power: 220, item: "Щитът на Ахил" }
    }
];

if (window.legendaryQuests.length === 0) {
    window.legendaryQuests = allCoreQuests;
}

/**
 * ФУНКЦИЯ ЗА ГЕНЕРИРАНЕ НА ИЗЦЯЛО НОВИ СЛУЧАЙНИ ВОДАЧИ (Решава проблем 1)
 */
window.rerollExpeditionLeaders = function() {
    const cost = 200;
    if (window.currentHero.gold < cost) {
        alert("Нямате достатъчно злато за свикване на нови велможи (Нужни са 200 💰)!");
        return;
    }
    window.currentHero.gold -= cost;

    const firstNames = ["Тервел", "Кардам", "Крум", "Омуртаг", "Пресиян", "Борис", "Симеон", "Петър", "Самуил", "Токту", "Паган", "Телериг"];
    const powerBonus = Math.floor(Math.random() * 40) + 90;

    window.mightyLeaders = [];
    for(let i=0; i<4; i++) {
        let randName = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + (i+1);
        window.mightyLeaders.push({
            name: randName,
            dynasty: window.currentHero.dynasty,
            level: window.currentHero.level || 1,
            xp: 0,
            skillPoints: 0,
            heroPower: powerBonus,
            gold: 0
        });
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    window.openExpeditionCenter();
};

/**
 * ГЛАВЕН ИНТЕРФЕЙС НА ПАЛАТАТА
 */
window.openExpeditionCenter = function() {
    let modal = document.getElementById('expedition-center-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'expedition-center-modal';
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 880px; height: 85vh; background: #121212; border: 2px solid #d4af37;
        box-shadow: 0 0 35px rgba(0,0,0,0.95); z-index: 25000; display: flex;
        flex-direction: column; color: white; font-family: 'Georgia', serif; border-radius: 6px;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        padding: 15px; background: linear-gradient(90deg, #1f1f1f, #2d2d2d);
        border-bottom: 1px solid #d4af37; display: flex; justify-content: space-between; align-items: center;
    `;
    header.innerHTML = `
        <h2 style="margin:0; color:#d4af37; letter-spacing:1px; text-transform:uppercase; font-size:1.3em;">🌍 Великата Палата на Експедициите</h2>
        <div style="font-size:0.9em; color:#aaa;">Активни: <b style="color:#00ffcc;">${window.activeExpeditions.length}/3</b></div>
    `;
    modal.appendChild(header);

    const body = document.createElement('div');
    body.style.cssText = `display: flex; flex: 1; overflow: hidden;`;

    // ЛЯВА ЧАСТ: Мисии
    const questList = document.createElement('div');
    questList.style.cssText = `width: 55%; padding: 15px; overflow-y: auto; border-right: 1px solid #333; background: #161616;`;
    
    window.legendaryQuests.forEach((q, idx) => {
        const activeInstance = window.activeExpeditions.find(e => e.title === q.title);
        
        const qCard = document.createElement('div');
        qCard.style.cssText = `
            background: #222; border: 1px solid #444; padding: 12px; margin-bottom: 12px;
            border-radius: 4px; position: relative;
        `;

        if (activeInstance) {
            // Визуализация на прогреса в реално време (Решава проблем 2)
            let pct = Math.floor((activeInstance.currentProgress / activeInstance.duration) * 100);
            qCard.style.border = "1px solid #00ffcc";
            qCard.style.background = "#152220";
            qCard.innerHTML = `
                <h3 style="margin:0 0 5px 0; color:#00ffcc; font-size:1.1em;">${q.title} [АКТИВНА]</h3>
                <div style="font-size:0.85em; color:#fff; margin-bottom:5px;"><b>Водач:</b> ${activeInstance.leader.name}</div>
                <div style="font-size:0.8em; color:#ffd700; margin-bottom:8px;">⏳ Прогрес: <b>${activeInstance.currentProgress} от ${activeInstance.duration} хода</b> (${pct}%)</div>
                <div style="width:100%; background:#222; height:6px; border-radius:3px; overflow:hidden;">
                    <div style="width:${pct}%; background:#00ffcc; height:100%;"></div>
                </div>
            `;
        } else {
            qCard.innerHTML = `
                <h3 style="margin:0 0 5px 0; color:#ffd700; font-size:1.1em;">${q.title}</h3>
                <div style="font-size:0.8em; color:#00ffcc; margin-bottom:6px;">📍 Дестинация: ${q.destination} | ⏳ Продължителност: ${q.duration} хода</div>
                <p style="margin:0 0 10px 0; font-size:0.85em; color:#ccc; line-height:1.3;">${q.description}</p>
                <div style="font-size:0.8em; color:#aaa; margin-bottom:8px;">
                    🎁 Награда: ${q.reward.gold ? `💰 ${q.reward.gold} ` : ''}${q.reward.power ? `⚔️ ${q.reward.power} ` : ''}${q.reward.item ? `⭐ [${q.reward.item}]` : ''}
                </div>
            `;

            if (window.activeExpeditions.length < 3) {
                const startBtn = document.createElement('button');
                startBtn.innerText = "ИЗПРАТИ ПОХОД";
                startBtn.style.cssText = `
                    background:#d4af37; color:black; border:none; padding: 6px 12px;
                    font-weight:bold; font-size:0.75em; cursor:pointer; border-radius:3px; text-transform:uppercase;
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

    // ДЯСНА ЧАСТ: Лидери
    const leaderPanel = document.createElement('div');
    leaderPanel.style.cssText = `width: 45%; padding: 15px; background: #111; overflow-y: auto; display:flex; flex-direction:column;`;
    leaderPanel.innerHTML = `
        <h3 style="margin:0 0 10px 0; color:#d4af37; font-size:1em; border-bottom:1px solid #444; padding-bottom:5px; text-transform:uppercase;">👥 ИЗБОР НА ВОДАЧ</h3>
        <button onclick="window.rerollExpeditionLeaders()" style="width:100%; background:#8a2387; color:white; border:1px solid #ffd700; padding:6px; font-weight:bold; font-size:0.8em; border-radius:4px; cursor:pointer; margin-bottom:12px;">🔄 СВИКАЙ НОВИ ВЕДМОЖИ (-200 💰)</button>
    `;

    const leadersContainer = document.createElement('div');
    leadersContainer.style.cssText = `flex:1; overflow-y:auto;`;

    // Главен герой
    const mainHero = window.currentHero;
    const isHeroRunning = window.activeExpeditions.some(e => e.leader && e.leader.name === mainHero.name);
    const hRadio = document.createElement('div');
    hRadio.style.cssText = `
        background: rgba(214,175,55,0.1); border: 1px solid #d4af37; padding: 10px;
        margin-bottom: 10px; border-radius: 4px; display:flex; align-items:center; cursor:pointer;
    `;
    if (isHeroRunning) hRadio.style.opacity = "0.4";
    hRadio.onclick = () => { if(!isHeroRunning) window.selectExpeditionLeader('main_hero'); };
    hRadio.innerHTML = `
        <input type="radio" name="exp_leader_sel" id="exp_l_main" ${isHeroRunning ? 'disabled' : 'checked'} style="margin-right:10px;">
        <div>
            <b style="color:#ffd700;">Кан ${mainHero.name} ${isHeroRunning ? '(На мисия)' : '(Свободен)'}</b>
            <div style="font-size:0.75em; color:#ccc;">Род: ${mainHero.dynasty} | Сила: ${mainHero.heroPower}</div>
        </div>
    `;
    leadersContainer.appendChild(hRadio);

    // Родови велможи
    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach((ml, mIdx) => {
            const isLeaderRunning = window.activeExpeditions.some(e => e.leader && e.leader.name === ml.name);
            
            const lRadio = document.createElement('div');
            lRadio.style.cssText = `
                background: #1e1e1e; border: 1px solid #333; padding: 10px;
                margin-bottom: 10px; border-radius: 4px; display:flex; align-items:center; cursor:pointer;
            `;
            if (isLeaderRunning) lRadio.style.opacity = "0.4";
            
            lRadio.onclick = () => { if(!isLeaderRunning) window.selectExpeditionLeader(`mighty_${mIdx}`); };
            lRadio.innerHTML = `
                <input type="radio" name="exp_leader_sel" id="exp_l_mighty_${mIdx}" ${isLeaderRunning ? 'disabled' : ''} style="margin-right:10px;">
                <div>
                    <b style="color:#fff;">${ml.name}</b>
                    <div style="font-size:0.75em; color:#aaa;">Сила: ${ml.heroPower} | Статус: ${isLeaderRunning ? '<span style="color:#00ffcc;">На мисия</span>' : '<span style="color:#4caf50;">Наличен</span>'}</div>
                </div>
            `;
            leadersContainer.appendChild(lRadio);
        });
    }

    leaderPanel.appendChild(leadersContainer);
    body.appendChild(leaderPanel);
    modal.appendChild(body);

    const footer = document.createElement('div');
    footer.style.cssText = `padding: 12px; background: #1a1a1a; border-top: 1px solid #333; text-align: right;`;
    footer.innerHTML = `
        <button onclick="document.getElementById('expedition-center-modal').remove()" style="
            background:#444; color:white; border:none; padding:8px 16px; font-weight:bold; cursor:pointer; border-radius:4px; text-transform:uppercase; font-size:0.8em;
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
    window.showMysticModal("Мисията Започна!", `Водач: <b>${leader.name}</b> потегли към ${quest.destination}.`, "expedition");
    window.renderExpeditionButton();
};

/**
 * АВТОМАТИЧНО НАПРЕДВАНЕ НА ХОДОВЕТЕ И ВЪНШНО ОПРЕСНЯВАНЕ (Решава проблем 2)
 */
window.updateExpeditionSystem = function() {
    if (window.activeExpeditions.length === 0) return;

    for (let i = window.activeExpeditions.length - 1; i >= 0; i--) {
        let exp = window.activeExpeditions[i];
        exp.currentProgress++; // Увеличаваме хода на мисията напред!

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
            window.completeSpecificExpedition(i);
        }
    }

    // Ако Палатата е отворена на екрана в момента, я преначертаваме веднага, за да се видят променените ходове!
    if (document.getElementById('expedition-center-modal')) {
        window.openExpeditionCenter();
    }
    window.renderExpeditionButton(); // Обновяваме плаващия бутон (Решава проблем 3)
};

window.completeSpecificExpedition = function(index) {
    const exp = window.activeExpeditions[index];
    if (!exp) return;

    const hero = exp.leader;
    const goldReward = exp.reward.gold || 0;
    const powerReward = exp.reward.power || 0;

    if (window.gainHeroXP) {
        window.gainHeroXP(hero, 300);
    }

    let rewardSummary = `+${goldReward} 💰, +${powerReward} ⚔️`;
    const finalContent = `
        ${exp.final}<br><br>
        <b>Бонус опит за водача:</b> <span style="color: #00ffff;">+300 XP</span> ✨<br>
        <b>Спечелени блага:</b> ${rewardSummary}<br>
        <b>Донесен артефакт:</b> <span style="color: #ffd700;">${exp.reward.item || "Няма"}</span>
    `;

    window.showMysticModal(`Успешен Край!`, finalContent, "triumph");

    if (hero) {
        if(hero.name === window.currentHero.name) {
            window.currentHero.gold += goldReward;
            window.currentHero.heroPower += powerReward;
        } else {
            window.currentHero.gold += goldReward; // Парите отиват в държавната хазна
            hero.heroPower += powerReward; // Силата отива при велможата
        }
    }

    if (exp.reward.item && window.acquireArtifact) {
        window.acquireArtifact(exp.reward.item);
    }

    window.activeExpeditions.splice(index, 1);
    
    if (document.getElementById('expedition-center-modal')) {
        window.openExpeditionCenter();
    }
    window.renderExpeditionButton();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.completeExpedition = function() {
    if (window.activeExpeditions.length > 0) {
        window.completeSpecificExpedition(0);
    }
};

window.toggleRulerInventory = function() {
    const hero = window.currentHero;
    let inventoryModal = document.getElementById('inventory-modal');
    if (inventoryModal) {
        inventoryModal.remove();
        return;
    }

    let reqXP = (hero.level || 1) * 100;
    let xpPercent = Math.min(((hero.xp || 0) / reqXP) * 100, 100);

    inventoryModal = document.createElement('div');
    inventoryModal.id = 'inventory-modal';
    inventoryModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 420px; background: #1a1a1a; border: 2px solid #d4af37;
        box-shadow: 0 0 25px rgba(0,0,0,0.9); z-index: 30000; padding: 20px;
        color: white; font-family: 'Arial', sans-serif; border-radius: 8px;
    `;

    let rpgDashboardHTML = `
        <div style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
            <h2 style="margin: 0 0 5px 0; color: #ffd700; font-family: 'Georgia', serif;">RPG ДОСИЕ НА ВЛАДЕТЕЛЯ</h2>
            <div style="font-size: 1.1em; font-weight: bold; color: #00ffff; margin-bottom: 8px;">Клас: ${hero.currentClass || "Владетел"}</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 4px; color: #ccc;">
                <span><b>Ниво:</b> ${hero.level || 1}</span>
                <span>${hero.xp || 0} / ${reqXP} XP</span>
            </div>
            <div style="width: 100%; background: #333; height: 12px; border-radius: 6px; border: 1px solid #555; overflow: hidden;">
                <div style="width: ${xpPercent}%; background: linear-gradient(90deg, #00c6ff, #0072ff); height: 100%;"></div>
            </div>
        </div>
    `;

    let slotsHTML = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 15px;">`;
    for (let i = 0; i < 9; i++) {
        let item = window.playerInventory && window.playerInventory[i];
        if (item) {
            slotsHTML += `
                <div style="background: #2a2a2a; border: 1px solid #ffd700; height: 95px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; padding: 4px; text-align: center;">
                    <span style="font-size: 26px; margin-bottom: 3px;">🏺</span>
                    <b style="color: #fff;">${item.name}</b>
                </div>`;
        } else {
            slotsHTML += `<div style="background: rgba(0,0,0,0.4); border: 1px dashed #444; height: 95px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #555;">🔒</div>`;
        }
    }
    slotsHTML += `</div>`;

    inventoryModal.innerHTML = rpgDashboardHTML + slotsHTML + `<button onclick="document.getElementById('inventory-modal').remove()" style="width: 100%; background: #d4af37; color: black; border: none; padding: 10px; font-weight: bold; cursor: pointer; text-transform: uppercase;">Затвори</button>`;
    document.body.appendChild(inventoryModal);
};

/**
 * ДИНАМИЧЕН ПЛАВАЩ БУТОН С ИНДИКАТОР ЗА АКТИВНИТЕ ХОДОВЕ (Решает проблему 3)
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
            font-family: 'Georgia', serif; text-spacing: 0.5px;
        `;
        btn.onclick = () => { window.openExpeditionCenter(); };
        document.body.appendChild(btn);
    }

    // Изграждаме ясен текст, за да вижда играчът кои мисии се изпълняват в момента (Решава проблем 3)
    if (window.activeExpeditions.length > 0) {
        let shortStatus = window.activeExpeditions.map(e => `• ${e.title.substring(0,12)}... (${e.duration - e.currentProgress}х)`).join(' | ');
        btn.innerHTML = `🌍 Мисии (${window.activeExpeditions.length}/3) <br><span style="font-size: 10px; color: #00ffcc; font-family: Arial;">${shortStatus}</span>`;
        btn.style.background = "linear-gradient(135deg, #1f4037, #99f2c8)";
        btn.style.color = "#fff";
    } else {
        btn.innerHTML = `🌍 Експедиции (0/3)`;
        btn.style.background = "linear-gradient(135deg, #8a2387, #e94057)";
    }
};
