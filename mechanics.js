/**
 * МОДУЛ: ОСНОВНИ ИГРОВИ МЕХАНИКИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (ГЕРОИ И КЛАНОВЕ)
 * КОРЕКЦИЯ: Поправен счупен 'if' оператор. Пълна интеграция с Diablo дървото и инвентара без външни филтри.
 * Статистика на файловете в проекта: 17
 */

// База данни за родовите бонуси (Perks) на 13-те клана в играта
window.clanPerks = {
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.25, desc: "+25% Легитимност (Родът на Кановете)" },
    "Комитопули": { power: 1.15, defense: 1.15, desc: "+15% Защита на крепостите" },
    "Асеневци": { power: 1.0, recovery: 1.25, desc: "+25% Скорост на възстановяване на армията" },
    "Тертер": { power: 1.1, mobility: 1.15, desc: "+15% Скорост при поход" },
    "Даки": { power: 1.1, armyCost: 0.85, desc: "-15% Цена за наемане на войска" },
    "Уния Траки": { power: 1.15, gold: 1.15, desc: "+15% Добиви на скъпоценности и съкровища" },
    "Шишмановци": { power: 1.0, buildCost: 0.8, desc: "-20% Цена за строеж на сгради" },
    "Македони": { power: 1.2, empireTactics: 1.2, desc: "+20% Бойна ефективност при щурм" },
    "Птоломеи": { power: 1.0, gold: 1.3, desc: "+30% Приходи от търговия" },
    "Одриси": { power: 1.15, cavalryPower: 1.2, desc: "+20% Нападателна мощ на конницата" },
    "Бесараб": { power: 1.0, gold: 1.2, desc: "+20% Данъчен икономически бонус" },
    "Османци Дуло": { power: 1.1, vassalTax: 1.25, desc: "+25% Приходи от васали" },
    "Скити": { power: 1.1, horseArchers: 1.25, desc: "+25% Щети на конните стрелци" }
};

/**
 * ИНИЦИАЛИЗИРАНЕ НА НАЧАЛНИ RPG ХАРАКТЕРИСТИКИ ЗА ГЕРОЙ
 */
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    
    if (typeof hero.level === 'undefined') hero.level = 1;
    if (typeof hero.xp === 'undefined') hero.xp = 0;
    if (typeof hero.skillPoints === 'undefined') hero.skillPoints = 0;
    if (typeof hero.heroPower === 'undefined') hero.heroPower = 100;
    if (typeof hero.currentClass === 'undefined') hero.currentClass = "Багатур";
    if (typeof hero.inventory === 'undefined') hero.inventory = [];
    if (typeof hero.isDead === 'undefined') hero.isDead = false;

    if (!hero.skills) {
        hero.skills = {
            tactics: 0, endurance: 0, heavyStrike: 0, bloodbath: 0,
            economy: 0, goldRush: 0, bazaars: 0, cartel: 0,
            ambush: 0, poisonBlade: 0, shadowStep: 0, assassinate: 0,
            mysticism: 0, tangraFire: 0, vampirism: 0, raiseDead: 0
        };
    }
};

/**
 * ВДИГАНЕ НА НИВО НА КОНКРЕТНО DIABLO УМЕНИЕ НА ГЕРОЯ
 */
window.upgradeLeaderSkill = function(hero, skillKey) {
    if (!hero) return { success: false, msg: "Невалиден герой." };
    
    window.initializeHeroRPGData(hero);
    
    if ((hero.skillPoints || 0) <= 0) {
        return { success: false, msg: "Нямате свободни точки за разпределяне!" };
    }

    if (typeof hero.skills[skillKey] === 'undefined') {
        hero.skills[skillKey] = 0;
    }

    // Вдигане на нивото на умението
    hero.skills[skillKey] += 1;
    hero.skillPoints -= 1;
    
    // Бонуси към мощта от базови бойни пасиви
    if (skillKey === "endurance") hero.heroPower = (hero.heroPower || 100) + 10;
    if (skillKey === "tactics") hero.heroPower = (hero.heroPower || 100) + 15;

    // Преизчисляване на силата на героя заедно с инвентарните обекти
    if (window.getInventoryBonuses) {
        let invBonuses = window.getInventoryBonuses(hero);
        hero.heroPower = (100 + (hero.level * 20) + (hero.skills.tactics * 15) + (hero.skills.endurance * 10)) + invBonuses.heroPower;
    }

    // Проверка за автоматична еволюция на хибриден клас в ArcheAge стил
    if (window.rpgDatabase && window.rpgDatabase.checkArcheAgeClass) {
        window.rpgDatabase.checkArcheAgeClass(hero);
    }

    // Синхронизация с UI компонентите и Топ 6 списъците
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    return { success: true, msg: `Успешно подобрихте умението ${skillKey}!` };
};

/**
 * КЛАСОВА ЕВОЛЮЦИЯ НА ГЕРОЯ (ARCHEAGE ХИБРИДИЗАЦИЯ)
 * КОРЕКЦИЯ: Поправен счупен синтактичен 'if' оператор
 */
window.evolveLeaderClass = function(hero, targetClass) {
    // КОРИГИРАНО: Счупеното условие е фиксирано с логическо или (||)
    if (!hero || (hero.level || 1) < 5) {
        return { success: false, msg: "Героят трябва да е достигнал поне 5-то ниво!" };
    }
    
    hero.currentClass = targetClass;
    hero.heroPower = (hero.heroPower || 100) + 50; 

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: Героят ${hero.name} прие новия клас: \"${targetClass}\"! Мощта му нарасна.`);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    
    return { success: true, msg: `Класът е успешно променен на ${targetClass}!` };
};

/**
 * РИТУАЛ ЗА ВЪЗКРЕСЯВАНЕ НА УБИТ ГЕРОЙ
 */
window.performResurrectionRitual = function(caster, deadHero) {
    if (!caster || !deadHero) return { success: false, msg: "Липсват данни за героя." };
    
    window.initializeHeroRPGData(caster);
    window.initializeHeroRPGData(deadHero);

    const mysticismLevel = caster.skills ? (caster.skills.mysticism || 0) : 0;
    
    // Влияние на мистицизма върху шанса за успешно възкресяване
    let baseChance = 0.40 + (mysticismLevel * 0.15); 
    let roll = Math.random();

    if (roll <= baseChance) {
        deadHero.isDead = false;
        deadHero.currentArmy = 50; 
        deadHero.armySize = 50;

        if (window.worldData && window.worldData.clans && window.worldData.clans[deadHero.dynasty]) {
            window.worldData.clans[deadHero.dynasty].isDead = false;
            window.worldData.clans[deadHero.dynasty].currentArmy = 50;
            window.worldData.clans[deadHero.dynasty].armySize = 50;
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🔮 СЪДБА: Свещеният ритуал успя! Героят ${deadHero.name} се завърна на бойното поле!`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

        return { success: true, msg: `Успешно възкресяване!` };
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`📉 ПРОВАЛ: Ритуалът не върна героя ${deadHero.name}. Опитайте отново през следващия сезон.`);
        }
        return { success: false, msg: "Ритуалът се провали." };
    }
};
