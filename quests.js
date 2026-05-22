/**
 * МОДУЛ: СЛУЧАЙНИ КУЕСТОВЕ (QUESTS) – ВЕЛИКА БЪЛГАРИЯ
 * ВЕРСИЯ: 1.0 – ГЕНЕРИРАНЕ, ПРОГРЕС, НАГРАДИ
 */

(function() {
    // ==================== ТИПОВЕ КУЕСТОВЕ ====================
    const QUEST_TYPES = {
        BATTLE: "battle",           // Победи определен враг в региона
        EXPLORE: "explore",         // Посети съседен регион
        ARTIFACT: "artifact",       // Намери артефакт (чрез битка или инспекция)
        COMPANION: "companion",     // Намери/наеме спътник
        RESOURCE: "resource",       // Събери ресурс (злато/войски)
        REGION_CONTROL: "control",  // Завладей региона
        DELIVERY: "delivery"        // Достави ресурс до друг регион
    };

    // Базови шаблони за куестове, от които ще генерираме конкретни
    const QUEST_TEMPLATES = {
        [QUEST_TYPES.BATTLE]: {
            name: "Очисти {region} от {enemy}",
            desc: "В {region} се появиха опасни {enemy}. Трябва да ги унищожиш.",
            check: (quest, hero, region) => {
                if (quest.progress < quest.target && window.worldData && window.worldData.regions[quest.region] && window.worldData.regions[quest.region].armySize <= 0) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            },
            generateTarget: (region) => ({ target: 1, enemy: "враждебна банда" })
        },
        [QUEST_TYPES.EXPLORE]: {
            name: "Пътешественик",
            desc: "Посети {count} съседни региона около {region}.",
            check: (quest, hero, region) => {
                // Ще следим броя нови региони, посетени след приемането на куеста
                return quest.progress >= quest.target;
            },
            generateTarget: (region) => {
                let neighbors = window.regionConnections ? (window.regionConnections[region] || []) : [];
                let count = Math.min(neighbors.length, 2 + Math.floor(Math.random() * 3));
                return { target: count, visited: 0, region: region };
            }
        },
        [QUEST_TYPES.ARTIFACT]: {
            name: "Древно съкровище в {region}",
            desc: "Намери артефакт в {region} (от битка или инспекция).",
            check: (quest, hero, region) => {
                // Куестът се маркира като завършен, когато герой получи артефакт в този регион
                return quest.progress >= quest.target;
            },
            generateTarget: (region) => ({ target: 1, region: region })
        },
        [QUEST_TYPES.COMPANION]: {
            name: "Нов спътник в {region}",
            desc: "Намери спътник в {region} (от таверната/инспекцията).",
            check: (quest, hero, region) => {
                return quest.progress >= quest.target;
            },
            generateTarget: (region) => ({ target: 1, region: region })
        },
        [QUEST_TYPES.RESOURCE]: {
            name: "Събиране на ресурси в {region}",
            desc: "Събери {amount} злато или {army} войници в {region} (чрез битки/събития).",
            check: (quest, hero, region) => {
                // Проверява се ръчно при промяна на злато/армия
                return quest.progress >= quest.target;
            },
            generateTarget: (region) => {
                let amount = 200 + Math.floor(Math.random() * 500);
                return { target: amount, resource: "gold", region: region };
            }
        },
        [QUEST_TYPES.REGION_CONTROL]: {
            name: "Завоювай {region}",
            desc: "Завладей региона {region} (направи го свой).",
            check: (quest, hero, region) => {
                let owned = (window.playerRegions && window.playerRegions.flat().includes(quest.region));
                if (owned && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            },
            generateTarget: (region) => ({ target: 1, region: region })
        },
        [QUEST_TYPES.DELIVERY]: {
            name: "Достави стока до {targetRegion}",
            desc: "Достави {amount} злато от {region} до {targetRegion} (просто пътувай).",
            check: (quest, hero, region) => {
                if (window.currentRegion === quest.targetRegion && quest.progress < quest.target) {
                    quest.progress = quest.target;
                    return true;
                }
                return false;
            },
            generateTarget: (region) => {
                let possible = Object.keys(window.worldData.regions || {});
                let targetRegion = possible.find(r => r !== region && Math.random() > 0.7);
                if (!targetRegion) targetRegion = "Плиска";
                return { target: 1, region: region, targetRegion: targetRegion, amount: 100 + Math.floor(Math.random() * 200) };
            }
        }
    };

    // ==================== ГЕНЕРИРАНЕ НА КУЕСТ ====================
    window.generateRandomQuest = function(regionName) {
        if (!window.worldData || !window.worldData.regions[regionName]) return null;
        const types = Object.values(QUEST_TYPES);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const template = QUEST_TEMPLATES[randomType];
        if (!template) return null;

        const targetData = template.generateTarget(regionName);
        let quest = {
            id: Date.now() + "_" + Math.random().toString(36).substr(2, 6),
            type: randomType,
            region: regionName,
            title: template.name.replace(/{([^}]+)}/g, (match, p1) => {
                if (p1 === "region") return regionName;
                if (p1 === "enemy") return targetData.enemy || "враг";
                if (p1 === "count") return targetData.target;
                if (p1 === "amount") return targetData.amount;
                if (p1 === "targetRegion") return targetData.targetRegion;
                return match;
            }),
            description: template.desc.replace(/{([^}]+)}/g, (match, p1) => {
                if (p1 === "region") return regionName;
                if (p1 === "enemy") return targetData.enemy || "враг";
                if (p1 === "count") return targetData.target;
                if (p1 === "amount") return targetData.amount;
                if (p1 === "targetRegion") return targetData.targetRegion;
                return match;
            }),
            target: targetData.target,
            progress: 0,
            reward: {
                gold: 100 + Math.floor(Math.random() * 300),
                xp: 50 + Math.floor(Math.random() * 150),
                artifact: Math.random() < 0.2 ? true : false,
                companion: Math.random() < 0.1 ? true : false
            },
            extraData: targetData,
            checkFn: template.check
        };
        return quest;
    };

    // ==================== ЗАПОЧВАНЕ НА КУЕСТ ====================
    window.addQuest = function(quest) {
        if (!window.activeQuests) window.activeQuests = [];
        if (window.activeQuests.some(q => q.id === quest.id)) return false;
        window.activeQuests.push(quest);
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`📜 НОВ КУЕСТ: ${quest.title} – ${quest.description}`);
        }
        // Ако има UI за куестове, можем да го опресним
        if (typeof window.refreshQuestsUI === 'function') window.refreshQuestsUI();
        return true;
    };

    // ==================== ЗАВЪРШВАНЕ НА КУЕСТ ====================
    window.completeQuest = function(quest, hero) {
        if (!quest || quest.progress < quest.target) return false;
        const idx = window.activeQuests.findIndex(q => q.id === quest.id);
        if (idx === -1) return false;
        window.activeQuests.splice(idx, 1);
        if (!window.completedQuests) window.completedQuests = [];
        window.completedQuests.push(quest);

        // Даване на награди
        if (quest.reward.gold && hero) {
            hero.gold = (hero.gold || 0) + quest.reward.gold;
            if (window.showAdvisorMsg) window.showAdvisorMsg(`💰 Получихте ${quest.reward.gold} злато за куеста!`);
        }
        if (quest.reward.xp && hero) {
            if (window.gainHeroXP) window.gainHeroXP(hero, quest.reward.xp);
            else hero.xp = (hero.xp || 0) + quest.reward.xp;
            if (window.showAdvisorMsg) window.showAdvisorMsg(`📚 Получихте ${quest.reward.xp} опит!`);
        }
        if (quest.reward.artifact && hero) {
            // Даваме случаен артефакт от historicalArtifacts
            if (window.historicalArtifacts) {
                let artifactKeys = Object.keys(window.historicalArtifacts);
                let randomKey = artifactKeys[Math.floor(Math.random() * artifactKeys.length)];
                let artifact = { ...window.historicalArtifacts[randomKey] };
                if (!hero.inventory) hero.inventory = [];
                hero.inventory.push(artifact);
                if (window.showAdvisorMsg) window.showAdvisorMsg(`🏺 Намерихте артефакт: ${artifact.name}!`);
            }
        }
        if (quest.reward.companion && hero && window.gameMode === 'solo' && window.companions.length < 4) {
            // Опитваме се да добавим спътник (ако нямаме 4)
            if (typeof window.recruitCompanion === 'function') {
                window.recruitCompanion(quest.region);
            } else {
                console.warn("Функцията recruitCompanion не е намерена.");
            }
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`✅ КУЕСТ ЗАВЪРШЕН: ${quest.title}`);
        }
        if (typeof window.refreshQuestsUI === 'function') window.refreshQuestsUI();
        return true;
    };

    // ==================== ПРОВЕРКА ЗА НАПРЕДЪК ====================
    window.checkAllQuestsProgress = function(hero, regionTrigger, eventType) {
        if (!window.activeQuests || !hero) return;
        let anyChanged = false;
        for (let i = 0; i < window.activeQuests.length; i++) {
            const q = window.activeQuests[i];
            if (q.checkFn(q, hero, regionTrigger, eventType)) {
                // Ако progress стане >= target, маркираме като завършен
                if (q.progress >= q.target) {
                    window.completeQuest(q, hero);
                    anyChanged = true;
                    i--; // защото масивът се промени
                } else {
                    anyChanged = true;
                }
            }
        }
        if (anyChanged && typeof window.refreshQuestsUI === 'function') window.refreshQuestsUI();
    };

    // ==================== УВЕДОМЛЕНИЯ ЗА СЪБИТИЯ (ПРОГРЕС) ====================
    // Закачаме се на събития, които могат да напреднат куестовете
    function hookGameEvents() {
        // След битка – проверяваме за куестове от тип BATTLE, ARTIFACT, RESOURCE
        const originalEndBattle = window.endGroupBattle;
        if (originalEndBattle) {
            window.endGroupBattle = function(isVictory, reason, ...args) {
                if (originalEndBattle) originalEndBattle(isVictory, reason, ...args);
                if (isVictory && window.currentHero && window.currentRegion) {
                    window.checkAllQuestsProgress(window.currentHero, window.currentRegion, "battle");
                }
            };
        }

        // При пътуване до нов регион – проверяваме за EXPLORE, DELIVERY
        if (typeof window.travelToRegion === 'function') {
            const originalTravel = window.travelToRegion;
            window.travelToRegion = function(regionName, ...args) {
                let oldRegion = window.currentRegion;
                let result = originalTravel ? originalTravel(regionName, ...args) : null;
                if (oldRegion !== regionName && window.currentHero) {
                    // Може да се увеличи прогреса на куестове за explore
                    for (let q of (window.activeQuests || [])) {
                        if (q.type === QUEST_TYPES.EXPLORE && q.extraData.region === oldRegion) {
                            let visited = q.extraData.visited || 0;
                            if (!q.extraData.visitedRegions) q.extraData.visitedRegions = [];
                            if (!q.extraData.visitedRegions.includes(regionName)) {
                                q.extraData.visitedRegions.push(regionName);
                                q.progress = q.extraData.visitedRegions.length;
                                q.extraData.visited = q.progress;
                            }
                        }
                        if (q.type === QUEST_TYPES.DELIVERY && q.extraData.targetRegion === regionName) {
                            q.progress = q.target;
                        }
                    }
                    window.checkAllQuestsProgress(window.currentHero, regionName, "travel");
                }
                return result;
            };
        }

        // При намиране на артефакт (може да се закачи на addWorldEvent или друг механизъм)
        const originalAddWorldEvent = window.addWorldEvent;
        if (originalAddWorldEvent) {
            window.addWorldEvent = function(title, desc, icon, year) {
                originalAddWorldEvent(title, desc, icon, year);
                if (desc && desc.includes("артефакт") && window.currentHero) {
                    window.checkAllQuestsProgress(window.currentHero, window.currentRegion, "artifact");
                }
            };
        }

        // При наемане на спътник (patched в soloMode.js)
        if (typeof window.recruitCompanion === 'function') {
            const originalRecruit = window.recruitCompanion;
            window.recruitCompanion = function(regionName, ...args) {
                let result = originalRecruit ? originalRecruit(regionName, ...args) : null;
                if (window.currentHero) {
                    window.checkAllQuestsProgress(window.currentHero, regionName, "companion");
                }
                return result;
            };
        }

        // При завладяване на регион (win battle with region conquest)
        const originalStartBattle = window.startBattle;
        if (originalStartBattle) {
            window.startBattle = function(regionInput) {
                // Запомняме дали преди битката регионът е бил наш
                let regionName = typeof regionInput === 'string' ? regionInput : (regionInput.name || regionInput.id);
                let wasOwned = window.playerRegions && window.playerRegions.flat().includes(regionName);
                let result = originalStartBattle(regionInput);
                // След битка, ако сега е наш и преди не беше, значи сме завладели
                let isOwnedNow = window.playerRegions && window.playerRegions.flat().includes(regionName);
                if (!wasOwned && isOwnedNow && window.currentHero) {
                    window.checkAllQuestsProgress(window.currentHero, regionName, "control");
                }
                return result;
            };
        }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    function initQuests() {
        if (!window.activeQuests) window.activeQuests = [];
        if (!window.completedQuests) window.completedQuests = [];
        hookGameEvents();
        console.log("✅ Системата за куестове е активна.");
    }

    // Стартираме, когато играта е готова
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initQuests);
    } else {
        initQuests();
    }
})();
