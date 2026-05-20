/**
==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: database.js (БАЗА ДАННИ ЗА ГЕРОИ И ТАВЕРНА)
СТАТУС: ОБНОВЕН - СИНХРОНИЗИРАН С НОВАТА СИСТЕМА (12 СЛОТА, worldData.clans)
==========================================================================
*/

// ==================== БАЗА ДАННИ С ГЕРОИ (13-ТЕ КЛАНОВА) ====================
window.clansDatabase = {
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
        heroes: ["Рубобост", "Оролес", "Дикомесе", "Котисо", "Буребиста", "Децебал", "Комозикус", "Скорпило", "Дурас", "Везина", "Диурпанеус", "Дромехет", "Залмоксис"]
    },
    "Уния Траки": {
        heroes: ["Терей", "Диомед", "Ликург", "Рез", "Балакрос", "Вологез", "Ситас", "Дигилис", "Дидалс", "Никомед I", "Абруполис", "Раскупорис I", "Реметалк I", "Халес", "Сирм"]
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

// ==================== ПОМОЩНА ФУНКЦИЯ ЗА ПОЛУЧАВАНЕ НА ВСИЧКИ ГЕРОИ ====================
function getAllHeroesFromWorld() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) {
                heroes.push(clan);
            }
        }
    }
    if (heroes.length === 0 && window.currentHero) {
        heroes.push(window.currentHero);
    }
    return heroes;
}

// ==================== ТАВЕРНА ====================
window.openTavernUI = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Взимаме вече наетите герои от worldData.clans
    const existingHeroes = getAllHeroesFromWorld();
    const hiredNames = existingHeroes.map(h => (h.name || '').trim());
    
    if (window.currentHero && !hiredNames.includes((window.currentHero.name || '').trim())) {
        hiredNames.push((window.currentHero.name || '').trim());
    }

    let htmlContent = `
    <div id="tavern-screen" style="padding:20px; background: rgba(10,10,10,0.98); border: 2px solid #d4af37; color: white; font-family: 'Cinzel', serif; box-sizing: border-box;">
        <button onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload()" style="position: absolute; top: 10px; left: 10px; width: 36px; height: 36px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 18px; cursor: pointer; z-index: 101; display: flex; align-items: center; justify-content: center;">✕</button>
        <h2 style="margin-top:0; color:#ffd700; text-transform:uppercase; text-align:center; letter-spacing:1px;">🍻 Военен съвет и Наемане на Герои</h2>
        <p style="font-size:11px; color:#aaa; text-align:center; margin-bottom:20px;">Отключвайте свободни герои от наличните кланове, за да ги добавяте към армията си.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 5px;">
    `;

    let availableCount = 0;

    for (let clanName in window.clansDatabase) {
        const clanData = window.clansDatabase[clanName];
        for (let heroName of clanData.heroes) {
            const cleanHeroName = heroName.trim();
            if (!hiredNames.includes(cleanHeroName)) {
                availableCount++;
                let cost = 800;
                let heroPower = 130;

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
        }
    }

    if (availableCount === 0) {
        htmlContent += `<div style="grid-column: 1/-1; text-align:center; padding:30px; color:#666;">Всички достъпни герои от родовите кланове са успешно отключени!</div>`;
    }

    htmlContent += `</div>
    <button class="menu-btn" onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload();" style="width: 100%; margin-top: 15px;">Назад към Главното Меню</button>
    </div>`;

    mainArea.innerHTML = htmlContent;
};

// ==================== НАЕМАНЕ НА ГЕРОЙ ОТ ТАВЕРНАТА ====================
window.hireClanHero = function(heroName, clanName, cost, heroPower) {
    if (!window.currentHero) return;
    if (window.currentHero.gold >= cost) {
        window.currentHero.gold -= cost;

        // Създаваме нов герой с 12 слота (синхронизиран с новата система)
        const newHero = {
            name: heroName,
            leaderName: heroName,
            clan: clanName,
            isJoined: true,
            level: 1,
            xp: 0,
            heroPower: heroPower,
            power: heroPower,
            gold: 1500,
            armySize: 200,
            currentArmy: 200,
            currentClass: "Воевода",
            className: "Воевода",
            age: 30,
            isAuto: false,
            skillPoints: 0,
            skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
            equipment: Array(12).fill(null),
            inventory: Array(12).fill(null),
            pet: null
        };

        if (window.initializeHeroRPGData) {
            window.initializeHeroRPGData(newHero);
        }

        // Добавяме в worldData.clans
        if (!window.worldData) window.worldData = {};
        if (!window.worldData.clans) window.worldData.clans = {};
        const newId = "hero_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        window.worldData.clans[newId] = newHero;

        // Обновяваме UI
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        
        window.openTavernUI();

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`👑 ОТКЛЮЧВАНЕ: Героят ${heroName} от Клан ${clanName} се присъедини!`);
        }
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато!");
        }
    }
};

// ==================== АЛИАС ЗА СЪВМЕСТИМОСТ ====================
window.buyHeroFromDatabase = window.hireClanHero;
