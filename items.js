/**
 * МОДУЛ: АРТЕФАКТИ - Велика България
 */

window.playerInventory = [];

window.acquireArtifact = function(artifactId) {
    const item = window.artifactsDatabase[artifactId];
    if (item) {
        // Проверка дали вече го имаме
        if (window.playerInventory.find(i => i.id === artifactId)) return;

        window.playerInventory.push(item);
        window.newArtifactsCount++; // Увеличаваме брояча за индикатора
        
        if (item.bonus.heroPower) {
            window.currentHero.heroPower += item.bonus.heroPower;
        }

        if (window.logEvent) {
            window.logEvent(`Намерихте легендарен предмет: ${item.name}!`, "royal");
        }
        
        window.updateCharacterUI(window.currentHero);
    }
};
