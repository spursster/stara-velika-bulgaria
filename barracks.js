/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН И КОСМИЧЕСКИ ДОК) - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Интеграция на 100+ Diablo Способности & ArcheAge Класове)
 * КОРЕКЦИЯ: Цената за наемане, ветеранските бонуси и подкупите вече четат точките от rpg_system.js.
 * Статистика на файловете в проекта: 16
 */

window.buyUnits = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Инициализиране на RPG структурата, ако липсва
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    let skills = hero.skills || {};

    // 1. ИЗЧИСЛЯВАНЕ НА ЦЕНОВИЯ МОДИФИКАТОР (Родови бонуси + Diablo пасиви)
    let costModifier = 1.0;
    if (hero.dynasty && window.dynastyPerks && window.dynastyPerks[hero.dynasty]) {
        const perk = window.dynastyPerks[hero.dynasty];
        if (perk.armyCost) costModifier = perk.armyCost;
    }

    // Diablo пасив: Величие/Харизма (stature) намалява цената с 4% на всяка точка
    if ((skills.stature || 0) > 0) {
        costModifier = Math.max(0.3, costModifier - (skills.stature * 0.04));
    }

    // ArcheAge Бонус за военни класове
    if (hero.currentClass === "Имперски Воевода" || hero.currentClass === "Генерал-Легат" || hero.currentClass === "Обсаден Командир") {
        costModifier = Math.max(0.25, costModifier - 0.08); // Допълнителна класова отстъпка
    }

    // ДИНАМИЧНО ОПРЕДЕЛЯНЕ НА ЕДИНИЦИТЕ СПОРЕД RPG НИВОТО И ЕПОХАТА ЗА БЕЗКРАЙНО БЪДЕЩЕ
    let unitName = "Антични Воини";
    let baseCost = 250;
    let amount = 100;

    if (window.gameTime && window.gameTime.era) {
        let era = window.gameTime.era;
        if (era === 1) { unitName = "Тракийски Стрелци"; baseCost = 220; }
        else if (era === 2) { unitName = "Средновековни Багатури"; baseCost = 300; }
        else if (era === 3) { unitName = "Царски Мускетари"; baseCost = 450; }
        else if (era === 4) { unitName = "Имперска Линейна Пехота"; baseCost = 600; }
        else if (era === 5) { unitName = "Кибернетични Стражи"; baseCost = 1000; amount = 80; }
        else if (era >= 6) { unitName = "Междузвездни Кръстосвачи 🚀"; baseCost = 2500; amount = 50; }
    } else {
        // Fallback еволюция според RPG нивото, ако времето не е заредено
        if (hero.level >= 5) { unitName = "Елитни Тежки Конници"; baseCost = 500; }
        else if (hero.level >= 3) { unitName = "Родови Стрелци"; baseCost = 350; }
    }

    // Diablo пасив: Ветеранско обучение (veteranTraining) увеличава бройката на наетите с +5 на точка
    if ((skills.veteranTraining || 0) > 0) {
        amount += (skills.veteranTraining * 5);
    }

    let finalCost = Math.floor(baseCost * costModifier);

    // Diablo пасив: Дипломатический подкуп (bribe) - 10% шанс за безплатни войници при отваряне на казармата
    let bribeBonusReport = "";
    if ((skills.bribe || 0) > 0 && Math.random() < 0.15) {
        let defectors = Math.floor(skills.bribe * 12);
        hero.armySize += defectors;
        hero.currentArmy = (hero.currentArmy || 0) + defectors;
        bribeBonusReport = `<p style="color: #ffcc00; font-size: 0.85em; margin: 5px 0; text-align: center;">💰 [ПОДКУП]: Успяхте да подкупите ${defectors} вражески дезертьори, които се вляха в армията ви безплатно!</p>`;
        
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
            window.worldData.clans[hero.dynasty].armySize = hero.armySize;
        }
    }

    // Премахваме стария прозорец, ако съществува
    const oldScreen = document.getElementById('barracks-screen');
    if (oldScreen) oldScreen.remove();

    // Изграждане на адаптивния интерфейс на Военния Стан
    const barracksScreen = document.createElement('div');
    barracksScreen.id = 'barracks-screen';
    barracksScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.95); z-index: 25000;
        display: flex; align-items: center; justify-content: center;
        color: white; font-family: 'Georgia', serif; box-sizing: border-box; padding: 10px;
    `;

    let classTitle = hero.currentClass && hero.currentClass !== "Няма клас" ? ` (${hero.currentClass})` : "";

    barracksScreen.innerHTML = `
        <div style="width: 100%; max-width: 460px; background: #080808; border: 2px solid #d4af37; padding: 25px; box-sizing: border-box; border-radius: 6px; box-shadow: 0 0 20px rgba(0,0,0,0.8); max-height: 95vh; overflow-y: auto;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 12px; text-transform: uppercase; font-size: 1.2em; letter-spacing: 1px;">⚔️ ВОЕНЕН СТАН И КАЗАРМИ ⚔️</h2>
            <p style="text-align: center; font-size: 0.85em; color: #aaa; margin-bottom: 20px;">Главнокомандващ: <b style="color: #fff;">Кан ${hero.name}${classTitle}</b></p>
            
            ${bribeBonusReport}

            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 5px 0; font-size: 0.9em; display: flex; justify-content: space-between;">
                    <span>Текуща военна еволюция:</span>
                    <b style="color: #ffd700;">${unitName}</b>
                </p>
                <p style="margin: 5px 0; font-size: 0.9em; display: flex; justify-content: space-between;">
                    <span>Численост на наборна група:</span>
                    <b style="color: #4caf50;">+${amount} бойци</b>
                </p>
                <p style="margin: 5px 0; font-size: 0.9em; display: flex; justify-content: space-between;">
                    <span>Родова цена за група:</span>
                    <b style="color: #f39c12;">${finalCost} злато</b>
                </p>
                ${(skills.stature || 0) > 0 ? `<p style="margin: 3px 0; font-size: 0.75em; color: #85c1e9;">✨ [ВЕЛИЧЕ]: Отстъпка за харизма: -${skills.stature * 4}% цена.</p>` : ""}
                ${(skills.veteranTraining || 0) > 0 ? `<p style="margin: 3px 0; font-size: 0.75em; color: #a9dfbf;">✨ [ОБУЧЕНИЕ]: Допълнителни +${skills.veteranTraining * 5} ветерани на набор.</p>` : ""}
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.85em; background: #000; padding: 12px; border: 1px solid #333; border-radius: 4px; margin-bottom: 25px;">
                <span>Хазна: <b id="barracks-ui-gold" style="color: #ffd700;">${hero.gold} 💰</b></span>
                <span>Твоята войска: <b id="barracks-ui-army" style="color: #d4af37;">${hero.armySize} 🏹</b></span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.processRecruitment(${finalCost}, ${amount})" 
                        style="background: #a32a2a; color: white; border: 1px solid #ff4444; padding: 12px; font-size: 0.95em; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; width: 100%;">НАЕМИ ВОЙСКА</button>
                
                <button onclick="document.getElementById('barracks-screen').remove()" 
                        style="background: #111; color: #ccc; border: 1px solid #333; padding: 10px; font-size: 0.85em; cursor: pointer; border-radius: 4px; width: 100%;">ЗАТВОРИ СТАНА</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(barracksScreen);
};

window.processRecruitment = function(cost, amount) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        hero.armySize += amount;
        hero.currentArmy = (hero.currentArmy || 0) + amount;
        
        // Подсигуряване на максимума за армия при наемане
        if (hero.maxArmy && hero.currentArmy > hero.maxArmy) {
            hero.maxArmy = hero.currentArmy;
        }

        // Синхронизация с глобалната родова статистика в worldData
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
            window.worldData.clans[hero.dynasty].armySize = hero.armySize;
            window.worldData.clans[hero.dynasty].currentArmy = hero.currentArmy;
            window.worldData.clans[hero.dynasty].gold = hero.gold;
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⚔️ УСПЕХ: Нови ${amount} бойци преклониха глава пред Кан ${hero.name}!`);
        }

        // Моментално преначертаване на левия и горния панел
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

        // Директно обновяване на стойностите в отворения интерфейс на казармата
        const goldUi = document.getElementById('barracks-ui-gold');
        const armyUi = document.getElementById('barracks-ui-army');
        if (goldUi) goldUi.innerText = `${hero.gold} 💰`;
        if (armyUi) armyUi.innerText = `${hero.armySize} 🏹`;

    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ ГРЕШКА: Нямате достатъчно злато в родовата хазна за този наем!");
        }
    }
};
