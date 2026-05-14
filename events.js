/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * Управлява динамичните сценарии и историческите избори.
 */

window.eventsDatabase = [
    {
        id: "council_of_elders",
        title: "Съвет на старейшините",
        text: "Старейшините на водещите български родове се събраха. Те настояват за преразпределение на пасищата в Мизия.",
        condition: (hero) => hero.gold > 300,
        options: [
            {
                text: "Дай им право на управление (-150 💰, +10 Мощ)",
                action: (hero) => {
                    hero.gold -= 150;
                    hero.heroPower += 10;
                    return "Родовете признават вашата щедрост и авторитет.";
                }
            },
            {
                text: "Наложи волята си (0 💰, -5 Мощ)",
                action: (hero) => {
                    hero.heroPower -= 5;
                    return "Старейшините си тръгват с гняв в очите.";
                }
            }
        ]
    },
    {
        id: "ancient_monument_discovery",
        title: "Свещена находка",
        text: "Вашите конници откриха древен паметник на предците в новозавладените земи. Вътре блестят предмети от миналото.",
        condition: () => true,
        options: [
            {
                text: "Проучи паметника (Шанс за артефакт)",
                action: (hero) => {
                    if (window.acquireArtifact) {
                        const artKeys = Object.keys(window.artifactsDatabase);
                        const rand = artKeys[Math.floor(Math.random() * artKeys.length)];
                        window.acquireArtifact(rand);
                    }
                    return "Открихте предмет, принадлежал на велики предци!";
                }
            },
            {
                text: "Остави го непокътнат (+5 Престиж)",
                action: (hero) => {
                    hero.xp += 5;
                    return "Показахте почит към духовете на предците.";
                }
            }
        ]
    }
];

window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(hero));
    
    // 25% шанс да се случи събитие при всеки ход
    if (availableEvents.length > 0 && Math.random() < 0.25) {
        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        window.showEventModal(event);
    }
};

window.showEventModal = function(event) {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const modal = document.createElement('div');
    modal.id = "event-modal";
    // Стилът е направен да бъде четим и на мобилни устройства
    modal.style.cssText = `
        position: absolute; top: 15%; left: 5%; width: 90%; 
        background: #000; border: 2px solid #d4af37; padding: 20px; 
        z-index: 2000; box-shadow: 0 0 30px rgba(0,0,0,1);
        box-sizing: border-box; color: #eee;
    `;

    const optionsHTML = event.options.map((opt, index) => `
        <button onclick="window.handleEventChoice(${index})" style="
            display: block; width: 100%; padding: 12px; margin-top: 10px;
            background: #1a1a1a; color: #d4af37; border: 1px solid #d4af37; 
            cursor: pointer; font-family: 'Montserrat'; text-align: left; font-size: 13px;
        ">${opt.text}</button>
    `).join('');

    modal.innerHTML = `
        <h3 style="font-family: 'Cinzel'; color: #d4af37; margin-top: 0; font-size: 18px;">${event.title}</h3>
        <p style="font-size: 14px; line-height: 1.4;">${event.text}</p>
        <div style="margin-top: 20px;">${optionsHTML}</div>
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
    
    if (window.logEvent) {
        window.logEvent(`${event.title}: ${resultMsg}`, "action");
    }
    window.updateCharacterUI(window.currentHero);
};

window.logEvent = function(message, type) {
    const center = document.getElementById('events-center');
    if (!center) return;

    const dateStr = window.gameTime ? `${window.gameTime.year} пр.н.е.` : "";
    const entry = document.createElement('div');
    entry.style.cssText = `
        padding: 10px; margin-bottom: 8px; 
        border-left: 4px solid ${type === 'death' ? '#ff4d4d' : '#d4af37'};
        background: rgba(255,255,255,0.05); font-size: 12px;
    `;
    entry.innerHTML = `<small style="color: #888;">${dateStr}</small><br>${message}`;
    center.prepend(entry);
};
