// ======================== АРМИЯ ПАЗАР – НАПЪЛНО САМОСТОЯТЕЛНА ВЕРСИЯ ========================
(function() {
    // ----------------------------------------------------------------------
    // 1. ДОБАВЯНЕ НА ЛИПСВАЩИ ВОЙСКИ (ако не съществуват)
    // ----------------------------------------------------------------------
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

    // ----------------------------------------------------------------------
    // 2. ГЛОБАЛНИ КОНСТАНТИ
    // ----------------------------------------------------------------------
    const allTroops = window.ALL_TROOP_TYPES;
    const allTroopIds = window.ALL_TROOP_IDS;
    const basicTroopIds = ["infantry","archers","cavalry","elite","spearman","maceman","crossbowman","lightCavalry","heavyCavalry","axeman","pikeman","slinger","chariot","royalGuard"];
    const fantasyTroopIds = allTroopIds.filter(id => !basicTroopIds.includes(id));
    const basicTroops = allTroops.filter(t => basicTroopIds.includes(t.id));
    const fantasyTroops = allTroops.filter(t => fantasyTroopIds.includes(t.id));

    let currentSelectedHeroId = null;   // id на героя, избран в падащото меню

    // ----------------------------------------------------------------------
    // 3. ПОМОЩНИ ФУНКЦИИ (не зависят от window.currentHero)
    // ----------------------------------------------------------------------
    function getSelectedHero() {
        if (currentSelectedHeroId && window.worldData.clans[currentSelectedHeroId]) {
            return window.worldData.clans[currentSelectedHeroId];
        }
        // Ако няма избран, връщаме първия любим герой (ако има)
        for (let key in window.worldData.clans) {
            let h = window.worldData.clans[key];
            if (h.isJoined && h.isFavorite) return h;
        }
        return null;
    }

    // Обновяване на лентата с любими герои, общата лента и левия панел (най-силен герой)
    function refreshFavoritesBar() {
        if (typeof window.renderFavoriteHeroesBar === 'function') {
            const container = document.getElementById('favorite-heroes-bar');
            if (container) container.innerHTML = '';
            window.renderFavoriteHeroesBar();
        }
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        // Обновяваме левия панел, за да покаже най-силния герой (неговата сила и злато)
        if (typeof window.updateStrongestHeroUI === 'function') {
            window.updateStrongestHeroUI();
        }
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
    }

    // ----------------------------------------------------------------------
    // 4. ОСНОВНИ ДЕЙСТВИЯ (покупка / продажба)
    // ----------------------------------------------------------------------
    function buyTroop(typeId, quantity) {
        const hero = getSelectedHero();
        if (!hero) return;
        const troop = allTroops.find(t => t.id === typeId);
        if (!troop) return;
        const totalCost = troop.basePrice * quantity;
        if (hero.gold < totalCost) return;   // няма известие – просто мълчалив отказ
        hero.gold -= totalCost;
        if (!hero.armyDetails) hero.armyDetails = {};
        hero.armyDetails[typeId] = (hero.armyDetails[typeId] || 0) + quantity;
        // Преизчисляване на общата армия
        let total = 0;
        for (let id of allTroopIds) total += hero.armyDetails[id] || 0;
        hero.armySize = total;
        hero.currentArmy = total;
        refreshFavoritesBar();
    }

    function sellTroop(typeId, quantity) {
        const hero = getSelectedHero();
        if (!hero) return;
        const troop = allTroops.find(t => t.id === typeId);
        if (!troop) return;
        const current = hero.armyDetails?.[typeId] || 0;
        if (current < quantity) return;
        const refund = Math.floor(troop.basePrice * 0.6 * quantity);
        hero.gold += refund;
        hero.armyDetails[typeId] = current - quantity;
        let total = 0;
        for (let id of allTroopIds) total += hero.armyDetails[id] || 0;
        hero.armySize = total;
        hero.currentArmy = total;
        refreshFavoritesBar();
    }

    // ----------------------------------------------------------------------
    // 5. ОБНОВЯВАНЕ НА МОДАЛА С ДАННИТЕ НА ИЗБРАНИЯ ГЕРОЙ
    // ----------------------------------------------------------------------
    function updateModalContent(modal, hero) {
        // Злато
        const goldSpan = modal.querySelector('#playerGoldAmount');
        if (goldSpan) goldSpan.innerText = hero.gold;
        // Обща бойна сила
        let totalPower = 0;
        for (let t of allTroops) totalPower += (hero.armyDetails?.[t.id] || 0) * (t.attack + t.defense);
        const powerSpan = modal.querySelector('#totalArmyPower');
        if (powerSpan) powerSpan.innerText = totalPower;
        // Бройки за всеки тип войска
        for (let t of allTroops) {
            const cntSpan = modal.querySelector(`#count-${t.id}`);
            if (cntSpan) cntSpan.innerText = hero.armyDetails?.[t.id] || 0;
        }
        // Обновяване на падащото меню – за да се види новото злато на всички герои
        const heroSelect = modal.querySelector('#heroSelect');
        if (heroSelect) {
            let heroesList = [];
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.isJoined && h.isFavorite) heroesList.push(h);
            }
            heroSelect.innerHTML = heroesList.map(h => {
                const selectedAttr = (currentSelectedHeroId === (h.clan || h.id)) ? 'selected' : '';
                return `<option value="${h.clan || h.id}" ${selectedAttr}>${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`;
            }).join('');
        }
    }

    // ----------------------------------------------------------------------
    // 6. ПОКАЗВАНЕ НА МОДАЛА
    // ----------------------------------------------------------------------
    function showMarket() {
        const oldModal = document.getElementById('armyMarketModal');
        if (oldModal) oldModal.remove();

        // Събираме всички любими герои
        let heroes = [];
        for (let key in window.worldData.clans) {
            let h = window.worldData.clans[key];
            if (h.isJoined && h.isFavorite) heroes.push(h);
        }
        if (!heroes.length) {
            alert("Няма наети любими герои! Наемете герой първо.");
            return;
        }

        let selectedHero = getSelectedHero();
        if (!selectedHero) selectedHero = heroes[0];
        currentSelectedHeroId = selectedHero.clan || selectedHero.id;

        const heroOptions = heroes.map(h => {
            const selectedAttr = (currentSelectedHeroId === (h.clan || h.id)) ? 'selected' : '';
            return `<option value="${h.clan || h.id}" ${selectedAttr}>${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`;
        }).join('');

        // Функция за генериране на HTML карта за един тип войска
        function troopCard(t) {
            const cnt = selectedHero.armyDetails?.[t.id] || 0;
            return `
            <div class="troop-card" style="background:rgba(0,0,0,0.5); border:1px solid #d4af37; border-radius:12px; padding:10px; margin:5px;">
                <div style="font-size:52px; text-align:center;">${t.icon}</div>
                <div style="font-weight:bold; color:#ffd700; text-align:center;">${t.name}</div>
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
                <div style="text-align:center;">📦 <span id="count-${t.id}">${cnt}</span></div>
            </div>`;
        }

        const basicHtml = basicTroops.map(t => troopCard(t)).join('');
        const fantasyHtml = fantasyTroops.map(t => troopCard(t)).join('');

        const modalHtml = `
        <div id="armyMarketModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); z-index:300000; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif;" onclick="if(event.target===this) window.armyMarket.hide();">
            <div style="background:#0a1a2e; border:2px solid #d4af37; border-radius:24px; width:95%; max-width:1300px; max-height:90vh; overflow-y:auto; padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                    <h2 style="color:#ffd700;">🏰 ВОЕНЕН ПАЗАР</h2>
                    <span style="font-size:40px; cursor:pointer; color:#ffd700;" onclick="window.armyMarket.hide();">&times;</span>
                </div>
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
                    <div style="background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px;">💰 Злато: <span id="playerGoldAmount">${selectedHero.gold}</span></div>
                    <div style="background:rgba(0,0,0,0.5); padding:5px 12px; border-radius:20px;">⚔️ Сила: <span id="totalArmyPower">0</span></div>
                    <select id="heroSelect" style="background:#2c2c3a; color:#ffd966; border:1px solid #daa520; border-radius:20px; padding:5px 12px;">${heroOptions}</select>
                </div>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button class="tab-btn active" data-tab="basic" style="background:#daa520; border:none; border-radius:20px; padding:5px 15px; cursor:pointer;">⚔️ Основни (${basicTroops.length})</button>
                    <button class="tab-btn" data-tab="fantasy" style="background:#2c2c3a; border:none; border-radius:20px; padding:5px 15px; cursor:pointer;">✨ Фентъзи (${fantasyTroops.length})</button>
                </div>
                <div id="basic-tab" class="troop-shop" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:10px; max-height:55vh; overflow-y:auto;">${basicHtml}</div>
                <div id="fantasy-tab" class="troop-shop" style="display:none; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:10px; max-height:55vh; overflow-y:auto;">${fantasyHtml}</div>
                <div style="display:flex; justify-content:center; gap:15px; margin-top:20px; padding-top:10px; border-top:1px solid #d4af37;">
                    <button onclick="window.armyMarket.hide();" style="background:#2c1a0c; border:1px solid #d4af37; border-radius:30px; padding:6px 20px; color:#ffdd99; cursor:pointer;">Затвори</button>
                    <button id="quickBuyMaxBtn" style="background:#daa520; border:none; border-radius:30px; padding:6px 20px; color:#000; cursor:pointer;">💰 Купи макс. пехота</button>
                    <button id="resetArmyBtn" style="background:#5a2a2a; border:1px solid #ff6666; border-radius:30px; padding:6px 20px; color:#ffaaaa; cursor:pointer;">⚠️ Демобилизация</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById('armyMarketModal');
        if (!modal) return;

        // ----- Табове -----
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                modal.querySelectorAll('.tab-btn').forEach(b => b.style.background = '#2c2c3a');
                btn.style.background = '#daa520';
                const tab = btn.getAttribute('data-tab');
                const basicDiv = modal.querySelector('#basic-tab');
                const fantasyDiv = modal.querySelector('#fantasy-tab');
                if (basicDiv && fantasyDiv) {
                    basicDiv.style.display = tab === 'basic' ? 'grid' : 'none';
                    fantasyDiv.style.display = tab === 'fantasy' ? 'grid' : 'none';
                }
            };
        });

        // ----- Селект – смяна на героя -----
        const heroSelect = modal.querySelector('#heroSelect');
        if (heroSelect) {
            heroSelect.onchange = () => {
                const newId = heroSelect.value;
                for (let h of heroes) {
                    if ((h.clan || h.id) === newId) {
                        currentSelectedHeroId = newId;
                        break;
                    }
                }
                const newHero = getSelectedHero();
                if (newHero) updateModalContent(modal, newHero);
            };
        }

        // ----- Функция за опресняване на модала след покупка/продажба -----
        function refreshModalAfterAction() {
            const updatedHero = getSelectedHero();
            if (updatedHero) updateModalContent(modal, updatedHero);
            refreshFavoritesBar();  // обновява лентата с любими и левия панел
        }

        // ----- Бутони за покупка -----
        modal.querySelectorAll('.buy-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const troopId = btn.getAttribute('data-type');
                const qty = parseInt(btn.getAttribute('data-qty'), 10);
                buyTroop(troopId, qty);
                refreshModalAfterAction();
            };
        });

        // ----- Бутони за продажба -----
        modal.querySelectorAll('.sell-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const troopId = btn.getAttribute('data-type');
                const qty = parseInt(btn.getAttribute('data-qty'), 10);
                sellTroop(troopId, qty);
                refreshModalAfterAction();
            };
        });

        // ----- Бързо купуване на пехота -----
        const quickBtn = modal.querySelector('#quickBuyMaxBtn');
        if (quickBtn) {
            quickBtn.onclick = () => {
                const heroLocal = getSelectedHero();
                const infantry = basicTroops.find(t => t.id === 'infantry');
                if (infantry && heroLocal) {
                    const maxQty = Math.floor(heroLocal.gold / infantry.basePrice);
                    if (maxQty > 0) buyTroop('infantry', maxQty);
                    refreshModalAfterAction();
                }
            };
        }

        // ----- Демобилизация (продава всичко с 60% от стойността) -----
        const resetBtn = modal.querySelector('#resetArmyBtn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                const heroLocal = getSelectedHero();
                if (heroLocal && confirm(`⚠️ Демобилизация ще продаде цялата армия на ${heroLocal.name} с 60% от стойността! Сигурни ли сте?`)) {
                    let totalRefund = 0;
                    for (let t of allTroops) {
                        const cnt = heroLocal.armyDetails?.[t.id] || 0;
                        if (cnt) {
                            totalRefund += Math.floor(t.basePrice * 0.6 * cnt);
                            heroLocal.armyDetails[t.id] = 0;
                        }
                    }
                    heroLocal.gold += totalRefund;
                    heroLocal.armySize = 0;
                    heroLocal.currentArmy = 0;
                    refreshModalAfterAction();
                }
            };
        }

        // Инициализиране на модала с данните на първоначално избрания герой
        updateModalContent(modal, selectedHero);
    }

    // ----------------------------------------------------------------------
    // 7. СКРИВАНЕ НА МОДАЛА
    // ----------------------------------------------------------------------
    function hideMarket() {
        const modal = document.getElementById('armyMarketModal');
        if (modal) modal.remove();
    }

    // ----------------------------------------------------------------------
    // 8. ЕКСПОРТ НА ПУБЛИЧНОТО API
    // ----------------------------------------------------------------------
    window.armyMarket = {
        show: showMarket,
        hide: hideMarket,
        buy: buyTroop,
        sell: sellTroop,
        sync: refreshFavoritesBar   // за външна синхронизация, ако е нужна
    };

    console.log("✅ armyMarket.js – напълно самостоятелна версия (без active hero, с обновяване на лентата и левия панел)");
})();
