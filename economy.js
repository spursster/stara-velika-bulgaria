/**
 * МОДУЛ: ИКОНОМИКА - Велика България (Синхронизиран)
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    let baseIncome = 100; // Базов данък от столицата
    let totalRegionIncome = 0;

    // 1. Изчисляване на доход според специфичните региони (синхронизация с regions.js)
    if (window.playerRegions && window.worldRegions) {
        window.playerRegions.forEach(regionName => {
            const regionData = window.worldRegions[regionName];
            if (regionData && regionData.income) {
                totalRegionIncome += regionData.income;
            } else {
                totalRegionIncome += 50; // Резервен вариант за нови земи
            }
        });
    }

    let totalIncome = baseIncome + totalRegionIncome;

    // 2. Прилагане на родови бонуси (синхронизация с mechanics.js)
    if (window.dynastyPerks) {
        const perk = window.dynastyPerks[window.currentHero.dynasty];
        if (perk && perk.gold) {
            totalIncome = Math.floor(totalIncome * perk.gold);
        }
    }

    // 3. Добавяне на златото към хазната
    window.currentHero.gold += totalIncome;

    // 4. Логване на събитието
    if (window.logEvent) {
        const details = `(+${baseIncome} база, +${totalRegionIncome} от земи)`;
        window.logEvent(`Сезонен доход: +${totalIncome} злато. ${details}`, "action");
    }

    // 5. Обновяване на UI, за да се види новото злато веднага
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};
