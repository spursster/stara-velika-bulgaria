/**
МОДУЛ: ДИПЛОМАЦИЯ И ПРОГРЕС НА КУПЕНИ ЛИДЕРИ - Велика България
СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН + ДОБАВЕНА ФУНКЦИЯ ЗА БРАК С ПЛЕННИЦИ
КОРЕКЦИЯ: Добавена поддръжка за фентъзи раси и пленници след битка
*/

window.clanRelations = {};

/**
ИНИЦИАЛИЗАЦИЯ НА ДИПЛОМАТИЧЕСКИ ОТНОШЕНИЯ
*/
window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки",
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];
    
    const hero = window.currentHero;
    let initialBonus = 0;

    if (hero && hero.skills) {
        if ((hero.skills.royalBlood || 0) > 0) {
            initialBonus += (hero.skills.royalBlood * 15);
        }
    }

    allClans.forEach(clan => {
        if (hero && clan === hero.clan) {
            window.clanRelations[clan] = 100;
        } else {
            window.clanRelations[clan] = Math.min(100, 40 + initialBonus);
        }
    });
};

/**
АВТОНОМНА ДИПЛОМАЦИЯ И РАЗВИТИЕ НА КУПЕНИТЕ ЛИДЕРИ
*/
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;
    
    const hero = window.currentHero;
    
    Object.entries(window.worldData.clans).forEach(([clanKey, clan]) => {
        if (hero && clanKey === hero.clan) return;
        
        if ((clan.gold || 0) >= 150) {
            clan.gold -= 100;
            clan.armySize = (clan.armySize || clan.currentArmy || 0) + Math.floor(Math.random() * 25) + 10;
            clan.currentArmy = clan.armySize;
        }

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
    
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

// ==================== БРАК С ПЛЕННИЦИ (НОВА ФУНКЦИОНАЛНОСТ) ====================

/**
ФУНКЦИЯ ЗА ОЖЕНЯВАНЕ НА ПЛЕННИЦА
*/
window.marryPrisoner = function(index) {
    const prisoner = window.prisoners[index];
    if (!prisoner) {
        alert("Грешка: Пленницата не е намерена!");
        return;
    }
    
    if (!window.currentHero) {
        alert("Няма активен герой!");
        return;
    }
    
    const newHeroId = "wife_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    const wifeHero = {
        id: newHeroId,
        name: prisoner.name,
        leaderName: prisoner.name,
        clan: "Съпруга",
        isJoined: true,
        level: 1,
        xp: 0,
        heroPower: 60 + (prisoner.bonus?.heroPower || 0),
        power: 60 + (prisoner.bonus?.heroPower || 0),
        gold: 800,
        armySize: 150,
        currentArmy: 150,
        currentClass: prisoner.name,
        className: prisoner.name,
        skills: {},
        skillPoints: 0,
        equipment: Array(12).fill(null),
        inventory: [],
        pet: null,
        age: 25,
        race: prisoner.raceId,
        raceBonus: prisoner.bonus
    };
    
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newHeroId] = wifeHero;
    
    if (!window.unlockedLeaders) window.unlockedLeaders = [];
    window.unlockedLeaders.push(wifeHero);
    
    window.prisoners.splice(index, 1);
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.renderTop6LeadersUI === 'function') window.renderTop6LeadersUI();
    
    const bonusText = Object.entries(prisoner.bonus || {})
        .map(([key, value]) => {
            if (key === 'heroPower') return `+${value} сила`;
            if (key === 'defense') return `+${value} защита`;
            if (key === 'goldBonus') return `+${value}% злато`;
            if (key === 'armyBonus') return `+${Math.round(value * 100)}% армия`;
            return `+${value}`;
        })
        .join(', ');
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`💍 БРАК! ${prisoner.name} се присъедини към вашия род! Бонуси: ${bonusText}`);
    }
    
    alert(`💍 Оженихте се за ${prisoner.name}!\n🎉 Тя се присъедини към вашите герои!\n✨ Бонуси: ${bonusText}`);
    
    if (window.openRegionsMap) window.openRegionsMap();
};

/**
ОСНОВНО МЕНЮ ЗА БРАК (ПЪРВО ПЛЕННИЦИ, СЛЕД ТОВА КЛАНОВЕ)
*/
window.openMarriageMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;
    
    // ==================== ПРОВЕРКА ЗА ПЛЕННИЦИ ====================
    if (window.prisoners && window.prisoners.length > 0) {
        let html = `
            <div style="background: rgba(15,15,15,0.85); border-radius: 20px; border: 1px solid #c9a87b; padding: 20px;">
                <div style="text-align: center; border-bottom: 1px solid #c9a87b; padding-bottom: 15px; margin-bottom: 20px;">
                    <div style="font-size: 48px;">💍</div>
                    <h2 style="color: #ffdd99; margin: 10px 0 5px;">КАНДИДАТКИ ЗА БРАК</h2>
                    <p style="color: #ccaa77; font-size: 12px;">Изберете съпруга, за да увеличите рода си</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; max-height: 500px; overflow-y: auto; padding-right: 10px;">
        `;
        
        window.prisoners.forEach((prisoner, index) => {
            const bonusText = Object.entries(prisoner.bonus || {})
                .map(([key, value]) => {
                    if (key === 'heroPower') return `⚔️ +${value} сила`;
                    if (key === 'defense') return `🛡️ +${value} защита`;
                    if (key === 'goldBonus') return `💰 +${value}% злато`;
                    if (key === 'armyBonus') return `⚔️ +${Math.round(value * 100)}% армия`;
                    if (key === 'mysticismBonus') return `🔮 +${Math.round(value * 100)}% мистицизъм`;
                    if (key === 'diplomacyBonus') return `🤝 +${Math.round(value * 100)}% дипломация`;
                    return `✨ +${value}`;
                })
                .join(' · ');
            
            html += `
                <div style="background: rgba(20,20,30,0.6); border: 1px solid rgba(201,168,123,0.4); border-radius: 16px; padding: 12px; display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 40px; min-width: 60px; text-align: center;">${prisoner.icon || '👸'}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #ffdd99;">${prisoner.name}</div>
                        <div style="font-size: 10px; color: #ccaa77;">${prisoner.desc || 'Мистериозна съпруга'}</div>
                        <div style="font-size: 9px; color: #ffaa66;">🎁 ${bonusText}</div>
                    </div>
                    <button class="marry-prisoner-btn" data-index="${index}" style="background:#7a2e1a; border:none; padding: 8px 18px; border-radius: 30px; color:#ffdd99; cursor:pointer;">💍 ОЖЕНИ СЕ</button>
                </div>
            `;
        });
        
        html += `
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button class="menu-btn" onclick="window.openRegionsMap()">🗺️ Назад към картата</button>
                </div>
            </div>
        `;
        
        mainArea.innerHTML = html;
        
        document.querySelectorAll('.marry-prisoner-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                window.marryPrisoner(idx);
            });
        });
        return;
    }
    
    // ==================== АКО НЯМА ПЛЕННИЦИ – ОРИГИНАЛНО МЕНЮ С КЛАНОВЕ ====================
    const hero = window.currentHero;
    if (!hero) return;
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let skills = hero.skills || {};
    let charismaDiscount = Math.min(0.50, (skills.charisma || 0) * 0.10);
    let baseMarriageCost = 300;
    let finalMarriageCost = Math.max(50, Math.floor(baseMarriageCost * (1 - charismaDiscount)));
    
    let diplomacyBonus = (skills.diplomacy || 0) * 5;
    let baseSuccessChance = 50 + diplomacyBonus;
    
    let html = `
        <section class="rpg-section animate-fade" style="background: rgba(15,15,15,0.85); border: 1px solid #d4af37; padding: 20px; border-radius: 8px;">
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; text-transform: uppercase;">Династични Бракове</h2>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 15px;">Изпратете дарове и поискайте ръката на родова княгиня за вечен военен съюз.</p>
            
            <div style="background:rgba(0,0,0,0.4); border:1px solid #222; padding:10px; margin-bottom:15px; font-size:12px; border-radius:4px;">
                💰 Цена за пратеничество: <strong style="color:#ffd700;">${finalMarriageCost} злато</strong> | 
                 Базов шанс за успех: <strong style="color:#00ffcc;">${baseSuccessChance}%</strong>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 280px; overflow-y: auto; padding-right: 5px;">
    `;
    
    Object.keys(window.clanRelations).forEach(clan => {
        if (clan !== hero.clan) {
            let rel = window.clanRelations[clan] || 40;
            html += `
                <div style="border: 1px solid #333; padding: 8px; background: rgba(255,255,255,0.01); border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="font-size: 12px; font-weight: bold; color: #fff;">Род ${clan}</div>
                    <div style="font-size: 11px; color: ${rel >= 70 ? '#00ffcc' : '#ff3366'}; margin: 3px 0;">Отношения: ${rel}/100</div>
                    <button class="action-btn" style="padding: 5px; font-size: 10px; margin-top: 5px;" onclick="window.proposeMarriage('${clan}', ${finalMarriageCost}, ${baseSuccessChance})">
                        💍 Предложи Брак
                    </button>
                </div>
            `;
        }
    });
    
    html += `
            </div>
            <button class="menu-btn" onclick="if(window.openRegionsMap){window.openRegionsMap();}else{location.reload();}" style="margin-top: 15px; width: 100%;">
                Върни се към Картата
            </button>
        </section>
    `;
    
    mainArea.innerHTML = html;
};

/**
ОРИГИНАЛНА ФУНКЦИЯ ЗА ПРЕДЛАГАНЕ НА БРАК НА КЛАН
*/
window.proposeMarriage = function(clan, cost, successChance) {
    const hero = window.currentHero;
    if (!hero) return;
    
    if ((hero.gold || 0) < cost) {
        alert("Хазната на вашия род е празна! Нуждаете се от повече злато за дарове.");
        return;
    }
    
    hero.gold -= cost;
    
    let currentRel = window.clanRelations[clan] || 40;
    let finalChance = Math.min(95, successChance + Math.floor((currentRel - 40) * 0.5));
    let roll = Math.random() * 100;
    
    if (roll < finalChance) {
        window.clanRelations[clan] = 100;
        
        const dowryMap = {
            "Дуло": "Дардания",
            "Комитопули": "Пелагония",
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
        window.currentSpouse = { name: `Княгиня от рода ${clan}`, clan: clan };

        if (!window.playerRegions) window.playerRegions = [];
        
        const ownedRegionsFlat = window.playerRegions.flat();

        if (!ownedRegionsFlat.includes(region)) {
            window.playerRegions.push(region);
            if (window.worldData && window.worldData.regions && window.worldData.regions[region]) {
                window.worldData.regions[region].armySize = 0;
            }
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`👑 ДИНАСТИЧЕН ТРИУМФ: Кан ${hero.name} сключи свещен съюз с род ${clan}! Като зестра бяха предадени ключовете за регион "${region}".`);
        }
        alert(`Успех! Род ${clan} прие даровете и сключи династичен брак с вашия род. Получавате регион "${region}" като зестра!`);
    } else {
        window.clanRelations[clan] = Math.max(10, currentRel - 10);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`💔 ДИПЛОМАТИЧЕСКИ ХЛАД: Пратениците на Кан ${hero.name} бяха отхвърлени от старейшините на род ${clan}. Подаръците са задържани, а преговорите — прекратени.`);
        }
        alert("Предложението беше отхвърлено! Старейшините на рода сметнаха даровете за недостатъчни.");
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    window.openMarriageMenu();
};
