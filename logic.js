/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: КОРИГИРАН И НАДГРАДЕН (Сезони, Стареене, Еволюция)
 * Този файл управлява времето, икономиката и конкуренцията между 13-те династии.
 */

window.initNewGame = function() {
    // 1. Инициализация на състоянието на играча (Кан)
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60,
        techLevel: 1
    };

    // 2. ФУНКЦИЯ ВРЕМЕ (1 ход = 3 месеца / 1 сезон)
    window.gameTime = { 
        year: 632, 
        seasonIndex: 0, // 0: Пролет, 1: Лято, 2: Есен, 3: Зима
        seasons: ["Пролет", "Лято", "Есен", "Зима"],
        era: "АНТИЧНОСТ",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // 3. Инициализация на 13-те конкурентни династии от database.js
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { 
                power: 100, 
                gold: 500, 
                regionsOwned: 1 
            };
        });
    }

    console.log("Играта започна: " + window.gameTime.seasons[window.gameTime.seasonIndex] + ", " + window.gameTime.year + "г.");
    
    // Първоначално опресняване на интерфейса
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};

/**
 * ЛОГИКА ЗА НАПРЕДЪК НА ВРЕМЕТО (Извиква се на всеки ход)
 */
window.processTime = function() {
    if (!window.gameTime) return;

    // 1. Напредък на сезона
    window.gameTime.seasonIndex++;
    
    // 2. Проверка за нова година (след 4 сезона)
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year++;
        
        // Канът остарява с 1 година
        if (window.currentHero) {
            window.currentHero.age++;
        }
    }

    // 3. Еволюция на епохите спрямо годината
    if (window.gameTime.year > 2100) {
        window.gameTime.era = "КОСМИЧЕСКА ЕРА";
    } else if (window.gameTime.year > 1900) {
        window.gameTime.era = "ИНДУСТРИАЛНА ЕРА";
    } else if (window.gameTime.year > 1000) {
        window.gameTime.era = "СРЕДНОВЕКОВИЕ";
    } else {
        window.gameTime.era = "АНТИЧНОСТ";
    }
};

/**
 * ГЛАВЕН ЦИКЪЛ НА ХОДА (Изпълнява се при натискане на бутон "Следващ ход")
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Обработка на времето и епохите
    window.processTime();
    window.gameTime.turn++;

    // 2. Икономика (Сезонен приход)
    // Есента (index 2) носи бонус приход от реколта
    let seasonalIncome = (window.gameTime.seasonIndex === 2) ? 200 : 100;
    window.currentHero.gold += (window.playerRegions.length * seasonalIncome);

    // 3. AI Конкуренция (Останалите 12 рода действат)
    if (window.activeDynasties) {
        Object.keys(window.activeDynasties).forEach(dyn => {
            if (dyn !== window.currentHero.dynasty) {
                window.activeDynasties[dyn].gold += 50;
                // Малък шанс за завземане на нов регион от AI
                if (Math.random() > 0.9) {
                    window.activeDynasties[dyn].regionsOwned = (window.activeDynasties[dyn].regionsOwned || 1) + 1;
                }
            }
        });
    }

    // 4. Опресняване на интерфейса (UI)
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
    
    // Ако има специфични функции за лентата с действия
    if (window.updateActionBarUI) {
        window.updateActionBarUI();
    }
};

// Стартиране на играта при зареждане на прозореца
window.onload = function() {
    window.initNewGame();
};
