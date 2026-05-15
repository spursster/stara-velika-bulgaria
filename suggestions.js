/**
 * МОДУЛ: КНИГА НА ПРЕДЛОЖЕНИЯТА (Marquee)
 * СТАТУС: СИНХРОНИЗИРАН С 13-ТЕ ДИНАСТИИ
 * Пази последните 15 съобщения и ги върти в лентата.
 */

// 1. Начален списък със съобщения (Книга на мъдростта), адаптиран за новите династии
window.suggestionBook = [
    "Кан Кубрат: Когато сте заедно, сте непобедими като снопа пръчки!",
    "Скитски конник: Степите са наш дом, а вятърът — наш съюзник.",
    "Одриски цар: Златото на Тракия блести по-силно от всяко друго.",
    "Влад Цепеш: Справедливостта изисква твърда ръка и остър кол.",
    "Александър Велики: Светът принадлежи на онези, които се осмеляват.",
    "Дакийски воин: Вълкът не се страхува от мечовете на Рим.",
    "Старейшина: Дипломацията често е по-силна от меча.",
    "Хроника: Родовете са обединени под общ символ!"
];

/**
 * Функция за добавяне на ново предложение от играча
 */
window.addPlayerSuggestion = function(text) {
    if (!text || text.trim() === "") return;

    window.suggestionBook.unshift(text); // Добавя най-отгоре

    if (window.suggestionBook.length > 15) {
        window.suggestionBook.pop(); // Пази само последните 15
    }

    window.updateMarquee(); // Обновява визуално лентата
};

/**
 * Функция за предаване на съобщение от UI
 */
window.submitSuggestion = function() {
    const input = document.getElementById('player-suggestion-text');
    if (input) {
        window.addPlayerSuggestion(input.value);
        input.value = ""; // Изчиства полето след изпращане
        
        if (window.logEvent) {
            window.logEvent("Твоето предложение е записано в летописите.", "standard");
        }
    }
};

/**
 * Обновява текста в HTML елемента
 */
window.updateMarquee = function() {
    const marqueeContainer = document.getElementById('marquee-text');
    if (marqueeContainer) {
        // Обединяваме всички съобщения с разделител " *** "
        const fullText = window.suggestionBook.join(" &nbsp;&nbsp;&nbsp; *** &nbsp;&nbsp;&nbsp; ");
        marqueeContainer.innerHTML = fullText;
    }
};

// Инициализация при зареждане на скрипта
window.updateMarquee();
