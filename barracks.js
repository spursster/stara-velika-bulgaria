/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: barracks.js (ВЕРСИЯ 6.1 – ОПРАВЕНО ЗАТВАРЯНЕ)
==========================================================================
*/

// ==================== ГЛОБАЛНИ НАСТРОЙКИ ====================
window.barracksState = window.barracksState || {
    currentTab: 'basic',
    currentPage: 0,
    perPage: 5
};

// ==================== ЗАПАЗВАНЕ НА ЛЮБИМИТЕ ====================
function saveFavoriteHeroes() {
    try {
        let favorites = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let hero = window.worldData.clans[key];
                if (hero.isJoined === true && hero.isFavorite === true) {
                    favorites.push(hero.name || hero.leaderName || key);
                }
            }
        }
        localStorage.setItem('barracksFavorites', JSON.stringify(favorites));
    } catch(e) {}
}

function loadFavoriteHeroes() {
    try {
        const saved = localStorage.getItem('barracksFavorites');
        if (saved) {
            const favorites = JSON.parse(saved);
            if (window.worldData && window.worldData.clans) {
                for (let key in window.worldData.clans) {
                    let hero = window.worldData.clans[key];
                    if (hero.isJoined === true) {
                        const isFav = favorites.includes(hero.name || hero.leaderName || key);
                        hero.isFavorite = isFav;
                    }
                }
            }
        }
    } catch(e) {}
}

// ==================== HELPER ФУНКЦИИ ====================
function getAllUnlockedHeroes() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true) heroes.push(hero);
        }
    }
    heroes.forEach(h => {
        if (h.isFavorite === undefined) h.isFavorite = false;
        if (!h.armyDetails) h.armyDetails = {};
    });
    return heroes;
}

function getClassIcon(className) {
    if (!className) return "⚔️";
    const lower = className.toLowerCase();
    if (lower.includes("маг") || lower.includes("колобър") || lower.includes("мистик")) return "🧙";
    if (lower.includes("стрелец") || lower.includes("арчер")) return "🏹";
    if (lower.includes("върховен") || lower.includes("боил")) return "👑";
    if (lower.includes("нощен") || lower.includes("острие") || lower.includes("сенчест")) return "🗡️";
    if (lower.includes("иконом") || lower.includes("търговец")) return "💰";
    if (lower.includes("кръвожаден")) return "🩸";
    if (lower.includes("пазител")) return "🛡️";
    return "⚔️";
}

function getAllTroops() {
    if (window.armyMarket && window.armyMarket.getAllTroops) {
        return window.armyMarket.getAllTroops();
    }
    return {
        infantry: { id: "infantry", name: "Пехотинец", basePrice: 10, attack: 8, defense: 12, icon: "⚔️", desc: "Основна пехота" },
        archers: { id: "archers", name: "Стрелец", basePrice: 15, attack: 15, defense: 6, icon: "🏹", desc: "Далекобойни" },
        cavalry: { id: "cavalry", name: "Конник", basePrice: 30, attack: 25, defense: 18, icon: "🐎", desc: "Бързи атаки" },
        elite: { id: "elite", name: "Елитен войн", basePrice: 70, attack: 45, defense: 40, icon: "🛡️", desc: "Най-добрите" }
    };
}

function calculateArmyPower(hero) {
    if (!hero.armyDetails) return 0;
    const troops = getAllTroops();
    let total = 0;
    for (let id in troops) {
        let cnt = hero.armyDetails[id] || 0;
        total += cnt * (troops[id].attack + troops[id].defense);
    }
    return total;
}

// ==================== ОТВАРЯНЕ НА КАЗАРМИТЕ ====================
window.openBarracksUI = function() {
    let barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) {
        barracksContainer = document.createElement('div');
        barracksContainer.id = 'barracks-screen';
        barracksContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box;`;
        document.body.appendChild(barracksContainer);
    }
    barracksContainer.style.display = 'flex';
    window.renderBarracksLayout();
};

// ==================== ЗАТВАРЯНЕ НА КАЗАРМИТЕ ====================
window.closeBarracksUI = function() {
    const screen = document.getElementById('barracks-screen');
    if (screen) {
        screen.style.display = 'none';
        // Допълнително: премахваме фокуса върху елементи вътре, за да няма остатъчни събития
        if (screen.parentNode) screen.parentNode.focus();
    }
};

// ==================== ОСНОВНО РЕНДИРАНЕ ====================
window.renderBarracksLayout = function() {
    const barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) return;

    let allHeroes = getAllUnlockedHeroes();
    let favoriteHeroes = allHeroes.filter(h => h.isFavorite === true);
    
    favoriteHeroes.sort((a,b) => (b.level || 1) - (a.level || 1));
    
    window.barracksState.currentPage = 0;
    
    const maxPerPage = window.barracksState.perPage;
    let totalPages = Math.ceil(favoriteHeroes.length / maxPerPage);
    let currentPage = Math.min(window.barracksState.currentPage, totalPages - 1);
    if (currentPage < 0) currentPage = 0;
    let startIdx = currentPage * maxPerPage;
    let visibleFavorites = favoriteHeroes.slice(startIdx, startIdx + maxPerPage);

    let topSlotsHTML = '';
    for (let i = 0; i < maxPerPage; i++) {
        let hero = visibleFavorites[i];
        if (hero) {
            let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
            let reqXP = (window.rpgDatabase && typeof window.rpgDatabase.getXPRequiredForLevel === 'function') ? window.rpgDatabase.getXPRequiredForLevel(hero.level || 1) : 150;
            if (reqXP <= 0) reqXP = 1;
            let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));
            const fillGrad = hero.isAuto ? "linear-gradient(90deg, #00ffcc, #0072ff)" : "linear-gradient(90deg, #ffcc00, #ff6600)";
            const classIcon = getClassIcon(hero.currentClass);
            const heroPower = calculateArmyPower(hero);
            topSlotsHTML += `
                <div class="elite-hero-card" style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; max-width: 110px; padding: 8px 5px; text-align: center; position: relative; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;" onclick="window.showHeroInventoryInBarracks('${hero.name}')">
                    <span style="position: absolute; top: 2px; right: 4px; cursor: pointer; color: #ff3366; font-size: 12px; z-index: 10;" onclick="event.stopPropagation(); window.toggleHeroFavoriteInBarracks('${hero.name}')">${hero.isFavorite ? '❤️' : '🤍'}</span>
                    <div style="font-size: 10px; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px;">${classIcon} ${hero.name}</div>
                    <div style="font-size: 8px; color: #aaa;">Ниво ${hero.level || 1} | ${hero.currentClass || "Багатур"}</div>
                    <div style="font-size: 9px; color: #fff; margin: 2px 0;">⚔️ ${hero.armySize || 0} б.</div>
                    <div class="rpg-xp-container" title="Опит: ${currentXP}/${reqXP}" style="background:#222; height:3px; border-radius:2px; margin:3px 0; overflow:hidden; width: 100%;">
                        <div class="rpg-xp-fill" style="width:${xpPercent}%; height:100%; background:${fillGrad};"></div>
                    </div>
                    <div style="font-size: 7px; color: #88ff88;">💪 ${heroPower}</div>
                </div>
            `;
        } else {
            topSlotsHTML += `
                <div style="background: rgba(255,255,255,0.02); border: 2px dashed #444; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; padding: 8px; text-align: center; cursor: pointer; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;" onclick="window.showHeroSelectionModal()">
                    <div style="font-size: 16px; color: #666;">+</div>
                    <div style="font-size: 9px; color: #666;">Избери</div>
                </div>
            `;
        }
    }

    let paginationHTML = '';
    if (totalPages > 1) {
        paginationHTML = `
            <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 8px;">
                <button class="barracks-page-btn" data-page="prev" style="background:#2c1a0c; border:none; border-radius:50%; width:28px; height:28px; color:#ffd700; cursor:pointer;">←</button>
                <span style="font-size:10px; color:#aaa;">${currentPage+1} / ${totalPages}</span>
                <button class="barracks-page-btn" data-page="next" style="background:#2c1a0c; border:none; border-radius:50%; width:28px; height:28px; color:#ffd700; cursor:pointer;">→</button>
                <input id="barracks-goto-page" type="number" min="1" max="${totalPages}" value="${currentPage+1}" style="width:40px; background:#222; color:#fff; text-align:center; border:1px solid #d4af37; border-radius:4px;">
                <button id="barracks-goto-btn" style="background:#2c1a0c; border:none; border-radius:20px; padding:2px 8px; color:#ffd700; cursor:pointer;">Go</button>
            </div>
        `;
    }

    const heroesForSelect = getAllUnlockedHeroes();
    let heroOptions = heroesForSelect.map(h => `<option value="${h.name}">${getClassIcon(h.currentClass)} ${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`).join('');
    let selectedHeroName = window.selectedHeroForBuying || (heroesForSelect[0] ? heroesForSelect[0].name : "");

    const allTroops = getAllTroops();
    const basicTroops = ["infantry", "archers", "cavalry", "elite"];
    const fantasyTroops = Object.keys(allTroops).filter(id => !basicTroops.includes(id));
    
    let tabsHTML = `<div class="barracks-tabs" style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">`;
    tabsHTML += `<button class="barracks-tab-btn ${window.barracksState.currentTab === 'basic' ? 'active' : ''}" data-tab="basic">⚔️ Основни</button>`;
    if (fantasyTroops.length) {
        tabsHTML += `<button class="barracks-tab-btn ${window.barracksState.currentTab === 'fantasy' ? 'active' : ''}" data-tab="fantasy">✨ Фентъзи</button>`;
    }
    tabsHTML += `</div>`;

    let shopContent = '';
    if (window.barracksState.currentTab === 'basic') {
        shopContent = basicTroops.map(id => renderTroopCard(allTroops[id])).join('');
    } else if (window.barracksState.currentTab === 'fantasy') {
        shopContent = fantasyTroops.map(id => renderTroopCard(allTroops[id])).join('');
    }

    // ⭐ Генерираме HTML без onclick атрибути за затваряне – ще ги закачим после с JS
    barracksContainer.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 750px; max-height: 90vh; background: #111; border: 2px solid #d4af37; border-radius: 12px; padding: 50px 15px 15px 15px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; box-shadow: 0 0 40px rgba(0,0,0,0.9);">
            <button id="close-barracks-x" style="position: absolute; top: 8px; left: 8px; width: 36px; height: 36px; background: rgba(255,80,80,0.2); border: none; color: #ff8888; border-radius: 50%; font-size: 18px; cursor: pointer;">✕</button>

            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 18px;">ВОЕННИ КАЗАРМИ</h1>
                <div style="background: rgba(255,215,0,0.1); border: 1px solid #ffd700; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; color: #ffd700;">💰 <span id="barracksGoldDisplay">0</span></div>
            </div>

            <div>
                <div style="font-size: 11px; color: #ffd700; margin-bottom: 6px;">📋 ЕЛИТЕН ОТРЯД (ФАВОРИТИ):</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid #222; justify-content: center;">
                    ${topSlotsHTML}
                </div>
                ${paginationHTML}
            </div>

            <div style="background: rgba(0,0,0,0.3); border: 1px solid #222; border-radius: 8px; padding: 15px; gap: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
                    <label style="font-size: 11px; color:#ffd700;">👤 За герой:</label>
                    <select id="heroBuySelect" style="background:#2c2c3a; color:#ffd966; border:1px solid #daa520; border-radius:20px; padding:4px 12px; font-size:11px; flex:1;">${heroOptions}</select>
                    <div style="font-size: 10px; color: #88ff88;" id="heroArmyPowerDisplay">💪 Сила: 0</div>
                </div>

                ${tabsHTML}
                <div id="barracks-shop-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; max-height: 280px; overflow-y: auto; padding: 5px;">
                    ${shopContent}
                </div>
            </div>

            <div style="text-align: center;">
                <button id="close-barracks-footer" style="background: #222; border: 1px solid #444; color: #aaa; padding: 10px 30px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; width: 100%;">ИЗХОД ОТ КАЗАРМИТЕ</button>
            </div>
        </div>
    `;

    // ⭐⭐ ЗАКАЧВАНЕ НА EVENT LISTENERS ЗА ЗАТВАРЯНЕ ⭐⭐
    const closeBtnX = document.getElementById('close-barracks-x');
    const closeBtnFooter = document.getElementById('close-barracks-footer');
    const closeHandler = function() {
        console.log("Затваряне на казармите...");
        const screen = document.getElementById('barracks-screen');
        if (screen) screen.style.display = 'none';
    };
    if (closeBtnX) closeBtnX.onclick = closeHandler;
    if (closeBtnFooter) closeBtnFooter.onclick = closeHandler;

    // Обновяване на златото и силата
    const selectedHero = heroesForSelect.find(h => h.name === selectedHeroName);
    const goldSpan = document.getElementById('barracksGoldDisplay');
    if (goldSpan && selectedHero) goldSpan.innerText = selectedHero.gold || 0;
    const powerSpan = document.getElementById('heroArmyPowerDisplay');
    if (powerSpan && selectedHero) powerSpan.innerText = `💪 Сила: ${calculateArmyPower(selectedHero)}`;

    const heroSelect = document.getElementById('heroBuySelect');
    if (heroSelect) {
        heroSelect.value = selectedHeroName;
        heroSelect.addEventListener('change', (e) => {
            window.selectedHeroForBuying = e.target.value;
            const newHero = heroesForSelect.find(h => h.name === e.target.value);
            if (newHero) {
                if (goldSpan) goldSpan.innerText = newHero.gold || 0;
                if (powerSpan) powerSpan.innerText = `💪 Сила: ${calculateArmyPower(newHero)}`;
            }
        });
    }

    // Странициране
    document.querySelectorAll('.barracks-page-btn').forEach(btn => {
        btn.onclick = () => {
            if (btn.dataset.page === 'prev') window.barracksState.currentPage--;
            else window.barracksState.currentPage++;
            window.barracksState.currentPage = Math.min(Math.max(0, window.barracksState.currentPage), totalPages - 1);
            window.renderBarracksLayout();
        };
    });
    const gotoBtn = document.getElementById('barracks-goto-btn');
    if (gotoBtn) {
        gotoBtn.onclick = () => {
            let page = parseInt(document.getElementById('barracks-goto-page').value) - 1;
            if (isNaN(page)) page = 0;
            window.barracksState.currentPage = Math.min(Math.max(0, page), totalPages - 1);
            window.renderBarracksLayout();
        };
    }

    document.querySelectorAll('.barracks-tab-btn').forEach(btn => {
        btn.onclick = () => {
            window.barracksState.currentTab = btn.dataset.tab;
            window.renderBarracksLayout();
        };
    });
};

function renderTroopCard(troop) {
    const heroName = document.getElementById('heroBuySelect')?.value;
    let hero = null;
    if (heroName) {
        const heroes = getAllUnlockedHeroes();
        hero = heroes.find(h => h.name === heroName);
    }
    const currentCount = hero ? (hero.armyDetails[troop.id] || 0) : 0;
    const price = troop.basePrice;
    return `
        <div class="troop-card" style="background: rgba(20,20,30,0.6); border: 1px solid #d4af37; border-radius: 12px; padding: 8px; text-align: center;">
            <div style="font-size: 28px;">${troop.icon || '⚔️'}</div>
            <div style="font-weight: bold; color: #ffd700;">${troop.name}</div>
            <div style="font-size: 9px; color: #aaa;">⚔️ ${troop.attack} | 🛡️ ${troop.defense}</div>
            <div style="font-size: 10px; color: #ffaa44;">💰 ${price} злато</div>
            <div style="font-size: 9px;">📦 Имаш: ${currentCount}</div>
            <div style="display: flex; justify-content: center; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
                <button class="buy-quick" data-troop="${troop.id}" data-qty="1" style="background:#daa520; border:none; border-radius: 20px; padding: 2px 8px; color:#000; cursor:pointer;">+1</button>
                <button class="buy-quick" data-troop="${troop.id}" data-qty="10" style="background:#daa520; border:none; border-radius: 20px; padding: 2px 8px; color:#000; cursor:pointer;">+10</button>
                <button class="buy-quick" data-troop="${troop.id}" data-qty="50" style="background:#daa520; border:none; border-radius: 20px; padding: 2px 8px; color:#000; cursor:pointer;">+50</button>
                <button class="buy-max" data-troop="${troop.id}" style="background:#daa520; border:none; border-radius: 20px; padding: 2px 8px; color:#000; cursor:pointer;">Макс</button>
            </div>
        </div>
    `;
}

function buyTroops(troopId, quantity) {
    const heroSelect = document.getElementById('heroBuySelect');
    if (!heroSelect) return;
    const heroName = heroSelect.value;
    const allHeroes = getAllUnlockedHeroes();
    const hero = allHeroes.find(h => h.name === heroName);
    if (!hero) return;
    const troops = getAllTroops();
    const troop = troops[troopId];
    if (!troop) return;
    const totalCost = troop.basePrice * quantity;
    if (hero.gold < totalCost) {
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("ГРЕШКА", `${hero.name} няма достатъчно злато! (Нужни: ${totalCost})`, "error");
        } else {
            alert(`❌ ${hero.name} няма достатъчно злато! (Нужни: ${totalCost})`);
        }
        return;
    }
    if (window.armyMarket && typeof window.armyMarket.buy === 'function') {
        const result = window.armyMarket.buy(troopId, quantity, hero);
        if (result === false) return;
    } else {
        hero.gold -= totalCost;
        if (!hero.armyDetails) hero.armyDetails = {};
        hero.armyDetails[troopId] = (hero.armyDetails[troopId] || 0) + quantity;
        let total = 0;
        for (let t in hero.armyDetails) total += hero.armyDetails[t] || 0;
        hero.armySize = total;
        hero.currentArmy = total;
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.clan]) {
            window.worldData.clans[hero.clan].gold = hero.gold;
            window.worldData.clans[hero.clan].armyDetails = hero.armyDetails;
            window.worldData.clans[hero.clan].armySize = hero.armySize;
        }
        if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(hero);
    }
    window.renderBarracksLayout();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    if (window.addWorldEvent) {
        window.addWorldEvent(`🛒 КУПУВА НА АРМИЯ`, `${hero.name} купи ${quantity} × ${troop.name} за ${totalCost} злато.`, "💰");
    }
}

document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList && target.classList.contains('buy-quick')) {
        const troopId = target.dataset.troop;
        const qty = parseInt(target.dataset.qty);
        if (troopId && qty) buyTroops(troopId, qty);
    }
    if (target.classList && target.classList.contains('buy-max')) {
        const troopId = target.dataset.troop;
        if (!troopId) return;
        const heroSelect = document.getElementById('heroBuySelect');
        if (!heroSelect) return;
        const heroName = heroSelect.value;
        const heroes = getAllUnlockedHeroes();
        const hero = heroes.find(h => h.name === heroName);
        if (!hero) return;
        const troops = getAllTroops();
        const troop = troops[troopId];
        const maxQty = Math.floor(hero.gold / troop.basePrice);
        if (maxQty > 0) buyTroops(troopId, maxQty);
        else {
            if (window.showAdvisorPopup) {
                window.showAdvisorPopup("ГРЕШКА", "Няма достатъчно злато дори за 1 брой!", "error");
            } else {
                alert(`❌ Няма достатъчно злато дори за 1 брой!`);
            }
        }
    }
});

window.showHeroInventoryInBarracks = function(heroName) {
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (!hero) return;
    if (typeof window.showHeroProfile === 'function') window.showHeroProfile(hero);
    else {
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("ГРЕШКА", "Инвентарът не е достъпен.", "error");
        } else {
            alert("Инвентарът не е достъпен.");
        }
    }
};

window.showHeroSelectionModal = function() {
    let allHeroes = getAllUnlockedHeroes();
    let availableToChoose = allHeroes.filter(h => !h.isFavorite);
    let modal = document.getElementById('hero-selection-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hero-selection-modal';
        document.body.appendChild(modal);
    }
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box;`;
    let listHTML = availableToChoose.map(hero => {
        const classIcon = getClassIcon(hero.currentClass);
        return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                <span style="font-weight: bold; color: #fff; font-size: 13px;">${classIcon} ${hero.name} (Ниво ${hero.level || 1})</span>
                <button class="add-favorite-btn" data-name="${hero.name}" style="background: #d4af37; color:#000; border:none; padding: 5px 12px; font-weight:bold; border-radius:4px; cursor:pointer;">🤍 ДОБАВИ</button>
            </div>
        `;
    }).join('');
    if (availableToChoose.length === 0) listHTML = `<div style="color: #666; text-align: center; padding: 20px;">Всички герои са добавени в отряда.</div>`;
    modal.innerHTML = `
        <div style="position: relative; background: #151515; border: 2px solid #ffd700; border-radius: 8px; width: 100%; max-width: 400px; max-height: 75vh; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
            <button class="close-modal-x" style="position: absolute; top: 5px; right: 5px; width: 36px; height: 36px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 18px; cursor: pointer;">✕</button>
            <h3 style="color: #ffd700; margin: 0; font-size: 16px; text-align: center;">ИЗБЕРИ ГЕРОЙ ЗА ОТРЯД</h3>
            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">${listHTML}</div>
        </div>
    `;
    modal.style.display = 'flex';
    modal.querySelectorAll('.add-favorite-btn').forEach(btn => {
        btn.onclick = () => {
            const heroName = btn.getAttribute('data-name');
            const hero = allHeroes.find(h => h.name === heroName);
            if (hero) {
                let currentFavs = allHeroes.filter(h => h.isFavorite === true).length;
                if (currentFavs >= 5) {
                    if (window.showAdvisorPopup) {
                        window.showAdvisorPopup("ВНИМАНИЕ", "Можеш да имаш максимум 5 избрани героя в отряда!", "warning");
                    } else {
                        alert("Можеш да имаш максимум 5 избрани героя в отряда!");
                    }
                    return;
                }
                hero.isFavorite = true;
                saveFavoriteHeroes();
                modal.remove();
                window.barracksState.currentPage = 0;
                window.renderBarracksLayout();
                if (typeof window.renderFavoriteHeroesBar === 'function') {
                    window.renderFavoriteHeroesBar();
                }
            }
        };
    });
    modal.querySelectorAll('.close-modal-x').forEach(btn => btn.onclick = () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.selectHeroAsFavorite = function(heroName) {
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (hero) {
        let currentFavs = allHeroes.filter(h => h.isFavorite === true).length;
        if (currentFavs >= 5) {
            if (window.showAdvisorPopup) {
                window.showAdvisorPopup("ВНИМАНИЕ", "Максимум 5 героя в отряда!", "warning");
            } else {
                alert("Максимум 5 героя в отряда!");
            }
            return;
        }
        hero.isFavorite = true;
        saveFavoriteHeroes();
        let modal = document.getElementById('hero-selection-modal');
        if (modal) modal.remove();
        window.barracksState.currentPage = 0;
        window.renderBarracksLayout();
        if (typeof window.renderFavoriteHeroesBar === 'function') {
            window.renderFavoriteHeroesBar();
        }
    }
};

window.toggleHeroFavoriteInBarracks = function(heroName) {
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (hero) {
        hero.isFavorite = !hero.isFavorite;
        saveFavoriteHeroes();
        if (typeof window.renderFavoriteHeroesBar === 'function') {
            window.renderFavoriteHeroesBar();
        }
        if (typeof window.renderBarracksLayout === 'function') {
            window.renderBarracksLayout();
        }
    }
};

// Функцията closeBarracksUI вече е дефинирана по-горе (преместена)
// Повтаряме дефиницията за всеки случай, но няма да дублираме.

(function addCoinAnimationStyle() {
    if (document.getElementById('coin-animation-style')) return;
    const style = document.createElement('style');
    style.id = 'coin-animation-style';
    style.textContent = `
        @keyframes coinFlip {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-80px) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();

// Зареждане на любимите при стартиране
loadFavoriteHeroes();
