/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * СТАТУС: СИНХРОНИЗИРАН (Старт: 480 пр.н.е. | 13 Рода)
 */

window.eventsDatabase = [
    {
        id: "dulo_unity",
        title: "Заветът на Кубрат",
        text: "Кан Кубрат събира снопа с пръчки пред старейшините. Родът Дуло трябва да държи останалите родове сплотени, за да не се прекърши силата на България.",
        condition: (hero) => hero.dynasty === "Дуло",
        options: [
            {
                text: "Сплоти родовете (+15 Мощ)",
                action: (hero) => {
                    hero.heroPower += 15;
                    return "Вашата легитимност пред Съвета на старейшините нараства!";
                }
            }
        ]
    },
    {
        id: "odrisi_mysticism",
        title: "Ритуалите на Одрисите",
        text: "В светилищата на Тракия, жрец на древния род Одриси извършва обреди. Той предлага да благослови вашата войска за бъдещи походи.",
        condition: (hero) => (window.playerRegions && window.playerRegions.includes("Тракия")) || hero.dynasty === "Одриси",
        options: [
            {
                text: "Приеми благословията (-50 💰, +20 Мощ)",
                action: (hero) => {
                    hero.gold -= 50;
                    hero.heroPower += 20;
                    return "Духът на древните воини изпълва армията ви с непоколебима сила.";
                }
            }
        ]
    },
    {
        id: "ptolomey_wealth",
        title: "Наследството на Птолемеите",
        text: "Родът на Птолемеите, водещ началото си от Лаг (роден в нашите земи), предлага търговски споразумения за коприна и ценни метали.",
        condition: (hero) => hero.gold > 1000,
        options: [
            {
                text: "Инвестирай в търговията (-300 💰, +15% приход)",
                action: (hero) => {
                    hero.gold -= 300;
                    return "Търговските пътища от Египет до Дунав вече са отворени за вашите кервани!";
                }
            }
        ]
    },
    {
        id: "skiti_archers",
        title: "Скитски стрелци",
        text: "Конните стрелци от степите предлагат своите услуги. Техните лъкове нямат равни по далекобойност в познатия свят.",
        condition: (hero) => window.playerRegions && (window.playerRegions.includes("Сарматия") || window.playerRegions.includes("Крим")),
        options: [
            {
                text: "Наеми стрелците (-200 💰, +100 Армия)",
                action: (hero) => {
                    hero.gold -= 200;
                    hero.armySize += 100;
                    return "Вашата легиона вече разполага с най-смъртоносната конница в степта!";
                }
            }
        ]
    }
];

/**
 * ГЕНЕРИРАНЕ НА СЛУЧАЙНО СЪБИТИЕ (Вика се от advanceTurn в logic.js)
 */
window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    if (!hero) return;

    const possibleEvents = window.eventsDatabase.filter(ev => ev.condition(hero));

    if (possibleEvents.length > 0 && Math.random() < 0.3) { 
        const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        window.showEventModal(event.title, event.text, event.options);
    }
};

/**
 * ФУНКЦИЯ ЗА ПОКАЗВАНЕ НА МОДАЛЕН ПРОЗОРЕЦ
 */
window.showEventModal = function(title, text, options) {
    let modal = document.getElementById('event-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.9); z-index: 99999; display: flex;
            align-items: center; justify-content: center; font-family: 'Cinzel', serif;
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    modal.innerHTML = `
        <div style="width: 90%; max-width: 500px; background: #0a0a0a; border: 2px solid #d4af37; padding: 30px; color: white; text-align: center; box-shadow: 0 0 20px rgba(212,175,55,0.3);">
            <h2 style="color: #d4af37; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 2px;">${title}</h2>
            <p style="font-size: 1em; line-height: 1.6; margin-bottom: 30px; color: #ddd;">${text}</p>
            <div id="event-options" style="display: flex; flex-direction: column; gap: 12px;">
                ${options.map((opt, index) => `
                    <button onclick="window.handleEventChoice(${index}, '${title}')" style="
                        background: #111; color: #d4af37; border: 1px solid #d4af37;
                        padding: 12px; cursor: pointer; font-weight: bold; transition: 0.3s;
                        text-transform: uppercase; font-size: 0.9em;
                    " onmouseover="this.style.background='#d4af37'; this.style.color='#000';"
                       onmouseout="this.style.background='#111'; this.style.color='#d4af37';">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    window.currentActiveOptions = options;
};

window.handleEventChoice = function(index, eventTitle) {
    const choice = window.currentActiveOptions[index];
    const result = choice.action(window.currentHero);
    
    document.getElementById('event-modal').style.display = 'none';
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`${result}`);
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
