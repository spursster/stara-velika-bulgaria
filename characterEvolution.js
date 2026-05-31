// ==================== CHARACTER EVOLUTION SYSTEM ====================
// ВЕРСИЯ: 5.0 – РАЗШИРЕН АЛГОРИТЪМ ЗА УНИКАЛНИ ХАРАКТЕРИ
// ===================================================================

// Помощна функция за случаен елемент от масив
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== 1. РАЗШИРЕНА БАЗА С ЛИЧНОСТНИ ЧЕРТИ ====================
// Вграждаме я, за да не зависи от PersonalityTraits.js (ако липсва)
if (!window.personalityTraitsDB) {
    window.personalityTraitsDB = {
        // Агресивни
        aggressive_1: { id: "agg1", name: "Агресивен", description: "Склонен към нападение, търси военни решения." },
        ruthless_1: { id: "ruth1", name: "Безмилостен", description: "Не познава милост, враговете му помнят жестокостта." },
        hotheaded: { id: "hot1", name: "Гневлив", description: "Бързо избухва, понякога в ущърб на стратегията." },
        // Предпазливи
        cautious: { id: "caut1", name: "Предпазлив", description: "Обича да преценява рисковете, рядко поема ненужни опасности." },
        timid: { id: "tim1", name: "Боязлив", description: "Страхува се от конфликти, често отстъпва." },
        // Лоялни
        loyal: { id: "loy1", name: "Лоялен", description: "Предан на съюзниците си, никога не предава." },
        honorable: { id: "hon1", name: "Честен", description: "Думата му е закон, не търпи измами." },
        // Предателски
        traitorous: { id: "tra1", name: "Предател", description: "Гледа собствената изгода, лесно сменя страната." },
        cunning: { id: "cun1", name: "Коварен", description: "Използва хитрости и засади, за да победи." },
        // Амбициозни
        ambitious: { id: "amb1", name: "Амбициозен", description: "Мечтае за власт и влияние, не спира пред нищо." },
        proud: { id: "pro1", name: "Горделив", description: "Цени честта и името си, не прощава обиди." },
        // Алчни
        greedy: { id: "gre1", name: "Алчен", description: "Жадува за богатство, всяка монета е важна." },
        miser: { id: "mis1", name: "Пестелив", description: "Не харчи без нужда, трупа злато." },
        // Дипломатични
        diplomatic: { id: "dip1", name: "Дипломатичен", description: "Умее да преговаря и да създава съюзи." },
        courteous: { id: "cour1", name: "Обходителен", description: "Винаги учтив, печели приятели с маниерите си." },
        // Рационални
        strategist: { id: "strat1", name: "Стратег", description: "Мисли няколко хода напред, отличен планировчик." },
        clever: { id: "clev1", name: "Хитър", description: "Намира нестандартни решения, използва ума си." },
        // Импулсивни/хаотични
        impulsive: { id: "imp1", name: "Импулсивен", description: "Действа без да мисли, понякога рисково." },
        chaotic: { id: "cha1", name: "Хаотичен", description: "Непредвидим, следва собствените си правила." },
        // Нови уникални
        melancholic: { id: "mel1", name: "Меланхоличен", description: "Често тъжен, размишлява за миналото." },
        optimistic: { id: "opt1", name: "Оптимист", description: "Винаги гледа напред, вдъхва надежда." },
        envious: { id: "env1", name: "Завистлив", description: "Не търпи успехите на другите, саботира ги." },
        generous: { id: "gen1", name: "Щедър", description: "Дарява лесно, печели приятели с жестове." }
    };
}

// Връща масив от всички черти
window.getAllPersonalityTraits = function() {
    if (!window.personalityTraitsDB) {
        console.error("❌ personalityTraitsDB не е зареден!");
        return [];
    }
    return Object.values(window.personalityTraitsDB);
};

// Присвоява на герой определен брой случайни черти (по подразбиране 3)
window.assignPersonalityTraits = function(hero, count = 3) {
    if (!hero) return;
    const all = window.getAllPersonalityTraits();
    if (all.length === 0) return;
    // Разбъркване
    const shuffled = [...all];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, count).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        categories: inferCategoriesFromTrait(t.name),
        influence: 1.0   // Сила на чертата (може да се променя)
    }));
    hero.personality = selected;
    if (!hero.traits) hero.traits = [];
    console.log(`🎭 ${hero.name} получи личности: ${selected.map(p => p.name).join(', ')}`);
    return hero.personality;
};

// Разширено извличане на категории
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
    if (lower.includes("меланхоличен")) cats.push("sad");
    if (lower.includes("оптимист")) cats.push("happy");
    if (lower.includes("завистлив")) cats.push("envy");
    if (lower.includes("щедър")) cats.push("generous");
    return cats;
}

// ==================== 2. ДИНАМИЧНА ПРОМЯНА НА ЛИЧНОСТТА ====================
// Промяна на черти на база действия (извиква се от външни събития)
window.modifyPersonalityByAction = function(hero, actionType, targetHero = null) {
    if (!hero || !hero.personality) return;
    // actionType: "battleWin", "battleLose", "trade", "gift", "betrayal", "levelUp", "kill"
    let changeOccurred = false;
    
    switch(actionType) {
        case "battleWin":
            // Победата засилва агресивността и увереността
            hero.personality.forEach(trait => {
                if (trait.categories.includes("agg") && Math.random() < 0.3) {
                    trait.influence = Math.min(1.5, trait.influence + 0.1);
                    changeOccurred = true;
                }
            });
            break;
        case "battleLose":
            // Загубата може да направи по-предпазлив или да породи гняв
            if (Math.random() < 0.4) {
                let cautiousTrait = hero.personality.find(t => t.categories.includes("cautious"));
                if (cautiousTrait) cautiousTrait.influence = Math.min(1.5, cautiousTrait.influence + 0.15);
                else hero.personality.push(createTraitById("cautious"));
                changeOccurred = true;
            }
            break;
        case "gift":
            // Получаването на дар прави по-щедър или дипломатичен
            if (Math.random() < 0.3) {
                let generousTrait = hero.personality.find(t => t.categories.includes("generous"));
                if (generousTrait) generousTrait.influence = Math.min(1.5, generousTrait.influence + 0.1);
                else hero.personality.push(createTraitById("generous"));
                changeOccurred = true;
            }
            break;
        case "betrayal":
            // Предателството добавя черта "недоверчив" (импровизирана)
            if (Math.random() < 0.5) {
                hero.personality.push({
                    id: "distrust",
                    name: "Недоверчив",
                    description: "Трудно се доверява на другите.",
                    categories: ["cautious"],
                    influence: 1.2
                });
                changeOccurred = true;
            }
            break;
        case "levelUp":
            // Нивап може да усили съществуващи черти
            hero.personality.forEach(trait => {
                if (Math.random() < 0.2) {
                    trait.influence = Math.min(1.8, trait.influence + 0.05);
                    changeOccurred = true;
                }
            });
            break;
        case "kill":
            // Убийство на друг герой – въздействие според личността
            let isAgg = hero.personality.some(t => t.categories.includes("agg"));
            if (isAgg && Math.random() < 0.5) {
                let ruthless = hero.personality.find(t => t.id === "ruth1");
                if (ruthless) ruthless.influence = Math.min(2.0, ruthless.influence + 0.2);
                else hero.personality.push(createTraitById("ruthless"));
                changeOccurred = true;
            } else if (!isAgg && Math.random() < 0.6) {
                // Неагресивен герой може да получи черта "Ужасен"
                hero.personality.push({
                    id: "horrified",
                    name: "Ужасен",
                    description: "Изпитва страх от насилие.",
                    categories: ["cautious"],
                    influence: 1.3
                });
                changeOccurred = true;
            }
            break;
    }
    
    if (changeOccurred) {
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", `Личността се промени поради "${actionType}".`);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🎭 ${hero.name} промени поведението си след: ${actionType}.`);
    }
};

// Помощна функция за създаване на черта по ID
function createTraitById(id) {
    const all = window.getAllPersonalityTraits();
    let found = all.find(t => t.id === id || t.id.includes(id));
    if (!found) found = { id: id, name: id, description: "", categories: [] };
    return {
        id: found.id,
        name: found.name,
        description: found.description,
        categories: inferCategoriesFromTrait(found.name),
        influence: 1.0
    };
}

// ==================== 3. ЕВОЛЮЦИЯ НА ГЕРОЯ (ПРОМЯНА В ЛИЧНОСТТА) ====================
window.evolveHero = function(hero) {
    if (!hero) return;
    if (!hero.personality) {
        window.assignPersonalityTraits(hero, 3);
        return;
    }
    
    // Шанс за промяна: 15% всеки ход (увеличен)
    if (Math.random() > 0.15) return;
    
    // Повече възможности за промяна
    const r = Math.random();
    const allTraits = window.getAllPersonalityTraits();
    if (allTraits.length === 0) return;
    
    // 1. Замяна на черта (40%)
    if (r < 0.4 && hero.personality.length > 0) {
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        const removedName = hero.personality[removeIndex].name;
        hero.personality.splice(removeIndex, 1);
        const newTrait = randomItem(allTraits);
        hero.personality.push({
            id: newTrait.id,
            name: newTrait.name,
            description: newTrait.description,
            categories: inferCategoriesFromTrait(newTrait.name),
            influence: 1.0
        });
        console.log(`🔄 ${hero.name} промени личност: загуби "${removedName}", придоби "${newTrait.name}".`);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", `Промени личност: загуби "${removedName}", придоби "${newTrait.name}".`);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🎭 ${hero.name} промени личността си: загуби "${removedName}", придоби "${newTrait.name}".`);
    }
    // 2. Добавяне на черта (30%)
    else if (r < 0.7 && hero.personality.length < 6) {
        const newTrait = randomItem(allTraits);
        if (!hero.personality.some(p => p.id === newTrait.id)) {
            hero.personality.push({
                id: newTrait.id,
                name: newTrait.name,
                description: newTrait.description,
                categories: inferCategoriesFromTrait(newTrait.name),
                influence: 1.0
            });
            console.log(`➕ ${hero.name} придоби нова личност: "${newTrait.name}".`);
            if (window.addHeroLog) window.addHeroLog(hero, "🎭", `Придоби нова черта: "${newTrait.name}".`);
            if (window.showAdvisorMsg) window.showAdvisorMsg(`🎭 ${hero.name} придоби нова личностна черта: "${newTrait.name}".`);
        }
    }
    // 3. Премахване на черта (20%)
    else if (r >= 0.7 && hero.personality.length > 1) {
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        const removed = hero.personality[removeIndex].name;
        hero.personality.splice(removeIndex, 1);
        console.log(`➖ ${hero.name} загуби чертата "${removed}".`);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", `Загуби черта: "${removed}".`);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🎭 ${hero.name} загуби личностната черта "${removed}".`);
    }
    // 4. Усилване/отслабване на съществуваща черта (10%)
    else if (hero.personality.length > 0) {
        const idx = Math.floor(Math.random() * hero.personality.length);
        const change = (Math.random() - 0.5) * 0.2; // -0.1 до +0.1
        let newInf = hero.personality[idx].influence + change;
        newInf = Math.min(2.0, Math.max(0.5, newInf));
        hero.personality[idx].influence = newInf;
        console.log(`⚖️ ${hero.name} промени силата на "${hero.personality[idx].name}" до ${newInf.toFixed(2)}.`);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", `Силата на черта "${hero.personality[idx].name}" се промени.`);
    }
};

// ==================== 4. АВТОМАТИЗАЦИЯ НА ДЕЙСТВИЯТА СПОРЕД ЛИЧНОСТТА (УСЪВЪРШЕНСТВАНА) ====================
window.automateHero = function(hero) {
    if (!hero || !hero.isAuto) return;
    if (!hero.personality || hero.personality.length === 0) {
        window.assignPersonalityTraits(hero, 3);
    }
    
    // Изчисляваме тегла на категориите според influence
    let categoriesWeight = {
        agg: 0, cautious: 0, loy: 0, traitor: 0, amb: 0, greedy: 0, dip: 0, rational: 0, chaotic: 0
    };
    hero.personality.forEach(trait => {
        (trait.categories || []).forEach(cat => {
            categoriesWeight[cat] = (categoriesWeight[cat] || 0) + (trait.influence || 1);
        });
    });
    
    const isAggressive = categoriesWeight.agg > 0.5;
    const isGreedy = categoriesWeight.greedy > 0.5;
    const isCautious = categoriesWeight.cautious > 0.5;
    const isTraitor = categoriesWeight.traitor > 0.5;
    const isDiplomatic = categoriesWeight.dip > 0.5;
    const isRational = categoriesWeight.rational > 0.5;
    const isChaotic = categoriesWeight.chaotic > 0.5;
    
    // 1. Икономически действия – зависи от алчност и рационалност
    if (isGreedy && hero.gold > 800 && Math.random() < 0.3) {
        let investAmount = Math.min(1000, Math.floor(hero.gold * 0.5));
        if (typeof window.investGold === 'function') {
            window.investGold(hero, investAmount, 3);
            window.addHeroLog(hero, "💰", `Инвестира ${investAmount} злато (Алчен).`);
        }
    }
    // Рационалните купуват войски когато са под 250
    if (isRational && hero.armySize < 250 && hero.gold > 600 && Math.random() < 0.45) {
        let qty = Math.min(120, Math.floor(hero.gold / 10));
        if (qty > 0 && typeof window.armyMarket?.buy === 'function') {
            window.armyMarket.buy("infantry", qty, hero);
            window.addHeroLog(hero, "⚔️", `Купи ${qty} войници (Рационален).`);
        }
    }
    // Хаотичните понякога харчат за скъпи войски без сметка
    if (isChaotic && hero.gold > 1000 && Math.random() < 0.2) {
        let qty = Math.min(200, Math.floor(hero.gold / 8));
        if (qty > 0 && typeof window.armyMarket?.buy === 'function') {
            window.armyMarket.buy("cavalry", qty, hero);
            window.addHeroLog(hero, "⚔️", `Хаотично купи ${qty} конници!`);
        }
    }
    
    // 2. Военни действия – агресивните атакуват
    if (isAggressive && hero.armySize > 400 && Math.random() < 0.35) {
        let possibleTargets = [];
        if (window.regionConnections && hero.currentRegion) {
            let neighbors = window.regionConnections[hero.currentRegion] || [];
            for (let reg of neighbors) {
                if (!window.playerRegions?.includes(reg)) {
                    possibleTargets.push(reg);
                }
            }
        }
        if (possibleTargets.length === 0 && window.worldData?.regions) {
            possibleTargets = Object.keys(window.worldData.regions).filter(r => !window.playerRegions?.includes(r));
        }
        if (possibleTargets.length > 0) {
            let target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
            window.addHeroLog(hero, "⚔️", `Атакува ${target} (Агресивен).`);
            if (typeof window.startBattle === 'function') {
                window.startBattle(target);
            }
        }
    }
    
    // 3. Защитни действия – предпазливите купуват защитни войски
    if (isCautious && hero.armySize < 200 && hero.gold > 400 && Math.random() < 0.5) {
        let qty = Math.min(100, Math.floor(hero.gold / 12));
        if (qty > 0 && typeof window.armyMarket?.buy === 'function') {
            window.armyMarket.buy("archers", qty, hero);
            window.addHeroLog(hero, "🛡️", `Нае ${qty} стрелци (Предпазлив).`);
        }
    }
    
    // 4. Дипломатически действия – дарения и подобряване на отношения
    if (isDiplomatic && hero.gold > 1000 && Math.random() < 0.25) {
        let otherHeroes = [];
        if (window.worldData?.clans) {
            for (let id in window.worldData.clans) {
                let h = window.worldData.clans[id];
                if (h !== hero && h.isJoined && h.isAlive !== false) otherHeroes.push(h);
            }
        }
        if (otherHeroes.length > 0) {
            let target = otherHeroes[Math.floor(Math.random() * otherHeroes.length)];
            let gift = Math.min(400, Math.floor(hero.gold * 0.25));
            hero.gold -= gift;
            target.gold += gift;
            window.addHeroLog(hero, "🤝", `Дари ${gift} злато на ${target.name} (Дипломатичен).`);
            if (typeof window.updateCharacterUI === 'function') {
                window.updateCharacterUI(hero);
                window.updateCharacterUI(target);
            }
        }
    }
    
    // 5. Предателски действия – пленници
    if (isTraitor && hero.prisoners && hero.prisoners.length > 0 && Math.random() < 0.2) {
        let prisoner = hero.prisoners[0];
        let ransom = Math.floor(prisoner.gold * 0.4);
        hero.gold += ransom;
        window.addHeroLog(hero, "💔", `Освободи ${prisoner.name} срещу ${ransom} злато (Предател).`);
        hero.prisoners.shift();
        if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(hero);
    }
    
    // 6. Рационални действия – разпределяне на умения
    if (isRational && hero.skillPoints > 0 && typeof window.autoAssignSkillPoint === 'function') {
        window.autoAssignSkillPoint(hero);
        window.addHeroLog(hero, "🧠", `Разпредели точка умение (Рационален).`);
    }
    
    // 7. Амбициозните се стремят към лидерство – купуват елитни войски
    if (categoriesWeight.amb > 0 && hero.gold > 2000 && Math.random() < 0.15) {
        let qty = Math.min(50, Math.floor(hero.gold / 25));
        if (qty > 0 && typeof window.armyMarket?.buy === 'function') {
            window.armyMarket.buy("elite", qty, hero);
            window.addHeroLog(hero, "👑", `Нае ${qty} елитни войски (Амбициозен).`);
        }
    }
    
    // 8. Обновяване на UI
    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
    if (typeof window.updateAllUI === 'function') window.updateAllUI();
};

// ==================== 5. ВЗЕМАНЕ НА РЕШЕНИЯ (ЗА NPC) ====================
window.getHeroAction = function(hero) {
    if (!hero || !hero.personality || hero.personality.length === 0) return "neutral";
    
    let categoriesWeight = { agg:0, dip:0, greedy:0, cautious:0, amb:0 };
    hero.personality.forEach(trait => {
        (trait.categories || []).forEach(cat => {
            if (cat === "agg") categoriesWeight.agg += (trait.influence || 1);
            if (cat === "dip") categoriesWeight.dip += (trait.influence || 1);
            if (cat === "greedy") categoriesWeight.greedy += (trait.influence || 1);
            if (cat === "cautious") categoriesWeight.cautious += (trait.influence || 1);
            if (cat === "amb") categoriesWeight.amb += (trait.influence || 1);
        });
    });
    
    if (categoriesWeight.agg > categoriesWeight.dip && categoriesWeight.agg > categoriesWeight.cautious) return "attack";
    if (categoriesWeight.dip > categoriesWeight.agg && categoriesWeight.dip > categoriesWeight.greedy) return "alliance";
    if (categoriesWeight.greedy > categoriesWeight.agg && categoriesWeight.greedy > categoriesWeight.dip) return "trade";
    if (categoriesWeight.cautious > 0) return "defend";
    if (categoriesWeight.amb > 1) return "expand";
    return "neutral";
};

// ==================== 6. ГЕНЕРИРАНЕ НА УНИКАЛНО ОПИСАНИЕ ====================
window.getPersonalityDescription = function(hero) {
    if (!hero || !hero.personality || hero.personality.length === 0) return "Все още без ясно изразен характер.";
    let desc = hero.name + " е ";
    const primary = hero.personality[0];
    desc += primary.name.toLowerCase();
    if (hero.personality.length > 1) {
        desc += " и " + hero.personality[1].name.toLowerCase();
    }
    desc += ". ";
    if (hero.personality.some(p => p.categories.includes("agg"))) desc += "Предпочита силата пред преговорите. ";
    if (hero.personality.some(p => p.categories.includes("dip"))) desc += "Умее да намира съюзници. ";
    if (hero.personality.some(p => p.categories.includes("greedy"))) desc += "Цени богатството над всичко. ";
    if (hero.personality.some(p => p.categories.includes("cautious"))) desc += "Никога не прави нищо необмислено. ";
    return desc;
};

// ==================== 7. СЪВМЕСТИМОСТ СЪС СТАРИ ЗАПАЗЕНИ ИГРИ ====================
setTimeout(() => {
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined && !hero.personality) {
                window.assignPersonalityTraits(hero, 3);
            }
        }
    }
    console.log("✅ Личностните черти са синхронизирани с всички герои (разширена версия).");
}, 1000);

console.log("✅ characterEvolution.js зареден (версия 5.0 – сложен алгоритъм за уникални характери)");
