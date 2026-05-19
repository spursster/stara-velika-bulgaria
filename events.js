/**
МОДУЛ: РОДОВИ СЪБИТИЯ И КРИЗИ - Велика България
СТАТУС: НАПЪЛНО НАДГРАДЕН (ИНТЕГРАЦИЯ С DIABLO МИСТИЦИЗЪМ & ИКОНОМИКА)
КОРЕКЦИЯ: Ефектите от кризи и благоденствия четат пасивите на лидера в реално време.
ФИКС: Премахнати интервали, поправени оператори, dynasty -> clan, оправен HTML рендеринг.
*/

window.eventTemplates = {
    positive: [
        { t: "Благоденствие в {region}", desc: "Местните родове в {region} откриха нови пасища и ресурси. Хазната на рода расте.", effect: { gold: 150, power: 5 } },
        { t: "Мъдростта на Кан {hero}", desc: "Вашето справедливо решение по спор между родовите старейшини увеличи влиянието Ви.", effect: { power: 25, gold: 0 } },
        { t: "Елитна гвардия", desc: "Група млади и верни воини от род {clan} се заклеха в съдбовна вярност до смърт.", effect: { army: 120, power: 10 } },
        { t: "Търговски керван", desc: "Пътници и търговци от далечни земи пристигнаха в столицата, носейки дарове и злато.", effect: { gold: 300, power: 0 } }
    ],
    negative: [
        { t: "Бунт на недоволни старейшини", desc: "Част от родовите първенци в {region} оспорват решенията на двореца. Трябва да платите или да пратите войска.", effect: { gold: -200, army: -40 } },
        { t: "Проклятието на Древните Могили", desc: "Черна прокоба застигна конете и реколтата. Мистичните сили изискват жертвоприношение или хазната ще пострада.", effect: { gold: -150, power: -10 } },
        { t: "Граничен набег", desc: "Вражески конници опустошиха пограничните села в {region}. Дадени са жертви.", effect: { army: -80, gold: -50 } }
    ]
};

window.openEventsMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;
    mainArea.innerHTML = `
        <section class="rpg-section animate-fade" style="background: rgba(15, 15, 15, 0.85); border: 1px solid #d4af37; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; text-transform: uppercase;">Свещен Летопис на Събитията</h2>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 20px;">Предизвикайте съдбата на рода си или проверете знаменията на времето.</p>
            <div style="background: rgba(0,0,0,0.5); border: 1px solid #222; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <button class="action-btn" style="width: 100%; padding: 15px; font-weight: bold;" onclick="window.triggerRandomEvent()">📜 ИЗВЕСТИНУВАЙ СЪБИТИЕ (НОВ ХОД)</button>
            </div>
            <button class="menu-btn" onclick="if(window.openRegionsMap){window.openRegionsMap();}else{location.reload();}" style="width: 100%;">Върни се към Картата</button>
        </section>
    `;
};

window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    if (!hero) return;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let skills = hero.skills || {};

    let isPositive = Math.random() > 0.4;
    let pool = isPositive ? window.eventTemplates.positive : window.eventTemplates.negative;
    let template = pool[Math.floor(Math.random() * pool.length)];

    let randomRegion = "Мизия";
    if (window.playerRegions && window.playerRegions.flat().length > 0) {
        const flatRegs = window.playerRegions.flat();
        randomRegion = flatRegs[Math.floor(Math.random() * flatRegs.length)];
    }

    // FIXED: clan вместо dynasty, почистени replace шаблони
    let eventTitle = template.t.replace("{region}", randomRegion).replace("{hero}", hero.name).replace("{clan}", hero.clan || "Дуло");
    let eventText = template.desc.replace("{region}", randomRegion).replace("{hero}", hero.name).replace("{clan}", hero.clan || "Дуло");

    let goldEffect = template.effect.gold || 0;
    let armyEffect = template.effect.army || 0;
    let powerEffect = template.effect.power || 0;

    // ПАСИВ 1: Родово Управление (economy) увеличава позитивните златни приходи с 30%
    if (isPositive && goldEffect > 0 && (skills.economy || 0) > 0) {
        goldEffect = Math.floor(goldEffect * (1 + (skills.economy * 0.30)));
        eventText += `<br><span style="color:#00ffcc;">[УПРАВЛЕНИЕ]: Благодарение на вашите икономически умения, родът спечели повече злато!</span>`;
    }

    // ПАСИВ 2: Мистицизъм (mysticism) неутрализира или намалява щетите от негативни знамения
    if (!isPositive && (skills.mysticism || 0) > 0 && eventTitle.includes("Проклятието")) {
        let mitigation = skills.mysticism * 0.25; // 25% спасяване на точка
        goldEffect = Math.floor(goldEffect * (1 - Math.min(1, mitigation)));
        powerEffect = 0;
        eventText += `<br><span style="color:#ffd700;">[МИСТИЦИЗЪМ]: Високият ви мистицизъм прогони злите духове и намали щетите от проклятието!</span>`;
    }

    // Прилагане на финалните ефекти
    if (goldEffect !== 0) hero.gold = Math.max(0, (hero.gold || 0) + goldEffect);
    if (armyEffect !== 0) {
        hero.currentArmy = Math.max(0, (hero.currentArmy || 0) + armyEffect);
        hero.armySize = hero.currentArmy;
    }
    if (powerEffect !== 0) hero.heroPower = Math.max(10, (hero.heroPower || 100) + powerEffect);

    // Синхронизация с глобалната worldData (само clan)
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.clan]) {
        const cData = window.worldData.clans[hero.clan];
        cData.gold = hero.gold;
        cData.currentArmy = hero.currentArmy;
        cData.armySize = hero.currentArmy;
        cData.heroPower = hero.heroPower;
    }

    // Рендериране на диалоговия прозорец за събитието
    window.showEventModal(eventTitle, eventText, [
        {
            text: "ПРИЕМИ СЪДБАТА И ПРОДЪЛЖИ",
            action: function() {
                const modal = document.getElementById('event-overlay-modal');
                if (modal) modal.remove();
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
                if (window.openEventsMenu) window.openEventsMenu();
            }
        }
    ]);

    // Известяване в глобалния съветник
    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`📜 СЪБИТИЕ: ${eventTitle}. Промени по рода: Злато (${goldEffect >= 0 ? "+" : ""}${goldEffect}), Войска (${armyEffect >= 0 ? "+" : ""}${armyEffect}).`);
    }
};

window.showEventModal = function(title, text, options) {
    let modal = document.getElementById('event-overlay-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'event-overlay-modal';
    modal.className = 'fullscreen-overlay';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 10000;
    `;

    // FIXED: Стандартен template literal синтаксис
    modal.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; text-align: center; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.95); max-width: 450px; width: 90%; box-sizing: border-box;">
            <h3 style="color: #ffd700; font-family: 'Cinzel', serif; margin: 0 0 15px 0; text-transform: uppercase; font-size: 1.1em; letter-spacing: 1px;">${title}</h3>
            <p style="font-size: 13px; line-height: 1.6; margin: 0 0 25px 0; color: #ccc;">${text}</p>
            <div id="event-options-container"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const container = document.getElementById('event-options-container');
    if (container) {
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.style.cssText = 'width: 100%; padding: 12px; margin-bottom: 8px; font-weight: bold; font-size: 12px;';
            btn.innerText = opt.text;
            btn.onclick = opt.action;
            container.appendChild(btn);
        });
    }
};
