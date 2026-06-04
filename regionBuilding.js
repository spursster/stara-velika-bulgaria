// ==================== СТРОИТЕЛСТВО В РЕГИОНИТЕ ====================
// Версия 1.2 – с проверка за съществуване на region.buildings

window.buildingsDB = {
    barracks: {
        name: "Казарма",
        icon: "🏛️",
        effect: { armyBonus: 50 },
        basePrice: 300,
        priceMultiplier: 1.5,
        maxLevel: 5,
        description: "Увеличава максималния размер на армията в региона с 50 на ниво."
    },
    market: {
        name: "Пазар",
        icon: "🏪",
        effect: { goldBonus: 30 },
        basePrice: 200,
        priceMultiplier: 1.6,
        maxLevel: 5,
        description: "Увеличава годишния приход от региона с 30 злато на ниво."
    },
    temple: {
        name: "Храм",
        icon: "⛪",
        effect: { luckBonus: 5 },
        basePrice: 400,
        priceMultiplier: 1.4,
        maxLevel: 3,
        description: "Дава +5% шанс за критичен удар и избягване на атаки в битки, провеждани в този регион."
    },
    wall: {
        name: "Крепостна стена",
        icon: "🧱",
        effect: { defenseBonus: 2 },
        basePrice: 500,
        priceMultiplier: 1.7,
        maxLevel: 5,
        description: "Увеличава нивото на защита на региона с 2 (трудност при атака)."
    },
    harbor: {
        name: "Пристанище",
        icon: "⚓",
        effect: { tradeIncome: 50 },
        basePrice: 600,
        priceMultiplier: 1.5,
        maxLevel: 3,
        description: "Дава +50 злато на ход от търговия и позволява търговски маршрути с отдалечени региони."
    }
};

function getMainHeroForBuilding() {
    if (window.gameMode === 'solo') return window.currentHero || null;
    if (typeof window.getStrongestHero === 'function') return window.getStrongestHero();
    if (typeof window.getSelectedHero === 'function') return window.getSelectedHero();
    return null;
}

function initRegionBuildings() {
    if (!window.worldData || !window.worldData.regions) return;
    for (let regionName in window.worldData.regions) {
        const region = window.worldData.regions[regionName];
        if (!region.buildings) {
            region.buildings = {
                barracks: 0,
                market: 0,
                temple: 0,
                wall: 0,
                harbor: 0
            };
        }
        if (!region.resources) {
            const resourcesList = ["дърво", "камък", "желязо"];
            region.resources = {
                wood: Math.floor(Math.random() * 100) + 20,
                stone: Math.floor(Math.random() * 80) + 10,
                iron: Math.floor(Math.random() * 50) + 5
            };
        }
    }
}

window.buildInRegion = function(regionName, buildingId, hero) {
    const region = window.worldData?.regions?.[regionName];
    if (!region) return { success: false, msg: "Регионът не съществува." };
    
    // Гарантираме, че region.buildings съществува
    if (!region.buildings) {
        region.buildings = {
            barracks: 0, market: 0, temple: 0, wall: 0, harbor: 0
        };
    }
    
    if (!hero) hero = getMainHeroForBuilding();
    if (!hero) return { success: false, msg: "Няма намерен герой за строителство." };

    const building = window.buildingsDB[buildingId];
    if (!building) return { success: false, msg: "Невалидна сграда." };

    const currentLevel = region.buildings[buildingId] || 0;
    if (currentLevel >= building.maxLevel) {
        return { success: false, msg: `${building.name} е вече на максимално ниво ${building.maxLevel}.` };
    }

    const price = Math.floor(building.basePrice * Math.pow(building.priceMultiplier, currentLevel));
    if (hero.gold < price) {
        return { success: false, msg: `Недостатъчно злато! Нужни: ${price}.` };
    }

    const woodCost = (buildingId === 'barracks' ? 20 : buildingId === 'harbor' ? 30 : 0) * (currentLevel + 1);
    const stoneCost = (buildingId === 'wall' ? 30 : buildingId === 'temple' ? 15 : 0) * (currentLevel + 1);
    const ironCost = (buildingId === 'barracks' ? 10 : 0) * (currentLevel + 1);

    if ((region.resources?.wood || 0) < woodCost || (region.resources?.stone || 0) < stoneCost || (region.resources?.iron || 0) < ironCost) {
        return { success: false, msg: `Недостатъчно ресурси в региона! Нужни: дърво ${woodCost}, камък ${stoneCost}, желязо ${ironCost}.` };
    }

    hero.gold -= price;
    region.resources.wood -= woodCost;
    region.resources.stone -= stoneCost;
    region.resources.iron -= ironCost;
    region.buildings[buildingId] = currentLevel + 1;

    if (building.effect.armyBonus) {
        region.armySize = (region.baseArmySize || 200) + (region.buildings.barracks * 50);
    }
    if (building.effect.defenseBonus) {
        region.defenseLevel = (region.baseDefenseLevel || 1) + (region.buildings.wall * 2);
    }
    if (building.effect.goldBonus) {
        region.goldBonus = (region.goldBonus || 0) + 30;
    }

    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.refreshMap) window.refreshMap();
    if (window.addWorldEvent) {
        window.addWorldEvent(`🏗️ СТРОИТЕЛСТВО`, `${hero.name} построи ниво ${region.buildings[buildingId]} на ${building.name} в ${regionName}.`, "🏗️");
    }
    if (window.addHeroLog) window.addHeroLog(hero, "🏗️", `Построи ${building.name} ниво ${region.buildings[buildingId]} в ${regionName}`);
    
    return { success: true, msg: `Успешно построихте ниво ${region.buildings[buildingId]} на ${building.name} в ${regionName}!` };
};

// Пачваме inspectRegion, за да показва бутони за строителство
const originalInspectRegion = window.inspectRegion;
if (originalInspectRegion) {
    window.inspectRegion = function(regionName) {
        originalInspectRegion(regionName);
        setTimeout(() => {
            const modal = document.getElementById('region-inspect-overlay');
            if (!modal) return;
            const actionDiv = modal.querySelector('#action-div');
            if (!actionDiv) return;
            if (document.getElementById('buildings-container')) return;

            const region = window.worldData?.regions[regionName];
            if (!region) return;
            
            // Инициализираме сградите, ако липсват
            if (!region.buildings) {
                region.buildings = { barracks: 0, market: 0, temple: 0, wall: 0, harbor: 0 };
            }
            
            const hero = getMainHeroForBuilding();
            if (!hero) return;

            const buildingsContainer = document.createElement('div');
            buildingsContainer.id = 'buildings-container';
            buildingsContainer.style.cssText = 'margin-top: 15px; border-top: 1px solid #d4af37; padding-top: 10px;';
            buildingsContainer.innerHTML = '<h4 style="color:#ffdd99;">🏰 Сгради в региона</h4>';

            for (let [bid, bdata] of Object.entries(window.buildingsDB)) {
                const level = region.buildings[bid] || 0;
                const price = Math.floor(bdata.basePrice * Math.pow(bdata.priceMultiplier, level));
                const canBuild = (level < bdata.maxLevel) && (hero.gold >= price);
                const woodCost = (bid === 'barracks' ? 20 : bid === 'harbor' ? 30 : 0) * (level + 1);
                const stoneCost = (bid === 'wall' ? 30 : bid === 'temple' ? 15 : 0) * (level + 1);
                const ironCost = (bid === 'barracks' ? 10 : 0) * (level + 1);
                const resourcesOk = (region.resources?.wood || 0) >= woodCost && (region.resources?.stone || 0) >= stoneCost && (region.resources?.iron || 0) >= ironCost;
                const btn = document.createElement('button');
                btn.style.cssText = 'display: block; width: 100%; margin-bottom: 8px; padding: 6px; border-radius: 20px; background: #2c1a0c; border: 1px solid #d4af37; color: #ffdd99; cursor: pointer;';
                btn.innerHTML = `${bdata.icon} ${bdata.name} Ниво ${level}/${bdata.maxLevel} (💰${price})`;
                if (canBuild && resourcesOk) {
                    btn.onclick = async () => {
                        const result = await window.buildInRegion(regionName, bid, hero);
                        if (result.success) {
                            if (window.showAdvisorPopup) window.showAdvisorPopup("УСПЕХ", result.msg, "success");
                            modal.remove();
                        } else {
                            if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", result.msg, "error");
                        }
                    };
                } else {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.title = `Недостатъчно ресурси или злато`;
                }
                buildingsContainer.appendChild(btn);
            }
            actionDiv.appendChild(buildingsContainer);
        }, 100);
    };
}

// Инициализация при старт
if (typeof window.startFreshGameLogic === 'function') {
    const originalStart = window.startFreshGameLogic;
    window.startFreshGameLogic = function() {
        originalStart();
        initRegionBuildings();
    };
}
if (typeof window.loadGreatBulgariaGame === 'function') {
    const originalLoad = window.loadGreatBulgariaGame;
    window.loadGreatBulgariaGame = function() {
        const result = originalLoad();
        initRegionBuildings();
        return result;
    };
}

console.log("✅ regionBuilding.js зареден – строителство в регионите (с проверка за съществуване на buildings)");
