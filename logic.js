window.currentHero = null;
// Началният регион на Одриското царство (Антични българи)
window.playerRegions = [
    { name: "Северна Тракия", img: "https://placehold.co/200x150/222/d4af37?text=Thracia" }
];

// База данни с възможни провинции за завладяване
window.availableProvinces = [
    { name: "Мизия", img: "https://placehold.co/200x150/222/d4af37?text=Moesia" },
    { name: "Македония", img: "https://placehold.co/200x150/222/d4af37?text=Macedonia" },
    { name: "Хемус", img: "https://placehold.co/200x150/222/d4af37?text=Haemus" },
    { name: "Панония", img: "https://placehold.co/200x150/222/d4af37?text=Pannonia" },
    { name: "Сарматия", img: "https://placehold.co/200x150/222/d4af37?text=Sarmatia" }
];

class Character {
    constructor(name, dynasty, trait = "Балансиран") {
        this.name = name;
        this.dynasty = dynasty;
        this.trait = trait;
        this.level = 1;
        this.age = 20;
        this.maxAge = 60 + Math.floor(Math.random() * 40);
        this.isAlive = true;
        this.armySize = 100;
        this.armyRank = "Отряд";
        this.inventory = { head: null, neck: null, body: null, mainHand: null, offHand: null, ring1: null, ring2: null, feet: null, relic: null };
        
        // Инициализиране на масива за благословии от боговете
        this.divineUnits = []; 
        
        this.applyTraitBonuses();
    }

    applyTraitBonuses() {
        if (this.trait === "Войнолюбец") this.armySize += 200;
        if (this.trait === "Търговец") window.gameGold += 300;
    }

    levelUp() {
        this.level++;
        let bonus = (this.trait === "Войнолюбец") ? 200 : 150;
        this.armySize += bonus;
        this.updateRank();
    }

    updateRank() {
        if (this.level >= 20) this.armyRank = "Легион";
        else if (this.level >= 10) this.armyRank = "Полк";
        else if (this.level >= 5) this.armyRank = "Рота";
        else this.armyRank = "Отряд";
    }
}

window.handleAging = function(hero) {
    if (!hero || !hero.isAlive) return;
    hero.age += 1;
    if (hero.age >= hero.maxAge) {
        hero.isAlive = false;
        const log = document.getElementById('event-log');
        if (log) log.innerHTML = `<p style="color: #e74c3c;">💀 Владетелят ${hero.name} напусна този свят.</p>` + log.innerHTML;
        window.processInheritance(hero);
    }
};

window.processInheritance = function(oldHero) {
    window.potentialSuccessors = [
        new Character(`${oldHero.name} II`, oldHero.dynasty, "Войнолюбец"),
        new Character(`${oldHero.name} Млади`, oldHero.dynasty, "Търговец"),
        new Character(`Кан ${oldHero.name}`, oldHero.dynasty, "Дипломат")
    ];
    window.familyLegacy = { ...oldHero.inventory };
    if (typeof window.showSuccessionMenu === 'function') window.showSuccessionMenu();
};

window.Character = Character;
