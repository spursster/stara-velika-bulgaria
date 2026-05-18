/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: world_data.js (СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА)
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН С АБСОЛЮТНИЯ ЗАКОН НА DATABASE.JS
 * ОПИСАНИЕ: Всички кланове и герои са пренесени едно към едно.
 * Статистика на файловете в проекта: 16
 * ==========================================================================
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

    // ДАННИ ЗА КЛАНОВЕТЕ (13-те клана от database.js и техните стартови Герои)
    clans: {
        "Дуло": { leader: "Атила", isJoined: true, regionsOwned: 1, gold: 1500, armySize: 500 },
        "Комитопули": { leader: "Давид", isJoined: false, regionsOwned: 1, gold: 800, armySize: 300 },
        "Асеневци": { leader: "Иван Асен I", isJoined: false, regionsOwned: 1, gold: 850, armySize: 350 },
        "Тертер": { leader: "Георги Тертер I", isJoined: false, regionsOwned: 1, gold: 700, armySize: 280 },
        "Даки": { leader: "Буребиста", isJoined: false, regionsOwned: 1, gold: 900, armySize: 400 },
        "Уния Траки": { leader: "Терей", isJoined: false, regionsOwned: 1, gold: 950, armySize: 380 },
        "Шишмановци": { leader: "Михаил III Шишман", isJoined: false, regionsOwned: 1, gold: 800, armySize: 310 },
        "Македони": { leader: "Каран", isJoined: false, regionsOwned: 1, gold: 1400, armySize: 480 },
        "Птоломеи": { leader: "Птолемей I Сотер", isJoined: false, regionsOwned: 1, gold: 1300, armySize: 460 },
        "Одриси": { leader: "Терес I", isJoined: false, regionsOwned: 1, gold: 950, armySize: 380 },
        "Бесараб": { leader: "Мишеслав", isJoined: false, regionsOwned: 1, gold: 850, armySize: 340 },
        " Дуло": { leader: "Осман I Гази", isJoined: false, regionsOwned: 1, gold: 1000, armySize: 400 },
        "Скити": { leader: "Пртатуа", isJoined: false, regionsOwned: 1, gold: 900, armySize: 420 }
    },

    // ГЕОГРАФСКИ РЕГИОНИ С КОВЕРНИТЕ ИМ КЛАНОВЕ (Пълен мач с новите имена)
    regions: {
        "Мизия": { terrain: "Равнина", resource: "Жито", nativeClans: ["Дуло"], difficulty: 10 },
        "Тракия": { terrain: "Хълмове", resource: "Вино", nativeClans: ["Одриси"], difficulty: 15 },
        "Македония": { terrain: "Планина", resource: "Сребро", nativeClans: ["Македони"], difficulty: 20 },
        "Добруджа": { terrain: "Равнина", resource: "Коне", nativeClans: ["Балид"], difficulty: 12 },
        "Поморавие": { terrain: "Гора", resource: "Дървесина", nativeClans: ["Комитопули"], difficulty: 18 },
        "Загоре": { terrain: "Хълмове", resource: "Овце", nativeClans: ["Асеневци"], difficulty: 16 },
        "Буджак": { terrain: "Степ", resource: "Сол", nativeClans: ["Дуло"], difficulty: 25 },
        "Влахия": { terrain: "Гора", resource: "Нефт", nativeClans: ["Бесараб"], difficulty: 22 },
        "Трансилвания": { terrain: "Карпати", resource: "Злато", nativeClans: ["Даки"], difficulty: 30 },
        "Банат": { terrain: "Блато", resource: "Риба", nativeClans: ["Тертер"], difficulty: 24 },
        "Белградска област": { terrain: "Река", resource: "Руда", nativeClans: ["Комитопули"], difficulty: 20 },
        "Браничево": { terrain: "Хълмове", resource: "Мед", nativeClans: ["Шишмановци"], difficulty: 15 },
        "Панония": { terrain: "Равнина", resource: "Желязо", nativeClans: ["Шишмановци"], difficulty: 50 },
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
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", 
        "Уния Траки", "Шишмановци", "Македони", "Птоломеи", "Одриси", 
        "Бесараб", " Дуло", "Скити"
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.worldData;
}
