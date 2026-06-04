/**
 * tournament.js – Елиминационен турнир на героите (с епични разкази)
 * Зависи: gameTime, worldData.clans, ancientCivilizations, BattleCore
 */

window.tournament = (function() {
    // ==================== НАСТРОЙКИ ====================
    const MIN_YEARS_BETWEEN_TOURNAMENTS = 20;
    let tournamentActive = false;
    let currentRound = 0;
    let roundMatches = [];
    let remainingHeroes = [];
    let winner = null;
    let currentDay = 0;
    let tournamentHeroes = [];
    let tournamentInterval = null;
    let lastTournamentYear = null;
    let totalRounds = 0;      // общ брой рундове (за определяне на полуфинал/финал)

    try {
        let saved = localStorage.getItem('tournament_last_year');
        if (saved) lastTournamentYear = parseInt(saved);
    } catch(e) {}

    function saveLastTournamentYear() {
        if (window.gameTime) {
            lastTournamentYear = window.gameTime.year;
            localStorage.setItem('tournament_last_year', lastTournamentYear);
        }
    }

    function canStartTournament() {
        if (!window.gameTime) return false;
        let currentYear = window.gameTime.year;
        if (lastTournamentYear === null) return true;
        return (currentYear - lastTournamentYear) >= MIN_YEARS_BETWEEN_TOURNAMENTS;
    }

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

    function getCivilizationChampions() {
        let civs = [];
        if (window._ancientCivsList) {
            civs = window._ancientCivsList;
        } else {
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
            power: 100 + Math.floor(Math.random() * 150),
            isPlayer: false,
            isCivilization: true
        }));
    }

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

    function simulateBattle(heroA, heroB) {
        let powerA = (heroA.power || 100) * (0.8 + Math.random() * 0.6);
        let powerB = (heroB.power || 100) * (0.8 + Math.random() * 0.6);
        let winner = powerA >= powerB ? heroA : heroB;
        let loser = winner === heroA ? heroB : heroA;
        return { winner, loser };
    }

    // ========== ЕПИЧЕН РАЗКАЗ ЗА МАЧ ==========
    function generateNarrative(heroA, heroB, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber) {
        let heroAName = heroA.name;
        let heroBName = heroB.name;
        let winnerName = winner.name;
        let loserName = loser.name;
        
        let intro = `🏟️ Мач ${matchNumber} от Рунд ${roundNumber}: ${heroAName} срещу ${heroBName}.`;
        let fight = `Битката беше жестока. ${winnerName} надделя с мъка над ${loserName}.`;
        
        if (isFinal) {
            intro = `🏆 **ФИНАЛ** 🏆\n${heroAName} и ${heroBName} се изправят един срещу друг за титлата!`;
            fight = `В епичен сблъсък, ${winnerName} нанесе решителния удар и стана ШАМПИОН на турнира!`;
        } else if (isSemifinal) {
            intro = `🌠 **ПОЛУФИНАЛ** 🌠\n${heroAName} и ${heroBName} се бият за място на финала.`;
            fight = `След изтощителна битка, ${winnerName} победи ${loserName} и продължава напред.`;
        }
        
        // Добавяне на детайли според класа (ако има)
        if (winner.heroObj && winner.heroObj.currentClass) {
            let classLower = winner.heroObj.currentClass.toLowerCase();
            if (classLower.includes("маг")) fight += ` Магическите заклинания на ${winnerName} решиха изхода.`;
            else if (classLower.includes("берсерк")) fight += ` В пристъп на ярост, ${winnerName} разкъса противника.`;
            else if (classLower.includes("паладин")) fight += ` Светлината беше с ${winnerName} в този ден.`;
            else if (classLower.includes("стрелец")) fight += ` Точният мерник на ${winnerName} донесе победата.`;
        }
        
        let message = `${intro}\n${fight}`;
        return message;
    }

    function logMatch(match, winner, loser, roundNumber, isSemifinal, isFinal, matchIndex) {
        let narrative = generateNarrative(match.heroA, match.heroB, winner, loser, roundNumber, isSemifinal, isFinal, matchIndex);
        if (window.addWorldEvent) {
            window.addWorldEvent("🏆 ТУРНИРЕН МАЧ", narrative, "⚔️");
        } else {
            console.log(narrative);
        }
    }

    function log(message, icon = "🏆") {
        if (window.addWorldEvent) {
            window.addWorldEvent("ТУРНИР", message, icon);
        } else {
            console.log(icon, message);
        }
    }

    function nextDay() {
        if (!tournamentActive) return;
        if (!roundMatches.length || currentDay >= roundMatches.length) {
            finishRound();
            return;
        }
        let match = roundMatches[currentDay];
        if (!match) return;
        
        // Проверка за автоматичен бай
        if (match.heroB && match.heroB.isBye) {
            log(`🏅 Ден ${currentDay+1}: ${match.heroA.name} преминава автоматично (почивка).`, "⏭️");
            remainingHeroes.push(match.heroA);
            currentDay++;
            return;
        }
        
        log(`🏅 Ден ${currentDay+1}: ${match.heroA.name} срещу ${match.heroB.name}`, "⚔️");
        let result = simulateBattle(match.heroA, match.heroB);
        let winner = result.winner;
        let loser = result.loser;
        
        // Определяме дали е полуфинал или финал
        let isSemifinal = (totalRounds - currentRound === 1 && remainingHeroes.length <= 4);
        let isFinal = (totalRounds - currentRound === 0 && remainingHeroes.length <= 2);
        if (currentRound === totalRounds && remainingHeroes.length === 1) isFinal = true; // корекция за финал
        
        logMatch(match, winner, loser, currentRound, isSemifinal, isFinal, currentDay+1);
        log(`${winner.name} побеждава!`, "🏅");
        remainingHeroes.push(winner);
        currentDay++;
    }

    function finishRound() {
        if (!tournamentActive) return;
        if (remainingHeroes.length === 1) {
            winner = remainingHeroes[0];
            let finalNarrative = `🏆 **ГРАНД ФИНАЛ** 🏆\nСлед дълга и зрелищна надпревара, ${winner.name} беше коронован за ШАМПИОН на турнира!`;
            if (winner.isPlayer && winner.heroObj) {
                let petIds = Object.keys(window.divinePets || {});
                if (petIds.length) {
                    let randomPet = petIds[Math.floor(Math.random() * petIds.length)];
                    winner.heroObj.pet = randomPet;
                    finalNarrative += ` Като награда, ${winner.name} получава божествен питомец: ${window.divinePets[randomPet].name}! 🐉`;
                } else {
                    finalNarrative += ` Но за съжаление нямаше награден питомец.`;
                }
            }
            log(finalNarrative, "🏆");
            tournamentActive = false;
            saveLastTournamentYear();
            if (tournamentInterval) clearInterval(tournamentInterval);
            tournamentInterval = null;
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
        let targetCount = 1;
        while (targetCount < participants.length) targetCount *= 2;
        while (participants.length < targetCount) {
            participants.push(generateDarkHorse(participants.length));
        }
        totalRounds = Math.log2(participants.length);
        
        // Разбъркваме, но героите на играча да са срещу различни противници в първия рунд
        let playerHeroes = participants.filter(p => p.isPlayer);
        let others = participants.filter(p => !p.isPlayer);
        for (let i = others.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
        }
        let matches = [];
        for (let i = 0; i < playerHeroes.length; i++) {
            if (others.length) {
                matches.push({ heroA: playerHeroes[i], heroB: others.shift(), dayIndex: i });
            } else {
                matches.push({ heroA: playerHeroes[i], heroB: generateDarkHorse(i+100), dayIndex: i });
            }
        }
        while (others.length >= 2) {
            let a = others.shift();
            let b = others.shift();
            matches.push({ heroA: a, heroB: b, dayIndex: matches.length });
        }
        if (others.length === 1) {
            matches.push({ heroA: others[0], heroB: { name: "Почивка", power: 0, isPlayer: false, isBye: true }, dayIndex: matches.length });
        }
        matches.sort((a,b) => a.dayIndex - b.dayIndex);
        
        tournamentHeroes = participants;
        roundMatches = matches;
        remainingHeroes = [];
        currentRound = 1;
        currentDay = 0;
        tournamentActive = true;
        
        log(`🏆 ЗАПОЧВА ТУРНИР! Участници: ${participants.length}`, "🏆");
        log(`Общо рундове: ${totalRounds}. Първи рунд.`, "📋");
        return true;
    }

    function startTournament() {
        if (prepareTournament()) {
            if (!roundMatches.length) {
                tournamentActive = false;
                log("Не може да се стартира турнир - няма мачове.", "❌");
            }
        }
    }

    function advanceTournament() {
        if (tournamentActive) {
            nextDay();
        }
    }

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

// Интеграция с хода на играта
if (typeof window.processTurn === 'function') {
    const originalProcessTurn = window.processTurn;
    window.processTurn = function() {
        originalProcessTurn();
        if (window.tournament && window.tournament.isActive()) {
            window.tournament.advance();
        }
    };
}
