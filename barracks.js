/**
 * МОДУЛ: КАЗАРМИ - Велика България
 */

window.buyUnits = function() {
    const hero = window.currentHero;
    const cost = 100;
    const amount = 50;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        hero.armySize += amount;
        
        if (window.logEvent) {
            window.logEvent(`Обучени са ${amount} нови конници. (-${cost} 💰)`, "action");
        }
        window.updateCharacterUI(hero);
    } else {
        alert("Нямате достатъчно злато за обучение на нови воини!");
    }
};
