/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * Актуализиран: Пълна синхронизация с 50 региона и 13 династии.
 */

window.eventsDatabase = [
    {
        id: "dulo_homeland",
        title: "Сърцето на Стара Велика България",
        text: "Кан Кубрат, степите на Фанагория ликуват. Родът Дуло е призован да обедини всички антични българи под един меч.",
        condition: (hero) => window.playerRegions.includes("Стара Велика България") && hero.heroPower < 200,
        options: [
            {
                text: "Вдигни знамената на рода Дуло (+10 Мощ)",
                action: (hero) => {
                    hero.heroPower += 10;
                    return "Вашият авторитет сред степните народи расте!";
                }
            }
        ]
    },
    {
        id: "join_odrisi",
        title: "Заветът на Одрисите",
        text: "Терес, лидерът на Одрисите, вижда силата на вашия род в Тракия. Той предлага съюз, ако покажете, че можете да поддържате голяма войска.",
        condition: (hero) => !window.worldData.clans["Одриси"].isJoined && window.playerRegions.includes("Тракия"),
        options: [
            {
                text: "Приеми Одрисите в обединението (-100 💰)",
                action: (hero) => {
                    hero.gold -= 100;
                    window.worldData.clans["Одриси"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Родът на Одрисите се закле във вярност! Тракия е по-силна от всякога.";
                }
            }
        ]
    },
    {
        id: "vokil_recognition",
        title: "Признанието на Вокил",
        text: "След като подсигурихте пасищата в Панония, родът Вокил вижда във ваше лице истинския лидер. Кормисош е готов за съюз.",
        condition: (hero) => !window.worldData.clans["Вокил"].isJoined && window.playerRegions.includes("Панония"),
        options: [
            {
                text: "Обедини Панония под своя скиптър (+15 Мощ)",
                action: (hero) => {
                    hero.heroPower += 15;
                    window.worldData.clans["Вокил"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Кормисош от Вокил се присъедини към теб.";
                }
            }
        ]
    },
    {
        id: "komitopuli_guardians",
        title: "Проходите на Дардания",
        text: "Никола от рода Комитопули контролира проходите в Дардания. Той ще се присъедини, ако подсилите неговите крепости.",
        condition: (hero) => !window.worldData.clans["Комитопули"].isJoined && window.playerRegions.includes("Дардания"),
        options: [
            {
                text: "Укрепи западната граница (-200 💰)",
                action: (hero) => {
                    hero.gold -= 200;
                    window.worldData.clans["Комитопули"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Комитопули вече пазят нашите западни граници.";
                }
            }
        ]
    },
    {
        id: "ptolomey_recognition",
        title: "Династията на Птоломеите",
        text: "Птоломеите, водещи началото си от днешните български земи (Сотер), търсят своето място в Обединението.",
        condition: (hero) => !window.worldData.clans["Птоломеи"].isJoined && hero.gold > 500,
        options: [
            {
                text: "Признай древното им право (+400 💰)",
                action: (hero) => {
                    hero.gold += 400;
                    window.worldData.clans["Птоломеи"].isJoined = true;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Родът на Птоломеите внесе своето богатство в общата хазна.";
                }
            }
        ]
    },
    {
        id: "council_of_elders",
        title: "Съвет на старейшините",
        text: "Старейшините от всички присъединени родове се събраха. Те искат да разберат каква е следващата ви цел.",
        condition: (hero) => hero.gold > 300,
        options: [
            {
                text: "Раздай злато на родовете (-150 💰, +20 Мощ)",
                action: (hero) => {
                    hero.gold -= 150;
                    hero.heroPower += 20;
                    return "Родовете признават вашата щедрост и авторитет.";
                }
            },
            {
                text: "Запази златото за армията",
                action: (hero) => "Военната мощ е по-важна от дипломацията."
            }
        ]
    }
];
