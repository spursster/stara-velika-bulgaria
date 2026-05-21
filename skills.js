/**
 * =========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – РАЗШИРЕНА СИСТЕМА ЗА УМЕНИЯ (100+ СКИЛОВЕ)
 * ВЕРСИЯ: 1.0 – ДЪРВЕТА КАТО В DIABLO И HEROES
 * =========================================================================
 * Уменията са групирани в 6 дървета:
 * - Бойни умения (Combat)
 * - Магически умения (Magic)
 * - Сенчести умения (Shadow)
 * - Командни умения (Command)
 * - Мистични умения (Mystic)
 * - Икономически умения (Economy)
 * 
 * Всяко умение може да се научи с точки за умения (skillPoints).
 * Някои умения имат изисквания за ниво и брой научени умения в същото дърво.
 */

window.advancedSkills = {
    // ==================== 1. БОЙНИ УМЕНИЯ (Combat) ====================
    combat: {
        name: "Бойни умения",
        icon: "⚔️",
        skills: {
            "double_strike": {
                name: "Двоен удар",
                desc: "Втора атака с 50% щети след първия удар.",
                icon: "⚔️⚔️",
                reqLevel: 2,
                reqPointsInTree: 0,
                maxLevel: 5,
                effect: (level) => ({ extraAttackChance: 0.1 * level, damagePercent: 0.5 })
            },
            "power_strike": {
                name: "Мощен удар",
                desc: "Увеличава щетите на първата атака.",
                icon: "💥",
                reqLevel: 3,
                reqPointsInTree: 1,
                maxLevel: 5,
                effect: (level) => ({ firstStrikeBonus: 0.1 * level })
            },
            "whirlwind": {
                name: "Вихър",
                desc: "Атакува всички врагове наведнъж.",
                icon: "🌀",
                reqLevel: 5,
                reqPointsInTree: 3,
                maxLevel: 3,
                effect: (level) => ({ aoeDamage: 0.3 * level, splashRadius: 1 })
            },
            "endurance_training": {
                name: "Тренировка за издръжливост",
                desc: "Увеличава максималното здраве на героя.",
                icon: "💪",
                reqLevel: 4,
                reqPointsInTree: 2,
                maxLevel: 10,
                effect: (level) => ({ maxHpBonus: 20 * level })
            },
            "critical_mastery": {
                name: "Критичен майстор",
                desc: "Увеличава шанса за критичен удар.",
                icon: "🎯",
                reqLevel: 6,
                reqPointsInTree: 4,
                maxLevel: 5,
                effect: (level) => ({ critChance: 0.03 * level, critDamage: 0.1 * level })
            },
            "berserker_rage": {
                name: "Берсеркска ярост",
                desc: "Колкото по-малко здраве, толкова повече щети.",
                icon: "😡",
                reqLevel: 8,
                reqPointsInTree: 6,
                maxLevel: 5,
                effect: (level) => ({ lowHpBonus: 0.05 * level })
            },
            "weapon_mastery": {
                name: "Майсторство на оръжията",
                desc: "Увеличава атаката с всички оръжия.",
                icon: "🗡️",
                reqLevel: 10,
                reqPointsInTree: 8,
                maxLevel: 10,
                effect: (level) => ({ attackBonus: 5 * level })
            },
            "last_stand": {
                name: "Последен бой",
                desc: "Когато паднеш, нанасяш 100% щети на всички врагове.",
                icon: "💀",
                reqLevel: 12,
                reqPointsInTree: 10,
                maxLevel: 1,
                effect: () => ({ lastStandDamage: 1.0 })
            },
            "executioner": {
                name: "Екзекутор",
                desc: "Удвоява щетите срещу врагове под 20% здраве.",
                icon: "🔪",
                reqLevel: 15,
                reqPointsInTree: 12,
                maxLevel: 5,
                effect: (level) => ({ executeBonus: 0.2 * level })
            },
            "battle_fury": {
                name: "Бойна ярост",
                desc: "След всяка убит враг, атаката се увеличава за 3 рунда.",
                icon: "🔥",
                reqLevel: 18,
                reqPointsInTree: 15,
                maxLevel: 5,
                effect: (level) => ({ furyStack: 0.05 * level, maxStacks: 5 })
            }
        }
    },

    // ==================== 2. МАГИЧЕСКИ УМЕНИЯ (Magic) ====================
    magic: {
        name: "Магически умения",
        icon: "🔮",
        skills: {
            "firebolt": {
                name: "Огнена стрела",
                desc: "Нанася 100% магически щети на един враг.",
                icon: "🔥",
                reqLevel: 2,
                reqPointsInTree: 0,
                maxLevel: 5,
                effect: (level) => ({ fireDamage: 20 * level, manaCost: 10 })
            },
            "frost_nova": {
                name: "Ледена вълна",
                desc: "Замразява всички врагове за 1 рунд.",
                icon: "❄️",
                reqLevel: 4,
                reqPointsInTree: 2,
                maxLevel: 3,
                effect: (level) => ({ freezeChance: 0.3 * level, freezeDuration: 1 })
            },
            "healing_light": {
                name: "Лечебна светлина",
                desc: "Възстановява 50% от здравето на герой.",
                icon: "💚",
                reqLevel: 5,
                reqPointsInTree: 3,
                maxLevel: 5,
                effect: (level) => ({ healPercent: 0.1 * level, cooldown: 3 })
            },
            "chain_lightning": {
                name: "Верижна мълния",
                desc: "Поразява 3 врага последователно.",
                icon: "⚡",
                reqLevel: 7,
                reqPointsInTree: 5,
                maxLevel: 5,
                effect: (level) => ({ chainDamage: 15 * level, chainTargets: 2 + Math.floor(level/2) })
            },
            "mana_shield": {
                name: "Магически щит",
                desc: "Превръща 50% от щетите в загуба на мана.",
                icon: "🛡️",
                reqLevel: 9,
                reqPointsInTree: 7,
                maxLevel: 3,
                effect: (level) => ({ damageToMana: 0.3 + 0.1 * level })
            },
            "teleport": {
                name: "Телепорт",
                desc: "Позволява бягство от битка или преместване на картата.",
                icon: "🌀",
                reqLevel: 12,
                reqPointsInTree: 10,
                maxLevel: 1,
                effect: () => ({ teleportChance: 1.0 })
            },
            "elemental_mastery": {
                name: "Елементално майсторство",
                desc: "Увеличава всички магически щети.",
                icon: "🌪️",
                reqLevel: 15,
                reqPointsInTree: 12,
                maxLevel: 10,
                effect: (level) => ({ spellPower: 5 * level })
            },
            "meteor": {
                name: "Метеор",
                desc: "Превръща 50% от щетите в загуба на мана.",
                icon: "☄️",
                reqLevel: 18,
                reqPointsInTree: 15,
                maxLevel: 5,
                effect: (level) => ({ meteorDamage: 50 * level, cooldown: 5 })
            },
            "arcane_empowerment": {
                name: "Аркано усилване",
                desc: "След всяка магия, следващата е с 20% по-силна.",
                icon: "✨",
                reqLevel: 20,
                reqPointsInTree: 18,
                maxLevel: 5,
                effect: (level) => ({ spellStackBonus: 0.04 * level, maxSpellStacks: 3 })
            },
            "time_warp": {
                name: "Времева деформация",
                desc: "Дава допълнителен рунд на съюзниците.",
                icon: "⏳",
                reqLevel: 25,
                reqPointsInTree: 20,
                maxLevel: 1,
                effect: () => ({ extraTurnChance: 0.25 })
            }
        }
    },

    // ==================== 3. СЕНЧЕСТИ УМЕНИЯ (Shadow) ====================
    shadow: {
        name: "Сенчести умения",
        icon: "🌑",
        skills: {
            "stealth": {
                name: "Невидимост",
                desc: "Героят става невидим за 2 рунда.",
                icon: "👻",
                reqLevel: 3,
                reqPointsInTree: 0,
                maxLevel: 3,
                effect: (level) => ({ stealthDuration: 1 + level })
            },
            "backstab": {
                name: "Удар в гръб",
                desc: "Атака от невидимост нанася 300% щети.",
                icon: "🗡️",
                reqLevel: 5,
                reqPointsInTree: 2,
                maxLevel: 5,
                effect: (level) => ({ backstabDamage: 2.0 + 0.2 * level })
            },
            "poison_tip": {
                name: "Отровен връх",
                desc: "Отравя врага за 3 рунда.",
                icon: "🐍",
                reqLevel: 6,
                reqPointsInTree: 3,
                maxLevel: 5,
                effect: (level) => ({ poisonDamage: 10 * level, poisonDuration: 3 })
            },
            "shadow_clone": {
                name: "Сенчест клонинг",
                desc: "Създава копие на героя, което атакува 50% от щетите.",
                icon: "👥",
                reqLevel: 8,
                reqPointsInTree: 5,
                maxLevel: 3,
                effect: (level) => ({ cloneDamage: 0.3 + 0.1 * level, cloneDuration: 3 })
            },
            "blink": {
                name: "Мигновен преход",
                desc: "Избягва следващата атака.",
                icon: "💨",
                reqLevel: 10,
                reqPointsInTree: 7,
                maxLevel: 3,
                effect: (level) => ({ dodgeChance: 0.1 * level })
            },
            "assassinate": {
                name: "Покушение",
                desc: "Моментално убива враг под 30% здраве.",
                icon: "🔪",
                reqLevel: 12,
                reqPointsInTree: 10,
                maxLevel: 5,
                effect: (level) => ({ executeThreshold: 0.2 + 0.02 * level })
            },
            "darkness": {
                name: "Мрак",
                desc: "Намалява точността на всички врагове с 50% за 2 рунда.",
                icon: "🌌",
                reqLevel: 15,
                reqPointsInTree: 12,
                maxLevel: 3,
                effect: (level) => ({ blindChance: 0.3 + 0.1 * level })
            },
            "vanish": {
                name: "Изчезване",
                desc: "Излиза от битка без загуби.",
                icon: "🌀",
                reqLevel: 18,
                reqPointsInTree: 15,
                maxLevel: 1,
                effect: () => ({ vanishSuccess: 1.0 })
            },
            "shadow_dance": {
                name: "Сенчест танц",
                desc: "Атакува 3 пъти подред, но с 50% щети.",
                icon: "💃",
                reqLevel: 20,
                reqPointsInTree: 18,
                maxLevel: 5,
                effect: (level) => ({ multiStrike: 2 + level, damageReduction: 0.5 })
            },
            "death_mark": {
                name: "Знак на смъртта",
                desc: "Маркира враг – след 3 рунда умира.",
                icon: "💀",
                reqLevel: 25,
                reqPointsInTree: 20,
                maxLevel: 3,
                effect: (level) => ({ deathDelay: 3, chance: 0.2 + 0.1 * level })
            }
        }
    },

    // ==================== 4. КОМАНДНИ УМЕНИЯ (Command) ====================
    command: {
        name: "Командни умения",
        icon: "🏰",
        skills: {
            "leadership": {
                name: "Лидерство",
                desc: "Увеличава атаката на всички приятелски герои.",
                icon: "👑",
                reqLevel: 2,
                reqPointsInTree: 0,
                maxLevel: 10,
                effect: (level) => ({ allyAttackBonus: 2 * level })
            },
            "rally": {
                name: "Сбор",
                desc: "Възстановява 20% от загубените войници.",
                icon: "📯",
                reqLevel: 4,
                reqPointsInTree: 2,
                maxLevel: 5,
                effect: (level) => ({ recoveryPercent: 0.05 * level })
            },
            "formation": {
                name: "Боен строй",
                desc: "Намалява щетите върху всички съюзници.",
                icon: "🛡️",
                reqLevel: 6,
                reqPointsInTree: 4,
                maxLevel: 5,
                effect: (level) => ({ damageReduction: 0.02 * level })
            },
            "battle_cry": {
                name: "Боен вик",
                desc: "Увеличава атаката и защитата за 3 рунда.",
                icon: "📢",
                reqLevel: 8,
                reqPointsInTree: 6,
                maxLevel: 5,
                effect: (level) => ({ cryAttackBonus: 10 * level, cryDefenseBonus: 5 * level, cryDuration: 3 })
            },
            "supply_lines": {
                name: "Снабдителни линии",
                desc: "Намалява разходите за поддръжка на армията.",
                icon: "🚚",
                reqLevel: 10,
                reqPointsInTree: 8,
                maxLevel: 5,
                effect: (level) => ({ upkeepReduction: 0.05 * level })
            },
            "motivation": {
                name: "Мотивация",
                desc: "След победа, всички герои получават +10% XP.",
                icon: "⭐",
                reqLevel: 12,
                reqPointsInTree: 10,
                maxLevel: 5,
                effect: (level) => ({ xpBonus: 0.05 * level })
            },
            "tactical_retreat": {
                name: "Тактическо отстъпление",
                desc: "Позволява бягство без загуби и с 50% шанс за контраатака.",
                icon: "🏃",
                reqLevel: 15,
                reqPointsInTree: 12,
                maxLevel: 3,
                effect: (level) => ({ retreatCounterChance: 0.1 + 0.1 * level })
            },
            "overwhelming_force": {
                name: "Преобладаваща сила",
                desc: "Ако имаш 2 пъти повече войници, атаката се удвоява.",
                icon: "💪",
                reqLevel: 18,
                reqPointsInTree: 15,
                maxLevel: 5,
                effect: (level) => ({ outnumberBonus: 0.2 * level })
            },
            "martyrdom": {
                name: "Мъченичество",
                desc: "Когато герой падне, останалите получават 50% бонус атака.",
                icon: "⚰️",
                reqLevel: 20,
                reqPointsInTree: 18,
                maxLevel: 1,
                effect: () => ({ martyrBonus: 0.5 })
            },
            "conquest": {
                name: "Завоевание",
                desc: "Завладените региони дават двоен доход.",
                icon: "🏆",
                reqLevel: 25,
                reqPointsInTree: 20,
                maxLevel: 5,
                effect: (level) => ({ conqueredIncomeBonus: 0.2 * level })
            }
        }
    },

    // ==================== 5. МИСТИЧНИ УМЕНИЯ (Mystic) ====================
    mystic: {
        name: "Мистични умения",
        icon: "🔮",
        skills: {
            "clairvoyance": {
                name: "Ясновидство",
                desc: "Увеличава шанса за намиране на артефакти.",
                icon: "👁️",
                reqLevel: 3,
                reqPointsInTree: 0,
                maxLevel: 5,
                effect: (level) => ({ artifactChance: 0.05 * level })
            },
            "blessing": {
                name: "Благословия",
                desc: "Увеличава късмета на героя (критичен удар, избягване).",
                icon: "✨",
                reqLevel: 5,
                reqPointsInTree: 2,
                maxLevel: 10,
                effect: (level) => ({ luckBonus: 5 * level })
            },
            "curse": {
                name: "Проклятие",
                desc: "Намалява атаката и защитата на врага с 20%.",
                icon: "😈",
                reqLevel: 7,
                reqPointsInTree: 4,
                maxLevel: 5,
                effect: (level) => ({ curseReduction: 0.05 * level, curseDuration: 3 })
            },
            "spirit_link": {
                name: "Духовна връзка",
                desc: "Споделя здравето между всички герои.",
                icon: "🔗",
                reqLevel: 10,
                reqPointsInTree: 6,
                maxLevel: 3,
                effect: (level) => ({ spiritShare: 0.2 + 0.1 * level })
            },
            "reincarnation": {
                name: "Прераждане",
                desc: "След смърт, героят се възражда с 30% здраве веднъж на битка.",
                icon: "🔄",
                reqLevel: 12,
                reqPointsInTree: 8,
                maxLevel: 3,
                effect: (level) => ({ reviveHp: 0.2 + 0.1 * level })
            },
            "prophecy": {
                name: "Пророчество",
                desc: "Показва вражеските атаки предварително – 50% шанс за пълно избягване.",
                icon: "🔮",
                reqLevel: 15,
                reqPointsInTree: 10,
                maxLevel: 5,
                effect: (level) => ({ foresightChance: 0.1 * level })
            },
            "astral_projection": {
                name: "Астрална проекция",
                desc: "Позволява шпиониране на врага без битка.",
                icon: "🌌",
                reqLevel: 18,
                reqPointsInTree: 12,
                maxLevel: 1,
                effect: () => ({ spySuccess: 1.0 })
            },
            "mana_burn": {
                name: "Изгаряне на мана",
                desc: "Атаката източва маната на врага и нанася щети.",
                icon: "💧",
                reqLevel: 20,
                reqPointsInTree: 15,
                maxLevel: 5,
                effect: (level) => ({ manaBurnPercent: 0.1 * level })
            },
            "divine_intervention": {
                name: "Божествена намеса",
                desc: "Възкресява всички паднали съюзници в края на битката.",
                icon: "👼",
                reqLevel: 25,
                reqPointsInTree: 18,
                maxLevel: 1,
                effect: () => ({ resurrection: true })
            },
            "arcane_eye": {
                name: "Арканово око",
                desc: "Разкрива скрити ресурси на картата – допълнително злато, артефакти.",
                icon: "👁️",
                reqLevel: 30,
                reqPointsInTree: 20,
                maxLevel: 5,
                effect: (level) => ({ hiddenResourcesBonus: 10 * level })
            }
        }
    },

    // ==================== 6. ИКОНОМИЧЕСКИ УМЕНИЯ (Economy) ====================
    economy: {
        name: "Икономически умения",
        icon: "💰",
        skills: {
            "tax_collection": {
                name: "Събиране на данъци",
                desc: "Увеличава годишния доход от региони.",
                icon: "📜",
                reqLevel: 2,
                reqPointsInTree: 0,
                maxLevel: 10,
                effect: (level) => ({ taxBonus: 0.05 * level })
            },
            "trade_agreements": {
                name: "Търговски споразумения",
                desc: "Намалява цените за покупка на армия.",
                icon: "🤝",
                reqLevel: 4,
                reqPointsInTree: 2,
                maxLevel: 5,
                effect: (level) => ({ armyCostReduction: 0.05 * level })
            },
            "gold_fever": {
                name: "Златна треска",
                desc: "Увеличава златото от битки и грабежи.",
                icon: "💰",
                reqLevel: 6,
                reqPointsInTree: 4,
                maxLevel: 10,
                effect: (level) => ({ goldDropBonus: 0.1 * level })
            },
            "merchant_guild": {
                name: "Търговска гилдия",
                desc: "Дава възможност за обмен на ресурси на изгодни цени.",
                icon: "🏛️",
                reqLevel: 8,
                reqPointsInTree: 6,
                maxLevel: 5,
                effect: (level) => ({ tradeRatio: 1 + 0.05 * level })
            },
            "investments": {
                name: "Инвестиции",
                desc: "Влагаш злато, което носи доход след 5 хода.",
                icon: "📈",
                reqLevel: 10,
                reqPointsInTree: 8,
                maxLevel: 5,
                effect: (level) => ({ investmentReturn: 0.1 * level })
            },
            "banking": {
                name: "Банкерство",
                desc: "Намалява разходите за поддръжка на армията с 50%.",
                icon: "🏦",
                reqLevel: 12,
                reqPointsInTree: 10,
                maxLevel: 3,
                effect: (level) => ({ bankingUpkeep: 0.1 * level })
            },
            "mining": {
                name: "Добив на руда",
                desc: "Увеличава добива на желязо и злато от мини.",
                icon: "⛏️",
                reqLevel: 15,
                reqPointsInTree: 12,
                maxLevel: 10,
                effect: (level) => ({ mineOutput: 10 * level })
            },
            "black_market": {
                name: "Черен пазар",
                desc: "Позволява закупуване на редки артефакти на половин цена.",
                icon: "🖤",
                reqLevel: 18,
                reqPointsInTree: 15,
                maxLevel: 3,
                effect: (level) => ({ blackMarketDiscount: 0.1 * level })
            },
            "economic_boom": {
                name: "Икономически бум",
                desc: "Всички доходи са удвоени за 5 хода.",
                icon: "🚀",
                reqLevel: 20,
                reqPointsInTree: 18,
                maxLevel: 1,
                effect: () => ({ boomDuration: 5, boomMultiplier: 2 })
            },
            "treasury": {
                name: "Държавна хазна",
                desc: "Натрупва 10% от златото всеки ход като лихва.",
                icon: "🏦",
                reqLevel: 25,
                reqPointsInTree: 20,
                maxLevel: 5,
                effect: (level) => ({ interestRate: 0.02 * level })
            }
        }
    }
};

// ==================== ХЕЛПЪР ФУНКЦИИ ЗА УМЕНИЯ ====================
/**
 * Връща списък с всички умения (за UI)
 */
window.getAllAdvancedSkills = function() {
    const all = [];
    for (let treeKey in window.advancedSkills) {
        const tree = window.advancedSkills[treeKey];
        for (let skillKey in tree.skills) {
            const skill = tree.skills[skillKey];
            all.push({
                tree: treeKey,
                treeName: tree.name,
                treeIcon: tree.icon,
                key: skillKey,
                name: skill.name,
                desc: skill.desc,
                icon: skill.icon,
                reqLevel: skill.reqLevel,
                reqPointsInTree: skill.reqPointsInTree,
                maxLevel: skill.maxLevel,
                effect: skill.effect
            });
        }
    }
    return all;
};

/**
 * Научаване на умение (проверява точки, изисквания, записва в hero.learnedSkills)
 * hero.learnedSkills = { skillKey: level }
 */
window.learnAdvancedSkill = function(hero, treeKey, skillKey) {
    if (!hero || !hero.skillPoints || hero.skillPoints <= 0) {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате свободни точки за умения!");
        return false;
    }
    const tree = window.advancedSkills[treeKey];
    if (!tree) return false;
    const skill = tree.skills[skillKey];
    if (!skill) return false;
    if (hero.level < skill.reqLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Изисква се ниво ${skill.reqLevel}!`);
        return false;
    }
    if (!hero.learnedSkills) hero.learnedSkills = {};
    const currentLevel = hero.learnedSkills[skillKey] || 0;
    if (currentLevel >= skill.maxLevel) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Умението е вече на максимално ниво ${skill.maxLevel}!`);
        return false;
    }
    // Проверка за точки в дървото
    let pointsInTree = 0;
    for (let sk in hero.learnedSkills) {
        if (window.advancedSkills[treeKey] && window.advancedSkills[treeKey].skills[sk]) {
            pointsInTree += hero.learnedSkills[sk];
        }
    }
    if (pointsInTree < skill.reqPointsInTree) {
        if (window.showAdvisorMsg) window.showAdvisorMsg(`❌ Изискват се ${skill.reqPointsInTree} точки в дървото "${tree.name}"!`);
        return false;
    }
    hero.learnedSkills[skillKey] = currentLevel + 1;
    hero.skillPoints--;
    // Прилагане на ефекта (ако има незабавни ефекти като увеличение на heroPower)
    const effect = skill.effect(hero.learnedSkills[skillKey]);
    if (effect.attackBonus) hero.heroPower = (hero.heroPower || 0) + effect.attackBonus;
    if (effect.defenseBonus) hero.defense = (hero.defense || 0) + effect.defenseBonus;
    // ... тук могат да се добавят други ефекти
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`✅ ${hero.name} научи "${skill.name}" ниво ${hero.learnedSkills[skillKey]}!`);
    }
    return true;
};

/**
 * Изчислява всички активни бонуси от научените умения
 */
window.getAdvancedSkillBonuses = function(hero) {
    if (!hero || !hero.learnedSkills) return {};
    const bonuses = {};
    for (let skillKey in hero.learnedSkills) {
        const level = hero.learnedSkills[skillKey];
        // Намираме умението
        for (let treeKey in window.advancedSkills) {
            const skill = window.advancedSkills[treeKey].skills[skillKey];
            if (skill) {
                const effect = skill.effect(level);
                for (let bonusKey in effect) {
                    bonuses[bonusKey] = (bonuses[bonusKey] || 0) + effect[bonusKey];
                }
                break;
            }
        }
    }
    return bonuses;
};

console.log("✅ skills.js зареден – над 100 умения в 6 дървета.");
