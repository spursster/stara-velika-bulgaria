/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (FINAL STABLE VERSION)
 */

window.clanRelations = window.clanRelations || {};

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    
    allClans.forEach(clan => {
        if (window.currentHero && clan === window.currentHero.dynasty) {
            window.clanRelations[clan] = 100;
        } else if (!window.clanRelations[clan]) {
            window.clanRelations[clan] = 40;
        }
    });
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    if (Object.keys(window.clanRelations).length === 0) window.initDiplomacy();

    const oldScreen = document.getElementById('diplomacy-screen');
    if (oldScreen) oldScreen.remove();

    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    screen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(5, 5, 5, 0.98); z-index: 9999; padding: 20px; 
        box-sizing: border-box; border: 2px solid #d4af37; overflow-y: auto; color: white;
    `;

    let clansHTML = "";
    for (let clanName in window.clanRelations) {
        clansHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #333;">
            <div>
                <b style="color: #d4af37; font-family: 'Cinzel';">Род ${clanName}</b>
                <div style="font-size: 11px; color: #aaa;">Доверие: ${window.clanRelations[clanName]}%</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="window.sendGift('${clanName}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 6px 10px; cursor: pointer; font-size: 11px;">🎁 Дар</button>
                <button onclick="window.openMarriageMenu('${clanName}')" style="background: #7b1a1a; color: #fff; border: none; padding: 6px 10px; cursor: pointer; font-size: 11px;">💍 Брак</button>
            </div>
        </div>`;
    }

    screen.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="font-family: 'Cinzel'; color: #d4af37; margin: 0;">ВЕЛИКИ РОДОВЕ</h2>
            <button onclick="document.getElementById('diplomacy-screen').remove()" style="color: #ff4d4d; background:none; border:none; cursor:pointer; font-size:24px; font-weight:bold;">✕</button>
        </div>
        <div style="margin-top: 10px;">${clansHTML}</div>
    `;

    mainArea.appendChild(screen);
};

window.sendGift = function(clan) {
    if (!window.currentHero) return;
    if (window.currentHero.gold >= 200) {
        window.currentHero.gold -= 200;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Изпратихме злато на род ${clan}. Доверието им е вече ${window.clanRelations[clan]}%.`);
        }
        
        window.openDiplomacy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Нямаме достатъчно злато за дар!");
    }
};

window.openMarriageMenu = function(clan) {
    // 1. Проверка дали името на рода е предадено правилно
    if (!clan || clan === 'undefined') return;

    if (window.currentSpouse) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Вече сте сключили съюз чрез брак!");
        return;
    }

    if (window.clanRelations[clan] < 60) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Род ${clan} изисква 60% доверие за съюз.`);
        return;
    }

    // 2. Карта на зестрите (съответства на твоите 13 рода)
    const dowryMap = { 
        "Дуло": "Стара Велика България", 
        "Вокил": "Панония", 
        "Ерми": "Причерноморие", 
        "Угаин": "Малка Скития", 
        "Куригир": "Днепър", 
        "Комитопули": "Македония", 
        "Асеневци": "Загоре", 
        "Тертер": "Добруджа", 
        "Смилец": "Крън", 
        "Шишмановци": "Видин", 
        "Македони": "Беломорие", 
        "Птоломеи": "Египет", 
        "Одриси": "Севтполис" 
    };

    const region = dowryMap[clan] || "Нова земя";
    
    // 3. ЗАПИСВАНЕ НА ДАННИТЕ
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    // Подсигуряваме, че масивът съществува, преди да добавим региона
    if (!window.playerRegions) window.playerRegions = ["Долна Мизия"];
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    // Повишаваме доверието на рода до максимум
    window.clanRelations[clan] = 100;

    // 4. ИЗВЕСТИЕ ЧРЕЗ СЪВЕТНИКА
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`Славна сватба! Род ${clan} се присъединява към нас. Получаваме ${region} като зестра.`);
    }
    
    // 5. ОБНОВЯВАНЕ И ЗАТВАРЯНЕ
    const screen = document.getElementById('diplomacy-screen');
    if (screen) screen.remove();
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
