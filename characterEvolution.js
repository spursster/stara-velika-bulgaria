// ==================== CHARACTER EVOLUTION SYSTEM ====================
// ВЕРСИЯ: 5.3 – ПРЕМАХНАТА ИНВЕСТИЦИОННА ВЪЗМОЖНОСТ
// ===================================================================

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function isMyHero(hero) {
    if (!hero) return false;
    if (hero.isFavorite === true) return true;
    if (typeof window.getSelectedHero === 'function' && window.getSelectedHero() === hero) return true;
    if (window.gameMode === 'solo' && window.currentHero === hero) return true;
    return false;
}

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
    if (isMyHero(hero) && window.showAdvisorMsg) {
        window.showAdvisorMsg(logMsg);
    }
};

window.ChronicleEvents = window.ChronicleEvents || {};

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

window.getPersonalityDescription = function(hero) {
    if (!hero || !hero.personality || hero.personality.length === 0) {
        return `${hero.name} все още няма ясно изразен характер.`;
    }
    let desc = `${hero.name} е `;
    const traits = hero.personality.map(t => t.name.toLowerCase());
    desc += traits.join(', ');
    desc += '. ';
    if (hero.personality.some(p => p.categories.includes("agg"))) desc += "Предпочита силата пред преговорите. ";
    if (hero.personality.some(p => p.categories.includes("dip"))) desc += "Умее да намира съюзници. ";
    if (hero.personality.some(p => p.categories.includes("greedy"))) desc += "Цени богатството над всичко. ";
    if (hero.personality.some(p => p.categories.includes("cautious"))) desc += "Никога не прави нищо необмислено. ";
    return desc;
};

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

// ========== ПРЕМАХНАТ ГЕНЕРАТОР ЗА ИНВЕСТИЦИОННА ВЪЗМОЖНОСТ ==========
// за да спрат окончателно съобщенията за инвестиции
/*
window.ChronicleEvents.generateInvestmentOpportunity = function(hero, amount, profit, turns = 3) {
    // ... премахнат ...
};
*/

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

window.ChronicleEvents.generatePersonalityChange = function(hero, oldTrait, newTrait) {
    return {
        message: `🎭 ${hero.name} промени личността си: загуби "${oldTrait}", придоби "${newTrait}".`,
        buttons: [{ label: '📜 Виж характера', action: () => window.showAdvisorMsg(window.getPersonalityDescription(hero)) }]
    };
};

window.ChronicleEvents.generatePersonalityAdd = function(hero, newTrait) {
    return {
        message: `🎭 ${hero.name} придоби нова черта: "${newTrait}".`,
        buttons: [{ label: '📜 Подробности', action: () => window.showAdvisorMsg(window.getPersonalityDescription(hero)) }]
    };
};

window.ChronicleEvents.generatePersonalityRemove = function(hero, oldTrait) {
    return {
        message: `🎭 ${hero.name} загуби чертата: "${oldTrait}".`,
        buttons: [{ label: '📜 Актуални черти', action: () => window.showAdvisorMsg(window.getPersonalityDescription(hero)) }]
    };
};

window.ChronicleEvents.generatePersonalityInfluence = function(hero, traitName, oldVal, newVal) {
    return {
        message: `🎭 ${hero.name} промени силата на "${traitName}" от ${oldVal.toFixed(2)} на ${newVal.toFixed(2)}.`,
        buttons: [{ label: '📜 Какво означава?', action: () => window.showAdvisorMsg(`Силата на чертата влияе колко често героят действа според нея.`) }]
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
    
    if (r < 0.4 && hero.personality.length > 0) {
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        const removedName = hero.personality[removeIndex].name;
        hero.personality.splice(removeIndex, 1);
        const newTrait = randomItem(allTraits);
        const newTraitName = newTrait.name;
        hero.personality.push({
            id: newTrait.id,
            name: newTrait.name,
            description: newTrait.description,
            categories: inferCategoriesFromTrait(newTrait.name),
            influence: 1.0
        });
        const logMsg = `🎭 ${hero.name} промени личност: загуби "${removedName}", придоби "${newTraitName}".`;
        console.log(logMsg);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
        if (isMyHero(hero)) {
            if (window.ChronicleEvents && typeof window.ChronicleEvents.generatePersonalityChange === 'function') {
                const ev = window.ChronicleEvents.generatePersonalityChange(hero, removedName, newTraitName);
                if (window.showAdvisorMsg) window.showAdvisorMsg(ev.message, ev.buttons);
            } else {
                if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
            }
        }
    }
    else if (r < 0.7 && hero.personality.length < 6) {
        const newTrait = randomItem(allTraits);
        if (!hero.personality.some(p => p.id === newTrait.id)) {
            const newTraitName = newTrait.name;
            hero.personality.push({
                id: newTrait.id,
                name: newTrait.name,
                description: newTrait.description,
                categories: inferCategoriesFromTrait(newTrait.name),
                influence: 1.0
            });
            const logMsg = `🎭 ${hero.name} придоби нова личностна черта: "${newTraitName}".`;
            console.log(logMsg);
            if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
            if (isMyHero(hero)) {
                if (window.ChronicleEvents && typeof window.ChronicleEvents.generatePersonalityAdd === 'function') {
                    const ev = window.ChronicleEvents.generatePersonalityAdd(hero, newTraitName);
                    if (window.showAdvisorMsg) window.showAdvisorMsg(ev.message, ev.buttons);
                } else {
                    if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
                }
            }
        }
    }
    else if (r >= 0.7 && hero.personality.length > 1) {
        const removeIndex = Math.floor(Math.random() * hero.personality.length);
        const removedName = hero.personality[removeIndex].name;
        hero.personality.splice(removeIndex, 1);
        const logMsg = `🎭 ${hero.name} загуби личностната черта "${removedName}".`;
        console.log(logMsg);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
        if (isMyHero(hero)) {
            if (window.ChronicleEvents && typeof window.ChronicleEvents.generatePersonalityRemove === 'function') {
                const ev = window.ChronicleEvents.generatePersonalityRemove(hero, removedName);
                if (window.showAdvisorMsg) window.showAdvisorMsg(ev.message, ev.buttons);
            } else {
                if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
            }
        }
    }
    else if (hero.personality.length > 0) {
        const idx = Math.floor(Math.random() * hero.personality.length);
        const change = (Math.random() - 0.5) * 0.2;
        let newInf = hero.personality[idx].influence + change;
        newInf = Math.min(2.0, Math.max(0.5, newInf));
        const oldInf = hero.personality[idx].influence;
        hero.personality[idx].influence = newInf;
        const logMsg = `🎭 ${hero.name} промени силата на "${hero.personality[idx].name}" от ${oldInf.toFixed(2)} на ${newInf.toFixed(2)}.`;
        console.log(logMsg);
        if (window.addHeroLog) window.addHeroLog(hero, "🎭", logMsg);
        if (isMyHero(hero)) {
            if (window.ChronicleEvents && typeof window.ChronicleEvents.generatePersonalityInfluence === 'function') {
                const ev = window.ChronicleEvents.generatePersonalityInfluence(hero, hero.personality[idx].name, oldInf, newInf);
                if (window.showAdvisorMsg) window.showAdvisorMsg(ev.message, ev.buttons);
            } else {
                if (window.showAdvisorMsg) window.showAdvisorMsg(logMsg);
            }
        }
    }
};

setTimeout(() => {
    if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isJoined && !hero.personality) {
                window.assignPersonalityTraits(hero, 3);
            }
        }
    }
    console.log("✅ characterEvolution.js зареден – инвестиционните съобщения са премахнати");
}, 1000);
