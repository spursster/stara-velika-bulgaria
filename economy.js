/**
 * МОДУЛ: ИКОНОМИКА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН И ОПТИМИЗИРАН (Връзка с Артефакти, Сезони и Родове)
 * Статистика на файловете в проекта: 16
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    let baseIncome = 200; // По-висок базов приход за по-голямата карта
    let totalRegionIncome = 0;

    // 1. ИЗЧИСЛЯВАНЕ НА ДОХОД ОТ РЕГИОНИТЕ И СЕЗОННИТЕ ПРОМЕНИ
    // Вземаме сезонния бонус директно от времето в играта (logic.js)
    let seasonalBonus = 200;
    if (window.gameTime) {
        if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; // Лято
        if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; // Зима
    }

    if (window.playerRegions && window.worldData && window.worldData.regions) {
        window.playerRegions.forEach(regionName => {
            const regionData = window.worldData.regions[regionName];
            
            if (regionData) {
                // Използваме динамичния сезонен бонус като базов за всеки регион
                let regionBase = seasonalBonus > 0 ? Math.floor(seasonalBonus * 0.3) : 60; 
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

    // Базов общ приход + доходите от притежаваните територии
    let totalIncome = baseIncome + totalRegionIncome;

    // 2. ПРИЛАГАНЕ НА МОДИФИКАТОРИ ОТ ЕКИПИРАНИ ПРЕДМЕТИ (АРТЕФАКТИ)
    // Синхронизирано с откритите реликви от Експедициите
    let goldArtifactModifier = 0;
    if (window.equippedItems) {
        window.equippedItems.forEach(item => {
            if (item && item.bonus && item.bonus.goldBonus) {
                goldArtifactModifier += item.bonus.goldBonus;
            }
        });
    }
    if (goldArtifactModifier > 0) {
        totalIncome += Math.floor(totalIncome * (goldArtifactModifier / 100));
    }

    // 3. ПРИЛАГАНЕ НА РОДОВИ БОНУСИ (от mechanics.js)
    if (window.getPerkValue) {
        // Бонус за общо злато (Уния Траки, Смилец и др.)
        totalIncome = Math.floor(totalIncome * window.getPerkValue('gold'));
        
        // Специален търговски бонус (Бесараб)
        if (window.currentHero.dynasty === "Бесараб" || window.currentHero.dynasty === "Ерми") {
            totalIncome = Math.floor(totalIncome * 1.15); // Допълнителни 15% за търговски родове
        }
    }

    // 4. РАЗХОДИ ЗА ИЗДРЪЖКА (Армия и Двор)
    // Разходът за армия се влияе от бонуса на рода (напр. Даки)
    let armyMaintenanceBase = window.currentHero.armySize * 0.15;
    if (window.getPerkValue) {
        armyMaintenanceBase = armyMaintenanceBase * window.getPerkValue('armyCost');
    }
    
    let armyMaintenance = Math.floor(armyMaintenanceBase);
    let finalProfit = Math.floor(totalIncome - armyMaintenance);

    // 5. АКТУАЛИЗАЦИЯ НА ХАЗНАТА НА КАНА
    window.currentHero.gold += finalProfit;
    if (window.currentHero.gold < 0) window.currentHero.gold = 0; // Защита против фалит

    // 6. ЛЕТОПИС (Вест за финансите)
    if (window.showAdvisorMsg && window.gameTime && window.gameTime.seasonIndex === 0) { 
        // Показваме отчет само през пролетта, за да не спамим интерфейса на всеки ход
        window.showAdvisorMsg(`💰 Годишен отчет: Приход +${totalIncome} | Издръжка на войската -${armyMaintenance} 🪙`);
    }
    
    return { income: totalIncome, expense: armyMaintenance, profit: finalProfit };
};
