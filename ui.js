const INVENTORY_SLOTS = [
    { id: 'head', label: 'Шлем' }, { id: 'neck', label: 'Амулет' },
    { id: 'body', label: 'Доспехи' }, { id: 'mainHand', label: 'Оръжие' },
    { id: 'offHand', label: 'Щит' }, { id: 'ring1', label: 'Пръстен 1' },
    { id: 'ring2', label: 'Пръстен 2' }, { id: 'feet', label: 'Ботуши' },
    { id: 'relic', label: 'Артефакт' }
];

// Основна функция за обновяване на целия потребителски интерфейс
window.updateCharacterUI = function(hero) {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer || !hero) return;

    // Проверка за наследяване, ако владетелят не е жив
    if (!hero.isAlive) {
        window.showSuccessionMenu();
        return;
    }

    // 1. Генериране на визуалните слотове за провинции (мини-карти)
    let provincesHTML = '<div class="provinces-container">';
    if (window.playerRegions && window.playerRegions.length > 0) {
        window.playerRegions.forEach(reg => {
            provincesHTML += `
                <div class="province-slot" title="${reg.name}">
                    <div class="province-name">${reg.name}</div>
                    <img src="${reg.img}" class="province-img" alt="${reg.name}">
                </div>`;
        });
    } else {
        provincesHTML += '<p style="color: #666; font-size: 11px; text-align: center; width: 100%;">Няма завладени земи</p>';
    }
    provincesHTML += '</div>';

    // 2. Изграждане на главния панел (изчистен вид)
    uiContainer.innerHTML = `
        <div style="text-align: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 class="clickable-name" onclick="window.toggleCharacterModal(true)" title="Виж профила">👑 Кан ${hero.name}</h2>
            <small style="color: #ffd700;">Род ${hero.dynasty} | ${hero.trait}</small>
            <p style="margin: 5px 0; color: #aaa; font-size: 13px;">${hero.armyRank} (${hero.armySize} бойци)</p>
        </div>

        <h4 style="color: #d4af37; margin: 10px 0 5px 0; text-align: center; font-size: 12px; letter-spacing: 1px;">🗺️ КАРТА НА ИМПЕРИЯТА</h4>
        ${provincesHTML}

        <h4 style="color: #d4af37; margin: 15px 0 5px 0; font-size: 12px; letter-spacing: 1px;">📜 УПРАВЛЕНИЕ</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.advanceYear(window.currentHero)" style="background: #444; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">⌛ Година +1</button>
            <button onclick="window.levelUpCurrentHero()" style="background: #444; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">🏋️ Тренировка</button>
            <button onclick="window.handleBattleClick()" style="background: #721c24; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">⚔️ Битка</button>
            <button onclick="window.handleMarriageClick()" style="background: #1e7e34; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">💍 Брак</button>
            <button onclick="window.handleRitualClick()" style="background: #8e44ad; color: white; border: none; padding: 10px; cursor: pointer; grid-column: span 2; font-size: 12px;">🔥 Древен Ритуал</button>
        </div>

        <h4 style="color: #d4af37; margin: 20px 0 5px 0; font-size: 12px; letter-spacing: 1px;">⚔️ КАЗАРМИ</h4>
        <div style="display: flex; flex-direction: column; gap: 5px; background: #1a1a1a; padding: 10px; border-radius: 5px;">
            <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="text-align: left; padding: 8px; font-size: 11px; cursor: pointer; background: #333; color: #ccc; border: 1px solid #444;">🏹 Пехота (100🪙)</button>
            <button onclick="window.handleRecruit('КОННИЦА')" style="text-align: left; padding: 8px; font-size: 11px; cursor: pointer; background: #333; color: #ccc; border: 1px solid #444;">🏇 Конница (300🪙)</button>
            <button onclick="window.handleRecruit('СТРЕЛЦИ')" style="text-align: left; padding: 8px; font-size: 11px; cursor: pointer; background: #333; color: #ccc; border: 1px solid #444;">🎯 Стрелци (150🪙)</button>
        </div>
    `;

    // Обновяваме съдържанието на модалния прозорец, за да е готово при отваряне
    window.renderCharacterModal(hero);
};

// Функция за създаване и рендиране на модалния прозорец с профила
window.renderCharacterModal = function(hero) {
    let modal = document.getElementById('hero-modal-overlay');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hero-modal-overlay';
        modal.className = 'modal-overlay';
        modal.onclick = (e) => { if(e.target === modal) window.toggleCharacterModal(false); };
        document.body.appendChild(modal);
    }

    // Божествени благословии
    let divineStatusHTML = "";
    if (hero.divineUnits && hero.divineUnits.length > 0) {
        const godsNames = hero.divineUnits.map(g => `<span style="color: #8e44ad; font-weight: bold;">${g.name}</span>`).join(", ");
        divineStatusHTML = `<p style="margin: 10px 0; font-size: 14px; text-align: center;">🌟 Благословии: ${godsNames}</p>`;
    }

    // Екипировка - 9-те слота
    let inventoryHTML = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 15px;">';
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div style="background: #111; border: 1px solid #444; height: 65px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; border-radius: 4px;">
                <span style="color: #777; margin-bottom: 2px; text-transform: uppercase;">${slot.label}</span>
                <div style="color: #d4af37; font-weight: bold; text-align: center; line-height: 1.1;">${item ? item.name : '---'}</div>
            </div>`;
    });
    inventoryHTML += '</div>';

    // Списък на земите в текстов вид за профила
    const regionsList = window.playerRegions && window.playerRegions.length > 0 
        ? window.playerRegions.map(r => r.name).join(", ") 
        : "Няма завладени земи";

    modal.innerHTML = `
        <div class="character-modal">
            <span class="close-modal" onclick="window.toggleCharacterModal(false)">&times;</span>
            <div class="modal-header">
                <h2 style="color: #d4af37; margin: 0; font-size: 22px;">Кан ${hero.name}</h2>
                <p style="color: #ffd700; margin: 5px 0;">Род ${hero.dynasty} | ${hero.trait}</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 14px; background: #222; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                <span>Възраст: <strong>${hero.age} г.</strong></span>
                <span>Ниво: <strong>${hero.level}</strong></span>
            </div>

            <div style="font-size: 12px; color: #2ecc71; text-align: center; border: 1px solid #2ecc7133; padding: 5px; border-radius: 4px;">
                🚩 Владения: ${regionsList}
            </div>

            ${divineStatusHTML}

            <h4 style="color: #d4af37; border-bottom: 1px solid #444; margin: 20px 0 10px 0; padding-bottom: 5px; text-align: center; font-size: 13px; letter-spacing: 2px;">🛡️ ЕКИПИРОВКА</h4>
            ${inventoryHTML}
        </div>
    `;
};

// Превключване на видимостта на модала
window.toggleCharacterModal = function(show) {
    const modal = document.getElementById('hero-modal-overlay');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
};

// Обработка на събития
window.handleBattleClick = () => window.simulateBattle(window.currentHero, 'Ромеи');
window.handleMarriageClick = () => window.proposeMarriage(window.currentHero, 'Ромеи');
window.levelUpCurrentHero = () => { window.currentHero.levelUp(); window.updateCharacterUI(window.currentHero); };
window.handleRitualClick = function() {
    if (window.currentHero && typeof window.performAncientRitual === 'function') {
        const result = window.performAncientRitual(window.currentHero);
        const log = document.getElementById('event-log');
        if (log) log.innerHTML = `<p style="color: #8e44ad; font-size: 13px;"><strong>[Ритуал]</strong> ${result}</p>` + log.innerHTML;
    }
};

window.handleRecruit = (type) => { 
    const msg = window.recruitUnit(window.currentHero, type);
    const log = document.getElementById('event-log');
    if (log) log.innerHTML = `<p style="color: #ffd700; font-size: 12px;">[Армия] ${msg}</p>` + log.innerHTML;
};

// Меню за избор на наследник
window.showSuccessionMenu = function() {
    const uiContainer = document.getElementById('character-panel');
    let successorsHTML = `<div style="background: #111; padding: 15px; border: 2px solid #d4af37; border-radius: 8px;">
        <h3 style="color: #d4af37; text-align: center; margin-top: 0;">👑 Наследство</h3>
        <p style="font-size: 12px; color: #888; text-align: center; margin-bottom: 15px;">Изберете следващия владетел от вашия род:</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">`;
    
    window.potentialSuccessors.forEach((s, index) => {
        successorsHTML += `
            <button onclick="window.selectSuccessor(${index})" style="background: #222; color: white; border: 1px solid #444; padding: 12px; cursor: pointer; text-align: left; border-radius: 4px; transition: 0.3s;" onmouseover="this.style.borderColor='#d4af37'" onmouseout="this.style.borderColor='#444'">
                <strong style="color: #d4af37;">${s.name}</strong><br>
                <small style="color: #aaa;">Черта: ${s.trait}</small>
            </button>`;
    });
    uiContainer.innerHTML = successorsHTML + `</div></div>`;
};

window.selectSuccessor = function(index) {
    const chosen = window.potentialSuccessors[index];
    if (window.familyLegacy) chosen.inventory = { ...window.familyLegacy };
    window.currentHero = chosen;
    window.updateCharacterUI(chosen);
};
