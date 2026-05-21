/**
 * МОДУЛ: БАЗА ДАННИ - Велика България
 * СТАТУС: АБСОЛЮТЕН И НЕПРОМЕНЯЕМ ЗАКОН (13 Равноправни Династии)
 * Всички данни са взети на 100% от текстовия закон на проекта без исторически филтри!
 * Статистика на файловете в проекта: 16
 */

window.bulgarianDynasties = {
    "Дуло": {
        founder: "Болгарос",
        rulers: [
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
        rulers: ["Давид", "Мойсей", "Роман", "Самуил", "Гаврил Радомир", "Иван Владислав", "Пресиян II"]
    },
    "Асеневци": {
        founder: "Асен I",
        rulers: ["Иван Асен I", "Петър IV", "Калоян", "Борил", "Иван Асен II", "Калиман Асен I", "Михаил II Асен", "Калиман Асен II", "Мицо Асен", "Константин Тих Асен", "Ивайло", "Иван Асен III"]
    },
    "Тертер": {
        founder: "Георги Тертер I",
        rulers: ["Георги Тертер I", "Смилец", "Чака", "Теодор Светослав", "Георги Тертер II"]
    },
    "Даки": {
        founder: "Буребиста",
        rulers: ["Буребиста", "Децебал", "Котисон", "Комосикус", "Скорпило", "Диурпанеус"]
    },
    "Уния Траки": {
        founder: "Трак",
        rulers: [
            "Терей", "Диомед", "Ликург", "Рез", "Балакрос", "Вологез", "Ситас", 
            "Дигилис", "Дидалс", "Никомед I", "Абруполис", "Раскупорис I", "Реметалк I", 
            "Халес", "Сирм"
        ]
    },
    "Шишмановци": {
        founder: "Шишман",
        rulers: ["Михаил III Шишман", "Иван Александър", "Иван Шишман", "Иван Срацимир", "Белаур", "Фружин", "Иван Асен IV"]
    },
    "Македони": {
        founder: "Филип II",
        rulers: ["Каран", "Пердика I", "Александър I", "Пердика II", "Архелай I", "Аминта III", "Филип II", "Александър III Велики", "Филип III", "Александър IV"]
    },
    "Птоломеи": {
        founder: "Птолемей I Сотер",
        rulers: ["Птолемей I Сотер", "Птолемей II Филаделф", "Птолемей III Евергет", "Птолемей IV Филопатор", "Птолемей V Епифан", "Клеопатра VII"]
    },
    "Одриси": {
        founder: "Терес I",
        rulers: ["Терес I", "Спарадок", "Ситалк", "Садок", "Хебризелм", "Берисад", "Амадок I", "Котис I", "Керсеблепт", "Севт III"]
    },
    "Бесараб": {
        founder: "Басараб I Основател",
        rulers: [
            "Мишеслав", "Сенеслав", "Литовой", "Бербат", "Раду Черния", "Тихомир", 
            "Владислав I", "Михаил I", "Раду III Красивия", "Басараб III Стария", "Раду IV Велики"
        ]
    },
    "Османци Дуло": {
        founder: "Осман I",
        rulers: ["Осман I Гази", "Орхан", "Мурад I", "Баязид I", "Мехмед I", "Мурад II", "Мехмед II Завоевателя", "Селим I", "Сюлейман Великолепни"]
    },
    "Скити": {
        founder: "Ишпакай",
        rulers: ["Пртатуа", "Мадий", "Савлий", "Иданфирс", "Ариант", "Ариапит", "Скил", "Атей", "Канит", "Тануза"]
    }
};

window.mightyLeaders = [];

// ==================== СЪВМЕСТИМОСТ С ОСТАНАЛИТЕ МОДУЛИ ====================
// Преобразуваме оригиналната структура във формата, който очаква играта (clansDatabase)
if (!window.clansDatabase) {
    window.clansDatabase = {};
    for (let dynastyName in window.bulgarianDynasties) {
        window.clansDatabase[dynastyName] = {
            heroes: window.bulgarianDynasties[dynastyName].rulers
        };
    }
}

// ==================== ФУНКЦИИ ЗА НАЕМАНЕ (КОРИГИРАНИ – AUTO РЕЖИМ) ====================
function getAllHeroesFromWorld() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let clan = window.worldData.clans[key];
            if (clan.isJoined === true) heroes.push(clan);
        }
    }
    if (heroes.length === 0 && window.currentHero) heroes.push(window.currentHero);
    return heroes;
}

window.openTavernUI = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;
    const existingHeroes = getAllHeroesFromWorld();
    const hiredNames = existingHeroes.map(h => (h.name || '').trim());
    if (window.currentHero && !hiredNames.includes((window.currentHero.name || '').trim())) {
        hiredNames.push((window.currentHero.name || '').trim());
    }

    let htmlContent = `
    <div id="tavern-screen" style="padding:20px; background: rgba(10,10,10,0.98); border: 2px solid #d4af37; color: white; font-family: 'Cinzel', serif; box-sizing: border-box;">
        <button onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload()" style="position: absolute; top: 10px; left: 10px; width: 36px; height: 36px; background: rgba(0,0,0,0.6); border: 1px solid #ff4444; color: #ff4444; border-radius: 50%; font-size: 18px; cursor: pointer;">✕</button>
        <h2 style="margin-top:0; color:#ffd700; text-transform:uppercase; text-align:center; letter-spacing:1px;">🍻 Военен съвет и Наемане на Герои</h2>
        <p style="font-size:11px; color:#aaa; text-align:center; margin-bottom:20px;">Отключвайте свободни герои от наличните кланове.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 5px;">`;

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
                    cost = 1500; heroPower = 190;
                } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(cleanHeroName)) {
                    cost = 1200; heroPower = 165;
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
    htmlContent += `</div><button class="menu-btn" onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload();" style="width: 100%; margin-top: 15px;">Назад към Главното Меню</button></div>`;
    mainArea.innerHTML = htmlContent;
};

window.hireClanHero = function(heroName, clanName, cost, heroPower) {
    if (!window.currentHero) return;
    if (window.currentHero.gold >= cost) {
        window.currentHero.gold -= cost;
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
            isAuto: true,        // ⭐ Автоматично трупане на XP
            skillPoints: 0,
            skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
            equipment: Array(12).fill(null),
            inventory: Array(12).fill(null),
            pet: null,
            armyDetails: {
                infantry: 100, archers: 50, cavalry: 30, elite: 20,
                vampire:0, werewolf:0, highelf:0, troll:0, dragon_young:0, wizard:0, lich:0, fairy_healer:0,
                bear_ancient:0, harpy:0, mermaid:0, genie:0, vampire_queen:0, ice_dragon:0, ogre_mage:0,
                dark_elf:0, alpha_werewolf:0, stone_troll:0, archmage:0, demon:0, ancient_vampire:0,
                weird_witch:0, griffin:0, golden_dragon:0, elf_archer:0, swamp_troll:0, necromancer:0,
                vampire_samurai:0, bronze_dragon:0, titan:0
            }
        };
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(newHero);
        if (!window.worldData) window.worldData = {};
        if (!window.worldData.clans) window.worldData.clans = {};
        const newId = "hero_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        window.worldData.clans[newId] = newHero;
        if (!window.unlockedLeaders) window.unlockedLeaders = [];
        window.unlockedLeaders.push(newHero);
        if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(newHero);
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        window.openTavernUI();
        if (window.showAdvisorMsg) window.showAdvisorMsg(`👑 ОТКЛЮЧВАНЕ: Героят ${heroName} от Клан ${clanName} се присъедини!`);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато!");
    }
};

window.buyHeroFromDatabase = window.hireClanHero;
