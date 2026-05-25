/**
 ==========================================================================
 МОДУЛ: ВРЕМЕ И ЛЕТОБРОЕНЕ - Велика България
 ВЕРСИЯ: 3.1 – БЕЗСМЪРТНИ ГЕРОИ (ВЪЗРАСТТА Е САМО ЗА ИНФОРМАЦИЯ)
 ==========================================================================
 */

// Настройка за безсмъртие (по подразбиране true)
if (window.immortalHeroes === undefined) window.immortalHeroes = true;

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
        // Възрастта се увеличава, но без ефект
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
    if (age >= 80 && hero !== window.currentHero) {
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
        if (window.currentHero) {
            window.currentHero.age = (window.currentHero.age || 30) + 1;
            if (!window.immortalHeroes) applyAgeEffects(window.currentHero);
        }
        
        checkHistoricalEvents();
        
        let msg = `⏳ Нова година: ${window.gameTime.year} г. ${window.gameTime.era}.`;
        showTimeMessage("ЛЕТОБРОЕНЕ", msg, "info");
        if (window.addWorldEvent) {
            window.addWorldEvent("📅 НОВА ГОДИНА", msg, "📅", `${window.gameTime.year} г. ${window.gameTime.era}`);
        }
    }
    
    window.updateTimeUI();
    
    if (window.advanceExpeditionsTurn) window.advanceExpeditionsTurn();
    if (typeof window.autonomousRegionConquest === 'function') window.autonomousRegionConquest();
    if (typeof window.checkRandomAttack === 'function') window.checkRandomAttack();
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
}

window.applyAgeEffects = applyAgeEffects;
window.checkHistoricalEvents = checkHistoricalEvents;

console.log("✅ time.js версия 3.1 зареден – безсмъртни герои (възрастта е само за информация), исторически събития, пълна синхронизация.");
