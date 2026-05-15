/**
 * МОДУЛ: ВЕЛИКИТЕ ЕКСПЕДИЦИИ НА СВЕТА - Велика България
 * СТАТУС: ЛЕГЕНДАРЕН (Персонализиран мистичен интерфейс - Пакет 1-5)
 * Файлове в проекта: 16
 */

window.activeExpedition = null;
window.legendaryQuests = window.legendaryQuests || [];

// Обединена база данни с всички епични мисии (Пакети 1, 2, 3, 4 и 5)
const allCoreQuests = [
    // --- ПАКЕТ 1 ---
    {
        title: "Пътят на Коприната: Нефритената порта",
        destination: "Китай (Династия Хан)",
        description: "Вашите пратеници тръгват на изток през Памир, за да открият тайните на коприната и небесните коне.",
        duration: 24,
        steps: [
            "Керванът пресича Каспийско море под закрилата на Тангра.",
            "Преминаване през пустинята Такламакан – пясъчни духове пречат на пътя.",
            "Среща с Кушанските владетели – размяна на дарове и злато.",
            "Достигане до Нефритената порта. Китайските стражи са смаяни от българската конница."
        ],
        final: "Керванът се завръща натоварен с коприна и източни технологии!",
        reward: { gold: 5000, power: 150, army: 0, item: "Китайски драконов печат" }
    },
    {
        title: "В търсене на Хиперборея",
        destination: "Скандинавия (Северните земи)",
        description: "Легендите разказват за земя на вечно слънце далеч на север. Тръгваем през земите на русите.",
        duration: 18,
        steps: [
            "Плаване нагоре по големите реки срещу течението.",
            "Среща с варяжки вождове – изпитание на силата и волята.",
            "Пресичане на замръзналите езера, където вълци пеят химни на боговете.",
            "Откриване на древни мегалити, посветени на слънцето."
        ],
        final: "Експедицията носи легендарна стомана и знание за звездите.",
        reward: { gold: 0, power: 200, army: 400, item: "Меч на Севера" }
    },
    {
        title: "Експедиция до Храмът на Амон",
        destination: "Египет (Земите на Нил)",
        description: "Пътуване до оазиса Сива, за да се потвърди божественото право на Кан {hero}.",
        duration: 12,
        steps: [
            "Прекосяване на Средиземно море с финикийски кораби.",
            "Пясъците на Сахара разкриват стъпките на великия Александър.",
            "Жреците в Сива разпознават знака на Тангра върху вашия щит.",
            "Получаване на древно пророчество за бъдещето на България."
        ],
        final: "Кан {hero} е признат за син на слънцето и небето!",
        reward: { gold: 2000, power: 300, army: 0, item: "Окото на Ра" }
    },
    {
        title: "Мистичната Индия: Царството на Ашока",
        destination: "Долината на Инд",
        description: "Търсене на свещените текстове за мирозданието и слонове за вашата армия.",
        duration: 20,
        steps: [
            "Преминаване през проходите на Хиндукуш сред вечни снегове.",
            "Спускане в долината на Инд, където джунглата крие тигри и златни градове.",
            "Разговори с будистки монаси за смисъла на битието.",
            "Получаване на дарове от слонова кост и подправки."
        ],
        final: "Вашите хора се завръщат с екзотични животни и нови философии.",
        reward: { gold: 1500, power: 0, army: 600, item: "Свещена Мантра" }
    },
    {
        title: "Британия: Островът на мъглите",
        destination: "Албион",
        description: "Пътуване до самия край на познатия свят, за да се срещнете с друидите.",
        duration: 22,
        steps: [
            "Пресичане на германските гори и земите на франките.",
            "Преминаване на бурния Ламанш в нощ на пълнолуние.",
            "Среща с друиди около Стоунхендж по време на слънцестоенето.",
            "Ритуал за сливане на българската и келтската магия."
        ],
        final: "Вашата мощ е призната дори в земите на вечната мъгла.",
        reward: { gold: 0, power: 250, army: 200, item: "Друидски жезъл" }
    },
    // --- ПАКЕТ 2 ---
    {
        title: "Портите на Александър: Железният проход",
        destination: "Каспийски порти (Дербент)",
        description: "Легендата разказва, че Александър Велики е затворил демонични орди зад железни порти. Трябва да ги открием и да подсилим стражата.",
        duration: 9,
        steps: [
            "Прекосяване на Кавказките хребети в жестока снежна буря.",
            "Откриване на древните стени, чиито камъни пулсират с непозната енергия.",
            "Ритуал на древните българи за запечатване на пролома.",
            "Среща с пазителите на прохода, които ви даряват оръжия от метеоритна стомана."
        ],
        final: "Портите са сигурни. Кавказ признава Кан {hero} за велик пазител!",
        reward: { gold: 0, power: 180, army: 150, item: "Железният ключ на Александър" }
    },
    {
        title: "Проклятието на Кукулкан: Отвъд Великия океан",
        destination: "Юкатан (Земите на Маите)",
        description: "Най-дръзката експедиция в историята. Пътуване на запад през Атлант, за да откриете града на Златната пирамида.",
        duration: 48,
        steps: [
            "Месеци сред безкрайни води, борейки се с морски чудовища и глад.",
            "Акостиране на брегове, където джунглата е жива и поглъща воини.",
            "Изкачване на стъпаловидните пирамиди под кървава луна.",
            "Размяна на знания с жреците на змията - небесната магия срещу слънчевия календар."
        ],
        final: "Вашите кораби се завръщат, покрити със злато и пера от екзотични птици. Светът вече не е същият!",
        reward: { gold: 10000, power: 500, army: 0, item: "Нефритен череп на Кукулкан" }
    },
    {
        title: "Седемте града на Шибала",
        destination: "Месопотамия (Вавилония)",
        description: "Търсене на изгубените градини на Семирамида и плочките със съдбите на боговете.",
        duration: 14,
        steps: [
            "Пътуване през пустинята, където пясъкът пее забравени песни.",
            "Навлизане в руините на Вавилон под сянката на разрушената кула.",
            "Намиране на скрита библиотека с клинописно писмо за началото на света.",
            "Благословия от водите на Ефрат и Тигър."
        ],
        final: "Експедицията носи древно знание, което ще ускори развитието на вашата държава.",
        reward: { gold: 3000, power: 120, army: 0, item: "Вавилонски астролабия" }
    },
    {
        title: "Легендата за Фусо: Изгряващото слънце",
        destination: "Японски острови",
        description: "Път до края на света, където слънцето се ражда от океана. Търсим майсторите на най-острите остриета.",
        duration: 30,
        steps: [
            "Пресичане на степите и източните морета с помощта на корейски моряци.",
            "Битка с пирати 'воко' в бурните води на изток.",
            "Медитация пред Олтара на Слънцето заедно с местни мъдреци.",
            "Коване на меч в подножието на димяща планина."
        ],
        final: "Вашите воини се завръщат с дисциплина и оръжия, които режат самата светлина.",
        reward: { gold: 0, power: 350, army: 200, item: "Катана на Първия Шогун" }
    },
    // --- ПАКЕТ 3 ---
    {
        title: "Кралство Аксум: Ковчегът на завета",
        destination: "Етиопия (Африканския рог)",
        description: "Тръгвате на юг през пустините на Нубия, за да откриете древното кралство, което пази небесни реликви.",
        duration: 28, 
        steps: [
            "Пресичане на горните прагове на Нил сред хипопотами и крокодили.",
            "Навлизане в етиопските плата, където манастирите са в самите скали.",
            "Среща с Краля-Жрец на Аксум – размяна на тамян и българско сребро.",
            "Ритуал в подножието на планината Симен под зоркия поглед на орлите."
        ],
        final: "Връщате се с благородни метали и тайни, по-стари от самото време.",
        reward: { gold: 4500, power: 220, army: 0, item: "Аксумски златен кръст" }
    },
    {
        title: "Покривът на света: Шамбала",
        destination: "Тибет (Хималаите)",
        description: "Търсене на митичната скрита долина, където времето спира и само чистите по дух могат да влязат.",
        duration: 36, 
        steps: [
            "Изкачване на проходи, където въздухът е рядък и боговете шепнат.",
            "Среща с пазителите на манастирите – изпит на търпението и мъдростта.",
            "Преминаване през езерото Ямдрок, чиито води са сини като очите на Тангра.",
            "Откриване на входа към долината в миг на пълно слънчево затъмнение."
        ],
        final: "Вашите воини се завръщат с вечен покой в душите и непобедима воля.",
        reward: { gold: 0, power: 600, army: 100, item: "Тибетска пееща купа" }
    },
    {
        title: "Земята на Сънното време (Dreamtime)",
        destination: "Австралия (Южните непознати земи)",
        description: "Отвъд Индонезийските острови лежи земя, където животните са странни, а земята помни началото на света.",
        duration: 60,
        steps: [
            "Корабокрушение край коралови рифове и оцеляване на самотен остров.",
            "Пресичане на червените пустини под звездно небе, което не познавате.",
            "Учене от местните старейшини за пътищата на духовете и бумеранга.",
            "Церемония при скалата Улуру под звуците на диджериду."
        ],
        final: "След пет лета, оцелелите се завръщат. Техните истории звучат как лудост, но артефактите им са истински.",
        reward: { gold: 12000, power: 800, army: 0, item: "Древен Бумеранг от Яспис" }
    },
    // --- ПАКЕТ 4 ---
    {
        title: "Винланд: Земята на дивото грозде",
        destination: "Северна Америка (през Гренландия)",
        description: "Тръгвате по стъпките на северните хора, за да откриете земя отвъд ледовете, където дърветата са огромни, а небето гори в зелено.",
        duration: 52,
        steps: [
            "Пресичане на Северно море в съюз с викинги от рода на Лейф Ериксон.",
            "Спирка в Исландия – земята на огъня и леда, за зареждане с провизии.",
            "Преминаване през Гренландия сред айсберги, високи колкото планини.",
            "Акостиране в Лабрадор, където срещате местни родове, рисуващи телата си в червено."
        ],
        final: "Връщате се с непознати плодове и кожа от бяла мечка. Вашето име ще се помни в сагите!",
        reward: { gold: 8000, power: 450, army: 0, item: "Томахавка от Метеоритно желязо" }
    },
    {
        title: "Ел Дорадо: Изгубеният златен град",
        destination: "Амазония (Южна Америка)",
        description: "Легендата за владетел, който се покрива със златен прах и влиза в свещеното езеро. Търсим входа към джунглата.",
        duration: 45,
        steps: [
            "Навлизане в басейна на Амазонка, където растенията се опитват да ви погълнат.",
            "Среща с родове от жени-воини и изпитание с отровни стрели.",
            "Откриване на пирамида, скрита под лиани, чийто връх е от чисто злато.",
            "Ритуал при езерото Гуатавита под звуците на златни тръби."
        ],
        final: "Вашите хора носят толкова злато, че корабите едва не потъват. Вие сте богат над всяко въображение!",
        reward: { gold: 25000, power: 300, army: 0, item: "Златната маска на Слънцето" }
    },
    {
        title: "Кодексът на Бушидо: Островът на деветте провинции",
        destination: "Япония (Кюшу)",
        description: "Търсим тайната на стоманата, която не се чупи, и философията на воина, който не се страхува от смъртта.",
        duration: 32,
        steps: [
            "Дълго плаване през източните морета, избягвайки тайфуните (Камикадзе).",
            "Среща с шогуна в Киото – демонстрация на българската конна стрелба.",
            "Обучение в планините с монаси-воини (Ямабуши).",
            "Коване на острие в свещената ковачница при изгрев слънце."
        ],
        final: "Вашите генерали научават нови тактики. Армията ви става непобедима в близък бой.",
        reward: { gold: 0, power: 400, army: 500, item: "Свитък на Небесната стратегия" }
    },
    {
        title: "Пътят на Абаноса: Кралство Бенин",
        destination: "Западна Африка",
        description: "Търсим майсторите на бронзовите отливки и кралските дворци, облицовани с метал.",
        duration: 20,
        steps: [
            "Пресичане на Сахара с камилски кервани през Тимбукту.",
            "Навлизане в тропическите гори на Гвинейския залив.",
            "Среща с Оба (краля) на Бенин в неговия велик град с геометрични стени.",
            "Обмяна на български кожи срещу изящни бронзови фигури."
        ],
        final: "Донесохте произведения на изкуството, които ще изумят старейшините.",
        reward: { gold: 3500, power: 150, army: 0, item: "Бенински бронзов щит" }
    },
    // --- ПАКЕТ 5 ---
    {
        title: "Оракулът на Дионис: Свещеният огън",
        destination: "Родопите (Перперикон)",
        description: "Търсим древното светилище, където според легендите Александър Велики е получил предсказание за властта си над света.",
        duration: 4, 
        steps: [
            "Навлизане в дебрите на Родопите, където скалите приличат на вкаменени гиганти.",
            "Изкачване на каменния град Перперикон под звуците на древни песни.",
            "Ритуал с вино и огън върху кръглия олтар - ако пламъкът стигне небето, Тангра е с нас.",
            "Среща с пазителите на огъня, които разчитат знаците в пепелта."
        ],
        final: "Пророчеството е ясно: Родът {dynasty} ще владее земи от море до море!",
        reward: { gold: 400, power: 120, army: 0, item: "Златна маска на Тракийски цар" }
    },
    {
        title: "Тайната на Мадарския конник",
        destination: "Североизточна България",
        description: "Изпращате майстори и жреци да изсекат символ на българската мощ върху свещените скали.",
        duration: 6,
        steps: [
            "Избор на най-високата и здрава отвесна скала над платото.",
            "Борба със стихиите, докато каменоделците работят на голяма височина.",
            "Освещаване на релефа с кръвта на свещено животно.",
            "Поставяне на надписи, които ще разказват за делата на Кан {hero} векове наред."
        ],
        final: "Конникът е завършен. Символът на вашата победа над лъва е вечен!",
        reward: { gold: 2000, power: 250, army: 0, item: "Свещен Рогов ритон" }
    },
    {
        title: "Съкровището на Котис: Панагюрските съдове",
        destination: "Долината на царете",
        description: "Вашите разузнавачи откриват следи от заровено злато, скрито по време на големите войни.",
        duration: 3,
        steps: [
            "Търсене на могила, маркирана със знака на слънцето.",
            "Внимателно разкопаване на коридорите, пазени от каменни стражи.",
            "Извличане на златни ритони и фиали с невиждана изработка."
        ],
        final: "Златото блести в шатрата ви. Хазната е препълнена!",
        reward: { gold: 3000, power: 80, army: 0, item: "Златен ритон с еленска глава" }
    },
    {
        title: "Светилището на Самотраки: Великите богове",
        destination: "Егейско море",
        description: "Пътуване до мистичния остров, за да се посветите в мистериите, които дават власт над моретата.",
        duration: 8,
        steps: [
            "Прекосяване на Тракийско море в бурни нощи.",
            "Навлизане в залата на Мистериите, където само посветените могат да стъпят.",
            "Преминаване през изпитания на духа и тялото в пълна тъмнина.",
            "Получаване на железен пръстен – знак за вечна защита."
        ],
        final: "Вие сте Кабир – посветен в тайните на земята и морето.",
        reward: { gold: 0, power: 200, army: 50, item: "Железен пръстен на Кабирите" }
    },
    {
        title: "Могилата Мал-тепе: Гробницата на гиганта",
        destination: "Южна Тракия",
        description: "Експедиция за проучване на най-голямата могила, която според слуховете крие колесницата на Слънцето.",
        duration: 5,
        steps: [
            "Организиране на стотици работници за преместване на земните маси.",
            "Откриване на огромна куполна гробница с уникални фрески.",
            "Намиране на богато украсена колесница с бронзови орнаменти."
        ],
        final: "Вашите воини вече знаят как да строят по-бързи бойни колесници.",
        reward: { gold: 0, power: 100, army: 150, item: "Бронзова колесница" }
    }
];

if (window.legendaryQuests.length === 0) {
    window.legendaryQuests.push(...allCoreQuests);
}

/**
 * ФУНКЦИЯ ЗА СЪЗДАВАНЕ НА МИСТИЧЕН HTML ИЗСКАЧАЩ ПРОЗОРЕЦ
 */
window.showMysticModal = function(title, content, type = "info") {
    const oldModal = document.getElementById('mystic-modal-overlay');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'mystic-modal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px);
        z-index: 30000; display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.3s ease;
    `;

    const themeColor = type === "triumph" ? "#ff4d4d" : "#d4af37";

    const modal = document.createElement('div');
    modal.style.cssText = `
        width: 90%; max-width: 480px; background: radial-gradient(circle, #121212 0%, #050505 100%);
        border: 2px solid ${themeColor}; box-shadow: 0 0 25px rgba(212, 175, 55, 0.2);
        padding: 25px; text-align: center; position: relative;
        transform: scale(0.9); transition: transform 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase; margin-bottom: 5px;">📜 Съветът на старейшините</div>
        <div style="width: 40px; height: 1px; background: ${themeColor}; margin: 0 auto 15px auto;"></div>
        <h3 style="font-family: 'Cinzel', serif; color: ${themeColor}; text-transform: uppercase; margin: 0 0 15px 0; font-size: 1.3em; letter-spacing: 1px;">${title}</h3>
        <div style="font-size: 0.95em; color: #ccc; line-height: 1.6; margin-bottom: 25px; font-family: 'Lora', serif; border-top: 1px dashed #222; border-bottom: 1px dashed #222; padding: 15px 0;">
            ${content}
        </div>
        <button id="mystic-modal-close" style="
            background: #000; color: ${themeColor}; border: 1px solid ${themeColor};
            padding: 10px 30px; font-family: 'Cinzel', serif; font-size: 11px;
            cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
            transition: all 0.2s; box-shadow: inset 0 0 5px rgba(212,175,55,0.1);
        ">Да бъде!</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = "1";
        modal.style.transform = "scale(1)";
    }, 10);

    const closeBtn = modal.querySelector('#mystic-modal-close');
    closeBtn.onmouseover = () => { closeBtn.style.background = themeColor; closeBtn.style.color = "#000"; };
    closeBtn.onmouseout = () => { closeBtn.style.background = "#000"; closeBtn.style.color = themeColor; };
    
    closeBtn.onclick = () => {
        overlay.style.opacity = "0";
        modal.style.transform = "scale(0.9)";
        setTimeout(() => overlay.remove(), 300);
    };
};

/**
 * ОПАСНОСТИ ПО ПЪТЯ
 */
window.handleRandomTravelEvent = function() {
    if (!window.activeExpedition) return;

    if (Math.random() < 0.05) { // 5% шанс за инцидент на ход
        const events = [
            { text: "Буря забавя напредъка ни!", delay: 2 },
            { text: "Открихме пряк път през планината!", delay: -2 },
            { text: "Местни хора ни дариха с храна.", bonus: "gold", val: 100 },
            { text: "Болест повали част от ескорта.", bonus: "army", val: -20 }
        ];
        
        const ev = events[Math.floor(Math.random() * events.length)];
        if (ev.delay) window.activeExpedition.duration += ev.delay;
        if (ev.bonus === "gold") window.currentHero.gold += ev.val;
        if (ev.bonus === "army") window.currentHero.armySize += ev.val;

        if (window.showAdvisorMsg) window.showAdvisorMsg(`⚠️ ВНИМАНИЕ: ${ev.text}`);
    }
};

/**
 * СИСТЕМА ЗА ПРОГРЕС И ПРОВЕРКА НА МИСИИ
 */
window.updateExpeditionSystem = function() {
    if (!window.activeExpedition) return;

    window.activeExpedition.progress++;
    window.handleRandomTravelEvent();
    
    const totalSteps = window.activeExpedition.steps.length;
    const progressPercent = window.activeExpedition.progress / window.activeExpedition.duration;
    const currentStepIndex = Math.floor(progressPercent * totalSteps);
    
    if (window.activeExpedition.progress % 3 === 0) {
        let stepText = window.activeExpedition.steps[currentStepIndex] || "Пътешествието продължава през непознати земи...";
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🌍 [ЕКСПЕДИЦИЯ]: ${stepText.replace("{hero}", window.currentHero.name)}`);
        }
    }

    if (window.activeExpedition.progress >= window.activeExpedition.duration) {
        window.completeExpedition();
    } else {
        window.renderExpeditionButton();
    }
};

window.checkForQuest = function() {
    if (window.activeExpedition) {
        window.updateExpeditionSystem();
        return;
    }

    if (Math.random() < 0.12) {
        const quest = window.legendaryQuests[Math.floor(Math.random() * window.legendaryQuests.length)];
        window.activeExpedition = JSON.parse(JSON.stringify(quest));
        window.activeExpedition.progress = 0;

        window.showMysticModal(
            quest.title, 
            `<b>Дестинация:</b> ${quest.destination}<br><br>${quest.description.replace("{hero}", window.currentHero.name)}<br><br><span style='color: #888;'>Пътят ще отнеме ${quest.duration} хода под закрилата на Тангра.</span>`
        );
        window.renderExpeditionButton();
    }
};

window.renderExpeditionButton = function() {
    const sidebar = document.getElementById('left-sidebar');
    if (!sidebar) return;

    let btn = document.getElementById('btn-expedition');
    if (!window.activeExpedition) { if (btn) btn.remove(); return; }

    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'btn-expedition';
        btn.style.cssText = `
            width: 90%; margin: 10px auto; padding: 12px; background: #000;
            border: 2px solid #d4af37; color: #ffd700; font-family: 'Cinzel', serif;
            font-size: 10px; cursor: pointer; text-transform: uppercase;
            box-shadow: 0 0 15px rgba(212,175,55,0.3); border-radius: 4px; display: block;
        `;
        sidebar.appendChild(btn);
    }

    const remaining = window.activeExpedition.duration - window.activeExpedition.progress;
    btn.innerHTML = `🌍 ${window.activeExpedition.title}<br>
                    <small style="color: #ff4d4d;">Остават: ${remaining} хода</small>`;
    
    btn.onclick = () => {
        window.showMysticModal(
            window.activeExpedition.title,
            `<b>Дестинация:</b> ${window.activeExpedition.destination}<br><br>
             <b>Прогрес:</b> ${window.activeExpedition.progress} от ${window.activeExpedition.duration} хода завършени.<br><br>
             <span style='color: #ffd700;'>Вашите пратеници поддържат висок дух в името на Кан ${window.currentHero.name}!</span>`
        );
    };
};

window.completeExpedition = function() {
    const exp = window.activeExpedition;
    const hero = window.currentHero;

    // Осигуряваме нулеви стойности по подразбиране, ако някоя награда липсва в обекта
    const goldReward = exp.reward.gold || 0;
    const powerReward = exp.reward.power || 0;
    const armyReward = exp.reward.army || 0;

    let rewardSummary = `<span style="color: #ffd700;">+${goldReward}</span> 💰, <span style="color: #ff4d4d;">+${powerReward}</span> ⚔️, <span style="color: #4caf50;">+${armyReward}</span> 🏹`;
    
    const finalContent = `
        ${exp.final.replace("{hero}", hero.name).replace("{dynasty}", hero.dynasty)}<br><br>
        <b>Спечелени блага:</b> ${rewardSummary}<br>
        <b>Донесен артефакт:</b> <span style="color: #ffd700;">${exp.reward.item || "Няма"}</span>
    `;

    window.showMysticModal("Триумфално Завръщане!", finalContent, "triumph");

    hero.gold += goldReward;
    hero.heroPower += powerReward;
    hero.armySize += armyReward;

    if (exp.reward.item && window.acquireArtifact) {
        window.acquireArtifact(exp.reward.item); 
    } else if (exp.reward.item && window.addItemToTreasury) {
        window.addItemToTreasury(exp.reward.item);
    }

    window.activeExpedition = null;
    window.renderExpeditionButton();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};

window.toggleRulerInventory = function() {
    const hero = window.currentHero;
    let items = [];
    if (window.getInventory) {
        items = window.getInventory().map(i => `${i.icon} ${i.name}`);
    }
    if (items.length === 0) items = ["Начален меч", "Родов пръстен"];
    
    let invContent = `👤 <b>ВЛАДЕТЕЛ:</b> Кан ${hero.name}<br>🏰 <b>ДИНАСТИЯ:</b> ${hero.dynasty}<br><br>🏺 <b>СЪКРОВИЩНИЦА:</b><br>`;
    items.forEach((item, index) => {
        invContent += `${index + 1}. ${item}<br>`;
    });
    
    window.showMysticModal("Родова съкровищница", invContent);
};
