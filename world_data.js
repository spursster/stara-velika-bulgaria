/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ ФАЙЛ: world_data.js (СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА) 
СТАТУС: РАЗШИРЕН – 35+100 = 135 РЕГИОНА 
========================================================================== */ 

window.worldData = {
    // ======================== СВЕТОВНИ СИЛИ ========================
    factions: { 
        bulgarian_empire: { nameBG: "Велика България", rulerTitleBG: "Кан", capitalBG: "Фанагория" }, 
        rhomaioi_empire: { nameBG: "Ромейска Империя (Rhomaioi)", relation: -20, power: 500 }, 
        persian_empire: { nameBG: "Персийска Империя", relation: 0, power: 1000 },
        khazar_khanate: { nameBG: "Хазарски Каганат", relation: -10, power: 600 },
        frankish_empire: { nameBG: "Франкска Империя", relation: 5, power: 700 },
        abbasid_caliphate: { nameBG: "Абасидски Халифат", relation: -15, power: 900 }
    },
    
    // ======================== 13-ТЕ РОДОВИ КЛАНОВЕ (НЕПРОМЕНЕНИ) ========================
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
    
    // ======================== 135 РЕГИОНА (35 стари + 100 нови) ========================
    regions: {
        // --- СТАРИ РЕГИОНИ (35) ---
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
        
        // --- 100 НОВИ РЕГИОНА (разширяване на картата) ---
        // Балкани (още)
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
        "Смолян": { name: "Смолян", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Македони"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 2, armySize: 340 },
        "Благоевград": { name: "Благоевград", terrain: "Планинска", resource: "Желязо", nativeClans: ["Македони"], difficulty: 21, defenseLevel: 3, infrastructureLevel: 2, armySize: 330 },
        
        // Бивша Югославия
        "Белград": { name: "Белград", terrain: "Речен", resource: "Сребро", nativeClans: ["Комитопули"], difficulty: 28, defenseLevel: 4, infrastructureLevel: 3, armySize: 500 },
        "Нови Сад": { name: "Нови Сад", terrain: "Равнина", resource: "Жито", nativeClans: ["Тертер"], difficulty: 22, defenseLevel: 3, infrastructureLevel: 2, armySize: 380 },
        "Ниш": { name: "Ниш", terrain: "Хълмиста", resource: "Желязо", nativeClans: ["Комитопули"], difficulty: 24, defenseLevel: 3, infrastructureLevel: 3, armySize: 420 },
        "Сараево": { name: "Сараево", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Тертер"], difficulty: 26, defenseLevel: 3, infrastructureLevel: 2, armySize: 400 },
        "Скопие": { name: "Скопие", terrain: "Хълмиста", resource: "Жито", nativeClans: ["Македони"], difficulty: 27, defenseLevel: 3, infrastructureLevel: 3, armySize: 450 },
        "Прищина": { name: "Прищина", terrain: "Планинска", resource: "Сребро", nativeClans: ["Македони"], difficulty: 25, defenseLevel: 3, infrastructureLevel: 2, armySize: 390 },
        "Тирана": { name: "Тирана", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Тертер"], difficulty: 23, defenseLevel: 3, infrastructureLevel: 2, armySize: 360 },
        "Дубровник": { name: "Дубровник", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Комитопули"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 4, armySize: 550 },
        
        // Гърция и Егейски острови
        "Атина": { name: "Атина", terrain: "Крайбрежна", resource: "Шедьоври", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 35, defenseLevel: 5, infrastructureLevel: 5, armySize: 900 },
        "Спарта": { name: "Спарта", terrain: "Планинска", resource: "Желязо", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 },
        "Тесалоники": { name: "Тесалоники", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 33, defenseLevel: 4, infrastructureLevel: 4, armySize: 750 },
        "Крит": { name: "Крит", terrain: "Островна", resource: "Риба", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 38, defenseLevel: 5, infrastructureLevel: 4, armySize: 800 },
        "Родос": { name: "Родос", terrain: "Островна", resource: "Камък", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 36, defenseLevel: 5, infrastructureLevel: 4, armySize: 720 },
        "Кипър": { name: "Кипър", terrain: "Островна", resource: "Мед", nativeClans: ["Ромейска Империя (Rhomaioi)"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 5, armySize: 850 },
        
        // Централна Европа
        "Будапеща": { name: "Будапеща", terrain: "Речен", resource: "Жито", nativeClans: ["Даки"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Виена": { name: "Виена", terrain: "Речен", resource: "Сребро", nativeClans: ["Франкска Империя"], difficulty: 35, defenseLevel: 5, infrastructureLevel: 4, armySize: 800 },
        "Прага": { name: "Прага", terrain: "Хълмиста", resource: "Желязо", nativeClans: ["Франкска Империя"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 },
        "Краков": { name: "Краков", terrain: "Равнина", resource: "Сол", nativeClans: ["Даки"], difficulty: 28, defenseLevel: 3, infrastructureLevel: 3, armySize: 550 },
        "Варшава": { name: "Варшава", terrain: "Равнина", resource: "Жито", nativeClans: ["Скити"], difficulty: 26, defenseLevel: 3, infrastructureLevel: 3, armySize: 500 },
        "Берлин": { name: "Берлин", terrain: "Равнина", resource: "Кехлибар", nativeClans: ["Франкска Империя"], difficulty: 30, defenseLevel: 4, infrastructureLevel: 3, armySize: 620 },
        "Мюнхен": { name: "Мюнхен", terrain: "Хълмиста", resource: "Дървен материал", nativeClans: ["Франкска Империя"], difficulty: 29, defenseLevel: 4, infrastructureLevel: 3, armySize: 580 },
        
        // Италия
        "Рим": { name: "Рим", terrain: "Хълмиста", resource: "Шедьоври", nativeClans: ["Франкска Империя"], difficulty: 45, defenseLevel: 6, infrastructureLevel: 6, armySize: 1200 },
        "Равена": { name: "Равена", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Франкска Империя"], difficulty: 38, defenseLevel: 5, infrastructureLevel: 5, armySize: 900 },
        "Венеция": { name: "Венеция", terrain: "Крайбрежна", resource: "Стъкло", nativeClans: ["Франкска Империя"], difficulty: 42, defenseLevel: 6, infrastructureLevel: 6, armySize: 1000 },
        "Неапол": { name: "Неапол", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Франкска Империя"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 5, armySize: 950 },
        "Палермо": { name: "Палермо", terrain: "Островна", resource: "Подправки", nativeClans: ["Абасидски Халифат"], difficulty: 44, defenseLevel: 6, infrastructureLevel: 5, armySize: 1050 },
        
        // Източна Европа
        "Киев": { name: "Киев", terrain: "Речен", resource: "Кожа", nativeClans: ["Скити"], difficulty: 28, defenseLevel: 3, infrastructureLevel: 3, armySize: 550 },
        "Новгород": { name: "Новгород", terrain: "Равнина", resource: "Козина", nativeClans: ["Скити"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 3, armySize: 600 },
        "Москва": { name: "Москва", terrain: "Равнина", resource: "Дървен материал", nativeClans: ["Скити"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 650 },
        "Волжска България": { name: "Волжска България", terrain: "Речен", resource: "Кожа", nativeClans: ["Дуло"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 4, armySize: 700 },
        "Хазар": { name: "Хазар", terrain: "Степ", resource: "Коне", nativeClans: ["Хазарски Каганат"], difficulty: 38, defenseLevel: 5, infrastructureLevel: 4, armySize: 850 },
        "Саркел": { name: "Саркел", terrain: "Степ", resource: "Желязо", nativeClans: ["Хазарски Каганат"], difficulty: 36, defenseLevel: 5, infrastructureLevel: 4, armySize: 800 },
        
        // Кавказ
        "Тбилиси": { name: "Тбилиси", terrain: "Планинска", resource: "Вино", nativeClans: ["Османци Дуло"], difficulty: 34, defenseLevel: 4, infrastructureLevel: 3, armySize: 680 },
        "Ереван": { name: "Ереван", terrain: "Планинска", resource: "Камък", nativeClans: ["Персийска Империя"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 3, armySize: 720 },
        "Баку": { name: "Баку", terrain: "Крайбрежна", resource: "Нефт", nativeClans: ["Персийска Империя"], difficulty: 38, defenseLevel: 5, infrastructureLevel: 4, armySize: 780 },
        "Алания": { name: "Алания", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Османци Дуло"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 620 },
        
        // Близък изток
        "Багдад": { name: "Багдад", terrain: "Пустинна", resource: "Шедьоври", nativeClans: ["Абасидски Халифат"], difficulty: 55, defenseLevel: 7, infrastructureLevel: 7, armySize: 1600 },
        "Дамаск": { name: "Дамаск", terrain: "Пустинна", resource: "Стомана", nativeClans: ["Абасидски Халифат"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 6, armySize: 1400 },
        "Йерусалим": { name: "Йерусалим", terrain: "Хълмиста", resource: "Реликвии", nativeClans: ["Абасидски Халифат"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 5, armySize: 1300 },
        "Антиохия": { name: "Антиохия", terrain: "Крайбрежна", resource: "Коприна", nativeClans: ["Абасидски Халифат"], difficulty: 46, defenseLevel: 6, infrastructureLevel: 5, armySize: 1250 },
        "Мекка": { name: "Мекка", terrain: "Пустинна", resource: "Тамян", nativeClans: ["Абасидски Халифат"], difficulty: 52, defenseLevel: 7, infrastructureLevel: 6, armySize: 1500 },
        "Медина": { name: "Медина", terrain: "Пустинна", resource: "Фурми", nativeClans: ["Абасидски Халифат"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 6, armySize: 1450 },
        
        // Северна Африка
        "Александрия": { name: "Александрия", terrain: "Крайбрежна", resource: "Памук", nativeClans: ["Птоломеи"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 6, armySize: 1300 },
        "Кайро": { name: "Кайро", terrain: "Пустинна", resource: "Злато", nativeClans: ["Птоломеи"], difficulty: 52, defenseLevel: 6, infrastructureLevel: 6, armySize: 1450 },
        "Картаген": { name: "Картаген", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Птоломеи"], difficulty: 44, defenseLevel: 5, infrastructureLevel: 5, armySize: 1100 },
        "Триполи": { name: "Триполи", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Птоломеи"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 1000 },
        "Тимбукту": { name: "Тимбукту", terrain: "Пустинна", resource: "Сол", nativeClans: ["Абасидски Халифат"], difficulty: 55, defenseLevel: 6, infrastructureLevel: 4, armySize: 1200 },
        
        // Индийски океан
        "Ормуз": { name: "Ормуз", terrain: "Крайбрежна", resource: "Бисер", nativeClans: ["Персийска Империя"], difficulty: 50, defenseLevel: 6, infrastructureLevel: 5, armySize: 1100 },
        "Мускат": { name: "Мускат", terrain: "Крайбрежна", resource: "Тамян", nativeClans: ["Абасидски Халифат"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 5, armySize: 1050 },
        
        // Скандинавия
        "Хедебю": { name: "Хедебю", terrain: "Крайбрежна", resource: "Кехлибар", nativeClans: ["Скити"], difficulty: 35, defenseLevel: 4, infrastructureLevel: 3, armySize: 650 },
        "Упсала": { name: "Упсала", terrain: "Планинска", resource: "Желязо", nativeClans: ["Скити"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 },
        "Бирка": { name: "Бирка", terrain: "Островна", resource: "Кожа", nativeClans: ["Скити"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 3, armySize: 680 },
        
        // Британски острови
        "Лондон": { name: "Лондон", terrain: "Речен", resource: "Калай", nativeClans: ["Франкска Империя"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 850 },
        "Йорк": { name: "Йорк", terrain: "Хълмиста", resource: "Вълна", nativeClans: ["Франкска Империя"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 800 },
        "Единбург": { name: "Единбург", terrain: "Планинска", resource: "Камък", nativeClans: ["Франкска Империя"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 880 },
        "Дъблин": { name: "Дъблин", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Франкска Империя"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 3, armySize: 720 },
        
        // Иберийски полуостров
        "Кордоба": { name: "Кордоба", terrain: "Хълмиста", resource: "Коприна", nativeClans: ["Абасидски Халифат"], difficulty: 48, defenseLevel: 6, infrastructureLevel: 6, armySize: 1200 },
        "Толедо": { name: "Толедо", terrain: "Планинска", resource: "Стомана", nativeClans: ["Абасидски Халифат"], difficulty: 46, defenseLevel: 6, infrastructureLevel: 5, armySize: 1150 },
        "Барселона": { name: "Барселона", terrain: "Крайбрежна", resource: "Сол", nativeClans: ["Франкска Империя"], difficulty: 44, defenseLevel: 5, infrastructureLevel: 5, armySize: 1100 },
        "Лисабон": { name: "Лисабон", terrain: "Крайбрежна", resource: "Риба", nativeClans: ["Франкска Империя"], difficulty: 42, defenseLevel: 5, infrastructureLevel: 4, armySize: 1050 },
        
        // Завършек на новите региони
        "Астрахан": { name: "Астрахан", terrain: "Степ", resource: "Риба", nativeClans: ["Хазарски Каганат"], difficulty: 34, defenseLevel: 4, infrastructureLevel: 3, armySize: 650 },
        "Булгар": { name: "Булгар", terrain: "Степ", resource: "Кожа", nativeClans: ["Дуло"], difficulty: 32, defenseLevel: 4, infrastructureLevel: 3, armySize: 600 },
        "Сувар": { name: "Сувар", terrain: "Степ", resource: "Коне", nativeClans: ["Дуло"], difficulty: 30, defenseLevel: 3, infrastructureLevel: 3, armySize: 550 },
        "Башкортостан": { name: "Башкортостан", terrain: "Планинска", resource: "Мед", nativeClans: ["Скити"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 3, armySize: 680 },
        "Урал": { name: "Урал", terrain: "Планинска", resource: "Камък", nativeClans: ["Скити"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 3, armySize: 750 },
        "Печора": { name: "Печора", terrain: "Студена", resource: "Козина", nativeClans: ["Скити"], difficulty: 45, defenseLevel: 5, infrastructureLevel: 2, armySize: 800 },
        "Колхида": { name: "Колхида", terrain: "Крайбрежна", resource: "Злато", nativeClans: ["Османци Дуло"], difficulty: 38, defenseLevel: 4, infrastructureLevel: 4, armySize: 780 },
        "Иберия": { name: "Иберия", terrain: "Планинска", resource: "Сребро", nativeClans: ["Персийска Империя"], difficulty: 40, defenseLevel: 5, infrastructureLevel: 4, armySize: 820 },
        "Албания Кавказка": { name: "Албания Кавказка", terrain: "Планинска", resource: "Дървен материал", nativeClans: ["Османци Дуло"], difficulty: 36, defenseLevel: 4, infrastructureLevel: 3, armySize: 700 }
    }
};

// Инициализация на масива с регионите, които играчът притежава
window.playerRegions = ["Плиска"];
