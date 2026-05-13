/**
 * МОДУЛ: КАЗАРМА И ВОЕННИ ЕДИНИЦИ
 * Управлява типовете войски и техните сезонни бонуси.
 */

window.unitTypes = {
    "пехота": {
        nameBG: "Тежка Пехота",
        nameUS: "Heavy Infantry",
        cost: 10,
        power: 15,
        seasonBonus: "Зима", // По-ефективни при отбрана в сняг
        icon: "🛡️"
    },
    "конница": {
        nameBG: "Стрелкова Конница",
        nameUS: "Horse Archers",
        cost: 20,
        power: 25,
        seasonBonus: "Лято", // Бонус за мобилност в сухи условия
        icon: "🏹"
    },
    "гвардия": {
        nameBG: "Владетелска Гвардия",
        nameUS: "Royal Guard",
        cost: 50,
        power: 60,
        seasonBonus: "Пролет", // Бонус при начало на кампаниите
        icon: "👑"
    }
};

window.buyUnits = function() {
    const lang = window.gameLang;
    const hero = window.currentHero;
    
    // Генериране на меню за избор
    let menuText = lang === "BG" ? "Изберете тип войска за наемане:\n" : "Select unit type to recruit:\n";
    const keys = Object.keys(window.unitTypes);
    
    keys.forEach((key, index) => {
        const unit = window.unitTypes[key];
        const name = lang === "BG" ? unit.nameBG : unit.nameUS;
        menuText += `${index + 1}. ${unit.icon} ${name} (Цена: ${unit.cost} 💰, Мощ: ${unit.power})\n`;
    });

    let choice = prompt(menuText);
    let selectedKey = keys[parseInt(choice) - 1];

    if (selectedKey) {
        const unit = window.unitTypes[selectedKey];
        let amount = prompt(lang === "BG" ? `Колко единици ${unit.nameBG} ще наемете?` : `How many ${unit.nameUS} units?`);
        amount = parseInt(amount);

        if (amount > 0 && hero.gold >= (unit.cost * amount)) {
            hero.gold -= unit.cost * amount;
            
            // Добавяне към общата мощ и численост
            hero.armySize += amount;
            hero.heroPower += (unit.power * amount);

            const successMsg = lang === "BG" 
                ? `Наети са ${amount} единици ${unit.nameBG}. Общата бойна мощ нарасна!` 
                : `Recruited ${amount} units of ${unit.nameUS}. Total power increased!`;
            
            window.logEvent(successMsg, "success");
            window.updateCharacterUI(hero);
        } else {
            const failMsg = lang === "BG" ? "Недостатъчно злато или невалидно количество!" : "Not enough gold or invalid amount!";
            window.logEvent(failMsg, "info");
        }
    }
};

/**
 * Изчислява сезонния модификатор за битка.
 * Вика се автоматично от battle.js преди сблъсък.
 */
window.getSeasonModifier = function() {
    const currentSeason = window.gameTime.seasons[window.gameTime.seasonIndex].nameUS;
    let modifier = 1.0;

    // Логика: Конницата на Тертер е по-силна през Лятото
    if (window.currentHero.dynasty === "Тертер" && currentSeason === "Summer") {
        modifier += 0.2; // +20% бонус
    }
    
    // Общ сезонен бонус за климат
    if (currentSeason === "Winter") {
        modifier -= 0.1; // Зимата винаги е по-трудно за походи
    }

    return modifier;
};

console.log("Модул Barracks.js е зареден с поддръжка на сезони и типове войски.");
