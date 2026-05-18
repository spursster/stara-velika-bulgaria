/**
 * МОДУЛ: ДИПЛОМАЦИЯ И ПРОГРЕС НА КУПЕНИ ЛИДЕРИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (СИНХРОНИЗАЦИЯ С DIABLO ХАРИЗМА, БРАКОВЕ & AUTO/MANUAL XP)
 * КОРЕКЦИЯ: Брачните съюзи четат пасивите, а пасивният опит ползва gainHeroXP.
 * Статистика на файловете в проекта: 17
 */

window.clanRelations = {};

window.initDiplomacy = function() {
    // Свещеният списък от 13 равноправни рода (Синхронизиран с Птолемеи и Уния Траки)
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки", 
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];
    
    const hero = window.currentHero;
    let initialBonus = 0;

    // Diablo пасив: Родословие (royalBlood) -> Добавя +15 точки към началните отношения
    if (hero && hero.skills && (hero.skills.royalBlood || 0) > 0) {
        initialBonus += (hero.skills.royalBlood * 15);
    }
    
    allClans.forEach(clan => {
        if (hero && clan === hero.dynasty) {
            window.clanRelations[clan] = 100;
        } else {
            window.clanRelations[clan] = Math.min(100, 40 + initialBonus);
        }
    });
};

/**
 * АВТОНОМНА ДИПЛОМАЦИЯ И РАЗВИТИЕ НА КУПЕНИТЕ ЛИДЕРИ (Изпълнява се на всеки ход)
 */
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;

    Object.entries(window.worldData.clans).forEach(([clanKey, clan]) => {
        // Пропускаме текущия герой на играча, неговата икономика се смята в economy.js
        if (window.currentHero && clanKey === window.currentHero.dynasty) return;

        // Автономно купуване на войски за извънредните родове
        if ((clan.gold || 0) >= 150) {
            clan.gold -= 100;
            clan.armySize = (clan.armySize || clan.currentArmy || 0) + Math.floor(Math.random() * 25) + 10;
            clan.currentArmy = clan.armySize;
        }

        // Вдигане на нивата на автономните водачи по официалния закон на опита (Уважава Auto/Manual)
        if (window.gainHeroXP) {
            window.gainHeroXP(clan, 35);
        } else {
            clan.xp = (clan.xp || 0) + 35;
            let reqXP = (clan.level || 1) * 150;
            if (clan.xp >= reqXP) {
                clan.xp -= reqXP;
                clan.level = (clan.level || 1) + 1;
                clan.heroPower = (clan.heroPower || 100) + 35;
            }
        }
    });

    // Опресняване на елитната лента след дипломатическия ход
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * МЕНЮ ЗА СКЛЮЧВАНЕ НА БРАЧНИ СЪЮЗИ
 */
window.openMarriageMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let skills = hero.skills || {};

    // Diablo пасив: Харизма (charisma) -> Намалява цената за зестра/договори с 10% на ниво (макс 50%)
    let charismaDiscount = Math.min(0.50, (skills.charisma || 0) * 0.10);
    let baseMarriageCost = 300;
    let finalMarriageCost = Math.max(50, Math.floor(baseMarriageCost * (1 - charismaDiscount)));

    // Diablo пасив: Дипломация (diplomacy) -> Увеличава базовия шанс за успех с +5% на ниво
    let diplomacyBonus = (skills.diplomacy || 0) * 5;
    let baseSuccessChance = 50 + diplomacyBonus;

    let html = `
        <section class="rpg-section animate-fade" style="background: rgba(15,15,15,0.85); border: 1px solid #d4af37; padding: 20px; border-radius: 8px;">
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; text-transform: uppercase;">Династични Бракове</h2>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 15px;">Изпратете дарове и поискайте ръката на родова княгиня за вечен военен съюз.</p>
            
            <div style="background:rgba(0,0,0,0.4); border:1px solid #222; padding:10px; margin-bottom:15px; font-size:12px; border-radius:4px;">
                💰 Цена за пратеничество: <strong style="color:#ffd700;">${finalMarriageCost} злато</strong> | 
                📈 Базов шанс за успех: <strong style="color:#00ffcc;">${baseSuccessChance}%</strong>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 280px; overflow-y: auto; padding-right: 5px;">
    `;

    Object.keys(window.clanRelations).forEach(clan => {
        if (clan !== hero.dynasty) {
            let rel = window.clanRelations[clan] || 40;
            html += `
                <div style="border: 1px solid #333; padding: 8px; background: rgba(255,255,255,0.01); border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="font-size: 12px; font-weight: bold; color: #fff;">Род ${clan}</div>
                    <div style="font-size: 11px; color: ${rel >= 70 ? '#00ffcc' : '#ff3366'}; margin: 3px 0;">Отношения: ${rel}/100</div>
                    <button class="action-btn" style="padding: 5px; font-size: 10px; margin-top: 5px;" onclick="window.proposeMarriage('${clan}', ${finalMarriageCost}, ${baseSuccessChance})">💍 Предложи Брак</button>
                </div>
            `;
        }
    });

    html += `
            </div>
            <button class="menu-btn" onclick="if(window.openRegionsMap){window.openRegionsMap();}else{location.reload();}" style="margin-top: 15px; width: 100%;">Върни се към Картата</button>
        </section>
    `;

    mainArea.innerHTML = html;
};

/**
 * ИЗПЪЛНЕНИЕ НА ПРЕДЛОЖЕНИЕТО ЗА БРАК
 */
window.proposeMarriage = function(clan, cost, successChance) {
    const hero = window.currentHero;
    if (!hero) return;

    if ((hero.gold || 0) < cost) {
        alert("Хазната на вашия род е празна! Нуждаете се от повече злато за дарове.");
        return;
    }

    hero.gold -= cost;

    // Модифициране на шанса спрямо текущите релации с рода
    let currentRel = window.clanRelations[clan] || 40;
    let finalChance = Math.min(95, successChance + Math.floor((currentRel - 40) * 0.5));

    let roll = Math.random() * 100;
    if (roll < finalChance) {
        // УСПЕШЕН БРАК - Получаване на зестра (Земи)
        window.clanRelations[clan] = 100;
        
        const dowryMap = {
            "Дуло": "Дарвания",
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
        window.currentSpouse = { name: `Княгиня от рода ${clan}`, dynasty: clan };
        
        if (!window.playerRegions) window.playerRegions = [];
        const ownedRegionsFlat = window.playerRegions.flat();
        
        if (!ownedRegionsFlat.includes(region)) {
            window.playerRegions.push(region);
            if (window.worldData && window.worldData.regions && window.worldData.regions[region]) {
                window.worldData.regions[region].armySize = 0; // Регионът се предава мирно
            }
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`👑 ДИНАСТИЧЕН ТРИУМФ: Кан ${hero.name} сключи свещен съюз с род ${clan}! Като зестра бяха предадени ключовете за регион "${region}".`);
        }
        alert(`Успех! Род ${clan} прие даровете и сключи династичен брак с вашия род. Получавате регион "${region}" като зестра!`);
    } else {
        // ПРОВАЛ - Отношенията охладняват леко
        window.clanRelations[clan] = Math.max(10, currentRel - 10);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`💔 ДИПЛОМАТИЧЕСКИ ХЛАД: Пратениците на Кан ${hero.name} бяха отхвърлени от старейшините на род ${clan}. Подаръците са задържани, а преговорите — прекратени.`);
        }
        alert("Предложението беше отхвърлено! Старейшините на рода сметнаха даровете за недостатъчни.");
    }

    // Синхронизация и преначертаване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    window.openMarriageMenu();
};
