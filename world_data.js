/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: world_data.js (ХАРМОНИЗИРАНА ВЕРСИЯ + 20 НОВИ ИМПЕРИИ)
ВЕРСИЯ: 6.0 – РАЗШИРЕНА ВСЕЛЕНА
========================================================================== */ 

window.worldData = {
    // ==================== ОРИГИНАЛНИ ФРАКЦИИ ====================
    factions: { 
        bulgarian_empire: { nameBG: "Велика България", rulerTitleBG: "Кан", capitalBG: "Фанагория" }, 
        rhomaioi_empire: { nameBG: "Ромейска Империя (Rhomaioi)", relation: -20, power: 500 }, 
        persian_empire: { nameBG: "Персийска Империя", relation: 0, power: 1000 },
        khazar_khanate: { nameBG: "Хазарски Каганат", relation: -10, power: 600 },
        frankish_empire: { nameBG: "Франкска Империя", relation: 5, power: 700 },
        abbasid_caliphate: { nameBG: "Абасидски Халифат", relation: -15, power: 900 },
        
        // ==================== 20 НОВИ ИМПЕРИИ (ИСТОРИЧЕСКИ И ФЕНТЪЗИ) ====================
        // ---- ИСТОРИЧЕСКИ ----
        mongol_empire: { nameBG: "Монголска империя", rulerTitleBG: "Велик хан", capitalBG: "Каракорум", relation: -30, power: 1200 },
        ottoman_empire: { nameBG: "Османска империя", rulerTitleBG: "Султан", capitalBG: "Истанбул", relation: -25, power: 1100 },
        venetian_republic: { nameBG: "Венецианска република", rulerTitleBG: "Дож", capitalBG: "Венеция", relation: 10, power: 600 },
        kievan_rus: { nameBG: "Киевска Рус", rulerTitleBG: "Княз", capitalBG: "Киев", relation: 5, power: 700 },
        ayyubid_sultanate: { nameBG: "Аюбидски султанат", rulerTitleBG: "Султан", capitalBG: "Каиро", relation: -10, power: 850 },
        holy_roman_empire: { nameBG: "Свещена Римска империя", rulerTitleBG: "Император", capitalBG: "Аахен", relation: 0, power: 950 },
        british_kingdom: { nameBG: "Британско кралство", rulerTitleBG: "Крал", capitalBG: "Лондон", relation: 15, power: 800 },
        viking_kingdoms: { nameBG: "Викингски кралства", rulerTitleBG: "Конунг", capitalBG: "Осло", relation: -5, power: 650 },
        maurya_empire: { nameBG: "Империя Маурия", rulerTitleBG: "Чакравартин", capitalBG: "Паталипутра", relation: 10, power: 1100 },
        han_dynasty: { nameBG: "Династия Хан", rulerTitleBG: "Император", capitalBG: "Чанъан", relation: 20, power: 1300 },
        
        // ---- ФЕНТЪЗИ ФРАКЦИИ ----
        elven_kingdom: { nameBG: "Елфийско кралство", rulerTitleBG: "Крал на светлите елфи", capitalBG: "Сребърна гора", relation: 30, power: 750 },
        dwarf_holds: { nameBG: "Джуджешки подземия", rulerTitleBG: "Върховен крал", capitalBG: "Каменна зала", relation: 25, power: 850 },
        orc_horde: { nameBG: "Оркска орда", rulerTitleBG: "Вожд", capitalBG: "Мрачна крепост", relation: -60, power: 950 },
        undead_legion: { nameBG: "Легион на мъртвите", rulerTitleBG: "Лич-крал", capitalBG: "Некрополис", relation: -80, power: 1100 },
        dragon_lords: { nameBG: "Драконови лордове", rulerTitleBG: "Дракон-император", capitalBG: "Пламтящ връх", relation: -40, power: 1400 },
        celestial_empire: { nameBG: "Небесна империя", rulerTitleBG: "Небесен император", capitalBG: "Златен град", relation: 50, power: 1000 },
        shadow_realm: { nameBG: "Царство на сенките", rulerTitleBG: "Сянка-крал", capitalBG: "Тъмна бездна", relation: -50, power: 800 },
        atlantean_dominion: { nameBG: "Атлантидско владение", rulerTitleBG: "Върховен жрец", capitalBG: "Посейдонис", relation: 20, power: 1200 },
        demon_legions: { nameBG: "Демонични легиони", rulerTitleBG: "Властелин на бездната", capitalBG: "Абадон", relation: -90, power: 1600 },
        fairy_court: { nameBG: "Двор на феите", rulerTitleBG: "Кралица на феите", capitalBG: "Светеща поляна", relation: 40, power: 550 }
    },
        // ==================== КЛАНОВЕ (ГЕРОИ) – ХАРМОНИЗИРАНИ ====================
    clans: { 
        "Дуло": { name: "Болгарос", leaderName: "Болгарос", isJoined: false, regionsOwned: 1, gold: 1500, armySize: 500, clan: "Дуло" }, 
        "Комитопули": { name: "Никола", leaderName: "Никола", isJoined: false, regionsOwned: 1, gold: 800, armySize: 300, clan: "Комитопули" }, 
        "Асеневци": { name: "Асен I", leaderName: "Асен I", isJoined: false, regionsOwned: 1, gold: 850, armySize: 320, clan: "Асеневци" }, 
        "Тертер": { name: "Георги I Тертер", leaderName: "Георги I Тертер", isJoined: false, regionsOwned: 1, gold: 700, armySize: 250, clan: "Тертер" }, 
        "Даки": { name: "Залмоксис", leaderName: "Залмоксис", isJoined: false, regionsOwned: 1, gold: 650, armySize: 280, clan: "Даки" }, 
        "Уния Траки": { name: "Реметалк", leaderName: "Реметалк", isJoined: false, regionsOwned: 1, gold: 900, armySize: 310, clan: "Уния Траки" }, 
        "Шишмановци": { name: "Михаил Шишман", leaderName: "Михаил Шишман", isJoined: false, regionsOwned: 1, gold: 750, armySize: 260, clan: "Шишмановци" }, 
        "Македони": { name: "Александър", leaderName: "Александър", isJoined: false, regionsOwned: 1, gold: 1200, armySize: 450, clan: "Македони" }, 
        "Птоломеи": { name: "Сотер", leaderName: "Сотер", isJoined: false, regionsOwned: 1, gold: 1100, armySize: 350, clan: "Птоломеи" }, 
        "Одриси": { name: "Терес", leaderName: "Терес", isJoined: false, regionsOwned: 1, gold: 800, armySize: 330, clan: "Одриси" }, 
        "Бесараб": { name: "Иванко Бесараб", leaderName: "Иванко Бесараб", isJoined: false, regionsOwned: 1, gold: 700, armySize: 240, clan: "Бесараб" }, 
        "Османци Дуло": { name: "Осман Гази", leaderName: "Осман Гази", isJoined: false, regionsOwned: 1, gold: 700, armySize: 240, clan: "Османци Дуло" }, 
        "Скити": { name: "Атей", leaderName: "Атей", isJoined: false, regionsOwned: 1, gold: 600, armySize: 350, clan: "Скити" },
        // Нови кланове за фентъзи света
        "Норсмени": { name: "Рагнар", leaderName: "Рагнар", isJoined: false, regionsOwned: 1, gold: 900, armySize: 500, clan: "Норсмени" },
        "Елфи": { name: "Елронд", leaderName: "Елронд", isJoined: false, regionsOwned: 1, gold: 2000, armySize: 400, clan: "Елфи" },
        "Джуджета": { name: "Торин", leaderName: "Торин", isJoined: false, regionsOwned: 1, gold: 2500, armySize: 600, clan: "Джуджета" },
        "Орки": { name: "Готмог", leaderName: "Готмог", isJoined: false, regionsOwned: 1, gold: 500, armySize: 1500, clan: "Орки" },
        "Атланти": { name: "Посейдон", leaderName: "Посейдон", isJoined: false, regionsOwned: 1, gold: 3000, armySize: 800, clan: "Атланти" }
    },
        // ==================== РЕГИОНИ (235+ БРОЯ) ====================
    regions: {
        // ---- ОРИГИНАЛНИ 45 РЕГИОНА ----
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
        "Кърджали": { name: "Кърджали", terrain: "Планинска", resource: "Мрамор", nativeClans: ["Комитопули"], difficulty: 20, defenseLevel: 3, infrastructureLevel: 2, armySize: 320 },
     // ==================== НОВИ 190 РЕГИОНА (общо 235) ====================
        // ---- БАЛКАНИТЕ (още 20) ----
        "Белград": { name: "Белград", terrain: "Речен", resource: "Желязо", nativeClans: ["Комитопули"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Скопие": { name: "Скопие", terrain: "Планинска", resource: "Сребро", nativeClans: ["Комитопули"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 3, armySize: 450 },
        "Ниш": { name: "Ниш", terrain: "Равнина", resource: "Жито", nativeClans: ["Тертер"], difficulty: 20, defenseLevel: 3, infrastructureLevel: 2, armySize: 400 },
        "Прищина": { name: "Прищина", terrain: "Хълмиста", resource: "Злато", nativeClans: ["Шишмановци"], difficulty: 25, defenseLevel: 3, infrastructureLevel: 2, armySize: 420 },
        "Тирана": { name: "Тирана", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Тертер"], difficulty: 18, defenseLevel: 2, infrastructureLevel: 2, armySize: 350 },
        "Загреб": { name: "Загреб", terrain: "Хълмиста", resource: "Дървен материал", nativeClans: ["Норсмени"], difficulty: 24, defenseLevel: 3, infrastructureLevel: 3, armySize: 450 },
        "Любляна": { name: "Любляна", terrain: "Планинска", resource: "Сребро", nativeClans: ["Норсмени"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 2, armySize: 380 },
        "Сараево": { name: "Сараево", terrain: "Планинска", resource: "Желязо", nativeClans: ["Шишмановци"], difficulty: 26, defenseLevel: 3, infrastructureLevel: 2, armySize: 400 },
        "Подгорица": { name: "Подгорица", terrain: "Равнина", resource: "Жито", nativeClans: ["Тертер"], difficulty: 18, defenseLevel: 2, infrastructureLevel: 2, armySize: 320 },
        "Банат": { name: "Банат", terrain: "Равнина", resource: "Жито", nativeClans: ["Даки"], difficulty: 16, defenseLevel: 2, infrastructureLevel: 2, armySize: 350 },
        "Трансилвания": { name: "Трансилвания", terrain: "Планинска", resource: "Злато", nativeClans: ["Даки"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Букурещ": { name: "Букурещ", terrain: "Равнина", resource: "Жито", nativeClans: ["Бесараб"], difficulty: 15, defenseLevel: 2, infrastructureLevel: 2, armySize: 300 },
        "Яш": { name: "Яш", terrain: "Хълмиста", resource: "Дървен материал", nativeClans: ["Бесараб"], difficulty: 14, defenseLevel: 2, infrastructureLevel: 2, armySize: 280 },
        "Клуж": { name: "Клуж", terrain: "Хълмиста", resource: "Сол", nativeClans: ["Даки"], difficulty: 20, defenseLevel: 2, infrastructureLevel: 2, armySize: 350 },
        "Тимишоара": { name: "Тимишоара", terrain: "Равнина", resource: "Жито", nativeClans: ["Даки"], difficulty: 17, defenseLevel: 2, infrastructureLevel: 2, armySize: 320 },
        "Крайова": { name: "Крайова", terrain: "Равнина", resource: "Желязо", nativeClans: ["Даки"], difficulty: 16, defenseLevel: 2, infrastructureLevel: 2, armySize: 300 },
        "Брашов": { name: "Брашов", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Даки"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 2, armySize: 380 },
        "Сибиу": { name: "Сибиу", terrain: "Планинска", resource: "Сребро", nativeClans: ["Даки"], difficulty: 21, defenseLevel: 3, infrastructureLevel: 2, armySize: 360 },
        "Галац": { name: "Галац", terrain: "Речен", resource: "Риба", nativeClans: ["Бесараб"], difficulty: 13, defenseLevel: 2, infrastructureLevel: 2, armySize: 270 },
        "Браила": { name: "Браила", terrain: "Речен", resource: "Жито", nativeClans: ["Бесараб"], difficulty: 12, defenseLevel: 2, infrastructureLevel: 2, armySize: 260 },

        // ---- ИТАЛИЯ И ЗАПАДНА ЕВРОПА (15) ----
        "Венеция": { name: "Венеция", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Франкска Империя"], difficulty: 55, defenseLevel: 7, infrastructureLevel: 7, armySize: 1500 },
        "Рим": { name: "Рим", terrain: "Хълмиста", resource: "Шедьоври", nativeClans: ["Франкска Империя"], difficulty: 60, defenseLevel: 8, infrastructureLevel: 7, armySize: 1800 },
        "Флоренция": { name: "Флоренция", terrain: "Хълмиста", resource: "Шедьоври", nativeClans: ["Франкска Империя"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 6, armySize: 1000 },
        "Милано": { name: "Милано", terrain: "Равнина", resource: "Желязо", nativeClans: ["Франкска Империя"], difficulty: 48, defenseLevel: 5, infrastructureLevel: 5, armySize: 1100 },
        "Неапол": { name: "Неапол", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Франкска Империя"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 900 },
        "Палермо": { name: "Палермо", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Франкска Империя"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 800 },
        "Париж": { name: "Париж", terrain: "Речен", resource: "Шедьоври", nativeClans: ["Франкска Империя"], difficulty: 65, defenseLevel: 8, infrastructureLevel: 8, armySize: 2000 },
        "Марсилия": { name: "Марсилия", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Франкска Империя"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 5, armySize: 850 },
        "Лион": { name: "Лион", terrain: "Речен", resource: "Жито", nativeClans: ["Франкска Империя"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 750 },
        "Бордо": { name: "Бордо", terrain: "Крайбрежна", resource: "Вино", nativeClans: ["Франкска Империя"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 4, armySize: 700 },
        "Лондон": { name: "Лондон", terrain: "Речен", resource: "Калай", nativeClans: ["Норсмени"], difficulty: 60, defenseLevel: 7, infrastructureLevel: 7, armySize: 1700 },
        "Кентърбъри": { name: "Кентърбъри", terrain: "Хълмиста", resource: "Вълна", nativeClans: ["Норсмени"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Единбург": { name: "Единбург", terrain: "Планинска", resource: "Камък", nativeClans: ["Норсмени"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 750 },
        "Дъблин": { name: "Дъблин", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Норсмени"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 550 },
        "Брюксел": { name: "Брюксел", terrain: "Равнина", resource: "Жито", nativeClans: ["Франкска Империя"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 4, armySize: 600 },

        // ---- ГЕРМАНИЯ И СЕВЕРНА ЕВРОПА (15) ----
        "Аахен": { name: "Аахен", terrain: "Хълмиста", resource: "Желязо", nativeClans: ["Франкска Империя"], difficulty: 35, defenseLevel: 5, infrastructureLevel: 5, armySize: 800 },
        "Кьолн": { name: "Кьолн", terrain: "Речен", resource: "Вино", nativeClans: ["Франкска Империя"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 4, armySize: 700 },
        "Мюнхен": { name: "Мюнхен", terrain: "Хълмиста", resource: "Дървен материал", nativeClans: ["Норсмени"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 3, armySize: 650 },
        "Берлин": { name: "Берлин", terrain: "Равнина", resource: "Жито", nativeClans: ["Норсмени"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 4, armySize: 700 },
        "Хамбург": { name: "Хамбург", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Норсмени"], difficulty: 32, defenseLevel: 3, infrastructureLevel: 4, armySize: 650 },
        "Бремен": { name: "Бремен", terrain: "Речен", resource: "Сол", nativeClans: ["Норсмени"], difficulty: 28, defenseLevel: 3, infrastructureLevel: 3, armySize: 550 },
        "Франкфурт": { name: "Франкфурт", terrain: "Речен", resource: "Злато", nativeClans: ["Франкска Империя"], difficulty: 34, defenseLevel: 4, infrastructureLevel: 4, armySize: 720 },
        "Виена": { name: "Виена", terrain: "Речен", resource: "Сребро", nativeClans: ["Норсмени"], difficulty: 45, defenseLevel: 6, infrastructureLevel: 5, armySize: 1000 },
        "Прага": { name: "Прага", terrain: "Хълмиста", resource: "Камък", nativeClans: ["Норсмени"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 5, armySize: 850 },
        "Краков": { name: "Краков", terrain: "Равнина", resource: "Сол", nativeClans: ["Скити"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 4, armySize: 700 },
        "Варшава": { name: "Варшава", terrain: "Равнина", resource: "Жито", nativeClans: ["Скити"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 4, armySize: 680 },
        "Гданск": { name: "Гданск", terrain: "Крайбрежна", resource: "Кехлибар", nativeClans: ["Скити"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 3, armySize: 600 },
        "Копенхаген": { name: "Копенхаген", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Норсмени"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 800 },
        "Осло": { name: "Осло", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Норсмени"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 },
        "Стокхолм": { name: "Стокхолм", terrain: "Крайбрежна", resource: "Желязо", nativeClans: ["Норсмени"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 4, armySize: 750 },

        // ---- РУСИЯ, СТЕПИ, КАВКАЗ (20) ----
        "Киев": { name: "Киев", terrain: "Речен", resource: "Жито", nativeClans: ["Скити"], difficulty: 45, defenseLevel: 6, infrastructureLevel: 5, armySize: 1200 },
        "Новгород": { name: "Новгород", terrain: "Равнина", resource: "Кожа", nativeClans: ["Скити"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 1000 },
        "Москва": { name: "Москва", terrain: "Равнина", resource: "Дървен материал", nativeClans: ["Скити"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 5, armySize: 1400 },
        "Владимир": { name: "Владимир", terrain: "Равнина", resource: "Жито", nativeClans: ["Скити"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 900 },
        "Суздал": { name: "Суздал", terrain: "Равнина", resource: "Мед", nativeClans: ["Скити"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 800 },
        "Рязан": { name: "Рязан", terrain: "Равнина", resource: "Кожа", nativeClans: ["Скити"], difficulty: 32, defenseLevel: 3, infrastructureLevel: 3, armySize: 750 },
        "Твер": { name: "Твер", terrain: "Равнина", resource: "Дървен материал", nativeClans: ["Скити"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 3, armySize: 700 },
        "Смоленск": { name: "Смоленск", terrain: "Хълмиста", resource: "Камък", nativeClans: ["Скити"], difficulty: 33, defenseLevel: 3, infrastructureLevel: 3, armySize: 720 },
        "Полоцк": { name: "Полоцк", terrain: "Речен", resource: "Жито", nativeClans: ["Скити"], difficulty: 28, defenseLevel: 3, infrastructureLevel: 3, armySize: 650 },
        "Минск": { name: "Минск", terrain: "Равнина", resource: "Дървен материал", nativeClans: ["Скити"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 3, armySize: 680 },
        "Витебск": { name: "Витебск", terrain: "Речен", resource: "Риба", nativeClans: ["Скити"], difficulty: 26, defenseLevel: 2, infrastructureLevel: 2, armySize: 550 },
        "Чернигов": { name: "Чернигов", terrain: "Равнина", resource: "Жито", nativeClans: ["Скити"], difficulty: 29, defenseLevel: 3, infrastructureLevel: 3, armySize: 620 },
        "Переяслав": { name: "Переяслав", terrain: "Равнина", resource: "Мед", nativeClans: ["Скити"], difficulty: 27, defenseLevel: 2, infrastructureLevel: 2, armySize: 580 },
        "Астрахан": { name: "Астрахан", terrain: "Степ", resource: "Риба", nativeClans: ["Хазарски Каганат"], difficulty: 25, defenseLevel: 2, infrastructureLevel: 2, armySize: 500 },
        "Сарай": { name: "Сарай", terrain: "Степ", resource: "Коне", nativeClans: ["Хазарски Каганат"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 2, armySize: 600 },
        "Казан": { name: "Казан", terrain: "Речен", resource: "Кожа", nativeClans: ["Хазарски Каганат"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 800 },
        "Булгар": { name: "Булгар", terrain: "Речен", resource: "Жито", nativeClans: ["Дуло"], difficulty: 28, defenseLevel: 3, infrastructureLevel: 3, armySize: 700 },
        "Дербент": { name: "Дербент", terrain: "Крайбрежна", resource: "Камък", nativeClans: ["Османци Дуло"], difficulty: 32, defenseLevel: 5, infrastructureLevel: 3, armySize: 700 },
        "Тбилиси": { name: "Тбилиси", terrain: "Планинска", resource: "Вино", nativeClans: ["Османци Дуло"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 900 },
        "Баку": { name: "Баку", terrain: "Крайбрежна", resource: "Нефт", nativeClans: ["Персийска Империя"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 850 },

        // ---- БЛИЗЪК ИЗТОК, АРАБИЯ, ПЕРСИЯ (25) ----
        "Анкара": { name: "Анкара", terrain: "Равнина", resource: "Коне", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 },
        "Кония": { name: "Кония", terrain: "Равнина", resource: "Жито", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 3, armySize: 650 },
        "Трапезунд": { name: "Трапезунд", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 38, defenseLevel: 5, infrastructureLevel: 4, armySize: 900 },
        "Никея": { name: "Никея", terrain: "Хълмиста", resource: "Жито", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 4, armySize: 850 },
        "Смирна": { name: "Смирна", terrain: "Крайбрежна", resource: "Смокини", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 33, defenseLevel: 4, infrastructureLevel: 4, armySize: 800 },
        "Антиохия": { name: "Антиохия", terrain: "Речен", resource: "Шедьоври", nativeClans: ["Абасидски Халифат"], difficulty: 45, defenseLevel: 6, infrastructureLevel: 5, armySize: 1100 },
        "Дамаск": { name: "Дамаск", terrain: "Пустинна", resource: "Подправки", nativeClans: ["Абасидски Халифат"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 5, armySize: 1000 },
        "Багдад": { name: "Багдад", terrain: "Речен", resource: "Килими", nativeClans: ["Абасидски Халифат"], difficulty: 50, defenseLevel: 7, infrastructureLevel: 6, armySize: 1300 },
        "Йерусалим": { name: "Йерусалим", terrain: "Планинска", resource: "Злато", nativeClans: ["Абасидски Халифат"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 5, armySize: 1200 },
        "Каиро": { name: "Каиро", terrain: "Пустинна", resource: "Папирус", nativeClans: ["Птоломеи"], difficulty: 52, defenseLevel: 6, infrastructureLevel: 6, armySize: 1500 },
        "Александрия": { name: "Александрия", terrain: "Крайбрежна", resource: "Стъкло", nativeClans: ["Птоломеи"], difficulty: 48, defenseLevel: 5, infrastructureLevel: 6, armySize: 1300 },
        "Мемфис": { name: "Мемфис", terrain: "Пустинна", resource: "Камък", nativeClans: ["Птоломеи"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 1100 },
        "Тива": { name: "Тива", terrain: "Пустинна", resource: "Злато", nativeClans: ["Птоломеи"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 4, armySize: 1200 },
        "Мекка": { name: "Мекка", terrain: "Пустинна", resource: "Подправки", nativeClans: ["Абасидски Халифат"], difficulty: 55, defenseLevel: 7, infrastructureLevel: 6, armySize: 1400 },
        "Медина": { name: "Медина", terrain: "Пустинна", resource: "Финикове", nativeClans: ["Абасидски Халифат"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 5, armySize: 1100 },
        "Сана": { name: "Сана", terrain: "Планинска", resource: "Кимион", nativeClans: ["Османци Дуло"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 900 },
        "Маскат": { name: "Маскат", terrain: "Крайбрежна", resource: "Килими", nativeClans: ["Османци Дуло"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 800 },
        "Техеран": { name: "Техеран", terrain: "Планинска", resource: "Килими", nativeClans: ["Персийска Империя"], difficulty: 45, defenseLevel: 6, infrastructureLevel: 5, armySize: 1200 },
        "Исфахан": { name: "Исфахан", terrain: "Равнина", resource: "Подправки", nativeClans: ["Персийска Империя"], difficulty: 44, defenseLevel: 5, infrastructureLevel: 5, armySize: 1100 },
        "Шираз": { name: "Шираз", terrain: "Планинска", resource: "Вино", nativeClans: ["Персийска Империя"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 1000 },
        "Табриз": { name: "Табриз", terrain: "Планинска", resource: "Килими", nativeClans: ["Персийска Империя"], difficulty: 40, defenseLevel: 4, infrastructureLevel: 4, armySize: 950 },
        "Нишапур": { name: "Нишапур", terrain: "Пустинна", resource: "Тюркоаз", nativeClans: ["Персийска Империя"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 3, armySize: 850 },
        "Мерв": { name: "Мерв", terrain: "Пустинна", resource: "Памук", nativeClans: ["Персийска Империя"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 3, armySize: 800 },
        "Самарканд": { name: "Самарканд", terrain: "Пустинна", resource: "Шедьоври", nativeClans: ["Персийска Империя"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 5, armySize: 1300 },
        "Бухара": { name: "Бухара", terrain: "Пустинна", resource: "Килими", nativeClans: ["Персийска Империя"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 5, armySize: 1100 },

        // ---- ИНДИЯ, ДАЛЕЧЕН ИЗТОК (15) ----
        "Делхи": { name: "Делхи", terrain: "Равнина", resource: "Подправки", nativeClans: ["Персийска Империя"], difficulty: 60, defenseLevel: 7, infrastructureLevel: 6, armySize: 2000 },
        "Бомбай": { name: "Бомбай", terrain: "Крайбрежна", resource: "Памук", nativeClans: ["Персийска Империя"], difficulty: 55, defenseLevel: 6, infrastructureLevel: 6, armySize: 1800 },
        "Калкута": { name: "Калкута", terrain: "Речен", resource: "Риба", nativeClans: ["Персийска Империя"], difficulty: 52, defenseLevel: 6, infrastructureLevel: 5, armySize: 1700 },
        "Мадрас": { name: "Мадрас", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Персийска Империя"], difficulty: 50, defenseLevel: 5, infrastructureLevel: 5, armySize: 1600 },
        "Пешавар": { name: "Пешавар", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Скити"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 4, armySize: 1200 },
        "Кашмир": { name: "Кашмир", terrain: "Планинска", resource: "Шафран", nativeClans: ["Скити"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 4, armySize: 1100 },
        "Ланка": { name: "Ланка", terrain: "Крайбрежна", resource: "Бисер", nativeClans: ["Птоломеи"], difficulty: 50, defenseLevel: 5, infrastructureLevel: 5, armySize: 1400 },
        "Пекин": { name: "Пекин", terrain: "Равнина", resource: "Коприна", nativeClans: ["Скити"], difficulty: 70, defenseLevel: 9, infrastructureLevel: 8, armySize: 3000 },
        "Нанкин": { name: "Нанкин", terrain: "Речен", resource: "Ориз", nativeClans: ["Скити"], difficulty: 65, defenseLevel: 8, infrastructureLevel: 7, armySize: 2500 },
        "Сиан": { name: "Сиан", terrain: "Равнина", resource: "Камък", nativeClans: ["Скити"], difficulty: 60, defenseLevel: 7, infrastructureLevel: 6, armySize: 2200 },
        "Хангжу": { name: "Хангжу", terrain: "Крайбрежна", resource: "Коприна", nativeClans: ["Скити"], difficulty: 58, defenseLevel: 6, infrastructureLevel: 6, armySize: 2000 },
        "Киото": { name: "Киото", terrain: "Планинска", resource: "Ориз", nativeClans: ["Скити"], difficulty: 55, defenseLevel: 7, infrastructureLevel: 7, armySize: 1800 },
        "Токио": { name: "Токио", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Скити"], difficulty: 60, defenseLevel: 8, infrastructureLevel: 7, armySize: 2000 },
        "Корея": { name: "Корея", terrain: "Планинска", resource: "Женшен", nativeClans: ["Скити"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 5, armySize: 1500 },
        "Виетнам": { name: "Виетнам", terrain: "Крайбрежна", resource: "Ориз", nativeClans: ["Скити"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 4, armySize: 1300 },

        // ---- АФРИКА (20) ----
        "Картаген": { name: "Картаген", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Птоломеи"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 5, armySize: 1300 },
        "Тунис": { name: "Тунис", terrain: "Крайбрежна", resource: "Зехтин", nativeClans: ["Абасидски Халифат"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 1000 },
        "Триполи": { name: "Триполи", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Абасидски Халифат"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 3, armySize: 900 },
        "Киренайка": { name: "Киренайка", terrain: "Крайбрежна", resource: "Жито", nativeClans: ["Птоломеи"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 850 },
        "Фес": { name: "Фес", terrain: "Планинска", resource: "Кожа", nativeClans: ["Абасидски Халифат"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 1100 },
        "Маракеш": { name: "Маракеш", terrain: "Равнина", resource: "Подправки", nativeClans: ["Абасидски Халифат"], difficulty: 44, defenseLevel: 5, infrastructureLevel: 4, armySize: 1200 },
        "Тимбукту": { name: "Тимбукту", terrain: "Пустинна", resource: "Злато", nativeClans: ["Османци Дуло"], difficulty: 55, defenseLevel: 5, infrastructureLevel: 3, armySize: 1500 },
        "Гана": { name: "Гана", terrain: "Равнина", resource: "Злато", nativeClans: ["Османци Дуло"], difficulty: 50, defenseLevel: 5, infrastructureLevel: 3, armySize: 1300 },
        "Сонгай": { name: "Сонгай", terrain: "Речен", resource: "Риба", nativeClans: ["Османци Дуло"], difficulty: 48, defenseLevel: 4, infrastructureLevel: 3, armySize: 1200 },
        "Мали": { name: "Мали", terrain: "Савана", resource: "Злато", nativeClans: ["Османци Дуло"], difficulty: 52, defenseLevel: 5, infrastructureLevel: 3, armySize: 1400 },
        "Абисиния": { name: "Абисиния", terrain: "Планинска", resource: "Кимион", nativeClans: ["Птоломеи"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 4, armySize: 1200 },
        "Мерое": { name: "Мерое", terrain: "Пустинна", resource: "Желязо", nativeClans: ["Птоломеи"], difficulty: 42, defenseLevel: 4, infrastructureLevel: 3, armySize: 1000 },
        "Асуан": { name: "Асуан", terrain: "Пустинна", resource: "Гранит", nativeClans: ["Птоломеи"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 3, armySize: 900 },
        "Нубия": { name: "Нубия", terrain: "Пустинна", resource: "Злато", nativeClans: ["Птоломеи"], difficulty: 40, defenseLevel: 4, infrastructureLevel: 2, armySize: 1000 },
        "Зимбабве": { name: "Зимбабве", terrain: "Планинска", resource: "Злато", nativeClans: ["Османци Дуло"], difficulty: 55, defenseLevel: 5, infrastructureLevel: 2, armySize: 1500 },
        "Килиманджаро": { name: "Килиманджаро", terrain: "Планинска", resource: "Кристали", nativeClans: ["Османци Дуло"], difficulty: 60, defenseLevel: 6, infrastructureLevel: 2, armySize: 1600 },
        "Занзибар": { name: "Занзибар", terrain: "Крайбрежна", resource: "Подправки", nativeClans: ["Османци Дуло"], difficulty: 45, defenseLevel: 4, infrastructureLevel: 3, armySize: 1200 },
        "Мадагаскар": { name: "Мадагаскар", terrain: "Крайбрежна", resource: "Ванилия", nativeClans: ["Османци Дуло"], difficulty: 48, defenseLevel: 4, infrastructureLevel: 2, armySize: 1300 },
        "Конго": { name: "Конго", terrain: "Джунгла", resource: "Слонова кост", nativeClans: ["Османци Дуло"], difficulty: 50, defenseLevel: 5, infrastructureLevel: 1, armySize: 1500 },
        "Сахара": { name: "Сахара", terrain: "Пустинна", resource: "Сол", nativeClans: ["Османци Дуло"], difficulty: 35, defenseLevel: 2, infrastructureLevel: 1, armySize: 800 },

        // ---- ФЕНТЪЗИ МИТИЧНИ ЗЕМИ (30) ----
        "Авалон": { name: "Авалон", terrain: "Магическа", resource: "Елфийски кристал", nativeClans: ["Елфи"], difficulty: 60, defenseLevel: 8, infrastructureLevel: 7, armySize: 1000 },
        "Атлантида": { name: "Атлантида", terrain: "Подводна", resource: "Орихалк", nativeClans: ["Атланти"], difficulty: 70, defenseLevel: 9, infrastructureLevel: 8, armySize: 1500 },
        "Му": { name: "Му", terrain: "Магическа", resource: "Мана камъни", nativeClans: ["Елфи"], difficulty: 65, defenseLevel: 8, infrastructureLevel: 7, armySize: 1200 },
        "Лемурия": { name: "Лемурия", terrain: "Джунгла", resource: "Бисер", nativeClans: ["Атланти"], difficulty: 55, defenseLevel: 6, infrastructureLevel: 5, armySize: 1100 },
        "Хиперборея": { name: "Хиперборея", terrain: "Ледена", resource: "Ледени кристали", nativeClans: ["Норсмени"], difficulty: 65, defenseLevel: 7, infrastructureLevel: 5, armySize: 1300 },
        "Елдърлейн": { name: "Елдърлейн", terrain: "Гора", resource: "Дървесна смола", nativeClans: ["Елфи"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 6, armySize: 900 },
        "Мория": { name: "Мория", terrain: "Подземие", resource: "Митрил", nativeClans: ["Джуджета"], difficulty: 65, defenseLevel: 8, infrastructureLevel: 6, armySize: 1800 },
        "Еребор": { name: "Еребор", terrain: "Планинска", resource: "Аркен камък", nativeClans: ["Джуджета"], difficulty: 60, defenseLevel: 7, infrastructureLevel: 5, armySize: 1600 },
        "Мордор": { name: "Мордор", terrain: "Вулканична", resource: "Обсидиан", nativeClans: ["Орки"], difficulty: 75, defenseLevel: 9, infrastructureLevel: 4, armySize: 3000 },
        "Изенгард": { name: "Изенгард", terrain: "Равнина", resource: "Желязо", nativeClans: ["Орки"], difficulty: 55, defenseLevel: 7, infrastructureLevel: 6, armySize: 1500 },
        "Рохан": { name: "Рохан", terrain: "Степ", resource: "Коне", nativeClans: ["Скити"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 4, armySize: 1200 },
        "Гондор": { name: "Гондор", terrain: "Хълмиста", resource: "Камък", nativeClans: ["Македони"], difficulty: 50, defenseLevel: 7, infrastructureLevel: 6, armySize: 1400 },
        "Ривендъл": { name: "Ривендъл", terrain: "Гора", resource: "Лунен камък", nativeClans: ["Елфи"], difficulty: 55, defenseLevel: 6, infrastructureLevel: 7, armySize: 800 },
        "Лотлориен": { name: "Лотлориен", terrain: "Гора", resource: "Златна зеленика", nativeClans: ["Елфи"], difficulty: 58, defenseLevel: 7, infrastructureLevel: 7, armySize: 900 },
        "Мирквуд": { name: "Мирквуд", terrain: "Тъмна гора", resource: "Тъмна дървесина", nativeClans: ["Елфи"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 4, armySize: 1000 },
        "Дейл": { name: "Дейл", terrain: "Равнина", resource: "Крила на дракон", nativeClans: ["Джуджета"], difficulty: 42, defenseLevel: 4, infrastructureLevel: 5, armySize: 700 },
        "Есгарот": { name: "Есгарот", terrain: "Езерна", resource: "Риба", nativeClans: ["Норсмени"], difficulty: 35, defenseLevel: 3, infrastructureLevel: 4, armySize: 600 },
        "Валинор": { name: "Валинор", terrain: "Благословена", resource: "Бели дървета", nativeClans: ["Елфи"], difficulty: 80, defenseLevel: 10, infrastructureLevel: 9, armySize: 2000 },
        "Нибелунгайм": { name: "Нибелунгайм", terrain: "Подземие", resource: "Руни", nativeClans: ["Джуджета"], difficulty: 70, defenseLevel: 8, infrastructureLevel: 5, armySize: 1500 },
        "Мидгард": { name: "Мидгард", terrain: "Равнина", resource: "Ябълки на Идун", nativeClans: ["Норсмени"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 5, armySize: 1000 },
        "Асгард": { name: "Асгард", terrain: "Небесна", resource: "Злато", nativeClans: ["Норсмени"], difficulty: 85, defenseLevel: 10, infrastructureLevel: 9, armySize: 2500 },
        "Ванахейм": { name: "Ванахейм", terrain: "Гора", resource: "Магически плодове", nativeClans: ["Елфи"], difficulty: 65, defenseLevel: 7, infrastructureLevel: 7, armySize: 1200 },
        "Йотунхейм": { name: "Йотунхейм", terrain: "Ледена", resource: "Ледени великани", nativeClans: ["Орки"], difficulty: 70, defenseLevel: 8, infrastructureLevel: 3, armySize: 2000 },
        "Алфхайм": { name: "Алфхайм", terrain: "Светла гора", resource: "Светъл кристал", nativeClans: ["Елфи"], difficulty: 60, defenseLevel: 7, infrastructureLevel: 7, armySize: 1000 },
        "Сварталхайм": { name: "Сварталхайм", terrain: "Подземие", resource: "Тъмен метал", nativeClans: ["Джуджета"], difficulty: 65, defenseLevel: 8, infrastructureLevel: 5, armySize: 1400 },
        "Настронт": { name: "Настронт", terrain: "Вулканична", resource: "Сяра", nativeClans: ["Орки"], difficulty: 75, defenseLevel: 9, infrastructureLevel: 2, armySize: 2200 },
        "Олимп": { name: "Олимп", terrain: "Планинска", resource: "Амброзия", nativeClans: ["Македони"], difficulty: 80, defenseLevel: 9, infrastructureLevel: 8, armySize: 1800 },
        "Тартар": { name: "Тартар", terrain: "Подземна", resource: "Титанови кости", nativeClans: ["Орки"], difficulty: 90, defenseLevel: 10, infrastructureLevel: 1, armySize: 3000 },
        "Елизиум": { name: "Елизиум", terrain: "Благословена", resource: "Златна пшеница", nativeClans: ["Македони"], difficulty: 65, defenseLevel: 7, infrastructureLevel: 8, armySize: 1000 },
        "Хесперид": { name: "Хесперид", terrain: "Островна", resource: "Златни ябълки", nativeClans: ["Птоломеи"], difficulty: 60, defenseLevel: 6, infrastructureLevel: 6, armySize: 900 },

        // ---- ОСТРОВИ И ДАЛЕЧНИ ЗЕМИ (10) ----
        "Гренландия": { name: "Гренландия", terrain: "Ледена", resource: "Моржова кост", nativeClans: ["Норсмени"], difficulty: 50, defenseLevel: 3, infrastructureLevel: 1, armySize: 500 },
        "Исландия": { name: "Исландия", terrain: "Вулканична", resource: "Сяра", nativeClans: ["Норсмени"], difficulty: 42, defenseLevel: 4, infrastructureLevel: 2, armySize: 600 },
        "Ирландия": { name: "Ирландия", terrain: "Хълмиста", resource: "Блато", nativeClans: ["Норсмени"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 },
        "Сицилия": { name: "Сицилия", terrain: "Планинска", resource: "Сяра", nativeClans: ["Франкска Империя"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 800 },
        "Крит": { name: "Крит", terrain: "Крайбрежна", resource: "Зехтин", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Кипър": { name: "Кипър", terrain: "Крайбрежна", resource: "Мед", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 650 },
        "Малта": { name: "Малта", terrain: "Крайбрежна", resource: "Камък", nativeClans: ["Франкска Империя"], difficulty: 28, defenseLevel: 5, infrastructureLevel: 3, armySize: 500 },
        "Балеари": { name: "Балеари", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Франкска Империя"], difficulty: 25, defenseLevel: 3, infrastructureLevel: 2, armySize: 450 },
        "Канарски": { name: "Канарски", terrain: "Вулканична", resource: "Банан", nativeClans: ["Османци Дуло"], difficulty: 30, defenseLevel: 2, infrastructureLevel: 2, armySize: 500 },
        "Мадейра": { name: "Мадейра", terrain: "Планинска", resource: "Вино", nativeClans: ["Османци Дуло"], difficulty: 32, defenseLevel: 2, infrastructureLevel: 2, armySize: 480 }
    }
};
// ==================== ПРОЦЕДУРНО ГЕНЕРИРАНИ РЕГИОНИ ====================
window.generateProceduralRegions = function(count, preserveExisting = true) {
    if (!window.worldData.regions) window.worldData.regions = {};
    const prefixes = ["Нова", "Дива", "Забравена", "Прокълната", "Златна", "Сребърна", "Огнена", "Ледена", "Сенчеста", "Безкрайна", "Свещена", "Тъмна", "Светла", "Дива", "Кристална"];
    const suffixes = ["земя", "долина", "пустош", "гора", "планина", "пустиня", "блато", "остров", "пещера", "равнина", "степ", "хълм"];
    const resources = ["Жито", "Дървен материал", "Желязо", "Злато", "Сребро", "Камък", "Риба", "Сол", "Коне", "Билки", "Кожа", "Вълна", "Кехлибар", "Вино", "Зехтин", "Мед", "Ориз", "Коприна"];
    const terrains = ["Равнина", "Хълмиста", "Планинска", "Крайбрежна", "Речен", "Пустинна", "Гора", "Блато", "Степ", "Вулканична", "Магическа"];
    let generated = 0;
    for (let i = 0; i < count; i++) {
        let uniqueName = "";
        do {
            let name = prefixes[Math.floor(Math.random() * prefixes.length)] + " " + suffixes[Math.floor(Math.random() * suffixes.length)];
            if (Math.random() > 0.7) name = suffixes[Math.floor(Math.random() * suffixes.length)] + " на " + prefixes[Math.floor(Math.random() * prefixes.length)];
            uniqueName = name;
            if (uniqueName.length < 3) uniqueName = "Нова земя";
        } while (preserveExisting && window.worldData.regions[uniqueName]);
        let resource = resources[Math.floor(Math.random() * resources.length)];
        let terrain = terrains[Math.floor(Math.random() * terrains.length)];
        let armySize = 50 + Math.floor(Math.random() * 400);
        let defenseLevel = 1 + Math.floor(Math.random() * 6);
        let infrastructureLevel = 1 + Math.floor(Math.random() * 4);
        let difficulty = 10 + Math.floor(Math.random() * 80);
        let region = {
            name: uniqueName,
            terrain: terrain,
            resource: resource,
            nativeClans: ["Независим"],
            armySize: armySize,
            defenseLevel: defenseLevel,
            infrastructureLevel: infrastructureLevel,
            difficulty: difficulty
        };
        window.worldData.regions[uniqueName] = region;
        generated++;
    }
    console.log(`✅ Генерирани ${generated} процедурни региона. Общо региони: ${Object.keys(window.worldData.regions).length}`);
    return generated;
};

// Инициализация на регионите на играча
window.playerRegions = window.playerRegions || ["Плиска"];

// ==================== ФЕНТЪЗИ РАСИ ЗА БРАК ====================
window.fantasyRaces = [
    { id: "elf", name: "Висша елфийка", icon: "🧝♀️", bonus: { heroPower: 15, mysticismBonus: 0.1 }, desc: "Елфийската мъдрост увеличава магическата сила" },
    { id: "dwarf", name: "Джудже", icon: "🪓", bonus: { defense: 15, armyBonus: 0.1 }, desc: "Джуджешката издръжливост укрепва армията" },
    { id: "vampire", name: "Вампирка", icon: "🧛‍♀️", bonus: { heroPower: 20, lifeSteal: 0.1 }, desc: "Вампирският вампиризъм лекува при атака" },
    { id: "werewolf", name: "Върколак", icon: "🐺", bonus: { heroPower: 18, armyBonus: 0.15 }, desc: "Върколашката свирепост усилва войските" },
    { id: "driad", name: "Дриада", icon: "🌿", bonus: { goldBonus: 25, mysticismBonus: 0.1 }, desc: "Дриадите носят плодородие и богатство" },
    { id: "phoenix", name: "Феникс", icon: "🔥", bonus: { heroPower: 25, reviveChance: 0.1 }, desc: "Фениксът може да възкресява паднали войници" },
    { id: "dragonborn", name: "Драконианка", icon: "🐉", bonus: { heroPower: 30, defense: 10 }, desc: "Драконската кръв дава невероятна сила" },
    { id: "nymph", name: "Нимфа", icon: "💧", bonus: { goldBonus: 30, diplomacyBonus: 0.15 }, desc: "Нимфите привличат богатство и съюзници" },
    { id: "siren", name: "Сирена", icon: "🎵", bonus: { diplomacyBonus: 0.2, mysticismBonus: 0.1 }, desc: "Сиренският глас омайва враговете" },
    { id: "gorgon", name: "Горгона", icon: "🐍", bonus: { heroPower: 22, defense: 15 }, desc: "Горгонският поглед вкаменява враговете" },
    { id: "harpy", name: "Харпия", icon: "🦅", bonus: { armyBonus: 0.15, mobility: 0.1 }, desc: "Харпиите увеличават скоростта на армията" },
    { id: "centaur", name: "Кентавърка", icon: "🏹", bonus: { heroPower: 18, armyBonus: 0.12 }, desc: "Кентаврите са майстори стрелци" },
    { id: "fairy", name: "Фея", icon: "✨", bonus: { mysticismBonus: 0.2, goldBonus: 15 }, desc: "Феите носят магия и късмет" },
    { id: "succubus", name: "Сукуб", icon: "😈", bonus: { heroPower: 25, diplomacyBonus: -0.05 }, desc: "Сукубите очарователни, но коварни" },
    { id: "valkyrie", name: "Валкирия", icon: "⚔️", bonus: { heroPower: 28, armyBonus: 0.1 }, desc: "Валкириите водят падналите герои в битка" },
    { id: "mermaid", name: "Русалка", icon: "🧜‍♀️", bonus: { goldBonus: 20, defense: 10 }, desc: "Русалките пазят морските съкровища" },
    { id: "demon", name: "Демоница", icon: "👿", bonus: { heroPower: 35, diplomacyBonus: -0.1 }, desc: "Демоничната сила идва с цена" },
    { id: "angel", name: "Ангел", icon: "😇", bonus: { heroPower: 30, mysticismBonus: 0.15, armyBonus: 0.1 }, desc: "Ангелското присъствие вдъхновява войските" },
    { id: "ghost", name: "Дух", icon: "👻", bonus: { mysticismBonus: 0.25, defense: 10 }, desc: "Духовете са неуязвими на физически атаки" },
    { id: "golem", name: "Голем", icon: "🗿", bonus: { defense: 30, heroPower: 10 }, desc: "Големите са живи бронирани машини" }
];

