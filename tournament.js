/**
 * tournament.js – Елиминационен турнир (оправена логика на рундове)
 * Версия: 5.3 – премахнат лимит MATCHES_PER_TURN за тест
 */
window.tournament = (function() {
    const MIN_YEARS_BETWEEN_TOURNAMENTS = 20;

    let tournamentActive = false;
    let currentRound = 0;
    let roundMatches = [];
    let remainingHeroes = [];
    let winner = null;
    let totalRounds = 0;
    let lastTournamentYear = null;
    let autoStartCounter = 0;
    let autoStartEnabled = true;

    function resetLastYear() {
        lastTournamentYear = null;
        autoStartEnabled = true;
        autoStartCounter = 0;
        localStorage.removeItem('tournament_last_year');
    }

    try {
        let saved = localStorage.getItem('tournament_last_year');
        if (saved) lastTournamentYear = parseInt(saved);
        if (lastTournamentYear !== null) autoStartEnabled = false;
    } catch(e) {}

    function saveLastTournamentYear() {
        if (window.gameTime) {
            lastTournamentYear = window.gameTime.year;
            localStorage.setItem('tournament_last_year', lastTournamentYear);
            autoStartEnabled = false;
            autoStartCounter = 0;
        }
    }

    function canStartTournament() {
        if (!window.gameTime) return false;
        if (lastTournamentYear === null) return true;
        return (window.gameTime.year - lastTournamentYear) >= MIN_YEARS_BETWEEN_TOURNAMENTS;
    }

    function getAllLivingHeroes() {
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

    function getAllCivilizations() { /* същото като преди */ 
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
        return { winner, loser: winner === heroA ? heroB : heroA };
    }

    function logMatch(match, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber) {
        const isPlayerMatch = (match.heroA.isPlayer === true) || (match.heroB.isPlayer === true);
        if (!isFinal && !isSemifinal && !isPlayerMatch) return;

        let heroAName = match.heroA.name;
        let heroBName = match.heroB.name;
        let winnerName = winner.name;
        let loserName = loser.name;
        
        let narrative = `🏟️ Рунд ${roundNumber}, мач ${matchNumber}: ${heroAName} срещу ${heroBName}. Победител: ${winnerName}.`;
        if (isFinal) {
            narrative = `🏆 **ГРАНД ФИНАЛ** 🏆\n${heroAName} срещу ${heroBName}. ${winnerName} става ШАМПИОН! 🎉`;
        } else if (isSemifinal) {
            narrative = `🌠 **ПОЛУФИНАЛ** 🌠\n${heroAName} срещу ${heroBName}. ${winnerName} победи.`;
        } else if (isPlayerMatch) {
            narrative = `⚔️ **ВАЖЕН МАЧ** ⚔️\n${heroAName} срещу ${heroBName}. ${winnerName} надделя!`;
        }
        if (window.addWorldEvent) {
            window.addWorldEvent("🏆 ТУРНИРЕН МАЧ", narrative, "⚔️");
        }
    }

    function log(message, icon = "🏆") {
        let fullMessage = icon + " " + message;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(fullMessage);
        } else if (window.addWorldEvent) {
            window.addWorldEvent("ТУРНИР", message, icon);
        }
        console.log(fullMessage);
    }

    // ОСНОВНА ПРОМЯНА: Изиграваме ВСИЧКИ мачове от рунда наведнъж
    function advanceTournament() {
        if (!tournamentActive) return;
        
        // Ако няма текущи мачове, опитай да финишираш рунда (това може да стане само при победа)
        if (!roundMatches.length) {
            finishRound();
            return;
        }
        
        // Изиграваме всички мачове от текущия рунд
        for (let i = 0; i < roundMatches.length; i++) {
            let match = roundMatches[i];
            if (!match) continue;
            if (match.heroB && match.heroB.isBye) {
                remainingHeroes.push(match.heroA);
                continue;
            }
            let isSemifinal = (totalRounds - currentRound === 1 && remainingHeroes.length <= 4);
            let isFinal = (totalRounds - currentRound === 0 && remainingHeroes.length <= 2);
            if (currentRound === totalRounds && remainingHeroes.length === 1) isFinal = true;
            
            let result = simulateBattle(match.heroA, match.heroB);
            logMatch(match, result.winner, result.loser, currentRound, isSemifinal, isFinal, i+1);
            remainingHeroes.push(result.winner);
        }
        
        // Рундът приключи – извикваме finishRound
        finishRound();
    }
    
    function finishRound() {
        if (!tournamentActive) return;
        
        if (remainingHeroes.length === 1) {
            winner = remainingHeroes[0];
            let finalMsg = `🏆 **Шампион** 🏆\n${winner.name} спечели турнира!`;
            if (winner.isPlayer && winner.heroObj) {
                let petIds = Object.keys(window.divinePets || {});
                if (petIds.length) {
                    let randomPet = petIds[Math.floor(Math.random() * petIds.length)];
                    winner.heroObj.pet = randomPet;
                    finalMsg += ` Награда: ${winner.name} получава ${window.divinePets[randomPet].name}! 🐉`;
                }
            }
            log(finalMsg, "🏆");
            tournamentActive = false;
            saveLastTournamentYear();
            return;
        }
        
        log(`🎯 Рунд ${currentRound} завърши. Остават ${remainingHeroes.length} участници.`, "📊");
        
        currentRound++;
        roundMatches = createMatches(remainingHeroes);
        remainingHeroes = [];
        
        if (roundMatches.length === 0) {
            tournamentActive = false;
            return;
        }
        log(`🏁 Започва Рунд ${currentRound} (${roundMatches.length} мача).`, "🏁");
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
            if (yearsLeft > 0) log(`Турнирът може да се проведе след ${yearsLeft} години.`, "⏳");
            return false;
        }
        if (tournamentActive) {
            log("Турнир вече е активен!", "⚠️");
            return false;
        }

        let players = getAllLivingHeroes();
        let civs = getCivilizationChampions();
        let participants = [...players, ...civs];
        log(`📋 Събрани ${participants.length} участници.`);

        let targetCount = 1;
        while (targetCount < participants.length) targetCount *= 2;
        let darkHorsesNeeded = targetCount - participants.length;
        for (let i = 0; i < darkHorsesNeeded; i++) {
            participants.push(generateDarkHorse(participants.length));
        }
        if (darkHorsesNeeded > 0) {
            log(`➕ Добавени ${darkHorsesNeeded} тъмни конника.`);
        }

        totalRounds = Math.log2(targetCount);
        // Разбъркване
        for (let i = participants.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [participants[i], participants[j]] = [participants[j], participants[i]];
        }

        roundMatches = createMatches(participants);
        remainingHeroes = [];
        currentRound = 1;
        tournamentActive = true;
        log(`🏆 ЗАПОЧВА ТУРНИР! ${participants.length} участници, ${totalRounds} рунда.`, "🏆");
        return true;
    }

    function startTournament() {
        if (prepareTournament()) {
            if (!roundMatches.length) {
                tournamentActive = false;
                log("Не може да се стартира - няма мачове.", "❌");
            } else {
                autoStartEnabled = false;
                autoStartCounter = 0;
            }
        }
    }

    function checkAutoStart() {
        if (!autoStartEnabled) return;
        if (tournamentActive) return;
        if (lastTournamentYear !== null) {
            autoStartEnabled = false;
            return;
        }
        autoStartCounter++;
        if (autoStartCounter >= 5) {
            log("Автоматично стартиране на турнира след 5 хода.", "⏰");
            startTournament();
            autoStartEnabled = false;
            autoStartCounter = 0;
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
        checkAutoStart: checkAutoStart,
        resetLastYear: resetLastYear
    };
})();

// Презаписваме processTurn, за да сме сигурни, че турнирът напредва всеки ход
const originalProcessTurn = window.processTurn;
window.processTurn = function() {
    if (originalProcessTurn) originalProcessTurn();
    if (window.tournament) {
        if (window.tournament.isActive()) {
            window.tournament.advance();
        } else {
            window.tournament.checkAutoStart();
        }
    }
};
