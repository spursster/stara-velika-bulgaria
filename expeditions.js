/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: ОБНОВЕН (Паралелни мисии, 9 слота инвентар и Модерно RPG досие)
 * Статистика на файловете в проекта: 16
 */

window.activeExpeditions = window.activeExpeditions || [];
window.legendaryQuests = window.legendaryQuests || [];

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
        reward: { gold: 5000, power: 150, army: 0, item: "sword_of_kubrat" }
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
        reward: { gold: 2000, power: 200, army: 0, item: "hyperborean_map" }
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
        reward: { gold: 4000, power: 100, army: 0, item: "thracian_rhyston" }
    },
    // --- ПАКЕТ 3 ---
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
        reward: { gold: 4500, power: 120, army: 30, item: "palmira_scroll" }
    },
    // --- ПАКЕТ 4 ---
    {
        title: "Александрия: Светилището на Свещения бик",
        destination: "Египет",
        description: "Експедиция до делтата на Нил за изследване на Серапеума и древните египетски мистерии.",
        duration: 14,
        steps: [
            "Пътуване с кораби по вълните на Средиземно море.",
            "Пристигане в Александрия – посещение на Голямата библиотека.",
            "Слизане в подземните катакомби на Серапеума в пълна тъмнина.",
            "Дешифриране на йероглифи, разкриващи тайните на вечния живот."
        ],
        final: "Посветените се завръщат с папируси, съдържащи древна алхимия!",
        reward: { gold: 3500, power: 130, army: 0, item: "amon_alchemist" }
    },
    // --- ПАКЕТ 5 ---
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
        reward: { gold: 3000, power: 200, army: 50, item: "kabiri_ring" }
    }
];

if (window.legendaryQuests.length === 0) {
    window.legendaryQuests = allCoreQuests;
}

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

    // Инициализиране на RPG данни, ако липсват
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

window.updateExpeditionSystem = function() {
    if (window.activeExpeditions.length === 0) return;

    const hero = window.currentHero;

    for (let i = window.activeExpeditions.length - 1; i >= 0; i--) {
        let exp = window.activeExpeditions[i];
        exp.currentProgress++;

        // ИНТЕГРАЦИЯ НА RPG ОПИТ НА ВСЕКИ ХОД
        if (window.gainHeroXP) {
            window.gainHeroXP(exp.leader, 15); // Водачите получават 15 XP на ход в мисия
            if (exp.leader.skillPoints > 0 && window.autoAssignLeaderSkills && exp.leader !== hero) {
                window.autoAssignLeaderSkills(exp.leader); // Автоматично разпределение за странични AI лидери
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

    let rewardSummary = `<span style="color: #ffd700;">+${goldReward}</span> 💰, <span style="color: #4d4dff;">+${powerReward}</span> ⚔️, <span style="color: #4caf50;">+${armyReward}</span> 🏹`;
    
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
        
        if (exp.reward.item && window.acquireArtifact) {
            window.acquireArtifact(exp.reward.item); 
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
 * КРАСИВО РЕПРЕДСТАВЯНЕ НА ИНВЕНТАРА + КЛАС, НИВО И ЛЕНТА ЗА ОПИТ
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

    // Изчисляване на XP лентата
    let reqXP = window.rpgDatabase ? window.rpgDatabase.getXPRequiredForLevel(hero.level) : 100;
    let xpPercent = Math.min((hero.xp / reqXP) * 100, 100);

    inventoryModal = document.createElement('div');
    inventoryModal.id = 'inventory-modal';
    inventoryModal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 420px; background: #1a1a1a; border: 2px solid #d4af37;
        box-shadow: 0 0 25px rgba(0,0,0,0.9); z-index: 30000; padding: 20px;
        color: white; font-family: 'Arial', sans-serif; border-radius: 8px;
    `;

    // 1. ИНТЕРФЕЙС НА RPG ДОСИЕТО (Текущ Клас, Ниво, Прогрес лента и Свободни точки)
    let rpgDashboardHTML = `
        <div style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px;">
            <h2 style="margin: 0 0 5px 0; color: #ffd700; letter-spacing: 1px;">RPG ДОСИЕ НА ВЛАДЕТЕЛЯ</h2>
            <div style="font-size: 1.1em; font-weight: bold; color: #00ffff; margin-bottom: 8px;">
                Клас: ${hero.currentClass || "Няма клас"}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 4px; color: #ccc;">
                <span><b>Ниво:</b> ${hero.level}</span>
                <span>${hero.xp} / ${reqXP} XP</span>
            </div>
            <div style="width: 100%; background: #333; height: 12px; border-radius: 6px; border: 1px solid #555; overflow: hidden; margin-bottom: 10px;">
                <div style="width: ${xpPercent}%; background: linear-gradient(90deg, #00c6ff, #0072ff); height: 100%;"></div>
            </div>
            <div style="font-size: 0.85em; color: #ffd700;">
                ✨ Налични точки за умения: <b>${hero.skillPoints}</b>
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
                    <span style="font-size: 26px; margin-bottom: 3px;">${item.icon || "📦"}</span>
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
        <h4 style="margin: 0 0 10px 0; color: #d4af37; text-transform: uppercase; font-size: 0.9em; letter-spacing: 0.5px;">Слотове за съкровища (9 броя):</h4>
        ${slotsHTML}
        <button onclick="document.getElementById('inventory-modal').remove()" style="width: 100%; background: #d4af37; color: black; border: none; padding: 10px; font-weight: bold; border-radius: 4px; cursor: pointer; text-transform: uppercase;">Затвори Досието</button>
    `;

    document.body.appendChild(inventoryModal);
};

window.renderExpeditionButton = function() {
    let btn = document.getElementById('btn-expeditions');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'btn-expeditions';
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
            background: linear-gradient(135deg, #8a2387, #e94057); color: white;
            font-weight: bold; border: 2px solid #ffd700; border-radius: 30px;
            cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 10000;
        `;
        btn.onclick = () => {
            if (window.activeExpeditions.length > 0) {
                let currentNames = window.activeExpeditions.map(e => `${e.title} (${e.duration - e.currentProgress} хода)`).join('<br>');
                window.showMysticModal("Активни Мисии", `В момента провеждате:<br><br><b>${currentNames}</b>`, "info");
            } else {
                window.showMysticModal("Няма активни експедиции", "Използвайте събитията или механиките, за да изпратите владетели.", "info");
            }
        };
        document.body.appendChild(btn);
    }
    btn.innerHTML = `🌍 Експедиции (${window.activeExpeditions.length}/3)`;
};
