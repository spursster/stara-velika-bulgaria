window.gameYear = -480; // Начало на Одриското царство
window.gameGold = 500;
window.playerRegions = [
    { name: "Северна Тракия", img: "https://r.jina.ai/i/65f1a2b3c4d5e6f7a8b9c0d1.png" }
];
window.availableProvinces = [
    { name: "Мизия", img: "https://r.jina.ai/i/76g2b3c4d5e6f7a8b9c0d1e2.png" },
    { name: "Хемус", img: "https://r.jina.ai/i/87h3c4d5e6f7a8b9c0d1e2f3.png" },
    { name: "Македония", img: "https://r.jina.ai/i/98i4d5e6f7a8b9c0d1e2f3g4.png" }
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
        this.divineUnits = []; 
        this.applyTraitBonuses();
    }

    applyTraitBonuses() {
        if (this.trait === "Войнолюбец") this.armySize += 200;
        if (this.trait === "Търговец") window.gameGold += 300;
    }

    levelUp() {
        this.level++;
        this.armySize += (this.trait === "Войнолюбец") ? 200 : 150;
        this.updateRank();
    }

    updateRank() {
        if (this.level >= 20) this.armyRank = "Легион";
        else if (this.level >= 10) this.armyRank = "Полк";
        else if (this.level >= 5) this.armyRank = "Рота";
        else this.armyRank = "Отряд";
    }
}

window.Character = Character;

window.gameLang = 'bg';
window.translations = {
    bg: { title: "EPIC BULGARIA", year: "г.", gold: "злато", army: "воини", recruit: "КАЗАРМА", infra: "УПРАВЛЕНИЕ", battle: "Битка", marriage: "Брак", ritual: "Ритуал", train: "Тренировка", yearPlus: "Година +1", inf: "Пехота", cav: "Конница", arc: "Стрелци" },
    en: { title: "EPIC BULGARIA", year: "AD", gold: "gold", army: "warriors", recruit: "BARRACKS", infra: "MANAGEMENT", battle: "Battle", marriage: "Marriage", ritual: "Ritual", train: "Train", yearPlus: "Year +1", inf: "Infantry", cav: "Cavalry", arc: "Archers" },
    ru: { title: "EPIC BULGARIA", year: "г.", gold: "золото", army: "воины", recruit: "КАЗАРМА", infra: "УПРАВЛЕНИЕ", battle: "Битва", marriage: "Брак", ritual: "Ритуал", train: "Тренировка", yearPlus: "Год +1", inf: "Пехота", cav: "Конница", arc: "Лучники" }
};

window.setLanguage = function(lang) {
    window.gameLang = lang;
    window.updateCharacterUI(window.currentHero);
};
