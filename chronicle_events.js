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

window.ChronicleEvents.generateSetBonusOffer = function(setKey, count, hero) {
    const setInfo = window.artifactSetBonuses?.[setKey] || { name: setKey, bonus: {} };
    return {
        message: `🏺 Събрахте ${count} артефакта от сета "${setInfo.name}". Желаете ли да активирате сет бонуса?`,
        buttons: [
            { label: '✨ Активирай', action: () => {
                const heroId = window.pendingSetBonuses[setKey];
                const targetHero = window.worldData?.clans?.[heroId];
                if (targetHero) {
                    if (!targetHero.activeSetBonuses) targetHero.activeSetBonuses = {};
                    targetHero.activeSetBonuses[setKey] = true;
                    for (let bonus in setInfo.bonus) {
                        targetHero[bonus] = (targetHero[bonus] || 0) + setInfo.bonus[bonus];
                    }
                    window.showAdvisorMsg(`✅ Активиран е сет бонус: ${setInfo.name}!`);
                    if (window.updateCharacterUI) window.updateCharacterUI(targetHero);
                    if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
                }
                delete window.pendingSetBonuses[setKey];
            }},
            { label: '🗑️ Отхвърли', action: () => {
                delete window.pendingSetBonuses[setKey];
                window.showAdvisorMsg(`Отказахте активирането на сета.`);
            }}
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
// ==================== НОВИ ИНТЕРАКТИВНИ СЪБИТИЯ ====================

// 1. Търговски керван (избор: данък, защита, пропускане)
window.ChronicleEvents.generateTradeCaravanEvent = function(hero) {
    const goldOffer = 200 + Math.floor(Math.random() * 300);
    return {
        message: `🚚 Търговски керван от далечни земи минава през вашите територии. Те предлагат ${goldOffer} злато за безпрепятствено преминаване.`,
        buttons: [
            { label: `💰 Приеми данък (${goldOffer} злато)`, action: () => {
                hero.gold += goldOffer;
                window.addWorldEvent("📦 ТЪРГОВСКИ КЕРВАН", `${hero.name} получи ${goldOffer} злато от кервана.`, "💰");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: "🛡️ Предложи защита срещу 50 злато", action: () => {
                if (hero.gold >= 50) {
                    hero.gold -= 50;
                    hero.heroPower += 10;
                    window.addWorldEvent("🛡️ ЗАЩИТА НА КЕРВАН", `${hero.name} защити кервана и увеличи силата си с 10.`, "🛡️");
                    if (window.updateCharacterUI) window.updateCharacterUI(hero);
                    if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
                } else {
                    window.showAdvisorMsg("❌ Нямате 50 злато, за да предложите защита.");
                }
            }},
            { label: "❌ Прогони ги", action: () => {
                hero.gold = Math.max(0, hero.gold - 100);
                window.addWorldEvent("🚫 ПРОГОНЕН КЕРВАН", `Керванът беше прогонен и ви нанесе загуба от 100 злато.`, "❌");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }}
        ]
    };
};

// 2. Дипломатически брак (избор: приеми, откажи, искай зестра)
window.ChronicleEvents.generateDiplomaticMarriageEvent = function(hero, otherClan) {
    const relationGain = 20;
    const goldCost = 500;
    return {
        message: `💍 Кланът ${otherClan} ви предлага династичен брак. Това би подобрило отношенията с тях, но ще ви струва ${goldCost} злато за сватбените тържества.`,
        buttons: [
            { label: `💒 Приеми ( +${relationGain} отношение, -${goldCost} злато )`, action: () => {
                if (hero.gold >= goldCost) {
                    hero.gold -= goldCost;
                    if (!window.clanRelations) window.clanRelations = {};
                    window.clanRelations[otherClan] = Math.min(100, (window.clanRelations[otherClan] || 50) + relationGain);
                    window.addWorldEvent("💒 ДИНАСТИЧЕН БРАК", `${hero.name} се сроди с ${otherClan}. Отношенията се подобриха.`, "💒");
                    if (window.updateCharacterUI) window.updateCharacterUI(hero);
                    if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
                } else {
                    window.showAdvisorMsg(`❌ Нямате достатъчно злато (нужни ${goldCost}).`);
                }
            }},
            { label: "🙅 Откажи", action: () => {
                if (window.clanRelations) window.clanRelations[otherClan] = Math.max(0, (window.clanRelations[otherClan] || 50) - 10);
                window.addWorldEvent("💔 ОТКАЗАН БРАК", `${hero.name} отказа брак с ${otherClan}. Отношенията се влошиха.`, "💔");
            }},
            { label: "💰 Искай зестра ( -10 отношение, +300 злато )", action: () => {
                hero.gold += 300;
                if (window.clanRelations) window.clanRelations[otherClan] = Math.max(0, (window.clanRelations[otherClan] || 50) - 10);
                window.addWorldEvent("💰 ЗЕСТРА", `${hero.name} поиска и получи зестра от ${otherClan}, но отношенията се влошиха.`, "💰");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }}
        ]
    };
};

// 3. Епидемия (избор: лечение, карантина, бездействие)
window.ChronicleEvents.generatePlagueEvent = function(hero) {
    const costHeal = 300;
    const armyLoss = 100;
    return {
        message: `🦠 Чума избухна във вашите земи! Трябва да вземете решение бързо.`,
        buttons: [
            { label: `💊 Наеми лекари ( -${costHeal} злато )`, action: () => {
                if (hero.gold >= costHeal) {
                    hero.gold -= costHeal;
                    window.addWorldEvent("💊 ЛЕЧЕНИЕ НА ЧУМА", `${hero.name} нае лекари и предотврати загуби.`, "💊");
                } else {
                    hero.armySize = Math.max(0, (hero.armySize || 200) - armyLoss);
                    window.addWorldEvent("💀 ЧУМА", `Нямахте средства за лечение, армията намаля с ${armyLoss}.`, "💀");
                }
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: `🚫 Карантина ( -${armyLoss} войници )`, action: () => {
                hero.armySize = Math.max(0, (hero.armySize || 200) - armyLoss);
                window.addWorldEvent("🚫 КАРАНТИНА", `Карантината спаси населението, но армията намаля с ${armyLoss}.`, "🚫");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: "😇 Бездействие", action: () => {
                hero.armySize = Math.max(0, (hero.armySize || 200) - armyLoss * 2);
                hero.gold = Math.max(0, hero.gold - 200);
                window.addWorldEvent("☠️ ТОТАЛНА ЧУМА", `Бездействието доведе до големи загуби: -${armyLoss*2} войници и -200 злато.`, "☠️");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }}
        ]
    };
};

// 4. Съкровище в планините (избор: рискова експедиция, продажба на карта, игнориране)
window.ChronicleEvents.generateTreasureEvent = function(hero) {
    const riskGold = 200;
    const rewardGold = 800;
    const xpReward = 150;
    return {
        message: `🗺️ Ловец откри стара карта на съкровище в планините. Можете да организирате експедиция или да продадете картата.`,
        buttons: [
            { label: `⚔️ Експедиция ( -${riskGold} злато, риск от загуби )`, action: () => {
                if (hero.gold >= riskGold) {
                    hero.gold -= riskGold;
                    const success = Math.random() < 0.6;
                    if (success) {
                        hero.gold += rewardGold;
                        if (window.gainHeroXP) window.gainHeroXP(hero, xpReward);
                        window.addWorldEvent("🏆 НАМЕРЕНО СЪКРОВИЩЕ", `Експедицията бе успешна! +${rewardGold} злато, +${xpReward} XP.`, "🏆");
                    } else {
                        hero.armySize = Math.max(0, (hero.armySize || 200) - 50);
                        window.addWorldEvent("💔 ПРОВАЛЕНА ЕКСПЕДИЦИЯ", `Експедицията пропадна, загубихте 50 войници.`, "💔");
                    }
                } else {
                    window.showAdvisorMsg(`❌ Нямате ${riskGold} злато за експедиция.`);
                }
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: `💲 Продай картата ( +${Math.floor(rewardGold/2)} злато )`, action: () => {
                hero.gold += Math.floor(rewardGold/2);
                window.addWorldEvent("🗺️ ПРОДАДЕНА КАРТА", `Продадохте картата за ${Math.floor(rewardGold/2)} злато.`, "🗺️");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: "📜 Игнорирай", action: () => {
                window.addWorldEvent("🍃 ИЗПУСКАН ШАНС", `Решихте да не се занимавате със съкровището.`, "🍃");
            }}
        ]
    };
};

// 5. Бунт на селяните (избор: преговори, сила, отстъпки)
window.ChronicleEvents.generatePeasantRevoltEvent = function(hero) {
    const costNegotiate = 150;
    const armyLoss = 80;
    return {
        message: `🌾 Селяните във вашите земи са недоволни от високите данъци и заплашват с бунт.`,
        buttons: [
            { label: `🤝 Преговори ( -${costNegotiate} злато )`, action: () => {
                if (hero.gold >= costNegotiate) {
                    hero.gold -= costNegotiate;
                    hero.morale = Math.min(100, (hero.morale || 50) + 10);
                    window.addWorldEvent("🤝 ПРЕГОВОРИ", `Преговорите успокоиха селяните. Моралът се повиши.`, "🤝");
                } else {
                    hero.armySize = Math.max(0, (hero.armySize || 200) - armyLoss);
                    window.addWorldEvent("🔥 БУНТ", `Нямахте средства за преговори, бунтът доведе до загуба на ${armyLoss} войници.`, "🔥");
                }
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: `⚔️ Сила ( -${armyLoss} войници )`, action: () => {
                hero.armySize = Math.max(0, (hero.armySize || 200) - armyLoss);
                hero.gold += 100; // конфискувано от бунтовниците
                window.addWorldEvent("⚔️ ПОДАВЯНЕ НА БУНТ", `Подавихте бунта със сила, но загубихте ${armyLoss} войници.`, "⚔️");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }},
            { label: "💰 Намали данъците ( -100 злато на ход за 3 хода )", action: () => {
                hero.gold = Math.max(0, hero.gold - 100);
                hero.taxDebuff = { remaining: 3, amount: 100 };
                window.addWorldEvent("📉 НАМАЛЕНИ ДАНЪЦИ", `Намалихте данъците за 3 хода, което успокои селяните, но намали приходите.`, "📉");
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.updateStrongestHeroUI) window.updateStrongestHeroUI();
            }}
        ]
    };
};
window.ChronicleEvents.generateGuildOffer = function(guildId) {
    const guild = window.guilds[guildId];
    return {
        message: `🏛️ Достигнахте ниво 3! ${guild.name} ви кани да се присъедините.`,
        buttons: [
            { label: '✅ Присъедини се', action: () => {
                guild.joined = true;
                window.showAdvisorMsg(`Вие сте член на ${guild.name}!`);
                // Даваме начален бонус
                if (guildId === 'merchants') guild.benefits.goldBonus = 50;
                else if (guildId === 'warriors') guild.benefits.attackBonus = 10;
                else if (guildId === 'mages') guild.benefits.spellPower = 15;
                // Запазване
                if (window.saveGreatBulgariaGame) window.saveGreatBulgariaGame();
            }},
            { label: '❌ Откажи', action: () => window.showAdvisorMsg(`Отказахте поканата.`) }
        ]
    };
};

console.log("✅ chronicle_events.js зареден – генераторите са готови (вкл. умения и класове)");
