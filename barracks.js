/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН И КОСМИЧЕСКИ ДОК) - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Връзка с Епохите, Top Bar UI, Родови Модификатори и Космическо бъдеще)
 * КОРЕКЦИЯ: Поправен синхронизационен бъг между hero.armySize и hero.currentArmy. Добавена еволюция на единиците.
 * Статистика на файловете в проекта: 16
 */

window.buyUnits = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Инициализиране на RPG структурата, ако липсва
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    // Изчисляване на ценовия модификатор от 13-те династии в mechanics.js (напр. Даки)
    let costModifier = 1.0;
    if (hero.dynasty && window.dynastyPerks && window.dynastyPerks[hero.dynasty]) {
        const perk = window.dynastyPerks[hero.dynasty];
        if (perk.armyCost) costModifier = perk.armyCost;
    }

    // ДИНАМИЧНО ОПРЕДЕЛЯНЕ НА ЕДИНИЦИТЕ СПОРЕД RPG НИВОТО И ЕПОХАТА ЗА БЕЗКРАЙНО БЪДЕЩЕ
    let unitName = "Родови воини";
    let baseCost = 250;
    let amount = 100;

    if (hero.level >= 5 && hero.level < 10) {
        unitName = "Елитна Имперска Гвардия";
        baseCost = 450;
        amount = 150;
    } else if (hero.level >= 10) {
        unitName = "Звездни Родови Легионери";
        baseCost = 800;
        amount = 200;
    }

    const finalCost = Math.floor(baseCost * costModifier);

    // Премахваме стария прозорец, ако е отворен
    const oldScreen = document.getElementById('barracks-screen');
    if (oldScreen) oldScreen.remove();

    // Създаваме новия адаптивен прозорец над всичко за максимална стабилност
    const barracksScreen = document.createElement('div');
    barracksScreen.id = 'barracks-screen';
    barracksScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85); z-index: 15000; display: flex;
        align-items: center; justify-content: center; padding: 10px;
        box-sizing: border-box; font-family: 'Georgia', serif;
    `;

    barracksScreen.innerHTML = `
        <div style="width: 100%; max-width: 480px; background: #0c0c0c; border: 2px solid #d4af37; border-radius: 6px; color: white; padding: 20px; box-shadow: 0 0 25px rgba(0,0,0,0.9); box-sizing: border-box; max-height: 95vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37; text-transform: uppercase; font-size: 1.1em; letter-spacing: 1px;">⚔️ Военен Стан и Док</h3>
                <button onclick="document.getElementById('barracks-screen').remove()" style="background: none; border: none; color: #ff4444; font-size: 1.3em; cursor: pointer; font-weight: bold;">&times;</button>
            </div>

            <p style="font-size: 0.9em; line-height: 1.5; color: #ccc; margin-bottom: 15px;">
                Повикайте под знамената нови попълнения за Вашата безсмъртна армия. Силата и видът на единиците еволюират заедно с ранга на Вашия Кан.
            </p>

            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 4px; padding: 12px; margin-bottom: 15px; font-size: 0.9em;">
                <div style="margin-bottom: 5px; color: #aaa;">Текуща Епохална Единица:</div>
                <div style="font-size: 1.1em; font-weight: bold; color: #00ffcc; margin-bottom: 8px;">${unitName}</div>
                <div style="display: flex; justify-content: space-between; color: #bbb;">
                    <span>Брой в отряд: <b>+${amount}</b></span>
                    <span>Цена: <b style="color: #ffd700;">${finalCost} злато 💰</b></span>
                </div>
                ${costModifier < 1.0 ? `<div style="color: #4caf50; font-size: 0.8em; margin-top: 5px; font-style: italic;">(Включена -${Math.round((1 - costModifier) * 100)}% родова отстъпка от Династията)</div>` : ''}
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="window.processRecruitment(${finalCost}, ${amount})" style="background: #d4af37; color: black; border: none; padding: 12px; font-weight: bold; cursor: pointer; border-radius: 4px; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(212,175,55,0.15);">Наемане на Отряд</button>
                <button onclick="document.getElementById('barracks-screen').remove()" style="background: #111; color: #aaa; border: 1px solid #333; padding: 10px; cursor: pointer; border-radius: 4px; font-size: 0.85em;">Затваряне на лагера</button>
            </div>

            <div style="margin-top: 15px; border-top: 1px solid #222; padding-top: 10px; font-size: 0.8em; color: #888; display: flex; justify-content: space-between;">
                <span>Вашето Злато: <b id="barracks-ui-gold" style="color: #ffd700;">${hero.gold || 0} 💰</b></span>
                <span>Обща Армия: <b id="barracks-ui-army" style="color: #d4af37;">${hero.currentArmy || hero.armySize || 0} 🏹</b></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(barracksScreen);
};

/**
 * ИЗПЪЛНЕНИЕ НА ПОКУПКАТА И МОМЕНТАЛНО ОБНОВЯВАНЕ НА UI И ВСИЧКИ СВЪРЗАНИ ФАЙЛОВЕ
 */
window.processRecruitment = function(cost, amount) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        
        // СИНХРОНИЗАЦИОНЕН МОСТ: Увеличаваме и двете променливи, за да няма разминаване в битките
        hero.armySize = (hero.armySize || 0) + amount;
        hero.currentArmy = (hero.currentArmy || 0) + amount;
        
        // Подсигуряване на максимума за армия при наемане
        if (hero.maxArmy && hero.currentArmy > hero.maxArmy) {
            hero.maxArmy = hero.currentArmy;
        }

        // Синхронизация с глобалната родова статистика в worldData
        if (window.worldData && window.worldData.clans && hero.id) {
            window.worldData.clans[hero.id].armySize = hero.armySize;
            window.worldData.clans[hero.id].currentArmy = hero.currentArmy;
            window.worldData.clans[hero.id].gold = hero.gold;
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⚔️ УСПЕХ: Нови ${amount} бойци преклониха глава пред Кан ${hero.name}!`);
        }

        // Моментално преначертаване на левия и горния панел в ui.js
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

        // Директно обновяване на стойностите в отворения интерфейс на казармата
        const goldUi = document.getElementById('barracks-ui-gold');
        const armyUi = document.getElementById('barracks-ui-army');
        if (goldUi) goldUi.innerText = `${hero.gold} 💰`;
        if (armyUi) armyUi.innerText = `${hero.currentArmy} 🏹`;

    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато в родовата хазна за този отряд воини!");
        }
    }
};
