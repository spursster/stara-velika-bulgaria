// ==================== chronicle_events.js – ПЕРМАНЕНТНА ВЕРСИЯ ====================
window.ChronicleEvents = window.ChronicleEvents || {};

// Икономическо събитие
window.ChronicleEvents.generateEconomicEvent = function(hero, eventData) {
    return {
        message: `${eventData.title} ${eventData.msg}`,
        buttons: [
            { label: '💰 Приеми', action: () => {
                if (eventData.gain) hero.gold += eventData.gain;
                if (eventData.loss) hero.gold = Math.max(0, hero.gold - eventData.loss);
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                window.showAdvisorMsg('✅ Ефектът е приложен.');
            }},
            { label: '📜 Игнорирай', action: () => window.showAdvisorMsg('Игнорирахте събитието.') }
        ]
    };
};

// Оферта за герой
window.ChronicleEvents.generateHeroOffer = function(candidate, cost) {
    return {
        message: `🏰 ${candidate.name} от род ${candidate.clan} иска да се присъедини срещу ${cost} злато.`,
        buttons: [
            { label: `✅ Наеми`, action: () => window.hireExistingHero(candidate.id, cost) },
            { label: '❌ Откажи', action: () => window.showAdvisorMsg(`Отказахте предложението.`) }
        ]
    };
};

// Артефакт
window.ChronicleEvents.generateArtifactFound = function(hero, artifact) {
    let bonus = artifact.bonus ? `+${artifact.bonus.heroPower || 0} сила` : '';
    return {
        message: `🏺 ${hero.name} намери артефакт: ${artifact.name} ${bonus}`,
        buttons: [
            { label: '🎒 Екипирай', action: () => window.equipArtifact(hero, artifact, 0) },
            { label: '🔍 Инспекция', action: () => window.showAdvisorPopup('Артефакт', artifact.description, 'info') }
        ]
    };
};

// Предложение за съюз
window.ChronicleEvents.generateAllianceProposal = function(proposer, target) {
    return {
        message: `🤝 ${proposer.name} предлага съюз на ${target.name}.`,
        buttons: [
            { label: '✅ Приеми', action: () => {
                if (!proposer.allies) proposer.allies = [];
                if (!target.allies) target.allies = [];
                proposer.allies.push(target.name);
                target.allies.push(proposer.name);
                window.showAdvisorMsg(`Съюзът е сключен.`);
            }},
            { label: '❌ Откажи', action: () => window.showAdvisorMsg(`Отказахте съюза.`) }
        ]
    };
};

// Промяна на личността
window.ChronicleEvents.generatePersonalityChange = function(hero, oldTrait, newTrait) {
    return {
        message: `🎭 ${hero.name} промени личност: загуби "${oldTrait}", придоби "${newTrait}".`,
        buttons: [
            { label: '📜 Виж профила', action: () => window.showHeroProfile(hero) }
        ]
    };
};

// ========== ГЕНЕРАТОР ЗА НОВА ТОЧКА УМЕНИЕ ==========
window.ChronicleEvents.generateSkillPointOffer = function(hero) {
    return {
        message: `⭐ ${hero.name} получи точка умение! (Общо точки: ${hero.skillPoints})`,
        buttons: [
            { label: '📖 Отвори уменията', action: () => {
                if (typeof window.openSkillsUI === 'function') window.openSkillsUI(hero);
                else window.showAdvisorMsg(`Отворете дърветата с умения от профила на героя.`);
            }},
            { label: '🤖 Автоматично разпредели', action: () => {
                if (typeof window.autoAssignSkillPoint === 'function') {
                    window.autoAssignSkillPoint(hero);
                    window.showAdvisorMsg(`✅ ${hero.name} автоматично научи умение.`);
                    if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(hero);
                    if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
                }
            }},
            { label: '⏳ Отложи', action: () => {
                window.showAdvisorMsg(`Точката е запазена. На следващия ход ще се разпредели според личността на героя.`);
            }}
        ]
    };
};

// ========== ГЕНЕРАТОР ЗА ЕВОЛЮЦИЯ НА КЛАС ==========
window.ChronicleEvents.generateClassEvolutionOffer = function(hero, oldClass, newClass) {
    return {
        message: `🌟 ${hero.name} може да се издигне от "${oldClass}" до "${newClass}"! Желаете ли да приемете новия клас?`,
        buttons: [
            { label: '✅ Приеми', action: () => {
                hero.currentClass = newClass;
                if (typeof window.applyClassBonuses === 'function') window.applyClassBonuses(hero, newClass);
                window.showAdvisorMsg(`🎉 ${hero.name} вече е ${newClass}!`);
                if (typeof window.updateCharacterUI === 'function') window.updateCharacterUI(hero);
                if (typeof window.updateStrongestHeroUI === 'function') window.updateStrongestHeroUI();
                if (window._pendingClassEvolution && window._pendingClassEvolution[hero.id]) {
                    delete window._pendingClassEvolution[hero.id];
                }
            }},
            { label: '❌ Откажи', action: () => {
                window.showAdvisorMsg(`Отказахте еволюцията на ${hero.name}. При следващо ниво ще може да опитате отново.`);
                if (window._pendingClassEvolution && window._pendingClassEvolution[hero.id]) {
                    delete window._pendingClassEvolution[hero.id];
                }
            }}
        ]
    };
};

console.log("✅ chronicle_events.js зареден – генераторите са готови (вкл. умения и класове)");
