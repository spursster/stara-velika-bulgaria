/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: items.js (ВЕРСИЯ 6.3 – ПРЕМАХНАТ КОНФЛИКТИРАЩИЯ OVERRIDE)
==========================================================================
*/
window.pendingSetBonuses = {};   // { setKey: heroId }
window.artifactSalvageCurrency = 0; // "есенция на реликви"

// Помощна функция за вземане на главния герой (без currentHero)
function getMainHeroForItems() {
    if (window.gameMode === 'solo') return window.currentHero || null;
    if (typeof window.getStrongestHero === 'function') return window.getStrongestHero();
    if (typeof window.getSelectedHero === 'function') return window.getSelectedHero();
    return null;
}

// ==================== БАЗА ДАННИ С ИМПЕРСКИ АРТЕФАКТИ ====================
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

// ==================== ИЗЧИСЛЯВАНЕ НА БОНУСИ ОТ ИНВЕНТАРА ====================
window.getInventoryBonuses = function(hero) {
    let totalBonus = { heroPower: 0, goldBonus: 0 };
    if (!hero || !hero.inventory || !Array.isArray(hero.inventory)) return totalBonus;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let mysticismLevel = hero.skills ? (hero.skills.mysticism || 0) : 0;
    let mysticismMultiplier = 1 + (mysticismLevel * 0.10);
    hero.inventory.forEach(item => {
        if (!item) return;
        let dbItem = window.artifactsDatabase[item.id] || item;
        if (dbItem.bonus) {
            if (dbItem.bonus.heroPower) totalBonus.heroPower += Math.floor(dbItem.bonus.heroPower * mysticismMultiplier);
            if (dbItem.bonus.goldBonus) totalBonus.goldBonus += Math.floor(dbItem.bonus.goldBonus * mysticismMultiplier);
        }
    });
    return totalBonus;
};

// ==================== ПРЕТОПЯВАНЕ НА АРТЕФАКТ ====================
window.salvageArtifact = function(hero, artifactIndex) {
    if (!hero || !hero.inventory) return false;
    const artifact = hero.inventory[artifactIndex];
    if (!artifact) return false;
    
    let essence = 5;
    if (artifact.rarity) essence += artifact.rarity * 2;
    if (artifact.bonus) essence += Object.keys(artifact.bonus).length * 3;
    essence = Math.max(5, Math.min(100, essence));
    
    window.artifactSalvageCurrency = (window.artifactSalvageCurrency || 0) + essence;
    hero.inventory.splice(artifactIndex, 1);
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🔮 Претопихте "${artifact.name}" и получихте ${essence} есенция.`);
    }
    if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(hero);
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    return true;
};

// ==================== ПРОВЕРКА ЗА СЕТ БОНУСИ (С БУТОНИ В ЛЕТОПИСА) ====================
window.checkSetCompletion = function(hero) {
    if (!hero || !hero.inventory) return;
    const setCounts = {};
    for (let art of hero.inventory) {
        if (art && art.set) setCounts[art.set] = (setCounts[art.set] || 0) + 1;
    }
    for (let setKey in setCounts) {
        if (setCounts[setKey] >= 2 && !hero.activeSetBonuses?.[setKey]) {
            if (!window.pendingSetBonuses[setKey]) {
                window.pendingSetBonuses[setKey] = hero.id;
                if (window.ChronicleEvents && typeof window.ChronicleEvents.generateSetBonusOffer === 'function') {
                    const ev = window.ChronicleEvents.generateSetBonusOffer(setKey, setCounts[setKey], hero);
                    if (window.showAdvisorMsg) window.showAdvisorMsg(ev.message, ev.buttons);
                } else {
                    console.warn("⚠️ generateSetBonusOffer не е дефиниран в chronicle_events.js");
                }
            }
        }
    }
};

// ==================== АВТОМАТИЧНА ЕКИПИРОВКА ЗА ГЕРОИ В AUTO РЕЖИМ ====================
function getArtifactScore(artifact, hero) {
    if (!artifact || !artifact.bonus) return 0;
    let score = 0;
    if (artifact.bonus.heroPower) score += artifact.bonus.heroPower * 10;
    if (artifact.bonus.goldBonus) score += artifact.bonus.goldBonus * 2;
    if (artifact.bonus.defense) score += artifact.bonus.defense * 5;
    if (artifact.bonus.armyBonus) score += artifact.bonus.armyBonus * 20;
    if (artifact.bonus.mysticismBonus) score += artifact.bonus.mysticismBonus * 15;
    if (artifact.bonus.diplomacyBonus) score += artifact.bonus.diplomacyBonus * 10;
    if (artifact.clan && hero.clan === artifact.clan) score += 30;
    return score;
}

function getBestArtifacts(hero, limit = 12) {
    if (!hero.inventory || hero.inventory.length === 0) return [];
    let scored = hero.inventory
        .filter(item => item && item.id)
        .map(item => ({ item, score: getArtifactScore(item, hero) }))
        .sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.item);
}

window.autoEquipHero = function(hero) {
    if (!hero) return false;
    if (!hero.isAuto) return false;
    if (!hero.inventory || hero.inventory.length === 0) return false;
    
    const best = getBestArtifacts(hero, 12);
    if (best.length === 0) return false;
    
    let equippedChanged = false;
    for (let i = 0; i < Math.min(12, best.length); i++) {
        if (hero.equipment[i] !== best[i]) {
            hero.equipment[i] = best[i];
            equippedChanged = true;
        }
    }
    for (let i = best.length; i < 12; i++) {
        if (hero.equipment[i] !== null) {
            hero.equipment[i] = null;
            equippedChanged = true;
        }
    }
    
    if (equippedChanged && window.recalculateHeroPower) {
        window.recalculateHeroPower(hero);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        if (typeof window.updateStrongestHeroUI === 'function') {
            window.updateStrongestHeroUI();
        }
    }
    return equippedChanged;
};

window.attemptAutoEquip = function(hero) {
    if (hero && hero.isAuto) {
        window.autoEquipHero(hero);
    }
};

// ==================== СЪКРОВИЩНИЦА (КОРИГИРАНА – БЕЗ currentHero) ====================
window.toggleTreasury = function() {
    let treasuryOverlay = document.getElementById('treasury-overlay');
    if (treasuryOverlay) {
        treasuryOverlay.remove();
        const hero = getMainHeroForItems();
        if (hero && hero.isAuto) {
            window.autoEquipHero(hero);
        }
        return;
    }
    const hero = getMainHeroForItems();
    if (!hero) return;
    if (!hero.inventory) hero.inventory = [];
    const validInventory = hero.inventory.filter(item => item !== null && item !== undefined);
    
    treasuryOverlay = document.createElement('div');
    treasuryOverlay.id = 'treasury-overlay';
    treasuryOverlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 200000;`;
    
    let gridHTML = "";
    if (validInventory.length === 0) {
        gridHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #555; padding: 40px 10px; font-style: italic;">Съкровищницата е празна.</div>`;
    } else {
        let mysticismLevel = hero.skills ? (hero.skills.mysticism || 0) : 0;
        let mysticismMultiplier = 1 + (mysticismLevel * 0.10);
        validInventory.forEach(item => {
            if (!item) return;
            let dbItem = window.artifactsDatabase[item.id] || item;
            let currentPower = dbItem.bonus?.heroPower ? Math.floor(dbItem.bonus.heroPower * mysticismMultiplier) : 0;
            let currentGold = dbItem.bonus?.goldBonus ? Math.floor(dbItem.bonus.goldBonus * mysticismMultiplier) : 0;
            let bonusText = currentPower ? `+${currentPower} Бойна Мощ` : `+${currentGold} Златен Добив`;
            let itemClan = dbItem.clan ? `Род ${dbItem.clan}` : "Свещен Артефакт";
            gridHTML += `
                <div style="background: rgba(255,255,255,0.02); border: 1px solid #333; border-radius: 6px; padding: 12px; text-align: center;">
                    <div style="font-size: 24px; margin-bottom: 5px;">${dbItem.icon || "🏺"}</div>
                    <div style="font-size: 12px; font-weight: bold; color: #ffd700; margin-bottom: 3px;">${dbItem.name}</div>
                    <div style="font-size: 10px; color: #00ffcc;">${bonusText}</div>
                    <div style="font-size: 9px; color: #666;">${itemClan}</div>
                </div>
            `;
        });
    }
    
    let invBonuses = window.getInventoryBonuses(hero);
    treasuryOverlay.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; border-radius: 8px; max-width: 500px; width: 92%; box-sizing: border-box; position: relative;">
            <button id="close-treasury-x" style="position: absolute; top: 10px; left: 10px; background: rgba(255,80,80,0.2); border: none; color: #ff8888; font-size: 18px; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
            <h3 style="margin-top: 0; color: #ffd700; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; text-align: center;">👑 РОДОВА СЪКРОВИЩНИЦА</h3>
            <p style="font-size: 12px; color: #aaa; text-align: center; margin-bottom: 15px;">Реликви и артефакти, придобити от славни походи.</p>
            <div style="display: flex; gap: 10px; justify-content: center; background: rgba(0,0,0,0.4); border: 1px solid #222; padding: 8px; border-radius: 4px; font-size: 11px; margin-bottom: 15px;">
                <div>⚔️ Обща мощ: <strong style="color: #00ffcc;">+${invBonuses.heroPower}</strong></div>
                <div>|</div>
                <div>💰 Златен бонус: <strong style="color: #ffd700;">+${invBonuses.goldBonus}%</strong></div>
            </div>
            <div id="treasury-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; max-height: 260px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px;">
                ${gridHTML}
            </div>
            <button id="close-treasury-footer" class="menu-btn" style="width: 100%; margin: 0;">ЗАТВОРИ СЪКРОВИЩНИЦАТА</button>
        </div>
    `;
    document.body.appendChild(treasuryOverlay);
    const close = () => {
        treasuryOverlay.remove();
        const heroAfter = getMainHeroForItems();
        if (heroAfter && heroAfter.isAuto) {
            window.autoEquipHero(heroAfter);
        }
    };
    treasuryOverlay.querySelector('#close-treasury-x')?.addEventListener('click', close);
    treasuryOverlay.querySelector('#close-treasury-footer')?.addEventListener('click', close);
    treasuryOverlay.addEventListener('click', (e) => { if (e.target === treasuryOverlay) close(); });
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};

window.openInventory = window.toggleTreasury;

// ==================== 60 ИСТОРИЧЕСКИ АРТЕФАКТА ====================
window.historicalArtifacts = {
    "panagyurishte_treasure": { id: "panagyurishte_treasure", name: "Панагюрско съкровище", icon: "🏺", era: "Тракийски", bonus: { heroPower: 15, goldBonus: 10 }, set: "thracian_royal" },
    "rogosen_treasure": { id: "rogosen_treasure", name: "Рогозенско съкровище", icon: "🏺", era: "Тракийски", bonus: { heroPower: 12, goldBonus: 8 }, set: "thracian_royal" },
    "valchitran_treasure": { id: "valchitran_treasure", name: "Вълчитрънско съкровище", icon: "🏺", era: "Тракийски", bonus: { heroPower: 10, goldBonus: 12 }, set: "thracian_royal" },
    "golden_mask_tervel": { id: "golden_mask_tervel", name: "Златна маска на Терес", icon: "🎭", era: "Тракийски", bonus: { heroPower: 20 }, set: "thracian_kings" },
    "golden_ring_seuthes": { id: "golden_ring_seuthes", name: "Златен пръстен на Севт III", icon: "💍", era: "Тракийски", bonus: { goldBonus: 15 }, set: "thracian_kings" },
    "trajan_column_piece": { id: "trajan_column_piece", name: "Фрагмент от колоната на Траян", icon: "🏛️", era: "Римски", bonus: { heroPower: 18 }, set: "roman_imperial" },
    "constantine_sceptre": { id: "constantine_sceptre", name: "Скиптър на Константин Велики", icon: "🔱", era: "Римски", bonus: { heroPower: 22 }, set: "roman_imperial" },
    "roman_legion_standard": { id: "roman_legion_standard", name: "Легионен орел", icon: "🦅", era: "Римски", bonus: { heroPower: 14, armyBonus: 0.1 }, set: "roman_military" },
    "gladius_of_trajan": { id: "gladius_of_trajan", name: "Гладиус на Траян", icon: "⚔️", era: "Римски", bonus: { heroPower: 20 }, set: "roman_military" },
    "scutum_of_legion": { id: "scutum_of_legion", name: "Легионен щит", icon: "🛡️", era: "Римски", bonus: { defense: 15 }, set: "roman_military" },
    "justinian_crown": { id: "justinian_crown", name: "Корона на Юстиниан Велики", icon: "👑", era: "Византийски", bonus: { heroPower: 25, goldBonus: 20 }, set: "byzantine_imperial" },
    "theodora_pendant": { id: "theodora_pendant", name: "Медальон на Теодора", icon: "📿", era: "Византийски", bonus: { heroPower: 15, diplomacyBonus: 0.1 }, set: "byzantine_imperial" },
    "hagia_sophia_cross": { id: "hagia_sophia_cross", name: "Кръст от Света София", icon: "✝️", era: "Византийски", bonus: { heroPower: 12, mysticismBonus: 0.15 }, set: "byzantine_holy" },
    "byzantine_icon": { id: "byzantine_icon", name: "Византийска икона", icon: "🖼️", era: "Византийски", bonus: { heroPower: 10, mysticismBonus: 0.1 }, set: "byzantine_holy" },
    "porphyrogennetos_seal": { id: "porphyrogennetos_seal", name: "Печат на Порфирогенит", icon: "🔏", era: "Византийски", bonus: { goldBonus: 25 }, set: "byzantine_administrative" },
    "cyrus_cylinder": { id: "cyrus_cylinder", name: "Цилиндър на Кир Велики", icon: "📜", era: "Персийски", bonus: { heroPower: 20, diplomacyBonus: 0.15 }, set: "achaemenid_royal" },
    "darius_gold_plate": { id: "darius_gold_plate", name: "Златна плоча на Дарий I", icon: "🥏", era: "Персийски", bonus: { heroPower: 18, goldBonus: 15 }, set: "achaemenid_royal" },
    "persian_rhython": { id: "persian_rhython", name: "Персийски ритон", icon: "🍷", era: "Персийски", bonus: { goldBonus: 20 }, set: "achaemenid_court" },
    "xerxes_sword": { id: "xerxes_sword", name: "Меч на Ксеркс", icon: "⚔️", era: "Персийски", bonus: { heroPower: 22 }, set: "achaemenid_military" },
    "immortal_helmet": { id: "immortal_helmet", name: "Шлем на Безсмъртен войн", icon: "🪖", era: "Персийски", bonus: { defense: 18 }, set: "achaemenid_military" },
    "scythian_gold_deer": { id: "scythian_gold_deer", name: "Скитски златен елен", icon: "🦌", era: "Скитски", bonus: { heroPower: 15, armyBonus: 0.1 }, set: "scythian_gold" },
    "scythian_animal_style_belt": { id: "scythian_animal_style_belt", name: "Скитски пояс", icon: "🔗", era: "Скитски", bonus: { defense: 12 }, set: "scythian_gold" },
    "scythian_akinakes_hist": { id: "scythian_akinakes_hist", name: "Скитски акинак", icon: "🗡️", era: "Скитски", bonus: { heroPower: 16 }, set: "scythian_warrior" },
    "scythian_gorytos": { id: "scythian_gorytos", name: "Скитски горит", icon: "🏹", era: "Скитски", bonus: { heroPower: 14 }, set: "scythian_warrior" },
    "scythian_cauldron": { id: "scythian_cauldron", name: "Скитски котел", icon: "🍲", era: "Скитски", bonus: { goldBonus: 15 }, set: "scythian_ritual" },
    "celtic_torc": { id: "celtic_torc", name: "Келтска торква", icon: "📿", era: "Келтски", bonus: { heroPower: 12 }, set: "celtic_noble" },
    "celtic_shield": { id: "celtic_shield", name: "Келтски щит", icon: "🛡️", era: "Келтски", bonus: { defense: 15 }, set: "celtic_warrior" },
    "celtic_sword": { id: "celtic_sword", name: "Келтски дълъг меч", icon: "⚔️", era: "Келтски", bonus: { heroPower: 18 }, set: "celtic_warrior" },
    "celtic_helmet": { id: "celtic_helmet", name: "Келтски шлем", icon: "🪖", era: "Келтски", bonus: { defense: 12 }, set: "celtic_warrior" },
    "gothic_crown_of_theoderic": { id: "gothic_crown_of_theoderic", name: "Корона на Теодорих Велики", icon: "👑", era: "Готски", bonus: { heroPower: 20 }, set: "gothic_royal" },
    "gothic_silver_treasure": { id: "gothic_silver_treasure", name: "Готско сребърно съкровище", icon: "💰", era: "Готски", bonus: { goldBonus: 25 }, set: "gothic_royal" },
    "gothic_brooch": { id: "gothic_brooch", name: "Готска фибула", icon: "🔱", era: "Готски", bonus: { heroPower: 10 }, set: "gothic_art" },
    "gothic_belt_buckle": { id: "gothic_belt_buckle", name: "Готска катарама", icon: "🔗", era: "Готски", bonus: { defense: 10 }, set: "gothic_art" },
    "sword_of_kubrat_hist": { id: "sword_of_kubrat_hist", name: "Мечът на Кубрат", icon: "⚔️", era: "Български", bonus: { heroPower: 25 }, set: "bulgarian_royal" },
    "ring_of_tervel": { id: "ring_of_tervel", name: "Пръстенът на Тервел", icon: "💍", era: "Български", bonus: { heroPower: 15, diplomacyBonus: 0.1 }, set: "bulgarian_royal" },
    "madara_horseman_relief": { id: "madara_horseman_relief", name: "Мадарски конник", icon: "🏇", era: "Български", bonus: { heroPower: 20, armyBonus: 0.1 }, set: "bulgarian_sacred" },
    "pliska_rosette": { id: "pliska_rosette", name: "Плисковска розета", icon: "⭐", era: "Български", bonus: { heroPower: 12, mysticismBonus: 0.1 }, set: "bulgarian_sacred" },
    "preslav_gold_treasure": { id: "preslav_gold_treasure", name: "Преславско златно съкровище", icon: "🏺", era: "Български", bonus: { goldBonus: 30 }, set: "bulgarian_imperial" },
    "khan_omurtag_column": { id: "khan_omurtag_column", name: "Колона на кан Омуртаг", icon: "🗿", era: "Български", bonus: { heroPower: 18 }, set: "bulgarian_imperial" },
    "holy_lance_of_constantine": { id: "holy_lance_of_constantine", name: "Свещеното копие на Константин", icon: "🔱", era: "Легендарен", bonus: { heroPower: 30, armyBonus: 0.15 }, set: "holy_relics" },
    "true_cross_fragment": { id: "true_cross_fragment", name: "Фрагмент от Истинския кръст", icon: "✝️", era: "Легендарен", bonus: { heroPower: 25, mysticismBonus: 0.2 }, set: "holy_relics" },
    "ark_of_covenant_tablet": { id: "ark_of_covenant_tablet", name: "Таблет от Ковчега на Завета", icon: "📜", era: "Легендарен", bonus: { heroPower: 35 }, set: "holy_relics" },
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

// ==================== 20 СТАНДАРТНИ ЕКИПИРОВЪЧНИ СЕТА ====================
window.standardEquipmentSets = {
    "iron_legion": { name: "Железният легион", pieces: { helmet: "Шлем на легионера", chest: "Нагръдник на легионера", gloves: "Ръкавици на легионера", boots: "Ботуши на легионера", weapon: "Гладиус на легионера", shield: "Скутум на легионера" }, bonus: { heroPower: 40, defense: 25, armyBonus: 0.15 }, rarity: "standard", requiredPieces: 4 },
    "hunter_wind": { name: "Ловец на вятъра", pieces: { helmet: "Кожена качулка", chest: "Лек кожен нагръдник", gloves: "Ръкавици за стрелба", boots: "Мокасини", weapon: "Дълъг лък" }, bonus: { heroPower: 30, critChance: 0.15, speed: 10 }, rarity: "standard", requiredPieces: 4 },
    "stone_guardian": { name: "Каменен пазител", pieces: { helmet: "Гранитен шлем", chest: "Каменен нагръдник", gloves: "Каменни ръкавици", boots: "Каменни ботуши", shield: "Гранитен щит" }, bonus: { defense: 40, heroPower: 20, damageReduction: 0.2 }, rarity: "standard", requiredPieces: 4 },
    "shadow_assassin": { name: "Сенчест убиец", pieces: { helmet: "Маска на сянка", chest: "Тъмен кожух", gloves: "Сенчести ръкавици", boots: "Тихи обувки", weapon: "Отровен кинжал" }, bonus: { heroPower: 35, critDamage: 0.25, sneak: 15 }, rarity: "standard", requiredPieces: 4 },
    "flame_bringer": { name: "Огненосец", pieces: { helmet: "Огнен шлем", chest: "Пламтящ нагръдник", gloves: "Горещи ръкавици", boots: "Жарки ботуши", weapon: "Огнен меч" }, bonus: { heroPower: 45, fireDamage: 20, enemyBurn: 0.1 }, rarity: "standard", requiredPieces: 4 },
    "frost_walker": { name: "Леден странник", pieces: { helmet: "Леден шлем", chest: "Снежен нагръдник", gloves: "Мразовити ръкавици", boots: "Ледени обувки", weapon: "Леден меч" }, bonus: { heroPower: 45, coldDamage: 20, enemySlow: 0.15 }, rarity: "standard", requiredPieces: 4 },
    "storm_caller": { name: "Буревестник", pieces: { helmet: "Шлем на бурята", chest: "Гръмотевичен нагръдник", gloves: "Светкавични ръкавици", boots: "Вятърни ботуши", weapon: "Мълниеносен меч" }, bonus: { heroPower: 50, lightningDamage: 25, attackSpeed: 0.2 }, rarity: "standard", requiredPieces: 4 },
    "earth_shaker": { name: "Земетръс", pieces: { helmet: "Земен шлем", chest: "Твърд нагръдник", gloves: "Земни ръкавици", boots: "Камъни обувки", weapon: "Земен чук" }, bonus: { heroPower: 40, defense: 30, stunChance: 0.1 }, rarity: "standard", requiredPieces: 4 },
    "light_bringer": { name: "Светлоносец", pieces: { helmet: "Сияен шлем", chest: "Светъл нагръдник", gloves: "Лъчезарни ръкавици", boots: "Божествени ботуши", weapon: "Светлинен меч" }, bonus: { heroPower: 55, holyDamage: 20, healOnKill: 50 }, rarity: "standard", requiredPieces: 4 },
    "dark_lord": { name: "Тъмен владетел", pieces: { helmet: "Мрачен шлем", chest: "Тъмен нагръдник", gloves: "Сенчести ръкавици", boots: "Нощни ботуши", weapon: "Тъмен меч" }, bonus: { heroPower: 55, darkDamage: 20, lifeSteal: 0.1 }, rarity: "standard", requiredPieces: 4 },
    "dragon_slayer": { name: "Драконоборец", pieces: { helmet: "Драконов шлем", chest: "Драконова броня", gloves: "Драконови ръкавици", boots: "Драконови ботуши", weapon: "Драконов меч", shield: "Драконов щит" }, bonus: { heroPower: 60, dragonBonus: 0.3, fireResist: 0.5 }, rarity: "standard", requiredPieces: 5 },
    "wolf_chieftain": { name: "Вълчи вожд", pieces: { helmet: "Вълча глава", chest: "Вълча кожа", gloves: "Вълчи нокти", boots: "Вълчи лапи", weapon: "Вълчи зъб (меч)" }, bonus: { heroPower: 35, packBonus: 0.15, speed: 15 }, rarity: "standard", requiredPieces: 4 },
    "bear_warrior": { name: "Мечи воин", pieces: { helmet: "Меча качулка", chest: "Меча кожа", gloves: "Мечи ръкавици", boots: "Мечи ботуши", weapon: "Меча лапа (чук)" }, bonus: { heroPower: 40, health: 150, defense: 20 }, rarity: "standard", requiredPieces: 4 },
    "eagle_eye": { name: "Орлово око", pieces: { helmet: "Орлова перушина", chest: "Лек пернат нагръдник", gloves: "Ръкавици на стрелец", boots: "Ботуши на сокол", weapon: "Орлов лък" }, bonus: { heroPower: 35, rangedDamage: 25, accuracy: 0.2 }, rarity: "standard", requiredPieces: 4 },
    "serpent_venom": { name: "Змийска отрова", pieces: { helmet: "Змийска качулка", chest: "Люспест нагръдник", gloves: "Отровни ръкавици", boots: "Змийски обувки", weapon: "Отровен меч" }, bonus: { heroPower: 40, poisonDamage: 15, enemyWeakness: 0.1 }, rarity: "standard", requiredPieces: 4 },
    "phoenix_reborn": { name: "Прераждащ се феникс", pieces: { helmet: "Огнена корона", chest: "Пламтяща броня", gloves: "Огнени ръкавици", boots: "Пепелни ботуши", weapon: "Огнен меч на феникса" }, bonus: { heroPower: 55, reviveChance: 0.15, fireResist: 0.4 }, rarity: "standard", requiredPieces: 4 },
    "titan_fist": { name: "Титанов юмрук", pieces: { helmet: "Титанов шлем", chest: "Титанова броня", gloves: "Титанови ръкавици", boots: "Титанови ботуши", weapon: "Титанов чук" }, bonus: { heroPower: 70, armorPenetration: 0.3, stunChance: 0.15 }, rarity: "standard", requiredPieces: 4 },
    "crystal_mage": { name: "Кристален магьосник", pieces: { helmet: "Кристална диадема", chest: "Кристална роба", gloves: "Кристални ръкавици", boots: "Кристални обувки", weapon: "Кристален жезъл" }, bonus: { heroPower: 50, magicPower: 30, manaRegen: 10 }, rarity: "standard", requiredPieces: 4 },
    "shadow_dancer": { name: "Танцуващ със сенките", pieces: { helmet: "Сенчеста маска", chest: "Тъмен кожух", gloves: "Ловки ръкавици", boots: "Ботуши на танцьор", weapon: "Сенчест кинжал" }, bonus: { heroPower: 45, dodge: 0.25, criticalChance: 0.2 }, rarity: "standard", requiredPieces: 4 },
    "holy_crusader": { name: "Свещен кръстоносец", pieces: { helmet: "Свещен шлем", chest: "Рицарска броня", gloves: "Свещени ръкавици", boots: "Рицарски ботуши", weapon: "Свещен меч", shield: "Свещен щит" }, bonus: { heroPower: 65, holyDamage: 25, enemyUndead: 0.3 }, rarity: "standard", requiredPieces: 5 }
};

// ==================== 20 ЛЕГЕНДАРНИ/ЕЛИТНИ ЕКИПИРОВЪЧНИ СЕТА ====================
window.legendaryEquipmentSets = {
    "dragon_emperor": { name: "Драконов император", pieces: { helmet: "Корона на дракона", chest: "Драконова люспеста броня", gloves: "Драконови нокти", boots: "Драконови крила", weapon: "Драконов меч на властта", shield: "Драконов щит на вечността" }, bonus: { heroPower: 120, allResist: 0.5, dragonForm: 0.2 }, rarity: "legendary", requiredPieces: 6 },
    "thunder_god": { name: "Бог на гръмотевиците", pieces: { helmet: "Шлем на Тор", chest: "Нагръдник на бурята", gloves: "Ръкавици на мълнията", boots: "Ботуши на вихъра", weapon: "Мълниеносен чук" }, bonus: { heroPower: 110, lightningChain: 0.3, attackSpeed: 0.35 }, rarity: "legendary", requiredPieces: 5 },
    "eternal_winter": { name: "Вечна зима", pieces: { helmet: "Корона на леда", chest: "Ледена броня", gloves: "Мразовити ръкавици", boots: "Ледени обувки", weapon: "Леден скиптър" }, bonus: { heroPower: 105, freezeChance: 0.25, enemySlow: 0.4 }, rarity: "legendary", requiredPieces: 5 },
    "solar_king": { name: "Слънчев крал", pieces: { helmet: "Слънчева корона", chest: "Златна броня", gloves: "Слънчеви ръкавици", boots: "Златни ботуши", weapon: "Слънчев меч" }, bonus: { heroPower: 115, fireDamage: 40, allyBuff: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "void_walker": { name: "Пътешественик в празнотата", pieces: { helmet: "Маска на празнотата", chest: "Празнична броня", gloves: "Ръкавици на бездната", boots: "Сенчести стъпки", weapon: "Меч на празнотата" }, bonus: { heroPower: 125, teleportChance: 0.2, enemyConfuse: 0.3 }, rarity: "legendary", requiredPieces: 5 },
    "time_keeper": { name: "Пазител на времето", pieces: { helmet: "Хроно-шлем", chest: "Времева броня", gloves: "Пясъчни ръкавици", boots: "Часовникови обувки", weapon: "Времеви меч" }, bonus: { heroPower: 130, doubleTurnChance: 0.15, enemyTimeStop: 0.1 }, rarity: "legendary", requiredPieces: 5 },
    "cosmic_destroyer": { name: "Космически разрушител", pieces: { helmet: "Звезден шлем", chest: "Галактическа броня", gloves: "Космически ръкавици", boots: "Звездни ботуши", weapon: "Космически меч", shield: "Космически щит" }, bonus: { heroPower: 150, allStats: 0.25, blackHole: 0.1 }, rarity: "legendary", requiredPieces: 6 },
    "soul_reaper": { name: "Жътвар на души", pieces: { helmet: "Качулка на смъртта", chest: "Черна броня", gloves: "Костенурни ръкавици", boots: "Призрачни обувки", weapon: "Коса на жътваря" }, bonus: { heroPower: 110, lifeSteal: 0.25, executeChance: 0.15 }, rarity: "legendary", requiredPieces: 5 },
    "wild_god": { name: "Див бог", pieces: { helmet: "Глава на звяр", chest: "Кожа на гората", gloves: "Нокти на хищник", boots: "Лапи на тигър", weapon: "Тотем на природата" }, bonus: { heroPower: 100, natureDamage: 35, beastForm: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "arcane_archmage": { name: "Архимаг на тайните", pieces: { helmet: "Магическа корона", chest: "Роба на мъдреца", gloves: "Ръкавици на магьосник", boots: "Ботуши на телепорта", weapon: "Магически жезъл" }, bonus: { heroPower: 120, spellPower: 50, manaRegen: 25 }, rarity: "legendary", requiredPieces: 5 },
    "angel_of_vengeance": { name: "Ангел на отмъщението", pieces: { helmet: "Светъл ореол", chest: "Крилата броня", gloves: "Небесни ръкавици", boots: "Божествени ботуши", weapon: "Пламтящ меч на правдата" }, bonus: { heroPower: 130, holyDamage: 45, revive: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "shadow_emperor": { name: "Император на сенките", pieces: { helmet: "Тъмна корона", chest: "Нощна броня", gloves: "Сенчести ръкавици", boots: "Мрачни обувки", weapon: "Черен меч" }, bonus: { heroPower: 125, darkDamage: 40, enemyFear: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "ice_queen": { name: "Ледена кралица", pieces: { helmet: "Диадема на зимата", chest: "Кристален нагръдник", gloves: "Снежни ръкавици", boots: "Ледени обувки", weapon: "Леден скиптър" }, bonus: { heroPower: 115, iceShield: 0.3, blizzard: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "fire_lord": { name: "Повелител на огъня", pieces: { helmet: "Корона на пламъците", chest: "Огнена броня", gloves: "Горещи ръкавици", boots: "Пламтящи обувки", weapon: "Огнен меч" }, bonus: { heroPower: 120, fireStorm: 0.3, immolation: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "earth_guardian": { name: "Пазител на земята", pieces: { helmet: "Земен шлем", chest: "Гранитна броня", gloves: "Земни ръкавици", boots: "Камъни обувки", weapon: "Земен чук" }, bonus: { heroPower: 110, defense: 60, earthquake: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "storm_bringer": { name: "Носител на буря", pieces: { helmet: "Шлем на урагана", chest: "Вятърна броня", gloves: "Гръмотевични ръкавици", boots: "Светкавични обувки", weapon: "Мълниеносен меч" }, bonus: { heroPower: 125, tornado: 0.25, lightningStrike: 0.3 }, rarity: "legendary", requiredPieces: 5 },
    "mythical_hero": { name: "Митичен герой", pieces: { helmet: "Шлем на безсмъртието", chest: "Броня на героите", gloves: "Ръкавици на силата", boots: "Ботуши на боговете", weapon: "Меч на легендите", shield: "Щит на небето" }, bonus: { heroPower: 160, godMode: 0.1, allBuffs: 0.3 }, rarity: "legendary", requiredPieces: 6 },
    "divine_judge": { name: "Божествен съдия", pieces: { helmet: "Корона на правдата", chest: "Свещена броня", gloves: "Ръкавици на закона", boots: "Божествени стъпки", weapon: "Меч на истината" }, bonus: { heroPower: 140, judgment: 0.25, enemyPunish: 0.2 }, rarity: "legendary", requiredPieces: 5 },
    "apocalypse_dragon": { name: "Апокалиптичен дракон", pieces: { helmet: "Череп на дракон", chest: "Драконова костена броня", gloves: "Драконови нокти", boots: "Драконови крила", weapon: "Драконов меч на края", shield: "Драконов щит на гибелта" }, bonus: { heroPower: 200, apocalypse: 0.2, dragonRage: 0.4 }, rarity: "legendary", requiredPieces: 6 },
    "primordial_one": { name: "Първичен властелин", pieces: { helmet: "Корона на сътворението", chest: "Броня на хаоса", gloves: "Ръкавици на бездната", boots: "Стъпки на вечността", weapon: "Меч на първичните", shield: "Щит на унищожението" }, bonus: { heroPower: 250, chaosAura: 0.3, timeStop: 0.15 }, rarity: "legendary", requiredPieces: 6 }
};

// ==================== 10 БОЖЕСТВЕНИ ПИТОМЦИ ====================
window.divinePets = {
    "phoenix_emperor": { name: "Феникс император", icon: "🔥", desc: "Преражда се след смърт и обгаря враговете", bonus: { heroPower: 80, reviveChance: 0.3, fireDamage: 50, immunityToFire: true } },
    "thunder_wolf": { name: "Гръмотевичен вълк", icon: "🐺⚡", desc: "Върколак с електрическа козина", bonus: { heroPower: 70, lightningDamage: 40, stunChance: 0.25, speed: 30 } },
    "celestial_dragon": { name: "Небесен дракон", icon: "🐉✨", desc: "Лети над бойното поле", bonus: { heroPower: 100, allyBuff: 0.25, goldBonus: 50, holyDamage: 60 } },
    "ice_phoenix": { name: "Леден феникс", icon: "❄️🐦", desc: "Връща времето назад", bonus: { heroPower: 85, coldDamage: 45, reviveAllies: 0.2, slowEnemies: 0.4 } },
    "golden_griffin": { name: "Златен грифон", icon: "🦅💰", desc: "Носи късмет", bonus: { heroPower: 65, goldBonus: 100, critChance: 0.2, treasureFind: 0.3 } },
    "shadow_serpent": { name: "Сенчеста змия", icon: "🐍🌑", desc: "Пълзи през сенките", bonus: { heroPower: 75, lifeSteal: 0.3, enemyWeakness: 0.25, stealth: true } },
    "divine_pegasus": { name: "Божествен пегас", icon: "🦄✨", desc: "Крилат кон", bonus: { heroPower: 90, healAllies: 100, speed: 50, manaRegen: 20 } },
    "earth_elemental": { name: "Земен елементал", icon: "🗻", desc: "Титан от камък", bonus: { heroPower: 60, defense: 80, damageReduction: 0.35, taunt: true } },
    "solar_lion": { name: "Слънчев лъв", icon: "🦁☀️", desc: "Ревът му ослепява", bonus: { heroPower: 95, fireDamage: 55, allyMorale: 0.3, enemyBlind: 0.2 } },
    "void_hound": { name: "Празничен хрътка", icon: "🐕🌌", desc: "Космическо създание", bonus: { heroPower: 110, portalChance: 0.15, enemyConfuse: 0.3, extraTurn: 0.1 } }
};

// ==================== БОНУСИ ОТ ЕКИПИРОВЪЧНИ СЕТОВЕ ====================
window.calculateEquipmentSetBonuses = function(hero) {
    if (!hero || !hero.equipment || !Array.isArray(hero.equipment)) return {};
    const equippedNames = hero.equipment.filter(item => item !== null).map(item => item.name);
    let activeBonuses = {};
    for (let setId in window.standardEquipmentSets) {
        const set = window.standardEquipmentSets[setId];
        let piecesFound = 0;
        for (let pieceKey in set.pieces) {
            if (equippedNames.includes(set.pieces[pieceKey])) piecesFound++;
        }
        if (piecesFound >= set.requiredPieces) {
            for (let bonus in set.bonus) activeBonuses[bonus] = (activeBonuses[bonus] || 0) + set.bonus[bonus];
        }
    }
    for (let setId in window.legendaryEquipmentSets) {
        const set = window.legendaryEquipmentSets[setId];
        let piecesFound = 0;
        for (let pieceKey in set.pieces) {
            if (equippedNames.includes(set.pieces[pieceKey])) piecesFound++;
        }
        if (piecesFound >= set.requiredPieces) {
            for (let bonus in set.bonus) activeBonuses[bonus] = (activeBonuses[bonus] || 0) + set.bonus[bonus];
        }
    }
    return activeBonuses;
};

window.grantDivinePet = function(hero, petId) {
    if (!window.divinePets[petId]) return false;
    hero.pet = petId;
    if (!window.rpgDatabase.petsDatabase[petId]) {
        window.rpgDatabase.petsDatabase[petId] = {
            name: window.divinePets[petId].name,
            icon: window.divinePets[petId].icon,
            desc: window.divinePets[petId].desc
        };
    }
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup("БОЖЕСТВЕН ПИТОМЕЦ", `🐉 ${hero.name} получи ${window.divinePets[petId].name}!`, "success");
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🐉 БОЖЕСТВЕН ПИТОМЕЦ: ${hero.name} получи ${window.divinePets[petId].name}!`);
    }
    return true;
};

// Разширяване на глобалната функция за преизчисляване на мощта
if (typeof window.recalculateHeroPower === 'function') {
    const originalRecalc = window.recalculateHeroPower;
    window.recalculateHeroPower = function(hero) {
        let power = originalRecalc(hero);
        const setBonuses = window.calculateEquipmentSetBonuses(hero);
        if (setBonuses.heroPower) power += setBonuses.heroPower;
        if (setBonuses.allStats) power += hero.heroPower * setBonuses.allStats;
        hero.heroPower = Math.floor(power);
        return hero.heroPower;
    };
}

// ⭐ ПРЕМАХНАТ Е КОНФЛИКТИРАЩИЯТ OVERRIDE НА gainHeroXP (вече е в rpg_system.js)

// Инициализация: автоматична екипировка за авто герои
setTimeout(() => {
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined && hero.isAuto && hero.inventory && hero.inventory.length > 0) {
                window.autoEquipHero(hero);
            }
        }
    }
    const mainHero = getMainHeroForItems();
    if (mainHero && mainHero.isAuto) {
        window.autoEquipHero(mainHero);
    }
}, 1000);

console.log("✅ items.js версия 6.3 зареден – премахнат конфликтиращия override, автоматичната екипировка идва от rpg_system.js");
