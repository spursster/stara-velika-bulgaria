/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: battle.js (ВЕРСИЯ 9.5 – ОПРАВЕНА БИТКА ЗА ТУРНИР)
==========================================================================
*/

(function() {
    // ==================== СТИЛОВЕ ====================
    if (!document.getElementById('battle-styles-v2')) {
        const style = document.createElement('style');
        style.id = 'battle-styles-v2';
        style.textContent = ` ... (същият CSS, както преди) ... `;
        document.head.appendChild(style);
    }

    const core = window.BattleCore;
    if (!core) {
        console.error("❌ battle-core.js не е зареден!");
        return;
    }

    // ==================== ПОМОЩНИ ФУНКЦИИ С КЕШ ====================
    let heroElementsCache = null;
    let enemyElementsCache = null;
    let battleLogCache = null;

    function addLog(message, isError = false) {
        if (!battleLogCache) battleLogCache = document.getElementById('battle-log');
        if (battleLogCache) {
            const p = document.createElement('p');
            p.innerHTML = message;
            if (isError) p.style.color = '#ff8888';
            battleLogCache.appendChild(p);
            battleLogCache.scrollTop = battleLogCache.scrollHeight;
            while (battleLogCache.children.length > 15) battleLogCache.removeChild(battleLogCache.firstChild);
        }
    }

    function updateHeroHPUI(hero) {
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
    }

    function updateEnemyHPUI(enemy) {
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
    }

    function animateHero(heroId, damage = null, isHeal = false) {
        const card = heroElementsCache?.get(heroId);
        if (card) {
            core.animateCard(card);
            if (damage !== null) core.showFloatingNumber(card, damage, isHeal);
        }
    }

    function animateEnemy(enemyId, damage = null, isHeal = false) {
        const card = enemyElementsCache?.get(enemyId);
        if (card) {
            core.animateCard(card);
            if (damage !== null) core.showFloatingNumber(card, damage, isHeal);
        }
    }

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

    // ==================== ОСНОВНА ФУНКЦИЯ startBattle ====================
    function startBattle(regionInput) {
        core.resetNarrative();
        console.log("⚔️ startBattle извикана с:", regionInput);

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
        let isTournamentDuel = false;
        let tournamentOpponent = null;

        if (typeof finalRegionInput === 'object' && finalRegionInput.isTournamentDuel === true) {
            isTournamentDuel = true;
            tournamentOpponent = finalRegionInput.tournamentOpponent;
            regionName = finalRegionInput.name;
            enemyPower = finalRegionInput.armySize;
            enemyHp = enemyPower;
            regionObject = finalRegionInput;
        } else if (typeof finalRegionInput === 'string') {
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

        let playerHeroes = core.collectPlayerHeroes();
        if (playerHeroes.length === 0) {
            if (window.showAdvisorMsg) window.showAdvisorMsg("Нямате живи герои за битка!");
            return;
        }

        let enemies = [];
        if (isTournamentDuel && tournamentOpponent) {
            enemies = [{
                id: tournamentOpponent.id || 'tournament_enemy',
                name: tournamentOpponent.name,
                power: tournamentOpponent.power,
                hp: tournamentOpponent.hp || tournamentOpponent.maxHp || 200,
                maxHp: tournamentOpponent.hp || tournamentOpponent.maxHp || 200,
                icon: "⚔️",
                isMonster: false,
                isTournamentEnemy: true,
                heroObj: tournamentOpponent.heroObj
            }];
        } else {
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
            if (regionObject && !isTournamentDuel) {
                reinforcements = core.getReinforcements(regionObject, playerHeroes);
            }
            enemies = [mainEnemy, ...reinforcements];
            if (reinforcements.length > 0) {
                addLog(`⚠️ Вражески подкрепления! Към ${mainEnemy.name} се присъединяват: ${reinforcements.map(r => r.name).join(', ')}`);
                core.addNarrative(`⚠️ На бойното поле пристигат подкрепления: ${reinforcements.map(r => r.name).join(', ')}.`);
            }
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
        heroElementsCache = new Map();
        document.querySelectorAll('.hero-card').forEach(card => {
            const id = card.getAttribute('data-id');
            if (id) heroElementsCache.set(id, card);
        });
        enemyElementsCache = new Map();
        document.querySelectorAll('.enemy-card').forEach(card => {
            const id = card.getAttribute('data-id');
            if (id) enemyElementsCache.set(id, card);
        });
        battleLogCache = document.getElementById('battle-log');
        document.getElementById('close-battle-btn').onclick = () => battleScreen.remove();

        let currentHeroes = playerHeroes.map(h => ({ ...h, startingHp: h.hp }));
        let currentEnemies = enemies.map(e => ({ ...e, startingHp: e.hp }));
        let battleActive = true;
        let currentRound = 1;
        let invincibleUsed = {};

        function updateUI() {
            currentHeroes.forEach(hero => updateHeroHPUI(hero));
            currentEnemies.forEach(enemy => updateEnemyHPUI(enemy));
        }

        function heroesAttack() {
            if (!battleActive) return false;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            updateUI();
            if (aliveHeroes.length === 0) return false;
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`🏹 РУНД ${currentRound} - ГЕРОИТЕ АТАКУВАТ!`);
            let totalDamage = 0;
            for (let hero of aliveHeroes) {
                let target = currentEnemies.find(e => e.hp > 0);
                if (!target) break;
                let damage = core.calculateHeroDamage(hero, target, currentRound, addLog, core.addNarrative, animateHero, animateEnemy, updateUI);
                totalDamage += damage;
            }
            addLog(`📊 ОБЩО: ${totalDamage} щети`);
            if (totalDamage > 0) core.addNarrative(`📊 Общо нанесени щети: ${totalDamage}.`);
            const allEnemiesDead = currentEnemies.every(e => e.hp <= 0);
            if (allEnemiesDead) {
                handleVictory(currentHeroes, regionName, playerHeroes, currentEnemies, battleScreen);
                return true;
            }
            updateUI();
            refreshAllHeroUI();
            return true;
        }

        function enemiesAttack() {
            if (!battleActive) return false;
            const aliveHeroes = currentHeroes.filter(h => h.hp > 0);
            if (aliveHeroes.length === 0) return false;
            for (let enemy of currentEnemies) {
                if (enemy.hp <= 0) continue;
                const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                let damage = core.calculateEnemyDamage(enemy, target, addLog, core.addNarrative, animateEnemy, animateHero, updateUI, core.screenShake);
                if (target.hp <= 0) {
                    let petEffects = core.getPetEffects(target.clanObj);
                    let skillBonuses = core.getAdvancedSkillCombatBonuses(target.clanObj);
                    let reviveChance = petEffects.reviveChance || skillBonuses.reviveChance || 0;
                    if (reviveChance > 0 && Math.random() < reviveChance) {
                        target.hp = Math.floor(target.maxHp * 0.3);
                        addLog(`   🔥 ${target.name} се възкресява от любимец/умения! (${target.hp} HP)`);
                        core.addNarrative(`🔥 ${target.name} се възкресява!`);
                    } else {
                        addLog(`   💀 ${target.name} е нокаутиран! 💀`, true);
                        core.applyArmyLossFromDamage(target, 0.5, addLog);
                        core.addNarrative(`💀 ${target.name} пада в битката!`);
                    }
                }
            }
            updateUI();
            const stillAlive = currentHeroes.some(h => h.hp > 0);
            if (!stillAlive) {
                handleDefeat(currentHeroes, regionName, playerHeroes, currentEnemies, battleScreen);
                return false;
            }
            refreshAllHeroUI();
            return true;
        }

        function handleVictory(currentHeroes, regionName, playerHeroes, currentEnemies, battleScreen) {
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
            if (!isTournamentDuel && typeof regionName === 'string' && regionName !== "Портал") {
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
            if (!isTournamentDuel && Math.random() < 0.2 && window.historicalArtifacts) {
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
            if (!isTournamentDuel && Math.random() < 0.15 && window.fantasyRaces && window.fantasyRaces.length > 0) {
                const randomRace = window.fantasyRaces[Math.floor(Math.random() * window.fantasyRaces.length)];
                const prisoner = { id: Date.now() + "_" + Math.random(), name: randomRace.name, raceId: randomRace.id, icon: randomRace.icon, desc: randomRace.desc, bonus: randomRace.bonus, capturedFrom: regionName };
                if (!window.prisoners) window.prisoners = [];
                window.prisoners.push(prisoner);
                addLog(`   👸 Взехте пленник: ${prisoner.name}! Може да се ожените в дипломацията.`);
                if (window.addWorldEvent) window.addWorldEvent(`👸 ПЛЕННИК`, `След битката взехте ${prisoner.name} като пленник!`, "👸");
            }
            if (regionInput && regionInput.isPortalWorld && !isTournamentDuel) {
                const extraBonus = 50 + Math.floor(Math.random() * 100);
                const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                if (randomHero) {
                    randomHero.clanObj.gold += extraBonus;
                    addLog(`   🌌 ПОРТАЛЕН БОНУС: ${randomHero.name} получава +${extraBonus} злато!`);
                }
            }
            if (!isTournamentDuel && window.addWorldEvent) window.addWorldEvent(`🏆 ПОБЕДА В БИТКА`, `${playerHeroes.map(h => h.name).join(', ')} победиха в ${regionName}!`, "🏆");
            for (let i = 0; i < currentHeroes.length; i++) {
                let battleHero = currentHeroes[i];
                let originalHero = battleHero.clanObj;
                if (originalHero && battleHero.hp !== undefined) core.applyBattleOutcome(originalHero, battleHero);
            }
            for (let i = 0; i < currentHeroes.length; i++) {
                let heroObj = currentHeroes[i].clanObj;
                if (heroObj && heroObj.isAuto && typeof window.autoEquipHero === 'function') {
                    window.autoEquipHero(heroObj);
                }
            }
            const rewards = { gold: totalGold, xp: totalXP, artifact: newArtifact || null };
            core.generateBattleStory(regionName, playerHeroes, currentEnemies, true, rewards);
            refreshAllHeroUI();
            if (typeof window.renderFavoriteHeroesBar === 'function') {
                window.renderFavoriteHeroesBar();
                var bar = document.getElementById('favorite-heroes-bar');
                if (bar) {
                    bar.style.display = 'none';
                    bar.offsetHeight;
                    bar.style.display = '';
                }
            }
            battleActive = false;
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = true;
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
            // ⭐ Уведомяваме турнира за резултата (ако има pending турнирен двубой)
            if (window._pendingTournamentMatch && typeof window._resolveTournamentMatch === 'function') {
                window._resolveTournamentMatch(true, currentHeroes, currentEnemies, regionName);
            }
            if (typeof window.endGroupBattle === 'function') window.endGroupBattle(true, 'victory', regionName);
            window.currentBattleState = null;
            window._lastBattleHeroes = null;
            setTimeout(() => battleScreen.remove(), 1500);
        }

        function handleDefeat(currentHeroes, regionName, playerHeroes, currentEnemies, battleScreen) {
            addLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLog(`💀 ЗАГУБА! Всички герои са победени! 💀`, true);
            for (let i = 0; i < currentHeroes.length; i++) {
                let battleHero = currentHeroes[i];
                let originalHero = battleHero.clanObj;
                if (originalHero && battleHero.hp !== undefined) core.applyBattleOutcome(originalHero, battleHero);
            }
            for (let i = 0; i < currentHeroes.length; i++) {
                let heroObj = currentHeroes[i].clanObj;
                if (heroObj && heroObj.isAuto && typeof window.autoEquipHero === 'function') {
                    window.autoEquipHero(heroObj);
                }
            }
            core.generateBattleStory(regionName, playerHeroes, currentEnemies, false, {});
            refreshAllHeroUI();
            if (typeof window.renderFavoriteHeroesBar === 'function') {
                window.renderFavoriteHeroesBar();
                var bar = document.getElementById('favorite-heroes-bar');
                if (bar) {
                    bar.style.display = 'none';
                    bar.offsetHeight;
                    bar.style.display = '';
                }
            }
            battleActive = false;
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = true;
            // ⭐ Уведомяваме турнира за резултата (загуба)
            if (window._pendingTournamentMatch && typeof window._resolveTournamentMatch === 'function') {
                window._resolveTournamentMatch(false, currentHeroes, currentEnemies, regionName);
            }
            if (typeof window.endGroupBattle === 'function') window.endGroupBattle(false, 'defeat');
            window.currentBattleState = null;
            window._lastBattleHeroes = null;
            setTimeout(() => battleScreen.remove(), 1500);
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
                if (hero.hp > 0) core.applyArmyLossFromDamage(hero, 0.2, addLog);
            });
            for (let i = 0; i < currentHeroes.length; i++) {
                let battleHero = currentHeroes[i];
                let originalHero = battleHero.clanObj;
                if (originalHero && battleHero.hp !== undefined) core.applyBattleOutcome(originalHero, battleHero);
            }
            core.generateBattleStory(regionName, playerHeroes, currentEnemies, false, {});
            refreshAllHeroUI();
            battleActive = false;
            const attackBtn = document.getElementById('battle-attack');
            if (attackBtn) attackBtn.disabled = true;
            if (window._pendingTournamentMatch && typeof window._resolveTournamentMatch === 'function') {
                window._resolveTournamentMatch(false, currentHeroes, currentEnemies, regionName);
            }
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
    }

    // ⭐ Истинската endGroupBattle – тук уведомяваме турнира
    function endGroupBattle(isVictory, reason, regionName) {
        console.log(`🏁 Битката приключи. Победа: ${isVictory}, Причина: ${reason}, Регион: ${regionName || 'неизвестен'}`);
        let questHero = null;
        if (typeof window.getStrongestHero === 'function') questHero = window.getStrongestHero();
        if (window.checkAllQuestsProgress && questHero) window.checkAllQuestsProgress(questHero, regionName || window.currentRegion, "battle");
        if (typeof window.handleBattleEnd === 'function') window.handleBattleEnd(isVictory, reason);
        refreshAllHeroUI();
        if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
        if (typeof window.saveGreatBulgariaGame === 'function') window.saveGreatBulgariaGame();
        // ⭐ Уведомяваме турнира за резултата (ако има pending)
        if (window._pendingTournamentMatch && typeof window._resolveTournamentMatch === 'function') {
            window._resolveTournamentMatch(isVictory, null, null, regionName);
        }
    }

    window.Battle = {
        start: startBattle,
        end: endGroupBattle,
        refreshUI: refreshAllHeroUI,
        getReinforcements: core.getReinforcements
    };
    window.startBattle = window.Battle.start;
    window.endGroupBattle = window.Battle.end;
    window.refreshAllHeroUI = window.Battle.refreshUI;
    console.log("✅ battle.js зареден (версия 9.5 – турнирни двубои работят)");
})();
