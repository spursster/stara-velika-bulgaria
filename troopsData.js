// ==================== troopsData.js ====================
// ГЛОБАЛНА БАЗА ДАННИ ЗА ВСИЧКИ ТИПОВЕ ВОЙНИЦИ (42 ТИПА)
// ВЕРСИЯ: 2.0 – РАЗШИРЕНА, БАЛАНСИРАНА, С НОВИ ЕДИНИЦИ И ФУНКЦИИ

window.ALL_TROOP_TYPES = [
    // ===== ОСНОВНИ ВОЙСКИ (4) =====
    { id: "infantry", name: "Пехотинец", basePrice: 10, attack: 8, defense: 12, icon: "⚔️", desc: "Основна пехота – добра защита", special: null, category: "basic" },
    { id: "archers", name: "Стрелец", basePrice: 15, attack: 15, defense: 6, icon: "🏹", desc: "Далекобойни стрелци", special: null, category: "basic" },
    { id: "cavalry", name: "Конник", basePrice: 30, attack: 25, defense: 18, icon: "🐎", desc: "Бързи атакуващи части", special: null, category: "basic" },
    { id: "elite", name: "Елитен войн", basePrice: 70, attack: 45, defense: 40, icon: "🛡️", desc: "Най-добрите бойци", special: null, category: "basic" },
    
    // ===== ФЕНТЪЗИ ВОЙСКИ (28 оригинални) =====
    { id: "vampire", name: "Вампир", basePrice: 120, attack: 35, defense: 25, icon: "🧛", desc: "Кръвопиец – лекува 20% от нанесените щети", special: "lifeSteal:0.2", category: "fantasy" },
    { id: "werewolf", name: "Върколак", basePrice: 100, attack: 40, defense: 20, icon: "🐺", desc: "Луда свирепост – +15% атака през нощта", special: "nightFury:0.15", category: "fantasy" },
    { id: "highelf", name: "Висш елф", basePrice: 90, attack: 30, defense: 15, icon: "🧝", desc: "Точност – +25% критичен удар", special: "critChance:0.25", category: "fantasy" },
    { id: "troll", name: "Планински трол", basePrice: 150, attack: 50, defense: 40, icon: "🧌", desc: "Каменна кожа – -30% получени щети", special: "damageReduction:0.3", category: "fantasy" },
    { id: "dragon_young", name: "Млад дракон", basePrice: 300, attack: 70, defense: 45, icon: "🐉", desc: "Огнено дихание – поразява 3 врага", special: "splashDamage:3", category: "fantasy" },
    { id: "wizard", name: "Магьосник", basePrice: 80, attack: 20, defense: 10, icon: "🧙", desc: "Магическа експлозия – +50% срещу неживи", special: "undeadBonus:0.5", category: "fantasy" },
    { id: "lich", name: "Лич", basePrice: 250, attack: 55, defense: 50, icon: "💀", desc: "Страх – враговете могат да побегнат", special: "fearChance:0.2", category: "fantasy" },
    { id: "fairy_healer", name: "Фея-изцелителка", basePrice: 60, attack: 5, defense: 40, icon: "🧚", desc: "Лечебна светлина – възстановява 10 живот/рунд", special: "healAllies:10", category: "fantasy" },
    { id: "bear_ancient", name: "Мъдър мечок", basePrice: 70, attack: 35, defense: 35, icon: "🐻", desc: "Звярска прегръдка – зашеметява за 1 рунд", special: "stunChance:0.3", category: "fantasy" },
    { id: "harpy", name: "Харпия", basePrice: 65, attack: 25, defense: 20, icon: "🦅", desc: "Пикиране – първи удар +50% щети", special: "firstStrikeBonus:0.5", category: "fantasy" },
    { id: "mermaid", name: "Русалка", basePrice: 80, attack: 20, defense: 30, icon: "🧜", desc: "Песен на сирена – омайва врага за 2 рунда", special: "charmChance:0.25", category: "fantasy" },
    { id: "genie", name: "Джин", basePrice: 180, attack: 45, defense: 35, icon: "🧞", desc: "Изпълнява желания – +1 допълнително действие", special: "extraAction:1", category: "fantasy" },
    { id: "vampire_queen", name: "Вампирска кралица", basePrice: 200, attack: 50, defense: 40, icon: "🧛‍♀️", desc: "Превръща паднали врагове във вампири", special: "convertOnKill:vampire", category: "fantasy" },
    { id: "ice_dragon", name: "Леден дракон", basePrice: 320, attack: 75, defense: 50, icon: "🐉", desc: "Ледено дъх – забавя враговете", special: "slowEffect:0.5", category: "fantasy" },
    { id: "ogre_mage", name: "Огър-магьосник", basePrice: 140, attack: 45, defense: 35, icon: "🧌", desc: "Елементална магия – сменя тип щети", special: "elementalShift:true", category: "fantasy" },
    { id: "dark_elf", name: "Тъмен елф", basePrice: 110, attack: 40, defense: 20, icon: "🧝", desc: "Отрова – 10 допълнителни щети за 3 рунда", special: "poisonDamage:10", category: "fantasy" },
    { id: "alpha_werewolf", name: "Върколак-алфа", basePrice: 160, attack: 55, defense: 35, icon: "🐺", desc: "Води глутница – +10% атака на върколаци", special: "aura:werewolf_buff", category: "fantasy" },
    { id: "stone_troll", name: "Каменен трол", basePrice: 200, attack: 60, defense: 60, icon: "🧌", desc: "Непробиваем – имунитет 1 рунд (1/битка)", special: "invincibleOnce:true", category: "fantasy" },
    { id: "archmage", name: "Архимаг", basePrice: 220, attack: 60, defense: 30, icon: "🧙", desc: "Върховна магия – каства два пъти на рунд", special: "doubleCast:true", category: "fantasy" },
    { id: "demon", name: "Демон", basePrice: 170, attack: 55, defense: 35, icon: "👹", desc: "Адски огън – подпалва земята", special: "fireGround:5", category: "fantasy" },
    { id: "ancient_vampire", name: "Древен вампир", basePrice: 280, attack: 70, defense: 50, icon: "🧛", desc: "Призовава 2 прилепа-разузнавач", special: "summonBats:2", category: "fantasy" },
    { id: "weird_witch", name: "Уиля", basePrice: 75, attack: 15, defense: 15, icon: "🧙‍♀️", desc: "Проклятие – -30% защита на врага", special: "curseDefense:0.3", category: "fantasy" },
    { id: "griffin", name: "Грифон", basePrice: 120, attack: 40, defense: 30, icon: "🦅", desc: "Въздушна атака – неуязвим за пехота", special: "immuneToInfantry:true", category: "fantasy" },
    { id: "golden_dragon", name: "Златен дракон", basePrice: 450, attack: 100, defense: 80, icon: "🐉", desc: "Златен дъх – превръща враговете в злато", special: "goldOnKill:50", category: "fantasy" },
    { id: "elf_archer", name: "Елфийски стрелец", basePrice: 85, attack: 35, defense: 15, icon: "🏹", desc: "Стрела на мълния – заобикаля бронята", special: "ignoreArmor:true", category: "fantasy" },
    { id: "swamp_troll", name: "Блатният трол", basePrice: 110, attack: 45, defense: 25, icon: "🧌", desc: "Регенерация – +5 живот/рунд", special: "regen:5", category: "fantasy" },
    { id: "necromancer", name: "Некромант", basePrice: 150, attack: 30, defense: 20, icon: "🧙", desc: "Призовава скелети всеки рунд", special: "summonSkeleton:2", category: "fantasy" },
    { id: "vampire_samurai", name: "Самурай-вампир", basePrice: 190, attack: 65, defense: 45, icon: "⚔️", desc: "Катана на кръвта – 40% критичен удар", special: "critChance:0.4", category: "fantasy" },
    { id: "bronze_dragon", name: "Бронзов дракон", basePrice: 280, attack: 65, defense: 60, icon: "🐉", desc: "Дихание на времето – връща врага в предишен рунд", special: "timeSkip:true", category: "fantasy" },
    { id: "titan", name: "Титан", basePrice: 500, attack: 120, defense: 90, icon: "👑", desc: "Гигантски скок – намалява вражеската армия с 20%", special: "armyShrink:0.2", category: "fantasy" },

    // ===== 10 НОВИ ФЕНТЪЗИ ВОЙСКИ (ВЕРСИЯ 2.0) =====
    { id: "shadow_assassin", name: "Сенчест убиец", basePrice: 140, attack: 48, defense: 22, icon: "🗡️", desc: "Нападение от сенките – +30% щети при първа атака", special: "firstStrikeBonus:0.3", category: "fantasy" },
    { id: "paladin", name: "Паладин", basePrice: 180, attack: 40, defense: 50, icon: "🛡️", desc: "Свещена защита – намалява щетите на съюзниците с 10%", special: "allyProtection:0.1", category: "fantasy" },
    { id: "druid", name: "Друид", basePrice: 95, attack: 25, defense: 30, icon: "🌿", desc: "Сили на природата – лекува 15 живот на рунд", special: "healAllies:15", category: "fantasy" },
    { id: "centaur", name: "Кентавър", basePrice: 110, attack: 38, defense: 28, icon: "🏹🐎", desc: "Скоростна атака – +20% атака след движение", special: "chargeBonus:0.2", category: "fantasy" },
    { id: "golem", name: "Каменен голем", basePrice: 250, attack: 45, defense: 70, icon: "🗿", desc: "Непробиваем – първите 3 атаки срещу него са намалени с 50%", special: "earlyDamageReduction:0.5", category: "fantasy" },
    { id: "siren", name: "Сирена", basePrice: 130, attack: 18, defense: 25, icon: "🎵", desc: "Омайна песен – врагът губи 1 рунд", special: "skipEnemyTurn:0.15", category: "fantasy" },
    { id: "phoenix", name: "Феникс", basePrice: 400, attack: 85, defense: 55, icon: "🔥", desc: "Възкресение – съживява се веднъж с 30% здраве", special: "reviveOnce:0.3", category: "fantasy" },
    { id: "dark_knight", name: "Тъмен рицар", basePrice: 210, attack: 65, defense: 45, icon: "⚔️🖤", desc: "Прокълнат меч – +20% щети и 10% вампиризъм", special: "lifeSteal:0.1,critChance:0.1", category: "fantasy" },
    { id: "frost_wyrm", name: "Леден змей", basePrice: 380, attack: 90, defense: 60, icon: "🐉❄️", desc: "Леден дъх – забавя и нанася 30 щети за 2 рунда", special: "slowEffect:0.3,dotDamage:30", category: "fantasy" },
    { id: "angel", name: "Ангел", basePrice: 500, attack: 95, defense: 85, icon: "👼", desc: "Божествена намеса – възкресява паднал съюзник", special: "resurrectAlly:0.2", category: "legendary" }
];

// IDs за бърз достъп
window.ALL_TROOP_IDS = window.ALL_TROOP_TYPES.map(t => t.id);

// Групиране по категории за улеснение
window.troopCategories = {
    basic: window.ALL_TROOP_TYPES.filter(t => t.category === "basic"),
    fantasy: window.ALL_TROOP_TYPES.filter(t => t.category === "fantasy"),
    legendary: window.ALL_TROOP_TYPES.filter(t => t.category === "legendary")
};

// Помощна функция за получаване на войска по ID
window.getTroopById = function(id) {
    return window.ALL_TROOP_TYPES.find(t => t.id === id);
};

// Помощна функция за изчисляване на общата сила на армия (за бърз достъп)
window.calculateArmyTotalPower = function(hero) {
    if (!hero || !hero.armyDetails) return 0;
    let totalPower = 0;
    for (let troop of window.ALL_TROOP_TYPES) {
        let count = hero.armyDetails[troop.id] || 0;
        totalPower += count * (troop.attack + troop.defense);
    }
    return totalPower;
};

// Универсална функция за синхронизация на armyDetails (използва се от всички модули)
window.ensureCompleteArmyDetails = function(hero) {
    if (!hero) return hero;
    if (!hero.armyDetails) hero.armyDetails = {};
    
    let changed = false;
    for (let id of window.ALL_TROOP_IDS) {
        if (hero.armyDetails[id] === undefined || hero.armyDetails[id] === null) {
            hero.armyDetails[id] = 0;
            changed = true;
        }
    }
    
    let total = 0;
    for (let id of window.ALL_TROOP_IDS) {
        total += hero.armyDetails[id] || 0;
    }
    
    if (hero.armySize !== total) {
        hero.armySize = total;
        hero.currentArmy = total;
        changed = true;
    }
    
    return hero.armyDetails;
};

// Функция за балансиране на цените според нивото на героя (може да се използва в armyMarket)
window.getAdjustedTroopPrice = function(troop, heroLevel) {
    let price = troop.basePrice;
    // Отстъпка от 2% на ниво, максимум 40%
    let discount = Math.min(0.4, (heroLevel - 1) * 0.02);
    return Math.max(1, Math.floor(price * (1 - discount)));
};

console.log("✅ troopsData.js версия 2.0 зареден – 42 типа войници, нови единици, категории, помощни функции и пълна синхронизация.");
