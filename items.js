// ==================== 20 СТАНДАРТНИ ЕКИПИРОВЪЧНИ СЕТА (3-5 части) ====================
window.standardEquipmentSets = {
    "iron_legion": {
        name: "Железният легион",
        pieces: {
            helmet: "Шлем на легионера",
            chest: "Нагръдник на легионера",
            gloves: "Ръкавици на легионера",
            boots: "Ботуши на легионера",
            weapon: "Гладиус на легионера",
            shield: "Скутум на легионера"
        },
        bonus: { heroPower: 40, defense: 25, armyBonus: 0.15 },
        rarity: "standard",
        requiredPieces: 4
    },
    "hunter_wind": {
        name: "Ловец на вятъра",
        pieces: {
            helmet: "Кожена качулка",
            chest: "Лек кожен нагръдник",
            gloves: "Ръкавици за стрелба",
            boots: "Мокасини",
            weapon: "Дълъг лък"
        },
        bonus: { heroPower: 30, critChance: 0.15, speed: 10 },
        rarity: "standard",
        requiredPieces: 4
    },
    "stone_guardian": {
        name: "Каменен пазител",
        pieces: {
            helmet: "Гранитен шлем",
            chest: "Каменен нагръдник",
            gloves: "Каменни ръкавици",
            boots: "Каменни ботуши",
            shield: "Гранитен щит"
        },
        bonus: { defense: 40, heroPower: 20, damageReduction: 0.2 },
        rarity: "standard",
        requiredPieces: 4
    },
    "shadow_assassin": {
        name: "Сенчест убиец",
        pieces: {
            helmet: "Маска на сянка",
            chest: "Тъмен кожух",
            gloves: "Сенчести ръкавици",
            boots: "Тихи обувки",
            weapon: "Отровен кинжал"
        },
        bonus: { heroPower: 35, critDamage: 0.25, sneak: 15 },
        rarity: "standard",
        requiredPieces: 4
    },
    "flame_bringer": {
        name: "Огненосец",
        pieces: {
            helmet: "Огнен шлем",
            chest: "Пламтящ нагръдник",
            gloves: "Горещи ръкавици",
            boots: "Жарки ботуши",
            weapon: "Огнен меч"
        },
        bonus: { heroPower: 45, fireDamage: 20, enemyBurn: 0.1 },
        rarity: "standard",
        requiredPieces: 4
    },
    "frost_walker": {
        name: "Леден странник",
        pieces: {
            helmet: "Леден шлем",
            chest: "Снежен нагръдник",
            gloves: "Мразовити ръкавици",
            boots: "Ледени обувки",
            weapon: "Леден меч"
        },
        bonus: { heroPower: 45, coldDamage: 20, enemySlow: 0.15 },
        rarity: "standard",
        requiredPieces: 4
    },
    "storm_caller": {
        name: "Буревестник",
        pieces: {
            helmet: "Шлем на бурята",
            chest: "Гръмотевичен нагръдник",
            gloves: "Светкавични ръкавици",
            boots: "Вятърни ботуши",
            weapon: "Мълниеносен меч"
        },
        bonus: { heroPower: 50, lightningDamage: 25, attackSpeed: 0.2 },
        rarity: "standard",
        requiredPieces: 4
    },
    "earth_shaker": {
        name: "Земетръс",
        pieces: {
            helmet: "Земен шлем",
            chest: "Твърд нагръдник",
            gloves: "Земни ръкавици",
            boots: "Камъни обувки",
            weapon: "Земен чук"
        },
        bonus: { heroPower: 40, defense: 30, stunChance: 0.1 },
        rarity: "standard",
        requiredPieces: 4
    },
    "light_bringer": {
        name: "Светлоносец",
        pieces: {
            helmet: "Сияен шлем",
            chest: "Светъл нагръдник",
            gloves: "Лъчезарни ръкавици",
            boots: "Божествени ботуши",
            weapon: "Светлинен меч"
        },
        bonus: { heroPower: 55, holyDamage: 20, healOnKill: 50 },
        rarity: "standard",
        requiredPieces: 4
    },
    "dark_lord": {
        name: "Тъмен владетел",
        pieces: {
            helmet: "Мрачен шлем",
            chest: "Тъмен нагръдник",
            gloves: "Сенчести ръкавици",
            boots: "Нощни ботуши",
            weapon: "Тъмен меч"
        },
        bonus: { heroPower: 55, darkDamage: 20, lifeSteal: 0.1 },
        rarity: "standard",
        requiredPieces: 4
    },
    "dragon_slayer": {
        name: "Драконоборец",
        pieces: {
            helmet: "Драконов шлем",
            chest: "Драконова броня",
            gloves: "Драконови ръкавици",
            boots: "Драконови ботуши",
            weapon: "Драконов меч",
            shield: "Драконов щит"
        },
        bonus: { heroPower: 60, dragonBonus: 0.3, fireResist: 0.5 },
        rarity: "standard",
        requiredPieces: 5
    },
    "wolf_chieftain": {
        name: "Вълчи вожд",
        pieces: {
            helmet: "Вълча глава",
            chest: "Вълча кожа",
            gloves: "Вълчи нокти",
            boots: "Вълчи лапи",
            weapon: "Вълчи зъб (меч)"
        },
        bonus: { heroPower: 35, packBonus: 0.15, speed: 15 },
        rarity: "standard",
        requiredPieces: 4
    },
    "bear_warrior": {
        name: "Мечи воин",
        pieces: {
            helmet: "Меча качулка",
            chest: "Меча кожа",
            gloves: "Мечи ръкавици",
            boots: "Мечи ботуши",
            weapon: "Меча лапа (чук)"
        },
        bonus: { heroPower: 40, health: 150, defense: 20 },
        rarity: "standard",
        requiredPieces: 4
    },
    "eagle_eye": {
        name: "Орлово око",
        pieces: {
            helmet: "Орлова перушина",
            chest: "Лек пернат нагръдник",
            gloves: "Ръкавици на стрелец",
            boots: "Ботуши на сокол",
            weapon: "Орлов лък"
        },
        bonus: { heroPower: 35, rangedDamage: 25, accuracy: 0.2 },
        rarity: "standard",
        requiredPieces: 4
    },
    "serpent_venom": {
        name: "Змийска отрова",
        pieces: {
            helmet: "Змийска качулка",
            chest: "Люспест нагръдник",
            gloves: "Отровни ръкавици",
            boots: "Змийски обувки",
            weapon: "Отровен меч"
        },
        bonus: { heroPower: 40, poisonDamage: 15, enemyWeakness: 0.1 },
        rarity: "standard",
        requiredPieces: 4
    },
    "phoenix_reborn": {
        name: "Прераждащ се феникс",
        pieces: {
            helmet: "Огнена корона",
            chest: "Пламтяща броня",
            gloves: "Огнени ръкавици",
            boots: "Пепелни ботуши",
            weapon: "Огнен меч на феникса"
        },
        bonus: { heroPower: 55, reviveChance: 0.15, fireResist: 0.4 },
        rarity: "standard",
        requiredPieces: 4
    },
    "titan_fist": {
        name: "Титанов юмрук",
        pieces: {
            helmet: "Титанов шлем",
            chest: "Титанова броня",
            gloves: "Титанови ръкавици",
            boots: "Титанови ботуши",
            weapon: "Титанов чук"
        },
        bonus: { heroPower: 70, armorPenetration: 0.3, stunChance: 0.15 },
        rarity: "standard",
        requiredPieces: 4
    },
    "crystal_mage": {
        name: "Кристален магьосник",
        pieces: {
            helmet: "Кристална диадема",
            chest: "Кристална роба",
            gloves: "Кристални ръкавици",
            boots: "Кристални обувки",
            weapon: "Кристален жезъл"
        },
        bonus: { heroPower: 50, magicPower: 30, manaRegen: 10 },
        rarity: "standard",
        requiredPieces: 4
    },
    "shadow_dancer": {
        name: "Танцуващ със сенките",
        pieces: {
            helmet: "Сенчеста маска",
            chest: "Тъмен кожух",
            gloves: "Ловки ръкавици",
            boots: "Ботуши на танцьор",
            weapon: "Сенчест кинжал"
        },
        bonus: { heroPower: 45, dodge: 0.25, criticalChance: 0.2 },
        rarity: "standard",
        requiredPieces: 4
    },
    "holy_crusader": {
        name: "Свещен кръстоносец",
        pieces: {
            helmet: "Свещен шлем",
            chest: "Рицарска броня",
            gloves: "Свещени ръкавици",
            boots: "Рицарски ботуши",
            weapon: "Свещен меч",
            shield: "Свещен щит"
        },
        bonus: { heroPower: 65, holyDamage: 25, enemyUndead: 0.3 },
        rarity: "standard",
        requiredPieces: 5
    }
};

// ==================== 20 ЛЕГЕНДАРНИ/ЕЛИТНИ ЕКИПИРОВЪЧНИ СЕТА ====================
window.legendaryEquipmentSets = {
    "dragon_emperor": {
        name: "Драконов император",
        pieces: {
            helmet: "Корона на дракона",
            chest: "Драконова люспеста броня",
            gloves: "Драконови нокти",
            boots: "Драконови крила",
            weapon: "Драконов меч на властта",
            shield: "Драконов щит на вечността"
        },
        bonus: { heroPower: 120, allResist: 0.5, dragonForm: 0.2 },
        rarity: "legendary",
        requiredPieces: 6
    },
    "thunder_god": {
        name: "Бог на гръмотевиците",
        pieces: {
            helmet: "Шлем на Тор",
            chest: "Нагръдник на бурята",
            gloves: "Ръкавици на мълнията",
            boots: "Ботуши на вихъра",
            weapon: "Мълниеносен чук"
        },
        bonus: { heroPower: 110, lightningChain: 0.3, attackSpeed: 0.35 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "eternal_winter": {
        name: "Вечна зима",
        pieces: {
            helmet: "Корона на леда",
            chest: "Ледена броня",
            gloves: "Мразовити ръкавици",
            boots: "Ледени обувки",
            weapon: "Леден скиптър"
        },
        bonus: { heroPower: 105, freezeChance: 0.25, enemySlow: 0.4 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "solar_king": {
        name: "Слънчев крал",
        pieces: {
            helmet: "Слънчева корона",
            chest: "Златна броня",
            gloves: "Слънчеви ръкавици",
            boots: "Златни ботуши",
            weapon: "Слънчев меч"
        },
        bonus: { heroPower: 115, fireDamage: 40, allyBuff: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "void_walker": {
        name: "Пътешественик в празнотата",
        pieces: {
            helmet: "Маска на празнотата",
            chest: "Празнична броня",
            gloves: "Ръкавици на бездната",
            boots: "Сенчести стъпки",
            weapon: "Меч на празнотата"
        },
        bonus: { heroPower: 125, teleportChance: 0.2, enemyConfuse: 0.3 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "time_keeper": {
        name: "Пазител на времето",
        pieces: {
            helmet: "Хроно-шлем",
            chest: "Времева броня",
            gloves: "Пясъчни ръкавици",
            boots: "Часовникови обувки",
            weapon: "Времеви меч"
        },
        bonus: { heroPower: 130, doubleTurnChance: 0.15, enemyTimeStop: 0.1 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "cosmic_destroyer": {
        name: "Космически разрушител",
        pieces: {
            helmet: "Звезден шлем",
            chest: "Галактическа броня",
            gloves: "Космически ръкавици",
            boots: "Звездни ботуши",
            weapon: "Космически меч",
            shield: "Космически щит"
        },
        bonus: { heroPower: 150, allStats: 0.25, blackHole: 0.1 },
        rarity: "legendary",
        requiredPieces: 6
    },
    "soul_reaper": {
        name: "Жътвар на души",
        pieces: {
            helmet: "Качулка на смъртта",
            chest: "Черна броня",
            gloves: "Костенурни ръкавици",
            boots: "Призрачни обувки",
            weapon: "Коса на жътваря"
        },
        bonus: { heroPower: 110, lifeSteal: 0.25, executeChance: 0.15 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "wild_god": {
        name: "Див бог",
        pieces: {
            helmet: "Глава на звяр",
            chest: "Кожа на гората",
            gloves: "Нокти на хищник",
            boots: "Лапи на тигър",
            weapon: "Тотем на природата"
        },
        bonus: { heroPower: 100, natureDamage: 35, beastForm: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "arcane_archmage": {
        name: "Архимаг на тайните",
        pieces: {
            helmet: "Магическа корона",
            chest: "Роба на мъдреца",
            gloves: "Ръкавици на магьосник",
            boots: "Ботуши на телепорта",
            weapon: "Магически жезъл"
        },
        bonus: { heroPower: 120, spellPower: 50, manaRegen: 25 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "angel_of_vengeance": {
        name: "Ангел на отмъщението",
        pieces: {
            helmet: "Светъл ореол",
            chest: "Крилата броня",
            gloves: "Небесни ръкавици",
            boots: "Божествени ботуши",
            weapon: "Пламтящ меч на правдата"
        },
        bonus: { heroPower: 130, holyDamage: 45, revive: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "shadow_emperor": {
        name: "Император на сенките",
        pieces: {
            helmet: "Тъмна корона",
            chest: "Нощна броня",
            gloves: "Сенчести ръкавици",
            boots: "Мрачни обувки",
            weapon: "Черен меч"
        },
        bonus: { heroPower: 125, darkDamage: 40, enemyFear: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "ice_queen": {
        name: "Ледена кралица",
        pieces: {
            helmet: "Диадема на зимата",
            chest: "Кристален нагръдник",
            gloves: "Снежни ръкавици",
            boots: "Ледени обувки",
            weapon: "Леден скиптър"
        },
        bonus: { heroPower: 115, iceShield: 0.3, blizzard: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "fire_lord": {
        name: "Повелител на огъня",
        pieces: {
            helmet: "Корона на пламъците",
            chest: "Огнена броня",
            gloves: "Горещи ръкавици",
            boots: "Пламтящи обувки",
            weapon: "Огнен меч"
        },
        bonus: { heroPower: 120, fireStorm: 0.3, immolation: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "earth_guardian": {
        name: "Пазител на земята",
        pieces: {
            helmet: "Земен шлем",
            chest: "Гранитна броня",
            gloves: "Земни ръкавици",
            boots: "Камъни обувки",
            weapon: "Земен чук"
        },
        bonus: { heroPower: 110, defense: 60, earthquake: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "storm_bringer": {
        name: "Носител на буря",
        pieces: {
            helmet: "Шлем на урагана",
            chest: "Вятърна броня",
            gloves: "Гръмотевични ръкавици",
            boots: "Светкавични обувки",
            weapon: "Мълниеносен меч"
        },
        bonus: { heroPower: 125, tornado: 0.25, lightningStrike: 0.3 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "mythical_hero": {
        name: "Митичен герой",
        pieces: {
            helmet: "Шлем на безсмъртието",
            chest: "Броня на героите",
            gloves: "Ръкавици на силата",
            boots: "Ботуши на боговете",
            weapon: "Меч на легендите",
            shield: "Щит на небето"
        },
        bonus: { heroPower: 160, godMode: 0.1, allBuffs: 0.3 },
        rarity: "legendary",
        requiredPieces: 6
    },
    "divine_judge": {
        name: "Божествен съдия",
        pieces: {
            helmet: "Корона на правдата",
            chest: "Свещена броня",
            gloves: "Ръкавици на закона",
            boots: "Божествени стъпки",
            weapon: "Меч на истината"
        },
        bonus: { heroPower: 140, judgment: 0.25, enemyPunish: 0.2 },
        rarity: "legendary",
        requiredPieces: 5
    },
    "apocalypse_dragon": {
        name: "Апокалиптичен дракон",
        pieces: {
            helmet: "Череп на дракон",
            chest: "Драконова костена броня",
            gloves: "Драконови нокти",
            boots: "Драконови крила",
            weapon: "Драконов меч на края",
            shield: "Драконов щит на гибелта"
        },
        bonus: { heroPower: 200, apocalypse: 0.2, dragonRage: 0.4 },
        rarity: "legendary",
        requiredPieces: 6
    },
    "primordial_one": {
        name: "Първичен властелин",
        pieces: {
            helmet: "Корона на сътворението",
            chest: "Броня на хаоса",
            gloves: "Ръкавици на бездната",
            boots: "Стъпки на вечността",
            weapon: "Меч на първичните",
            shield: "Щит на унищожението"
        },
        bonus: { heroPower: 250, chaosAura: 0.3, timeStop: 0.15 },
        rarity: "legendary",
        requiredPieces: 6
    }
};

// ==================== 10 БОЖЕСТВЕНИ ПИТОМЦИ ====================
window.divinePets = {
    "phoenix_emperor": {
        name: "Феникс император",
        icon: "🔥",
        desc: "Преражда се след смърт и обгаря враговете с огнена магия",
        bonus: { heroPower: 80, reviveChance: 0.3, fireDamage: 50, immunityToFire: true }
    },
    "thunder_wolf": {
        name: "Гръмотевичен вълк",
        icon: "🐺⚡",
        desc: "Върколак с електрическа козина – прескача врагове и зашеметява",
        bonus: { heroPower: 70, lightningDamage: 40, stunChance: 0.25, speed: 30 }
    },
    "celestial_dragon": {
        name: "Небесен дракон",
        icon: "🐉✨",
        desc: "Лети над бойното поле и благославя съюзниците със звездна светлина",
        bonus: { heroPower: 100, allyBuff: 0.25, goldBonus: 50, holyDamage: 60 }
    },
    "ice_phoenix": {
        name: "Леден феникс",
        icon: "❄️🐦",
        desc: "Връща времето назад с ледено дихание – възстановява живота на падналите",
        bonus: { heroPower: 85, coldDamage: 45, reviveAllies: 0.2, slowEnemies: 0.4 }
    },
    "golden_griffin": {
        name: "Златен грифон",
        icon: "🦅💰",
        desc: "Носи късмет – увеличава златодобива и шанса за критичен удар",
        bonus: { heroPower: 65, goldBonus: 100, critChance: 0.2, treasureFind: 0.3 }
    },
    "shadow_serpent": {
        name: "Сенчеста змия",
        icon: "🐍🌑",
        desc: "Пълзи през сенките и отвлича енергията на врага",
        bonus: { heroPower: 75, lifeSteal: 0.3, enemyWeakness: 0.25, stealth: true }
    },
    "divine_pegasus": {
        name: "Божествен пегас",
        icon: "🦄✨",
        desc: "Крилатият кон носи светлина и изцеление на своите другари",
        bonus: { heroPower: 90, healAllies: 100, speed: 50, manaRegen: 20 }
    },
    "earth_elemental": {
        name: "Земен елементал",
        icon: "🗻",
        desc: "Титан от камък – непреодолима стена срещу вражески атаки",
        bonus: { heroPower: 60, defense: 80, damageReduction: 0.35, taunt: true }
    },
    "solar_lion": {
        name: "Слънчев лъв",
        icon: "🦁☀️",
        desc: "Ревът му ослепява враговете и вдъхновява армията",
        bonus: { heroPower: 95, fireDamage: 55, allyMorale: 0.3, enemyBlind: 0.2 }
    },
    "void_hound": {
        name: "Празничен хрътка",
        icon: "🐕🌌",
        desc: "Космическо създание, което призовава портали и дезориентира противниците",
        bonus: { heroPower: 110, portalChance: 0.15, enemyConfuse: 0.3, extraTurn: 0.1 }
    }
};

// ==================== ФУНКЦИЯ ЗА ИЗЧИСЛЯВАНЕ НА БОНУСИ ОТ ЕКИПИРОВЪЧНИ СЕТОВЕ ====================
/**
 * Изчислява активните сет бонуси от оборудването на героя
 * @param {Object} hero - обект на герой с поле equipment (масив от 12 елемента)
 * @returns {Object} - обект с натрупани бонуси от сотове
 */
window.calculateEquipmentSetBonuses = function(hero) {
    if (!hero || !hero.equipment || !Array.isArray(hero.equipment)) return {};
    
    // Събираме имената на екипираните предмети
    const equippedItems = hero.equipment.filter(item => item !== null).map(item => item.name);
    
    let activeBonuses = {};
    
    // Проверка за стандартни сетове
    for (let setId in window.standardEquipmentSets) {
        const set = window.standardEquipmentSets[setId];
        let piecesFound = 0;
        for (let pieceKey in set.pieces) {
            if (equippedItems.includes(set.pieces[pieceKey])) {
                piecesFound++;
            }
        }
        if (piecesFound >= set.requiredPieces) {
            for (let bonus in set.bonus) {
                activeBonuses[bonus] = (activeBonuses[bonus] || 0) + set.bonus[bonus];
            }
        }
    }
    
    // Проверка за легендарни сетове
    for (let setId in window.legendaryEquipmentSets) {
        const set = window.legendaryEquipmentSets[setId];
        let piecesFound = 0;
        for (let pieceKey in set.pieces) {
            if (equippedItems.includes(set.pieces[pieceKey])) {
                piecesFound++;
            }
        }
        if (piecesFound >= set.requiredPieces) {
            for (let bonus in set.bonus) {
                activeBonuses[bonus] = (activeBonuses[bonus] || 0) + set.bonus[bonus];
            }
        }
    }
    
    return activeBonuses;
};

/**
 * Добавя божествен питомец към герой (презаписва съществуващия)
 * @param {Object} hero - обект на герой
 * @param {string} petId - идентификатор от window.divinePets
 */
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
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`🐉 БОЖЕСТВЕН ПИТОМЕЦ: ${hero.name} получи ${window.divinePets[petId].name}!`);
    }
    return true;
};

// Разширяване на глобалната функция за преизчисляване на мощта, за да включва бонуси от екипировъчни сетове
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

console.log("✅ items.js обновен – добавени 20 стандартни сета, 20 легендарни сета и 10 божествени питомци.");

if (typeof window.toggleTreasury !== 'function') {
    window.toggleTreasury = function() {
        const hero = window.currentHero;
        if (!hero) return alert("Няма активен герой!");
        const inventory = hero.inventory || [];
        const old = document.getElementById('treasury-custom-modal');
        if (old) old.remove();
        const modal = document.createElement('div');
        modal.id = 'treasury-custom-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:200000; display:flex; align-items:center; justify-content:center; font-family:"Cinzel",serif; padding:20px;';
        let itemsHtml = inventory.length === 0 ? '<div style="text-align:center; padding:20px; color:#aaa;">Няма артефакти.</div>' :
            '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px,1fr)); gap:12px;">' +
            inventory.map(item => `<div style="background:rgba(20,20,30,0.6); border:1px solid #d4af37; border-radius:12px; padding:8px; text-align:center;">
               <div style="font-size:32px;">${item.icon || '🏺'}</div>
                <div style="font-size:12px; color:#ffd700;">${item.name}</div>
                <div style="font-size:9px; color:#88ff88;">+${item.bonus?.heroPower || 0} сила</div>
            </div>`).join('') + '</div>';
        modal.innerHTML = `
            <div style="background:#0a0a1a; border:2px solid #d4af37; border-radius:24px; max-width:90%; max-height:90%; overflow-y:auto; padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d4af37; margin-bottom:15px;">
                    <h2 style="color:#ffd700;">🏺 Съкровищница</h2>
                    <button id="closeTreasuryBtn" style="background:rgba(255,80,80,0.2); border:none; color:#ff8888; font-size:24px; cursor:pointer; width:36px; height:36px; border-radius:50%;">✕</button>
                </div>
                ${itemsHtml}
                <div style="text-align:center; margin-top:20px;">
                    <button id="closeTreasuryFooter" style="background:#2c2c3a; border:1px solid #d4af37; color:#ffd700; padding:8px 20px; border-radius:30px; cursor:pointer;">Затвори</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const close = () => modal.remove();
        modal.querySelector('#closeTreasuryBtn')?.addEventListener('click', close);
        modal.querySelector('#closeTreasuryFooter')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    };
}
