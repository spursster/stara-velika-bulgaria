/**
 * МОДУЛ: МЕХАНИКИ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН (С ЕЛИМИНИРАНО ДУБЛИРАНЕ НА КЛАНОВЕ)
 */

window.clanPerks = {
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.25, desc: "+25% Легитимност (Родът на Кановете)" },
    "Комитопули": { power: 1.15, defense: 1.15, desc: "+15% Защита на крепостите" },
    "Асеневци": { power: 1.0, recovery: 1.25, desc: "+25% Скорост на възстановяване" },
    "Тертер": { power: 1.1, mobility: 1.15, desc: "+15% Скорост при поход" },
    "Даки": { power: 1.1, armyCost: 0.85, desc: "-15% Цена за наемане на войска" },
    "Уния Траки": { power: 1.15, gold: 1.15, desc: "+15% Добиви на скъпоценности и съкровища" },
    "Шишмановци": { power: 1.0, buildCost: 0.8, desc: "-20% Цена за строеж на сгради" },
    "Македони": { power: 1.2, empireTactics: 1.2, desc: "+20% Стратегическа мощ при далечни завоевания" },
    "Птоломеи": { power: 1.0, science: 1.25, desc: "+25% Скорост на проучванията (Произход от Сотер)" },
    "Одриси": { power: 1.05, ritual: 1.3, desc: "+30% Шанс за Божествен Мистичен ритуал" },
    "Бесараб": { power: 1.1, tactics: 1.2, desc: "+20% Ефективност при нощна засада" },
    "Османци Дуло": { power: 1.2, arenaBonus: 1.5, desc: "+20% Щета на пехотата и Арена бонус" },
    "Скити": { power: 1.15, endurance: 1.1, desc: "+15% Бойна издръжливост на родовите конници" }
};

window.mightyLeaders = window.mightyLeaders || [
    { id: "r_tervel", name: "Тервел", clan: "Дуло", age: 32, currentClass: "Пълководец", isDead: false },
    { id: "r_krum", name: "Крум", clan: "Дуло", age: 35, currentClass: "Пълководец", isDead: false },
    { id: "r_omurtag", name: "Омуртаг", clan: "Дуло", age: 28, currentClass: "Строител", isDead: false }
];

window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    if (hero.level === undefined) hero.level = 1;
    if (hero.xp === undefined) hero.xp = 0;
    if (hero.skillPoints === undefined) hero.skillPoints = 0;
    
    if (!hero.skills) {
        hero.skills = { endurance: 0, tactics: 0, diplomacy: 0, mysticism: 0, vampirism: 0, scouting: 0 };
    }
    if (!hero.inventory) hero.inventory = [];
    if (!hero.currentClass) hero.currentClass = "Пълководец";
    if (!hero.heroPower) hero.heroPower = 100;
};

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
};

window.upgradeLeaderSkill = function(hero, skillKey) {
    if (!hero || !hero.skills || hero.skillPoints <= 0) return { success: false, msg: "Нямате свободни точки!" };
    hero.skills[skillKey] += 1;
    hero.skillPoints -= 1;
    
    if (skillKey === "endurance") hero.heroPower = (hero.heroPower || 100) + 10;
    if (skillKey === "tactics") hero.heroPower = (hero.heroPower || 100) + 15;

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    return { success: true, msg: `Успешно подобрихте умението!` };
};

window.evolveLeaderClass = function(hero, targetClass) {
    if (!hero hero.level < 5) return { success: false, msg: "Владетелят трябва да е поне 5-то ниво!" };
    hero.currentClass = targetClass;
    hero.heroPower = (hero.heroPower || 100) + 50; 
    return { success: true, msg: `Класът е променен на ${targetClass}!` };
};

window.performResurrectionRitual = function(caster, deadHero) {
    if (!caster || !deadHero) return { success: false, msg: "Невалидни данни." };
    const mysticismLevel = (caster.skills && caster.skills.mysticism) || 0;
    
    let baseChance = 0.40 + (mysticismLevel * 0.05); 
    if (caster.clan === "Одриси") {
        baseChance *= (window.clanPerks["Одриси"].ritual || 1.3); 
    }
    
    if (Math.random() <= baseChance) {
        deadHero.isDead = false;
        return { success: true, msg: `✨ Триумф! Душата на Кан ${deadHero.name} се завърна!` };
    }
    return { success: false, msg: "❌ Ритуалът се провали." };
};
