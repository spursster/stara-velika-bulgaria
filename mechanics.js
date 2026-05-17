/**
 * МОДУЛ: МЕХАНИКИ - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН (Фентъзи баланс, Без стареене)
 * Статистика на файловете в проекта: 16
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
    return baseValue * multiplier;
};

/**
 * МЕХАНИКА ЗА ПРЕЗ ХОДОВЕТЕ - ВЛАДЕТЕЛИТЕ СА БЕЗСМЪРТНИ
 * Тази функция замества всякакво стареене или естествена смърт.
 */
window.processLeaderTurnMechanics = function(hero) {
    if (!hero) return;
    
    // Инициализация на жизнени статуси, ако липсват
    if (hero.isDead === undefined) hero.isDead = false;
    if (hero.slainByGod === undefined) hero.slainByGod = false;
    
    // Владетелите не стареят. Проверява се само дали не са паднали в битка или покосени от божество.
    if (hero.isDead) {
        return;
    }
    
    // Логика за регенерация на личната мощ/армия на база бонусите на рода
    if (hero.armyRecoveryRate) {
        const recoveryBonus = window.getPerkValue('recovery'); // Бонус на Асеневци
        hero.currentArmy = Math.min(hero.maxArmy, hero.currentArmy + (hero.armyRecoveryRate * recoveryBonus));
    }
};

/**
 * АРХИТЕКТУРА ЗА БЪДЕЩАТА ФУНКЦИЯ: РИТУАЛИ И ВЪЗКРЕСЯВАНЕ
 * Ще се задейства от UI екрана за ритуали, когато бъде добавен.
 */
window.performResurrectionRitual = function(caster, deadHero) {
    if (!caster || !deadHero) return { success: false, msg: "Невалидни данни за ритуала." };
    if (!deadHero.isDead) return { success: false, msg: "Владетелят вече е жив и безсмъртен!" };
    
    const mysticismLevel = (caster.skills && caster.skills.mysticism) || 0;
    const canCast = mysticismLevel >= 4 || 
                    caster.currentClass === "Колобър-Магьосник" || 
                    caster.currentClass === "Некромант от Хиперборея" ||
                    caster.currentClass === "Посветен на Авитохол";
                    
    if (!canCast) {
        return { success: false, msg: `${caster.name} няма необходимите тайни познания или клас, за да извърши възкресяване!` };
    }
    
    let baseChance = 0.40 + (mysticismLevel * 0.05); 
    if (caster.dynasty === "Одриси") {
        baseChance *= (window.dynastyPerks["Одриси"].ritual || 1.3); 
    }
    
    const roll = Math.random();
    if (roll <= baseChance) {
        deadHero.isDead = false;
        deadHero.slainByGod = false;
        if (deadHero.currentArmy !== undefined) deadHero.currentArmy = Math.floor(deadHero.maxArmy * 0.2); 
        
        return { 
            success: true, 
            msg: `✨ ВЕЛИК РИТУАЛ: ${caster.name} успешно призова древните сили и възкреси ${deadHero.name} от род ${deadHero.dynasty}!` 
        };
    } else {
        return { 
            success: false, 
            msg: `🔮 Ритуалът се провали. Духът на ${deadHero.name} остава в отвъдното.` 
        };
    }
};
