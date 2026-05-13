/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България
 */

window.clanRelations = {};

window.initDiplomacy = function() {
    Object.keys(window.bulgarianDynasties).forEach(dyn => {
        window.clanRelations[dyn] = (dyn === window.currentHero.dynasty) ? 100 : 40;
    });
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    screen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(5,5,5,0.98); z-index: 1500; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto;
    `;

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

window.openMarriageMenu = function(clan) {
    if (window.currentSpouse) {
        alert("Вече имате сключен династичен съюз!");
        return;
    }
    if (window.clanRelations[clan] < 60) {
        alert(`Род ${clan} изисква поне 60% доверие за съюз чрез брак!`);
        return;
    }
    
    // Дефиниране на зестра според династията
    const dowryMap = {
        "Дуло": "Стара Велика България",
        "Вокил": "Панония",
        "Угаин": "Малка Скития",
        "Крумова династия": "Тракия",
        "Птолемеи": "Египетски земи",
        "Комитопули": "Македония",
        "Асеневци": "Загоре",
        "Тертеровци": "Добруджа"
    };

    const region = dowryMap[clan] || "Нови земи";
    
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    // ВАЖНО: Добавяне на територията към списъка на играча
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    window.clanRelations[clan] = 100;
    window.logEvent(`Сключен брак с род ${clan}. Присъединена територия: ${region}!`, "royal");
    
    if (document.getElementById('diplomacy-screen')) document.getElementById('diplomacy-screen').remove();
    window.updateCharacterUI(window.currentHero);
};
