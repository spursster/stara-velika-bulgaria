const randomEvents = [
    {
        title: "🛡️ Ромейска делегация",
        text: "Пратеници от Румелия предлагат дарове в замяна на мир.",
        effect: (hero) => {
            window.gameGold += 200;
            return "Получихте 200 злато като дар.";
        }
    },
    {
        title: "🌾 Бо Bogata реколта",
        text: "Земите на рода ви дадоха изобилен плод тази година.",
        effect: (hero) => {
            window.gameGold += 100;
            return "Хамбарите са пълни. +100 злато.";
        }
    },
    {
        title: "⚔️ Набег на степни кланове",
        text: "Вражески отряди нападнаха пограничните села.",
        effect: (hero) => {
            const loss = Math.floor(hero.armySize * 0.1);
            hero.armySize -= loss;
            return `Загубихте ${loss} бойци в защитата.`;
        }
    },
    {
        title: "✨ Древно предсказание",
        text: "Местен жрец вижда величие в очите на владетеля.",
        effect: (hero) => {
            hero.level += 1;
            return "Вашият авторитет нарасна. +1 Ниво.";
        }
    }
];

function triggerRandomEvent(hero) {
    if (Math.random() > 0.3) return null; // Събитие се случва в 30% от случаите

    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    const effectMessage = event.effect(hero);
    
    // Визуализация в лога
    const log = document.getElementById('event-log');
    if (log) {
        const eventHTML = `
            <div style="border-left: 3px solid #d4af37; padding-left: 10px; margin: 10px 0; background: #222;">
                <strong style="color: #d4af37;">${event.title}</strong>
                <p style="margin: 5px 0; font-size: 12px;">${event.text}</p>
                <em style="color: #ffd700; font-size: 11px;">${effectMessage}</em>
            </div>
        `;
        log.innerHTML = eventHTML + log.innerHTML;
    }

    window.updateGoldDisplay();
    window.updateCharacterUI(hero);
}

window.triggerRandomEvent = triggerRandomEvent;
