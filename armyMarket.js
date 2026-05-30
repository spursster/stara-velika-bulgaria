// ======================== АРМИЯ ПАЗАР (ХАРМОНИЗИРАНА ВЕРСИЯ – ВСИЧКИ СА ГЕРОИ) ========================
(function() {
    if (!window.worldData || !window.worldData.clans) {
        console.error("❌ worldData не е зареден!");
        return;
    }
    if (!window.ALL_TROOP_TYPES) {
        console.error("❌ troopsData.js не е зареден преди armyMarket.js!");
        return;
    }

    const allTroops = window.ALL_TROOP_TYPES;
    const allTroopIds = window.ALL_TROOP_IDS;
    const basicTroopIds = ["infantry", "archers", "cavalry", "elite"];
    const fantasyTroopIds = allTroopIds.filter(id => !basicTroopIds.includes(id));
    const basicTroops = allTroops.filter(t => basicTroopIds.includes(t.id));
    const fantasyTroops = allTroops.filter(t => fantasyTroopIds.includes(t.id));

    let selectedHeroId = null;

    function ensureArmyDetails(hero) {
        return window.ensureCompleteArmyDetails(hero);
    }

    function getAllHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let heroData = window.worldData.clans[key];
                if (heroData.isJoined === true && heroData.isFavorite === true) {
                    ensureArmyDetails(heroData);
                    heroes.push({
                        id: key,
                        name: heroData.name || heroData.leaderName || key,
                        hero: heroData,
                        gold: heroData.gold || 0,
                        armySize: heroData.armySize || 0,
                        armyDetails: heroData.armyDetails
                    });
                }
            }
        }
        if (heroes.length === 0 && window.currentHero && window.currentHero.isJoined === true) {
            ensureArmyDetails(window.currentHero);
            heroes.push({
                id: window.currentHero.clan || "hero",
                name: window.currentHero.name || "Воевода",
                hero: window.currentHero,
                gold: window.currentHero.gold || 0,
                armySize: window.currentHero.armySize || 0,
                armyDetails: window.currentHero.armyDetails
            });
        }
        return heroes;
    }

    function getSelectedHero() {
        let hero = null;
        if (selectedHeroId && window.worldData.clans[selectedHeroId]) {
            hero = window.worldData.clans[selectedHeroId];
        }
        if (!hero && window.currentHero) {
            hero = window.currentHero;
            for (let key in window.worldData.clans) {
                if (window.worldData.clans[key] === hero) {
                    selectedHeroId = key;
                    break;
                }
            }
        }
        if (!hero) {
            const heroes = getAllHeroes();
            if (heroes.length && heroes[0].id && window.worldData.clans[heroes[0].id]) {
                hero = window.worldData.clans[heroes[0].id];
                selectedHeroId = heroes[0].id;
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
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (typeof window.saveGreatBulgariaGame === 'function') {
            window.saveGreatBulgariaGame();
        }
    }

    function initHero(hero) {
        if (!hero.armyDetails) {
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
        ensureArmyDetails(hero);
        syncWithGame(hero);
    }

    function buyTroop(typeId, quantity = 1, heroParam = null) {
        let hero = heroParam || getSelectedHero();
        if (!hero) return false;
        let heroId = selectedHeroId;
        if (!heroId) {
            for (let key in window.worldData.clans) {
                if (window.worldData.clans[key] === hero) { heroId = key; break; }
            }
        }
        let actualHero = heroId ? window.worldData.clans[heroId] : hero;
        ensureArmyDetails(actualHero);
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return false;
        let totalCost = troop.basePrice * quantity;
        let currentGold = Number(actualHero.gold || 0);
        if (currentGold < totalCost) { 
            let msg = `${actualHero.name} няма достатъчно злато! (Нужни: ${totalCost}, Налични: ${currentGold})`;
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", msg, "error");
            else if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ ${msg}`);
            return false; 
        }
        actualHero.gold = currentGold - totalCost;
        actualHero.armyDetails[typeId] = (actualHero.armyDetails[typeId] || 0) + quantity;
        syncWithGame(actualHero);
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
        if (window.updateCharacterUI) window.updateCharacterUI(actualHero);
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        updateMarketUI();
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
            let msg = "Нямаш толкова войници за продажба!";
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", msg, "error");
            return false; 
        }
        let refund = Math.floor(troop.basePrice * 0.6 * quantity);
        hero.gold += refund;
        hero.armyDetails[typeId] = current - quantity;
        syncWithGame(hero);
        if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
        let msg = `Продадохте ${quantity} × ${troop.name} за ${refund} злато.`;
        if (window.showAdvisorPopup) window.showAdvisorPopup("ПРОДАЖБА", msg, "info");
        updateMarketUI();
        return true;
    }

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
                <div style="display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
                    <button class="buy-btn" data-type="${troop.id}" data-qty="1">+1</button>
                    <button class="buy-btn" data-type="${troop.id}" data-qty="10">+10</button>
                    <button class="buy-btn" data-type="${troop.id}" data-qty="100">+100</button>
                    <button class="sell-btn" data-type="${troop.id}" data-qty="1">-1</button>
                </div>
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
        </div>`;
    }

    function updateMarketUI() {
        let hero = getSelectedHero();
        if (!hero) return;
        let goldSpan = document.getElementById('playerGoldAmount');
        if (goldSpan) goldSpan.innerText = hero.gold;
        let heroSelect = document.getElementById('heroSelect');
        if (heroSelect) {
            let selectedOption = heroSelect.querySelector(`option[value="${selectedHeroId}"]`);
            if (selectedOption) {
                selectedOption.innerText = `${hero.name} (💰${hero.gold} злато, ⚔️${hero.armySize})`;
            }
        }
        document.querySelectorAll('.buy-btn').forEach(btn => {
            const troopId = btn.getAttribute('data-type');
            const qty = parseInt(btn.getAttribute('data-qty') || '1');
            const troop = allTroops.find(t => t.id === troopId);
            if (troop) {
                btn.disabled = (Number(hero.gold) < troop.basePrice * qty);
                btn.style.opacity = btn.disabled ? '0.5' : '1';
                btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
            }
        });
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
        let heroSelect = document.getElementById('heroSelect');
        if (heroSelect) heroSelect.value = heroId;
    }

    function hideMarket() {
        let modal = document.getElementById('armyMarketModal');
        if (modal) modal.style.display = 'none';
    }

    function showMarket() {
        // Първо премахваме стар модал, ако има
        let oldModal = document.getElementById('armyMarketModal');
        if (oldModal) oldModal.remove();
        
        let heroes = getAllHeroes();
        if (heroes.length === 0) { 
            let msg = "Няма наети герои! Първо наемете герой.";
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", msg, "error");
            else alert(msg);
            return; 
        }
        let hero = getSelectedHero();
        if (hero) initHero(hero);
        
        document.body.insertAdjacentHTML('beforeend', createMarketHTML());
        let modal = document.getElementById('armyMarketModal');
        if (modal) {
            modal.style.display = 'flex';
            attachMarketEvents(modal);
        }
        let heroSelect = document.getElementById('heroSelect');
        if (heroSelect && hero) heroSelect.value = selectedHeroId;
        updateMarketUI();
    }

    function attachMarketEvents(modal) {
        if (!modal) return;
        
        // Затваряне при клик върху фоновия overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideMarket();
        });
        
        // Бутон за затваряне ×
        let closeSpan = modal.querySelector('.close-market');
        if (closeSpan) {
            closeSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                hideMarket();
            });
        }
        
        // Бутон Затвори
        let closeBtn = modal.querySelector('#closeMarketBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hideMarket();
            });
        }
        
        const heroSelect = document.getElementById('heroSelect');
        
        modal.querySelectorAll('.buy-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const troopId = newBtn.getAttribute('data-type');
                const qty = parseInt(newBtn.getAttribute('data-qty') || '1');
                if (!troopId) return;
                let hero = null;
                if (heroSelect && heroSelect.value && window.worldData.clans[heroSelect.value]) {
                    hero = window.worldData.clans[heroSelect.value];
                } else {
                    hero = window.currentHero;
                }
                if (!hero) return;
                buyTroop(troopId, qty, hero);
            });
        });
        
        modal.querySelectorAll('.sell-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const troopId = newBtn.getAttribute('data-type');
                const qty = parseInt(newBtn.getAttribute('data-qty') || '1');
                if (!troopId) return;
                let hero = null;
                if (heroSelect && heroSelect.value && window.worldData.clans[heroSelect.value]) {
                    hero = window.worldData.clans[heroSelect.value];
                } else {
                    hero = window.currentHero;
                }
                if (!hero) return;
                sellTroop(troopId, qty, hero);
            });
        });
        
        let quickBtn = document.getElementById('quickBuyMaxBtn');
        if (quickBtn) {
            quickBtn.addEventListener('click', () => {
                let hero = getSelectedHero();
                if (hero) {
                    let infantry = basicTroops.find(t => t.id === 'infantry');
                    if (infantry) buyTroop('infantry', Math.floor(hero.gold / infantry.basePrice));
                }
            });
        }
        
        let resetBtn = document.getElementById('resetArmyBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                let hero = getSelectedHero();
                let msg = `⚠️ Демобилизацията ще продаде цялата армия на ${hero.name} с 60% от стойността! Сигурни ли сте?`;
                if (hero && confirm(msg)) {
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
                    updateMarketUI();
                    let resultMsg = `Цялата армия на ${hero.name} е демобилизирана. Получихте ${totalRefund} злато.`;
                    if (window.showAdvisorPopup) window.showAdvisorPopup("ДЕМОБИЛИЗАЦИЯ", resultMsg, "info");
                }
            });
        }
        
        let tabs = modal.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                let tabId = btn.getAttribute('data-tab');
                let basicDiv = document.getElementById('basic-tab');
                let fantasyDiv = document.getElementById('fantasy-tab');
                if (basicDiv && fantasyDiv) {
                    basicDiv.style.display = tabId === 'basic' ? 'grid' : 'none';
                    fantasyDiv.style.display = tabId === 'fantasy' ? 'grid' : 'none';
                }
            });
        });
        
        if (heroSelect) {
            if (selectedHeroId) heroSelect.value = selectedHeroId;
            heroSelect.addEventListener('change', (e) => setSelectedHero(e.target.value));
        }
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                let modalEl = document.getElementById('armyMarketModal');
                if (modalEl && modalEl.style.display === 'flex') hideMarket();
            }
        });
    }

    window.armyMarket = {
        show: showMarket,
        hide: hideMarket,
        buy: buyTroop,
        sell: sellTroop,
        sync: syncWithGame,
        setHero: setSelectedHero,
        getHero: getSelectedHero
    };

    let initialHero = getSelectedHero();
    if (initialHero) initHero(initialHero);
    
    console.log("✅ armyMarket.js зареден (коригирана версия – затваря се правилно)");
})();
