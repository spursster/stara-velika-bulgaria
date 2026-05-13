window.currentHero = null;

class Character {
    constructor(name, dynasty, trait = "Балансиран") {
        this.name = name;
        this.dynasty = dynasty;
        this.trait = trait; // Нови черти: Войнолюбец, Търговец, Дипломат
        this.level = 1;
        this.age = 20;
        this.maxAge = 60 + Math.floor(Math.random() * 40);
        this.isAlive = true;
        this.armySize = 100;
        this.armyRank = "Отряд";
        this.inventory = { head: null, neck: null, body: null, mainHand: null, offHand: null, ring1: null, ring2: null, feet: null, relic: null };
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

function processInheritance(oldHero) {
    // Генерираме трима потенциални наследници с различни черти
    window.potentialSuccessors = [
        new Character(`${oldHero.name} II`, oldHero.dynasty, "Войнолюбец"),
        new Character(`${oldHero.name} Млади`, oldHero.dynasty, "Търговец"),
        new Character(`Кан ${oldHero.name}`, oldHero.dynasty, "Дипломат")
    ];
    
    // Прехвърляме предметите в семейната хазна (за момента ги държим в window)
    window.familyLegacy = { ...oldHero.inventory };
    
    // Показваме избора в интерфейса
    if (typeof window.showSuccessionMenu === 'function') {
        window.showSuccessionMenu();
    }
}

// Добави/Обнови това в logic.js
window.handleAging = function(hero) {
    if (!hero || !hero.isAlive) return;

    hero.age += 1; // Владетелят остарява с 1 година

    // Проверка за смърт при достигане на maxAge
    if (hero.age >= hero.maxAge) {
        hero.isAlive = false;
        const log = document.getElementById('event-log');
        if (log) {
            log.innerHTML = `<p style="color: #e74c3c; font-weight: bold;">💀 Владетелят ${hero.name} напусна този свят на ${hero.age} години.</p>` + log.innerHTML;
        }
        // Задействане на наследството
        if (typeof window.processInheritance === 'function') {
            window.processInheritance(hero);
        }
    }
};

window.Character = Character;
window.processInheritance = processInheritance;
