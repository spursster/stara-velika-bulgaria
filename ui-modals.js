// ==================== СЪВЕТНИК ПОПАП (ЗАМЕНЯ STANDARD ALERT) ====================
window.showAdvisorPopup = function(title, message, type = "info") {
    // Премахваме стар попап, ако има
    const oldPopup = document.getElementById('advisor-popup');
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'advisor-popup';
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 300000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        animation: fadeIn 0.2s ease;
    `;

    let icon = "📜";
    if (type === "success") icon = "✅";
    else if (type === "error") icon = "❌";
    else if (type === "warning") icon = "⚠️";

    popup.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #0a0a1a, #0a0a1a);
            border: 2px solid #d4af37;
            border-radius: 28px;
            max-width: 400px;
            width: 90%;
            padding: 24px 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.3);
            position: relative;
        ">
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #0a0a1a; padding: 0 12px;">
                <span style="font-size: 2rem;">📢</span>
            </div>
            <div style="margin-top: 10px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #ffd700; letter-spacing: 1px;">${icon} ${title}</div>
                <div style="height: 2px; width: 80px; background: #d4af37; margin: 12px auto;"></div>
                <div style="font-size: 1rem; color: #f0e6d0; line-height: 1.5; margin: 15px 0;">
                    ${message}
                </div>
                <button id="close-advisor-popup" style="
                    background: linear-gradient(135deg, #2c1a0c, #1f1207);
                    border: 1px solid #d4af37;
                    border-radius: 40px;
                    padding: 8px 24px;
                    color: #ffd700;
                    font-family: 'Cinzel', serif;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                ">РАЗБРАХ, ВОЕВОДО</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('#close-advisor-popup');
    const closeHandler = () => popup.remove();
    closeBtn.addEventListener('click', closeHandler);
    popup.addEventListener('click', (e) => { if (e.target === popup) closeHandler(); });
};

// ==================== ДУЕЛЕН МОДАЛ (ПРЕДИЗВИКАТЕЛСТВО ОТ НЕЛЮБИМ ГЕРОЙ) ====================
window.showDuelChallenge = function(attackerHero) {
    // Премахваме стар модал, ако има
    const oldModal = document.getElementById('duel-modal');
    if (oldModal) oldModal.remove();

    // Генерираме HTML за армията на атакуващия
    let armyHtml = '';
    if (attackerHero.armyDetails && window.ALL_TROOP_TYPES) {
        armyHtml = '<div style="margin-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 12px;"><h4 style="color:#ffd700; margin: 0 0 8px 0;">⚔️ НЕГОВАТА АРМИЯ ⚔️</h4>';
        for (let troop of window.ALL_TROOP_TYPES) {
            let count = attackerHero.armyDetails[troop.id] || 0;
            if (count > 0) {
                armyHtml += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 11px;">
                                <span>${troop.icon} ${troop.name}</span>
                                <span style="color: #ffaa66;">${count} бр.</span>
                             </div>`;
            }
        }
        armyHtml += '</div>';
    } else {
        armyHtml = '<p style="margin-top: 15px; color: #aaa;">Армията му не е известна</p>';
    }

    const modal = document.createElement('div');
    modal.id = 'duel-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 300001;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        animation: fadeIn 0.2s ease;
    `;

    const attackerName = attackerHero.leaderName || attackerHero.name || "Непознат";
    const attackerClass = attackerHero.currentClass || "Войн";
    const attackerPower = attackerHero.heroPower || 100;
    const portraitUrl = attackerHero.portrait || '';

    const portraitHtml = portraitUrl ? 
        `<img src="${portraitUrl}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #d4af37; margin: 0 auto 10px auto; object-fit: cover;">` :
        `<div style="font-size: 48px; margin-bottom: 10px;">${(window.getClassIcon ? window.getClassIcon(attackerClass) : '⚔️')}</div>`;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #0a0a1a, #0a0a1a);
            border: 2px solid #d4af37;
            border-radius: 28px;
            max-width: 450px;
            width: 90%;
            padding: 24px 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.3);
            position: relative;
        ">
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #0a0a1a; padding: 0 12px;">
                <span style="font-size: 2rem;">⚔️</span>
            </div>
            <div style="margin-top: 10px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #ffd700; letter-spacing: 1px;">ДВУБОЙ</div>
                <div style="height: 2px; width: 80px; background: #d4af37; margin: 12px auto;"></div>
                
                ${portraitHtml}
                <div style="font-size: 1.2rem; font-weight: bold; color: #ffdd99;">${attackerName}</div>
                <div style="font-size: 0.9rem; color: #ccaa77;">${attackerClass} · ⚔️ Сила: ${attackerPower}</div>
                
                ${armyHtml}
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                    <button id="accept-duel" style="
                        background: linear-gradient(135deg, #7a2e1a, #5a1e0a);
                        border: 1px solid #d4af37;
                        border-radius: 40px;
                        padding: 10px 24px;
                        color: #ffdd99;
                        font-family: 'Cinzel', serif;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">⚔️ ПРИЕМИ</button>
                    <button id="flee-duel" style="
                        background: linear-gradient(135deg, #2c1a0c, #1f1207);
                        border: 1px solid #d4af37;
                        border-radius: 40px;
                        padding: 10px 24px;
                        color: #ffdd99;
                        font-family: 'Cinzel', serif;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">🏃 ИЗБЯГАЙ</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const acceptBtn = modal.querySelector('#accept-duel');
    const fleeBtn = modal.querySelector('#flee-duel');

    acceptBtn.onclick = () => {
        modal.remove();
        window.startBattleAgainstHero(attackerHero);
    };

    fleeBtn.onclick = () => {
        modal.remove();
        const attackerNameShow = attackerHero.leaderName || attackerHero.name || "Непознат";
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🏃‍♂️ Избягахте от двубоя с ${attackerNameShow}!`);
        if (window.currentHero && window.currentHero.armySize) {
            let loss = Math.floor(window.currentHero.armySize * 0.05);
            window.currentHero.armySize = Math.max(10, window.currentHero.armySize - loss);
            window.currentHero.currentArmy = window.currentHero.armySize;
            if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
            if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        }
    };
};

// ==================== СТАРТИРАНЕ НА БИТКА СРЕЩУ ГЕРОЙ ====================
window.startBattleAgainstHero = function(enemyHero) {
    if (!enemyHero) return;
    let enemyPower = enemyHero.heroPower || 100;
    let enemyArmy = enemyHero.armySize || 200;
    let finalPower = Math.floor(enemyPower * (enemyArmy / 200));
    const battleTarget = {
        name: enemyHero.leaderName || enemyHero.name,
        armySize: finalPower,
        heroObj: enemyHero,
        isHero: true
    };
    if (typeof window.startBattle === 'function') {
        window.startBattle(battleTarget);
    } else {
        console.error("Battle system not ready");
        if (window.showAdvisorMsg) window.showAdvisorMsg("Бойната система не е готова!");
    }
};

// ==================== ГЕНЕРИРАНЕ НА СЛУЧАЙНО ПРЕДИЗВИКАТЕЛСТВО ====================
window.triggerRandomDuelChallenge = function() {
    if (!window.worldData || !window.worldData.clans) return;
    let potentialChallengers = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        // Условия: герой е нает, НЕ Е любим, НЕ Е текущият активен герой
        if (hero.isJoined === true && hero.isFavorite !== true && hero !== window.currentHero) {
            // Допълнителна проверка за име (за всеки случай)
            if (hero.name !== window.currentHero.name) {
                potentialChallengers.push(hero);
            }
        }
    }
    if (potentialChallengers.length === 0) return;
    const challenger = potentialChallengers[Math.floor(Math.random() * potentialChallengers.length)];
    if (window.showDuelChallenge) {
        window.showDuelChallenge(challenger);
    }
};

window.startBattleAgainstHero = function(enemyHero) {
    if (!enemyHero) return;
    let enemyPower = enemyHero.heroPower || 100;
    let enemyArmy = enemyHero.armySize || 200;
    // Комбинираме мощ и армия
    let finalPower = Math.floor(enemyPower * (enemyArmy / 200));
    const battleTarget = {
        name: enemyHero.leaderName || enemyHero.name,
        armySize: finalPower,
        heroObj: enemyHero,
        isHero: true
    };
    window.startBattle(battleTarget);
};

// ==================== СЪЗДАВАНЕ НА ЛЕГЕНДАРЕН ГЕРОЙ ====================
window.createLegendaryHero = function(baseName = null, customClan = null) {
    // Избор на име от легендарни владетели (ако не е подадено)
    const legendaryNames = ["Атила", "Кубрат", "Симеон Велики", "Александър III Велики", "Спартак", "Децебал", "Калоян", "Самуил", "Владимир Велики", "Ричард Лъвското сърце"];
    const name = baseName || legendaryNames[Math.floor(Math.random() * legendaryNames.length)];
    const clan = customClan || "Легендарен";
    
    // Избор на хибриден клас (от classes.js)
    let className = "Воевода";
    if (window.hybridClasses && window.hybridClasses.length) {
        const highLevelClasses = window.hybridClasses.filter(c => c.reqLevel >= 5);
        if (highLevelClasses.length) {
            className = highLevelClasses[Math.floor(Math.random() * highLevelClasses.length)].name;
        }
    }
    
    // По-висока мощ (200-300) и злато (3000-5000)
    const power = 200 + Math.floor(Math.random() * 150);
    const gold = 3000 + Math.floor(Math.random() * 3000);
    const armySize = 400 + Math.floor(Math.random() * 300);
    
    const newHero = {
        name: name,
        leaderName: name,
        clan: clan,
        isJoined: true,
        isFavoriteInBarracks: false,   // НЕ е любим – за да може да предизвиква
        level: 5 + Math.floor(Math.random() * 4), // Ниво 5-8
        xp: 0,
        heroPower: power,
        power: power,
        gold: gold,
        armySize: armySize,
        currentArmy: armySize,
        currentClass: className,
        className: className,
        age: 30 + Math.floor(Math.random() * 20),
        isAuto: true,
        skillPoints: 3 + Math.floor(Math.random() * 4),
        skills: { tactics: 2, endurance: 2, economy: 2, mysticism: 2, leadership: 2 },
        equipment: Array(12).fill(null),
        inventory: [],
        pet: null,
        learnedSkills: {},
        armyDetails: {
            infantry: Math.floor(armySize * 0.4),
            archers: Math.floor(armySize * 0.2),
            cavalry: Math.floor(armySize * 0.2),
            elite: Math.floor(armySize * 0.1),
            dragon_young: Math.floor(armySize * 0.05),
            wizard: Math.floor(armySize * 0.05)
        }
    };
    
    // Инициализация на RPG данни
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(newHero);
    if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(newHero);
    
    // Добавяне в света
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    const newId = "legendary_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    window.worldData.clans[newId] = newHero;
    if (!window.unlockedLeaders) window.unlockedLeaders = [];
    window.unlockedLeaders.push(newHero);
    
    // Генериране на портрет (асинхронно)
    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(newHero).catch(e => console.warn(e));
    }
    
    // Синхронизация с армията и UI
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(newHero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    
    // Съобщение в летописа
    if (window.addWorldEvent) {
        window.addWorldEvent("🏆 ЛЕГЕНДАРЕН ГЕРОЙ", `${name} (${className}) се появи на сцената!`, "🏆");
    }
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup("ЛЕГЕНДАРЕН ГЕРОЙ", `⭐ Великият ${name} от ${clan} се присъедини към играта! ⭐`, "success");
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🏆 Легендарен герой ${name} се появи!`);
    }
    
    return newHero;
};
