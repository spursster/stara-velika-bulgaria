/**
 * МОДУЛ: КАЗАРМИ И КУПУВАНЕ НА ВОЙСКА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (КОМАНДНА ЛЕНТА С 5 СЛОТА И СЪРЦА ЗА ФАВОРИТИ)
 * КОРЕКЦИЯ: Фиксирана грешка TypeError: window.buyUnits is not a function. Интегриран тактически панел отгоре.
 * Статистика на файловете в проекта: 15
 */

// Глобална функция за отваряне на интерфейса на казармите
window.openBarracksUI = function() {
    let barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) {
        barracksContainer = document.createElement('div');
        barracksContainer.id = 'barracks-screen';
        barracksContainer.className = 'fullscreen-overlay';
        document.body.appendChild(barracksContainer);
    }

    barracksContainer.style.position = 'fixed';
    barracksContainer.style.top = '0';
    barracksContainer.style.left = '0';
    barracksContainer.style.width = '100vw';
    barracksContainer.style.height = '100vh';
    barracksContainer.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
    barracksContainer.style.zIndex = '9999';
    barracksContainer.style.display = 'flex';
    barracksContainer.style.justifyContent = 'center';
    barracksContainer.style.alignItems = 'center';
    barracksContainer.style.fontFamily = "'Cinzel', serif";
    barracksContainer.style.color = '#fff';

    window.renderBarracksLayout();
};

// Рендериране на цялостния изглед на казармите
window.renderBarracksLayout = function() {
    const barracksContainer = document.getElementById('barracks-screen');
    if (!barracksContainer) return;

    // 1. Извличане на всички водачи и филтриране на избраните (максимум 5 фаворити)
    let allLeaders = [];
    if (window.worldData && window.worldData.clans) {
        allLeaders = Object.entries(window.worldData.clans).map(([key, clan]) => {
            return {
                clanKey: key,
                name: clan.leaderName || key,
                currentArmy: clan.armySize || clan.currentArmy || 0,
                maxArmy: clan.maxArmy || 300,
                level: clan.level || 1,
                isFavorite: clan.isFavorite || false,
                unlocked: clan.unlocked !== false
            };
        });
    }

    let favoriteLeaders = allLeaders.filter(l => l.isFavorite).slice(0, 5);

    // 2. Генериране на 5-те тактически слота за горната лента
    let topSlotsHTML = '';
    for (let i = 0; i < 5; i++) {
        let hero = favoriteLeaders[i];
        if (hero) {
            topSlotsHTML += `
                <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 8px; width: 18%; padding: 10px; text-align: center; position: relative; box-sizing: border-box;">
                    <span style="position: absolute; top: 5px; right: 8px; cursor: pointer; color: #ff3366;" onclick="window.toggleLeaderFavoriteInBarracks('${hero.clanKey}')">❤️</span>
                    <div style="font-size: 20px; margin-bottom: 3px;">🎖️</div>
                    <div style="font-size: 12px; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${hero.name}</div>
                    <div style="font-size: 11px; color: #aaa; margin-top: 2px;">Войска: ${hero.currentArmy}/${hero.maxArmy}</div>
                </div>
            `;
        } else {
            topSlotsHTML += `
                <div style="background: rgba(255,255,255,0.02); border: 2px dashed #444; border-radius: 8px; width: 18%; padding: 10px; text-align: center; cursor: pointer; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 75px;" onclick="window.showLeaderSelectionModal()">
                    <div style="font-size: 18px; color: #666;">+</div>
                    <div style="font-size: 11px; color: #666;">Празен слот</div>
                </div>
            `;
        }
    }

    // Ресурси на играча за купуване (подсигуряваме златото)
    let playerGold = 0;
    if (window.worldData && window.worldData.resources) {
        playerGold = window.worldData.resources.gold || 0;
    } else if (window.currentHero) {
        playerGold = window.currentHero.gold || 0;
    }

    const unitCost = 10; // Цена за 1 боец

    barracksContainer.innerHTML = `
        <div style="width: 85%; height: 90%; background: #111; border: 3px solid #d4af37; border-radius: 12px; padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 0 50px rgba(0,0,0,0.9); overflow: hidden;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <div>
                    <h1 style="color: #ffd700; margin: 0; font-size: 24px; letter-spacing: 2px;">ВОЕННИ КАЗАРМИ</h1>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #aaa;">Обучи и попълни редиците на своите воеводи</p>
                </div>
                <div style="background: rgba(255,215,0,0.1); border: 1px solid #ffd700; padding: 8px 15px; border-radius: 6px; font-size: 14px; font-weight: bold; color: #ffd700;">
                    💰 Налично Злато: ${playerGold}
                </div>
            </div>

            <div>
                <div style="font-size: 12px; color: #ffd700; margin-bottom: 8px; font-weight: bold; letter-spacing: 1px;">📋 ИЗБРАНА ПЕТИЦА ЗА ЩУРМ (ФАВОРИТИ):</div>
                <div style="display: flex; justify-content: space-between; gap: 10px; background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px; border: 1px solid #222;">
                    ${topSlotsHTML}
                </div>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,0.3); border: 1px solid #222; border-radius: 8px; padding: 20px; justify-content: center; align-items: center; gap: 15px;">
                <div style="font-size: 45px;">⚔️</div>
                <h3 style="margin: 0; color: #fff; font-size: 18px;">Новобранци и Обучение на Мечоносци</h3>
                <p style="margin: 0; font-size: 13px; color: #888; text-align: center; max-width: 500px;">
                    Всеки новобранец струва <b style="color:#ffd700;">${unitCost} злато</b>. Войската се разпределя автоматично или се добавя към текущия ти воевода за попълване на неговия личен полк.
                </p>

                <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                    <label style="font-size: 14px; color: #aaa;">Количество войници:</label>
                    <input id="input-buy-count" type="number" value="10" min="1" max="500" style="background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 8px; width: 80px; text-align: center; font-size: 14px; border-radius: 4px;">
                    
                    <button class="action-btn" style="background: linear-gradient(180deg, #ffd700 0%, #b8860b 100%); color: #000; font-weight: bold; border: 1px solid #fff; padding: 10px 25px; border-radius: 4px; cursor: pointer; font-size: 14px;" onclick="window.buyUnits()">
                        КУПИ ВОЙСКА
                    </button>
                </div>
            </div>

            <div style="text-align: center;">
                <button style="background: #222; border: 1px solid #444; color: #aaa; padding: 10px 40px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;" onclick="window.closeBarracksUI()">
                    ИЗХОД ОТ КАЗАРМИТЕ
                </button>
            </div>
        </div>
    `;
};

// ФУНКЦИЯТА, КОЯТО ЛИПСВАШЕ И ДАВАШЕ ГРЕШКА - ВЕЧЕ Е НАПЪЛНО ИМПЛЕМЕНТИРАНА
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

    let resourcesObj = null;
    if (window.worldData && window.worldData.resources) {
        resourcesObj = window.worldData.resources;
    } else if (window.currentHero) {
        resourcesObj = window.currentHero;
    }

    if (!resourcesObj || (resourcesObj.gold === undefined && resourcesObj.resources?.gold === undefined)) {
        alert("Грешка при достъп до ресурсите на кралството.");
        return;
    }

    let currentGold = resourcesObj.gold !== undefined ? resourcesObj.gold : resourcesObj.resources.gold;

    if (currentGold < totalCost) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("🔮 Недостиг на хазна! Нужни са ти " + totalCost + " злато, а имаш само " + currentGold + "!");
        } else {
            alert("Нямате достатъчно злато!");
        }
        return;
    }

    // Удържане на златото
    if (resourcesObj.gold !== undefined) {
        resourcesObj.gold -= totalCost;
    } else {
        resourcesObj.resources.gold -= totalCost;
    }

    // Добавяне на войската към главния воевода или първия избран фаворит
    if (window.currentHero) {
        window.currentHero.currentArmy = (window.currentHero.currentArmy || 0) + countToBuy;
        if (window.worldData && window.worldData.clans && window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].armySize = window.currentHero.currentArmy;
            window.worldData.clans[window.currentHero.dynasty].currentArmy = window.currentHero.currentArmy;
        }
    } else if (window.worldData && window.worldData.clans) {
        // Ако няма зареден главен герой, разпределяме към първия намерен клан
        let firstClanKey = Object.keys(window.worldData.clans)[0];
        if (firstClanKey) {
            window.worldData.clans[firstClanKey].armySize = (window.worldData.clans[firstClanKey].armySize || 0) + countToBuy;
        }
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("⚔️ Успешно обучихте +" + countToBuy + " воини за Вашата велика армия!");
    }

    // Преначертаване на интерфейса веднага, за да се видят новите данни и злато
    window.renderBarracksLayout();
    if (window.updateCharacterUI && window.currentHero) window.updateCharacterUI(window.currentHero);
};

// Модален прозорец за избор на герой от отключените, когато натиснеш празен слот
window.showLeaderSelectionModal = function() {
    let allLeaders = [];
    if (window.worldData && window.worldData.clans) {
        allLeaders = Object.entries(window.worldData.clans).map(([key, clan]) => {
            return {
                clanKey: key,
                name: clan.leaderName || key,
                currentArmy: clan.armySize || clan.currentArmy || 0,
                isFavorite: clan.isFavorite || false,
                unlocked: clan.unlocked !== false
            };
        });
    }

    // Списък само с отключените воеводи, които НЕ са в момента фаворити
    let availableToChoose = allLeaders.filter(l => l.unlocked && !l.isFavorite);

    let modal = document.getElementById('leader-selection-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leader-selection-modal';
        document.body.appendChild(modal);
    }

    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    let listHTML = availableToChoose.map(hero => {
        return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; color: #fff;">${hero.name} (${hero.currentArmy} войници)</span>
                <button style="background: #d4af37; color:#000; border:none; padding: 5px 12px; font-weight:bold; border-radius:4px; cursor:pointer; font-size:11px;" onclick="window.selectLeaderAsFavorite('${hero.clanKey}')">
                    🤍 ДОБАВИ
                </button>
            </div>
        `;
    }).join('');

    if (availableToChoose.length === 0) {
        listHTML = `<div style="color: #666; font-style: italic; text-align: center; padding: 20px;">Всички отключени воеводи вече са добавени в твоята петица.</div>`;
    }

    modal.innerHTML = `
        <div style="background: #151515; border: 2px solid #ffd700; border-radius: 8px; width: 400px; max-height: 70%; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; font-family: 'Cinzel', serif;">
            <h3 style="color: #ffd700; margin: 0; font-size: 16px; text-align: center; border-bottom: 1px solid #222; padding-bottom: 8px;">ИЗБЕРИ ВОЕВОДА ЗА ПЕТИЦАТА</h3>
            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; max-height: 300px;">
                ${listHTML}
            </div>
            <button style="background: #333; border: 1px solid #555; color: #fff; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;" onclick="document.getElementById('leader-selection-modal').style.display='none'">
                ЗАТВОРИ
            </button>
        </div>
    `;
    modal.style.display = 'flex';
};

window.selectLeaderAsFavorite = function(clanKey) {
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        // Проверяваме дали вече няма случайно 5 фаворита
        let currentFavs = Object.values(window.worldData.clans).filter(c => c.isFavorite).length;
        if (currentFavs >= 5) {
            alert("Можеш да имаш максимум 5 избрани героя в тактическата петица! Премахни някой от тях първо.");
            return;
        }

        window.worldData.clans[clanKey].isFavorite = true;
        
        let modal = document.getElementById('leader-selection-modal');
        if (modal) modal.style.display = 'none';

        window.renderBarracksLayout();
    }
};

window.toggleLeaderFavoriteInBarracks = function(clanKey) {
    if (window.worldData && window.worldData.clans && window.worldData.clans[clanKey]) {
        window.worldData.clans[clanKey].isFavorite = !window.worldData.clans[clanKey].isFavorite;
        window.renderBarracksLayout();
    }
};

window.closeBarracksUI = function() {
    const screen = document.getElementById('barracks-screen');
    if (screen) screen.style.display = 'none';
};
