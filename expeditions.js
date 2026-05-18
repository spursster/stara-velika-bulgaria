/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (ДИАБЛО МИСТИЦИЗЪМ, УПРАВЛЕНИЕ И ОБЕКТЕН ИНВЕНТАР)
 * КОРЕКЦИЯ: Пълна интеграция на 26-те мисии с реалните пасиви на Кан-а и инвентарната съкровищница.
 * Статистика на файловете в проекта: 17
 */

window.activeExpeditions = window.activeExpeditions || [];
window.legendaryQuests = window.legendaryQuests || [];

// АВТОМАТИЧЕН ЗАЩИТЕН FALLBACK ЗА МОДАЛНИ ПРОЗОРЦИ
if (typeof window.showMysticModal !== 'function') {
    window.showMysticModal = function(title, content, type) {
        let fallbackModal = document.getElementById('mystic-fallback-modal');
        if (fallbackModal) fallbackModal.remove();

        fallbackModal = document.createElement('div');
        fallbackModal.id = 'mystic-fallback-modal';
        
        let borderColors = { triumph: '#4caf50', expedition: '#d4af37' };
        let currentBorder = borderColors[type] || '#d4af37';

        fallbackModal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 85%; max-width: 420px; background: #0a0a0a; border: 2px solid ${currentBorder};
            padding: 22px; color: white; text-align: center; z-index: 40000; font-family: 'Cinzel', serif;
            border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.95); box-sizing: border-box;
        `;

        fallbackModal.innerHTML = `
            <h3 style="color:${currentBorder}; margin-top:0; font-size:1.1em; text-transform:uppercase; letter-spacing:1px;">${title}</h3>
            <p style="font-size:12px; line-height:1.6; color:#ccc; margin-bottom:20px;">${content}</p>
            <button onclick="document.getElementById('mystic-fallback-modal').remove()" class="action-btn" style="padding:10px 25px; font-size:11px;">ПРИЕМИ ЗНАМЕНИЕТО</button>
        `;
        document.body.appendChild(fallbackModal);
    };
}

/**
 * ИНИЦИАЛИЗАЦИЯ НА СВЕЩЕНИТЕ 26 МИСИИ ОТ ВСИЧКИ КРАИЩА НА СВЕТА
 */
window.initLegendaryQuests = function() {
    window.legendaryQuests = [
        { id: "q1", name: "Пътят на коприната", duration: 3, cost: 200, danger: 15, reward: "Копринен плащ", icon: "🧣", power: 15 },
        { id: "q2", name: "Тайната на Родопите", duration: 2, cost: 100, danger: 10, reward: "Родопски Кръст", icon: "✝️", power: 10 },
        { id: "q3", name: "Понтийско плаване", duration: 4, cost: 350, danger: 30, reward: "Ромейска Монета", icon: "🪙", gold: 20 },
        { id: "q4", name: "Кримска мисия", duration: 5, cost: 500, danger: 45, reward: "Меч на Атила", icon: "⚔️", power: 35 },
        { id: "q5", name: "Кавказки поход", duration: 4, cost: 400, danger: 35, reward: "Кавказки Кинжал", icon: "🗡️", power: 25 },
        { id: "q6", name: "Волжка мисия", duration: 6, cost: 600, danger: 40, reward: "Волжки Хрисовул", icon: "📜", gold: 25 },
        { id: "q7", name: "Панонийски набег", duration: 3, cost: 300, danger: 25, reward: "Панонийски Шлем", icon: "🪖", power: 20 },
        { id: "q8", name: "Римски преговори", duration: 5, cost: 450, danger: 20, reward: "Сенаторски Пръстен", icon: "💍", gold: 30 },
        { id: "q9", name: "Египетска тайна", duration: 7, cost: 700, danger: 50, reward: "Амулет на Птолемеите", icon: "🔮", gold: 35 },
        { id: "q10", name: "Мисия до Балтийско море", duration: 8, cost: 850, danger: 55, reward: "Северен Кехлибарен Нагръдник", icon: "🛡️", power: 30 },
        { id: "q11", name: "Персийски коридор", duration: 5, cost: 550, danger: 30, reward: "Персийски Кинжал", icon: "🗡️", power: 22 },
        { id: "q12", name: "Индийски поход", duration: 9, cost: 1000, danger: 60, reward: "Индийска Скулптура", icon: "🐘", gold: 45 },
        { id: "q13", name: "Скандинавски фьордове", duration: 6, cost: 650, danger: 40, reward: "Рунически Амулет", icon: "🗿", power: 28 },
        { id: "q14", name: "Британски експедиционен корпус", duration: 8, cost: 800, danger: 50, reward: "Келтски Нагръдник", icon: "🔱", power: 32 },
        { id: "q15", name: "Пътят на тамяна", duration: 4, cost: 400, danger: 25, reward: "Флакон с Тамян", icon: "🧪", gold: 25 },
        { id: "q16", name: "Картагенски руини", duration: 6, cost: 500, danger: 35, reward: "Финикийски Медальон", icon: "🏅", gold: 20 },
        { id: "q17", name: "Хиспански мини", duration: 5, cost: 600, danger: 30, reward: "Легендарен Меч от Толедо", icon: "⚔️", power: 35 },
        { id: "q18", name: "Галски гори", duration: 4, cost: 350, danger: 20, reward: "Друидски Жезъл", icon: "🪄", power: 18 },
        { id: "q19", name: "Месопотамски разкопки", duration: 7, cost: 750, danger: 45, reward: "Вавилонски Свитък", icon: "📜", gold: 30 },
        { id: "q20", name: "Оракулът на Делфи", duration: 3, cost: 300, danger: 15, reward: "Пророческа Златна Чаша", icon: "🏆", gold: 25 },
        { id: "q21", name: "Империята на инките", duration: 10, cost: 1200, danger: 65, reward: "Слънчев Диск", icon: "☀️", gold: 50 },
        { id: "q22", name: "Земите на маите", duration: 9, cost: 1100, danger: 60, reward: "Нефритова Маска", icon: "🎭", power: 40 },
        { id: "q23", name: "Мистичната Атлантида", duration: 12, cost: 1500, danger: 75, reward: "Орихалково Острие", icon: "🔱", power: 55 },
        { id: "q24", name: "Кралство Аксум", duration: 7, cost: 750, danger: 40, reward: "Свещен Рог", icon: "📯", power: 25 },
        { id: "q25", name: "Китайската Империя", duration: 11, cost: 1350, danger: 55, reward: "Императорски Нефрит", icon: "🏮", gold: 50 },
        { id: "q26", name: "Разкопките на Белей", duration: 2, cost: 150, danger: 5, reward: "Бронзова Свещена Амфора", icon: "🏺", power: 20, gold: 20 }
    ];
};

/**
 * ОТВАРЯНЕ НА ЕКРАНА ЗА ЕКСПЕДИЦИИ С МОДИФИКАТОРИ В РЕАЛНО ВРЕМЕ
 */
window.openExpeditionsMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    if (window.legendaryQuests.length === 0) window.initLegendaryQuests();

    const hero = window.currentHero;
    if (!hero) return;

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let skills = hero.skills || {};

    // Изчисляване на пасивни бонуси от Diablo дървото
    let costReduction = (skills.economy || 0) * 0.10; // -10% такса на ниво
    let dangerReduction = (skills.mysticism || 0) * 0.15; // -15% опасност на ниво

    let html = `
        <section class="rpg-section animate-fade" style="background: rgba(10,10,10,0.9); border: 1px solid #d4af37; padding: 20px; border-radius: 8px;">
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; text-align: center; text-transform: uppercase; margin-top: 0;">Великите Експедиции на Света</h2>
            <p style="text-align: center; font-size: 11px; color: #aaa; margin-bottom: 20px;">
                Изпратете Кан <strong>${hero.name}</strong> на далечен поход за злато и древни родови артефакти. 
                <br><span style="color: #00ffcc;">Вашият Мистицизъм намалява опасността с ${Math.floor(dangerReduction * 100)}%!</span>
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
    `;

    window.legendaryQuests.forEach(quest => {
        // Прилагане на родовите модификатори
        let finalCost = Math.max(20, Math.floor(quest.cost * (1 - costReduction)));
        let finalDanger = Math.max(2, Math.floor(quest.danger * (1 - dangerReduction)));

        // Проверка дали тази мисия в момента е активна
        let isActive = window.activeExpeditions.some(e => e.id === quest.id && e.heroName === hero.name);

        html += `
            <div style="background: rgba(0,0,0,0.4); border: 1px solid ${isActive ? '#00ffcc' : '#222'}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <strong style="color: #ffd700; font-size: 13px;">${quest.icon} ${quest.name}</strong>
                        <span style="font-size: 10px; background: rgba(214, 175, 55, 0.1); color: #d4af37; padding: 2px 6px; border-radius: 4px;">⌛ ${quest.duration} сез.</span>
                    </div>
                    <div style="font-size: 11px; color: #bbb; margin-bottom: 8px;">
                        💰 Разход: <span style="color:#fff;">${finalCost} зл.</span> | 💀 Риск: <span style="color:${finalDanger > 40 ? '#ff3366' : '#ffcc00'};">${finalDanger}%</span>
                    </div>
                    <div style="font-size: 10px; color: #888; font-style: italic;">🎁 Награда: ${quest.reward}</div>
                </div>
                <div style="margin-top: 10px;">
        `;

        if (isActive) {
            let currentMission = window.activeExpeditions.find(e => e.id === quest.id && e.heroName === hero.name);
            html += `<button class="action-btn" style="width: 100%; background: #222; color: #00ffcc; border-color: #00ffcc; cursor: default;" disabled>⌛ ПЪТУВА (Остават ${currentMission.turnsLeft} сезона)</button>`;
        } else {
            html += `<button class="action-btn" style="width: 100%; padding: 8px; font-size: 11px;" onclick="window.startQuest('${quest.id}', ${finalCost}, ${finalDanger})">⚔️ ИЗПРАТИ ВЛАДЕТЕЛ</button>`;
        }

        html += `
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <button class="menu-btn" onclick="window.openRegionsMap()" style="width: 100%; margin-top: 15px;">Върни се към Картата</button>
        </section>
    `;

    mainArea.innerHTML = html;
};

/**
 * СТАРТИРАНЕ НА ЕКСПЕДИЦИЯТА
 */
window.startQuest = function(questId, finalCost, finalDanger) {
    const hero = window.currentHero;
    if (!hero) return;

    if ((hero.gold || 0) < finalCost) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно родово злато за финансиране на този поход!");
        return;
    }

    let quest = window.legendaryQuests.find(q => q.id === questId);
    if (!quest) return;

    // Плащане на сумата
    hero.gold -= finalCost;

    // Добавяне в списъка на активните мисии
    window.activeExpeditions.push({
        id: quest.id,
        name: quest.name,
        heroName: hero.name,
        dynasty: hero.dynasty,
        turnsLeft: quest.duration,
        danger: finalDanger,
        rewardName: quest.reward,
        rewardIcon: quest.icon,
        powerBonus: quest.power || 0,
        goldBonus: quest.gold || 0
    });

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🦅 ПОХОД: Кан ${hero.name} оглави експедицията \"${quest.name}\". Походът ще трае ${quest.duration} сезона.`);
    }

    // Синхронизация и опресняване на екраните
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    window.openExpeditionsMenu();
    window.updateExpeditionBadges();
};

/**
 * АВТОМАТИЧНО ОБРАБОТВАНЕ НА ЕКСПЕДИЦИИТЕ НА ВСЕКИ ХОД (Вика се единствено от logic.js)
 */
window.processExpeditionsTurn = function() {
    if (!window.activeExpeditions || window.activeExpeditions.length === 0) return;

    let finished = [];
    
    // Напредване на времето за всяка мисия
    window.activeExpeditions.forEach(exp => {
        exp.turnsLeft--;
        if (exp.turnsLeft <= 0) {
            finished.push(exp);
        }
    });

    // Премахване на завършените от активния списък
    window.activeExpeditions = window.activeExpeditions.filter(exp => exp.turnsLeft > 0);

    // Обработка на резултатите от завършените походи
    finished.forEach(exp => {
        // Намираме лидера в играта (за да подсигурим синхронизацията)
        let hero = window.currentHero;
        if (window.unlockedLeaders) {
            let ulArray = Array.isArray(window.unlockedLeaders) ? window.unlockedLeaders : Object.values(window.unlockedLeaders);
            let found = ulArray.find(l => l.name === exp.heroName);
            if (found) hero = found;
        }

        // Проверка за провал според финалния риск
        let roll = Math.floor(Math.random() * 100);
        if (roll < exp.danger) {
            // Провал - войската понася щети
            let loss = Math.floor((hero.currentArmy || 100) * 0.25);
            hero.currentArmy = Math.max(0, (hero.currentArmy || 0) - loss);
            hero.armySize = hero.currentArmy;

            window.showMysticModal(
                "📉 Засада по време на Експедиция",
                `Походът за \"${exp.name}\" беше нападнат от местни разбойници. Кан ${exp.heroName} се завърна жив, но загуби ${loss} верни бойци в боя.`,
                "expeditions"
            );
        } else {
            // УСПЕХ: Създаване на динамичен обект на реликвата за инвентара
            if (!hero.inventory) hero.inventory = [];

            let uniqueItemId = "item_" + exp.id + "_" + Date.now();
            let newArtifact = {
                id: uniqueItemId,
                name: exp.rewardName,
                icon: exp.rewardIcon,
                bonus: {
                    heroPower: exp.powerBonus > 0 ? exp.powerBonus : 0,
                    goldBonus: exp.goldBonus > 0 ? exp.goldBonus : 0
                },
                clan: exp.dynasty
            };

            // Добавяне в личната съкровищница
            hero.inventory.push(newArtifact);

            // Начисляване на допълнителен опит на героя за успешната кампания
            if (hero.gainXP) {
                hero.gainXP(50);
            } else {
                hero.xp = (hero.xp || 0) + 50;
            }

            window.showMysticModal(
                "🏆 Великият Триумф приключи",
                `Свещеният поход донесе слава! Кан ${exp.heroName} успешно завърши експедицията \"${exp.name}\" и донесе в съкровищницата: **${exp.rewardIcon} ${exp.rewardName}** (+50 XP).`,
                "triumph"
            );
        }

        // Синхронизация на променения владетел с глобалната база на неговия род
        if (window.worldData && window.worldData.clans && window.worldData.clans[exp.dynasty]) {
            let clanData = window.worldData.clans[exp.dynasty];
            clanData.currentArmy = hero.currentArmy;
            clanData.armySize = hero.currentArmy;
            clanData.inventory = hero.inventory;
        }
    });

    // Опресняване на интерфейса
    if (window.currentHero && window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    window.updateExpeditionBadges();
};

/**
 * ОБНОВЯВАНЕ НА БАДЖОВЕТЕ ЗА АКТИВНИ МИСИИ НА ЕКРАНА
 */
window.updateExpeditionBadges = function() {
    const count = window.activeExpeditions.length;
    
    const mainBadge = document.getElementById('expeditions-badge');
    if (mainBadge) {
        mainBadge.innerText = count;
        mainBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    const mobileBadge = document.getElementById('expeditions-badge-mobile');
    if (mobileBadge) {
        mobileBadge.innerText = count;
        mobileBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
};
