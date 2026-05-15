/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (Синхронизиран с 51 региона)
 */
window.clanRelations = {};

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    
    allClans.forEach(clan => {
        // Начално доверие: 100 за твоя род, 40 за останалите
        window.clanRelations[clan] = (window.currentHero && clan === window.currentHero.dynasty) ? 100 : 40;
    });
};

/**
 * АВТОНОМНА ДИПЛОМАЦИЯ (AI)
 */
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.keys(window.worldData.clans).forEach(clanName => {
        if (window.currentHero && window.currentHero.dynasty === clanName) return;

        let clan = window.worldData.clans[clanName];

        // 1. АВТОНОМНИ ДАРОВЕ: Ако родът е богат (над 800 злато)
        if (clan.gold > 800 && Math.random() < 0.15) {
            clan.gold -= 200;
            window.clanRelations[clanName] = Math.min(100, window.clanRelations[clanName] + 10);
            
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`ДАРЕНИЕ: Родът ${clanName} изпрати ценни дарове на Кан ${window.currentHero.name}! 🎁`);
            }
        }

        // 2. ДИНАСТИЧЕН ИНТЕРЕС: При ниско доверие
        if (window.clanRelations[clanName] < 20 && Math.random() < 0.1) {
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`ПРЕДУПРЕЖДЕНИЕ: Род ${clanName} изразява недоволство! ⚠️`);
            }
        }
    });
};

window.openDiplomacy = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    if (Object.keys(window.clanRelations).length === 0) window.initDiplomacy();

    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    
    screen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(5,5,5,0.98); z-index: 10000; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto; color: white;
        display: flex; flex-direction: column;
    `;

    let clansHTML = Object.keys(window.clanRelations).map(clan => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #222;">
            <div>
                <b style="color: #d4af37;">Род ${clan}</b>
                <div style="font-size: 10px;">Доверие: ${window.clanRelations[clan]}%</div>
                <div style="font-size: 9px; color: #888;">Лидер: ${window.worldData.clans[clan].leader}</div>
            </div>
            <div>
                <button onclick="window.sendGift('${clan}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 5px; cursor: pointer;">Дарове</button>
                <button onclick="window.openMarriageMenu('${clan}')" style="background: #7b1a1a; color: #fff; border: none; padding: 5px; cursor: pointer; margin-left: 5px;">💍 Брак</button>
            </div>
        </div>
    `).join('');

    screen.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #d4af37; margin: 0;">ВЕЛИКИ РОДОВЕ</h2>
            <button onclick="document.getElementById('diplomacy-screen').remove()" style="color: #ff4d4d; background:none; border:none; cursor:pointer; font-size:24px;">✕</button>
        </div>
        <div style="flex-grow: 1;">${clansHTML}</div>
    `;
    document.body.appendChild(screen);
};

window.sendGift = function(clan) {
    if (window.currentHero.gold >= 200) {
        window.currentHero.gold -= 200;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Изпратихме дарове на род ${clan}.`);
        window.openDiplomacy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Нямаме злато!");
    }
};

window.openMarriageMenu = function(clan) {
    if (!clan || clan === 'undefined') { window.openDiplomacy(); return; }
    if (window.currentSpouse) { 
        if (window.showAdvisorMsg) window.showAdvisorMsg("Вече имате сключен брак!");
        return; 
    }
    if (window.clanRelations[clan] < 60) { 
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Родът ${clan} изисква 60% доверие!`);
        return; 
    }
    window.applyMarriageEffects(clan);
    const screen = document.getElementById('diplomacy-screen');
    if (screen) screen.remove();
};

window.applyMarriageEffects = function(clan) {
    // СИНХРОНИЗИРАНА ЗЕСТРА С 51 РЕГИОНА
    const dowryMap = {
        "Дуло": "Стара Велика България",
        "Вокил": "Панония",
        "Ерми": "Кавказ",
        "Угаин": "Кападокия",
        "Куригир": "Добруджа",
        "Комитопули": "Дардания",
        "Асеневци": "Илирия",
        "Тертер": "Дакия",
        "Смилец": "Месопотамия",
        "Шишмановци": "Киликия",
        "Македони": "Македония",
        "Птоломеи": "Кипър",
        "Одриси": "Тракия"
    };

    const region = dowryMap[clan] || "Мизия";
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    if (!window.playerRegions) window.playerRegions = [];
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
        // Обновяваме собствеността в worldData
        if (window.worldData.clans[clan]) {
            window.worldData.clans[clan].regionsOwned += 1;
            window.worldData.clans[clan].isJoined = true;
        }
    }
    
    window.clanRelations[clan] = 100;
    const marriageMsg = `Сключен бе свещен съюз с род ${clan}. Зестра: ${region}. 💍`;
    
    if (window.showAdvisorMsg) window.showAdvisorMsg(marriageMsg);
    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    
    return marriageMsg;
};
