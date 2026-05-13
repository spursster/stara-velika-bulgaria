/**
 * МОДУЛ: ДИПЛОМАЦИЯ И БРАК - Велика България
 */

window.clanRelations = {
    "Дуло": 100,
    "Вокил": 50,
    "Угаин": 40,
    "Ерми": 60
};

window.currentSpouse = null;

window.openMarriageMenu = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    if (window.currentSpouse) {
        alert(`Вече сте сключили брак с ${window.currentSpouse.name} от род ${window.currentSpouse.dynasty}.`);
        return;
    }

    const marriageOverlay = document.createElement('div');
    marriageOverlay.id = "marriage-screen";
    marriageOverlay.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: #080808; z-index: 1600; padding: 20px; box-sizing: border-box;
        border: 2px solid #7b1a1a; color: #eee;
    `;

    // Генериране на кандидати от родовете с добри отношения
    const candidates = [
        { name: "Зоя", dynasty: "Вокил", regions: ["Панония"], minRelation: 40 },
        { name: "Пресияна", dynasty: "Угаин", regions: ["Малка Скития"], minRelation: 50 },
        { name: "Мира", dynasty: "Ерми", regions: ["Причерноморие"], minRelation: 30 }
    ];

    let candidatesHTML = candidates.map(can => {
        const relation = window.clanRelations[can.dynasty];
        const canMarry = relation >= can.minRelation;
        
        return `
            <div style="padding: 15px; border: 1px solid #333; margin-bottom: 10px; background: #111; opacity: ${canMarry ? 1 : 0.5};">
                <b style="color: #ff6b6b; font-family: 'Cinzel';">${can.name} от род ${can.dynasty}</b>
                <div style="font-size: 11px; margin: 5px 0;">Зестра: ${can.regions.join(", ")}</div>
                <div style="font-size: 10px; color: ${canMarry ? '#4CAF50' : '#ff4d4d'};">
                    Нужни отношения: ${can.minRelation}% (Сега: ${relation}%)
                </div>
                ${canMarry ? `<button onclick="window.proposeMarriage('${can.name}', '${can.dynasty}', '${can.regions[0]}')" style="margin-top: 10px; width: 100%; padding: 8px; background: #7b1a1a; color: white; border: none; cursor: pointer; font-family: 'Cinzel';">ПРЕДЛОЖИ БРАК</button>` : ''}
            </div>
        `;
    }).join('');

    marriageOverlay.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #7b1a1a; padding-bottom: 10px;">
            <h2 style="font-family: 'Cinzel'; color: #ff6b6b; margin: 0;">💍 ДИНАСТИЧЕН БРАК</h2>
            <button onclick="document.getElementById('marriage-screen').remove()" style="background: none; border: none; color: #eee; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        <p style="font-size: 12px; margin: 15px 0;">Бракът носи нови земи и укрепва властта на вашия род.</p>
        <div id="candidates-list">${candidatesHTML}</div>
    `;

    mainArea.appendChild(marriageOverlay);
};

window.proposeMarriage = function(name, dynasty, region) {
    window.currentSpouse = { name, dynasty };
    window.spouseRegions = [region];
    window.clanRelations[dynasty] = 100; // Пълен съюз

    if (window.logEvent) {
        window.logEvent(`Сключен е съюз чрез брак с ${name} от род ${dynasty}. Регионът ${region} се присъединява към вас!`, "royal");
    }

    document.getElementById('marriage-screen').remove();
    window.updateCharacterUI(window.currentHero);
};

window.sendGift = function(clan) {
    const hero = window.currentHero;
    if (hero.gold >= 100) {
        hero.gold -= 100;
        window.clanRelations[clan] = Math.min(100, window.clanRelations[clan] + 15);
        if (window.logEvent) window.logEvent(`Изпратихте дарове на род ${clan}. Отношенията се подобриха.`, "action");
        
        // Опресняваме екрана на дипломацията или брака ако е отворен
        const dip = document.getElementById('diplomacy-screen');
        if (dip) { dip.remove(); window.openDiplomacy(); }
        
        window.updateCharacterUI(hero);
    } else {
        alert("Нямате достатъчно злато!");
    }
};
