/**
 * МОДУЛ: БИТКИ И ЕКСПАНЗИЯ (Пълна версия)
 * Управлява военните конфликти, завладяването на провинции и сезонните бонуси.
 * Всички резултати се записват в централната хроника (events.js).
 */

window.startBattle = function() {
    const hero = window.currentHero;
    const lang = window.gameLang;

    // 1. Проверка за минимална численост на войската
    if (hero.armySize < 10) {
        const warning = lang === "BG" 
            ? "⚠️ Твърде малко воини за поход! Наемете войска в Казармата." 
            : "⚠️ Too few warriors for a campaign! Recruit troops in the Barracks.";
        window.logEvent(warning, "info");
        return;
    }

    // 2. Дефиниране на врага (Ромеи или други местни родове)
    const enemyNamesBG = ["Ромейски легион", "Стратиг на Румелия", "Отряд на Скитите", "Бунтовнически род"];
    const enemyNamesUS = ["Roman Legion", "Strategos of Rumelia", "Scythian Warband", "Rebel Clan"];
    
    const enemyList = lang === "BG" ? enemyNamesBG : enemyNamesUS;
    const enemyName = enemyList[Math.floor(Math.random() * enemyList.length)];
    
    // Силата на врага е динамична спрямо текущата мощ на играча
    const enemyPower = Math.floor(Math.random() * (hero.heroPower * 1.2)) + 20;

    // 3. Калкулиране на бойната мощ на играча
    // А) Базов династичен бонус (mechanics.js)
    let totalAttackPower = window.applyPerk(hero.heroPower, "power", hero.dynasty);

    // Б) Сезонен модификатор (barracks.js)
    const seasonMod = (typeof window.getSeasonModifier === "function") ? window.getSeasonModifier() : 1.0;
    totalAttackPower *= seasonMod;

    // 4. Логика на битката
    let battleMessage = "";
    let statusType = "";

    if (totalAttackPower >= enemyPower) {
        // --- ПОБЕДА ---
        statusType = "war";
        const rewardGold = 150 + Math.floor(Math.random() * 200);
        const xpGain = 30;
        
        hero.gold += rewardGold;
        hero.xp += xpGain;
        
        // Опит за завладяване на нова територия
        const newProvince = window.discoverNewProvince();
        
        if (newProvince) {
            window.playerRegions.push(newProvince);
            if (lang === "BG") {
                battleMessage = `⚔️ Велика победа! Кан ${hero.name} разгроми ${enemyName} и присъедини ${newProvince} към Империята! Плячка: ${rewardGold} 💰.`;
            } else {
                battleMessage = `⚔️ Great victory! Kan ${hero.name} crushed ${enemyName} and annexed ${newProvince}! Loot: ${rewardGold} 💰.`;
            }
        } else {
            if (lang === "BG") {
                battleMessage = `⚔️ Победа! ${enemyName} отстъпи пред вашата мощ. Плячка: ${rewardGold} 💰. Всички близки земи са вече ваши!`;
            } else {
                battleMessage = `⚔️ Victory! ${enemyName} retreated before your might. Loot: ${rewardGold} 💰. All nearby lands are already yours!`;
            }
        }
    } else {
        // --- ПОРАЖЕНИЕ ---
        statusType = "info";
        const loss = Math.floor(hero.armySize * 0.15); // Загуба на 15% от войската
        hero.armySize -= loss;
        
        // Намаляване на общата мощ поради загубите
        hero.heroPower = Math.max(50, hero.heroPower - (loss * 2));

        if (lang === "BG") {
            battleMessage = `💀 Тежко поражение! ${enemyName} прекърши нашите редици. Загубихме ${loss} воини в битката.`;
        } else {
            battleMessage = `💀 Defeat! ${enemyName} broke our lines. We lost ${loss} warriors in battle.`;
        }
    }

    // 5. Записване на резултата в Имперската Хроника
    window.logEvent(battleMessage, statusType);

    // 6. Обновяване на интерфейса (ui.js)
    window.updateCharacterUI(hero);
};

/**
 * Генерира име на нова провинция, която все още не е в списъка на играча.
 */
window.discoverNewProvince = function() {
    const allProvinces = [
        "Мизия", "Тракия", "Македония", "Бесарабия", 
        "Панония", "Добруджа", "Вардар", "Струма", "Родопи", 
        "Загоре", "Епир", "Тесалия", "Далмация"
    ];
    
    // Филтрираме само провинциите, които играчът НЕ притежава
    const available = allProvinces.filter(p => !window.playerRegions.includes(p));
    
    if (available.length === 0) return null;
    
    // Избираме случайна от останалите
    return available[Math.floor(Math.random() * available.length)];
};

console.log("Battle.js: Пълният модул е зареден и синхронизиран с Хрониката и Сезоните.");
