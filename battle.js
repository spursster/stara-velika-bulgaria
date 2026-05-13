/**
 * МОДУЛ: БИТКИ И ЕКСПАНЗИЯ
 * Този файл управлява военните конфликти и завладяването на нови провинции.
 */

window.startBattle = function() {
    // 1. Проверка за налична армия
    if (window.currentHero.armySize < 10) {
        alert("Нямаш достатъчно войска за поход!");
        return;
    }

    // 2. Дефиниране на враг (Ромеи)
    const enemyNames = ["Генерал на Ромеите", "Стратиг от Румелия", "Екзарх на Изтока"];
    const enemyName = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    const enemyPower = Math.floor(Math.random() * (window.currentHero.heroPower * 1.5)) + 20;

    // 3. Изчисляване на бонус от Династията (от mechanics.js)
    // Използваме твоите 13 бонуса
    const playerAttackPower = window.applyPerk(window.currentHero.heroPower, "power", window.currentHero.dynasty);

    // 4. Логика на битката
    let battleResult = "";
    let won = false;

    if (playerAttackPower >= enemyPower) {
        won = true;
        const rewardGold = 150 + Math.floor(Math.random() * 200);
        const xpGain = 25;
        
        window.currentHero.gold += rewardGold;
        window.currentHero.xp += xpGain;
        
        // Завладяване на нова провинция
        const newProvince = window.discoverNewProvince();
        if (newProvince) {
            window.playerRegions.push(newProvince);
            battleResult = `Победа! Кан ${window.currentHero.name} разгроми ${enemyName}. Завладяна е нова провинция: ${newProvince}. Плячка: ${rewardGold} злато.`;
        } else {
            battleResult = `Победа! ${enemyName} отстъпи. Плячка: ${rewardGold} злато. Всички близки земи са вече твои!`;
        }
    } else {
        const loss = Math.floor(window.currentHero.armySize * 0.2);
        window.currentHero.armySize -= loss;
        battleResult = `Поражение! ${enemyName} се оказа по-силен. Загуби ${loss} воини.`;
    }

    // 5. Обновяване на UI чрез ui.js
    alert(battleResult);
    window.updateCharacterUI(window.currentHero);
};

/**
 * Генерира име на нова провинция, която все още не е завладяна.
 */
window.discoverNewProvince = function() {
    const allProvinces = [
        "Северна Тракия", "Мизия", "Македония", "Бесарабия", 
        "Панония", "Добруджа", "Арбанаси", "Вардар", "Струма"
    ];
    
    // Филтрираме тези, които играчът вече владее
    const available = allProvinces.filter(p => !window.playerRegions.includes(p));
    
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
};

console.log("Модул Battle.js е зареден и готов.");
