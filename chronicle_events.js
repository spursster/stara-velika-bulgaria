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

// Инвестиция
window.ChronicleEvents.generateInvestmentOpportunity = function(hero, amount, profit, turns) {
    return {
        message: `💎 Инвестирайте ${amount} злато за ${turns} хода, печалба ${profit}.`,
        buttons: [
            { label: `💸 Инвестирай`, action: () => {
                if (hero.gold >= amount) {
                    hero.gold -= amount;
                    setTimeout(() => { hero.gold += profit; window.showAdvisorMsg(`Инвестицията донесе ${profit} злато.`); }, 30000);
                    window.showAdvisorMsg(`Инвестирахте ${amount} злато.`);
                } else window.showAdvisorMsg(`Нямате достатъчно злато.`);
            }},
            { label: '🚫 Откажи', action: () => window.showAdvisorMsg(`Отказахте инвестицията.`) }
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

console.log("✅ chronicle_events.js зареден – генераторите са готови");
