/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: ЛЕГЕНДАРЕН (Персонализиран мистичен интерфейс - Пакет 1-5)
 * НАДГРАЖДАНЕ: Поддръжка на 3 паралелни мисии, случайни водачи от DB и 9 слота RPG инвентар
 * СТАТИСТИКА НА ФАЙЛОВЕТЕ В ПРОЕКТА: 16
 */

// Променяме от единичен обект към масив за поддръжка на до 3 активни мисии
window.activeExpeditions = window.activeExpeditions || [];
window.legendaryQuests = window.legendaryQuests || [];

// Обединена база данни с всички епични мисии (Пакети 1, 2, 3, 4 и 5)
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
        description: "Проучване на най-старите царски кургани в подножието на Кавказ, където почиват първите конници.",
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

// Инициализиране на наличните мисии
if (window.legendaryQuests.length === 0) {
    window.legendaryQuests = allCoreQuests;
}

/**
 * ГЕНЕРИРАНЕ И ОПРЕСНЯВАНЕ НА ИНТЕРФЕЙСА ЗА ИЗБОР НА МИСИИ
 */
window.openExpeditionCenter = function() {
    let modal = document.getElementById('expedition-center-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'expedition-center-modal';
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 850px; height: 85vh; background: #121212; border: 2px solid #d4af37;
        box-shadow: 0 0 35px rgba(0,0,0,0.95); z-index: 25000; display: flex;
        flex-direction: column; color: white; font-family: 'Georgia', serif; border-radius: 6px;
    `;

    // Заглавие
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 15px; background: linear-gradient(90deg, #1f1f1f, #2d2d2d);
        border-bottom: 1px solid #d4af37; display: flex; justify-content: space-between; align-items: center;
    `;
    header.innerHTML = `
        <h2 style="margin:0; color:#d4af37; letter-spacing:1px; text-transform:uppercase; font-size:1.3em;">🌍 Великата Палата на Експедициите</h2>
        <div style="font-size:0.9em; color:#aaa;">Активни мисии: <b style="color:#ffd700;">${window.activeExpeditions.length}/3</b></div>
    `;
    modal.appendChild(header);

    // Основно съдържание (Разделено на две - Списък и Лидерски съвет)
    const body = document.createElement('div');
    body.style.cssText = `display: flex; flex: 1; overflow: hidden;`;

    // Лява част: Списък с мисии
    const questList = document.createElement('div');
    questList.style.cssText = `width: 60%; padding: 15px; overflow-y: auto; border-right: 1px solid #333; background: #161616;`;
    
    window.legendaryQuests.forEach((q, idx) => {
        const isRunning = window.activeExpeditions.some(e => e.title === q.title);
        
        const qCard = document.createElement('div');
        qCard.style.cssText = `
            background: #222; border: 1px solid #444; padding: 12px; margin-bottom: 12px;
            border-radius: 4px; position: relative; transition: all 0.2s;
        `;
        if (isRunning) qCard.style.opacity = "0.5";

        qCard.innerHTML = `
            <h3 style="margin:0 0 5px 0; color:#ffd700; font-size:1.1em;">${q.title}</h3>
            <div style="font-size:0.8em; color:#00ffcc; margin-bottom:6px;">📍 Дестинация: ${q.destination} | ⏳ Продължителност: ${q.duration} хода</div>
            <p style="margin:0 0 10px 0; font-size:0.85em; color:#ccc; line-height:1.3;">${q.description}</p>
            <div style="font-size:0.8em; color:#aaa; margin-bottom:8px;">
                🎁 Очаквана награда: ${q.reward.gold ? `💰 ${q.reward.gold} ` : ''}${q.reward.power ? `⚔️ ${q.reward.power} ` : ''}${q.reward.army ? `🏹 ${q.reward.army} ` : ''}${q.reward.item ? `⭐ [${q.reward.item}]` : ''}
            </div>
        `;

        if (!isRunning && window.activeExpeditions.length < 3) {
            const startBtn = document.createElement('button');
            startBtn.innerText = "ИЗПРАТИ ЕКСПЕДИЦИЯ";
            startBtn.style.cssText = `
                background:#d4af37; color:black; border:none; padding: 6px 12px;
                font-weight:bold; font-size:0.75em; cursor:pointer; border-radius:3px; text-transform:uppercase;
            `;
            startBtn.onclick = () => {
                const selectedLeader = window.getSelectedExpeditionLeader();
                window.startSelectedExpedition(idx, selectedLeader);
                window.openExpeditionCenter(); // Опресняване
            };
            qCard.appendChild(startBtn);
        } else if (isRunning) {
            qCard.innerHTML += `<div style="position:absolute; top:10px; right:10px; background:#ffd700; color:black; font-size:0.7em; padding:2px 6px; font-weight:bold; border-radius:3px;">В ПРОЦЕС...</div>`;
        }

        questList.appendChild(qCard);
    });
    body.appendChild(questList);

    // Дясна част: Списък с налични Водачи и Родови Владетели
    const leaderPanel = document.createElement('div');
    leaderPanel.style.cssText = `width: 40%; padding: 15px; background: #111; overflow-y: auto; display:flex; flex-direction:column;`;
    leaderPanel.innerHTML = `
        <h3 style="margin:0 0 10px 0; color:#d4af37; font-size:1em; border-bottom:1px solid #444; padding-bottom:5px; text-transform:uppercase;">👥 ИЗБОР НА ВОДАЧ НА МИСИЯТА</h3>
        <p style="margin:0 0 15px 0; font-size:0.8em; color:#aaa; line-height:1.3;">Изберете кой велик велможа да оглави похода. Неговите лични качества и родови бонуси ще повлияят на успеха на експедицията и трупането на личен опит.</p>
    `;

    const leadersContainer = document.createElement('div');
    leadersContainer.style.cssText = `flex:1; overflow-y:auto;`;

    // Вкарваме главния герой като първи избор
    const mainHero = window.currentHero;
    const hRadio = document.createElement('div');
    hRadio.style.cssText = `
        background: rgba(214,175,55,0.1); border: 1px solid #d4af37; padding: 10px;
        margin-bottom: 10px; border-radius: 4px; display:flex; align-items:center; cursor:pointer;
    `;
    hRadio.onclick = () => { window.selectExpeditionLeader('main_hero'); };
    hRadio.innerHTML = `
        <input type="radio" name="exp_leader_sel" id="exp_l_main" checked style="margin-right:10px;">
        <div>
            <b style="color:#ffd700;">Кан ${mainHero.name} (Главен владетел)</b>
            <div style="font-size:0.75em; color:#ccc;">Род: ${mainHero.dynasty} | Сила: ${mainHero.heroPower}</div>
        </div>
    `;
    leadersContainer.appendChild(hRadio);

    // Вкарваме останалите могъщи лидери от базата данни, които са налични в съвета
    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach((ml, mIdx) => {
            const isLeaderRunning = window.activeExpeditions.some(e => e.leader && e.leader.name === ml.name);
            
            const lRadio = document.createElement('div');
            lRadio.style.cssText = `
                background: #1e1e1e; border: 1px solid #333; padding: 10px;
                margin-bottom: 10px; border-radius: 4px; display:flex; align-items:center; cursor:pointer;
            `;
            if (isLeaderRunning) {
                lRadio.style.opacity = "0.4";
                lRadio.style.pointerEvents = "none";
            }
            lRadio.onclick = () => { window.selectExpeditionLeader(`mighty_${mIdx}`); };
            lRadio.innerHTML = `
                <input type="radio" name="exp_leader_sel" id="exp_l_mighty_${mIdx}" ${isLeaderRunning ? 'disabled' : ''} style="margin-right:10px;">
                <div>
                    <b style="color:#fff;">${ml.name}</b>
                    <div style="font-size:0.75em; color:#aaa;">Род: ${ml.dynasty || "Дуло"} ${isLeaderRunning ? '<span style="color:#ffd700;">(На мисия)</span>' : ''}</div>
                </div>
            `;
            leadersContainer.appendChild(lRadio);
        });
    }

    leaderPanel.appendChild(leadersContainer);
    body.appendChild(leaderPanel);
    modal.appendChild(body);

    // Долен панел за затваряне
    const footer = document.createElement('div');
    footer.style.cssText = `padding: 12px; background: #1a1a1a; border-top: 1px solid #333; text-align: right;`;
    footer.innerHTML = `
        <button onclick="document.getElementById('expedition-center-modal').remove()" style="
            background:#444; color:white; border:none; padding:8px 16px; font-weight:bold; cursor:pointer; border-radius:4px; text-transform:uppercase; font-size:0.8em;
        ">Затвори Палатата</button>
    `;
    modal.appendChild(footer);

    document.body.appendChild(modal);
    window.currentSelectedLeaderType = 'main_hero'; // Базов избор
};

/**
 * ЛОГИКА ЗА СЕЛЕКЦИЯ НА ЛИДЕР ОТ ИНТЕРФЕЙСА
 */
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

/**
 * ИЗВЛИЧАНЕ НА ОБЕКТА НА ИЗБРАНИЯ ВОДАЧ
 */
window.getSelectedExpeditionLeader = function() {
    const type = window.currentSelectedLeaderType || 'main_hero';
    if (type === 'main_hero') {
        return window.currentHero;
    } else if (type.startsWith('mighty_')) {
        const idx = parseInt(type.split('_')[1]);
        if (window.mightyLeaders && window.mightyLeaders[idx]) {
            // Създаваме/поддържаме персистентен обект на лидера за целите на RPG статистиките
            const ml = window.mightyLeaders[idx];
            if (!ml.gold) ml.gold = 0;
            if (!ml.heroPower) ml.heroPower = 100;
            if (!ml.armySize) ml.armySize = 100;
            return ml;
        }
    }
    return window.currentHero;
};

/**
 * СТАРТИРАНЕ НА ИЗБРАНАТА ЕКСПЕДИЦИЯ И ИНТЕГРАЦИЯ НА RPG ДАННИ
 */
window.startSelectedExpedition = function(questIndex, leader) {
    if (window.activeExpeditions.length >= 3) {
        alert("Можете да провеждате най-много 3 паралелни мисии едновременно!");
        return;
    }
    const quest = window.legendaryQuests[questIndex];
    if (!quest) return;

    if (!leader) {
        leader = window.currentHero;
    }

    // Инициализиране на RPG данни, ако липсват в новата rpg_system.js
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
    window.showMysticModal("Експедицията Тръгна!", `Водач: <b>${leader.name}</b> пое към ${quest.destination}.`, "expedition");
    window.renderExpeditionButton();
};

/**
 * СИСТЕМА ЗА АВТОМАТИЧНО НАПРЕДВАНЕ НА ВСИЧКИ АКТИВНИ ЕКСПЕДИЦИИ (ХОД ПО ХОД)
 */
window.updateExpeditionSystem = function() {
    if (window.activeExpeditions.length === 0) return;

    const hero = window.currentHero;

    // Въртим цикъла отзад напред, тъй като може да трием елементи при завършване
    for (let i = window.activeExpeditions.length - 1; i >= 0; i--) {
        let exp = window.activeExpeditions[i];
        exp.currentProgress++;

        // ИНТЕГРАЦИЯ НА RPG ОПИТ НА ВСЕКИ ХОД
        if (window.gainHeroXP) {
            window.gainHeroXP(exp.leader, 15); // Водачите получават 15 XP на ход в мисия
            if (exp.leader.skillPoints > 0 && window.autoAssignLeaderSkills && exp.leader !== hero) {
                window.autoAssignLeaderSkills(exp.leader); // Автоматично разпределяне за странични AI лидери
            }
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
};

/**
 * УСПЕШЕН КРАЙ НА КОНКРЕТНА ЕКСПЕДИЦИЯ И РАЗПРЕДЕЛЕНИЕ НА БЛАГАТА С МАСИВЕН XP БОНУС
 */
window.completeSpecificExpedition = function(index) {
    const exp = window.activeExpeditions[index];
    if (!exp) return;

    const hero = exp.leader;
    const goldReward = exp.reward.gold || 0;
    const powerReward = exp.reward.power || 0;
    const armyReward = exp.reward.army || 0;

    // МАСИВЕН RPG БОНУС ПРИ УСПЕХ
    if (window.gainHeroXP) {
        window.gainHeroXP(hero, 300); // 300 XP бонус за завършена мисия
        if (window.checkAndAssignClass) window.checkAndAssignClass(hero);
    }

    let rewardSummary = ``;
    if (goldReward > 0) rewardSummary += `<span style="color: #ffd700;">+${goldReward}</span> 💰 `;
    if (powerReward > 0) rewardSummary += `<span style="color: #ff4d4d;">+${powerReward}</span> ⚔️ `;
    if (armyReward > 0) rewardSummary += `<span style="color: #4caf50;">+${armyReward}</span> 🏹 `;
    
    const finalContent = `
        ${exp.final}<br><br>
        <b>Бонус опит за лидера:</b> <span style="color: #00ffff;">+300 XP</span> ✨<br>
        <b>Спечелени блага:</b> ${rewardSummary}<br>
        <b>Донесен артефакт:</b> <span style="color: #ffd700;">${exp.reward.item || "Няма"}</span>
    `;

    window.showMysticModal(`Успешен Край на Експедицията!`, finalContent, "triumph");

    if (hero) {
        hero.gold += goldReward;
        hero.heroPower += powerReward;
        hero.armySize += armyReward;
    }

    // Добавяне в съкровищницата/инвентара в съвместимост с items.js
    if (exp.reward.item) {
        if (window.acquireArtifact) {
            window.acquireArtifact(exp.reward.item); 
        } else if (window.addItemToTreasury) {
            window.addItemToTreasury(exp.reward.item);
        } else {
            // Фалбек ако системата за инвентар не е напълно заредена в момента
            window.playerInventory = window.playerInventory || [];
            window.playerInventory.push({ name: exp.reward.item, icon: "🏺", bonus: { goldBonus: 5 } });
        }
    }

    window.activeExpeditions.splice(index, 1);
    window.renderExpeditionButton();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.completeExpedition = function() {
    if (window.activeExpeditions.length > 0) {
        window.completeSpecificExpedition(0);
    }
};

/**
 * ПРЕРАБОТЕНО ИЗСКАЧАЩО RPG ДОСИЕ НА УЧАСТНИКА (Текущо ниво, XP лента и придобит клас над 9-те слота)
 */
window.toggleRulerInventory = function() {
    const hero = window.currentHero;
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }

    let inventoryModal = document.getElementById('inventory-modal');
    if (inventoryModal) {
        inventoryModal.remove();
        return;
    }

    // Динамично изчисляване на изисквания опит чрез rpgDatabase или фалбек базова формула
    let reqXP = window.rpgDatabase ? window.rpgDatabase.getXPRequiredForLevel(hero.level) : (hero.level * 100);
    let xpPercent = Math.min((hero.xp / reqXP) * 100, 100);

    inventoryModal = document.createElement('div');
    inventoryModal.id = 'inventory-modal';
    inventoryModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 420px; background: #1a1a1a; border: 2px solid #d4af37;
        box-shadow: 0 0 25px rgba(0,0,0,0.9); z-index: 30000; padding: 20px;
        color: white; font-family: 'Arial', sans-serif; border-radius: 8px;
    `;

    // 1. ПРЕРАБОТЕН ИНТЕРФЕЙС НА RPG ДОСИЕТО НАД СЛОТОВЕТЕ
    let rpgDashboardHTML = `
        <div style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
            <h2 style="margin: 0 0 5px 0; color: #ffd700; letter-spacing: 1px; font-family: 'Georgia', serif;">RPG ДОСИЕ НА ВЛАДЕТЕЛЯ</h2>
            <div style="font-size: 1.1em; font-weight: bold; color: #00ffff; margin-bottom: 8px;">
                Клас: ${hero.currentClass || "Няма придобит клас"}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 4px; color: #ccc;">
                <span><b>Текущо Ниво:</b> ${hero.level || 1}</span>
                <span>${hero.xp || 0} / ${reqXP} XP</span>
            </div>
            <div style="width: 100%; background: #333; height: 12px; border-radius: 6px; border: 1px solid #555; overflow: hidden; margin-bottom: 10px;">
                <div style="width: ${xpPercent}%; background: linear-gradient(90deg, #00c6ff, #0072ff); height: 100%;"></div>
            </div>
            <div style="font-size: 0.85em; color: #ffd700;">
                ✨ Свободни точки за умения: <b>${hero.skillPoints || 0}</b>
            </div>
        </div>
    `;

    // 2. ИЗГРАЖДАНЕ НА 9-ТЕ МИСТИЧНИ СЛОТА ЗА АРТЕФАКТИ
    let slotsHTML = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 15px;">`;
    for (let i = 0; i < 9; i++) {
        let item = window.playerInventory && window.playerInventory[i];
        if (item) {
            slotsHTML += `
                <div style="background: #2a2a2a; border: 1px solid #ffd700; height: 95px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; padding: 4px; text-align: center; box-shadow: inset 0 0 10px rgba(212,175,55,0.2);">
                    <span style="font-size: 26px; margin-bottom: 3px;">${item.icon || "🏺"}</span>
                    <b style="color: #fff; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-direction: vertical;">${item.name}</b>
                </div>`;
        } else {
            slotsHTML += `
                <div style="background: rgba(0,0,0,0.4); border: 1px dashed #444; height: 95px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #555; font-size: 20px;">
                    🔒
                </div>`;
        }
    }
    slotsHTML += `</div>`;

    inventoryModal.innerHTML = `
        ${rpgDashboardHTML}
        <h4 style="margin: 0 0 10px 0; color: #d4af37; text-transform: uppercase; font-size: 0.9em; letter-spacing: 0.5px;">Мистични Артефакти (9 слота):</h4>
        ${slotsHTML}
        <button onclick="document.getElementById('inventory-modal').remove()" style="width: 100%; background: #d4af37; color: black; border: none; padding: 10px; font-weight: bold; border-radius: 4px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;">Затвори Досието</button>
    `;

    document.body.appendChild(inventoryModal);
};

/**
/**
 * ОПРЕСНЯВАНЕ НА ПЛАВАЩИЯ БУТОН ЗА ЕКСПЕДИЦИИ НА ЕКРАНА (ПОВДИГНАТ НАГОРЕ)
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
        btn.onclick = () => {
            window.openExpeditionCenter();
        };
        document.body.appendChild(btn);
    }
    btn.innerHTML = `🌍 Експедиции (${window.activeExpeditions.length}/3)`;
};
