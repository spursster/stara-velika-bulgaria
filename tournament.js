/**
 * tournament.js – Турнир на шампионите (с интерактивни двубои)
 * Версия: 6.0 – с пауза и бутон за битка
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

    // Състояние за изчакване на играч
    let pendingMatch = null;          // { match, round, matchNumber, isSemifinal, isFinal }
    let tournamentPaused = false;

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
        return { winner, loser: winner === heroA ? heroB : heroA };
    }

    function logMatch(match, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber) {
        const isPlayerMatch = (match.heroA.isPlayer === true) || (match.heroB.isPlayer === true);
        if (!isFinal && !isSemifinal && !isPlayerMatch) return;

        let heroAName = match.heroA.name;
        let heroBName = match.heroB.name;
        let winnerName = winner.name;
        let loserName = loser.name;
        
        let narrative = `🏟️ Рунд ${roundNumber}, двубой ${matchNumber}: ${heroAName} срещу ${heroBName}. Победител: ${winnerName}.`;
        if (isFinal) {
            narrative = `🏆 **ГРАНД ФИНАЛ** 🏆\n${heroAName} срещу ${heroBName}. ${winnerName} става ШАМПИОН на Турнира на шампионите! 🎉`;
        } else if (isSemifinal) {
            narrative = `🌠 **ПОЛУФИНАЛ** 🌠\n${heroAName} срещу ${heroBName}. ${winnerName} победи.`;
        } else if (isPlayerMatch) {
            narrative = `⚔️ **ВАЖЕН ДВУБОЙ** ⚔️\n${heroAName} срещу ${heroBName}. ${winnerName} надделя!`;
        }
        if (window.addWorldEvent) {
            window.addWorldEvent("🏆 ТУРНИР НА ШАМПИОНИТЕ", narrative, "⚔️");
        }
    }

    function log(message, icon = "🏆") {
        let fullMessage = icon + " " + message;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(fullMessage);
        } else if (window.addWorldEvent) {
            window.addWorldEvent("ТУРНИР НА ШАМПИОНИТЕ", message, icon);
        }
        console.log(fullMessage);
    }

    // Показва бутон за битка
    function showTournamentBattleButton(pending) {
        const match = pending.match;
        const heroA = match.heroA;
        const heroB = match.heroB;
        const playerHero = heroA.isPlayer ? heroA : (heroB.isPlayer ? heroB : null);
        const opponent = heroA.isPlayer ? heroB : heroA;
        if (!playerHero) return;

        let btnContainer = document.getElementById('tournament-battle-container');
        if (!btnContainer) {
            btnContainer = document.createElement('div');
            btnContainer.id = 'tournament-battle-container';
            btnContainer.style.cssText = 'position:fixed; bottom:80px; left:50%; transform:translateX(-50%); z-index:10000; background:rgba(0,0,0,0.85); padding:8px 16px; border-radius:40px; border:2px solid #d4af37; backdrop-filter:blur(4px);';
            document.body.appendChild(btnContainer);
        }
        btnContainer.innerHTML = `
            <button id="fight-tournament-btn" style="background:#ff6600; border:none; border-radius:40px; padding:8px 20px; color:white; font-weight:bold; cursor:pointer; font-size:14px;">
                ⚔️ ДВУБОЙ: ${playerHero.name} срещу ${opponent.name} ⚔️
            </button>
        `;
        const fightBtn = document.getElementById('fight-tournament-btn');
        fightBtn.onclick = () => {
            btnContainer.remove();
            startTournamentBattle(pending);
        };

        // Блокираме бутона "Ход"
        const turnBtn = document.querySelector('.next-turn-btn');
        if (turnBtn) turnBtn.disabled = true;
    }

        // Директно използваме оригиналния герой, но добавяме нужните полета
        window._tournamentForcedHero = {
            ...playerHeroObj,   // копираме всички съществуващи полета
            // Гарантираме, че задължителните полета съществуват
            id: playerHeroObj.id,
            name: playerHeroObj.name || playerHeroObj.leaderName,
            className: playerHeroObj.currentClass || "Воевода",
            power: playerHeroObj.heroPower,
            hp: playerHeroObj.hp,
            maxHp: playerHeroObj.maxHp,
            icon: '⚔️',
            clanObj: playerHeroObj,
            troopEffects: window.BattleCore.getTroopSpecialEffects(playerHeroObj),
            armySize: playerHeroObj.armySize || 200,
            // Флаг за идентификация
            _isTournamentForced: true
        };

        // Създаваме противника като "регион" за битката
        const tournamentEnemy = {
            name: opponentHero.name,
            armySize: opponentHero.power,
            defenseLevel: 1,
            isTournamentDuel: true,
            tournamentOpponent: opponentHero
        };

        window._pendingTournamentMatch = {
            pending: pending,
            playerHeroObj: playerHeroObj,
            opponentHero: opponentHero
        };

        window.startBattle(tournamentEnemy);
    }

        window._resolveTournamentMatch = function(isVictory, battleHeroes, enemies, regionName) {
        if (!window._pendingTournamentMatch) return;
        const pending = window._pendingTournamentMatch.pending;
        const match = pending.match;
        
        let winnerHero;
        if (isVictory) {
            winnerHero = match.heroA.isPlayer ? match.heroA : match.heroB;
        } else {
            winnerHero = match.heroA.isPlayer ? match.heroB : match.heroA;
        }
        
        remainingHeroes.push(winnerHero);
        window._pendingTournamentMatch = null;
        
        // ⭐ Изчистваме глобалния флаг
        window._tournamentForcedHero = null;
        
        const turnBtn = document.querySelector('.next-turn-btn');
        if (turnBtn) turnBtn.disabled = false;
        
        pendingMatch = null;
        tournamentPaused = false;
        
        if (window.tournament.isActive()) {
            window.tournament.advance();
        }
    };

    // Нова версия на advanceTournament, която спира при двубой с играч
    function advanceTournament() {
        if (!tournamentActive) return;
        if (tournamentPaused) return;
        if (!roundMatches.length) {
            finishRound();
            return;
        }
        
        // Преминаваме през всички двубои в рунда
        for (let i = 0; i < roundMatches.length; i++) {
            let match = roundMatches[i];
            if (!match) continue;
            if (match.heroB && match.heroB.isBye) {
                remainingHeroes.push(match.heroA);
                continue;
            }
            
            // Проверка дали това е двубой с герой на играча
            const isPlayerMatch = (match.heroA.isPlayer === true) || (match.heroB.isPlayer === true);
            if (isPlayerMatch && !pendingMatch) {
                // Спираме турнира и запазваме този двубой
                pendingMatch = {
                    match: match,
                    round: currentRound,
                    matchNumber: i + 1,
                    isSemifinal: (totalRounds - currentRound === 1 && remainingHeroes.length <= 4),
                    isFinal: (totalRounds - currentRound === 0 && remainingHeroes.length <= 2)
                };
                tournamentPaused = true;
                showTournamentBattleButton(pendingMatch);
                return;   // спираме изпълнението – чакаме играча
            }
            
            // Иначе симулираме битката
            let isSemifinal = (totalRounds - currentRound === 1 && remainingHeroes.length <= 4);
            let isFinal = (totalRounds - currentRound === 0 && remainingHeroes.length <= 2);
            if (currentRound === totalRounds && remainingHeroes.length === 1) isFinal = true;
            
            let result = simulateBattle(match.heroA, match.heroB);
            logMatch(match, result.winner, result.loser, currentRound, isSemifinal, isFinal, i+1);
            remainingHeroes.push(result.winner);
        }
        
        // Ако сме стигнали дотук, значи всички двубои от рунда са обработени (няма pending)
        finishRound();
    }
    
    function finishRound() {
        if (!tournamentActive) return;
        
        if (remainingHeroes.length === 1) {
            winner = remainingHeroes[0];
            let finalMsg = `🏆 **Шампион на Турнира на шампионите** 🏆\n${winner.name} спечели турнира!`;
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
        log(`🏁 Започва Рунд ${currentRound} (${roundMatches.length} двубоя).`, "🏁");
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
        pendingMatch = null;
        tournamentPaused = false;
        log(`🏆 ЗАПОЧВА ТУРНИР НА ШАМПИОНИТЕ! ${participants.length} участници, ${totalRounds} рунда.`, "🏆");
        return true;
    }

    function startTournament() {
        if (prepareTournament()) {
            if (!roundMatches.length) {
                tournamentActive = false;
                log("Не може да се стартира - няма двубои.", "❌");
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
            log("Автоматично стартиране на Турнира на шампионите след 5 хода.", "⏰");
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
