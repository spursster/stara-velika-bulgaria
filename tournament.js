/**
 * tournament.js – Турнир на шампионите (с поддръжка на женски владетелки)
 * Версия: 8.2
 */

window.tournament = (function() {
    const MIN_YEARS_BETWEEN_TOURNAMENTS = 20;
    const MATCHES_PER_TURN = 3;

    let tournamentActive = false;
    let currentRound = 0;
    let roundMatches = [];
    let remainingHeroes = [];
    let winner = null;
    let totalRounds = 0;
    let lastTournamentYear = null;
    let autoStartCounter = 0;
    let autoStartEnabled = true;
    let currentMatchIndex = 0;
    let pendingMatch = null;
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
                        isPlayer: true,
                        isHired: h.isJoined === true
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
            isHired: false
        }));
    }

    // === ФУНКЦИЯ ЗА ЖЕНСКИ ВЛАДЕТЕЛКИ ===
    function getRandomFemaleRulers(count) {
        if (!window.femaleWorldRulers || window.femaleWorldRulers.length === 0) return [];
        const shuffled = [...window.femaleWorldRulers];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count).map((ruler, idx) => ({
            id: `ruler_${ruler.name.replace(/\s/g, '_')}_${idx}`,
            name: `${ruler.flag} ${ruler.name}`,
            heroObj: null,
            power: ruler.power,
            isPlayer: false,
            isHired: false,
            isFemaleRuler: true
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
            isHired: false
        };
    }

    function simulateBattle(heroA, heroB) {
        let powerA = (heroA.power || 100) * (0.7 + Math.random() * 0.7);
        let powerB = (heroB.power || 100) * (0.7 + Math.random() * 0.7);
        let winner = powerA >= powerB ? heroA : heroB;
        let loser = winner === heroA ? heroB : heroA;
        
        if (winner.heroObj && typeof window.gainHeroXP === 'function') {
            window.gainHeroXP(winner.heroObj, Math.floor(10 + Math.random() * 15));
        }
        if (loser.heroObj && typeof window.gainHeroXP === 'function') {
            window.gainHeroXP(loser.heroObj, Math.floor(5 + Math.random() * 10));
        }
        return { winner, loser };
    }

    function logMatch(match, winner, loser, roundNumber, isSemifinal, isFinal, matchNumber) {
        const isImportant = (match.heroA.isHired === true) || (match.heroB.isHired === true);
        if (!isFinal && !isSemifinal && !isImportant) return;

        let heroAName = match.heroA.name;
        let heroBName = match.heroB.name;
        let winnerName = winner.name;
        
        let narrative = `🏟️ Рунд ${roundNumber}, двубой ${matchNumber}: ${heroAName} срещу ${heroBName}. Победител: ${winnerName}.`;
        if (isFinal) {
            narrative = `🏆 **ГРАНД ФИНАЛ** 🏆\n${heroAName} срещу ${heroBName}. ${winnerName} става ШАМПИОН на Турнира на шампионите! 🎉`;
        } else if (isSemifinal) {
            narrative = `🌠 **ПОЛУФИНАЛ** 🌠\n${heroAName} срещу ${heroBName}. ${winnerName} победи.`;
        } else if (isImportant) {
            narrative = `⚔️ **ВАЖЕН ДВУБОЙ** ⚔️\n${heroAName} срещу ${heroBName}. ${winnerName} надделя!`;
        }
        if (window.addWorldEvent) {
            window.addWorldEvent("🏆 ТУРНИР НА ШАМПИОНИТЕ", narrative, "⚔️");
        }
    }

    function log(message, icon = "🏆") {
        if (window.addWorldEvent) {
            window.addWorldEvent("ТУРНИР НА ШАМПИОНИТЕ", message, icon);
        }
    }

    function showTournamentBattleButton(pending) {
        const match = pending.match;
        const heroA = match.heroA;
        const heroB = match.heroB;
        const playerHero = heroA.isHired ? heroA : (heroB.isHired ? heroB : null);
        const opponent = heroA.isHired ? heroB : heroA;
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
        const turnBtn = document.querySelector('.next-turn-btn');
        if (turnBtn) turnBtn.disabled = true;
    }

    function startTournamentBattle(pending) {
        const match = pending.match;
        const playerHero = match.heroA.isHired ? match.heroA : match.heroB;
        const opponentHero = match.heroA.isHired ? match.heroB : match.heroA;
        
        if (!playerHero || !playerHero.heroObj) {
            console.error("❌ Турнир: Няма герой на играча за този двубой!");
            return;
        }
        
        const playerHeroObj = playerHero.heroObj;
        
        window._tournamentForcedHero = {
            ...playerHeroObj,
            id: playerHero.id,
            clanObj: playerHeroObj,
            _isTournamentForced: true
        };
        
        const tournamentEnemy = {
            name: opponentHero.name,
            armySize: opponentHero.power,
            defenseLevel: 1,
            isTournamentDuel: true,
            tournamentOpponent: opponentHero
        };
        
        window._pendingTournamentMatch = { pending, playerHeroObj, opponentHero };
        
        if (typeof window.startBattle === 'function') {
            window.startBattle(tournamentEnemy);
        } else {
            console.error("❌ window.startBattle не е функция!");
        }
    }

    window._resolveTournamentMatch = function(isVictory, battleHeroes, enemies, regionName) {
        if (!window._pendingTournamentMatch) return;
        const pending = window._pendingTournamentMatch.pending;
        const match = pending.match;
        
        let winnerHero;
        if (isVictory) {
            winnerHero = match.heroA.isHired ? match.heroA : match.heroB;
        } else {
            winnerHero = match.heroA.isHired ? match.heroB : match.heroA;
        }
        let opponentHero = (match.heroA === winnerHero) ? match.heroB : match.heroA;
        
        // Намираме оригиналния обект на победителя
        let originalWinner = winnerHero.heroObj;
        if (!originalWinner || !originalWinner.isJoined) {
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.name === winnerHero.name && h.clan === winnerHero.clan) {
                    originalWinner = h;
                    winnerHero.heroObj = h;
                    break;
                }
            }
        }
        
        if (opponentHero && opponentHero.heroObj && typeof window.gainHeroXP === 'function') {
            window.gainHeroXP(opponentHero.heroObj, Math.floor(5 + Math.random() * 10));
        }
        if (winnerHero && winnerHero.heroObj && typeof window.gainHeroXP === 'function') {
            window.gainHeroXP(winnerHero.heroObj, Math.floor(5 + Math.random() * 10));
        }
        
        remainingHeroes.push(winnerHero);
        
        window._pendingTournamentMatch = null;
        window._tournamentForcedHero = null;
        
        const turnBtn = document.querySelector('.next-turn-btn');
        if (turnBtn) turnBtn.disabled = false;
        
        pendingMatch = null;
        tournamentPaused = false;
        
        currentMatchIndex++;
        
        if (currentMatchIndex < roundMatches.length) {
            setTimeout(() => {
                if (window.tournament && window.tournament.isActive()) {
                    window.tournament.advance();
                }
            }, 100);
        } else {
            finishRound();
        }
    };

    function advanceTournament() {
        if (!tournamentActive) return;
        if (tournamentPaused) return;
        if (!roundMatches.length) {
            finishRound();
            return;
        }
        if (currentMatchIndex >= roundMatches.length) {
            finishRound();
            return;
        }

        let matchesProcessed = 0;
        while (matchesProcessed < MATCHES_PER_TURN && currentMatchIndex < roundMatches.length && !tournamentPaused) {
            let match = roundMatches[currentMatchIndex];
            if (!match) break;
            
            if (match.heroB && match.heroB.isBye) {
                remainingHeroes.push(match.heroA);
                currentMatchIndex++;
                matchesProcessed++;
                continue;
            }
            
            const hasHired = (match.heroA.isHired === true) || (match.heroB.isHired === true);
            if (hasHired && !pendingMatch) {
                pendingMatch = {
                    match: match,
                    round: currentRound,
                    matchNumber: currentMatchIndex + 1,
                    isSemifinal: (totalRounds - currentRound === 1 && remainingHeroes.length <= 4),
                    isFinal: (totalRounds - currentRound === 0 && remainingHeroes.length <= 2)
                };
                tournamentPaused = true;
                showTournamentBattleButton(pendingMatch);
                return;
            }
            
            let isSemifinal = (totalRounds - currentRound === 1 && remainingHeroes.length <= 4);
            let isFinal = (totalRounds - currentRound === 0 && remainingHeroes.length <= 2);
            if (currentRound === totalRounds && remainingHeroes.length === 1) isFinal = true;
            
            let result = simulateBattle(match.heroA, match.heroB);
            logMatch(match, result.winner, result.loser, currentRound, isSemifinal, isFinal, currentMatchIndex + 1);
            remainingHeroes.push(result.winner);
            
            currentMatchIndex++;
            matchesProcessed++;
        }
        
        if (currentMatchIndex >= roundMatches.length) {
            finishRound();
        }
    }

    function finishRound() {
        if (!tournamentActive) return;
        
        if (remainingHeroes.length === 1) {
            winner = remainingHeroes[0];
            let trueWinnerObj = winner.heroObj;
            if (!trueWinnerObj || !trueWinnerObj.isJoined) {
                for (let key in window.worldData.clans) {
                    let h = window.worldData.clans[key];
                    if (h.name === winner.name && h.clan === winner.clan) {
                        trueWinnerObj = h;
                        winner.heroObj = h;
                        break;
                    }
                }
            }
            let finalMsg = `🏆 **Шампион на Турнира на шампионите** 🏆\n${winner.name} спечели турнира!`;
            
            if (trueWinnerObj) {
                let petIds = Object.keys(window.divinePets || {});
                if (petIds.length > 0) {
                    let randomPet = petIds[Math.floor(Math.random() * petIds.length)];
                    trueWinnerObj.pet = randomPet;
                    if (window.rpgDatabase && window.rpgDatabase.petsDatabase) {
                        let petData = window.divinePets[randomPet];
                        if (petData) {
                            window.rpgDatabase.petsDatabase[randomPet] = {
                                name: petData.name,
                                icon: petData.icon,
                                desc: petData.desc
                            };
                        }
                    }
                    if (trueWinnerObj.isAuto && typeof window.autoEquipHero === 'function') {
                        window.autoEquipHero(trueWinnerObj);
                    }
                    finalMsg += ` Награда: ${winner.name} получава ${window.divinePets[randomPet].name}! 🐉`;
                }
                if (window.gameTime) {
                    window.addTournamentWinner(
                        trueWinnerObj,
                        window.gameTime.year,
                        trueWinnerObj.heroPower || winner.power || 100,
                        trueWinnerObj.currentClass,
                        trueWinnerObj.pet ? (window.divinePets?.[trueWinnerObj.pet]?.name || trueWinnerObj.pet) : null
                    );
                }
            } else {
                if (window.gameTime) {
                    window.addTournamentWinner(
                        { name: winner.name, currentClass: winner.className || "Воевода" },
                        window.gameTime.year,
                        winner.power || 100,
                        winner.className || "Воевода",
                        null
                    );
                }
                finalMsg += ` (Наградата не може да бъде присъдена поради техническа грешка.)`;
            }
            
            log(finalMsg, "🏆");
            tournamentActive = false;
            saveLastTournamentYear();
            
            if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
            if (typeof window.renderFavoriteHeroesBar === 'function') window.renderFavoriteHeroesBar();
            if (typeof window.updateAllUI === 'function') window.updateAllUI();
            return;
        }
        
        log(`🎯 Рунд ${currentRound} завърши. Остават ${remainingHeroes.length} участници.`, "📊");
        
        currentRound++;
        roundMatches = createMatches(remainingHeroes);
        remainingHeroes = [];
        currentMatchIndex = 0;
        
        if (roundMatches.length === 0) {
            tournamentActive = false;
            return;
        }
        log(`🏁 Започва Рунд ${currentRound} (${roundMatches.length} двубоя).`, "🏁");
        setTimeout(() => advanceTournament(), 100);
    }

    function createMatches(participants) {
        let matches = [];
        for (let i = 0; i < participants.length; i += 2) {
            if (i+1 < participants.length) {
                matches.push({ heroA: participants[i], heroB: participants[i+1] });
            } else {
                matches.push({ heroA: participants[i], heroB: { name: "Почивка", power: 0, isPlayer: false, isHired: false, isBye: true } });
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
        let femaleRulers = getRandomFemaleRulers(8);
        let participants = [...players, ...civs, ...femaleRulers];
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
        for (let i = participants.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [participants[i], participants[j]] = [participants[j], participants[i]];
        }

        roundMatches = createMatches(participants);
        remainingHeroes = [];
        currentRound = 1;
        currentMatchIndex = 0;
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
                setTimeout(() => advanceTournament(), 100);
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

// Класация на победителите
window.tournamentWinners = window.tournamentWinners || [];
try {
    const saved = localStorage.getItem('tournament_winners');
    if (saved) window.tournamentWinners = JSON.parse(saved);
} catch(e) {}

function saveTournamentWinners() {
    localStorage.setItem('tournament_winners', JSON.stringify(window.tournamentWinners.slice(0, 30)));
}

window.addTournamentWinner = function(winnerObj, year, power, className, petName) {
    const entry = {
        name: winnerObj.name || winnerObj.leaderName,
        year: year,
        power: power,
        class: className || winnerObj.currentClass || "Воевода",
        pet: petName || (winnerObj.pet ? (window.divinePets?.[winnerObj.pet]?.name || winnerObj.pet) : "—"),
        timestamp: Date.now()
    };
    window.tournamentWinners.unshift(entry);
    if (window.tournamentWinners.length > 30) window.tournamentWinners.pop();
    saveTournamentWinners();
};

window.showTournamentLeaderboard = function() {
    const winners = window.tournamentWinners;
    const modal = document.createElement('div');
    modal.id = 'tournament-leaderboard-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        z-index: 200000; font-family: 'Cinzel', serif;
    `;

    let listHtml = '';
    if (winners.length === 0) {
        listHtml = `<div style="text-align: center; padding: 40px; color: #aaa;">🏆 Все още няма завършен турнир. Бъди първият шампион! 🏆</div>`;
    } else {
        listHtml = winners.map((w, idx) => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 10px 15px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(212,175,55,0.3);">
                <div style="width: 40px; font-size: 24px; font-weight: bold; color: #ffd966;">${idx+1}.</div>
                <div style="flex: 2; font-weight: bold;">🏆 ${w.name}</div>
                <div style="flex: 1;">📅 ${w.year} г.</div>
                <div style="flex: 1;">⚔️ ${w.power}</div>
                <div style="flex: 1; background: rgba(0,0,0,0.5); padding: 4px 8px; border-radius: 20px;">🎭 ${w.class}</div>
                <div style="flex: 1;">🐉 ${w.pet}</div>
            </div>
        `).join('');
    }

    modal.innerHTML = `
        <div style="background: linear-gradient(145deg, #1a1a2e, #16213e); border: 2px solid #d4af37; border-radius: 24px; padding: 20px; max-width: 900px; width: 95%; max-height: 80vh; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #ffd966;">🏅 ЕЛИТНА КЛАСАЦИЯ НА ШАМПИОНИТЕ 🏅</h2>
                <button id="close-leaderboard" style="background: #d4af37; border: none; font-size: 20px; width: 36px; height: 36px; border-radius: 50%; cursor: pointer;">✕</button>
            </div>
            <div style="overflow-y: auto; flex: 1;">
                <div style="display: flex; gap: 15px; padding: 8px 15px; background: #0f0f1a; border-radius: 12px; margin-bottom: 8px; font-weight: bold; color: #ffd966;">
                    <div style="width: 40px;">#</div>
                    <div style="flex: 2;">Шампион</div>
                    <div style="flex: 1;">Година</div>
                    <div style="flex: 1;">Сила</div>
                    <div style="flex: 1;">Клас</div>
                    <div style="flex: 1;">Питомец</div>
                </div>
                ${listHtml}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#close-leaderboard').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
};

// Закачаме турнира към processTurn, ако не е вече
const originalProcessTurn = window.processTurn;
if (originalProcessTurn) {
    window.processTurn = function() {
        originalProcessTurn();
        if (window.tournament) {
            if (!window.tournament.isActive()) {
                window.tournament.checkAutoStart();
            } else {
                window.tournament.advance();
            }
        }
    };
}
