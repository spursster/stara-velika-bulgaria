// ======================== АРМИЯ ПАЗАР (КОРИГИРАН – АКТИВЕН ГЕРОЙ) ========================
(function() {
    // --- Проверка на зависимости ---
    if (!window.worldData || !window.worldData.clans) {
        console.error("❌ worldData не е зареден!");
        return;
    }
    
    if (!window.ALL_TROOP_TYPES) {
        console.error("❌ troopsData.js не е зареден преди armyMarket.js!");
        return;
    }

    // Използваме глобалната база данни
    const allTroops = window.ALL_TROOP_TYPES;
    const allTroopIds = window.ALL_TROOP_IDS;
    
    // Разделяме за UI
    const basicTroopIds = ["infantry", "archers", "cavalry", "elite"];
    const fantasyTroopIds = allTroopIds.filter(id => !basicTroopIds.includes(id));
    const basicTroops = allTroops.filter(t => basicTroopIds.includes(t.id));
    const fantasyTroops = allTroops.filter(t => fantasyTroopIds.includes(t.id));

    let selectedHeroId = null;

    // --- Помощни функции ---
    function ensureArmyDetails(hero) {
        return window.ensureCompleteArmyDetails(hero);
    }

    function getAllHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    ensureArmyDetails(clan);
                    heroes.push({
                        id: key,
                        name: clan.leaderName || clan.name || key,
                        clan: clan,
                        gold: clan.gold || 0,
                        armySize: clan.armySize || 0,
                        armyDetails: clan.armyDetails
                    });
                }
            }
        }
        if (heroes.length === 0 && window.currentHero) {
            ensureArmyDetails(window.currentHero);
            heroes.push({
                id: window.currentHero.clan || "hero",
                name: window.currentHero.name || "Воевода",
                clan: window.currentHero,
                gold: window.currentHero.gold || 0,
                armySize: window.currentHero.armySize || 0,
                armyDetails: window.currentHero.armyDetails
            });
        }
        return heroes;
    }

    // *** КОРИГИРАНА ФУНКЦИЯ – ВИНАГИ ВРЪЩА АКТИВНИЯ ГЕРОЙ, АКО Е НАЛИЧЕН ***
    function getSelectedHero() {
        let hero = null;
        // 1. Опит с активния герой
        if (window.currentHero && window.currentHero.isJoined === true) {
            hero = window.currentHero;
            // Синхронизираме selectedHeroId за селекта
            selectedHeroId = hero.clan;
        }
        // 2. Ако няма активен, взимаме първия от списъка
        if (!hero) {
            const heroes = getAllHeroes();
            if (heroes.length) {
                hero = heroes[0].clan;
                selectedHeroId = hero.clan;
            }
        }
        if (hero) ensureArmyDetails(hero);
        return hero;
    }

    function syncWithGame(hero) {
        if (!hero) hero = getSelectedHero();
        if (!hero) return;
        ensureArmyDetails(hero);
        let total = 0;
        for (let id of allTroopIds) total += hero.armyDetails[id] || 0;
        hero.armySize = total;
        hero.currentArmy = total;
        if (window.currentHero && window.currentHero.clan === hero.clan) {
            let goldSpan = document.getElementById('val-gold');
            if (goldSpan) goldSpan.innerText = hero.gold;
            let armySpan = document.getElementById('val-army');
            if (armySpan) armySpan.innerText = total;
        }
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        saveHeroData(hero);
    }

    function saveHeroData(hero) {
        try {
            localStorage.setItem(`armyMarket_${hero.clan}`, JSON.stringify({ 
                gold: hero.gold, 
                armyDetails: hero.armyDetails 
            }));
        } catch(e) {}
    }

    function loadHeroData(hero) {
        try {
            let saved = localStorage.getItem(`armyMarket_${hero.clan}`);
            if (saved) {
                let data = JSON.parse(saved);
                hero.gold = data.gold;
                hero.armyDetails = data.armyDetails;
                ensureArmyDetails(hero);
                return true;
            }
        } catch(e) {}
        return false;
    }

    function initHero(hero) {
        if (!hero.armyDetails) {
            if (!loadHeroData(hero)) {
                hero.armyDetails = {};
                for (let id of allTroopIds) hero.armyDetails[id] = 0;
                if (hero.armySize > 0) {
                    hero.armyDetails.infantry = Math.floor(hero.armySize * 0.5);
                    hero.armyDetails.archers = Math.floor(hero.armySize * 0.25);
                    hero.armyDetails.cavalry = Math.floor(hero.armySize * 0.15);
                    hero.armyDetails.elite = hero.armySize - (hero.armyDetails.infantry + hero.armyDetails.archers + hero.armyDetails.cavalry);
                } else {
                    hero.armyDetails.infantry = 100;
                    hero.armyDetails.archers = 50;
                    hero.armyDetails.cavalry = 30;
                    hero.armyDetails.elite = 20;
                }
                for (let id of fantasyTroopIds) {
                    if (hero.armyDetails[id] === undefined) hero.armyDetails[id] = 0;
                }
            }
        }
        ensureArmyDetails(hero);
        syncWithGame(hero);
    }

    function buyTroop(typeId, quantity = 1, heroParam = null) {
        let hero = heroParam || getSelectedHero();
        if (!hero) { 
            if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Няма избран герой!");
            return false; 
        }
        ensureArmyDetails(hero);
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return false;
        let totalCost = troop.basePrice * quantity;
        if (hero.gold < totalCost) { 
            if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ ${hero.name} няма достатъчно злато! (Нужни: ${totalCost})`);
            return false; 
        }
        hero.gold -= totalCost;
        hero.armyDetails[typeId] = (hero.armyDetails[typeId] || 0) + quantity;
        syncWithGame(hero);
        saveHeroData(hero);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (window.addWorldEvent) window.addWorldEvent(`🛒 Покупка на армия`, `${hero.name} купи ${quantity} × ${troop.name} за ${totalCost} злато.`, "💰");
        return true;
    }

    function sellTroop(typeId, quantity = 1, heroParam = null) {
        let hero = heroParam || getSelectedHero();
        if (!hero) return false;
        ensureArmyDetails(hero);
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return false;
        let current = hero.armyDetails[typeId] || 0;
        if (current < quantity) { 
            if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямаш толкова войници за продажба!");
            return false; 
        }
        let refund = Math.floor(troop.basePrice * 0.6 * quantity);
        hero.gold += refund;
        hero.armyDetails[typeId] = current - quantity;
        syncWithGame(hero);
        saveHeroData(hero);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`💰 Продадохте ${quantity} × ${troop.name} за ${refund} злато.`);
        return true;
    }
    // --- UI функции ---
    function troopCard(troop) {
        let hero = getSelectedHero();
        let currentCount = hero ? (hero.armyDetails[troop.id] || 0) : 0;
        return `
        <div class="troop-card" data-type="${troop.id}">
            <div class="troop-icon">${troop.icon}</div>
            <div class="troop-info">
                <h3>${troop.name}</h3>
                <p>${troop.desc}</p>
                <div class="stats"><span>⚔️ Ат: ${troop.attack}</span><span>🛡️ Деф: ${troop.defense}</span></div>
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

    function createMarketHTML() {
        let heroes = getAllHeroes();
        let heroOptions = heroes.map(h => `<option value="${h.id}" ${selectedHeroId === h.id ? 'selected' : ''}>${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`).join('');
        let basicSection = basicTroops.map(t => troopCard(t)).join('');
        let fantasySection = fantasyTroops.map(t => troopCard(t)).join('');
        
        return `
        <div id="armyMarketModal" class="market-modal" style="display: none;">
            <div class="market-content glass-panel">
                <div class="market-header">
                    <h2>🏰 Военен пазар <span class="close-market">&times;</span></h2>
                    <div class="player-resources">
                        <div class="resource-box gold">💰 Злато: <span id="playerGoldAmount">0</span></div>
                        <div class="resource-box power">⚔️ Сила: <span id="totalArmyPower">0</span></div>
                        <div class="resource-box hero-select">👤 Герой: <select id="heroSelect">${heroOptions}</select></div>
                    </div>
                </div>
                <div class="market-tabs">
                    <button class="tab-btn active" data-tab="basic">⚔️ Основни войски</button>
                    <button class="tab-btn" data-tab="fantasy">✨ Фентъзи единици (${fantasyTroops.length})</button>
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
                align-items: flex-start; 
                justify-content: center; 
                padding-top: 20px;
                box-sizing: border-box;
                overflow-y: auto;
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
            }
            .market-header h2 { 
                color: #ffd700; 
                margin: 0; 
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
            }
            .resource-box.gold { color: #ffd966; }
            .resource-box.power { color: #88ffaa; }
            .close-market { 
                font-size: 32px; 
                cursor: pointer; 
                color: #ffd700; 
            }
            .close-market:hover { color: #ff6666; }
            .market-tabs { 
                display: flex; 
                gap: 10px; 
                margin-bottom: 20px; 
                flex-wrap: wrap; 
            }
            .tab-btn { 
                background: #2c2c3a; 
                border: none; 
                padding: 8px 20px; 
                border-radius: 40px; 
                color: #ffd966; 
                cursor: pointer; 
            }
            .tab-btn.active { 
                background: #daa520; 
                color: black; 
            }
            .troop-shop { 
                display: grid; 
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
                gap: 20px; 
                max-height: 55vh; 
                overflow-y: auto; 
            }
            .troop-card { 
                background: rgba(0,0,0,0.65); 
                border-radius: 24px; 
                padding: 15px; 
                border: 1px solid rgba(255,215,0,0.3); 
            }
            .troop-icon { font-size: 48px; text-align: center; }
            .troop-info h3 { color: #ffd966; margin: 0 0 8px 0; }
            .stats { display: flex; gap: 15px; font-size: 0.8rem; color: #aaa; }
            .price { font-weight: bold; color: #ffaa44; }
            .special { font-size: 0.7rem; color: #d4af37; background: rgba(0,0,0,0.4); display: inline-block; padding: 2px 8px; border-radius: 20px; }
            .troop-controls { display: flex; justify-content: space-between; margin-top: 12px; gap: 8px; flex-wrap: wrap; }
            .buy-btn, .sell-btn { background: linear-gradient(135deg,#b8860b,#daa520); border: none; padding: 6px 14px; border-radius: 40px; color: white; cursor: pointer; }
            .sell-btn { background: linear-gradient(135deg,#8b3a3a,#b55a5a); }
            .owned-count { font-size: 0.8rem; background: #222; padding: 4px 10px; border-radius: 30px; }
            .market-footer { display: flex; justify-content: center; gap: 15px; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,215,0,0.3); }
            .footer-btn { background: #2c2c3a; border: 1px solid #daa520; padding: 8px 20px; border-radius: 40px; color: #ffd966; cursor: pointer; }
            .footer-btn.gold { background: #daa520; color: black; }
            .footer-btn.danger { background: #5a2a2a; border-color: #ff6666; color: #ffaaaa; }
            @media (max-width:768px) { 
                .glass-panel { padding: 12px; } 
                .troop-shop { grid-template-columns: 1fr; } 
            }
        </style>`;
    }

    function updateMarketUI() {
        let hero = getSelectedHero();
        if (!hero) return;
        let goldSpan = document.getElementById('playerGoldAmount');
        if (goldSpan) goldSpan.innerText = hero.gold;
        let totalPower = 0;
        for (let troop of allTroops) {
            let cnt = hero.armyDetails[troop.id] || 0;
            totalPower += cnt * (troop.attack + troop.defense);
            let span = document.getElementById(`count-${troop.id}`);
            if (span) span.innerText = cnt;
        }
        let powerSpan = document.getElementById('totalArmyPower');
        if (powerSpan) powerSpan.innerText = totalPower;
    }

    function setSelectedHero(heroId) {
        selectedHeroId = heroId;
        let hero = getSelectedHero();
        if (hero) initHero(hero);
        updateMarketUI();
    }

    function showMarket() {
        let heroes = getAllHeroes();
        if (heroes.length === 0) { 
            alert("❌ Няма наети герои! Първо наемете герой.");
            return; 
        }
        // Актуализираме избрания герой да е активният
        if (window.currentHero && window.currentHero.isJoined) {
            selectedHeroId = window.currentHero.clan;
        } else if (!selectedHeroId || !heroes.find(h => h.id === selectedHeroId)) {
            selectedHeroId = heroes[0].id;
        }
        let hero = getSelectedHero();
        if (hero) initHero(hero);
        if (!document.getElementById('armyMarketModal')) {
            document.body.insertAdjacentHTML('beforeend', createMarketHTML());
            attachMarketEvents();
        }
        let modal = document.getElementById('armyMarketModal');
        if (modal) modal.style.display = 'flex';
        updateMarketUI();
    }

    function hideMarket() {
        let modal = document.getElementById('armyMarketModal');
        if (modal) modal.style.display = 'none';
    }

    function attachMarketEvents() {
        let modal = document.getElementById('armyMarketModal');
        if (!modal) return;
        
        modal.querySelector('.close-market')?.addEventListener('click', hideMarket);
        document.getElementById('closeMarketBtn')?.addEventListener('click', hideMarket);
        modal.addEventListener('click', (e) => { if (e.target === modal) hideMarket(); });
        
        modal.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                buyTroop(btn.getAttribute('data-type'), 1);
            });
        });
        
        modal.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                sellTroop(btn.getAttribute('data-type'), 1);
            });
        });
        
        document.getElementById('quickBuyMaxBtn')?.addEventListener('click', () => {
            let hero = getSelectedHero();
            if (hero) {
                let infantry = basicTroops.find(t => t.id === 'infantry');
                if (infantry) buyTroop('infantry', Math.floor(hero.gold / infantry.basePrice));
            }
        });
        
        document.getElementById('resetArmyBtn')?.addEventListener('click', () => {
            let hero = getSelectedHero();
            if (hero && confirm(`⚠️ Демобилизацията ще продаде цялата армия на ${hero.name} с 60% от стойността! Сигурни ли сте?`)) {
                let totalRefund = 0;
                for (let t of allTroops) {
                    let cnt = hero.armyDetails[t.id] || 0;
                    if (cnt) {
                        totalRefund += Math.floor(t.basePrice * 0.6 * cnt);
                        hero.armyDetails[t.id] = 0;
                    }
                }
                hero.gold += totalRefund;
                syncWithGame(hero);
                saveHeroData(hero);
                updateMarketUI();
                alert(`Цялата армия на ${hero.name} е демобилизирана. Получихте ${totalRefund} злато.`);
            }
        });
        
        let tabs = modal.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                let tabId = btn.getAttribute('data-tab');
                document.getElementById('basic-tab').style.display = tabId === 'basic' ? 'grid' : 'none';
                document.getElementById('fantasy-tab').style.display = tabId === 'fantasy' ? 'grid' : 'none';
            });
        });
        
        let heroSelect = document.getElementById('heroSelect');
        if (heroSelect) {
            heroSelect.addEventListener('change', (e) => setSelectedHero(e.target.value));
            // Синхронизираме селекта с активния герой
            if (selectedHeroId) heroSelect.value = selectedHeroId;
        }
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                let modalEl = document.getElementById('armyMarketModal');
                if (modalEl && modalEl.style.display === 'flex') hideMarket();
            }
        });
    }

    // Експорт на API
    window.armyMarket = {
        show: showMarket,
        hide: hideMarket,
        buy: buyTroop,
        sell: sellTroop,
        sync: syncWithGame,
        setHero: setSelectedHero,
        getHero: getSelectedHero
    };

    // Инициализация
    let initialHero = getSelectedHero();
    if (initialHero) initHero(initialHero);
    
    console.log("✅ armyMarket.js зареден (коригиран – активен герой)");
})();
