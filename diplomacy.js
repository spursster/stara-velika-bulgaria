/**
МОДУЛ: ДИПЛОМАЦИЯ И БРАК (ГРАНДИОЗНА ВЕРСИЯ + ХАРМОНИЗИРАНА)
*/

window.clanRelations = window.clanRelations || {};
if (!window.prisoners) window.prisoners = [];

function flattenArray(arr) {
    if (!arr) return [];
    if (!Array.isArray(arr)) return [arr];
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            for (let j = 0; j < arr[i].length; j++) result.push(arr[i][j]);
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}

// Помощна функция за показване на съобщения (попап или alert)
function showDiplomacyMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        alert(message);
    }
}

// ====================== DIPLOMACY INITIALIZATION ======================
window.initDiplomacy = function() {
    console.log("🔄 Започва инициализация на Diplomacy...");

    // Създаваме обекта ако не съществува
    if (!window.clanRelations) {
        window.clanRelations = {};
    }

    // Всички кланове в играта
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", 
        "Даки", "Уния Траки", "Шишмановци", "Македони", 
        "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];

    const hero = window.currentHero;

    // Бонус от Leadership умение
    let leadershipBonus = 0;
    if (hero && hero.skills && hero.skills.leadership) {
        leadershipBonus = hero.skills.leadership * 15;
    }

    // Инициализираме отношенията
    allClans.forEach(clan => {
        // Ако вече има запазени отношения - не ги пипаме
        if (window.clanRelations[clan] === undefined) {
            if (hero && hero.clan === clan) {
                window.clanRelations[clan] = 100;     // Максимални към собствения клан
            } else {
                // Случайни стойности между 35 и 75 + бонус от leadership
                window.clanRelations[clan] = Math.max(35, Math.min(85, 50 + leadershipBonus + Math.floor(Math.random() * 20) - 10));
            }
        }
    });

    console.log("✅ clanRelations успешно инициализирани:", window.clanRelations);

    // Автоматично запазване
    if (typeof window.saveGreatBulgariaGame === 'function') {
        window.saveGreatBulgariaGame();
    }
};

window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;
    const hero = window.currentHero;
    for (let key in window.worldData.clans) {
        const clan = window.worldData.clans[key];
        if (hero && key === hero.clan) continue;
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(clan);
        if ((clan.gold || 0) >= 150) {
            clan.gold -= 100;
            clan.armySize = (clan.armySize || 0) + Math.floor(Math.random() * 25) + 10;
            clan.currentArmy = clan.armySize;
        }
        if (window.gainHeroXP) window.gainHeroXP(clan, 35);
        else {
            clan.xp = (clan.xp || 0) + 35;
            let reqXP = (clan.level || 1) * 150;
            if (clan.xp >= reqXP) {
                clan.xp -= reqXP;
                clan.level = (clan.level || 1) + 1;
                clan.heroPower = (clan.heroPower || 100) + 35;
            }
        }
    }
    if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
};

window.marryPrisoner = function(index) {
    if (!window.prisoners || !window.prisoners[index]) {
        showDiplomacyMessage("ГРЕШКА", "Пленницата не е намерена!", "error");
        return;
    }
    const prisoner = window.prisoners[index];
    if (!window.currentHero) {
        showDiplomacyMessage("ГРЕШКА", "Няма активен герой!", "error");
        return;
    }
    
    const newHeroId = "wife_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    const wifeHero = {
        id: newHeroId,
        name: prisoner.name,
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
        inventory: Array(12).fill(null),
        pet: null,
        age: 25,
        race: prisoner.raceId,
        raceBonus: prisoner.bonus,
        armyDetails: { infantry: 80, archers: 40, cavalry: 20, elite: 10 }
    };
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(wifeHero);
    if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(wifeHero);
    
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newHeroId] = wifeHero;
    if (!window.unlockedHeroes) window.unlockedHeroes = [];
    window.unlockedHeroes.push(wifeHero);
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(wifeHero);
    window.prisoners.splice(index, 1);
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.renderTop6HeroesUI === 'function') window.renderTop6HeroesUI();
    
    const bonusText = Object.entries(prisoner.bonus || {}).map(([k,v]) => `${k}+${v}`).join(', ');
    showDiplomacyMessage("💍 БРАК", `${prisoner.name} се присъедини към вашия род! Бонуси: ${bonusText}`, "success");
    if (window.openRegionsMap) window.openRegionsMap();
};

window.proposeMarriage = function(clan, cost, successChance) {
    const hero = window.currentHero;
    if (!hero) return;
    if ((hero.gold || 0) < cost) {
        showDiplomacyMessage("ГРЕШКА", "Нямате достатъчно злато!", "error");
        return;
    }
    hero.gold -= cost;
    let currentRel = window.clanRelations[clan] || 40;
    let finalChance = Math.min(95, successChance + Math.floor((currentRel - 40) * 0.5));
    let roll = Math.random() * 100;
    if (roll < finalChance) {
        window.clanRelations[clan] = 100;
        const dowryMap = {
            "Дуло": "Дардания", "Комитопули": "Пелагония", "Асеневци": "Илирия",
            "Тертер": "Галатия", "Даки": "Дакия", "Уния Траки": "Мизия",
            "Шишмановци": "Месопотамия", "Македони": "Македония", "Птоломеи": "Кипър",
            "Одриси": "Тракия", "Бесараб": "Добруджа", "Османци Дуло": "Витиния", "Скити": "Сарматия"
        };
        const region = dowryMap[clan] || "Мизия";
        window.currentSpouse = { name: `Княгиня от рода ${clan}`, clan: clan };
        
        // Нормализиране на playerRegions
        if (!window.playerRegions) window.playerRegions = [];
        let normalized = [];
        for (let item of window.playerRegions) {
            if (Array.isArray(item)) {
                for (let sub of item) {
                    if (typeof sub === 'string') normalized.push(sub);
                }
            } else if (typeof item === 'string') {
                normalized.push(item);
            }
        }
        window.playerRegions = normalized;
        
        if (!window.playerRegions.includes(region)) {
            window.playerRegions.push(region);
            if (window.worldData?.regions?.[region]) window.worldData.regions[region].armySize = 0;
            showDiplomacyMessage("🏰 РЕГИОН", `Регионът "${region}" е добавен към вашите владения.`, "success");
        } else {
            showDiplomacyMessage("ℹ️ ИНФО", `Регионът "${region}" вече е ваш.`, "info");
        }
        
        showDiplomacyMessage("👑 ДИНАСТИЧЕН ТРИУМФ", `Сключихте брак с род ${clan}! Получихте регион "${region}".`, "success");
    } else {
        window.clanRelations[clan] = Math.max(10, currentRel - 10);
        showDiplomacyMessage("💔 ОТХВЪРЛЯНЕ", `Предложението за брак с род ${clan} беше отхвърлено.`, "error");
    }
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(hero);
    if (window.openRegionsMap) window.openRegionsMap();
};

// ==================== НОВ ГРАНДИОЗЕН БРАЧЕН ПРОЗОРЕЦ ====================
window.openMarriageMenu = function() {
    console.log("💍 Отваряне на Marriage Menu...");

    // === ЗАЩИТА - инициализация на Diplomacy ===
    if (!window.clanRelations || Object.keys(window.clanRelations).length < 8) {
        console.warn("⚠️ clanRelations не е инициализиран! Инициализирам сега...");
        if (typeof window.initDiplomacy === 'function') {
            window.initDiplomacy();
        }
    }

    // Ако модалът вече съществува — просто го показваме
    let modal = document.getElementById('wm-marriage-modal');
    if (modal) {
        modal.classList.add('active');
        if (typeof loadOldMarriageContent === 'function') loadOldMarriageContent();
        return;
    }

    // Добавяне на стилове
    if (!document.getElementById('wm-marriage-styles')) {
        const style = document.createElement('style');
        style.id = 'wm-marriage-styles';
        style.textContent = `... (твоите стилове остават същите) ...`;
        document.head.appendChild(style);
    }

    // Създаване на модала
    modal = document.createElement('div');
    modal.id = 'wm-marriage-modal';
    modal.className = 'wm-modal active';

    modal.innerHTML = `
        <div class="wm-container">
            <div class="wm-header">
                <h2>💍 Дипломатически Брак и Съюзи</h2>
                <span class="wm-close" onclick="closeMarriageModal()">×</span>
            </div>
            <div class="wm-tabs">
                <button class="wm-tab active" data-tab="new">Нов Брак</button>
                <button class="wm-tab" data-tab="old">Пленници & Династии</button>
            </div>
            <div id="wm-new-tab" class="wm-tab-content active">Ново съдържание...</div>
            <div id="wm-old-tab" class="wm-tab-content"></div>
        </div>
    `;

    document.body.appendChild(modal);

    // === ВСИЧКИ ПОМОЩНИ ФУНКЦИИ ВЪТРЕ В openMarriageMenu ===
    function getAllHeroes() { ... }          // сложи тук оригиналната функция
    function getActiveHeroResources() { ... }
    function updateNewMarriageUI() { ... }
    function startConfetti() { ... }
    function showResult(msg, isSuccess) { ... }
    function performNewWedding() { ... }
    function loadOldMarriageContent() { ... }

    // Свързване на елементите (след като modal е създаден)
    const hero1Select = modal.querySelector('#wm-hero1');
    const hero2Select = modal.querySelector('#wm-hero2');
    const affinityFill = modal.querySelector('#wm-affinity-fill');
    const affinityPercentSpan = modal.querySelector('#wm-affinity-percent');
    const goldCostSpan = modal.querySelector('#wm-gold-cost');
    const powerCostSpan = modal.querySelector('#wm-power-cost');
    const ringStatusSpan = modal.querySelector('#wm-ring-status');
    const potionStatusSpan = modal.querySelector('#wm-potion-status');
    const performBtn = modal.querySelector('#wm-perform');
    const resultDiv = modal.querySelector('#wm-result');
    const oldContentDiv = modal.querySelector('#wm-old-content');

    // Event listeners и инициализация
    // ... (останалата част с addEventListener)

    console.log("✅ Marriage Menu отворен успешно");
};

// Помощна функция за затваряне
window.closeMarriageModal = function() {
    const modal = document.getElementById('wm-marriage-modal');
    if (modal) modal.classList.remove('active');
};
