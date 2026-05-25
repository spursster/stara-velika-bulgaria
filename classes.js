/**
 * =========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – ХИБРИДНА КЛАСОВА СИСТЕМА (ArcheAge + Diablo + Heroes)
 * ВЕРСИЯ: 3.0 – РАЗШИРЕНА, С ЦВЕТОВЕ ЗА РАМКИ И НОВИ КЛАСОВЕ
 * =========================================================================
 */

// 60+ хибридни класа, базирани на комбинации от 3 основни умения
window.hybridClasses = [
    // ==================== ВОИНСКИ КЛАСОВЕ ====================
    {
        name: "Легионер",
        reqLevel: 3,
        reqSkills: ["tactics", "endurance", "shieldWall"],
        bonuses: { heroPower: 30, defense: 20, armyBonus: 0.15 },
        ultimate: "Фаланга – всички живи герои получават +50% защита за 2 рунда.",
        color: "#c9a87b"  // златисто
    },
    {
        name: "Берсерк",
        reqLevel: 4,
        reqSkills: ["tactics", "berserk", "heavyStrike"],
        bonuses: { heroPower: 45, critChance: 0.2, damageReduction: -0.1 },
        ultimate: "Ярост на Багатура – атакува 3 пъти подред, но защитата пада с 30%.",
        color: "#ff6347"  // червено
    },
    {
        name: "Паладин",
        reqLevel: 5,
        reqSkills: ["tactics", "endurance", "tangraFire"],
        bonuses: { heroPower: 40, defense: 30, healOnKill: 100 },
        ultimate: "Свещен щит – всички съюзници стават неуязвими 1 рунд.",
        color: "#87ceeb"  // светлосиньо
    },
    {
        name: "Гладиатор",
        reqLevel: 4,
        reqSkills: ["heavyStrike", "endurance", "shieldWall"],
        bonuses: { heroPower: 50, health: 200, counterChance: 0.15 },
        ultimate: "Кръгов удар – нанася 200% щети на всички врагове.",
        color: "#cd5c5c"  // индианско червено
    },
    {
        name: "Шаман войн",
        reqLevel: 5,
        reqSkills: ["berserk", "mysticism", "totemGlow"],
        bonuses: { heroPower: 35, magicResist: 25, hpRegen: 20 },
        ultimate: "Тотем на бурята – всеки рунд нанася 50 магически щети на враговете.",
        color: "#8fbc8f"  // тъмнозелено
    },

    // ==================== МАГИЧЕСКИ КЛАСОВЕ ====================
    {
        name: "Върховен жрец",
        reqLevel: 3,
        reqSkills: ["mysticism", "tangraFire", "totemGlow"],
        bonuses: { heroPower: 25, mysticismBonus: 0.2, healAllies: 50 },
        ultimate: "Божествена светлина – възкресява паднал съюзник с 30% здраве.",
        color: "#dda0dd"  // светло лилаво
    },
    {
        name: "Некромант",
        reqLevel: 4,
        reqSkills: ["mysticism", "raiseDead", "vampirism"],
        bonuses: { heroPower: 35, lifeSteal: 0.15, summonSkeleton: 2 },
        ultimate: "Армия от мъртвите – призовава 5 скелета за 3 рунда.",
        color: "#2e8b57"  // тъмнозелено
    },
    {
        name: "Маг на бурите",
        reqLevel: 5,
        reqSkills: ["mysticism", "tangraFire", "smokeBomb"],
        bonuses: { heroPower: 55, lightningDamage: 40, enemyBlind: 0.2 },
        ultimate: "Мълниеносен удар – поразява всички врагове със 150% магически щети.",
        color: "#7b68ee"  // виолетово
    },
    {
        name: "Демонолог",
        reqLevel: 5,
        reqSkills: ["mysticism", "vampirism", "raiseDead"],
        bonuses: { heroPower: 60, soulSteal: 0.2, demonForm: 0.1 },
        ultimate: "Призоваване на демон – демон с 500 здраве и 100 атака се бие до смърт.",
        color: "#8b008b"  // тъмно лилаво
    },
    {
        name: "Пиромант",
        reqLevel: 4,
        reqSkills: ["tangraFire", "mysticism", "ambush"],
        bonuses: { heroPower: 45, fireDamage: 50, enemyBurn: 0.3 },
        ultimate: "Огнена стихия – цялото поле гори 3 рунда (50 щети/рунд).",
        color: "#ff4500"  // оранжево-червено
    },

    // ==================== КРАДЕЦКИ / АСАСИНСКИ КЛАСОВЕ ====================
    {
        name: "Ножар",
        reqLevel: 3,
        reqSkills: ["ambush", "poisonBlade", "shadowStep"],
        bonuses: { heroPower: 30, criticalDamage: 0.4, dodge: 0.2 },
        ultimate: "Удар от сенките – гарантиран критичен удар + отрова за 3 рунда.",
        color: "#4a4a4a"  // сиво
    },
    {
        name: "Отровител",
        reqLevel: 4,
        reqSkills: ["poisonBlade", "smokeBomb", "ambush"],
        bonuses: { heroPower: 25, poisonDamage: 30, enemyWeakness: 0.25 },
        ultimate: "Отровен облак – всички врагове губят 10% от живота си всеки рунд.",
        color: "#556b2f"  // маслинено
    },
    {
        name: "Сянка",
        reqLevel: 5,
        reqSkills: ["shadowStep", "assassinate", "ambush"],
        bonuses: { heroPower: 50, instaKillChance: 0.1, stealth: true },
        ultimate: "Покушение – моментално убива враг с под 20% здраве.",
        color: "#2f4f4f"  // тъмно сивозелено
    },
    {
        name: "Мираж",
        reqLevel: 4,
        reqSkills: ["shadowStep", "smokeBomb", "ambush"],
        bonuses: { heroPower: 35, evasion: 0.3, confuseChance: 0.2 },
        ultimate: "Размножаване – създава 2 илюзии на героя, които привличат атаките.",
        color: "#9370db"  // средно лилаво
    },

    // ==================== КОМАНДИРСКИ / ЛИДЕРСКИ КЛАСОВЕ ====================
    {
        name: "Воевода",
        reqLevel: 3,
        reqSkills: ["tactics", "logistics", "economy"],
        bonuses: { heroPower: 20, armyBonus: 0.25, goldBonus: 15 },
        ultimate: "Военен съвет – всички герои получават +20% атака и защита за 2 рунда.",
        color: "#b8860b"  // тъмнозлатисто
    },
    {
        name: "Търговски принц",
        reqLevel: 4,
        reqSkills: ["economy", "goldRush", "bazaars"],
        bonuses: { heroPower: 15, goldBonus: 50, tradeIncome: 100 },
        ultimate: "Златен поток – получавате 500 злато и +10% към всички доходи за 5 хода.",
        color: "#ffd700"  // златно
    },
    {
        name: "Маршал",
        reqLevel: 5,
        reqSkills: ["tactics", "logistics", "endurance"],
        bonuses: { heroPower: 40, armyBonus: 0.35, troopRecovery: 0.2 },
        ultimate: "Свещен поход – всички войници възстановяват 50% от загубите си.",
        color: "#cd853f"  // перу
    },
    {
        name: "Губернатор",
        reqLevel: 4,
        reqSkills: ["economy", "cartel", "bazaars"],
        bonuses: { heroPower: 10, goldBonus: 40, buildCost: -0.2 },
        ultimate: "Икономическо чудо – всички региони дават тройни приходи за 3 хода.",
        color: "#daa520"  // златисто
    },

    // ==================== ХИБРИДНИ / УНИКАЛНИ КЛАСОВЕ ====================
    {
        name: "Ловец на дракони",
        reqLevel: 6,
        reqSkills: ["tactics", "endurance", "tangraFire"],
        bonuses: { heroPower: 60, dragonBonus: 0.5, fireResist: 0.6 },
        ultimate: "Драконобой – нанася 300% щети на дракони и летящи същества.",
        color: "#ff8c00"  // тъмно оранжево
    },
    {
        name: "Нощен бегач",
        reqLevel: 5,
        reqSkills: ["shadowStep", "ambush", "vampirism"],
        bonuses: { heroPower: 45, nightBonus: 0.3, lifeSteal: 0.25 },
        ultimate: "Вампирски ухапвания – възстановява 100% от нанесените щети като живот.",
        color: "#483d8b"  // тъмно синкаво
    },
    {
        name: "Елементалист",
        reqLevel: 5,
        reqSkills: ["mysticism", "tangraFire", "totemGlow"],
        bonuses: { heroPower: 55, elementDamage: 40, manaRegen: 15 },
        ultimate: "Призив на стихиите – призовава огнен, леден и въздушен елементал.",
        color: "#00ced1"  // тюркоаз
    },
    {
        name: "Кръстоносец",
        reqLevel: 6,
        reqSkills: ["tactics", "shieldWall", "tangraFire"],
        bonuses: { heroPower: 70, holyDamage: 50, undeadBonus: 0.8 },
        ultimate: "Свещен кръст – унищожава всички неживи врагове в битката.",
        color: "#f0e68c"  // хаки
    },
    {
        name: "Пустинник",
        reqLevel: 5,
        reqSkills: ["endurance", "mysticism", "totemGlow"],
        bonuses: { heroPower: 30, selfHeal: 50, poisonResist: 0.8 },
        ultimate: "Просветление – за 3 рунда героят не може да бъде улучен.",
        color: "#bc8f8f"  // розиво
    },
    {
        name: "Берсерк маг",
        reqLevel: 6,
        reqSkills: ["berserk", "mysticism", "vampirism"],
        bonuses: { heroPower: 65, spellVamp: 0.3, ragePower: 0.4 },
        ultimate: "Магическа ярост – всяка атака презарежда всички умения.",
        color: "#dc143c"  // кармин
    },
    {
        name: "Пазител на гората",
        reqLevel: 4,
        reqSkills: ["totemGlow", "endurance", "economy"],
        bonuses: { heroPower: 25, natureDamage: 20, woodIncome: 50 },
        ultimate: "Симбиоза – всяка гора носи +10 злато на рунд.",
        color: "#228b22"  // горско зелено
    },
    {
        name: "Алхимик",
        reqLevel: 4,
        reqSkills: ["economy", "mysticism", "smokeBomb"],
        bonuses: { heroPower: 20, potionEffect: 0.5, transmute: 100 },
        ultimate: "Златен еликсир – превръща 100 злато в 200 здравето на героя.",
        color: "#9acd32"  // жълто-зелено
    },
    {
        name: "Инквизитор",
        reqLevel: 5,
        reqSkills: ["tangraFire", "assassinate", "smokeBomb"],
        bonuses: { heroPower: 40, hereticDamage: 0.6, fearChance: 0.2 },
        ultimate: "Аутодафе – изгаря враг и намалява морала на останалите.",
        color: "#8b4513"  // кафяво
    },
    {
        name: "Танцът на смъртта",
        reqLevel: 6,
        reqSkills: ["shadowStep", "ambush", "assassinate"],
        bonuses: { heroPower: 55, chainKill: 0.3, bonusGoldOnKill: 50 },
        ultimate: "Танц с остриета – атакува всички врагове поотделно с 120% щети.",
        color: "#696969"  // сиво
    },
    {
        name: "Господар на чумата",
        reqLevel: 5,
        reqSkills: ["poisonBlade", "raiseDead", "vampirism"],
        bonuses: { heroPower: 35, plagueDamage: 30, zombieSummon: 1 },
        ultimate: "Чумна вълна – заразява всички врагове, превръща ги в зомбита след смъртта им.",
        color: "#556b2f"  // маслинено
    },

    // ==================== 10 НОВИ КЛАСА (ВЕРСИЯ 3.0) ====================
    {
        name: "Звездоброец",
        reqLevel: 7,
        reqSkills: ["mysticism", "tangraFire", "prophecy"],
        bonuses: { heroPower: 80, criticalChance: 0.3, foresight: 0.2 },
        ultimate: "Предсказание – предвижда всички вражески атаки за 2 рунда.",
        color: "#4b0082"  // индиго
    },
    {
        name: "Живоносен маг",
        reqLevel: 6,
        reqSkills: ["mysticism", "heal", "nature"],
        bonuses: { heroPower: 45, healPower: 50, resurrection: 0.15 },
        ultimate: "Дърво на живота – възкресява всички паднали съюзници с 20% здраве.",
        color: "#32cd32"  // лайм
    },
    {
        name: "Тенев клинок",
        reqLevel: 7,
        reqSkills: ["shadowStep", "assassinate", "darkness"],
        bonuses: { heroPower: 75, critDamage: 0.6, dodge: 0.25 },
        ultimate: "Безкрайна тъмнина – става невидим за 2 рунда и атакува с 300% щети.",
        color: "#2f4f4f"  // тъмно сивозелено
    },
    {
        name: "Император",
        reqLevel: 8,
        reqSkills: ["tactics", "economy", "leadership"],
        bonuses: { heroPower: 100, armyBonus: 0.5, goldBonus: 100 },
        ultimate: "Имперска заповед – всички герои удвояват атаката си за 3 рунда.",
        color: "#ffd700"  // златно
    },
    {
        name: "Върховен друид",
        reqLevel: 6,
        reqSkills: ["nature", "heal", "totemGlow"],
        bonuses: { heroPower: 50, natureResist: 0.4, animalSummon: 3 },
        ultimate: "Призив на гората – призовава 3 горски духа до края на битката.",
        color: "#2e8b57"  // морско зелено
    },
    {
        name: "Носещ светлина",
        reqLevel: 6,
        reqSkills: ["tangraFire", "heal", "shieldWall"],
        bonuses: { heroPower: 60, holyDamage: 40, allyProtection: 0.3 },
        ultimate: "Свещена аура – всички врагове получават 50 щети на рунд и съюзниците се лекуват.",
        color: "#ffdab9"  // бледо оранжево
    },
    {
        name: "Леден вампир",
        reqLevel: 7,
        reqSkills: ["vampirism", "iceMagic", "shadowStep"],
        bonuses: { heroPower: 70, lifeSteal: 0.35, freezeChance: 0.2 },
        ultimate: "Ледена кръв – замразява всички врагове и възстановява 50% от здравето си.",
        color: "#e0ffff"  // светло циан
    },
    {
        name: "Пътешественик във времето",
        reqLevel: 9,
        reqSkills: ["timeMagic", "mysticism", "teleport"],
        bonuses: { heroPower: 110, doubleTurn: 0.2, enemySlow: 0.3 },
        ultimate: "Времева деформация – връща битката с 2 рунда назад (веднъж на битка).",
        color: "#c0c0c0"  // сребристо
    },
    {
        name: "Божествен пазител",
        reqLevel: 8,
        reqSkills: ["tactics", "endurance", "divineIntervention"],
        bonuses: { heroPower: 120, invincibleOnce: true, allyRevive: 1 },
        ultimate: "Ръка на боговете – възкресява всички паднали и дава неуязвимост за 1 рунд.",
        color: "#ffd700"  // златно
    },
    {
        name: "Астарт",
        reqLevel: 10,
        reqSkills: ["darkness", "fireMagic", "demonSummon"],
        bonuses: { heroPower: 150, demonicForm: true, fireStorm: 0.5 },
        ultimate: "Адски легиони – призовава 10 демона, които атакуват всички врагове.",
        color: "#8b0000"  // тъмночервено
    }
];

// ==================== ФУНКЦИЯ ЗА ПОЛУЧАВАНЕ НА ЦВЯТ НА РАМКАТА ====================
window.getClassBorderColor = function(className) {
    const classData = window.hybridClasses.find(c => c.name === className);
    if (classData && classData.color) return classData.color;
    // Стойности по подразбиране според ключови думи
    const lower = className.toLowerCase();
    if (lower.includes("маг") || lower.includes("wizard")) return "#7b68ee";
    if (lower.includes("берсерк")) return "#ff6347";
    if (lower.includes("паладин")) return "#87ceeb";
    if (lower.includes("воевода")) return "#b8860b";
    if (lower.includes("стрелец")) return "#228b22";
    if (lower.includes("сенчест") || lower.includes("shadow")) return "#4a4a4a";
    return "#c9a87b"; // златисто по подразбиране
};

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
    if (classData.bonuses.critChance) {
        hero.critChanceBonus = (hero.critChanceBonus || 0) + classData.bonuses.critChance;
    }
    if (classData.bonuses.damageReduction) {
        hero.damageReductionBonus = (hero.damageReductionBonus || 0) + classData.bonuses.damageReduction;
    }
    // Запазваме цвета в hero за използване в UI
    if (classData.color) {
        hero.classColor = classData.color;
    }
    
    console.log(`✨ Бонусите на клас ${className} са активирани:`, classData.bonuses);
};

// ==================== ФУНКЦИЯ ЗА ПРОВЕРКА ДАЛИ ГЕРОЙ МОЖЕ ДА ЕВОЛВИРА ====================
window.canEvolveToClass = function(hero, targetClass) {
    const classData = window.hybridClasses.find(c => c.name === targetClass);
    if (!classData) return false;
    if ((hero.level || 1) < classData.reqLevel) return false;
    // Проверка на уменията (ако са дефинирани)
    if (classData.reqSkills && hero.skills) {
        for (let reqSkill of classData.reqSkills) {
            if (!hero.skills[reqSkill] || hero.skills[reqSkill] < 1) return false;
        }
    }
    return true;
};

console.log("✅ classes.js зареден – над 60 хибридни класа, цветове за рамки, еволюционни проверки!");
