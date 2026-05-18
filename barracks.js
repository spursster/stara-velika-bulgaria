/**
 * МОДУЛ: КАЗАРМИ (ВОЕНЕН СТАН И КЛАНОВИ ДОКОВЕ) - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (СИНХРОНИЗАЦИЯ С DIABLO ЛИДЕРСТВО & БОНУСИ ОТ ЛЮБИМЦИ)
 * КОРЕКЦИЯ: Максималната армия, цената и силата четат пасивите и любимците в реално време.
 * Статистика на файловете в проекта: 17
 */

window.buyUnits = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    const hero = window.currentHero;
    if (!hero) return;

    // Инициализиране на RPG структурата, ако липсва
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);

    let skills = hero.skills || {};
    let pet = hero.pet || null;

    // 1. ДИНАМИЧНО ИЗЧИСЛЯВАНЕ НА МАКСИМАЛНИЯ КАПАЦИТЕТ (База + Лидерство + Мечка)
    let baseMaxArmy = 500;
    
    // Diablo пасив: Водачество (leadership) -> +100 макс войска на ниво
    if ((skills.leadership || 0) > 0) {
        baseMaxArmy += (skills.leadership * 100);
    }
    // Любимец: Балканска Мечка -> +150 макс войска
    if (pet === "bear") {
        baseMaxArmy += 150;
    }
    hero.maxArmy = baseMaxArmy;

    // 2. ИЗЧИСЛЯВАНЕ НА ЦЕНОВИЯ МОДИФИКАТОР (Родови бонуси + Пасиви)
    let costModifier = 1.0;
    
    // Специфични бонуси за утвърдени военни родове
    if (hero.dynasty === "Комитопули" || hero.dynasty === "Гети") {
        costModifier -= 0.15; // 15% родова отстъпка
    }

    // Diablo пасив: Наборна служба (conscription) -> -10% цена на ниво (макс 50%)
    let conscriptionDiscount = Math.min(0.50, (skills.conscription || 0) * 0.10);
    costModifier -= conscriptionDiscount;

    // Любимец: Степен Жребец -> Допълнителни 15% отстъпка за логистика
    if (pet === "stallion") {
        costModifier -= 0.15;
    }

    // Подсигуряваме, че цената на един боец няма да падне под 1 злато
    let baseUnitCost = 4; 
    let finalUnitCost = Math.max(1, Math.floor(baseUnitCost * costModifier));

    // Изграждане на интерфейса на казармата
    mainArea.innerHTML = `
        <section class="rpg-section animate-fade" style="background: rgba(15, 15, 15, 0.85); border: 1px solid #d4af37; padding: 20px; border-radius: 8px;">
            <h2 style="font-family: 'Cinzel', serif; color: #ffd700; margin-bottom: 5px; text-transform: uppercase;">Военен Стан и Казарми</h2>
            <p style="font-size: 12px; color: #aaa; margin-bottom: 20px;">Мобилизирайте нови родови отряди под вашите бойни знамена.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 6px; border: 1px solid #222; margin-bottom: 20px; font-size: 13px;">
                <div>Текуща хазна: <strong id="barracks-ui-gold" style="color: #ffd700;">💰 ${hero.gold || 0}</strong></div>
                <div>Лимит на армията: <strong id="barracks-ui-army" style="color: #00ffcc;">⚔️ ${hero.currentArmy || 0} / ${hero.maxArmy}</strong></div>
                <div style="grid-column: 1 / span 2; border-top: 1px solid #222; padding-top: 8px; margin-top: 4px; color: #ccc;">
                    Цена за един обучен боец: <strong style="color: #fff;">${finalUnitCost} злато</strong>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="action-btn" onclick="window.recruitSquad(10, ${finalUnitCost})">🏹 Наемете Отряд (10 бойци) — ${finalUnitCost * 10} 💰</button>
                <button class="action-btn" onclick="window.recruitSquad(50, ${finalUnitCost})">⚔️ Наемете Легион (50 бойци) — ${finalUnitCost * 50} 💰</button>
                <button class="action-btn" onclick="window.recruitSquad('max', ${finalUnitCost})" style="background: rgba(0, 255, 204, 0.1); border-color: #00ffcc; color: #00ffcc;">👑 Мобилизирайте Максимума</button>
            </div>
            
            <button class="menu-btn" onclick="if(window.openRegionsMap){window.openRegionsMap();}else{location.reload();}" style="margin-top: 20px; width: 100%;">Върни се към Картата</button>
        </section>
    `;
};

window.recruitSquad = function(amount, unitCost) {
    const hero = window.currentHero;
    if (!hero) return;

    // Преизчисляване на свободния капацитет
    let availableSpace = (hero.maxArmy || 500) - (hero.currentArmy || 0);
    if (availableSpace <= 0) {
        alert("Достигнат е максималният лимит на армията за вашето ниво и водачески умения!");
        return;
    }

    // Определяне на точната бройка при покупка на максимум
    if (amount === 'max') {
        let maxAffordable = Math.floor((hero.gold || 0) / unitCost);
        amount = Math.min(maxAffordable, availableSpace);
    }

    if (amount <= 0) {
        alert("Нямате достатъчно злато в хазната на рода!");
        return;
    }

    let totalCost = amount * unitCost;
    if ((hero.gold || 0) < totalCost) {
        alert("Нямате достатъчно злато за наемането на тази бройка войници!");
        return;
    }

    if (amount > availableSpace) {
        amount = availableSpace;
        totalCost = amount * unitCost;
    }

    // ИЗВЪРШВАНЕ НА ПОКУПКАТА
    hero.gold -= totalCost;
    hero.currentArmy = (hero.currentArmy || 0) + amount;
    hero.armySize = hero.currentArmy; // Поддържане на двете променливи в синхрон

    // Diablo пасив: Ветерански тренировки (veteranTraining)
    let skills = hero.skills || {};
    if ((skills.veteranTraining || 0) > 0 && amount >= 50) {
        let powerBonus = skills.veteranTraining * 15;
        hero.heroPower = (hero.heroPower || 100) + powerBonus;
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`⭐ [ТРЕНИРОВКА]: Благодарение на Ветерански тренировки, Кан ${hero.name} увеличи бойната си мощ с +${powerBonus}!`);
        }
    }

    // СИНХРОНИЗАЦИЯ С ГЛОБАЛНАТА БАЗА ДАННИ НА КЛАНОВЕТЕ
    if (window.worldData && window.worldData.clans && window.worldData.clans[hero.dynasty]) {
        window.worldData.clans[hero.dynasty].currentArmy = hero.currentArmy;
        window.worldData.clans[hero.dynasty].armySize = hero.currentArmy;
        window.worldData.clans[hero.dynasty].gold = hero.gold;
        window.worldData.clans[hero.dynasty].heroPower = hero.heroPower;
    }

    if (window.showAdvisorMsg) {
        window.showAdvisorMsg(`⚔️ УСПЕХ: Нови ${amount} бойци преклониха глава пред Кан ${hero.name} и заеха своя боен пост! На конете!`);
    }

    // Опресняване на основните интерфейси
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();

    // Моментално обновяване на стойностите в отворения екран на казармата
    const goldUi = document.getElementById('barracks-ui-gold');
    const armyUi = document.getElementById('barracks-ui-army');
    if (goldUi) goldUi.innerText = `💰 ${hero.gold}`;
    if (armyUi) armyUi.innerText = `⚔️ ${hero.currentArmy} / ${hero.maxArmy}`;
};
