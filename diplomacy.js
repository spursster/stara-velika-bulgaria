const diplomacyActions = {
    "ROYAL_WEDDING": { 
        label: { bg: "Династичен брак", en: "Dynastic Marriage", ru: "Династический брак" }, 
        minLevel: 5, 
        goldCost: 500 
    },
    "NON_AGGRESSION": { 
        label: { bg: "Пакт за ненападение", en: "Non-Aggression Pact", ru: "Пакт о ненападении" }, 
        minLevel: 3, 
        goldCost: 200 
    },
    "TRADE_AGREEMENT": { 
        label: { bg: "Търговско споразумение", en: "Trade Agreement", ru: "Торговое соглашение" }, 
        minLevel: 2, 
        goldCost: 100 
    }
};

function proposeMarriage(hero, targetCivName) {
    const lang = window.gameLang || 'bg';
    
    // Подсигуряване на световните сили (worldCivs), ако липсват
    if (!window.worldCivs) window.worldCivs = {};
    const civ = window.worldCivs[targetCivName];

    const errorMsg = { bg: "Непозната сила.", en: "Unknown power.", ru: "Неизвестная сила." };
    if (!civ) return errorMsg[lang];

    // Шанс за успех, базиран на ниво и ранг на армията
    let successChance = (hero.level * 5) + (civ.relation / 2);
    if (hero.armyRank === "Легион") successChance += 20;

    let roll = Math.random() * 100;
    const eventLog = document.getElementById('event-log');
    let message = "";

    if (roll < successChance) {
        civ.relation += 30; // Подобряваме отношенията
        const successText = {
            bg: `💍 УСПЕХ! ${hero.name} сключи брак с представител на ${targetCivName}. Отношенията на нашия род се подобриха!`,
            en: `💍 SUCCESS! ${hero.name} entered into a marriage with a representative from ${targetCivName}. Our clan's relations have improved!`,
            ru: `💍 УСПЕХ! ${hero.name} заключил брак с представителем ${targetCivName}. Отношения нашего рода улучшились!`
        };
        message = successText[lang];
        
        // Бонус: Династичен подарък
        if (typeof window.dropRandomLoot === 'function') window.dropRandomLoot(hero);
    } else {
        civ.relation -= 10;
        const failText = {
            bg: `💔 ОТКАЗ! Владетелят на ${targetCivName} не смята нашия род за достатъчно престижен.`,
            en: `💔 REFUSAL! The ruler of ${targetCivName} does not consider our clan prestigious enough.`,
            ru: `💔 ОТКАЗ! Правитель ${targetCivName} не считает наш род достаточно престижным.`
        };
        message = failText[lang];
    }

    if (eventLog) {
        const p = document.createElement('p');
        const dipLabel = { bg: "Дипломация", en: "Diplomacy", ru: "Дипломация" };
        p.innerHTML = `<strong style="color: #3498db;">[${dipLabel[lang]}]</strong> ${message}`;
        eventLog.prepend(p);
    }
    
    window.updateCharacterUI(hero);
    return message;
}

window.diplomacyActions = diplomacyActions;
window.proposeMarriage = proposeMarriage;
