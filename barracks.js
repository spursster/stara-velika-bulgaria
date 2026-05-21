/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: barracks.js (КАЗАРМИ - ПАГИНАЦИЯ + ИНВЕНТАР + ИКОНКИ НА КЛАС)
ВЕРСИЯ: 2.0 - НАПЪЛНО ОБНОВЕН
==========================================================================
*/

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

// Помощна функция за получаване на всички отключени герои
function getAllUnlockedHeroes() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) {
                heroes.push(clan);
            }
        }
    }
    if (heroes.length === 0 && window.currentHero) {
        heroes.push(window.currentHero);
    }
    // Инициализираме isFavoriteInBarracks, ако липсва
    heroes.forEach(h => {
        if (h.isFavoriteInBarracks === undefined) h.isFavoriteInBarracks = false;
    });
    return heroes;
}

// Функция за иконка на клас
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

window.renderBarracksLayout = function() {
    const barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) return;

    let allHeroes = getAllUnlockedHeroes();
    let favoriteLeaders = allHeroes.filter(h => h.isFavoriteInBarracks === true);
    const maxPerPage = 5;
    let currentPage = window.barracksPage || 0;
    let totalPages = Math.ceil(favoriteLeaders.length / maxPerPage);
    if (currentPage >= totalPages && totalPages > 0) currentPage = totalPages - 1;
    if (currentPage < 0) currentPage = 0;
    let startIdx = currentPage * maxPerPage;
    let visibleFavorites = favoriteLeaders.slice(startIdx, startIdx + maxPerPage);

    let topSlotsHTML = '';
    for (let i = 0; i < maxPerPage; i++) {
        let hero = visibleFavorites[i];
        if (hero) {
            let currentXP = hero.xp || 0;
            let reqXP = (window.rpgDatabase && typeof window.rpgDatabase.getXPRequiredForLevel === 'function') ? window.rpgDatabase.getXPRequiredForLevel(hero.level || 1) : 150;
            if (!hero.isAuto) currentXP = hero.storedXP || 0;
            if (reqXP <= 0) reqXP = 1;
            let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));
            const fillGrad = hero.isAuto ? "linear-gradient(90deg, #00ffcc, #0072ff)" : "linear-gradient(90deg, #ffcc00, #ff6600)";
            const classIcon = getClassIcon(hero.currentClass);
            topSlotsHTML += `
                <div class="elite-hero-card" style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; max-width: 110px; padding: 8px 5px; text-align: center; position: relative; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer;" onclick="window.showHeroInventoryInBarracks('${hero.name}')">
                    <span style="position: absolute; top: 2px; right: 4px; cursor: pointer; color: #ff3366; font-size: 12px; z-index: 10;" onclick="event.stopPropagation(); window.toggleLeaderFavoriteInBarracks('${hero.name}')">❤️</span>
                    <div style="font-size: 10px; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px;">${classIcon} ${hero.name}</div>
                    <div style="font-size: 8px; color: #aaa;">Ниво ${hero.level || 1} | ${hero.currentClass || "Багатур"}</div>
                    <div style="font-size: 9px; color: #fff; margin: 2px 0;">⚔️ ${hero.armySize || 0}</div>
                    <div class="rpg-xp-container" title="Опит: ${currentXP}/${reqXP}" style="background:#222; height:3px; border-radius:2px; margin:3px 0; overflow:hidden; width: 100%;">
                        <div class="rpg-xp-fill" style="width:${xpPercent}%; height:100%; background:${fillGrad};"></div>
                    </div>
                </div>
            `;
        } else {
            topSlotsHTML += `
                <div style="background: rgba(255,255,255,0.02); border: 2px dashed #444; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; padding: 8px; text-align: center; cursor: pointer; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;" onclick="window.showLeaderSelectionModal()">
                    <div style="font-size: 16px; color: #666;">+</div>
                    <div style="font-size: 9px; color: #666;">Избери</div>
                </div>
            `;
        }
    }

    // Пагинация
    let paginationHTML = '';
    if (totalPages > 1) {
        paginationHTML = `
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 8px;">
                <button id="barracksPrevPage" style="background:#2c1a0c; border:none; border-radius:50%; width:28px; height:28px; color:#ffd700; cursor:pointer; font-size:14px;">←</button>
                <span style="font-size:10px; color:#aaa;">${currentPage+1} / ${totalPages}</span>
                <button id="barracksNextPage" style="background:#2c1a0c; border:none; border-radius:50%; width:28px; height:28px; color:#ffd700; cursor:pointer; font-size:14px;">→</button>
            </div>
        `;
    }

    // Списък с герои за падащото меню (купуване на войници)
    const heroesForSelect = getAllUnlockedHeroes();
    let heroOptions = heroesForSelect.map(h => `<option value="${h.name}">${getClassIcon(h.currentClass)} ${h.name} (💰${h.gold} злато, ⚔️${h.armySize})</option>`).join('');
    let selectedHeroName = window.selectedHeroForBuying || (heroesForSelect[0] ? heroesForSelect[0].name : "");

    barracksContainer.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 650px; max-height: 90vh; background: #111; border: 2px solid #d4af37; border-radius: 12px; padding: 50px 15px 15px 15px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; box-shadow: 0 0 40px rgba(0,0,0,0.9);">
            <button onclick="window.closeBarracksUI()" style="position: absolute; top: 8px; left: 8px; width: 44px; height: 44px; background: rgba(20, 20, 20, 0.9); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 100; display: flex; align-items: center; justify-content: center;">✕</button>

            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 18px; letter-spacing: 1px;">ВОЕННИ КАЗАРМИ</h1>
                <div style="background: rgba(255,215,0,0.1); border: 1px solid #ffd700; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; color: #ffd700;">💰 <span id="barracksGoldDisplay">0</span></div>
            </div>

            <div>
                <div style="font-size: 11px; color: #ffd700; margin-bottom: 6px; font-weight: bold; letter-spacing: 1px;">📋 ЕЛИТЕН ОТРЯД (ФАВОРИТИ):</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid #222; justify-content: center;">
                    ${topSlotsHTML}
                </div>
                ${paginationHTML}
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,0.3); border: 1px solid #222; border-radius: 8px; padding: 15px; gap: 10px;">
                <div style="font-size: 35px; text-align: center;">⚔️</div>
                <h3 style="margin: 0; color: #fff; font-size: 15px; text-align: center;">Обучение на Мечоносци</h3>
                <p style="margin: 0; font-size: 11px; color: #888; text-align: center; line-height: 1.4;">
                    Всеки боец струва <b style="color:#ffd700;">10 злато</b>. Войската се добавя към избрания герой.
                </p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
                        <label style="font-size: 11px; color:#ffd700;">👤 За герой:</label>
                        <select id="heroBuySelect" style="background:#2c2c3a; color:#ffd966; border:1px solid #daa520; border-radius:20px; padding:4px 12px; font-size:11px; flex:1;">${heroOptions}</select>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center; flex-wrap: wrap;">
                        <input id="input-buy-count" type="number" value="10" min="1" max="500" style="background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 8px; width: 70px; text-align: center; font-size: 13px; border-radius: 4px;">
                        <button class="action-btn" style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; font-weight: bold; border: 1px solid #fff; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 13px; flex-grow: 1; max-width: 200px;" onclick="window.buyUnits()">
                            КУПИ ВОЙСКА
                        </button>
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <button style="background: #222; border: 1px solid #444; color: #aaa; padding: 10px 30px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; width: 100%;" onclick="window.closeBarracksUI()">
                    ИЗХОД ОТ КАЗАРМИТЕ
                </button>
            </div>
        </div>
    `;

    // Актуализираме златото на избрания герой в горния десен ъгъл
    const selectedHero = heroesForSelect.find(h => h.name === selectedHeroName);
    const goldSpan = document.getElementById('barracksGoldDisplay');
    if (goldSpan && selectedHero) goldSpan.innerText = selectedHero.gold || 0;

    // Селект променя златото динамично
    const heroSelect = document.getElementById('heroBuySelect');
    if (heroSelect) {
        heroSelect.value = selectedHeroName;
        heroSelect.addEventListener('change', (e) => {
            window.selectedHeroForBuying = e.target.value;
            const newHero = heroesForSelect.find(h => h.name === e.target.value);
            if (newHero && goldSpan) goldSpan.innerText = newHero.gold || 0;
        });
    }

    // Бутони за пагинация
    const prevBtn = document.getElementById('barracksPrevPage');
    const nextBtn = document.getElementById('barracksNextPage');
    if (prevBtn) prevBtn.onclick = () => { window.barracksPage = Math.max(0, currentPage - 1); window.renderBarracksLayout(); };
    if (nextBtn) nextBtn.onclick = () => { window.barracksPage = Math.min(totalPages - 1, currentPage + 1); window.renderBarracksLayout(); };
};

// Функция за показване на инвентара на герой в казармите
window.showHeroInventoryInBarracks = function(heroName) {
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (!hero) return;
    // Използваме съществуващата функция showHeroProfile от ui.js (ако съществува)
    if (typeof window.showHeroProfile === 'function') {
        window.showHeroProfile(hero);
    } else {
        alert("Инвентарът не е достъпен. Функцията showHeroProfile липсва.");
    }
};

// Обновена функция за купуване на войници (работи с armyDetails)
window.buyUnits = function() {
    const inputCount = document.getElementById('input-buy-count');
    if (!inputCount) return;
    let countToBuy = parseInt(inputCount.value);
    if (isNaN(countToBuy) || countToBuy <= 0) {
        alert("Моля, въведете валидно количество войници!");
        return;
    }

    const unitCost = 10;
    let totalCost = countToBuy * unitCost;

    // Взимаме избрания герой от селекта
    const heroSelect = document.getElementById('heroBuySelect');
    if (!heroSelect) return;
    const heroName = heroSelect.value;
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (!hero) {
        alert("Грешка: Героят не е намерен.");
        return;
    }

    if (hero.gold < totalCost) {
        alert(`❌ ${hero.name} няма достатъчно злато! Нужни: ${totalCost}, има: ${hero.gold}`);
        return;
    }

    hero.gold -= totalCost;
    // Добавяме пехотинци към armyDetails (за съвместимост с armyMarket.js)
    if (!hero.armyDetails) hero.armyDetails = {};
    hero.armyDetails.infantry = (hero.armyDetails.infantry || 0) + countToBuy;
    // Обновяваме общата армия
    let totalArmy = 0;
    const allTroops = [
        "infantry", "archers", "cavalry", "elite",
        "vampire", "werewolf", "highelf", "troll", "dragon_young", "wizard", "lich", "fairy_healer",
        "bear_ancient", "harpy", "mermaid", "genie", "vampire_queen", "ice_dragon", "ogre_mage",
        "dark_elf", "alpha_werewolf", "stone_troll", "archmage", "demon", "ancient_vampire", "weird_witch",
        "griffin", "golden_dragon", "elf_archer", "swamp_troll", "necromancer", "vampire_samurai", "bronze_dragon", "titan"
    ];
    for (let troopId of allTroops) {
        totalArmy += hero.armyDetails[troopId] || 0;
    }
    hero.armySize = totalArmy;
    hero.currentArmy = totalArmy;

    // Синхронизация с worldData
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.clan]) {
        window.worldData.clans[hero.clan].gold = hero.gold;
        window.worldData.clans[hero.clan].armyDetails = hero.armyDetails;
        window.worldData.clans[hero.clan].armySize = hero.armySize;
    }

    // Синхронизация с armyMarket (ако съществува)
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
        window.armyMarket.sync(hero);
    }

    // Обновяване на UI
    window.renderBarracksLayout();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.renderTop6LeadersUI === 'function') window.renderTop6LeadersUI();

    // Анимация на монети
    for (let i = 0; i < Math.min(5, countToBuy); i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.textContent = '💰';
            coin.style.cssText = `position: fixed; left: 50%; top: 50%; font-size: 30px; pointer-events: none; z-index: 10001; animation: coinFlip 0.6s ease-out forwards;`;
            document.body.appendChild(coin);
            setTimeout(() => coin.remove(), 600);
        }, i * 80);
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`⚔️ ${hero.name} обучи ${countToBuy} мечоносци за ${totalCost} злато!`);
    }
};

// Останалите функции (showLeaderSelectionModal, selectLeaderAsFavorite, toggleLeaderFavoriteInBarracks, closeBarracksUI) остават без промяна, но ги включваме за пълнота
window.showLeaderSelectionModal = function() {
    let allHeroes = getAllUnlockedHeroes();
    let availableToChoose = allHeroes.filter(h => !h.isFavoriteInBarracks);
    let modal = document.getElementById('leader-selection-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leader-selection-modal';
        document.body.appendChild(modal);
    }
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box;`;
    let listHTML = availableToChoose.map(hero => {
        const classIcon = getClassIcon(hero.currentClass);
        return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                <span style="font-weight: bold; color: #fff; font-size: 13px;">${classIcon} ${hero.name} (Ниво ${hero.level || 1})</span>
                <button style="background: #d4af37; color:#000; border:none; padding: 5px 12px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;" onclick="window.selectLeaderAsFavorite('${hero.name}')">
                    🤍 ДОБАВИ
                </button>
            </div>
        `;
    }).join('');
    if (availableToChoose.length === 0) {
        listHTML = `<div style="color: #666; font-style: italic; text-align: center; padding: 20px;">Всички ваши герои са добавени в отряда.</div>`;
    }
    modal.innerHTML = `
        <div style="position: relative; background: #151515; border: 2px solid #ffd700; border-radius: 8px; width: 100%; max-width: 400px; max-height: 75vh; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; font-family: 'Cinzel', serif; overflow-y: auto;">
            <button onclick="this.parentElement.parentElement.style.display='none'" style="position: absolute; top: 5px; right: 5px; width: 36px; height: 36px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 18px; cursor: pointer;">✕</button>
            <h3 style="color: #ffd700; margin: 0; font-size: 16px; text-align: center; border-bottom: 1px solid #222; padding-bottom: 8px;">ИЗБЕРИ ГЕРОЙ ЗА ОТРЯД</h3>
            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; max-height: 350px;">
                ${listHTML}
            </div>
        </div>
    `;
    modal.style.display = 'flex';
};

window.selectLeaderAsFavorite = function(heroName) {
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (!hero && window.currentHero && window.currentHero.name === heroName) hero = window.currentHero;
    if (hero) {
        let currentFavs = allHeroes.filter(h => h.isFavoriteInBarracks === true).length;
        if (currentFavs >= 5) {
            alert("Можеш да имаш максимум 5 избрани героя в отряда! Премахни някой първо.");
            return;
        }
        hero.isFavoriteInBarracks = true;
        let modal = document.getElementById('leader-selection-modal');
        if (modal) modal.style.display = 'none';
        window.barracksPage = 0; // нулираме страницата след добавяне
        window.renderBarracksLayout();
    }
};

window.toggleLeaderFavoriteInBarracks = function(heroName) {
    let allHeroes = getAllUnlockedHeroes();
    let hero = allHeroes.find(h => h.name === heroName);
    if (!hero && window.currentHero && window.currentHero.name === heroName) hero = window.currentHero;
    if (hero) {
        hero.isFavoriteInBarracks = !hero.isFavoriteInBarracks;
        window.renderBarracksLayout();
    }
};

window.closeBarracksUI = function() {
    const screen = document.getElementById('barracks-screen');
    if (screen) screen.style.display = 'none';
};

// Анимация за монетите (стил)
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
