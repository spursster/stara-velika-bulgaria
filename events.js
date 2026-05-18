/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (Премахнато дублиране на ходовете)
 * КОРЕКЦИЯ БЪГ: Функциите за време и експедиции се викат тук САМО при ръчен тест, за да няма двойно превъртане с logic.js!
 * Статистика на файловете в проекта: 16
 */

// База от данни за динамично сглобяване на събития
window.eventTemplates = {
    positive: [
        { t: "Благоденствие в {region}", desc: "Местните родове в {region} откриха нови пасища и ресурси. Хазната расте.", effect: { gold: 150, power: 5 } },
        { t: "Мъдростта на Кан {hero}", desc: "Вашето справедливо решение по спор между родовите старейшини увеличи влиянието Ви.", effect: { power: 25, gold: 0 } },
        { t: "Елитна гвардия", desc: "Група млади и верни воини от род {dynasty} се заклеха в съдбовна вярност до смърт.", effect: { army: 120, power: 10 } },
        { t: "Търговски керван", desc: "Пътници и търговци от далечни земи пристигнаха в столицата, носейки дарове и злато.", effect: { gold: 300, power: 0 } }
    ],
    negative: [
        { t: "Чума по добитъка", desc: "Коварна болест покоси конете в покрайнините. Военната готовност страда.", effect: { army: -50, gold: -100 } },
        { t: "Бунт на старейшини", desc: "Някои местни родове недоволстват от извънредните налози за хазната.", effect: { power: -20, gold: 50 } },
        { t: "Природен мраз", desc: "Суровата природа изненада лагерите ни. Загубихме ценни провизии.", effect: { gold: -200, army: -20 } }
    ],
    mystic: [
        { t: "Небесно знамение", desc: "Ярка комета пресече небето над лагера. Колобрите тълкуват това като знак от предците.", effect: { power: 30, gold: -50 } },
        { t: "Древно предсказание", desc: "Открит е вековен надпис в скалите, възхваляващ величието и вечния път на българите.", effect: { power: 50, army: 0 } }
    ]
};

/**
 * ФУНКЦИЯ ЗА ТЕСТОВ БУТОН: Гарантирано пускане със 100% шанс (Тук времето напредва ръчно за самия тест!)
 */
window.forceTriggerRandomEvent = function() {
    window.executeEventLogic(true);
};

/**
 * СТАНДАРТНО АВТОМАТИЧНО ПУСКАНЕ (Задейства се от logic.js при нов ход)
 */
window.triggerRandomEvent = function() {
    window.executeEventLogic(false);
};

/**
 * ОСНОВНО ЯДРО НА СЪБИТИЯТА
 */
window.executeEventLogic = function(isForced) {
    // 1. ПРОВЕРКА ЗА ДУБЛИРАНЕ: Напредваме времето и експедициите ТУК само ако е натиснат ТЕСТОВИЯ бутон.
    // При нормален ход от logic.js, тези функции вече са се изпълнили веднъж!
    if (isForced) {
        if (typeof window.processTime === 'function') {
            window.processTime();
        }
        if (typeof window.updateExpeditionSystem === 'function') {
            window.updateExpeditionSystem();
        }
    }

    const hero = window.currentHero;
    if (!hero) return;

    // 2. ПРОВЕРКА ЗА ШАНС (При автоматичен ход има 40% шанс за поява на прозорец със събитие)
    if (!isForced && Math.random() > 0.4) {
        return; 
    }

    // 3. ГЕНЕРИРАНЕ НА ТЕКСТОВОТО СЪБИТИЕ
    const types = ['positive', 'negative', 'mystic'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const template = window.eventTemplates[selectedType][Math.floor(Math.random() * window.eventTemplates[selectedType].length)];

    // Динамичен подбор на региони, съобразени изцяло с world_data.js
    const regions = ["Тракия", "Мизия", "Понт", "Крим", "Кавказ", "Панония", "Дакия"];
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
                
                // Защита против отрицателни стойности в профила
                if (h.gold < 0) h.gold = 0;
                if (h.armySize < 0) h.armySize = 0;

                let signGold = template.effect.gold >= 0 ? '+' : '';
                let signPower = template.effect.power >= 0 ? '+' : '';
                let signArmy = template.effect.army >= 0 ? '+' : '';

                return `Събитието премина: ${template.effect.gold ? `${signGold}${template.effect.gold} 💰 ` : ''}${template.effect.power ? `${signPower}${template.effect.power} ⚔️ ` : ''}${template.effect.army ? `${signArmy}${template.effect.army} 🪖` : ''}`;
            }
        }
    ]);
};

window.showEventModal = function(title, text, options) {
    let modal = document.getElementById('event-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'event-modal';
    document.body.appendChild(modal);

    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85); z-index: 35000; display: flex;
        align-items: center; justify-content: center; font-family: 'Georgia', serif;
    `;

    modal.innerHTML = `
        <div style="width: 85%; max-width: 450px; background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; text-align: center; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.95); box-sizing: border-box;">
            <h2 style="color: #d4af37; margin: 0 0 15px 0; letter-spacing: 1px; font-size: 1.2em; text-transform: uppercase;">${title}</h2>
            <p style="font-size: 0.9em; line-height: 1.6; margin: 0 0 25px 0; color: #ccc;">${text}</p>
            <div id="event-options">
                ${options.map((opt, i) => `
                    <button onclick="window.handleEventChoice(${i})" style="
                        width: 100%; background: #111; color: #d4af37; border: 1px solid #d4af37;
                        padding: 12px; cursor: pointer; font-weight: bold; text-transform: uppercase; border-radius: 4px; font-size: 0.85em; transition: background 0.2s;
                    " onmouseover="this.style.background='#222'" onmouseout="this.style.background='#111'">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    window.currentActiveOptions = options;
};

window.handleEventChoice = function(index) {
    const choice = window.currentActiveOptions[index];
    const result = choice.action(window.currentHero);
    
    const modal = document.getElementById('event-modal');
    if (modal) modal.remove();
    
    if (window.showAdvisorMsg) window.showAdvisorMsg(result);
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};
