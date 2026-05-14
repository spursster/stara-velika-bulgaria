/**
 * МОДУЛ: СВЕТОВНИ ДАННИ И ГЕОПОЛИТИКА - Велика България
 * Синхронизиран: Добавяне на статус за присъединяване, икони и мощ на родовете.
 */

window.worldData = {
    // Основни държави (Фракции) - Ромеи и Перси
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

    // ДАННИ ЗА РОДОВЕТЕ: Икони, статус на обединение и притежавани земи
    // Само първият род (Дуло) започва като присъединен (isJoined: true)
    clans: {
        "Дуло": { icon: "assets/icons/clans/dulo.png", isJoined: true, regionsOwned: 1, leader: "Кан Кубрат" },
        "Вокил": { icon: "assets/icons/clans/vokil.png", isJoined: false, regionsOwned: 0, leader: "Кормисош" },
        "Ерми": { icon: "assets/icons/clans/ermi.png", isJoined: false, regionsOwned: 0, leader: "Гостун" },
        "Угаин": { icon: "assets/icons/clans/ugain.png", isJoined: false, regionsOwned: 0, leader: "Телец" },
        "Куригир": { icon: "assets/icons/clans/kurigir.png", isJoined: false, regionsOwned: 0, leader: "Ирник" },
        "Комитопули": { icon: "assets/icons/clans/komitopuli.png", isJoined: false, regionsOwned: 0, leader: "Никола" },
        "Асеневци": { icon: "assets/icons/clans/asenevci.png", isJoined: false, regionsOwned: 0, leader: "Асен" },
        "Тертер": { icon: "assets/icons/clans/terter.png", isJoined: false, regionsOwned: 0, leader: "Георги" },
        "Смилец": { icon: "assets/icons/clans/smilec.png", isJoined: false, regionsOwned: 0, leader: "Смилец" },
        "Шишмановци": { icon: "assets/icons/clans/shishmanovci.png", isJoined: false, regionsOwned: 0, leader: "Михаил" },
        "Македони": { icon: "assets/icons/clans/makedoni.png", isJoined: false, regionsOwned: 0, leader: "Василий" },
        "Птоломеи": { icon: "assets/icons/clans/ptolomey.png", isJoined: false, regionsOwned: 0, leader: "Птоломей I" },
        "Одриси": { icon: "assets/icons/clans/odrisi.png", isJoined: false, regionsOwned: 0, leader: "Терес" }
    },

    // Детайлни данни за провинциите
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
 * Преизчислява йерархията на присъединените родове спрямо броя на техните земи.
 * Извиква се при всяко разширение на територията.
 */
window.recalculateClanHierarchy = function() {
    const joinedClans = window.worldData.majorClans
        .filter(name => window.worldData.clans[name].isJoined)
        .sort((a, b) => window.worldData.clans[b].regionsOwned - window.worldData.clans[a].regionsOwned);
    
    console.log("Нова йерархия на обединението:", joinedClans);
    return joinedClans;
};

window.getRegionReport = function(regionName) {
    const region = window.worldData.regions[regionName];
    if (!region) return;
    const clans = region.nativeClans.join(", ");
    const report = `Земята ${regionName} се владее от родове: ${clans}. Тук изобилства ресурсът: ${region.resource}.`;
    if (window.showAdvisorMsg) window.showAdvisorMsg(report);
};
