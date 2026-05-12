const worldCivs = {
    "Ромеи": { region: "Балкани/Анадола", techLevel: 5, relation: 50 },
    "Перси": { region: "Близък Изток", techLevel: 5, relation: 40 },
    "Маи": { region: "Централна Америка", techLevel: 3, relation: 0 },
    "Китайци": { region: "Далечен Изток", techLevel: 6, relation: 10 },
    "Франки": { region: "Западна Европа", techLevel: 3, relation: 30 }
};

const eventTemplates = [
    {
        id: "expedition_discovery",
        text: "Владетелю, твоят пратеник се завърна от далечна експедиция в {location}!",
        chance: 0.1,
        requirements: { armyRank: "Рота" }
    },
    {
        id: "royal_wedding",
        text: "Предложение за династичен брак от {civilization}. Това ще заздрави връзките ни.",
        chance: 0.2,
        requirements: { level: 5 }
    },
    {
        id: "espionage_report",
        text: "Нашите шпиони в {civilization} докладват за нови технологии!",
        chance: 0.15,
        requirements: { level: 3 }
    }
];

// Функция за генериране на логично случайно събитие
function triggerRandomEvent(hero) {
    const civNames = Object.keys(worldCivs);
    const randomCiv = civNames[Math.floor(Math.random() * civNames.length)];
    const randomEvent = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];

    // Логична проверка за изискванията
    if (hero.level >= (randomEvent.requirements.level || 0)) {
        let eventText = randomEvent.text
            .replace("{civilization}", randomCiv)
            .replace("{location}", "Мексико"); // Пример за експедиция

        return eventText;
    }
    return "Мирна година в империята.";
}

window.worldCivs = worldCivs;
window.triggerRandomEvent = triggerRandomEvent;
