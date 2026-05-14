/**
 * МОДУЛ: СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА - Велика България
 * Синхронизиран: 50 региона, корекция на липсващи данни и йерархия на родовете.
 */

window.worldData = {
    // Основни държави (Фракции)
    factions: {
        "bulgarian_empire": {
            nameBG: "Велика България",
            nameUS: "Great Bulgaria",
            rulerTitleBG: "Кан",
            capitalBG: "Фанагория"
        },
        "rhomaioi_empire": {
            nameBG: "Ромейска Империя (Rhomaioi)",
            nameUS: "Roman Empire (Rhomaioi)",
            relation: -20,
            power: 500
        },
        "persian_empire": {
            nameBG: "Персийска Империя",
            nameUS: "Persian Empire",
            relation: 0,
            power: 1000
        }
    },

    // ДАННИ ЗА РОДОВЕТЕ
    clans: {
        "Дуло": { icon: "assets/icons/clans/dulo.png", isJoined: true, regionsOwned: 1, leader: "Кан Кубрат" },
        "Вокил": { icon: "assets/icons/clans/vokil.png", isJoined: false, regionsOwned: 0, leader: "Кормисош" },
        "Ерми": { icon: "assets/icons/clans/ermi.png", isJoined: false, regionsOwned: 0, leader: "Гостун" },
        "Угаин": { icon: "assets/icons/clans/ugain.png", isJoined: false, regionsOwned: 0, leader: "Телец" },
        "Куригир": { icon: "assets/icons/clans/kurigir.png", isJoined: false, regionsOwned: 0, leader: "Ирник" },
        "Комитопули": { icon: "assets/icons/clans/komitopuli.png", isJoined: false, regionsOwned: 0, leader: "Никола" },
        "Асеневци": { icon: "assets/icons/clans/asenevci.png", isJoined: false, regionsOwned: 0, leader: "Асен" },
        "Тертер": { icon: "assets/icons/clans/terter.png", isJoined: false, regionsOwned: 0, leader: "Георги" },
        "Смилец": { icon: "assets/icons/clans/smilec.png", isJoined: false, regionsOwned: 0, leader: "Смилец" },
        "Шишмановци": { icon: "assets/icons/clans/shishmanovci.png", isJoined: false, regionsOwned: 0, leader: "Михаил" },
        "Македони": { icon: "assets/icons/clans/makedoni.png", isJoined: false, regionsOwned: 0, leader: "Василий" },
        "Птоломеи": { icon: "assets/icons/clans/ptolomey.png", isJoined: false, regionsOwned: 0, leader: "Птоломей I" },
        "Одриси": { icon: "assets/icons/clans/odrisi.png", isJoined: false, regionsOwned: 0, leader: "Терес" }
    },

    // Детайлни данни за провинциите - 50 региона
    regions: {
        // --- ЗОНА 1: БАЛКАНИ И ПРИДУНАВИЕ ---
        "Мизия": { terrain: "Гора", resource: "Дървесина", nativeClans: ["Гети"], difficulty: 10 },
        "Тракия": { terrain: "Равнина", resource: "Злато", nativeClans: ["Одриси", "Беси"], difficulty: 15 },
        "Македония": { terrain: "Планина", resource: "Желязо", nativeClans: ["Македони"], difficulty: 25 },
        "Добруджа": { terrain: "Степ", resource: "Коне", nativeClans: ["Куригир"], difficulty: 20 },
        "Панония": { terrain: "Равнина", resource: "Зърно", nativeClans: ["Вокил"], difficulty: 30 },
        "Илирия": { terrain: "Бряг", resource: "Кораби", nativeClans: ["Асеневци"], difficulty: 40 },
        "Тесалия": { terrain: "Долина", resource: "Маслини", nativeClans: ["Македони"], difficulty: 35 },
        "Дакия": { terrain: "Хълмове", resource: "Сол", nativeClans: ["Тертер"], difficulty: 35 },
        "Родопи": { terrain: "Висока планина", resource: "Сребро", nativeClans: ["Одриси"], difficulty: 45 },
        "Дардания": { terrain: "Планина", resource: "Руда", nativeClans: ["Комитопули"], difficulty: 40 },

        // --- ЗОНА 2: ПРИЧЕРНОМОРИЕ И КАВКАЗ ---
        "Стара Велика България": { terrain: "Степ", resource: "Коне", nativeClans: ["Дуло", "Куригир"], difficulty: 5 },
        "Крим": { terrain: "Бряг", resource: "Вино", nativeClans: ["Дуло"], difficulty: 20 },
        "Боспор": { terrain: "Пристанище", resource: "Търговия", nativeClans: ["Дуло"], difficulty: 25 },
        "Кубан": { terrain: "Степ", resource: "Коне", nativeClans: ["Куригир"], difficulty: 15 },
        "Кавказ": { terrain: "Планина", resource: "Мед", nativeClans: ["Ерми"], difficulty: 50 },
        "Колхида": { terrain: "Бряг", resource: "Злато", nativeClans: ["Птоломеи"], difficulty: 45 },
        "Алания": { terrain: "Планина", resource: "Стомана", nativeClans: ["Ерми"], difficulty: 55 },
        "Таврида": { terrain: "Степ", resource: "Добитък", nativeClans: ["Дуло"], difficulty: 15 },
        "Херсонес": { terrain: "Град", resource: "Изкуство", nativeClans: ["Птоломеи"], difficulty: 30 },
        "Иберия Кавказка": { terrain: "Планина", resource: "Скъпоценни камъни", nativeClans: ["Ерми"], difficulty: 60 },
        "Меотия": { terrain: "Блатиста степ", resource: "Риба", nativeClans: ["Куригир"], difficulty: 10 },

        // --- ЗОНА 3: МАЛА АЗИЯ И ИЗТОК ---
        "Витиния": { terrain: "Хълмове", resource: "Коприна", nativeClans: ["Птоломеи"], difficulty: 50 },
        "Фригия": { terrain: "Плато", resource: "Вълна", nativeClans: ["Птоломеи"], difficulty: 45 },
        "Лидия": { terrain: "Долина", resource: "Електрон", nativeClans: ["Одриси"], difficulty: 55 },
        "Кападокия": { terrain: "Скали", resource: "Коне", nativeClans: ["Угаин"], difficulty: 60 },
        "Понт": { terrain: "Планина", resource: "Мед", nativeClans: ["Македони"], difficulty: 50 },
        "Галатия": { terrain: "Плато", resource: "Наемници", nativeClans: ["Тертер"], difficulty: 45 },
        "Киликия": { terrain: "Бряг", resource: "Кедър", nativeClans: ["Шишмановци"], difficulty: 65 },
        "Армения": { terrain: "Висока планина", resource: "Обсидиан", nativeClans: ["Ерми"], difficulty: 70 },
        "Асирия": { terrain: "Пустиня", resource: "Масла", nativeClans: ["Угаин"], difficulty: 75 },
        "Месопотамия": { terrain: "Реки", resource: "Подправки", nativeClans: ["Смилец"], difficulty: 80 },

        // --- ЗОНА 4: СТЕПИ И ЦЕНТРАЛНА АЗИЯ ---
        "Волжка степ": { terrain: "Степ", resource: "Кожа", nativeClans: ["Дуло"], difficulty: 10 },
        "Хиркания": { terrain: "Джунгла", resource: "Тигри", nativeClans: ["Угаин"], difficulty: 65 },
        "Бактрия": { terrain: "Планина", resource: "Лапис лазули", nativeClans: ["Дуло"], difficulty: 85 },
        "Согдиана": { terrain: "Пустиня", resource: "Кервани", nativeClans: ["Дуло"], difficulty: 90 },
        "Сарматия": { terrain: "Степ", resource: "Желязо", nativeClans: ["Куригир"], difficulty: 30 },
        "Скития": { terrain: "Степ", resource: "Лукове", nativeClans: ["Куригир"], difficulty: 25 },
        "Масагети": { terrain: "Пустинна степ", resource: "Злато", nativeClans: ["Угаин"], difficulty: 75 },
        "Хорезъм": { terrain: "Оазис", resource: "Памук", nativeClans: ["Смилец"], difficulty: 80 },
        "Партия": { terrain: "Планина", resource: "Катафракти", nativeClans: ["Угаин"], difficulty: 85 },
        "Мерв": { terrain: "Оазис", resource: "Плодове", nativeClans: ["Смилец"], difficulty: 70 },

        // --- ЗОНА 5: ЦЕНТРАЛНА ЕВРОПА И ОСТРОВИ ---
        "Трансилвания": { terrain: "Гора", resource: "Сол", nativeClans: ["Комитопули"], difficulty: 40 },
        "Моравия": { terrain: "Равнина", resource: "Желязо", nativeClans: ["Шишмановци"], difficulty: 50 },
        "Бохемия": { terrain: "Гора", resource: "Сребро", nativeClans: ["Шишмановци"], difficulty: 55 },
        "Норик": { terrain: "Алпи", resource: "Стомана", nativeClans: ["Вокил"], difficulty: 60 },
        "Реция": { terrain: "Алпи", resource: "Кехлибар", nativeClans: ["Вокил"], difficulty: 65 },
        "Венетия": { terrain: "Блато", resource: "Стъкло", nativeClans: ["Асеневци"], difficulty: 70 },
        "Епир": { terrain: "Планина", resource: "Добитък", nativeClans: ["Македони"], difficulty: 35 },
        "Пелопонес": { terrain: "Хълмове", resource: "Маслини", nativeClans: ["Македони"], difficulty: 45 },
        "Кипър": { terrain: "Остров", resource: "Мед", nativeClans: ["Птоломеи"], difficulty: 50 },
        "Родос": { terrain: "Остров", resource: "Колоси", nativeClans: ["Птоломеи"], difficulty: 55 }
    },

    majorClans: [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ]
};

window.recalculateClanHierarchy = function() {
    const joinedClans = window.worldData.majorClans
        .filter(name => window.worldData.clans[name].isJoined)
        .sort((a, b) => window.worldData.clans[b].regionsOwned - window.worldData.clans[a].regionsOwned);
    return joinedClans;
};

window.getRegionReport = function(regionName) {
    const region = window.worldData.regions[regionName];
    if (!region) {
        console.error(`Регионът "${regionName}" не е намерен в базата данни.`);
        return;
    }
    const clans = region.nativeClans.join(", ");
    const report = `Земята ${regionName} се владее от родове: ${clans}. Тук изобилства ресурсът: ${region.resource}.`;
    if (window.showAdvisorMsg) window.showAdvisorMsg(report);
};
