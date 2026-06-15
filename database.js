/**
 * МОДУЛ: БАЗА ДАННИ - Велика България
 * ВСИЧКИ СА ГЕРОИ (HEROES) – НЯМА ВОДАЧИ, НЯМА ЙЕРАРХИЯ
 * 13 РАВНОПРАВНИ КЛАНОВЕ
 * ВЕРСИЯ: 8.0 – ДОБАВЕНИ НАЧАЛНИ КЛАСОВЕ (Heroes стил)
 */

window.bulgarianClans = {
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
        heroes: ["Давид", "Мойсей", "Роман", "Самуил", "Гаврил Радомир", "Иван Владислав", "Пресиян II"]
    },
    "Асеневци": {
        heroes: ["Иван Асен I", "Петър IV", "Калоян", "Борил", "Иван Асен II", "Калиман Асен I", "Михаил II Асен", "Калиман Асен II", "Мицо Асен", "Константин Тих Асен", "Ивайло", "Иван Асен III"]
    },
    "Тертер": {
        heroes: ["Георги Тертер I", "Смилец", "Чака", "Теодор Светослав", "Георги Тертер II"]
    },
    "Даки": {
        heroes: ["Буребиста", "Децебал", "Котисон", "Комосикус", "Скорпило", "Диурпанеус"]
    },
    "Уния Траки": {
        heroes: [
            "Терей", "Диомед", "Ликург", "Рез", "Балакрос", "Вологез", "Ситас", 
            "Дигилис", "Дидалс", "Никомед I", "Абруполис", "Раскупорис I", "Реметалк I", 
            "Халес", "Сирм"
        ]
    },
    "Шишмановци": {
        heroes: ["Михаил III Шишман", "Иван Александър", "Иван Шишман", "Иван Срацимир", "Белаур", "Фружин", "Иван Асен IV"]
    },
    "Македони": {
        heroes: ["Каран", "Филип II", "Пердика I", "Александър I", "Пердика II", "Архелай I", "Аминта III", "Александър III Велики", "Филип III", "Александър IV"]
    },
    "Птоломеи": {
        heroes: ["Птолемей I Сотер", "Птолемей II Филаделф", "Птолемей III Евергет", "Птолемей IV Филопатор", "Птолемей V Епифан", "Клеопатра VII"]
    },
    "Одриси": {
        heroes: ["Терес I", "Спарадок", "Ситалк", "Садок", "Хебризелм", "Берисад", "Амадок I", "Котис I", "Керсеблепт", "Севт III"]
    },
    "Бесараб": {
        heroes: [
            "Мишеслав", "Сенеслав", "Литовой", "Бербат", "Раду Черния", "Тихомир", 
            "Владислав I", "Михаил I", "Раду III Красивия", "Басараб III Стария", "Раду IV Велики"
        ]
    },
    "Османци Дуло": {
        heroes: ["Осман I Гази", "Орхан", "Мурад I", "Баязид I", "Мехмед I", "Мурад II", "Мехмед II Завоевателя", "Селим I", "Сюлейман Великолепни"]
    },
    "Скити": {
        heroes: ["Пртатуа", "Мадий", "Савлий", "Иданфирс", "Ариант", "Ариапит", "Скил", "Атей", "Канит", "Тануза"]
    }
};

window.mightyHeroes = [];
window.bulgarianDynasties = window.bulgarianClans;

if (!window.clansDatabase) {
    window.clansDatabase = {};
    for (let clanName in window.bulgarianClans) {
        window.clansDatabase[clanName] = {
            heroes: window.bulgarianClans[clanName].heroes
        };
    }
}

// ==================== НАЧАЛНИ КЛАСОВЕ (Heroes of Might and Magic стил) ====================
window.starterClasses = [
    { name: "Маг", icon: "🧙", bonuses: { heroPower: 15, mysticismBonus: 0.1, spellPower: 5 }, desc: "Владее магическите изкуства." },
    { name: "Стрелец", icon: "🏹", bonuses: { heroPower: 10, archeryBonus: 0.15, critChance: 0.05 }, desc: "Точен стрелец от разстояние." },
    { name: "Паладин", icon: "🛡️", bonuses: { heroPower: 20, defenseBonus: 10, moraleBonus: 10 }, desc: "Свещен воин със силна защита." },
    { name: "Берсерк", icon: "🗡️", bonuses: { heroPower: 25, critDamage: 0.2, damageReduction: -0.05 }, desc: "Жесток воин с бойна ярост." },
    { name: "Воевода", icon: "⚔️", bonuses: { heroPower: 15, armyBonus: 0.1, leadership: 5 }, desc: "Умел стратег и командир." },
    { name: "Крадец", icon: "🗡️", bonuses: { heroPower: 10, dodgeChance: 0.15, critChance: 0.1 }, desc: "Скрит убиец от сенките." },
    { name: "Жрец", icon: "🕊️", bonuses: { heroPower: 5, healBonus: 15, mysticismBonus: 0.15 }, desc: "Служител на божествената светлина." },
    { name: "Друид", icon: "🌿", bonuses: { heroPower: 10, natureDamage: 10, healAllies: 5 }, desc: "Пазител на природата." },
    { name: "Рицар", icon: "🏇", bonuses: { heroPower: 20, cavalryBonus: 0.2, defense: 10 }, desc: "Брониран конник." },
    { name: "Некромант", icon: "💀", bonuses: { heroPower: 15, darkMagic: 0.15, lifeSteal: 0.05 }, desc: "Повелител на мъртвите." },
    { name: "Елементалист", icon: "🌪️", bonuses: { heroPower: 12, elementalDamage: 15, manaRegen: 5 }, desc: "Господар на стихиите." },
    { name: "Инженер", icon: "🔧", bonuses: { heroPower: 8, siegeBonus: 0.2, buildCostReduction: 10 }, desc: "Майстор на обсадни машини." },
    { name: "Лечител", icon: "💚", bonuses: { heroPower: 5, healAmount: 20, regeneration: 5 }, desc: "Лекува раните на съюзниците." },
    { name: "Пазител", icon: "🛡️", bonuses: { heroPower: 18, defense: 15, hpBonus: 20 }, desc: "Непробиваема защита." }
];

// ==================== ПОМОЩНИ ФУНКЦИИ ЗА КЛАСОВЕ ====================
window.getRandomStarterClass = function() {
    if (!window.starterClasses || window.starterClasses.length === 0) {
        return { name: "Воевода", icon: "⚔️", bonuses: {}, desc: "" };
    }
    const randomIndex = Math.floor(Math.random() * window.starterClasses.length);
    return { ...window.starterClasses[randomIndex] };
};

window.applyClassToHero = function(hero, classObj) {
    if (!hero || !classObj) return;
    hero.currentClass = classObj.name;
    hero.className = classObj.name;
    hero.classIcon = classObj.icon;
    if (classObj.bonuses) {
        for (let [stat, value] of Object.entries(classObj.bonuses)) {
            if (stat === 'heroPower') hero.heroPower = (hero.heroPower || 100) + value;
            else if (stat === 'attackBonus') hero.attackBonus = (hero.attackBonus || 0) + value;
            else if (stat === 'defenseBonus') hero.defenseBonus = (hero.defenseBonus || 0) + value;
            else if (stat === 'defense') hero.defense = (hero.defense || 0) + value;
            else if (stat === 'critChance') hero.critChanceBonus = (hero.critChanceBonus || 0) + value;
            else if (stat === 'critDamage') hero.critDamageBonus = (hero.critDamageBonus || 0) + value;
            else if (stat === 'dodgeChance') hero.dodgeChance = (hero.dodgeChance || 0) + value;
            else if (stat === 'mysticismBonus') hero.mysticismBonus = (hero.mysticismBonus || 0) + value;
            else if (stat === 'armyBonus') hero.armyBonus = (hero.armyBonus || 0) + value;
            else if (stat === 'moraleBonus') hero.morale = Math.min(100, (hero.morale || 50) + value);
            else if (stat === 'healBonus') hero.healBonus = (hero.healBonus || 0) + value;
            else if (stat === 'healAmount') hero.healAmount = (hero.healAmount || 0) + value;
            else if (stat === 'natureDamage') hero.natureDamage = (hero.natureDamage || 0) + value;
            else if (stat === 'darkMagic') hero.darkMagic = (hero.darkMagic || 0) + value;
            else if (stat === 'lifeSteal') hero.lifeSteal = (hero.lifeSteal || 0) + value;
            else if (stat === 'spellPower') hero.spellPower = (hero.spellPower || 0) + value;
            else if (stat === 'elementalDamage') hero.elementalDamage = (hero.elementalDamage || 0) + value;
            else if (stat === 'manaRegen') hero.manaRegen = (hero.manaRegen || 0) + value;
            else if (stat === 'siegeBonus') hero.siegeBonus = (hero.siegeBonus || 0) + value;
            else if (stat === 'buildCostReduction') hero.buildCostReduction = (hero.buildCostReduction || 0) + value;
            else if (stat === 'regeneration') hero.regeneration = (hero.regeneration || 0) + value;
            else if (stat === 'hpBonus') hero.maxHp = (hero.maxHp || 100) + value;
            else if (stat === 'cavalryBonus') hero.cavalryBonus = (hero.cavalryBonus || 0) + value;
            else if (stat === 'archeryBonus') hero.archeryBonus = (hero.archeryBonus || 0) + value;
            else if (stat === 'leadership') hero.leadership = (hero.leadership || 0) + value;
        }
    }
    if (window.recalculateHeroPower) window.recalculateHeroPower(hero);
    if (window.recalculateHeroMaxHp) window.recalculateHeroMaxHp(hero);
};

// ==================== ПОМОЩНИ ФУНКЦИИ ЗА ВЗЕМАНЕ НА ПЛАЩАЩ ГЕРОЙ ====================
function getPayingHeroForHire() {
    if (window.gameMode === 'solo') return window.currentHero || null;
    if (typeof window.getSelectedHero === 'function') {
        let selected = window.getSelectedHero();
        if (selected && selected.isJoined && selected.isAlive !== false) return selected;
    }
    if (typeof window.getStrongestHero === 'function') {
        return window.getStrongestHero();
    }
    return null;
}

// ==================== ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ ГЕРОИ В СВЕТА ====================
window.initializeAllHeroesInWorld = function() {
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.heroes) window.worldData.heroes = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    
    let addedCount = 0;
    for (let clanName in window.bulgarianClans) {
        const heroesList = window.bulgarianClans[clanName].heroes;
        for (let heroName of heroesList) {
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
            let power = 100, gold = 1000, armySize = 200, specialClass = "Воевода";
            let isSpecial = false;
            if (["Александър III Велики", "Симеон Велики", "Кубрат", "Влад III Дракула"].includes(heroName)) {
                power = 190; gold = 2000; armySize = 400; specialClass = "Легенда"; isSpecial = true;
            } else if (["Атила", "Филип II", "Самуил", "Птолемей I Сотер"].includes(heroName)) {
                power = 165; gold = 1500; armySize = 300; specialClass = "Герой"; isSpecial = true;
            } else if (["Аспарух", "Тервел", "Крум", "Калоян", "Борис I"].includes(heroName)) {
                power = 130; gold = 1200; armySize = 250; specialClass = "Войн"; isSpecial = true;
            }
            
            // Избор на начален клас
            let starterClass = null;
            if (isSpecial) {
                starterClass = { name: specialClass, icon: "⭐", bonuses: { heroPower: power - 100 }, desc: "" };
            } else {
                starterClass = window.getRandomStarterClass();
                // Корекция на силата според класа
                if (starterClass.bonuses && starterClass.bonuses.heroPower) {
                    power += starterClass.bonuses.heroPower;
                }
            }
            
            const hero = {
                name: heroName,
                clan: clanName,
                isJoined: false,
                isFavorite: false,
                level: 1,
                xp: 0,
                heroPower: power,
                power: power,
                gold: gold,
                armySize: armySize,
                currentArmy: armySize,
                currentClass: starterClass.name,
                className: starterClass.name,
                classIcon: starterClass.icon,
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
            
            // Прилагане на бонусите от класа
            if (starterClass.bonuses) {
                for (let [stat, value] of Object.entries(starterClass.bonuses)) {
                    if (stat === 'heroPower') hero.heroPower = (hero.heroPower || 100) + value;
                    else if (stat === 'attackBonus') hero.attackBonus = (hero.attackBonus || 0) + value;
                    else if (stat === 'defenseBonus') hero.defenseBonus = (hero.defenseBonus || 0) + value;
                    else if (stat === 'defense') hero.defense = (hero.defense || 0) + value;
                    else if (stat === 'critChance') hero.critChanceBonus = (hero.critChanceBonus || 0) + value;
                    else if (stat === 'critDamage') hero.critDamageBonus = (hero.critDamageBonus || 0) + value;
                    else if (stat === 'dodgeChance') hero.dodgeChance = (hero.dodgeChance || 0) + value;
                    else if (stat === 'mysticismBonus') hero.mysticismBonus = (hero.mysticismBonus || 0) + value;
                    else if (stat === 'armyBonus') hero.armyBonus = (hero.armyBonus || 0) + value;
                    else if (stat === 'moraleBonus') hero.morale = Math.min(100, (hero.morale || 50) + value);
                    else if (stat === 'healBonus') hero.healBonus = (hero.healBonus || 0) + value;
                    // останалите бонуси могат да се добавят при нужда
                }
            }
            
            if (typeof window.initializeHeroRPGData === 'function') window.initializeHeroRPGData(hero);
            if (typeof window.ensureCompleteArmyDetails === 'function') window.ensureCompleteArmyDetails(hero);
            window.worldData.clans[heroId] = hero;
            if (window.worldData.heroes) window.worldData.heroes[heroId] = hero;
            addedCount++;
        }
    }
    console.log(`✅ Добавени ${addedCount} нови герои с разнообразни начални класове.`);
};

// ==================== ВЗИМАНЕ НА ВСИЧКИ НАЕТИ ГЕРОИ ====================
function getAllHeroesFromWorld() {
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined === true) heroes.push(hero);
        }
    }
    if (heroes.length === 0) {
        let fallback = null;
        if (window.gameMode === 'solo') {
            fallback = window.currentHero;
        } else {
            if (typeof window.getStrongestHero === 'function') fallback = window.getStrongestHero();
            if (!fallback && typeof window.getSelectedHero === 'function') fallback = window.getSelectedHero();
        }
        if (fallback) heroes.push(fallback);
    }
    return heroes;
}

// Дефиниране на backToMainMenu, ако липсва
if (typeof window.backToMainMenu !== 'function') {
    window.backToMainMenu = function() {
        if (typeof window.location !== 'undefined') {
            window.location.reload();
        } else {
            console.warn("backToMainMenu не е дефинирана и няма location за презареждане.");
        }
    };
}

// ==================== ТАВЕРНА UI ====================
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
                   🛡️ Лична гвардия: <strong>${hero.armySize} бойци</strong><br>
                   🎭 Клас: <strong>${hero.currentClass || "Воевода"}</strong>
                </div>
            </div>
            <button onclick="window.hireExistingHero('${hero.id}', ${cost})" style="width:100%; background:#d4af37; color:#000; border:none; padding:6px; font-weight:bold; cursor:pointer; text-transform:uppercase; border-radius:4px; font-size:10px;">
               Отключи за 💰 ${cost}
            </button>
        </div>`;
    }
    
    // Раздел за женски владетелки
    if (window.femaleWorldRulers && window.femaleWorldRulers.length > 0) {
        htmlContent += `<hr style="margin:20px 0; border-color:#d4af37;"><h3 style="color:#ffd700; text-align:center;">👑 Чуждоземни владетелки</h3>`;
        for (let ruler of window.femaleWorldRulers) {
            let alreadyHired = false;
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.name === ruler.name || (h.name && h.name.includes(ruler.name))) {
                    alreadyHired = true;
                    break;
                }
            }
            if (alreadyHired) continue;
            
            htmlContent += `
            <div style="background: rgba(20,20,20,0.8); border: 1px solid #d4af37; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <strong style="color:#ffd700; font-size:13px;">${ruler.flag} ${ruler.name}</strong>
                        <span style="font-size:9px; background:#d4af37; color:#000; padding:1px 5px; border-radius:3px;">${ruler.country}</span>
                    </div>
                    <div style="font-size:10px; color:#ccc; margin-bottom:10px;">
                       ⚔️ Бойна мощ: <strong>${ruler.power}</strong><br>
                       🎭 Клас: <strong>${ruler.class}</strong>
                    </div>
                </div>
                <button onclick="window.hireFemaleRuler('${ruler.name.replace(/'/g, "\\'")}', ${ruler.cost}, ${ruler.power}, '${ruler.class}', '${ruler.flag}', '${ruler.country}')" style="width:100%; background:#d4af37; color:#000; border:none; padding:6px; font-weight:bold; cursor:pointer; border-radius:4px; font-size:10px;">
                   Отключи за 💰 ${ruler.cost}
                </button>
            </div>`;
        }
    }
    
    htmlContent += `</div><button class="menu-btn" onclick="window.backToMainMenu ? window.backToMainMenu() : location.reload();" style="width: 100%; margin-top: 15px;">Назад към Главното Меню</button></div>`;
    mainArea.innerHTML = htmlContent;
};

// ==================== НАЕМАНЕ НА СЪЩЕСТВУВАЩ ГЕРОЙ ====================
window.hireExistingHero = function(heroId, cost) {
    const payingHero = getPayingHeroForHire();
    if (!payingHero) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Няма герой, който да плати!", "error");
        if (typeof window.showJoinOffer === 'function' && !window.hasAnyAliveHero()) {
            window.showJoinOffer();
        }
        return;
    }
    const hero = window.worldData.clans[heroId];
    if (!hero || hero.isJoined !== false) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Този герой вече е нает или не съществува!", "error");
        return;
    }
    
    if (payingHero.gold >= cost) {
        payingHero.gold -= cost;
        hero.isJoined = true;
        hero.isFavorite = false;
        
        // Ако героят няма клас (или е "Воевода"), даваме му случаен начален клас
        if (!hero.currentClass || hero.currentClass === "Воевода") {
            const starterClass = window.getRandomStarterClass();
            window.applyClassToHero(hero, starterClass);
        }
        
        if (typeof window.generateHeroPortrait === 'function') {
            window.generateHeroPortrait(hero).catch(e => console.warn(e));
        }
        
        if (window.armyMarket && typeof window.armyMarket.sync === 'function') {
            window.armyMarket.sync();
        }
        if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(payingHero);
        if (typeof window.updateStrongestHeroUI === 'function') {
            window.updateStrongestHeroUI();
        }
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        window.openTavernUI();
        
        const successMsg = `${hero.name} от клан ${hero.clan} се присъедини! Останало злато на ${payingHero.name}: ${payingHero.gold}`;
        
        if (window.ChronicleEvents && typeof window.ChronicleEvents.generateHeroHired === 'function') {
            const ev = window.ChronicleEvents.generateHeroHired(hero, payingHero, cost);
            if (window.showAdvisorMsg) window.showAdvisorMsg(ev.message, ev.buttons);
        } else {
            if (window.showAdvisorPopup) {
                window.showAdvisorPopup("УСПЕШНО НАЕМАНЕ", successMsg, "success");
            } else if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`👑 ОТКЛЮЧВАНЕ: ${successMsg}`);
            }
        }
        
        if (window.addHeroLog) window.addHeroLog(payingHero, "🤝", `Нае ${hero.name} за ${cost} злато.`);
        if (window.addHeroLog) window.addHeroLog(hero, "🤝", `Присъедини се към дружината на ${payingHero.name}.`);
        
    } else {
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup("ГРЕШКА", `Недостатъчно злато! Нужни: ${cost}`, "error");
        } else if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато!");
        }
    }
};

// ==================== НАЕМАНЕ НА ЖЕНСКА ВЛАДЕТЕЛКА ====================
window.hireFemaleRuler = function(name, cost, power, className, flag, country) {
    const payingHero = getPayingHeroForHire();
    if (!payingHero) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", "Няма герой, който да плати!", "error");
        return;
    }
    if (payingHero.gold < cost) {
        if (window.showAdvisorPopup) window.showAdvisorPopup("ГРЕШКА", `Недостатъчно злато! Нужни: ${cost}`, "error");
        return;
    }
    payingHero.gold -= cost;

    const newHeroId = `ruler_${name.replace(/\s/g, '_')}_${Date.now()}`;
    const newHero = {
        name: `${flag} ${name}`,
        clan: country,
        isJoined: true,
        isFavorite: false,
        level: 1,
        xp: 0,
        heroPower: power,
        power: power,
        gold: 800,
        armySize: 200,
        currentArmy: 200,
        currentClass: className,
        className: className,
        classIcon: window.getClassIcon ? window.getClassIcon(className) : "👸",
        age: 30 + Math.floor(Math.random() * 30),
        isAuto: true,
        skillPoints: 0,
        skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
        equipment: Array(12).fill(null),
        inventory: [],
        pet: null,
        learnedSkills: {},
        armyDetails: { infantry: 100, archers: 50, cavalry: 30, elite: 20 },
        gender: "female"
    };
    if (typeof window.initializeHeroRPGData === 'function') window.initializeHeroRPGData(newHero);
    if (typeof window.ensureCompleteArmyDetails === 'function') window.ensureCompleteArmyDetails(newHero);
    if (typeof window.generateHeroPortrait === 'function') {
        window.generateHeroPortrait(newHero).catch(e => console.warn(e));
    }

    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newHeroId] = newHero;
    if (!window.unlockedHeroes) window.unlockedHeroes = [];
    window.unlockedHeroes.push(newHero);

    if (window.addWorldEvent) window.addWorldEvent("👑 НАЕТА ВЛАДЕТЕЛКА", `${newHero.name} се присъедини към вашата дружина!`, "👑");
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
    if (typeof window.updateAllUI === 'function') window.updateAllUI();
    window.openTavernUI();
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

// ==================== 50 ЖЕНСКИ ИСТОРИЧЕСКИ ВЛАДЕТЕЛКИ ====================
window.femaleWorldRulers = [
    { name: "Хатшепсут", country: "Египет", flag: "🇪🇬", power: 155, class: "Фараон", cost: 1250 },
    { name: "Томирис", country: "Саки", flag: "🇰🇿", power: 145, class: "Воителка", cost: 1100 },
    { name: "Артемизия I", country: "Кария", flag: "🇹🇷", power: 130, class: "Адмирал", cost: 1000 },
    { name: "Зенобия", country: "Палмира", flag: "🇸🇾", power: 140, class: "Владетелка", cost: 1150 },
    { name: "Боудица", country: "Британия", flag: "🇬🇧", power: 135, class: "Берсерк", cost: 1050 },
    { name: "Мада", country: "Индия", flag: "🇮🇳", power: 125, class: "Рани", cost: 950 },
    { name: "Семирамида", country: "Асирия", flag: "🇮🇶", power: 140, class: "Царица", cost: 1100 },
    { name: "Амаласунта", country: "Италия", flag: "🇮🇹", power: 130, class: "Кралица", cost: 1000 },
    { name: "Картли", country: "Грузия", flag: "🇬🇪", power: 120, class: "Царица", cost: 950 },
    { name: "Маниа", country: "Лидия", flag: "🇹🇷", power: 125, class: "Владетелка", cost: 980 },
    { name: "Олимпиада", country: "Епир", flag: "🇬🇷", power: 135, class: "Царица", cost: 1050 },
    { name: "Агрипина Стара", country: "Рим", flag: "🇮🇹", power: 130, class: "Патриция", cost: 1000 },
    { name: "Луцила", country: "Рим", flag: "🇮🇹", power: 125, class: "Августа", cost: 980 },
    { name: "Плотина", country: "Рим", flag: "🇮🇹", power: 128, class: "Августа", cost: 990 },
    { name: "Юлия Домна", country: "Рим", flag: "🇮🇹", power: 132, class: "Августа", cost: 1020 },
    { name: "Ирина Атинянка", country: "Византия", flag: "🇬🇷", power: 135, class: "Императрица", cost: 1050 },
    { name: "Теодора (Юстинианова)", country: "Византия", flag: "🇬🇷", power: 130, class: "Императрица", cost: 1000 },
    { name: "Елена Комнина", country: "Византия", flag: "🇬🇷", power: 125, class: "Императрица", cost: 980 },
    { name: "Олга Киевска", country: "Киевска Рус", flag: "🇺🇦", power: 140, class: "Княгиня", cost: 1100 },
    { name: "Елинор Аквитанска", country: "Англия", flag: "🇬🇧", power: 145, class: "Кралица", cost: 1150 },
    { name: "Матилда", country: "Англия", flag: "🇬🇧", power: 130, class: "Кралица", cost: 1020 },
    { name: "Бланка Кастилска", country: "Франция", flag: "🇫🇷", power: 135, class: "Регентка", cost: 1080 },
    { name: "Маргарет I Датска", country: "Дания", flag: "🇩🇰", power: 145, class: "Кралица", cost: 1150 },
    { name: "Тамара Грузинска", country: "Грузия", flag: "🇬🇪", power: 150, class: "Царица", cost: 1200 },
    { name: "Ядвига Полска", country: "Полша", flag: "🇵🇱", power: 135, class: "Кралица", cost: 1050 },
    { name: "Зоя Палеологина", country: "Византия", flag: "🇬🇷", power: 130, class: "Императрица", cost: 1000 },
    { name: "Ана Немска", country: "СРИ", flag: "🇩🇪", power: 128, class: "Императрица", cost: 990 },
    { name: "Катерина Корнар", country: "Кипър", flag: "🇨🇾", power: 125, class: "Кралица", cost: 980 },
    { name: "Изабела Френска", country: "Франция", flag: "🇫🇷", power: 132, class: "Кралица", cost: 1020 },
    { name: "Христина Шведска (ранна)", country: "Швеция", flag: "🇸🇪", power: 128, class: "Кралица", cost: 1000 },
    { name: "Екатерина Велика", country: "Русия", flag: "🇷🇺", power: 160, class: "Императрица", cost: 1400 },
    { name: "Елизабет I", country: "Англия", flag: "🇬🇧", power: 155, class: "Кралица", cost: 1300 },
    { name: "Изабела Кастилска", country: "Испания", flag: "🇪🇸", power: 150, class: "Кралица", cost: 1250 },
    { name: "Мария Терезия", country: "Австрия", flag: "🇦🇹", power: 150, class: "Ерцхерцогиня", cost: 1250 },
    { name: "Кристина Шведска", country: "Швеция", flag: "🇸🇪", power: 140, class: "Кралица", cost: 1150 },
    { name: "Катерина Сфорца", country: "Италия", flag: "🇮🇹", power: 135, class: "Кондотиер", cost: 1100 },
    { name: "Нур Джахан", country: "Индия", flag: "🇮🇳", power: 130, class: "Императрица", cost: 1050 },
    { name: "Лакшми Баи", country: "Индия", flag: "🇮🇳", power: 145, class: "Рани", cost: 1200 },
    { name: "Тахома", country: "САЩ", flag: "🇺🇸", power: 120, class: "Индианска вожд", cost: 900 },
    { name: "Виктория", country: "Великобритания", flag: "🇬🇧", power: 155, class: "Кралица", cost: 1300 },
    { name: "Луиза Датска", country: "Дания", flag: "🇩🇰", power: 135, class: "Кралица", cost: 1050 },
    { name: "Амалия Гръцка", country: "Гърция", flag: "🇬🇷", power: 130, class: "Кралица", cost: 1000 },
    { name: "Анна Стюарт", country: "Великобритания", flag: "🇬🇧", power: 140, class: "Кралица", cost: 1100 },
    { name: "Катарина Медичи", country: "Франция", flag: "🇫🇷", power: 135, class: "Регентка", cost: 1080 },
    { name: "Анна Австрийска", country: "Франция", flag: "🇫🇷", power: 132, class: "Кралица", cost: 1050 },
    { name: "София Шарлота", country: "Прусия", flag: "🇩🇪", power: 130, class: "Кралица", cost: 1020 },
    { name: "Мария Луиза", country: "Испания", flag: "🇪🇸", power: 128, class: "Кралица", cost: 1000 },
    { name: "Каролина Матилда", country: "Дания", flag: "🇩🇰", power: 125, class: "Кралица", cost: 980 },
    { name: "Мария-Антоанета", country: "Франция", flag: "🇫🇷", power: 140, class: "Кралица", cost: 1100 }
];

console.log("✅ database.js – версия 8.0 с разнообразни начални класове и бонуси");
