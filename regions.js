/**
 * МОДУЛ: РЕГИОНИ - Велика България
 */

window.worldRegions = {
    "Долна Мизия": { income: 30, units: 10, description: "Плодородни земи край Дунав." },
    "Малка Скития": { income: 20, units: 25, description: "Стратегическа зона с отлични конници." },
    "Панония": { income: 40, units: 5, description: "Богати пасища за стадата." },
    "Причерноморие": { income: 50, units: 0, description: "Търговски пътища и пристанища." }
};

window.conquerRegion = function(regionName) {
    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        if (window.logEvent) window.logEvent(`Вашият род установи контрол над ${regionName}!`, "royal");
        window.updateCharacterUI(window.currentHero);
    }
};
