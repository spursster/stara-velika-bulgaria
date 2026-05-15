/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * СТАТУС: ГЕНЕРАТОР НА 100+ СЪБИТИЯ
 */

// База от данни за динамично сглобяване
window.eventTemplates = {
    positive: [
        { t: "Благоденствие в {region}", desc: "Местните родове в {region} откриха нови пасища. Хазната расте.", effect: { gold: 150, power: 5 } },
        { t: "Мъдростта на Кан {hero}", desc: "Вашето решение по съдебен спор между два рода увеличи влиянието Ви.", effect: { power: 25, gold: 0 } },
        { t: "Елитна гвардия", desc: "Група млади воини от род {dynasty} се заклеха във вярност до смърт.", effect: { army: 120, power: 10 } },
        { t: "Търговски керван", desc: "Пътници от далечни земи пристигнаха, носейки дарове и злато.", effect: { gold: 300, power: 0 } }
    ],
    negative: [
        { t: "Чума по добитъка", desc: "Болест покоси конете в покрайнините. Армията страда.", effect: { army: -50, gold: -100 } },
        { t: "Бунт на старейшини", desc: "Някои родове недоволстват от високите данъци.", effect: { power: -20, gold: 50 } },
        { t: "Пясъчна буря/Мраз", desc: "Природата се обърна срещу нас. Загубихме провизии.", effect: { gold: -200, army: -20 } }
    ],
    mystic: [
        { t: "Небесно знамение", desc: "Комета пресече небето над лагера. Жреците тълкуват това като знак.", effect: { power: 30, gold: -50 } },
        { t: "Древно предсказание", desc: "Открит е надпис в скалите, възхваляващ величието на българите.", effect: { power: 50, army: 0 } }
    ]
};

window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    if (!hero || Math.random() > 0.4) return; // 40% шанс за събитие

    // Избор на тип събитие (Позитивно, Негативно или Мистично)
    const types = ['positive', 'negative', 'mystic'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const template = window.eventTemplates[selectedType][Math.floor(Math.random() * window.eventTemplates[selectedType].length)];

    // Динамично заместване на имена (за да звучи уникално всеки път)
    const regions = ["Тракия", "Мизия", "Понт", "Крим", "Кавказ", "Панония"];
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    
    let eventTitle = template.t.replace("{region}", randomRegion).replace("{hero}", hero.name);
    let eventText = template.desc.replace("{region}", randomRegion).replace("{dynasty}", hero.dynasty);

    window.showEventModal(eventTitle, eventText, [
        {
            text: "Приеми съдбата",
            action: (h) => {
                if (template.effect.gold) h.gold += template.effect.gold;
                if (template.effect.power) h.heroPower += template.effect.power;
                if (template.effect.army) h.armySize += template.effect.army;
                
                // Проверка за фалит или ниска войска
                if (h.gold < 0) h.gold = 0;
                if (h.armySize < 0) h.armySize = 0;

                return `Събитието премина: ${template.effect.gold >= 0 ? '+' : ''}${template.effect.gold || 0} 💰`;
            }
        }
    ]);
};

window.showEventModal = function(title, text, options) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95); z-index: 10000; display: flex;
        align-items: center; justify-content: center; font-family: 'Cinzel', serif;
    `;

    modal.innerHTML = `
        <div style="width: 85%; max-width: 450px; background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; text-align: center; border-radius: 8px;">
            <h2 style="color: #d4af37; margin-bottom: 15px; letter-spacing: 2px; font-size: 1.2em;">${title}</h2>
            <p style="font-size: 0.9em; line-height: 1.6; margin-bottom: 25px; color: #ccc;">${text}</p>
            <div id="event-options">
                ${options.map((opt, i) => `
                    <button onclick="window.handleEventChoice(${i})" style="
                        width: 100%; background: #111; color: #d4af37; border: 1px solid #d4af37;
                        padding: 12px; cursor: pointer; font-weight: bold; text-transform: uppercase;
                    ">${opt.text}</button>
                `).join('')}
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
