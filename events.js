/**
 * МОДУЛ: СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА - Велика България
 * Синхронизиран: Добавяне на статус за присъединяване и икони на родовете.
 */

window.worldData = {
    // Основни държави (Фракции)
    factions: {
        "bulgarian_empire": {
            nameBG: "Велика България",
            nameUS: "Great Bulgaria",
            rulerTitleBG: "Кан",
            capitalBG: "Фанагория"
        },
        "rhomaioi_empire": {
            nameBG: "Ромейска Империя (Rhomaioi)",
            nameUS: "Roman Empire (Rhomaioi)",
            relation: -20,
            power: 500
        },
        "persian_empire": {
            nameBG: "Персийска Империя",
            nameUS: "Persian Empire",
            relation: 0,
            power: 1000
        }
    },

    // Данни за родовете с икони и статус на присъединяване (isJoined)
    // В началото само управляващият род (напр. Дуло) е присъединен (true)
    clans: {
        "Дуло": { icon: "assets/icons/clans/dulo.png", isJoined: true, regionsControlled: 1 },
        "Вокил": { icon: "assets/icons/clans/vokil.png", isJoined: false, regionsControlled: 0 },
        "Ерми": { icon: "assets/icons/clans/ermi.png", isJoined: false, regionsControlled: 0 },
        "Угаин": { icon: "assets/icons/clans/ugain.png", isJoined: false, regionsControlled: 0 },
        "Куригир": { icon: "assets/icons/clans/kurigir.png", isJoined: false, regionsControlled: 0 },
        "Комитопули": { icon: "assets/icons/clans/komitopuli.png", isJoined: false, regionsControlled: 0 },
        "Асеневци": { icon: "assets/icons/clans/asenevci.png", isJoined: false, regionsControlled: 0 },
        "Тертер": { icon: "assets/icons/clans/terter.png", isJoined: false, regionsControlled: 0 },
        "Смилец": { icon: "assets/icons/clans/smilec.png", isJoined: false, regionsControlled: 0 },
        "Шишмановци": { icon: "assets/icons/clans/shishmanovci.png", isJoined: false, regionsControlled: 0 },
        "Македони": { icon: "assets/icons/clans/makedoni.png", isJoined: false, regionsControlled: 0 },
        "Птоломеи": { icon: "assets/icons/clans/ptolomey.png", isJoined: false, regionsControlled: 0 },
        "Одриси": { icon: "assets/icons/clans/odrisi.png", isJoined: false, regionsControlled: 0 }
    },

    regions: {
        "Северна Тракия": { terrain: "Равнина", resource: "Злато", nativeClans: ["Одриси", "Беси"], difficulty: 10 },
        "Мизия": { terrain: "Гора", resource: "Дървесина", nativeClans: ["Гети", "Кробизи"], difficulty: 25 },
        "Македония": { terrain: "Планина", resource: "Желязо", nativeClans: ["Едони", "Пеони"], difficulty: 40 },
        "Добруджа": { terrain: "Степ", resource: "Коне", nativeClans: ["Скити"], difficulty: 30 },
        "Панония": { terrain: "Равнина", resource: "Зърно", nativeClans: ["Вокил"], difficulty: 35 },
        "Севтполис": { terrain: "Долина", resource: "Рози и Злато", nativeClans: ["Одриси"], difficulty: 15 }
    },

    majorClans: [
        "Дуло", "Вокил", "Ерми", "Угаин", "Куригир", "Комитопули", 
        "Асеневци", "Тертер", "Смилец", "Шишмановци", "Македони", "Птоломеи", "Одриси"
    ]
};

/**
 * Обновява броя региони за всеки род в реално време (за йерархията в десния панел)
 */
window.updateClanPowerSync = function() {
    // Тази функция ще се извиква след превземане на земя или брак
    // Тя ще преброява колко региона в window.playerRegions принадлежат на кой род
    console.log("Йерархията на родовете е преизчислена.");
};

window.getRegionReport = function(regionName) {
    const region = window.worldData.regions[regionName];
    if (!region) return;
    const clans = region.nativeClans.join(", ");
    const report = `Земята ${regionName} се владее от родове: ${clans}. Тук изобилства ресурсът: ${region.resource}.`;
    if (window.showAdvisorMsg) window.showAdvisorMsg(report);
};
