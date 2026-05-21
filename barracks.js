/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: barracks.js (КАЗАРМИ - МУЛТИ-ГЕРОЙ, ПАГИНАЦИЯ, ИНВЕНТАР, ИКОНИ НА КЛАСОВЕ)
СТАТУС: НАПЪЛНО ОБНОВЕН С ПОДКРЕПА ЗА 5+ ЛЮБИМЦИ, ЗАРЕДИ ОЩЕ, ОБРАТНА НАВИГАЦИЯ
==========================================================================
*/

// ---------- Помощни функции ----------
function getAllUnlockedHeroes() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) heroes.push(clan);
        }
    }
    if (heroes.length === 0 && window.currentHero) heroes.push(window.currentHero);
    return heroes;
}

function getFavoriteHeroes() {
    return getAllUnlockedHeroes().filter(h => h.isFavoriteInBarracks === true);
}

function getHeroClassIcon(hero) {
    if (!hero || !hero.currentClass) return "🛡️";
    const cls = hero.currentClass.toLowerCase();
    if (cls.includes("върховен") || cls.includes("боил")) return "⚔️";
    if (cls.includes("нощно") || cls.includes("острие")) return "🗡️";
    if (cls.includes("колобър")) return "🔮";
    if (cls.includes("иконом")) return "📜";
    if (cls.includes("гвардеец")) return "🛡️";
    if (cls.includes("сенчест")) return "🌑";
    if (cls.includes("кръвожаден")) return "🩸";
    if (cls.includes("пазител")) return "🏺";
    if (cls.includes("багатур")) return "🏹";
    return "🎖️";
}

// ---------- Пагинация на любимците ----------
window.barracksFavPage = 0;
const FAV_PER_PAGE = 5;

function renderFavoritesPage() {
    const container = document.getElementById('barracks-favorites-container');
    if (!container) return;
    const favorites = getFavoriteHeroes();
    const totalPages = Math.ceil(favorites.length / FAV_PER_PAGE);
    if (window.barracksFavPage >= totalPages) window.barracksFavPage = Math.max(0, totalPages - 1);
    const start = window.barracksFavPage * FAV_PER_PAGE;
    const pageFavs = favorites.slice(start, start + FAV_PER_PAGE);

    let slotsHTML = '';
    for (let i = 0; i < FAV_PER_PAGE; i++) {
        const hero = pageFavs[i];
        if (hero) {
            const currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
            let reqXP = 150;
            if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) {
                reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level || 1);
            }
            if (reqXP <= 0) reqXP = 1;
            const xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));
            const fillGrad = hero.isAuto ? "linear-gradient(90deg, #00ffcc, #0072ff)" : "linear-gradient(90deg, #ffcc00, #ff6600)";
            const classIcon = getHeroClassIcon(hero);
            slotsHTML += `
                <div class="elite-hero-card" style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; max-width: 110px; padding: 8px 5px; text-align: center; position: relative; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
                    <span style="position: absolute; top: 2px; right: 4px; cursor: pointer; color: #ff3366; font-size: 12px; z-index: 10;" onclick="window.toggleLeaderFavoriteInBarracks('${hero.name}')">❤️</span>
                    <div style="font-size: 10px; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px; cursor: pointer;" title="Кликни за инвентар" onclick="window.showHeroInventoryModal('${hero.clan || hero.name}')">
                        ${classIcon} ${hero.name}
                    </div>
                    <div style="font-size: 8px; color: #aaa;">Ниво ${hero.level || 1} | ${hero.currentClass || "Багатур"}</div>
                    <div style="font-size: 9px; color: #fff; margin: 2px 0;">⚔️ ${hero.armySize || 0}</div>
                    <div class="rpg-xp-container" title="Опит: ${currentXP}/${reqXP}" style="background:#222; height:3px; border-radius:2px; margin:3px 0; overflow:hidden; width: 100%;">
                        <div class="rpg-xp-fill" style="width:${xpPercent}%; height:100%; background:${fillGrad};"></div>
                    </div>
                </div>
            `;
        } else {
            slotsHTML += `
                <div style="background: rgba(255,255,255,0.02); border: 2px dashed #444; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; padding: 8px; text-align: center; cursor: pointer; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;" onclick="window.showLeaderSelectionModal()">
                    <div style="font-size: 16px; color: #666;">+</div>
                    <div style="font-size: 9px; color: #666;">Избери</div>
                </div>
            `;
        }
    }

    container.innerHTML = slotsHTML;
    document.getElementById('fav-prev-btn').style.display = totalPages > 1 ? 'inline-block' : 'none';
    document.getElementById('fav-next-btn').style.display = totalPages > 1 ? 'inline-block' : 'none';
    document.getElementById('fav-page-indicator').innerText = `${window.barracksFavPage+1}/${totalPages || 1}`;
}

function nextFavPage() {
    const total = Math.ceil(getFavoriteHeroes().length / FAV_PER_PAGE);
    if (window.barracksFavPage + 1 < total) {
        window.barracksFavPage++;
        renderFavoritesPage();
    }
}
function prevFavPage() {
    if (window.barracksFavPage > 0) {
        window.barracksFavPage--;
        renderFavoritesPage();
    }
}

// ---------- Инвентарен модал за герой ----------
window.showHeroInventoryModal = function(heroId) {
    let hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[heroId]) hero = window.worldData.clans[heroId];
    else if (window.currentHero && (window.currentHero.clan === heroId || window.currentHero.name === heroId)) hero = window.currentHero;
    else {
        const all = getAllUnlockedHeroes();
        hero = all.find(h => h.clan === heroId || h.name === heroId);
    }
    if (!hero) {
        alert("Героят не е намерен!");
        return;
    }
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    let equipmentHtml = '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">';
    const slotLabels = ["Шлем", "Нагръдник", "Оръжие", "Щит", "Ръкавици", "Ботуши", "Амулет", "Пръстен 1", "Пръстен 2"];
    for (let i = 0; i < 9; i++) {
        const item = hero.equipment && hero.equipment[i] ? hero.equipment[i] : null;
        equipmentHtml += `<div style="background:#2c1a0c; border-radius:8px; padding:8px; text-align:center; border:1px solid #c9a87b;">
            <div style="font-size:20px;">${item ? (item.icon || '🏺') : '❓'}</div>
            <div style="font-size:8px; color:#ffdd99;">${item ? item.name.substring(0,12) : slotLabels[i]}</div>
        </div>`;
    }
    equipmentHtml += '</div>';

    let inventoryHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99;">🎒 Съкровищница</h4><div style="display:flex; flex-wrap:wrap; gap:6px;">';
    if (hero.inventory && hero.inventory.length) {
        hero.inventory.forEach(art => {
            if (art && art.id) inventoryHtml += `<div style="background:#2c1a0c; border-radius:6px; padding:4px 8px; font-size:11px;">${art.icon || '🏺'} ${art.name}</div>`;
        });
    } else inventoryHtml += '<span style="color:#888;">Няма артефакти</span>';
    inventoryHtml += '</div></div>';

    let modal = document.createElement('div');
    modal.id = 'hero-inventory-modal';
    modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:20000; display:flex; align-items:center; justify-content:center;`;
    modal.innerHTML = `
        <div style="background:#1a1a2e; border:2px solid #d4af37; border-radius:24px; width:90%; max-width:500px; max-height:85vh; overflow-y:auto; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="color:#ffd700; margin:0;">${hero.name} (${hero.currentClass || "Багатур"})</h2>
                <button onclick="this.closest('#hero-inventory-modal').remove()" style="background:#8b0000; border:none; color:white; border-radius:50%; width:30px; height:30px; cursor:pointer;">✕</button>
            </div>
            <h3 style="color:#ffdd99;">🛡️ Екипировка</h3>
            ${equipmentHtml}
            ${inventoryHtml}
            <button onclick="document.getElementById('hero-inventory-modal')?.remove()" style="width:100%; margin-top:20px; background:#2c1a0c; border:none; padding:8px; border-radius:30px; color:#ffdd99; cursor:pointer;">Затвори</button>
        </div>
    `;
    document.body.appendChild(modal);
};

// ---------- Основни UI функции ----------
window.renderBarracksLayout = function() {
    const barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) return;

    const allHeroes = getAllUnlockedHeroes();
    const favorites = getFavoriteHeroes();
    const playerGold = window.currentHero ? (window.currentHero.gold || 0) : 0;
    const unitCost = 10;

    barracksContainer.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 650px; max-height: 90vh; background: #111; border: 2px solid #d4af37; border-radius: 12px; padding: 50px 15px 15px 15px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; box-shadow: 0 0 40px rgba(0,0,0,0.9);">
            <button onclick="window.closeBarracksUI()" style="position: absolute; top: 8px; left: 8px; width: 44px; height: 44px; background: rgba(20, 20, 20, 0.9); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 20px; cursor: pointer;">✕</button>

            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 18px;">ВОЕННИ КАЗАРМИ</h1>
                <div style="background: rgba(255,215,0,0.1); border: 1px solid #ffd700; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; color: #ffd700;">💰 ${playerGold}</div>
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 11px; color: #ffd700; font-weight: bold;">📋 ЕЛИТЕН ОТРЯД (FAVORITES):</div>
                    <div style="display: flex; gap: 6px;">
                        <button id="fav-prev-btn" onclick="window.prevFavPage()" style="background:#333; border:1px solid #d4af37; border-radius:50%; width:24px; height:24px; color:#ffd700; cursor:pointer;">←</button>
                        <span id="fav-page-indicator" style="color:#aaa; font-size:10px;">1/1</span>
                        <button id="fav-next-btn" onclick="window.nextFavPage()" style="background:#333; border:1px solid #d4af37; border-radius:50%; width:24px; height:24px; color:#ffd700; cursor:pointer;">→</button>
                    </div>
                </div>
                <div id="barracks-favorites-container" style="display: flex; flex-wrap: wrap; gap: 8px; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid #222; justify-content: center; margin-top: 6px;"></div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,0.3); border: 1px solid #222; border-radius: 8px; padding: 15px; justify-content: center; align-items: center; gap: 10px;">
                <div style="font-size: 35px;">⚔️🏰</div>
                <h3 style="margin: 0; color: #fff; font-size: 15px;">Обучение на Войници</h3>
                <p style="margin: 0; font-size: 11px; color: #888; text-align: center;">Всеки боец струва <b style="color:#ffd700;">${unitCost} злато</b>. Войската се добавя към ИЗБРАНИЯ ГЕРОЙ (от падащото меню).</p>
                <select id="hero-select-for-training" style="background:#2c2c3a; color:#ffd966; border:1px solid #daa520; border-radius:20px; padding:4px 12px; width:80%; max-width:200px;">
                    ${allHeroes.map(h => `<option value="${h.clan}">${h.name} (💰${h.gold} злато)</option>`).join('')}
                </select>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center;">
                    <input id="input-buy-count" type="number" value="10" min="1" max="500" style="background:#1a1a1a; border:1px solid #444; color:#fff; padding:8px; width:70px; text-align:center;">
                    <button class="action-btn" style="background:linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color:#000; font-weight:bold; border:1px solid #fff; padding:8px 15px; border-radius:4px; cursor:pointer;" onclick="window.buyUnitsFromBarracks()">
                        КУПИ ВОЙСКА
                    </button>
                </div>
            </div>

            <div style="text-align: center;">
                <button style="background:#222; border:1px solid #444; color:#aaa; padding:10px 30px; border-radius:4px; cursor:pointer; width:100%;" onclick="window.closeBarracksUI()">ИЗХОД</button>
            </div>
        </div>
    `;
    renderFavoritesPage();
};

// ---------- Покупка с новия селектор за герой ----------
window.buyUnitsFromBarracks = function() {
    const selectEl = document.getElementById('hero-select-for-training');
    if (!selectEl) return;
    const heroId = selectEl.value;
    let hero = null;
    if (window.worldData && window.worldData.clans && window.worldData.clans[heroId]) hero = window.worldData.clans[heroId];
    else hero = getAllUnlockedHeroes().find(h => h.clan === heroId);
    if (!hero) { alert("Герой не е намерен"); return; }
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    const unitCost = 10;
    let count = parseInt(document.getElementById('input-buy-count').value);
    if (isNaN(count) || count <= 0) count = 1;
    const totalCost = count * unitCost;
    if (hero.gold < totalCost) {
        alert(`❌ ${hero.name} няма достатъчно злато! (Нужни: ${totalCost})`);
        return;
    }
    hero.gold -= totalCost;
    // Синхронизация с armyDetails (използваме infantry като основна единица)
    if (!hero.armyDetails) hero.armyDetails = {};
    hero.armyDetails.infantry = (hero.armyDetails.infantry || 0) + count;
    let totalArmy = 0;
    for (let t of (window.armyMarket ? allTroops : [])) totalArmy += hero.armyDetails[t.id] || 0;
    hero.armySize = totalArmy || (hero.armySize || 0) + count;
    if (window.armyMarket && window.armyMarket.sync) window.armyMarket.sync(hero);
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    window.renderBarracksLayout();
    if (window.showAdvisorMsg) window.showAdvisorMsg(`⚔️ ${hero.name} получи +${count} войници за ${totalCost} злато!`);
};

// ---------- Селекция на любимци (без промяна) ----------
window.showLeaderSelectionModal = function() {
    let allHeroes = getAllUnlockedHeroes();
    let available = allHeroes.filter(h => !h.isFavoriteInBarracks);
    let modal = document.getElementById('leader-selection-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leader-selection-modal';
        document.body.appendChild(modal);
    }
    modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center; padding:15px;`;
    let listHTML = available.map(hero => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid #333; padding:10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:#fff;">👑 ${hero.name} (Ниво ${hero.level || 1})</span>
            <button style="background:#d4af37; border:none; padding:5px 12px; border-radius:4px; cursor:pointer;" onclick="window.selectLeaderAsFavorite('${hero.name}')">🤍 ДОБАВИ</button>
        </div>
    `).join('');
    if (!listHTML) listHTML = '<div style="color:#666; text-align:center;">Всички герои са в отряда.</div>';
    modal.innerHTML = `
        <div style="background:#151515; border:2px solid #ffd700; border-radius:8px; width:100%; max-width:400px; max-height:75vh; padding:20px; overflow-y:auto;">
            <button onclick="this.parentElement.parentElement.style.display='none'" style="float:right; background:#8b0000; border:none; color:white; border-radius:50%; width:30px; height:30px; cursor:pointer;">✕</button>
            <h3 style="color:#ffd700;">ИЗБЕРИ ГЕРОЙ ЗА ОТРЯД</h3>
            <div style="margin-top:15px;">${listHTML}</div>
        </div>
    `;
    modal.style.display = 'flex';
};

window.selectLeaderAsFavorite = function(heroName) {
    let hero = getAllUnlockedHeroes().find(h => h.name === heroName);
    if (hero && !hero.isFavoriteInBarracks) {
        hero.isFavoriteInBarracks = true;
        window.renderBarracksLayout();
        document.getElementById('leader-selection-modal')?.remove();
    }
};

window.toggleLeaderFavoriteInBarracks = function(heroName) {
    let hero = getAllUnlockedHeroes().find(h => h.name === heroName);
    if (hero) {
        hero.isFavoriteInBarracks = !hero.isFavoriteInBarracks;
        window.renderBarracksLayout();
    }
};

window.closeBarracksUI = function() {
    const screen = document.getElementById('barracks-screen');
    if (screen) screen.style.display = 'none';
};

window.openBarracksUI = function() {
    let barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) {
        barracksContainer = document.createElement('div');
        barracksContainer.id = 'barracks-screen';
        barracksContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box;`;
        document.body.appendChild(barracksContainer);
    }
    barracksContainer.style.display = 'flex';
    window.renderBarracksLayout();
};

// Инициализация на глобалните навигационни функции
window.nextFavPage = nextFavPage;
window.prevFavPage = prevFavPage;
window.getHeroClassIcon = getHeroClassIcon;
