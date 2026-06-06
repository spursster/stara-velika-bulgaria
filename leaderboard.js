// ==================== ЛИДЕРБОРД + ТУРНИРНА КЛАСАЦИЯ (ВЕРСИЯ 2.0) ====================
window.tournamentWinners = window.tournamentWinners || [];
try {
    const saved = localStorage.getItem('tournament_winners');
    if (saved) window.tournamentWinners = JSON.parse(saved);
} catch(e) {}

function saveTournamentWinners() {
    localStorage.setItem('tournament_winners', JSON.stringify(window.tournamentWinners.slice(0, 30)));
}

// Функция за добавяне на нов турнирен победител (да се извиква от tournament.js)
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

// Основен модален прозорец
window.showLeaderBoardModal = function() {
    let modal = document.getElementById('leaderboard-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'leaderboard-modal';
    modal.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.85); backdrop-filter:blur(12px);
        z-index: 500000; display:flex; justify-content:center; align-items:center;
        font-family:'Cinzel', serif;
    `;

    // ---------- Помощни функции ----------
    function getActiveHeroes() {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.isJoined && h.isAlive !== false) heroes.push(h);
            }
        }
        return heroes;
    }

    function renderHeroLeaderboard(type) {
        let sorted = getActiveHeroes();
        if (type === 'xp') sorted.sort((a,b) => (b.level||1) - (a.level||1) || (b.xp||0) - (a.xp||0));
        else if (type === 'army') sorted.sort((a,b) => (b.armySize||0) - (b.armySize||0));
        else sorted.sort((a,b) => (b.regionsOwned||0) - (a.regionsOwned||0));
        
        let html = '';
        sorted.slice(0, 10).forEach((hero, idx) => {
            let val = type === 'xp' ? `Ниво ${hero.level||1}` : (type === 'army' ? `${hero.armySize||0} войни` : `${hero.regionsOwned||0} региони`);
            let medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx+1}.`));
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #3a2a1a; color:${idx<3?'#ffd700':'#e0c0a0'};">
                    <span style="width:40px;">${medal}</span>
                    <span style="flex:2;">${hero.name}</span>
                    <span style="flex:1;">${val}</span>
                </div>
            `;
        });
        return html;
    }

    function renderTournamentLeaderboard() {
        const winners = window.tournamentWinners;
        if (!winners.length) {
            return `<div style="text-align:center; padding:40px; color:#aaa;">🏆 Все още няма завършен турнир. Бъди първият шампион! 🏆</div>`;
        }
        let html = '';
        winners.forEach((w, idx) => {
            let medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx+1}.`));
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #3a2a1a; color:#e0c0a0;">
                    <span style="width:40px;">${medal}</span>
                    <span style="flex:2; font-weight:bold;">🏆 ${w.name}</span>
                    <span style="flex:1;">📅 ${w.year} г.</span>
                    <span style="flex:1;">⚔️ ${w.power}</span>
                    <span style="flex:1; background:#2c1a0c; padding:2px 6px; border-radius:20px;">🎭 ${w.class}</span>
                    <span style="flex:1;">🐉 ${w.pet}</span>
                </div>
            `;
        });
        return html;
    }

    // ---------- Построяване на модала ----------
    modal.innerHTML = `
        <div style="background: linear-gradient(145deg, #0f0f1a, #1a1a2e); border:2px solid #d4af37; border-radius:24px; padding:20px; width:90%; max-width:1000px; max-height:85vh; display:flex; flex-direction:column; box-shadow:0 20px 35px rgba(0,0,0,0.5);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #d4af37; padding-bottom:10px; margin-bottom:15px;">
                <h2 style="margin:0; color:#ffd966; text-shadow:2px 2px 0 #5a3e1a;">🏅 ЕЛИТНИ КЛАСАЦИИ 🏅</h2>
                <button id="close-lb" style="background:#d4af37; border:none; width:36px; height:36px; border-radius:50%; font-size:20px; cursor:pointer; font-weight:bold;">✕</button>
            </div>
            <div style="display:flex; gap:10px; margin-bottom:20px; justify-content:center;">
                <button data-tab="hero" class="lb-tab-btn active" style="background:#d4af37; border:none; padding:8px 20px; border-radius:40px; font-weight:bold; cursor:pointer;">🏆 Топ Герои</button>
                <button data-tab="tournament" class="lb-tab-btn" style="background:#2c1a0c; color:#ffdd99; border:none; padding:8px 20px; border-radius:40px; font-weight:bold; cursor:pointer;">🏅 Турнирни Шампиони</button>
            </div>
            <div id="lb-tab-content" style="overflow-y:auto; flex:1; padding-right:5px;">
                <!-- динамично съдържание -->
            </div>
            <div style="margin-top:15px; text-align:center; font-size:11px; color:#666;">
                📜 Топ героите са сред наетите живи военачалници. Шампионите пазят славата си във вечността.
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // ---------- Логика за табовете ----------
    const tabContent = modal.querySelector('#lb-tab-content');
    const tabs = modal.querySelectorAll('.lb-tab-btn');
    let activeTab = 'hero';

    function renderTab(tab) {
        if (tab === 'hero') {
            tabContent.innerHTML = `
                <div style="display:flex; gap:8px; justify-content:center; margin-bottom:15px;">
                    <button data-rank-type="xp" class="rank-type-btn active" style="background:#d4af37; border:none; padding:4px 12px; border-radius:30px;">⚔️ Опит</button>
                    <button data-rank-type="army" class="rank-type-btn" style="background:#2c1a0c; color:#ffdd99; border:none; padding:4px 12px; border-radius:30px;">🛡️ Армия</button>
                    <button data-rank-type="regions" class="rank-type-btn" style="background:#2c1a0c; color:#ffdd99; border:none; padding:4px 12px; border-radius:30px;">🌍 Региони</button>
                </div>
                <div id="hero-rank-content">${renderHeroLeaderboard('xp')}</div>
            `;
            attachHeroRankEvents(tabContent);
        } else {
            tabContent.innerHTML = `
                <div style="display:flex; gap:10px; background:#0f0f1a; padding:10px; border-radius:16px; margin-bottom:10px; font-weight:bold; color:#ffd966;">
                    <span style="width:40px;">#</span>
                    <span style="flex:2;">Шампион</span>
                    <span style="flex:1;">Година</span>
                    <span style="flex:1;">Сила</span>
                    <span style="flex:1;">Клас</span>
                    <span style="flex:1;">Питомец</span>
                </div>
                <div id="tournament-rank-content">${renderTournamentLeaderboard()}</div>
            `;
        }
    }

    function attachHeroRankEvents(container) {
        const btns = container.querySelectorAll('.rank-type-btn');
        btns.forEach(btn => {
            btn.onclick = (e) => {
                btns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = '#2c1a0c';
                    b.style.color = '#ffdd99';
                });
                btn.classList.add('active');
                btn.style.background = '#d4af37';
                btn.style.color = '#000';
                const type = btn.getAttribute('data-rank-type');
                document.getElementById('hero-rank-content').innerHTML = renderHeroLeaderboard(type);
            };
        });
        if (btns.length) btns[0].classList.add('active');
    }

    tabs.forEach(btn => {
        btn.onclick = () => {
            tabs.forEach(b => {
                b.classList.remove('active');
                b.style.background = '#2c1a0c';
                b.style.color = '#ffdd99';
            });
            btn.classList.add('active');
            btn.style.background = '#d4af37';
            btn.style.color = '#000';
            activeTab = btn.getAttribute('data-tab');
            renderTab(activeTab);
        };
    });

    renderTab('hero');
    modal.querySelector('#close-lb').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
};

console.log("✅ leaderboard.js версия 2.0 зареден – с елитна класация на турнирните шампиони");
