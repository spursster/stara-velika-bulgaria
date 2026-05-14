/**
 * МОДУЛ: СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА
 * Дефинира регионите, съседните държави и фракциите около 480 г. пр.н.е.
 */

window.worldData = {
    // Основни държави (Фракции) - Използваме "Ромеи", а не "Византийци"
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
            relation: -20, // Враждебни
            power: 500
        },
        "persian_empire": {
            nameBG: "Персийска Империя",
            nameUS: "Persian Empire",
            relation: 0, // Неутрални
            power: 1000
        }
    },

    // Детайлни данни за провинциите - Синхронизирани със зестрите от diplomacy.js
    regions: {
        "Северна Тракия": {
            terrain: "Равнина",
            resource: "Злато",
            nativeClans: ["Одриси", "Беси"], // Използваме "родове/род"
            difficulty: 10
        },
        "Мизия": {
            terrain: "Гора",
            resource: "Дървесина",
            nativeClans: ["Гети", "Кробизи"],
            difficulty: 25
        },
        "Македония": {
            terrain: "Планина",
            resource: "Желязо",
            nativeClans: ["Едони", "Пеони"],
            difficulty: 40
        },
        "Добруджа": {
            terrain: "Степ",
            resource: "Коне",
            nativeClans: ["Скити"],
            difficulty: 30
        },
        "Панония": {
            terrain: "Равнина",
            resource: "Зърно",
            nativeClans: ["Вокил"],
            difficulty: 35
        },
        "Севтполис": {
            terrain: "Долина",
            resource: "Рози и Злато",
            nativeClans: ["Одриси"],
            difficulty: 15
        }
    },

    // ПЪЛЕН СПИСЪК С 13-ТЕ ВЕЛИКИ РОДА (Синхронизиран с diplomacy.js и mechanics.js)
    majorClans: [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ]
};

/**
 * Функция за проверка на информация за регион (Интегрирана със Съветника)
 */
window.getRegionReport = function(regionName) {
    const region = window.worldData.regions[regionName];
    if (!region) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Велики Кане, нашите съгледвачи нямат данни за тези земи.");
        return;
    }
    
    const clans = region.nativeClans.join(", ");
    const report = `Земята ${regionName} се владее от родове: ${clans}. Тук изобилства ресурсът: ${region.resource}. Трудност на похода: ${region.difficulty}.`;
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(report);
    } else {
        console.log(report);
    }
};

console.log("World_data.js: Геополитическата карта за 480 г. пр.н.е. е заредена.");
