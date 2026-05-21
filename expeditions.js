/**
МОДУЛ: МИСТИЧНИ ПОРТАЛИ И ЕКСПЕДИЦИИ - Велика България
ВЕРСИЯ: 2.0 - ПЪЛНА СИНХРОНИЗАЦИЯ С ЛЕТОПИСА И МУЛТИ-ГЕРОЙ СИСТЕМАТА
*/

// 1. База данни с 50 Неизвестни свята
window.unknownWorldsDatabase = window.unknownWorldsDatabase || [
    { name: "Огненият Асгард", creatureType: "Плазмени Елементали", petName: "Искрящ Феникс", petBonus: "Намалява цената на войската в Казармите с 15%" },
    { name: "Ледената пустош на Волос", creatureType: "Мразовити Великани", petName: "Полярен Вълк", petBonus: "+15% пасивен добив на злато от данъци" },
    { name: "Мъртвите полета на Аид", creatureType: "Некротични Сенки", petName: "Призрачен Гарван", petBonus: "+20% бонус при дипломатически преговори" },
    { name: "Небесните Острови на Тангра", creatureType: "Древни Грифони", petName: "Звезден Сърп", petBonus: "Възстановява 5% войска след всяка битка пасивно" },
    { name: "Кристалните Недра на Родопите", creatureType: "Земни Титани", petName: "Кристален Голем", petBonus: "Увеличава защитата на всички региони с +1" },
    { name: "Океанът на Безкрая", creatureType: "Левиатани и Сирени", petName: "Дълбоководна Хидра", petBonus: "+10% шанс за критичен удар в редовни битки" },
    { name: "Изгубената Атлантида", creatureType: "Техномагически Сфинксове", petName: "Хроно-Сфера", petBonus: "Намалява трудността на другите региони с 5%" },
    { name: "Сенчестата гора на Хеката", creatureType: "Химери и Вещици", petName: "Триглаво Куче", petBonus: "+15% опит (XP) за петицата при победа" },
    { name: "Мъглявината на Велес", creatureType: "Звездни Змии", petName: "Астрален Смок", petBonus: "Дава пасивно по +2 злато на всеки изминал ход" },
    { name: "Пустинята на Анубис", creatureType: "Пясъчни Скорпиони", petName: "Скарабей от Злато", petBonus: "Търговията носи двойни приходи" }
];

// Автоматично запълване до 50 уникални свята
if (window.unknownWorldsDatabase.length < 50) {
    const prefixes = ["Космически ", "Кървав ", "Ефирен ", "Свещен ", "Тъмен ", "Древен ", "Забравен ", "Омагьосан ", "Имперски ", "Див "];
    const suffixes = ["на Перун", "на Арес", "на Кронос", "на Зевс", "на Озирис", "на Ищар", "на Тор", "на Локи", "на Сатурн", "на Нептун"];
    const monsters = ["Дракони", "Демони", "Върколаци", "Елфи-Сенки", "Големи", "Орки", "Горгони", "Валкирии", "Архангели", "Кентаври"];
    const pets = ["Мини-Дракон", "Цербер", "Дух на Гората", "Златен Пегас", "Сребърна Лисица", "Огнен Скорпион", "Нефритен Пантер"];
    const bonuses = ["+10% икономика", "-10% цена в казарми", "+15% Дипломация", "+5% защита на родове", "Пасивен доход на злато"];
    for (let i = window.unknownWorldsDatabase.length; i < 50; i++) {
        let p = prefixes[i % prefixes.length];
        let s = suffixes[i % suffixes.length];
        let m = monsters[i % monsters.length];
        let pet = pets[i % pets.length];
        let b = bonuses[i % bonuses.length];
        window.unknownWorldsDatabase.push({
            name: `${p} свят ${s}`,
            creatureType: m,
            petName: pet,
            petBonus: b
        });
    }
}

// Глобално състояние на текущата експедиция
if (!window.currentPortalState) {
    window.currentPortalState = {
        currentWorld: window.unknownWorldsDatabase[0],
        isOpen: false,
        explorationProgress: {},
        enemyLevel: 1
    };
}

// Инициализираме прогреса за всички светове (ако липсва)
for (let world of window.unknownWorldsDatabase) {
    if (window.currentPortalState.explorationProgress[world.name] === undefined) {
        window.currentPortalState.explorationProgress[world.name] = 0;
    }
}

// ==================== ПОМОЩНИ ФУНКЦИИ ЗА ЛЕТОПИС ====================
function addChronicleEvent(title, message, icon, year) {
    if (window.addWorldEvent) {
        window.addWorldEvent(title, message, icon, year || window.currentYear);
    } else {
        console.log(`📜 ${title}: ${message}`);
    }
}

// ==================== ИНДИКАТОР ЗА ПОРТАЛ ====================
function createPortalIndicator() {
    const expeditionsBtn = document.getElementById('btn-expeditions');
    if (!expeditionsBtn) return;
    
    let indicator = document.getElementById('portal-indicator');
    if (indicator) return;
    
    indicator = document.createElement('span');
    indicator.id = 'portal-indicator';
    indicator.textContent = '🔴';
    indicator.style.cssText = 'position:relative; top:-8px; margin-left:5px; font-size:14px; display:none; animation:pulse 1s infinite;';
    
    if (!document.getElementById('portal-pulse-style')) {
        let style = document.createElement('style');
        style.id = 'portal-pulse-style';
        style.textContent = '@keyframes pulse { 0% { opacity:1; } 50% { opacity:0.3; } 100% { opacity:1; } }';
        document.head.appendChild(style);
    }
    
    expeditionsBtn.appendChild(indicator);
}

window.showPortalIndicator = function() {
    const ind = document.getElementById('portal-indicator');
    if (ind) ind.style.display = 'inline-block';
};

window.hidePortalIndicator = function() {
    const ind = document.getElementById('portal-indicator');
    if (ind) ind.style.display = 'none';
};

// ==================== АВТОНОМНА БИТКА ЗА НЕ-ЛЮБИМИТЕ ГЕРОИ ====================
function autoBattleForHero(hero, portalWorld, enemyLevel) {
    const heroPower = hero.heroPower || hero.power || 100;
    const heroArmy = hero.armySize || hero.currentArmy || 200;
    const totalHeroStrength = heroPower * (heroArmy / 200);
    const enemyStrength = enemyLevel * 15;
    
    const winChance = Math.min(0.85, totalHeroStrength / (totalHeroStrength + enemyStrength));
    const isVictory = Math.random() < winChance;
    
    if (isVictory) {
        const xpGain = 25 + Math.floor(Math.random() * 30);
        const goldGain = 100 + Math.floor(Math.random() * 200);
        
        if (window.gainHeroXP) window.gainHeroXP(hero, xpGain);
        else hero.xp = (hero.xp || 0) + xpGain;
        hero.gold = (hero.gold || 0) + goldGain;
        
        // Синхронизация с armyDetails (ако има)
        if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
            window.armyMarket.sync(hero);
        }
        
        addChronicleEvent(`🌌 ${hero.name} премина портала`, `${hero.name} успешно премина през "${portalWorld.name}"! +${xpGain} XP, +${goldGain} злато.`, "🌌");
        return true;
    } else {
        const lossPercent = 0.2 + Math.random() * 0.3;
        const newArmy = Math.max(10, Math.floor((hero.armySize || 200) * (1 - lossPercent)));
        hero.armySize = newArmy;
        hero.currentArmy = newArmy;
        
        // Ако има armyDetails, намаляваме пропорционално пехотинците
        if (hero.armyDetails && hero.armyDetails.infantry) {
            let reduction = Math.floor(hero.armyDetails.infantry * lossPercent);
            hero.armyDetails.infantry = Math.max(0, hero.armyDetails.infantry - reduction);
        }
        
        addChronicleEvent(`💀 ${hero.name} не успя в портала`, `${hero.name} се провали в "${portalWorld.name}"! Загуби ${Math.floor(lossPercent * 100)}% от армията си.`, "💀");
        return false;
    }
}

// ==================== АВТОНОМНО ВЛИЗАНЕ В ПОРТАЛА ====================
function attemptAutonomousPortalEntry() {
    if (!window.worldData || !window.worldData.clans) return;
    if (!window.currentPortalState || !window.currentPortalState.isOpen) return;
    
    let favoriteIds = new Set();
    if (window.favoriteHeroes && typeof window.favoriteHeroes.forEach === 'function') {
        window.favoriteHeroes.forEach(id => favoriteIds.add(id));
    }
    
    // Проверка и за isFavoriteInBarracks
    if (window.worldData.clans) {
        for (let key in window.worldData.clans) {
            if (window.worldData.clans[key].isFavoriteInBarracks === true) {
                favoriteIds.add(key);
            }
        }
    }
    
    if (Math.random() > 0.25) return;
    
    let autonomousHeroes = [];
    for (let key in window.worldData.clans) {
        let clan = window.worldData.clans[key];
        if (clan.isJoined === true && !favoriteIds.has(key)) {
            autonomousHeroes.push(clan);
        }
    }
    
    if (autonomousHeroes.length === 0) return;
    
    const randomHero = autonomousHeroes[Math.floor(Math.random() * autonomousHeroes.length)];
    const portalWorld = window.currentPortalState.currentWorld;
    const enemyLevel = window.currentPortalState.enemyLevel;
    
    const isVictory = autoBattleForHero(randomHero, portalWorld, enemyLevel);
    
    if (isVictory) {
        if (Math.random() < 0.1 && !randomHero.pet) {
            randomHero.pet = portalWorld.petName;
            addChronicleEvent(`🐾 ${randomHero.name} опитоми любимец`, `${randomHero.name} опитоми ${portalWorld.petName} от портала "${portalWorld.name}"!`, "🐾");
        }
        
        if (!window.currentPortalState.explorationProgress[portalWorld.name]) {
            window.currentPortalState.explorationProgress[portalWorld.name] = 0;
        }
        window.currentPortalState.explorationProgress[portalWorld.name] = Math.min(100, 
            window.currentPortalState.explorationProgress[portalWorld.name] + 5);
    }
    
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
}

// 2. Функция за смяна на ходовете
window.advanceExpeditionsTurn = function() {
    const randomIndex = Math.floor(Math.random() * window.unknownWorldsDatabase.length);
    const selectedWorld = window.unknownWorldsDatabase[randomIndex];
    if (!window.currentPortalState.explorationProgress[selectedWorld.name]) {
        window.currentPortalState.explorationProgress[selectedWorld.name] = 0;
    }
    window.currentPortalState.isOpen = Math.random() < 0.40;
    window.currentPortalState.currentWorld = selectedWorld;
    window.currentPortalState.enemyLevel = Math.floor(Math.random() * 1000) + 1;
    window.updatePortalContainerUI();
    
    attemptAutonomousPortalEntry();
};

// 3. Интерфейс на Контейнера
window.updatePortalContainerUI = function() {
    let container = document.getElementById('clans-container') || document.getElementById('clans-box') || document.querySelector('.clans-section');
    if (!container) {
        container = document.getElementById('sidebar-clans-portal');
        if (!container) {
            const sidebar = document.body;
            container = document.createElement('div');
            container.id = 'sidebar-clans-portal';
            let mainUI = document.getElementById('main-ui-wrapper') || document.body;
            mainUI.appendChild(container);
        }
    }

    const state = window.currentPortalState;
    const world = state.currentWorld;
    const progress = state.explorationProgress[world.name] || 0;

    let statusText = state.isOpen ? `<b style="color: #00ffcc; text-shadow: 0 0 8px #00ffcc; animation: blink 1s infinite;">💥 ОТВОРЕН ЗА ИЗСЛЕДВАНЕ</b>` : `<span style="color: #666;">🛑 СТАБИЛИЗИРА СЕ (ЗАТВОРЕН)</span>`;
    let cursorStyle = state.isOpen ? "cursor: pointer; border-color: #a020f0; box-shadow: 0 0 15px rgba(160,32,240,0.4);" : "cursor: not-allowed; border-color: #333;";
    let bgAnim = state.isOpen ? "background: radial-gradient(circle, #1a0033 0%, #050505 100%);" : "background: #0d0d0d;";

    if (!document.getElementById('portal-glow-style')) {
        const style = document.createElement('style');
        style.id = 'portal-glow-style';
        style.innerHTML = `
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            .portal-active-glow { animation: portalPulse 2s infinite alternate; }
            @keyframes portalPulse { 0% { box-shadow: 0 0 10px #8a2be2; } 100% { box-shadow: 0 0 25px #00ffcc; } }
        `;
        document.head.appendChild(style);
    }

    container.style.cssText = `
        ${bgAnim}
        border: 2px solid #d4af37;
        border-radius: 8px;
        padding: 15px;
        color: #fff;
        font-family: 'Cinzel', serif;
        margin-bottom: 15px;
        transition: all 0.3s;
        ${cursorStyle}
    `;

    if (state.isOpen) {
        container.classList.add('portal-active-glow');
        container.onclick = function() { window.enterMysticPortal(); };
    } else {
        container.classList.remove('portal-active-glow');
        container.onclick = null;
    }

    container.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 8px;">
            <span style="font-size: 18px;">🌌</span> <b style="color: #ffd700; font-size: 13px; letter-spacing: 1px;">МИСТИЧЕН ПОРТАЛ</b>
        </div>
        <div style="font-size: 12px; line-height: 1.6;">
            <div> Свят: <span style="color: #fff; font-weight: bold;">"${world.name}"</span></div>
            <div>📡 Статус: ${statusText}</div>
            <div>🧬 Същества: <span style="color: #aaa;">${world.creatureType}</span></div>
            <div> Опасност: <b style="color: #ff3366;">Ниво ${state.enemyLevel}</b></div>
            <div style="margin-top: 6px;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: #888;">
                    <span>Проучен:</span>
                    <span>${progress}%</span>
                </div>
                <div style="width: 100%; background: #222; height: 5px; border-radius: 3px; overflow: hidden; border: 1px solid #444; margin-top: 2px;">
                    <div style="width: ${progress}%; background: #8a2be2; height: 100%;"></div>
                </div>
            </div>
        </div>
    `;
    
    createPortalIndicator();
    if (state.isOpen) {
        window.showPortalIndicator();
    } else {
        window.hidePortalIndicator();
    }
};

// 4. Влизане в портала (играчът)
window.enterMysticPortal = function() {
    const state = window.currentPortalState;
    if (!state.isOpen) return;

    let portalTargetRegion = {
        id: "portal_world_" + state.currentWorld.name.replace(/\s+/g, '_'),
        name: `🌌 Портал: ${state.currentWorld.name} (Ниво ${state.enemyLevel})`,
        armySize: Math.floor(state.enemyLevel * 1.5) + 80,
        defenseLevel: Math.min(10, Math.ceil(state.enemyLevel / 100)),
        difficulty: Math.min(100, Math.ceil(state.enemyLevel / 10)),
        isPortalWorld: true
    };

    addChronicleEvent(`🌌 Преминаване през портала`, `Петицата навлиза в "${state.currentWorld.name}"!`, "🌌");

    state.isOpen = false;
    window.updatePortalContainerUI();

    if (window.startBattle) {
        window.startBattle(portalTargetRegion);

        // Запазваме оригиналния endGroupBattle, ако съществува
        let originalEndGroupBattle = window.endGroupBattle;
        
        window.endGroupBattle = function(isVictory, reason) {
            if (originalEndGroupBattle) originalEndGroupBattle(isVictory, reason);

            if (isVictory) {
                let currentWorldName = state.currentWorld.name;
                state.explorationProgress[currentWorldName] = Math.min(100, (state.explorationProgress[currentWorldName] || 0) + 10);
                
                addChronicleEvent(`🌌 Резултат от експедицията`, `Колонизацията на "${currentWorldName}" достигна ${state.explorationProgress[currentWorldName]}%!`, "🌌");

                let diceRoll = Math.floor(Math.random() * 100) + 1;
                if (diceRoll === 77) {
                    if (window.currentHero) {
                        let luckyHero = window.currentHero;
                        luckyHero.pet = state.currentWorld.petName;
                        
                        if (window.worldData && window.worldData.clans && window.worldData.clans[luckyHero.clan]) {
                            window.worldData.clans[luckyHero.clan].pet = state.currentWorld.petName;
                        }
                        
                        addChronicleEvent(`🐾 ЛЕГЕНДАРЕН КЪСМЕТ!`, `${luckyHero.name} улови и опитоми "${state.currentWorld.petName}"! Бонус: ${state.currentWorld.petBonus}`, "🐾");
                    }
                }
            }

            // Възстановяваме оригиналната функция
            window.endGroupBattle = originalEndGroupBattle;
            window.updatePortalContainerUI();
        };
    }
};

// ==================== МЕНЮ ЗА ЕКСПЕДИЦИИ ====================
window.openExpeditionsMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    mainArea.innerHTML = `
        <section class="rpg-section animate-fade" style="background: rgba(15, 15, 15, 0.85); border: 1px solid #d4af37; padding: 20px; border-radius: 8px; text-align: center; position: relative;">
            <button onclick="if(window.backToMainMenu) window.backToMainMenu();" style="position: absolute; top: 10px; left: 10px; width: 40px; height: 40px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 20px; cursor: pointer; z-index: 101; display: flex; align-items: center; justify-content: center;">✕</button>
            
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; text-transform: uppercase; margin-top: 0;">Мистични Експедиции</h2>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 20px;">Изследвайте неизвестни светове чрез портала.</p>
            
            <div id="expedition-portal-box" style="margin-bottom: 20px; text-align: left; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px; border: 1px solid #333;">
                <p style="text-align: center; color: #666;">Зареждане на данни за портала...</p>
            </div>

            <button class="menu-btn" onclick="if(window.backToMainMenu) window.backToMainMenu();" style="width: 100%;">Назад към Главното Меню</button>
        </section>
    `;

    const box = document.getElementById('expedition-portal-box');
    if (window.currentPortalState) {
        const state = window.currentPortalState;
        const world = state.currentWorld;
        
        if (state.isOpen) {
            box.innerHTML = `
                <div style="font-size: 12px; line-height: 1.6; color: #fff;">
                    <div>🪐 Свят: <span style="color: #ffd700; font-weight: bold;">${world.name}</span></div>
                    <div>📡 Статус: <span style="color:#00ffcc">ОТВОРЕН ЗА ИЗСЛЕДВАНЕ</span></div>
                    <div>🔥 Опасност: <span style="color:#ff9900">Ниво ${state.enemyLevel}</span></div>
                    <div>🧬 Същества: <span style="color:#aaa">${world.creatureType}</span></div>
                    <button class="action-btn" style="margin-top: 15px; width: 100%; padding: 12px;" onclick="window.enterMysticPortal()">🌌 ВЛЕЗ В ПОРТАЛА</button>
                </div>
            `;
        } else {
            box.innerHTML = `
                <div style="font-size: 12px; line-height: 1.6; color: #fff;">
                    <div>🪐 Свят: <span style="color: #ffd700; font-weight: bold;">${world.name}</span></div>
                    <div>📡 Статус: <span style="color:#ff3366">СТАБИЛИЗИРА СЕ (ЗАТВОРЕН)</span></div>
                    <div>🔥 Опасност: <span style="color:#ff9900">Ниво ${state.enemyLevel}</span></div>
                    <button style="margin-top: 15px; width: 100%; padding: 12px; background: #333; color: #888; border: 1px solid #555; border-radius: 4px; cursor: not-allowed;" disabled>🔒 Порталът е затворен</button>
                </div>
            `;
        }
    }
};

// Стартиране на индикатора и контейнера след зареждане на DOM
setTimeout(() => {
    createPortalIndicator();
    window.updatePortalContainerUI();
}, 1000);
