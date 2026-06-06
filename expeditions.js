/**
МОДУЛ: МИСТИЧНИ ПОРТАЛИ И ЕКСПЕДИЦИИ – ВЕЛИКА БЪЛГАРИЯ
ВЕРСИЯ: 6.1 – БЕЗ currentHero, С ОБЩ ДОСТЪП ДО ГЛАВЕН ГЕРОЙ
*/

// Помощна функция за вземане на главния герой (без currentHero)
function getMainHeroForExpeditions() {
    if (window.gameMode === 'solo') return window.currentHero || null;
    if (typeof window.getStrongestHero === 'function') return window.getStrongestHero();
    if (typeof window.getSelectedHero === 'function') return window.getSelectedHero();
    return null;
}

window.addPortalLog = window.addPortalLog || function(heroName, worldName, isVictory) {
    console.log(`[PortalLog] ${heroName} ${isVictory ? 'победи' : 'загуби'} в ${worldName}`);
};

window.unknownWorldsDatabase = [
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

if (window.unknownWorldsDatabase.length < 50) {
    const prefixes = ["Космически ", "Кървав ", "Ефирен ", "Свещен ", "Тъмен ", "Древен ", "Забравен ", "Омагьосан ", "Имперски ", "Див "];
    const suffixes = ["на Перун ", "на Арес ", "на Кронос ", "на Зевс ", "на Озирис ", "на Ищар ", "на Тор ", "на Локи ", "на Сатурн ", "на Нептун "];
    const monsters = ["Дракони ", "Демони ", "Върколаци ", "Елфи-Сенки ", "Големи ", "Орки ", "Горгони ", "Валкирии ", "Архангели ", "Кентаври "];
    const pets = ["Мини-Дракон ", "Цербер ", "Дух на Гората ", "Златен Пегас ", "Сребърна Лисица ", "Огнен Скорпион ", "Нефритен Пантер "];
    const bonuses = ["+10% икономика ", "-10% цена в казарми ", "+15% Дипломация ", "+5% защита на родове ", "Пасивен доход на злато "];
    for (let i = window.unknownWorldsDatabase.length; i < 50; i++) {
        window.unknownWorldsDatabase.push({
            name: `${prefixes[i % prefixes.length]} свят ${suffixes[i % suffixes.length]}`,
            creatureType: monsters[i % monsters.length],
            petName: pets[i % pets.length],
            petBonus: bonuses[i % bonuses.length]
        });
    }
}

window.activePortals = window.activePortals || [];

window.addPortalToRegion = function(regionName, world, enemyLevel) {
    if (!regionName || !world) return false;
    if (window.activePortals.some(p => p.regionName === regionName)) return false;
    window.activePortals.push({
        regionName: regionName,
        world: world,
        enemyLevel: enemyLevel,
        explorationProgress: 0
    });
  if (document.getElementById('interactive-map-modal') && typeof window.refreshMap === 'function') {
    window.refreshMap();
}
    return true;
};

window.removePortalFromRegion = function(regionName) {
    const index = window.activePortals.findIndex(p => p.regionName === regionName);
    if (index !== -1) {
        window.activePortals.splice(index, 1);
       if (document.getElementById('interactive-map-modal') && typeof window.refreshMap === 'function') {
    window.refreshMap();
}
        return true;
    }
    return false;
};

function getRandomRegionWithoutPortal() {
    if (!window.worldData || !window.worldData.regions) return null;
    const allRegions = Object.keys(window.worldData.regions);
    const occupied = window.activePortals.map(p => p.regionName);
    const free = allRegions.filter(r => !occupied.includes(r));
    if (free.length === 0) return null;
    return free[Math.floor(Math.random() * free.length)];
}

window.currentPortalState = window.currentPortalState || {
    currentWorld: window.unknownWorldsDatabase[0],
    isOpen: false,
    explorationProgress: {},
    enemyLevel: 1
};

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
        if (window.addPortalLog) window.addPortalLog(hero.name || hero.leaderName, portalWorld.name, true);
        return true;
    } else {
        const lossPercent = 0.2 + Math.random() * 0.3;
        hero.armySize = Math.max(10, Math.floor((hero.armySize || 200) * (1 - lossPercent)));
        hero.currentArmy = hero.armySize;
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
        if (window.addPortalLog) window.addPortalLog(hero.name || hero.leaderName, portalWorld.name, false);
        return false;
    }
}

function attemptAutonomousPortalEntry() {
    if (!window.worldData || !window.worldData.clans) return;
    if (window.activePortals.length === 0) return;
    let favoriteIds = new Set();
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero.isFavorite === true) favoriteIds.add(key);
    }
    if (Math.random() > 0.25) return;
    let autonomousHeroes = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero.isJoined === true && !favoriteIds.has(key)) {
            autonomousHeroes.push(hero);
        }
    }
    if (autonomousHeroes.length === 0) return;
    const randomHero = autonomousHeroes[Math.floor(Math.random() * autonomousHeroes.length)];
    const randomPortal = window.activePortals[Math.floor(Math.random() * window.activePortals.length)];
    const isVictory = autoBattleForHero(randomHero, randomPortal.world, randomPortal.enemyLevel);
    if (isVictory && Math.random() < 0.1 && !randomHero.pet) {
        randomHero.pet = randomPortal.world.petName;
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🎉 ${randomHero.name} опитоми ${randomPortal.world.petName}!`);
    }
    if (isVictory) {
        randomPortal.explorationProgress = Math.min(100, (randomPortal.explorationProgress || 0) + 5);
        if (randomPortal.explorationProgress >= 100) {
            window.removePortalFromRegion(randomPortal.regionName);
        }
    }
    if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(randomHero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
}

window.advanceExpeditionsTurn = function() {
    if (window.activePortals.length < 3 && Math.random() < 0.3) {
        const randomRegion = getRandomRegionWithoutPortal();
        if (randomRegion) {
            const randomIndex = Math.floor(Math.random() * window.unknownWorldsDatabase.length);
            const selectedWorld = { ...window.unknownWorldsDatabase[randomIndex] };
            const enemyLevel = Math.floor(Math.random() * 1000) + 1;
            window.addPortalToRegion(randomRegion, selectedWorld, enemyLevel);
            if (window.addWorldEvent) {
                window.addWorldEvent("🌀 НОВ ПОРТАЛ", `Мистериозен портал се появи в ${randomRegion}!`, "🌀");
            }
        }
    }
    attemptAutonomousPortalEntry();
    window.updatePortalContainerUI();
};

window.updatePortalContainerUI = function() {
    let container = document.getElementById('clans-container') || document.getElementById('clans-box') || document.querySelector('.clans-section');
    if (!container) {
        container = document.getElementById('sidebar-clans-portal');
        if (!container) {
            container = document.createElement('div');
            container.id = 'sidebar-clans-portal';
            document.body.appendChild(container);
        }
    }
    if (window.activePortals.length === 0) {
        container.innerHTML = `<div style="text-align:center; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:8px;"><span style="font-size:18px;">🌌</span> <b style="color:#ffd700;">МИСТИЧНИ ПОРТАЛИ</b></div><div style="font-size:12px; color:#aaa;">Няма активни портали.</div>`;
        window.hidePortalIndicator();
        return;
    }
    let html = `<div style="text-align:center; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:8px;"><span style="font-size:18px;">🌌</span> <b style="color:#ffd700;">АКТИВНИ ПОРТАЛИ (${window.activePortals.length})</b></div>`;
    window.activePortals.forEach(portal => {
        const progress = portal.explorationProgress || 0;
        html += `<div style="font-size:11px; margin-bottom:10px; background:rgba(0,0,0,0.3); border-radius:8px; padding:5px;">
                    <div>📍 ${portal.regionName}</div>
                    <div>🌍 ${portal.world.name}</div>
                    <div>⚠️ Ниво ${portal.enemyLevel}</div>
                    <div class="xp-bar" style="background:#222; height:3px; margin:4px 0;"><div style="width:${progress}%; background:#8a2be2; height:100%;"></div></div>
                    <button class="enter-portal-btn" data-region="${portal.regionName}" style="background:#daa520; border:none; border-radius:20px; padding:2px 8px; color:#000; font-size:10px; cursor:pointer;">🌌 ВЛЕЗ</button>
                </div>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.enter-portal-btn').forEach(btn => {
        btn.onclick = () => {
            const regionName = btn.getAttribute('data-region');
            const portal = window.activePortals.find(p => p.regionName === regionName);
            if (portal) window.enterMysticPortal(regionName);
        };
    });
    window.showPortalIndicator();
};

window.enterMysticPortal = function(regionName) {
    const portalIndex = window.activePortals.findIndex(p => p.regionName === regionName);
    if (portalIndex === -1) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("Този портал вече не съществува!");
        return;
    }
    const portal = window.activePortals[portalIndex];
    let portalTargetRegion = {
        id: "portal_world_" + portal.world.name.replace(/\s+/g, '_'),
        name: `🌌 Портал: ${portal.world.name} (Ниво ${portal.enemyLevel})`,
        armySize: Math.floor(portal.enemyLevel * 1.5) + 80,
        defenseLevel: Math.min(10, Math.ceil(portal.enemyLevel / 100)),
        difficulty: Math.min(100, Math.ceil(portal.enemyLevel / 10)),
        isPortalWorld: true
    };
    if (window.showAdvisorMsg) window.showAdvisorMsg(`🌌 Преминаване през портала в ${regionName}! Навлизате в "${portal.world.name}".`);
    
    if (window.startBattle) {
        window.startBattle(portalTargetRegion);
        const originalEndGroupBattle = window.endGroupBattle || function(){};
        window.endGroupBattle = function(isVictory, reason) {
            originalEndGroupBattle(isVictory, reason);
            if (isVictory) {
                portal.explorationProgress = Math.min(100, (portal.explorationProgress || 0) + 10);
                const diceRoll = Math.floor(Math.random() * 100) + 1;
                if (diceRoll === 77) {
                    let luckyHero = null;
                    if (window._lastBattleHeroes && window._lastBattleHeroes.length) {
                        const alive = window._lastBattleHeroes.filter(h => h.hp > 0);
                        if (alive.length) luckyHero = alive[Math.floor(Math.random() * alive.length)];
                    }
                    if (luckyHero && luckyHero.clanObj) {
                        luckyHero.clanObj.pet = portal.world.petName;
                        if (window.worldData && window.worldData.clans && luckyHero.clanObj.clan) {
                            window.worldData.clans[luckyHero.clanObj.clan].pet = portal.world.petName;
                        }
                        if (window.showAdvisorMsg) window.showAdvisorMsg(`🎉 ЛЕГЕНДАРЕН КЪСМЕТ! ${luckyHero.name} опитоми "${portal.world.petName}"!`);
                    } else {
                        // В класически режим – опитваме главния герой
                        const mainHero = getMainHeroForExpeditions();
                        if (mainHero) {
                            mainHero.pet = portal.world.petName;
                            if (window.showAdvisorMsg) window.showAdvisorMsg(`🎉 ЛЕГЕНДАРЕН КЪСМЕТ! ${mainHero.name} опитоми "${portal.world.petName}"!`);
                        }
                    }
                }
                if (portal.explorationProgress >= 100) {
                    window.removePortalFromRegion(regionName);
                    if (window.showAdvisorMsg) window.showAdvisorMsg(`🌀 Порталът в ${regionName} се затвори след пълно проучване!`);
                } else {
                    window.updatePortalContainerUI();
                   if (document.getElementById('interactive-map-modal') && typeof window.refreshMap === 'function') {
    window.refreshMap();
}
                }
            } else {
                if (window.showAdvisorMsg) window.showAdvisorMsg(`💔 Загубихте битката. Порталът в ${regionName} остава отворен.`);
            }
            window.endGroupBattle = originalEndGroupBattle;
        };
    }
};

window.openExpeditionsMenu = function() {
    if (document.getElementById('expeditions-modal')) return;
    if (window.activePortals.length === 0) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ЕКСПЕДИЦИИ", "Няма активни портали в момента.", "info");
        return;
    }
    const modal = document.createElement('div');
    modal.id = 'expeditions-modal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 200000; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif;`;
    let content = `<div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; padding: 25px; max-width: 400px; width: 90%; text-align: center; position: relative;"> 
        <button class="close-modal-x" style="position: absolute; top: 10px; left: 10px; background: rgba(255,80,80,0.2); border: none; color: #ff8888; font-size: 20px; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">✕</button>
        <h2 style="color: #ffd700;">🌌 Мистични Експедиции</h2>
        <div style="margin: 15px 0; text-align: left;">`;
    window.activePortals.forEach(portal => {
        content += `<div style="margin-bottom: 12px; background:rgba(0,0,0,0.3); border-radius:12px; padding:8px;">
                        <div>📍 Регион: <strong>${portal.regionName}</strong></div>
                        <div>🌍 Свят: ${portal.world.name}</div>
                        <div>⚠️ Опасност: Ниво ${portal.enemyLevel}</div>
                        <div>📊 Проучване: ${portal.explorationProgress || 0}%</div>
                        <button class="enter-portal-modal-btn" data-region="${portal.regionName}" style="background:#daa520; border:none; border-radius:20px; padding:4px 12px; margin-top:6px; cursor:pointer;">🌌 ВЛЕЗ</button>
                    </div>`;
    });
    content += `</div><button class="close-modal-footer" style="background:#2c2c3a; border:1px solid #d4af37; color:#ffd700; padding:8px 16px; border-radius:30px; cursor:pointer; width:100%; margin-top:15px;">Затвори</button></div>`;
    modal.innerHTML = content;
    document.body.appendChild(modal);
    const closeModal = () => modal.remove();
    modal.querySelectorAll('.close-modal-x, .close-modal-footer').forEach(btn => btn.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.querySelectorAll('.enter-portal-modal-btn').forEach(btn => {
        btn.onclick = () => {
            const region = btn.getAttribute('data-region');
            closeModal();
            window.enterMysticPortal(region);
        };
    });
};

setTimeout(() => {
    createPortalIndicator();
    window.updatePortalContainerUI();
}, 1000);

console.log("✅ expeditions.js версия 6.1 зареден – без currentHero, с getMainHeroForExpeditions()");
