/**
 * МОДУЛ: АРТЕФАКТИ - Велика България
 * СТАТУС: ПЪЛНА СИНХРОНИЗАЦИЯ С 13-ТЕ РОДА
 */

window.playerInventory = [];

// База данни с уникални артефакти за новите фракции
window.artifactsDatabase = {
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "🗡️", bonus: { heroPower: 50 }, clan: "Дуло" },
    "scepter_of_philip": { id: "scepter_of_philip", name: "Скиптърът на Филип II", icon: "🔱", bonus: { heroPower: 45 }, clan: "Македони" },
    "decebalus_shield": { id: "decebalus_shield", name: "Щитът на Децебал", icon: "🛡️", bonus: { heroPower: 40 }, clan: "Даки" },
    "thracian_rhyston": { id: "thracian_rhyston", name: "Одриски ритон", icon: "🍷", bonus: { goldBonus: 20 }, clan: "Одриси" },
    "scythian_bow": { id: "scythian_bow", name: "Скитски лък", icon: "🏹", bonus: { heroPower: 35 }, clan: "Скити" },
    "vlad_stake": { id: "vlad_stake", name: "Мечът на Дракула", icon: "⚔️", bonus: { heroPower: 55 }, clan: "Бесараб" }
};

window.acquireArtifact = function(artifactId) {
    const item = window.artifactsDatabase[artifactId];
    if (item) {
        // Проверка за наличие в инвентара
        if (window.playerInventory.find(i => i.id === artifactId)) return;

        window.playerInventory.push(item);
        
        // Визуален индикатор за нови предмети (ако съществува в UI)
        if (typeof window.newArtifactsCount !== 'undefined') {
            window.newArtifactsCount++;
        }
        
        // Прилагане на бонусите към героя
        if (item.bonus.heroPower) {
            window.currentHero.heroPower += item.bonus.heroPower;
        }

        if (window.logEvent) {
            window.logEvent(`Придобихте артефакт на рода ${item.clan}: ${item.name}!`, "royal");
        }
        
        if (window.updateCharacterUI) {
            window.updateCharacterUI(window.currentHero);
        }
    }
};

/**
 * ФУНКЦИЯ ЗА ПРОВЕРКА НА ИНВЕНТАРА
 */
window.getInventory = function() {
    return window.playerInventory;
};
