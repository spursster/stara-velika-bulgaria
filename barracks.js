/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: barracks.js (КАЗАРМИ - МОБИЛНО ОПТИМИЗИРАН)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН И АДАПТИВЕН ЗА ТЕЛЕФОН
КОРЕКЦИЯ: Добавен бутон ✕ горе вляво, scrollable контейнер, flex-wrap слотове, 
          премахнати всички синтактични грешки и интервали в думи.
==========================================================================
*/

window.openBarracksUI = function() {
    let barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) {
        barracksContainer = document.createElement('div');
        barracksContainer.id = 'barracks-screen';
        barracksContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 10px; box-sizing: border-box;`;
        document.body.appendChild(barracksContainer);
    }
    barracksContainer.style.display = 'flex';
    window.renderBarracksLayout();
};

window.renderBarracksLayout = function() {
    const barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) return;

    let listHeroes = window.unlockedLeaders || [];
    if (window.currentHero && !listHeroes.some(h => h.name === window.currentHero.name)) {
        listHeroes.unshift(window.currentHero);
    }

    let favoriteLeaders = listHeroes.filter(h => h.isFavoriteInBarracks).slice(0, 5);

    let topSlotsHTML = '';
    // Адаптивни слотове с flex-wrap за мобилни
    for (let i = 0; i < 5; i++) {
        let hero = favoriteLeaders[i];
        if (hero) {
            let currentXP = hero.xp || 0;
            let reqXP = (window.rpgDatabase && typeof window.rpgDatabase.getXPRequiredForLevel === 'function') ? window.rpgDatabase.getXPRequiredForLevel(hero.level || 1) : 150;
            if (!hero.isAuto) currentXP = hero.storedXP || 0;
            if (reqXP <= 0) reqXP = 1;
            let xpPercent = Math.min(100, Math.floor((currentXP / reqXP) * 100));
            const fillGrad = hero.isAuto ? "linear-gradient(90deg, #00ffcc, #0072ff)" : "linear-gradient(90deg, #ffcc00, #ff6600)";

            topSlotsHTML += `
                <div class="elite-hero-card" style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 8px; flex: 0 0 auto; width: calc(20% - 8px); min-width: 85px; max-width: 110px; padding: 8px 5px; text-align: center; position: relative; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
                    <span style="position: absolute; top: 2px; right: 4px; cursor: pointer; color: #ff3366; font-size: 12px; z-index: 10;" onclick="window.toggleLeaderFavoriteInBarracks('${hero.name}')">❤️</span>
                    <div style="font-size: 10px; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px;">👑 ${hero.name}</div>
                    <div style="font-size: 8px; color: #aaa;">Ниво ${hero.level || 1} | ${hero.currentClass || "Багатур"}</div>
                    <div style="font-size: 9px; color: #fff; margin: 2px 0;">⚔️ ${hero.currentArmy || hero.armySize || 0}</div>
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

    let playerGold = window.currentHero ? (window.currentHero.gold || 0) : 0;
    const unitCost = 10;

    // ✅ МОБИЛНО-ОПТИМИЗИРАН КОНТЕЙНЕР С БУТОН ЗА ЗАТВАРЯНЕ ГОРЕ-ВЛЯВО
    barracksContainer.innerHTML = `
        <div style="position: relative; width: 100%; max-width: 550px; max-height: 90vh; background: #111; border: 2px solid #d4af37; border-radius: 12px; padding: 50px 15px 15px 15px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; box-shadow: 0 0 40px rgba(0,0,0,0.9);">
            <button onclick="window.closeBarracksUI()" style="position: absolute; top: 8px; left: 8px; width: 44px; height: 44px; background: rgba(20, 20, 20, 0.9); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 100; display: flex; align-items: center; justify-content: center; touch-action: manipulation;">✕</button>

            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 8px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 18px; letter-spacing: 1px;">ВОЕННИ КАЗАРМИ</h1>
                <div style="background: rgba(255,215,0,0.1); border: 1px solid #ffd700; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; color: #ffd700;">💰 ${playerGold}</div>
            </div>

            <div>
                <div style="font-size: 11px; color: #ffd700; margin-bottom: 6px; font-weight: bold; letter-spacing: 1px;">📋 ЕЛИТЕН ОТРЯД (ФАВОРИТИ):</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid #222; justify-content: center;">
                    ${topSlotsHTML}
                </div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,0.3); border: 1px solid #222; border-radius: 8px; padding: 15px; justify-content: center; align-items: center; gap: 10px;">
                <div style="font-size: 35px;">⚔️</div>
                <h3 style="margin: 0; color: #fff; font-size: 15px; text-align: center;">Обучение на Мечоносци</h3>
                <p style="margin: 0; font-size: 11px; color: #888; text-align: center; line-height: 1.4;">
                    Всеки боец струва <b style="color:#ffd700;">${unitCost} злато</b>. Войската се добавя към текущия воевода.
                </p>
                <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center; flex-wrap: wrap;">
                    <input id="input-buy-count" type="number" value="10" min="1" max="500" style="background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 8px; width: 70px; text-align: center; font-size: 13px; border-radius: 4px;">
                    <button class="action-btn" style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; font-weight: bold; border: 1px solid #fff; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 13px; flex-grow: 1; max-width: 200px;" onclick="window.buyUnits()">
                        КУПИ ВОЙСКА
                    </button>
                </div>
            </div>

            <div style="text-align: center; flex-shrink: 0;">
                <button style="background: #222; border: 1px solid #444; color: #aaa; padding: 10px 30px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; width: 100%;" onclick="window.closeBarracksUI()">
                    ИЗХОД ОТ КАЗАРМИТЕ
                </button>
            </div>
        </div>
    `;
};

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

    if (!window.currentHero) {
        alert("Грешка: Липсва активен главен герой.");
        return;
    }

    if (window.currentHero.gold < totalCost) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔮 Недостиг на хазна! Нужни са ти " + totalCost + " злато, а имаш само " + window.currentHero.gold + "!");
        } else {
            alert("Нямате достатъчно злато!");
        }
        return;
    }

    window.currentHero.gold -= totalCost;
    window.currentHero.armySize = (window.currentHero.armySize || 0) + countToBuy;
    window.currentHero.currentArmy = (window.currentHero.currentArmy || 0) + countToBuy;

    if (window.worldData && window.worldData.clans && window.worldData.clans[window.currentHero.clan]) {
        window.worldData.clans[window.currentHero.clan].armySize = window.currentHero.armySize;
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("⚔️ Успешно обучихте + " + countToBuy + " воини за Вашата велика армия!");
    }

    window.renderBarracksLayout();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.showLeaderSelectionModal = function() {
    let listHeroes = window.unlockedLeaders || [];
    if (window.currentHero && !listHeroes.some(h => h.name === window.currentHero.name)) {
        listHeroes.unshift(window.currentHero);
    }

    let availableToChoose = listHeroes.filter(h => !h.isFavoriteInBarracks);

    let modal = document.getElementById('leader-selection-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leader-selection-modal';
        document.body.appendChild(modal);
    }

    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box;`;

    let listHTML = availableToChoose.map(hero => {
        return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                <span style="font-weight: bold; color: #fff; font-size: 13px;">👑 ${hero.name} (Ниво ${hero.level || 1})</span>
                <button style="background: #d4af37; color:#000; border:none; padding: 5px 12px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;" onclick="window.selectLeaderAsFavorite('${hero.name}')">
                    🤍 ДОБАВИ
                </button>
            </div>
        `;
    }).join('');

    if (availableToChoose.length === 0) {
        listHTML = `<div style="color: #666; font-style: italic; text-align: center; padding: 20px;">Всички ваши отключени герои са добавени в отряда.</div>`;
    }

    modal.innerHTML = `
        <div style="position: relative; background: #151515; border: 2px solid #ffd700; border-radius: 8px; width: 100%; max-width: 400px; max-height: 75vh; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; font-family: 'Cinzel', serif; overflow-y: auto;">
            <button onclick="this.parentElement.parentElement.style.display='none'" style="position: absolute; top: 5px; right: 5px; width: 36px; height: 36px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 18px; cursor: pointer; z-index: 101; display: flex; align-items: center; justify-content: center;">✕</button>
            <h3 style="color: #ffd700; margin: 0; font-size: 16px; text-align: center; border-bottom: 1px solid #222; padding-bottom: 8px;">ИЗБЕРИ ГЕРОЙ ЗА ОТРЯД</h3>
            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; max-height: 350px;">
                ${listHTML}
            </div>
        </div>
    `;
    modal.style.display = 'flex';
};

window.selectLeaderAsFavorite = function(heroName) {
    let listHeroes = window.unlockedLeaders || [];
    let hero = listHeroes.find(h => h.name === heroName);
    if (!hero && window.currentHero && window.currentHero.name === heroName) {
        hero = window.currentHero;
    }

    if (hero) {
        let currentFavs = listHeroes.filter(h => h.isFavoriteInBarracks).length;
        if (currentFavs >= 5) {
            alert("Можеш да имаш максимум 5 избрани героя в тактическата петица! Премахни някой първо.");
            return;
        }
        hero.isFavoriteInBarracks = true;
        let modal = document.getElementById('leader-selection-modal');
        if (modal) modal.style.display = 'none';
        window.renderBarracksLayout();
    }
};

window.toggleLeaderFavoriteInBarracks = function(heroName) {
    let listHeroes = window.unlockedLeaders || [];
    let hero = listHeroes.find(h => h.name === heroName);
    if (!hero && window.currentHero && window.currentHero.name === heroName) {
        hero = window.currentHero;
    }
    if (hero) {
        hero.isFavoriteInBarracks = !hero.isFavoriteInBarracks;
        window.renderBarracksLayout();
    }
};

window.closeBarracksUI = function() {
    const screen = document.getElementById('barracks-screen');
    if (screen) screen.style.display = 'none';
};
