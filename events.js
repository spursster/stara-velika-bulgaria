/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (13 Рода & 51 региона)
 * Включва исторически събития за новите династии и ресурсни предизвикателства.
 */

window.eventsDatabase = [
    {
        id: "dulo_unity",
        title: "Заветът на Кубрат",
        text: "Кан Кубрат събира снопа с пръчки. Родът Дуло трябва да държи останалите родове сплотени, за да не се прекърши силата на България.",
        condition: (hero) => hero.dynasty === "Дуло" && window.playerRegions.length < 5,
        options: [
            {
                text: "Сплоти родовете (+15 Мощ)",
                action: (hero) => {
                    hero.heroPower += 15;
                    return "Вашата легитимност пред Съвета нараства!";
                }
            }
        ]
    },
    {
        id: "odrisi_mysticism",
        title: "Ритуалите на Одрисите",
        text: "В светилищата на Тракия, жреците на рода Одриси извършват древни обреди. Те предлагат да благословят вашата кампания.",
        condition: (hero) => window.playerRegions.includes("Тракия") || hero.dynasty === "Одриси",
        options: [
            {
                text: "Приеми благословията (-50 💰, +20 Мощ)",
                action: (hero) => {
                    hero.gold -= 50;
                    hero.heroPower += 20;
                    return "Духът на древните воини изпълва армията ви.";
                }
            }
        ]
    },
    {
        id: "ptolomey_wealth",
        title: "Наследството на Птоломеите",
        text: "Династията на Птоломеите, водеща началото си от Лаг (роден в нашите земи), предлага търговски споразумения за коприна и сребро.",
        condition: (hero) => hero.gold > 1000,
        options: [
            {
                text: "Инвестирай в търговията (-300 💰, +15% Бъдещ доход)",
                action: (hero) => {
                    hero.gold -= 300;
                    if (window.worldData.clans["Птоломеи"]) window.worldData.clans["Птоломеи"].gold += 300;
                    return "Търговските пътища от Египет до Дунав са отворени!";
                }
            }
        ]
    },
    {
        id: "skiti_archers",
        title: "Скитски стрелци",
        text: "Скитите от степите предлагат своите най-добри конни стрелци. Техните лъкове нямат равни по далекобойност.",
        condition: (hero) => window.playerRegions.includes("Сарматия") || window.playerRegions.includes("Крим"),
        options: [
            {
                text: "Наеми скитските стрелци (-200 💰, +100 Армия)",
                action: (hero) => {
                    hero.gold -= 200;
                    hero.armySize += 100;
                    return "Конницата ви вече е двойно по-смъртоносна!";
                }
            }
        ]
    },
    {
        id: "dacia_gold_mines",
        title: "Златото на Даките",
        text: "В планините на Дакия са открити стари рудници. Родът Даки иска разрешение да възстанови добива.",
        condition: (hero) => window.playerRegions.includes("Дакия"),
        options: [
            {
                text: "Възобнови копаенето (+400 💰, -10 Мощ)",
                action: (hero) => {
                    hero.gold += 400;
                    hero.heroPower -= 10;
                    return "Златото тече към хазната, но старейшините роптаят срещу тежкия труд.";
                }
            }
        ]
    }
];

/**
 * ГЕНЕРИРАНЕ НА СЛУЧАЙНО СЪБИТИЕ
 */
window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    const possibleEvents = window.eventsDatabase.filter(ev => ev.condition(hero));

    if (possibleEvents.length > 0 && Math.random() < 0.3) { // 30% шанс за събитие на ход
        const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        
        if (window.showEventModal) {
            window.showEventModal(event.title, event.text, event.options);
        } else {
            // Fallback ако UI модалът не е зареден
            const choice = event.options[0];
            const result = choice.action(hero);
            if (window.showAdvisorMsg) window.showAdvisorMsg(`[СЪБИТИЕ: ${event.title}] ${result}`);
        }
    }
};

/**
 * ФУНКЦИЯ ЗА ПОКАЗВАНЕ НА МОДАЛЕН ПРОЗОРЕЦ (ИНТЕГРАЦИЯ С UI)
 */
window.showEventModal = function(title, text, options) {
    let modal = document.getElementById('event-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.85); z-index: 50000; display: flex;
            align-items: center; justify-content: center;
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    modal.innerHTML = `
        <div style="width: 90%; max-width: 450px; background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; text-align: center;">
            <h2 style="color: #d4af37; text-transform: uppercase; margin-top: 0;">${title}</h2>
            <p style="font-size: 0.95em; line-height: 1.5; margin-bottom: 25px;">${text}</p>
            <div id="event-options" style="display: flex; flex-direction: column; gap: 10px;">
                ${options.map((opt, index) => `
                    <button onclick="window.handleEventChoice(${index}, '${title}')" style="
                        background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37;
                        padding: 10px; cursor: pointer; font-weight: bold; transition: 0.3s;
                    " onmouseover="this.style.background='#d4af37'; this.style.color='#000';"
                       onmouseout="this.style.background='#1a1a1a'; this.style.color='#d4af37';">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Запазваме текущите опции временно, за да ги извикаме при клик
    window.currentActiveOptions = options;
};

window.handleEventChoice = function(index, eventTitle) {
    const choice = window.currentActiveOptions[index];
    const result = choice.action(window.currentHero);
    
    document.getElementById('event-modal').style.display = 'none';
    
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`РЕЗУЛТАТ: ${result}`);
    }
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
