// ======================== АРМИЯ ПАЗАР – ФИНАЛНА ВЕРСИЯ (С ОПИСАНИЯ И ГОЛЕМИ ИКОНКИ) ========================
(function() {
    // Разширяване на войските (ако липсват)
    if (window.ALL_TROOP_TYPES) {
        let existingIds = new Set(window.ALL_TROOP_TYPES.map(t => t.id));
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
        newBasic.forEach(t => { if (!existingIds.has(t.id)) window.ALL_TROOP_TYPES.push(t); });
        newFantasy.forEach(t => { if (!existingIds.has(t.id)) window.ALL_TROOP_TYPES.push(t); });
        window.ALL_TROOP_IDS = window.ALL_TROOP_TYPES.map(t => t.id);
    }
    
    const allTroops = window.ALL_TROOP_TYPES;
    const allTroopIds = window.ALL_TROOP_IDS;
    const basicTroopIds = ["infantry","archers","cavalry","elite","spearman","maceman","crossbowman","lightCavalry","heavyCavalry","axeman","pikeman","slinger","chariot","royalGuard"];
    const fantasyTroopIds = allTroopIds.filter(id => !basicTroopIds.includes(id));
    const basicTroops = allTroops.filter(t => basicTroopIds.includes(t.id));
    const fantasyTroops = allTroops.filter(t => fantasyTroopIds.includes(t.id));
    
    let selectedHeroId = null;
    
    function getSelectedHero() {
        if (selectedHeroId && window.worldData.clans[selectedHeroId]) return window.worldData.clans[selectedHeroId];
        if (window.currentHero) return window.currentHero;
        return null;
    }
    
    function syncWithGame(hero) {
        if (!hero) hero = getSelectedHero();
        if (!hero) return;
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
        let total = 0;
        for (let id of allTroopIds) total += hero.armyDetails?.[id] || 0;
        hero.armySize = total;
        hero.currentArmy = total;
        if (window.currentHero && window.currentHero.clan === hero.clan) {
            let goldSpan = document.getElementById('val-gold'); if (goldSpan) goldSpan.innerText = hero.gold;
            let armySpan = document.getElementById('val-army'); if (armySpan) armySpan.innerText = total;
        }
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
    }
    
    function updateMarketUI() {
        let hero = getSelectedHero();
        if (!hero) return;
        let goldSpan = document.getElementById('playerGoldAmount');
        if (goldSpan) goldSpan.innerText = hero.gold;
        let heroSelect = document.getElementById('heroSelect');
        if (heroSelect && heroSelect.value !== selectedHeroId) heroSelect.value = selectedHeroId;
        for (let troop of allTroops) {
            let cnt = hero.armyDetails?.[troop.id] || 0;
            let span = document.getElementById(`count-${troop.id}`);
            if (span) span.innerText = cnt;
        }
        let totalPower = 0;
        for (let troop of allTroops) totalPower += (hero.armyDetails?.[troop.id] || 0) * (troop.attack + troop.defense);
        let powerSpan = document.getElementById('totalArmyPower');
        if (powerSpan) powerSpan.innerText = totalPower;
        document.querySelectorAll('.buy-btn').forEach(btn => {
            let troopId = btn.getAttribute('data-type');
            let qty = parseInt(btn.getAttribute('data-qty') || '1');
            let troop = allTroops.find(t => t.id === troopId);
            if (troop) btn.disabled = (hero.gold < troop.basePrice * qty);
        });
    }
    
    function buyTroop(typeId, quantity) {
        let hero = getSelectedHero();
        if (!hero) return;
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return;
        let totalCost = troop.basePrice * quantity;
        if (hero.gold < totalCost) {
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Нямате достатъчно злато!", "error");
            return;
        }
        hero.gold -= totalCost;
        if (!hero.armyDetails) hero.armyDetails = {};
        hero.armyDetails[typeId] = (hero.armyDetails[typeId] || 0) + quantity;
        syncWithGame(hero);
        if (window.showAdvisorPopup) window.showAdvisorPopup("УСПЕХ", `Купихте ${quantity} × ${troop.name}`, "success");
        updateMarketUI();
    }
    
    function sellTroop(typeId, quantity) {
        let hero = getSelectedHero();
        if (!hero) return;
        let troop = allTroops.find(t => t.id === typeId);
        if (!troop) return;
        let current = hero.armyDetails?.[typeId] || 0;
        if (current < quantity) {
            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Нямате толкова войници!", "error");
            return;
        }
        let refund = Math.floor(troop.basePrice * 0.6 * quantity);
        hero.gold += refund;
        hero.armyDetails[typeId] = current - quantity;
        syncWithGame(hero);
        if (window.showAdvisorPopup) window.showAdvisorPopup("ПРОДАЖБА", `Продадохте ${quantity} × ${troop.name} за ${refund} злато.`, "info");
        updateMarketUI();
    }
    
    function showMarket() {
        let old = document.getElementById('armyMarketModal');
        if (old) old.remove();
        
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.isJoined && h.isFavorite) heroes.push(h);
            }
        }
        if (!heroes.length && window.currentHero) heroes.push(window.currentHero);
        if (!heroes.length) { alert("Няма наети герои!"); return; }
        
        let hero = getSelectedHero() || heroes[0];
        selectedHeroId = hero.clan || hero.id;
        
        let heroOptions = heroes.map(h => `<option value="${h.clan || h.id}" ${selectedHeroId === (h.clan || h.id) ? 'selected' : ''}>${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`).join('');
        
        // Функция за генериране на карта на войска с описание
        function troopCard(t) {
            let cnt = hero.armyDetails?.[t.id] || 0;
            return `
            <div class="troop-card" style="background:rgba(0,0,0,0.5); border:1px solid #d4af37; border-radius:12px; padding:10px; margin:5px; transition:0.1s;">
                <div style="font-size:52px; text-align:center;">${t.icon}</div>
                <div style="font-weight:bold; color:#ffd700; text-align:center; font-size:16px;">${t.name}</div>
                <div style="font-size:11px; color:#ccc; text-align:center; margin:5px 0;">${t.desc || ''}</div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin:5px 0;">
                    <span>⚔️ ${t.attack}</span> <span>🛡️ ${t.defense}</span> <span>💰 ${t.basePrice}</span>
                </div>
                ${t.special ? `<div style="font-size:10px; color:#ffaa66; text-align:center;">✨ ${t.special}</div>` : ''}
                <div style="display:flex; justify-content:center; gap:8px; margin:8px 0;">
                    <button class="buy-btn" data-type="${t.id}" data-qty="1" style="background:#daa520; border:none; border-radius:20px; padding:5px 12px; cursor:pointer;">+1</button>
                    <button class="buy-btn" data-type="${t.id}" data-qty="10" style="background:#daa520; border:none; border-radius:20px; padding:5px 12px; cursor:pointer;">+10</button>
                    <button class="sell-btn" data-type="${t.id}" data-qty="1" style="background:#8b3a3a; border:none; border-radius:20px; padding:5px 12px; cursor:pointer;">-1</button>
                </div>
                <div style="text-align:center; font-size:12px;">📦 <span id="count-${t.id}">${cnt}</span></div>
            </div>
            `;
        }
        
        let basicHtml = basicTroops.map(t => troopCard(t)).join('');
        let fantasyHtml = fantasyTroops.map(t => troopCard(t)).join('');
        
        let html = `
        <div id="armyMarketModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:300000; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif;" onclick="if(event.target===this) window.armyMarket.hide();">
            <div style="background:#0a1a2e; border:2px solid #d4af37; border-radius:24px; width:95%; max-width:1300px; max-height:90vh; overflow-y:auto; padding:20px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                    <h2 style="color:#ffd700; margin:0;">🏰 ВОЕНЕН ПАЗАР</h2>
                    <span style="font-size:40px; cursor:pointer; color:#ffd700;" onclick="window.armyMarket.hide();">&times;</span>
                </div>
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
                    <div style="background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px;">💰 Злато: <span id="playerGoldAmount">${hero.gold}</span></div>
                    <div style="background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px;">⚔️ Сила: <span id="totalArmyPower">0</span></div>
                    <select id="heroSelect" style="background:#2c2c3a; color:#ffd966; border:1px solid #daa520; border-radius:20px; padding:5px 12px;">${heroOptions}</select>
                </div>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button class="tab-btn active" data-tab="basic" style="background:#daa520; border:none; border-radius:20px; padding:5px 15px; cursor:pointer;">⚔️ Основни (${basicTroops.length})</button>
                    <button class="tab-btn" data-tab="fantasy" style="background:#2c2c3a; border:none; border-radius:20px; padding:5px 15px; cursor:pointer;">✨ Фентъзи (${fantasyTroops.length})</button>
                </div>
                <div id="basic-tab" class="troop-shop" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:10px; max-height:55vh; overflow-y:auto; padding:5px;">${basicHtml}</div>
                <div id="fantasy-tab" class="troop-shop" style="display:none; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:10px; max-height:55vh; overflow-y:auto; padding:5px;">${fantasyHtml}</div>
                <div style="display:flex; justify-content:center; gap:15px; margin-top:20px; padding-top:10px; border-top:1px solid #d4af37;">
                    <button onclick="window.armyMarket.hide();" style="background:#2c1a0c; border:1px solid #d4af37; border-radius:30px; padding:6px 20px; color:#ffdd99; cursor:pointer;">Затвори</button>
                    <button id="quickBuyMaxBtn" style="background:#daa520; border:none; border-radius:30px; padding:6px 20px; color:#000; cursor:pointer;">💰 Купи макс. пехота</button>
                    <button id="resetArmyBtn" style="background:#5a2a2a; border:1px solid #ff6666; border-radius:30px; padding:6px 20px; color:#ffaaaa; cursor:pointer;">⚠️ Демобилизация</button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', html);
        let modal = document.getElementById('armyMarketModal');
        if (!modal) return;
        
        // Табове
        let tabs = modal.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.onclick = () => {
                tabs.forEach(b => b.style.background = '#2c2c3a');
                btn.style.background = '#daa520';
                let tabId = btn.getAttribute('data-tab');
                let basicDiv = modal.querySelector('#basic-tab');
                let fantasyDiv = modal.querySelector('#fantasy-tab');
                if (basicDiv && fantasyDiv) {
                    basicDiv.style.display = tabId === 'basic' ? 'grid' : 'none';
                    fantasyDiv.style.display = tabId === 'fantasy' ? 'grid' : 'none';
                }
            };
        });
        
        // Бутони за купуване/продаване
        modal.querySelectorAll('.buy-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                let troopId = btn.getAttribute('data-type');
                let qty = parseInt(btn.getAttribute('data-qty'));
                buyTroop(troopId, qty);
            };
        });
        modal.querySelectorAll('.sell-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                let troopId = btn.getAttribute('data-type');
                let qty = parseInt(btn.getAttribute('data-qty'));
                sellTroop(troopId, qty);
            };
        });
        
        // Селект за герой
        let heroSelect = modal.querySelector('#heroSelect');
        if (heroSelect) {
            heroSelect.onchange = () => {
                let newId = heroSelect.value;
                for (let h of heroes) { if ((h.clan || h.id) === newId) { selectedHeroId = newId; break; } }
                updateMarketUI();
            };
        }
        
        // Бързо купуване
        let quickBtn = modal.querySelector('#quickBuyMaxBtn');
        if (quickBtn) {
            quickBtn.onclick = () => {
                let hero = getSelectedHero();
                if (hero) {
                    let infantry = basicTroops.find(t => t.id === 'infantry');
                    if (infantry) buyTroop('infantry', Math.floor(hero.gold / infantry.basePrice));
                }
            };
        }
        
        // Демобилизация
        let resetBtn = modal.querySelector('#resetArmyBtn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                let hero = getSelectedHero();
                if (hero && confirm(`⚠️ Демобилизация ще продаде цялата армия на ${hero.name} с 60% от стойността! Сигурни ли сте?`)) {
                    let totalRefund = 0;
                    for (let t of allTroops) {
                        let cnt = hero.armyDetails?.[t.id] || 0;
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
            };
        }
        
        updateMarketUI();
    }
    
    function hideMarket() {
        let modal = document.getElementById('armyMarketModal');
        if (modal) modal.remove();
    }
    
    window.armyMarket = { show: showMarket, hide: hideMarket, buy: buyTroop, sell: sellTroop, sync: syncWithGame };
    console.log("✅ armyMarket.js – окончателна версия (с описания и големи иконки)");
})();
