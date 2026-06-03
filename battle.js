/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (ВЕРСИЯ 8.7 – ПЪЛНА, НЕСЪКРАТЕНА)
==========================================================================
*/

(function() {
    // ==================== СТИЛОВЕ ====================
    if (!document.getElementById('battle-styles-v2')) {
        const style = document.createElement('style');
        style.id = 'battle-styles-v2';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

            .ultimate-battle {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                z-index: 300000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Cinzel', 'MedievalSharp', serif;
                animation: battleFadeIn 0.3s ease;
                padding: 15px;
                box-sizing: border-box;
                overflow-y: auto;
            }

            @keyframes battleFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .battle-container {
                width: 100%;
                max-width: 1200px;
                background: rgba(0,0,0,0.75);
                backdrop-filter: blur(12px);
                border-radius: 32px;
                border: 2px solid #c9a87b;
                box-shadow: 0 0 50px rgba(0,0,0,0.8);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 95vh;
                position: relative;
            }

            .close-battle-btn {
                position: absolute;
                top: 12px;
                left: 12px;
                width: 36px;
                height: 36px;
                background: rgba(0,0,0,0.6);
                border: 1px solid #ff4444;
                color: #ff4444;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                z-index: 101;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .close-battle-btn:hover {
                background: rgba(255,68,68,0.2);
                transform: scale(1.05);
            }

            .battle-header {
                background: linear-gradient(135deg, #1a1a2e, #0d0d1a);
                padding: 12px 20px;
                text-align: center;
                border-bottom: 2px solid #c9a87b;
                flex-shrink: 0;
            }

            .battle-header h1 {
                margin: 0;
                color: #ffdd99;
                font-size: 1.4rem;
                letter-spacing: 2px;
            }

            .battle-header p {
                margin: 3px 0 0;
                color: #ccaa77;
                font-size: 0.75rem;
            }

            .heroes-section {
                padding: 15px;
                background: rgba(0,0,0,0.3);
                flex-shrink: 0;
            }

            .heroes-title {
                color: #ffdd99;
                font-size: 0.85rem;
                margin-bottom: 10px;
                padding-bottom: 4px;
                border-bottom: 1px solid #c9a87b;
                display: inline-block;
            }

            .heroes-grid {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
            }
            .hero-card {
                background: linear-gradient(145deg, rgba(30,25,20,0.9), rgba(20,15,10,0.95));
                border-radius: 14px;
                padding: 8px;
                text-align: center;
                border: 1px solid rgba(201,168,123,0.4);
                transition: transform 0.1s ease, box-shadow 0.1s ease;
                position: relative;
                flex: 0 0 auto;
                width: calc(20% - 10px);
                min-width: 85px;
                max-width: 110px;
            }
            .hero-card.attack-animation {
                transform: scale(0.95);
                filter: brightness(1.2);
            }

            .enemies-grid {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                margin: 15px 0;
            }
            .enemy-card {
                background: linear-gradient(145deg, rgba(50,20,20,0.95), rgba(30,10,10,0.98));
                border-radius: 20px;
                padding: 8px;
                text-align: center;
                flex: 0 0 auto;
                width: 140px;
                min-width: 100px;
                border: 2px solid #ff4444;
                transition: transform 0.1s ease;
                position: relative;
            }
            .enemy-card.attack-animation {
                transform: scale(0.97);
            }
            .enemy-icon {
                font-size: 32px;
            }
            .enemy-name {
                font-size: 12px;
                font-weight: bold;
                color: #ff6666;
            }
            .enemy-power {
                font-size: 10px;
                color: #cc8888;
            }

            .hero-portrait {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: 2px solid #ffd700;
                object-fit: cover;
                margin: 0 auto 4px auto;
                display: block;
            }

            .hero-icon {
                font-size: 28px;
                margin-bottom: 4px;
            }

            .hero-name {
                font-weight: bold;
                color: #ffdd99;
                font-size: 11px;
            }

            .hero-class {
                font-size: 8px;
                color: #ccaa77;
            }

            .hp-bar-bg {
                background: #2a1a0a;
                height: 6px;
                border-radius: 3px;
                margin: 6px 0;
                overflow: hidden;
            }

            .hp-bar-fill {
                background: linear-gradient(90deg, #cc3333, #ff5555);
                height: 100%;
                width: 100%;
                border-radius: 3px;
                transition: width 0.2s ease;
            }

            .hero-hp-text {
                font-size: 9px;
                color: #ffaa66;
            }

            .damage-number {
                position: absolute;
                font-weight: bold;
                font-size: 18px;
                text-shadow: 0 0 3px black;
                pointer-events: none;
                z-index: 1000;
                animation: floatUp 0.6s ease-out forwards;
            }

            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-40px); opacity: 0; }
            }

            .action-buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
                padding: 15px;
                flex-wrap: wrap;
                flex-shrink: 0;
            }

            .battle-btn {
                background: #2c1a0c;
                border: none;
                border-bottom: 3px solid #a05a2c;
                color: #ffdd99;
                font-size: 0.9rem;
                font-weight: bold;
                padding: 8px 20px;
                border-radius: 40px;
                cursor: pointer;
                transition: 0.1s linear;
                font-family: inherit;
                min-width: 110px;
            }

            .battle-btn:active {
                transform: translateY(2px);
                border-bottom-width: 1px;
            }

            .attack-btn {
                background: #7a2e1a;
                border-bottom-color: #cc5533;
            }

            .battle-log-section {
                padding: 12px 15px;
                background: rgba(0,0,0,0.4);
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .battle-log-title {
                color: #ffdd99;
                font-size: 11px;
                margin-bottom: 6px;
            }

            .battle-log {
                background: rgba(0,0,0,0.5);
                border-radius: 12px;
                padding: 8px;
                flex: 1;
                min-height: 50px;
                overflow-y: auto;
                font-size: 10px;
                font-family: monospace;
            }

            .battle-log p {
                margin: 3px 0;
                border-left: 2px solid #ffaa44;
                padding-left: 6px;
                color: #ddccaa;
            }

            @media (max-width: 700px) {
                .hero-card { width: calc(33% - 8px); min-width: 70px; }
                .enemy-card { width: 110px; }
                .battle-btn { padding: 4px 10px; font-size: 0.65rem; min-width: 70px; }
                .hero-portrait { width: 28px; height: 28px; }
                .hero-name { font-size: 7px; }
            }

            @media (max-width: 480px) {
                .hero-card { width: calc(50% - 6px); }
                .enemy-card { width: 90px; }
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== СИСТЕМА ЗА ЕПИЧЕН РАЗКАЗ ====================
    window._battleNarrative = [];
    function addNarrative(text, type = "info") {
        window._battleNarrative.push({ text, type, time: Date.now() });
        if (window._battleNarrative.length > 40) window._battleNarrative.shift();
    }
    function resetNarrative() {
        window._battleNarrative = [];
    }
    function generateBattleStory(regionName, heroes, enemies, isVictory, rewards) {
        if (!window._battleNarrative || window._battleNarrative.length === 0) {
            return isVictory 
                ? `⚔️ Сражението за ${regionName} приключи с победа! Врагът е разпръснат.`
                : `💀 Битката за ${regionName} завърши с поражение. Войските се оттеглиха.`;
        }
        let story = `🏰 **Битката за ${regionName}**\n\n`;
        let importantEvents = window._battleNarrative.slice(0, 12);
        for (let ev of importantEvents) {
            story += `▸ ${ev.text}\n`;
        }
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

    // ==================== ПОМОЩНИ ФУНКЦИИ ====================
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
            else if (petName === "балканска мечка") { /* handled elsewhere */ }
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

    // ==================== ФУНКЦИИ ЗА HP И ЛЕЧЕНИЕ ====================
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
            console.log(`🔥 ${originalHero.name} загуби ${damageTaken} HP. Остава: ${originalHero.hp}/${originalHero.maxHp}`);
            if (originalHero.hp <= 0) {
                let deathRoll = Math.random() < 0.05;
                if (deathRoll) {
                    originalHero.isAlive = false;
                    originalHero.isJoined = false;
                    originalHero.isFavorite = false;
                    if (window.addWorldEvent) {
                        window.addWorldEvent("💀 ПЕРМАНЕНТНА СМЪРТ", `${originalHero.name} загина завинаги в битка!`, "💀");
                    }
                } else {
                    originalHero.hp = 1;
                    if (window.addWorldEvent) window.addWorldEvent("⚡ ЕДВА ОЦЕЛЯВАНЕ", `${originalHero.name} беше на ръба на смъртта, но оживя!`, "⚡");
                }
            }
        } else {
            console.log(`ℹ️ ${originalHero.name} не е получил щети.`);
        }
        let postHeal = Math.floor(Math.max(5, originalHero.maxHp * 0.05));
        if (postHeal > 0 && originalHero.hp > 0 && originalHero.hp < originalHero.maxHp) {
            originalHero.hp = Math.min(originalHero.maxHp, originalHero.hp + postHeal);
            console.log(`💚 ${originalHero.name} се излекува с ${postHeal} HP след битката. Сега: ${originalHero.hp}/${originalHero.maxHp}`);
        }
    }

    // ==================== ЦЕНТРАЛИЗИРАНО ОБНОВЯВАНЕ НА UI ====================
    function refreshAllHeroUI() {
        console.log("🔄 refreshAllHeroUI извикана");
        if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
        if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (typeof window.updateCharacterUI === 'function') {
            let hero = window.getStrongestHero ? window.getStrongestHero() : null;
            if (hero) window.updateCharacterUI(hero);
        }
        const barracksScreen = document.getElementById('barracks-screen');
        if (barracksScreen && barracksScreen.style.display === 'flex' && typeof window.renderBarracksLayout === 'function') {
            window.renderBarracksLayout();
        }
    }

    // ==================== АНИМАЦИИ ====================
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

    // ==================== НОВА ФУНКЦИЯ ЗА ПОДКРЕПЛЕНИЯ ====================
    function getReinforcements(region, playerHeroes) {
        if (!window.worldData || !window.worldData.clans) return [];
        
        let available = [];
        let playerHeroNames = new Set(playerHeroes.map(h => h.name));
        // Взимаме всички герои (без проверка за isJoined), които са живи, не са любими и не са в отряда на играча
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isAlive !== false && !hero.isFavorite && !playerHeroNames.has(hero.name)) {
                available.push(hero);
            }
        }
        console.log("🔍 Налични нелюбими герои за подкрепления:", available.map(h => h.name));
        if (available.length === 0) return [];
        
        let difficultyFactor = (region.difficulty || 50) / 100;
        let playerPower = playerHeroes.reduce((sum, h) => sum + (h.power || 100), 0);
        let powerFactor = Math.min(1.0, playerPower / 1000);
        let relationBonus = 0;
        if (region.nativeClans && region.nativeClans.length > 0) {
            let clan = region.nativeClans[0];
            let relation = window.clanRelations?.[clan] || 50;
            relationBonus = (100 - relation) / 100;
        }
        let baseChance = 0.2 + difficultyFactor * 0.3 + powerFactor * 0.2 + relationBonus * 0.2;
        baseChance = Math.min(0.85, baseChance);
        
        console.log(`Шанс за подкрепления: ${(baseChance*100).toFixed(1)}%`);
        if (Math.random() > baseChance) return [];
        
        let maxReinforce = Math.min(4, available.length);
        let count = 1 + Math.floor(Math.random() * maxReinforce);
        console.log(`Брой подкрепления: ${count}`);
        
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

    // ==================== ОСНОВНА ФУНКЦИЯ ====================
    window.startBattle = function(regionInput) {
        resetNarrative();
        console.log("⚔️ startBattle извикана с:", regionInput);

        // Корекция за бутона "Битка" – избираме случаен вражески регион
        let finalRegionInput = regionInput;
        if (regionInput === "Мизия") {
            let ownedRegions = [];
            if (window.playerRegions) {
                ownedRegions = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [window.playerRegions];
            }
            let availableRegions = [];
            if (window.worldData && window.worldData.regions) {
                for (let r in window.worldData.regions) {
                    if (!ownedRegions.includes(r) && window.worldData.regions[r].armySize > 0) {
                        availableRegions.push(r);
                    }
                }
            }
            if (availableRegions.length > 0) {
                finalRegionInput = availableRegions[Math.floor(Math.random() * availableRegions.length)];
                console.log(`Бутонът за битка избра случаен регион: ${finalRegionInput}`);
            } else {
                console.warn("Няма свободни вражески региони, остава Мизия");
            }
        }

        let regionName = "Регион";
        let enemyPower = 200;
        let enemyHp = 200;
        let regionObject = null;

        if (typeof finalRegionInput === 'string') {
            regionName = finalRegionInput;
            if (window.worldData && window.worldData.regions && window.worldData.regions[finalRegionInput]) {
                regionObject = window.worldData.regions[finalRegionInput];
                let basePower = regionObject.armySize || 100;
                let defenseBonus = (regionObject.defenseLevel || 1) * 10;
                if (regionObject.buildings && regionObject.buildings.wall) {
                    defenseBonus += regionObject.buildings.wall * 2;
                }
                enemyPower = Math.max(50, basePower + defenseBonus);
                enemyHp = enemyPower;
                regionName = regionObject.name || finalRegionInput;
            }
        } else if (finalRegionInput && typeof finalRegionInput === 'object') {
            regionName = finalRegionInput.name || finalRegionInput.id || "Портал";
            enemyPower = finalRegionInput.armySize || finalRegionInput.difficulty * 12 || 200;
            enemyHp = enemyPower;
            regionObject = finalRegionInput;
        }

        // Събираме героите на играча (всички живи)
  let heroes = [];
if (window.worldData && window.worldData.clans) {
    for (let key in window.worldData.clans) {
        let clan = window.worldData.clans[key];
        // ⭐ НОВ РЕД: В класически режим пропускаме нелюбимите герои
        if (window.gameMode !== 'solo' && !clan.isFavorite) continue;
        
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
    }
}

        if (heroes.length === 0) {
            let fallbackHero = null;
            if (typeof window.getStrongestHero === 'function') fallbackHero = window.getStrongestHero();
            if (fallbackHero && fallbackHero.isAlive !== false) {
                let heroPower = fallbackHero.heroPower || 100;
                let armySize = fallbackHero.armySize || 300;
                heroes.push({
                    id: fallbackHero.clan || "hero",
                    name: fallbackHero.name || "Воевода",
                    className: fallbackHero.currentClass || "Багатур",
                    power: Math.max(50, heroPower),
                    hp: fallbackHero.hp || fallbackHero.maxHp || 100,
                    maxHp: fallbackHero.maxHp || 100,
                    icon: "⚔️",
                    armySize: armySize,
                    clanObj: fallbackHero,
                    troopEffects: getTroopSpecialEffects(fallbackHero)
                });
            }
        }

        let playerHeroes = heroes.slice(0, 5);
        if (playerHeroes.length === 0) {
            if (window.showAdvisorMsg) window.showAdvisorMsg("Нямате живи герои за битка!");
            return;
        }

        const mainEnemy = {
            id: "monster",
            name: regionName,
            power: enemyPower,
            hp: enemyHp,
            maxHp: enemyHp,
            icon: "👹",
            isMonster: true
        };

        let reinforcements = [];
        if (regionObject) {
            reinforcements = getReinforcements(regionObject, playerHeroes);
        }
        let enemies = [mainEnemy, ...reinforcements];
        
        if (reinforcements.length > 0) {
            addLog(`⚠️ Вражески подкрепления! Към ${mainEnemy.name} се присъединяват: ${reinforcements.map(r => r.name).join(', ')}`);
            addNarrative(`⚠️ На бойното поле пристигат подкрепления: ${reinforcements.map(r => r.name).join(', ')}.`);
        }

        window._lastBattleHeroes = playerHeroes;
        window.currentBattleState = { group: playerHeroes, enemies: enemies };

        const oldScreen = document.getElementById('ultimate-battle-screen');
        if (oldScreen) oldScreen.remove();

        const battleScreen = document.createElement('div');
        battleScreen.id = 'ultimate-battle-screen';
        battleScreen.className = 'ultimate-battle';

        let heroesHtml = '';
        for (let i = 0; i < playerHeroes.length; i++) {
            let hero = playerHeroes[i];
            const portraitUrl = hero.clanObj?.portrait || hero.portrait || '';
            const portraitHtml = portraitUrl ? `
                <div style="position: relative; min-height: 60px;">
                    <img src="${portraitUrl}" class="hero-portrait" onerror="this.style.display='none'; this.parentElement.querySelector('.hero-icon-fallback').style.display='block';">
                    <div class="hero-icon hero-icon-fallback" style="display: none; font-size: 28px;">${hero.icon}</div>
                </div>
            ` : `<div class="hero-icon" style="font-size:28px;">${hero.icon}</div>`;
            heroesHtml += `
                <div class="hero-card" data-id="${hero.id}">
                    ${portraitHtml}
                    <div class="flex flex-col items-center">
                        <h3 class="font-bold text-sm text-[#ffdd99] truncate w-full px-1">${hero.name.substring(0, 12)}</h3>
                        <span class="text-[10px] text-[#ccaa77]">${hero.className}</span>
                    </div>                
                    <div class="w-full bg-[#2a1a0a] h-2 rounded-full my-2 overflow-hidden border border-[#5a4a3a]">
                        <div class="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300" id="hp-${hero.id}" style="width: ${(hero.hp/hero.maxHp)*100}%"></div>
                    </div>
                    <div class="flex justify-between w-full text-[9px] text-[#ffaa66]">
                        <span id="hp-text-${hero.id}">❤️ ${hero.hp}/${hero.maxHp}</span>
                        <span>⚔️ ${hero.power}</span>
                    </div>
                </div>
            `;
        }

        let enemiesHtml = '';
        enemies.forEach((enemy, idx) => {
            const enemyId = enemy.id || (enemy.isMonster ? "monster" : "enemy_"+idx);
            const enemyIcon = enemy.icon || (enemy.isMonster ? "👹" : "⚔️");
            const enemyName = enemy.name;
            const enemyPowerVal = enemy.power;
            const hpPercent = (enemy.hp / enemy.maxHp) * 100;
            enemiesHtml += `
                <div class="enemy-card" data-id="${enemyId}">
                    <div class="enemy-icon">${enemyIcon}</div>
                    <div class="enemy-name">${enemyName}</div>
                    <div class="enemy-power">⚔️ ${enemyPowerVal}</div>
                    <div class="hp-bar-bg"><div class="hp-bar-fill" id="hp-enemy-${enemyId}" style="width: ${hpPercent}%;"></div></div>
                    <div class="hero-hp-text" id="hp-text-enemy-${enemyId}">❤️ ${enemy.hp}/${enemy.maxHp}</div>
                </div>
            `;
        });

        battleScreen.innerHTML = `
            <div class="battle-container">
                <button class="close-battle-btn" id="close-battle-btn">✕</button>
                <div class="battle-header text-sm">
                    <h1 class="font-bold">⚔️ БИТКА ⚔️</h1>
                </div>
                <div class="heroes-section">
                    <div class="heroes-title">🏰 Вашите герои</div>
                    <div class="heroes-grid" id="heroes-grid">${heroesHtml}</div>
                    <div class="heroes-title" style="margin-top:10px;">👹 Врагове</div>
                    <div class="enemies-grid" id="enemies-grid">${enemiesHtml}</div>
                </div>
                <div class="battle-controls-container flex flex-col gap-2 p-2" id="battle-controls-container">
                    <div class="battle-log-section p-2 bg-black/60 rounded-lg border border-stone-800 flex-1 min-h-[120px] max-h-[150px]">
                        <div class="battle-log h-full overflow-y-auto text-[11px] font-mono text-stone-300" id="battle-log"></div>
                    </div>
                    <div class="action-buttons flex flex-row gap-2 overflow-x-auto whitespace-nowrap p-2 flex-shrink-0" style="scrollbar-width: none; -ms-overflow-style: none;">
                        <button class="battle-btn attack-btn text-[10px] p-2 flex-shrink-0" id="battle-attack">⚔️ АТАКА</button>
                        <button class="battle-btn text-[10px] p-2 flex-shrink-0" id="battle-retreat">🏃 БЯГ</button>
                        <button class="battle-btn text-[10px] p-2 flex-shrink-0" id="battle-reset">🔄 НОВА</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(battleScreen);
        document.getElementById('close-battle-btn').onclick = () => battleScreen.remove();

        let currentHeroes = playerHeroes.map(h => ({ ...h, startingHp: h.hp }));
        let currentEnemies = enemies.map(e => ({ ...e, startingHp: e.hp }));
        let battleActive = true;
        let currentRound = 1;
        let invincibleUsed = {};

        function updateUI() {
            currentHeroes.forEach(hero => {
                const fillEl = document.getElementById(`hp-${hero.id}`);
                const textEl = document.getElementById(`hp-text-${hero.id}`);
                if (fillEl) {
                    const percent = (hero.hp / hero.maxHp) * 100;
                    fillEl.style.width = `${Math.max(0, percent)}%`;
                    if (percent < 30) fillEl.style.background = "#f44336";
                    else if (percent < 70) fillEl.style.background = "#ff9800";
                    else fillEl.style.background = "#4caf50";
                }
                if (textEl) textEl.innerHTML = `❤️ ${Math.max(0, hero.hp)}/${hero.maxHp}`;
            });
            currentEnemies.forEach(enemy => {
                const enemyId = enemy.id || (enemy.isMonster ? "monster" : "temp");
                const fillEl = document.getElementById(`hp-enemy-${enemyId}`);
                const textEl = document.getElementById(`hp-text-enemy-${enemyId}`);
                if (fillEl) {
                    const percent = (enemy.hp / enemy.maxHp) * 100;
                    fillEl.style.width = `${Math.max(0, percent)}%`;
                    if (percent < 30) fillEl.style.background = "#ff4444";
                    else if (percent < 70) fillEl.style.background = "#ffaa44";
                    else fillEl.style.background = "#ff8888";
                }
                if (textEl) textEl.innerHTML = `❤️ ${Math.max(0, enemy.hp)}/${enemy.maxHp}`;
            });
        }

        function addLog(message, isError = false) {
            const logDiv = document.getElementById('battle-log');
            if (logDiv) {
                const p = document.createElement('p');
                p.innerHTML = message;
                if (isError) p.style.color = '#ff8888';
                logDiv.appendChild(p);
                logDiv.scrollTop = logDiv.scrollHeight;
                while (logDiv.children.length > 15) logDiv.removeChild(logDiv.firstChild);
            }
        }

        function screenShake() {
            const container = document.querySelector('.battle-container');
            if (container) {
                container.style.transform = 'translateX(4px)';
                setTimeout(() => container.style.transform = 'translateX(-3px)', 50);
                setTimeout(() => container.style.transform = 'translateX(2px)', 100);
                setTimeout(() => container.style.transform = 'translateX(0)', 150);
            }
        }

        function animateHero(heroId, damage = null, isHeal = false) {
            const card = document.querySelector(`.hero-card[data-id="${heroId}"]`);
            if (card) {
                animateCard(card);
                if (damage !== null) showFloatingNumber(card, damage, isHeal);
            }
        }

        function animateEnemy(enemyId, damage = null, isHeal = false) {
            const card = document.querySelector(`.enemy-card[data-id="${enemyId}"]`);
            if (card) {
                animateCard(card);
                if (damage !== null) showFloatingNumber(card, damage, isHeal);
            }
        }

        function applyArmyLossFromDamage(hero, damagePercent) {
            if (!hero.clanObj) return;
            let armyLossPercent = damagePercent * 0.5;
            let currentArmy = hero.clanObj.armySize || hero.armySize || 300;
            let newArmy = Math.max(10, Math.floor(currentArmy * (1 - armyLossPercent)));
            hero.clanObj.armySize = newArmy;
            hero.clanObj.currentArmy = newArmy;
            hero.armySize = newArmy;
            if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero.clanObj);
            addLog(`   📉 ${hero.name} загуби ${Math.floor(armyLossPercent * 100)}% от армията си! Остава: ${newArmy} войници.`);
        }

        // Героите атакуват (избират първия жив враг)
        function heroesAttack() {
            if (!battleActive) return false;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            updateUI();
            if (aliveHeroes.length === 0) return false;

            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`🏹 РУНД ${currentRound} - ГЕРОИТЕ АТАКУВАТ!`);

            let isNight = (window.gameTime && window.gameTime.seasonIndex === 3);
            let totalDamage = 0;

            for (let hero of aliveHeroes) {
                let target = currentEnemies.find(e => e.hp > 0);
                if (!target) break;

                let baseDamage = Math.max(1, Math.floor(hero.power * (0.5 + Math.random() * 0.7)));
                let troopEffects = hero.troopEffects || {};
                let petEffects = getPetEffects(hero.clanObj);
                let skillBonuses = getAdvancedSkillCombatBonuses(hero.clanObj);
                
                let damageMultiplier = 1.0;
                let critChance = 0.15;
                let isFirstStrike = (currentRound === 1);
                
                if (troopEffects.firstStrikeBonus && isFirstStrike) {
                    damageMultiplier += troopEffects.firstStrikeBonus;
                    addLog(`   ⚡ ${hero.name} използва Пикиране от войски (първи удар)!`);
                    addNarrative(`${hero.name} атакува пръв с Пикиране (+${Math.floor(troopEffects.firstStrikeBonus*100)}% щети).`);
                }
                if (skillBonuses.firstStrikeBonus && isFirstStrike) {
                    damageMultiplier += skillBonuses.firstStrikeBonus;
                    addLog(`   ⚡ ${hero.name} използва Първи удар от умения!`);
                    addNarrative(`${hero.name} нанася първи удар (умения: +${Math.floor(skillBonuses.firstStrikeBonus*100)}% щети).`);
                }
                if (troopEffects.nightFuryBonus && isNight) {
                    damageMultiplier += troopEffects.nightFuryBonus;
                    addLog(`   🌙 ${hero.name} активира Нощна ярост от войски!`);
                    addNarrative(`🌙 ${hero.name} активира Нощна ярост (+${Math.floor(troopEffects.nightFuryBonus*100)}% щети).`);
                }
                if (petEffects.damageBonus) {
                    damageMultiplier += petEffects.damageBonus;
                    addLog(`   🐾 ${hero.name} получава бонус щети от любимеца!`);
                    addNarrative(`${hero.name} получава бонус щети от любимец (${Math.floor(petEffects.damageBonus*100)}%).`);
                }
                if (skillBonuses.damageBonus) damageMultiplier += skillBonuses.damageBonus;
                if (skillBonuses.attackBonus) baseDamage += skillBonuses.attackBonus;
                if (troopEffects.critChanceBonus) critChance += troopEffects.critChanceBonus;
                if (petEffects.critChanceBonus) critChance += petEffects.critChanceBonus;
                if (skillBonuses.critChance) critChance += skillBonuses.critChance;
                if (petEffects.fireDamage) {
                    let fireBonus = petEffects.fireDamage;
                    baseDamage += fireBonus;
                    addLog(`   🔥 ${hero.name} добавя ${fireBonus} огнени щети от любимеца!`);
                    addNarrative(`🔥 ${hero.name} изгаря врага с ${fireBonus} огнени щети (любимец).`);
                }
                if (skillBonuses.lowHpBonus && hero.hp < hero.maxHp * 0.3) {
                    let lowBonus = 1 + (hero.maxHp - hero.hp) / hero.maxHp * skillBonuses.lowHpBonus;
                    damageMultiplier += lowBonus - 1;
                    addLog(`   😡 ${hero.name} активира Берсерк (ниско здраве)!`);
                    addNarrative(`😡 ${hero.name} изпада в Берсерк и увеличава щетите!`);
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
                        addLog(`   💚 ${hero.name} възстановява ${healAmount} живот (Кръвопиец/Любимец)!`);
                        animateHero(hero.id, healAmount, true);
                        addNarrative(`💚 ${hero.name} възстановява ${healAmount} живот.`);
                    }
                }
                
                target.hp = Math.max(0, target.hp - finalDamage);
                totalDamage += finalDamage;
                updateUI();
                addLog(`   ⚔️ ${hero.name} нанася ${finalDamage} щети на ${target.name}${isCrit ? ' 💥 КРИТИЧЕН!' : ''}`);
                animateHero(hero.id);
                let enemyId = target.id || (target.isMonster ? "monster" : `enemy_${currentEnemies.indexOf(target)}`);
                animateEnemy(enemyId, finalDamage);
                addNarrative(`⚔️ ${hero.name} нанася ${finalDamage} щети${isCrit ? " (критичен удар!)" : ""} на ${target.name}.`);
            }

            addLog(`📊 ОБЩО: ${totalDamage} щети`);
            if (totalDamage > 0) addNarrative(`📊 Общо нанесени щети: ${totalDamage}.`);

            const allEnemiesDead = currentEnemies.every(e => e.hp <= 0);
            if (allEnemiesDead) {
                addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                addLog(`🏆 ПОБЕДА! Всички врагове са победени! 🏆`);
                let totalXP = 50 + Math.floor(Math.random() * 100);
                let totalGold = 100 + Math.floor(Math.random() * 200);
                const livingHeroes = currentHeroes.filter(h => h.hp > 0);
                livingHeroes.forEach(hero => {
                    let heroXP = Math.floor(totalXP / livingHeroes.length);
                    let heroGold = Math.floor(totalGold / livingHeroes.length);
                    if (window.gainHeroXP) window.gainHeroXP(hero.clanObj, heroXP);
                    else hero.clanObj.xp = (hero.clanObj.xp || 0) + heroXP;
                    hero.clanObj.gold = (hero.clanObj.gold || 0) + heroGold;
                    addLog(`   🎁 ${hero.name} получава +${heroXP} XP и +${heroGold} злато!`);
                    if (window.addHeroLog) window.addHeroLog(hero.clanObj, "⚔️", `Победи в битката за ${regionName}`);
                });
                
                if (typeof regionName === 'string' && regionName !== "Портал") {
                    if (typeof window.normalizePlayerRegions === 'function') window.normalizePlayerRegions();
                    else {
                        if (!window.playerRegions) window.playerRegions = [];
                        let flat = [];
                        for (let item of window.playerRegions) {
                            if (Array.isArray(item)) for (let sub of item) flat.push(sub);
                            else if (typeof item === 'string') flat.push(item);
                        }
                        window.playerRegions = [...new Set(flat)];
                    }
                    if (!window.playerRegions.includes(regionName)) {
                        window.playerRegions.push(regionName);
                        addLog(`   🏰 ${regionName} е добавен към вашите владения!`);
                        if (window.addWorldEvent) window.addWorldEvent(`🏰 ЗАВЛАДЯВАНЕ`, `Вие завладяхте ${regionName}!`, "🏰");
                        if (window.worldData && window.worldData.regions && window.worldData.regions[regionName]) {
                            window.worldData.regions[regionName].armySize = 0;
                        }
                    } else addLog(`   ℹ️ ${regionName} вече е ваш.`);
                }
                
                let newArtifact = null;
                if (Math.random() < 0.2 && window.historicalArtifacts) {
                    const artifactKeys = Object.keys(window.historicalArtifacts);
                    const randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
                    newArtifact = { ...window.historicalArtifacts[randomKey] };
                    const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                    if (randomHero && randomHero.clanObj) {
                        if (!randomHero.clanObj.inventory) randomHero.clanObj.inventory = [];
                        randomHero.clanObj.inventory.push(newArtifact);
                        if (window.addHeroLog) window.addHeroLog(randomHero.clanObj, "🏺", `Намери артефакт: ${newArtifact.name}`);
                        addLog(`   🏺 ${randomHero.name} намери артефакт: ${newArtifact.name}!`);
                        if (window.ChronicleEvents && window.ChronicleEvents.generateArtifactFound) {
                            let ev = window.ChronicleEvents.generateArtifactFound(randomHero.clanObj, newArtifact);
                            window.showAdvisorMsg(ev.message, ev.buttons);
                        } else window.showAdvisorMsg(`🏺 ${randomHero.name} намери артефакт: ${newArtifact.name}`);
                    }
                }
                
                if (Math.random() < 0.15 && window.fantasyRaces && window.fantasyRaces.length > 0) {
                    const randomRace = window.fantasyRaces[Math.floor(Math.random() * window.fantasyRaces.length)];
                    const prisoner = { id: Date.now() + "_" + Math.random(), name: randomRace.name, raceId: randomRace.id, icon: randomRace.icon, desc: randomRace.desc, bonus: randomRace.bonus, capturedFrom: regionName };
                    if (!window.prisoners) window.prisoners = [];
                    window.prisoners.push(prisoner);
                    addLog(`   👸 Взехте пленник: ${prisoner.name}! Може да се ожените в дипломацията.`);
                    if (window.addWorldEvent) window.addWorldEvent(`👸 ПЛЕННИК`, `След битката взехте ${prisoner.name} като пленник!`, "👸");
                }
                
                if (regionInput && regionInput.isPortalWorld) {
                    const extraBonus = 50 + Math.floor(Math.random() * 100);
                    const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                    if (randomHero) {
                        randomHero.clanObj.gold += extraBonus;
                        addLog(`   🌌 ПОРТАЛЕН БОНУС: ${randomHero.name} получава +${extraBonus} злато!`);
                    }
                }
                
                if (window.addWorldEvent) window.addWorldEvent(`🏆 ПОБЕДА В БИТКА`, `${playerHeroes.map(h => h.name).join(', ')} победиха в ${regionName}!`, "🏆");
                
                for (let i = 0; i < currentHeroes.length; i++) {
                    let battleHero = currentHeroes[i];
                    let originalHero = battleHero.clanObj;
                    if (originalHero && battleHero.hp !== undefined) applyBattleOutcome(originalHero, battleHero);
                }
                
                const rewards = { gold: totalGold, xp: totalXP, artifact: newArtifact || null };
                const story = generateBattleStory(regionName, playerHeroes, currentEnemies, true, rewards);
                if (window.showAdvisorMsg) window.showAdvisorMsg(story);
                
                refreshAllHeroUI();
                battleActive = false;
                const attackBtn = document.getElementById('battle-attack');
                if (attackBtn) attackBtn.disabled = true;
                if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
                if (typeof window.endGroupBattle === 'function') window.endGroupBattle(true, 'victory', regionName);
                window.currentBattleState = null;
                window._lastBattleHeroes = null;
                return true;
            }
            updateUI();
            refreshAllHeroUI();
            return true;
        }

        // Враговете атакуват (всеки жив враг атакува случаен герой)
        function enemiesAttack() {
            if (!battleActive) return false;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            if (aliveHeroes.length === 0) return false;
            
            for (let enemy of currentEnemies) {
                if (enemy.hp <= 0) continue;
                const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
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
                    addLog(`   🛡️ ${target.name} намалява щетите с ${Math.floor(damageReduction*100)}%!`);
                    damage = reduced;
                    addNarrative(`${target.name} намалява щетите с ${Math.floor(damageReduction*100)}%.`);
                }
                if (troopEffects.hasInvincibleOnce && !invincibleUsed[target.id]) {
                    invincibleUsed[target.id] = true;
                    damage = 0;
                    addLog(`   ✨ ${target.name} става непробиваем този рунд!`);
                    addNarrative(`✨ ${target.name} става непробиваем.`);
                }
                
                let damagePercent = damage / target.maxHp;
                target.hp = Math.max(0, target.hp - damage);
                updateUI();
                applyArmyLossFromDamage(target, damagePercent);
                
                addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                addLog(`👹 ${enemy.name} атакува ${target.name.toUpperCase()}!`);
                addLog(`   💔 Нанася ${damage} щети (${Math.floor(damagePercent * 100)}% от живота)`);
                screenShake();
                let enemyId = enemy.id || (enemy.isMonster ? "monster" : `enemy_${currentEnemies.indexOf(enemy)}`);
                animateEnemy(enemyId);
                animateHero(target.id, damage);
                addNarrative(`👹 ${enemy.name} нанася ${damage} щети на ${target.name} (${Math.floor(damagePercent*100)}% от здравето му).`);
                
                if (target.hp <= 0) {
                    let reviveChance = petEffects.reviveChance || skillBonuses.reviveChance || 0;
                    if (reviveChance > 0 && Math.random() < reviveChance) {
                        target.hp = Math.floor(target.maxHp * 0.3);
                        addLog(`   🔥 ${target.name} се възкресява от любимец/умения! (${target.hp} HP)`);
                        addNarrative(`🔥 ${target.name} се възкресява!`);
                    } else {
                        addLog(`   💀 ${target.name} е нокаутиран! 💀`, true);
                        applyArmyLossFromDamage(target, 0.5);
                        addNarrative(`💀 ${target.name} пада в битката!`);
                    }
                }
            }
            
            updateUI();
            const stillAlive = currentHeroes.some(h => h.hp > 0);
            if (!stillAlive) {
                addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                addLog(`💀 ЗАГУБА! Всички герои са победени! 💀`, true);
                for (let i = 0; i < currentHeroes.length; i++) {
                    let battleHero = currentHeroes[i];
                    let originalHero = battleHero.clanObj;
                    if (originalHero && battleHero.hp !== undefined) applyBattleOutcome(originalHero, battleHero);
                }
                const story = generateBattleStory(regionName, playerHeroes, currentEnemies, false, {});
                if (window.showAdvisorMsg) window.showAdvisorMsg(story);
                refreshAllHeroUI();
                battleActive = false;
                const attackBtn = document.getElementById('battle-attack');
                if (attackBtn) attackBtn.disabled = true;
                if (typeof window.endGroupBattle === 'function') window.endGroupBattle(false, 'defeat');
                window.currentBattleState = null;
                window._lastBattleHeroes = null;
                return false;
            }
            refreshAllHeroUI();
            return true;
        }

        async function battleTurn() {
            if (!battleActive) {
                addLog(`Битката е приключила! Натисни "НОВА БИТКА".`);
                return;
            }
            heroesAttack();
            if (currentEnemies.every(e => e.hp <= 0)) return;
            await new Promise(r => setTimeout(r, 250));
            enemiesAttack();
            currentRound++;
            updateUI();
        }

        function retreat() {
            if (!battleActive) { addLog(`Битката вече е приключила.`); return; }
            addLog(`🏃 Отстъпление! Героите се изтеглят...`);
            currentHeroes.forEach(hero => {
                if (hero.hp > 0) applyArmyLossFromDamage(hero, 0.2);
            });
            for (let i = 0; i < currentHeroes.length; i++) {
                let battleHero = currentHeroes[i];
                let originalHero = battleHero.clanObj;
                if (originalHero && battleHero.hp !== undefined) applyBattleOutcome(originalHero, battleHero);
            }
            const story = generateBattleStory(regionName, playerHeroes, currentEnemies, false, {});
            if (window.showAdvisorMsg) window.showAdvisorMsg(story);
            refreshAllHeroUI();
            battleActive = false;
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = true;
            if (typeof window.endGroupBattle === 'function') window.endGroupBattle(false, 'retreat');
            window.currentBattleState = null;
            window._lastBattleHeroes = null;
            setTimeout(() => battleScreen.remove(), 1500);
        }

        function resetBattle() {
            currentHeroes = playerHeroes.map(h => ({ ...h, hp: h.maxHp, armySize: h.armySize }));
            currentEnemies = enemies.map(e => ({ ...e, hp: e.maxHp }));
            battleActive = true;
            currentRound = 1;
            invincibleUsed = {};
            updateUI();
            const logDiv = document.getElementById('battle-log');
            if (logDiv) logDiv.innerHTML = '';
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`✨ БИТКАТА ЗАПОЧВА ОТНОВО! ✨`);
            addLog(`🏰 ${playerHeroes.length} герои срещу ${currentEnemies.length} врага!`);
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = false;
        }

        document.getElementById('battle-attack').onclick = () => battleTurn();
        document.getElementById('battle-retreat').onclick = () => retreat();
        document.getElementById('battle-reset').onclick = () => resetBattle();

        addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        addLog(`⚔️ БИТКАТА ЗАПОЧВА! ⚔️`);
        addLog(`🏰 ${playerHeroes.length} герои срещу ${currentEnemies.length} врага!`);
        addLog(`📌 Натисни "АТАКА" за рунд!`);
        addLog(`⚠️ ВНИМАНИЕ: Загубата на живот намалява армията ви!`);
        updateUI();
        console.log("✅ Битката е готова (с подкрепления от нелюбими герои)!");
    };

    // ==================== ГЛОБАЛНА ФУНКЦИЯ ЗА КРАЙ НА ГРУПОВА БИТКА ====================
    window.endGroupBattle = function(isVictory, reason, regionName) {
        console.log(`🏁 Битката приключи. Победа: ${isVictory}, Причина: ${reason}, Регион: ${regionName || 'неизвестен'}`);
        let questHero = null;
        if (typeof window.getStrongestHero === 'function') questHero = window.getStrongestHero();
        if (window.checkAllQuestsProgress && questHero) window.checkAllQuestsProgress(questHero, regionName || window.currentRegion, "battle");
        if (typeof window.handleBattleEnd === 'function') window.handleBattleEnd(isVictory, reason);
        refreshAllHeroUI();
        if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
    };

    window.refreshAllHeroUI = refreshAllHeroUI;
    console.log("✅ battle.js зареден (версия 8.7 – пълна, несъкратена)");
})();
