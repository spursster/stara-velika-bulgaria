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
