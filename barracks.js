/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН) - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Връзка с Top Bar UI и Родови Модификатори)
 * КОРЕКЦИЯ: Поправен бъг с пропадането на прозореца на мобилни устройства (добавен адаптивен фиксиран изглед и скрол)
 * Статистика на файловете в проекта: 16
 */

// Функцията е напълно обвързана с бутона buyUnits в интерфейса
window.buyUnits = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Изчисляване на цената съобразено с родовите предимства от mechanics.js
    const costModifier = window.getPerkValue ? window.getPerkValue('armyCost') : 1.0;
    const baseCost = 250; 
    const finalCost = Math.floor(baseCost * costModifier);
    const amount = 100; 

    // Премахваме стария прозорец, ако случайно е останал отворен
    const oldScreen = document.getElementById('barracks-screen');
    if (oldScreen) oldScreen.remove();

    // Създаваме новия прозорец и го закачаме директно към body за максимална стабилност над всичко
    const barracksScreen = document.createElement('div');
    barracksScreen.id = 'barracks-screen';
    
    // Адаптивни стилове за компютър и телефон: фиксиран по средата, висок z-index и вътрешен скрол
    barracksScreen.style.cssText = `
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);
        width: 95%; 
        max-width: 460px; 
        max-height: 85vh; 
        overflow-y: auto; 
        padding: 25px; 
        background: rgba(10, 10, 10, 0.98); 
        border: 2px solid #d4af37; 
        color: white; 
        z-index: 30000; 
        font-family: 'Georgia', serif; 
        box-sizing: border-box;
        border-radius: 8px;
        box-shadow: 0 0 30px rgba(0,0,0,0.95);
    `;

    // Визуализация на екрана на казармата със стилистика Georgia
    barracksScreen.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #d4af37; font-family: 'Cinzel', serif; font-size: 1.3em; letter-spacing: 1px;">⚔️ ВОЕНЕН СТАН</h2>
            <button onclick="document.getElementById('barracks-screen').remove()" style="background: none; border: 1px solid #d4af37; color: #d4af37; font-size: 14px; cursor: pointer; padding: 2px 8px; border-radius: 4px; font-weight: bold;">X</button>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #ccc; margin-bottom: 20px; text-align: center;">
            Тук събирате своите верни дружини. Наемането на воини увеличава числеността на армията Ви, гарантирайки защитата и величието на Вашите земи.
        </p>

        <div style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 10px;">ДРУЖИНА ОТ НОВИ ВОИНИ</div>
            <div style="font-size: 13px; color: #aaa; margin-bottom: 15px;">Брой воини: <span style="color: #00ffcc; font-weight: bold;">+${amount}</span></div>
            
            <button onclick="window.processRecruitment(${finalCost}, ${amount})" style="width: 100%; padding: 12px; background: #111; color: #d4af37; border: 1px solid #d4af37; font-weight: bold; text-transform: uppercase; cursor: pointer; border-radius: 4px; font-size: 12px; transition: background 0.2s;" onmouseover="this.style.background='#222'" onmouseout="this.style.background='#111'">
                Наеми за ${finalCost} 💰
            </button>
        </div>

        <div style="border-top: 1px solid #333; padding-top: 15px; margin-top: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #aaa;">ВАШАТА ХАЗНА: <b style="color: #ffd700;\">${Math.floor(hero.gold)} 💰</b></span>
                <span style="font-size: 12px; color: #aaa;">ТЕКУЩА АРМИЯ: <b style="color: #d4af37;\">${hero.armySize} 🏹</b></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(barracksScreen);
};

/**
 * ИЗПЪЛНЕНИЕ НА ПОКУПКАТА И МОМЕНТАЛНО ОБНОВЯВАНЕ НА UI
 */
window.processRecruitment = function(cost, amount) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        hero.armySize += amount;
        
        // Синхронизация с глобалната родова статистика в worldData
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
            window.worldData.clans[hero.dynasty].armySize = hero.armySize;
            window.worldData.clans[hero.dynasty].gold = hero.gold;
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⚔️ УСПЕХ: Наети са нови ${amount} воини под знамето на Кан ${hero.name}!`);
        }

        // 🎯 СИНХРОНИЗАЦИОНЕН МОСТ: Моментално преначертаване на Top Bar и екрана
        if (window.updateCharacterUI) window.updateCharacterUI(hero);

        // Обновяваме текста на хазната и армията директно в отворения Военен Стан, за да се види веднага промяната
        const barracksScreen = document.getElementById('barracks-screen');
        if (barracksScreen) {
            // Преначертаваме прозореца, за да се актуализират цифрите за злато в реално време
            window.buyUnits();
        }
    } else {
        alert("Нямате достатъчно злато в съкровищницата!");
    }
};
