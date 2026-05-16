/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ОБНОВЕН СЪС СЛУЧАЕН ВЪРХОВЕН ЛИДЕР И СИНХРОНИЗАЦИЯ НА ХОДОВЕТЕ
 * При всяко стартиране Върховният владетел се избира напълно случайно от database.js!
 * Статистика на файловете в проекта: 16
 */

window.initNewGame = function() {
    // 1. АЛГОРИТЪМ ЗА ИЗБОР НА СЛУЧАЕН ВЪРХОВЕН ВЛАДЕТЕЛ (От твоя окончателен списък)
    let selectedName = "Кубрат"; // Fallback по подразбиране при грешка в базата данни
    let selectedDynasty = "Дуло"; // Fallback по подразбиране при грешка в базата данни

    if (window.bulgarianDynasties) {
        const dynastiesKeys = Object.keys(window.bulgarianDynasties);
        if (dynastiesKeys.length > 0) {
            // Избираме случайна династия от 13-те налични
            selectedDynasty = dynastiesKeys[Math.floor(Math.random() * dynastiesKeys.length)];
            const rulersList = window.bulgarianDynasties[selectedDynasty].rulers;
            
            if (rulersList && rulersList.length > 0) {
                // Избираме случаен владетел от тази династия
                selectedName = rulersList[Math.floor(Math.random() * rulersList.length)];
            }
        }
    }

    // 2. ИНИЦИАЛИЗАЦИЯ НА ВЪРХОВНИЯ ЛИДЕР С РАВНОПРАВНИ СТАТИСТИКИ
    window.currentHero = {
        name: selectedName, 
        dynasty: selectedDynasty,
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 50, // Унифицирана базова стойност за старт
        techLevel: 1
    };

    // 3. ИНИЦИАЛИЗАЦИЯ НА ВРЕМЕТО (Фиксиран ред 41)
    window.gameTime = { 
        year: 1, 
        seasonIndex: 0, 
        era: "от н.е.",
        turn: 1 
    };
    
    window.playerRegions = [["Крим"]];
    
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    // Инициализираме RPG статуса на главния герой веднага при старт
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(window.currentHero);
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
    
    console.log(`👑 Играта започна с Върховен Лидер: ${window.currentHero.name} от род ${window.currentHero.dynasty}!`);
};

/**
 * ПРЕХВЪРЛЯНЕ НА ХОД (Клик на бутона "Следващ ход")
 */
window.nextTurn = function() {
    // 1. НАПРЕДЪК НА ВРЕМЕТО
    window.gameTime.turn += 1;
    window.gameTime.seasonIndex += 1;
    
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year += 1;
    }

    // Автономно извикване на механиките за родови промени и проверка за трона
    if (window.processTime) {
        window.processTime();
    }

    // 2. ИКОНОМИКА: ПРИХОДИ НА ИГРАЧА
    let seasonalBonus = 200;
    if (window.gameTime.seasonIndex === 1) seasonalBonus = 350; // Лято
    if (window.gameTime.seasonIndex === 3) seasonalBonus = 100; // Зима

    let goldArtifactModifier = 0;
    if (window.equippedItems) {
        window.equippedItems.forEach(item => {
            if (item && item.bonus && item.bonus.goldBonus) {
                goldArtifactModifier += item.bonus.goldBonus;
            }
        });
    }
    
    let baseIncome = window.playerRegions.length * seasonalBonus;
    let artifactExtraGold = Math.floor(baseIncome * (goldArtifactModifier / 100));
    window.currentHero.gold += (baseIncome + artifactExtraGold);

    // 3. Логика за останалите родове
    Object.keys(window.activeDynasties).forEach(dyn => {
        if (dyn !== window.currentHero.dynasty) {
            window.activeDynasties[dyn].gold += 50;
            if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
        }
    });

    // 4. АКТИВИРАНЕ НА СЛУЧАЙНИ СЪБИТИЯ (Стандартно автоматично извикване на нов ход)
    if (window.triggerRandomEvent) window.triggerRandomEvent();

    // 5. НАПРЕДЪК НА АКТИВНИТЕ ЕКСПЕДИЦИИ
    if (window.updateExpeditionSystem) {
        window.updateExpeditionSystem();
    }

    // 6. ОПРЕСНЯВАНЕ НА ИНТЕРФЕЙСА (Задължително опресняване на героя и времето)
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateTimeUI) window.updateTimeUI();
};

// 🎯 ЗАЩИТЕН МОСТ: Свързваме бутона от HTML страницата без значение кое от двете имена вика
window.advanceTurn = window.nextTurn;

// Автоматично стартиране на играта веднага след като браузърът зареди изцяло страницата
window.addEventListener('DOMContentLoaded', () => {
    window.initNewGame();
});
