/**
 =========================================================================
 МОДУЛ: ДРЕВНИ ЦИВИЛИЗАЦИИ – АКТИВНИ ФРАКЦИИ
 Версия: 1.0 – събужда света
 =========================================================================
 */

(function() {
    // ========== КОНФИГУРАЦИЯ ==========
    const CIV_CONFIG = {
        checkIntervalTurns: 3,     // на всеки 3 хода проверява
        activationChance: 0.6,     // 60% шанс да активира цивилизация
        eventChance: 0.4,          // 40% шанс за специално събитие (модал)
    };

    // Типове цивилизации според фракциите в worldData
    const civilizationTypes = {
        // Мирни/Помощни
        elven_kingdom: { type: "peaceful", name: "Елфийско кралство", icon: "🧝", action: "giveBoost" },
        fairy_court: { type: "peaceful", name: "Двор на феите", icon: "🧚", action: "giveGoldArtifact" },
        celestial_empire: { type: "peaceful", name: "Небесна империя", icon: "☁️", action: "healHeroes" },
        
        // Агресивни
        orc_horde: { type: "aggressive", name: "Оркска орда", icon: "👹", action: "attackRegion" },
        demon_legions: { type: "aggressive", name: "Демонични легиони", icon: "😈", action: "destroyArmy" },
        shadow_realm: { type: "aggressive", name: "Царство на сенките", icon: "🌑", action: "stealArtifact" },
        
        // Катастрофални
        dragon_lords: { type: "disaster", name: "Драконови лордове", icon: "🐉", action: "burnRegion" },
        undead_legion: { type: "disaster", name: "Легион на мъртвите", icon: "💀", action: "curseRegion" },
        
        // Магически
        atlantean_dominion: { type: "magic", name: "Атлантидско владение", icon: "🌊", action: "portalOrSkill" },
        dwarf_holds: { type: "magic", name: "Джуджешки подземия", icon: "⛏️", action: "giveArtifact" },
    };

    let turnsSinceLastCheck = 0;

    // ========== ПОМОЩНИ ФУНКЦИИ ==========
    function getRandomCivilization() {
        if (!window.worldData || !window.worldData.factions) return null;
        let available = [];
        for (let key in window.worldData.factions) {
            if (civilizationTypes[key]) {
                available.push({ id: key, data: window.worldData.factions[key], typeData: civilizationTypes[key] });
            }
        }
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    function addLog(title, message, icon = "🏛️") {
        if (window.addWorldEvent) {
            window.addWorldEvent(title, message, icon);
        } else {
            console.log(`${icon} ${title}: ${message}`);
        }
    }

    function showCivilizationModal(title, message, options, callback) {
        if (typeof window.showEventModal === 'function') {
            window.showEventModal(title, message, options);
        } else {
            // Резервен вариант
            let result = confirm(message + "\n\nНатиснете OK за първата опция или Cancel за втората.");
            if (callback) callback(result ? options[0].action : (options[1] ? options[1].action : null));
        }
    }

    // ========== ДЕЙСТВИЯ ==========
    function giveBoost(civ) {
        let hero = window.currentHero;
        if (!hero) return;
        let boost = Math.floor(Math.random() * 50) + 20;
        hero.heroPower = (hero.heroPower || 100) + boost;
        if (window.recalculateHeroPower) window.recalculateHeroPower(hero);
        addLog(`✨ Благословия от ${civ.typeData.name}`, `${civ.typeData.name} дарява +${boost} бойна мощ на ${hero.name}.`, civ.typeData.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function giveGoldArtifact(civ) {
        let hero = window.currentHero;
        if (!hero) return;
        let gold = Math.floor(Math.random() * 300) + 150;
        hero.gold = (hero.gold || 0) + gold;
        addLog(`💰 Дар от ${civ.typeData.name}`, `Получихте ${gold} злато от ${civ.typeData.name}.`, civ.typeData.icon);
        if (window.historicalArtifacts && Math.random() < 0.3) {
            let keys = Object.keys(window.historicalArtifacts);
            let randomArtifact = { ...window.historicalArtifacts[keys[Math.floor(Math.random() * keys.length)]] };
            if (!hero.inventory) hero.inventory = [];
            hero.inventory.push(randomArtifact);
            addLog(`🏺 Древен артефакт`, `${civ.typeData.name} ви подарява ${randomArtifact.name}!`, "🏺");
        }
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function healHeroes(civ) {
        let hero = window.currentHero;
        if (!hero) return;
        let healAmount = Math.floor(hero.maxHp * 0.3);
        hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
        addLog(`💚 Лечение от ${civ.typeData.name}`, `${civ.typeData.name} възстановява ${healAmount} HP на ${hero.name}.`, civ.typeData.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function attackRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        let region = window.worldData?.regions?.[regionName];
        if (region) {
            let damage = Math.floor((region.armySize || 200) * 0.2);
            region.armySize = Math.max(0, (region.armySize || 200) - damage);
            addLog(`⚔️ Нападение от ${civ.typeData.name}`, `${civ.typeData.name} атакува ${regionName}! Армията намалява с ${damage}.`, civ.typeData.icon);
            if (region.armySize <= 0) {
                // Регионът е превзет от цивилизацията (символично)
                addLog(`🏚️ Загуба на регион`, `${regionName} попада под контрола на ${civ.typeData.name}.`, "🏚️");
                window.playerRegions = window.playerRegions.filter(r => r !== regionName);
            }
        }
    }

    function destroyArmy(civ) {
        let hero = window.currentHero;
        if (!hero) return;
        let loss = Math.floor((hero.armySize || 300) * 0.15);
        hero.armySize = Math.max(10, (hero.armySize || 300) - loss);
        hero.currentArmy = hero.armySize;
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
        addLog(`💀 Демонична атака`, `${civ.typeData.name} унищожава ${loss} войници от армията ви!`, civ.typeData.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function stealArtifact(civ) {
        let hero = window.currentHero;
        if (!hero || !hero.inventory || hero.inventory.length === 0) return;
        let randomIndex = Math.floor(Math.random() * hero.inventory.length);
        let stolen = hero.inventory[randomIndex];
        hero.inventory.splice(randomIndex, 1);
        addLog(`🌑 Кражба от ${civ.typeData.name}`, `${civ.typeData.name} ви открадна артефакта "${stolen.name}".`, civ.typeData.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function burnRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        let region = window.worldData?.regions?.[regionName];
        if (region) {
            let oldInfra = region.infrastructureLevel || 1;
            region.infrastructureLevel = Math.max(1, oldInfra - 1);
            addLog(`🐉 Огнено наказание`, `${civ.typeData.name} изгаря ${regionName}! Инфраструктурата пада от ниво ${oldInfra} на ${region.infrastructureLevel}.`, civ.typeData.icon);
        }
    }

    function curseRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        addLog(`💀 Проклятие от ${civ.typeData.name}`, `${civ.typeData.name} проклина ${regionName} – приходите ще са намалени за 3 хода.`, civ.typeData.icon);
        // Може да добавим временен ефект (напр. намален доход), но за опростяване – само съобщение.
    }

    function portalOrSkill(civ) {
        let hero = window.currentHero;
        if (!hero) return;
        // Дава случаен бонус: опит, умение или отваря портал
        let r = Math.random();
        if (r < 0.33) {
            let xp = 50 + Math.floor(Math.random() * 100);
            if (window.gainHeroXP) window.gainHeroXP(hero, xp);
            addLog(`🌀 Магия от ${civ.typeData.name}`, `${civ.typeData.name} ви дарява ${xp} опит.`, civ.typeData.icon);
        } else if (r < 0.66 && window.advancedSkills) {
            // Дава случайно умение (ако има свободни точки)
            if (hero.skillPoints > 0) {
                if (typeof window.autoAssignSkillPoint === 'function') {
                    window.autoAssignSkillPoint(hero);
                    addLog(`📖 Просветление`, `${civ.typeData.name} ви научи на ново умение!`, civ.typeData.icon);
                }
            } else {
                addLog(`✨ Благословия`, `${civ.typeData.name} зарежда силите ви.`, civ.typeData.icon);
            }
        } else {
            // Отваря временен портал (експедиция)
            if (typeof window.addPortalToRegion === 'function' && window.currentRegion) {
                let world = window.unknownWorldsDatabase?.[Math.floor(Math.random() * (window.unknownWorldsDatabase?.length || 1))];
                if (world) {
                    window.addPortalToRegion(window.currentRegion, world, 200);
                    addLog(`🌀 Портал към ${world.name}`, `${civ.typeData.name} отваря мистичен портал в ${window.currentRegion}!`, civ.typeData.icon);
                }
            }
        }
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function giveArtifact(civ) {
        let hero = window.currentHero;
        if (!hero) return;
        if (window.historicalArtifacts) {
            let keys = Object.keys(window.historicalArtifacts);
            let randomArtifact = { ...window.historicalArtifacts[keys[Math.floor(Math.random() * keys.length)]] };
            if (!hero.inventory) hero.inventory = [];
            hero.inventory.push(randomArtifact);
            addLog(`🔨 Дарове от ${civ.typeData.name}`, `Получихте артефакт "${randomArtifact.name}" от джуджетата.`, civ.typeData.icon);
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
        }
    }

    // ========== ОСНОВНА ФУНКЦИЯ ==========
    window.processAncientCivilizations = function() {
        if (!window.worldData || !window.worldData.factions) return;
        turnsSinceLastCheck++;
        if (turnsSinceLastCheck < CIV_CONFIG.checkIntervalTurns) return;
        turnsSinceLastCheck = 0;

        if (Math.random() > CIV_CONFIG.activationChance) return;

        let civ = getRandomCivilization();
        if (!civ) return;

        let action = civ.typeData.action;
        // Изпълнява действието
        switch(action) {
            case "giveBoost": giveBoost(civ); break;
            case "giveGoldArtifact": giveGoldArtifact(civ); break;
            case "healHeroes": healHeroes(civ); break;
            case "attackRegion": attackRegion(civ); break;
            case "destroyArmy": destroyArmy(civ); break;
            case "stealArtifact": stealArtifact(civ); break;
            case "burnRegion": burnRegion(civ); break;
            case "curseRegion": curseRegion(civ); break;
            case "portalOrSkill": portalOrSkill(civ); break;
            case "giveArtifact": giveArtifact(civ); break;
            default: giveBoost(civ);
        }

        // Специално събитие с модал (ако има)
        if (Math.random() < CIV_CONFIG.eventChance) {
            let title = `📜 Пратеник от ${civ.typeData.name}`;
            let message = `${civ.typeData.name} изпраща пратеник до вашия двор. Той предлага:`;
            let options = [
                { text: "👑 Приеми дара", action: () => { /* вече е изпълнено */ } },
                { text: "❌ Отхвърли", action: () => { addLog(`🙅 Отказ`, `Вие отказахте помощта от ${civ.typeData.name}.`, "🙅"); } }
            ];
            // Показваме модал само ако има функция
            if (typeof window.showEventModal === 'function') {
                window.showEventModal(title, message, options);
            }
        }

        // Актуализиране на интерфейса
        if (window.refreshAllHeroUI) window.refreshAllHeroUI();
        if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
    };

    // Hook във веригата на хода – извиква се от `processTurn` във `index.html`
    if (typeof window.processTurn === 'function') {
        const originalProcessTurn = window.processTurn;
        window.processTurn = function() {
            originalProcessTurn();
            window.processAncientCivilizations();
        };
    } else {
        console.warn("processTurn не е дефинирана, древните цивилизации няма да се активират автоматично.");
    }

    console.log("✅ Древните цивилизации са будни! Светът ще бъде по-динамичен.");
})();
