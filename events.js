/**
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: events.js (ВЕРСИЯ 5.0 – ХАРМОНИЗИРАН С НОВАТА ТЕРМИНОЛОГИЯ)
*/
window.eventTemplates = {
    positive: [
        { t: "Благоденствие в {region}", desc: "Местните родове в {region} откриха нови пасища. Хазната на рода расте.", effect: { gold: 150, power: 5 } },
        { t: "Мъдростта на Кан {hero}", desc: "Справедливото Ви решение по спор между старейшините увеличи влиянието Ви.", effect: { power: 25, gold: 0 } },
        { t: "Елитна гвардия", desc: "Млади воини от род {clan} се заклеха в съдбовна вярност до смърт.", effect: { army: 120, power: 10 } },
        { t: "Търговски керван", desc: "Търговци от далечни земи пристигнаха в столицата, носейки дарове.", effect: { gold: 300, power: 0 } },
        { t: "Съкровище на древните", desc: "При разкопки край {region} открихте златни съдове от времето на траките.", effect: { gold: 500, power: 0 } },
        { t: "Съюз със съседен клан", desc: "Кланът {clan} сключи династичен брак с вашия род. Укрепна единството.", effect: { gold: 100, army: 80, power: 15 } },
        { t: "Пророчество на Тангра", desc: "Върховният жрец съобщи, че небето благоволи към вашия род.", effect: { power: 30, gold: 50 } },
        { t: "Изобретение на ковачи", desc: "Ковачите от {region} създадоха нов тип стремена. Конницата стана по-ефективна.", effect: { army: 100, power: 10 } },
        { t: "Рекордна реколта", desc: "Дъждовете и слънцето благоприятстваха земеделието. Жътвата е изобилна.", effect: { gold: 200, army: 0 } },
        { t: "Опитен наемник", desc: "Прославен воин от чужбина предложи услугите си на {hero}.", effect: { army: 150, power: 5 } },
        { t: "Откриване на желязна руда", desc: "В планините на {region} открихте богата руда. Оръжията ви ще са по-добри.", effect: { army: 60, power: 8, gold: 120 } },
        { t: "Дипломатически успех", desc: "Вашият пратеник убеди съседен владетел да подпише пакт за ненападение.", effect: { gold: 80, power: 10 } },
        { t: "Героична постъпка", desc: "Воин от {clan} спаси децата на старейшина – в знак на благодарност получихте земи.", effect: { gold: 180, army: 30 } },
        { t: "Астрологично знамение", desc: "Звездите предсказват златни години за вашия род.", effect: { gold: 250, power: 5 } },
        { t: "Възстановяване на крепост", desc: "Старата крепост в {region} бе укрепена. Сега е почти непревземаема.", effect: { army: 90, power: 12 } },
        { t: "Помощ от съюзници", desc: "Вашите съюзници изпратиха храна и оръжие в знак на приятелство.", effect: { gold: 220, army: 50 } },
        { t: "Наследство от прадедите", desc: "Открихте стар свитък с военни тактики. Бойният дух се повиши.", effect: { power: 20, army: 40 } },
        { t: "Почит от покорените", desc: "Съседно племе ви плати годишен данък без бой.", effect: { gold: 300, army: 0 } },
        { t: "Опитен лечител", desc: "Лечител отдалеч ви научи на билки, които намаляват загубите след битка.", effect: { army: 70, power: 5 } },
        { t: "Празник на единството", desc: "В {region} организирахте голям събор, който сближи родовете.", effect: { gold: 100, power: 15 } },
        { t: "Шпионска мрежа", desc: "Успяхте да подкупите шпиони в съседен клан. Получавате важна информация.", effect: { power: 10, gold: 40 } },
        { t: "Тайно оръжие", desc: "Изобретен е нов тип катапулт. Обсадите ще са по-успешни.", effect: { army: 80, power: 10 } },
        { t: "Метеоритен дъжд (добър)", desc: "Паднаха метеорити, от които извлякохте рядък метал за оръжия.", effect: { army: 100, power: 8, gold: 60 } },
        { t: "Възход на занаятите", desc: "Занаятчиите от {region} основаха гилдия. Търговията процъфтява.", effect: { gold: 180 } },
        { t: "Епично ловуване", desc: "{hero} организира лов, който обедини аристокрацията.", effect: { power: 10, gold: 50 } },
        { t: "Дар от морето", desc: "Риболовците уловиха необичайно много риба. Гладът отминава.", effect: { gold: 100, army: 20 } },
        { t: "Обучение от стар воин", desc: "Ветеран от походите на Кубрат обучи вашите войници.", effect: { army: 110, power: 7 } },
        { t: "Строителство на пътища", desc: "Нови пътища свързаха регионите. Търговията се ускори.", effect: { gold: 150, army: 0 } },
        { t: "Прием на посланик", desc: "Византийският пратеник донесе скъпи подаръци и предложи съюз.", effect: { gold: 250, power: 5 } },
        { t: "Освобождаване на пленници", desc: "Откупихте пленници от хазарите. Те се присъединиха към войската.", effect: { army: 90, gold: -50 } },
        { t: "Чудотворна икона", desc: "В църква на {region} открихте икона, която лекува болни.", effect: { army: 40, power: 15, gold: 80 } },
        { t: "Укротяване на див кон", desc: "{hero} успя да укроти див жребец. Конницата ви е по-бърза.", effect: { army: 60, power: 8 } },
        { t: "Алхимик-изобретател", desc: "Алхимик създаде гръцки огън. Вашите стрелци станаха смъртоносни.", effect: { army: 120, power: 10 } },
        { t: "Благословия на Тангра", desc: "Жреците обявиха, че Тангра е доволен от управлението ви.", effect: { power: 25, gold: 100 } },
        { t: "Тайна библиотека", desc: "Открихте древна библиотека с книги за управление.", effect: { gold: 200, power: 8 } },
        { t: "Сребърни мини", desc: "В планините са открити нови залежи на сребро.", effect: { gold: 400 } },
        { t: "Състезание на стрелците", desc: "Вашите стрелци спечелиха турнир. Славата им се разпространи.", effect: { army: 50, power: 5 } },
        { t: "Помощ при наводнение", desc: "Оказахте помощ на пострадалите от наводнение в {region}. Благодарността на народа няма граници.", effect: { gold: -80, power: 20 } },
        { t: "Иновация в земеделието", desc: "Въведено е ново колело за напояване. Добивите се увеличиха.", effect: { gold: 130 } },
        { t: "Прераждане на културата", desc: "В {region} се появиха нови училища. Нивото на образование расте.", effect: { power: 10, gold: 60 } },
        { t: "Военна реформа", desc: "Въведохте нова структура на армията. Дисциплината се подобри.", effect: { army: 140, power: 12 } },
        { t: "Съюз с печенеги", desc: "Сключихте временен съюз с номадите. Те изпращат конници.", effect: { army: 100, gold: -30 } },
        { t: "Откриване на извор", desc: "В пустинната област бликна извор с минерална вода. Търговците идват на тълпи.", effect: { gold: 220, power: 5 } },
        { t: "Покровител на изкуствата", desc: "Подкрепихте поети и музиканти. Това повиши престижа на двора.", effect: { gold: -40, power: 18 } },
        { t: "Освободени роби", desc: "Освободихте група роби, които се заклеха да ви служат като свободни воини.", effect: { army: 80, power: 5 } },
        { t: "Спасен кораб", desc: "Вашият флот спаси търговски кораб от пирати. Собственикът дари злато.", effect: { gold: 180, army: 30 } },
        { t: "Пробив в дипломацията", desc: "Успяхте да помирите два враждуващи клана. Авторитетът ви нарасна.", effect: { power: 30, gold: 50 } },
        { t: "Златен век на занаятите", desc: "Кожарската гилдия създаде брони с високо качество.", effect: { army: 70, gold: 90 } },
        { t: "Походът на {hero}", desc: "Личното ви присъствие в поход вдъхнови войниците.", effect: { army: 90, power: 12 } },
        { t: "Договор с варягите", desc: "Варяжки наемници се присъединиха към армията ви срещу злато.", effect: { army: 200, gold: -150 } },
        { t: "Откриване на нов пазар", desc: "Сключен е договор за безмитна търговия с {region}.", effect: { gold: 280 } },
        { t: "Орден на дракона", desc: "Създадохте елитен рицарски орден. Вашите рицари са непобедими.", effect: { army: 130, power: 15 } },
        { t: "Мъченици за вярата", desc: "Изградихте храм на Тангра. Вярващите даряват щедро.", effect: { gold: 150, power: 8 } },
        { t: "Експедиция в непознати земи", desc: "Открихте нови търговски пътища на изток.", effect: { gold: 300, power: 5 } },
        { t: "Изцеление от болест", desc: "Лечителите от {region} победиха епидемия. Народът ви благославя.", effect: { army: 50, power: 10, gold: 70 } },
        { t: "Формиране на народно опълчение", desc: "Селяните сами се организират да защитават земите.", effect: { army: 110, gold: -20 } },
        { t: "Успешен улов", desc: "Риболовните флотилии донесоха рекорден улов. Излишъкът е продаден.", effect: { gold: 90, army: 20 } },
        { t: "Съкровище на готите", desc: "Открихте готско съкровище, заровено край Дунав.", effect: { gold: 600, power: 0 } },
        { t: "Огнена колесница", desc: "Военен инженер създаде колесница с коси. Страх за враговете.", effect: { army: 140, power: 12 } },
        { t: "Заселване на славяни", desc: "Славянски племена поискаха закрила. Те заселиха пустеещи земи.", effect: { gold: 100, army: 60 } },
        { t: "Почетен меч", desc: "Ковачите изковаха меч за {hero} с руни. Увеличава силата.", effect: { power: 20, gold: 0 } },
        { t: "Народно тържество", desc: "Организирахте игри в чест на победа. Войниците са мотивирани.", effect: { army: 40, power: 8, gold: -40 } },
        { t: "Дипломатически брак", desc: "Омъжихте дъщеря си за син на владетел. Мир и подаръци.", effect: { gold: 400, power: 15 } }
    ],
    negative: [
        { t: "Бунт на недоволни старейшини", desc: "Родови първенци в {region} оспорват решенията. Трябва да платите.", effect: { gold: -200, army: -40 } },
        { t: "Проклятието на Древните Могили", desc: "Черна прокоба застигна реколтата. Мистичните сили изискват жертва.", effect: { gold: -150, power: -10 } },
        { t: "Граничен набег", desc: "Вражески конници опустошиха селата в {region}. Дадени са жертви.", effect: { army: -80, gold: -50 } },
        { t: "Чума в {region}", desc: "Ужасна епидемия покоси населението. Много войници загинаха.", effect: { army: -120, gold: -100, power: -10 } },
        { t: "Предателство на благородник", desc: "Високопоставен член на {clan} избяга при врага с ценни документи.", effect: { power: -15, gold: -80 } },
        { t: "Суша", desc: "Дълго бездъждие унищожи посевите. Глад и бунтове.", effect: { gold: -300, army: -40 } },
        { t: "Нашествие на скакалци", desc: "Рои скакалци изядоха нивите. Икономиката пострада.", effect: { gold: -250, army: -20 } },
        { t: "Раздор между родове", desc: "Два могъщи рода в {region} започнаха междуособици.", effect: { power: -10, army: -60 } },
        { t: "Земетресение", desc: "Божествен гнев разруши част от крепостта. Нужни са средства за възстановяване.", effect: { gold: -180, army: -30 } },
        { t: "Поражение в битка", desc: "Вашата армия бе разбита при опит да завладее нови територии.", effect: { army: -150, power: -15 } },
        { t: "Шпионски скандал", desc: "Разкрит е шпион, внедрен в двора. Това навреди на репутацията.", effect: { power: -10, gold: -40 } },
        { t: "Отравяне на {hero}", desc: "Недоброжелатели опитаха да отровят водача. За щастие само леки последствия.", effect: { power: -10, army: -20, gold: -30 } },
        { t: "Ледена зима", desc: "Студът бе толкова силен, че замръзнаха реките. Прехраната е оскъдна.", effect: { gold: -200, army: -50 } },
        { t: "Бунт на робите", desc: "Робите в рудниците на {region} се вдигнаха на бунт.", effect: { gold: -120, army: -30, power: -5 } },
        { t: "Фалшива монета", desc: "В обращение се появиха фалшиви пари. Икономиката се разклати.", effect: { gold: -180, power: -5 } },
        { t: "Пожар в складовете", desc: "Искра от светкавица запали житните складове. Загубите са огромни.", effect: { gold: -220, army: -20 } },
        { t: "Нападение на дракон", desc: "Митичен дракон изгори две села. Войниците са деморализирани.", effect: { army: -90, power: -15, gold: -70 } },
        { t: "Оттегляне на съюзници", desc: "Вашите съюзници внезапно прекратиха договора.", effect: { power: -10, army: -60 } },
        { t: "Кражба на съкровища", desc: "Крадци проникнаха в хазната и откраднаха злато.", effect: { gold: -350, power: -5 } },
        { t: "Болест на коне", desc: "Епизоотия порази конете. Конницата отслабна.", effect: { army: -110, gold: -40 } },
        { t: "Провалена дипломация", desc: "Посланикът ви бе унизен в чужд двор. Отношенията се влошиха.", effect: { power: -12, gold: -20 } },
        { t: "Лавина в планината", desc: "Лавина затрупа стратегически проход. Търговията спря.", effect: { gold: -100, army: -20 } },
        { t: "Изнудване от хазарите", desc: "Хазарският владетел поиска данък под заплаха от война.", effect: { gold: -400, army: -20 } },
        { t: "Разкол в църквата", desc: "Религиозен спор разцепи духовенството. Вярващите са объркани.", effect: { power: -15, gold: -50 } },
        { t: "Потоп", desc: "Реката излезе от коритото си и наводни низините.", effect: { gold: -150, army: -40 } },
        { t: "Предателство на наемници", desc: "Наемниците, които платихте, преминаха на страната на врага.", effect: { army: -100, gold: -100 } },
        { t: "Проклятие на вещица", desc: "Старица прокле вашия род. Добитъкът започна да мре.", effect: { gold: -120, power: -8 } },
        { t: "Тайна организация", desc: "В столицата действа заговор срещу {hero}.", effect: { power: -10, gold: -40 } },
        { t: "Свлачище", desc: "Свлачище унищожи пътя към рудниците. Добивът спря.", effect: { gold: -130 } },
        { t: "Гладна стачка", desc: "Населението в {region} протестира срещу високите данъци.", effect: { gold: -80, power: -5, army: -30 } },
        { t: "Пиратски рейд", desc: "Пирати ограбиха крайбрежните селища.", effect: { gold: -200, army: -30 } },
        { t: "Скандал в двора", desc: "Любовна афера разпали клюки и намали доверието към вас.", effect: { power: -15, gold: -20 } },
        { t: "Изменник в армията", desc: "Високопоставен военачалник избяга с важни планове.", effect: { army: -70, power: -8 } },
        { t: "Метеоритен дъжд (лош)", desc: "Паднаха метеорити в населени райони. Жертви и разрушения.", effect: { army: -60, gold: -140 } },
        { t: "Засуха в низините", desc: "Отсъствието на дъжд доведе до недостиг на вода.", effect: { gold: -110, army: -20 } },
        { t: "Заговор на аристокрацията", desc: "Благородниците искат да свалят {hero} и да поставят марионетка.", effect: { power: -20, gold: -60, army: -40 } },
        { t: "Вълшебна болест", desc: "Магическа чума засяга най-добрите воини. Загубите са тежки.", effect: { army: -130, power: -10 } },
        { t: "Продажни чиновници", desc: "Разкрит е корупционен скандал в съдебната система.", effect: { gold: -90, power: -8 } },
        { t: "Унищожен керван", desc: "Ваш търговски керван бе нападнат от разбойници.", effect: { gold: -250 } },
        { t: "Спор за наследство", desc: "След смъртта на старейшина избухна спор за земите му.", effect: { army: -30, gold: -70, power: -5 } },
        { t: "Лош късмет на лов", desc: "{hero} бе наранен при лов. Трябва време да се възстанови.", effect: { power: -12, army: -20 } },
        { t: "Разпадане на съюз", desc: "Някогашният съюз се разпадна заради недоразумение.", effect: { power: -10, army: -40 } },
        { t: "Изтичане на информация", desc: "Вражески шпиони научиха за предстоящата ви атака.", effect: { army: -50, power: -5 } },
        { t: "Фиаско на дипломат", desc: "Вашият пратеник обиди чужд владетел. Отношенията се влошиха.", effect: { gold: -50, power: -10 } },
        { t: "Убийство на пратеник", desc: "Вражеските агенти убили вашия посланик.", effect: { power: -15, gold: -30 } },
        { t: "Бунт на ветераните", desc: "Старите войници не са доволни от заплащането си.", effect: { army: -80, gold: -60 } },
        { t: "Оскверняване на светилище", desc: "Неизвестни оскверниха езически храм. Боговете са гневни.", effect: { power: -15, gold: -40 } },
        { t: "Изгубен конвой с доставки", desc: "Конвоят с храна за войската попадна в засада.", effect: { army: -70, gold: -50 } },
        { t: "Морова болест", desc: "Страшна болест коси населението в {region}.", effect: { army: -100, gold: -120, power: -8 } },
        { t: "Светотатство", desc: "Крадец открадна мощи от църквата. Народът е разгневен.", effect: { power: -12, gold: -60 } },
        { t: "Саботаж в оръжейницата", desc: "Непознати повредиха складовете с оръжие.", effect: { army: -90, gold: -40 } },
        { t: "Коварна изненада", desc: "Вражеският владетел ви подмами в капан на дипломатическа среща.", effect: { power: -18, gold: -100 } },
        { t: "Злоупотреби на местен управител", desc: "Управителят в {region} ограбва населението.", effect: { gold: -100, power: -8 } },
        { t: "Избухване на вулкан", desc: "Вулканичен пепел покри {region}. Реколтата е унищожена.", effect: { gold: -200, army: -40 } },
        { t: "Похищение на заложници", desc: "Вражеският клан отвлече благородници от вашия двор.", effect: { power: -10, gold: -150 } },
        { t: "Липса на фураж", desc: "Заради сушата няма достатъчно фураж за конете.", effect: { army: -80, gold: -30 } },
        { t: "Тайно споразумение", desc: "Един от вашите съветници води тайни преговори с врага.", effect: { power: -15, gold: -50 } },
        { t: "Измръзване на реколтата", desc: "Слана порази цъфналите овошки. Гладът идва.", effect: { gold: -140, army: -20 } }
    ]
};

// =========================================================================
// МОДАЛНО МЕНЮ (НЕ ПРЕЗАПИСВА КАРТАТА)
// =========================================================================
window.openEventsMenu = function() {
    if (document.getElementById('events-menu-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'events-menu-modal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 200000; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif;`;
    modal.innerHTML = `
        <div style="background: #1a1a2e; border: 2px solid #d4af37; border-radius: 24px; padding: 25px; max-width: 400px; width: 90%; text-align: center;"> 
            <h2 style="color: #ffd700;">📜 Свещен Летопис</h2> 
            <p style="color: #ccc;">Предизвикайте съдбата си – всяко събитие променя хода на историята.</p> 
            <button id="trigger-event-btn" style="background: #daa520; color: #000; border: none; padding: 12px 20px; border-radius: 40px; font-weight: bold; cursor: pointer; width: 100%; margin: 15px 0;"> 📜 ИЗВЕСТИНУВАЙ СЪБИТИЕ </button> 
            <button id="close-events-modal" style="background: #2c2c3a; border: 1px solid #d4af37; color: #ffd700; padding: 8px 16px; border-radius: 30px; cursor: pointer; width: 100%;"> Затвори </button> 
        </div>`;
    document.body.appendChild(modal);

    const triggerBtn = modal.querySelector('#trigger-event-btn');
    if (triggerBtn) triggerBtn.onclick = () => { modal.remove(); window.triggerRandomEvent(); };
    const closeBtn = modal.querySelector('#close-events-modal');
    if (closeBtn) closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

// =========================================================================
// ГЕНЕРИРАНЕ НА СЛУЧАЙНО СЪБИТИЕ (С ДОБАВЯНЕ В ЛЕТОПИСА)
// =========================================================================
window.triggerRandomEvent = function() {
    const hero = window.currentHero;
    if (!hero) return;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let skills = hero.skills || {};
    let isPositive = Math.random() > 0.4;
    let pool = isPositive ? window.eventTemplates.positive : window.eventTemplates.negative;
    let template = pool[Math.floor(Math.random() * pool.length)];

    // Безопасно вземане на регион
    let randomRegion = "Мизия";
    if (window.playerRegions) {
        const flat = Array.isArray(window.playerRegions) ? (window.playerRegions.flat ? window.playerRegions.flat() : window.playerRegions) : [];
        const validRegions = flat.filter(r => typeof r === 'string' && r.length > 0);
        if (validRegions.length > 0) {
            randomRegion = validRegions[Math.floor(Math.random() * validRegions.length)];
        }
    }

    let eventTitle = template.t.replace(/{region}/g, randomRegion).replace(/{hero}/g, hero.name).replace(/{clan}/g, hero.clan || "Дуло");
    let eventText = template.desc.replace(/{region}/g, randomRegion).replace(/{hero}/g, hero.name).replace(/{clan}/g, hero.clan || "Дуло");

    let goldEffect = template.effect.gold || 0;
    let armyEffect = template.effect.army || 0;
    let powerEffect = template.effect.power || 0;

    // Пасивни умения
    if (isPositive && goldEffect > 0 && (skills.economy || 0) > 0) {
        goldEffect = Math.floor(goldEffect * (1 + (skills.economy * 0.30)));
        eventText += `<br><span style="color:#00ffcc;">[УПРАВЛЕНИЕ]: Икономическите умения донесоха по-голям приход!</span>`;
    }
    if (!isPositive && (skills.mysticism || 0) > 0 && eventTitle.includes("Проклятието")) {
        let mitigation = skills.mysticism * 0.25;
        goldEffect = Math.floor(goldEffect * (1 - Math.min(1, mitigation)));
        powerEffect = 0;
        eventText += `<br><span style="color:#ffd700;">[МИСТИЦИЗЪМ]: Мистичните знания защитиха рода!</span>`;
    }

    // Прилагане на ефектите
    if (goldEffect !== 0) hero.gold = Math.max(0, (hero.gold || 0) + goldEffect);
    if (armyEffect !== 0) {
        hero.currentArmy = Math.max(0, (hero.currentArmy || 0) + armyEffect);
        hero.armySize = hero.currentArmy;
    }
    if (powerEffect !== 0) hero.heroPower = Math.max(10, (hero.heroPower || 100) + powerEffect);

    // Синхронизация с worldData
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.clan]) {
        const cData = window.worldData.clans[hero.clan];
        cData.gold = hero.gold;
        cData.currentArmy = hero.currentArmy;
        cData.armySize = hero.currentArmy;
        cData.heroPower = hero.heroPower;
    }

    // Добавяне в летописа
    const yearStr = (window.gameTime ? `${window.gameTime.year} г. ${window.gameTime.era}` : "480 г. пр.н.е.");
    if (window.addWorldEvent) {
        const effectText = `Злато: ${goldEffect >=0? "+ ": ""}${goldEffect}, Армия: ${armyEffect >=0? "+ ": ""}${armyEffect}, Сила: ${powerEffect >=0? "+ ": ""}${powerEffect}`;
        window.addWorldEvent(eventTitle, eventText + "  " + effectText, isPositive ? "✨ " : "⚠️ ", yearStr);
    }

    // Показване на модал с резултата
    window.showEventModal(eventTitle, eventText, [{
        text: "ПРИЕМИ СЪДБАТА И ПРОДЪЛЖИ",
        action: function() {
            const modal = document.getElementById('event-overlay-modal');
            if (modal) modal.remove();
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();  // <-- ПРОМЕНЕНО
        }
    }]);

    console.log(`📜  СЪБИТИЕ: ${eventTitle} | Ефекти: злато ${goldEffect}, армия ${armyEffect}, сила ${powerEffect}`);
};

// =========================================================================
// ПОКАЗВАНЕ НА МОДАЛ С РЕЗУЛТАТА
// =========================================================================
window.showEventModal = function(title, text, options) {
    let modal = document.getElementById('event-overlay-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'event-overlay-modal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 10000;`;
    modal.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; color: white; text-align: center; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.95); max-width: 450px; width: 90%; box-sizing: border-box;">
            <h3 style="color: #ffd700; font-family: 'Cinzel', serif; margin: 0 0 15px 0; text-transform: uppercase; font-size: 1.1em; letter-spacing: 1px;">${title}</h3>
            <p style="font-size: 13px; line-height: 1.6; margin: 0 0 25px 0; color: #ccc;">${text}</p>
            <div id="event-options-container"></div>
        </div>`;
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

// Експортиране на функцията за събития
window.openEventsMenu = window.openEventsMenu || function() {
    if (typeof window.openEventsMenu === 'function') window.openEventsMenu();
    else console.warn("Събитията не са готови");
};
