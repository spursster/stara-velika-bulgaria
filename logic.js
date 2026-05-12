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

// Дефиниция на Божествените единици (Точка 6)
const divineBeings = {
    "Тангра": { type: "Небесен дух", power: 100, isDivine: true },
    "Бендида": { type: "Велика богиня", power: 85, isDivine: true },
    "Залмоксис": { type: "Безсмъртен пророк", power: 90, isDivine: true },
    "Сабазий": { type: "Небесен конник", power: 80, isDivine: true }
};

// Функция за Ритуал на древните богове
function performAncientRitual(hero) {
    if (hero.level < 10) {
        return "ℹ️ Твоето ниво е твърде ниско за такъв мощен ритуал. Трябва ти ниво 10.";
    }

    const deityNames = Object.keys(divineBeings);
    const chosenDeityName = deityNames[Math.floor(Math.random() * deityNames.length)];
    const deityData = divineBeings[chosenDeityName];

    // Създаваме обекта на божеството
    const deityInstance = {
        name: chosenDeityName,
        level: 1,
        stats: deityData,
        experience: 0
    };

    hero.divineUnits.push(deityInstance);
    return `💡 РИТУАЛЪТ Е УСПЕШЕН! ${chosenDeityName} се присъедини към твоите легиони!`;
}

// Бойна логика за щети (Механика на неуязвимост)
function calculateDamage(attacker, defender) {
    // Ако защитникът е Божество, а атакуващият не е Легендарен или друго Божество
    if (defender.isDivine && !attacker.isLegendary && !attacker.isDivine) {
        console.log("🛡️ Атаката премина през божеството без да го нарани!");
        return 0; // Пълна неуязвимост
    }
    
    let baseDamage = attacker.armySize || attacker.power || 10;
    return baseDamage;
}

// Глобална променлива за текущия активен владетел
window.currentHero = null;

// Разширяваме класа Character с нови свойства за възраст
// (Провери дали в конструктора на Character в твоя logic.js имаш тези редове, ако не - добави ги)
/*
    this.age = 20; 
    this.maxAge = 60 + Math.floor(Math.random() * 40); // Всеки живее различно (60-100г.)
*/

function handleAging(hero) {
    if (!hero.isAlive) return;

    hero.age += 1; // Всяко натискане на "Следваща година" добавя възраст

    // Проверка за естествена смърт
    if (hero.age >= hero.maxAge) {
        hero.isAlive = false;
        const log = document.getElementById('event-log');
        if (log) {
            const p = document.createElement('p');
            p.innerHTML = `💀 <strong>Владетелят ${hero.name} почина на ${hero.age} години.</strong>`;
            log.prepend(p);
        }
        processInheritance(hero);
    }
}

function processInheritance(oldHero) {
    let newHeroName = oldHero.name.split(' ')[0]; // Взимаме само името без цифрата
    let dynasty = oldHero.dynasty;

    // Създаваме новия наследник (Точка 2 - Автоматично ще стане "Име II", "Име III" и т.н.)
    const successor = new Character(newHeroName, dynasty);
    
    // Наследникът получава част от опита и армията на баща си
    successor.level = Math.max(1, Math.floor(oldHero.level / 2));
    successor.armySize = Math.floor(oldHero.armySize * 0.8);
    
    // Прехвърляне на инвентара (Семейни реликви)
    successor.inventory = { ...oldHero.inventory };

    window.currentHero = successor;
    
    const log = document.getElementById('event-log');
    if (log) {
        const p = document.createElement('p');
        p.innerHTML = `👑 <strong>Да живее ${successor.name}! Новият владетел пое престола.</strong>`;
        log.prepend(p);
    }

    updateCharacterUI(successor);
}
