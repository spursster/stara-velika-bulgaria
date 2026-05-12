const lootTable = [
    {
        id: "iron_helmet",
        name: "Железен шлем",
        slot: "head",
        bonus: { armyPower: 5 },
        rarity: "Common"
    },
    {
        id: "golden_amulet",
        name: "Златен амулет на Одрисите",
        slot: "neck",
        bonus: { diplomacy: 10 },
        rarity: "Rare"
    },
    {
        id: "kubrat_sword",
        name: "Мечът на Кан Кубрат",
        slot: "mainHand",
        bonus: { armyPower: 50, isLegendary: true },
        rarity: "Legendary"
    },
    {
        id: "thracian_shield",
        name: "Пелта (Античен щит)",
        slot: "offHand",
        bonus: { defense: 15 },
        rarity: "Uncommon"
    },
    {
        id: "royal_boots",
        name: "Царски ботуши",
        slot: "feet",
        bonus: { speed: 5 },
        rarity: "Common"
    },
    {
        id: "tangra_ring",
        name: "Пръстен на Тангра",
        slot: "ring1",
        bonus: { divinePower: 20 },
        rarity: "Epic"
    }
];

// Функция за намиране на случаен предмет (например след битка)
function dropRandomLoot(hero) {
    const item = lootTable[Math.floor(Math.random() * lootTable.length)];
    
    // Автоматично екипиране, ако слотът е празен
    if (!hero.inventory[item.slot]) {
        hero.inventory[item.slot] = item;
        const log = document.getElementById('event-log');
        if (log) {
            const p = document.createElement('p');
            p.innerHTML = `🎁 <strong>Намерен артефакт:</strong> ${item.name} е екипиран в слот ${item.slot}!`;
            log.prepend(p);
        }
        updateCharacterUI(hero);
    }
}

window.dropRandomLoot = dropRandomLoot;
