/**
 * МОДУЛ: МЕХАНИКИ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН И СИНХРОНИЗИРАН СЪС ЗАКОНА НА DATABASE.JS
 * КОРЕКЦИЯ: Точно 13 династии от оригиналния закон, обвързани с новата инвентарна и RPG система за водачите.
 * Статистика на файловете в проекта: 16
 */

window.dynastyPerks = {
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.25, desc: "+25% Легитимност (Родът на Кановете)" },
    "Комитопули": { power: 1.15, defense: 1.15, desc: "+15% Защита на крепостите" },
    "Асеневци": { power: 1.0, recovery: 1.25, desc: "+25% Скорост на възстановяване" },
    "Тертер": { power: 1.1, mobility: 1.15, desc: "+15% Скорост при поход" },
    "Лизимах": { power: 1.1, gold: 1.15, desc: "+15% Добиви на скъпоценности и съкровища" },
    "Гети": { power: 1.15, endurance: 1.1, desc: "+15% Бойна издръжливост на родовите конници" },
    "Спартакиди": { power: 1.2, arenaBonus: 1.5, desc: "+20% Щета на пехотата и Арена бонус" },
    "Даки": { power: 1.1, armyCost: 0.85, desc: "-15% Цена за наемане на войска" },
    "Шишмановци": { power: 1.0, buildCost: 0.8, desc: "-20% Цена за строеж на сгради" },
    "Македони": { power: 1.2, empireTactics: 1.2, desc: "+20% Стратегическа мощ при далечни завоевания" },
    "Птоломеи": { power: 1.0, science: 1.25, desc: "+25% Скорост на проучванията (Произход от Сотер)" },
    "Одриси": { power: 1.05, ritual: 1.3, desc: "+30% Шанс за Божествен Мистичен ритуал" },
    "Бесараб": { power: 1.1, tactics: 1.2, desc: "+20% Ефективност при нощна засада" }
};

// ГЛОБАЛНА БАЗА ЗА ВЛАДЕТЕЛИ - Автоматично се обвързва с worldData.clans
window.mightyLeaders = window.mightyLeaders || [
    { id: "r_tervel", name: "Тервел", dynasty: "Дуло", age: 32, currentClass: "Пълководец", isDead: false },
    { id: "r_krum", name: "Крум", dynasty: "Дуло", age: 35, currentClass: "Пълководец", isDead: false },
    { id: "r_omurtag", name: "Омуртаг", dynasty: "Дуло", age: 28, currentClass: "Строител", isDead: false }
];

/**
 * ИНИЦИАЛИЗАЦИЯ НА RPG ДАННИ ЗА ВСЕКИ ЕДИН ВЛАДЕТЕЛ
 */
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    
    if (hero.level === undefined) hero.level = 1;
    if (hero.xp === undefined) hero.xp = 0;
    if (hero.skillPoints === undefined) hero.skillPoints = 0;
    
    if (!hero.skills) {
        hero.skills = {
            endurance: 0,
            tactics: 0,
            diplomacy: 0,
            mysticism: 0,
            vampirism: 0,
            scouting: 0
        };
    }
    
    if (!hero.inventory) hero.inventory = [];
    if (!hero.currentClass) hero.currentClass = "Пълководец";
    if (!hero.heroPower) hero.heroPower = 100;
};

/**
 * СИСТЕМА ЗА КАЧВАНЕ НА ОПИТ И НИВО С АВТОМАТИЧНО ОБНОВЯВАНЕ НА МОЩТА
 */
window.addExperienceToLeader = function(hero, amount) {
    if (!hero) return;
    window.initializeHeroRPGData(hero);

    hero.xp += amount;
    let leveledUp = false;

    while (hero.xp >= 100) {
        hero.level += 1;
        hero.xp -= 100;
        hero.skillPoints += 1;
        hero.heroPower = (hero.heroPower || 100) + 25; 
        leveledUp = true;
    }

    if (leveledUp && window.showAdvisorMsg) {
        window.showAdvisorMsg(`🌟 Кан ${hero.name} изкачи нови висини! Достигна Ниво ${hero.level} и получи точка за умение.`);
    }

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.currentHero && window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

/**
 * РАЗПРЕДЕЛЯНЕ НА ТОЧКА ЗА УМЕНИЕ ОТ ПРОФИЛА
 */
window.upgradeLeaderSkill = function(hero, skillKey) {
    if (!hero || !hero.skills || hero.skillPoints <= 0) return { success: false, msg: "Нямате свободни точки!" };
    if (hero.skills[skillKey] === undefined) return { success: false, msg: "Невалидно умение." };

    hero.skills[skillKey] += 1;
    hero.skillPoints -= 1;
    
    if (skillKey === "endurance") hero.heroPower = (hero.heroPower || 100) + 10;
    if (skillKey === "tactics") hero.heroPower = (hero.heroPower || 100) + 15;

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    return { success: true, msg: `Успешно подобрихте умението до ниво ${hero.skills[skillKey]}!` };
};

/**
 * ЕВОЛЮЦИЯ НА КЛАСОВЕ (ФЕНТЪЗИ СИСТЕМА)
 */
window.evolveLeaderClass = function(hero, targetClass) {
    if (!hero || hero.level < 5) return { success: false, msg: "Владетелят трябва да е поне 5-то ниво за еволюция на класа!" };
    
    const validClasses = [
        "Велик Кан", "Колобър-Магьосник", "Некромант от Хиперборея", 
        "Безсмъртен Войн", "Посветен на Авитохол", "Вампирски Патриарх"
    ];

    if (!validClasses.includes(targetClass)) return { success: false, msg: "Несъществуващ таен орден!" };

    hero.currentClass = targetClass;
    hero.heroPower = (hero.heroPower || 100) + 50; 

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🔮 ТРИУМФ: Кан ${hero.name} премина в мистичния клас "${targetClass}"!`);
    }

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    return { success: true, msg: `Класът е променен на ${targetClass}!` };
};

/**
 * МИСТИЧЕН РИТУАЛ ЗА ВЪЗКРЕСЯВАНЕ НА ПАДНАЛ ВЛАДЕТЕЛ
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
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`✨ ЧУДО: Кан ${deadHero.name} бе върнат от отвъдното чрез древен ритуал на ${caster.name}!`);
        }
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        
        return { 
            success: true, 
            msg: `✨ ВЕЛИК ТРИУМФ! Душата на Кан ${deadHero.name} чу зова на предците и се завърна в тялото си! Той отново е готов да води родовите войски.` 
        };
    } else {
        return { 
            success: false, 
            msg: "❌ Ритуалът се провали. Тъмните сили или боговете удържаха душата на владетеля този път." 
        };
    }
};

if (window.currentHero) {
    window.initializeHeroRPGData(window.currentHero);
}
