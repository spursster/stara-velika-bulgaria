/**
МОДУЛ: БАЗА ДАННИ - Велика България
СТАТУС: АБСОЛЮТЕН И НЕПРОМЕНЯЕМ ЗАКОН (13 Равноправни Кланове)
КОРЕКЦИЯ: Премахнати всички трейлинг интервали, поправен синтаксис, унифицирана структура на героя.
*/

window.clans = {
    "Дуло": {
        heroes: [
            "Атила", "Ирник", "Заберган", "Сандилх", "Аскал", "Албури", "Авитохол",
            "Гостун", "Кубрат", "Батбаян", "Котраг", "Аспарух", "Тервел", "Севар",
            "Крум", "Омуртаг", "Маламир", "Пресиян I", "Борис I", "Владимир Расате",
            "Симеон Велики", "Петър I", "Ирхан", "Туккей", "Урус-Айдар", "Габдулла Джилки",
            "Бат-Угор Муми", "Алмиш Джафар", "Микаил Ялкау Балтавар", "Мохаммед",
            "Тимар Мумин", "Габдула Челбир", "Мир-Гази", "Алтънбек"
        ]
    },
    "Комитопули": {
        heroes: ["Давид", "Мойсей", "Арон", "Самуил", "Гаврил Радомир", "Иван Владислав", "Пресиян II", "Петър Делян", "Алусиан"]
    },
    "Асеневци": {
        heroes: ["Асен I", "Петър IV", "Калоян", "Борил", "Иван Асен II", "Коломан I Асен", "Михаил II Асен", "Калиман II Асен", "Мицо Асен", "Константин Тих Асен", "Ивайло", "Иван Асен III"]
    },
    "Тертер": {
        heroes: ["Георги I Тертер", "Светослав Тертер", "Георги II Тертер", "Алдимир"]
    },
    "Даки": {
        heroes: [
            "Рубобост", "Оролес", "Дикомесе", "Котисо", "Буребиста", "Децебал", "Комозикус",
            "Скорпило", "Дурас", "Везина", "Диурпанеус", "Дромехет", "Залмоксис"
        ]
    },
    "Уния Траки": {
        heroes: [
            "Терей", "Диомед", "Ликург", "Рез", "Балакрос", "Вологез", "Ситас",
            "Дигилис", "Дидалс", "Никомед I", "Абруполис", "Раскупорис I", "Реметалк I",
            "Халес", "Сирм"
        ]
    },
    "Шишмановци": {
        heroes: ["Михаил Шишман", "Иван Александър", "Иван Шишман", "Иван Срацимир", "Белаур", "Фружин", "Иван Асен IV"]
    },
    "Македони": {
        heroes: ["Каран", "Пердика I", "Филип II", "Александър I", "Пердика II", "Архелай I", "Аминта III", "Филип II", "Александър III Велики", "Филип III", "Александър IV"]
    },
    "Птоломеи": {
        heroes: ["Птолемей I Сотер", "Птолемей II Филаделф", "Птолемей III Евергет", "Птолемей IV Филопатор", "Птолемей V Епифан", "Клеопатра VII"]
    },
    "Одриси": {
        heroes: ["Терес I", "Спарадок", "Ситалк", "Садок", "Хебризelm", "Берисад", "Амадок I", "Котис I", "Керсеблепт", "Плеврат", "Диагилис", "Севт III"]
    },
    "Бесараб": {
        heroes: ["Иванко Бесараб", "Мирчо Стари", "Влад III Дракула", "Раду Красивия", "Басараб I", "Михаил Храбри"]
    },
    "Османци Дуло": {
        heroes: ["Ертугрул", "Осман I", "Орхан I", "Мурад I", "Баязид I"]
    },
    "Скити": {
        heroes: ["Атеас", "Идантирс", "Томирис", "Скилурус", "Палакус", "Спаргапит", "Ликос", "Гнурус", "Саулиус"]
    }
};

// Глобален масив за съхранение на отключените/наетите герои на играча
window.unlockedLeaders = window.unlockedLeaders || [];

/**
ФУНКЦИЯ: Показване на Таверната за отключване на нови Герои директно от базата на съответния Клан
*/
window.openTavernUI = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Списък с вече наетите имена (trim() за сигурност срещу стари запазени данни с интервали)
    const hiredNames = window.unlockedLeaders.map(l => (l.name || '').trim());
    if (window.currentHero && !hiredNames.includes((window.currentHero.name || '').trim())) {
        hiredNames.push((window.currentHero.name || '').trim());
    }

    let htmlContent = `
    <div id="tavern-screen" style="padding:20px; background: rgba(10,10,10,0.98); border: 2px solid #d4af37; color: white; font-family: 'Cinzel', serif; box-sizing: border-box;">
        <h2 style="margin-top:0; color:#ffd700; text-transform:uppercase; text-align:center; letter-spacing:1px;">🍻 Военен съвет и Наемане на Герои </h2>
        <p style="font-size:11px; color:#aaa; text-align:center; margin-bottom:20px;">Отключвайте свободни герои от наличните кланове, за да ги добавяте към армията си.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 5px;">
    `;

    let availableCount = 0;

    // Обхождаме динамично твоите 13 клана и техните списъци с герои
    Object.keys(window.clans).forEach(clanName => {
        const clanData = window.clans[clanName];
        clanData.heroes.forEach(heroName => {
            const cleanHeroName = heroName.trim();
            if (!hiredNames.includes(cleanHeroName)) {
                availableCount++;

                // Динамично изчисляване на цена и показатели
                let cost = 800;
                let heroPower = 130;

                // Легендарни бонуси
                if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(cleanHeroName)) {
                    cost = 1500;
                    heroPower = 190;
                } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(cleanHeroName)) {
                    cost = 1200;
                    heroPower = 165;
                }

                htmlContent += `
                <div style="background: rgba(20,20,20,0.8); border: 1px solid #444; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                            <strong style="color:#ffd700; font-size:13px;">${cleanHeroName}</strong>
                            <span style="font-size:9px; background:#d4af37; color:#000; padding:1px 5px; font-weight:bold; border-radius:3px;">${clanName}</span>
                        </div>
                        <div style="font-size:10px; color:#ccc; margin-bottom:10px;">
                           ⚔️ Бойна мощ: <strong>${heroPower}</strong><br>
                           🛡️ Лична гвардия: <strong>200 бойци</strong>
                        </div>
                    </div>
                    <button onclick="window.hireClanHero('${cleanHeroName}', '${clanName}', ${cost}, ${heroPower})" style="width:100%; background:#d4af37; color:#000; border:none; padding:6px; font-weight:bold; cursor:pointer; text-transform:uppercase; border-radius:4px; font-size:10px;">
                       Отключи за 💰 ${cost}
                    </button>
                </div>`;
            }
        });
    });

    if (availableCount === 0) {
        htmlContent += `<div style="grid-column: 1/-1; text-align:center; padding:30px; color:#666;">Всички достъпни герои от родовите кланове са успешно отключени!</div>`;
    }

    // Поправен затварящ HTML (премахнати счупени backticks и escaped quotes)
    htmlContent += `</div>
    <button class="menu-btn" onclick="if(window.backToMainMenu) window.backToMainMenu();" style="width: 100%; margin-top: 15px;">Назад към Главното Меню</button>
    </div>`;

    mainArea.innerHTML = htmlContent;
};

/**
ФУНКЦИЯ: Механика за отключване на избрания герой и добавянето му към списъка
*/
window.hireClanHero = function(heroName, clanName, cost, heroPower) {
    if (!window.currentHero) return;
    if (window.currentHero.gold >= cost) {
        window.currentHero.gold -= cost;

        // Унифицирана структура, синхронизирана с logic.js и rpg_system.js
        const newHero = {
            name: heroName,
            clan: clanName, // Промених от dynasty на clan за съвместимост
            gold: 400,
            armySize: 200,
            currentArmy: 200,
            heroPower: heroPower,
            level: 1,
            xp: 0,
            skillPoints: 0,
            equipment: Array(9).fill(null), // Задължително за RPG системата
            skills: { tactics: 0, endurance: 0, economy: 0 },
            storedXP: 0,
            isAuto: false
        };

        // Задействане на RPG структурата, ако съществува
        if (window.initializeHeroRPGData) {
            window.initializeHeroRPGData(newHero);
        }

        window.unlockedLeaders.push(newHero);

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(` ОТКЛЮЧВАНЕ: Героят ${heroName} от Клан ${clanName} влезе в състава на верноподаниците ни!`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        window.openTavernUI(); // Опресняване на таверната
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато, за да убедите този герой да се присъедини!");
        }
    }
};

/**
Подсигурява, че главният герой винаги присъства в отключените водачи още при стартиране
*/
window.ensureStartingUnlockedLeaders = function() {
    if (window.currentHero) {
        const dynamicHired = window.unlockedLeaders.find(l => (l.name || '').trim() === (window.currentHero.name || '').trim());
        if (!dynamicHired) {
            window.unlockedLeaders.push(window.currentHero);
        }
    }
};

/** МОДУЛ: БАЗА ДАННИ & ТАВЕРНА - АДАПТИВНА */
window.clans = {
    "Дуло": { heroes: ["Атила", "Кубрат", "Аспарух"] },
    "Комитопули": { heroes: ["Самуил", "Давид"] },
    "Асеневци": { heroes: ["Асен I", "Иван Асен II"] }
};
window.unlockedLeaders = window.unlockedLeaders || [];

window.hireClanHero = function(name, clan, cost, power) {
    if ((window.currentHero.gold || 0) < cost) {
        if(window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато!");
        return;
    }
    window.currentHero.gold -= cost;
    window.unlockedLeaders.push({ name, clan, level:1, xp:0, gold:100, armySize:100, heroPower:power, skills:{tactics:0,endurance:0,economy:0}, equipment:Array(9).fill(null) });
    if(window.showAdvisorMsg) window.showAdvisorMsg(`👑 ${name} от род ${clan} се присъедини!`);
    window.openTavernUI();
};

// 📱 МОБИЛНА ТАВЕРНА
window.openTavernUI = function() {
    const main = document.getElementById('game-main-area'); if(!main) return;
    const hired = window.unlockedLeaders.map(l => l.name);
    if(window.currentHero && !hired.includes(window.currentHero.name)) hired.push(window.currentHero.name);
    
    let html = `<h2 style="color:#ffd700;margin:0 0 10px 0;text-align:center;">🍻 ТАВЕРНА</h2><div style="display:grid;gap:8px;max-height:70vh;overflow-y:auto;padding-right:5px;">`;
    
    Object.entries(window.clans).forEach(([c, d]) => {
        d.heroes.forEach(h => {
            if(!hired.includes(h)) {
                let cost = 500;
                html += `<div style="background:rgba(20,20,20,0.8);border:1px solid #444;padding:10px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
                    <div><div style="color:#ffd700;font-weight:bold;">${h}</div><div style="font-size:10px;color:#aaa;">Род ${c} | ⚔️ 200</div></div>
                    <button onclick="window.hireClanHero('${h}','${c}',${cost},150)" style="background:#d4af37;border:none;padding:5px 10px;font-weight:bold;border-radius:4px;">💰${cost}</button>
                </div>`;
            }
        });
    });
    html += `</div><button class="menu-btn" onclick="if(window.backToMainMenu)window.backToMainMenu();" style="width:100%;margin-top:10px;">Назад</button>`;
    main.innerHTML = `<div style="background:rgba(10,10,10,0.95);border:2px solid #d4af37;padding:15px;border-radius:8px;position:relative;">
        <button onclick="if(window.backToMainMenu)window.backToMainMenu();" style="position:absolute;top:5px;right:10px;background:none;border:none;color:#ff3366;font-size:20px;cursor:pointer;">✕</button>
        ${html}</div>`;
};
