/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * Актуализиран: Пълна база данни със събития за всички 13 династии.
 */

window.eventsDatabase = [
    {
        id: "join_odrisi",
        title: "Заветът на Одрисите",
        text: "Терес, лидерът на Одрисите, вижда силата на вашия род. Той предлага да обедините копията си срещу общите врагове, ако покажете, че можете да поддържате голяма войска.",
        condition: (hero) => !window.worldData.clans["Одриси"].isJoined && hero.gold > 200,
        options: [
            {
                text: "Приеми Одрисите в обединението (-100 💰)",
                action: (hero) => {
                    hero.gold -= 100;
                    window.worldData.clans["Одриси"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Родът на Одрисите се закле във вярност! Техният лидер вече заема своето място в съвета.";
                }
            },
            {
                text: "Твърде рано е за такъв съюз",
                action: (hero) => "Одрисите остават настрана, чакайки по-силен знак за вашето величие."
            }
        ]
    },
    {
        id: "vokil_recognition",
        title: "Признанието на Вокил",
        text: "След като осигурихте пасищата в Панония, родът Вокил вижда във ваше лице истинския наследник на старата слава. Кормисош е готов да преклони глава.",
        condition: (hero) => !window.worldData.clans["Вокил"].isJoined && window.playerRegions.includes("Панония"),
        options: [
            {
                text: "Обедини Панония под своя скиптър (+15 Мощ)",
                action: (hero) => {
                    hero.heroPower += 15;
                    window.worldData.clans["Вокил"].isJoined = true;
                    window.worldData.clans["Вокил"].regionsOwned = 1;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Кормисош от Вокил се присъедини към теб. Йерархията на родовете се промени!";
                }
            }
        ]
    },
    {
        id: "ermi_honour",
        title: "Честта на рода Ерми",
        text: "Гостун от рода Ерми предлага своите опитни съветници, за да укрепят държавната хазна, но изисква висок ранг в йерархията.",
        condition: (hero) => !window.worldData.clans["Ерми"].isJoined && hero.heroPower > 120,
        options: [
            {
                text: "Приеми Гостун за съветник (+200 💰)",
                action: (hero) => {
                    hero.gold += 200;
                    window.worldData.clans["Ерми"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Родът Ерми се присъедини към Великото Обединение!";
                }
            }
        ]
    },
    {
        id: "ugain_challenge",
        title: "Предизвикателството на Угаин",
        text: "Телец от рода Угаин поставя под съмнение вашата военна мощ. Докажете му силата си, като съберете огромна войска.",
        condition: (hero) => !window.worldData.clans["Угаин"].isJoined && hero.armySize > 500,
        options: [
            {
                text: "Респектирай Угаин с мощта си (+20 Мощ)",
                action: (hero) => {
                    hero.heroPower += 20;
                    window.worldData.clans["Угаин"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Телец призна вашето превъзходство и присъедини рода си.";
                }
            }
        ]
    },
    {
        id: "kurigir_nomads",
        title: "Конниците на Куригир",
        text: "Ирник води конниците на Куригир от далечните степи. Те търсят нова земя и са готови да служат на каузата ви.",
        condition: (hero) => !window.worldData.clans["Куригир"].isJoined && window.playerRegions.includes("Добруджа"),
        options: [
            {
                text: "Дай им пасища в Добруджа (+100 Конница)",
                action: (hero) => {
                    hero.armySize += 100;
                    window.worldData.clans["Куригир"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Куригир се вляха във вашата армия!";
                }
            }
        ]
    },
    {
        id: "komitopuli_fortress",
        title: "Крепостите на Комитопули",
        text: "Никола от рода Комитопули държи ключовите проходи на запад. Той иска злато, за да подсили укрепленията в името на Кана.",
        condition: (hero) => !window.worldData.clans["Комитопули"].isJoined && hero.gold > 500,
        options: [
            {
                text: "Инвестирай в западните земи (-300 💰)",
                action: (hero) => {
                    hero.gold -= 300;
                    window.worldData.clans["Комитопули"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Комитопули вече пазят западните ни граници.";
                }
            }
        ]
    },
    {
        id: "asenevci_rebellion",
        title: "Въстанието на Асеневци",
        text: "Асен търси съюз срещу потисниците на античните българи. Вашата подкрепа ще превърне неговия род в най-верния ви съюзник.",
        condition: (hero) => !window.worldData.clans["Асеневци"].isJoined && hero.heroPower > 150,
        options: [
            {
                text: "Освободете земите заедно (+50 Мощ)",
                action: (hero) => {
                    hero.heroPower += 50;
                    window.worldData.clans["Асеневци"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Асеневци се заклеха във вярност пред меча на Кана!";
                }
            }
        ]
    },
    {
        id: "terter_alliance",
        title: "Династичният съюз на Тертер",
        text: "Георги от рода Тертер предлага политическо сближаване, за да се осигури стабилност в региона на Мизия.",
        condition: (hero) => !window.worldData.clans["Тертер"].isJoined && window.playerRegions.includes("Мизия"),
        options: [
            {
                text: "Сключи съюз с Тертер",
                action: (hero) => {
                    window.worldData.clans["Тертер"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Родът Тертер вече е част от Великото Обединение.";
                }
            }
        ]
    },
    {
        id: "smilec_merchants",
        title: "Търговските пътища на Смилец",
        text: "Смилец контролира търговията по Дунав. Присъединяването му ще донесе невиждани богатства.",
        condition: (hero) => !window.worldData.clans["Смилец"].isJoined && hero.gold > 1000,
        options: [
            {
                text: "Осигури търговията (+300 💰)",
                action: (hero) => {
                    hero.gold += 300;
                    window.worldData.clans["Смилец"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Хазната се пълни благодарение на рода Смилец.";
                }
            }
        ]
    },
    {
        id: "shishmanovci_unity",
        title: "Единството на Шишмановци",
        text: "Михаил от рода Шишмановци предлага да обедините армиите си за поход към нови хоризонти.",
        condition: (hero) => !window.worldData.clans["Шишмановци"].isJoined && hero.armySize > 600,
        options: [
            {
                text: "Обедини армиите (+50 Армия)",
                action: (hero) => {
                    hero.armySize += 50;
                    window.worldData.clans["Шишмановци"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Шишмановци застанаха под знамето на Кана.";
                }
            }
        ]
    },
    {
        id: "makedoni_legions",
        title: "Легионите на Македони",
        text: "Василий от рода Македони предлага обучение на вашите бойци според древните стратегии на нашите деди.",
        condition: (hero) => !window.worldData.clans["Македони"].isJoined && window.playerRegions.includes("Македония"),
        options: [
            {
                text: "Обучи войската (+30 Мощ)",
                action: (hero) => {
                    hero.heroPower += 30;
                    window.worldData.clans["Македони"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Родът Македони внесе дисциплина в нашите редици.";
                }
            }
        ]
    },
    {
        id: "ptolomey_heritage",
        title: "Наследството на Сотер",
        text: "Династията на Птоломеите, водеща началото си от нашите земи, търси признание. Те предлагат злато и влияние за Обединението.",
        condition: (hero) => !window.worldData.clans["Птоломеи"].isJoined && hero.gold < 1500,
        options: [
            {
                text: "Приеми златото на Птоломеите (+400 💰)",
                action: (hero) => {
                    hero.gold += 400;
                    window.worldData.clans["Птоломеи"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Птоломеите са официално признати за част от Велика България.";
                }
            }
        ]
    }
];
