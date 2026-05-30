// ==================== СЛУЧАЙНИ КУЕСТОВЕ – ЕПИЧЕСКА ВЕРСИЯ (ХАРМОНИЗИРАНА) ====================
(function() {
    if (typeof window.QUEST_TYPES === 'undefined') {
        window.QUEST_TYPES = {
            BATTLE: "battle",
            EXPLORE: "explore",
            ARTIFACT: "artifact",
            COMPANION: "companion",
            RESOURCE: "resource",
            REGION_CONTROL: "control",
            DELIVERY: "delivery"
        };
    }

    const QUEST_TEMPLATES = {
        battle: {
            name: "Очисти {region} от {enemy}",
            desc: "В {region} се появиха опасни {enemy}. Трябва да ги унищожиш.",
            generateTarget: (region) => ({ target: 1, enemy: "враждебна банда" }),
            check: (quest, hero, regionTrigger, eventType) => {
                if (eventType === "battle" && regionTrigger === quest.region && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            }
        },
        explore: {
            name: "Пътешественик",
            desc: "Посети {count} съседни региона около {region}.",
            generateTarget: (region) => {
                let neighbors = window.regionConnections ? (window.regionConnections[region] || []) : [];
                let count = Math.min(neighbors.length, 2 + Math.floor(Math.random() * 3));
                return { target: count, visitedRegions: [], region: region };
            },
            check: (quest, hero, regionTrigger, eventType) => {
                if (eventType === "travel" && quest.extraData.region === regionTrigger && !quest.extraData.visitedRegions.includes(regionTrigger)) {
                    quest.extraData.visitedRegions.push(regionTrigger);
                    quest.progress = quest.extraData.visitedRegions.length;
                    return true;
                }
                return false;
            }
        },
        artifact: {
            name: "Древно съкровище в {region}",
            desc: "Намери артефакт в {region} (от битка или инспекция).",
            generateTarget: (region) => ({ target: 1, region: region }),
            check: (quest, hero, regionTrigger, eventType) => {
                if (eventType === "artifact" && regionTrigger === quest.region && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            }
        },
        companion: {
            name: "Нов спътник в {region}",
            desc: "Намери спътник в {region} (от инспекция).",
            generateTarget: (region) => ({ target: 1, region: region }),
            check: (quest, hero, regionTrigger, eventType) => {
                if (eventType === "companion" && regionTrigger === quest.region && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            }
        },
        resource: {
            name: "Събиране на ресурси в {region}",
            desc: "Събери {amount} злато в {region} (чрез битки/събития).",
            generateTarget: (region) => {
                let amount = 200 + Math.floor(Math.random() * 500);
                return { target: amount, resource: "gold", region: region, initialGold: 0 };
            },
            check: (quest, hero, regionTrigger, eventType) => {
                if (hero && hero.gold !== undefined) {
                    if (quest.extraData.initialGold === 0) quest.extraData.initialGold = hero.gold;
                    let gained = Math.max(0, hero.gold - quest.extraData.initialGold);
                    if (gained >= quest.target - quest.progress) {
                        quest.progress = quest.target;
                        return true;
                    }
                }
                return false;
            }
        },
        control: {
            name: "Завоювай {region}",
            desc: "Завладей региона {region} (направи го свой).",
            generateTarget: (region) => ({ target: 1, region: region }),
            check: (quest, hero, regionTrigger, eventType) => {
                if (eventType === "control" && regionTrigger === quest.region && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            }
        },
        delivery: {
            name: "Достави стока до {targetRegion}",
            desc: "Достави {amount} злато от {region} до {targetRegion} (просто пътувай).",
            generateTarget: (region) => {
                let possible = Object.keys(window.worldData.regions || {});
                let targetRegion = possible.find(r => r !== region && Math.random() > 0.7);
                if (!targetRegion) targetRegion = "Плиска";
                return { target: 1, region: region, targetRegion: targetRegion, amount: 100 + Math.floor(Math.random() * 200) };
            },
            check: (quest, hero, regionTrigger, eventType) => {
                if (eventType === "travel" && regionTrigger === quest.extraData.targetRegion && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            }
        }
    };

    // Функция за показване на съобщение (попап или летопис)
    function showMessage(title, message, type = "info") {
        if (window.showAdvisorPopup) {
            window.showAdvisorPopup(title, message, type);
        } else if (window.showAdvisorMsg) {
            window.showAdvisorMsg(message);
        } else {
            console.log(`${title}: ${message}`);
        }
    }

    window.generateRandomQuest = function(regionName) {
        if (!window.worldData || !window.worldData.regions[regionName]) return null;
        const types = Object.values(window.QUEST_TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const template = QUEST_TEMPLATES[randomType];
        if (!template) return null;

        const extraData = template.generateTarget(regionName);
        let quest = {
            id: Date.now() + "_" + Math.random().toString(36).substr(2, 6),
            type: randomType,
            region: regionName,
            title: template.name.replace(/{([^}]+)}/g, (match, p1) => {
                if (p1 === "region") return regionName;
                if (p1 === "enemy") return extraData.enemy || "враг";
                if (p1 === "count") return extraData.target;
                if (p1 === "amount") return extraData.amount;
                if (p1 === "targetRegion") return extraData.targetRegion;
                return match;
            }),
            description: template.desc.replace(/{([^}]+)}/g, (match, p1) => {
                if (p1 === "region") return regionName;
                if (p1 === "enemy") return extraData.enemy || "враг";
                if (p1 === "count") return extraData.target;
                if (p1 === "amount") return extraData.amount;
                if (p1 === "targetRegion") return extraData.targetRegion;
                return match;
            }),
            target: extraData.target,
            progress: 0,
            reward: {
                gold: 100 + Math.floor(Math.random() * 300),
                xp: 50 + Math.floor(Math.random() * 150),
                artifact: Math.random() < 0.2,
                companion: Math.random() < 0.1
            },
            extraData: extraData,
            checkFn: template.check
        };
        return quest;
    };

    window.addQuest = function(quest) {
        if (!window.activeQuests) window.activeQuests = [];
        if (window.activeQuests.some(q => q.id === quest.id)) return false;
        window.activeQuests.push(quest);
        showMessage("НОВ КУЕСТ", `📜 ${quest.title}`, "info");
        if (typeof window.refreshQuestsUI === 'function') window.refreshQuestsUI();
        return true;
    };

    window.completeQuest = function(quest, hero) {
        if (!quest || quest.progress < quest.target) return false;
        const idx = window.activeQuests.findIndex(q => q.id === quest.id);
        if (idx === -1) return false;
        window.activeQuests.splice(idx, 1);
        if (!window.completedQuests) window.completedQuests = [];
        window.completedQuests.push(quest);

        let rewardMsg = "";
        if (quest.reward.gold && hero) {
            hero.gold = (hero.gold || 0) + quest.reward.gold;
            rewardMsg += `<br>💰 +${quest.reward.gold} злато`;
        }
        if (quest.reward.xp && hero) {
            if (window.gainHeroXP) window.gainHeroXP(hero, quest.reward.xp);
            else hero.xp = (hero.xp || 0) + quest.reward.xp;
            rewardMsg += `<br>📚 +${quest.reward.xp} опит`;
        }
        if (quest.reward.artifact && hero) {
            if (window.historicalArtifacts) {
                let artifactKeys = Object.keys(window.historicalArtifacts);
                let randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
                let artifact = { ...window.historicalArtifacts[randomKey] };
                if (!hero.inventory) hero.inventory = [];
                hero.inventory.push(artifact);
                rewardMsg += `<br>🏺 Намерихте артефакт: ${artifact.name}!`;
            }
        }
        if (quest.reward.companion && hero && window.gameMode === 'solo' && window.companions.length < 4) {
            if (typeof window.recruitCompanion === 'function') {
                window.recruitCompanion(quest.region);
                rewardMsg += `<br>👥 Нов спътник!`;
            }
        }

        showMessage("КУЕСТ ЗАВЪРШЕН", `✅ ${quest.title}${rewardMsg}`, "success");
        if (typeof window.refreshQuestsUI === 'function') window.refreshQuestsUI();
        return true;
    };

    window.checkAllQuestsProgress = function(hero, regionTrigger, eventType) {
        if (!window.activeQuests || !hero) return;
        let anyChanged = false;
        for (let i = 0; i < window.activeQuests.length; i++) {
            const q = window.activeQuests[i];
            if (typeof q.checkFn !== 'function') continue;
            if (q.checkFn(q, hero, regionTrigger, eventType)) {
                if (q.progress >= q.target) {
                    window.completeQuest(q, hero);
                    anyChanged = true;
                    i--;
                } else {
                    anyChanged = true;
                }
            }
        }
        if (anyChanged && typeof window.refreshQuestsUI === 'function') window.refreshQuestsUI();
    };

 // Хук за събития (без да презаписва други модули)
if (typeof window.endGroupBattle === 'function') {
    const originalEndBattle = window.endGroupBattle;
    window.endGroupBattle = function(isVictory, reason, ...args) {
        originalEndBattle(isVictory, reason, ...args);
        if (isVictory && window.currentRegion) {
            // В класически режим – взимаме избрания герой, иначе най-силния
            let hero = null;
            if (window.gameMode === 'solo' && window.currentHero) {
                hero = window.currentHero;
            } else {
                hero = window.getSelectedHero ? window.getSelectedHero() : (window.getStrongestHero ? window.getStrongestHero() : null);
            }
            if (hero) {
                window.checkAllQuestsProgress(hero, window.currentRegion, "battle");
            }
        }
    };
}

    console.log("✅ Епическата система за куестове е активна (хармонизирана версия).");
})();
