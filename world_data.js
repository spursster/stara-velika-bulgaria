/**
 * МОДУЛ: СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА
 * Дефинира регионите, съседните държави и фракциите около 480 г. пр.н.е.
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

    // Детайлни данни за провинциите
    regions: {
        "Северна Тракия": {
            terrain: "Равнина",
            resource: "Злато",
            nativeClans: ["Одриси", "Беси"], // Използваме "родове/род" вместо племена
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
        }
    },

    // Конкурентни антични български родове (за дипломация и бракове)
    majorClans: [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", 
        "Чака", "Тертер", "Шишман", "Смилец", "Асен", 
        "Батоя", "Тихомир", "Македони"
    ]
};

/**
 * Функция за проверка на съседни фракции при битка
 */
window.getNeighborInfo = function(regionName) {
    const region = window.worldData.regions[regionName];
    if (!region) return "Неизвестна земя";
    
    const lang = window.gameLang;
    const clans = region.nativeClans.join(", ");
    
    return lang === "BG" 
        ? `Регионът се владее от родове: ${clans}. Ресурс: ${region.resource}.` 
        : `Region ruled by clans: ${clans}. Resource: ${region.resource}.`;
};

console.log("World_data.js: Геополитическата карта за 480 г. пр.н.е. е заредена.");
