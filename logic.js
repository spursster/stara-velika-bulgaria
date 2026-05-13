window.gameYear = -480; 
window.gameGold = 500;
window.gameLang = 'bg';

// Списък на провинциите с техните карти
window.playerRegions = [
    { name: { bg: "Северна Тракия", en: "Northern Thrace", ru: "Северная Фракия" }, img: "https://r.jina.ai/i/65f1a2b3c4d5e6f7a8b9c0d1.png" }
];

window.availableProvinces = [
    { name: { bg: "Мизия", en: "Moesia", ru: "Мезия" }, img: "https://r.jina.ai/i/76g2b3c4d5e6f7a8b9c0d1e2.png" },
    { name: { bg: "Хемус", en: "Haemus", ru: "Хемус" }, img: "https://r.jina.ai/i/87h3c4d5e6f7a8b9c0d1e2f3.png" },
    { name: { bg: "Македония", en: "Macedonia", ru: "Македония" }, img: "https://r.jina.ai/i/98i4d5e6f7a8b9c0d1e2f3g4.png" }
];

// Пълна преводаческа база - СИНХРОНИЗИРАНА
window.translations = {
    bg: { 
        title: "ЕПИЧНА БЪЛГАРИЯ", year: "г.", gold: "злато", army: "воини", recruit: "КАЗАРМА", 
        infra: "УПРАВЛЕНИЕ", battle: "Битка", marriage: "Брак", ritual: "Ритуал", 
        yearPlus: "Година +1", inf: "Пехота", cav: "Конница", arc: "Стрелци", 
        fs: "ЦЯЛ ЕКРАН", domains: "ВЛАДЕНИЯ", level: "Ниво", age: "Възраст", 
        dynasty: "Род", close: "ЗАТВОРИ", kan: "Кан" 
    },
    en: { 
        title: "EPIC BULGARIA", year: "BC", gold: "gold", army: "warriors", recruit: "BARRACKS", 
        infra: "MANAGEMENT", battle: "Battle", marriage: "Marriage", ritual: "Ritual", 
        yearPlus: "Year +1", inf: "Infantry", cav: "Cavalry", arc: "Archers", 
        fs: "FULLSCREEN", domains: "DOMAINS", level: "Level", age: "Age", 
        dynasty: "Clan", close: "CLOSE", kan: "Kan" 
    },
    ru: { 
        title: "ЭПИЧЕСКАЯ БОЛГАРИЯ", year: "г. до н.э.", gold: "золото", army: "воины", recruit: "КАЗАРМА", 
        infra: "УПРАВЛЕНИЕ", battle: "Битка", marriage: "Брак", ritual: "Ритуал", 
        yearPlus: "Год +1", inf: "Пехота", cav: "Конница", arc: "Лучники", 
        fs: "ПОЛНЫЙ ЭКРАН", domains: "ВЛАДЕНИЯ", level: "Уровень", age: "Возраст", 
        dynasty: "Род", close: "ЗАКРЫТЬ", kan: "Кан" 
    }
};

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
    }

    levelUp() {
        this.level++;
        this.armySize += 150;
    }
}

window.Character = Character;
