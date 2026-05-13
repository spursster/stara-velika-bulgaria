const worldCivs = {
    "Ромеи": { region: "Румелия/Анадола", techLevel: 5, relation: 50 },
    "Перси": { region: "Близък Изток", techLevel: 5, relation: 40 },
    "Франки": { region: "Западна Европа", techLevel: 3, relation: 30 },
    "Хазари": { region: "Понтийска степ", techLevel: 4, relation: 20 }
};

const eventTemplates = [
    {
        id: "expedition_discovery",
        text: {
            bg: "Владетелю, твоят пратеник се завърна от далечна експедиция в {location}!",
            en: "Ruler, your envoy has returned from a long expedition in {location}!",
            ru: "Властелин, ваш посланник вернулся из далекой экспедиции в {location}!"
        },
        chance: 0.1,
        requirements: { armyRank: "Рота" }
    },
    {
        id: "royal_wedding",
        text: {
            bg: "Предложение за династичен брак от {civilization}. Това ще заздрави връзките ни.",
            en: "A proposal for a dynastic marriage from {civilization}. This will strengthen our ties.",
            ru: "Предложение о династическом браке от {civilization}. Это укрепит наши связи."
        },
        chance: 0.2,
        requirements: { level: 5 }
    },
    {
        id: "espionage_report",
        text: {
            bg: "Нашите шпиони в {civilization} докладват за нови технологии!",
            en: "Our spies in {civilization} report on new technologies!",
            ru: "Наши шпионы в {civilization} докладывают о новых технологиях!"
        },
        chance: 0.15,
        requirements: { level: 3 }
    }
];

function triggerWorldEvent(hero) {
    const lang = window.gameLang || 'bg';
    const civNames = Object.keys(worldCivs);
    const randomCiv = civNames[Math.floor(Math.random() * civNames.length)];
    const randomEvent = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];

    if (hero.level >= (randomEvent.requirements.level || 0)) {
        let eventText = randomEvent.text[lang]
            .replace("{civilization}", randomCiv)
            .replace("{location}", lang === 'bg' ? "Кавказ" : "Caucasus"); 

        return eventText;
    }
    
    const peaceMsg = { 
        bg: "Мирна година в държавата.", 
        en: "A peaceful year in the state.", 
        ru: "Мирный год в государстве." 
    };
    return peaceMsg[lang];
}

window.worldCivs = worldCivs;
window.triggerWorldEvent = triggerWorldEvent;
