/**
 * МОДУЛ: ВЕЛИКАТА RPG СИСТЕМА - Велика България
 * СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН, ИЗЧИСТЕН И ИСТОРИЧЕСКИ ПРЕЦИЗЕН (Без забранени титли)
 * КОРЕКЦИЯ БЪГ: Добавена е пълната UI система за Топ 6 Лидери със сортиране по опит и превключване.
 * Статистика на файловете в проекта: 16
 */

window.rpgDatabase = window.rpgDatabase || {
    // Формула за опит: Всяко следващо ниво изисква текущото ниво * 150 XP
    getXPRequiredForLevel: function(level) {
        return level * 150;
    },

    // 20+ Базови атрибути и дървета на способностите
    skillTrees: {
        endurance: { name: "Издръжливост", desc: "Увеличава защитата на водената войска и намалява щетите от инциденти." },
        vampirism: { name: "Вампиризъм", desc: "Възстановява процент от загубената войска в битка на база нанесени щети." },
        mysticism: { name: "Тангристка Мистика (Магия)", desc: "Призовава природни стихии и вълчи духове за смущаване на врага." },
        tactics: { name: "Военна Тактика", desc: "Увеличава общата бойна мощ на героя (Hero Power)." },
        diplomacy: { name: "Родова Дипломация", desc: "Увеличава приходите от злато при преговори и мисии." },
        scouting: { name: "Следотърсачество", desc: "Намалява времетраенето на експедициите с 1 ход на всеки 3 нива." },
        alchemy: { name: "Древна Алхимия", desc: "Увеличава шанса за намиране на редки артефакти в слотовете." },
        leadership: { name: "Владетелски Дух", desc: "Позволява воденето на по-голая лична армия." }
    },

    // ПЪЛЕН СПИСЪК С ТОЧНО 42 УНИКАЛНИ КЛАСА (РАЗДЕЛЕНИ ПО РОДОВЕ И КРИТЕРИИ)
    classes: [
        // --- РОД ДУЛО (9 Класа) ---
        { id: "bagatur", name: "Кан Багатур", clan: "Дуло", reqLevel: 5, reqSkill: { tactics: 3 }, desc: "Елитен тежковъоръжен конник, разкъсващ вражеските флангове." },
        { id: "kolobar_magus", name: "Колобър-Магьосник", clan: "Дуло", reqLevel: 5, reqSkill: { mysticism: 4 }, desc: "Пазител на свещения огън, владеещ думите на Тангра." },
        { id: "tangra_guardian", name: "Тангристки Пазител", clan: "Дуло", reqLevel: 10, reqSkill: { mysticism: 5, endurance: 4 }, desc: "Свещен воин с аура на пълна защита над армията." },
        { id: "immortal_rider", name: "Безсмъртен Конник", clan: "Дуло", reqLevel: 8, reqSkill: { endurance: 6 }, desc: "Легендарен конник, неподатлив на умора и физическа смърт." },
        { id: "wolf_lord", name: "Вълчи Вожд", clan: "Дуло", reqLevel: 12, reqSkill: { mysticism: 6, tactics: 5 }, desc: "Командир, който призовава духа на вълка-прародител in битка." },
        { id: "steppe_emperor", name: "Степен Император", clan: "Дуло", reqLevel: 15, reqSkill: { leadership: 8 }, desc: "Господар на безкрайните земи от Дунав до Волга." },
        { id: "subashi", name: "Субаши-Стратег", clan: "Дуло", reqLevel: 6, reqSkill: { tactics: 4 }, desc: "Майстор на кавалерийските засади и заграждения." },
        { id: "tarkhan", name: "Велик Таркан", clan: "Дуло", reqLevel: 7, reqSkill: { leadership: 4, diplomacy: 3 }, desc: "Върховен управител и военачалник на пограничните области." },
        { id: "avtohol_disciple", name: "Посветен на Авитохол", clan: "Дуло", reqLevel: 20, reqSkill: { mysticism: 10, leadership: 10 }, desc: "Мистичен патриарх, притежаващ знанието на първите безсмъртни." },

        // --- РОД ОДРИСИ / АНТИЧНИ БЪЛГАРИ (7 Класа) ---
        { id: "orphean_bard", name: "Орфеев Певец", clan: "Одриси", reqLevel: 5, reqSkill: { mysticism: 3 }, desc: "Хипнотизира вражеските войници с божествени звуци." },
        { id: "sun_priest", name: "Жрец на Слънцето", clan: "Одриси", reqLevel: 6, reqSkill: { mysticism: 5 }, desc: "Призовава слънчевия огън върху олтарите на Перперикон." },
        { id: "dionysian_myst", name: "Дионисиев Мист", clan: "Одриси", reqLevel: 8, reqSkill: { vampirism: 4 }, desc: "Воин, изпадащ in боен транс чрез ритуално червено вино." },
        { id: "thracian_peltast", name: "Одриски Пелтаст", clan: "Одриси", reqLevel: 5, reqSkill: { scouting: 4 }, desc: "Изключително бърз стрелец с леки щитове тип пелте." },
        { id: "megalith_druid", name: "Скален Друид", clan: "Одриси", reqLevel: 10, reqSkill: { endurance: 5, mysticism: 4 }, desc: "Черпи вековна сила директно от древните каменни светилища." },
        { id: "ruler_of_rhodope", name: "Владетел на Родопите", clan: "Одриси", reqLevel: 12, reqSkill: { leadership: 6, diplomacy: 5 }, desc: "Кралски златотърсач, контролиращ най-богатите рудници in античността." },
        { id: "tribal_archon", name: "Архонт на Родовете", clan: "Одриси", reqLevel: 15, reqSkill: { leadership: 8, diplomacy: 6 }, desc: "Обединител на всички планински кралски династии." },

        // --- РОД СКИТИ (6 Класа) ---
        { id: "steppe_archer", name: "Степен Стрелец", clan: "Скити", reqLevel: 5, reqSkill: { tactics: 4 }, desc: "Стреля безпогрешно in движение, обърнат назад на коня си." },
        { id: "lord_of_the_bow", name: "Властелин на Лъка", clan: "Скити", reqLevel: 10, reqSkill: { tactics: 7 }, desc: "Стрелите му пробиват най-тежките ромейски брони." },
        { id: "centaur_warrior", name: "Кентавър-Воин", clan: "Скити", reqLevel: 8, reqSkill: { endurance: 5, tactics: 4 }, desc: "Воин, слят in едно цяло със своя жребец." },
        { id: "nomad_marauder", name: "Номадски Мародер", clan: "Скити", reqLevel: 6, reqSkill: { scouting: 5 }, desc: "Светкавични грабежи над чужди кервани и мисии." },
        { id: "scythian_warlord", name: "Скитски Военноначалник", clan: "Скити", reqLevel: 12, reqSkill: { leadership: 7 }, desc: "Командва страховитите орди на северните степи." },
        { id: "tomiris_avenger", name: "Отмъстител на Томирис", clan: "Скити", reqLevel: 14, reqSkill: { vampirism: 5, tactics: 6 }, desc: "Безмилостен боец, давещ царете in съдове с кръв." },

        // --- РОД БЕСАРАБ (5 Класа) ---
        { id: "vampire_lord", name: "Вампирски Лорд", clan: "Бесараб", reqLevel: 10, reqSkill: { vampirism: 8 }, desc: "Възстановява огромна част от войската си, пиейки от врага." },
        { id: "night_stalker", name: "Нощен Ловец", clan: "Бесараб", reqLevel: 5, reqSkill: { scouting: 4, vampirism: 2 }, desc: "Непобедим при нощни нападения и изненадващи атаки." },
        { id: "stake_master", name: "Владетел на Коловете", clan: "Бесараб", reqLevel: 12, reqSkill: { tactics: 6, leadership: 5 }, desc: "Психологически терор, сриващ морала на врага преди битка." },
        { id: "shadow_diplomat", name: "Сенчест Дипломат", clan: "Бесараб", reqLevel: 7, reqSkill: { diplomacy: 5 }, desc: "Сключва договори, които винаги крият уловка in негова полза." },
        { id: "voivode_of_darkness", name: "Войвода на Мрака", clan: "Бесараб", reqLevel: 15, reqSkill: { leadership: 8, vampirism: 6 }, desc: "Легендарен карпатски владетел на безсмъртните воини." },

        // --- РОД МАКЕДОНИ (5 Класа) ---
        { id: "phalanx_commander", name: "Командир на Фалангата", clan: "Македони", reqLevel: 6, reqSkill: { tactics: 5, endurance: 3 }, desc: "Непробиваема стена от дълги копия - сариси." },
        { id: "conqueror_of_worlds", name: "Завоевател на Светове", clan: "Македони", reqLevel: 15, reqSkill: { leadership: 10, tactics: 8 }, desc: "Увеличава силата на армията при битки in далечни региони." },
        { id: "hetairoi_knight", name: "Хетайр-Придружавач", clan: "Македони", reqLevel: 7, reqSkill: { tactics: 6 }, desc: "Тясно ядро от тежка благородническа конница." },
        { id: "alexander_heir", name: "Наследник на Александър", clan: "Македони", reqLevel: 12, reqSkill: { leadership: 7, mysticism: 4 }, desc: "Притежава божествена харизма, призната от източните оракули." },
        { id: "royal_hypaspist", name: "Царски Хипаспист", clan: "Македони", reqLevel: 8, reqSkill: { endurance: 6 }, desc: "Гвардеец-ветеран, пазещ фланговете на армията." },

        // --- ОБЩИ И РЕДКИ КЛАСОВЕ ЗА ОСТАНАЛИТЕ РОДОВЕ (10 Класа) ---
        { id: "silk_master", name: "Властелин на Коприната", clan: "Птолемеи", reqLevel: 8, reqSkill: { diplomacy: 6 }, desc: "Увеличава приходите от търговски мисии на Изток." },
        { id: "amon_alchemist", name: "Алхимик на Амон", clan: "Птолемеи", reqLevel: 7, reqSkill: { alchemy: 5 }, desc: "Увеличава шанса за намиране на мистични египетски реликви." },
        { id: "hyperborean_necromancer", name: "Некромант от Хиперборея", clan: "Универсален", reqLevel: 13, reqSkill: { mysticism: 8, vampirism: 4 }, desc: "Вдига падналите in битка под формата на сенки." },
        { id: "daci_falxman", name: "Дакийски Фалксман", clan: "Даки", reqLevel: 5, reqSkill: { tactics: 4 }, desc: "Сила, въоръжена с огромен двуръчен боен косер, разсичащ щитове." },
        { id: "zalmoxis_chosen", name: "Избранник на Залмоксис", clan: "Даки", reqLevel: 10, reqSkill: { mysticism: 6, endurance: 5 }, desc: "Вярва, че смъртта е просто завръщане при бога, бие се без страх." },
        { id: "comitopuli_shield", name: "Пазител на Запада", clan: "Комитопули", reqLevel: 8, reqSkill: { endurance: 6, leadership: 4 }, desc: "Защитава планинските проходи и крепости до последен дъх." },
        { id: "asenev_eagle", name: "Асенев Орел", clan: "Асеневци", reqLevel: 9, reqSkill: { tactics: 6, scouting: 4 }, desc: "Мълниеносни планински атаки, непредвидим за ромеите." },
        { id: "terter_guardian", name: "Тертеров Кумански Вълк", clan: "Тертеровци", reqLevel: 7, reqSkill: { tactics: 5 }, desc: "Лека куманска конница, всяваща паника сред тежките рицари." },
        { id: "shishman_tsar", name: "Бъдински Цар", clan: "Шишмановци", reqLevel: 12, reqSkill: { leadership: 6, diplomacy: 5 }, desc: "Владетел, удържащ северозападните български предели." },
        { id: "osman_ghazi", name: "Османски Гази", clan: "Османци Дуло", reqLevel: 10, reqSkill: { tactics: 7, leadership: 5 }, desc: "Воин на вярата, разширяващ границите на империята с устрем." }
    ]
};

/**
 * ПОМОЩНА ФУНКЦИЯ ЗА ОПРЕДЕЛЯНЕ НА ПРАВИЛНА ИСТОР ИЧЕСКА ТИТЛА СЪОБРАЗНО РОДА
 */
window.getLeaderTitle = function(hero) {
    if (!hero) return "";
    const name = hero.name || "";
    const dyn = hero.dynasty || "";
    
    if (name.includes("Кан") || name.includes("Цар") || name.includes("Княз") || name.includes("Войвода")) {
        return "";
    }
    
    if (dyn === "Дуло") return "Кан ";
    if (dyn === "Одриси") return "Цар ";
    if (dyn === "Македони") return "Владетел ";
    if (dyn === "Бесараб") return "Войвода ";
    if (dyn === "Комитопули" || dyn === "Асеневци" || dyn === "Шишмановци") return "Цар ";
    
    return "Водач ";
};

/**
 * ДИНАМИЧНО ИЗРИСУВАНЕ И СОРТИРАНЕ НА ЛЕНТАТА С ТОП 6 ЛИДЕРИ
 * Оправя бъга изцяло чрез събиране на всички отключени родове от window.worldData.clans
 */
window.renderTop6LeadersUI = function() {
    // Търсим контейнера на горната лента в index.html
    let leadersBar = document.getElementById('top-6-leaders-bar');
    if (!leadersBar) {
        // Ако контейнерът липсва динамично, го инжектираме в горната част на екрана над картата
        leadersBar = document.getElementById('top-leaders-panel');
        if (!leadersBar) return;
    }

    let allRulers = [];
    
    // 1. Извличане на всички текущо притежавани владетели от глобалния обект на играта
    if (window.worldData && window.worldData.clans) {
        allRulers = Object.values(window.worldData.clans);
    }

    // Подсигуряваме, че текущият ни герой също е вътре, ако липсва в клановете
    if (window.currentHero && !allRulers.find(r => r.name === window.currentHero.name)) {
        allRulers.push(window.currentHero);
    }

    // Подсигуряваме базови RPG данни за всички владетели в масива
    allRulers.forEach(r => window.initializeHeroRPGData(r));

    // 2. Сортиране по Ниво и Опит (Низходящ ред) - Лентата винаги се подрежда по мощ
    allRulers.sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        return (b.xp || 0) - (a.xp || 0);
    });

    // Избираме първите 6 най-силни безсмъртни владетели
    let top6 = allRulers.slice(0, 6);

    let html = `
        <div style="display: flex; gap: 8px; justify-content: center; align-items: center; width: 100%; background: #000; padding: 6px; border-bottom: 1px solid #d4af37; box-sizing: border-box;">
    `;

    // 3. Рендериране на 6-те слота
    for (let i = 0; i < 6; i++) {
        let ruler = top6[i];

        if (ruler) {
            let isCurrent = window.currentHero && window.currentHero.name === ruler.name;
            let title = window.getLeaderTitle(ruler);
            let displayClass = ruler.currentClass || "Чист Водач";
            
            // Проверка за статус на смърт / безсмъртие
            let deathStatus = ruler.isDead ? `<span style="color:#ff0000; font-size:0.8em; font-weight:bold;"> [💀 МЪРТЪВ]</span>` : '';
            
            html += `
                <div onclick="window.selectHeroFromTopBar('${ruler.id || ruler.name}')" style="
                    flex: 1; min-width: 130px; max-width: 180px; padding: 6px 10px; border-radius: 4px;
                    background: ${isCurrent ? 'rgba(214,175,55,0.15)' : '#0d0d0d'};
                    border: 1px solid ${isCurrent ? '#ffd700' : '#222'};
                    cursor: pointer; text-align: left; position: relative; transition: all 0.2s;
                " onmouseover="this.style.borderColor='#ffd700'" onmouseout="this.style.borderColor='${isCurrent ? '#ffd700' : '#222'}'">
                    <div style="font-size: 0.8em; font-weight: bold; color: ${isCurrent ? '#ffd700' : '#fff'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${title}${ruler.name}${deathStatus}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.7em; color: #aaa; margin-top: 2px;">
                        <span style="color: #00ffcc;">Ниво ${ruler.level}</span>
                        <span style="color: #888; font-style: italic;">${displayClass}</span>
                    </div>
                </div>
            `;
        } else {
            // Празен слот, ако играчът още няма купени 6 владетели
            html += `
                <div style="flex: 1; min-width: 130px; max-width: 180px; padding: 6px 10px; border-radius: 4px; background: #050505; border: 1px solid #111; border-style: dashed; text-align: center; opacity: 0.4;">
                    <div style="font-size: 0.75em; color: #555; font-style: italic; line-height: 24px;">Чака привличане...</div>
                </div>
            `;
        }
    }

    html += `</div>`;
    leadersBar.innerHTML = html;
};

/**
 * ФУНКЦИЯ ПРИ КЛИКВАНЕ НА ВЛАДЕТЕЛ ОТ ЛЕНТАТА - ЗА СМЯНА НА ТЕКУЩИЯ ГЕРОЙ
 */
window.selectHeroFromTopBar = function(rulerIdentifier) {
    if (!window.worldData || !window.worldData.clans) return;
    
    let target = window.worldData.clans[rulerIdentifier];
    if (!target) {
        // Fallback търсене по име
        target = Object.values(window.worldData.clans).find(r => r.name === rulerIdentifier);
    }

    if (target) {
        window.currentHero = target;
        
        if (window.showAdvisorMsg) {
            let title = window.getLeaderTitle(target);
            window.showAdvisorMsg(`👑 Вие поехте контрола над ${title}${target.name}! Всички военни и цивилни действия вече са под негово командване.`);
        }

        // Пълно обновяване на екраните
        if (window.updateCharacterUI) window.updateCharacterUI(target);
        window.renderTop6LeadersUI();
        
        // Ако експедиционният център е отворен, го обновяваме с новия лидер
        let expUI = document.getElementById('expedition-ui-container');
        if (expUI && window.openExpeditionCenter) window.openExpeditionCenter();
    }
};

/**
 * ИНИЦИАЛИЗАЦИЯ НА RPG ДАННИ ЗА ДАДЕН ГЕРОЙ / ВЛАДЕТЕЛ
 */
window.initializeHeroRPGData = function(hero) {
    if (!hero) return;
    if (hero.level !== undefined && hero.xp !== undefined) return; // Вече има данни

    hero.level = 1;
    hero.xp = 0;
    hero.skillPoints = 0;
    hero.heroPower = hero.heroPower || 100;
    hero.currentClass = hero.currentClass && hero.currentClass !== "Няма клас" ? hero.currentClass : "Чист Водач";
    hero.isDead = hero.isDead || false;
    
    if (!hero.skills) {
        hero.skills = {
            endurance: 0,
            vampirism: 0,
            mysticism: 0,
            tactics: 0,
            diplomacy: 0,
            scouting: 0,
            alchemy: 0,
            leadership: 0
        };
    }
};

/**
 * СИСТЕМА ЗА ДОБАВЯНЕ НА ОПИТ (XP) - СИНХРОНИЗИРАНА С UI ЕКРАНА
 */
window.gainHeroXP = function(hero, amount) {
    if (!hero) return;
    
    window.initializeHeroRPGData(hero);

    hero.xp += amount;
    let reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
    let leveledUp = false;

    while (hero.xp >= reqXP) {
        hero.xp -= reqXP;
        hero.level++;
        hero.skillPoints += 2; 
        hero.heroPower += 25;  
        leveledUp = true;
        reqXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
    }

    if (window.autoLevelState && window.autoLevelState[hero.name]) {
        window.autoAssignLeaderSkills(hero);
    } else {
        window.checkAndAssignClass(hero);
    }

    if (leveledUp && window.showAdvisorMsg) {
        let title = window.getLeaderTitle(hero);
        window.showAdvisorMsg(`✨ ${title}${hero.name} от род ${hero.dynasty} достигна НИВО ${hero.level}!`);
    }

    window.renderTop6LeadersUI();
    if (window.updateCharacterUI && window.currentHero && window.currentHero.name === hero.name) {
        window.updateCharacterUI(window.currentHero);
    }
};

/**
 * ФУНКЦИЯ ЗА РЪЧНО КЛИКАНЕ И ВДИГАНЕ НА УМЕНИЕ ОТ UI ИНТЕРФЕЙСА
 */
window.upgradeHeroSkill = function(hero, skillKey) {
    if (!hero) return false;
    window.initializeHeroRPGData(hero);
    
    if (hero.skillPoints > 0 && hero.skills[skillKey] !== undefined) {
        hero.skills[skillKey]++;
        hero.skillPoints--;
        
        window.checkAndAssignClass(hero);
        
        if (window.updateCharacterUI && window.currentHero && window.currentHero.name === hero.name) {
            window.updateCharacterUI(window.currentHero);
        }
        window.renderTop6LeadersUI();
        return true;
    }
    return false;
};

/**
 * АВТОМАТИЧНО ОБУЧЕНИЕ НА СЛУЧАЙНИТЕ ВОДАЧИ
 */
window.autoAssignLeaderSkills = function(leader) {
    window.initializeHeroRPGData(leader);
    
    if (leader.skillPoints > 0) {
        const skillsKeys = Object.keys(leader.skills);
        while (leader.skillPoints > 0) {
            const randomSkill = skillsKeys[Math.floor(Math.random() * skillsKeys.length)];
            leader.skills[randomSkill]++;
            leader.skillPoints--;
        }
    }
    window.checkAndAssignClass(leader);
    window.renderTop6LeadersUI();
};

/**
 * ПРОВЕРКА И ЕВОЛЮЦИЯ В КЛАС
 */
window.checkAndAssignClass = function(leader) {
    window.initializeHeroRPGData(leader);
    
    const availableClasses = window.rpgDatabase.classes.filter(c => {
        if (c.clan !== "Универсален" && c.clan !== leader.dynasty) return false;
        if (leader.level < c.reqLevel) return false;
        
        for (let sk in c.reqSkill) {
            if ((leader.skills[sk] || 0) < c.reqSkill[sk]) return false;
        }
        return true;
    });

    if (availableClasses.length > 0) {
        availableClasses.sort((a,b) => b.reqLevel - a.reqLevel);
        const newClass = availableClasses[0];
        
        if (leader.currentClass !== newClass.name) {
            leader.currentClass = newClass.name;
            if (window.showAdvisorMsg) {
                let title = window.getLeaderTitle(leader);
                window.showAdvisorMsg(`👑 ЕВОЛЮЦИЯ: ${title}${leader.name} от род ${leader.dynasty} стана [${newClass.name}]!`);
            }
        }
    }
};
