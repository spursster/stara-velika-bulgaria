/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА И ИНВЕНТАРНА СИСТЕМА - Велика България
 * СТАТУС: ФИНАЛНО СИНХРОНИЗИРАН (Поправени нива, z-index на инвентара и advanceTurn мост)
 * Вградена хардкор цена от 20 000 злато за нов фентъзи водач.
 * Статистика на файловете в проекта: 16
 */

window.activeExpeditions = window.activeExpeditions || [];
window.legendaryQuests = window.legendaryQuests || [];
window.mightyLeaders = window.mightyLeaders || [];

// Автоматичен мост за Следващ ход (Поправка за ред 127 в index.html)
window.advanceTurn = function() {
    if (typeof window.nextTurn === 'function') {
        window.nextTurn();
    } else {
        console.log("Връзката към window.nextTurn() в logic.js още не е готова.");
    }
};

// Променлива за следене на отключените водачи в палатата
window.unlockedLeadersCount = window.unlockedLeadersCount || 1;

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
            padding: 20px; color: white; border-radius: 10px; text-align: center;
            box-shadow: 0 0 25px rgba(0,0,0,0.8); z-index: 210000; font-family: sans-serif;
        `;
        fallbackModal.innerHTML = `
            <h3 style="color:${currentBorder}; margin-top:0;">${title}</h3>
            <p style="font-size:14px; line-height:1.5;">${content}</p>
            <button onclick="this.parentElement.remove()" style="background:${currentBorder}; border:none; padding:8px 20px; color:black; font-weight:bold; cursor:pointer; border-radius:5px; margin-top:10px;">Да бъде!</button>
        `;
        document.body.appendChild(fallbackModal);
    };
}

// СПИСЪК С ВЕЛИКИТЕ МИСИИ НА СВЕТА
window.legendaryQuests = [
    { id: 1, title: "Поход до делтата на Дунав", duration: 3, risk: 10, goldReward: 800, xpReward: 150, desc: "Разузнаване на търговските пътища отвъд реката." },
    { id: 2, title: "Експедиция в Карпатските планини", duration: 5, risk: 25, goldReward: 2200, xpReward: 400, desc: "Търсене на ценни залежи и тайни древни крепости." },
    { id: 3, title: "Дипломатическа мисия в Кавказ", duration: 8, risk: 15, goldReward: 4500, xpReward: 750, desc: "Преговори с далечни родове за вечен съюз и търговия." },
    { id: 4, title: "Обсада на разбунтувана Черноморска твърдина", duration: 6, risk: 40, goldReward: 3800, xpReward: 600, desc: "Потискане на местни размирици със силата на меча." },
    { id: 5, title: "Тайни разкопки край Мадара", duration: 4, risk: 5, goldReward: 1200, xpReward: 300, desc: "Търсене на древни реликви и свещени знаци." }
];

/**
 * ФУНКЦИЯ ЗА ЗАКУПУВАНЕ / ОТКЛЮЧВАНЕ НА СЛУЧАЕН НОВ ВЛАДЕТЕЛ
 */
window.buyNewExpeditionLeader = function() {
    let currentCost = 20000 * window.unlockedLeadersCount;

    if (!window.currentHero || window.currentHero.gold < currentCost) {
        window.showMysticModal("❌ Недостиг на Злато!", `Имаш нужда от <b>${currentCost} 💰</b>, за да призовеш и отключиш нов владетел в Палатата на експедициите.`, "expedition");
        return;
    }

    if (!window.bulgarianDynasties) return;
    const dynastiesKeys = Object.keys(window.bulgarianDynasties);
    const randomDynasty = dynastiesKeys[Math.floor(Math.random() * dynastiesKeys.length)];
    const rulersList = window.bulgarianDynasties[randomDynasty] ? window.bulgarianDynasties[randomDynasty].rulers : [];
    
    if (!rulersList || rulersList.length === 0) return;
    const randomRulerName = rulersList[Math.floor(Math.random() * rulersList.length)];

    let exists = window.mightyLeaders.some(l => l.name === randomRulerName) || (window.currentHero && window.currentHero.name === randomRulerName);
    if (exists) {
        window.buyNewExpeditionLeader();
        return;
    }

    window.currentHero.gold -= currentCost;
    window.unlockedLeadersCount++;

    let newLeader = {
        name: randomRulerName,
        dynasty: randomDynasty,
        level: 1,
        xp: 0,
        heroPower: 120
    };

    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(newLeader);
    }

    window.mightyLeaders.push(newLeader);

    window.showMysticModal(
        "📜 Нов Владетел е Отключен!",
        `Към Палатата се присъединява великият <b>${newLeader.name}</b> от род <span style='color:#ffd700;'>${newLeader.dynasty}</span>!`,
        "triumph"
    );

    window.openExpeditionCenter();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

/**
 * ОТВАРЯНЕ НА ЕКСПЕДИЦИОННИЯ ЦЕНТЪР (UI)
 */
window.openExpeditionCenter = function() {
    let old = document.getElementById('expedition-modal');
    if (old) old.remove();

    let allAvailableLeaders = [];
    if (window.mightyLeaders) allAvailableLeaders = [...window.mightyLeaders];
    
    if (window.currentHero && window.currentHero.name) {
        let isCurrentHeroInList = allAvailableLeaders.some(l => l.name === window.currentHero.name);
        if (!isCurrentHeroInList) {
            allAvailableLeaders.unshift(window.currentHero);
        }
    }

    let modal = document.createElement('div');
    modal.id = 'expedition-modal';
    modal.style.cssText = `
        position: fixed; top: 5%; left: 5%; width: 90%; height: 90%;
        background: rgba(20, 20, 20, 0.98); border: 3px solid #ffd700;
        border-radius: 12px; padding: 25px; color: white; z-index: 199999;
        overflow-y: auto; font-family: 'Georgia', serif; box-shadow: 0 0 40px rgba(0,0,0,0.9);
    `;

    let currentUnlockCost = 20000 * window.unlockedLeadersCount;

    let html = `
        <div style="display:flex; justify-content:space-between; border-bottom:2px solid #333; padding-bottom:15px; margin-bottom:20px;">
            <h2 style="margin:0; color:#ffd700; font-size:24px;">🌍 ПАЛАТА НА ЕКСПЕДИЦИИТЕ</h2>
            <div>
                <button onclick="window.buyNewExpeditionLeader()" style="background:linear-gradient(135deg, #11998e, #38ef7d); border:1px solid #ffd700; padding:10px 18px; color:white; font-weight:bold; cursor:pointer; border-radius:6px; margin-right:15px; font-size:13px;">📜 Отключи нов Владетел (Цена: ${currentUnlockCost} 💰)</button>
                <button onclick="document.getElementById('expedition-modal').remove()" style="background:#e94057; border:none; padding:10px 20px; color:white; font-weight:bold; cursor:pointer; border-radius:6px;">Затвори</button>
            </div>
        </div>

        <div style="display:block; margin-bottom:30px;">
            <h3 style="color:#e94057; margin-bottom:10px; font-size:16px;">👤 НАЛИЧНИ ВЛАДЕТЕЛИ ЗА МИСИИ (${allAvailableLeaders.length}):</h3>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:15px;">
    `;

    allAvailableLeaders.forEach(leader => {
        let status = "В Палатата (Свободен)";
        let isAssigned = window.activeExpeditions.some(e => e.leaderName === leader.name);
        if (isAssigned) status = "<span style='color:#e94057;'>На мисия в момента</span>";
        if (window.currentHero && leader.name === window.currentHero.name) status = "<span style='color:#ffd700;'>👑 Текущ Върховен Лидер</span>";

        html += `
            <div style="background:#222; border:1px solid #444; border-radius:6px; padding:15px; position:relative;">
                <b style="font-size:16px; color:#fff;">${leader.name}</b><br>
                <span style="font-size:12px; color:#aaa;">Род: ${leader.dynasty}</span><br>
                <span style="font-size:12px; color:#ffd700;">RPG Ниво: ${leader.level || 1}</span><br>
                <span style="font-size:12px; color:#4caf50;">Сила: ${leader.heroPower || 120}</span><br>
                <div style="margin-top:8px; font-size:11px; border-top:1px solid #333; padding-top:6px; color:#ddd;">Статус: ${status}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <h3 style="color:#38ef7d; font-size:16px; margin-bottom:15px;">📜 ДОСТЪПНИ ВЕЛИКИ МИСИИ:</h3>
        <div style="display:block;">
    `;

    window.legendaryQuests.forEach(quest => {
        let isRunning = window.activeExpeditions.some(e => e.questId === quest.id);
        
        html += `
            <div style="background:#1a1a1a; border:1px solid #333; border-radius:8px; padding:20px; margin-bottom:15px; display:block;">
                <div style="font-size:18px; color:#ffd700; font-weight:bold; margin-bottom:5px;">${quest.title}</div>
                <p style="margin:0 0 10px 0; color:#ccc; font-size:13px; font-style:italic;">${quest.desc}</p>
                <div style="font-size:12px; color:#aaa; margin-bottom:12px;">
                    ⏳ Времетраене: <b>${quest.duration} хода</b> | ⚠️ Риск: <b style="color:#e94057;">${quest.risk}%</b> | 💰 Награда: <b style="color:#4caf50;">${quest.goldReward} злато</b> | ⭐ Опит: <b>+${quest.xpReward} XP</b>
                </div>
        `;

        if (isRunning) {
            let currentExp = window.activeExpeditions.find(e => e.questId === quest.id);
            let turnsLeft = currentExp.duration - currentExp.currentProgress;
            html += `<button disabled style="background:#444; color:#888; border:none; padding:10px 15px; border-radius:4px; font-weight:bold;">Изпълнява се (Остават ${turnsLeft}х)</button>`;
        } else {
            html += `
                <div style="margin-top:10px;">
                    <label style="font-size:12px; color:#fff; margin-right:10px;">Избери Владетел:</label>
                    <select id="select-leader-${quest.id}" style="background:#222; color:white; border:1px solid #555; padding:6px; border-radius:4px; font-size:12px; margin-right:15px;">
            `;
            
            allAvailableLeaders.forEach(leader => {
                let isAssigned = window.activeExpeditions.some(e => e.leaderName === leader.name);
                if (!isAssigned) {
                    html += `<option value="${leader.name}">${leader.name}</option>`;
                }
            });

            html += `
                    </select>
                    <button onclick="window.startQuest(${quest.id})" style="background:#38ef7d; color:black; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:12px;">Изпрати на мисия</button>
                </div>
            `;
        }

        html += `</div>`;
    });

    html += `</div>`;
    modal.innerHTML = html;
    document.body.appendChild(modal);
};

/**
 * СТАРТИРАНЕ НА КОНКРЕТНА МИСИЯ
 */
window.startQuest = function(questId) {
    let select = document.getElementById(`select-leader-${questId}`);
    if (!select || !select.value) {
        window.showMysticModal("⚠️ Няма свободен лидер", "Всички твои отключени владетели са заети на мисии в момента!", "expedition");
        return;
    }

    let leaderName = select.value;
    let quest = window.legendaryQuests.find(q => q.id === questId);

    window.activeExpeditions.push({
        questId: quest.id,
        title: quest.title,
        duration: quest.duration,
        currentProgress: 0,
        risk: quest.risk,
        goldReward: quest.goldReward,
        xpReward: quest.xpReward,
        leaderName: leaderName
    });

    window.showMysticModal("🌍 Експедицията потегли!", `Владетелят <b>${leaderName}</b> оглави похода: "<b>${quest.title}</b>" за следващите ${quest.duration} хода!`, "expedition");
    window.openExpeditionCenter();
    if (window.renderExpeditionButton) window.renderExpeditionButton();
};

/**
 * АВТОНОМЕН НАПРЕДЪК НА ЕКСПЕДИЦИИТЕ
 */
window.updateExpeditionSystem = function() {
    if (!window.activeExpeditions || window.activeExpeditions.length === 0) return;

    for (let i = window.activeExpeditions.length - 1; i >= 0; i--) {
        let exp = window.activeExpeditions[i];
        exp.currentProgress += 1;

        if (exp.currentProgress >= exp.duration) {
            let roll = Math.random() * 100;
            let targetLeader = (window.currentHero && window.currentHero.name === exp.leaderName) ? window.currentHero : window.mightyLeaders.find(l => l.name === exp.leaderName);

            if (!targetLeader) {
                window.activeExpeditions.splice(i, 1);
                continue;
            }

            if (roll < exp.risk) {
                let lostTroops = Math.floor(Math.random() * 80) + 20;
                if (window.currentHero) window.currentHero.armySize = Math.max(0, window.currentHero.armySize - lostTroops);

                window.showMysticModal(
                    "⚠️ Провал на Експедицията!",
                    `Походът "<b>${exp.title}</b>", воден от <b>${exp.leaderName}</b>, попадна в засада! Владетелят оцеля благодарение на безсмъртието си, но държавата изгуби <b>${lostTroops} бойци</b>!`,
                    "expedition"
                );
            } else {
                if (window.currentHero) window.currentHero.gold += exp.goldReward;
                
                if (window.gainExperience) {
                    window.gainExperience(targetLeader, exp.xpReward);
                } else {
                    targetLeader.xp = (targetLeader.xp || 0) + exp.xpReward;
                }

                window.showMysticModal(
                    "🎉 ТРИУМФАЛНО ЗАВРЪЩАНЕ!",
                    `Владетелят <b>${exp.leaderName}</b> се завърна успешно от "<b>${exp.title}</b>"!<br>Спечелени: <span style='color:#4caf50;'>+${exp.goldReward} злато</span> за съкровищницата и <span style='color:#ffd700;'>+${exp.xpReward} опит (XP)</span> за личния му прогрес!`,
                    "triumph"
                );
            }

            window.activeExpeditions.splice(i, 1);
        }
    }

    if (window.renderExpeditionButton) window.renderExpeditionButton();
};

/* ==========================================================================
   ⚠️ ВЪЗСТАНОВЕН БЛОК: СИСТЕМА ЗА ПРЕДМЕТИ, АРТЕФАКТИ И МАГАЗИН (УСИЛЕН Z-INDEX)
   ========================================================================== */

window.equippedItems = window.equippedItems || [];
window.playerInventory = window.playerInventory || [];

window.availableMerchantItems = [
    { id: 1, name: "Меч на Кубрат", type: "weapon", price: 3000, bonus: { powerBonus: 30 }, desc: "+30 Лична Бойна Мощ" },
    { id: 2, name: "Корона на Първото Царство", type: "helmet", price: 5000, bonus: { goldBonus: 15 }, desc: "+15% Приход на злато от региони" },
    { id: 3, name: "Щит на Омуртаг", type: "shield", price: 2500, bonus: { powerBonus: 15, defenseBonus: 10 }, desc: "+15 Сила, +10 Защитна мощ" },
    { id: 4, name: "Копие на Тракийския конник", type: "weapon", price: 4000, bonus: { powerBonus: 25 }, desc: "+25 Лична Бойна Мощ" },
    { id: 5, name: "Пръстен на Тервел", type: "ring", price: 6000, bonus: { goldBonus: 20 }, desc: "+20% Приход на злато" }
];

window.openInventory = function() {
    let old = document.getElementById('inventory-modal');
    if (old) old.remove();

    let inventoryModal = document.createElement('div');
    inventoryModal.id = 'inventory-modal';
    inventoryModal.style.cssText = `
        position: fixed; top: 10%; left: 10%; width: 80%; height: 80%;
        background: rgba(15,15,15,0.98); border: 2px solid #ffd700; color: white;
        padding: 20px; z-index: 250000; overflow-y: auto; font-family: 'Georgia', serif;
        border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.9);
    `;

    let equippedHtml = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px; margin-bottom:20px;">`;
    if (window.equippedItems.length === 0) {
        equippedHtml += `<p style="color:#aaa; font-style:italic;">Няма екипирани артефакти.</p>`;
    } else {
        window.equippedItems.forEach((item, index) => {
            equippedHtml += `
                <div style="background:#222; border:1px solid #ffd700; padding:10px; border-radius:4px;">
                    <b style="color:#ffd700;">${item.name}</b> (${item.type})<br>
                    <small>${item.desc}</small><br>
                    <button onclick="window.unequipItem(${index})" style="background:#e94057; border:none; padding:4px 8px; color:white; margin-top:5px; cursor:pointer; font-size:11px; border-radius:3px;">Свали</button>
                </div>
            `;
        });
    }
    equippedHtml += `</div>`;

    let inventoryHtml = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">`;
    if (window.playerInventory.length === 0) {
        inventoryHtml += `<p style="color:#aaa; font-style:italic;">Саквояжът е празен.</p>`;
    } else {
        window.playerInventory.forEach((item, index) => {
            inventoryHtml += `
                <div style="background:#1a1a1a; border:1px solid #444; padding:10px; border-radius:4px;">
                    <b>${item.name}</b> (${item.type})<br>
                    <small>${item.desc}</small><br>
                    <button onclick="window.equipItem(${index})" style="background:#38ef7d; border:none; padding:4px 8px; color:black; font-weight:bold; margin-top:5px; cursor:pointer; font-size:11px; border-radius:3px;">Екипирай</button>
                </div>
            `;
        });
    }
    inventoryHtml += `</div>`;

    inventoryModal.innerHTML = `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:15px;">
            <h2 style="margin:0; color:#ffd700;">🛡️ КРАЛСКА СЪКРОВИЩНИЦА И ИНВЕНТАР</h2>
            <button onclick="document.getElementById('inventory-modal').remove()" style="background:#e94057; border:none; color:white; padding:5px 15px; font-weight:bold; cursor:pointer; border-radius:4px;">Затвори</button>
        </div>
        <h3 style="color:#ffd700; margin-bottom:10px;">⚔️ Екипирани Реликви:</h3>
        ${equippedHtml}
        <h3 style="color:#38ef7d; margin-bottom:10px;">🎒 Предмети в Складището:</h3>
        ${inventoryHtml}
    `;
    document.body.appendChild(inventoryModal);
};

window.equipItem = function(index) {
    let item = window.playerInventory[index];
    let alreadyEquippedSameType = window.equippedItems.some(i => i.type === item.type);
    if (alreadyEquippedSameType) {
        window.showMysticModal("⚠️ Слотът е зает", `Вече имаш екипиран предмет от тип "${item.type}".`, "expedition");
        return;
    }
    window.playerInventory.splice(index, 1);
    window.equippedItems.push(item);
    if (window.currentHero && item.bonus.powerBonus) {
        window.currentHero.heroPower += item.bonus.powerBonus;
    }
    window.openInventory();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.unequipItem = function(index) {
    let item = window.equippedItems[index];
    window.equippedItems.splice(index, 1);
    window.playerInventory.push(item);
    if (window.currentHero && item.bonus.powerBonus) {
        window.currentHero.heroPower = Math.max(0, window.currentHero.heroPower - item.bonus.powerBonus);
    }
    window.openInventory();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.openMerchantShop = function() {
    let old = document.getElementById('merchant-modal');
    if (old) old.remove();

    let shopModal = document.createElement('div');
    shopModal.id = 'merchant-modal';
    shopModal.style.cssText = `
        position: fixed; top: 10%; left: 15%; width: 70%; height: 70%;
        background: rgba(20,15,10,0.98); border: 2px solid #38ef7d; color: white;
        padding: 20px; z-index: 250000; overflow-y: auto; font-family: 'Georgia', serif;
        border-radius: 8px; box-shadow: 0 0 35px rgba(0,0,0,0.9);
    `;

    let shopHtml = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:15px;">`;
    window.availableMerchantItems.forEach(item => {
        shopHtml += `
            <div style="background:#221a15; border:1px solid #664d3b; padding:15px; border-radius:5px;">
                <b style="color:#38ef7d; font-size:15px;">${item.name}</b><br>
                <small style="color:#ccc;">Тип: ${item.type}</small><br>
                <p style="margin:5px 0; font-size:12px; min-height:30px;">${item.desc}</p>
                <div style="margin-top:10px; font-weight:bold; color:#ffd700;">Цена: ${item.price} 💰</div>
                <button onclick="window.buyMerchantItem(${item.id})" style="background:#38ef7d; color:black; border:none; padding:6px 12px; font-weight:bold; margin-top:8px; cursor:pointer; border-radius:4px; width:100%;">Закупи</button>
            </div>
        `;
    });
    shopHtml += `</div>`;

    shopModal.innerHTML = `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #664d3b; padding-bottom:10px; margin-bottom:15px;">
            <h2 style="margin:0; color:#38ef7d;">📜 ПЪТУВАЩ ТЪРГОВЕЦ НА РЕЛИКВИ</h2>
            <button onclick="document.getElementById('merchant-modal').remove()" style="background:#e94057; border:none; color:white; padding:5px 15px; font-weight:bold; cursor:pointer; border-radius:4px;">Затвори</button>
        </div>
        ${shopHtml}
    `;
    document.body.appendChild(shopModal);
};

window.buyMerchantItem = function(id) {
    let item = window.availableMerchantItems.find(i => i.id === id);
    if (!item) return;

    if (!window.currentHero || window.currentHero.gold < item.price) {
        window.showMysticModal("❌ Нямаш злато!", "Търговецът не прави вересии.", "expedition");
        return;
    }

    window.currentHero.gold -= item.price;
    window.playerInventory.push(JSON.parse(JSON.stringify(item)));
    window.showMysticModal("🎉 Успешна покупка!", `Закупи ${item.name}! Предметът е в Складището.`, "triumph");
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    window.openMerchantShop();
};

/**
 * РЕНДЕРИРАНЕ НА БУТОНА НА ЕКРАНА
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

    if (window.activeExpeditions && window.activeExpeditions.length > 0) {
        let shortStatus = window.activeExpeditions.map(e => {
            let left = e.duration - e.currentProgress;
            return `• ${e.title.substring(0,10)}... (${left <= 0 ? 'Готова' : left + 'х'})`;
        }).join(' | ');
        btn.innerHTML = `🌍 Мисии (${window.activeExpeditions.length}) | <span style="font-size:11px; color:#ffd700;">${shortStatus}</span>`;
    } else {
        btn.innerHTML = `🌍 Палата на Експедициите`;
    }
};

// Зареждане
if (document.readyState === 'complete') {
    window.renderExpeditionButton();
} else {
    window.addEventListener('load', () => { window.renderExpeditionButton(); });
}
