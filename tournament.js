/**
 * tournament.js – Елиминационен турнир на героите
 * Зависи: gameTime, worldData.clans, ancientCivilizations, BattleCore
 */

window.tournament = (function() {
    // ==================== НАСТРОЙКИ ====================
    const MIN_YEARS_BETWEEN_TOURNAMENTS = 20;  // изчакване в години
    let tournamentActive = false;
    let currentRound = 0;
    let roundMatches = [];      // мачове за текущия рунд: [{heroA, heroB, dayIndex}]
    let remainingHeroes = [];   // живи участници след рунд
    let winner = null;
    let currentDay = 0;         // кой ден от рунда се провежда
    let tournamentHeroes = [];   // всички участници в началото
    let tournamentInterval = null;
    let lastTournamentYear = null; // последна година на финал

    // Зареждаме запаметената година (от localStorage)
    try {
        let saved = localStorage.getItem('tournament_last_year');
        if (saved) lastTournamentYear = parseInt(saved);
    } catch(e) {}

    // ==================== ПОМОЩНИ ФУНКЦИИ ====================
    function saveLastTournamentYear() {
        if (window.gameTime) {
            lastTournamentYear = window.gameTime.year;
            localStorage.setItem('tournament_last_year', lastTournamentYear);
        }
    }

    function canStartTournament() {
        if (!window.gameTime) return false;
        let currentYear = window.gameTime.year;
        if (lastTournamentYear === null) return true; // никога не е провеждан
        return (currentYear - lastTournamentYear) >= MIN_YEARS_BETWEEN_TOURNAMENTS;
    }

    // Взема всички живи герои на играча (isJoined && isAlive !== false)
    function getPlayerHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.isJoined === true && h.isAlive !== false) {
                    heroes.push({
                        id: key,
                        name: h.name || h.leaderName,
                        heroObj: h,
                        power: h.heroPower || 100,
                        isPlayer: true
                    });
                }
            }
        }
        return heroes;
    }

    // Взема по един представител от всяка древна цивилизация (allCivilizations)
    function getCivilizationChampions() {
        if (!window.ancientCivilizations) return [];
        // В древните цивилизации нямаме преки герои, затова създаваме временни "шампиони"
        // Ще използваме allCivilizations масива (който е вътре в ancientCivilizations.js, но не е глобален)
        // Вместо това ще вземем от window.worldData.factions? Не. Ще дефинираме списък ръчно.
        // Най-безопасно: използваме списъка от ancientCivilizations.js, ако е достъпен.
        let civs = [];
        if (window._ancientCivsList) {
            civs = window._ancientCivsList;
        } else {
            // Резервен списък (същият като в ancientCivilizations.js)
            civs = [
                "Елфийско кралство", "Двор на феите", "Небесна империя", "Оркска орда",
                "Демонични легиони", "Царство на сенките", "Драконови лордове", "Легион на мъртвите",
                "Атлантидско владение", "Джуджешки подземия", "Монголска империя", "Османска империя",
                "Викингски кралства", "Хазарски каганат", "Абасидски халифат"
            ];
        }
        return civs.map((civName, idx) => ({
            id: `civ_${idx}`,
            name: `${civName} шампион`,
            heroObj: null,
            power: 100 + Math.floor(Math.random() * 150), // случайна сила
            isPlayer: false,
            isCivilization: true
        }));
    }

    // Генерира автоматичен герой за запълване (тъмен конник)
    function generateDarkHorse(index) {
        const names = ["Тъмен конник", "Мистериозен странник", "Безличен воин", "Сянка", "Призрачен боец"];
        return {
            id: `dark_${index}`,
            name: names[index % names.length] + " " + (Math.floor(index / names.length) + 1),
            heroObj: null,
            power: 80 + Math.floor(Math.random() * 70),
            isPlayer: false,
            isDarkHorse: true
        };
    }

    // Симулира битка 1vs1 (без да отваря UI, използва BattleCore изчисления)
    function simulateBattle(heroA, heroB) {
        // Създаваме временни hero обекти за BattleCore (ако няма clanObj)
        let fakeHeroA = heroA.heroObj ? heroA.heroObj : {
            name: heroA.name,
            heroPower: heroA.power,
            hp: 200,
            maxHp: 200,
            armySize: 200,
            currentArmy: 200,
            isAlive: true
        };
        let fakeHeroB = heroB.heroObj ? heroB.heroObj : {
            name: heroB.name,
            heroPower: heroB.power,
            hp: 200,
            maxHp: 200,
            armySize: 200,
            currentArmy: 200,
            isAlive: true
        };
        // Опростена симулация – сравняваме мощ + случайност
        let powerA = (fakeHeroA.heroPower || 100) * (0.8 + Math.random() * 0.6);
        let powerB = (fakeHeroB.heroPower || 100) * (0.8 + Math.random() * 0.6);
        let winner = powerA >= powerB ? heroA : heroB;
        let loser = winner === heroA ? heroB : heroA;
        return { winner, loser };
    }

    // Добавя събитие в летописа
    function log(message, icon = "🏆") {
        if (window.addWorldEvent) {
            window.addWorldEvent("ТУРНИР", message, icon);
        } else {
            console.log(icon, message);
        }
    }

    // Започва следващия ден от рунда (извиква се при натискане на "Ход")
    function nextDay() {
        if (!tournamentActive) return;
        if (!roundMatches.length || currentDay >= roundMatches.length) {
            // Край на рунда, обработваме победителите
            finishRound();
            return;
        }
        let match = roundMatches[currentDay];
        if (!match) return;
        log(`🏅 Ден ${currentDay+1}: ${match.heroA.name} срещу ${match.heroB.name}`, "⚔️");
        let result = simulateBattle(match.heroA, match.heroB);
        log(`${result.winner.name} побеждава!`, "🏅");
        remainingHeroes.push(result.winner);
        currentDay++;
    }

    function finishRound() {
        if (!tournamentActive) return;
        if (remainingHeroes.length === 1) {
            // Край на турнира
            winner = remainingHeroes[0];
            log(`🏆 ПОБЕДИТЕЛ В ТУРНИРА: ${winner.name} 🏆`, "🏆");
            // Награждаване с божествен питомец, ако е герой на играча
            if (winner.isPlayer && winner.heroObj) {
                let petIds = Object.keys(window.divinePets || {});
                if (petIds.length) {
                    let randomPet = petIds[Math.floor(Math.random() * petIds.length)];
                    winner.heroObj.pet = randomPet;
                    log(`${winner.name} получава божествен питомец: ${window.divinePets[randomPet].name}!`, "🐉");
                } else {
                    log(`${winner.name} не можа да получи питомец (няма дефинирани божествени питомци).`, "⚠️");
                }
            }
            tournamentActive = false;
            saveLastTournamentYear();
            if (tournamentInterval) clearInterval(tournamentInterval);
            tournamentInterval = null;
            return;
        }
        // Преминаваме към следващ рунд
        currentRound++;
        roundMatches = createMatches(remainingHeroes);
        remainingHeroes = [];
        currentDay = 0;
        if (roundMatches.length === 0) {
            // Нещо се обърка – край
            tournamentActive = false;
            return;
        }
        log(`--- РУНД ${currentRound} ---`, "⚔️");
        // Стартираме следващия ден (ще се задейства при следващ ход)
    }

    function createMatches(participants) {
        let matches = [];
        for (let i = 0; i < participants.length; i += 2) {
            if (i+1 < participants.length) {
                matches.push({ heroA: participants[i], heroB: participants[i+1] });
            } else {
                // Автоматичен бай (не трябва да се случва, защото допълваме до степен 2)
                matches.push({ heroA: participants[i], heroB: { name: "Почивка", power: 0, isPlayer: false, isBye: true } });
            }
        }
        return matches;
    }

    function prepareTournament() {
        if (!canStartTournament()) {
            log(`Турнирът може да се проведе след ${MIN_YEARS_BETWEEN_TOURNAMENTS - (window.gameTime.year - lastTournamentYear)} години.`, "⏳");
            return false;
        }
        if (tournamentActive) {
            log("Турнир вече е активен! Завършете текущия или изчакайте.", "⚠️");
            return false;
        }
        // Събираме участници
        let players = getPlayerHeroes();
        let civs = getCivilizationChampions();
        let participants = [...players, ...civs];
        // Броят участници трябва да е степен на 2
        let targetCount = 1;
        while (targetCount < participants.length) targetCount *= 2;
        while (participants.length < targetCount) {
            participants.push(generateDarkHorse(participants.length));
        }
        // Разбъркваме (но запазваме правилото героите на играча да не са в един мач в първи рунд)
        let playerHeroes = participants.filter(p => p.isPlayer);
        let others = participants.filter(p => !p.isPlayer);
        // Разбъркваме останалите
        for (let i = others.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
        }
        // Създаваме мачове в първия рунд така, че всеки герой на играча да е срещу различен противник и в различен ден
        let matches = [];
        for (let i = 0; i < playerHeroes.length; i++) {
            if (others.length) {
                matches.push({ heroA: playerHeroes[i], heroB: others.shift(), dayIndex: i });
            } else {
                // Ако няма достатъчно други, добавяме тъмен конник
                matches.push({ heroA: playerHeroes[i], heroB: generateDarkHorse(i+100), dayIndex: i });
            }
        }
        // Останалите други (civilizations и dark horses) се сдвояват помежду си
        while (others.length >= 2) {
            let a = others.shift();
            let b = others.shift();
            matches.push({ heroA: a, heroB: b, dayIndex: matches.length });
        }
        if (others.length === 1) {
            // Бай (автоматично преминаване)
            matches.push({ heroA: others[0], heroB: { name: "Почивка", power: 0, isPlayer: false, isBye: true }, dayIndex: matches.length });
        }
        // Сортираме мачовете по dayIndex, за да са в правилния ред на дните
        matches.sort((a,b) => a.dayIndex - b.dayIndex);
        
        tournamentHeroes = participants;
        roundMatches = matches;
        remainingHeroes = [];
        currentRound = 1;
        currentDay = 0;
        tournamentActive = true;
        
        log(`🏆 ЗАПОЧВА ТУРНИР! Участници: ${participants.length}`, "🏆");
        log(`Първи рунд. Мачове: ${roundMatches.length}`, "📋");
        return true;
    }

    // Публична функция за придвижване на турнира (да се извиква от processTurn)
    function advanceTournament() {
        if (tournamentActive) {
            nextDay();
        }
    }

    // Стартиране на турнира (от бутон)
    function startTournament() {
        if (prepareTournament()) {
            // Ако има нула мачове или нещо нередно, прекратяваме
            if (!roundMatches.length) {
                tournamentActive = false;
                log("Не може да се стартира турнир - няма мачове.", "❌");
            }
        }
    }

    // Проверка дали може да се стартира (за бутон)
    function canStart() {
        return canStartTournament() && !tournamentActive;
    }

    return {
        start: startTournament,
        advance: advanceTournament,
        canStart: canStart,
        isActive: function() { return tournamentActive; }
    };
})();

// Интеграция с хода на играта (ако съществува window.processTurn)
if (typeof window.processTurn === 'function') {
    const originalProcessTurn = window.processTurn;
    window.processTurn = function() {
        originalProcessTurn();
        if (window.tournament && window.tournament.isActive()) {
            window.tournament.advance();
        }
    };
}
