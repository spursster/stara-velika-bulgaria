/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (Прецизна Версия 2.0)
 */

// Инициализираме обекта веднага, за да не е undefined
window.clanRelations = window.clanRelations || {};

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    
    allClans.forEach(clan => {
        // Задаваме начални стойности: 100 за твоя род, 40 за останалите
        const isPlayerDynasty = (window.currentHero && clan === window.currentHero.dynasty);
        window.clanRelations[clan] = isPlayerDynasty ? 100 : 40;
    });
    console.log("Дипломацията е инициализирана успешно.");
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // ПРОВЕРКА: Ако списъкът е празен, инициализираме го на място
    if (Object.keys(window.clanRelations).length === 0) {
        window.initDiplomacy();
    }

    // Премахваме стария прозорец, ако съществува
    const oldScreen = document.getElementById('diplomacy-screen');
    if (oldScreen) oldScreen.remove();

    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    screen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(5,5,5,0.98); z-index: 1500; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto; color: white;
    `;

    let clansHTML = Object.keys(window.clanRelations).map(clan => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #222;">
            <div>
                <b style="color: #d4af37; font-family: 'Cinzel';">Род ${clan}</b>
                <div style="font-size: 10px; color: #ccc;">Доверие: ${window.clanRelations[clan]}%</div>
            </div>
            <div style="display: flex; gap: 5px;">
                <button onclick="window.sendGift('${clan}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 5px 10px; cursor: pointer; font-size: 10px; font-family: 'Cinzel';">🎁 Дар</button>
                <button onclick="window.openMarriageMenu('${clan}')" style="background: #7b1a1a; color: #fff; border: none; padding: 5px 10px; cursor: pointer; font-size: 10px; font-family: 'Cinzel';">💍 Брак</button>
            </div>
        </div>
    `).join('');

    screen.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="font-family: 'Cinzel'; color: #d4af37; margin: 0;">ВЕЛИКИ РОДОВЕ</h2>
            <button onclick="document.getElementById('diplomacy-screen').remove(); if(window.updateCharacterUI) window.updateCharacterUI(window.currentHero);" style="color: #ff4d4d; background:none; border:none; cursor:pointer; font-size:20px; font-weight:bold;">✕</button>
        </div>
        <div style="margin-top: 5px;">${clansHTML}</div>
    `;
    mainArea.appendChild(screen);
};

window.sendGift = function(clan) {
    if (!window.currentHero) return;
    const cost = 200;
    if (window.currentHero.gold >= cost) {
        window.currentHero.gold -= cost;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Изпратихме златни дарове на род ${clan}. Доверието им към нас расте!`);
        }
        
        // Опресняваме прозореца, за да се види новото доверие
        window.openDiplomacy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Хазната е празна, Велики Кане! Нужни са ни 200 злато.");
    }
};

window.openMarriageMenu = function(clan) {
    if (!clan || !window.currentHero) return;

    if (window.currentSpouse) { 
        if (window.showAdvisorMsg) window.showAdvisorMsg("Вече имате сключен династичен съюз!");
        return; 
    }

    if (window.clanRelations[clan] < 60) { 
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Род ${clan} изисква поне 60% доверие за брак!`);
        return; 
    }
    
    const dowryMap = {
        "Дуло": "Стара Велика България", "Вокил": "Панония", "Ерми": "Причерноморие",
        "Угаин": "Малка Скития", "Куригир": "Днепър", "Комитопули": "Македония",
        "Асеневци": "Загоре", "Тертер": "Добруджа", "Смилец": "Крън",
        "Шишмановци": "Видин", "Македони": "Беломорие", "Птоломеи": "Египет", "Одриси": "Севтполис"
    };

    const region = dowryMap[clan] || "Нови земи";
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    if (window.playerRegions && !window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    window.clanRelations[clan] = 100;

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`Славна сватба! Род ${clan} се присъединява към нас. Зестра: ${region}.`);
    }
    
    // Затваряме и опресняваме всичко
    const screen = document.getElementById('diplomacy-screen');
    if (screen) screen.remove();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
