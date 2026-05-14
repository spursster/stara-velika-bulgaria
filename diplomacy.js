/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България
 */
window.clanRelations = {};

window.initDiplomacy = function() {
    // Използваме ключовете от dowryMap като резервен вариант, ако базата данни липсва
    const dynasties = window.bulgarianDynasties || [
        "Дуло", "Вокил", "Угаин", "Комитопули", "Асеневци", "Тертер", 
        "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб"
    ];
    
    dynasties.forEach(dyn => {
        window.clanRelations[dyn] = (window.currentHero && dyn === window.currentHero.dynasty) ? 100 : 40;
    });
};

// Поправка: Ако се извика без клан, отваря дипломацията
window.openMarriageMenu = function(clan) {
    if (!clan) {
        window.openDiplomacy();
        return;
    }

    if (window.currentSpouse) {
        window.logEvent("Вече имате сключен династичен съюз!", "warning");
        return;
    }
    
    if (window.clanRelations[clan] < 60) {
        window.logEvent(`Род ${clan} изисква поне 60% доверие за брак!`, "warning");
        return;
    }
    
    const dowryMap = {
        "Дуло": "Стара Велика България", "Вокил": "Панония", "Угаин": "Малка Скития",
        "Комитопули": "Македония", "Асеневци": "Загоре", "Тертер": "Добруджа",
        "Смилец": "Крън", "Шишмановци": "Видинско деспотство", "Македони": "Беломорие",
        "Птоломеи": "Египет", "Одриси": "Севтполис", "Бесараб": "Влахия"
    };

    const region = dowryMap[clan] || "Нови земи";
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    window.clanRelations[clan] = 100;
    window.logEvent(`Сключен брак с род ${clan}! Присъединена територия: ${region}.`, "royal");
    
    // Затваряне на екрана и опресняване
    const screen = document.getElementById('diplomacy-screen');
    if (screen) screen.remove();
    
    window.updateCharacterUI(window.currentHero);
};
