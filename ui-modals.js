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
        if (window.currentHero && window.currentHero.armySize) {
            let loss = Math.floor(window.currentHero.armySize * 0.05);
            window.currentHero.armySize = Math.max(10, window.currentHero.armySize - loss);
            window.currentHero.currentArmy = window.currentHero.armySize;
            if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
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
        if (hero.isJoined === true && hero.isFavorite !== true && hero !== window.currentHero) {
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

    // Ако няма портрет, опитаме да генерираме (но не чакаме дълго)
    if (!hero.portrait && typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(hero).catch(e => console.warn(e));
        await new Promise(r => setTimeout(r, 1500));
    }

    let shareContainer = document.getElementById('hero-share-container');
    if (!shareContainer) {
        shareContainer = document.createElement('div');
        shareContainer.id = 'hero-share-container';
        shareContainer.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 500px;
            background: #0a0a1a;
            border: 2px solid #d4af37;
            border-radius: 20px;
            padding: 20px;
            font-family: 'Cinzel', serif;
            color: white;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
            z-index: -1;
        `;
        document.body.appendChild(shareContainer);
    }

    const needXP = (hero.level || 1) * 150;
    const currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
    const xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
    const skillCount = hero.learnedSkills ? Object.keys(hero.learnedSkills).length : 0;
    const titles = (hero.titles && hero.titles.length) ? hero.titles.slice(0, 2).join(', ') : 'Няма';
    const petName = hero.pet ? (window.rpgDatabase?.petsDatabase?.[hero.pet]?.name || 'Неизвестен') : 'Няма';

    // Използваме портрет, но добавяме crossorigin="anonymous"
    let portraitUrl = hero.portrait || '';
    const portraitHtml = portraitUrl ? 
        `<img src="${portraitUrl}" crossorigin="anonymous" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid #ffd700; margin: 10px auto; display: block; object-fit: cover;">` : 
        `<div style="font-size: 60px; text-align: center;">${window.getClassIcon ? window.getClassIcon(hero.currentClass) : '⚔️'}</div>`;

    shareContainer.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 22px; font-weight: bold; color: #ffd700;">⚔️ ВЕЛИКА БЪЛГАРИЯ ⚔️</div>
            <div style="height: 2px; background: #d4af37; width: 80%; margin: 10px auto;"></div>
            ${portraitHtml}
            <div style="font-size: 18px; font-weight: bold; margin-top: 10px;">${hero.name}</div>
            <div>${window.getClassIcon ? window.getClassIcon(hero.currentClass) : ''} ${hero.currentClass || 'Багатур'}</div>
            <div>⭐ Ниво ${hero.level || 1}</div>
            <div>💪 Сила: ${hero.heroPower || 100}</div>
            <div>⚔️ Армия: ${hero.armySize || 0}</div>
            <div>🐾 Любимец: ${petName}</div>
            <div>📚 Умения: ${skillCount} научени</div>
            <div>🏆 Постижения: ${titles}</div>
            <div class="xp-bar" style="background: #2a1a0a; height: 6px; border-radius: 3px; margin: 10px 0; width: 100%;">
                <div style="background: #44aa44; height: 100%; width: ${xpPercent}%; border-radius: 3px;"></div>
            </div>
            <div style="font-size: 10px; color: #aaa; margin-top: 15px;">#ВеликаБългария #СтратегическаИгра #RPG</div>
        </div>
    `;

    // Изчакваме изображението да се зареди
    if (portraitUrl) {
        await new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve();
            img.onerror = () => resolve(); // продължаваме дори при грешка
            img.src = portraitUrl;
        });
        await new Promise(r => setTimeout(r, 200));
    }

    if (typeof html2canvas === 'undefined') {
        window.showAdvisorPopup("ГРЕШКА", "Библиотеката за генериране на изображения не е заредена.", "error");
        return;
    }

    try {
        const canvas = await html2canvas(shareContainer, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true,      // Разрешава чужди изображения с CORS
            allowTaint: false
        });
        const imageData = canvas.toDataURL('image/png');

        if (navigator.share) {
            const blob = await (await fetch(imageData)).blob();
            const file = new File([blob], `${hero.name}_card.png`, { type: 'image/png' });
            await navigator.share({
                title: `Моят герой в "Велика България"`,
                text: `Вижте моя герой ${hero.name} (Ниво ${hero.level})!`,
                files: [file]
            });
            window.showAdvisorPopup("СПОДЕЛЯНЕ", "Картинката е изпратена към социалната мрежа.", "success");
        } else {
            const link = document.createElement('a');
            link.download = `${hero.name}_card.png`;
            link.href = imageData;
            link.click();
            window.showAdvisorPopup("СПОДЕЛЯНЕ", "Картинката е готова. Можете да я качите ръчно.", "success");
        }
    } catch (err) {
        console.error("Грешка при генериране на картинка:", err);
        window.showAdvisorPopup("ГРЕШКА", "Неуспешно генериране на визитката. Проверете конзолата.", "error");
    }
};
