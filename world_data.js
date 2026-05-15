/**
 * МОДУЛ: СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода)
 * Всички династии и основатели са фиксирани според Закона на Кана.
 */

window.worldData = {
    // ОСНОВНИ ФРАКЦИИ
    factions: {
        "bulgarian_empire": {
            nameBG: "Велика България",
            rulerTitleBG: "Кан",
            capitalBG: "Фанагория"
        },
        "rhomaioi_empire": {
            nameBG: "Ромейска Империя (Rhomaioi)",
            relation: -20,
            power: 500
        },
        "persian_empire": {
            nameBG: "Персийска Империя",
            relation: 0,
            power: 1000
        }
    },

    // ДАННИ ЗА РОДОВЕТЕ (13-те династии)
    clans: {
        "Дуло": { leader: "Болгарос", isJoined: true, regionsOwned: 1, gold: 1500, armySize: 500 },
        "Комитопули": { leader: "Никола", isJoined: false, regionsOwned: 1, gold: 800, armySize: 300 },
        "Асеневци": { leader: "Асен I", isJoined: false, regionsOwned: 1, gold: 850, armySize: 320 },
        "Тертер": { leader: "Георги I Тертер", isJoined: false, regionsOwned: 1, gold: 700, armySize: 250 },
        "Даки": { leader: "Залмоксис", isJoined: false, regionsOwned: 1, gold: 900, armySize: 400 },
        "Уния Траки": { leader: "Трак", isJoined: false, regionsOwned: 1, gold: 750, armySize: 280 },
        "Шишмановци": { leader: "Шишман", isJoined: false, regionsOwned: 1, gold: 600, armySize: 200 },
        "Македони": { leader: "Филип II", isJoined: false, regionsOwned: 1, gold: 1200, armySize: 450 },
        "Птоломеи": { leader: "Птолемей I Сотер", isJoined: false, regionsOwned: 1, gold: 1100, armySize: 380 },
        "Одриси": { leader: "Терес I", isJoined: false, regionsOwned: 1, gold: 950, armySize: 340 },
        "Бесараб": { leader: "Басараб I", isJoined: false, regionsOwned: 1, gold: 800, armySize: 300 },
        "Османци Дуло": { leader: "Осман I", isJoined: false, regionsOwned: 1, gold: 1000, armySize: 420 },
        "Скити": { leader: "Ишпакай", isJoined: false, regionsOwned: 1, gold: 850, armySize: 310 }
    },

    // ДЕТАЙЛНИ ДАННИ ЗА 51 РЕГИОНА
    regions: {
        // БАЛКАНИ И ПРИДУНАВИЕ
        "Мизия": { terrain: "Гора", resource: "Дървесина", nativeClans: ["Уния Траки"], difficulty: 10 },
        "Тракия": { terrain: "Равнина", resource: "Злато", nativeClans: ["Одриси"], difficulty: 15 },
        "Македония": { terrain: "Планина", resource: "Желязо", nativeClans: ["Македони"], difficulty: 25 },
        "Добруджа": { terrain: "Степ", resource: "Коне", nativeClans: ["Бесараб"], difficulty: 20 },
        "Панония": { terrain: "Равнина", resource: "Зърно", nativeClans: ["Дуло"], difficulty: 30 },
        "Илирия": { terrain: "Бряг", resource: "Кораби", nativeClans: ["Асеневци"], difficulty: 40 },
        "Тесалия": { terrain: "Долина", resource: "Маслини", nativeClans: ["Македони"], difficulty: 35 },
        "Дакия": { terrain: "Хълмове", resource: "Сол", nativeClans: ["Даки"], difficulty: 35 },
        "Родопи": { terrain: "Висока планина", resource: "Сребро", nativeClans: ["Одриси"], difficulty: 45 },
        "Дардания": { terrain: "Планина", resource: "Руда", nativeClans: ["Комитопули"], difficulty: 40 },

        // ПРИЧЕРНОМОРИЕ И КАВКАЗ
        "Стара Велика България": { terrain: "Степ", resource: "Коне", nativeClans: ["Дуло"], difficulty: 5 },
        "Крим": { terrain: "Бряг", resource: "Вино", nativeClans: ["Дуло"], difficulty: 20 },
        "Боспор": { terrain: "Пристанище", resource: "Търговия", nativeClans: ["Дуло"], difficulty: 25 },
        "Кубан": { terrain: "Степ", resource: "Коне", nativeClans: ["Дуло"], difficulty: 15 },
        "Кавказ": { terrain: "Планина", resource: "Мед", nativeClans: ["Скити"], difficulty: 50 },
        "Колхида": { terrain: "Бряг", resource: "Злато", nativeClans: ["Птоломеи"], difficulty: 45 },
        "Алания": { terrain: "Планина", resource: "Стомана", nativeClans: ["Скити"], difficulty: 55 },
        "Таврида": { terrain: "Степ", resource: "Добитък", nativeClans: ["Дуло"], difficulty: 15 },
        "Херсонес": { terrain: "Град", resource: "Изкуство", nativeClans: ["Птоломеи"], difficulty: 30 },
        "Иберия Кавказка": { terrain: "Планина", resource: "Скъпоценни камъни", nativeClans: ["Скити"], difficulty: 60 },
        "Меотия": { terrain: "Блатиста степ", resource: "Риба", nativeClans: ["Дуло"], difficulty: 10 },

        // МАЛА АЗИЯ И ИЗТОК
        "Витиния": { terrain: "Хълмове", resource: "Коприна", nativeClans: ["Османци Дуло"], difficulty: 50 },
        "Фригия": { terrain: "Плато", resource: "Вълна", nativeClans: ["Македони"], difficulty: 45 },
        "Лидия": { terrain: "Долина", resource: "Електрон", nativeClans: ["Одриси"], difficulty: 55 },
        "Кападокия": { terrain: "Скали", resource: "Коне", nativeClans: ["Османци Дуло"], difficulty: 60 },
        "Понт": { terrain: "Планина", resource: "Мед", nativeClans: ["Македони"], difficulty: 50 },
        "Галатия": { terrain: "Плато", resource: "Наемници", nativeClans: ["Тертер"], difficulty: 45 },
        "Киликия": { terrain: "Бряг", resource: "Кедър", nativeClans: ["Шишмановци"], difficulty: 65 },
        "Армения": { terrain: "Висока планина", resource: "Обсидиан", nativeClans: ["Скити"], difficulty: 70 },
        "Асирия": { terrain: "Пустиня", resource: "Масла", nativeClans: ["Скити"], difficulty: 75 },
        "Месопотамия": { terrain: "Реки", resource: "Подправки", nativeClans: ["Шишмановци"], difficulty: 80 },

        // СТЕПИ И ЦЕНТРАЛНА АЗИЯ
        "Волжка степ": { terrain: "Степ", resource: "Кожа", nativeClans: ["Дуло"], difficulty: 10 },
        "Хиркания": { terrain: "Джунгла", resource: "Тигри", nativeClans: ["Скити"], difficulty: 65 },
        "Бактрия": { terrain: "Планина", resource: "Лапис лазули", nativeClans: ["Македони"], difficulty: 85 },
        "Согдиана": { terrain: "Пустиня", resource: "Кервани", nativeClans: ["Скити"], difficulty: 90 },
        "Сарматия": { terrain: "Степ", resource: "Желязо", nativeClans: ["Скити"], difficulty: 30 },
        "Скития": { terrain: "Степ", resource: "Лукове", nativeClans: ["Скити"], difficulty: 25 },
        "Масагети": { terrain: "Пустинна степ", resource: "Злато", nativeClans: ["Скити"], difficulty: 75 },
        "Хорезъм": { terrain: "Оазис", resource: "Памук", nativeClans: ["Скити"], difficulty: 80 },
        "Партия": { terrain: "Планина", resource: "Катафракти", nativeClans: ["Скити"], difficulty: 85 },
        "Мерв": { terrain: "Оазис", resource: "Плодове", nativeClans: ["Скити"], difficulty: 70 },

        // ЦЕНТРАЛНА ЕВРОПА И ОСТРОВИ
        "Трансилвания": { terrain: "Гора", resource: "Сол", nativeClans: ["Даки"], difficulty: 40 },
        "Моравия": { terrain: "Равнина", resource: "Желязо", nativeClans: ["Шишмановци"], difficulty: 50 },
        "Бохемия": { terrain: "Гора", resource: "Сребро", nativeClans: ["Шишмановци"], difficulty: 55 },
        "Норик": { terrain: "Алпи", resource: "Стомана", nativeClans: ["Даки"], difficulty: 60 },
        "Реция": { terrain: "Алпи", resource: "Кехлибар", nativeClans: ["Даки"], difficulty: 65 },
        "Венетия": { terrain: "Блато", resource: "Стъкло", nativeClans: ["Асеневци"], difficulty: 70 },
        "Епир": { terrain: "Планина", resource: "Добитък", nativeClans: ["Македони"], difficulty: 35 },
        "Пелопонес": { terrain: "Хълмове", resource: "Маслини", nativeClans: ["Македони"], difficulty: 45 },
        "Кипър": { terrain: "Остров", resource: "Мед", nativeClans: ["Птоломеи"], difficulty: 50 },
        "Родос": { terrain: "Остров", resource: "Колоси", nativeClans: ["Птоломеи"], difficulty: 55 },
        "Крит": { terrain: "Остров", resource: "Лабиринт", nativeClans: ["Македони"], difficulty: 60 }
    },

    majorClans: [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки", 
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ]
};

window.recalculateClanHierarchy = function() {
    const joinedClans = window.worldData.majorClans
        .filter(name => window.worldData.clans[name].isJoined)
        .sort((a, b) => window.worldData.clans[b].regionsOwned - window.worldData.clans[a].regionsOwned);
    return joinedClans;
};
