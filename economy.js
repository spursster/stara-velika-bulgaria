/**
 * МОДУЛ: ИКОНОМИКА - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода & 51 региона)
 * Включва сложна система за ресурси и родови бонуси.
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    let baseIncome = 200; // По-висок базов приход за по-голямата карта
    let totalRegionIncome = 0;

    // 1. ИЗЧИСЛЯВАНЕ НА ДОХОД ОТ РЕГИОНИТЕ
    if (window.playerRegions && window.worldData && window.worldData.regions) {
        window.playerRegions.forEach(regionName => {
            const regionData = window.worldData.regions[regionName];
            
            if (regionData) {
                let regionBase = 60; // Базов приход на регион
                let resourceBonus = 0;

                // СИНХРОНИЗАЦИЯ С РЕСУРСИТЕ ОТ 51-ТЕ РЕГИОНА
                switch (regionData.resource) {
                    case "Злато": resourceBonus = 150; break;
                    case "Сребро": resourceBonus = 100; break;
                    case "Мед": case "Желязо": case "Стомана": resourceBonus = 60; break;
                    case "Коприна": case "Кехлибар": case "Пурпур": resourceBonus = 120; break;
                    case "Търговия": case "Пристанище": resourceBonus = 90; break;
                    case "Коне": case "Добитък": resourceBonus = 50; break;
                    case "Вино": case "Зехтин": case "Маслини": resourceBonus = 70; break;
                    case "Сол": case "Жито": resourceBonus = 40; break;
                    default: resourceBonus = 30;
                }
                
                totalRegionIncome += (regionBase + resourceBonus);
            }
        });
    }

    let totalIncome = baseIncome + totalRegionIncome;

    // 2. ПРИЛАГАНЕ НА РОДОВИ БОНУСИ (от mechanics.js)
    if (window.getPerkValue) {
        // Бонус за общо злато (Уния Траки, Смилец, и др.)
        totalIncome = Math.floor(totalIncome * window.getPerkValue('gold'));
        
        // Специален търговски бонус (Бесараб, Ерми)
        if (window.currentHero.dynasty === "Бесараб" || window.currentHero.dynasty === "Ерми") {
            totalIncome = Math.floor(totalIncome * 1.15); // Допълнителни 15% за търговски родове
        }
    }

    // 3. РАЗХОДИ ЗА ИЗДРЪЖКА (Армия и Двор)
    // Разходът за армия се влияе от бонуса на рода (напр. Даки)
    let armyMaintenanceBase = window.currentHero.armySize * 0.15;
    if (window.getPerkValue) {
        armyMaintenanceBase = armyMaintenanceBase * window.getPerkValue('armyCost');
    }
    
    let armyMaintenance = Math.floor(armyMaintenanceBase);
    let finalProfit = Math.floor(totalIncome - armyMaintenance);

    // 4. АКТУАЛИЗАЦИЯ НА ХАЗНАТА
    window.currentHero.gold += finalProfit;

    // 5. ЛЕТОПИС (Вест за финансите)
    if (window.showAdvisorMsg && window.gameTime && window.gameTime.seasonIndex === 0) { 
        // Показваме отчет само през пролетта, за да не спамим всяко тримесечие
        window.showAdvisorMsg(`Годишен икономически отчет: Приход +${totalIncome} 💰 | Издръжка -${armyMaintenance} 🪙`);
    }
    
    return { income: totalIncome, expense: armyMaintenance, profit: finalProfit };
};
