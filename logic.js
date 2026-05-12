// Регистратор за имената, за да следим повторенията (Точка 2)
let nameRegistry = {};

// Функция за преобразуване в римски цифри
function convertToRoman(num) {
    const map = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let res = '';
    for (let i in map) {
        while (num >= map[i]) { res += i; num -= map[i]; }
    }
    return res;
}

// Клас за персонажите (Точка 4 & 5 - Heroes 3 стил)
class Character {
    constructor(baseName, dynasty) {
        // Логика за името с римски цифри
        if (!nameRegistry[baseName]) {
            nameRegistry[baseName] = 1;
            this.name = baseName;
        } else {
            nameRegistry[baseName]++;
            this.name = `${baseName} ${convertToRoman(nameRegistry[baseName])}`;
        }

        this.dynasty = dynasty;
        this.level = 1;
        this.isAlive = true;
        
        // Семейство
        this.spouse = null;
        this.children = [];

        // Инвентар с 9 слота (Heroes III концепция)
        this.inventory = {
            head: null,      // Шлем
            neck: null,      // Амулет
            body: null,      // Доспехи
            mainHand: null,  // Оръжие
            offHand: null,   // Щит
            ring1: null,
            ring2: null,
            feet: null,      // Ботуши
            relic: null      // Артефакт
        };

        // Бойни единици (Точка 6)
        this.armySize = 10; // Започва като малък отряд
        this.armyRank = "Отряд"; 
        this.divineUnits = []; // За божествени единици от ритуали
    }

    // Функция за вдигане на нива и прогресия на войската
    levelUp() {
        this.level++;
        this.armySize += Math.floor(this.level * 1.5);
        
        // Прогресия на името на отряда
        if (this.armySize > 1000) this.armyRank = "Легион";
        else if (this.armySize > 500) this.armyRank = "Полк";
        else if (this.armySize > 100) this.armyRank = "Рота";
    }

    // Функция за добавяне на дете
    addChild(childName) {
        const child = new Character(childName, this.dynasty);
        this.children.push(child);
        return child;
    }
}

// Експортиране или глобално дефиниране за браузъра
window.Character = Character;
