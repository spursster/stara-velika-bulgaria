/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България (FINAL FIX)
 */

// 1. Подсигуряваме обекта с отношенията
window.clanRelations = window.clanRelations || {};

// 2. Функция за инициализация (извиква се от logic.js или автоматично)
window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ];
    
    allClans.forEach(clan => {
        if (window.currentHero && clan === window.currentHero.dynasty) {
            window.clanRelations[clan] = 100;
        } else {
            window.clanRelations[clan] = window.clanRelations[clan] || 40;
        }
    });
};

// 3. ГЛАВНА ФУНКЦИЯ - ТОВА ОТВАРЯ ПРОЗОРЕЦА
window.openDiplomacy = function() {
    // Проверка за контейнера, където се рисува играта
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) {
        console.error("Грешка: Не е намерен елемент с id='game-main-area'!");
        return;
    }

    // Ако не сме заредили родовете, правим го сега
    if (Object.keys(window.clanRelations).length === 0) {
        window.initDiplomacy();
    }

    // Премахваме стария прозорец, за да не се дублират
    const oldScreen = document.getElementById('diplomacy-screen');
    if (oldScreen) oldScreen.remove();

    // Създаваме новия прозорец
    const screen = document.createElement('div');
    screen.id = "diplomacy-screen";
    screen.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(5, 5, 5, 0.98); z-index: 9999; padding: 20px; 
        box-sizing: border-box; border: 2px solid #d4af37; overflow-y: auto; color: white;
    `;

    // Генерираме списъка с родове
    let clansHTML = "";
    for (let clan in window.clanRelations) {
        clansHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #333;">
            <div>
                <b style="color: #d4af37; font-family: 'Cinzel';">Род ${clan}</b>
                <div style="font-size: 11px; color: #aaa;">Доверие: ${window.clanRelations[clan]}%</div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="window.sendGift('${clan}')" style="background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; padding: 6px 10px; cursor: pointer; font-size: 11px;">🎁 Дар</button>
                <button onclick="window.openMarriageMenu('${clan}')" style="background: #7b1a1a; color: #fff; border: none; padding: 6px 10px; cursor: pointer; font-size: 11px;">💍 Брак</button>
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

// 4. ФУНКЦИЯ ЗА ДАРОВЕ
window.sendGift = function(clan) {
    if (window.currentHero.gold >= 200) {
        window.currentHero.gold -= 200;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Изпратихме злато на род ${clan}. Доверието им е вече ${window.clanRelations[clan]}%.`);
        }
        
        // Опресняваме екрана веднага
        window.openDiplomacy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Нямаме достатъчно злато за дар!");
    }
};

// 5. ФУНКЦИЯ ЗА БРАК
window.openMarriageMenu = function(clan) {
    if (window.currentSpouse) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Вече сте сключили съюз чрез брак!");
        return;
    }
    if (window.clanRelations[clan] < 60) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Род ${clan} изисква 60% доверие. Трябват ни още дарове!`);
        return;
    }

    const dowryMap = { "Дуло": "Стара Велика България", "Вокил": "Панония", "Ерми": "Причерноморие", "Угаин": "Малка Скития", "Куригир": "Днепър", "Комитопули": "Македония", "Асеневци": "Загоре", "Тертер": "Добруджа", "Смилец": "Крън", "Шишмановци": "Видин", "Македони": "Беломорие", "Птоломеи": "Египет", "Одриси": "Севтполис" };
    const region = dowryMap[clan] || "Нова земя";
    
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    if (!window.playerRegions.includes(region)) window.playerRegions.push(region);
    
    if (window.showAdvisorMsg) window.showAdvisorMsg(`Славна сватба с род ${clan}! Получаваме ${region}.`);
    
    document.getElementById('diplomacy-screen').remove();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
