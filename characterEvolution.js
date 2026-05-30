// ==================== CHARACTER EVOLUTION SYSTEM ====================
// ВЕРСИЯ: 4.0 – ИНТЕГРИРАНА С 250+ РЕАЛИСТИЧНИ ЧЕРТИ НА ХАРАКТЕРА
// ===================================================================

// Помощна функция за избор на случаен елемент от масив
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== 1. ЗАРЕЖДАНЕ И УПРАВЛЕНИЕ НА ЛИЧНОСТНИТЕ ЧЕРТИ ====================

// Връща масив от всички черти от PersonalityTraits.js
window.getAllPersonalityTraits = function() {
    if (!window.personalityTraitsDB) {
        console.error("❌ personalityTraitsDB не е зареден! Уверете се, че PersonalityTraits.js е включен преди characterEvolution.js");
        return [];
    }
    return Object.values(window.personalityTraitsDB);
};

// Присвоява на герой определен брой случайни черти (по подразбиране 3)
window.assignPersonalityTraits = function(hero, count = 3) {
    if (!hero) return;
    const all = window.getAllPersonalityTraits();
    if (all.length === 0) return;
    // Разбъркване на копие
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Вземаме първите 'count' и ги записваме като обекти с id, name, description
    const selected = shuffled.slice(0, count).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        // Производни категории за поведение (извличаме от името)
        categories: inferCategoriesFromTrait(t.name)
    }));
    hero.personality = selected;
    // Запазваме и старото поле .traits за съвместимост (но вече няма да се използва)
    if (!hero.traits) hero.traits = [];
    console.log(`🎭 ${hero.name} получи личности: ${selected.map(p => p.name).join(', ')}`);
};

// Помощна функция: извлича категории от името на чертата (за automateHero и getHeroAction)
function inferCategoriesFromTrait(traitName) {
    const lower = traitName.toLowerCase();
    const cats = [];
    if (lower.includes("агресив") || lower.includes("безмилост") || lower.includes("жесток") || lower.includes("гневлив")) cats.push("agg");
    if (lower.includes("предпазлив") || lower.includes("боязлив") || lower.includes("плашлив")) cats.push("cautious");
    if (lower.includes("лоялен") || lower.includes("честен") || lower.includes("предан")) cats.push("loy");
    if (lower.includes("предател") || lower.includes("коварен")) cats.push("traitor");
    if (lower.includes("амбициоз") || lower.includes("горделив") || lower.includes("властолюб")) cats.push("amb");
    if (lower.includes("алчен") || lower.includes("пестелив")) cats.push("greedy");
    if (lower.includes("търгов") || lower.includes("дипломат") || lower.includes("обходителен")) cats.push("dip");
    if (lower.includes("стратег") || lower.includes("хитър") || lower.includes("умен")) cats.push("rational");
    if (lower.includes("импулсив") || lower.includes("хаотичен")) cats.push("chaotic");
    return cats;
}

// ==================== 2. ЕВОЛЮЦИЯ НА ГЕРОЯ (ПРОМЯНА В ЛИЧНОСТТА) ====================

window.evolveHero = function(hero) {
    if (!hero) return;
    if (!hero.personality) {
        // Ако героят няма личности (нов или стар запис), присвояваме му 3
        window.assignPersonalityTraits(hero, 3);
        return;
    }
    
    // Шанс за промяна: 10% всеки ход (или при нивап - тук е на ход)
    if (Math.random() > 0.1) return;
    
    // Възможни промени:
    // 1. Замяна на една черта с нова (50% шанс)
    // 2. Добавяне на нова черта (30% шанс, но не повече от 5)
    // 3. Премахване на черта (20% шанс, но да остане поне 1)
    const r = Math.random();
    const allTraits = window.getAllPersonalityTraits();
    if (allTraits.length === 0) return;
    
    if (r < 0.5 && hero.personality.length > 0) {
        // Замяна: премахваме случайна черта и добавяме нова
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        hero.personality.splice(removeIndex, 1);
        const newTrait = randomItem(allTraits);
        hero.personality.push({
            id: newTrait.id,
            name: newTrait.name,
            description: newTrait.description,
            categories: inferCategoriesFromTrait(newTrait.name)
        });
        console.log(`🔄 ${hero.name} промени личността си: загуби стара черта, придоби "${newTrait.name}".`);
    } else if (r < 0.8 && hero.personality.length < 5) {
        // Добавяне на нова черта
        const newTrait = randomItem(allTraits);
        // Избягваме дублиране
        if (!hero.personality.some(p => p.id === newTrait.id)) {
            hero.personality.push({
                id: newTrait.id,
                name: newTrait.name,
                description: newTrait.description,
                categories: inferCategoriesFromTrait(newTrait.name)
            });
            console.log(`➕ ${hero.name} придоби нова личностна черта: "${newTrait.name}".`);
        }
    } else if (r >= 0.8 && hero.personality.length > 1) {
        // Премахване на черта
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        const removed = hero.personality[removeIndex].name;
        hero.personality.splice(removeIndex, 1);
        console.log(`➖ ${hero.name} загуби личностната черта "${removed}".`);
    }
};

// ==================== 3. АВТОМАТИЗАЦИЯ НА ДЕЙСТВИЯТА СПОРЕД ЛИЧНОСТТА ====================

window.automateHero = function(hero) {
    if (!hero || !hero.isAuto) return;
    if (!hero.personality || hero.personality.length === 0) {
        window.assignPersonalityTraits(hero, 3);
    }
    
    // Извличане на категории от личностите на героя
    const categories = hero.personality.flatMap(p => p.categories || inferCategoriesFromTrait(p.name));
    const isAggressive = categories.includes("agg");
    const isGreedy = categories.includes("greedy");
    const isCautious = categories.includes("cautious");
    const isTraitor = categories.includes("traitor");
    const isDiplomatic = categories.includes("dip");
    const isRational = categories.includes("rational");
    
    // 1. Икономически действия
    if (isGreedy && hero.gold > 500 && Math.random() < 0.2) {
        // Алчните инвестират част от златото
        let investAmount = Math.min(500, Math.floor(hero.gold * 0.3));
        if (typeof window.investGold === 'function') {
            window.investGold(hero, investAmount, 3);
            console.log(`💰 ${hero.name} (Алчен) инвестира ${investAmount} злато.`);
        }
    }
    
    // 2. Военни действия
    if (isAggressive && hero.armySize > 200 && Math.random() < 0.25) {
        // Агресивните атакуват случаен регион (ако има такъв)
        if (window.playerRegions && window.playerRegions.length > 0 && typeof window.startBattle === 'function') {
            let target = window.playerRegions[Math.floor(Math.random() * window.playerRegions.length)];
            if (target && target !== hero.currentRegion) {
                console.log(`⚔️ ${hero.name} (Агресивен) атакува ${target}!`);
                window.startBattle(target);
            }
        }
    }
    
    // 3. Защитни / предпазливи действия
    if (isCautious && hero.armySize < 100 && hero.gold > 200 && Math.random() < 0.3) {
        // Предпазливите купуват войски, за да се защитят
        if (window.armyMarket && typeof window.armyMarket.buy === 'function') {
            let qty = Math.min(50, Math.floor(hero.gold / 10));
            if (qty > 0) {
                window.armyMarket.buy("infantry", qty, hero);
                console.log(`🛡️ ${hero.name} (Предпазлив) купува ${qty} пехотинци за защита.`);
            }
        }
    }
    
    // 4. Дипломатически действия (само ако има съответната механика)
    if (isDiplomatic && Math.random() < 0.1) {
        // Дипломатичните подобряват отношенията (примерно даряват злато на някой друг герой)
        // Тук може да се добави логика за подобряване на репутация
        console.log(`🤝 ${hero.name} (Дипломатичен) опитва да подобри отношенията си.`);
    }
    
    // 5. Предателски действия (ако има пленници или съюзници)
    if (isTraitor && hero.prisoners && hero.prisoners.length > 0 && Math.random() < 0.1) {
        // Предателски настроен герой може да освободи пленник срещу откуп или да го убие
        console.log(`⚠️ ${hero.name} (Предател) извършва коварно действие.`);
        // Може да се добави специфична логика
    }
    
    // 6. Рационални действия – например, ако има свободни точки за умения, да ги разпредели оптимално
    if (isRational && hero.skillPoints > 0 && typeof window.autoAssignSkillPoint === 'function') {
        window.autoAssignSkillPoint(hero);
        console.log(`🧠 ${hero.name} (Рационален) разпредели точка за умение.`);
    }
};

// ==================== 4. ВЗЕМАНЕ НА РЕШЕНИЯ ЗА ДЕЙСТВИЯ (ЗА NPC) ====================

window.getHeroAction = function(hero) {
    if (!hero || !hero.personality || hero.personality.length === 0) {
        return "neutral";
    }
    
    const categories = hero.personality.flatMap(p => p.categories || inferCategoriesFromTrait(p.name));
    const aggScore = categories.filter(c => c === "agg").length;
    const dipScore = categories.filter(c => c === "dip").length;
    const greedScore = categories.filter(c => c === "greedy").length;
    const cautiousScore = categories.filter(c => c === "cautious").length;
    
    if (aggScore > dipScore && aggScore > cautiousScore) return "attack";
    if (dipScore > aggScore && dipScore > greedScore) return "alliance";
    if (greedScore > aggScore && greedScore > dipScore) return "trade";
    if (cautiousScore > 0) return "defend";
    
    return "neutral";
};

// ==================== 5. СЪВМЕСТИМОСТ СЪС СТАРИТЕ ЗАПАЗЕНИ ИГРИ ====================
// При стартиране, ако героите нямат `personality`, им присвояваме черти.
// Това може да се извика от `initializeHeroRPGData` или от `startFreshGameLogic`, но тук правим глобална проверка.
setTimeout(() => {
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined && !hero.personality) {
                window.assignPersonalityTraits(hero, 3);
            }
        }
    }
    console.log("✅ Личностните черти са синхронизирани с всички герои.");
}, 1000);

console.log("✅ characterEvolution.js зареден (версия 4.0 – интеграция с 250+ личности).");
