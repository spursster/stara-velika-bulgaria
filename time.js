window.currentGameYear = -480;
window.timeSpeed = 1;

function advanceYear(hero) {
    // 1. Проверка дали владетелят е жив преди ход
    if (!hero || !hero.isAlive) {
        console.log("Владетелят не е в състояние да управлява.");
        return;
    }

    // 2. Увеличаване на годината
    window.currentGameYear += window.timeSpeed;
    
    // 3. Икономика: Автоматично събиране на данъци и поддръжка
    if (typeof window.calculateYearlyIncome === 'function') {
        window.calculateYearlyIncome(hero);
        window.updateGoldDisplay();
    }

    // 4. Стареене: Увеличаване на възрастта и проверка за наследство
    if (typeof window.handleAging === 'function') {
        window.handleAging(hero);
    }

    // 5. Случайни събития: Шанс за събитие при всеки нов ход
    if (typeof window.triggerRandomEvent === 'function') {
        window.triggerRandomEvent(hero);
    }

    // 6. Визуално обновяване на датата
    const dateDisplay = document.getElementById('game-date');
    if (dateDisplay) {
        let y = window.currentGameYear;
        // Използваме "пр.н.е." и "н.е." за коректно летоброене
        dateDisplay.innerText = `Година: ${y < 0 ? Math.abs(y) + ' пр.н.е.' : y + ' н.е.'}`;
    }

    // 7. Обновяване на целия интерфейс, за да се отразят промените веднага
    if (typeof window.updateCharacterUI === 'function') {
        window.updateCharacterUI(hero);
    }
}

// Глобално излагане на функцията
window.advanceYear = advanceYear;
