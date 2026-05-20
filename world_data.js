/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ ФАЙЛ: world_data.js (СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА) 
========================================================================== */ 

window.worldData = {
    factions: { 
        bulgarian_empire: { nameBG: "Велика България", rulerTitleBG: "Кан", capitalBG: "Фанагория" }, 
        rhomaioi_empire: { nameBG: "Ромейска Империя (Rhomaioi)", relation: -20, power: 500 }, 
        persian_empire: { nameBG: "Персийска Империя", relation: 0, power: 1000 },
        khazar_khanate: { nameBG: "Хазарски Каганат", relation: -10, power: 600 },
        frankish_empire: { nameBG: "Франкска Империя", relation: 5, power: 700 },
        abbasid_caliphate: { nameBG: "Абасидски Халифат", relation: -15, power: 900 }
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
        "Османци Дуло": { name: "Осман Гази", leader: "Осман Гази", isJoined: false, regionsOwned: 1, gold: 700, armySize: 240, clan: "Османци Дуло" }, 
        "Скити": { name: "Атей", leader: "Атей", isJoined: false, regionsOwned: 1, gold: 600, armySize: 350, clan: "Скити" }
    },
    
    regions: {
        "Плиска": { name: "Плиска", terrain: "Равнина", resource: "Жито", nativeClans: ["Дуло"], difficulty: 10, defenseLevel: 2, infrastructureLevel: 2, armySize: 300 },
        "Преслав": { name: "Преслав", terrain: "Хълмиста", resource: "Камък", nativeClans: ["Дуло"], difficulty: 15, defenseLevel: 3, infrastructureLevel: 3, armySize: 450 },
        "Одрин": { name: "Одрин", terrain: "Речен", resource: "Риба", nativeClans: ["Комитопули"], difficulty: 25, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Търновград": { name: "Търновград", terrain: "Планинска", resource: "Желязо", nativeClans: ["Асеневци"], difficulty: 30, defenseLevel: 5, infrastructureLevel: 4, armySize: 700 },
        "Видин": { name: "Видин", terrain: "Равнина", resource: "Дървен материал", nativeClans: ["Шишмановци"], difficulty: 20, defenseLevel: 3, infrastructureLevel: 2, armySize: 400 },
        "София": { name: "София", terrain: "Планинска", resource: "Сребро", nativeClans: ["Тертер"], difficulty: 18, defenseLevel: 3, infrastructureLevel: 3, armySize: 380 },
        "Пловдив": { name: "Пловдив", terrain: "Хълмиста", resource: "Жито", nativeClans: ["Уния Траки"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 3, armySize: 420 },
        "Македония": { name: "Македония", terrain: "Планинска", resource: "Злато", nativeClans: ["Македони"], difficulty: 35, defenseLevel: 5, infrastructureLevel: 4, armySize: 800 },
        "Тракия": { name: "Тракия", terrain: "Равнина", resource: "Жито", nativeClans: ["Одриси"], difficulty: 20, defenseLevel: 3, infrastructureLevel: 3, armySize: 500 },
        "Добруджа": { name: "Добруджа", terrain: "Равнина", resource: "Риба", nativeClans: ["Даки"], difficulty: 12, defenseLevel: 2, infrastructureLevel: 2, armySize: 250 },
        "Мизия": { name: "Мизия", terrain: "Хълмиста", resource: "Жито", nativeClans: ["Уния Траки"], difficulty: 15, defenseLevel: 2, infrastructureLevel: 2, armySize: 320 },
        "Солун": { name: "Солун", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 40, defenseLevel: 6, infrastructureLevel: 5, armySize: 1200 },
        "Цариград": { name: "Цариград", terrain: "Крайбрежна", resource: "Шедьоври", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 55, defenseLevel: 8, infrastructureLevel: 7, armySize: 2000 },
        "Малоазия": { name: "Малоазия", terrain: "Планинска", resource: "Камък", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 45, defenseLevel: 6, infrastructureLevel: 5, armySize: 1500 },
        "Дакия": { name: "Дакия", terrain: "Планинска", resource: "Желязо", nativeClans: ["Даки"], difficulty: 28, defenseLevel: 4, infrastructureLevel: 3, armySize: 550 },
        "Скития": { name: "Скития", terrain: "Степ", resource: "Коне", nativeClans: ["Скити"], difficulty: 18, defenseLevel: 2, infrastructureLevel: 2, armySize: 500 },
        "Персия": { name: "Персия", terrain: "Пустинна", resource: "Килими", nativeClans: ["Персийска Империя"], difficulty: 60, defenseLevel: 7, infrastructureLevel: 6, armySize: 1800 },
        "Египет": { name: "Египет", terrain: "Пустинна", resource: "Папирус", nativeClans: ["Птоломеи"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 6, armySize: 1400 },
        "Арабия": { name: "Арабия", terrain: "Пустинна", resource: "Подправки", nativeClans: ["Османци Дуло"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 1100 },
        "Кавказ": { name: "Кавказ", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Османци Дуло"], difficulty: 35, defenseLevel: 5, infrastructureLevel: 4, armySize: 900 },
        "Бесарабия": { name: "Бесарабия", terrain: "Равнина", resource: "Жито", nativeClans: ["Бесараб"], difficulty: 14, defenseLevel: 2, infrastructureLevel: 2, armySize: 280 },
        "Сърбия": { name: "Сърбия", terrain: "Планинска", resource: "Сребро", nativeClans: ["Комитопули"], difficulty: 24, defenseLevel: 4, infrastructureLevel: 3, armySize: 480 },
        "Хърватия": { name: "Хърватия", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Тертер"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 3, armySize: 410 },
        "Влашко": { name: "Влашко", terrain: "Хълмиста", resource: "Желязо", nativeClans: ["Даки"], difficulty: 20, defenseLevel: 3, infrastructureLevel: 2, armySize: 350 },
        "Молдова": { name: "Молдова", terrain: "Хълмиста", resource: "Дървен материал", nativeClans: ["Бесараб"], difficulty: 16, defenseLevel: 2, infrastructureLevel: 2, armySize: 300 },
        "Крим": { name: "Крим", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Скити"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 3, armySize: 450 },
        "Битоля": { name: "Битоля", terrain: "Планинска", resource: "Мрамор", nativeClans: ["Македони"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Сяр": { name: "Сяр", terrain: "Равнина", resource: "Жито", nativeClans: ["Асеневци"], difficulty: 18, defenseLevel: 2, infrastructureLevel: 2, armySize: 320 },
        "Драч": { name: "Драч", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Тертер"], difficulty: 28, defenseLevel: 4, infrastructureLevel: 3, armySize: 520 },
        "Преспа": { name: "Преспа", terrain: "Планинска", resource: "Риба", nativeClans: ["Комитопули"], difficulty: 26, defenseLevel: 3, infrastructureLevel: 3, armySize: 440 },
        "Костур": { name: "Костур", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Шишмановци"], difficulty: 24, defenseLevel: 3, infrastructureLevel: 3, armySize: 400 },
        "Охрид": { name: "Охрид", terrain: "Планинска", resource: "Риба", nativeClans: ["Асеневци"], difficulty: 26, defenseLevel: 3, infrastructureLevel: 3, armySize: 430 },
        "Силистра": { name: "Силистра", terrain: "Равнина", resource: "Жито", nativeClans: ["Дуло"], difficulty: 12, defenseLevel: 2, infrastructureLevel: 2, armySize: 280 },
        "Никопол": { name: "Никопол", terrain: "Речен", resource: "Риба", nativeClans: ["Асеневци"], difficulty: 16, defenseLevel: 2, infrastructureLevel: 2, armySize: 310 },
        "Варна": { name: "Варна", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Дуло"], difficulty: 14, defenseLevel: 2, infrastructureLevel: 2, armySize: 290 },
        "Ловеч": { name: "Ловеч", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Асеневци"], difficulty: 15, defenseLevel: 2, infrastructureLevel: 2, armySize: 250 },
        "Троян": { name: "Троян", terrain: "Планинска", resource: "Желязо", nativeClans: ["Асеневци"], difficulty: 17, defenseLevel: 2, infrastructureLevel: 2, armySize: 260 },
        "Свищов": { name: "Свищов", terrain: "Речен", resource: "Риба", nativeClans: ["Дуло"], difficulty: 11, defenseLevel: 2, infrastructureLevel: 2, armySize: 240 },
        "Русе": { name: "Русе", terrain: "Речен", resource: "Жито", nativeClans: ["Дуло"], difficulty: 13, defenseLevel: 2, infrastructureLevel: 2, armySize: 270 },
        "Шумен": { name: "Шумен", terrain: "Хълмиста", resource: "Камък", nativeClans: ["Дуло"], difficulty: 14, defenseLevel: 2, infrastructureLevel: 2, armySize: 260 },
        "Разград": { name: "Разград", terrain: "Равнина", resource: "Жито", nativeClans: ["Тертер"], difficulty: 12, defenseLevel: 2, infrastructureLevel: 2, armySize: 240 },
        "Бургас": { name: "Бургас", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Дуло"], difficulty: 15, defenseLevel: 2, infrastructureLevel: 2, armySize: 280 },
        "Стара Загора": { name: "Стара Загора", terrain: "Равнина", resource: "Жито", nativeClans: ["Уния Траки"], difficulty: 16, defenseLevel: 2, infrastructureLevel: 2, armySize: 290 },
        "Хасково": { name: "Хасково", terrain: "Хълмиста", resource: "Желязо", nativeClans: ["Комитопули"], difficulty: 18, defenseLevel: 2, infrastructureLevel: 2, armySize: 300 },
        "Кърджали": { name: "Кърджали", terrain: "Планинска", resource: "Мрамор", nativeClans: ["Комитопули"], difficulty: 20, defenseLevel: 3, infrastructureLevel: 2, armySize: 320 }
    }
};

// ✅ КЛЮЧОВО: Инициализация на регионите на играча
window.playerRegions = window.playerRegions || ["Плиска"];
