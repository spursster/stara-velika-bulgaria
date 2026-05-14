/**
 * МОДУЛ: ИКОНОМИКА - Велика България (Синхронизиран с 50 региона)
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    let baseIncome = 150; // Базов данък от столицата Фанагория
    let totalRegionIncome = 0;

    // 1. Изчисляване на доход от всички завладени региони
    // КОРИГИРАНО: Вече използваме правилното име window.worldData.regions
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        window.playerRegions.forEach(regionName => {
            const regionData = window.worldData.regions[regionName];
            
            if (regionData) {
                // Всеки регион носи базов доход от 50 злато
                let regionBonus = 50;
                
                // Специални бонуси според ресурсите в world_data.js
                if (regionData.resource === "Злато" || regionData.resource === "Търговия") {
                    regionBonus += 100; // Богатите региони носят много повече
                } else if (regionData.resource === "Сребро" || regionData.resource === "Вино") {
                    regionBonus += 50;
                }
                
                totalRegionIncome += regionBonus;
            }
        });
    }

    let totalIncome = baseIncome + totalRegionIncome;

    // 2. Прилагане на родови бонуси (ако има дефинирани в mechanics.js)
    if (window.dynastyPerks) {
        const perk = window.dynastyPerks[window.currentHero.dynasty];
        if (perk && perk.goldMult) {
            totalIncome = Math.floor(totalIncome * perk.goldMult);
        }
    }

    // 3. Разходи за армията (баланс)
    let armyMaintenance = Math.floor(window.currentHero.armySize * 0.1);
    let finalProfit = totalIncome - armyMaintenance;

    // 4. Актуализация на хазната
    window.currentHero.gold += finalProfit;

    // 5. Извеждане на съобщение за резултата от хода
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`Сезонен отчет: Приход +${totalIncome} 💰 | Издръжка на войската -${armyMaintenance} 💰 | Чиста печалба: ${finalProfit} 💰`);
    }

    // 6. Обновяване на интерфейса
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};
