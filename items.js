/**
 * МОДУЛ: АРТЕФАКТИ И СВЕЩЕНА СЪКРОВИЩНИЦА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (Синхронизация на 13-те рода)
 * КОРЕКЦИЯ: Пълно обвързване на родовите реликви с актуалното име "Уния Траки" и пречистване на терминологията.
 * Статистика на файловете in проекта: 16
 */

window.playerInventory = [];

// Разширена база данни с имперски артефакти и реликви
window.artifactsDatabase = {
    // Родови артефакти на 13-те велики фамилии
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "🗡️", bonus: { heroPower: 50 }, clan: "Дуло" },
    "scepter_of_philip": { id: "scepter_of_philip", name: "Скиптърът на Филип II", icon: "🔱", bonus: { heroPower: 45 }, clan: "Македони" },
    "decebalus_shield": { id: "decebalus_shield", name: "Щитът на Децебал", icon: "🛡️", bonus: { heroPower: 40 }, clan: "Даки" },
    "thracian_rhyston": { id: "thracian_rhyston", name: "Одриски ритон", icon: "🍷", bonus: { goldBonus: 20 }, clan: "Одриси" },
    "spartacus_gladius": { id: "spartacus_gladius", name: "Гладиусът на Спартак", icon: "⚔️", bonus: { heroPower: 55 }, clan: "Уния Траки" },
    
    // ЛЕГЕНДАРНИ НАХОДКИ ОТ СВЕТА (Откривани по време на далечни Експедиции)
    "world_jade_skull": { id: "world_jade_skull", name: "Нефритен череп на Кукулкан", icon: "💀", bonus: { heroPower: 100 }, clan: "Световно Наследство" },
    "excalibur_blade": { id: "excalibur_blade", name: "Изгубеният кралски меч", icon: "⚔️", bonus: { heroPower: 85 }, clan: "Древни Ветерани" }
};

/**
 * ДОБАВЯНЕ НА ПРЕДМЕТ В ИНВЕНТАРА НА КАНА
 */
window.addItemToInventory = function(itemId) {
    const itemTemplate = window.artifactsDatabase[itemId];
    if (!itemTemplate) {
        console.error(`Грешка: Артефакт с ИД ${itemId} не съществува в базата данни!`);
        return;
    }

    // Дълбоко копиране на обекта, за да няма референтни софтуерни грешки
    const newItem = JSON.parse(JSON.stringify(itemTemplate));
    
    const hero = window.currentHero;
    if (hero) {
        if (!hero.inventory) hero.inventory = [];
        hero.inventory.push(newItem);
        
        // Diablo & ArcheAge Бонус Ефект: Незабавно обновяване на показателите на лидера
        if (newItem.bonus.heroPower) {
            hero.power = (hero.power || 100) + newItem.bonus.heroPower;
        }
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`💎 НАХОДКА: В съкровищницата на Кан ${hero.name} бе добавен артефактът: ${newItem.icon} ${newItem.name} (${newItem.clan})!`);
        }
        
        // Опресняване на главния интерфейс
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    } else {
        window.playerInventory.push(newItem);
    }
    
    // Ако решетката на съкровищницата в момента е отворена на екрана, я преначертаваме автоматично
    if (document.getElementById('treasury-overlay')) window.renderTreasury();
};

/**
 * РЕНДЕРИРАНЕ НА СВЕЩЕНАТА СЪКРОВИЩНИЦА СЪС СЪОБРАЗЕНИ КЛАНОВЕ
 */
window.renderTreasury = function() {
    const grid = document.getElementById('treasury-grid');
    if (!grid) return;

    grid.innerHTML = "";
    
    // Четем инвентара на текущия Кан, а ако няма такъв - глобалния инвентар на играча
    let activeItems = (window.currentHero && window.currentHero.inventory) ? window.currentHero.inventory : window.playerInventory;
    
    if (activeItems.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #555; font-family: 'Georgia', serif; padding: 20px; font-size: 0.85em;">
                Съкровищницата е празна. Изпратете водачи на експедиции или сключвайте съюзи, за да откриете изгубените родови реликви.
            </div>
        `;
        return;
    }

    activeItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
            background: #111;
            border: 1px solid #d4af37;
            padding: 12px;
            text-align: center;
            border-radius: 4px;
            position: relative;
            box-sizing: border-box;
            box-shadow: inset 0 0 10px rgba(212,175,55,0.05);
        `;
        
        // Изчисляване на бонус описание за визуализация
        let bonusText = "";
        if (item.bonus.heroPower) bonusText = `+${item.bonus.heroPower} Сила`;
        if (item.bonus.goldBonus) bonusText = `+${item.bonus.goldBonus}% Злато`;

        itemDiv.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 6px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${item.icon}</div>
            <div style="font-size: 0.8em; color: #fff; font-family: 'Georgia', serif; font-weight: bold; margin-bottom: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</div>
            <div style="font-size: 0.7em; color: #ffd700; font-family: 'Georgia', serif; margin-bottom: 4px;">${bonusText}</div>
            <div style="font-size: 0.65em; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Род: ${item.clan}</div>
        `;
        grid.appendChild(itemDiv);
    });
};

/**
 * ВКЛЮЧВАНЕ/ИЗКЛЮЧВАНЕ НА ИНТЕРФЕЙСА НА СЪКРОВИЩНИЦАТА С ПРИГЛУШЕН ЕФЕКТ
 */
window.toggleTreasury = function() {
    let overlay = document.getElementById('treasury-overlay');
    
    if (overlay) {
        // Ако съществува, го премахваме (затваряне)
        overlay.remove();
    } else {
        // Изграждаме изцяло нов наслагващ се прозорец за инвентара
        overlay = document.createElement('div');
        overlay.id = 'treasury-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center;
            z-index: 11000; padding: 15px; box-sizing: border-box;
        `;

        overlay.innerHTML = `
            <div style="background: #050505; border: 2px solid #d4af37; padding: 25px; border-radius: 6px; font-family: 'Georgia', serif; color: white; max-width: 500px; width: 100%; box-sizing: border-box; position: relative; box-shadow: 0 0 25px rgba(0,0,0,0.5);">
                <div onclick="window.toggleTreasury()" 
                     style="position: absolute; top: 10px; right: 15px; color: #ff4444; font-weight: bold; cursor: pointer; font-size: 1.3em;">&times;</div>
                
                <h3 style="margin-top: 0; color: #d4af37; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; text-align: center; letter-spacing: 1px;">
                    👑 ИМПЕРСКА СЪКРОВИЩНИЦА 👑
                </h3>
                
                <p style="font-size: 0.8em; color: #aaa; text-align: center; margin-bottom: 20px;">
                    Прегледайте реликвите и артефактите, които увеличават бойната мощ на вашите родови воеводи.
                </p>

                <div id="treasury-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; max-height: 300px; overflow-y: auto; padding-right: 5px; margin-bottom: 20px;">
                    </div>

                <button onclick="window.toggleTreasury()" 
                        style="width: 100%; background: #222; color: #ccc; border: 1px solid #444; padding: 10px; font-size: 0.85em; cursor: pointer; border-radius: 4px; text-transform: uppercase; font-weight: bold;">
                    ЗАТВОРИ СЪКРОВИЩНИЦАТА
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Моментално напълване на решетката с актуалните предмети
        window.renderTreasury();
    }
};
