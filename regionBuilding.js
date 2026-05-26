// ==================== СТРОИТЕЛСТВО В РЕГИОНИТЕ ====================
// Версия 1.0

// База данни за сгради
window.buildingsDB = {
    barracks: {
        name: "Казарма",
        icon: "🏛️",
        effect: { armyBonus: 50 },   // увеличава максималната армия в региона
        basePrice: 300,
        priceMultiplier: 1.5,
        maxLevel: 5,
        description: "Увеличава максималния размер на армията в региона с 50 на ниво."
    },
    market: {
        name: "Пазар",
        icon: "🏪",
        effect: { goldBonus: 30 },    // увеличава златния доход на региона
        basePrice: 200,
        priceMultiplier: 1.6,
        maxLevel: 5,
        description: "Увеличава годишния приход от региона с 30 злато на ниво."
    },
    temple: {
        name: "Храм",
        icon: "⛪",
        effect: { luckBonus: 5 },     // +5% късмет в битка (критичен удар/избягване)
        basePrice: 400,
        priceMultiplier: 1.4,
        maxLevel: 3,
        description: "Дава +5% шанс за критичен удар и избягване на атаки в битки, провеждани в този регион."
    },
    wall: {
        name: "Крепостна стена",
        icon: "🧱",
        effect: { defenseBonus: 2 },  // +2 ниво на защита на региона
        basePrice: 500,
        priceMultiplier: 1.7,
        maxLevel: 5,
        description: "Увеличава нивото на защита на региона с 2 (трудност при атака)."
    },
    harbor: {
        name: "Пристанище",
        icon: "⚓",
        effect: { tradeIncome: 50 },  // допълнителен доход от търговия
        basePrice: 600,
        priceMultiplier: 1.5,
        maxLevel: 3,
        description: "Дава +50 злато на ход от търговия и позволява търговски маршрути с отдалечени региони."
    }
};

// Инициализация на сградите за региони (ако липсват)
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
            // Добавяме ресурси за региона (процедурно)
            const resourcesList = ["дърво", "камък", "желязо"];
            region.resources = {
                wood: Math.floor(Math.random() * 100) + 20,
                stone: Math.floor(Math.random() * 80) + 10,
                iron: Math.floor(Math.random() * 50) + 5
            };
        }
    }
}

// Функция за строителство/надграждане
window.buildInRegion = function(regionName, buildingId, hero) {
    const region = window.worldData?.regions?.[regionName];
    if (!region) return { success: false, msg: "Регионът не съществува." };
    if (!hero) hero = window.currentHero;
    if (!hero) return { success: false, msg: "Няма активен герой." };

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

    // Проверка за ресурси (ако са въведени)
    const woodCost = (buildingId === 'barracks' ? 20 : buildingId === 'harbor' ? 30 : 0) * (currentLevel + 1);
    const stoneCost = (buildingId === 'wall' ? 30 : buildingId === 'temple' ? 15 : 0) * (currentLevel + 1);
    const ironCost = (buildingId === 'barracks' ? 10 : 0) * (currentLevel + 1);

    if (region.resources.wood < woodCost || region.resources.stone < stoneCost || region.resources.iron < ironCost) {
        return { success: false, msg: `Недостатъчно ресурси в региона! Нужни: дърво ${woodCost}, камък ${stoneCost}, желязо ${ironCost}.` };
    }

    // Плащане
    hero.gold -= price;
    region.resources.wood -= woodCost;
    region.resources.stone -= stoneCost;
    region.resources.iron -= ironCost;
    region.buildings[buildingId] = currentLevel + 1;

    // Прилагане на ефектите върху региона
    if (building.effect.armyBonus) {
        region.armySize = (region.baseArmySize || 200) + (region.buildings.barracks * 50);
    }
    if (building.effect.defenseBonus) {
        region.defenseLevel = (region.baseDefenseLevel || 1) + (region.buildings.wall * 2);
    }
    if (building.effect.goldBonus) {
        region.goldBonus = (region.goldBonus || 0) + 30; // за опростяване, но може да се изчислява динамично
    }
    // Други ефекти се отчитат в recalculateIncome или battle.js

    // Актуализиране на UI
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.refreshMap) window.refreshMap(); // ако картата е отворена, да се обнови
    if (window.addWorldEvent) {
        window.addWorldEvent(`🏗️ СТРОИТЕЛСТВО`, `${hero.name} построи ниво ${region.buildings[buildingId]} на ${building.name} в ${regionName}.`, "🏗️");
    }
    return { success: true, msg: `Успешно построихте ниво ${region.buildings[buildingId]} на ${building.name} в ${regionName}!` };
        if (window.addHeroLog) window.addHeroLog(hero, "🏗️", `Построи ${building.name} ниво ${region.buildings[buildingId]} в ${regionName}`);
};

// Показване на бутони за строителство в инспекцията на региона
// За да не променяме съществуващата функция inspectRegion твърде много, ще я презапишем (или ще добавим hook)
const originalInspectRegion = window.inspectRegion;
window.inspectRegion = function(regionName) {
    // Извикваме оригиналната инспекция
    if (originalInspectRegion) originalInspectRegion(regionName);
    // След това добавяме бутони за строителство в модала
    setTimeout(() => {
        const modal = document.getElementById('region-inspect-overlay');
        if (!modal) return;
        const actionDiv = modal.querySelector('#action-div');
        if (!actionDiv) return;

        // Предотвратяваме дублиране
        if (document.getElementById('buildings-container')) return;

        const region = window.worldData?.regions[regionName];
        if (!region) return;

        const hero = window.currentHero;
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
            const resourcesOk = (region.resources.wood >= woodCost && region.resources.stone >= stoneCost && region.resources.iron >= ironCost);
            const btn = document.createElement('button');
            btn.style.cssText = 'display: block; width: 100%; margin-bottom: 8px; padding: 6px; border-radius: 20px; background: #2c1a0c; border: 1px solid #d4af37; color: #ffdd99; cursor: pointer;';
            btn.innerHTML = `${bdata.icon} ${bdata.name} Ниво ${level}/${bdata.maxLevel} (💰${price})`;
            if (canBuild && resourcesOk) {
                btn.onclick = async () => {
                    const result = await window.buildInRegion(regionName, bid, hero);
                    if (result.success) {
                        if (window.showAdvisorPopup) window.showAdvisorPopup("УСПЕХ", result.msg, "success");
                        modal.remove(); // затваряме инспекцията, за да се обнови при следващо отваряне
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

// Добавяме инициализация при стартиране на играта
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

console.log("✅ regionBuilding.js зареден – строителство в регионите");
