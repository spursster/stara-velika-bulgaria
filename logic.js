window.currentHero = null;

class Character {
    constructor(name, dynasty) {
        this.name = name;
        this.dynasty = dynasty;
        this.level = 1;
        this.age = 20;
        this.maxAge = 60 + Math.floor(Math.random() * 40);
        this.isAlive = true;
        this.armySize = 100;
        this.armyRank = "Отряд";
        this.inventory = {
            head: null, neck: null, body: null, mainHand: null,
            offHand: null, ring1: null, ring2: null, feet: null, relic: null
        };
        this.divineUnits = [];
    }

    levelUp() {
        this.level++;
        this.armySize += 150;
        this.updateRank();
    }

    updateRank() {
        if (this.level >= 20) this.armyRank = "Легион";
        else if (this.level >= 10) this.armyRank = "Полк";
        else if (this.level >= 5) this.armyRank = "Рота";
        else this.armyRank = "Отряд";
    }
}

function handleAging(hero) {
    if (!hero || !hero.isAlive) return;
    hero.age += 1;
    if (hero.age >= hero.maxAge) {
        hero.isAlive = false;
        const log = document.getElementById('event-log');
        if (log) {
            log.innerHTML = `<p style="color:red">💀 Владетелят ${hero.name} почина на ${hero.age} г.</p>` + log.innerHTML;
        }
        processInheritance(hero);
    }
}

function processInheritance(oldHero) {
    const successor = new Character(oldHero.name, oldHero.dynasty);
    successor.level = Math.max(1, Math.floor(oldHero.level / 2));
    successor.inventory = { ...oldHero.inventory };
    window.currentHero = successor;
    updateCharacterUI(successor);
}

function performAncientRitual(hero) {
    if (hero.level < 10) return "ℹ️ Нужен е опит (Ниво 10).";
    const deities = ["Тангра", "Бендида", "Залмоксис"];
    const name = deities[Math.floor(Math.random() * deities.length)];
    hero.divineUnits.push({ name: name, stats: { type: "Божество", power: 100 } });
    return `🔥 ${name} се присъедини към теб!`;
}

window.Character = Character;
window.handleAging = handleAging;
window.performAncientRitual = performAncientRitual;
