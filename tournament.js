/**
 * tournament.js – Елиминационен турнир на всички герои + цивилизации
 * Автоматично стартира на 5-тия ход при нова игра.
 */

window.tournament = (function() {
    const MIN_YEARS_BETWEEN_TOURNAMENTS = 20;
    let tournamentActive = false;
    let currentRound = 0;
    let roundMatches = [];
    let remainingHeroes = [];
    let winner = null;
    let currentDay = 0;
    let totalRounds = 0;
    let lastTournamentYear = null;
    let _autoStartCounter = 0;       // брояч за автоматично стартиране
    let _autoStartEnabled = true;    // дали очакваме автоматично стартиране

    try {
        let saved = localStorage.getItem('tournament_last_year');
        if (saved) lastTournamentYear = parseInt(saved);
        // Ако има запазена година, значи турнир е провеждан – изключваме автоматичното стартиране
        if (lastTournamentYear !== null) _autoStartEnabled = false;
    } catch(e) {}

    function saveLastTournamentYear() {
        if (window.gameTime) {
            lastTournamentYear = window.gameTime.year;
            localStorage.setItem('tournament_last_year', lastTournamentYear);
            _autoStartEnabled = false;   // вече не очакваме автоматично стартиране
            _autoStartCounter = 0;
        }
    }

    function canStartTournament() {
        if (!window.gameTime) return false;
        if (lastTournamentYear === null) return true;   // никога не е провеждан
        return (window.gameTime.year - lastTournamentYear) >= MIN_YEARS_BETWEEN_TOURNAMENTS;
    }

    // Всички живи герои на играча
    function getPlayerHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.isAlive !== false) {
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

    function getAllCivilizations() {
        return [
            "Елфийско кралство", "Двор на феите", "Небесна империя", "Оркска орда",
            "Демонични легиони", "Царство на сенките", "Драконови лордове", "Легион на мъртвите",
            "Атлантидско владение", "Джуджешки подземия", "Монголска империя", "Османска империя",
            "Викингски кралства", "Хазарски каганат", "Абасидски халифат"
        ];
    }

    function getCivilizationChampions() {
        let civs = getAllCivilizations();
        return civs.map((civName, idx) => ({
            id: `civ_${idx}`,
            name: `🏺 ${civName} шампион`,
            heroObj: null,
            power: 80 + Math.floor(Math.random() * 120),
            isPlayer: false,
            isCivilization: true
        }));
    }

    function generateDarkHorse(index) {
        const names = ["🌑 Тъмен конник", "👤 Мистериозен странник", "🗡️ Безличен воин", "🌙 Сянка", "👻 Призрачен боец"];
        return {
            id: `dark_${index}`,
            name: `${names[index % names.length]} ${Math.floor(index / names.length) + 1}`,
            heroObj: null,
            power: 60 + Math.floor(Math.random() * 80),
            isPlayer: false,
            isDarkHorse: true
        };
    }

    function simulateBattle(heroA, heroB) {
        let powerA = (heroA.power || 100) * (0.7 + Math.random() * 0.7);
        let powerB = (heroB.power || 100) * (0.7 + Math.random() * 0.7);
        let winner = powerA >= powerB ? heroA : heroB;
        let loser = winner === heroA ? heroB : heroA;
        return { winner, loser };
    }

    function generateNarrative(match, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber) {
        let heroAName = match.heroA.name;
        let heroBName = match.heroB.name;
        let winnerName = winner.name;
        let loserName = loser.name;
        let intro = `🏟️ Мач ${matchNumber} от Рунд ${roundNumber}: ${heroAName} срещу ${heroBName}.`;
        let fight = `Битката беше жестока. ${winnerName} надделя над ${loserName}.`;
        if (isFinal) {
            intro = `🏆 **ФИНАЛ** 🏆\n${heroAName} и ${heroBName} се изправят един срещу друг за титлата!`;
            fight = `След епична битка, ${winnerName} нанесе решителния удар и стана ШАМПИОН на турнира!`;
        } else if (isSemifinal) {
            intro = `🌠 **ПОЛУФИНАЛ** 🌠\n${heroAName} и ${heroBName} се бият за място на финала.`;
            fight = `След изтощителна битка, ${winnerName} победи ${loserName} и продължава напред.`;
        }
        if (winner.heroObj && winner.heroObj.currentClass) {
            let cls = winner.heroObj.currentClass.toLowerCase();
            if (cls.includes("маг")) fight += ` Магията на ${winnerName} беше решаваща.`;
            else if (cls.includes("берсерк")) fight += ` В пристъп на ярост, ${winnerName} разкъса противника.`;
            else if (cls.includes("паладин")) fight += ` Светлината в очите на ${winnerName} донесе победата.`;
        }
        return `${intro}\n${fight}`;
    }

    function logMatch(match, winner, loser, roundNumber, isSemifinal, isFinal, matchIndex) {
        let narrative = generateNarrative(match, winner, loser, roundNumber, isSemifinal, isFinal, matchIndex);
        if (window.addWorldEvent) window.addWorldEvent("🏆 ТУРНИРЕН МАЧ", narrative, "⚔️");
        else console.log(narrative);
    }

    function log(message, icon = "🏆") {
        if (window.addWorldEvent) window.addWorldEvent("ТУРНИР", message, icon);
        else console.log(icon, message);
    }

    function nextDay() {
        if (!tournamentActive) return;
        if (!roundMatches.length || currentDay >= roundMatches.length) {
            finishRound();
            return;
        }
        let match = roundMatches[currentDay];
        if (!match) return;
        if (match.heroB && match.heroB.isBye) {
            log(`⏭️ Ден ${currentDay+1}: ${match.heroA.name} преминава автоматично (почивка).`);
            remainingHeroes.push(match.heroA);
            currentDay++;
            return;
        }
        log(`⚔️ Ден ${currentDay+1}: ${match.heroA.name} срещу ${match.heroB.name}`);
        let result = simulateBattle(match.heroA, match.heroB);
        let isSemifinal = (totalRounds - currentRound === 1 && remainingHeroes.length <= 4);
        let isFinal = (totalRounds - currentRound === 0 && remainingHeroes.length <= 2);
        if (currentRound === totalRounds && remainingHeroes.length === 1) isFinal = true;
        logMatch(match, result.winner, result.loser, currentRound, isSemifinal, isFinal, currentDay+1);
        log(`🏅 ${result.winner.name} побеждава!`);
        remainingHeroes.push(result.winner);
        currentDay++;
    }

    function finishRound() {
        if (!tournamentActive) return;
        if (remainingHeroes.length === 1) {
            winner = remainingHeroes[0];
            let finalMsg = `🏆 **ГРАНД ФИНАЛ** 🏆\nСлед дълга надпревара, ${winner.name} беше коронован за ШАМПИОН на турнира!`;
            if (winner.isPlayer && winner.heroObj) {
                let petIds = Object.keys(window.divinePets || {});
                if (petIds.length) {
                    let randomPet = petIds[Math.floor(Math.random() * petIds.length)];
                    winner.heroObj.pet = randomPet;
                    finalMsg += ` Като награда, ${winner.name} получава божествен питомец: ${window.divinePets[randomPet].name}! 🐉`;
                }
            }
            log(finalMsg, "🏆");
            tournamentActive = false;
            saveLastTournamentYear();
            return;
        }
        currentRound++;
        roundMatches = createMatches(remainingHeroes);
        remainingHeroes = [];
        currentDay = 0;
        if (roundMatches.length === 0) {
            tournamentActive = false;
            return;
        }
        log(`--- РУНД ${currentRound} ---`, "⚔️");
    }

    function createMatches(participants) {
        let matches = [];
        for (let i = 0; i < participants.length; i += 2) {
            if (i+1 < participants.length) {
                matches.push({ heroA: participants[i], heroB: participants[i+1] });
            } else {
                matches.push({ heroA: participants[i], heroB: { name: "Почивка", power: 0, isPlayer: false, isBye: true } });
            }
        }
        return matches;
    }

    function prepareTournament() {
        if (!canStartTournament()) {
            let yearsLeft = MIN_YEARS_BETWEEN_TOURNAMENTS - (window.gameTime.year - lastTournamentYear);
            log(`Турнирът може да се проведе след ${yearsLeft} години.`, "⏳");
            return false;
        }
        if (tournamentActive) {
            log("Турнир вече е активен!", "⚠️");
            return false;
        }

        let players = getPlayerHeroes();
        let civs = getCivilizationChampions();
        let participants = [...players, ...civs];
        let originalCount = participants.length;
        log(`📋 Събрани ${originalCount} участници (${players.length} герои на играча + ${civs.length} цивилизации).`);

        let targetCount = 1;
        while (targetCount < participants.length) targetCount *= 2;
        let darkHorsesNeeded = targetCount - participants.length;
        for (let i = 0; i < darkHorsesNeeded; i++) {
            participants.push(generateDarkHorse(participants.length));
        }
        if (darkHorsesNeeded > 0) {
            log(`➕ Добавени ${darkHorsesNeeded} тъмни конника за достигане на ${targetCount} участници.`);
        }

        totalRounds = Math.log2(targetCount);
        for (let i = participants.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [participants[i], participants[j]] = [participants[j], participants[i]];
        }

        roundMatches = createMatches(participants);
        remainingHeroes = [];
        currentRound = 1;
        currentDay = 0;
        tournamentActive = true;
        log(`🏆 ЗАПОЧВА ТУРНИР! Участници: ${participants.length} (${totalRounds} рунда).`, "🏆");
        return true;
    }

    function startTournament() {
        if (prepareTournament()) {
            if (!roundMatches.length) {
                tournamentActive = false;
                log("Не може да се стартира турнир - няма мачове.", "❌");
            } else {
                // Ако стартира ръчно, спираме автоматичното броене
                _autoStartEnabled = false;
                _autoStartCounter = 0;
            }
        }
    }

    function advanceTournament() {
        if (tournamentActive) {
            nextDay();
        }
    }

    // Автоматично стартиране на 5-тия ход след нова игра
    function checkAutoStart() {
        if (!_autoStartEnabled) return;
        if (tournamentActive) return;
        if (lastTournamentYear !== null) {
            _autoStartEnabled = false;
            return;
        }
        _autoStartCounter++;
        if (_autoStartCounter >= 5) {
            log("Автоматично стартиране на първия турнир (5-ти ход).", "🏆");
            startTournament();
            _autoStartEnabled = false;
            _autoStartCounter = 0;
        }
    }

    function canStart() {
        return canStartTournament() && !tournamentActive;
    }

    return {
        start: startTournament,
        advance: advanceTournament,
        canStart: canStart,
        isActive: function() { return tournamentActive; },
        checkAutoStart: checkAutoStart   // за външно извикване от processTurn
    };
})();

// Интеграция с processTurn – добавяме автоматичното засичане
if (typeof window.processTurn === 'function') {
    const originalProcessTurn = window.processTurn;
    window.processTurn = function() {
        originalProcessTurn();
        if (window.tournament) {
            if (window.tournament.isActive()) {
                window.tournament.advance();
            } else {
                window.tournament.checkAutoStart();
            }
        }
    };
}
