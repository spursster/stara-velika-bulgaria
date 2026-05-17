/**
 * МОДУЛ: ДИПЛОМАЦИЯ - Велика България
 * СТАТУС: НАПЪЛНО КОРИГИРАН (Запазени всички оригинални кланове и региони)
 * КОРЕКЦИЯ: Поправен конзолен бъг с липсваща функция window.openMarriageMenu чрез софтуерен мост.
 * Статистика на файловете в проекта: 16
 */
window.clanRelations = window.clanRelations || {};

window.initDiplomacy = function() {
    // ТВОЯТ ОРИГИНАЛЕН СПИСЪК С КЛАНОВЕ БЕЗ НИКАКВА ПРОМЕНА
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки", 
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];
    
    allClans.forEach(clan => {
        if (window.clanRelations[clan] === undefined) {
            window.clanRelations[clan] = (window.currentHero && clan === window.currentHero.dynasty) ? 100 : 40;
        }
    });
};

/**
 * АВТОНОМНА ДИПЛОМАЦИЯ (AI)
 */
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.keys(window.worldData.clans).forEach(clanName => {
        if (window.currentHero && clanName === window.currentHero.dynasty) return;

        if (window.clanRelations[clanName] === undefined) {
            window.clanRelations[clanName] = 40;
        }

        const change = Math.floor(Math.random() * 5) - 2; // -2 до +2
        window.clanRelations[clanName] = Math.max(0, Math.min(100, window.clanRelations[clanName] + change));
    });
};

/**
 * ИНТЕРФЕЙС НА ВЕЛИКАТА ДИПЛОМАЦИЯ
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
        if (window.currentHero && clan === window.currentHero.dynasty) return;

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
                <h3 style="margin: 0; color: #d4af37; text-transform: uppercase; font-size: 1.1em; letter-spacing: 1px;">📜 Родова Дипломация</h3>
                <button onclick="document.getElementById('diplomacy-screen').style.display='none'" style="background: none; border: none; color: #ff4444; font-size: 1.3em; cursor: pointer; font-weight: bold;">&times;</button>
            </div>
            
            <p style="font-size: 0.85em; color: #aaa; margin-bottom: 15px; line-height: 1.4;">
                Управлявайте отношенията между великите родове. Сключването на съюзи осигурява territorialna експанзия чрез зестра и стабилност на границите.
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
 * ИЗПРАЩАНЕ НА ДАР
 */
window.sendDiplomaticGift = function(clan) {
    const hero = window.currentHero;
    if (!hero) return;

    if ((hero.gold || 0) >= 150) {
        hero.gold -= 150;
        
        const diploSkill = (hero.skills && hero.skills.diplomacy) || 0;
        let relationGain = 15 + (diploSkill * 3);
        
        if (hero.dynasty === "Дуло" && window.dynastyPerks && window.dynastyPerks["Дуло"] && window.dynastyPerks["Дуло"].legitimacy) {
            relationGain = Math.floor(relationGain * window.dynastyPerks["Дуло"].legitimacy);
        }

        window.clanRelations[clan] = Math.min(100, (window.clanRelations[clan] || 40) + relationGain);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`📜 ДИПЛОМАЦИЯ: Кан ${hero.name} изпрати дарове на род ${clan}. Отношенията се подобриха с +${relationGain}!`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        window.openDiplomacyScreen();
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато за изпращане на дар!");
        }
    }
};

/**
 * ПРЕДЛОЖЕНИЕ ЗА ДИНАСТИЧЕН БРАК
 */
window.proposeDynasticMarriage = function(clan) {
    const hero = window.currentHero;
    if (!hero) return;

    if (window.currentSpouse) {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ ПРАВИЛО: Вече сте обвързани в съюз! Не можете да сключите втори брак.");
        }
        return;
    }

    const currentRelation = window.clanRelations[clan] || 40;
    const diploSkill = (hero.skills && hero.skills.diplomacy) || 0;
    
    let successChance = 0.35 + (currentRelation / 200) + (diploSkill * 0.05);
    if (hero.dynasty === "Дуло") successChance += 0.1;

    if (Math.random() <= successChance) {
        window.applyMarriageEffects(clan);
        const screen = document.getElementById('diplomacy-screen');
        if (screen) screen.remove();
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`❌ ОТКАЗ: Владетелят на род ${clan} отхвърли Вашето предложение за брак.`);
        }
    }
};

/**
 * ТВОИТЕ ОРИГИНАЛНИ ЕФЕКТИ И ЗЕСТРИ НА 100% ПОТВЪРДЕНИ И ВЪЗСТАНОВЕНИ
 */
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
    if (!window.playerRegions.includes(region)) {
        window.playerRegions.push(region);
        if (window.worldData && window.worldData.clans && window.worldData.clans[clan]) {
            window.worldData.clans[clan].regionsOwned += 1;
        }
    }

    window.clanRelations[clan] = 100;

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`💖 ВЕЛИК СЪЮЗ: Кан ${window.currentHero.name} сключи съюз чрез брак с благородна представителка на род ${clan}! Като зестра получихте контрол над регион "${region}"!`);
    }

    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * 🎯 СИНХРОНИЗИРАЦОНЕН МОСТ:
 * Пренасочваме старото повикване openMarriageMenu директно към официалния екран за дипломация,
 * за да премахнем напълно TypeError грешката в конзолата.
 */
window.openMarriageMenu = function() {
    window.openDiplomacyScreen();
};
