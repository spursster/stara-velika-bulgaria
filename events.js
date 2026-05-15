/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * СТАТУС: СИНХРОНИЗИРАН (1 г. от н.е.)
 */

window.eventsDatabase = [
    {
        id: "dulo_unity",
        title: "Заветът на Кубрат",
        text: "Кан Кубрат събира снопа с пръчки. Родът Дуло трябва да държи останалите родове сплотени.",
        condition: (hero) => hero.dynasty === "Дуло",
        options: [{ text: "Сплоти родовете (+15 Мощ)", action: (hero) => { hero.heroPower += 15; return "Вашата легитимност нараства!"; } }]
    }
    // ... останалите събития се запазват
];

window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    const possibleEvents = window.eventsDatabase.filter(ev => ev.condition(hero));
    if (possibleEvents.length > 0 && Math.random() < 0.3) { 
        const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        window.showEventModal(event.title, event.text, event.options);
    }
};

window.showEventModal = function(title, text, options) {
    const modal = document.getElementById('event-modal');
    modal.style.display = 'flex';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 10000; align-items: center; justify-content: center; display: flex;";
    modal.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; padding: 30px; color: white; text-align: center;">
            <h2 style="color: #d4af37;">${title}</h2>
            <p>${text}</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${options.map((opt, index) => `<button onclick="window.handleEventChoice(${index})" style="background: #111; color: #d4af37; border: 1px solid #d4af37; padding: 10px; cursor: pointer;">${opt.text}</button>`).join('')}
            </div>
        </div>
    `;
    window.currentActiveOptions = options;
};

window.handleEventChoice = function(index) {
    const choice = window.currentActiveOptions[index];
    const result = choice.action(window.currentHero);
    document.getElementById('event-modal').style.display = 'none';
    if (window.showAdvisorMsg) window.showAdvisorMsg(result);
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
