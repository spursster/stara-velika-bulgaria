/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: items.js (АРТЕФАКТИ И СЪКРОВИЩНИЦА)
СТАТУС: НАПЪЛНО ИЗЧИСТЕН И СИНХРОНИЗИРАН
КОРЕКЦИЯ: 
1. Премахнати всички синтактични грешки (напр. (item, index) = >).
2. Коригирани имена на променливи (cu rrentGold -> currentGold).
3. Премахнати интервали в краищата на данните (clan: "Дуло " -> clan: "Дуло").
==========================================================================
*/

// База данни с имперски артефакти и родови реликви на 13-те велики фамилии
window.artifactsDatabase = {
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "🗡️", bonus: { heroPower: 60 }, clan: "Дуло" },
    "scepter_of_philip": { id: "scepter_of_philip", name: "Скиптърът на Филип II", icon: "🔱", bonus: { heroPower: 50 }, clan: "Македони" },
    "decebalus_shield": { id: "decebalus_shield", name: "Щитът на Децебал", icon: "🛡️", bonus: { heroPower: 45 }, clan: "Даки" },
    "thracian_rhyton": { id: "thracian_rhyton", name: "Златен Ритон от Панагюрище", icon: "🍷", bonus: { goldBonus: 40 }, clan: "Уния Траки" },
    "shishman_crown": { id: "shishman_crown", name: "Короната на Шишмановци", icon: "👑", bonus: { heroPower: 55 }, clan: "Шишмановци" },
    "soter_seal": { id: "soter_seal", name: "Печатът на Птолемей I Сотер", icon: "⚜️", bonus: { goldBonus: 50 }, clan: "Птоломеи" },
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
        if (dbItem.bonus) {
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
    treasuryOverlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 9999;`;
    
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
        
        // FIX: Corrected arrow function syntax
        hero.inventory.forEach((item, index) => {
            let dbItem = window.artifactsDatabase[item.id] || item;
            let currentPower = dbItem.bonus.heroPower ? Math.floor(dbItem.bonus.heroPower * mysticismMultiplier) : 0;
            // FIX: Corrected variable name "currentGold"
            let currentGold = dbItem.bonus.goldBonus ? Math.floor(dbItem.bonus.goldBonus * mysticismMultiplier) : 0;

            let bonusText = currentPower ? `+${currentPower} Бойна Мощ` : `+${currentGold} Златен Добив`;
            let itemClan = dbItem.clan ? `Род ${dbItem.clan}` : "Свещен Артефакт";

            gridHTML += `
                <div class="skill-node" style="background: rgba(255,255,255,0.02); border: 1px solid #333; border-radius: 6px; padding: 12px; text-align: center; position: relative;">
                    <div style="font-size: 24px; margin-bottom: 5px;">${dbItem.icon || "🏆"}</div>
                    <div style="font-size: 12px; font-weight: bold; color: #ffd700; margin-bottom: 3px; line-height: 1.2;">${dbItem.name}</div>
                    <div style="font-size: 10px; color: #00ffcc; font-weight: bold; margin-bottom: 4px;">${bonusText}</div>
                    <div style="font-size: 9px; color: #666;">${itemClan}</div>
                </div>
            `;
        });
    }

    let invBonuses = window.getInventoryBonuses(hero);
    
    // FIX: Fixed CSS syntax (1p x -> 1px)
    treasuryOverlay.innerHTML = `
        <div class="battle-box" style="background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; border-radius: 8px; max-width: 500px; width: 92%; box-sizing: border-box; position: relative;">
            <div onclick="window.toggleTreasury()" style="position: absolute; top: 10px; right: 15px; color: #ff3366; font-weight: bold; cursor: pointer; font-size: 20px;">×</div>
            <h3 style="margin-top: 0; color: #ffd700; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; text-align: center; font-family: 'Cinzel', serif; letter-spacing: 1px;">
                 👑 РОДОВА СЪКРОВИЩНИЦА 👑
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


// ==================== 60 ИСТОРИЧЕСКИ АРТЕФАКТА ====================
window.historicalArtifacts = {
    // Тракийски артефакти
    "panagyurishte_treasure": { id: "panagyurishte_treasure", name: "Панагюрско съкровище", icon: "🏺", era: "Тракийски", bonus: { heroPower: 15, goldBonus: 10 }, set: "thracian_royal" },
    "rogosen_treasure": { id: "rogosen_treasure", name: "Рогозенско съкровище", icon: "🏺", era: "Тракийски", bonus: { heroPower: 12, goldBonus: 8 }, set: "thracian_royal" },
    "valchitran_treasure": { id: "valchitran_treasure", name: "Вълчитрънско съкровище", icon: "🏺", era: "Тракийски", bonus: { heroPower: 10, goldBonus: 12 }, set: "thracian_royal" },
    "golden_mask_tervel": { id: "golden_mask_tervel", name: "Златна маска на Терес", icon: "🎭", era: "Тракийски", bonus: { heroPower: 20 }, set: "thracian_kings" },
    "golden_ring_seuthes": { id: "golden_ring_seuthes", name: "Златен пръстен на Севт III", icon: "💍", era: "Тракийски", bonus: { goldBonus: 15 }, set: "thracian_kings" },
    
    // Римски артефакти
    "trajan_column_piece": { id: "trajan_column_piece", name: "Фрагмент от колоната на Траян", icon: "🏛️", era: "Римски", bonus: { heroPower: 18 }, set: "roman_imperial" },
    "constantine_sceptre": { id: "constantine_sceptre", name: "Скиптър на Константин Велики", icon: "🔱", era: "Римски", bonus: { heroPower: 22 }, set: "roman_imperial" },
    "roman_legion_standard": { id: "roman_legion_standard", name: "Легионен орел", icon: "🦅", era: "Римски", bonus: { heroPower: 14, armyBonus: 0.1 }, set: "roman_military" },
    "gladius_of_trajan": { id: "gladius_of_trajan", name: "Гладиус на Траян", icon: "⚔️", era: "Римски", bonus: { heroPower: 20 }, set: "roman_military" },
    "scutum_of_legion": { id: "scutum_of_legion", name: "Легионен щит", icon: "🛡️", era: "Римски", bonus: { defense: 15 }, set: "roman_military" },
    
    // Византийски артефакти
    "justinian_crown": { id: "justinian_crown", name: "Корона на Юстиниан Велики", icon: "👑", era: "Византийски", bonus: { heroPower: 25, goldBonus: 20 }, set: "byzantine_imperial" },
    "theodora_pendant": { id: "theodora_pendant", name: "Медальон на Теодора", icon: "📿", era: "Византийски", bonus: { heroPower: 15, diplomacyBonus: 0.1 }, set: "byzantine_imperial" },
    "hagia_sophia_cross": { id: "hagia_sophia_cross", name: "Кръст от Света София", icon: "✝️", era: "Византийски", bonus: { heroPower: 12, mysticismBonus: 0.15 }, set: "byzantine_holy" },
    "byzantine_icon": { id: "byzantine_icon", name: "Византийска икона", icon: "🖼️", era: "Византийски", bonus: { heroPower: 10, mysticismBonus: 0.1 }, set: "byzantine_holy" },
    "porphyrogennetos_seal": { id: "porphyrogennetos_seal", name: "Печат на Порфирогенит", icon: "🔏", era: "Византийски", bonus: { goldBonus: 25 }, set: "byzantine_administrative" },
    
    // Персийски артефакти
    "cyrus_cylinder": { id: "cyrus_cylinder", name: "Цилиндър на Кир Велики", icon: "📜", era: "Персийски", bonus: { heroPower: 20, diplomacyBonus: 0.15 }, set: "achaemenid_royal" },
    "darius_gold_plate": { id: "darius_gold_plate", name: "Златна плоча на Дарий I", icon: "🥏", era: "Персийски", bonus: { heroPower: 18, goldBonus: 15 }, set: "achaemenid_royal" },
    "persian_rhython": { id: "persian_rhython", name: "Персийски ритон", icon: "🍷", era: "Персийски", bonus: { goldBonus: 20 }, set: "achaemenid_court" },
    "xerxes_sword": { id: "xerxes_sword", name: "Меч на Ксеркс", icon: "⚔️", era: "Персийски", bonus: { heroPower: 22 }, set: "achaemenid_military" },
    "immortal_helmet": { id: "immortal_helmet", name: "Шлем на Безсмъртен войн", icon: "🪖", era: "Персийски", bonus: { defense: 18 }, set: "achaemenid_military" },
    
    // Скитски артефакти
    "scythian_gold_deer": { id: "scythian_gold_deer", name: "Скитски златен елен", icon: "🦌", era: "Скитски", bonus: { heroPower: 15, armyBonus: 0.1 }, set: "scythian_gold" },
    "scythian_animal_style_belt": { id: "scythian_animal_style_belt", name: "Скитски пояс", icon: "🔗", era: "Скитски", bonus: { defense: 12 }, set: "scythian_gold" },
    "scythian_akinakes": { id: "scythian_akinakes", name: "Скитски акинак", icon: "🗡️", era: "Скитски", bonus: { heroPower: 16 }, set: "scythian_warrior" },
    "scythian_gorytos": { id: "scythian_gorytos", name: "Скитски горит", icon: "🏹", era: "Скитски", bonus: { heroPower: 14 }, set: "scythian_warrior" },
    "scythian_cauldron": { id: "scythian_cauldron", name: "Скитски котел", icon: "🍲", era: "Скитски", bonus: { goldBonus: 15 }, set: "scythian_ritual" },
    
    // Келтски артефакти
    "celtic_torc": { id: "celtic_torc", name: "Келтска торква", icon: "📿", era: "Келтски", bonus: { heroPower: 12 }, set: "celtic_noble" },
    "celtic_shield": { id: "celtic_shield", name: "Келтски щит", icon: "🛡️", era: "Келтски", bonus: { defense: 15 }, set: "celtic_warrior" },
    "celtic_sword": { id: "celtic_sword", name: "Келтски дълъг меч", icon: "⚔️", era: "Келтски", bonus: { heroPower: 18 }, set: "celtic_warrior" },
    "celtic_helmet": { id: "celtic_helmet", name: "Келтски шлем", icon: "🪖", era: "Келтски", bonus: { defense: 12 }, set: "celtic_warrior" },
    
    // Готски артефакти
    "gothic_crown_of_theoderic": { id: "gothic_crown_of_theoderic", name: "Корона на Теодорих Велики", icon: "👑", era: "Готски", bonus: { heroPower: 20 }, set: "gothic_royal" },
    "gothic_silver_treasure": { id: "gothic_silver_treasure", name: "Готско сребърно съкровище", icon: "💰", era: "Готски", bonus: { goldBonus: 25 }, set: "gothic_royal" },
    "gothic_brooch": { id: "gothic_brooch", name: "Готска фибула", icon: "🔱", era: "Готски", bonus: { heroPower: 10 }, set: "gothic_art" },
    "gothic_belt_buckle": { id: "gothic_belt_buckle", name: "Готска катарама", icon: "🔗", era: "Готски", bonus: { defense: 10 }, set: "gothic_art" },
    
    // Български артефакти
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "⚔️", era: "Български", bonus: { heroPower: 25 }, set: "bulgarian_royal" },
    "ring_of_tervel": { id: "ring_of_tervel", name: "Пръстенът на Тервел", icon: "💍", era: "Български", bonus: { heroPower: 15, diplomacyBonus: 0.1 }, set: "bulgarian_royal" },
    "madara_horseman_relief": { id: "madara_horseman_relief", name: "Мадарски конник", icon: "🏇", era: "Български", bonus: { heroPower: 20, armyBonus: 0.1 }, set: "bulgarian_sacred" },
    "pliska_rosette": { id: "pliska_rosette", name: "Плисковска розета", icon: "⭐", era: "Български", bonus: { heroPower: 12, mysticismBonus: 0.1 }, set: "bulgarian_sacred" },
    "preslav_gold_treasure": { id: "preslav_gold_treasure", name: "Преславско златно съкровище", icon: "🏺", era: "Български", bonus: { goldBonus: 30 }, set: "bulgarian_imperial" },
    "khan_omurtag_column": { id: "khan_omurtag_column", name: "Колона на кан Омуртаг", icon: "🗿", era: "Български", bonus: { heroPower: 18 }, set: "bulgarian_imperial" },
    
    // Легендарни реликви
    "holy_lance_of_constantine": { id: "holy_lance_of_constantine", name: "Свещеното копие на Константин", icon: "🔱", era: "Легендарен", bonus: { heroPower: 30, armyBonus: 0.15 }, set: "holy_relics" },
    "true_cross_fragment": { id: "true_cross_fragment", name: "Фрагмент от Истинския кръст", icon: "✝️", era: "Легендарен", bonus: { heroPower: 25, mysticismBonus: 0.2 }, set: "holy_relics" },
    "ark_of_covenant_tablet": { id: "ark_of_covenant_tablet", name: "Таблет от Ковчега на Завета", icon: "📜", era: "Легендарен", bonus: { heroPower: 35 }, set: "holy_relics" },
    
    // Още артефакти до 60
    "golden_apple_of_discord": { id: "golden_apple_of_discord", name: "Златна ябълка на раздора", icon: "🍎", era: "Легендарен", bonus: { heroPower: 20, diplomacyBonus: -0.05 }, set: "mythical_artifacts" },
    "shield_of_achilles": { id: "shield_of_achilles", name: "Щитът на Ахил", icon: "🛡️", era: "Легендарен", bonus: { defense: 25 }, set: "mythical_artifacts" },
    "helmet_of_hades": { id: "helmet_of_hades", name: "Шлемът на Хадес", icon: "🪖", era: "Легендарен", bonus: { heroPower: 20, mysticismBonus: 0.15 }, set: "mythical_artifacts" },
    "golden_fleece": { id: "golden_fleece", name: "Златното руно", icon: "🐑", era: "Легендарен", bonus: { goldBonus: 40 }, set: "mythical_artifacts" },
    "scythe_of_cronus": { id: "scythe_of_cronus", name: "Косата на Кронос", icon: "🌾", era: "Легендарен", bonus: { heroPower: 28 }, set: "mythical_artifacts" },
    "thracian_helmet": { id: "thracian_helmet", name: "Тракийски шлем", icon: "🪖", era: "Тракийски", bonus: { defense: 12 }, set: "thracian_armor" },
    "thracian_shield": { id: "thracian_shield", name: "Тракийски щит", icon: "🛡️", era: "Тракийски", bonus: { defense: 10 }, set: "thracian_armor" },
    "roman_coin_of_trajan": { id: "roman_coin_of_trajan", name: "Римска монета на Траян", icon: "🪙", era: "Римски", bonus: { goldBonus: 12 }, set: "roman_coins" },
    "byzantine_coin_of_justinian": { id: "byzantine_coin_of_justinian", name: "Византийска монета на Юстиниан", icon: "🪙", era: "Византийски", bonus: { goldBonus: 15 }, set: "byzantine_coins" },
    "persian_daric": { id: "persian_daric", name: "Персийски дарик", icon: "🪙", era: "Персийски", bonus: { goldBonus: 14 }, set: "persian_coins" },
    "scythian_arrowhead": { id: "scythian_arrowhead", name: "Скитски връх на стрела", icon: "🏹", era: "Скитски", bonus: { heroPower: 8 }, set: "scythian_weapons" },
    "gothic_spear": { id: "gothic_spear", name: "Готско копие", icon: "🔱", era: "Готски", bonus: { heroPower: 14 }, set: "gothic_weapons" },
    "celtic_dagger": { id: "celtic_dagger", name: "Келтски кинжал", icon: "🗡️", era: "Келтски", bonus: { heroPower: 12 }, set: "celtic_weapons" }
};

// ==================== СЕТ БОНУСИ ====================
window.artifactSetBonuses = {
    "thracian_royal": { name: "Тракийско царско съкровище", bonus: { heroPower: 30, goldBonus: 25 }, pieces: 3 },
    "thracian_kings": { name: "Тракийски владетели", bonus: { heroPower: 35 }, pieces: 2 },
    "roman_imperial": { name: "Римски императори", bonus: { heroPower: 40, goldBonus: 20 }, pieces: 2 },
    "roman_military": { name: "Римска легионерска броня", bonus: { heroPower: 25, defense: 15 }, pieces: 3 },
    "byzantine_imperial": { name: "Византийска императорска власт", bonus: { heroPower: 45, goldBonus: 30, diplomacyBonus: 0.1 }, pieces: 2 },
    "byzantine_holy": { name: "Византийски свещен синод", bonus: { heroPower: 20, mysticismBonus: 0.2 }, pieces: 2 },
    "achaemenid_royal": { name: "Ахеменидско царство", bonus: { heroPower: 35, diplomacyBonus: 0.15 }, pieces: 2 },
    "achaemenid_military": { name: "Безсмъртната гвардия", bonus: { heroPower: 30, defense: 15 }, pieces: 2 },
    "scythian_gold": { name: "Скитско злато", bonus: { heroPower: 25, goldBonus: 20 }, pieces: 2 },
    "scythian_warrior": { name: "Скитски воин", bonus: { heroPower: 30, armyBonus: 0.1 }, pieces: 2 },
    "celtic_warrior": { name: "Келтски воин", bonus: { heroPower: 30, defense: 10 }, pieces: 3 },
    "gothic_royal": { name: "Готско кралство", bonus: { heroPower: 35, goldBonus: 25 }, pieces: 2 },
    "bulgarian_royal": { name: "Велика България", bonus: { heroPower: 50, diplomacyBonus: 0.15 }, pieces: 2 },
    "bulgarian_sacred": { name: "Свещена българска реликва", bonus: { heroPower: 30, mysticismBonus: 0.15, armyBonus: 0.1 }, pieces: 2 },
    "bulgarian_imperial": { name: "Българско царство", bonus: { heroPower: 40, goldBonus: 35 }, pieces: 2 },
    "holy_relics": { name: "Свещени реликви", bonus: { heroPower: 50, mysticismBonus: 0.3 }, pieces: 3 },
    "mythical_artifacts": { name: "Легендарни артефакти", bonus: { heroPower: 60, goldBonus: 50 }, pieces: 4 }
};
