window.currentGameYear = -480;
window.timeSpeed = 1;

function advanceYear(hero) {
    // 1. Проверка дали владетелят е жив преди ход
    if (!hero || !hero.isAlive) {
        return;
    }

    // 2. Увеличаване на годината
    window.currentGameYear += window.timeSpeed;
    
    // 3. Икономика: Автоматично събиране на данъци и поддръжка
    if (typeof window.calculateYearlyIncome === 'function') {
        window.calculateYearlyIncome(hero);
    }

    // 4. Стареене: Увеличаване на възрастта и проверка за наследство
    if (typeof window.handleAging === 'function') {
        window.handleAging(hero);
    }

    // 5. Случайни събития: Шанс за събитие при всеки нов ход
    if (typeof window.triggerRandomEvent === 'function') {
        window.triggerRandomEvent(hero);
    }

    // 6. Визуално обновяване на датата с превод
    const dateDisplay = document.getElementById('game-date');
    if (dateDisplay) {
        const lang = window.gameLang || 'bg';
        let y = window.currentGameYear;
        let yearText = "";
        
        // Локализация на летоброенето
        const suffix = {
            bg: y < 0 ? " пр.н.е." : " н.е.",
            en: y < 0 ? " BC" : " AD",
            ru: y < 0 ? " до н.э." : " н.э."
        };
        
        const label = {
            bg: "Година: ",
            en: "Year: ",
            ru: "Год: "
        };

        dateDisplay.innerText = `${label[lang]}${Math.abs(y)}${suffix[lang]}`;
    }

    // 7. Обновяване на целия интерфейс
    if (typeof window.updateCharacterUI === 'function') {
        window.updateCharacterUI(hero);
    }
}

window.advanceYear = advanceYear;
