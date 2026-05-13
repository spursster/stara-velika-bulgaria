window.setLanguage = function(lang) {
    window.gameLang = lang;
    window.updateCharacterUI(window.currentHero);
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
};

window.recruitUnit = function(hero, type) {
    const costs = { 'ЛЕКА_ПЕХОТА': 100, 'КОННИЦА': 300, 'СТРЕЛЦИ': 150 };
    const sizes = { 'ЛЕКА_ПЕХОТА': 50, 'КОННИЦА': 30, 'СТРЕЛЦИ': 40 };
    if (window.gameGold >= costs[type]) {
        window.gameGold -= costs[type];
        hero.armySize += sizes[type];
        return true;
    } return false;
};

window.simulateBattle = function(hero) {
    const win = Math.random() > 0.4;
    if (win) {
        if (window.availableProvinces.length > 0) {
            window.playerRegions.push(window.availableProvinces.shift());
        }
        hero.levelUp();
        return "Victory!";
    }
    hero.armySize = Math.floor(hero.armySize * 0.8);
    return "Defeat!";
};

window.performAncientRitual = function(hero) {
    const gods = [{bg: "Тангра", en: "Tangra", ru: "Тангра"}, {bg: "Бендида", en: "Bendis", ru: "Бендида"}];
    const god = gods[Math.floor(Math.random() * gods.length)];
    if (!hero.divineUnits.find(g => g.bg === god.bg)) {
        hero.divineUnits.push(god);
        return god[window.gameLang];
    }
    return null;
};
