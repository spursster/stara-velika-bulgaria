/**
 =========================================================================
 МОДУЛ: ДРЕВНИ ЦИВИЛИЗАЦИИ – С ИНВАЗИИ И АNCIENT OWNER
 =========================================================================
 */

(function() {
    // Списък на всички цивилизации
    const allCivilizations = [
        { id: "elven_kingdom", name: "Елфийско кралство", icon: "🧝", action: "giveBoost" },
        { id: "fairy_court", name: "Двор на феите", icon: "🧚", action: "giveGoldArtifact" },
        { id: "celestial_empire", name: "Небесна империя", icon: "☁️", action: "healHeroes" },
        { id: "orc_horde", name: "Оркска орда", icon: "👹", action: "attackRegion" },
        { id: "demon_legions", name: "Демонични легиони", icon: "😈", action: "destroyArmy" },
        { id: "shadow_realm", name: "Царство на сенките", icon: "🌑", action: "stealArtifact" },
        { id: "dragon_lords", name: "Драконови лордове", icon: "🐉", action: "burnRegion" },
        { id: "undead_legion", name: "Легион на мъртвите", icon: "💀", action: "curseRegion" },
        { id: "atlantean_dominion", name: "Атлантидско владение", icon: "🌊", action: "portalOrSkill" },
        { id: "dwarf_holds", name: "Джуджешки подземия", icon: "⛏️", action: "giveArtifact" },
        { id: "mongol_empire", name: "Монголска империя", icon: "🏹", action: "attackRegion" },
        { id: "ottoman_empire", name: "Османска империя", icon: "☪️", action: "destroyArmy" },
        { id: "viking_kingdoms", name: "Викингски кралства", icon: "⚔️", action: "attackRegion" },
        { id: "khazar_khanate", name: "Хазарски каганат", icon: "🏇", action: "attackRegion" },
        { id: "abbasid_caliphate", name: "Абасидски халифат", icon: "🕌", action: "giveGoldArtifact" },
    ];

    function addLog(title, message, icon) {
        if (window.addWorldEvent) window.addWorldEvent(title, message, icon);
        else console.log(icon, title, message);
    }

    // Помощна функция за вземане на "главния герой"
    function getMainHero() {
        if (window.gameMode === 'solo') {
            return window.currentHero || null;
        } else {
            if (typeof window.getStrongestHero === 'function') {
                return window.getStrongestHero();
            }
            if (typeof window.getSelectedHero === 'function') {
                return window.getSelectedHero();
            }
            return null;
        }
    }

    // ========== ВСИЧКИ ВЪЗМОЖНИ ДЕЙСТВИЯ (С АNCIENT OWNER) ==========
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

    function attackRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        let region = window.worldData?.regions?.[regionName];
        if (region) {
            let damage = Math.floor((region.armySize || 200) * 0.3);
            region.armySize = Math.max(0, (region.armySize || 200) - damage);
            addLog(`⚔️ Нападение от ${civ.name}`, `${civ.name} атакува ${regionName}! Армията намалява с ${damage}.`, civ.icon);
            if (region.armySize <= 0) {
                // Цивилизацията завладява региона
                region.ancientOwner = civ.id;
                addLog(`🏚️ Загуба на регион`, `${regionName} попада под контрола на ${civ.name}.`, "🏚️");
                window.playerRegions = window.playerRegions.filter(r => r !== regionName);
            }
        }
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
        }
    }

    function curseRegion(civ) {
        if (!window.playerRegions || window.playerRegions.length === 0) return;
        let regionName = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
        addLog(`💀 Проклятие от ${civ.name}`, `${civ.name} проклина ${regionName} – приходите са намалени за 3 хода.`, civ.icon);
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

    // ========== ОСНОВНА ФУНКЦИЯ ==========
    window.processAncientCivilizations = function() {
        if (!window.worldData || !window.worldData.factions) return;
        let civ = allCivilizations[Math.floor(Math.random() * allCivilizations.length)];
        if (!civ) return;
        switch(civ.action) {
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
        if (window.refreshAllHeroUI) window.refreshAllHeroUI();
        if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
    };

    console.log("✅ Древните цивилизации са активни – с инвазии и ancientOwner");
})();
