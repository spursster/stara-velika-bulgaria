let nameRegistry = {};

function getDynamicName(baseName) {
    if (!nameRegistry[baseName]) {
        nameRegistry[baseName] = 1;
        return baseName; // Първият е без цифра или с I
    } else {
        nameRegistry[baseName]++;
        return `${baseName} ${convertToRoman(nameRegistry[baseName])}`;
    }
}

function convertToRoman(num) {
    const map = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let res = '';
    for (let i in map) {
        while (num >= map[i]) { res += i; num -= map[i]; }
    }
    return res;
}

window.performAncientRitual = function(hero) {
    // логика за ритуала тук
    return "Извършихте ритуал за благословията на древните богове!";
};

window.performAncientRitual = function(hero) {
    if (!hero || !hero.isAlive) return "Няма владетел.";
    
    const gods = [
        { name: "Тангра", effect: "Сила на конницата" },
        { name: "Бендида", effect: "Плодовитост и злато" },
        { name: "Залмоксис", effect: "Безсмъртие на духа" }
    ];
    
    // Избираме произволен бог
    const god = gods[Math.floor(Math.random() * gods.length)];
    
    // Проверка дали вече имаме тази благословия
    const alreadyBlessed = hero.divineUnits.some(u => u.name === god.name);
    
    if (!alreadyBlessed) {
        hero.divineUnits.push(god);
        return `Боговете чуха молитвите ви! Получихте благословията на ${god.name}.`;
    } else {
        return `${god.name} вече бди над вашия род.`;
    }
};
