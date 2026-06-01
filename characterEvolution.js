// ==================== CHARACTER EVOLUTION SYSTEM ====================
// ВЕРСИЯ: 5.1 – С ЛЕТОПИСНИ СЪОБЩЕНИЯ
// ===================================================================

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Уверяваме се, че showAdvisorMsg съществува (ако не – създаваме)
if (typeof window.showAdvisorMsg !== 'function') {
    window.showAdvisorMsg = function(msg) {
        console.log("📜 ЛЕТОПИС: " + msg);
        if (window.addWorldEvent) window.addWorldEvent("ЛЕТОПИС", msg, "📜");
        else if (window.showAdvisorPopup) window.showAdvisorPopup("ЛЕТОПИС", msg, "info");
    };
}

if (!window.personalityTraitsDB) {
    window.personalityTraitsDB = {
        aggressive_1: { id: "agg1", name: "Агресивен", description: "Склонен към нападение." },
        ruthless_1: { id: "ruth1", name: "Безмилостен", description: "Не познава милост." },
        hotheaded: { id: "hot1", name: "Гневлив", description: "Бързо избухва." },
        cautious: { id: "caut1", name: "Предпазлив", description: "Преценява рисковете." },
        timid: { id: "tim1", name: "Боязлив", description: "Страхува се от конфликти." },
        loyal: { id: "loy1", name: "Лоялен", description: "Предан на съюзниците." },
        honorable: { id: "hon1", name: "Честен", description: "Думата му е закон." },
        traitorous: { id: "tra1", name: "Предател", description: "Гледа собствената изгода." },
        cunning: { id: "cun1", name: "Коварен", description: "Използва хитрости." },
        ambitious: { id: "amb1", name: "Амбициозен", description: "Мечтае за власт." },
        proud: { id: "pro1", name: "Горделив", description: "Цени честта си." },
        greedy: { id: "gre1", name: "Алчен", description: "Жадува за богатство." },
        miser: { id: "mis1", name: "Пестелив", description: "Не харчи без нужда." },
        diplomatic: { id: "dip1", name: "Дипломатичен", description: "Умее да преговаря." },
        courteous: { id: "cour1", name: "Обходителен", description: "Печели приятели." },
        strategist: { id: "strat1", name: "Стратег", description: "Мисли няколко хода напред." },
        clever: { id: "clev1", name: "Хитър", description: "Намира нестандартни решения." },
        impulsive: { id: "imp1", name: "Импулсивен", description: "Действа без да мисли." },
        chaotic: { id: "cha1", name: "Хаотичен", description: "Непредвидим." },
        melancholic: { id: "mel1", name: "Меланхоличен", description: "Често тъжен." },
        optimistic: { id: "opt1", name: "Оптимист", description: "Винаги гледа напред." },
        envious: { id: "env1", name: "Завистлив", description: "Саботира успехите на другите." },
        generous: { id: "gen1", name: "Щедър", description: "Дарява лесно." }
    };
}

window.getAllPersonalityTraits = function() {
    if (!window.personalityTraitsDB) return [];
    return Object.values(window.personalityTraitsDB);
};

function inferCategoriesFromTrait(traitName) {
    const lower = traitName.toLowerCase();
    const cats = [];
    if (lower.includes("агресив") || lower.includes("безмилост") || lower.includes("жесток") || lower.includes("гневлив")) cats.push("agg");
    if (lower.includes("предпазлив") || lower.includes("боязлив") || lower.includes("плашлив")) cats.push("cautious");
    if (lower.includes("лоялен") || lower.includes("честен") || lower.includes("предан")) cats.push("loy");
    if (lower.includes("предател") || lower.includes("коварен")) cats.push("traitor");
    if (lower.includes("амбициоз") || lower.includes("горделив")) cats.push("amb");
    if (lower.includes("алчен") || lower.includes("пестелив")) cats.push("greedy");
    if (lower.includes("търгов") || lower.includes("дипломат") || lower.includes("обходителен")) cats.push("dip");
    if (lower.includes("стратег") || lower.includes("хитър") || lower.includes("умен")) cats.push("rational");
    if (lower.includes("импулсив") || lower.includes("хаотичен")) cats.push("chaotic");
    return cats;
}

window.assignPersonalityTraits = function(hero, count = 3) {
    if (!hero) return;
    const all = window.getAllPersonalityTraits();
    if (all.length === 0) return;
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
        influence: 1.0
    }));
    hero.personality = selected;
    if (!hero.traits) hero.traits = [];
    const logMsg = `🎭 ${hero.name} получи личности: ${selected.map(p => p.name).join(', ')}.`;
    console.log(logMsg);
    if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
    if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
};

// Генератор за икономически събития
window.ChronicleEvents.generateEconomicEvent = function(hero, eventData) {
    return {
        message: `${eventData.title} ${eventData.msg}`,
        buttons: [
            { label: '💰 Приеми', action: () => {
                if (eventData.gain) hero.gold += eventData.gain;
                if (eventData.loss) hero.gold = Math.max(0, hero.gold - eventData.loss);
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
                window.showAdvisorMsg(`✅ Ефектът е приложен.`);
            }},
            { label: '📜 Игнорирай', action: () => window.showAdvisorMsg(`Игнорирахте събитието.`) }
        ]
    };
};

// Генератор за оферта за герой
window.ChronicleEvents.generateHeroOffer = function(candidate, cost) {
    return {
        message: `🏰 ${candidate.name} от род ${candidate.clan} желае да се присъедини срещу ${cost} злато.`,
        buttons: [
            { label: `✅ Наеми за ${cost}`, action: () => {
                if (window.hireExistingHero) window.hireExistingHero(candidate.id, cost);
                else window.showAdvisorMsg(`Функцията за наемане не е налична.`);
            }},
            { label: '❌ Откажи', action: () => window.showAdvisorMsg(`Отказахте предложението на ${candidate.name}.`) }
        ]
    };
};

// Генератор за инвестиционна възможност
window.ChronicleEvents.generateInvestmentOpportunity = function(hero, amount, profit, turns = 3) {
    return {
        message: `💎 Инвестиционна възможност: вложете ${amount} злато за ${turns} хода, ще получите ${profit} злато.`,
        buttons: [
            { label: `💸 Инвестирай ${amount}`, action: () => {
                if (hero.gold >= amount) {
                    hero.gold -= amount;
                    setTimeout(() => {
                        hero.gold += profit;
                        window.showAdvisorMsg(`Инвестицията ви донесе ${profit} злато!`);
                        if (window.updateCharacterUI) window.updateCharacterUI(hero);
                    }, turns * 10000);
                    window.showAdvisorMsg(`Инвестирахте ${amount} злато. Очаквайте печалба.`);
                } else {
                    window.showAdvisorMsg(`Нямате достатъчно злато за тази инвестиция.`);
                }
            }},
            { label: '🚫 Отказ', action: () => window.showAdvisorMsg(`Отказахте инвестицията.`) }
        ]
    };
};

// Генератор за намерен артефакт
window.ChronicleEvents.generateArtifactFound = function(hero, artifact) {
    let bonusText = artifact.bonus ? `+${artifact.bonus.heroPower || 0} сила` : 'без бонус';
    return {
        message: `🏺 ${hero.name} намери артефакт: ${artifact.name} (${bonusText})!`,
        buttons: [
            { label: '🎒 Екипирай', action: () => {
                if (window.equipArtifact) window.equipArtifact(hero, artifact, 0);
                else window.showAdvisorMsg(`Не може да се екипира автоматично.`);
            }},
            { label: '🔍 Инспекция', action: () => {
                if (window.showAdvisorPopup) window.showAdvisorPopup('Артефакт', `${artifact.name}<br>${artifact.description || 'Няма описание.'}`, 'info');
                else window.showAdvisorMsg(`${artifact.name}: ${artifact.description || 'Няма описание.'}`);
            }}
        ]
    };
};

// Генератор за предложение за съюз
window.ChronicleEvents.generateAllianceProposal = function(proposer, target) {
    return {
        message: `🤝 ${proposer.name} предлага военен съюз на ${target.name}.`,
        buttons: [
            { label: '✅ Приеми', action: () => {
                if (!proposer.allies) proposer.allies = [];
                if (!target.allies) target.allies = [];
                proposer.allies.push(target.name);
                target.allies.push(proposer.name);
                window.showAdvisorMsg(`✅ ${proposer.name} и ${target.name} вече са съюзници!`);
            }},
            { label: '❌ Откажи', action: () => window.showAdvisorMsg(`❌ ${target.name} отказа съюза.`) }
        ]
    };
};

// Генератор за промяна на личността
window.ChronicleEvents.generatePersonalityChange = function(hero, oldTrait, newTrait) {
    return {
        message: `🎭 ${hero.name} промени личността си: загуби "${oldTrait}", придоби "${newTrait}".`,
        buttons: [
            { label: '📜 Виж описанието', action: () => {
                if (window.getPersonalityDescription) {
                    window.showAdvisorMsg(window.getPersonalityDescription(hero));
                } else {
                    window.showAdvisorMsg(`Новата личност на ${hero.name} е ${newTrait}.`);
                }
            }}
        ]
    };
};
window.evolveHero = function(hero) {
    if (!hero) return;
    if (!hero.personality) {
        window.assignPersonalityTraits(hero, 3);
        return;
    }
    if (Math.random() > 0.15) return;
    const r = Math.random();
    const allTraits = window.getAllPersonalityTraits();
    if (allTraits.length === 0) return;
    
    // Замяна
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
        const logMsg = `🎭 ${hero.name} промени личност: загуби "${removedName}", придоби "${newTrait.name}".`;
        console.log(logMsg);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
        if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
    }
    // Добавяне
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
            const logMsg = `🎭 ${hero.name} придоби нова личностна черта: "${newTrait.name}".`;
            console.log(logMsg);
            if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
            if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
        }
    }
    // Премахване
    else if (r >= 0.7 && hero.personality.length > 1) {
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        const removed = hero.personality[removeIndex].name;
        hero.personality.splice(removeIndex, 1);
        const logMsg = `🎭 ${hero.name} загуби личностната черта "${removed}".`;
        console.log(logMsg);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
        if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
    }
    // Усилване/отслабване
    else if (hero.personality.length > 0) {
        const idx = Math.floor(Math.random() * hero.personality.length);
        const change = (Math.random() - 0.5) * 0.2;
        let newInf = hero.personality[idx].influence + change;
        newInf = Math.min(2.0, Math.max(0.5, newInf));
        hero.personality[idx].influence = newInf;
        const logMsg = `🎭 ${hero.name} промени силата на "${hero.personality[idx].name}" до ${newInf.toFixed(2)}.`;
        console.log(logMsg);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
        if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
    }
};

// Синхронизация при старт
setTimeout(() => {
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined && !hero.personality) {
                window.assignPersonalityTraits(hero, 3);
            }
        }
    }
    console.log("✅ characterEvolution.js зареден (с летописни съобщения)");
}, 1000);
