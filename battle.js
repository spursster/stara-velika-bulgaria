/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (ВЕРСИЯ 8.3 – ФИКС НА СИНХРОНИЗАЦИЯТА НА HP В UI)
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
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 10px;
            }

            .hero-card {
                background: linear-gradient(145deg, rgba(30,25,20,0.9), rgba(20,15,10,0.95));
                border-radius: 14px;
                padding: 8px;
                text-align: center;
                border: 1px solid rgba(201,168,123,0.4);
                transition: transform 0.1s ease, box-shadow 0.1s ease;
                position: relative;
            }

            .hero-card.attack-animation {
                transform: scale(0.95);
                filter: brightness(1.2);
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

            .hero-power {
                font-size: 8px;
                color: #aa8866;
                margin-top: 3px;
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

            .vs-section {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px 15px;
                flex-shrink: 0;
            }

            .monster-card {
                background: linear-gradient(145deg, rgba(50,20,20,0.95), rgba(30,10,10,0.98));
                border-radius: 20px;
                padding: 15px;
                text-align: center;
                flex: 1;
                max-width: 300px;
                margin: 0 auto;
                border: 2px solid #ff4444;
                transition: transform 0.1s ease;
            }

            .monster-card.attack-animation {
                transform: scale(0.97);
            }

            .monster-icon {
                font-size: 40px;
            }

            .monster-name {
                font-size: 16px;
                font-weight: bold;
                color: #ff6666;
            }

            .monster-power {
                font-size: 11px;
                color: #cc8888;
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
                .ultimate-battle { padding: 2px; }
                .battle-container { border-radius: 12px; }
                .battle-header { padding: 4px; }
                .battle-header h1 { font-size: 0.8rem; }
                .vs-section { padding: 2px 4px; }
                .monster-card { padding: 6px; }
                .monster-name { font-size: 12px; }
                .battle-controls-container { padding: 4px; gap: 4px; }
                .action-buttons { width: 100%; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
                .action-buttons::-webkit-scrollbar { display: none; }
                .battle-btn { padding: 4px 10px; font-size: 0.65rem; min-width: 70px; }
                .battle-log-section { min-height: 80px; }
                .battle-log { font-size: 10px; }
                .heroes-grid { gap: 2px; }
                .hero-portrait { width: 28px; height: 28px; }
                .hero-card { padding: 2px; }
                .hero-name { font-size: 7px; }
                .close-battle-btn { width: 22px; height: 22px; font-size: 10px; top: 2px; left: 2px; }
            }

            @media (max-width: 480px) {
                .heroes-grid { grid-template-columns: repeat(5, 1fr); gap: 4px; }
                .hero-card { padding: 4px; }
                .hero-portrait { width: 32px; height: 32px; }
                .hero-icon { font-size: 16px; }
                .hero-name { font-size: 7px; }
                .battle-btn { padding: 5px 8px; font-size: 0.65rem; min-width: 65px; }
                .monster-card { padding: 10px; }
                .monster-icon { font-size: 24px; }
            }
        `;
        document.head.appendChild(style);
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

    // ==================== КОРЕКТНО ИЗЧИСЛЯВАНЕ НА HP ====================
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
        
        // Уверяваме се, че оригиналният герой има валиден maxHp
        if (!originalHero.maxHp || originalHero.maxHp <= 0) {
            let endurance = originalHero.skills?.endurance || 0;
            originalHero.maxHp = 100 + (originalHero.level - 1) * 20 + endurance * 15;
            if (originalHero.hp === undefined || originalHero.hp > originalHero.maxHp) {
                originalHero.hp = originalHero.maxHp;
            }
        }
        
        // Изчисляваме реално получените щети по време на битка
        let startingHp = battleHero.startingHp !== undefined ? battleHero.startingHp : battleHero.maxHp;
        let damageTaken = startingHp - battleHero.hp;
        if (damageTaken < 0) damageTaken = 0;
        
        if (damageTaken > 0) {
            // Намаляваме оригиналния герой с точно толкова
            originalHero.hp = Math.max(0, (originalHero.hp || originalHero.maxHp) - damageTaken);
            console.log(`❤️ ${originalHero.name} загуби ${damageTaken} HP. Остава: ${originalHero.hp}/${originalHero.maxHp}`);
            
            // Проверка за смърт (5% шанс)
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
        }
        
        // Пост-битка лечение
        let postHeal = calculatePostBattleHealing(originalHero, battleHero);
        if (postHeal > 0 && originalHero.hp > 0) {
            originalHero.hp = Math.min(originalHero.maxHp, originalHero.hp + postHeal);
            console.log(`💚 ${originalHero.name} се излекува с ${postHeal} HP след битката.`);
        }
        originalHero.hp = Math.min(originalHero.maxHp, originalHero.hp);
    }

    // ==================== ЦЕНТРАЛИЗИРАНО ОБНОВЯВАНЕ НА UI ====================
    function refreshAllHeroUI() {
        if (typeof window.renderFavoriteHeroesBar === 'function') {
            window.renderFavoriteHeroesBar();
        }
        if (window.currentHero && typeof window.updateCharacterUI === 'function') {
            window.updateCharacterUI(window.currentHero);
        }
        if (typeof window.renderSingleBar === 'function') {
            window.renderSingleBar();
        }
        const barracksScreen = document.getElementById('barracks-screen');
        if (barracksScreen && barracksScreen.style.display === 'flex' && typeof window.renderBarracksLayout === 'function') {
            window.renderBarracksLayout();
        }
    }

    // ==================== ПОМОЩНИ ФУНКЦИИ ЗА АНИМАЦИИ ====================
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

    // ==================== ОСНОВНА ФУНКЦИЯ ====================
    window.startBattle = function(regionInput) {
        console.log("⚔️ startBattle извикана с:", regionInput);

        let regionName = "Регион";
        let enemyPower = 200;
        let enemyHp = 200;

        if (typeof regionInput === 'string') {
            regionName = regionInput;
            if (window.worldData && window.worldData.regions && window.worldData.regions[regionInput]) {
                const reg = window.worldData.regions[regionInput];
                let basePower = reg.armySize || 100;
                let defenseBonus = (reg.defenseLevel || 1) * 10;
                if (reg.buildings && reg.buildings.wall) {
                    defenseBonus += reg.buildings.wall * 2;
                }
                enemyPower = Math.max(50, basePower + defenseBonus);
                enemyHp = enemyPower;
                regionName = reg.name || regionInput;
            }
        } else if (regionInput && typeof regionInput === 'object') {
            regionName = regionInput.name || regionInput.id || "Портал";
            enemyPower = regionInput.armySize || regionInput.difficulty * 12 || 200;
            enemyHp = enemyPower;
        }

        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
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

        if (heroes.length === 0 && window.currentHero && window.currentHero.isAlive !== false) {
            let heroPower = window.currentHero.heroPower || 100;
            let armySize = window.currentHero.armySize || 300;
            heroes.push({
                id: window.currentHero.clan || "hero",
                name: window.currentHero.name || "Воевода",
                className: window.currentHero.currentClass || "Багатур",
                power: Math.max(50, heroPower),
                hp: window.currentHero.hp || window.currentHero.maxHp || 100,
                maxHp: window.currentHero.maxHp || 100,
                icon: "⚔️",
                armySize: armySize,
                clanObj: window.currentHero,
                troopEffects: getTroopSpecialEffects(window.currentHero)
            });
        }

        const battleHeroes = heroes.slice(0, 5);
        if (battleHeroes.length === 0) {
            if (window.showAdvisorMsg) window.showAdvisorMsg("Нямате живи герои за битка!");
            return;
        }

        window._lastBattleHeroes = battleHeroes;
        window.currentBattleState = { group: battleHeroes, monster: null };

        const monster = {
            name: regionName,
            power: enemyPower,
            hp: enemyHp,
            maxHp: enemyHp,
            icon: "👹"
        };
        if (window.currentBattleState) window.currentBattleState.monster = monster;

        const oldScreen = document.getElementById('ultimate-battle-screen');
        if (oldScreen) oldScreen.remove();

        const battleScreen = document.createElement('div');
        battleScreen.id = 'ultimate-battle-screen';
        battleScreen.className = 'ultimate-battle';

        let heroesHtml = '';
        for (let i = 0; i < 5; i++) {
            let hero = battleHeroes[i];
            if (hero) {
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
            } else {
                heroesHtml += `
                    <div class="hero-card" style="opacity: 0.5;">
                        <div class="hero-icon">❓</div>
                        <div class="hero-name">Празен слот</div>
                        <div class="hero-class">---</div>
                        <div class="hp-bar-bg"><div class="hp-bar-fill" style="width: 0%"></div></div>
                        <div class="hero-hp-text">❤️ 0/0</div>
                        <div class="hero-power">⚔️ 0</div>
                    </div>
                `;
            }
        }

        battleScreen.innerHTML = `
            <div class="battle-container">
                <button class="close-battle-btn" id="close-battle-btn">✕</button>
                <div class="battle-header text-sm">
                    <h1 class="font-bold">⚔️ БИТКА ⚔️</h1>
                </div>
                <div class="heroes-section">
                    <div class="heroes-grid" id="heroes-grid">${heroesHtml}</div>
                </div>
                <div class="vs-section">
                    <div class="monster-card p-3 border-2 border-red-600 rounded-xl bg-black/80 flex items-center justify-between gap-3 shadow-lg" id="monster-card">
                        <div class="monster-icon text-3xl">${monster.icon}</div>
                        <div class="flex-1">
                            <h2 class="monster-name text-sm font-bold text-red-400">${monster.name}</h2>
                            <div class="w-full bg-[#2a0a0a] h-3 rounded-full mt-1 overflow-hidden border border-red-900 shadow-inner">
                                <div class="h-full bg-gradient-to-r from-red-600 to-red-400" id="monster-hp-fill" style="width: 100%;"></div>
                            </div>
                        </div>
                        <div class="hero-hp-text text-xs text-red-200" id="monster-hp-text">❤️ ${monster.hp}/${monster.maxHp}</div>
                    </div>
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

        let currentHeroes = battleHeroes.map(h => ({ ...h, startingHp: h.hp }));
        let currentMonster = { ...monster };
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
            // Промяна на цвета според процента
            if (percent < 30) fillEl.style.background = "#f44336";
            else if (percent < 70) fillEl.style.background = "#ff9800";
            else fillEl.style.background = "#4caf50";
        }
        if (textEl) {
            textEl.innerHTML = `❤️ ${Math.max(0, hero.hp)}/${hero.maxHp}`;
        }
    });
    const monsterFill = document.getElementById('monster-hp-fill');
    const monsterText = document.getElementById('monster-hp-text');
    if (monsterFill) {
        const percent = (currentMonster.hp / currentMonster.maxHp) * 100;
        monsterFill.style.width = `${Math.max(0, percent)}%`;
        if (percent < 30) monsterFill.style.background = "#ff4444";
        else if (percent < 70) monsterFill.style.background = "#ffaa44";
        else monsterFill.style.background = "#ff8888";
    }
    if (monsterText) {
        monsterText.innerHTML = `❤️ ${Math.max(0, currentMonster.hp)}/${currentMonster.maxHp}`;
    }
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

        function animateMonsterCard(damage = null, isHeal = false) {
            const card = document.querySelector('.monster-card');
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

        function heroesAttack() {
            if (!battleActive) return false;
            let totalDamage = 0;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            updateUI();
            if (aliveHeroes.length === 0) return false;

            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`🏹 РУНД ${currentRound} - ГЕРОИТЕ АТАКУВАТ!`);

            let isNight = (window.gameTime && window.gameTime.seasonIndex === 3);

            aliveHeroes.forEach(hero => {
                if (currentMonster.hp <= 0) return;
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
                }
                if (skillBonuses.firstStrikeBonus && isFirstStrike) {
                    damageMultiplier += skillBonuses.firstStrikeBonus;
                    addLog(`   ⚡ ${hero.name} използва Първи удар от умения!`);
                }
                if (troopEffects.nightFuryBonus && isNight) {
                    damageMultiplier += troopEffects.nightFuryBonus;
                    addLog(`   🌙 ${hero.name} активира Нощна ярост от войски!`);
                }
                if (petEffects.damageBonus) {
                    damageMultiplier += petEffects.damageBonus;
                    addLog(`   🐾 ${hero.name} получава бонус щети от любимеца!`);
                }
                if (skillBonuses.damageBonus) {
                    damageMultiplier += skillBonuses.damageBonus;
                    addLog(`   ✨ ${hero.name} получава бонус щети от умения!`);
                }
                if (skillBonuses.attackBonus) {
                    baseDamage += skillBonuses.attackBonus;
                    addLog(`   📈 ${hero.name} получава +${skillBonuses.attackBonus} атака от умения!`);
                }
                if (troopEffects.critChanceBonus) critChance += troopEffects.critChanceBonus;
                if (petEffects.critChanceBonus) critChance += petEffects.critChanceBonus;
                if (skillBonuses.critChance) critChance += skillBonuses.critChance;
                
                if (petEffects.fireDamage) {
                    let fireBonus = petEffects.fireDamage;
                    addLog(`   🔥 ${hero.name} добавя ${fireBonus} огнени щети от любимеца!`);
                    baseDamage += fireBonus;
                }
                
                if (skillBonuses.lowHpBonus && hero.hp < hero.maxHp * 0.3) {
                    let lowBonus = 1 + (hero.maxHp - hero.hp) / hero.maxHp * skillBonuses.lowHpBonus;
                    damageMultiplier += lowBonus - 1;
                    addLog(`   😡 ${hero.name} активира Берсерк (ниско здраве)!`);
                }
                
                let finalDamage = Math.floor(baseDamage * damageMultiplier);
                let isCrit = Math.random() < critChance;
                if (isCrit) {
                    let critMultiplier = 1.8;
                    if (skillBonuses.critDamage) critMultiplier += skillBonuses.critDamage;
                    finalDamage = Math.floor(finalDamage * critMultiplier);
                }
                
                let totalLifeSteal = troopEffects.lifeSteal + petEffects.lifeSteal;
                if (totalLifeSteal > 0) {
                    let healAmount = Math.floor(finalDamage * totalLifeSteal);
                    if (healAmount > 0) {
                        hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
                        addLog(`   💚 ${hero.name} възстановява ${healAmount} живот (Кръвопиец/Любимец)!`);
                        animateHero(hero.id, healAmount, true);
                    }
                }
                
                totalDamage += finalDamage;
                currentMonster.hp = Math.max(0, currentMonster.hp - finalDamage);
                addLog(`   ⚔️ ${hero.name} нанася ${finalDamage} щети${isCrit ? ' 💥 КРИТИЧЕН!' : ''}`);
                animateHero(hero.id);
                animateMonsterCard(finalDamage);
            });

            addLog(`📊 ОБЩО: ${totalDamage} щети`);

            if (currentMonster.hp <= 0) {
                addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                addLog(`🏆 ПОБЕДА! ${monster.name} е победен! 🏆`);
                
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
                    if (window.addHeroLog) window.addHeroLog(hero.clanObj, "⚔️", `Победи ${monster.name} в ${regionName}`);
                });
                
                // ========== ДОБАВЯНЕ НА РЕГИОН ==========
                if (typeof regionName === 'string' && regionName !== "Портал") {
                    if (typeof window.normalizePlayerRegions === 'function') {
                        window.normalizePlayerRegions();
                    } else {
                        if (!window.playerRegions) window.playerRegions = [];
                        let flat = [];
                        for (let item of window.playerRegions) {
                            if (Array.isArray(item)) {
                                for (let sub of item) flat.push(sub);
                            } else if (typeof item === 'string') {
                                flat.push(item);
                            }
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
                    } else {
                        addLog(`   ℹ️ ${regionName} вече е ваш.`);
                    }
                }
                
                if (Math.random() < 0.2 && window.historicalArtifacts) {
                    const artifactKeys = Object.keys(window.historicalArtifacts);
                    const randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
                    const newArtifact = { ...window.historicalArtifacts[randomKey] };
                    const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                    if (randomHero && randomHero.clanObj) {
                        if (!randomHero.clanObj.inventory) randomHero.clanObj.inventory = [];
                        randomHero.clanObj.inventory.push(newArtifact);
                        if (window.addHeroLog) window.addHeroLog(randomHero.clanObj, "🏺", `Намери артефакт: ${newArtifact.name}`);
                        addLog(`   🏺 ${randomHero.name} намери артефакт: ${newArtifact.name}!`);
                        if (window.addWorldEvent) window.addWorldEvent(`🏺 НАМЕРЕН АРТЕФАКТ`, `${randomHero.name} намери ${newArtifact.name} след битката!`, "🏺");
                    }
                }
                
                if (Math.random() < 0.15 && window.fantasyRaces && window.fantasyRaces.length > 0) {
                    const randomRace = window.fantasyRaces[Math.floor(Math.random() * window.fantasyRaces.length)];
                    const prisoner = {
                        id: Date.now() + "_" + Math.random(),
                        name: randomRace.name,
                        raceId: randomRace.id,
                        icon: randomRace.icon,
                        desc: randomRace.desc,
                        bonus: randomRace.bonus,
                        capturedFrom: monster.name
                    };
                    if (!window.prisoners) window.prisoners = [];
                    window.prisoners.push(prisoner);
                    addLog(`   👸 Взехте пленник: ${prisoner.name}! Може да се ожените в дипломацията.`);
                    if (window.addWorldEvent) window.addWorldEvent(`👸 ПЛЕННИК`, `След битката с ${monster.name}, взехте ${prisoner.name} като пленник!`, "👸");
                }
                
                if (regionInput && regionInput.isPortalWorld) {
                    const extraBonus = 50 + Math.floor(Math.random() * 100);
                    const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                    if (randomHero) {
                        randomHero.clanObj.gold += extraBonus;
                        addLog(`   🌌 ПОРТАЛЕН БОНУС: ${randomHero.name} получава +${extraBonus} злато от мистичния свят!`);
                    }
                }
                
                if (window.addWorldEvent) window.addWorldEvent(`🏆 ПОБЕДА В БИТКА`, `${battleHeroes.map(h => h.name).join(', ')} победиха ${monster.name}!`, "🏆");
                
                // Прилагаме реалните щети към оригиналните герои
                for (let i = 0; i < currentHeroes.length; i++) {
                    let battleHero = currentHeroes[i];
                    let originalHero = battleHero.clanObj;
                    if (originalHero && battleHero.hp !== undefined) {
                        applyBattleOutcome(originalHero, battleHero);
                    }
                }
                
                // Обновяваме всички UI компоненти
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
            return true;
        }

        function monsterAttack() {
            if (!battleActive) return false;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            if (aliveHeroes.length === 0) return false;
            
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            let damage = Math.floor(currentMonster.power * (0.35 + Math.random() * 0.55));
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
                addLog(`   🛡️ ${target.name} намалява щетите с ${Math.floor(damageReduction*100)}% (Каменна кожа/умения)!`);
                damage = reduced;
            }
            
            if (troopEffects.hasInvincibleOnce && !invincibleUsed[target.id]) {
                invincibleUsed[target.id] = true;
                damage = 0;
                addLog(`   ✨ ${target.name} става непробиваем този рунд (Каменен трол)!`);
            }
            
            let damagePercent = damage / target.maxHp;
            target.hp = Math.max(0, target.hp - damage);
            applyArmyLossFromDamage(target, damagePercent);
            
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`👹 ЧУДОВИЩЕТО АТАКУВА ${target.name.toUpperCase()}!`);
            addLog(`   💔 Нанася ${damage} щети (${Math.floor(damagePercent * 100)}% от живота)`);
            animateMonsterCard();
            screenShake();
            animateHero(target.id, damage);
            
            if (target.hp <= 0) {
                let reviveChance = petEffects.reviveChance || skillBonuses.reviveChance || 0;
                if (reviveChance > 0 && Math.random() < reviveChance) {
                    target.hp = Math.floor(target.maxHp * 0.3);
                    addLog(`   🔥 ${target.name} се възкресява от любимец/умения! (${target.hp} HP)`);
                } else {
                    addLog(`   💀 ${target.name} е нокаутиран! 💀`, true);
                    applyArmyLossFromDamage(target, 0.5);
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
                    if (originalHero && battleHero.hp !== undefined) {
                        applyBattleOutcome(originalHero, battleHero);
                    }
                }
                
                // Обновяваме всички UI компоненти
                refreshAllHeroUI();
                
                battleActive = false;
                const attackBtn = document.getElementById('battle-attack');
                if (attackBtn) attackBtn.disabled = true;
                if (typeof window.endGroupBattle === 'function') window.endGroupBattle(false, 'defeat');
                window.currentBattleState = null;
                window._lastBattleHeroes = null;
                return false;
            }
            return true;
        }

        async function battleTurn() {
            if (!battleActive) {
                addLog(`Битката е приключила! Натисни "НОВА БИТКА".`);
                return;
            }
            heroesAttack();
            if (currentMonster.hp <= 0) return;
            await new Promise(r => setTimeout(r, 250));
            monsterAttack();
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
                if (originalHero && battleHero.hp !== undefined) {
                    applyBattleOutcome(originalHero, battleHero);
                }
            }
            
            // Обновяваме всички UI компоненти
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
            currentHeroes = battleHeroes.map(h => ({ ...h, hp: h.maxHp, armySize: h.armySize }));
            currentMonster = { ...monster };
            battleActive = true;
            currentRound = 1;
            invincibleUsed = {};
            updateUI();
            const logDiv = document.getElementById('battle-log');
            if (logDiv) logDiv.innerHTML = '';
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`✨ БИТКАТА ЗАПОЧВА ОТНОВО! ✨`);
            addLog(`🏰 ${battleHeroes.length} войни срещу ${monster.name}!`);
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = false;
        }

        document.getElementById('battle-attack').onclick = () => battleTurn();
        document.getElementById('battle-retreat').onclick = () => retreat();
        document.getElementById('battle-reset').onclick = () => resetBattle();

        addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        addLog(`⚔️ БИТКАТА ЗАПОЧВА! ⚔️`);
        addLog(`🏰 ${battleHeroes.length} войни срещу ${monster.name}!`);
        addLog(`📌 Натисни "АТАКА" за рунд!`);
        addLog(`⚠️ ВНИМАНИЕ: Загубата на живот намалява армията ви!`);
        updateUI();
        console.log("✅ Битката е готова (с портрети, анимации и числови ефекти)!");
    };

    // ==================== ГЛОБАЛНА ФУНКЦИЯ ЗА КРАЙ НА ГРУПОВА БИТКА ====================
    window.endGroupBattle = function(isVictory, reason, regionName) {
        console.log(`🏁 Битката приключи. Победа: ${isVictory}, Причина: ${reason}, Регион: ${regionName || 'неизвестен'}`);
        
        if (window.checkAllQuestsProgress && window.currentHero) {
            window.checkAllQuestsProgress(window.currentHero, regionName || window.currentRegion, "battle");
        }
        
        if (typeof window.handleBattleEnd === 'function') {
            window.handleBattleEnd(isVictory, reason);
        }
        
        // Обновяваме всички UI компоненти
        refreshAllHeroUI();
        
        if (typeof window.saveGreatBulgariaGame === 'function') {
            window.saveGreatBulgariaGame();
        }
    };

    // Експортираме refreshAllHeroUI, за да може да се използва и от други модули
    window.refreshAllHeroUI = refreshAllHeroUI;

    console.log("✅ battle.js зареден (версия 8.3 – фиксирана синхронизация на HP)");
})();
