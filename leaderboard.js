// ==================== ЛИДЕРИ И КЛАСАЦИИ ====================
window.showLeaderBoardModal = function() {
    let modal = document.getElementById('leaderboard-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'leaderboard-modal';
    modal.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.85); backdrop-filter:blur(8px);
        z-index: 500000; display:flex; justify-content:center; align-items:center;
        font-family:'Cinzel', serif;
    `;

    const getHeroes = () => {
        let heroes = [];
        if (window.worldData && window.worldData.clans) {
            for (let key in window.worldData.clans) {
                let h = window.worldData.clans[key];
                if (h.isJoined && h.isAlive !== false) heroes.push(h);
            }
        }
        return heroes;
    };

    const render = (type) => {
        let sorted = getHeroes();
        if (type === 'xp') sorted.sort((a,b) => (b.level||1) - (a.level||1) || (b.xp||0) - (a.xp||0));
        else if (type === 'army') sorted.sort((a,b) => (b.armySize||0) - (a.armySize||0));
        else sorted.sort((a,b) => (b.regionsOwned||0) - (a.regionsOwned||0));
        
        let html = '';
        sorted.slice(0, 10).forEach((hero, idx) => {
            let val = type === 'xp' ? `Ниво ${hero.level||1}` : (type === 'army' ? `${hero.armySize||0} войни` : `${hero.regionsOwned||0} региони`);
            html += `
                <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #3a2a1a; color:${idx<3?'#ffd700':'#e0c0a0'};">
                    <span>${idx+1}. ${hero.name}</span>
                    <span>${val}</span>
                </div>
            `;
        });
        return html;
    };

    modal.innerHTML = `
        <div style="background:#1a1a2e; padding:20px; border-radius:20px; border:2px solid #c9a87b; width:90%; max-width:500px; max-height:80vh; overflow-y:auto; color:white;">
            <h2 style="color:#ffd700; text-align:center;">🏆 ЕЛИТ КЛАСАЦИИ</h2>
            <div style="display:flex; justify-content:space-around; margin-bottom:20px;">
                <button onclick="renderLB('xp')" style="background:#2c1a0c; color:#ffdd99; border:none; padding:8px; border-radius:10px; cursor:pointer;">Опит</button>
                <button onclick="renderLB('army')" style="background:#2c1a0c; color:#ffdd99; border:none; padding:8px; border-radius:10px; cursor:pointer;">Армия</button>
                <button onclick="renderLB('regions')" style="background:#2c1a0c; color:#ffdd99; border:none; padding:8px; border-radius:10px; cursor:pointer;">Региони</button>
            </div>
            <div id="lb-content">${render('xp')}</div>
            <button onclick="document.getElementById('leaderboard-modal').remove()" style="width:100%; margin-top:20px; padding:10px; background:#4a2f1c; color:#ffd700; border:none; border-radius:10px; cursor:pointer;">Затвори</button>
        </div>
    `;

    document.body.appendChild(modal);
    window.renderLB = (type) => {
        document.getElementById('lb-content').innerHTML = render(type);
    };
};
