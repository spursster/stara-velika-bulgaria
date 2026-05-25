/**
 * МОДУЛ: БАЗА ДАННИ - Велика България
 * ВСИЧКИ СА ГЕРОИ (HEROES) – НЯМА ВОДАЧИ, НЯМА ЙЕРАРХИЯ
 * 13 РАВНОПРАВНИ КЛАНОВЕ
 */

window.bulgarianClans = {
    "Дуло": {
        founder: "Болгарос",
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
        founder: "Никола",
        heroes: ["Давид", "Мойсей", "Роман", "Самуил", "Гаврил Радомир", "Иван Владислав", "Пресиян II"]
    },
    "Асеневци": {
        founder: "Асен I",
        heroes: ["Иван Асен I", "Петър IV", "Калоян", "Борил", "Иван Асен II", "Калиман Асен I", "Михаил II Асен", "Калиман Асен II", "Мицо Асен", "Константин Тих Асен", "Ивайло", "Иван Асен III"]
    },
    "Тертер": {
        founder: "Георги Тертер I",
        heroes: ["Георги Тертер I", "Смилец", "Чака", "Теодор Светослав", "Георги Тертер II"]
    },
    "Даки": {
        founder: "Буребиста",
        heroes: ["Буребиста", "Децебал", "Котисон", "Комосикус", "Скорпило", "Диурпанеус"]
    },
    "Уния Траки": {
        founder: "Трак",
        heroes: [
            "Терей", "Диомед", "Ликург", "Рез", "Балакрос", "Вологез", "Ситас", 
            "Дигилис", "Дидалс", "Никомед I", "Абруполис", "Раскупорис I", "Реметалк I", 
            "Халес", "Сирм"
        ]
    },
    "Шишмановци": {
        founder: "Шишман",
        heroes: ["Михаил III Шишман", "Иван Александър", "Иван Шишман", "Иван Срацимир", "Белаур", "Фружин", "Иван Асен IV"]
    },
    "Македони": {
        founder: "Филип II",
        heroes: ["Каран", "Пердика I", "Александър I", "Пердика II", "Архелай I", "Аминта III", "Филип II", "Александър III Велики", "Филип III", "Александър IV"]
    },
    "Птоломеи": {
        founder: "Птолемей I Сотер",
        heroes: ["Птолемей I Сотер", "Птолемей II Филаделф", "Птолемей III Евергет", "Птолемей IV Филопатор", "Птолемей V Епифан", "Клеопатра VII"]
    },
    "Одриси": {
        founder: "Терес I",
        heroes: ["Терес I", "Спарадок", "Ситалк", "Садок", "Хебризелм", "Берисад", "Амадок I", "Котис I", "Керсеблепт", "Севт III"]
    },
    "Бесараб": {
        founder: "Басараб I Основател",
        heroes: [
            "Мишеслав", "Сенеслав", "Литовой", "Бербат", "Раду Черния", "Тихомир", 
            "Владислав I", "Михаил I", "Раду III Красивия", "Басараб III Стария", "Раду IV Велики"
        ]
    },
    "Османци Дуло": {
        founder: "Осман I",
        heroes: ["Осман I Гази", "Орхан", "Мурад I", "Баязид I", "Мехмед I", "Мурад II", "Мехмед II Завоевателя", "Селим I", "Сюлейман Великолепни"]
    },
    "Скити": {
        founder: "Ишпакай",
        heroes: ["Пртатуа", "Мадий", "Савлий", "Иданфирс", "Ариант", "Ариапит", "Скил", "Атей", "Канит", "Тануза"]
    }
};

// Глобален масив за могъщи герои (ако се използва някъде)
window.mightyHeroes = [];

// За съвместимост със стари имена (ако някой друг модул очаква bulgarianDynasties)
window.bulgarianDynasties = window.bulgarianClans;

// Съвместимост с clansDatabase
if (!window.clansDatabase) {
    window.clansDatabase = {};
    for (let clanName in window.bulgarianClans) {
        window.clansDatabase[clanName] = {
            heroes: window.bulgarianClans[clanName].heroes
        };
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ ГЕРОИ В СВЕТА ====================
window.initializeAllHeroesInWorld = function() {
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.heroes) window.worldData.heroes = {};   // променено от clans на heroes? Внимание: другаде се използва worldData.clans. За съвместимост запазваме и двете.
    if (!window.worldData.clans) window.worldData.clans = {};     // запазваме clans за съвместимост
    
    let addedCount = 0;
    for (let clanName in window.bulgarianClans) {
        const heroesList = window.bulgarianClans[clanName].heroes;
        for (let heroName of heroesList) {
            // Проверка за съществуване
            let exists = false;
            for (let key in window.worldData.clans) {
                let existing = window.worldData.clans[key];
                if (existing.name === heroName && existing.clan === clanName) {
                    exists = true;
                    break;
                }
            }
            if (exists) continue;
            
            const heroId = `hero_${clanName}_${heroName.replace(/\s/g, '_')}`;
            let power = 100, gold = 1000, armySize = 200, className = "Воевода";
            if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(heroName)) {
                power = 190; gold = 2000; armySize = 400; className = "Легенда";
            } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(heroName)) {
                power = 165; gold = 1500; armySize = 300; className = "Герой";
            } else if (["Аспарух", "Тервел", "Крум", "Калоян", "Борис I"].includes(heroName)) {
                power = 130; gold = 1200; armySize = 250; className = "Войн";
            }
            
            const hero = {
                name: heroName,
                clan: clanName,
                isJoined: false,
                isFavorite: false,           // вместо isFavoriteInBarracks
                level: 1,
                xp: 0,
                heroPower: power,
                power: power,
                gold: gold,
                armySize: armySize,
                currentArmy: armySize,
                currentClass: className,
                className: className,
                age: 30 + Math.floor(Math.random() * 30),
                isAuto: true,
                skillPoints: 0,
                skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
                equipment: Array(12).fill(null),
                inventory: [],
                pet: null,
                learnedSkills: {},
                armyDetails: {
                    infantry: Math.floor(armySize * 0.5),
                    archers: Math.floor(armySize * 0.25),
                    cavalry: Math.floor(armySize * 0.15),
                    elite: Math.floor(armySize * 0.1)
                }
            };
            if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
            if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero);
            window.worldData.clans[heroId] = hero;
            // Дублираме и в heroes за по-новата структура (по желание)
            if (window.worldData.heroes) window.worldData.heroes[heroId] = hero;
            addedCount++;
        }
    }
    console.log(`✅ Добавени ${addedCount} нови герои (без дублиране).`);
};

// ==================== КРЪЧМА – ПОКАЗВА САМО НЕНАЕТИТЕ ГЕРОИ ====================
function getAllHeroesFromWorld() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true) heroes.push(hero);
        }
    }
    if (heroes.length === 0 && window.currentHero) heroes.push(window.currentHero);
    return heroes;
}

window.openTavernUI = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;
    
    let availableHeroes = [];
    for (let key in window.worldData.clans) {
        let hero = window.worldData.clans[key];
        if (hero.isJoined === false) {
            availableHeroes.push({ id: key, ...hero });
        }
    }
    
    if (availableHeroes.length === 0) {
        mainArea.innerHTML = `<div style="padding:20px; text-align:center; color:#888;">Няма повече герои за наемане. Всички са вече във вашата дружина!</div>`;
        return;
    }
    
    let htmlContent = `
    <div id="tavern-screen" style="padding:20px; background: rgba(10,10,10,0.98); border: 2px solid #d4af37; color: white; font-family: 'Cinzel', serif; box-sizing: border-box; position:relative;">
        <button onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload()" style="position: absolute; top: 10px; left: 10px; width: 36px; height: 36px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 18px; cursor: pointer;">✕</button>
        <h2 style="margin-top:0; color:#ffd700; text-transform:uppercase; text-align:center; letter-spacing:1px;">🍻 Военен съвет и Наемане на Герои</h2>
        <p style="font-size:11px; color:#aaa; text-align:center; margin-bottom:20px;">Изберете герой, който да се присъедини към вашия род.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 5px;">`;
    
    for (let hero of availableHeroes) {
        let cost = 800;
        let heroPower = hero.heroPower || 130;
        if (hero.currentClass === "Легенда") { cost = 1500; heroPower = 190; }
        else if (hero.currentClass === "Герой") { cost = 1200; heroPower = 165; }
        else if (hero.currentClass === "Войн") { cost = 1000; heroPower = 140; }
        
        htmlContent += `
        <div style="background: rgba(20,20,20,0.8); border: 1px solid #444; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <strong style="color:#ffd700; font-size:13px;">${hero.name}</strong>
                    <span style="font-size:9px; background:#d4af37; color:#000; padding:1px 5px; font-weight:bold; border-radius:3px;">${hero.clan}</span>
                </div>
                <div style="font-size:10px; color:#ccc; margin-bottom:10px;">
                   ⚔️ Бойна мощ: <strong>${heroPower}</strong><br>
                   🛡️ Лична гвардия: <strong>${hero.armySize} бойци</strong>
                </div>
            </div>
            <button onclick="window.hireExistingHero('${hero.id}', ${cost})" style="width:100%; background:#d4af37; color:#000; border:none; padding:6px; font-weight:bold; cursor:pointer; text-transform:uppercase; border-radius:4px; font-size:10px;">
               Отключи за 💰 ${cost}
            </button>
        </div>`;
    }
    htmlContent += `</div><button class="menu-btn" onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload();" style="width: 100%; margin-top: 15px;">Назад към Главното Меню</button></div>`;
    mainArea.innerHTML = htmlContent;
};

// ==================== НАЕМАНЕ НА СЪЩЕСТВУВАЩ ГЕРОЙ ====================
window.hireExistingHero = function(heroId, cost) {
    if (!window.currentHero) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Няма активен герой!", "error");
        return;
    }
    const hero = window.worldData.clans[heroId];
    if (!hero || hero.isJoined !== false) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Този герой вече е нает или не съществува!", "error");
        return;
    }
    
    if (window.currentHero.gold >= cost) {
        window.currentHero.gold -= cost;
        hero.isJoined = true;
        hero.isFavorite = false;  // новонаетите не са любими
        
        if (typeof window.generateHeroPortrait === 'function') {
            window.generateHeroPortrait(hero).catch(e => console.warn(e));
        }
        
        if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(hero);
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        window.openTavernUI();
        
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("УСПЕШНО НАЕМАНЕ", `${hero.name} от клан ${hero.clan} се присъедини! Останало злато: ${window.currentHero.gold}`, "success");
        } else if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`👑 ОТКЛЮЧВАНЕ: Героят ${hero.name} от Клан ${hero.clan} се присъедини!`);
        }
    } else {
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("ГРЕШКА", `Недостатъчно злато! Нужни: ${cost}`, "error");
        } else if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато!");
        }
    }
};

// ==================== СТАРИ ФУНКЦИИ ЗА СЪВМЕСТИМОСТ ====================
window.hireClanHero = function(heroName, clanName, cost, heroPower) {
    for (let key in window.worldData.clans) {
        let h = window.worldData.clans[key];
        if (h.name === heroName && h.clan === clanName && h.isJoined === false) {
            window.hireExistingHero(key, cost);
            return;
        }
    }
    if (window.showAdvisorMsg) window.showAdvisorMsg("Героят не е намерен или вече е нает!");
};

window.buyHeroFromDatabase = window.hireClanHero;
