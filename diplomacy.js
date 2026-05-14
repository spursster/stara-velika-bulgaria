/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (Синхронизирана версия)
 */
window.clanRelations = {};

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    
    allClans.forEach(clan => {
        window.clanRelations[clan] = (window.currentHero && clan === window.currentHero.dynasty) ? 100 : 40;
    });
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    if (Object.keys(window.clanRelations).length === 0) window.initDiplomacy();

    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    screen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(5,5,5,0.98); z-index: 1500; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto; color: white;
    `;

    // Поправка тук: Добавени са кавички '${clan}' в onclick функциите
    let clansHTML = Object.keys(window.clanRelations).map(clan => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #222;">
            <div>
                <b style="color: #d4af37; font-family: 'Cinzel';">Род ${clan}</b>
                <div style="font-size: 10px;">Доверие: ${window.clanRelations[clan]}%</div>
            </div>
            <div>
                <button onclick="window.sendGift('${clan}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 5px; cursor: pointer; font-size: 10px;">Дарове</button>
                <button onclick="window.openMarriageMenu('${clan}')" style="background: #7b1a1a; color: #fff; border: none; padding: 5px; cursor: pointer; font-size: 10px; margin-left: 5px;">💍 Брак</button>
            </div>
        </div>
    `).join('');

    screen.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <h2 style="font-family: 'Cinzel'; color: #d4af37; margin: 0;">ВЕЛИКИ РОДОВЕ</h2>
            <button onclick="document.getElementById('diplomacy-screen').remove()" style="color: #ff4d4d; background:none; border:none; cursor:pointer; font-size:20px;">✕</button>
        </div>
        <div style="margin-top: 15px;">${clansHTML}</div>
    `;
    mainArea.appendChild(screen);
};

// Добавена липсваща функция за дарове, за да може да вдигате доверието
window.sendGift = function(clan) {
    if (window.currentHero.gold >= 200) {
        window.currentHero.gold -= 200;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Изпратихме дарове на род ${clan}. Доверието им нарасна!`);
        window.openDiplomacy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Нямаме достатъчно злато!");
    }
};

window.openMarriageMenu = function(clan) {
    if (!clan || clan === 'undefined') { window.openDiplomacy(); return; }

    if (window.currentSpouse) { 
        if (window.showAdvisorMsg) window.showAdvisorMsg("Велики Кане, Вие вече сте сключили съюз чрез брак!");
        return; 
    }

    if (window.clanRelations[clan] < 60) { 
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Родът ${clan} изисква поне 60% доверие за брак!`);
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
    
    // Подсигуряваме добавянето на региона в масива на играча
    if (!window.playerRegions) window.playerRegions = [];
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    window.clanRelations[clan] = 100;

    if (window.showAdvisorMsg) window.showAdvisorMsg(`Славна сватба! Род ${clan} се присъединява към нас. Зестра: ${region}.`);
    
    const screen = document.getElementById('diplomacy-screen');
    if (screen) screen.remove();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
