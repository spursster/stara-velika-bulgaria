/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: rivalry.js (СИСТЕМА ЗА СЛУЧАЙНИ НАПАДЕНИЯ МЕЖДУ ГЕРОИТЕ)
СТАТУС: ВЕРСИЯ 1.1 - БАЛАНСИРАНА (3% ШАНС)
==========================================================================
*/

(function() {
    console.log("🔥 Инициализация на системата за съперничество...");

    // ==================== КОНФИГУРАЦИЯ ====================
    const RIVALRY_CONFIG = {
        attackChance: 0.03,      // 3% шанс за нападение на ход (по-балансирано)
        xpTheftPercent: 0.30,    // 30% от текущия опит се краде
        xpTransferToAggressor: 0.50, // 50% от откраднатия опит отива при нападателя
        revengeBonus: 1.5,       // Бонус при отмъщение (върнатото се умножава)
        minHeroesForAttack: 2,   // Минимум 2 героя на играча, за да може да бъде нападнат
        cooldownTurns: 5,        // Минимум 5 хода между две нападения
    };

    // ==================== ГЛОБАЛНИ ПРОМЕНЛИВИ ====================
    window.pendingAttack = null;
    let lastAttackTurn = 0;
    let turnCounter = 0;

    // ==================== ПОМОЩНИ ФУНКЦИИ ====================
    
    // Взема всички вражески герои (кланове, които не са играча)
    function getEnemyHeroes() {
        let enemies = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                // Изключваме текущия герой на играча
                if (window.currentHero && clan.name !== window.currentHero.name && clan.isJoined !== true) {
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

    // Взема всички герои на играча (освен главния, ако е забранен)
    function getPlayerHeroes(excludeMain = true) {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let clan = window.worldData.clans[key];
                if (clan.isJoined === true) {
                    if (excludeMain && window.currentHero && clan.name === window.currentHero.name) continue;
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
        }
        return heroes;
    }

    // ==================== ФУНКЦИИ ЗА КРАДБА ====================

    // Кражба на артефакт
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

    // Кражба на съпруга
    function stealSpouse(victim, aggressor) {
        if (!victim.spouse) return false;
        const stolenSpouse = victim.spouse;
        victim.spouse = null;
        aggressor.spouse = stolenSpouse;
        return { type: "spouse", item: stolenSpouse };
    }

    // Кражба на питомник (любимец)
    function stealPet(victim, aggressor) {
        if (!victim.pet) return false;
        const stolenPet = victim.pet;
        victim.pet = null;
        aggressor.pet = stolenPet;
        return { type: "pet", item: stolenPet };
    }

    // Кражба на способност (ниво на умение)
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

    // Кражба на опит (30% от текущия опит)
    function stealXP(victim, aggressor) {
        const stolenXP = Math.floor(victim.xp * RIVALRY_CONFIG.xpTheftPercent);
        if (stolenXP <= 0) return false;
        
        victim.xp -= stolenXP;
        const gainXP = Math.floor(stolenXP * RIVALRY_CONFIG.xpTransferToAggressor);
        if (window.gainHeroXP) {
            window.gainHeroXP(aggressor, gainXP);
        } else {
            aggressor.xp = (aggressor.xp || 0) + gainXP;
        }
        
        return { type: "xp", amount: stolenXP, gained: gainXP };
    }

    // Основна функция за извършване на кражба
    function performTheft(victim, aggressor) {
        // Определяме какво ще бъде откраднато
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

    // ==================== НОТИФИКАЦИЯ И ОТМЪЩЕНИЕ ====================

    // Показва червения прозорец за нападение
    function showAttackNotification(aggressor, victim, stolenInfo) {
        const oldNotify = document.getElementById('rivalry-notification');
        if (oldNotify) oldNotify.remove();
        
        let stolenText = "";
        switch(stolenInfo.type) {
            case "artifact": stolenText = `Артефакт "${stolenInfo.item.name}"`; break;
            case "spouse": stolenText = `Съпруга "${stolenInfo.item}"`; break;
            case "pet": stolenText = `Любимец`; break;
            case "skill": stolenText = `Способност "${stolenInfo.item}" (Ниво ${stolenInfo.level})`; break;
            case "xp": stolenText = `${stolenInfo.amount} опит`; break;
        }
        
        const notification = document.createElement('div');
        notification.id = 'rivalry-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            background: linear-gradient(135deg, #2a0a0a, #1a0505);
            border-left: 6px solid #ff3333;
            border-radius: 12px;
            padding: 15px;
            color: #ffdd99;
            font-family: 'Cinzel', serif;
            z-index: 100000;
            box-shadow: 0 0 20px rgba(255,0,0,0.3);
            animation: slideInRight 0.3s ease;
            backdrop-filter: blur(8px);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="font-size: 32px;">🔥</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #ff6666;">НАПАДЕНИЕ!</div>
                    <div style="font-size: 12px;">${aggressor.name} нападна ${victim.name}</div>
                </div>
                <button id="close-notification" style="background: none; border: none; color: #ff6666; font-size: 18px; cursor: pointer;">✕</button>
            </div>
            <div style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 8px; margin-bottom: 12px; font-size: 11px;">
                💢 Откраднато: ${stolenText}
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="revenge-btn" class="revenge-btn" style="flex: 1; background: #7a2e1a; border: none; padding: 8px; border-radius: 20px; color: #ffdd99; cursor: pointer; font-weight: bold;">⚔️ ОТМЪСТИ</button>
                <button id="ignore-btn" style="flex: 1; background: #2c1a0c; border: none; padding: 8px; border-radius: 20px; color: #888; cursor: pointer;">🚫 ИГНОРИРАЙ</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация за изчезване
        if (!document.getElementById('rivalry-animations')) {
            const style = document.createElement('style');
            style.id = 'rivalry-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Затваряне
        document.getElementById('close-notification').onclick = () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
            window.pendingAttack = null;
        };
        
        document.getElementById('ignore-btn').onclick = () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
            window.pendingAttack = null;
        };
        
        document.getElementById('revenge-btn').onclick = () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
            window.startRevengeBattle(aggressor, victim, stolenInfo);
        };
        
        window.pendingAttack = { aggressor, victim, stolenInfo };
    }

    // ==================== ОСНОВНА ФУНКЦИЯ ЗА СЛУЧАЙНО НАПАДЕНИЕ ====================
    
    window.checkRandomAttack = function() {
        // Увеличаваме брояча на ходовете
        turnCounter++;
        
        // Проверка за cooldown
        if (turnCounter - lastAttackTurn < RIVALRY_CONFIG.cooldownTurns) return;
        
        // Проверка дали има вече висящо нападение
        if (window.pendingAttack) return;
        
        // Шанс за нападение (3%)
        if (Math.random() > RIVALRY_CONFIG.attackChance) return;
        
        // Вземаме врагове и герои на играча
        const enemies = getEnemyHeroes();
        const playerHeroes = getPlayerHeroes(true);
        
        if (enemies.length === 0 || playerHeroes.length < RIVALRY_CONFIG.minHeroesForAttack) return;
        
        const aggressor = enemies[Math.floor(Math.random() * enemies.length)];
        const victim = playerHeroes[Math.floor(Math.random() * playerHeroes.length)];
        
        // Извършваме кражбата
        const stolenInfo = performTheft(victim.clan, aggressor.clan);
        if (!stolenInfo) return;
        
        // Записваме хода на нападението
        lastAttackTurn = turnCounter;
        
        // Показваме нотификация
        showAttackNotification(aggressor, victim, stolenInfo);
        
        // Запазваме промените
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        
        console.log(`🔥 НАПАДЕНИЕ (${turnCounter} ход): ${aggressor.name} нападна ${victim.name} и открадна ${stolenInfo.type}`);
    };

    // ==================== БИТКА ЗА ОТМЪЩЕНИЕ (1vs1) ====================
    
    window.startRevengeBattle = function(aggressor, victim, stolenInfo) {
        console.log(`⚔️ ЗАПОЧВА БИТКА ЗА ОТМЪЩЕНИЕ: ${victim.name} срещу ${aggressor.name}`);
        
        const playerHeroes = getPlayerHeroes(false);
        
        if (playerHeroes.length === 0) {
            alert("Нямате герой за битка!");
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
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            z-index: 100001;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Cinzel', serif;
        `;
        
        let heroesHtml = '<div style="background: #1a1a2e; border-radius: 24px; padding: 20px; max-width: 500px; width: 90%; border: 2px solid #c9a87b;"><h2 style="color: #ffdd99; text-align: center;">⚔️ ИЗБЕРИ ГЕРОЙ ЗА БИТКА ⚔️</h2><div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">';
        
        heroes.forEach(hero => {
            heroesHtml += `
                <button class="revenge-hero-btn" data-id="${hero.id}" style="background: #2c1a0c; border: 1px solid #c9a87b; border-radius: 12px; padding: 12px; color: #ffdd99; cursor: pointer; text-align: left; display: flex; justify-content: space-between;">
                    <span>⚔️ ${hero.name}</span>
                    <span>💪 ${hero.power} сила</span>
                </button>
            `;
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
        // Опростена битка 1vs1
        const playerPower = playerHero.power;
        const enemyPower = aggressor.power;
        const playerChance = playerPower / (playerPower + enemyPower);
        const isVictory = Math.random() < playerChance;
        
        if (isVictory) {
            alert(`🏆 ПОБЕДА! ${playerHero.name} победи ${aggressor.name}!`);
            
            // Връщане на откраднатото (логиката ще се доразвие)
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`🏆 Отмъщението бе успешно! ${victim.name} си върна откраднатото!`);
            }
            
            if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        } else {
            alert(`💀 ЗАГУБА! ${playerHero.name} загуби от ${aggressor.name}!`);
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`💀 Отмъщението се провали! ${victim.name} не успя да си върне откраднатото.`);
            }
        }
        
        window.pendingAttack = null;
    }

    console.log("✅ Системата за съперничество е инициализирана (3% шанс, 5 хода cooldown)!");
})();
