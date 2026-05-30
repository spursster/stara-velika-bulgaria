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
            if (typeof window.updateCharacterUI === 'function' && window.currentHero) {
                window.updateCharacterUI();
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
