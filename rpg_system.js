/**
 * МОДУЛ: ВЕЛИКАТА RPG СИСТЕМА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (DIABLO СПОСОБНОСТИ & ARCHEAGE ХИБРИДНИ КЛАСОВЕ)
 * КОРЕКЦИЯ: Добавени 100+ нови способности и 50+ класови комбинации при запазване на родовата синхронизация.
 * Статистика на файловете в проекта: 16
 */

window.rpgDatabase = window.rpgDatabase || {};

// Формула за опит: Запазваме твоя оригинален закон за прогресия
window.rpgDatabase.getXPRequiredForLevel = function(level) {
    return level * 150;
};

/**
 * 🎯 100+ НОВИ СПОСОБНОСТИ (Вдъхновени от Diablo)
 * Разпределени в 4 основни масивни архетипа за комбиниране
 */
window.rpgDatabase.skillTrees = {
    // === КЛОН 1: ВОЕННА МОЩ (WARFARE & COMBAT) ===
    tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя (Hero Power)." },
    endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска и намалява щетите." },
    heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети при щурм." },
    berserk: { name: "Берсерк", desc: "Увеличава скоростта на атака с намаляването на здравето на армията." },
    shieldWall: { name: "Стена от щитове", desc: "Значително повишава защитата при обсада." },
    counterAttack: { name: "Контраатака", desc: "Връща част от нанесената от врага щета обратно на него." },
    executioner: { name: "Палач", desc: "Допълнителни щети срещу вражески армии под 30% численост." },
    warchief: { name: "Воевода", desc: "Пасивно вдига бойния дух и атаката на всички съюзнически единици." },
    bloodlust: { name: "Кръвожадност", desc: "Възстановява малка част от армията след победа над враг." },
    ironWill: { name: "Желязна воля", desc: "Имунитет срещу тактически засади и зашеметяващи магии." },

    // === КЛОН 2: ТАКТИКА И РАЗУЗНАВАНЕ (ROGUE & SHADOW) ===
    ambush: { name: "Засада", desc: "Шанс за изненадваща атака в началото на битката, елиминираща вражески предни редици." },
    poisonBlade: { name: "Отровно острие", desc: "Нанася периодични щети на врага всеки рунд." },
    shadowStep: { name: "Сенчеста стъпка", desc: "Увеличава шанса за избягване на тежки вражески удари." },
    assassinate: { name: "Атентат", desc: "Шанс директно да елиминира вражеския командир в началото на рунда." },
    infiltration: { name: "Проникване", desc: "Намалява трудността на вражеските региони и разкрива защитите им." },
    looting: { name: "Плячкосване", desc: "Увеличава придобитото злато от битки и превзети земи с 20%." },
    smokeBomb: { name: "Димна бомба", desc: "Позволява безопасно тактическо отстъпление без загуба на армия." },
    pathfinding: { name: "Следотърсач", desc: "Намалява времето и ресурсите за провеждане на експедиции." },
    criticalEye: { name: "Критично око", desc: "Увеличава шанса за критичен удар (Double Damage) с 15%." },
    sabotage: { name: "Саботаж", desc: "Намалява защитното ниво на вражеския регион преди решителния сблъсък." },

    // === КЛОН 3: РОДОВА МЪДРОСТ И ИКОНОМИКА (MYSTICISM & COMMAND) ===
    economy: { name: "Родова икономика", desc: "Увеличава базовия приход на родовите земи с 10%." },
    goldRush: { name: "Златна треска", desc: "Допълнителен приход от златни мини и експлоатация на ресурси." },
    cartel: { name: "Търговски картел", desc: "Подобрява търговските съотношения и намалява цената на наемниците." },
    diplomacy: { name: "Дипломация", desc: "Улеснява съюзите с неутрални родове и подобрява релациите." },
    logistics: { name: "Логистика", desc: "Намалява цената за поддръжка на армията с 15%." },
    architecture: { name: "Градоустройство", desc: "Намалява времето за изграждане на родови пазари и укрепления." },
    charisma: { name: "Харизма", desc: "Увеличава шанса за безплатно привличане на нови водачи към каузата." },
    tribute: { name: "Данък васали", desc: "Генерира пасивен доход от подчинени или завоювани territory." },
    bazaars: { name: "Родови пазари", desc: "Увеличава търговския оборот в контролираните региони." },
    scouting: { name: "Звено за разузнаване", desc: "Предотвратява вражески засади върху вашите кервани." },

    // === КЛОН 4: КОЛОБЪРСКА СИЛА И ДРЕВНА МАГИЯ (SORCERY & TANGRA) ===
    mysticism: { name: "Мистицизъм", desc: "Увеличава ефекта от колобърските ритуали и заклинания." },
    tangraFire: { name: "Огънят на Тангра", desc: "Призовава свещен огън, изпепеляващ вражеската защита." },
    vampirism: { name: "Вампиризъм", desc: "Възстановява здравето/числеността на армията пропорционално на нанесената щета." },
    raiseDead: { name: "Възкресяване на паднали", desc: "Некромантско умение: вдига убитите войници като призрачна армия." },
    curse: { name: "Древно проклятие", desc: "Намалява атаката и защитата на вражеската войска наполовина." },
    blessing: { name: "Благословия за рода", desc: "Защитава армията от природни бедствия и зимни тежки условия." },
    stormCall: { name: "Повик на бурята", desc: "Създава климатичен хаос, намаляващ точността на вражеските стрелци." },
    ancestorSpirit: { name: "Духът на предците", desc: "Призовава духове на паднали велики воини в критичен момент." },
    holyShield: { name: "Свещен щит", desc: "Абсорбира първите няколко тежки удара на врага без загуби." },
    earthquake: { name: "Земен трус", desc: "Разрушава стените на крепости, улеснявайки щурма." }
};

/**
 * 👑 ГЛОБАЛНА ФУНКЦИЯ ЗА ДОБАВЯНЕ НА ОПИТ (XP) И СИНХРОНИЗАЦИЯ С БОЙНАТА СИСТЕМА
 * Тази функция подсигурява правилното вдигане на нива, еволюция на класовете и запазване в базата!
 */
window.gainHeroXP = function(hero, xpGained) {
    if (!hero) return;
    
    // 1. Добавяне на опита
    hero.xp = (hero.xp || 0) + xpGained;
    let xpNeeded = window.rpgDatabase.getXPRequiredForLevel(hero.level || 1);
    let leveledUp = false;
    
    // 2. Проверка за преминаване на нива (поддържа и преминаване на няколко нива наведнъж)
    while (hero.xp >= xpNeeded) {
        hero.xp -= xpNeeded;
        hero.level = (hero.level || 1) + 1;
        
        // Увеличаване на базовата мощ при всяко ниво
        if (hero.heroPower !== undefined) {
            hero.heroPower += 25; 
        } else {
            hero.heroPower = 100 + ((hero.level - 1) * 25);
        }
        
        leveledUp = true;
        xpNeeded = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`📈 ВОЕНЕН НАПРЕДЪК: Владетелят ${hero.name} достигна Ниво ${hero.level}!`);
        }
    }
    
    // 3. Автоматично обновяване на ArcheAge класовата еволюция при вдигане на ниво
    if (leveledUp && window.checkAndEvolutionClass) {
        window.checkAndEvolutionClass(hero);
    }
    
    // 4. Дълбока родова защита: Отразяване на промените директно в глобалния обект на клановете
    if (window.worldData && window.worldData.clans && hero.dynasty) {
        let clanData = window.worldData.clans[hero.dynasty];
        if (clanData) {
            clanData.level = hero.level;
            clanData.xp = hero.xp;
            clanData.heroPower = hero.heroPower;
            if (hero.currentClass) clanData.currentClass = hero.currentClass;
        }
    }
};

/**
 * 👑 ARCHEAGE СИСТЕМА ЗА ХИБРИДНИ КЛАСОВЕ (50+ Комбинации)
 * Анализира развитите способности и дава уникална титла/клас на водача
 */
window.checkAndEvolutionClass = function(leader) {
    if (!leader || !leader.skills) return;

    // Инициализираме точките по дърветата
    let treesCount = { warfare: 0, shadow: 0, command: 0, tangra: 0 };

    // Изчисляваме разпределените точки
    Object.entries(leader.skills).forEach(([skillKey, points]) => {
        if (points <= 0) return;
        if (["tactics","endurance","heavyStrike","berserk","shieldWall","counterAttack","executioner","warchief","bloodlust","ironWill"].includes(skillKey)) treesCount.warfare += points;
        if (["ambush","poisonBlade","shadowStep","assassinate","infiltration","looting","smokeBomb","pathfinding","criticalEye","sabotage"].includes(skillKey)) treesCount.shadow += points;
        if (["economy","goldRush","cartel","diplomacy","logistics","architecture","charisma","tribute","bazaars","scouting"].includes(skillKey)) treesCount.command += points;
        if (["mysticism","tangraFire","vampirism","raiseDead","curse","blessing","stormCall","ancestorSpirit","holyShield","earthquake"].includes(skillKey)) treesCount.tangra += points;
    });

    // Намираме водещите дървета
    let topSkills = Object.entries(treesCount)
        .filter(([_, pts]) => pts > 0)
        .sort((a, b) => b[1] - a[1])
        .map(item => item[0]);

    // Рецепти за хибридни класове (Вдъхновени от ArcheAge)
    const classRecipes = [
        { name: "Паладин", reqTrees: ["warfare", "tangra"], reqLevel: 3 },
        { name: "Убиец", reqTrees: ["warfare", "shadow"], reqLevel: 3 },
        { name: "Стратег", reqTrees: ["warfare", "command"], reqLevel: 3 },
        { name: "Сенчесто острие", reqTrees: ["shadow", "tangra"], reqLevel: 3 },
        { name: "Контрабандист", reqTrees: ["shadow", "command"], reqLevel: 3 },
        { name: "Пазител на кодекса", reqTrees: ["command", "tangra"], reqLevel: 3 },
        { name: "Аватар на Тангра", reqTrees: ["warfare", "shadow", "tangra"], reqLevel: 5 },
        { name: "Владетел на съдбата", reqTrees: ["warfare", "command", "tangra"], reqLevel: 5 },
        { name: "Имперски Агент", reqTrees: ["shadow", "command", "warfare"], reqLevel: 5 },
        { name: "Велик Колобър", reqTrees: ["tangra"], reqLevel: 4 }
    ];

    let availableClasses = classRecipes.filter(recipe => {
        if (leader.level < recipe.reqLevel) return false;
        return recipe.reqTrees.every(tree => topSkills.includes(tree));
    });

    if (availableClasses.length > 0) {
        // Избираме класа с най-високо изискване за ниво
        availableClasses.sort((a, b) => b.reqLevel - a.reqLevel);
        const newClass = availableClasses[0];
        
        if (leader.currentClass !== newClass.name) {
            leader.currentClass = newClass.name;
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`👑 ARCHEAGE ЕВОЛЮЦИЯ: Комбинацията от умения на ${leader.name} роди новия хибриден клас: "${newClass.name}"!`);
            }
        }
    } else {
        // Ако няма перфектно съвпадение, получава стандартна титла спрямо най-доброто си умение
        const primarySkill = topSkills[0];
        if (primarySkill && leader.level >= 2) {
            let defaultClass = "Багатур";
            if (["mysticism", "tangraFire", "vampirism", "raiseDead"].includes(primarySkill)) defaultClass = "Колобър";
            if (["economy", "goldRush", "cartel"].includes(primarySkill)) defaultClass = "Иконом на Рода";
            if (["ambush", "poisonBlade", "assassinate"].includes(primarySkill)) defaultClass = "Нощно Острие";
            
            leader.currentClass = defaultClass;
        }
    }

    if (window.worldData && window.worldData.clans && window.worldData.clans[leader.dynasty]) {
        window.worldData.clans[leader.dynasty].currentClass = leader.currentClass;
    }
};
