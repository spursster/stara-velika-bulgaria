/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * СТАТУС: ФИНАЛНА КОРЕКЦИЯ (Старт: 480 пр.н.е.)
 */

window.initNewGame = function() {
    // 1. Владетел
    window.currentHero = {
        name: "Кубрат", // Можеш да го промениш на подходящ за 480 пр.н.е. по-късно
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150,
        age: 60,
        techLevel: 1
    };

    // 2. ВРЕМЕ - ЗАПОЧВАМЕ ОТ 480 пр.н.е.
    window.gameTime = { 
        year: -480, // Отрицателно число за пр.н.е.
        seasonIndex: 0, 
        seasons: ["Пролет", "Лято", "Есен", "Зима"],
        era: "АНТИЧНОСТ",
        turn: 1 
    };
    
    window.playerRegions = ["Крим"];
    
    // Инициализация на 13-те рода
    window.activeDynasties = {};
    if (window.bulgarianDynasties) {
        Object.keys(window.bulgarianDynasties).forEach(name => {
            window.activeDynasties[name] = { power: 100, gold: 500, regionsOwned: 1 };
        });
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

/**
 * ЛОГИКА ЗА ВРЕМЕТО (Ход = 3 месеца)
 */
window.processTime = function() {
    if (!window.gameTime) return;

    window.gameTime.seasonIndex++;
    
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        window.gameTime.year++; // Годината расте (от -480 към -479 и т.н.)
        
        if (window.currentHero) window.currentHero.age++;
    }

    // ЛОГИКА ЗА ЕПОХИТЕ
    let currentYear = window.gameTime.year;
    if (currentYear > 2100) {
        window.gameTime.era = "КОСМИЧЕСКА ЕРА";
    } else if (currentYear > 1900) {
        window.gameTime.era = "ИНДУСТРИАЛНА ЕРА";
    } else if (currentYear > 600) {
        window.gameTime.era = "СРЕДНОВЕКОВИЕ";
    } else {
        window.gameTime.era = "АНТИЧНОСТ";
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    window.processTime();
    window.gameTime.turn++;

    // Приход
    let seasonalBonus = (window.gameTime.seasonIndex === 2) ? 200 : 100;
    window.currentHero.gold += (window.playerRegions.length * seasonalBonus);

    // Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

window.onload = () => window.initNewGame();
