window.performAncientRitual = function(hero) {
    if (!hero || !hero.isAlive) return "Няма жив владетел.";
    if (!hero.divineUnits) hero.divineUnits = [];

    // Благословии от античната българска митология
    const gods = [
        { name: "Тангра", effect: "Небесна сила" },
        { name: "Бендида", effect: "Великата майка" },
        { name: "Залмоксис", effect: "Безсмъртие" }
    ];
    
    const god = gods[Math.floor(Math.random() * gods.length)];
    const alreadyBlessed = hero.divineUnits.find(g => g.name === god.name);
    
    if (!alreadyBlessed) {
        hero.divineUnits.push(god);
        // Обновяваме веднага, за да се види на екрана
        if (typeof window.updateCharacterUI === 'function') {
            window.updateCharacterUI(hero);
        }
        return `Боговете се отзоваха! ${god.name} дари рода ${hero.dynasty} със своята благословия.`;
    } else {
        return `${god.name} вече бди над теб, владетелю.`;
    }
};
