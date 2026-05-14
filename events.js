/**
 * МОДУЛ: СЪБИТИЯ - Велика България
 * Управлява динамичните сценарии за обединение на родовете и историческите избори.
 */

window.eventsDatabase = [
    {
        id: "join_odrisi",
        title: "Заветът на Одрисите",
        text: "Терес, лидерът на Одрисите, вижда силата на вашия род. Той предлага да обедините копията си срещу общите врагове, ако покажете, че можете да поддържате голяма войска.",
        // Условие: Родът още не е присъединен и Канът има достатъчно злато
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
        // Условие: Владееш региона Панония (от regions.js)
        condition: (hero) => !window.worldData.clans["Вокил"].isJoined && window.playerRegions.includes("Панония"),
        options: [
            {
                text: "Обедини Панония под своя скиптър (+15 Престиж)",
                action: (hero) => {
                    hero.xp += 15;
                    window.worldData.clans["Вокил"].isJoined = true;
                    // Обновяваме броя земи за йерархията
                    window.worldData.clans["Вокил"].regionsOwned = 1;
                    if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
                    return "Кормисош от Вокил се присъедини към теб. Йерархията на родовете се промени!";
                }
            }
        ]
    },
    {
        id: "council_of_elders",
        title: "Съвет на старейшините",
        text: "Старейшините на водещите български родове се събраха. Те настояват за преразпределение на пасищата в Мизия.",
        condition: (hero) => hero.gold > 300,
        options: [
            {
                text: "Дай им право на управление (-150 💰, +10 Мощ)",
                action: (hero) => {
                    hero.gold -= 150;
                    hero.heroPower += 10;
                    return "Родовете признават вашата щедрост и авторитет.";
                }
            },
            {
                text: "Наложи волята си (0 💰, -5 Мощ)",
                action: (hero) => {
                    hero.heroPower -= 5;
                    return "Старейшините си тръгват с гняв в очите.";
                }
            }
        ]
    }
];
