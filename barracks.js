const unitTypes = {
    "ЛЕКА_ПЕХОТА": { name: "Леки пехотинци", cost: 100, power: 15, description: "Бързи и евтини за поддръжка." },
    "КОННИЦА": { name: "Елитна конница", cost: 300, power: 50, description: "Основната ударна мощ на античните българи." },
    "СТРЕЛЦИ": { name: "Стрелци с лък", cost: 150, power: 25, description: "Осигуряват поддръжка от разстояние." }
};

function recruitUnit(hero, unitKey) {
    const unit = unitTypes[unitKey];
    if (!unit) return "Невалидна единица.";

    if (window.gameGold >= unit.cost) {
        window.gameGold -= unit.cost;
        hero.armySize += unit.power * 2; // Всяка единица добавя хора към общия брой
        hero.updateRank(); // Проверка дали не вдигаме ранг (напр. към Легион)
        
        window.updateGoldDisplay();
        window.updateCharacterUI(hero);
        
        return `⚔️ Успешно наехте ${unit.name}! Твоята мощ нарасна.`;
    } else {
        return "🪙 Нямаш достатъчно злато за тази единица.";
    }
}

window.unitTypes = unitTypes;
window.recruitUnit = recruitUnit;
