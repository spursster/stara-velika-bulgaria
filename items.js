/** МОДУЛ: СЪКРОВИЩНИЦА - АДАПТИВЕН ЗА ТЕЛЕФОН */
window.artifactsDatabase = {
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "🗡️", bonus: { heroPower: 60 }, clan: "Дуло" },
    "scepter_of_philip": { id: "scepter_of_philip", name: "Скиптърът на Филип II", icon: "🔱", bonus: { heroPower: 50 }, clan: "Македони" },
    "decebalus_shield": { id: "decebalus_shield", name: "Щитът на Децебал", icon: "🛡️", bonus: { heroPower: 45 }, clan: "Даки" },
    "thracian_rhyton": { id: "thracian_rhyton", name: "Златен Ритон", icon: "🍷", bonus: { goldBonus: 40 }, clan: "Уния Траки" }
};

window.getInventoryBonuses = function(h) {
    let b = { heroPower: 0, goldBonus: 0 };
    if (!h?.inventory) return b;
    h.inventory.forEach(i => {
        let d = window.artifactsDatabase[i.id] || i;
        if (d.bonus) { if(d.bonus.heroPower) b.heroPower += d.bonus.heroPower; if(d.bonus.goldBonus) b.goldBonus += d.bonus.goldBonus; }
    });
    return b;
};

// 📱 МОБИЛНА СЪКРОВИЩНИЦА
window.toggleTreasury = function() {
    const old = document.getElementById('treasury-overlay'); if(old) old.remove();
    const h = window.currentHero; if(!h) return;
    h.inventory ||= [];
    
    let grid = h.inventory.length === 0 ? `<div style="color:#555;padding:20px;text-align:center;">Празна.</div>` : 
        h.inventory.map(i => {
            let d = window.artifactsDatabase[i.id] || i;
            return `<div style="background:rgba(255,255,255,0.03);border:1px solid #333;padding:8px;border-radius:4px;text-align:center;">
                <div style="font-size:24px;">${d.icon}</div><div style="font-size:10px;color:#ffd700;">${d.name}</div>
            </div>`;
        }).join('');

    const b = window.getInventoryBonuses(h);
    const overlay = document.createElement('div');
    overlay.id = 'treasury-overlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;`;
    overlay.innerHTML = `
        <button onclick="this.parentElement.remove()" style="position:absolute;top:10px;left:10px;width:40px;height:40px;background:#111;border:1px solid #ff3366;color:#ff3366;border-radius:50%;font-size:20px;z-index:10000;cursor:pointer;">✕</button>
        <div style="background:#0a0a0a;border:2px solid #d4af37;width:100%;max-width:450px;max-height:85vh;overflow-y:auto;padding:15px;color:#fff;font-family:'Cinzel',serif;border-radius:8px;">
            <h3 style="margin:0 0 10px 0;color:#ffd700;text-align:center;">👑 СЪКРОВИЩНИЦА</h3>
            <div style="display:flex;justify-content:space-around;font-size:11px;background:rgba(255,255,255,0.05);padding:8px;border-radius:4px;margin-bottom:15px;">
                <span>⚔️ Мощ: +${b.heroPower}</span><span>💰 Бонус: +${b.goldBonus}%</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${grid}</div>
        </div>
    `;
    document.body.appendChild(overlay);
};
window.openInventory = window.toggleTreasury;
