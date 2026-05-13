const lootTable = [
    {
        id: "iron_helmet",
        name: { bg: "Железен шлем", en: "Iron Helmet", ru: "Железный шлем" },
        slot: "head",
        bonus: { armyPower: 5 },
        rarity: { bg: "Обикновен", en: "Common", ru: "Обычный" }
    },
    {
        id: "golden_amulet",
        name: { bg: "Златен амулет на Одрисите", en: "Golden Odrysian Amulet", ru: "Золотой амулет Одрисов" },
        slot: "neck",
        bonus: { diplomacy: 10 },
        rarity: { bg: "Рядък", en: "Rare", ru: "Редкий" }
    },
    {
        id: "kubrat_sword",
        name: { bg: "Мечът на Кан Кубрат", en: "Sword of Kan Kubrat", ru: "Меч Кана Кубрата" },
        slot: "mainHand",
        bonus: { armyPower: 50, isLegendary: true },
        rarity: { bg: "Легендарен", en: "Legendary", ru: "Легендарный" }
    },
    {
        id: "thracian_shield",
        name: { bg: "Пелта (Античен щит)", en: "Pelta (Ancient Shield)", ru: "Пелта (Античный щит)" },
        slot: "offHand",
        bonus: { defense: 15 },
        rarity: { bg: "Необикновен", en: "Uncommon", ru: "Необычный" }
    },
    {
        id: "royal_boots",
        name: { bg: "Царски ботуши", en: "Royal Boots", ru: "Царские сапоги" },
        slot: "feet",
        bonus: { speed: 5 },
        rarity: { bg: "Обикновен", en: "Common", ru: "Обычный" }
    },
    {
        id: "tangra_ring",
        name: { bg: "Пръстен на Тангра", en: "Ring of Tangra", ru: "Кольцо Тангры" },
        slot: "ring1",
        bonus: { divinePower: 20 },
        rarity: { bg: "Епичен", en: "Epic", ru: "Эпический" }
    }
];

function dropRandomLoot(hero) {
    const lang = window.gameLang || 'bg';
    const item = lootTable[Math.floor(Math.random() * lootTable.length)];
    
    // Автоматично екипиране, ако слотът е празен
    if (!hero.inventory[item.slot]) {
        hero.inventory[item.slot] = item;
        const log = document.getElementById('event-log');
        
        if (log) {
            const msg = {
                bg: `🎁 <strong>Намерен артефакт:</strong> ${item.name[lang]} е екипиран!`,
                en: `🎁 <strong>Artifact found:</strong> ${item.name[lang]} is equipped!`,
                ru: `🎁 <strong>Артефакт найден:</strong> ${item.name[lang]} экипирован!`
            };
            
            const p = document.createElement('p');
            p.innerHTML = msg[lang];
            log.prepend(p);
        }
        
        if (typeof window.updateCharacterUI === "function") {
            window.updateCharacterUI(hero);
        }
    }
}

window.dropRandomLoot = dropRandomLoot;
