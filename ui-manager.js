// === UI MANAGER - централен контрол на обновяването ===
window.UIManager = window.UIManager || {};

window.UIManager.updateQueue = new Set();
window.UIManager.isUpdating = false;

window.UIManager.requestUpdate = function(type = "all") {
    window.UIManager.updateQueue.add(type);

    if (window.UIManager.isUpdating) return;

    window.UIManager.isUpdating = true;

    // Debounce - чака 50ms преди да обнови
    setTimeout(() => {
        window.UIManager.processUpdates();
    }, 50);
};

window.UIManager.processUpdates = function() {
    const queue = window.UIManager.updateQueue;

    try {
        if (queue.has("all") || queue.has("heroes")) {
            if (typeof window.refreshAllHeroUI === 'function') {
                window.refreshAllHeroUI();
            }
            if (typeof window.renderFavoriteHeroesBar === 'function') {
                window.renderFavoriteHeroesBar();
            }
        }

        if (queue.has("all") || queue.has("resources")) {
            if (typeof window.updateResourcesUI === 'function') {
                window.updateResourcesUI();
            }
        }

        if (queue.has("all") || queue.has("character")) {
            // Взимаме най-силния герой (или избрания) за обновяване на левия панел
            let heroToUpdate = null;
            if (typeof window.getSelectedHero === 'function') {
                heroToUpdate = window.getSelectedHero();
            } else if (typeof window.getStrongestHero === 'function') {
                heroToUpdate = window.getStrongestHero();
            }
            if (typeof window.updateCharacterUI === 'function' && heroToUpdate) {
                window.updateCharacterUI(heroToUpdate);
            }
        }
    } catch (e) {
        console.error("UI Update Error:", e);
    }

    window.UIManager.updateQueue.clear();
    window.UIManager.isUpdating = false;
};

// По-удобни shortcuts
window.updateAllUI = () => window.UIManager.requestUpdate("all");
window.updateHeroesUI = () => window.UIManager.requestUpdate("heroes");
window.updateResourcesUI = () => window.UIManager.requestUpdate("resources");
