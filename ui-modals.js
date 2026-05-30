// ==================== СЪВЕТНИК ПОПАП (ЗАМЕНЯ STANDARD ALERT) ====================
window.showAdvisorPopup = function(title, message, type = "info") {
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

// Помощна функция за получаване на "активния" герой в текущия режим
function getGameHero() {
    if (window.gameMode === 'solo') {
        return window.currentHero || null;
    } else {
        if (typeof window.getStrongestHero === 'function') {
            return window.getStrongestHero();
        }
        if (typeof window.getSelectedHero === 'function') {
            return window.getSelectedHero();
        }
        return null;
    }
}

// ==================== ДУЕЛЕН МОДАЛ (ПРЕДИЗВИКАТЕЛСТВО ОТ НЕЛЮБИМ ГЕРОЙ) ====================
window.showDuelChallenge = function(attackerHero) {
    const oldModal = document.getElementById('duel-modal');
    if (oldModal) oldModal.remove();

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
        let playerHero = getGameHero();
        if (playerHero && playerHero.armySize) {
            let loss = Math.floor(playerHero.armySize * 0.05);
            playerHero.armySize = Math.max(10, playerHero.armySize - loss);
            playerHero.currentArmy = playerHero.armySize;
            if (window.updateCharacterUI) window.updateCharacterUI(playerHero);
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
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
    let playerHero = getGameHero();
    if (!playerHero) return;
    
    let potentialChallengers = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero.isJoined === true && hero.isFavorite !== true && hero !== playerHero) {
            if (hero.name !== playerHero.name) {
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

// ==================== МОДАЛ С ЕЛИТНИ ГЕРОИ (НАЙ-ВИСОК ОПИТ/НИВО) ====================
window.showEliteHeroesModal = function() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true) heroes.push(hero);
        }
    }
    if (heroes.length === 0) {
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("ИНФО", "Няма наети герои.", "info");
        }
        return;
    }
    heroes.sort((a,b) => {
        if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
        let xpA = a.isAuto ? (a.xp || 0) : (a.storedXP || 0);
        let xpB = b.isAuto ? (b.xp || 0) : (b.storedXP || 0);
        return xpB - xpA;
    });
    
    let modal = document.getElementById('elite-heroes-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'elite-heroes-modal';
    modal.className = 'market-modal';
    modal.style.cssText = 'z-index: 200001;';
    
    let gridHtml = '<div class="modal-content" style="max-width: 95%; width: 95%; padding: 15px; overflow-y: auto; max-height: 85vh;">';
    gridHtml += '<h3 style="color:#ffd700; text-align:center;">🏆 ЕЛИТНИ ГЕРОИ (по опит)</h3>';
    gridHtml += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">';
    
    heroes.forEach(hero => {
        const needXP = 100 + (hero.level - 1) * 50;
        const currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
        const xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
        const classIcon = window.getClassIcon ? window.getClassIcon(hero.currentClass) : '⚔️';
        gridHtml += `
            <div class="elite-modal-card" data-id="${hero.clan || hero.name}" style="background: rgba(0,0,0,0.6); border: 1px solid #c9a87b; border-radius: 12px; padding: 8px; cursor: pointer; transition: 0.2s;">
                <div style="font-size: 24px; text-align: center;">${classIcon}</div>
                <div style="font-weight: bold; color: #ffdd99; font-size: 12px; text-align: center;">${hero.name}</div>
                <div style="font-size: 9px; color: #ccaa77; text-align: center;">${hero.currentClass || "Багатур"} · Ниво ${hero.level}</div>
                <div style="background: #2a1a0a; height: 4px; border-radius: 2px; margin: 4px 0;">
                    <div style="background: #44aa44; height: 100%; width: ${xpPercent}%; border-radius: 2px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; margin-top: 4px;">
                    <span>💪 ${hero.heroPower || 100}</span>
                    <span>⚔️ ${hero.armySize || 0}</span>
                </div>
            </div>
        `;
    });
    
    gridHtml += '</div><button class="close-modal-btn" style="margin-top: 15px; background: #2c1a0c; border: none; border-radius: 30px; padding: 8px; color: #ffdd99; cursor: pointer; width: 100%;">Затвори</button></div>';
    modal.innerHTML = gridHtml;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal-btn').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    
    modal.querySelectorAll('.elite-modal-card').forEach(card => {
        card.addEventListener('click', () => {
            const heroId = card.getAttribute('data-id');
            const hero = heroes.find(h => (h.clan === heroId || h.name === heroId));
            if (hero && window.showHeroProfile) {
                modal.remove();
                window.showHeroProfile(hero);
            }
        });
    });
};

// ==================== ГЕНЕРИРАНЕ И СПОДЕЛЯНЕ НА ВИЗИТКА НА ГЕРОЯ (TikTok, Instagram и др.) ====================
window.shareHeroCard = async function(hero) {
    if (!hero) return;

    // Осигуряваме портрет
    if (!hero.portrait && typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(hero).catch(e => console.warn(e));
        await new Promise(r => setTimeout(r, 1500));
    }

    // Контейнер 9:16
    let shareContainer = document.getElementById('hero-share-container');
    if (!shareContainer) {
        shareContainer = document.createElement('div');
        shareContainer.id = 'hero-share-container';
        shareContainer.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 450px;
            height: 800px;
            background: #f4e4c1;
            background-image: radial-gradient(circle at 25% 40%, rgba(0,0,0,0.05) 2%, transparent 2.5%);
            background-size: 30px 30px;
            font-family: 'Cinzel', 'Times New Roman', serif;
            color: #3b2a1f;
            box-shadow: 0 0 30px rgba(0,0,0,0.6);
            z-index: -1;
            overflow: hidden;
            box-sizing: border-box;
            border: 12px double #b87c4f;
            border-radius: 20px;
            position: relative;
        `;
        document.body.appendChild(shareContainer);
    }

    // Данни
    const needXP = (hero.level || 1) * 150;
    const currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
    const xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
    const skillCount = hero.learnedSkills ? Object.keys(hero.learnedSkills).length : 0;
    const petName = hero.pet ? (window.rpgDatabase?.petsDatabase?.[hero.pet]?.name || 'Неизвестен') : 'Няма';
    const heroPower = hero.heroPower || 100;
    const armySize = hero.armySize || 0;
    const clanName = hero.clan || "Независим";
    const era = window.gameTime ? `${window.gameTime.year} г. ${window.gameTime.era}` : "480 г. пр.н.е.";

    // Девиз
    let motto = "С бог и с меч";
    if (clanName === "Дуло") motto = "Бог е нашата крепост";
    else if (clanName === "Асеневци") motto = "Възкръсваме от пепелта";
    else if (clanName === "Македони") motto = "Никога не се предавай";
    else if (hero.currentClass?.includes("Паладин")) motto = "За вяра и отечество";
    else if (hero.currentClass?.includes("Берсерк")) motto = "Кръв и слава";

    // Войски (приоритет фентъзи)
    let allTroops = window.ALL_TROOP_TYPES || [];
    let basicIds = ["infantry", "archers", "cavalry", "elite"];
    let fantasyTroops = allTroops.filter(t => !basicIds.includes(t.id) && (hero.armyDetails[t.id] || 0) > 0);
    let basicTroops = allTroops.filter(t => basicIds.includes(t.id) && (hero.armyDetails[t.id] || 0) > 0);
    let displayTroops = fantasyTroops.length > 0 ? fantasyTroops : basicTroops;
    displayTroops = displayTroops.slice(0, 8);

    let troopsHtml = '';
    if (displayTroops.length > 0) {
        troopsHtml = `<div style="margin: 12px 0 8px; width: 100%;">
            <div style="font-size: 13px; font-weight: bold; text-align: center; color: #8b5a2b; border-bottom: 1px solid #b87c4f; display: inline-block; padding: 0 12px;">ДРУЖИНА</div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 10px; background: rgba(139,69,19,0.1); border-radius: 24px; padding: 8px;">`;
        for (let troop of displayTroops) {
            let count = hero.armyDetails[troop.id] || 0;
            troopsHtml += `
                <div style="display: flex; flex-direction: column; align-items: center; min-width: 55px;">
                    <div style="font-size: 28px;">${troop.icon || '⚔️'}</div>
                    <div style="font-size: 10px; font-weight: bold; color: #5a3a1a;">${troop.name}</div>
                    <div style="font-size: 9px; color: #7a5a3a;">×${count}</div>
                </div>
            `;
        }
        troopsHtml += `</div></div>`;
    } else {
        troopsHtml = `<div style="margin: 12px 0; font-size: 11px; color: #7a5a3a; text-align: center;">Армията чака твоята заповед</div>`;
    }

    // ================= АРТЕФАКТИ =================
    let artifactsList = [];
    if (hero.inventory && Array.isArray(hero.inventory)) {
        artifactsList = hero.inventory.filter(a => a && a.name && a.icon);
    }
    artifactsList = artifactsList.slice(0, 6);

    let artifactsHtml = '';
    if (artifactsList.length > 0) {
        artifactsHtml = `<div style="margin: 8px 0; width: 100%;">
            <div style="font-size: 13px; font-weight: bold; text-align: center; color: #8b5a2b; border-bottom: 1px solid #b87c4f; display: inline-block; padding: 0 12px;">🏺 РЕЛИКВИИ</div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 10px; background: rgba(139,69,19,0.1); border-radius: 24px; padding: 8px;">`;
        for (let art of artifactsList) {
            let shortName = art.name.length > 14 ? art.name.substring(0, 12) + '..' : art.name;
            artifactsHtml += `
                <div style="display: flex; flex-direction: column; align-items: center; min-width: 60px;">
                    <div style="font-size: 28px;">${art.icon || '🏺'}</div>
                    <div style="font-size: 9px; color: #5a3a1a;">${shortName}</div>
                </div>
            `;
        }
        artifactsHtml += `</div></div>`;
    } else {
        artifactsHtml = `<div style="margin: 8px 0; font-size: 11px; color: #7a5a3a; text-align: center;">Няма събрани реликви</div>`;
    }

    // Обработка на портрета (base64)
    let portraitUrl = hero.portrait || '';
    let finalPortraitHtml = '';
    if (portraitUrl) {
        try {
            const response = await fetch(portraitUrl);
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            finalPortraitHtml = `<img src="${base64}" style="width: 85px; height: 85px; border-radius: 50%; border: 3px solid #b87c4f; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">`;
        } catch(e) {
            finalPortraitHtml = `<div style="font-size: 48px;">${window.getClassIcon ? window.getClassIcon(hero.currentClass) : '⚔️'}</div>`;
        }
    } else {
        finalPortraitHtml = `<div style="font-size: 48px;">${window.getClassIcon ? window.getClassIcon(hero.currentClass) : '⚔️'}</div>`;
    }

    // Съдържание на визитката (с артефакти)
    shareContainer.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; padding: 20px 16px; box-sizing: border-box; text-align: center; background: rgba(244,228,193,0.9); overflow-y: auto;">
            <!-- Декоративен горен ръб -->
            <div style="width: 100%; display: flex; justify-content: center; gap: 8px; margin-bottom: 10px;">
                <span style="font-size: 20px;">🏰</span>
                <span style="font-size: 20px;">⚔️</span>
                <span style="font-size: 20px;">🏺</span>
            </div>
            
            <!-- Портрет и име -->
            ${finalPortraitHtml}
            <div style="font-size: 20px; font-weight: bold; color: #4a2a0a; margin-top: 8px;">${hero.name}</div>
            <div style="font-size: 12px; color: #8b5a2b; letter-spacing: 1px;">${clanName} · ${hero.currentClass || 'Багатур'}</div>
            <div style="font-size: 11px; color: #7a5a3a;">Ниво ${hero.level || 1} · ⚔️ ${heroPower} сила</div>
            
            <!-- Епоха и девиз -->
            <div style="background: #e2cfaa; border-radius: 30px; padding: 4px 12px; margin: 12px 0; font-size: 10px; color: #4a2a0a;">
                📜 ${era} · «${motto}»
            </div>
            
            <!-- Статистики -->
            <div style="display: flex; justify-content: space-between; width: 100%; gap: 10px; background: #e2cfaa; border-radius: 40px; padding: 6px 12px; margin-bottom: 8px;">
                <div><span style="font-size: 16px;">⚔️</span><br>${armySize}</div>
                <div><span style="font-size: 16px;">🐾</span><br>${petName}</div>
                <div><span style="font-size: 16px;">📜</span><br>${skillCount} умения</div>
            </div>
            
            <!-- XP лента -->
            <div style="width: 100%; margin: 5px 0;">
                <div style="background: #c4a67a; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: #d4af37; width: ${xpPercent}%; height: 100%; border-radius: 3px;"></div>
                </div>
                <div style="font-size: 9px; color: #7a5a3a; margin-top: 3px;">⭐ ${Math.floor(currentXP)}/${needXP} опит</div>
            </div>
            
            <!-- Войски -->
            ${troopsHtml}
            
            <!-- Артефакти -->
            ${artifactsHtml}
            
            <!-- Долен текст -->
            <div style="margin-top: auto; font-size: 9px; color: #7a5a3a; border-top: 1px solid #b87c4f; padding-top: 10px; width: 100%; display: flex; justify-content: space-between;">
                <span>🏛️ Велика България</span>
                <span>#Стратегия #RPG</span>
            </div>
        </div>
    `;

    await new Promise(r => setTimeout(r, 200));

    if (typeof html2canvas === 'undefined') {
        window.showAdvisorPopup("ГРЕШКА", "html2canvas не е заредена.", "error");
        return;
    }

    try {
        const canvas = await html2canvas(shareContainer, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true,
            allowTaint: false
        });
        const imageData = canvas.toDataURL('image/png');

        if (navigator.share) {
            const blob = await (await fetch(imageData)).blob();
            const file = new File([blob], `${hero.name}_card.png`, { type: 'image/png' });
            await navigator.share({
                title: `Моят герой в "Велика България"`,
                text: `Вижте ${hero.name} (${hero.currentClass})!`,
                files: [file]
            });
            window.showAdvisorPopup("УСПЕХ", "Визитката е споделена!", "success");
        } else {
            const link = document.createElement('a');
            link.download = `${hero.name}_card.png`;
            link.href = imageData;
            link.click();
            window.showAdvisorPopup("УСПЕХ", "Картинката е готова за качване.", "success");
        }
    } catch (err) {
        console.error(err);
        window.showAdvisorPopup("ГРЕШКА", "Неуспешно генериране.", "error");
    }
};

// ====================== ДИПЛОМАЦИЯ HUB (АДАПТИВНА ВЕРСИЯ) ======================
window.openDiplomacyHub = function() {
    let oldModal = document.getElementById('diplomacy-hub-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'diplomacy-hub-modal';
    modal.className = 'modal-overlay';
    modal.style.display = 'flex';

    modal.innerHTML = `
    <div class="modal-content" style="width: 96%; max-width: 1100px; max-height: 94vh; overflow: hidden; display: flex; flex-direction: column; margin: 10px;">
        
        <div style="padding: 15px 20px; background: #1a2538; border-bottom: 2px solid #d4af37; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
            <h2 style="margin:0; color:#ffd700; font-size: 1.4rem;">🕊️ ДИПЛОМАЦИЯ</h2>
            <button onclick="this.closest('.modal-overlay').remove()" style="background:#2c1a0c; color:#ffaa66; border:none; padding:8px 14px; border-radius:50%; font-size:20px; cursor:pointer; width:40px; height:40px;">✕</button>
        </div>
        
        <div style="padding: 15px 10px; overflow-y: auto; flex: 1; background:#0f1625;">
            <table style="width:100%; border-collapse: collapse; color:#ddd; font-size: 0.95rem;">
                <thead style="position: sticky; top: 0; background:#1e2a44; z-index: 10;">
                    <tr>
                        <th style="padding:12px 8px; text-align:left;">Клан</th>
                        <th style="padding:12px 8px;">Отношение</th>
                        <th style="padding:12px 8px; display:none;" class="desktop-only">Статус</th>
                        <th style="padding:12px 8px;">Действия</th>
                    </tr>
                </thead>
                <tbody id="diplomacy-table-body" style="font-size: 0.92rem;"></tbody>
            </table>
        </div>

        <div style="padding:12px; background:#1a2538; text-align:center; font-size:0.85rem; color:#aaa; flex-shrink:0;">
            Отношенията се променят с твоите действия
        </div>
    </div>`;

    document.body.appendChild(modal);
    renderDiplomacyTable();
};

// Обновена render функция с по-добра мобилна поддръжка
function renderDiplomacyTable() {
    const tbody = document.getElementById('diplomacy-table-body');
    if (!tbody) return;

    const relations = window.clanRelations || {};
    let rows = '';

    Object.keys(relations).forEach(clan => {
        const rel = Math.floor(relations[clan] || 50);
        let color = rel >= 70 ? '#4caf50' : (rel >= 40 ? '#ffeb3b' : '#f44336');
        let status = rel >= 70 ? 'Съюзник' : (rel >= 40 ? 'Неутрален' : 'Враждебен');

        rows += `
        <tr style="border-bottom: 1px solid #334466;">
            <td style="padding:14px 8px; font-weight: bold;">${clan}</td>
            <td style="padding:14px 8px; color:${color}; font-weight:bold;">${rel}%</td>
            <td style="padding:14px 8px; display:none;" class="desktop-only">${status}</td>
            <td style="padding:14px 8px;">
                <button onclick="alert('💍 Брак с ${clan} - в разработка')" style="margin:3px; padding:7px 12px; background:#2c5f2c; border:none; border-radius:20px; color:white; font-size:0.9rem;">💍</button>
                <button onclick="alert('🎁 Подарък към ${clan}')" style="margin:3px; padding:7px 12px; background:#b8860b; border:none; border-radius:20px; color:white; font-size:0.9rem;">🎁</button>
            </td>
        </tr>`;
    });

    tbody.innerHTML = rows || `<tr><td colspan="4" style="text-align:center; padding:40px; color:#777;">Все още няма данни за дипломатически отношения...</td></tr>`;
}
