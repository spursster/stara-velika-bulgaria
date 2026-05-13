/**
 * МОДУЛ: СЪБИТИЯ И ЛОГ
 * Управлява хрониката на събитията в центъра на екрана, без изскачащи прозорци.
 */

window.gameLog = [];

window.logEvent = function(message, type = "info") {
    // 1. Добавяне на новото събитие в началото на масива
    const timestamp = new Date().toLocaleTimeString();
    window.gameLog.unshift({ message, type, time: timestamp });

    // 2. Ограничаване на лога до последните 10 събития за яснота
    if (window.gameLog.length > 10) {
        window.gameLog.pop();
    }

    // 3. Извикване на функцията за рендериране в центъра
    window.renderEventsCenter();
};

window.renderEventsCenter = function() {
    const eventContainer = document.getElementById('events-center');
    if (!eventContainer) return;

    // Генериране на HTML за всяко събитие
    eventContainer.innerHTML = window.gameLog.map(event => {
        let color = "#d4af37"; // Стандартно златно
        if (event.type === "war") color = "#ff4d4d"; // Червено за битки
        if (event.type === "success") color = "#4dff4d"; // Зелено за успехи
        if (event.type === "royal") color = "#bb86fc"; // Лилаво за династични събития

        return `
            <div class="event-entry" style="
                border-left: 3px solid ${color};
                background: rgba(255, 255, 255, 0.05);
                margin-bottom: 10px;
                padding: 10px;
                animation: fadeIn 0.5s ease;
                font-family: 'Cinzel', serif;
            ">
                <small style="color: #888; font-size: 10px;">[${event.time}]</small>
                <p style="margin: 5px 0 0 0; color: #eee; font-size: 14px;">${event.message}</p>
            </div>
        `;
    }).join('');
};

/**
 * Генерира произволно историческо събитие базирано на епохата.
 */
window.generateRandomEvent = function() {
    const eventsBG = [
        { msg: "Ромейски пратеници пристигнаха с предложения за мир.", type: "royal" },
        { msg: "Богат урожай в Мизия - хазната се пълни!", type: "success" },
        { msg: "Забелязани са вражески отряди по границата на Румелия.", type: "war" },
        { msg: "Родът Дуло организира големи конни състезания.", type: "royal" },
        { msg: "Странстващ монах разказва за древни български реликви.", type: "info" }
    ];

    const eventsUS = [
        { msg: "Roman envoys arrived with peace proposals.", type: "royal" },
        { msg: "Rich harvest in Moesia - the treasury is filling up!", type: "success" },
        { msg: "Enemy scouts spotted near the Rumelia border.", type: "war" },
        { msg: "House Dulo organizes grand horse races.", type: "royal" }
    ];

    const list = window.gameLang === "BG" ? eventsBG : eventsUS;
    const random = list[Math.floor(Math.random() * list.length)];
    
    window.logEvent(random.msg, random.type);
};

console.log("Модул Events.js е зареден. Хрониката е готова за центъра на екрана.");
