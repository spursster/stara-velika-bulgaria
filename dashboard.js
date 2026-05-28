// Рендира лентата с 5-те любими героя (или активния, ако няма любими)
function renderHeroDashboard() {
    console.log("📊 Обновяване на командната лента с герои...");
    
    let dashboard = document.getElementById('hero-dashboard');
    if (!dashboard) {
        dashboard = document.createElement('div');
        dashboard.id = 'hero-dashboard';
        document.body.appendChild(dashboard);
    }
    
    // Вземаме любимите герои (до 5)
    let heroes = [];
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero.isJoined && hero.isFavorite && hero.isAlive !== false) {
                heroes.push(hero);
            }
        }
    }
    // Ако няма любими, но има активен герой – показваме него
    if (heroes.length === 0 && window.currentHero) {
        heroes = [window.currentHero];
    }
    // Подреждаме по ниво (най-високото първо)
    heroes.sort((a,b) => (b.level||1) - (a.level||1));
    // Взимаме първите 5
    heroes = heroes.slice(0,5);
    
    // Ако има по-малко от 5, допълваме с празни слотове (placeholder)
    while (heroes.length < 5) {
        heroes.push(null);
    }
    
    dashboard.innerHTML = '';
    
    heroes.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-dashboard-card';
        
        if (hero) {
            // Изчисляване на HP %
            const maxHp = hero.maxHp || 100;
            const hp = (hero.hp !== undefined && hero.hp !== null) ? hero.hp : maxHp;
            const hpPercent = (hp / maxHp) * 100;
            const hpColor = hpPercent > 70 ? '#4caf50' : (hpPercent > 30 ? '#ff9800' : '#f44336');
            
            // XP %
            const needXP = (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) 
                ? window.rpgDatabase.getXPRequiredForLevel(hero.level || 1) 
                : 150;
            const currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
            const xpPercent = Math.min(100, (currentXP / needXP) * 100);
            
            card.innerHTML = `
                <div class="hero-name" title="${hero.name}">${hero.name}</div>
                <div class="hero-level-power">Ниво ${hero.level || 1} | 💪 ${hero.heroPower || 100}</div>
                <div class="hp-bar-bg"><div class="hp-fill" style="width:${hpPercent}%; background:${hpColor};"></div></div>
                <div class="xp-bar-bg"><div class="xp-fill" style="width:${xpPercent}%;"></div></div>
                <div class="hero-stats">
                    <span>❤️ ${hp}/${maxHp}</span>
                    <span>💰 ${hero.gold || 0}</span>
                    <span>⚔️ ${hero.armySize || 0}</span>
                </div>
                <div style="font-size:8px; margin-top:4px;">${hero.isAuto ? '🤖 Auto' : '👤 Manual'}</div>
            `;
            card.onclick = () => window.showHeroProfile(hero);
        } else {
            // Празен слот – бутон за добавяне на любим
            card.innerHTML = `
                <div style="font-size:24px;">➕</div>
                <div style="font-size:9px;">Добави герой</div>
            `;
            card.onclick = () => {
                if (window.showHeroSelectionModal) {
                    window.showHeroSelectionModal();
                } else {
                    window.showAdvisorPopup("ИНФО", "Можете да добавите любими от казармите (🏹).", "info");
                }
            };
        }
        dashboard.appendChild(card);
    });
    
    console.log(`✅ Лентата обновена – показани ${heroes.filter(h => h).length} героя.`);
}

// Стартиране при зареждане
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeroDashboard);
} else {
    renderHeroDashboard();
}
