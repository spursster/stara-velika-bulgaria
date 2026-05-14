/**
 * МОДУЛ: КНИГА НА ПРЕДЛОЖЕНИЯТА (Marquee)
 * Пази последните 15 съобщения и ги върти в лентата.
 */

// 1. Начален списък със съобщения (Книга на мъдростта)
window.suggestionBook = [
    "Кан Кубрат: Когато сте заедно, сте непобедими като снопа пръчки!",
    "Старейшина: Внимавай с хазарите на изток, Кане.",
    "Предложение: Да се построят нови конюшни в Крим.",
    "Хроника: Годината е благодатна, реколтата ще е богата.",
    "Съвет: Дипломацията често е по-силна от меча."
];

/**
 * Функция за добавяне на ново предложение
 */
window.addPlayerSuggestion = function(text) {
    window.suggestionBook.unshift(text); // Добавя най-отгоре

    if (window.suggestionBook.length > 15) {
        window.suggestionBook.pop(); // Пази само последните 15
    }

    window.updateMarquee(); // Обновява визуално лентата
};

/**
 * ФУНКЦИЯТА, КОЯТО ЛИПСВАШЕ: Обновява текста в HTML
 */
window.updateMarquee = function() {
    const marqueeContainer = document.getElementById('marquee-text');
    if (marqueeContainer) {
        // Обединяваме всички съобщения с разделител " *** "
        const fullText = window.suggestionBook.join(" &nbsp;&nbsp;&nbsp; *** &nbsp;&nbsp;&nbsp; ");
        marqueeContainer.innerHTML = fullText;
    }
};

// Инициализация при зареждане
window.updateMarquee();
