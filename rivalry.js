/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: rivalry.js (ВЕРСИЯ 5.1 – БЕЗ currentHero, С getStrongestHero)
==========================================================================
*/
(function() {
    console.log("🔥 Инициализация на системата за съперничество (без currentHero)...");

    const RIVALRY_CONFIG = {
        attackChance: 0.35,
        xpTheftPercent: 0.30,
        xpTransferToAggressor: 0.50,
        revengeBonus: 1.5,
        minHeroesForAttack: 1,
        cooldownTurns: 1,
    };

    window.pendingAttack = null;
    let lastAttackTurn = 0;
    let turnCounter = 0;

    // Помощна функция за намиране на "играча" (най-силен герой)
   function getPlayerHero() {
    if (typeof window.getStrongestHero === 'function') {
        return window.getStrongestHero();
    }
    // Само в соло режим използваме currentHero като резерв
    if (window.gameMode === 'solo' && window.currentHero) return window.currentHero;
    return null;
}

    function getAllHeroes(forAttackers = true) {
        let heroes = [];
        if (!window.worldData || !window.worldData.clans) return heroes;
        
        const playerHero = getPlayerHero();
        
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isAlive !== false && hero.isJoined === true) {
                if (forAttackers) {
                    if (playerHero && hero.name === playerHero.name) continue;
                    if (hero.isFavorite === true) continue;
                }
                heroes.push({
                    id: key,
                    name: hero.name || hero.leaderName || key,
                    heroObj: hero,
                    power: hero.heroPower || 100,
                    army: hero.armySize || 200,
                    xp: hero.xp || 0,
                    skills: hero.skills || {},
                    pet: hero.pet || null,
                    inventory: hero.inventory || [],
                    spouse: hero.spouse || null,
                    isPlayer: (playerHero && hero.name === playerHero.name) || false,
                    isFavorite: hero.isFavorite === true
                });
            }
        }
        return heroes;
    }

    function performTheft(victim, aggressor) {
        const theftTypes = [];
        if (victim.inventory && victim.inventory.length > 0) theftTypes.push("artifact");
        if (victim.spouse) theftTypes.push("spouse");
        if (victim.pet) theftTypes.push("pet");
        if (victim.skills && Object.keys(victim.skills).length > 0) theftTypes.push("skill");
        if (victim.xp > 100) theftTypes.push("xp");
        if (theftTypes.length === 0) return null;
        
        const randomType = theftTypes[Math.floor(Math.random() * theftTypes.length)];
        let result = null;
        switch(randomType) {
            case "artifact":
                if (!victim.inventory.length) return null;
                const artifactIndex = Math.floor(Math.random() * victim.inventory.length);
                const stolenArtifact = victim.inventory[artifactIndex];
                if (!stolenArtifact) return null;
                victim.inventory.splice(artifactIndex, 1);
                if (!aggressor.inventory) aggressor.inventory = [];
                aggressor.inventory.push(stolenArtifact);
                result = { type: "artifact", item: stolenArtifact };
                break;
            case "spouse":
                if (!victim.spouse) return null;
                const stolenSpouse = victim.spouse;
                victim.spouse = null;
                aggressor.spouse = stolenSpouse;
                result = { type: "spouse", item: stolenSpouse };
                break;
            case "pet":
                if (!victim.pet) return null;
                const stolenPet = victim.pet;
                victim.pet = null;
                aggressor.pet = stolenPet;
                result = { type: "pet", item: stolenPet };
                break;
            case "skill":
                const skillKeys = Object.keys(victim.skills || {});
                if (skillKeys.length === 0) return null;
                const skillKey = skillKeys[Math.floor(Math.random() * skillKeys.length)];
                const stolenLevel = victim.skills[skillKey];
                if (stolenLevel <= 0) return null;
                victim.skills[skillKey] = 0;
                if (!aggressor.skills) aggressor.skills = {};
                aggressor.skills[skillKey] = (aggressor.skills[skillKey] || 0) + stolenLevel;
                result = { type: "skill", item: skillKey, level: stolenLevel };
                break;
            case "xp":
                const stolenXP = Math.floor(victim.xp * RIVALRY_CONFIG.xpTheftPercent);
                if (stolenXP <= 0) return null;
                victim.xp -= stolenXP;
                const gainXP = Math.floor(stolenXP * RIVALRY_CONFIG.xpTransferToAggressor);
                if (window.gainHeroXP) window.gainHeroXP(aggressor, gainXP);
                else aggressor.xp = (aggressor.xp || 0) + gainXP;
                result = { type: "xp", amount: stolenXP, gained: gainXP };
                break;
        }
        return result;
    }

    function addAttackToChronicle(aggressor, victim, stolenInfo) {
        let stolenText = "";
        switch(stolenInfo.type) {
            case "artifact": stolenText = `артефакт "${stolenInfo.item.name}"`; break;
            case "spouse": stolenText = `съпруга/съпруг "${stolenInfo.item}"`; break;
            case "pet": stolenText = `домашен любимец`; break;
            case "skill": stolenText = `умение "${stolenInfo.item}" (Ниво ${stolenInfo.level})`; break;
            case "xp": stolenText = `${stolenInfo.amount} опит`; break;
        }
        const year = (window.gameTime && window.gameTime.year) ? `${window.gameTime.year} г. ${window.gameTime.era}` : "480 г. пр.н.е.";
        const message = `${aggressor.name} нападна ${victim.name} и открадна ${stolenText}!`;
        if (typeof window.addWorldEvent === 'function') {
            window.addWorldEvent(`⚔️ НАПАДЕНИЕ от ${aggressor.name}`, message, "⚔️", year);
        } else {
            if (!window.worldEvents) window.worldEvents = [];
            window.worldEvents.unshift({
                id: Date.now(),
                title: `⚔️ НАПАДЕНИЕ от ${aggressor.name}`,
                description: message,
                icon: "⚔️",
                time: year,
                timestamp: Date.now(),
                isRivalAction: true
            });
            if (window.worldEvents.length > 100) window.worldEvents.pop();
            if (typeof window.displayEvents === 'function') window.displayEvents();
        }
        console.log(`📜 [ЛЕТОПИС] ${message}`);
    }

    window.checkRandomAttack = function() {
        turnCounter++;
        if (turnCounter - lastAttackTurn < RIVALRY_CONFIG.cooldownTurns) return;
        if (window.pendingAttack) return;
        if (Math.random() > RIVALRY_CONFIG.attackChance) return;

        let possibleAttackers = getAllHeroes(true);
        if (possibleAttackers.length < 1) return;

        let possibleVictims = getAllHeroes(false);
        if (possibleVictims.length < 1) return;

        let attacker = possibleAttackers[Math.floor(Math.random() * possibleAttackers.length)];
        let victims = possibleVictims.filter(v => v.id !== attacker.id);
        if (victims.length === 0) return;
        let victim = victims[Math.floor(Math.random() * victims.length)];

        const stolenInfo = performTheft(victim.heroObj, attacker.heroObj);
        if (!stolenInfo) return;

        lastAttackTurn = turnCounter;
        addAttackToChronicle(attacker, victim, stolenInfo);

        const playerHero = getPlayerHero();
        const isPlayerVictim = (playerHero && victim.name === playerHero.name);

        if (isPlayerVictim && window.showAdvisorPopup) {
            let stolenDesc = "";
            if (stolenInfo.type === 'xp') stolenDesc = `${stolenInfo.amount} опит`;
            else if (stolenInfo.type === 'artifact') stolenDesc = `артефакт "${stolenInfo.item.name}"`;
            else if (stolenInfo.type === 'spouse') stolenDesc = `съпруг/съпруга "${stolenInfo.item}"`;
            else if (stolenInfo.type === 'pet') stolenDesc = `домашен любимец`;
            else if (stolenInfo.type === 'skill') stolenDesc = `умение "${stolenInfo.item}" (Ниво ${stolenInfo.level})`;
            window.showAdvisorPopup("⚔️ НАПАДЕНИЕ", `${attacker.name} нападна ${victim.name} и открадна ${stolenDesc}!`, "warning");
        }

        if (typeof window.saveGreatBulgariaGame === 'function') {
            window.saveGreatBulgariaGame();
        }

        if (typeof window.updateStrongestHeroUI === 'function') {
            window.updateStrongestHeroUI();
        }
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        if (typeof window.renderFavoriteHeroesBar === 'function') {
    window.renderFavoriteHeroesBar();
}

        console.log(`🔥 НАПАДЕНИЕ (ход ${turnCounter}): ${attacker.name} нападна ${victim.name} и открадна ${stolenInfo.type}`);
    };

    window.startRevengeBattle = function(aggressor, victim, stolenInfo) {
        console.log(`⚔️ ЗАПОЧВА БИТКА ЗА ОТМЪЩЕНИЕ: ${victim.name} срещу ${aggressor.name}`);
        const year = (window.gameTime && window.gameTime.year) ? `${window.gameTime.year} г. ${window.gameTime.era}` : "480 г. пр.н.е.";
        if (window.addWorldEvent) {
            window.addWorldEvent(`⚔️ ОТМЪЩЕНИЕ`, `${victim.name} започва битка срещу ${aggressor.name}!`, "⚔️", year);
        }
        
        let playerHeroes = [];
        const playerHero = getPlayerHero();
        
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true && hero.isAlive !== false) {
                if (playerHero && hero.name !== playerHero.name) {
                    playerHeroes.push({
                        id: key,
                        name: hero.name || hero.leaderName || key,
                        heroObj: hero,
                        power: hero.heroPower || 100
                    });
                }
            }
        }
        if (playerHero && !playerHeroes.some(h => h.name === playerHero.name)) {
            playerHeroes.push({
                id: playerHero.id || playerHero.clan,
                name: playerHero.name,
                heroObj: playerHero,
                power: playerHero.heroPower || 100
            });
        }
        
        if (playerHeroes.length === 0) {
            if (window.showAdvisorMsg) window.showAdvisorMsg("Нямате герой за отмъщение!");
            return;
        }
        if (playerHeroes.length === 1) {
            startOneVsOneBattle(playerHeroes[0], aggressor, victim, stolenInfo);
            return;
        }
        showHeroSelectionModal(playerHeroes, aggressor, victim, stolenInfo);
    };
    
    function showHeroSelectionModal(heroes, aggressor, victim, stolenInfo) {
        const oldModal = document.getElementById('revenge-selection-modal');
        if (oldModal) oldModal.remove();
        const modal = document.createElement('div');
        modal.id = 'revenge-selection-modal';
        modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:100001; display:flex; justify-content:center; align-items:center; font-family:'Cinzel',serif;`;
        let heroesHtml = '<div style="background: #1a1a2e; border-radius: 24px; padding: 20px; max-width: 500px; width: 90%; border: 2px solid #c9a87b;"><h2 style="color: #ffdd99; text-align: center;">⚔️ ИЗБЕРИ ГЕРОЙ ЗА БИТКА ⚔️</h2><div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">';
        heroes.forEach(hero => {
            heroesHtml += `<button class="revenge-hero-btn" data-id="${hero.id}" style="background: #2c1a0c; border: 1px solid #c9a87b; border-radius: 12px; padding: 12px; color: #ffdd99; cursor: pointer; text-align: left; display: flex; justify-content: space-between;"><span>⚔️ ${hero.name}</span><span>💪 ${hero.power} сила</span></button>`;
        });
        heroesHtml += `<button id="cancel-revenge" style="background: #333; border: none; border-radius: 12px; padding: 12px; color: #aaa; cursor: pointer; margin-top: 10px;">❌ ОТКАЖИ</button></div>`;
        modal.innerHTML = heroesHtml;
        document.body.appendChild(modal);
        document.querySelectorAll('.revenge-hero-btn').forEach(btn => {
            btn.onclick = () => {
                const heroId = btn.getAttribute('data-id');
                const selectedHero = heroes.find(h => h.id === heroId);
                modal.remove();
                startOneVsOneBattle(selectedHero, aggressor, victim, stolenInfo);
            };
        });
        document.getElementById('cancel-revenge').onclick = () => modal.remove();
    }
    
    function startOneVsOneBattle(playerHero, aggressor, victim, stolenInfo) {
        const playerPower = playerHero.power;
        const enemyPower = aggressor.power;
        const playerChance = playerPower / (playerPower + enemyPower);
        const isVictory = Math.random() < playerChance;
        const year = (window.gameTime && window.gameTime.year) ? `${window.gameTime.year} г. ${window.gameTime.era}` : "480 г. пр.н.е.";
        if (isVictory) {
            if (window.addWorldEvent) {
                window.addWorldEvent(`🏆 ПОБЕДА В ОТМЪЩЕНИЕ`, `${playerHero.name} победи ${aggressor.name} и си върна откраднатото!`, "🏆", year);
            }
            if (window.showAdvisorMsg) window.showAdvisorMsg(`🏆 Отмъщението бе успешно! ${victim.name} си върна откраднатото!`);
        } else {
            if (window.addWorldEvent) {
                window.addWorldEvent(`💀 ПРОВАЛЕНО ОТМЪЩЕНИЕ`, `${playerHero.name} загуби от ${aggressor.name}!`, "💀", year);
            }
            if (window.showAdvisorMsg) window.showAdvisorMsg(`💀 Отмъщението се провали! ${victim.name} не успя да си върне откраднатото.`);
        }
        if (typeof window.updateStrongestHeroUI === 'function') {
            window.updateStrongestHeroUI();
        }
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        window.pendingAttack = null;
    }

    window.rivalrySystem = {
        getEnemyHeroes: getAllHeroes,
        getPlayerHeroes: function() {
            const playerHero = getPlayerHero();
            if (!playerHero) return [];
            return [{ name: playerHero.name, heroObj: playerHero, power: playerHero.heroPower || 100, isPlayer: true }];
        },
        checkRandomAttack: window.checkRandomAttack,
        startRevengeBattle: window.startRevengeBattle,
        performTheft: performTheft,
        addAttackToChronicle: addAttackToChronicle,
        RIVALRY_CONFIG: RIVALRY_CONFIG
    };

    console.log("✅ rivalry.js – напълно без currentHero (използва getStrongestHero)");
})();
