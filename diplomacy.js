/**
 * МОДУЛ: ДИПЛОМАЦИЯ И ПРОГРЕС НА КУПЕНИ ЛИДЕРИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Опит за всички лидери, Diablo пасиви & Династични съюзи)
 * КОРЕКЦИЯ: Добавен е цикъл за пасивен/активен опит на купените и отключените лидери на всеки ход.
 * Статистика на файловете в проекта: 16
 */
window.clanRelations = {};

window.initDiplomacy = function() {
    // Пълен списък с 13-те рода (Без забранени титли)
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

    const hero = window.currentHero;
    if (!hero) return;

    // === КЛЮЧОВ ПРИОРИТЕТ: ПРОГРЕС, ОПИТ И НИВА ЗА ВСИЧКИ ОТКЛЮЧЕНИ/КУПЕНИ ЛИДЕРИ ===
    if (window.worldData.leaders) {
        Object.keys(window.worldData.leaders).forEach(leaderId => {
            let leader = window.worldData.leaders[leaderId];
            
            // Проверяваме дали лидерът е отключен/купен от играча или принадлежи към неговия текущ род
            if (leader && (leader.isUnlocked || leader.dynasty === hero.dynasty)) {
                
                // 1. Даваме пасивен опит на всеки ход (симулира управление и тренировки)
                let passiveXP = Math.floor(Math.random() * 15) + 10; // 10-25 XP на ход
                
                // Бонус опит, ако лидерът притежава умствени или тактически умения
                if (leader.skills && (leader.skills.tactics || 0) > 0) {
                    passiveXP += (leader.skills.tactics * 3);
                }

                leader.xp = (leader.xp || 0) + passiveXP;

                // 2. Логика за вдигане на нива (Синхронизирана с rpg_system.js)
                if (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) {
                    let reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level || 1);
                    
                    while (leader.xp >= reqXP) {
                        leader.xp -= reqXP;
                        leader.level = (leader.level || 1) + 1;
                        leader.skillPoints = (leader.skillPoints || 0) + 1; // 1 точка на ниво

                        // Автоматично разпределяне на точките и еволюция в клас
                        if (window.autoAssignLeaderSkills) {
                            window.autoAssignLeaderSkills(leader);
                        }

                        if (window.showAdvisorMsg && leader.isUnlocked) {
                            window.showAdvisorMsg(`📈 ПРОГРЕС: Отключеният лидер ${leader.name} от род ${leader.dynasty} достигна Ниво ${leader.level}!`);
                        }
                        
                        // Изчисляваме изискването за следващото ниво
                        reqXP = window.rpgDatabase.getXPRequiredForLevel(leader.level);
                    }
                }
            }
        });
    }

    // === СТАНДАРТНА АВТОНОМНА ДИПЛОМАЦИЯ НА КЛАНОВЕТЕ ===
    Object.keys(window.worldData.clans).forEach(clanName => {
        if (clanName === hero.dynasty) return; // Пропускаме нашия род

        // Базово изменение на отношенията
        let change = Math.floor(Math.random() * 7) - 3; // от -3 до +3
        
        // Влияние на Diablo пасива "Величие / Харизма" на главния Кан върху останалите родове
        if (hero.skills && (hero.skills.stature || 0) > 0) {
            change += Math.floor(hero.skills.stature * 0.5); // По-лесно поддържане на добри отношения
        }

        window.clanRelations[clanName] = Math.max(0, Math.min(100, (window.clanRelations[clanName] || 40) + change));
    });

    // Опресняваме UI екраните, за да се видят веднага новите нива на купените герои
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};

/**
 * ИНТЕРФЕЙС ЗА ДИПЛОМАЦИЯ И ПРЕГОВОРНИ ДЕЙСТВИЯ
 */
window.openDiplomacyMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    if (!window.clanRelations || Object.keys(window.clanRelations).length === 0) {
        window.initDiplomacy();
    }

    let skills = hero.skills || {};

    // Diablo пасив: Харизмата намалява цената на даровете с 5% на точка
    let giftCostModifier = 1.0 - ((skills.stature || 0) * 0.05);
    giftCostModifier = Math.max(0.5, giftCostModifier);

    let baseGiftCost = Math.floor(150 * giftCostModifier);
    let baseMarriageCost = Math.floor(500 * giftCostModifier);

    let rowsHtml = "";
    Object.keys(window.clanRelations).forEach(clan => {
        if (clan === hero.dynasty) return;

        let rel = window.clanRelations[clan] || 40;
        let statusColor = "#ff4444";
        let statusText = "Враждебност";

        if (rel >= 70) { statusColor = "#4caf50"; statusText = "Съюз"; }
        else if (rel >= 40) { statusColor = "#ffcc00"; statusText = "Неутралитет"; }

        rowsHtml += `
            <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px; font-weight: bold; font-size: 0.9em;">Род ${clan}</td>
                <td style="padding: 10px; text-align: center; color: ${statusColor}; font-weight: bold; font-size: 0.85em;">${statusText} (${rel}/100)</td>
                <td style="padding: 10px; text-align: right; display: flex; gap: 5px; justify-content: flex-end;">
                    <button onclick="window.sendDiplomaticGift('${clan}', ${baseGiftCost})" style="background: #222; color: #ffd700; border: 1px solid #ffd700; padding: 5px 8px; font-size: 0.75em; cursor: pointer; border-radius: 3px;">Изпрати Дар (-${baseGiftCost}💰)</button>
                    ${rel >= 70 ? `<button onclick="window.proposeMarriage('${clan}', ${baseMarriageCost})" style="background: #7b1a1a; color: white; border: 1px solid #ff4444; padding: 5px 8px; font-size: 0.75em; cursor: pointer; border-radius: 3px;">Династичен брак</button>` : ""}
                </td>
            </tr>
        `;
    });

    const oldScreen = document.getElementById('diplomacy-overlay');
    if (oldScreen) oldScreen.remove();

    const overlay = document.createElement('div');
    overlay.id = 'diplomacy-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95); z-index: 24000; display: flex;
        align-items: center; justify-content: center; color: white; font-family: 'Georgia', serif;
        box-sizing: border-box; padding: 15px;
    `;

    overlay.innerHTML = `
        <div style="width: 100%; max-width: 550px; background: #050505; border: 2px solid #d4af37; padding: 20px; box-radius: 5px; max-height: 90vh; overflow-y: auto;">
            <h2 style="text-align: center; color: #d4af37; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 10px; text-transform: uppercase; font-size: 1.2em;">📜 ДИПЛОМАЦИЯ И ВЕЛИКИ СЪЮЗИ 📜</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background: rgba(214,175,55,0.1); color: #d4af37; font-size: 0.85em; text-align: left;">
                        <th style="padding: 10px;">РОД / ДИНАСТИЯ</th>
                        <th style="padding: 10px; text-align: center;">ОТНОШЕНИЯ</th>
                        <th style="padding: 10px; text-align: right;">ДЕЙСТВИЯ</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <button onclick="document.getElementById('diplomacy-overlay').remove()" style="margin-top: 20px; background: #111; color: #ccc; border: 1px solid #333; padding: 10px; cursor: pointer; width: 100%; font-weight: bold; border-radius: 4px;">ЗАДЪРЖИ ПРЕГОВОРИТЕ</button>
        </div>
    `;
    document.body.appendChild(overlay);
};

/**
 * ИЗПРАЩАНЕ НА ДАР
 */
window.sendDiplomaticGift = function(clan, cost) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        window.clanRelations[clan] = Math.min(100, (window.clanRelations[clan] || 40) + 20);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🎁 ДИПЛОМАЦИЯ: Изпратихте златни дарове на род ${clan}. Отношенията се подобриха!`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        window.openDiplomacyMenu(); // Преначертаване на менюто
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нима ще пращате празни каруци? Хазната няма толкова злато!");
    }
};

/**
 * ДИНАСТИЧЕН БРАК (ЗЕСТРА И СЪЮЗ)
 */
window.proposeMarriage = function(clan, cost) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        window.applyMarriageEffects(clan);
        document.getElementById('diplomacy-overlay').remove();
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато, за да покриете разкошната сватба!");
    }
};

window.applyMarriageEffects = function(clan) {
    const dowryMap = {
        "Дуло": "Стара Велика България",
        "Комитопули": "Дардания",
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
    
    if (!ownedRegionsFlat.includes(region)) {
        window.playerRegions.push(region);
        if (window.worldData.clans[clan]) {
            window.worldData.clans[clan].regionsOwned += 1;
        }
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`💍 СВАТБА: Вдигнат е пищен династичен съюз с род ${clan}! Като зестра получавате пълна власт над регион: ${region}!`);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
