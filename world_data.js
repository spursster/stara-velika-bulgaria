/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: world_data.js (СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН ОТ ИНТЕРВАЛИ И СИНХРОНИЗИРАН
КОРЕКЦИЯ: Премахнати всички trailing spaces. Добавено поле 'name' за всеки клан/регион.
==========================================================================
*/
window.worldData = {
    factions: {
        bulgarian_empire: { nameBG: "Велика България", rulerTitleBG: "Кан", capitalBG: "Фанагория" },
        rhomaioi_empire: { nameBG: "Ромейска Империя (Rhomaioi)", relation: -20, power: 500 },
        persian_empire: { nameBG: "Персийска Империя", relation: 0, power: 1000 }
    },
    clans: {
        "Дуло": { name: "Болгарос", leader: "Болгарос", isJoined: true, regionsOwned: 1, gold: 1500, armySize: 500, clan: "Дуло" },
        "Комитопули": { name: "Никола", leader: "Никола", isJoined: false, regionsOwned: 1, gold: 800, armySize: 300, clan: "Комитопули" },
        "Асеневци": { name: "Асен I", leader: "Асен I", isJoined: false, regionsOwned: 1, gold: 850, armySize: 320, clan: "Асеневци" },
        "Тертер": { name: "Георги I Тертер", leader: "Георги I Тертер", isJoined: false, regionsOwned: 1, gold: 700, armySize: 250, clan: "Тертер" },
        "Даки": { name: "Залмоксис", leader: "Залмоксис", isJoined: false, regionsOwned: 1, gold: 650, armySize: 280, clan: "Даки" },
        "Уния Траки": { name: "Реметалк", leader: "Реметалк", isJoined: false, regionsOwned: 1, gold: 900, armySize: 310, clan: "Уния Траки" },
        "Шишмановци": { name: "Михаил Шишман", leader: "Михаил Шишман", isJoined: false, regionsOwned: 1, gold: 750, armySize: 260, clan: "Шишмановци" },
        "Македони": { name: "Александър", leader: "Александър", isJoined: false, regionsOwned: 1, gold: 1200, armySize: 450, clan: "Македони" },
        "Птоломеи": { name: "Сотер", leader: "Сотер", isJoined: false, regionsOwned: 1, gold: 1100, armySize: 350, clan: "Птоломеи" },
        "Одриси": { name: "Терес", leader: "Терес", isJoined: false, regionsOwned: 1, gold: 800, armySize: 330, clan: "Одриси" },
        "Бесараб": { name: "Иванко Бесараб", leader: "Иванко Бесараб", isJoined: false, regionsOwned: 1, gold: 700, armySize: 240, clan: "Бесараб" },
        "Османци Дуло": { name: "Осман Гази", leader: "Осман Гази", isJoined: false, regionsOwned: 1, gold: 950, armySize: 400, clan: "Османци Дуло" },
        "Скити": { name: "Атеас", leader: "Атеас", isJoined: false, regionsOwned: 1, gold: 600, armySize: 300, clan: "Скити" }
    },
    majorClans: [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки",
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ],
    regions: {
        "Мизия": { terrain: "Равнина", resource: "Жито", nativeClans: ["Уния Траки"], difficulty: 10 },
        "Тракия": { terrain: "Долина", resource: "Вино", nativeClans: ["Одриси"], difficulty: 15 },
        "Македония": { terrain: "Планина", resource: "Злато", nativeClans: ["Македони"], difficulty: 25 },
        "Добруджа": { terrain: "Равнина", resource: "Коне", nativeClans: ["Бесараб"], difficulty: 20 },
        "Дардания": { terrain: "Крепост", resource: "Желязо", nativeClans: ["Комитопули"], difficulty: 30 },
        "Илирия": { terrain: "Хълмове", resource: "Сребро", nativeClans: ["Асеневци"], difficulty: 35 },
        "Галатия": { terrain: "Гора", resource: "Дървесина", nativeClans: ["Тертер"], difficulty: 40 },
        "Дакия": { terrain: "Планина", resource: "Сол", nativeClans: ["Даки"], difficulty: 30 },
        "Сарматия": { terrain: "Степ", resource: "Коне", nativeClans: ["Скити"], difficulty: 45 },
        "Витиния": { terrain: "Бряг", resource: "Коприна", nativeClans: ["Османци Дуло"], difficulty: 40 },
        "Месопотамия": { terrain: "Равнина", resource: "Желязо", nativeClans: ["Шишмановци"], difficulty: 50 },
        "Бохемия": { terrain: "Гора", resource: "Сребро", nativeClans: ["Шишмановци"], difficulty: 55 },
        "Норик": { terrain: "Алпи", resource: "Стомана", nativeClans: ["Даки"], difficulty: 60 },
        "Реция": { terrain: "Алпи", resource: "Кехлибар", nativeClans: ["Даки"], difficulty: 65 },
        "Венетия": { terrain: "Блато", resource: "Стъкло", nativeClans: ["Асеневци"], difficulty: 70 },
        "Епир": { terrain: "Планина", resource: "Добитък", nativeClans: ["Македони"], difficulty: 35 },
        "Пелопонес": { terrain: "Хълмове", resource: "Маслини", nativeClans: ["Македони"], difficulty: 45 },
        "Кипър": { terrain: "Остров", resource: "Мед", nativeClans: ["Птоломеи"], difficulty: 50 },
        "Родос": { terrain: "Остров", resource: "Колоси", nativeClans: ["Птоломеи"], difficulty: 55 },
        "Крит": { terrain: "Остров", resource: "Лабиринт", nativeClans: ["Македони"], difficulty: 60 }
    }
};
