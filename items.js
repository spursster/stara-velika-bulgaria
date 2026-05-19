/**
МОДУЛ: АРТЕФАКТИ И СВЕЩЕНА СЪКРОВИЩНИЦА - Велика България
СТАТУС: НАПЪЛНО НАДГРАДЕН (СИНХРОНИЗАЦИЯ С DIABLO МИСТИЦИЗЪМ & ИНВЕНТАР НА ВЛАДЕТЕЛЯ)
КОРЕКЦИЯ: Бонусите от предмети се начисляват динамично и се влияят от мистицизма на Кан-а.
*/

// База данни с имперски артефакти и родови реликви на 13-те велики фамилии
// ИЗЧИСТЕНИ ВСИЧКИ ИНТЕРВАЛИ В КЛЮЧОВЕТЕ И СТОЙНОСТИТЕ
window.artifactsDatabase = {
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "️", bonus: { heroPower: 60 }, clan: "Дуло" },
    "scepter_of_philip": { id: "scepter_of_philip", name: "Скиптърът на Филип II", icon: "🔱", bonus: { heroPower: 50 }, clan: "Македони" },
    "decebalus_shield": { id: "decebalus_shield", name: "Щитът на Децебал", icon: "️", bonus: { heroPower: 45 }, clan: "Даки" },
    "thracian_rhyton": { id: "thracian_rhyton", name: "Златен Ритон от Панагюрище", icon: "🍷", bonus: { goldBonus: 40 }, clan: "Уния Траки" },
    "shishman_crown": { id: "shishman_crown", name: "Короната на Шишмановци", icon: "", bonus: { heroPower: 55 }, clan: "Шишмановци" },
    "soter_seal": { id: "soter_seal", name: "Печатът на Птолемей I Сотер", icon: "️", bonus: { goldBonus: 50 }, clan: "Птоломеи" },
    "odrysian_helmet": { id: "odrysian_helmet", name: "Параден шлем на Севт III", icon: "🪖", bonus: { heroPower: 40 }, clan: "Одриси" },
    "asenevtsi_bow": { id: "asenevtsi_bow", name: "Лъкът на Калоян", icon: "🏹", bonus: { heroPower: 50 }, clan: "Асеневци" },
    "terter_ring": { id: "terter_ring", name: "Пръстенът на Тертеровци", icon: "💍", bonus: { heroPower: 35 }, clan: "Тертер" },
    "besarab_dagger": { id: "besarab_dagger", name: "Кинжалът на Басараб", icon: "🗡️", bonus: { heroPower: 30 }, clan: "Бесараб" },
    "scythian_akinakes": { id: "scythian_akinakes", name: "Скитски Акинакес", icon: "⚔️", bonus: { heroPower: 45 }, clan: "Скити" },
    "osmanci_saber": { id: "osmanci_saber", name: "Сабята на Османци Дуло", icon: "⚔️", bonus: { heroPower: 40 }, clan: "Османци Дуло" }
};

/**
ИЗЧИСЛЯВАНЕ НА ВСИЧКИ БОНУСИ ОТ ИНВЕНТАРА НА ТЕКУЩИЯ ГЕРОЙ
*/
window.getInventoryBonuses = function(hero) {
    let totalBonus = { heroPower: 0, goldBonus: 0 };
    
    if (!hero || !hero.inventory || !Array.isArray(hero.inventory)) return totalBonus;
    
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let mysticismLevel = hero.skills ? (hero.skills.mysticism || 0) : 0;
    // Ефект от пасив: Мистицизъм -> +10% по-силни реликви на точка
    let mysticismMultiplier = 1 + (mysticismLevel * 0.10);
    
    hero.inventory.forEach(item => {
        let dbItem = window.artifactsDatabase[item.id] || item;
        if (dbItem && dbItem.bonus) {
            if (dbItem.bonus.heroPower) {
                totalBonus.heroPower += Math.floor(dbItem.bonus.heroPower * mysticismMultiplier);
            }
            if (dbItem.bonus.goldBonus) {
                totalBonus.goldBonus += Math.floor(dbItem.bonus.goldBonus * mysticismMultiplier);
            }
        }
    });
    
    return totalBonus;
};

/**
ОТВАРИ СВЕЩЕНАТА ИМПЕРСКА СЪКРОВИЩНИЦА
*/
window.toggleTreasury = function() {
    let treasuryOverlay = document.getElementById('treasury-overlay');
    
    if (treasuryOverlay) {
        treasuryOverlay.remove();
        return;
    }
    
    const hero = window.currentHero;
    if (!hero) return;
    
    // Осигуряваме масив за инвентар, ако липсва такъв
    if (!hero.inventory) hero.inventory = [];
    
    treasuryOverlay = document.createElement('div');
    treasuryOverlay.id = 'treasury-overlay';
    treasuryOverlay.className = 'fullscreen-overlay';
    treasuryOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; 
        z-index: 9999;
    `;
    
    // Сглобяване на решетката с предмети
    let gridHTML = "";
    
    if (hero.inventory.length === 0) {
        gridHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #555; padding: 40px 10px; font-style: italic; font-size: 13px;">
                Сандъците в съкровищницата са празни.<br>
                Изпратете Кан ${hero.name} на Велика Експедиция, за да намерите древни реликви!
            </div>`;
    } else {
        let mysticismLevel = hero.skills ? (hero.skills.mysticism || 0) : 0;
        let mysticismMultiplier = 1 + (mysticismLevel * 0.10);
        
        hero.inventory.forEach((item, index) => {
            let dbItem = window.artifactsDatabase[item.id] || item;
            let currentPower = dbItem.bonus.heroPower ? Math.floor(dbItem.bonus.heroPower * mysticismMultiplier) : 0;
            let currentGold = dbItem.bonus.goldBonus ? Math.floor(dbItem.bonus.goldBonus * mysticismMultiplier) : 0; // FIXED TYPO

            let bonusText = currentPower ? `+${currentPower} Бойна Мощ` : `+${currentGold} Златен Добив`;
            let itemClan = dbItem.clan ? `Род ${dbItem.clan}` : "Свещен Артефакт";

            gridHTML += `
                <div class="skill-node" style="background: rgba(255,255,255,0.02); border: 1px solid #333; border-radius: 6px; padding: 12px; text-align: center; position: relative;">
                    <div style="font-size: 24px; margin-bottom: 5px;">${dbItem.icon || ""}</div>
                    <div style="font-size: 12px; font-weight: bold; color: #ffd700; margin-bottom: 3px; line-height: 1.2;">${dbItem.name}</div>
                    <div style="font-size: 10px; color: #00ffcc; font-weight: bold; margin-bottom: 4px;">${bonusText}</div>
                    <div style="font-size: 9px; color: #666;">${itemClan}</div>
                </div>
            `;
        });
    }

    let invBonuses = window.getInventoryBonuses(hero);
    
    treasuryOverlay.innerHTML = `
        <div class="battle-box" style="background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; border-radius: 8px; max-width: 500px; width: 92%; box-sizing: border-box; position: relative;">
            <div onclick="window.toggleTreasury()" style="position: absolute; top: 10px; right: 15px; color: #ff3366; font-weight: bold; cursor: pointer; font-size: 20px;">×</div>
            <h3 style="margin-top: 0; color: #ffd700; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; text-align: center; font-family: 'Cinzel', serif; letter-spacing: 1px;">
                 РОДОВА СЪКРОВИЩНИЦА 👑
            </h3>

            <p style="font-size: 12px; color: #aaa; text-align: center; margin-bottom: 15px;">
                Реликви и артефакти, придобити от славни походи, укрепващи божествения статус на рода Ви.
            </p>

            <div style="display: flex; gap: 10px; justify-content: center; background: rgba(0,0,0,0.4); border: 1px solid #222; padding: 8px; border-radius: 4px; font-size: 11px; margin-bottom: 15px; color: #ccc;">
                <div>⚔️ Обща мощ от предмети: <strong style="color: #00ffcc;">+${invBonuses.heroPower}</strong></div>
                <div>|</div>
                <div>💰 Спечелен златен бонус: <strong style="color: #ffd700;">+${invBonuses.goldBonus}%</strong></div>
            </div>

            <div id="treasury-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; max-height: 260px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px;">
                ${gridHTML}
            </div>

            <button class="menu-btn" onclick="window.toggleTreasury()" style="width: 100%; margin: 0;">ЗАТВОРИ СЪКРОВИЩНИЦАТА</button>
        </div>
    `;
    
    document.body.appendChild(treasuryOverlay);
    
    // Опресняваме профила при преглед, за да сме сигурни в актуалността на данните
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};

// Записваме функцията в глобалното пространство под две имена за съвместимост със старите бутони в HTML
window.openInventory = window.toggleTreasury;
