/**
 * ========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – БИТКА: ОСНОВНА ЛОГИКА (battle-core.js)
 * Версия: 2.1 – ФИНАЛНА, РАБОТЕЩА В КЛАСИЧЕСКИ РЕЖИМ
 * ========================================================================
 */

(function() {
    // ========== СИСТЕМА ЗА ЕПИЧЕН РАЗКАЗ ==========
    let _battleNarrative = [];
    function addNarrative(text, type = "info") {
        _battleNarrative.push({ text, type, time: Date.now() });
        if (_battleNarrative.length > 40) _battleNarrative.shift();
    }
    function resetNarrative() { _battleNarrative = []; }
    function getNarrative() { return [..._battleNarrative]; }
    function generateBattleStory(regionName, heroes, enemies, isVictory, rewards) {
        if (_battleNarrative.length === 0) {
            return isVictory 
                ? `⚔️ Сражението за ${regionName} приключи с победа! Врагът е разпръснат.`
                : `💀 Битката за ${regionName} завърши с поражение. Войските се оттеглиха.`;
        }
        let story = `🏰 **Битката за ${regionName}**\n\n`;
        let importantEvents = _battleNarrative.slice(0, 12);
        for (let ev of importantEvents) story += `▸ ${ev.text}\n`;
        if (isVictory) {
            story += `\n✨ **ПОБЕДА!** ✨\n`;
            if (rewards.gold) story += `💰 Намерено злато: ${rewards.gold}\n`;
            if (rewards.xp) story += `📚 Придобит опит: ${rewards.xp}\n`;
            if (rewards.artifact) story += `🏺 Открит артефакт: "${rewards.artifact.name}"\n`;
        } else {
            story += `\n💀 **ПОРАЖЕНИЕ** 💀\n`;
        }
        return story;
    }

    // ========== ПОМОЩНИ ФУНКЦИИ ЗА БОНУСИ ==========
    function getTroopSpecialEffects(hero) {
        if (!hero || !hero.armyDetails || !window.ALL_TROOP_TYPES) return {};
        let effects = {
            lifeSteal: 0,
            critChanceBonus: 0,
            damageReduction: 0,
            firstStrikeBonus: 0,
            nightFuryBonus: 0,
            hasSplash: false,
            hasDoubleCast: false,
            hasInvincibleOnce: false,
            hasTimeSkip: false,
            hasArmyShrink: false
        };
        for (let troop of window.ALL_TROOP_TYPES) {
            let count = hero.armyDetails[troop.id] || 0;
            if (count > 0 && troop.special) {
                let parts = troop.special.split(':');
                let key = parts[0];
                let value = parts[1] ? parseFloat(parts[1]) : null;
                switch(key) {
                    case "lifeSteal": if (value) effects.lifeSteal = Math.max(effects.lifeSteal, value); break;
                    case "critChance": if (value) effects.critChanceBonus = Math.max(effects.critChanceBonus, value); break;
                    case "damageReduction": if (value) effects.damageReduction = Math.max(effects.damageReduction, value); break;
                    case "firstStrikeBonus": if (value) effects.firstStrikeBonus = Math.max(effects.firstStrikeBonus, value); break;
                    case "nightFury": if (value) effects.nightFuryBonus = Math.max(effects.nightFuryBonus, value); break;
                    case "splashDamage": effects.hasSplash = true; break;
                    case "doubleCast": effects.hasDoubleCast = true; break;
                    case "invincibleOnce": effects.hasInvincibleOnce = true; break;
                    case "timeSkip": effects.hasTimeSkip = true; break;
                    case "armyShrink": effects.hasArmyShrink = true; break;
                }
            }
        }
        return effects;
    }

    function getPetEffects(hero) {
        if (!hero || !hero.pet) return {};
        let petId = hero.pet;
        let effects = {
            reviveChance: 0,
            extraTurnChance: 0,
            damageBonus: 0,
            critChanceBonus: 0,
            lifeSteal: 0,
            damageReduction: 0,
            goldBonus: 0,
            fireDamage: 0,
            coldDamage: 0,
            healAllies: 0
        };
        if (window.divinePets && window.divinePets[petId]) {
            let pet = window.divinePets[petId];
            if (pet.bonus) {
                if (pet.bonus.reviveChance) effects.reviveChance = pet.bonus.reviveChance;
                if (pet.bonus.extraTurn) effects.extraTurnChance = pet.bonus.extraTurn;
                if (pet.bonus.fireDamage) effects.fireDamage = pet.bonus.fireDamage;
                if (pet.bonus.coldDamage) effects.coldDamage = pet.bonus.coldDamage;
                if (pet.bonus.critChance) effects.critChanceBonus = pet.bonus.critChance;
                if (pet.bonus.lifeSteal) effects.lifeSteal = pet.bonus.lifeSteal;
                if (pet.bonus.damageReduction) effects.damageReduction = pet.bonus.damageReduction;
                if (pet.bonus.goldBonus) effects.goldBonus = pet.bonus.goldBonus;
                if (pet.bonus.healAllies) effects.healAllies = pet.bonus.healAllies;
            }
        } else if (window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[petId]) {
            let pet = window.rpgDatabase.petsDatabase[petId];
            let petName = (pet.name || "").toLowerCase();
            if (petName === "родов сокол") effects.damageBonus = 0.15;
            else if (petName === "вълк единак") effects.critChanceBonus = 0.10;
            else if (petName === "степен жребец") effects.damageReduction = 0.15;
        }
        return effects;
    }

    function getAdvancedSkillCombatBonuses(hero) {
        if (!hero || typeof window.getAdvancedSkillBonuses !== 'function') return {};
        const bonuses = window.getAdvancedSkillBonuses(hero);
        return {
            critChance: bonuses.critChance || 0,
            firstStrikeBonus: bonuses.firstStrikeBonus || 0,
            damageBonus: bonuses.damageBonus || 0,
            extraAttackChance: bonuses.extraAttackChance || 0,
            executeBonus: bonuses.executeBonus || 0,
            aoeDamage: bonuses.aoeDamage || 0,
            lowHpBonus: bonuses.lowHpBonus || 0,
            attackBonus: bonuses.attackBonus || 0,
            spellPower: bonuses.spellPower || 0
        };
    }

    // ========== HP И ЛЕЧЕНИЕ ==========
    function calculatePostBattleHealing(originalHero, battleHero) {
        let heal = 0;
        let endurance = originalHero.skills?.endurance || 0;
        heal += endurance * 8;
        heal += originalHero.maxHp * 0.05;
        if (originalHero.pet) {
            if (originalHero.pet === 'bear') heal += originalHero.maxHp * 0.1;
            if (originalHero.pet === 'wolf') heal += originalHero.maxHp * 0.05;
        }
        if (originalHero.inventory && Array.isArray(originalHero.inventory)) {
            originalHero.inventory.forEach(item => {
                if (item && item.bonus && item.bonus.hpRegen) {
                    heal += item.bonus.hpRegen;
                }
            });
        }
        if (originalHero.morale > 70) heal *= 1.2;
        else if (originalHero.morale < 30) heal *= 0.8;
        return Math.floor(Math.max(5, heal));
    }

    function applyBattleOutcome(originalHero, battleHero) {
        if (!originalHero || !battleHero) return;
        if (!originalHero.maxHp || originalHero.maxHp <= 0) {
            let endurance = originalHero.skills?.endurance || 0;
            originalHero.maxHp = 100 + (originalHero.level - 1) * 20 + endurance * 15;
            if (originalHero.hp === undefined || originalHero.hp > originalHero.maxHp) {
                originalHero.hp = originalHero.maxHp;
            }
        }
        let startingHp = battleHero.startingHp !== undefined ? battleHero.startingHp : battleHero.maxHp;
        let damageTaken = startingHp - battleHero.hp;
        if (damageTaken < 0) damageTaken = 0;
        if (damageTaken > 0) {
            originalHero.hp = Math.max(0, (originalHero.hp || originalHero.maxHp) - damageTaken);
            if (originalHero.hp <= 0) {
                let deathRoll = Math.random() < 0.05;
                if (deathRoll) {
                    originalHero.isAlive = false;
                    originalHero.isJoined = false;
                    originalHero.isFavorite = false;
                    if (window.addWorldEvent) window.addWorldEvent("💀 ПЕРМАНЕНТНА СМЪРТ", `${originalHero.name} загина завинаги в битка!`, "💀");
                } else {
                    originalHero.hp = 1;
                    if (window.addWorldEvent) window.addWorldEvent("⚡ ЕДВА ОЦЕЛЯВАНЕ", `${originalHero.name} беше на ръба на смъртта, но оживя!`, "⚡");
                }
            }
        }
        let postHeal = Math.floor(Math.max(5, originalHero.maxHp * 0.05));
        if (postHeal > 0 && originalHero.hp > 0 && originalHero.hp < originalHero.maxHp) {
            originalHero.hp = Math.min(originalHero.maxHp, originalHero.hp + postHeal);
        }
    }

    // ========== АНИМАЦИИ И ВИЗУАЛИЗАЦИЯ ==========
    function showFloatingNumber(targetElement, value, isHeal = false) {
        const rect = targetElement.getBoundingClientRect();
        const div = document.createElement('div');
        div.className = 'damage-number';
        div.innerText = isHeal ? `+${value}` : `-${value}`;
        div.style.color = isHeal ? '#88ff88' : '#ff5555';
        div.style.left = `${rect.left + rect.width/2}px`;
        div.style.top = `${rect.top}px`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 600);
    }

    function animateCard(cardElement) {
        if (!cardElement) return;
        cardElement.classList.add('attack-animation');
        setTimeout(() => cardElement.classList.remove('attack-animation'), 150);
    }

    function screenShake(container) {
        if (!container) return;
        container.style.transform = 'translateX(4px)';
        setTimeout(() => container.style.transform = 'translateX(-3px)', 50);
        setTimeout(() => container.style.transform = 'translateX(2px)', 100);
        setTimeout(() => container.style.transform = 'translateX(0)', 150);
    }

    // ========== ПОДКРЕПЛЕНИЯ (ОПРАВЕН БЪГ) ==========
   function getReinforcements(region, playerHeroes) {
    if (!window.worldData || !window.worldData.clans) return [];
    let available = [];
    let playerHeroNames = new Set(playerHeroes.map(h => h.name));
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        // Всички живи нелюбими герои (без значение isJoined)
        if (hero && hero.isAlive !== false && !hero.isFavorite && !playerHeroNames.has(hero.name)) {
            available.push(hero);
        }
    }
    console.log("Налични нелюбими за подкрепления:", available.length);
    if (available.length === 0) return [];
    
    // ⭐ ПРЕМАХВАМЕ ШАНСА – ВИНАГИ ДОБАВЯМЕ ПОДКРЕПЛЕНИЯ
    let count = Math.min(2, available.length); // 1-2 подкрепления
    // Избираме най-опасните (по сила)
    for (let h of available) {
        let relation = window.clanRelations?.[h.clan] || 50;
        h._dangerScore = (h.heroPower || 100) * 0.6 + (100 - relation) * 0.4;
    }
    available.sort((a,b) => b._dangerScore - a._dangerScore);
    let selected = available.slice(0, count);
    return selected.map(hero => ({
        id: hero.id,
        name: hero.name,
        clan: hero.clan,
        power: hero.heroPower || 100,
        hp: hero.maxHp || 100,
        maxHp: hero.maxHp || 100,
        icon: "⚔️",
        isHero: true,
        heroObj: hero,
        startingHp: hero.hp || hero.maxHp || 100
    }));
}
    // ========== АРМИЯ ЗАГУБИ ==========
    function applyArmyLossFromDamage(hero, damagePercent, addLogFn) {
        if (!hero.clanObj) return;
        let armyLossPercent = damagePercent * 0.5;
        let currentArmy = hero.clanObj.armySize || hero.armySize || 300;
        let newArmy = Math.max(10, Math.floor(currentArmy * (1 - armyLossPercent)));
        hero.clanObj.armySize = newArmy;
        hero.clanObj.currentArmy = newArmy;
        hero.armySize = newArmy;
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero.clanObj);
        if (addLogFn) addLogFn(`   📉 ${hero.name} загуби ${Math.floor(armyLossPercent * 100)}% от армията си! Остава: ${newArmy} войници.`);
    }

    // ========== СЪБИРАНЕ НА ГЕРОИТЕ НА ИГРАЧА (ФИНАЛНА ВЕРСИЯ) ==========
    function collectPlayerHeroes() {
    let heroes = [];
    const worldData = window.worldData;
    if (!worldData || !worldData.clans) return heroes;
    
    for (let key in worldData.clans) {
        let clan = worldData.clans[key];
        try {
            // БЕЗ ПРОВЕРКА ЗА РЕЖИМ, БЕЗ ПРОВЕРКА ЗА isFavorite
            // Взимаме всички живи и наети герои
            if (clan.isJoined === true && clan.isAlive !== false) {
                if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(clan);
                let calculatedPower = clan.heroPower || 100;
                if (window.recalculateHeroPower) calculatedPower = window.recalculateHeroPower(clan);
                let classBonus = 1.0;
                if (clan.classBonuses && clan.currentClass) {
                    const classData = window.hybridClasses?.find(c => c.name === clan.currentClass);
                    if (classData?.bonuses?.heroPower) calculatedPower += classData.bonuses.heroPower;
                    if (classData?.bonuses?.armyBonus) classBonus += classData.bonuses.armyBonus;
                }
                let armySize = clan.armySize || clan.currentArmy || 300;
                let finalPower = Math.floor(calculatedPower * classBonus * (armySize / 300));
                finalPower = Math.max(50, finalPower);
                heroes.push({
                    id: key,
                    name: clan.leaderName || clan.name || key,
                    className: clan.currentClass || "Воевода",
                    power: finalPower,
                    hp: clan.hp || clan.maxHp || 100,
                    maxHp: clan.maxHp || 100,
                    icon: "⚔️",
                    armySize: armySize,
                    clanObj: clan,
                    troopEffects: getTroopSpecialEffects(clan)
                });
            }
        } catch(err) {
            console.error(`Грешка при добавяне на ${clan.name}:`, err);
        }
    }
    return heroes.slice(0, 5);
}
    // ========== ИЗЧИСЛЕНИЯ НА АТАКИТЕ ==========
    function calculateHeroDamage(hero, target, currentRound, addLogFn, addNarrativeFn, animateHeroFn, animateEnemyFn, updateUIFn) {
        let baseDamage = Math.max(1, Math.floor(hero.power * (0.5 + Math.random() * 0.7)));
        let troopEffects = hero.troopEffects || {};
        let petEffects = getPetEffects(hero.clanObj);
        let skillBonuses = getAdvancedSkillCombatBonuses(hero.clanObj);
        
        let damageMultiplier = 1.0;
        let critChance = 0.15;
        let isFirstStrike = (currentRound === 1);
        let isNight = (window.gameTime && window.gameTime.seasonIndex === 3);
        
        if (troopEffects.firstStrikeBonus && isFirstStrike) {
            damageMultiplier += troopEffects.firstStrikeBonus;
            if (addLogFn) addLogFn(`   ⚡ ${hero.name} използва Пикиране от войски (първи удар)!`);
            if (addNarrativeFn) addNarrativeFn(`${hero.name} атакува пръв с Пикиране (+${Math.floor(troopEffects.firstStrikeBonus*100)}% щети).`);
        }
        if (skillBonuses.firstStrikeBonus && isFirstStrike) {
            damageMultiplier += skillBonuses.firstStrikeBonus;
            if (addLogFn) addLogFn(`   ⚡ ${hero.name} използва Първи удар от умения!`);
            if (addNarrativeFn) addNarrativeFn(`${hero.name} нанася първи удар (умения: +${Math.floor(skillBonuses.firstStrikeBonus*100)}% щети).`);
        }
        if (troopEffects.nightFuryBonus && isNight) {
            damageMultiplier += troopEffects.nightFuryBonus;
            if (addLogFn) addLogFn(`   🌙 ${hero.name} активира Нощна ярост от войски!`);
            if (addNarrativeFn) addNarrativeFn(`🌙 ${hero.name} активира Нощна ярост (+${Math.floor(troopEffects.nightFuryBonus*100)}% щети).`);
        }
        if (petEffects.damageBonus) {
            damageMultiplier += petEffects.damageBonus;
            if (addLogFn) addLogFn(`   🐾 ${hero.name} получава бонус щети от любимеца!`);
            if (addNarrativeFn) addNarrativeFn(`${hero.name} получава бонус щети от любимец (${Math.floor(petEffects.damageBonus*100)}%).`);
        }
        if (skillBonuses.damageBonus) damageMultiplier += skillBonuses.damageBonus;
        if (skillBonuses.attackBonus) baseDamage += skillBonuses.attackBonus;
        if (troopEffects.critChanceBonus) critChance += troopEffects.critChanceBonus;
        if (petEffects.critChanceBonus) critChance += petEffects.critChanceBonus;
        if (skillBonuses.critChance) critChance += skillBonuses.critChance;
        if (petEffects.fireDamage) {
            let fireBonus = petEffects.fireDamage;
            baseDamage += fireBonus;
            if (addLogFn) addLogFn(`   🔥 ${hero.name} добавя ${fireBonus} огнени щети от любимеца!`);
            if (addNarrativeFn) addNarrativeFn(`🔥 ${hero.name} изгаря врага с ${fireBonus} огнени щети (любимец).`);
        }
        if (skillBonuses.lowHpBonus && hero.hp < hero.maxHp * 0.3) {
            let lowBonus = 1 + (hero.maxHp - hero.hp) / hero.maxHp * skillBonuses.lowHpBonus;
            damageMultiplier += lowBonus - 1;
            if (addLogFn) addLogFn(`   😡 ${hero.name} активира Берсерк (ниско здраве)!`);
            if (addNarrativeFn) addNarrativeFn(`😡 ${hero.name} изпада в Берсерк и увеличава щетите!`);
        }
        
        let finalDamage = Math.floor(baseDamage * damageMultiplier);
        let isCrit = Math.random() < critChance;
        if (isCrit) {
            let critMultiplier = 1.8;
            if (skillBonuses.critDamage) critMultiplier += skillBonuses.critDamage;
            finalDamage = Math.floor(finalDamage * critMultiplier);
        }
        
        let totalLifeSteal = troopEffects.lifeSteal + petEffects.lifeSteal;
        let healAmount = 0;
        if (totalLifeSteal > 0) {
            healAmount = Math.floor(finalDamage * totalLifeSteal);
            if (healAmount > 0) {
                hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
                if (addLogFn) addLogFn(`   💚 ${hero.name} възстановява ${healAmount} живот (Кръвопиец/Любимец)!`);
                if (animateHeroFn) animateHeroFn(hero.id, healAmount, true);
                if (addNarrativeFn) addNarrativeFn(`💚 ${hero.name} възстановява ${healAmount} живот.`);
            }
        }
        
        target.hp = Math.max(0, target.hp - finalDamage);
        if (updateUIFn) updateUIFn();
        if (addLogFn) addLogFn(`   ⚔️ ${hero.name} нанася ${finalDamage} щети на ${target.name}${isCrit ? ' 💥 КРИТИЧЕН!' : ''}`);
        if (animateHeroFn) animateHeroFn(hero.id);
        if (animateEnemyFn) animateEnemyFn(target.id || (target.isMonster ? "monster" : null), finalDamage);
        if (addNarrativeFn) addNarrativeFn(`⚔️ ${hero.name} нанася ${finalDamage} щети${isCrit ? " (критичен удар!)" : ""} на ${target.name}.`);
        
        return finalDamage;
    }

    function calculateEnemyDamage(enemy, target, addLogFn, addNarrativeFn, animateEnemyFn, animateHeroFn, updateUIFn, shakeFn) {
        let damage = Math.floor(enemy.power * (0.35 + Math.random() * 0.55));
        damage = Math.max(1, damage);
        
        let troopEffects = target.troopEffects || {};
        let petEffects = getPetEffects(target.clanObj);
        let skillBonuses = getAdvancedSkillCombatBonuses(target.clanObj);
        let damageReduction = 0;
        if (troopEffects.damageReduction) damageReduction += troopEffects.damageReduction;
        if (petEffects.damageReduction) damageReduction += petEffects.damageReduction;
        if (skillBonuses.damageReduction) damageReduction += skillBonuses.damageReduction;
        if (damageReduction > 0) {
            let reduced = Math.floor(damage * (1 - Math.min(0.9, damageReduction)));
            if (addLogFn) addLogFn(`   🛡️ ${target.name} намалява щетите с ${Math.floor(damageReduction*100)}%!`);
            damage = reduced;
            if (addNarrativeFn) addNarrativeFn(`${target.name} намалява щетите с ${Math.floor(damageReduction*100)}%.`);
        }
        
        let damagePercent = damage / target.maxHp;
        target.hp = Math.max(0, target.hp - damage);
        if (updateUIFn) updateUIFn();
        applyArmyLossFromDamage(target, damagePercent, addLogFn);
        
        if (addLogFn) {
            addLogFn(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLogFn(`👹 ${enemy.name} атакува ${target.name.toUpperCase()}!`);
            addLogFn(`   💔 Нанася ${damage} щети (${Math.floor(damagePercent * 100)}% от живота)`);
        }
        if (shakeFn) shakeFn(document.querySelector('.battle-container'));
        if (animateEnemyFn) animateEnemyFn(enemy.id || (enemy.isMonster ? "monster" : null));
        if (animateHeroFn) animateHeroFn(target.id, damage);
        if (addNarrativeFn) addNarrativeFn(`👹 ${enemy.name} нанася ${damage} щети на ${target.name} (${Math.floor(damagePercent*100)}% от здравето му).`);
        
        return damage;
    }

    // ========== ПУБЛИЧНО API ==========
    window.BattleCore = {
        addNarrative: addNarrative,
        resetNarrative: resetNarrative,
        getNarrative: getNarrative,
        generateBattleStory: generateBattleStory,
        getTroopSpecialEffects: getTroopSpecialEffects,
        getPetEffects: getPetEffects,
        getAdvancedSkillCombatBonuses: getAdvancedSkillCombatBonuses,
        calculatePostBattleHealing: calculatePostBattleHealing,
        applyBattleOutcome: applyBattleOutcome,
        showFloatingNumber: showFloatingNumber,
        animateCard: animateCard,
        screenShake: screenShake,
        getReinforcements: getReinforcements,
        applyArmyLossFromDamage: applyArmyLossFromDamage,
        collectPlayerHeroes: collectPlayerHeroes,
        calculateHeroDamage: calculateHeroDamage,
        calculateEnemyDamage: calculateEnemyDamage
    };
    
    console.log("✅ battle-core.js зареден – ФИНАЛНА ВЕРСИЯ, работи в класически режим");
})();
