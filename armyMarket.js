// ======================== АРМИЯ ПАЗАР – НОВА ВЕРСИЯ (НАДЕЖДНО ЗАТВАРЯНЕ) ========================
(function() {
    // ========== 1. РАЗШИРЯВАНЕ НА СПИСЪКА С ВОЙСКИ (ДОБАВЯНЕ НА 10+10 НОВИ) ==========
    if (window.ALL_TROOP_TYPES) {
        let existingIds = new Set(window.ALL_TROOP_TYPES.map(t => t.id));
        
        // 10 нови базови войски (ако ги няма)
        const newBasic = [
            { id: "spearman", name: "Копиеносец", basePrice: 12, attack: 10, defense: 14, icon: "🔱", desc: "Дълги копия срещу конница", special: "bonusVsCavalry:0.2", category: "basic" },
            { id: "maceman", name: "Боздуганар", basePrice: 14, attack: 14, defense: 12, icon: "🔨", desc: "Смазващи удари", special: "armorPenetration:0.1", category: "basic" },
            { id: "crossbowman", name: "Арбалетчик", basePrice: 18, attack: 20, defense: 8, icon: "🏹", desc: "Тежки арбалети", special: "ignoreArmor:0.15", category: "basic" },
            { id: "lightCavalry", name: "Лек конник", basePrice: 28, attack: 22, defense: 16, icon: "🐎", desc: "Бързи разузнавачи", special: "firstStrikeBonus:0.2", category: "basic" },
            { id: "heavyCavalry", name: "Тежък конник", basePrice: 45, attack: 38, defense: 30, icon: "🏇", desc: "Ударна сила", special: "chargeBonus:0.25", category: "basic" },
            { id: "axeman", name: "Секирник", basePrice: 15, attack: 16, defense: 10, icon: "🪓", desc: "Страховити атаки", special: "critChance:0.05", category: "basic" },
            { id: "pikeman", name: "Пикинер", basePrice: 13, attack: 8, defense: 18, icon: "⛏️", desc: "Срещу всичко", special: "defenseBonus:2", category: "basic" },
            { id: "slinger", name: "Прашкаджия", basePrice: 9, attack: 12, defense: 4, icon: "🪨", desc: "Далечни атаки", special: null, category: "basic" },
            { id: "chariot", name: "Колесница", basePrice: 55, attack: 45, defense: 35, icon: "🏎️", desc: "Страх за враговете", special: "splashDamage:2", category: "basic" },
            { id: "royalGuard", name: "Царска гвардия", basePrice: 90, attack: 60, defense: 55, icon: "👑", desc: "Елитни телохранители", special: "moraleBonus:0.2", category: "basic" }
        ];
        
        // 10 нови фентъзи войски
        const newFantasy = [
            { id: "ghost", name: "Призрак", basePrice: 85, attack: 30, defense: 25, icon: "👻", desc: "Неуязвим за физически атаки", special: "physicalImmune:0.5", category: "fantasy" },
            { id: "goblin", name: "Гоблин", basePrice: 25, attack: 18, defense: 10, icon: "👺", desc: "Бързи и досадни", special: "poisonDamage:5", category: "fantasy" },
            { id: "minotaur", name: "Минотавър", basePrice: 120, attack: 65, defense: 45, icon: "🐂", desc: "Страшна сила", special: "stunChance:0.2", category: "fantasy" },
            { id: "skeleton", name: "Скелет", basePrice: 40, attack: 20, defense: 15, icon: "💀", desc: "Вървят отново", special: "undead:true", category: "fantasy" },
            { id: "zombie", name: "Зомби", basePrice: 35, attack: 15, defense: 20, icon: "🧟", desc: "Заразяват", special: "plague:0.1", category: "fantasy" },
            { id: "harpy", name: "Харпия", basePrice: 70, attack: 35, defense: 20, icon: "🦅", desc: "Въздушна атака", special: "fly:true", category: "fantasy" },
            { id: "medusa", name: "Медуза", basePrice: 150, attack: 70, defense: 50, icon: "🐍", desc: "Вкаменяващ поглед", special: "petrifyChance:0.15", category: "fantasy" },
            { id: "chimera", name: "Химера", basePrice: 200, attack: 85, defense: 60, icon: "🐲", desc: "Огнено дихание", special: "fireBreath:30", category: "fantasy" },
            { id: "treant", name: "Дървесен пазител", basePrice: 110, attack: 45, defense: 70, icon: "🌳", desc: "Жива броня", special: "healSelf:10", category: "fantasy" },
            { id: "basilisk", name: "Василиск", basePrice: 180, attack: 75, defense: 55, icon: "🦎", desc: "Смъртоносен поглед", special: "instantKillChance:0.05", category: "fantasy" }
        ];
        
        // Добавяне на новите войски, ако ги няма
        newBasic.forEach(t => { if (!existingIds.has(t.id)) window.ALL_TROOP_TYPES.push(t); });
        newFantasy.forEach(t => { if (!existingIds.has(t.id)) window.ALL_TROOP_TYPES.push(t); });
        
        // Актуализираме локалните променливи, защото масивът се е променил
        window.ALL_TROOP_IDS = window.ALL_TROOP_TYPES.map(t => t.id);
    } else {
        console.error("❌ ALL_TROOP_TYPES не е дефиниран! Уверете се, че troopsData.js се зарежда преди armyMarket.js");
        return;
    }
    
    const allTroops = window.ALL_TROOP_TYPES;
    const allTroopIds = window.ALL_TROOP_IDS;
    const basicTroopIds = ["infantry", "archers", "cavalry", "elite", "spearman", "maceman", "crossbowman", "lightCavalry", "heavyCavalry", "axeman", "pikeman", "slinger", "chariot", "royalGuard"];
    const fantasyTroopIds = allTroopIds.filter(id => !basicTroopIds.includes(id));
    const basicTroops = allTroops.filter(t => basicTroopIds.includes(t.id));
    const fantasyTroops = allTroops.filter(t => fantasyTroopIds.includes(t.id));
    
    let selectedHeroId = null;
    
    // ========== 2. ПОМОЩНИ ФУНКЦИИ ==========
    function ensureArmyDetails(hero) { return window.ensureCompleteArmyDetails(hero); }
    
    function getAllHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let heroData = window.worldData.clans[key];
                if (heroData.isJoined === true && heroData.isFavorite === true) {
                    ensureArmyDetails(heroData);
                    heroes.push({ id: key, name: heroData.name || heroData.leaderName || key, hero: heroData, gold: heroData.gold || 0, armySize: heroData.armySize || 0, armyDetails: heroData.armyDetails });
                }
            }
        }
        if (heroes.length === 0 && window.currentHero && window.currentHero.isJoined === true) {
            ensureArmyDetails(window.currentHero);
            heroes.push({ id: window.currentHero.clan || "hero", name: window.currentHero.name || "Воевода", hero: window.currentHero, gold: window.currentHero.gold || 0, armySize: window.currentHero.armySize || 0, armyDetails: window.currentHero.armyDetails });
        }
        return heroes;
    }
    
    function getSelectedHero() {
        let hero = null;
        if (selectedHeroId && window.worldData.clans[selectedHeroId]) hero = window.worldData.clans[selectedHeroId];
        if (!hero && window.currentHero) {
            hero = window.currentHero;
            for (let key in window.worldData.clans) { if (window.worldData.clans[key] === hero) { selectedHeroId = key; break; } }
        }
        if (!hero) {
            const heroes = getAllHeroes();
            if (heroes.length && heroes[0].id && window.worldData.clans[heroes[0].id]) { hero = window.worldData.clans[heroes[0].id]; selectedHeroId = heroes[0].id; }
        }
        if (hero) ensureArmyDetails(hero);
        return hero;
    }
    
    function syncWithGame(hero) {
        if (!hero) hero = getSelectedHero();
        if (!hero) return;
        ensureArmyDetails(hero);
        let total = 0; for (let id of allTroopIds) total += hero.armyDetails[id] || 0;
        hero.armySize = total; hero.currentArmy = total;
        if (window.currentHero && window.currentHero.clan === hero.clan) {
            let goldSpan = document.getElementById('val-gold'); if (goldSpan) goldSpan.innerText = hero.gold;
            let armySpan = document.getElementById('val-army'); if (armySpan) armySpan.innerText = total;
        }
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
    }
    
    function initHero(hero) {
        if (!hero.armyDetails) { hero.armyDetails = {}; for (let id of allTroopIds) hero.armyDetails[id] = 0; }
        ensureArmyDetails(hero);
        syncWithGame(hero);
    }
    
    function buyTroop(typeId, quantity, heroParam) {
        let hero = heroParam || getSelectedHero();
        if (!hero) return false;
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return false;
        let totalCost = troop.basePrice * quantity;
        if (hero.gold < totalCost) {
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", `${hero.name} няма достатъчно злато!`, "error");
            return false;
        }
        hero.gold -= totalCost;
        hero.armyDetails[typeId] = (hero.armyDetails[typeId] || 0) + quantity;
        syncWithGame(hero);
        if (window.showAdvisorPopup) window.showAdvisorPopup("УСПЕХ", `Купихте ${quantity} × ${troop.name} за ${totalCost} злато.`, "success");
        updateMarketUI();
        return true;
    }
    
    function sellTroop(typeId, quantity, heroParam) {
        let hero = heroParam || getSelectedHero();
        if (!hero) return false;
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return false;
        let current = hero.armyDetails[typeId] || 0;
        if (current < quantity) {
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Нямате толкова войници!", "error");
            return false;
        }
        let refund = Math.floor(troop.basePrice * 0.6 * quantity);
        hero.gold += refund;
        hero.armyDetails[typeId] = current - quantity;
        syncWithGame(hero);
        if (window.showAdvisorPopup) window.showAdvisorPopup("ПРОДАЖБА", `Продадохте ${quantity} × ${troop.name} за ${refund} злато.`, "info");
        updateMarketUI();
        return true;
    }
    
    // ========== 3. НОВ МОДАЛ – НАПЪЛНО ПРОВЕРЕН ==========
    function createMarketHTML() {
        let heroes = getAllHeroes();
        let heroOptions = heroes.map(h => `<option value="${h.id}" ${selectedHeroId === h.id ? 'selected' : ''}>${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`).join('');
        let basicSection = basicTroops.map(t => `<div class="troop-card" data-type="${t.id}"><div class="troop-icon">${t.icon}</div><div class="troop-name">${t.name}</div><div class="troop-stats">⚔️${t.attack} 🛡️${t.defense}</div><div class="troop-price">💰${t.basePrice}</div><div class="troop-controls"><button class="buy-btn" data-type="${t.id}" data-qty="1">+1</button><button class="buy-btn" data-type="${t.id}" data-qty="10">+10</button><button class="sell-btn" data-type="${t.id}" data-qty="1">-1</button></div><div class="owned-count">📦 <span id="count-${t.id}">${getSelectedHero()?.armyDetails[t.id] || 0}</span></div></div>`).join('');
        let fantasySection = fantasyTroops.map(t => `<div class="troop-card" data-type="${t.id}"><div class="troop-icon">${t.icon}</div><div class="troop-name">${t.name}</div><div class="troop-stats">⚔️${t.attack} 🛡️${t.defense}</div><div class="troop-price">💰${t.basePrice}</div><div class="troop-controls"><button class="buy-btn" data-type="${t.id}" data-qty="1">+1</button><button class="buy-btn" data-type="${t.id}" data-qty="10">+10</button><button class="sell-btn" data-type="${t.id}" data-qty="1">-1</button></div><div class="owned-count">📦 <span id="count-${t.id}">${getSelectedHero()?.armyDetails[t.id] || 0}</span></div></div>`).join('');
        
        return `
        <div id="armyMarketModal" class="army-market-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:300000; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif;">
            <div class="army-market-window" style="background:#0a1a2e; border:2px solid #d4af37; border-radius:24px; width:95%; max-width:1300px; max-height:90vh; overflow-y:auto; padding:20px; position:relative;">
                <div class="army-market-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                    <h2 style="color:#ffd700; margin:0;">🏰 ВОЕНЕН ПАЗАР</h2>
                    <span class="close-market" style="font-size:40px; cursor:pointer; color:#ffd700;">&times;</span>
                </div>
                <div class="army-market-controls" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
                    <div class="resource-box" style="background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px;">💰 Злато: <span id="playerGoldAmount">0</span></div>
                    <div class="resource-box" style="background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px;">⚔️ Сила: <span id="totalArmyPower">0</span></div>
                    <select id="heroSelect" style="background:#2c2c3a; color:#ffd966; border:1px solid #daa520; border-radius:20px; padding:5px 12px;">${heroOptions}</select>
                </div>
                <div class="market-tabs" style="display:flex; gap:10px; margin-bottom:15px;">
                    <button class="tab-btn active" data-tab="basic">⚔️ Основни войски (${basicTroops.length})</button>
                    <button class="tab-btn" data-tab="fantasy">✨ Фентъзи единици (${fantasyTroops.length})</button>
                </div>
                <div id="basic-tab" class="troop-shop" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:10px; max-height:55vh; overflow-y:auto; padding:5px;">${basicSection}</div>
                <div id="fantasy-tab" class="troop-shop" style="display:none; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:10px; max-height:55vh; overflow-y:auto; padding:5px;">${fantasySection}</div>
                <div class="market-footer" style="display:flex; justify-content:center; gap:15px; margin-top:20px; padding-top:10px; border-top:1px solid #d4af37;">
                    <button id="closeMarketBtn" class="footer-btn" style="background:#2c1a0c; border:1px solid #d4af37; border-radius:30px; padding:6px 20px; color:#ffdd99; cursor:pointer;">Затвори</button>
                    <button id="quickBuyMaxBtn" class="footer-btn" style="background:#daa520; border:none; border-radius:30px; padding:6px 20px; color:#000; cursor:pointer;">💰 Купи макс. пехота</button>
                    <button id="resetArmyBtn" class="footer-btn" style="background:#5a2a2a; border:1px solid #ff6666; border-radius:30px; padding:6px 20px; color:#ffaaaa; cursor:pointer;">⚠️ Демобилизация</button>
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
        if (heroSelect && heroSelect.value !== selectedHeroId) heroSelect.value = selectedHeroId;
        for (let troop of allTroops) {
            let cnt = hero.armyDetails[troop.id] || 0;
            let span = document.getElementById(`count-${troop.id}`);
            if (span) span.innerText = cnt;
        }
        let totalPower = 0;
        for (let troop of allTroops) totalPower += (hero.armyDetails[troop.id] || 0) * (troop.attack + troop.defense);
        let powerSpan = document.getElementById('totalArmyPower');
        if (powerSpan) powerSpan.innerText = totalPower;
        // Актуализиране на бутоните купи/продай (disable ако няма злато)
        document.querySelectorAll('.buy-btn').forEach(btn => {
            let troopId = btn.getAttribute('data-type');
            let qty = parseInt(btn.getAttribute('data-qty') || '1');
            let troop = allTroops.find(t => t.id === troopId);
            if (troop) btn.disabled = (hero.gold < troop.basePrice * qty);
        });
    }
    
    function setSelectedHero(heroId) {
        selectedHeroId = heroId;
        let hero = getSelectedHero();
        if (hero) initHero(hero);
        updateMarketUI();
    }
    
    function hideMarket() {
        let modal = document.getElementById('armyMarketModal');
        if (modal) modal.remove();
    }
    
    function showMarket() {
        // Премахваме стар модал, ако съществува
        let oldModal = document.getElementById('armyMarketModal');
        if (oldModal) oldModal.remove();
        
        let heroes = getAllHeroes();
        if (heroes.length === 0) {
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Няма наети герои!", "error");
            else alert("Няма наети герои!");
            return;
        }
        let hero = getSelectedHero();
        if (hero) initHero(hero);
        
        document.body.insertAdjacentHTML('beforeend', createMarketHTML());
        let modal = document.getElementById('armyMarketModal');
        if (!modal) return;
        
        // Затваряне при клик върху фона
        modal.addEventListener('click', function(e) {
            if (e.target === modal) hideMarket();
        });
        
        // Затваряне при натискане на Escape
        let escHandler = function(e) {
            if (e.key === 'Escape') { hideMarket(); document.removeEventListener('keydown', escHandler); }
        };
        document.addEventListener('keydown', escHandler);
        
        // Затваряне чрез бутоните
        let closeSpan = modal.querySelector('.close-market');
        if (closeSpan) closeSpan.addEventListener('click', hideMarket);
        let closeBtn = modal.querySelector('#closeMarketBtn');
        if (closeBtn) closeBtn.addEventListener('click', hideMarket);
        
        // Селект за герой
        let heroSelect = modal.querySelector('#heroSelect');
        if (heroSelect) {
            if (selectedHeroId) heroSelect.value = selectedHeroId;
            heroSelect.addEventListener('change', (e) => setSelectedHero(e.target.value));
        }
        
        // Табове
        let tabs = modal.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                let tabId = btn.getAttribute('data-tab');
                let basicDiv = modal.querySelector('#basic-tab');
                let fantasyDiv = modal.querySelector('#fantasy-tab');
                if (basicDiv && fantasyDiv) {
                    basicDiv.style.display = tabId === 'basic' ? 'grid' : 'none';
                    fantasyDiv.style.display = tabId === 'fantasy' ? 'grid' : 'none';
                }
            });
        });
        
        // Бутони за купуване и продаване
        modal.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                let troopId = btn.getAttribute('data-type');
                let qty = parseInt(btn.getAttribute('data-qty') || '1');
                let hero = getSelectedHero();
                if (hero) buyTroop(troopId, qty, hero);
            });
        });
        modal.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                let troopId = btn.getAttribute('data-type');
                let qty = parseInt(btn.getAttribute('data-qty') || '1');
                let hero = getSelectedHero();
                if (hero) sellTroop(troopId, qty, hero);
            });
        });
        
        // Бързо купуване на максимално количество пехота
        let quickBtn = modal.querySelector('#quickBuyMaxBtn');
        if (quickBtn) {
            quickBtn.addEventListener('click', () => {
                let hero = getSelectedHero();
                if (hero) {
                    let infantry = basicTroops.find(t => t.id === 'infantry');
                    if (infantry) buyTroop('infantry', Math.floor(hero.gold / infantry.basePrice), hero);
                }
            });
        }
        
        // Демобилизация
        let resetBtn = modal.querySelector('#resetArmyBtn');
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
                    if (window.showAdvisorPopup) window.showAdvisorPopup("ДЕМОБИЛИЗАЦИЯ", `Получихте ${totalRefund} злато.`, "info");
                }
            });
        }
        
        updateMarketUI();
    }
    
    window.armyMarket = { show: showMarket, hide: hideMarket, buy: buyTroop, sell: sellTroop, sync: syncWithGame, setHero: setSelectedHero, getHero: getSelectedHero };
    let initialHero = getSelectedHero();
    if (initialHero) initHero(initialHero);
    console.log("✅ armyMarket.js – НОВА ВЕРСИЯ (10 нови базови + 10 нови фентъзи, надеждно затваряне)");
})();
