/**
 ==========================================================================
 МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 ВЕРСИЯ: 3.4 – С АВТОМАТИЧНИ ИНТЕРАКТИВНИ СЪБИТИЯ
 ==========================================================================
 */

// Настройка за безсмъртие (по подразбиране true)
if (window.immortalHeroes === undefined) window.immortalHeroes = true;

// След като съберете 2 или 3 артефакта от един сет, се показва бутон за активиране
window.pendingSetBonuses = {}; // key: setKey, value: heroId
window.artifactSalvageCurrency = 0; // "есенция на реликви"

// Проверява дали героят има 2+ артефакта от един сет
window.checkSetCompletion = function(hero) {
    if (!hero.inventory) return;
    const setCounts = {};
    for (let art of hero.inventory) {
        if (art && art.set) setCounts[art.set] = (setCounts[art.set] || 0) + 1;
    }
    for (let setKey in setCounts) {
        if (setCounts[setKey] >= 2 && !hero.activeSetBonuses?.[setKey]) {
            // Показваме интерактивно съобщение
            const ev = window.ChronicleEvents.generateSetBonusOffer(setKey, setCounts[setKey]);
            window.showAdvisorMsg(ev.message, ev.buttons);
            window.pendingSetBonuses[setKey] = hero.id;
        }
    }
};

window.salvageArtifact = function(hero, artifactIndex) {
    const artifact = hero.inventory[artifactIndex];
    if (!artifact) return;
    const essence = Math.floor(artifact.rarity * 10) || 10;
    window.artifactSalvageCurrency = (window.artifactSalvageCurrency || 0) + essence;
    hero.inventory.splice(artifactIndex, 1);
    window.showAdvisorMsg(`🔮 Претопихте "${artifact.name}" и получихте ${essence} есенция на реликви.`);
    // Може да добавим бутон за използване на есенцията за подобряване на друг артефакт
};

// Помощна функция за показване на съобщения
function showTimeMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        console.log(`${title}: ${message}`);
    }
}

window.updateTimeUI = function() {
    if (!window.gameTime) return;
    const timeDisplay = document.getElementById('current-time-info') || 
                        document.getElementById('stat-time') || 
                        document.getElementById('time-display') || 
                        document.getElementById('game-time') || 
                        document.getElementById('time-info');
    if (!timeDisplay) return;

    const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
    const currentSeason = seasons[window.gameTime.seasonIndex] || "Сезон";
    timeDisplay.innerHTML = `${currentSeason} ${window.gameTime.year} г. ${window.gameTime.era}`;
};

if (!window.gameTime) {
    window.gameTime = { seasonIndex: 0, year: 632, era: "от н.е." };
}

// ==================== ИСТОРИЧЕСКИ СЪБИТИЯ ПО ГОДИНИ ====================
function checkHistoricalEvents() {
    if (!window.gameTime) return;
    const year = window.gameTime.year;
    const era = window.gameTime.era;
    if (era !== "от н.е.") return;
    
    const events = {
        681: { title: "ОСНОВАВАНЕ НА БЪЛГАРИЯ", desc: "Кан Аспарух основава Дунавска България!", icon: "🏰" },
        717: { title: "ОБСАДА НА КОНСТАНТИНОПОЛ", desc: "Кан Тервел спасява Византия от арабите.", icon: "⚔️" },
        811: { title: "БИТКАТА ВЪВ ВЪРБИШКИЯ ПРОХОД", desc: "Кан Крум разбива византийската армия.", icon: "🏆" },
        864: { title: "ПОКРЪСТВАНЕ НА БЪЛГАРИЯ", desc: "Княз Борис I приема християнството.", icon: "✝️" },
        893: { title: "ПРЕСЛАВСКИ СЪБОР", desc: "Кирилицата става официална азбука.", icon: "📜" },
        1018: { title: "ПАДАНЕ НА ПЪРВАТА БЪЛГАРСКА ДЪРЖАВА", desc: "Византия покорява България.", icon: "💔" },
        1185: { title: "ВЪСТАНИЕ НА АСЕН И ПЕТЪР", desc: "Възстановяване на българската държава.", icon: "🔥" },
        1205: { title: "БИТКАТА ПРИ ОДРИН", desc: "Цар Калоян разбива латинците.", icon: "⚔️" },
        1396: { title: "ПАДАНЕ ПОД ОСМАНСКА ВЛАСТ", desc: "Търновград е превзет.", icon: "😢" },
        1878: { title: "ОСВОБОЖДЕНИЕ НА БЪЛГАРИЯ", desc: "Възстановяване на българската държава.", icon: "🎉" }
    };
    
    if (events[year]) {
        const ev = events[year];
        showTimeMessage(ev.title, ev.desc, "info");
        if (window.addWorldEvent) {
            window.addWorldEvent(ev.title, ev.desc, ev.icon, `${year} г. ${era}`);
        }
    }
}

// ==================== ЕФЕКТИ ОТ ВЪЗРАСТТА (САМО КОЗМЕТИЧНИ) ====================
function applyAgeEffects(hero) {
    if (!hero) return;
    if (window.immortalHeroes) {
        // Безсмъртни герои – няма намаляване на силата, няма смърт от старост
        return;
    }
    // Алтернативен режим (ако някога се включи) – оставяме логиката, но тя не се използва
    const age = hero.age || 30;
    if (age >= 60) {
        let penalty = Math.min(0.3, (age - 60) * 0.01);
        let originalPower = hero.baseHeroPower || hero.heroPower || 100;
        let newPower = Math.floor(originalPower * (1 - penalty));
        if (hero.heroPower > newPower) {
            hero.heroPower = newPower;
            showTimeMessage("СТАРЕЕНЕ", `👴 ${hero.name} остарява и силата му намалява с ${Math.floor(penalty*100)}%.`, "warning");
            if (window.updateCharacterUI) window.updateCharacterUI(hero);
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
        }
    }
    if (age >= 80) {
        let deathChance = Math.min(0.15, (age - 80) * 0.02);
        if (Math.random() < deathChance) {
            showTimeMessage("СМЪРТ", `💀 ${hero.name} умира от старост на ${age} години.`, "error");
            if (window.worldData && window.worldData.clans) {
                for (let key in window.worldData.clans) {
                    if (window.worldData.clans[key] === hero) {
                        delete window.worldData.clans[key];
                        break;
                    }
                }
            }
            if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
        }
    }
}

// ==================== СВЕТОВНА ДИНАМИКА (ИЗВАДЕНА ОТ processTime) ====================
window.processWorldDynamics = function() {
    if (!window.worldData || !window.worldData.clans) return;
    
    const clans = Object.values(window.worldData.clans);
    let playerHero = null;
    if (typeof window.getStrongestHero === 'function') {
        playerHero = window.getStrongestHero();
    }
    if (!playerHero && window.currentHero) playerHero = window.currentHero;
    
    clans.forEach(hero => {
        if (hero.isAlive === false) return;
        if (playerHero && hero.name === playerHero.name) return;
        
        if (hero.aggression > 0.5) {
            const randomTarget = clans[Math.floor(Math.random() * clans.length)];
            if (randomTarget && randomTarget.name !== hero.name && randomTarget.isAlive !== false) {
                if (playerHero && randomTarget.name === playerHero.name) return;
                window.addWorldEvent("⚔️ ВОЙНА", `${hero.name} атакува териториите на ${randomTarget.name}!`, "🔥", window.gameTime.year);
                hero.heroPower = (hero.heroPower || 100) + 10;
                randomTarget.heroPower = Math.max(0, (randomTarget.heroPower || 100) - 15);
            }
        }
        
        if (hero.traits && hero.traits.some(t => t.cat === 'amb')) {
            hero.gold = (hero.gold || 0) + 50;
        }
    });
};

// ==================== ОСНОВНА ФУНКЦИЯ ЗА ПРОЦЕС НА ВРЕМЕТО ====================
window.processTime = function() {
    if (!window.gameTime) {
        window.gameTime = { seasonIndex: 0, year: 632, era: "от н.е." };
    }
    
    window.gameTime.seasonIndex++;
    
    if (window.gameTime.seasonIndex > 3) {
        window.gameTime.seasonIndex = 0;
        
        if (window.gameTime.era === "пр.н.е.") {
            window.gameTime.year--;
            if (window.gameTime.year <= 0) {
                window.gameTime.year = 1;
                window.gameTime.era = "от н.е.";
            }
        } else {
            window.gameTime.year++;
        }
        
        // Увеличаване на възрастта на всички герои (само козметично)
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let hero = window.worldData.clans[key];
                if (hero.isJoined === true) {
                    hero.age = (hero.age || 30) + 1;
                    if (!window.immortalHeroes) applyAgeEffects(hero);
                }
            }
        }
        
        checkHistoricalEvents();
        
        let msg = `⏳ Нова година: ${window.gameTime.year} г. ${window.gameTime.era}.`;
        showTimeMessage("ЛЕТОБРОЕНЕ", msg, "info");
        if (window.addWorldEvent) {
            window.addWorldEvent("📅 НОВА ГОДИНА", msg, "📅", `${window.gameTime.year} г. ${window.gameTime.era}`);
        }
    }
    
    window.updateTimeUI();
    
    // Световна динамика (региони, атаки и т.н.)
    if (window.advanceExpeditionsTurn) window.advanceExpeditionsTurn();
    if (typeof window.autonomousRegionConquest === 'function') window.autonomousRegionConquest();
    if (typeof window.triggerAutomatedHeroActions === 'function') window.triggerAutomatedHeroActions();
    if (typeof window.checkRandomAttack === 'function') window.checkRandomAttack();
    if (typeof window.processWorldDynamics === 'function') window.processWorldDynamics();
    
    // Автоматично решаване на висящи предложения за умения и класове
    if (typeof window.resolvePendingChoices === 'function') {
        window.resolvePendingChoices();
    }
    
    // ----- НОВО: Случайни интерактивни събития (20% шанс на ход) -----
    if (typeof window.triggerRandomChronicleEvent === 'function' && Math.random() < 0.2) {
        // Избягваме да задействаме събитие, ако има отворена битка (за да не пречи)
        const isBattleOpen = document.getElementById('ultimate-battle-screen') !== null;
        if (!isBattleOpen) {
            window.triggerRandomChronicleEvent();
        }
    }
};

// Стартиране
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (typeof window.processTime === 'function') window.processTime();
        }, 600);
    });
} else {
    setTimeout(() => {
        if (typeof window.processTime === 'function') window.processTime();
    }, 600);

 if (window.tournament) {
    if (window.tournament.isActive()) {
        window.tournament.advance();
    } else {
        window.tournament.checkAutoStart();
    }
}
}

window.applyAgeEffects = applyAgeEffects;
window.checkHistoricalEvents = checkHistoricalEvents;

console.log("✅ time.js версия 3.4 зареден – с автоматични интерактивни събития (20% шанс на ход)");
