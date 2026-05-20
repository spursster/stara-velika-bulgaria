// ======================== АРМИЯ ПАЗАР + 30 ФЕНТЪЗИ ЕДИНИЦИ (АДАПТИВЕН) ========================
(function() {
    // --- 1. Проверка и синхронизация с worldData ---
    if (!window.worldData || !window.worldData.clans) {
        console.error("❌ worldData не е зареден! Увери се, че world_data.js се зарежда преди armyMarket.js");
        return;
    }

    let currentClanId = window.playerClan || "Дуло";
    const clan = window.worldData.clans[currentClanId];
    if (!clan) {
        console.error(`❌ Клан ${currentClanId} не съществува в worldData!`);
        return;
    }

    // --- 2. Дефиниране на всички типове войници (основни + 30 фентъзи) ---
    const basicTroops = [
        { id: "infantry", name: "Пехотинец", basePrice: 10, attack: 8, defense: 12, icon: "⚔️", desc: "Основна пехота – добра защита", special: null },
        { id: "archers", name: "Стрелец", basePrice: 15, attack: 15, defense: 6, icon: "🏹", desc: "Далекобойни стрелци", special: null },
        { id: "cavalry", name: "Конник", basePrice: 30, attack: 25, defense: 18, icon: "🐎", desc: "Бързи атакуващи части", special: null },
        { id: "elite", name: "Елитен войн", basePrice: 70, attack: 45, defense: 40, icon: "🛡️", desc: "Най-добрите бойци", special: null }
    ];

    const fantasyTroops = [
        { id: "vampire", name: "Вампир", basePrice: 120, attack: 35, defense: 25, icon: "🧛", desc: "Кръвопиец – лекува 20% от нанесените щети", special: "lifeSteal:0.2" },
        { id: "werewolf", name: "Върколак", basePrice: 100, attack: 40, defense: 20, icon: "🐺", desc: "Луда свирепост – +15% атака през нощта", special: "nightFury:0.15" },
        { id: "highelf", name: "Висш елф", basePrice: 90, attack: 30, defense: 15, icon: "🧝", desc: "Точност – +25% критичен удар", special: "critChance:0.25" },
        { id: "troll", name: "Планински трол", basePrice: 150, attack: 50, defense: 40, icon: "🧌", desc: "Каменна кожа – -30% получени щети", special: "damageReduction:0.3" },
        { id: "dragon_young", name: "Млад дракон", basePrice: 300, attack: 70, defense: 45, icon: "🐉", desc: "Огнено дихание – поразява 3 врага", special: "splashDamage:3" },
        { id: "wizard", name: "Магьосник", basePrice: 80, attack: 20, defense: 10, icon: "🧙", desc: "Магическа експлозия – +50% срещу неживи", special: "undeadBonus:0.5" },
        { id: "lich", name: "Лич", basePrice: 250, attack: 55, defense: 50, icon: "💀", desc: "Страх – враговете могат да побегнат", special: "fearChance:0.2" },
        { id: "fairy_healer", name: "Фея-изцелителка", basePrice: 60, attack: 5, defense: 40, icon: "🧚", desc: "Лечебна светлина – възстановява 10 живот/рунд", special: "healAllies:10" },
        { id: "bear_ancient", name: "Мъдър мечок", basePrice: 70, attack: 35, defense: 35, icon: "🐻", desc: "Звярска прегръдка – зашеметява за 1 рунд", special: "stunChance:0.3" },
        { id: "harpy", name: "Харпия", basePrice: 65, attack: 25, defense: 20, icon: "🦅", desc: "Пикиране – първи удар +50% щети", special: "firstStrikeBonus:0.5" },
        { id: "mermaid", name: "Русалка", basePrice: 80, attack: 20, defense: 30, icon: "🧜", desc: "Песен на сирена – омайва врага за 2 рунда", special: "charmChance:0.25" },
        { id: "genie", name: "Джин", basePrice: 180, attack: 45, defense: 35, icon: "🧞", desc: "Изпълнява желания – +1 допълнително действие", special: "extraAction:1" },
        { id: "vampire_queen", name: "Вампирска кралица", basePrice: 200, attack: 50, defense: 40, icon: "🧛‍♀️", desc: "Превръща паднали врагове във вампири", special: "convertOnKill:vampire" },
        { id: "ice_dragon", name: "Леден дракон", basePrice: 320, attack: 75, defense: 50, icon: "🐉", desc: "Ледено дъх – забавя враговете", special: "slowEffect:0.5" },
        { id: "ogre_mage", name: "Огър-магьосник", basePrice: 140, attack: 45, defense: 35, icon: "🧌", desc: "Елементална магия – сменя тип щети", special: "elementalShift:true" },
        { id: "dark_elf", name: "Тъмен елф", basePrice: 110, attack: 40, defense: 20, icon: "🧝", desc: "Отрова – 10 допълнителни щети за 3 рунда", special: "poisonDamage:10" },
        { id: "alpha_werewolf", name: "Върколак-алфа", basePrice: 160, attack: 55, defense: 35, icon: "🐺", desc: "Води глутница – +10% атака на върколаци", special: "aura:werewolf_buff" },
        { id: "stone_troll", name: "Каменен трол", basePrice: 200, attack: 60, defense: 60, icon: "🧌", desc: "Непробиваем – имунитет 1 рунд (1/битка)", special: "invincibleOnce:true" },
        { id: "archmage", name: "Архимаг", basePrice: 220, attack: 60, defense: 30, icon: "🧙", desc: "Върховна магия – каства два пъти на рунд", special: "doubleCast:true" },
        { id: "demon", name: "Демон", basePrice: 170, attack: 55, defense: 35, icon: "👹", desc: "Адски огън – подпалва земята", special: "fireGround:5" },
        { id: "ancient_vampire", name: "Древен вампир", basePrice: 280, attack: 70, defense: 50, icon: "🧛", desc: "Призовава 2 прилепа-разузнавач", special: "summonBats:2" },
        { id: "weird_witch", name: "Уиля", basePrice: 75, attack: 15, defense: 15, icon: "🧙‍♀️", desc: "Проклятие – -30% защита на врага", special: "curseDefense:0.3" },
        { id: "griffin", name: "Грифон", basePrice: 120, attack: 40, defense: 30, icon: "🦅", desc: "Въздушна атака – неуязвим за пехота", special: "immuneToInfantry:true" },
        { id: "golden_dragon", name: "Златен дракон", basePrice: 450, attack: 100, defense: 80, icon: "🐉", desc: "Златен дъх – превръща враговете в злато", special: "goldOnKill:50" },
        { id: "elf_archer", name: "Елфийски стрелец", basePrice: 85, attack: 35, defense: 15, icon: "🏹", desc: "Стрела на мълния – заобикаля бронята", special: "ignoreArmor:true" },
        { id: "swamp_troll", name: "Блатният трол", basePrice: 110, attack: 45, defense: 25, icon: "🧌", desc: "Регенерация – +5 живот/рунд", special: "regen:5" },
        { id: "necromancer", name: "Некромант", basePrice: 150, attack: 30, defense: 20, icon: "🧙", desc: "Призовава скелети всеки рунд", special: "summonSkeleton:2" },
        { id: "vampire_samurai", name: "Самурай-вампир", basePrice: 190, attack: 65, defense: 45, icon: "⚔️", desc: "Катана на кръвта – 40% критичен удар", special: "critChance:0.4" },
        { id: "bronze_dragon", name: "Бронзов дракон", basePrice: 280, attack: 65, defense: 60, icon: "🐉", desc: "Дихание на времето – връща врага в предишен рунд", special: "timeSkip:true" },
        { id: "titan", name: "Титан", basePrice: 500, attack: 120, defense: 90, icon: "👑", desc: "Гигантски скок – намалява вражеската армия с 20%", special: "armyShrink:0.2" }
    ];

    const allTroops = [...basicTroops, ...fantasyTroops];

    // --- 3. Инициализация на игрални данни (синхронизация с клана) ---
    if (typeof window.playerGold === 'undefined') window.playerGold = clan.gold;
    if (typeof window.playerArmyDetails === 'undefined') {
        window.playerArmyDetails = {};
        allTroops.forEach(t => { window.playerArmyDetails[t.id] = 0; });
        // Начална армия от базови единици (взема се от clan.armySize)
        const totalBase = clan.armySize;
        window.playerArmyDetails.infantry = Math.floor(totalBase * 0.5);
        window.playerArmyDetails.archers = Math.floor(totalBase * 0.25);
        window.playerArmyDetails.cavalry = Math.floor(totalBase * 0.15);
        window.playerArmyDetails.elite = Math.floor(totalBase * 0.1);
    }

    // Функция за синхронизиране на данните с worldData и UI на играта
    function syncWithGame() {
        clan.gold = window.playerGold;
        const newTotal = Object.values(window.playerArmyDetails).reduce((a,b) => a+b, 0);
        clan.armySize = newTotal;
        if (typeof window.updateGameUI === 'function') window.updateGameUI();
        else if (typeof window.updateUI === 'function') window.updateUI();
        // Актуализиране на горната лента, ако има елементи
        const goldSpan = document.getElementById('val-gold');
        if (goldSpan) goldSpan.innerText = window.playerGold;
        const armySpan = document.getElementById('val-army');
        if (armySpan) armySpan.innerText = newTotal;
        console.log(`🔄 Синхронизация: злато=${window.playerGold}, армия=${newTotal}`);
    }

    // --- 4. Анимация на монети ---
    function coinAnimation(x, y) {
        const coin = document.createElement('div');
        coin.className = 'coin-effect';
        coin.textContent = '💰';
        coin.style.left = (x-15)+'px';
        coin.style.top = (y-15)+'px';
        document.body.appendChild(coin);
        setTimeout(() => coin.remove(), 600);
    }

    // --- 5. Покупка и продажба ---
    function buyTroop(typeId, quantity = 1) {
        const troop = allTroops.find(t => t.id === typeId);
        if (!troop) {
            console.warn(`⚠️ Невалиден тип войник: ${typeId}`);
            return false;
        }
        const totalCost = troop.basePrice * quantity;
        if (window.playerGold < totalCost) {
            alert(`❌ Нямаш достатъчно злато! (Нужни: ${totalCost})`);
            console.warn(`❌ Опит за покупка на ${quantity} × ${troop.name} – няма злато (има ${window.playerGold})`);
            return false;
        }
        window.playerGold -= totalCost;
        window.playerArmyDetails[typeId] = (window.playerArmyDetails[typeId] || 0) + quantity;
        console.log(`✅ КУПИ: ${quantity} × ${troop.name} | -${totalCost}💰 | Оставащо злато: ${window.playerGold} | Сегашен брой: ${window.playerArmyDetails[typeId]}`);
        for (let i = 0; i < Math.min(3, quantity); i++) {
            setTimeout(() => coinAnimation(window.event?.clientX || innerWidth/2, window.event?.clientY || innerHeight/2), i*100);
        }
        updateMarketUI();
        syncWithGame();
        return true;
    }

    function sellTroop(typeId, quantity = 1) {
        const troop = allTroops.find(t => t.id === typeId);
        if (!troop) return false;
        const current = window.playerArmyDetails[typeId] || 0;
        if (current < quantity) {
            alert("Нямаш толкова войници за продажба!");
            return false;
        }
        const refund = Math.floor(troop.basePrice * 0.6 * quantity);
        window.playerGold += refund;
        window.playerArmyDetails[typeId] = current - quantity;
        console.log(`💸 ПРОДАДЕНО: ${quantity} × ${troop.name} | +${refund}💰 | Оставащо злато: ${window.playerGold}`);
        updateMarketUI();
        syncWithGame();
        return true;
    }

    // --- 6. UI функции (HTML и CSS) ---
    function createMarketHTML() {
        const basicSection = basicTroops.map(troopCard).join('');
        const fantasySection = fantasyTroops.map(troopCard).join('');
        return `
        <div id="armyMarketModal" class="market-modal" style="display: none;">
            <div class="market-content glass-panel">
                <div class="market-header">
                    <h2>🏰 Военен пазар <span class="close-market">&times;</span></h2>
                    <div class="player-resources">
                        <div class="resource-box gold">💰 Злато: <span id="playerGoldAmount">${window.playerGold}</span></div>
                        <div class="resource-box power">⚔️ Сила: <span id="totalArmyPower">0</span></div>
                        <div class="resource-box clan">🏛️ Клан: ${clan.name}</div>
                    </div>
                </div>
                <div class="market-tabs">
                    <button class="tab-btn active" data-tab="basic">⚔️ Основни войски</button>
                    <button class="tab-btn" data-tab="fantasy">✨ Фентъзи единици (30)</button>
                </div>
                <div id="basic-tab" class="troop-shop active-tab">${basicSection}</div>
                <div id="fantasy-tab" class="troop-shop" style="display:none;">${fantasySection}</div>
                <div class="market-footer">
                    <button id="closeMarketBtn" class="footer-btn">Затвори</button>
                    <button id="quickBuyMaxBtn" class="footer-btn gold">💰 Купи макс. пехота</button>
                    <button id="resetArmyBtn" class="footer-btn danger">⚠️ Демобилизация</button>
                </div>
            </div>
        </div>
        <style>
            /* ----- АДАПТИВЕН ДИЗАЙН ЗА ВСИЧКИ УСТРОЙСТВА ----- */
            .market-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                backdrop-filter: blur(10px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            .glass-panel {
                background: rgba(20,20,40,0.96);
                border-radius: 32px;
                width: 95%;
                max-width: 1400px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 20px;
                border: 1px solid rgba(255,215,0,0.5);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }
            .market-header {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #d4af37;
                padding-bottom: 12px;
                margin-bottom: 20px;
                gap: 15px;
            }
            .market-header h2 {
                font-family: 'Cinzel', serif;
                color: #ffd700;
                margin: 0;
                font-size: 1.6rem;
            }
            .player-resources {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            .resource-box {
                background: rgba(0,0,0,0.6);
                padding: 5px 12px;
                border-radius: 40px;
                font-weight: bold;
                font-size: 0.9rem;
            }
            .resource-box.gold { color: #ffd966; }
            .resource-box.power { color: #88ffaa; }
            .resource-box.clan { color: #dd88ff; }
            .close-market {
                font-size: 32px;
                cursor: pointer;
                color: #ffd700;
                transition: 0.2s;
                line-height: 1;
            }
            .close-market:hover { transform: scale(1.2); color: #ff6666; }
            .market-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid rgba(255,215,0,0.3);
                padding-bottom: 8px;
                flex-wrap: wrap;
            }
            .tab-btn {
                background: #2c2c3a;
                border: none;
                padding: 8px 20px;
                border-radius: 40px;
                color: #ffd966;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }
            .tab-btn.active {
                background: #daa520;
                color: black;
                box-shadow: 0 0 8px gold;
            }
            .troop-shop {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                max-height: 55vh;
                overflow-y: auto;
                padding: 5px;
            }
            .troop-card {
                background: rgba(0,0,0,0.65);
                border-radius: 24px;
                padding: 15px;
                transition: all 0.2s;
                border: 1px solid rgba(255,215,0,0.3);
                display: flex;
                flex-direction: column;
            }
            .troop-card:hover {
                transform: translateY(-5px);
                border-color: gold;
                box-shadow: 0 10px 20px rgba(0,0,0,0.4);
            }
            .troop-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 8px;
            }
            .troop-info h3 {
                margin: 0 0 8px 0;
                color: #ffd966;
                font-size: 1.2rem;
            }
            .troop-info p {
                font-size: 0.8rem;
                color: #ccc;
                margin: 5px 0;
            }
            .stats {
                display: flex;
                gap: 15px;
                font-size: 0.8rem;
                color: #aaa;
                margin: 8px 0;
            }
            .price {
                font-weight: bold;
                color: #ffaa44;
                margin: 8px 0;
            }
            .special {
                font-size: 0.7rem;
                color: #d4af37;
                background: rgba(0,0,0,0.4);
                display: inline-block;
                padding: 2px 8px;
                border-radius: 20px;
            }
            .troop-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 12px;
                gap: 8px;
                flex-wrap: wrap;
            }
            .buy-btn, .sell-btn {
                background: linear-gradient(135deg, #b8860b, #daa520);
                border: none;
                padding: 6px 14px;
                border-radius: 40px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: 0.2s;
            }
            .sell-btn { background: linear-gradient(135deg, #8b3a3a, #b55a5a); }
            .buy-btn:hover, .sell-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
            .owned-count {
                font-size: 0.8rem;
                background: #222;
                padding: 4px 10px;
                border-radius: 30px;
            }
            .market-footer {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255,215,0,0.3);
                flex-wrap: wrap;
            }
            .footer-btn {
                background: #2c2c3a;
                border: 1px solid #daa520;
                padding: 8px 20px;
                border-radius: 40px;
                color: #ffd966;
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s;
            }
            .footer-btn.gold { background: #daa520; color: black; }
            .footer-btn.danger { background: #5a2a2a; border-color: #ff6666; color: #ffaaaa; }
            .footer-btn:hover { transform: scale(1.03); filter: brightness(1.1); }
            .coin-effect {
                position: fixed;
                pointer-events: none;
                font-size: 26px;
                animation: coinFlip 0.6s ease-out forwards;
                z-index: 20001;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.96); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes coinFlip {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-50px) rotate(180deg); opacity: 0; }
            }
            /* Мобилни настройки */
            @media (max-width: 768px) {
                .glass-panel { padding: 12px; width: 98%; max-height: 95vh; }
                .market-header h2 { font-size: 1.2rem; }
                .resource-box { font-size: 0.7rem; padding: 3px 8px; }
                .tab-btn { padding: 4px 12px; font-size: 0.8rem; }
                .troop-shop { grid-template-columns: 1fr; gap: 12px; max-height: 60vh; }
                .troop-card { padding: 10px; }
                .troop-icon { font-size: 36px; }
                .troop-info h3 { font-size: 1rem; }
                .buy-btn, .sell-btn { padding: 4px 10px; font-size: 0.8rem; }
                .footer-btn { padding: 5px 12px; font-size: 0.8rem; }
            }
        </style>
        `;
    }

    function troopCard(troop) {
        const currentCount = window.playerArmyDetails[troop.id] || 0;
        return `
        <div class="troop-card" data-type="${troop.id}">
            <div class="troop-icon">${troop.icon}</div>
            <div class="troop-info">
                <h3>${troop.icon} ${troop.name}</h3>
                <p>${troop.desc}</p>
                <div class="stats">
                    <span>⚔️ Ат: ${troop.attack}</span>
                    <span>🛡️ Деф: ${troop.defense}</span>
                </div>
                <div class="price">💰 ${troop.basePrice} злато</div>
                ${troop.special ? `<div class="special">✨ ${troop.special}</div>` : ''}
            </div>
            <div class="troop-controls">
                <button class="buy-btn" data-type="${troop.id}">Купи +1</button>
                <button class="sell-btn" data-type="${troop.id}">Продай -1</button>
                <div class="owned-count">Имаш: <span id="count-${troop.id}">${currentCount}</span></div>
            </div>
        </div>`;
    }

    function updateMarketUI() {
        const goldSpan = document.getElementById('playerGoldAmount');
        if (goldSpan) goldSpan.innerText = window.playerGold;
        for (let troop of allTroops) {
            const span = document.getElementById(`count-${troop.id}`);
            if (span) span.innerText = window.playerArmyDetails[troop.id] || 0;
        }
        let totalPower = 0;
        for (let troop of allTroops) {
            const cnt = window.playerArmyDetails[troop.id] || 0;
            totalPower += cnt * (troop.attack + troop.defense);
        }
        const powerSpan = document.getElementById('totalArmyPower');
        if (powerSpan) powerSpan.innerText = totalPower;
    }

    // --- 7. Показване/скриване на модала ---
    function showMarket() {
        if (!document.getElementById('armyMarketModal')) {
            document.body.insertAdjacentHTML('beforeend', createMarketHTML());
            attachMarketEvents();
        }
        const modal = document.getElementById('armyMarketModal');
        if (modal) modal.style.display = 'flex';
        updateMarketUI();
        console.log("🛒 Военният пазар е отворен");
    }

    function hideMarket() {
        const modal = document.getElementById('armyMarketModal');
        if (modal) modal.style.display = 'none';
        console.log("🔒 Военният пазар е затворен");
    }

    function attachMarketEvents() {
        const modal = document.getElementById('armyMarketModal');
        if (!modal) return;
        modal.querySelector('.close-market')?.addEventListener('click', hideMarket);
        document.getElementById('closeMarketBtn')?.addEventListener('click', hideMarket);
        modal.addEventListener('click', (e) => { if(e.target === modal) hideMarket(); });
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                buyTroop(btn.getAttribute('data-type'), 1);
            });
        });
        document.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                sellTroop(btn.getAttribute('data-type'), 1);
            });
        });
        document.getElementById('quickBuyMaxBtn')?.addEventListener('click', () => {
            const infantry = basicTroops.find(t => t.id === 'infantry');
            if(infantry) buyTroop('infantry', Math.floor(window.playerGold / infantry.basePrice));
        });
        document.getElementById('resetArmyBtn')?.addEventListener('click', () => {
            if(confirm("⚠️ Демобилизацията ще продаде цялата ви армия с 60% от стойността! Сигурни ли сте?")) {
                let totalRefund = 0;
                for(let t of allTroops) {
                    let cnt = window.playerArmyDetails[t.id] || 0;
                    if(cnt) {
                        totalRefund += Math.floor(t.basePrice * 0.6 * cnt);
                        window.playerArmyDetails[t.id] = 0;
                    }
                }
                window.playerGold += totalRefund;
                updateMarketUI();
                syncWithGame();
                alert(`Цялата армия е демобилизирана. Получихте ${totalRefund} злато.`);
                console.log(`💣 Демобилизация: получено ${totalRefund} злато, армията е 0`);
            }
        });
        // Табове
        const tabs = modal.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById('basic-tab').style.display = tabId === 'basic' ? 'grid' : 'none';
                document.getElementById('fantasy-tab').style.display = tabId === 'fantasy' ? 'grid' : 'none';
            });
        });
    }

    // --- 8. Конзолна визуализация на пазара (всички единици) ---
    function consoleShowMarket() {
        console.clear();
        console.group("%c🛒 ВОЕНЕН ПАЗАР – ВСИЧКИ ЕДИНИЦИ", "color: #ffd700; font-size: 16px; font-weight: bold;");
        console.log("%c📋 Основни войски:", "color: #aaa; font-weight: bold;");
        basicTroops.forEach(t => {
            console.log(`  ${t.icon} ${t.name} | Цена: ${t.basePrice}💰 | Ат:${t.attack} | Деф:${t.defense} | ${t.desc}`);
        });
        console.log("%c✨ ФЕНТЪЗИ ЕДИНИЦИ (30):", "color: #7df9ff; font-weight: bold;");
        fantasyTroops.forEach((t, idx) => {
            const specialText = t.special ? ` | ✨ ${t.special}` : '';
            console.log(`  ${(idx+1).toString().padStart(2)}. ${t.icon} ${t.name.padEnd(18)} | Цена:${t.basePrice}💰 | Ат:${t.attack} | Деф:${t.defense}${specialText}`);
        });
        console.log("%c💰 Текущо злато: " + window.playerGold, "color: #ffaa44;");
        console.log("%c🏆 Обща армия: " + Object.values(window.playerArmyDetails).reduce((a,b)=>a+b,0), "color: #88ff88;");
        console.groupEnd();
        console.log("%c💡 Съвет: Използвай window.armyMarket.buy('id', брой) за покупка", "color: #ccc;");
        console.log("%c📖 Налични ID-та: " + allTroops.map(t => t.id).join(", "), "color: #ffd700;");
    }

    // --- 9. Експорт на глобалния обект и автоматично стартиране ---
    window.armyMarket = {
        show: showMarket,
        hide: hideMarket,
        buy: buyTroop,
        sell: sellTroop,
        sync: syncWithGame,
        consoleShow: consoleShowMarket
    };

    // Показване в конзолата при зареждане
    consoleShowMarket();

    // Синхронизация веднага
    syncWithGame();

    // Не създаваме допълнителен бутон, защото такъв вече съществува в горната лента (index.html)
    // Но ако някой иска плаващ бутон, може да разкоментира:
    /*
    if (!document.getElementById('openArmyMarketBtn')) {
        const btn = document.createElement('button');
        btn.id = 'openArmyMarketBtn';
        btn.innerHTML = '⚔️ НАЕМИ АРМИЯ ⚔️';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 999,
            background: 'linear-gradient(135deg,#b8860b,#daa520)', border: 'none',
            padding: '12px 28px', borderRadius: '50px', color: 'white', fontWeight: 'bold',
            fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 14px black', border: '1px solid gold'
        });
        btn.onclick = () => showMarket();
        document.body.appendChild(btn);
    }
    */
})();
