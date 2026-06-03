/**
 =========================================================================
 МОДУЛ: ДРЕВНИ ЦИВИЛИЗАЦИИ – ИНВАЗИИ И ЗАВЛАДЯВАНЕ НА РЕГИОНИ
 ВЕРСИЯ: 2.0 – С ПЪЛНА КАРТА И ЦВЕТОВЕ
 =========================================================================
 */

(function() {
    // Списък на всички цивилизации с цветове за картата
    const allCivilizations = [
        { id: "elven_kingdom", name: "Елфийско кралство", icon: "🧝", action: "giveBoost", color: "#5a8c5a" },
        { id: "fairy_court", name: "Двор на феите", icon: "🧚", action: "giveGoldArtifact", color: "#8a6e4a" },
        { id: "celestial_empire", name: "Небесна империя", icon: "☁️", action: "healHeroes", color: "#6a8fbf" },
        { id: "orc_horde", name: "Оркска орда", icon: "👹", action: "invadeRegion", color: "#8b5a2b" },
        { id: "demon_legions", name: "Демонични легиони", icon: "😈", action: "invadeRegion", color: "#6a1a1a" },
        { id: "shadow_realm", name: "Царство на сенките", icon: "🌑", action: "stealArtifact", color: "#3a3a5a" },
        { id: "dragon_lords", name: "Драконови лордове", icon: "🐉", action: "burnRegion", color: "#b8860b" },
        { id: "undead_legion", name: "Легион на мъртвите", icon: "💀", action: "curseRegion", color: "#5a5a5a" },
        { id: "atlantean_dominion", name: "Атлантидско владение", icon: "🌊", action: "portalOrSkill", color: "#4a8a9a" },
        { id: "dwarf_holds", name: "Джуджешки подземия", icon: "⛏️", action: "giveArtifact", color: "#b85c1a" },
        { id: "mongol_empire", name: "Монголска империя", icon: "🏹", action: "invadeRegion", color: "#8a6e3a" },
        { id: "ottoman_empire", name: "Османска империя", icon: "☪️", action: "invadeRegion", color: "#6a5a3a" },
        { id: "viking_kingdoms", name: "Викингски кралства", icon: "⚔️", action: "invadeRegion", color: "#5a7a8a" },
        { id: "khazar_khanate", name: "Хазарски каганат", icon: "🏇", action: "invadeRegion", color: "#8a6a4a" },
        { id: "abbasid_caliphate", name: "Абасидски халифат", icon: "🕌", action: "giveGoldArtifact", color: "#6a8a5a" },
    ];

    // Карта за лесен достъп до цвета на цивилизация
    window.ancientCivColors = {};
    allCivilizations.forEach(civ => { window.ancientCivColors[civ.id] = civ.color; });

    function addLog(title, message, icon) {
        if (window.addWorldEvent) window.addWorldEvent(title, message, icon);
        else console.log(icon, title, message);
    }

    function getMainHero() {
        if (window.gameMode === 'solo') return window.currentHero || null;
        if (typeof window.getStrongestHero === 'function') return window.getStrongestHero();
        if (typeof window.getSelectedHero === 'function') return window.getSelectedHero();
        return null;
    }

    // Нова функция: инвазия – цивилизация атакува регион (свой, на играча или независим)
    function invadeRegion(civ) {
        if (!window.worldData || !window.worldData.regions) return;
        
        // Избираме регион – предпочитаме граничещи с вече завладени от същата цивилизация,
        // но за простота ще изберем случаен регион, който не е на играча (или може и на играча)
        let allRegions = Object.values(window.worldData.regions);
        let target = null;
        // Опитваме да намерим регион, който не е собственост на играча (за да не го дразним прекалено)
        let candidates = allRegions.filter(r => !window.playerRegions.includes(r.name));
        if (candidates.length === 0) candidates = allRegions;
        target = candidates[Math.floor(Math.random() * candidates.length)];
        if (!target) return;
        
        let defenderPower = target.armySize || 100;
        let attackerPower = 200 + Math.floor(Math.random() * 150); // базови войски на цивилизацията
        
        let winChance = attackerPower / (attackerPower + defenderPower);
        let isVictory = Math.random() < winChance;
        
        if (isVictory) {
            // Успешна инвазия – регионът преминава под контрола на цивилизацията
            let oldOwner = target.ancientOwner || "независим";
            target.ancientOwner = civ.id;
            // Намаляваме армията на региона (цивилизацията оставя гарнизон)
            target.armySize = Math.max(50, Math.floor(defenderPower * 0.3));
            addLog(`🏰 ЗАВЛАДЯВАНЕ`, `${civ.name} завладя ${target.name} (беше под ${oldOwner}).`, civ.icon);
            
            // Ако регионът беше на играча, го премахваме от playerRegions
            if (window.playerRegions.includes(target.name)) {
                window.playerRegions = window.playerRegions.filter(r => r !== target.name);
                addLog(`⚠️ ЗАГУБА НА РЕГИОН`, `Загубихте ${target.name} от ${civ.name}!`, "⚠️");
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }
        } else {
            // Неуспешна инвазия – регионът отблъсква атаката, но губи част от армията
            let loss = Math.floor(defenderPower * 0.2);
            target.armySize = Math.max(10, defenderPower - loss);
            addLog(`🛡️ ОТБИТА АТАКА`, `${civ.name} атакува ${target.name}, но бе отблъснат. Загуби: ${loss} войници.`, civ.icon);
        }
        
        // Обновяване на картата, ако е отворена
        if (typeof window.refreshMap === 'function') window.refreshMap();
        if (typeof window.refreshRegionsMap === 'function') window.refreshRegionsMap();
    }

    // Старите функции (giveBoost и т.н.) остават, но action за някои цивилизации ще бъде "invadeRegion"
    function giveBoost(civ) {
        let hero = getMainHero();
        if (!hero) return;
        let boost = Math.floor(Math.random() * 100) + 20;
        hero.heroPower = (hero.heroPower || 100) + boost;
        if (window.recalculateHeroPower) window.recalculateHeroPower(hero);
        addLog(`✨ Благословия от ${civ.name}`, `${civ.name} дарява +${boost} бойна мощ на ${hero.name}.`, civ.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function giveGoldArtifact(civ) {
        let hero = getMainHero();
        if (!hero) return;
        let gold = Math.floor(Math.random() * 600) + 200;
        hero.gold = (hero.gold || 0) + gold;
        addLog(`💰 Дар от ${civ.name}`, `Получихте ${gold} злато от ${civ.name}.`, civ.icon);
        if (window.historicalArtifacts && Math.random() < 0.3) {
            let keys = Object.keys(window.historicalArtifacts);
            let randomArtifact = { ...window.historicalArtifacts[keys[Math.floor(Math.random() * keys.length)]] };
            if (!hero.inventory) hero.inventory = [];
            hero.inventory.push(randomArtifact);
            addLog(`🏺 Древен артефакт`, `${civ.name} ви подарява ${randomArtifact.name}!`, "🏺");
        }
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function healHeroes(civ) {
        let hero = getMainHero();
        if (!hero) return;
        let healAmount = Math.floor(hero.maxHp * 0.4);
        hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
        addLog(`💚 Лечение от ${civ.name}`, `${civ.name} възстановява ${healAmount} HP на ${hero.name}.`, civ.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function destroyArmy(civ) {
        let hero = getMainHero();
        if (!hero) return;
        let loss = Math.floor((hero.armySize || 300) * 0.2);
        hero.armySize = Math.max(10, (hero.armySize || 300) - loss);
        hero.currentArmy = hero.armySize;
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
        addLog(`💀 Демонична атака`, `${civ.name} унищожава ${loss} войници от армията на ${hero.name}!`, civ.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function stealArtifact(civ) {
        let hero = getMainHero();
        if (!hero || !hero.inventory || hero.inventory.length === 0) return;
        let randomIndex = Math.floor(Math.random() * hero.inventory.length);
        let stolen = hero.inventory[randomIndex];
        hero.inventory.splice(randomIndex, 1);
        addLog(`🌑 Кражба от ${civ.name}`, `${civ.name} открадна от ${hero.name} артефакта "${stolen.name}".`, civ.icon);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function burnRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        let region = window.worldData?.regions?.[regionName];
        if (region) {
            let oldInfra = region.infrastructureLevel || 1;
            region.infrastructureLevel = Math.max(1, oldInfra - 2);
            addLog(`🐉 Огнено наказание`, `${civ.name} изгаря ${regionName}! Инфраструктурата пада от ниво ${oldInfra} на ${region.infrastructureLevel}.`, civ.icon);
            if (typeof window.refreshMap === 'function') window.refreshMap();
        }
    }

    function curseRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        addLog(`💀 Проклятие от ${civ.name}`, `${civ.name} проклина ${regionName} – приходите са намалени за 3 хода.`, civ.icon);
        // Може да добавим временен дебаф в региона (но за момента само съобщение)
    }

    function portalOrSkill(civ) {
        let hero = getMainHero();
        if (!hero) return;
        let r = Math.random();
        if (r < 0.33) {
            let xp = 80 + Math.floor(Math.random() * 150);
            if (window.gainHeroXP) window.gainHeroXP(hero, xp);
            addLog(`🌀 Магия от ${civ.name}`, `${civ.name} дарява ${hero.name} с ${xp} опит.`, civ.icon);
        } else if (r < 0.66 && window.advancedSkills) {
            if (hero.skillPoints > 0 && typeof window.autoAssignSkillPoint === 'function') {
                window.autoAssignSkillPoint(hero);
                addLog(`📖 Просветление`, `${civ.name} научи ${hero.name} на ново умение!`, civ.icon);
            } else {
                addLog(`✨ Благословия`, `${civ.name} зарежда силите на ${hero.name}.`, civ.icon);
            }
        } else {
            if (typeof window.addPortalToRegion === 'function' && window.currentRegion) {
                let world = window.unknownWorldsDatabase?.[Math.floor(Math.random() * (window.unknownWorldsDatabase?.length || 1))];
                if (world) {
                    window.addPortalToRegion(window.currentRegion, world, 300);
                    addLog(`🌀 Портал към ${world.name}`, `${civ.name} отваря мистичен портал в ${window.currentRegion}!`, civ.icon);
                }
            }
        }
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    }

    function giveArtifact(civ) {
        let hero = getMainHero();
        if (!hero) return;
        if (window.historicalArtifacts) {
            let keys = Object.keys(window.historicalArtifacts);
            let randomArtifact = { ...window.historicalArtifacts[keys[Math.floor(Math.random() * keys.length)]] };
            if (!hero.inventory) hero.inventory = [];
            hero.inventory.push(randomArtifact);
            addLog(`🔨 Дарове от ${civ.name}`, `${hero.name} получи артефакт "${randomArtifact.name}" от ${civ.name}.`, civ.icon);
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
        }
    }

    // ========== ОСНОВНА ФУНКЦИЯ – ВИНАГИ ИЗБИРА СЛУЧАЙНА ЦИВИЛИЗАЦИЯ И ДЕЙСТВИЕ ==========
    window.processAncientCivilizations = function() {
        if (!window.worldData || !window.worldData.regions) return;
        let civ = allCivilizations[Math.floor(Math.random() * allCivilizations.length)];
        if (!civ) return;
        
        // Според дефинираното действие
        switch(civ.action) {
            case "invadeRegion": invadeRegion(civ); break;
            case "giveBoost": giveBoost(civ); break;
            case "giveGoldArtifact": giveGoldArtifact(civ); break;
            case "healHeroes": healHeroes(civ); break;
            case "destroyArmy": destroyArmy(civ); break;
            case "stealArtifact": stealArtifact(civ); break;
            case "burnRegion": burnRegion(civ); break;
            case "curseRegion": curseRegion(civ); break;
            case "portalOrSkill": portalOrSkill(civ); break;
            case "giveArtifact": giveArtifact(civ); break;
            default: invadeRegion(civ);
        }
        
        if (window.refreshAllHeroUI) window.refreshAllHeroUI();
        if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
    };

    console.log("✅ Древните цивилизации вече завладяват региони и променят цветовете на картата.");
})();
