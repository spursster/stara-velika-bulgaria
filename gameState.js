window.GameState = {
    data: {
        worldData: null,
        playerRegions: [],
        gameTime: { seasonIndex: 0, year: 480, era: "пр.н.е." },
        companions: [],
        activeQuests: [],
        completedQuests: [],
        gameMode: 'classic',
        currentRegion: 'Плиска'
    },
    get(key) { return this.data[key]; },
    set(key, value) { this.data[key] = value; this.notify(key); },
    notify(key) { /* dispatch event for UI updates */ }
};
