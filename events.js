/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * Логика за динамични сценарии и избори.
 */

window.eventHistory = [];

window.eventsDatabase = [
    {
        id: "council_of_elders",
        title: "Съвет на старейшините",
        text: "Родовете се събират, за да обсъдят бъдещето на държавата. Искат по-ниски налози.",
        condition: (hero) => hero.gold > 500,
        options: [
            {
                text: "Намали данъците (-100 💰, +10 Мощ)",
                action: (hero) => {
                    hero.gold -= 100;
                    hero.heroPower += 10;
                    return "Старейшините са доволни от вашата мъдрост.";
                }
            },
            {
                text: "Остави ги без промяна (0 💰, -5 Мощ)",
                action: (hero) => {
                    hero.heroPower -= 5;
                    return "Дочува се недоволство сред родовете.";
                }
            }
        ]
    },
    {
        id: "ancient_monument",
        title: "Откритие в могила",
        text: "Вашите конници откриха стара могила на древен български род. Какво ще предприемете?",
        condition: () => true, // Може да се случи винаги
        options: [
            {
                text: "Проучи внимателно (+1 артефакт)",
                action: (hero) => {
                    if (window.acquireArtifact) {
                        const artKeys = Object.keys(window.artifactsDatabase);
                        const rand = artKeys[Math.floor(Math.random() * artKeys.length)];
                        window.acquireArtifact(rand);
                    }
                    return "Открихте свещен предмет от миналото!";
                }
            },
            {
                text: "Почетете предците (+5 Мощ)",
                action: (hero) => {
                    hero.heroPower += 5;
                    return "Духът на предците ви дава сила.";
                }
            }
        ]
    }
];

window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    // Филтрираме събитията, чиито условия са изпълнени
    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(hero));
    
    if (availableEvents.length > 0 && Math.random() < 0.3) { // 30% шанс за събитие на ход
        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        window.showEventModal(event);
    }
};

window.logEvent = function(message, type) {
    const center = document.getElementById('events-center');
    if (!center) return;

    const dateStr = window.gameTime ? `${window.gameTime.year} пр.н.е.` : "";
    const entry = document.createElement('div');
    entry.style.cssText = `
        padding: 10px; 
        margin-bottom: 8px; 
        border-left: 4px solid ${type === 'death' ? '#ff4d4d' : '#d4af37'};
        background: rgba(255,255,255,0.05);
        font-size: 13px;
        animation: fadeIn 0.5s ease;
    `;
    entry.innerHTML = `<small style="color: #888;">${dateStr}</small><br>${message}`;
    center.prepend(entry);
};

window.showEventModal = function(event) {
    const mainArea = document.getElementById('game-main-area');
    const modal = document.createElement('div');
    modal.id = "event-modal";
    modal.style.cssText = `
        position: absolute; top: 10%; left: 10%; width: 80%; 
        background: #000; border: 2px solid #d4af37; padding: 20px; 
        z-index: 1000; box-shadow: 0 0 20px #000;
    `;

    let optionsHTML = event.options.map((opt, index) => `
        <button onclick="window.handleEventChoice(${index})" style="
            display: block; width: 100%; padding: 10px; margin-top: 10px;
            background: #1a1a1a; color: #d4af37; border: 1px solid #333; cursor: pointer;
            font-family: 'Montserrat'; text-align: left;
        ">${opt.text}</button>
    `).join('');

    modal.innerHTML = `
        <h3 style="font-family: 'Cinzel'; color: #d4af37;">${event.title}</h3>
        <p style="font-size: 14px;">${event.text}</p>
        ${optionsHTML}
    `;
    
    window.activeEvent = event;
    mainArea.appendChild(modal);
};

window.handleEventChoice = function(index) {
    const event = window.activeEvent;
    const choice = event.options[index];
    const resultMsg = choice.action(window.currentHero);
    
    const modal = document.getElementById('event-modal');
    if (modal) modal.remove();
    
    window.logEvent(`${event.title}: ${resultMsg}`, "action");
    window.updateCharacterUI(window.currentHero);
};
