// ==================== 10 ОСНОВНИ ШКОЛИ ====================
window.skillTrees = {
    warrior: { name: "Воин", icon: "⚔️", desc: "Майстор на меле битка", base: ["strength", "armor"] },
    mage: { name: "Магьосник", icon: "🔮", desc: "Върховен маг", base: ["intellect", "magic"] },
    archer: { name: "Стрелец", icon: "🏹", desc: "Точност и бързина", base: ["agility", "crit"] },
    priest: { name: "Жрец", icon: "✨", desc: "Лечение и подкрепа", base: ["spirit", "heal"] },
    rogue: { name: "Крадец", icon: "🗡️", desc: "Скритост и отрова", base: ["speed", "poison"] },
    guardian: { name: "Пазител", icon: "🛡️", desc: "Твърд като камък", base: ["defense", "taunt"] },
    necromancer: { name: "Некромант", icon: "💀", desc: "Повелител на мъртвите", base: ["death", "summon"] },
    shaman: { name: "Шаман", icon: "🌿", desc: "Магия на природата", base: ["nature", "totem"] },
    knight: { name: "Рицар", icon: "🐎", desc: "Конна атака", base: ["cavalry", "charge"] },
    engineer: { name: "Инженер", icon: "🔧", desc: "Механизми и капани", base: ["trap", "gadget"] }
};

// ==================== ХИБРИДНИ КЛАСОВЕ (50+) ====================
window.classRecipes = {
    // (старите класове се запазват, но добавяме нови)
    spellblade: { name: "Spellblade", reqTrees: ["warrior", "mage"], reqLevel: 15,
        desc: "Воин, който вплита магия в меча си.",
        bonus: { heroPower: 45, magicPower: 30, attackSpeed: 0.15 }
    },
    assassin: { name: "Assassin", reqTrees: ["warrior", "rogue"], reqLevel: 15,
        desc: "Бърз и смъртоносен убиец.",
        bonus: { heroPower: 40, critChance: 0.2, speed: 20 }
    },
    cleric: { name: "Cleric", reqTrees: ["mage", "priest"], reqLevel: 15,
        desc: "Свещен магически воин.",
        bonus: { heroPower: 35, healingPower: 40, holyDamage: 25 }
    },
    warlock: { name: "Warlock", reqTrees: ["mage", "necromancer"], reqLevel: 15,
        desc: "Тъмен магьосник, който призовава демони.",
        bonus: { heroPower: 50, darkDamage: 45, summonPower: 0.2 }
    },
    ranger: { name: "Ranger", reqTrees: ["archer", "rogue"], reqLevel: 15,
        desc: "Ловец, който дебне в сенките.",
        bonus: { heroPower: 40, rangedDamage: 35, stealth: 0.15 }
    },
    druid: { name: "Druid", reqTrees: ["shaman", "guardian"], reqLevel: 20,
        desc: "Пазител на гората, който се превръща в звяр.",
        bonus: { heroPower: 55, natureDamage: 40, shapeshift: true }
    },
    deathknight: { name: "Death Knight", reqTrees: ["warrior", "necromancer"], reqLevel: 25,
        desc: "Прокълнат воин, който върви сред мъртвите.",
        bonus: { heroPower: 70, lifeSteal: 0.25, fearChance: 0.15 }
    },
    // ... още 40+ комбинации
};

// ==================== ЕВОЛЮЦИЯ НА КЛАСА (3 нива) ====================
window.classEvolution = {
    // Начален -> Среден -> Висш
    warrior: { intermediate: ["spellblade", "assassin", "deathknight"], advanced: ["warmaster", "shadowblade", "darkknight"] },
    mage: { intermediate: ["spellblade", "cleric", "warlock"], advanced: ["archmage", "hierophant", "demonomancer"] },
    // ... за всяка основна школа
};
