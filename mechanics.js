/**
 * МОДУЛ: МЕХАНИКИ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода)
 * Дефинира уникалните бонуси и математическата логика на родовете.
 */

window.dynastyPerks = {
    // Основатели и наследствени бонуси
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.25, desc: "+25% Легитимност (Родът на Кановете)" },
    "Комитопули": { power: 1.15, defense: 1.15, desc: "+15% Защита на крепостите" },
    "Асеневци": { power: 1.0, recovery: 1.25, desc: "+25% Скорост на възстановяване" },
    "Тертер": { power: 1.1, mobility: 1.15, desc: "+15% Скорост при поход" },
    "Даки": { power: 1.1, armyCost: 0.85, desc: "-15% Цена за наемане на войска" },
    "Уния Траки": { power: 1.0, gold: 1.2, desc: "+20% Приход от ресурси (Злато и Дървесина)" },
    "Шишмановци": { power: 1.0, buildCost: 0.8, desc: "-20% Цена за строеж на сгради" },
    "Македони": { power: 1.2, gold: 1.0, desc: "+20% Обща бойна мощ" },
    "Птоломеи": { power: 1.0, tech: 1.25, desc: "+25% Знание и Култура" },
    "Одриси": { power: 1.0, ritual: 1.3, desc: "+30% Ритуална мощ и мистицизъм" },
    "Бесараб": { power: 1.05, gold: 1.15, desc: "+15% Търговски приходи от Дунав" },
    "Османци Дуло": { power: 1.15, expansion: 1.1, desc: "+15% Ефективност при обсада" },
    "Скити": { power: 1.2, cavalry: 1.3, desc: "+30% Мощ на конницата (Стрелци с лък)" }
};

/**
 * Връща стойността на конкретен бонус за текущия герой.
 * Използва се в икономиката, битките и събитията.
 * @param {string} perkType - Тип на бонуса (напр. 'gold', 'power', 'buildCost')
 */
window.getPerkValue = function(perkType) {
    if (!window.currentHero || !window.dynastyPerks) return 1.0;
    
    const dynasty = window.currentHero.dynasty;
    const perk = window.dynastyPerks[dynasty];
    
    if (perk && perk[perkType] !== undefined) {
        return perk[perkType];
    }
    
    return 1.0; // По подразбиране няма модификатор
};

/**
 * Изчислява модифицирана стойност спрямо бонусите на рода.
 * @param {number} baseValue - Базова стойност
 * @param {string} perkType - Тип на бонуса
 */
window.applyPerkToValue = function(baseValue, perkType) {
    const multiplier = window.getPerkValue(perkType);
    
    // За бонуси тип "cost" (цена), по-малко от 1.0 е по-добре
    return baseValue * multiplier;
};
