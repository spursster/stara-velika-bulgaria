/**
МОДУЛ: ДИПЛОМАЦИЯ И БРАК (ГРАНДИОЗНА ВЕРСИЯ + ХАРМОНИЗИРАНА)
ВЕРСИЯ: 8.1 – ПОПРАВЕН СИНТАКСИС И ОТВАРЯНЕ НА БРАЧНИЯ ПРОЗОРЕЦ
*/
// Гилдии и фракции
window.guilds = {
    merchants: { name: "Търговска гилдия", influence: 0, joined: false, benefits: { goldBonus: 0, tradeDiscount: 0 } },
    warriors: { name: "Гилдия на воините", influence: 0, joined: false, benefits: { attackBonus: 0, armyRecruitmentSpeed: 0 } },
    mages: { name: "Магическа гилдия", influence: 0, joined: false, benefits: { spellPower: 0, artifactDiscovery: 0 } }
};
window.factions = {
    duloSupporters: { name: "Поддръжници на Дуло", influence: 0, joined: false, benefits: { legitimacy: 0, cavalryBonus: 0 } },
    asenCouncil: { name: "Тайният съвет на Асеневци", influence: 0, joined: false, benefits: { defenseBonus: 0, resurrectionChance: 0 } }
};
window.guildQuests = [];

window.clanRelations = window.clanRelations || {};
if (!window.prisoners) window.prisoners = [];

// Показва предложение за присъединяване към гилдия (в летописа)
window.offerGuildJoin = function(guildId) {
    const guild = window.guilds[guildId];
    if (!guild || guild.joined) return;
    if (window.ChronicleEvents && typeof window.ChronicleEvents.generateGuildOffer === 'function') {
        const ev = window.ChronicleEvents.generateGuildOffer(guildId);
        window.showAdvisorMsg(ev.message, ev.buttons);
    } else {
        window.showAdvisorMsg(`🏛️ Можете да се присъедините към ${guild.name}. Тази функция ще бъде достъпна скоро.`);
    }
};

// Изпълнение на задача за гилдия (заглушка – попълнете по-късно)
window.completeGuildQuest = function(guildId, questId) {
    console.log(`completeGuildQuest: ${guildId}, ${questId} – все още не е имплементирано`);
    window.showAdvisorMsg(`Задачата за гилдията ще бъде добавена в следващо обновление.`);
};

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

function showDiplomacyMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        alert(message);
    }
}

// ==================== ПОМОЩНА ФУНКЦИЯ ЗА ГЛАВЕН ГЕРОЙ ====================
function getMainDiplomacyHero() {
    if (window.gameMode === 'solo') return window.currentHero || null;
    if (typeof window.getStrongestHero === 'function') return window.getStrongestHero();
    if (typeof window.getSelectedHero === 'function') return window.getSelectedHero();
    return null;
}

// ====================== DIPLOMACY INITIALIZATION ======================
window.initDiplomacy = function() {
    console.log("🔄 Започва инициализация на Diplomacy...");

    if (!window.clanRelations) {
        window.clanRelations = {};
    }

    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки",
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];

    const hero = getMainDiplomacyHero();
    let leadershipBonus = 0;
    if (hero && hero.skills && hero.skills.leadership) {
        leadershipBonus = hero.skills.leadership * 15;
    }

    allClans.forEach(clan => {
        if (window.clanRelations[clan] === undefined) {
            if (hero && hero.clan === clan) {
                window.clanRelations[clan] = 100;
            } else {
                window.clanRelations[clan] = Math.max(35, Math.min(85, 50 + leadershipBonus + Math.floor(Math.random() * 20) - 10));
            }
        }
    });

    console.log("✅ clanRelations успешно инициализирани:", window.clanRelations);

    if (typeof window.saveGreatBulgariaGame === 'function') {
        window.saveGreatBulgariaGame();
    }
};

// ====================== ОСТАНАЛИТЕ ФУНКЦИИ ======================
window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;
    const mainHero = getMainDiplomacyHero();
    for (let key in window.worldData.clans) {
        const clan = window.worldData.clans[key];
        if (mainHero && key === mainHero.clan) continue;
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
    if (typeof window.updateStrongestHeroUI === 'function') {
        window.updateStrongestHeroUI();
    }
};

window.marryPrisoner = function(index) {
    if (!window.prisoners || !window.prisoners[index]) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Пленницата не е намерена!", "error");
        return;
    }
    
    let hero = null;
    if (window.gameMode === 'solo') {
        hero = window.currentHero;
    } else {
        if (typeof window.getSelectedHero === 'function') hero = window.getSelectedHero();
        if (!hero && typeof window.getStrongestHero === 'function') hero = window.getStrongestHero();
    }
    if (!hero) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Няма намерен герой за брак!", "error");
        return;
    }
    
    const prisoner = window.prisoners[index];
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
    
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    
    const bonusText = Object.entries(prisoner.bonus || {}).map(([k,v]) => `${k}+${v}`).join(', ');
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup("💍 БРАК", `${prisoner.name} се присъедини към вашия род! Бонуси: ${bonusText}`, "success");
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`💍 БРАК: ${prisoner.name} се присъедини към вашия род! Бонуси: ${bonusText}`);
    }
    if (window.openRegionsMap) window.openRegionsMap();
};

// ==================== ПРЕДЛОЖЕНИЕ ЗА СЪЮЗ МЕЖДУ ГЕРОИ ====================
window.proposeAlliance = function(proposer, target) {
    if (!proposer || !target) {
        window.showAdvisorMsg("Невалидни герои за съюз.");
        return false;
    }
    if (proposer === target) {
        window.showAdvisorMsg("Не можете да предложите съюз на себе си.");
        return false;
    }
    if (proposer.allies && proposer.allies.includes(target.name)) {
        window.showAdvisorMsg(`Вече сте съюзници с ${target.name}.`);
        return false;
    }
    
    if (window.ChronicleEvents && typeof window.ChronicleEvents.generateAllianceProposal === 'function') {
        const ev = window.ChronicleEvents.generateAllianceProposal(proposer, target);
        window.showAdvisorMsg(ev.message, ev.buttons);
        return true;
    }
    
    // Резервен вариант
    let result = confirm(`${proposer.name} предлага съюз на ${target.name}. Приемате ли?`);
    if (result) {
        if (!proposer.allies) proposer.allies = [];
        if (!target.allies) target.allies = [];
        proposer.allies.push(target.name);
        target.allies.push(proposer.name);
        window.showAdvisorMsg(`✅ ${proposer.name} и ${target.name} вече са съюзници!`);
    } else {
        window.showAdvisorMsg(`❌ ${target.name} отказа съюза.`);
    }
    return result;
};

window.proposeMarriage = function(clan, cost, successChance) {
    let hero = null;
    if (window.gameMode === 'solo') {
        hero = window.currentHero;
    } else {
        if (typeof window.getSelectedHero === 'function') hero = window.getSelectedHero();
        if (!hero && typeof window.getStrongestHero === 'function') hero = window.getStrongestHero();
    }
    if (!hero) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Няма намерен герой за брак!", "error");
        return;
    }
    
    if ((hero.gold || 0) < cost) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Нямате достатъчно злато!", "error");
        return;
    }
    
    if (!window.clanRelations) window.clanRelations = {};
    let currentRel = window.clanRelations[clan] || 40;
    
    // ========== ДОБАВЕНИ БОНУСИ ОТ ХАРАКТЕР ==========
    let personalityBonuses = window.getPersonalityBonuses ? window.getPersonalityBonuses(hero) : {};
    let diplomacyMod = (personalityBonuses.diplomacyBonus || 0) * 10; // +10% за всяка 0.1 бонус
    let finalChance = Math.min(95, successChance + Math.floor((currentRel - 40) * 0.5) + diplomacyMod);
    // =================================================
    
    let roll = Math.random() * 100;
    
    hero.gold -= cost;
    
    if (roll < finalChance) {
        window.clanRelations[clan] = 100;
        const dowryMap = {
            "Дуло": "Дардания", "Комитопули": "Пелагония", "Асеневци": "Илирия",
            "Тертер": "Галатия", "Даки": "Дакия", "Уния Траки": "Мизия",
            "Шишмановци": "Месопотамия", "Македони": "Македония", "Птоломеи": "Кипър",
            "Одриси": "Тракия", "Бесараб": "Добруджа", "Османци Дуло": "Витиния", "Скити": "Сарматия"
        };
        const region = dowryMap[clan] || "Мизия";
        if (!window.playerRegions) window.playerRegions = [];
        if (!window.playerRegions.includes(region)) {
            window.playerRegions.push(region);
            if (window.worldData?.regions?.[region]) window.worldData.regions[region].armySize = 0;
        }
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("👑 ДИНАСТИЧЕН ТРИУМФ", `Сключихте брак с род ${clan}! Получихте регион "${region}".`, "success");
        } else if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`👑 ДИНАСТИЧЕН ТРИУМФ: Сключихте брак с род ${clan}! Получихте регион "${region}".`);
        }
    } else {
        window.clanRelations[clan] = Math.max(10, currentRel - 10);
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("💔 ОТХВЪРЛЯНЕ", `Предложението за брак с род ${clan} беше отхвърлено.`, "error");
        } else if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`💔 Предложението за брак с род ${clan} беше отхвърлено.`);
        }
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
};

// ==================== НОВ ГРАНДИОЗЕН БРАЧЕН ПРОЗОРЕЦ ====================
window.openMarriageMenu = function() {
    if (!window.clanRelations || Object.keys(window.clanRelations).length < 8) {
        console.warn("⚠️ clanRelations не е инициализиран! Инициализирам...");
        if (typeof window.initDiplomacy === 'function') {
            window.initDiplomacy();
        }
    }

    function closeMarriageModal() {
        const modal = document.getElementById('wm-marriage-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) modal.remove();
            }, 300);
        }
    }

    let modal = document.getElementById('wm-marriage-modal');
    if (modal) {
        modal.classList.add('active');
        if (typeof loadOldMarriageContent === 'function') {
            loadOldMarriageContent();
        }
        return;
    }

    if (!document.getElementById('wm-marriage-styles')) {
        const style = document.createElement('style');
        style.id = 'wm-marriage-styles';
        style.textContent = `
            .wm-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); backdrop-filter: blur(14px); z-index: 300000; display: none; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; }
            .wm-modal.active { display: flex; }
            .wm-container { background: linear-gradient(145deg, rgba(20,15,30,0.98), rgba(5,5,15,0.98)); border-radius: 48px; border: 2px solid rgba(212,175,55,0.8); width: 95%; max-width: 1300px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.4); padding: 20px; position: relative; }
            .wm-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap; }
            .wm-header h2 { font-family: 'Cinzel', serif; color: #ffd966; margin: 0; font-size: 1.8rem; }
            .wm-close { font-size: 40px; cursor: pointer; color: #ffd700; transition: 0.2s; }
            .wm-close:hover { color: #ff6666; transform: scale(1.1); }
            .wm-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 8px; flex-wrap: wrap; }
            .wm-tab { background: rgba(30,30,40,0.6); border: none; padding: 8px 20px; border-radius: 40px; color: #ffd966; cursor: pointer; font-weight: bold; }
            .wm-tab.active { background: #daa520; color: #000; box-shadow: 0 0 8px gold; }
            .wm-tab-content { display: none; }
            .wm-tab-content.active { display: block; }
            .wm-selectors { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; margin-bottom: 30px; }
            .wm-selector-card { background: rgba(0,0,0,0.6); border-radius: 36px; padding: 20px; flex: 1; min-width: 240px; border: 1px solid rgba(255,215,0,0.5); }
            .wm-selector-card h3 { color: #ffd966; text-align: center; font-family: 'Cinzel', serif; }
            .wm-hero-select { width: 100%; padding: 12px; background: #1e1e2a; border: 1px solid #d4af37; border-radius: 60px; color: #ffecb3; font-size: 1rem; margin-bottom: 15px; cursor: pointer; }
            .wm-stats-preview { background: rgba(0,0,0,0.5); border-radius: 24px; padding: 12px; text-align: center; font-size: 0.85rem; }
            .wm-affinity-meter { background: rgba(0,0,0,0.6); border-radius: 40px; padding: 15px; margin: 20px 0; text-align: center; }
            .wm-affinity-bar { height: 20px; background: #333; border-radius: 20px; overflow: hidden; margin: 8px 0; }
            .wm-affinity-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #ff416c, #ff4b2b); transition: width 0.5s ease; }
            .wm-costs { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px; background: rgba(0,0,0,0.4); border-radius: 30px; padding: 15px; margin: 15px 0; }
            .wm-cost-item .amount { font-size: 1.6rem; font-weight: bold; color: #ffaa44; }
            .wm-boost { display: flex; align-items: center; gap: 12px; background: rgba(212,175,55,0.15); padding: 8px 16px; border-radius: 60px; cursor: pointer; transition: 0.2s; margin: 10px 0; }
            .wm-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin: 30px 0 20px; }
            .wm-btn { background: linear-gradient(135deg, #b8860b, #daa520); border: none; padding: 14px 28px; border-radius: 60px; font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: bold; color: #1e1a0c; cursor: pointer; transition: all 0.3s; }
            .wm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .wm-result { text-align: center; background: rgba(0,0,0,0.7); border-radius: 30px; padding: 15px; margin-top: 20px; border-left: 6px solid #ffd700; display: none; }
            .wm-prisoner-list, .wm-clan-list { max-height: 300px; overflow-y: auto; margin: 15px 0; }
            .wm-prisoner-card, .wm-clan-card { background: rgba(0,0,0,0.5); border-radius: 20px; padding: 12px; margin-bottom: 10px; border: 1px solid #d4af37; }
            @media (max-width: 800px) {
                .wm-selectors { flex-direction: column; }
                .wm-header h2 { font-size: 1.5rem; }
                .wm-btn { padding: 10px 20px; font-size: 1rem; }
                .wm-cost-item .amount { font-size: 1.2rem; }
            }
        `;
        document.head.appendChild(style);
    }

    modal = document.createElement('div');
    modal.id = 'wm-marriage-modal';
    modal.className = 'wm-modal';
    modal.innerHTML = `
        <div class="wm-container">
            <div class="wm-header">
                <h2>💒 Свещен съюз на родовете 💒</h2>
                <div class="wm-close">×</div>
            </div>
            <div class="wm-tabs">
                <button class="wm-tab active" data-tab="new">✨ Нов брак (романтичен)</button>
                <button class="wm-tab" data-tab="old">🏛️ Традиционен брак</button>
            </div>
            <div id="wm-new-tab" class="wm-tab-content active">
                <div class="wm-selectors">
                    <div class="wm-selector-card">
                        <h3>👑 Първи съпруг</h3>
                        <select id="wm-hero1" class="wm-hero-select"></select>
                        <div id="wm-hero1-preview" class="wm-stats-preview">-- изберете герой --</div>
                    </div>
                    <div class="wm-selector-card">
                        <h3>👑 Втори съпруг</h3>
                        <select id="wm-hero2" class="wm-hero-select"></select>
                        <div id="wm-hero2-preview" class="wm-stats-preview">-- изберете герой --</div>
                    </div>
                </div>
                <div class="wm-affinity-meter">
                    <div>💖 Съвместимост (Афинитет)</div>
                    <div class="wm-affinity-bar"><div id="wm-affinity-fill" class="wm-affinity-fill"></div></div>
                    <div id="wm-affinity-percent" class="wm-affinity-text">0%</div>
                </div>
                <div class="wm-costs">
                    <div class="wm-cost-item">💰 Цена: <span id="wm-gold-cost" class="amount">500</span> злато</div>
                    <div class="wm-cost-item">⚡ Сила: <span id="wm-power-cost" class="amount">100</span> мощ</div>
                    <div class="wm-cost-item">💍 Пръстен: <span id="wm-ring-status" class="amount">1</span></div>
                </div>
                <div id="wm-potion-boost" class="wm-boost">
                    🧪 <strong>Сватбен еликсир</strong> (+25% успех) &nbsp; <span id="wm-potion-status">❌ нямаш</span>
                </div>
                <div class="wm-actions">
                    <button id="wm-perform" class="wm-btn">💒 Встъпете в брак 💒</button>
                    <button id="wm-reset" class="wm-btn" style="background:#5a3a2a;">🔄 Изчисти</button>
                </div>
                <div id="wm-result" class="wm-result"></div>
            </div>
            <div id="wm-old-tab" class="wm-tab-content">
                <div id="wm-old-content"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    function getAllHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    heroes.push({
                        id: clan.clan || key,
                        name: clan.name || clan.leaderName || key,
                        level: clan.level || 1,
                        power: clan.power || (clan.heroPower || 50),
                        gold: clan.gold || 0,
                        class: clan.currentClass || "Воевода",
                        affinityBonus: clan.affinityBonus || 10,
                        inventory: clan.inventory || {}
                    });
                }
            }
        }
        if (heroes.length === 0) {
            let fallback = getMainDiplomacyHero();
            if (fallback) {
                heroes.push({
                    id: fallback.clan || "hero",
                    name: fallback.name || "Воевода",
                    level: fallback.level || 1,
                    power: fallback.power || (fallback.heroPower || 50),
                    gold: fallback.gold || 0,
                    class: fallback.currentClass || "Воевода",
                    affinityBonus: fallback.affinityBonus || 10,
                    inventory: fallback.inventory || {}
                });
            }
        }
        return heroes;
    }

    function getActiveHeroResources() {
        let hero = getMainDiplomacyHero();
        let hasRing = hero && hero.inventory && hero.inventory.weddingRing ? true : false;
        let hasPotion = hero && hero.inventory && hero.inventory.weddingPotion ? true : false;
        return {
            gold: hero ? hero.gold : 0,
            power: hero ? (hero.power || hero.heroPower || 50) : 0,
            hasWeddingRing: hasRing,
            hasPotion: hasPotion
        };
    }

    function updateNewMarriageUI() {
        let heroes = getAllHeroes();
        let hero1 = heroes.find(h => h.id == hero1Select.value);
        let hero2 = heroes.find(h => h.id == hero2Select.value);
        let preview1 = document.getElementById('wm-hero1-preview');
        let preview2 = document.getElementById('wm-hero2-preview');
        preview1.innerHTML = hero1 ? `⚔️ ${hero1.name} | Lv.${hero1.level} | ⚡${hero1.power}` : "-- изберете герой --";
        preview2.innerHTML = hero2 ? `⚔️ ${hero2.name} | Lv.${hero2.level} | ⚡${hero2.power}` : "-- изберете герой --";

        let affinity = 0;
        if (hero1 && hero2 && hero1.id !== hero2.id) {
            let base = 50;
            let classBonus = (hero1.class === hero2.class) ? 15 : 5;
            let levelDiff = Math.abs(hero1.level - hero2.level);
            let levelPenalty = Math.min(30, levelDiff * 3);
            affinity = base + (hero1.affinityBonus || 0) + (hero2.affinityBonus || 0) + classBonus - levelPenalty;
            affinity = Math.min(100, Math.max(0, affinity));
        }
        affinityFill.style.width = affinity + '%';
        affinityPercentSpan.innerText = affinity + '%';

        let goldCost = 500 + (hero1 ? hero1.level * 20 : 0) + (hero2 ? hero2.level * 20 : 0);
        let powerCost = 100 + (hero1 ? hero1.power * 0.2 : 0) + (hero2 ? hero2.power * 0.2 : 0);
        goldCostSpan.innerText = Math.floor(goldCost);
        powerCostSpan.innerText = Math.floor(powerCost);

        let resources = getActiveHeroResources();
        ringStatusSpan.innerHTML = resources.hasWeddingRing ? "1 ✅" : "1 ❌";
        potionStatusSpan.innerText = resources.hasPotion ? "✅ активен (+25% успех)" : "❌ нямаш";

        let canAfford = (resources.gold >= goldCost && resources.power >= powerCost && resources.hasWeddingRing && hero1 && hero2 && hero1.id !== hero2.id);
        performBtn.disabled = !canAfford;
    }

    function startConfetti() {
        if (typeof window.confetti === 'function') window.confetti();
        else console.log("🎉 Confetti!");
    }

    function showResult(msg, isSuccess) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = msg;
        resultDiv.style.background = isSuccess ? "rgba(0,80,0,0.7)" : "rgba(80,0,0,0.7)";
        resultDiv.style.borderLeftColor = isSuccess ? "#44ff44" : "#ff4444";
        setTimeout(() => { if(resultDiv) resultDiv.style.display = 'none'; }, 6000);
    }

    function performNewWedding() {
        let heroes = getAllHeroes();
        let hero1 = heroes.find(h => h.id == hero1Select.value);
        let hero2 = heroes.find(h => h.id == hero2Select.value);
        if (!hero1 || !hero2 || hero1.id === hero2.id) {
            showResult("Изберете два различни героя!", false);
            return;
        }
        let resources = getActiveHeroResources();
        let goldCost = parseInt(goldCostSpan.innerText);
        let powerCost = parseInt(powerCostSpan.innerText);
        if (resources.gold < goldCost || resources.power < powerCost || !resources.hasWeddingRing) {
            showResult("Недостатъчни ресурси за брак!", false);
            return;
        }
        let affinity = parseInt(affinityPercentSpan.innerText);
        let potionBonus = resources.hasPotion ? 25 : 0;
        let successChance = Math.min(95, affinity + potionBonus);
        let roll = Math.random() * 100;
        if (roll < successChance) {
            const newHeroName = `${hero1.name} & ${hero2.name}`;
            const newHeroId = "child_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
            const newHero = {
                id: newHeroId,
                name: newHeroName,
                clan: "Съюзен род",
                isJoined: true,
                isFavorite: true,
                level: 1,
                xp: 0,
                heroPower: Math.floor((hero1.power + hero2.power) / 2) + 50,
                power: Math.floor((hero1.power + hero2.power) / 2) + 50,
                gold: 500,
                armySize: 200,
                currentArmy: 200,
                currentClass: "Наследник",
                className: "Наследник",
                skills: {},
                skillPoints: 0,
                equipment: Array(12).fill(null),
                inventory: [],
                pet: null,
                age: 1,
                learnedSkills: {},
                morale: 70,
                maxHp: 100,
                hp: 100,
                isAlive: true,
                armyDetails: { infantry: 100, archers: 50, cavalry: 30, elite: 20 }
            };
            if (window.initializeHeroRPGData) window.initializeHeroRPGData(newHero);
            if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(newHero);
            window.worldData.clans[newHeroId] = newHero;
            if (!window.unlockedHeroes) window.unlockedHeroes = [];
            window.unlockedHeroes.push(newHero);
            let payingHero = getMainDiplomacyHero();
            if (payingHero) {
                payingHero.gold -= goldCost;
                payingHero.power -= powerCost;
                if (payingHero.power < 0) payingHero.power = 0;
                if (payingHero.inventory && payingHero.inventory.weddingRing) {
                    delete payingHero.inventory.weddingRing;
                }
                if (payingHero.inventory && payingHero.inventory.weddingPotion) {
                    delete payingHero.inventory.weddingPotion;
                }
            }
            showResult(`🎉 Бракът между ${hero1.name} и ${hero2.name} бе успешен! Роден е нов герой: ${newHero.name}!`, true);
            startConfetti();
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
            if (window.renderSingleBar) window.renderSingleBar();
            updateNewMarriageUI();
        } else {
            showResult(`💔 Бракът се провали. (Шанс ${successChance}%)`, false);
        }
    }

    function loadOldMarriageContent() {
        if (!oldContentDiv) return;
        let heroes = getAllHeroes();
        let clansList = Object.keys(window.clanRelations).map(clan => {
            let rel = window.clanRelations[clan] || 40;
            let cost = 500 + Math.floor((100 - rel) * 3);
            let success = Math.min(85, 40 + Math.floor(rel / 2));
            return `<div class="wm-clan-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${clan}</strong> (Отношение: ${rel}%)</div>
                            <button class="propose-marriage-btn" data-clan="${clan}" data-cost="${cost}" data-success="${success}" style="background:#daa520; border:none; border-radius:30px; padding:4px 12px; cursor:pointer;">💍 Предложи (💰${cost})</button>
                        </div>
                    </div>`;
        }).join('');
        let prisonersHtml = window.prisoners.map((p, idx) => `
            <div class="wm-prisoner-card">
                <div><span style="font-size:24px;">${p.icon || '👸'}</span> <strong>${p.name}</strong> (${p.desc})</div>
                <button class="marry-prisoner-btn" data-idx="${idx}" style="background:#daa520; border:none; border-radius:20px; padding:4px 12px; margin-top:8px;">💒 Ожени се</button>
            </div>
        `).join('');
        oldContentDiv.innerHTML = `
            <h3>🏛️ Традиционен брак с клан</h3>
            <p>Сключете династичен брак с друг род, за да увеличите отношенията и да получите зестра.</p>
            <div class="wm-clan-list">${clansList || "<p>Няма кланове</p>"}</div>
            <h3>👸 Пленници за брак</h3>
            <div class="wm-prisoner-list">${prisonersHtml || "<p>Няма пленници</p>"}</div>
        `;
        oldContentDiv.querySelectorAll('.propose-marriage-btn').forEach(btn => {
            btn.onclick = () => {
                let clan = btn.getAttribute('data-clan');
                let cost = parseInt(btn.getAttribute('data-cost'));
                let success = parseInt(btn.getAttribute('data-success'));
                window.proposeMarriage(clan, cost, success);
                closeMarriageModal();
                setTimeout(() => window.openMarriageMenu(), 500);
            };
        });
        oldContentDiv.querySelectorAll('.marry-prisoner-btn').forEach(btn => {
            btn.onclick = () => {
                let idx = parseInt(btn.getAttribute('data-idx'));
                window.marryPrisoner(idx);
                closeMarriageModal();
                setTimeout(() => window.openMarriageMenu(), 500);
            };
        });
    }

    let hero1Select = modal.querySelector('#wm-hero1');
    let hero2Select = modal.querySelector('#wm-hero2');
    let affinityFill = modal.querySelector('#wm-affinity-fill');
    let affinityPercentSpan = modal.querySelector('#wm-affinity-percent');
    let goldCostSpan = modal.querySelector('#wm-gold-cost');
    let powerCostSpan = modal.querySelector('#wm-power-cost');
    let ringStatusSpan = modal.querySelector('#wm-ring-status');
    let potionStatusSpan = modal.querySelector('#wm-potion-status');
    let performBtn = modal.querySelector('#wm-perform');
    let resultDiv = modal.querySelector('#wm-result');
    let oldContentDiv = modal.querySelector('#wm-old-content');

    let heroesList = getAllHeroes();
    hero1Select.innerHTML = '<option value="">-- избери герой --</option>';
    hero2Select.innerHTML = '<option value="">-- избери герой --</option>';
    heroesList.forEach(hero => {
        let opt1 = document.createElement('option');
        opt1.value = hero.id;
        opt1.textContent = `${hero.name} (Lv.${hero.level})`;
        hero1Select.appendChild(opt1);
        let opt2 = opt1.cloneNode(true);
        hero2Select.appendChild(opt2);
    });

    hero1Select.addEventListener('change', updateNewMarriageUI);
    hero2Select.addEventListener('change', updateNewMarriageUI);
    performBtn.addEventListener('click', performNewWedding);
    modal.querySelector('#wm-reset').addEventListener('click', () => {
        hero1Select.value = '';
        hero2Select.value = '';
        updateNewMarriageUI();
        resultDiv.style.display = 'none';
    });

    let tabs = modal.querySelectorAll('.wm-tab');
    let newTab = modal.querySelector('#wm-new-tab');
    let oldTab = modal.querySelector('#wm-old-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            let target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (target === 'new') {
                newTab.classList.add('active');
                oldTab.classList.remove('active');
            } else {
                oldTab.classList.add('active');
                newTab.classList.remove('active');
                loadOldMarriageContent();
            }
        });
    });

    let closeBtn = modal.querySelector('.wm-close');
    closeBtn.addEventListener('click', closeMarriageModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeMarriageModal(); });

    updateNewMarriageUI();
    loadOldMarriageContent();

    modal.classList.add('active');
};

// ==================== ПОЛИТИЧЕСКА СИСТЕМА – СЪВЕТНИЦИ И БОРБА ЗА ТРОН ====================

// --- 1. Структура на съвета за всеки клан ---
if (!window.clanCouncil) window.clanCouncil = {};
if (!window.clanBonuses) window.clanBonuses = {};

// Помощна функция за намиране на герой по ID (или по име/clan)
function getHeroByIdOrName(identifier) {
    if (!window.worldData || !window.worldData.clans) return null;
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.id === identifier || h.name === identifier || h.clan === identifier) return h;
    }
    return null;
}

// --- 2. Назначаване на съветник ---
window.appointCouncilor = function(clanName, position, heroId) {
    if (!clanName || !position) return false;
    if (!window.clanCouncil[clanName]) window.clanCouncil[clanName] = {};
    
    const hero = getHeroByIdOrName(heroId);
    if (!hero || hero.clan !== clanName) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Героят не принадлежи на клан ${clanName}!`);
        return false;
    }
    
    // Проверка дали позицията е валидна
    const validPositions = ["chancellor", "marshal", "steward", "spymaster", "chaplain"];
    if (!validPositions.includes(position)) return false;
    
    window.clanCouncil[clanName][position] = hero.id || hero.name;
    window.recalcCouncilBonuses(clanName);
    
    if (window.addWorldEvent) {
        window.addWorldEvent("🏛️ НАЗНАЧЕНИЕ", `${hero.name} стана ${window.getPositionName(position)} на клан ${clanName}.`, "👑");
    }
    return true;
};

// --- 3. Освобождаване на съветник ---
window.dismissCouncilor = function(clanName, position) {
    if (!window.clanCouncil[clanName] || !window.clanCouncil[clanName][position]) return false;
    delete window.clanCouncil[clanName][position];
    window.recalcCouncilBonuses(clanName);
    if (window.addWorldEvent) window.addWorldEvent("🏛️ ОСВОБОЖДАВАНЕ", `Позицията ${window.getPositionName(position)} на клан ${clanName} освободена.`, "📜");
    return true;
};

// --- 4. Имена на позициите (за UI) ---
window.getPositionName = function(position) {
    const names = {
        chancellor: "Канцлер (дипломация)",
        marshal: "Маршал (армия)",
        steward: "Стюард (икономика)",
        spymaster: "Шпионски майстор (разузнаване)",
        chaplain: "Свещеник (мистика)"
    };
    return names[position] || position;
};

// --- 5. Изчисляване на бонусите от съветниците ---
window.recalcCouncilBonuses = function(clanName) {
    if (!window.clanCouncil[clanName]) window.clanCouncil[clanName] = {};
    const council = window.clanCouncil[clanName];
    let bonuses = { armyBonus: 0, goldBonus: 0, diplomacyBonus: 0, spyDefense: 0, mysticismBonus: 0 };
    
    for (let [pos, heroRef] of Object.entries(council)) {
        if (!heroRef) continue;
        const hero = getHeroByIdOrName(heroRef);
        if (!hero || hero.isAlive === false) continue;
        
        // Вземаме умения (hero.skills) или бонус от черти
        let diplomacy = hero.skills?.diplomacy || 0;
        let command = hero.skills?.command || hero.skills?.leadership || 0;
        let economy = hero.skills?.economy || hero.skills?.trade || 0;
        let mysticism = hero.skills?.mysticism || 0;
        
        switch(pos) {
            case "chancellor":
                bonuses.diplomacyBonus += 0.05 + diplomacy * 0.02;
                break;
            case "marshal":
                bonuses.armyBonus += 0.1 + command * 0.03;
                break;
            case "steward":
                bonuses.goldBonus += 0.1 + economy * 0.05;
                break;
            case "spymaster":
                bonuses.spyDefense += 10 + hero.level * 2;
                break;
            case "chaplain":
                bonuses.mysticismBonus += 0.1 + mysticism * 0.02;
                break;
        }
    }
    window.clanBonuses[clanName] = bonuses;
    return bonuses;
};

// --- 6. Вземане на бонус за даден клан (използва се от economy, battle, diplomacy) ---
window.getClanBonus = function(clanName, bonusType) {
    if (!window.clanBonuses[clanName]) window.recalcCouncilBonuses(clanName);
    const bonuses = window.clanBonuses[clanName] || {};
    return bonuses[bonusType] || 0;
};

// --- 7. Борба за трон (проверка при смяна на ход) ---
window.checkSuccessionCrisis = function(clanName) {
    if (!clanName) return;
    // Събираме всички живи наети герои от този клан
    const heroesInClan = [];
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.clan === clanName && h.isJoined === true && h.isAlive !== false) {
            heroesInClan.push(h);
        }
    }
    if (heroesInClan.length < 2) return;
    
    // Сортираме по сила (heroPower)
    heroesInClan.sort((a,b) => (b.heroPower || 0) - (a.heroPower || 0));
    const leader = heroesInClan[0];
    const challenger = heroesInClan[1];
    
    // Ако challenger има поне 80% от силата на leader, има риск от борба
    const leaderPower = leader.heroPower || 100;
    const challengerPower = challenger.heroPower || 100;
    if (challengerPower >= leaderPower * 0.8 && Math.random() < 0.05) { // 5% шанс на ход
        // Задействаме събитие
        if (window.addWorldEvent) {
            window.addWorldEvent("⚔️ БОРБА ЗА ТРОН", `В клан ${clanName} избухна борба за власт между ${leader.name} и ${challenger.name}!`, "⚔️");
        }
        
        // Ако някой от тях е герой на играча – показваме бутони
        const isPlayerLeader = (typeof isMyHero === 'function' && isMyHero(leader));
        const isPlayerChallenger = (typeof isMyHero === 'function' && isMyHero(challenger));
        
        if (isPlayerLeader || isPlayerChallenger) {
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`Кого подкрепяте в борбата за трон на ${clanName}?`, [
                    { label: `🏆 ${leader.name}`, action: () => window.resolveSuccession(clanName, leader, challenger) },
                    { label: `👑 ${challenger.name}`, action: () => window.resolveSuccession(clanName, challenger, leader) },
                    { label: "🤝 Опит за помирение", action: () => window.attemptReconciliation(clanName, leader, challenger) }
                ]);
            }
        } else {
            // Симулираме изход според силите
            const leaderWins = Math.random() < (leaderPower / (leaderPower + challengerPower));
            window.resolveSuccession(clanName, leaderWins ? leader : challenger, leaderWins ? challenger : leader);
        }
    }
};

// --- 8. Разрешаване на борбата ---
window.resolveSuccession = function(clanName, winner, loser) {
    if (!winner || !loser) return;
    // Победителят остава, победеният напуска клана и умира (или става независим)
    loser.isJoined = false;
    loser.isAlive = false;
    
    // Прехвърляме регионите на победения към победителя
    if (window.playerRegions && Array.isArray(window.playerRegions.flat)) {
        const loserRegions = [];
        for (let i = 0; i < window.playerRegions.length; i++) {
            if (window.playerRegions[i] === loser.name || window.playerRegions[i] === loser.clan) {
                loserRegions.push(window.playerRegions[i]);
            }
        }
        loserRegions.forEach(region => {
            if (!window.playerRegions.includes(region)) window.playerRegions.push(region);
        });
    }
    
    // Победителят получава бонус мощ
    winner.heroPower = (winner.heroPower || 100) + 50;
    if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
    
    if (window.addWorldEvent) {
        window.addWorldEvent("👑 НОВ ВЛАДЕТЕЛ", `${winner.name} спечели борбата за трон на ${clanName}. ${loser.name} е победен и изчезнал!`, "👑");
    }
};

// --- 9. Опит за помирение (намалява напрежението) ---
window.attemptReconciliation = function(clanName, heroA, heroB) {
    // Намаляваме силата на challenger с 10%, увеличаваме лоялност
    heroB.heroPower = Math.max(50, (heroB.heroPower || 100) * 0.9);
    if (window.addWorldEvent) {
        window.addWorldEvent("🤝 ПОМИРЕНИЕ", `В клан ${clanName} конфликтът между ${heroA.name} и ${heroB.name} беше потушен временно.`, "🤝");
    }
};

// --- 10. Извикване на проверка за борба за трон при всеки ход (ако има повече от един герой в клан) ---
// Тази функция трябва да се извиква от processTurn или от края на хода
window.autoCheckSuccession = function() {
    if (!window.worldData || !window.worldData.clans) return;
    const clanSet = new Set();
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.isJoined && h.isAlive !== false && h.clan) clanSet.add(h.clan);
    }
    for (let clan of clanSet) {
        window.checkSuccessionCrisis(clan);
    }
};

console.log("✅ diplomacy.js – добавена политическа система (съветници и борба за трон)");
console.log("✅ diplomacy.js версия 8.1 зареден – без currentHero, с updateStrongestHeroUI и оправен брачен прозорец");
