/**
 * МОДУЛ: ДИПЛОМАЦИЯ И ВСЕЛЕНСКИ ПАКТОВЕ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН И СИНХРОНИЗИРАН (Връзка с 13-те Династии от database.js и RPG умения)
 * КОРЕКЦИЯ: Премахнати излишните кланове. Списъкът и зестрите са заключени точно за 13-те официални рода.
 * Статистика на файловете в проекта: 16
 */

window.clanRelations = window.clanRelations || {};

window.initDiplomacy = function() {
    // ПЪЛЕН СИНХРОНИЗИРАН СПИСЪК С ТОЧНО 13-ТЕ ДИНАСТИИ ОТ DATABASE.JS
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Лизимах", 
        "Гети", "Спартакиди", "Даки", "Шишмановци", "Македони", 
        "Птоломеи", "Одриси", "Бесараб"
    ];
    
    allClans.forEach(clan => {
        // Начално доверие: 100 за твоя личен род, 40 за останалите родови линии
        if (window.currentHero && clan === window.currentHero.dynasty) {
            window.clanRelations[clan] = 100;
        } else if (window.clanRelations[clan] === undefined) {
            window.clanRelations[clan] = 40;
        }
    });
};

/**
 * АВТОНОМНА РОДОВА ДИПЛОМАЦИЯ (AI ЕВОЛЮЦИЯ)
 */
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.keys(window.worldData.clans).forEach(clanName => {
        if (window.currentHero && clanName === window.currentHero.dynasty) return;

        if (window.clanRelations[clanName] === undefined) {
            window.clanRelations[clanName] = 40;
        }

        // Автономни промени на настроенията на родовете на всеки ход
        const change = Math.floor(Math.random() * 5) - 2; // -2 до +2
        window.clanRelations[clanName] = Math.max(0, Math.min(100, window.clanRelations[clanName] + change));
    });
};

/**
 * ИНТЕРФЕЙС НА ВЕЛИКАТА РОДОВА ДИПЛОМАЦИЯ
 */
window.openDiplomacyScreen = function() {
    window.initDiplomacy();
    
    let diploScreen = document.getElementById('diplomacy-screen');
    if (!diploScreen) {
        diploScreen = document.createElement('div');
        diploScreen.id = 'diplomacy-screen';
        diploScreen.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.95); z-index: 14000; display: flex;
            align-items: center; justify-content: center; color: white;
            font-family: 'Georgia', serif; box-sizing: border-box; padding: 15px;
        `;
        document.body.appendChild(diploScreen);
    }

    diploScreen.style.display = 'flex';

    const hero = window.currentHero || { dynasty: "Дуло", skills: { diplomacy: 0 } };
    
    let clansHtml = '';
    Object.keys(window.clanRelations).forEach(clan => {
        if (clan === hero.dynasty) return; // Пропускаме собствения си род

        const rel = window.clanRelations[clan];
        let statusColor = "#ff4444";
        let statusText = "Враждебност";

        if (rel >= 70) {
            statusColor = "#4caf50";
            statusText = "Кръвен Съюз";
        } else if (rel >= 40) {
            statusColor = "#ffd700";
            statusText = "Неутралитет";
        }

        clansHtml += `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 4px; padding: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9em;">
                <div>
                    <span style="font-weight: bold; color: #00ffcc;">Род ${clan}</span>
                    <div style="font-size: 0.8em; color: ${statusColor}; margin-top: 2px;">${statusText} (${rel}/100)</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="window.sendDiplomaticGift('${clan}')" style="background: #ffd700; color: black; border: none; padding: 5px 10px; font-size: 0.8em; cursor: pointer; font-weight: bold; border-radius: 2px;">Изпрати Дар (150💰)</button>
                    <button onclick="window.proposeDynasticMarriage('${clan}')" style="background: #ff3366; color: white; border: none; padding: 5px 10px; font-size: 0.8em; cursor: pointer; font-weight: bold; border-radius: 2px;">Династичен брак</button>
                </div>
            </div>
        `;
    });

    diploScreen.innerHTML = `
        <div style="width: 100%; max-width: 520px; background: #080808; border: 2px solid #d4af37; border-radius: 6px; padding: 20px; box-sizing: border-box; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37; text-transform: uppercase; font-size: 1.1em; letter-spacing: 1px;">📜 Родова Дипломация и Пактове</h3>
                <button onclick="document.getElementById('diplomacy-screen').style.display='none'" style="background: none; border: none; color: #ff4444; font-size: 1.3em; cursor: pointer; font-weight: bold;">&times;</button>
            </div>
            
            <p style="font-size: 0.85em; color: #aaa; margin-bottom: 15px; line-height: 1.4;">
                Управлявайте отношенията между великите 13 рода. Сключването на съюзи осигурява териториална експанзия чрез зестра и стабилност на границите пред бъдещото завладяване на космоса.
            </p>

            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 50vh; overflow-y: auto; padding-right: 5px;">
                ${clansHtml}
            </div>

            <div style="margin-top: 15px; text-align: right;">
                <button onclick="document.getElementById('diplomacy-screen').style.display='none'" style="background: #111; color: #aaa; border: 1px solid #333; padding: 8px 20px; cursor: pointer; border-radius: 4px; font-size: 0.85em;">Затваряне</button>
            </div>
        </div>
    `;
};

/**
 * ИЗПРАЩАНЕ НА ДАР И ДИПЛОМАТИЧЕСКИ ХОД
 */
window.sendDiplomaticGift = function(clan) {
    const hero = window.currentHero;
    if (!hero) return;

    if ((hero.gold || 0) >= 150) {
        hero.gold -= 150;
        
        // RPG Влияние: По-високото умение за дипломация увеличава ефекта от дара
        const diploSkill = (hero.skills && hero.skills.diplomacy) || 0;
        let relationGain = 15 + (diploSkill * 3);
        
        // Бонус Легитимност за род Дуло от механиките
        if (hero.dynasty === "Дуло" && window.dynastyPerks["Дуло"].legitimacy) {
            relationGain = Math.floor(relationGain * window.dynastyPerks["Дуло"].legitimacy);
        }

        window.clanRelations[clan] = Math.min(100, (window.clanRelations[clan] || 40) + relationGain);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`📜 ДИПЛОМАЦИЯ: Кан ${hero.name} изпрати дарове от злато и древни артефакти на род ${clan}. Отношенията се подобриха с +${relationGain}!`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        window.openDiplomacyScreen(); // Преначертаване
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато в държавната хазна, за да изпратите подобаващ дар!");
        }
    }
};

/**
 * ПРЕДЛОЖЕНИЕ ЗА ДИНАСТИЧЕН СЪЮЗЕН БРАК
 */
window.proposeDynasticMarriage = function(clan) {
    const hero = window.currentHero;
    if (!hero) return;

    if (window.currentSpouse) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ ПРАВИЛО: Вече сте обвързани в свещен династичен съюз! Не можете да сключите втори брак.");
        }
        return;
    }

    const currentRelation = window.clanRelations[clan] || 40;
    const diploSkill = (hero.skills && hero.skills.diplomacy) || 0;
    
    // Шансът за успех зависи от текущото доверие и RPG умението на водача
    let successChance = 0.35 + (currentRelation / 200) + (diploSkill * 0.05);
    if (hero.dynasty === "Дуло") successChance += 0.1; // Допълнителен престиж

    if (Math.random() <= successChance) {
        window.applyMarriageEffects(clan);
        document.getElementById('diplomacy-screen').style.display = 'none';
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`❌ ОТКАЗ: Владетелят на род ${clan} отхвърли Вашето предложение за брак. Подобрете отношенията си с дарове или славни победи.`);
        }
    }
};

/**
 * ЕФЕКТИ ОТ УСПЕШЕН БРАК - СЪОТВЕТСТВИЕ СЪС ЗАКОНА НА 13-ТЕ РОДА
 */
window.applyMarriageEffects = function(clan) {
    // СИНХРОНИЗИРАНА ЗЕСТРА СЪС СТРАТЕГИЧЕСКИТЕ ТЕРИТОРИИ НА 13-ТЕ РОДА
    const dowryMap = {
        "Дуло": "Стара Велика България",
        "Комитопули": "Дардания",
        "Асеневци": "Илирия",
        "Тертер": "Галатия",
        "Лизимах": "Тракийски Херсонес",
        "Гети": "Мизия",
        "Спартакиди": "Стримон",
        "Даки": "Дакия",
        "Шишмановци": "Бъдин",
        "Македони": "Македония",
        "Птоломеи": "Кипър",
        "Одриси": "Одринско царство",
        "Бесараб": "Добруджа"
    };

    const region = dowryMap[clan] || "Мизия";
    window.currentSpouse = { name: "Княгиня", dynasty: clan };
    
    if (!window.playerRegions) window.playerRegions = [];
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
        
        // Обновяваме собствеността в глобалния обект
        if (window.worldData && window.worldData.regions && window.worldData.regions[region]) {
            window.worldData.regions[region].isCaptured = true;
            window.worldData.regions[region].owner = "player";
        }
    }

    window.clanRelations[clan] = 100; // Отношенията стават максимални

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`💖 ВЕЛИК СЪЮЗ: Кан ${window.currentHero.name} сключи свещен съюз чрез брак с благородна представителка на род ${clan}! Като зестра получихте контрол над стратегическия регион "${region}"!`);
    }

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};
