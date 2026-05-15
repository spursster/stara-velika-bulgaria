/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: СИНХРОНИЗИРАН (Сезони, Стареене, Еволюция)
 */

window.initNewGame = function() {
    // 1. Инициализация на Глобалното състояние (Heroes 3 + CK)
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60,
        techLevel: 1
    };

    // 2. ФУНКЦИЯ ВРЕМЕ (4 сезона = 1 година)
    window.gameTime = { 
        year: 632, 
        seasonIndex: 0, // 0: Пролет, 1: Лято, 2: Есен, 3: Зима
        seasons: ["Пролет", "Лято", "Есен", "Зима"],
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // Инициализация на конкурентните 13 династии
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regions: 1 };
        });
    }

    console.log("Играта започна: " + window.gameTime.seasons[window.gameTime.seasonIndex] + ", " + window.gameTime.year + "г.");
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

/**
 * ЛОГИКА ЗА НАПРЕДЪК НА ВРЕМЕТО (3 месеца на ход)
 */
window.processTime = function() {
    window.gameTime.seasonIndex++;
    
    // Ако минат 4 сезона (1 година)
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year++;
        window.currentHero.age++; // Канът остарява с 1 година
        
        // Остаряване на конкурентните лидери
        if (window.mightyLeaders) {
            window.mightyLeaders.forEach(l => l.age++);
        }
    }

    // Проверка за технологична еволюция (от античност към бъдеще)
    if (window.gameTime.year > 2100) window.gameTime.era = "Космическа Ера";
};

/**
 * ГЛАВЕН ЦИКЪЛ НА ХОДА
 */
window.advanceTurn = function() {
    // 1. Време и Сезони
    window.processTime();
    window.gameTime.turn++;

    // 2. Икономика (Сезонен приход)
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100; // Повече злато през есента
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    // 3. AI Конкуренция (Останалите 12 рода)
    Object.keys(window.activeDynasties).forEach(dyn => {
        if (dyn !== window.currentHero.dynasty) {
            window.activeDynasties[dyn].gold += 50;
            if (Math.random() > 0.9) window.activeDynasties[dyn].regions += 1;
        }
    });

    // 4. UI Опресняване (Използваме обновения UI.js)
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateActionBarUI) window.updateActionBarUI();
};

window.onload = () => window.initNewGame();
