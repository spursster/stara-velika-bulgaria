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
    heavyStrike: { name: "Смазващ удар", desc: "Шанс за нанасяне на 200% щети при щурм на гарнизон." },
    whirlwind: { name: "Вихър от остриета", desc: "Поразява няколко вражески отряда едновременно в битка." },
    bloodRage: { name: "Кървав гняв", desc: "Колкото по-малко войска остава, толкова повече нараства атаката." },
    ironSkin: { name: "Желязна кожа", desc: "Пасивно намалява щетите от вражески стрелци с 15%." },
    battleCry: { name: "Боен вик", desc: "Повишава морала на армията и намалява дезертьорството." },
    shieldBash: { name: "Удар с щит", desc: "Зашеметява челната линия на врага за 1 ход." },
    weaponMastery: { name: "Майсторство на стоманата", desc: "Повишава ефективността на наетите конници." },
    frenzy: { name: "Ярост на Багатура", desc: "Всеки убит враг увеличава скоростта на следващата атака." },
    siegeMaster: { name: "Инженер на обсади", desc: "Намалява защитния ранг на вражеските региони с 1." },
    ignorePain: { name: "Пренебрегване на болката", desc: "Шанс за пълно block-ване на щети веднъж на битка." },
    phalanx: { name: "Стената на Одрисите", desc: "Увеличава защитата на пехотата, когато се бие в дефилета." },
    counterAttack: { name: "Контраатака", desc: "При успешна защита веднага нанася ответен удар по врага." },
    execute: { name: "Посичане", desc: "Ако вражеският гарнизон е под 20%, го довършва моментално." },
    warchiefStance: { name: "Позиция на Воевода", desc: "Увеличава опита, получаван от армията след победа." },
    spearWall: { name: "Стена от копия", desc: "Спира настъплението на тежка вражеска кавалерия." },
    blitzkrieg: { name: "Стремителен удар", desc: "Първият ход в битката нанася 30% допълнителни щети." },
    vanguard: { name: "Авангард", desc: "Увеличава шанса за победа при трудни терени." },
    lastStand: { name: "Последна отбрана", desc: "Ако Канът е пред смърт, армията получава 50% защита." },
    gladiatorSoul: { name: "Дух на гладиатор", desc: "Увеличава бойната мощ при дуели между владетели." },
    armorPiercing: { name: "Пробиване на броня", desc: "Игнорира защитното ниво на региона при атака." },
    veteranTraining: { name: "Ветеранско обучение", desc: "Новонаетите единици започват с бонус показатели." },
    conquerorsWill: { name: "Воля на Завоевател", desc: "Намалява трудността на незавладените региони." },
    martialFocus: { name: "Боен фокус", desc: "Увеличава шансовете за критичен удар в битка." },

    // === КЛОН 2: МИСТИЦИЗЪМ И ОТВЪДНО (SORCERY & NECROMANCY) ===
    mysticism: { name: "Тангристка Мистика (Магия)", desc: "Призовава природни стихии и вълчи духове." },
    vampirism: { name: "Висш Вампиризъм", desc: "Възстановява войска в битка на база нанесени щети." },
    tangraFire: { name: "Тангристки огън", desc: "Изпепелява вражеските стрелци с магически пламък." },
    wolfPack: { name: "Вълча глутница", desc: "Призовава митични вълци, които всяват паника сред врага." },
    raiseDead: { name: "Възкресение на падналите", desc: "Превръща част от убитите врагове в твои воини след битка." },
    boneShield: { name: "Костна броня", desc: "Обгражда лидера с щит от кости, абсорбиращ щети." },
    curseOfBlindness: { name: "Проклятие на слепотата", desc: "Намалява точността на врага с 25% за 3 хода." },
    chainLightning: { name: "Верижна светкавица", desc: "Поразява до 3 съседни вражески отряда наведнъж." },
    bloodBurst: { name: "Кървав взрив", desc: "Взривява паднал отряд, нанасяйки щети на околните." },
    shadowStep: { name: "Стъпка в сенките", desc: "Позволява на Кана да избегне фатален удар в битка." },
    ancestorCall: { name: "Зов на Предците", desc: "Призовава духове от рода Дуло да вдигнат защитата." },
    plagueSwarm: { name: "Чумен рояк", desc: "Заразява гарнизона, намалявайки числеността му с времето." },
    meteorStrike: { name: "Падаща звезда", desc: "Удар от небето, който срива укрепленията на региона." },
    soulHarvest: { name: "Жътва на души", desc: "Всеки убит отряд увеличава магическата мощ на героя." },
    ritualOfBesa: { name: "Ритуал на Беса", desc: "Увеличава силата на Тракийските единици в армията." },
    darkPact: { name: "Тъмен пакт", desc: "Жертва 5% от армията за получаване на мощно заклинание." },
    frostNova: { name: "Леден взрив", desc: "Замразява вражеската кавалерия и я лишава от ход." },
    teleport: { name: "Мигновено преместване", desc: "Позволява бързо бягство от загубена битка без смърт." },
    spiritLink: { name: "Връзка на духовете", desc: "Разпределя щетите равномерно между всички отряди." },
    demonBane: { name: "Прогонване на злото", desc: "Увеличава защитата срещу мистични врагове." },
    hex: { name: "Древно проклятие", desc: "Превръща вражеския командир в безпомощно създание." },
    immortalitySpark: { name: "Искра на безсмъртието", desc: "Намалява времето и ресурсите за Ритуал на възкресение." },
    overload: { name: "Магическо претоварване", desc: "Следващото заклинание има двойно по-силен ефект." },
    abyssGaze: { name: "Поглед от бездната", desc: "Намалява Hero Power на вражеския лидер." },
    divineShield: { name: "Свещен купол", desc: "Пълна имунизация срещу магии за първите 2 хода." },

    // === КЛОН 3: ИМПЕРИЯ И БЛАГА (ECONOMY & GOVERNANCE) ===
    economy: { name: "Управление на благата", desc: "Увеличава златния данък, събиран от регионите." },
    stature: { name: "Величие (Харизма)", desc: "Намалява цената за наемане на армия в казармите." },
    diplomacy: { name: "Дипломация", desc: "Подобрява шансовете за съюзи и мирни преговори." },
    goldRush: { name: "Златна треска", desc: "Откриване на нови златни жили в контролираните региони." },
    cartel: { name: "Търговски картел", desc: "Бонус +15% към прихода, ако притежаваш морски регион." },
    taxLevy: { name: "Извънреден налог", desc: "Възможност за събиране на незабавен данък в спешен случай." },
    bazaars: { name: "Родови пазари", desc: "Увеличава прихода от съседни неутрални региони." },
    supplyChain: { name: "Обсадна логистика", desc: "Намалява издръжката на армията по време на поход." },
    corvee: { name: "Ангария", desc: "Намалява цената за модернизация на регионите с 20%." },
    royalTreasury: { name: "Кралска съкровищница", desc: "Генерира пасивен лихвен приход на база текущото злато." },
    minting: { name: "Сечене на монети", desc: "Подобрява качеството на икономиката на всички кланове." },
    monopoly: { name: "Монопол над ресурсите", desc: "Увеличава търговския оборот от земи като Дакия и Тракия." },
    bribe: { name: "Дипломатически подкуп", desc: "Шанс за купуване на вражески воини преди битката." },
    vassalage: { name: "Васалитет", desc: "Завладените региони плащат 10% по-високи данъци." },
    guilds: { name: "Занаятчийски гилдии", desc: "Повишава базовия приход от икономиката всеки сезон." },
    grainLogistics: { name: "Хлебна логистика", desc: "Предпазва армията от глад и загуби през Зимата." },
    silverTongue: { name: "Сребърен език", desc: "Намалява цената за изпращане на подаръци на други родове." },
    centralization: { name: "Централизация", desc: "Столицата генерира двойно по-висок приход от данъци." },
    tolls: { name: "Пътни такси", desc: "Прибира данък от преминаващи експедиции на други кланове." },
    prosperousEra: { name: "Ера на Просперитет", desc: "Всички региони започват с +1 ниво на инфраструктура." },
    welfare: { name: "Родова грижа", desc: "Намалява шанса за бунтове и негативни икономически събития." },
    goldSmuggling: { name: "Контрабанда на ценности", desc: "Носи скрито злато дори при икономическа криза." },
    investments: { name: "Мащабни инвестиции", desc: "Ускорява възвръщаемостта от строежа на Космодруми." },
    tribute: { name: "Данък васали", desc: "Родовете в Кръвен съюз ти плащат малък пасивен данък." },
    propaganda: { name: "Имперски указ", desc: "Увеличава легитимността и авторитета на владетеля." },

    // === КЛОН 4: СЕНКИ И ОЦЕЛЯВАНЕ (SHADOW, STEALTH & ASSASSIN) ===
    ambush: { name: "Скрита засада", desc: "Шанс за изненадваща атака, игнорираща първия ход на гарнизона." },
    poisonBlade: { name: "Отровно острие", desc: "Вражеският гарнизон губи войници всеки ход от отрова." },
    windrunner: { name: "Бързина на вятъра", desc: "Увеличава шанса за успешна експедиция с 25%." },
    guerillaTactics: { name: "Партизанска тактика", desc: "Позволява нанасяне на щети и незабавно отстъпление." },
    evasion: { name: "Избягване на съдбата", desc: "Лидерът има 20% шанс да не умре при тотална загуба." },
    nightAssault: { name: "Нощно настъпление", desc: "Намалява защитната сила на врага по време на нощна битка." },
    smokeBomb: { name: "Димна завеса", desc: "Прекъсва битката веднага, спасявайки оцелялата войска." },
    spyNetwork: { name: "Шпионска мрежа", desc: "Вижда точния брой армия на региона преди атака." },
    assassinate: { name: "Покушение", desc: "Шанс за елиминиране на вражеския военачалник преди боя." },
    criticalStrike: { name: "Критичен разрез", desc: "Дава 15% шанс за нанасяне на тройни щети." },
    sabotage: { name: "Саботаж", desc: "Преди битка поврежда защитните палисади/куполи на региона." },
    fleetFooted: { name: "Лекокрил", desc: "Намалява времето за пътуване при междузвездни полети." },
    counterFeit: { name: "Фалшификатор", desc: "Шанс за копиране на мощен предмет или артефакт." },
    disguise: { name: "Маскировка", desc: "Враждебните родове не те атакуват първи по време на поход." },
    thiefGuile: { name: "Крадец на реликви", desc: "Шанс за задигане на артефакт от победен род." },
    shadowClones: { name: "Илюзорни клонинги", desc: "Създава фалшиви отряди, които поемат вражеския огън." },
    escapeArtist: { name: "Майстор на бягството", desc: "Канът никога не може да бъде пленен от врагове." },
    poisonGas: { name: "Токсичен облак", desc: "Поразява тиловата линия на вражеските стрелци." },
    blindside: { name: "Сляпо петно", desc: "Атакува фланговете на врага, заобикаляйки тежката пехота." },
    bountyHunter: { name: "Ловец на глави", desc: "Носи златен бонус за всеки убит вражески лидер." },
    silentStride: { name: "Тиха стъпка", desc: "Позволява преминаване през вражески регион без битка." },
    deadlyToxins: { name: "Смъртоносни токсини", desc: "Удвоява вредата от отровните атаки в играта." },
    preyOnWeak: { name: "Лов на слабите", desc: "Увеличава щетите срещу врагове с нисък морал." },
    reflexes: { name: "Свръхрефлекси", desc: "Позволява на героя да атакува два пъти в един и същ ход." },
    shadowCloak: { name: "Плащ на сенките", desc: "Пълна невидимост за разузнавателните шпионски мрежи." }
};

/**
 * 👑 ХИБРИДНА КЛАСОВА СИСТЕМА (Вдъхновена от ArcheAge)
 * Над 50 уникални класа на база комбинация от най-развитите способности на лидера!
 */
window.rpgDatabase.classes = [
    // --- Универсални и Базови класове ---
    { name: "Багатур", reqLevel: 2, dominantTrees: ["heavyStrike", "tactics"] },
    { name: "Колобър-Магьосник", reqLevel: 2, dominantTrees: ["mysticism", "tangraFire"] },
    { name: "Сенчест убиец", reqLevel: 2, dominantTrees: ["ambush", "poisonBlade"] },
    { name: "Имперски ковчежник", reqLevel: 2, dominantTrees: ["economy", "goldRush"] },

    // --- ХИБРИДНИ КЛАСОВЕ (Комбинация Военна Мощ + Магия) ---
    { name: "Боен Жрец", reqLevel: 3, dominantTrees: ["heavyStrike", "mysticism"] },
    { name: "Кръвен Рицар", reqLevel: 4, dominantTrees: ["bloodRage", "vampirism"] },
    { name: "Рунен Рушител", reqLevel: 4, dominantTrees: ["siegeMaster", "meteorStrike"] },
    { name: "Стихиен Полководец", reqLevel: 5, dominantTrees: ["tactics", "chainLightning"] },
    { name: "Гръмовержец", reqLevel: 5, dominantTrees: ["whirlwind", "tangraFire"] },
    { name: "Тангристки Защитник", reqLevel: 3, dominantTrees: ["ironSkin", "ancestorCall"] },
    { name: "Пазител на Олтара", reqLevel: 4, dominantTrees: ["endurance", "ritualOfBesa"] },

    // --- ХИБРИДНИ КЛАСОВЕ (Комбинация Военна Мощ + Империя) ---
    { name: "Имперски Воевода", reqLevel: 3, dominantTrees: ["tactics", "economy"] },
    { name: "Железен Губернатор", reqLevel: 4, dominantTrees: ["ironSkin", "centralization"] },
    { name: "Обсаден Командир", reqLevel: 4, dominantTrees: ["siegeMaster", "supplyChain"] },
    { name: "Консул на Войната", reqLevel: 5, dominantTrees: ["battleCry", "diplomacy"] },
    { name: "Варварски Лорд", reqLevel: 5, dominantTrees: ["frenzy", "taxLevy"] },
    { name: "Генерал-Легат", reqLevel: 3, dominantTrees: ["vanguard", "stature"] },
    { name: "Архонт на Мизия", reqLevel: 4, dominantTrees: ["phalanx", "vassalage"] },

    // --- ХИБРИДНИ КЛАСОВЕ (Комбинация Военна Мощ + Сенки) ---
    { name: "Острие на Сенките", reqLevel: 3, dominantTrees: ["heavyStrike", "ambush"] },
    { name: "Гверилен Тактик", reqLevel: 4, dominantTrees: ["tactics", "guerillaTactics"] },
    { name: "Гладиатор-Екзекутор", reqLevel: 4, dominantTrees: ["execute", "criticalStrike"] },
    { name: "Нощен Мародер", reqLevel: 5, dominantTrees: ["frenzy", "nightAssault"] },
    { name: "Безмилостен Пленник", reqLevel: 5, dominantTrees: ["lastStand", "escapeArtist"] },
    { name: "Флангови Щурмовак", reqLevel: 3, dominantTrees: ["whirlwind", "blindside"] },
    { name: "Диверсант на Асеневци", reqLevel: 4, dominantTrees: ["siegeMaster", "sabotage"] },

    // --- ХИБРИДНИ КЛАСОВЕ (Комбинация Магия + Империя) ---
    { name: "Златен Алхимик", reqLevel: 3, dominantTrees: ["mysticism", "goldRush"] },
    { name: "Магически Търговец", reqLevel: 4, dominantTrees: ["chainLightning", "cartel"] },
    { name: "Пазител на Хазната", reqLevel: 4, dominantTrees: ["boneShield", "royalTreasury"] },
    { name: "Пророк на Данъците", reqLevel: 5, dominantTrees: ["soulHarvest", "taxLevy"] },
    { name: "Висш Теолог-Иконом", reqLevel: 5, dominantTrees: ["ritualOfBesa", "centralization"] },
    { name: "Мистичен Монетар", reqLevel: 3, dominantTrees: ["tangraFire", "minting"] },
    { name: "Маг-Лечител на Стопанството", reqLevel: 4, dominantTrees: ["spiritLink", "welfare"] },

    // --- ХИБРИДНИ КЛАСОВЕ (Комбинация Магия + Сенки) ---
    { name: "Вампирски Убиец", reqLevel: 3, dominantTrees: ["vampirism", "ambush"] },
    { name: "Некромант на Сенките", reqLevel: 4, dominantTrees: ["raiseDead", "smokeBomb"] },
    { name: "Илюзионист", reqLevel: 4, dominantTrees: ["shadowStep", "shadowClones"] },
    { name: "Вещер на Отровата", reqLevel: 5, dominantTrees: ["curseOfBlindness", "poisonBlade"] },
    { name: "Адепт на Бездната", reqLevel: 5, dominantTrees: ["abyssGaze", "spyNetwork"] },
    { name: "Вълчи Ловец", reqLevel: 3, dominantTrees: ["wolfPack", "silentStride"] },
    { name: "Нощен Жрец на Беса", reqLevel: 4, dominantTrees: ["ritualOfBesa", "nightAssault"] },

    // --- ХИБРИДНИ КЛАСОВЕ (Комбинация Империя + Сенки) ---
    { name: "Шпионин-Дипломат", reqLevel: 3, dominantTrees: ["diplomacy", "spyNetwork"] },
    { name: "Контрабандист на Релики", reqLevel: 4, dominantTrees: ["cartel", "thiefGuile"] },
    { name: "Сенчест Банкер", reqLevel: 4, dominantTrees: ["royalTreasury", "counterFeit"] },
    { name: "Ловец на Кръвнина", reqLevel: 5, dominantTrees: ["economy", "bountyHunter"] },
    { name: "Имперски Саботьор", reqLevel: 5, dominantTrees: ["centralization", "sabotage"] },
    { name: "Информатор на Двореца", reqLevel: 3, dominantTrees: ["propaganda", "disguise"] },
    { name: "Корсар на Рода", reqLevel: 4, dominantTrees: ["tolls", "fleetFooted"] },

    // --- Върховни Епични Класове (При високо ниво и майсторство) ---
    { name: "Владетел на Вселената 🚀", reqLevel: 6, dominantTrees: ["tactics", "centralization"] },
    { name: "Върховен Жрец на Беса", reqLevel: 5, dominantTrees: ["mysticism", "ritualOfBesa"] },
    { name: "Властелин на Отвъдното", reqLevel: 6, dominantTrees: ["vampirism", "raiseDead"] },
    { name: "Планетарен Снабдител", reqLevel: 6, dominantTrees: ["investments", "fleetFooted"] }
];

/**
 * ИНИЦИАЛИЗАЦИЯ НА RPG СТРУКТУРАТА ЗА ДАДЕН ЛИДЕР
 */
window.initializeHeroRPGData = function(leader) {
    if (!leader) return;
    
    if (leader.level === undefined) leader.level = 1;
    if (leader.xp === undefined) leader.xp = 0;
    if (leader.skillPoints === undefined) leader.skillPoints = 0;
    if (leader.currentClass === undefined) leader.currentClass = "Няма клас";
    
    if (!leader.skills) {
        leader.skills = {};
        // Автоматично попълваме всички 100+ нови способности с 0 точки
        Object.keys(window.rpgDatabase.skillTrees).forEach(skillKey => {
            leader.skills[skillKey] = 0;
        });
    } else {
        // Подсигуряваме, че новодобавените способности съществуват в обекта на героя
        Object.keys(window.rpgDatabase.skillTrees).forEach(skillKey => {
            if (leader.skills[skillKey] === undefined) {
                leader.skills[skillKey] = 0;
            }
        });
    }
};

/**
 * ДОБАВЯНЕ НА ОПИТ И ТРАЙНО ЗАКЛЮЧВАНЕ НА НИВАТА
 */
window.gainHeroXP = function(leader, amount) {
    if (!leader) return;
    
    window.initializeHeroRPGData(leader);
    
    leader.xp += amount;
    let xpNeeded = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    let leveledUp = false;

    while (leader.xp >= xpNeeded) {
        leader.xp -= xpNeeded;
        leader.level++;
        leader.skillPoints += 3; // Дава 3 точки на ниво заради огромното дърво със 100 способности!
        leveledUp = true;
        xpNeeded = window.rpgDatabase.getXPRequiredForLevel(leader.level);
    }

    if (leveledUp) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🌟 RPG НАПРЕДЪК: Лидерът ${leader.name} от династия ${leader.dynasty} достигна Ниво ${leader.level}! Използвайте точките за Diablo способности!`);
        }
        window.autoAssignLeaderSkills(leader);
    }

    // Трайна синхронизация с глобалната родова база данни
    if (window.worldData && window.worldData.clans && window.worldData.clans[leader.dynasty]) {
        const dbClan = window.worldData.clans[leader.dynasty];
        dbClan.level = leader.level;
        dbClan.xp = leader.xp;
        dbClan.skillPoints = leader.skillPoints;
        dbClan.currentClass = leader.currentClass;
        dbClan.skills = JSON.parse(JSON.stringify(leader.skills));
    }

    if (window.updateCharacterUI && window.currentHero && window.currentHero.dynasty === leader.dynasty) {
        window.updateCharacterUI(window.currentHero);
    }
    
    if (window.renderTop6LeadersUI) {
        window.renderTop6LeadersUI();
    }
};

/**
 * АВТОМАТИЧНО РАЗПРЕДЕЛЯНЕ НА ТОЧКИТЕ ЗА УМЕНИЯ СЛЕД LEVEL UP
 */
window.autoAssignLeaderSkills = function(leader) {
    window.initializeHeroRPGData(leader);
    
    if (leader.skillPoints > 0) {
        const skillsKeys = Object.keys(leader.skills);
        while (leader.skillPoints > 0) {
            const randomSkill = skillsKeys[Math.floor(Math.random() * skillsKeys.length)];
            leader.skills[randomSkill]++;
            leader.skillPoints--;
        }
    }
    
    window.checkAndAssignClass(leader);
};

/**
 * 👑 ХИБРИДНА ARCHEAGE ПРОВЕРКА ЗА КЛАС
 * Сортира способностите по брой инвестирани точки и намира съответстващия хибриден клас
 */
window.checkAndAssignClass = function(leader) {
    window.initializeHeroRPGData(leader);
    
    // Подреждаме уменията на героя по сила (инвестирани точки)
    const sortedSkills = Object.keys(leader.skills)
        .map(key => ({ key: key, value: leader.skills[key] }))
        .sort((a, b) => b.value - a.value);

    // Вземаме топ развитите ключове способности
    const topSkills = sortedSkills.slice(0, 3).map(s => s.key);

    // Търсим най-подходящия хибриден клас в базата данни
    const availableClasses = window.rpgDatabase.classes.filter(c => {
        if (leader.level < c.reqLevel) return false;
        
        // Класът съвпада, ако неговите доминантни дървета са сред топ развитите на героя
        return c.dominantTrees.every(tree => topSkills.includes(tree));
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
    
    if (window.renderTop6LeadersUI) {
        window.renderTop6LeadersUI();
    }
};
