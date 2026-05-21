/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: rivalry.js (ПЪЛЕН – УНИКАЛНИ ГЕРОИ, ЛЕТОПИС, БЕЗ ДУБЛИКАТИ)
==========================================================================
*/

(function() {
    console.log("🔥 Инициализация на системата за съперничество (уникални герои)...");

    const RIVALRY_CONFIG = {
        attackChance: 0.03,
        xpTheftPercent: 0.30,
        xpTransferToAggressor: 0.50,
        revengeBonus: 1.5,
        minHeroesForAttack: 2,
        cooldownTurns: 5,
    };

    window.pendingAttack = null;
    let lastAttackTurn = 0;
    let turnCounter = 0;

    // ========== УНИКАЛНИ ВРАГОВЕ ==========
    function getEnemyHeroes() {
        let enemies = [];
        if (!window.worldData || !window.worldData.clans) return enemies;
        const seen = new Set();
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (window.currentHero && clan.name !== window.currentHero.name && clan.isJoined !== true) {
                let id = clan.leaderName || clan.name || key;
                if (!seen.has(id)) {
                    seen.add(id);
                    enemies.push({
                        id: key,
                        name: clan.leaderName || clan.name || key,
                        clan: clan,
                        power: clan.heroPower || 100,
                        army: clan.armySize || 200
                    });
                }
            }
        }
        return enemies;
    }

    // ========== УНИКАЛНИ ПРИЯТЕЛСКИ ГЕРОИ ==========
    function getPlayerHeroes(excludeMain = true) {
        let heroes = [];
        if (!window.worldData || !window.worldData.clans) return heroes;
        const seen = new Set();
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) {
                let id = clan.leaderName || clan.name || key;
                if (seen.has(id)) continue;
                if (excludeMain && window.currentHero && clan.name === window.currentHero.name) continue;
                seen.add(id);
                heroes.push({
                    id: key,
                    name: clan.leaderName || clan.name || key,
                    clan: clan,
                    power: clan.heroPower || 100,
                    army: clan.armySize || 200,
                    xp: clan.xp || 0,
                    skills: clan.skills || {},
                    pet: clan.pet || null,
                    inventory: clan.inventory || [],
                    spouse: clan.spouse || null
                });
            }
        }
        return heroes;
    }

    // ========== КРАЖБИ ==========
    function stealArtifact(victim, aggressor) {
        if (!victim.inventory || victim.inventory.length === 0) return false;
        const artifactIndex = Math.floor(Math.random() * victim.inventory.length);
        const stolenArtifact = victim.inventory[artifactIndex];
        if (!stolenArtifact) return false;
        victim.inventory.splice(artifactIndex, 1);
        if (!aggressor.inventory) aggressor.inventory = [];
        aggressor.inventory.push(stolenArtifact);
        return { type: "artifact", item: stolenArtifact };
    }

    function stealSpouse(victim, aggressor) {
        if (!victim.spouse) return false;
        const stolenSpouse = victim.spouse;
        victim.spouse = null;
        aggressor.spouse = stolenSpouse;
        return { type: "spouse", item: stolenSpouse };
    }

    function stealPet(victim, aggressor) {
        if (!victim.pet) return false;
        const stolenPet = victim.pet;
        victim.pet = null;
        aggressor.pet = stolenPet;
        return { type: "pet", item: stolenPet };
    }

    function stealSkill(victim, aggressor) {
        const skillKeys = Object.keys(victim.skills || {});
        if (skillKeys.length === 0) return false;
        const skillKey = skillKeys[Math.floor(Math.random() * skillKeys.length)];
        const stolenLevel = victim.skills[skillKey];
        if (stolenLevel <= 0) return false;
        victim.skills[skillKey] = 0;
        if (!aggressor.skills) aggressor.skills = {};
        aggressor.skills[skillKey] = (aggressor.skills[skillKey] || 0) + stolenLevel;
        return { type: "skill", item: skillKey, level: stolenLevel };
    }

    function stealXP(victim, aggressor) {
        const stolenXP = Math.floor(victim.xp * RIVALRY_CONFIG.xpTheftPercent);
        if (stolenXP <= 0) return false;
        victim.xp -= stolenXP;
        const gainXP = Math.floor(stolenXP * RIVALRY_CONFIG.xpTransferToAggressor);
        if (window.gainHeroXP) window.gainHeroXP(aggressor, gainXP);
        else aggressor.xp = (aggressor.xp || 0) + gainXP;
        return { type: "xp", amount: stolenXP, gained: gainXP };
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
            case "artifact": result = stealArtifact(victim, aggressor); break;
            case "spouse": result = stealSpouse(victim, aggressor); break;
            case "pet": result = stealPet(victim, aggressor); break;
            case "skill": result = stealSkill(victim, aggressor); break;
            case "xp": result = stealXP(victim, aggressor); break;
        }
        return result;
    }

    // ========== ДОБАВЯНЕ В ЛЕТОПИСА ==========
    function addAttackToChronicle(aggressor, victim, stolenInfo) {
        let stolenText = "";
        switch(stolenInfo.type) {
            case "artifact": stolenText = `артефакт "${stolenInfo.item.name}"`; break;
            case "spouse": stolenText = `съпруга/съпруг "${stolenInfo.item}"`; break;
            case "pet": stolenText = `домашен любимец`; break;
            case "skill": stolenText = `умение "${stolenInfo.item}" (Ниво ${stolenInfo.level})`; break;
            case "xp": stolenText = `${stolenInfo.amount} опит`; break;
        }
        const year = window.currentYear || "480 г. пр.н.е.";
        const message = `${aggressor.name} нападна ${victim.name} и открадна ${stolenText}!`;
        if (window.addWorldEvent) {
            window.addWorldEvent(`⚔️ НАПАДЕНИЕ от ${aggressor.name}`, message, "⚔️", year);
        } else if (window.addGameEvent) {
            window.addGameEvent(`⚔️ НАПАДЕНИЕ от ${aggressor.name}`, message, "⚔️", year);
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

    // ========== ОСНОВНА АТАКА (СЛУЧАЙНА) ==========
    window.checkRandomAttack = function() {
        turnCounter++;
        if (turnCounter - lastAttackTurn < RIVALRY_CONFIG.cooldownTurns) return;
        if (window.pendingAttack) return;
        if (Math.random() > RIVALRY_CONFIG.attackChance) return;
        
        const enemies = getEnemyHeroes();
        const playerHeroes = getPlayerHeroes(true);
        
        if (enemies.length === 0 || playerHeroes.length < RIVALRY_CONFIG.minHeroesForAttack) return;
        
        const aggressor = enemies[Math.floor(Math.random() * enemies.length)];
        const victim = playerHeroes[Math.floor(Math.random() * playerHeroes.length)];
        const stolenInfo = performTheft(victim.clan, aggressor.clan);
        
        if (!stolenInfo) return;
        
        lastAttackTurn = turnCounter;
        addAttackToChronicle(aggressor, victim, stolenInfo);
        
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        
        console.log(`🔥 НАПАДЕНИЕ (${turnCounter} ход): ${aggressor.name} нападна ${victim.name} и открадна ${stolenInfo.type}`);
    };

    // ========== ОТМЪЩЕНИЕ ==========
    window.startRevengeBattle = function(aggressor, victim, stolenInfo) {
        console.log(`⚔️ ЗАПОЧВА БИТКА ЗА ОТМЪЩЕНИЕ: ${victim.name} срещу ${aggressor.name}`);
        if (window.addWorldEvent) {
            window.addWorldEvent(`⚔️ ОТМЪЩЕНИЕ`, `${victim.name} започва битка срещу ${aggressor.name}!`, "⚔️", window.currentYear);
        }
        const playerHeroes = getPlayerHeroes(false);
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
        const year = window.currentYear || "480 г. пр.н.е.";
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
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        window.pendingAttack = null;
    }

    console.log("✅ Системата за съперничество е инициализирана (уникални герои).");
})();
