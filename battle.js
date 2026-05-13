/**
 * МОДУЛ: БИТКИ И ЕКСПАНЗИЯ
 * Управлява военните конфликти и завладяването на нови провинции.
 * Всички резултати се изписват в централната Имперска Хроника.
 */

window.startBattle = function() {
    const hero = window.currentHero;
    const lang = window.gameLang;

    // 1. Проверка за налична армия
    if (hero.armySize < 10) {
        const warning = lang === "BG" ? "Нямате достатъчно войска за поход!" : "Not enough troops for a campaign!";
        window.logEvent(warning, "info");
        return;
    }

    // 2. Дефиниране на врага
    const enemyNamesBG = ["Ромейски легион", "Стратиг на Румелия", "Скитски отряд", "Гарнизон на крепост"];
    const enemyNamesUS = ["Roman Legion", "Strategos of Rumelia", "Scythian Warband", "Fortress Garrison"];
    
    const enemyList = lang === "BG" ? enemyNamesBG : enemyNamesUS;
    const enemyName = enemyList[Math.floor(Math.random() * enemyList.length)];
    
    // Силата на врага варира спрямо прогреса на играча
    const enemyPower = Math.floor(Math.random() * (hero.heroPower * 1.3)) + 15;

    // 3. Изчисляване на бойната мощ на Кана с династичен бонус
    // Използваме механиката от mechanics.js
    const playerAttackPower = window.applyPerk(hero.heroPower, "power", hero.dynasty);

    // 4. Логика на битката
    let battleMessage = "";
    let statusType = "";

    if (playerAttackPower >= enemyPower) {
        // ПОБЕДА
        statusType = "war";
        const rewardGold = 100 + Math.floor(Math.random() * 150);
        const xpGain = 20;
        
        hero.gold += rewardGold;
        hero.xp += xpGain;
        
        // Опит за завладяване на нова провинция
        const newProvince = window.discoverNewProvince();
        
        if (newProvince) {
            window.playerRegions.push(newProvince);
            if (lang === "BG") {
                battleMessage = `Велика победа! Кан ${hero.name} срази ${enemyName}. Завладяна е провинция ${newProvince}. Плячка: ${rewardGold} злато.`;
            } else {
                battleMessage = `Great Victory! Kan ${hero.name} crushed ${enemyName}. Province ${newProvince} is conquered. Loot: ${rewardGold} gold.`;
            }
        } else {
            if (lang === "BG") {
                battleMessage = `Победа над ${enemyName}! Врагът бе прогонен. Плячка: ${rewardGold} злато.`;
            } else {
                battleMessage = `Victory over ${enemyName}! The enemy fled. Loot: ${rewardGold} gold.`;
            }
        }
    } else {
        // ПОРАЖЕНИЕ
        statusType = "info";
        const loss = Math.floor(hero.armySize * 0.15);
        hero.armySize -= loss;
        
        if (lang === "BG") {
            battleMessage = `Тежка битка! ${enemyName} удържа позициите. Загубихме ${loss} воини в Румелия.`;
        } else {
            battleMessage = `Tough battle! ${enemyName} held their ground. We lost ${loss} warriors.`;
        }
    }

    // 5. ИЗПИСВАНЕ В ЦЕНТРАЛНАТА ХРОНИКА (вместо alert)
    window.logEvent(battleMessage, statusType);

    // 6. Обновяване на UI
    window.updateCharacterUI(hero);
};

/**
 * Генерира име на нова провинция от world_data.js
 */
window.discoverNewProvince = function() {
    const allProvinces = [
        "Мизия", "Тракия", "Македония", "Бесарабия", 
        "Панония", "Добруджа", "Вардар", "Струма", "Родопи"
    ];
    
    const available = allProvinces.filter(p => !window.playerRegions.includes(p));
    
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
};

console.log("Battle.js е обновен: Всички съобщения са насочени към Имперската Хроника.");
