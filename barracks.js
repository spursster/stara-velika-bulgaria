/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН) - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Връзка с Top Bar UI и Родови Модификатори)
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

    // Визуализация на екрана на казармата със стилистика Georgia
    mainArea.innerHTML = `
        <div id="barracks-screen" style="padding:25px; background: rgba(5,5,5,0.98); border: 2px solid #d4af37; color: white; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 100; font-family: 'Georgia', serif; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2 style="color: #d4af37; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 1.3em;">Военен Стан (Казарми)</h2>
                <button onclick="document.getElementById('barracks-screen').remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:24px; font-weight:bold;">✕</button>
            </div>

            <p style="font-size: 0.95em; color: #ccc; line-height: 1.6; margin-bottom: 25px;">
                Съберете елитни конници и стрелци под знамената на род <b style="color: #d4af37;">${hero.dynasty}</b>. 
                Всяка войска увеличава общата Ви мощ по време на битки за нови региони.
            </p>

            <div style="background: #0d0d0d; border: 1px solid #222; padding: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; max-width: 500px;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #fff; text-transform: uppercase; font-size: 0.95em; letter-spacing: 0.5px;">Стихове от Опълчение</h4>
                    <span style="font-size: 0.8em; color: #888;">Пакет от +${amount} воини</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.1em; color: #ffd700; font-weight: bold; margin-bottom: 8px;">${finalCost} 💰</div>
                    <button onclick="window.processRecruitment(${finalCost}, ${amount})" style="background: #7b1a1a; color: white; border: 1px solid #a32a2a; padding: 8px 16px; cursor: pointer; font-weight: bold; font-size: 0.85em; text-transform: uppercase; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#992222'" onmouseout="this.style.background='#7b1a1a'">
                        Наеми Войска
                    </button>
                </div>
            </div>

            <div style="margin-top: 30px; display: flex; justify-content: space-between; padding: 12px; background: #111; border: 1px solid #333; border-radius: 4px; max-width: 500px;">
                <span style="font-size: 12px; color: #aaa;">ВАШАТА ХАЗНА: <b style="color: #ffd700;">${Math.floor(hero.gold)} 💰</b></span>
                <span style="font-size: 12px; color: #aaa;">ТЕКУЩА АРМИЯ: <b style="color: #d4af37;">${hero.armySize} 🏹</b></span>
            </div>
        </div>
    `;
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
        if (window.updateCharacterUI) {
            window.updateCharacterUI(hero);
        }
        
        // Презареждаме вътрешния изглед на казармата, за да се отразят новите стойности в долната лента
        window.buyUnits();
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`❌ ГРЕШКА: Нямате достатъчно злато в хазната за това наемане!`);
        }
    }
};
