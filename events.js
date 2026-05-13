window.randomEvents = [
    {
        title: { bg: "🛡️ Ромейска делегация", en: "🛡️ Rhomaioi Delegation", ru: "🛡️ Ромейская делегация" },
        text: { 
            bg: "Пратеници от Румелия предлагат дарове в замяна на мир.", 
            en: "Envoys from Rumelia offer gifts in exchange for peace.", 
            ru: "Посланники из Румелии предлагают дары в обмен на мир." 
        },
        effect: (hero) => {
            window.gameGold += 200;
            return {
                bg: "Получихте 200 злато като дар.",
                en: "Received 200 gold as a gift.",
                ru: "Получили 200 золота в дар."
            };
        }
    },
    {
        title: { bg: "🌾 Богата реколта", en: "🌾 Bountiful Harvest", ru: "🌾 Богатый урожай" },
        text: { 
            bg: "Земите на рода ви дадоха изобилен плод тази година.", 
            en: "The lands of your clan gave abundant fruit this year.", 
            ru: "Земли вашего рода дали обильный плод в этом году." 
        },
        effect: (hero) => {
            window.gameGold += 100;
            return {
                bg: "Хамбарите са пълни. +100 злато.",
                en: "The granaries are full. +100 gold.",
                ru: "Амбары полны. +100 золота."
            };
        }
    },
    {
        title: { bg: "⚔️ Набег на степни кланове", en: "⚔️ Steppe Clans Raid", ru: "⚔️ Набег степных кланов" },
        text: { 
            bg: "Вражески отряди нападнаха пограничните села.", 
            en: "Enemy squads attacked the border villages.", 
            ru: "Вражеские отряды напали на пограничные села." 
        },
        effect: (hero) => {
            const loss = Math.floor(hero.armySize * 0.1);
            hero.armySize -= loss;
            return {
                bg: `Загубихте ${loss} воини в защитата.`,
                en: `Lost ${loss} warriors in defense.`,
                ru: `Потеряли ${loss} воинов в защите.`
            };
        }
    },
    {
        title: { bg: "✨ Древно предсказание", en: "✨ Ancient Prophecy", ru: "✨ Древнее предсказание" },
        text: { 
            bg: "Местен жрец вижда величие в очите на владетеля.", 
            en: "A local priest sees greatness in the ruler's eyes.", 
            ru: "Местный жрец видит величие в глазах правителя." 
        },
        effect: (hero) => {
            hero.level += 1;
            hero.armySize += 100;
            return {
                bg: "Вашият авторитет нарасна. +1 Ниво.",
                en: "Your authority has grown. +1 Level.",
                ru: "Ваш авторитет вырос. +1 Уровень."
            };
        }
    }
];

window.triggerRandomEvent = function(hero) {
    if (Math.random() > 0.4) return; // 40% шанс за събитие

    const event = window.randomEvents[Math.floor(Math.random() * window.randomEvents.length)];
    const effectMessages = event.effect(hero);
    
    const log = document.getElementById('event-log'); // Увери се, че това ID съществува в HTML
    if (log) {
        const lang = window.gameLang || 'bg';
        const eventHTML = `
            <div style="border-left: 3px solid #d4af37; padding: 10px; margin: 10px 0; background: rgba(34, 34, 34, 0.9); border-radius: 0 5px 5px 0;">
                <strong style="color: #d4af37; display: block; margin-bottom: 5px;">${event.title[lang]}</strong>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: #eee;">${event.text[lang]}</p>
                <em style="color: #ffd700; font-size: 12px; display: block;">${effectMessages[lang]}</em>
            </div>
        `;
        log.innerHTML = eventHTML + log.innerHTML;
        
        // Ограничаваме лога до последните 5 събития, за да не препълваме екрана
        if (log.children.length > 5) {
            log.removeChild(log.lastChild);
        }
    }

    if (typeof window.updateCharacterUI === "function") {
        window.updateCharacterUI(hero);
    }
};
