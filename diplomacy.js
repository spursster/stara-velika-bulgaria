/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (Обектно-ориентиран подход)
 */

window.clanRelations = window.clanRelations || {};

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    allClans.forEach(clan => {
        if (!window.clanRelations[clan]) {
            window.clanRelations[clan] = (window.currentHero && clan === window.currentHero.dynasty) ? 100 : 40;
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
        background: rgba(5,5,5,0.98); z-index: 9999; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto; color: white;
    `;

    // Заглавие
    const header = document.createElement('div');
    header.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d4af37; padding-bottom:10px; margin-bottom:15px;";
    header.innerHTML = `<h2 style="font-family:'Cinzel'; color:#d4af37; margin:0;">ВЕЛИКИ РОДОВЕ</h2>`;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "✕";
    closeBtn.style.cssText = "color:#ff4d4d; background:none; border:none; cursor:pointer; font-size:24px; font-weight:bold;";
    closeBtn.onclick = () => screen.remove();
    header.appendChild(closeBtn);
    screen.appendChild(header);

    // Списък с родове (Създаваме ги като обекти, за да няма undefined)
    for (let clanName in window.clanRelations) {
        const row = document.createElement('div');
        row.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #333;";
        
        const info = document.createElement('div');
        info.innerHTML = `<b style="color:#d4af37; font-family:'Cinzel';">Род ${clanName}</b>
                          <div style="font-size:11px; color:#aaa;">Доверие: ${window.clanRelations[clanName]}%</div>`;
        
        const actions = document.createElement('div');
        actions.style.display = "flex";
        actions.style.gap = "8px";

        // Бутон Дар
        const giftBtn = document.createElement('button');
        giftBtn.innerText = "🎁 Дар";
        giftBtn.style.cssText = "background:#1a1a1a; color:#d4af37; border:1px solid #d4af37; padding:6px 10px; cursor:pointer; font-size:11px; font-family:'Cinzel';";
        giftBtn.onclick = () => window.executeGift(clanName);

        // Бутон Брак
        const marriageBtn = document.createElement('button');
        marriageBtn.innerText = "💍 Брак";
        marriageBtn.style.cssText = "background:#7b1a1a; color:#fff; border:none; padding:6px 10px; cursor:pointer; font-size:11px; font-family:'Cinzel';";
        marriageBtn.onclick = () => window.executeMarriage(clanName);

        actions.appendChild(giftBtn);
        actions.appendChild(marriageBtn);
        row.appendChild(info);
        row.appendChild(actions);
        screen.appendChild(row);
    }

    mainArea.appendChild(screen);
};

// АЛТЕРНАТИВНИ ЛОГИЧЕСКИ ФУНКЦИИ (БЕЗ ПРЕДАВАНЕ НА STRING В HTML)
window.executeGift = function(clan) {
    if (window.currentHero.gold >= 200) {
        window.currentHero.gold -= 200;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Изпратихме злато на род ${clan}.`);
        window.openDiplomacy(); // Рестартира интерфейса
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Нямаме злато!");
    }
};

window.executeMarriage = function(clan) {
    if (window.currentSpouse) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Вече сте женен!");
        return;
    }
    if (window.clanRelations[clan] < 60) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Род ${clan} иска 60% доверие!`);
        return;
    }

    const dowryMap = { 
        "Дуло": "Стара Велика България", "Вокил": "Панония", "Ерми": "Причерноморие", 
        "Угаин": "Малка Скития", "Куригир": "Днепър", "Комитопули": "Македония", 
        "Асеневци": "Загоре", "Тертер": "Добруджа", "Смилец": "Крън", 
        "Шишмановци": "Видин", "Македони": "Беломорие", "Птоломеи": "Египет", "Одриси": "Севтполис" 
    };

    const region = dowryMap[clan] || "Нова земя";
    
    // ФИКС: Директно записване в глобалните променливи
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`Славна сватба! Род ${clan} ни даде ${region}.`);
    }
    
    document.getElementById('diplomacy-screen').remove();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (Обектно-ориентиран подход)
 */

window.clanRelations = window.clanRelations || {};

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    allClans.forEach(clan => {
        if (!window.clanRelations[clan]) {
            window.clanRelations[clan] = (window.currentHero && clan === window.currentHero.dynasty) ? 100 : 40;
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
        background: rgba(5,5,5,0.98); z-index: 9999; padding: 20px; box-sizing: border-box;
        border: 2px solid #d4af37; overflow-y: auto; color: white;
    `;

    // Заглавие
    const header = document.createElement('div');
    header.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d4af37; padding-bottom:10px; margin-bottom:15px;";
    header.innerHTML = `<h2 style="font-family:'Cinzel'; color:#d4af37; margin:0;">ВЕЛИКИ РОДОВЕ</h2>`;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "✕";
    closeBtn.style.cssText = "color:#ff4d4d; background:none; border:none; cursor:pointer; font-size:24px; font-weight:bold;";
    closeBtn.onclick = () => screen.remove();
    header.appendChild(closeBtn);
    screen.appendChild(header);

    // Списък с родове (Създаваме ги като обекти, за да няма undefined)
    for (let clanName in window.clanRelations) {
        const row = document.createElement('div');
        row.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #333;";
        
        const info = document.createElement('div');
        info.innerHTML = `<b style="color:#d4af37; font-family:'Cinzel';">Род ${clanName}</b>
                          <div style="font-size:11px; color:#aaa;">Доверие: ${window.clanRelations[clanName]}%</div>`;
        
        const actions = document.createElement('div');
        actions.style.display = "flex";
        actions.style.gap = "8px";

        // Бутон Дар
        const giftBtn = document.createElement('button');
        giftBtn.innerText = "🎁 Дар";
        giftBtn.style.cssText = "background:#1a1a1a; color:#d4af37; border:1px solid #d4af37; padding:6px 10px; cursor:pointer; font-size:11px; font-family:'Cinzel';";
        giftBtn.onclick = () => window.executeGift(clanName);

        // Бутон Брак
        const marriageBtn = document.createElement('button');
        marriageBtn.innerText = "💍 Брак";
        marriageBtn.style.cssText = "background:#7b1a1a; color:#fff; border:none; padding:6px 10px; cursor:pointer; font-size:11px; font-family:'Cinzel';";
        marriageBtn.onclick = () => window.executeMarriage(clanName);

        actions.appendChild(giftBtn);
        actions.appendChild(marriageBtn);
        row.appendChild(info);
        row.appendChild(actions);
        screen.appendChild(row);
    }

    mainArea.appendChild(screen);
};

// АЛТЕРНАТИВНИ ЛОГИЧЕСКИ ФУНКЦИИ (БЕЗ ПРЕДАВАНЕ НА STRING В HTML)
window.executeGift = function(clan) {
    if (window.currentHero.gold >= 200) {
        window.currentHero.gold -= 200;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Изпратихме злато на род ${clan}.`);
        window.openDiplomacy(); // Рестартира интерфейса
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Нямаме злато!");
    }
};

window.executeMarriage = function(clan) {
    if (window.currentSpouse) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Вече сте женен!");
        return;
    }
    if (window.clanRelations[clan] < 60) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Род ${clan} иска 60% доверие!`);
        return;
    }

    const dowryMap = { 
        "Дуло": "Стара Велика България", "Вокил": "Панония", "Ерми": "Причерноморие", 
        "Угаин": "Малка Скития", "Куригир": "Днепър", "Комитопули": "Македония", 
        "Асеневци": "Загоре", "Тертер": "Добруджа", "Смилец": "Крън", 
        "Шишмановци": "Видин", "Македони": "Беломорие", "Птоломеи": "Египет", "Одриси": "Севтполис" 
    };

    const region = dowryMap[clan] || "Нова земя";
    
    // ФИКС: Директно записване в глобалните променливи
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
    }
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`Славна сватба! Род ${clan} ни даде ${region}.`);
    }
    
    document.getElementById('diplomacy-screen').remove();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
