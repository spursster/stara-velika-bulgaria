/**
 * МОДУЛ: АРТЕФАКТИ
 */

window.artifactsDatabase = {
    "gold_mask": {
        id: "gold_mask",
        name: "Златна маска",
        description: "Символ на царска власт.",
        bonus: { heroPower: 20 },
        icon: "🎭"
    },
    "bronze_sword": {
        id: "bronze_sword",
        name: "Бронзов меч",
        description: "Меч от епохата на героите.",
        bonus: { heroPower: 35 },
        icon: "🗡️"
    },
    "silver_phiale": {
        id: "silver_phiale",
        name: "Сребърна фиала",
        description: "За ритуални възлияния.",
        bonus: { heroPower: 10 },
        icon: "🏺"
    }
};

window.playerInventory = [];

window.acquireArtifact = function(artifactId) {
    const item = window.artifactsDatabase[artifactId];
    if (item) {
        if (window.playerInventory.find(i => i.id === artifactId)) return;
        window.playerInventory.push(item);
        if (item.bonus.heroPower) window.currentHero.heroPower += item.bonus.heroPower;
        if (window.logEvent) window.logEvent(`Открихте артефакт: ${item.name}!`, "royal");
        window.updateCharacterUI(window.currentHero);
    }
};
