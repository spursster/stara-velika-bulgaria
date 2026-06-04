/**
 * tournament.js – Елиминационен турнир (всички мачове наведнъж, филтрирани съобщения)
 */

window.tournament = (function() {
    const MIN_YEARS_BETWEEN_TOURNAMENTS = 20;
    let tournamentActive = false;
    let lastTournamentYear = null;
    let autoStartCounter = 0;
    let autoStartEnabled = true;

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

    function log(message, icon = "🏆") {
        if (window.addWorldEvent) {
            window.addWorldEvent("ТУРНИР", message, icon);
        } else {
            console.log(icon, message);
        }
    }

    function logMatch(match, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber) {
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
        let narrative = `${intro}\n${fight}`;
        if (window.addWorldEvent) {
            window.addWorldEvent("🏆 ТУРНИРЕН МАЧ", narrative, "⚔️");
        } else {
            console.log(narrative);
        }
    }

    // Основна функция, която изпълнява целия турнир наведнъж
    function runFullTournament() {
        let players = getAllLivingHeroes();
        let civs = getCivilizationChampions();
        let participants = [...players, ...civs];
        log(`📋 Събрани ${participants.length} участници (${players.length} герои + ${civs.length} цивилизации).`);

        let targetCount = 1;
        while (targetCount < participants.length) targetCount *= 2;
        let darkHorsesNeeded = targetCount - participants.length;
        for (let i = 0; i < darkHorsesNeeded; i++) {
            participants.push(generateDarkHorse(participants.length));
        }
        if (darkHorsesNeeded > 0) {
            log(`➕ Добавени ${darkHorsesNeeded} тъмни конника за достигане на ${targetCount} участници.`);
        }

        let totalRounds = Math.log2(targetCount);
        log(`🏆 ЗАПОЧВА ТУРНИР! Участници: ${participants.length} (${totalRounds} рунда).`, "🏆");

        // Разбъркваме участниците
        for (let i = participants.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [participants[i], participants[j]] = [participants[j], participants[i]];
        }

        let currentParticipants = participants;
        let roundNumber = 1;
        let playerHeroIds = new Set(players.map(p => p.id));

        while (currentParticipants.length > 1) {
            let nextRound = [];
            let matchNumber = 1;
            let isSemifinal = (currentParticipants.length === 4);
            let isFinal = (currentParticipants.length === 2);

            for (let i = 0; i < currentParticipants.length; i += 2) {
                let heroA = currentParticipants[i];
                let heroB = currentParticipants[i+1];
                if (!heroB) {
                    // бай (автоматично преминаване)
                    nextRound.push(heroA);
                    continue;
                }
                let result = simulateBattle(heroA, heroB);
                let winner = result.winner;
                let loser = result.loser;

                // Решение дали да покажем мача
                let shouldShow = false;
                if (isFinal || isSemifinal) {
                    shouldShow = true;
                } else {
                    // Проверяваме дали някой от участниците е герой на играча
                    if (playerHeroIds.has(heroA.id) || playerHeroIds.has(heroB.id)) {
                        shouldShow = true;
                    }
                }

                if (shouldShow) {
                    logMatch({ heroA, heroB }, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber);
                }
                nextRound.push(winner);
                matchNumber++;
            }
            currentParticipants = nextRound;
            roundNumber++;
        }

        let champion = currentParticipants[0];
        let finalMsg = `🏆 **ГРАНД ФИНАЛ** 🏆\nСлед дълга надпревара, ${champion.name} беше коронован за ШАМПИОН на турнира!`;
        if (champion.isPlayer && champion.heroObj) {
            let petIds = Object.keys(window.divinePets || {});
            if (petIds.length) {
                let randomPet = petIds[Math.floor(Math.random() * petIds.length)];
                champion.heroObj.pet = randomPet;
                finalMsg += ` Като награда, ${champion.name} получава божествен питомец: ${window.divinePets[randomPet].name}! 🐉`;
            }
        }
        log(finalMsg, "🏆");
        saveLastTournamentYear();
        tournamentActive = false;
    }

    function startTournament() {
        if (!canStartTournament()) {
            let yearsLeft = MIN_YEARS_BETWEEN_TOURNAMENTS - (window.gameTime.year - lastTournamentYear);
            log(`Турнирът може да се проведе след ${yearsLeft} години.`, "⏳");
            return false;
        }
        if (tournamentActive) {
            log("Турнир вече е активен!", "⚠️");
            return false;
        }
        tournamentActive = true;
        runFullTournament();
        return true;
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
            log("Автоматично стартиране на първия турнир (5-ти ход).", "🏆");
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
        canStart: canStart,
        isActive: function() { return tournamentActive; },
        checkAutoStart: checkAutoStart
    };
})();

// Автоматично задвижване от processTurn (само за проверка на автостарт)
if (typeof window.processTurn === 'function') {
    const original = window.processTurn;
    window.processTurn = function() {
        original();
        if (window.tournament && !window.tournament.isActive()) {
            window.tournament.checkAutoStart();
        }
    };
}
