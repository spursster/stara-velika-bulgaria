/**
 * МОДУЛ: ДИПЛОМАЦИЯ И ПРОГРЕС НА КУПЕНИ ЛИДЕРИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (Синхронизация на 13-те рода)
 * КОРЕКЦИЯ: Връщане и твърдо фиксиране на "Уния Траки" според най-новите версии на mechanics.js и world_data.js.
 * Статистика на файловете в проекта: 16
 */
window.clanRelations = {};

window.initDiplomacy = function() {
    // Пълен закон за 13-те равноправни рода (Синхронизиран с Уния Траки)
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки", 
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];
    
    allClans.forEach(clan => {
        window.clanRelations[clan] = (window.currentHero && clan === window.currentHero.dynasty) ? 100 : 40;
    });
};

/**
 * АВТОНОМНА ДИПЛОМАЦИЯ И РАЗВИТИЕ НА КУПЕНИТЕ ЛИДЕРИ (Изпълнява се на всеки ход)
 */
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    for (let key in window.worldData.clans) {
        let clan = window.worldData.clans[key];
        
        // Автономен прогрес само за отключени, купени или присъединени родове
        if (clan.isUnlocked || clan.purchased || clan.unlocked || clan.isJoined) {
            // Пасивно генериране на родово злато на ход от техните владения
            let goldGen = (clan.regionsOwned || 1) * 75;
            clan.gold = (clan.gold || 0) + goldGen;

            // Бавно пасивно възстановяване на армията им в гарнизона (+10% на ход)
            if (clan.armySize < 400) {
                clan.armySize += Math.floor(Math.random() * 15) + 10;
            }
        }
    }

    // Динамични промени в отношенията с големите чужди Империи
    if (window.worldData.factions) {
        const rhomaioi = window.worldData.factions["rhomaioi_empire"];
        if (rhomaioi && rhomaioi.relation !== undefined) {
            // Отношенията с Ромеите леко клонят към неутралност или конфликт на всеки ход
            if (rhomaioi.relation > -50) rhomaioi.relation -= 1;
        }
    }
};

/**
 * ОТВАРЯНЕ НА ДИПЛОМАЦИЯТА С ВЪНШНИТЕ ИМПЕРИИ И РОДОВЕТЕ
 */
window.openDiplomacyMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    let rhomaioiRel = -20;
    let persianRel = 0;

    if (window.worldData && window.worldData.factions) {
        if (window.worldData.factions["rhomaioi_empire"]) rhomaioiRel = window.worldData.factions["rhomaioi_empire"].relation || -20;
        if (window.worldData.factions["persian_empire"]) persianRel = window.worldData.factions["persian_empire"].relation || 0;
    }

    mainArea.innerHTML = `
        <div style="background: #050505; border: 2px solid #d4af37; padding: 25px; border-radius: 6px; font-family: 'Georgia', serif; color: white; max-width: 650px; margin: 20px auto; box-sizing: border-box;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 12px; letter-spacing: 1px;">🏛️ ВЪНШНА ПОЛИТИКА И ПРЕГОВОРИ 🏛️</h2>
            
            <p style="font-size: 0.85em; color: #aaa; text-align: center; margin-bottom: 20px;">
                Балансирайте силите на континента. Изпращайте дарове или сключвайте династични бракове за зестра.
            </p>

            <div style="background: #000; border: 1px solid #222; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #ffd700; font-weight: bold; text-transform: uppercase; font-size: 0.9em;">🌍 ГОЛЕМИ ИМПЕРИИ:</p>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #111; font-size: 0.9em;">
                    <span>🏛️ Ромейска Империя (Rhomaioi)</span>
                    <span style="color: ${rhomaioiRel < 0 ? '#ff4444' : '#4caf50'}; font-weight: bold;">Отношения: ${rhomaioiRel}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.9em;">
                    <span>🦁 Персийска Империя</span>
                    <span style="color: ${persianRel < 0 ? '#ff4444' : '#4caf50'}; font-weight: bold;">Отношения: ${persianRel}</span>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.openMarriageMenu()" 
                        style="background: #a32a2a; color: white; border: 1px solid #ff4444; padding: 14px; font-size: 0.95em; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px;">
                    💍 УРЕДИ ДИНАСТИЧЕН БРАК (ЗЕСТРА)
                </button>
                
                <button onclick="window.sendImperialTribute()" 
                        style="background: #222; color: #ffd700; border: 1px solid #ffd700; padding: 12px; font-size: 0.9em; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px;">
                    💰 ИЗПРАТИ ДАР НА РОМЕИТЕ (-300 Злато)
                </button>

                <button onclick="if(window.showPalaceUI) window.showPalaceUI();" 
                        style="background: #111; color: #ccc; border: 1px solid #444; padding: 10px; font-size: 0.85em; cursor: pointer; border-radius: 4px; text-transform: uppercase; margin-top: 10px;">
                    ВЪРНИ СЕ В ДВОРЕЦА
                </button>
            </div>
        </div>
    `;
};

/**
 * ИЗПРАЩАНЕ НА ДАР ЗА ПОДОБРЯВАНЕ НА ОТНОШЕНИЯТА
 */
window.sendImperialTribute = function() {
    const hero = window.currentHero;
    if (!hero) return;

    if ((hero.gold || 0) < 300) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("🔮 СЪВЕТНИК: Свещената хазна няма 300 злато, за да умилостиви чуждите василевси!");
        return;
    }

    hero.gold -= 300;

    if (window.worldData && window.worldData.factions && window.worldData.factions["rhomaioi_empire"]) {
        window.worldData.factions["rhomaioi_empire"].relation = (window.worldData.factions["rhomaioi_empire"].relation || -20) + 25;
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg("📜 ДИПЛОМАЦИЯ: Керван със злато пристигна в Константинопол. Отношенията с Ромеите се подобриха с +25 пункта!");
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    window.openDiplomacyMenu();
};

/**
 * МЕНЮ ЗА СВАТБИ И ДИНАСТИЧНИ СЪЮЗИ (С УНИЯ ТРАКИ)
 */
window.openMarriageMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Всички свободни родове, освен твоя собствен (С включена Уния Траки)
    const potentialClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки", 
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ].filter(c => c !== hero.dynasty);

    let clanOptionsHTML = potentialClans.map(clan => {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.01); border: 1px solid #222; border-radius: 4px; font-size: 0.9em;">
                <div>
                    <b style="color: #fff;">Род ${clan}</b><br>
                    <span style="font-size: 0.8em; color: #aaa;">Зестра: Нов регион под твой контрол</span>
                </div>
                <button onclick="window.executeMarriageAlliance('${clan}')" 
                        style="background: #111; color: #4caf50; border: 1px solid #4caf50; padding: 6px 14px; cursor: pointer; font-weight: bold; font-size: 0.8em; border-radius: 3px;">
                    ИЗПЕЧЕЛИ СЪЮЗ
                </button>
            </div>
        `;
    }).join('');

    mainArea.innerHTML = `
        <div style="background: #050505; border: 2px solid #d4af37; padding: 25px; border-radius: 6px; font-family: 'Georgia', serif; color: white; max-width: 600px; margin: 20px auto; box-sizing: border-box;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 12px; font-size: 1.1em;">💍 ДИНАСТИЧНИ БРАКОВЕ ЗА ЗЕСТРА 💍</h2>
            
            <p style="font-size: 0.85em; color: #ccc; text-align: center; margin-bottom: 20px;">
                Изберете девица от влиятелен аристократичен род. Сватбата ще донесе незабавно нов регион към твоите територии.
            </p>

            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto; padding-right: 5px; margin-bottom: 20px;">
                ${clanOptionsHTML}
            </div>

            <button onclick="window.openDiplomacyMenu()" 
                    style="width: 100%; background: #222; color: #ccc; border: 1px solid #444; padding: 10px; font-size: 0.85em; cursor: pointer; border-radius: 4px; text-transform: uppercase;">
                ОТКАЗ И НАЗАД
            </button>
        </div>
    `;
};

/**
 * ИЗПЪЛНЕНИЕ НА СВАТБАТА И ДОБАВЯНЕ НА ЗЕСТРАТА
 */
window.executeMarriageAlliance = function(clan) {
    const hero = window.currentHero;
    if (!hero) return;

    // Брачна карта: съобразена на 100% с Уния Траки
    const dowryMap = {
        "Дуло": "Стара Велика България",
        "Комитопули": "Дарвания",
        "Асеневци": "Илирия",
        "Тертер": "Галатия",
        "Даки": "Дакия",
        "Уния Траки": "Мизия",
        "Шишмановци": "Месопотамия",
        "Македони": "Македония",
        "Птоломеи": "Кипър",
        "Одриси": "Тракия",
        "Бесараб": "Добруджа",
        "Османци Дуло": "Витиния",
        "Скити": "Сарматия"
    };

    const region = dowryMap[clan] || "Мизия";
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    if (!window.playerRegions) window.playerRegions = [];
    const ownedRegionsFlat = window.playerRegions.flat();
    
    // Ако регионът все още не е владян, го добавяме към списъка на играча
    if (!ownedRegionsFlat.includes(region)) {
        window.playerRegions.push(region);
        
        // Синхронизация с геополитическите данни на рода в worldData
        if (window.worldData && window.worldData.clans && window.worldData.clans[clan]) {
            window.worldData.clans[clan].regionsOwned = (window.worldData.clans[clan].regionsOwned || 1) + 1;
        }
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`💍 СВАТБА: Вдигнат е пищен династичен съюз с род ${clan}! Като зестра получавате пълна власт над регион: ${region}!`);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    
    // Връщаме играча в двореца с обновения статус
    if (window.showPalaceUI) {
        window.showPalaceUI();
    } else {
        window.openDiplomacyMenu();
    }
};
