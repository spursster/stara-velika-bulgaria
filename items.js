/**
 * МОДУЛ: АРТЕФАКТИ (Items & Artifacts)
 * Управлява ценните предмети, открити от владетеля.
 */

window.artifactsDatabase = {
    "gold_mask": {
        id: "gold_mask",
        name: "Златна маска на владетел",
        description: "Величествена маска, символ на царска власт и божествен произход.",
        bonus: { heroPower: 20, xp: 50 },
        icon: "🎭"
    },
    "bronze_sword": {
        id: "bronze_sword",
        name: "Бронзов меч от Балей",
        description: "Древен меч, изкован с майсторство от бронзовата епоха.",
        bonus: { heroPower: 35 },
        icon: "🗡️"
    },
    "silver_phiale": {
        id: "silver_phiale",
        name: "Сребърна фиала",
        description: "Ритуална чаша, използвана за скрепяване на съюзи между родовете.",
        bonus: { gold: 100, xp: 30 },
        icon: "🏺"
    }
};

window.playerInventory = [];

/**
 * Функция за придобиване на артефакт
 */
window.acquireArtifact = function(artifactId) {
    const item = window.artifactsDatabase[artifactId];
    if (item) {
        // Проверка дали вече го имаме (за уникални предмети)
        if (window.playerInventory.find(i => i.id === artifactId)) return;

        window.playerInventory.push(item);
        
        // Прилагане на бонусите към Кана
        if (item.bonus.heroPower) window.currentHero.heroPower += item.bonus.heroPower;
        if (item.bonus.gold) window.currentHero.gold += item.bonus.gold;
        if (item.bonus.xp) window.currentHero.xp += item.bonus.xp;

        if (window.logEvent) {
            window.logEvent(`Открит артефакт: ${item.name}!`, "royal");
        }
        window.updateCharacterUI(window.currentHero);
    }
};
