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

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки",
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];
    const hero = window.currentHero;
    let initialBonus = (hero && hero.skills && (hero.skills.leadership || 0) * 15) || 0;
    allClans.forEach(clan => {
        window.clanRelations[clan] = (hero && clan === hero.clan) ? 100 : Math.min(100, 40 + initialBonus);
    });
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
    function closeMarriageModal() {
    const modal = document.getElementById('wm-marriage-modal');
    if (modal) {
        modal.classList.remove('active');
        // По желание: изчакайте анимацията и след това премахнете модала от DOM
        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 300);
    }
}
    let modal = document.getElementById('wm-marriage-modal');
    if (modal) {
        modal.classList.add('active');
        loadOldMarriageContent();
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
                <div class="wm-close">&times;</div>
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

    // ========== ФУНКЦИИ ЗА НОВИЯ БРАК ==========
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
        if (heroes.length === 0 && window.currentHero) {
            let h = window.currentHero;
            heroes.push({
                id: h.clan || "hero",
                name: h.name || "Воевода",
                level: h.level || 1,
                power: h.power || (h.heroPower || 50),
                gold: h.gold || 0,
                class: h.currentClass || "Воевода",
                affinityBonus: h.affinityBonus || 10,
                inventory: h.inventory || {}
            });
        }
        return heroes;
    }

    function getActiveHeroResources() {
        let hero = window.currentHero;
        if (!hero && window.worldData && window.worldData.clans) {
            for (let k in window.worldData.clans) {
                if (window.worldData.clans[k].isJoined) {
                    hero = window.worldData.clans[k];
                    break;
                }
            }
        }
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
        let canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '300001';
        document.body.appendChild(canvas);
        let ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = [];
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 6 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                speedY: Math.random() * 5 + 3,
                speedX: (Math.random() - 0.5) * 3
            });
        }
        function animate() {
            if (!canvas.parentNode) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let allDead = true;
            for (let p of particles) {
                p.y += p.speedY;
                p.x += p.speedX;
                if (p.y < canvas.height + 100) allDead = false;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            if (!allDead) requestAnimationFrame(animate);
            else canvas.remove();
        }
        animate();
        setTimeout(() => { if(canvas.parentNode) canvas.remove(); }, 4000);
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
            showResult("❌ Изберете два различни героя!", false);
            return;
        }
        let affinity = parseInt(affinityPercentSpan.innerText);
        let resources = getActiveHeroResources();
        let potionBonus = resources.hasPotion ? 25 : 0;
        let successChance = Math.min(98, affinity + potionBonus);
        let goldCost = parseInt(goldCostSpan.innerText);
        let powerCost = parseInt(powerCostSpan.innerText);

        if (resources.gold < goldCost || resources.power < powerCost || !resources.hasWeddingRing) {
            showResult("❌ Недостатъчно ресурси или нямате брачен пръстен!", false);
            return;
        }

        let success = (Math.random() * 100) <= successChance;

        let targetHero = window.currentHero;
        if (!targetHero && window.worldData && window.worldData.clans) {
            for (let k in window.worldData.clans) {
                if (window.worldData.clans[k].isJoined) {
                    targetHero = window.worldData.clans[k];
                    break;
                }
            }
        }
        if (targetHero) {
            targetHero.gold = (targetHero.gold || 0) - goldCost;
            if (targetHero.power) targetHero.power -= powerCost;
            if (targetHero.heroPower) targetHero.heroPower -= powerCost;
            if (targetHero.inventory) {
                if (resources.hasWeddingRing) targetHero.inventory.weddingRing = false;
                if (resources.hasPotion && success) targetHero.inventory.weddingPotion = false;
            }
            if (window.updateCharacterUI) window.updateCharacterUI(targetHero);
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
            if (window.addWorldEvent) window.addWorldEvent("💍 Брак (нов)", `${hero1.name} и ${hero2.name} сключиха брак!`, "💒");
        }

        if (success) {
            showResult(`✅ УСПЕХ! ${hero1.name} и ${hero2.name} вече са семейство. +5% опит за всички! 🎉`, true);
            startConfetti();
            if (hero1.gainXP) hero1.gainXP(50);
            else if (hero1.xp !== undefined) hero1.xp = (hero1.xp || 0) + 50;
            if (hero2.gainXP) hero2.gainXP(50);
            else if (hero2.xp !== undefined) hero2.xp = (hero2.xp || 0) + 50;
        } else {
            showResult(`❌ ПРОВАЛ! Загубихте ресурсите. Опитайте отново с по-висок афинитет или еликсир.`, false);
        }
        updateNewMarriageUI();
    }

    // ========== ТРАДИЦИОНЕН БРАК (СТАРА ЛОГИКА) ==========
    function loadOldMarriageContent() {
        if (!oldContentDiv) return;
        let prisoners = window.prisoners || [];
        let heroes = getAllHeroes();
        let activeHero = window.currentHero;
        let charismaDiscount = (activeHero && activeHero.skills && (activeHero.skills.leadership || 0) * 0.10) || 0;
        let baseMarriageCost = 300;
        let finalMarriageCost = Math.max(50, Math.floor(baseMarriageCost * (1 - charismaDiscount)));
        let diplomacyBonus = (activeHero && activeHero.skills && (activeHero.skills.economy || 0) * 5) || 0;
        let baseSuccessChance = 50 + diplomacyBonus;

        let prisonersHtml = '';
        if (prisoners.length) {
            prisonersHtml = `<h3 style="color:#ffd700;">💍 Кандидатки за брак (пленници)</h3><div class="wm-prisoner-list">`;
            prisoners.forEach((p, idx) => {
                let bonusText = Object.entries(p.bonus || {}).map(([k,v]) => `${k}+${v}`).join(', ');
                prisonersHtml += `
                    <div class="wm-prisoner-card">
                        <div><span style="font-size:24px;">${p.icon || '👸'}</span> <strong>${p.name}</strong></div>
                        <div style="font-size:11px;">${p.desc || ''} | Бонуси: ${bonusText}</div>
                        <button class="wm-marry-prisoner" data-index="${idx}" style="background:#7a2e1a; border:none; padding:5px 12px; border-radius:20px; color:#fff; cursor:pointer; margin-top:5px;">💍 Ожени се</button>
                    </div>
                `;
            });
            prisonersHtml += `</div>`;
        } else {
            prisonersHtml = `<p style="color:#aaa;">Нямате пленници за брак.</p>`;
        }

        let clansHtml = `<h3 style="color:#ffd700;">🏛️ Династични бракове с кланове</h3><div class="wm-clan-list">`;
        for (let clan in (window.clanRelations || {})) {
            if (activeHero && clan !== activeHero.clan) {
                let rel = window.clanRelations[clan] || 40;
                clansHtml += `
                    <div class="wm-clan-card">
                        <div>Род ${clan} (отношения: ${rel}/100)</div>
                        <div style="font-size:11px;">Цена: ${finalMarriageCost}💰 | Шанс: ${baseSuccessChance}%</div>
                        <button class="wm-propose-marriage" data-clan="${clan}" style="background:#daa520; border:none; padding:5px 12px; border-radius:20px; color:#000; cursor:pointer;">💍 Предложи брак</button>
                    </div>
                `;
            }
        }
        clansHtml += `</div>`;

        oldContentDiv.innerHTML = prisonersHtml + clansHtml;

        document.querySelectorAll('.wm-marry-prisoner').forEach(btn => {
            btn.onclick = () => {
                let idx = parseInt(btn.getAttribute('data-index'));
                if (typeof window.marryPrisoner === 'function') {
                    window.marryPrisoner(idx);
                    modal.classList.remove('active');
                } else {
                    showDiplomacyMessage("ГРЕШКА", "Функцията marryPrisoner липсва!", "error");
                }
            };
        });
        document.querySelectorAll('.wm-propose-marriage').forEach(btn => {
            btn.onclick = () => {
                let clan = btn.getAttribute('data-clan');
                if (typeof window.proposeMarriage === 'function') {
                    window.proposeMarriage(clan, finalMarriageCost, baseSuccessChance);
                    modal.classList.remove('active');
                } else {
                    showDiplomacyMessage("ГРЕШКА", "Функцията proposeMarriage липсва!", "error");
                    if (window.addHeroLog) window.addHeroLog(hero, "💍", `Сключи брак с ${partnerName}`);
                }
            };
        });
    }

    // Свързване на DOM елементите
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
    modal.querySelector('#wm-potion-boost').addEventListener('click', () => {
        let resources = getActiveHeroResources();
        let targetHero = window.currentHero;
        if (!targetHero && window.worldData && window.worldData.clans) {
            for (let k in window.worldData.clans) {
                if (window.worldData.clans[k].isJoined) {
                    targetHero = window.worldData.clans[k];
                    break;
                }
            }
        }
        if (resources.hasPotion) {
            if (targetHero && targetHero.inventory) targetHero.inventory.weddingPotion = false;
            potionStatusSpan.innerText = "❌ нямаш";
        } else {
            if (resources.gold >= 300) {
                if (targetHero) {
                    targetHero.gold -= 300;
                    if (!targetHero.inventory) targetHero.inventory = {};
                    targetHero.inventory.weddingPotion = true;
                }
                potionStatusSpan.innerText = "✅ активен (+25% успех)";
                updateNewMarriageUI();
            } else {
                showResult("❌ Нямате 300 злато за закупуване на сватбен еликсир!", false);
            }
        }
        updateNewMarriageUI();
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
   closeBtn.addEventListener('click', () => closeMarriageModal());
   modal.addEventListener('click', (e) => { if (e.target === modal) closeMarriageModal(); });

    updateNewMarriageUI();
    loadOldMarriageContent();

    modal.classList.add('active');
};

window.openMarriageMenu_Old = null;
console.log("✅ diplomacy.js хармонизиран – всички съобщения са със стилен попап, използвани са новите имена на функции.");
