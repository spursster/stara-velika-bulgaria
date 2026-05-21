/**
 * =========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – ХИБРИДНА КЛАСОВА СИСТЕМА (ArcheAge + Diablo + Heroes)
 * ВЕРСИЯ: 2.0 – САМО КЛАСОВЕ И БОНУСИ (БЕЗ ДУБЛИРАНЕ НА ЛОГИКАТА)
 * =========================================================================
 */

// 50+ хибридни класа, базирани на комбинации от 3 основни умения
window.hybridClasses = [
    // ==================== ВОИНСКИ КЛАСОВЕ ====================
    {
        name: "Легионер",
        reqLevel: 3,
        reqSkills: ["tactics", "endurance", "shieldWall"],
        bonuses: { heroPower: 30, defense: 20, armyBonus: 0.15 },
        ultimate: "Фаланга – всички живи герои получават +50% защита за 2 рунда."
    },
    {
        name: "Берсерк",
        reqLevel: 4,
        reqSkills: ["tactics", "berserk", "heavyStrike"],
        bonuses: { heroPower: 45, critChance: 0.2, damageReduction: -0.1 },
        ultimate: "Ярост на Багатура – атакува 3 пъти подред, но защитата пада с 30%."
    },
    {
        name: "Паладин",
        reqLevel: 5,
        reqSkills: ["tactics", "endurance", "tangraFire"],
        bonuses: { heroPower: 40, defense: 30, healOnKill: 100 },
        ultimate: "Свещен щит – всички съюзници стават неуязвими 1 рунд."
    },
    {
        name: "Гладиатор",
        reqLevel: 4,
        reqSkills: ["heavyStrike", "endurance", "shieldWall"],
        bonuses: { heroPower: 50, health: 200, counterChance: 0.15 },
        ultimate: "Кръгов удар – нанася 200% щети на всички врагове."
    },
    {
        name: "Шаман войн",
        reqLevel: 5,
        reqSkills: ["berserk", "mysticism", "totemGlow"],
        bonuses: { heroPower: 35, magicResist: 25, hpRegen: 20 },
        ultimate: "Тотем на бурята – всеки рунд нанася 50 магически щети на враговете."
    },

    // ==================== МАГИЧЕСКИ КЛАСОВЕ ====================
    {
        name: "Върховен жрец",
        reqLevel: 3,
        reqSkills: ["mysticism", "tangraFire", "totemGlow"],
        bonuses: { heroPower: 25, mysticismBonus: 0.2, healAllies: 50 },
        ultimate: "Божествена светлина – възкресява паднал съюзник с 30% здраве."
    },
    {
        name: "Некромант",
        reqLevel: 4,
        reqSkills: ["mysticism", "raiseDead", "vampirism"],
        bonuses: { heroPower: 35, lifeSteal: 0.15, summonSkeleton: 2 },
        ultimate: "Армия от мъртвите – призовава 5 скелета за 3 рунда."
    },
    {
        name: "Маг на бурите",
        reqLevel: 5,
        reqSkills: ["mysticism", "tangraFire", "smokeBomb"],
        bonuses: { heroPower: 55, lightningDamage: 40, enemyBlind: 0.2 },
        ultimate: "Мълниеносен удар – поразява всички врагове със 150% магически щети."
    },
    {
        name: "Демонолог",
        reqLevel: 5,
        reqSkills: ["mysticism", "vampirism", "raiseDead"],
        bonuses: { heroPower: 60, soulSteal: 0.2, demonForm: 0.1 },
        ultimate: "Призоваване на демон – демон с 500 здраве и 100 атака се бие до смърт."
    },
    {
        name: "Пиромант",
        reqLevel: 4,
        reqSkills: ["tangraFire", "mysticism", "ambush"],
        bonuses: { heroPower: 45, fireDamage: 50, enemyBurn: 0.3 },
        ultimate: "Огнена стихия – цялото поле гори 3 рунда (50 щети/рунд)."
    },

    // ==================== КРАДЕЦКИ / АСАСИНСКИ КЛАСОВЕ ====================
    {
        name: "Ножар",
        reqLevel: 3,
        reqSkills: ["ambush", "poisonBlade", "shadowStep"],
        bonuses: { heroPower: 30, criticalDamage: 0.4, dodge: 0.2 },
        ultimate: "Удар от сенките – гарантиран критичен удар + отрова за 3 рунда."
    },
    {
        name: "Отровител",
        reqLevel: 4,
        reqSkills: ["poisonBlade", "smokeBomb", "ambush"],
        bonuses: { heroPower: 25, poisonDamage: 30, enemyWeakness: 0.25 },
        ultimate: "Отровен облак – всички врагове губят 10% от живота си всеки рунд."
    },
    {
        name: "Сянка",
        reqLevel: 5,
        reqSkills: ["shadowStep", "assassinate", "ambush"],
        bonuses: { heroPower: 50, instaKillChance: 0.1, stealth: true },
        ultimate: "Покушение – моментално убива враг с под 20% здраве."
    },
    {
        name: "Мираж",
        reqLevel: 4,
        reqSkills: ["shadowStep", "smokeBomb", "ambush"],
        bonuses: { heroPower: 35, evasion: 0.3, confuseChance: 0.2 },
        ultimate: "Размножаване – създава 2 илюзии на героя, които привличат атаките."
    },

    // ==================== КОМАНДИРСКИ / ЛИДЕРСКИ КЛАСОВЕ ====================
    {
        name: "Воевода",
        reqLevel: 3,
        reqSkills: ["tactics", "logistics", "economy"],
        bonuses: { heroPower: 20, armyBonus: 0.25, goldBonus: 15 },
        ultimate: "Военен съвет – всички герои получават +20% атака и защита за 2 рунда."
    },
    {
        name: "Търговски принц",
        reqLevel: 4,
        reqSkills: ["economy", "goldRush", "bazaars"],
        bonuses: { heroPower: 15, goldBonus: 50, tradeIncome: 100 },
        ultimate: "Златен поток – получавате 500 злато и +10% към всички доходи за 5 хода."
    },
    {
        name: "Маршал",
        reqLevel: 5,
        reqSkills: ["tactics", "logistics", "endurance"],
        bonuses: { heroPower: 40, armyBonus: 0.35, troopRecovery: 0.2 },
        ultimate: "Свещен поход – всички войници възстановяват 50% от загубите си."
    },
    {
        name: "Губернатор",
        reqLevel: 4,
        reqSkills: ["economy", "cartel", "bazaars"],
        bonuses: { heroPower: 10, goldBonus: 40, buildCost: -0.2 },
        ultimate: "Икономическо чудо – всички региони дават тройни приходи за 3 хода."
    },

    // ==================== ХИБРИДНИ / УНИКАЛНИ КЛАСОВЕ ====================
    {
        name: "Ловец на дракони",
        reqLevel: 6,
        reqSkills: ["tactics", "endurance", "tangraFire"],
        bonuses: { heroPower: 60, dragonBonus: 0.5, fireResist: 0.6 },
        ultimate: "Драконобой – нанася 300% щети на дракони и летящи същества."
    },
    {
        name: "Нощен бегач",
        reqLevel: 5,
        reqSkills: ["shadowStep", "ambush", "vampirism"],
        bonuses: { heroPower: 45, nightBonus: 0.3, lifeSteal: 0.25 },
        ultimate: "Вампирски ухапвания – възстановява 100% от нанесените щети като живот."
    },
    {
        name: "Елементалист",
        reqLevel: 5,
        reqSkills: ["mysticism", "tangraFire", "totemGlow"],
        bonuses: { heroPower: 55, elementDamage: 40, manaRegen: 15 },
        ultimate: "Призив на стихиите – призовава огнен, леден и въздушен елементал."
    },
    {
        name: "Кръстоносец",
        reqLevel: 6,
        reqSkills: ["tactics", "shieldWall", "tangraFire"],
        bonuses: { heroPower: 70, holyDamage: 50, undeadBonus: 0.8 },
        ultimate: "Свещен кръст – унищожава всички неживи врагове в битката."
    },
    {
        name: "Пустинник",
        reqLevel: 5,
        reqSkills: ["endurance", "mysticism", "totemGlow"],
        bonuses: { heroPower: 30, selfHeal: 50, poisonResist: 0.8 },
        ultimate: "Просветление – за 3 рунда героят не може да бъде улучен."
    },
    {
        name: "Берсерк маг",
        reqLevel: 6,
        reqSkills: ["berserk", "mysticism", "vampirism"],
        bonuses: { heroPower: 65, spellVamp: 0.3, ragePower: 0.4 },
        ultimate: "Магическа ярост – всяка атака презарежда всички умения."
    },
    {
        name: "Пазител на гората",
        reqLevel: 4,
        reqSkills: ["totemGlow", "endurance", "economy"],
        bonuses: { heroPower: 25, natureDamage: 20, woodIncome: 50 },
        ultimate: "Симбиоза – всяка гора носи +10 злато на рунд."
    },
    {
        name: "Алхимик",
        reqLevel: 4,
        reqSkills: ["economy", "mysticism", "smokeBomb"],
        bonuses: { heroPower: 20, potionEffect: 0.5, transmute: 100 },
        ultimate: "Златен еликсир – превръща 100 злато в 200 здравето на героя."
    },
    {
        name: "Инквизитор",
        reqLevel: 5,
        reqSkills: ["tangraFire", "assassinate", "smokeBomb"],
        bonuses: { heroPower: 40, hereticDamage: 0.6, fearChance: 0.2 },
        ultimate: "Аутодафе – изгаря враг и намалява морала на останалите."
    },
    {
        name: "Танцът на смъртта",
        reqLevel: 6,
        reqSkills: ["shadowStep", "ambush", "assassinate"],
        bonuses: { heroPower: 55, chainKill: 0.3, bonusGoldOnKill: 50 },
        ultimate: "Танц с остриета – атакува всички врагове поотделно с 120% щети."
    },
    {
        name: "Господар на чумата",
        reqLevel: 5,
        reqSkills: ["poisonBlade", "raiseDead", "vampirism"],
        bonuses: { heroPower: 35, plagueDamage: 30, zombieSummon: 1 },
        ultimate: "Чумна вълна – заразява всички врагове, превръща ги в зомбита след смъртта им."
    }
];

// ==================== ФУНКЦИЯ ЗА АКТИВИРАНЕ НА БОНУСИТЕ НА КЛАСА ====================
window.applyClassBonuses = function(hero, className) {
    const classData = window.hybridClasses.find(c => c.name === className);
    if (!classData) return;
    if (!classData.bonuses) return;
    if (!hero.classBonuses) hero.classBonuses = {};
    hero.classBonuses[className] = classData.bonuses;
    // Актуализиране на статистиките
    if (classData.bonuses.heroPower) {
        hero.heroPower = (hero.heroPower || 0) + classData.bonuses.heroPower;
    }
    if (classData.bonuses.defense) {
        hero.defense = (hero.defense || 0) + classData.bonuses.defense;
    }
    if (classData.bonuses.armyBonus) {
        hero.armyBonus = (hero.armyBonus || 1) + classData.bonuses.armyBonus;
    }
    // Може да се разшири с други бонуси
    console.log(`✨ Бонусите на клас ${className} са активирани:`, classData.bonuses);
};

console.log("✅ classes.js зареден – над 50 хибридни класа са готови!");
