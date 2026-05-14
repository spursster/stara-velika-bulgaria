/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (Синхронизиран - Версия със Съветник)
 */
window.openMarriageMenu = function(clan) {
    if (!clan) { window.openDiplomacy(); return; }

    if (window.currentSpouse) { 
        window.showAdvisorMsg("Велики Кане, Вие вече сте сключили свещен династичен съюз!");
        return; 
    }

    if (window.clanRelations[clan] < 60) { 
        window.showAdvisorMsg(`Родът ${clan} все още не ни се доверява достатъчно.`);
        return; 
    }
    
    const dowryMap = { "Дуло": "Стара Велика България", "Вокил": "Панония", "Ерми": "Причерноморие", "Угаин": "Малка Скития", "Куригир": "Днепър", "Комитопули": "Македония", "Асеневци": "Загоре", "Тертер": "Добруджа", "Смилец": "Крън", "Шишмановци": "Видин", "Македони": "Беломорие", "Птоломеи": "Египет", "Одриси": "Севтполис" };
    const region = dowryMap[clan] || "Нови земи";
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    if (window.playerRegions && !window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    window.clanRelations[clan] = 100;
    window.showAdvisorMsg(`Поздравления, Велики Кане! Сключен е съюз с род ${clan}. Зестра: ${region}.`);
    
    // ФИКС: Премахваме екрана и опресняваме веднага
    const screen = document.getElementById('diplomacy-screen');
    if (screen) screen.remove();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
