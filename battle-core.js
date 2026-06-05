/**
 * ========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – БИТКА: ОСНОВНА ЛОГИКА (battle-core.js)
 * Версия: 3.2 – ФИКС НА ДУБЛИРАНЕ НА РАЗКАЗИТЕ (работеща)
 * ========================================================================
 */

(function() {
    // ========== СИСТЕМА ЗА ЕПИЧЕН РАЗКАЗ ==========
    let _battleNarrative = [];
    let _damageDealt = {};
    let _battleInProgress = false;   // НОВО: предотвратява дублиране

    function addNarrative(text, type = "info") {
        _battleNarrative.push({ text, type, time: Date.now() });
        if (_battleNarrative.length > 40) _battleNarrative.shift();
    }

    function resetNarrative() { 
        _battleNarrative = [];
        _damageDealt = {};
        _battleInProgress = false;   // НОВО: нулираме флага
    }

    function getNarrative() { return [..._battleNarrative]; }

    // Помощна функция за разнообразни теренни описания
    function getTerrainIntro(terrain) {
        const terrains = {
            "Планинска": [
                "Високите планини отекваха от бойни викове.",
                "Снежните върхове станаха свидетели на кръвопролитие.",
                "Скалите се разтърсиха от сблъсъка на армиите."
            ],
            "Гора": [
                "Гъстата гора криеше смъртоносни засади.",
                "Дърветата горяха, осветявайки бойното поле.",
                "Сенките на дърветата танцуваха с ножовете на убийците."
            ],
            "Речен": [
                "Реката се оцвети в червено.",
                "Водите отнесоха телата на падналите.",
                "Мостът беше залят с кръв и стомана."
            ],
            "Пустинна": [
                "Жегата и пясъкът бяха също толкова опасни, колкото и врага.",
                "Пустинята погълна стотици жертви.",
                "Слънцето огряваше клането без милост."
            ],
            "Блато": [
                "Калта и мъглата превръщаха битката в кошмар.",
                "Всяка крачка беше борба за оцеляване.",
                "Отровните изпарения се смесиха с миризмата на кръв."
            ],
            "Равнина": [
                "Откритата равнина позволи на конницата да бушува.",
                "Вятърът носеше виковете на ранените.",
                "Земята беше накъсана от копита и мечове."
            ],
            "Крайбрежна": [
                "Морските вълни се разбиваха върху телата на падналите.",
                "Соленият вятър смеси аромата на кръв и водорасли.",
                "Корабите на хоризонта донесоха подкрепления в последния момент."
            ],
            "Вулканична": [
                "Земята трепереше под краката на воините.",
                "Пепелта заслепяваше очите, а лавата озаряваше нощта.",
                "Сяра и огън – адът беше на Земята."
            ],
            "Магическа": [
                "Магическите енергии нарушаваха законите на физиката.",
                "Портали се отваряха и затваряха в хаос.",
                "Заклинания разкъсваха въздуха, а призраци се носеха над бойното поле."
            ]
        };
        let list = terrains[terrain] || ["Битката беше жестока и безмилостна."];
        return list[Math.floor(Math.random() * list.length)];
    }

    // Помощна функция за финал според клас
    function getClassClimax(hero) {
        const className = hero.className || "войн";
        const lowerName = className.toLowerCase();
        if (lowerName.includes("маг") || lowerName.includes("wizard")) return " с магическа сила, която разкъса небето";
        if (lowerName.includes("паладин") || lowerName.includes("paladin")) return " със светлина в очите, която изгори нечестивите";
        if (lowerName.includes("берсерк") || lowerName.includes("berserker")) return " в кървава ярост, разкъсвайки враговете с голи ръце";
        if (lowerName.includes("воевод") || lowerName.includes("voivode")) return " със студен ум, предвиждайки всяка крачка на врага";
        if (lowerName.includes("стрелец") || lowerName.includes("archer")) return " с точен мерник, сразяващ враговете от разстояние";
        if (lowerName.includes("асаксин") || lowerName.includes("сенчест")) return " от сенките, нанасяйки смъртоносен удар в гръб";
        if (lowerName.includes("кръстоносец")) return " с кръст и меч, изгарящ неверниците";
        if (lowerName.includes("некромант")) return " призовавайки мъртвите да се бият на негова страна";
        if (lowerName.includes("друид")) return " със силата на природата, опустошаваща редиците на врага";
        if (lowerName.includes("рицар")) return " на кон, препускащ през огън и дим";
        return " с непоколебима воля, вдъхновяваща всички около себе си";
    }

    // Основната функция за генериране на епичен разказ (С MVP)
    function generateBattleStory(regionName, heroes, enemies, isVictory, rewards) {
        // НОВО: Предотвратява дублиране – ако вече има активен разказ, пропускаме
        if (_battleInProgress) {
            return "";
        }
        _battleInProgress = true;

        if (!_battleNarrative || _battleNarrative.length === 0) {
            _battleInProgress = false;   // НОВО: нулираме преди изход
            return isVictory 
                ? `Силите ви сразяват врага в ${regionName}. Победата е ваша!`
                : `Войските ви отстъпват от ${regionName}. Поражението е горчиво.`;
        }

        // ---- MVP: кой герой нанесе най-много щети? ----
        let mvpHero = null;
        let maxDamage = 0;
        for (let id in _damageDealt) {
            if (_damageDealt[id] > maxDamage) {
                maxDamage = _damageDealt[id];
                mvpHero = heroes.find(h => h.id === id);
            }
        }
        if (!mvpHero && heroes.length) mvpHero = heroes.find(h => h.hp > 0) || heroes[0];
        
        if (mvpHero && mvpHero.clanObj) {
            if (!window.mvpHistory) window.mvpHistory = [];
            window.mvpHistory.unshift({
                heroName: mvpHero.name,
                damage: maxDamage,
                region: regionName,
                timestamp: Date.now()
            });
            if (window.mvpHistory.length > 20) window.mvpHistory.pop();
            const heroObj = mvpHero.clanObj;
            if (heroObj) {
                const mvpXp = 5;
                const mvpMorale = 5;
                if (window.gainHeroXP) window.gainHeroXP(heroObj, mvpXp);
                else heroObj.xp = (heroObj.xp || 0) + mvpXp;
                heroObj.morale = Math.min(100, (heroObj.morale || 50) + mvpMorale);
            }
        }
        
        // ---- 1. Интро според терена ----
        const region = window.worldData?.regions?.[regionName];
        let terrainIntro = "";
        if (region) terrainIntro = getTerrainIntro(region.terrain);
        else terrainIntro = `В ${regionName} се разрази яростна битка.`;

        // ---- 2. Събираме най-важните моменти (до 6, с малко случайност) ----
        const maxEvents = 6;
        let importantEvents = _battleNarrative.slice(0, maxEvents);
        if (importantEvents.length > 3 && Math.random() > 0.7) {
            const older = _battleNarrative[maxEvents];
            if (older) importantEvents.push(older);
        }
        let battleFlow = "";
        for (let ev of importantEvents) battleFlow += ` ▸ ${ev.text}\n`;

        // ---- 3. Кулминация и край според изхода ----
        let climax = "";
        let bonusGold = 0, bonusXP = 0, bonusMorale = 0;

        if (isVictory) {
            const strongestHero = heroes.reduce((a, b) => (a.power > b.power ? a : b), heroes[0]);
            const classSuffix = getClassClimax(strongestHero);
            const epicTurns = [
                `Тогава ${strongestHero.name}${classSuffix} нанесе решителния удар.`,
                `Изведнъж небето се разцепи и ${strongestHero.name}${classSuffix} удари безмилостно.`,
                `Когато всички изглеждаше загубено, ${strongestHero.name}${classSuffix} възкръсна и сразява врага.`,
                `Земята потрепери под краката на ${strongestHero.name}${classSuffix}.`
            ];
            let epicLine = epicTurns[Math.floor(Math.random() * epicTurns.length)];
            const ending = [
                " Врагът потрепери и побягна.",
                " Оцелелите се разпръснаха в паника.",
                " Бойното поле остана покрито с трупове на противника.",
                " Славата на победителите ще се помни с векове."
            ];
            climax = epicLine + ending[Math.floor(Math.random() * ending.length)];
            if (rewards.gold) bonusGold = Math.floor(rewards.gold * 0.2);
            if (rewards.xp) bonusXP = Math.floor(rewards.xp * 0.2);
            bonusMorale = 15;
        } else {
            const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
            const defeatMessages = [
                `Въпреки смелостта на ${randomHero.name}, силите ви не стигнаха. Отстъплението беше неизбежно.`,
                `Предателство в собствените редици доведе до разгром.`,
                `Вражеският командир се оказа по-хитър. Загубите са тежки.`,
                `Съдбата се обърна срещу вас в последния миг.`
            ];
            climax = defeatMessages[Math.floor(Math.random() * defeatMessages.length)];
            if (rewards.gold) bonusGold = -Math.floor(rewards.gold * 0.1);
            bonusMorale = -15;
        }

        // ---- 4. Добавяме ефект от първия жив герой ----
        const firstHero = heroes.find(h => h.hp > 0);
        if (firstHero && isVictory && Math.random() > 0.6) {
            climax += `\nЛично ${firstHero.name} събра трофеите и вдигна знамето на победата.`;
        }

        // ---- 5. Секция за MVP ----
        let mvpSection = "";
        if (mvpHero && maxDamage > 0) {
            const dmgPercent = ((maxDamage / (rewards?.totalDamage || maxDamage)) * 100).toFixed(0);
            mvpSection = `\n🌟 **MVP на битката: ${mvpHero.name}** с ${maxDamage} щети (${dmgPercent}% от общите)! 🌟\n`;
            if (isVictory) {
                mvpSection += `🏅 За героизма си ${mvpHero.name} получава +5 опит и +5 морал.\n`;
            }
        }
        
        // ---- 6. Формираме пълния разказ ----
        let story = `🏰 **Епичната битка за ${regionName}**\n\n` +
                    `${terrainIntro}\n${battleFlow}\n` +
                    `---\n✨ **${isVictory ? "ПОБЕДА" : "ПОРАЖЕНИЕ"}** ✨\n${climax}\n` +
                    mvpSection;

        if (rewards.gold) story += `💰 Намерено злато: ${rewards.gold}\n`;
        if (rewards.xp) story += `📚 Придобит опит: ${rewards.xp}\n`;
        if (rewards.artifact) story += `🏺 Открит артефакт: "${rewards.artifact.name}"\n`;

        // ---- 7. Записваме разказа в хрониките ----
        if (!window.epicChronicles) window.epicChronicles = [];
        window.epicChronicles.unshift({
            title: `Битката за ${regionName} (${window.gameTime ? window.gameTime.year + " г." : "н.е."})`,
            story: story,
            timestamp: Date.now(),
            isVictory: isVictory,
            mvp: mvpHero ? mvpHero.name : null
        });
        if (window.epicChronicles.length > 20) window.epicChronicles.pop();

        // ---- 8. При победа – показваме бутони за избор ----
        if (isVictory && typeof window.showAdvisorMsg === 'function') {
            const buttons = [
                {
                    label: `🏛️ Издигни паметник (+${bonusXP} опит, +10 морал)`,
                    action: () => {
                        if (bonusXP > 0) {
                            const livingHeroes = heroes.filter(h => h.hp > 0);
                            const xpPerHero = Math.floor(bonusXP / livingHeroes.length);
                            for (let h of livingHeroes) {
                                const heroObj = h.heroObj || h.clanObj;
                                if (window.gainHeroXP) window.gainHeroXP(heroObj, xpPerHero);
                                else heroObj.xp = (heroObj.xp || 0) + xpPerHero;
                            }
                        }
                        for (let h of heroes) {
                            const heroObj = h.heroObj || h.clanObj;
                            heroObj.morale = Math.min(100, (heroObj.morale || 50) + 10);
                        }
                        if (window.addWorldEvent) window.addWorldEvent("🏛️ ПАМЕТНИК", `${heroes[0]?.name || "Героите"} издигнаха паметник в чест на победата.`, "🏛️");
                        if (window.updateAllUI) window.updateAllUI();
                    }
                },
                {
                    label: `💰 Разграби лагера (+${bonusGold} злато)`,
                    action: () => {
                        if (bonusGold > 0) {
                            const livingHeroes = heroes.filter(h => h.hp > 0);
                            const randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
                            const heroObj = randomHero.heroObj || randomHero.clanObj;
                            heroObj.gold += bonusGold;
                            if (window.addWorldEvent) window.addWorldEvent("💰 ПЛЯЧКОС", `${heroObj.name} намери ${bonusGold} злато в лагера на врага.`, "💰");
                        }
                        if (window.updateAllUI) window.updateAllUI();
                    }
                },
                {
                    label: `📜 Запиши хроника (без бонус)`,
                    action: () => {
                        if (window.addWorldEvent) window.addWorldEvent("📜 ХРОНИКА", `Битката при ${regionName} ще се помни вечно.`, "📜");
                    }
                }
            ];
            window.showAdvisorMsg(story, buttons);
        } else if (!isVictory && typeof window.showAdvisorMsg === 'function') {
            window.showAdvisorMsg(story);
        } else {
            console.log(story);
        }

        _battleInProgress = false;   // НОВО: нулираме флага след приключване
        return story;
    }

    // ========== ПОМОЩНИ ФУНКЦИИ ЗА БОНУСИ ==========
    function getTroopSpecialEffects(hero) {
        if (!hero || !hero.armyDetails || !window.ALL_TROOP_TYPES) return {};
        let effects = {
            lifeSteal: 0,
            critChanceBonus: 0,
            damageReduction: 0,
            firstStrikeBonus: 0,
            nightFuryBonus: 0,
            hasSplash: false,
            hasDoubleCast: false,
            hasInvincibleOnce: false,
            hasTimeSkip: false,
            hasArmyShrink: false
        };
        for (let troop of window.ALL_TROOP_TYPES) {
            let count = hero.armyDetails[troop.id] || 0;
            if (count > 0 && troop.special) {
                let parts = troop.special.split(':');
                let key = parts[0];
                let value = parts[1] ? parseFloat(parts[1]) : null;
                switch(key) {
                    case "lifeSteal": if (value) effects.lifeSteal = Math.max(effects.lifeSteal, value); break;
                    case "critChance": if (value) effects.critChanceBonus = Math.max(effects.critChanceBonus, value); break;
                    case "damageReduction": if (value) effects.damageReduction = Math.max(effects.damageReduction, value); break;
                    case "firstStrikeBonus": if (value) effects.firstStrikeBonus = Math.max(effects.firstStrikeBonus, value); break;
                    case "nightFury": if (value) effects.nightFuryBonus = Math.max(effects.nightFuryBonus, value); break;
                    case "splashDamage": effects.hasSplash = true; break;
                    case "doubleCast": effects.hasDoubleCast = true; break;
                    case "invincibleOnce": effects.hasInvincibleOnce = true; break;
                    case "timeSkip": effects.hasTimeSkip = true; break;
                    case "armyShrink": effects.hasArmyShrink = true; break;
                }
            }
        }
        return effects;
    }

    function getPetEffects(hero) {
        if (!hero || !hero.pet) return {};
        let petId = hero.pet;
        let effects = {
            reviveChance: 0,
            extraTurnChance: 0,
            damageBonus: 0,
            critChanceBonus: 0,
            lifeSteal: 0,
            damageReduction: 0,
            goldBonus: 0,
            fireDamage: 0,
            coldDamage: 0,
            healAllies: 0
        };
        if (window.divinePets && window.divinePets[petId]) {
            let pet = window.divinePets[petId];
            if (pet.bonus) {
                if (pet.bonus.reviveChance) effects.reviveChance = pet.bonus.reviveChance;
                if (pet.bonus.extraTurn) effects.extraTurnChance = pet.bonus.extraTurn;
                if (pet.bonus.fireDamage) effects.fireDamage = pet.bonus.fireDamage;
                if (pet.bonus.coldDamage) effects.coldDamage = pet.bonus.coldDamage;
                if (pet.bonus.critChance) effects.critChanceBonus = pet.bonus.critChance;
                if (pet.bonus.lifeSteal) effects.lifeSteal = pet.bonus.lifeSteal;
                if (pet.bonus.damageReduction) effects.damageReduction = pet.bonus.damageReduction;
                if (pet.bonus.goldBonus) effects.goldBonus = pet.bonus.goldBonus;
                if (pet.bonus.healAllies) effects.healAllies = pet.bonus.healAllies;
            }
        } else if (window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[petId]) {
            let pet = window.rpgDatabase.petsDatabase[petId];
            let petName = (pet.name || "").toLowerCase();
            if (petName === "родов сокол") effects.damageBonus = 0.15;
            else if (petName === "вълк единак") effects.critChanceBonus = 0.10;
            else if (petName === "степен жребец") effects.damageReduction = 0.15;
        }
        return effects;
    }

    function getAdvancedSkillCombatBonuses(hero) {
        if (!hero || typeof window.getAdvancedSkillBonuses !== 'function') return {};
        const bonuses = window.getAdvancedSkillBonuses(hero);
        return {
            critChance: bonuses.critChance || 0,
            firstStrikeBonus: bonuses.firstStrikeBonus || 0,
            damageBonus: bonuses.damageBonus || 0,
            extraAttackChance: bonuses.extraAttackChance || 0,
            executeBonus: bonuses.executeBonus || 0,
            aoeDamage: bonuses.aoeDamage || 0,
            lowHpBonus: bonuses.lowHpBonus || 0,
            attackBonus: bonuses.attackBonus || 0,
            spellPower: bonuses.spellPower || 0
        };
    }

    // ========== HP И ЛЕЧЕНИЕ ==========
    function calculatePostBattleHealing(originalHero, battleHero) {
        let heal = 0;
        let endurance = originalHero.skills?.endurance || 0;
        heal += endurance * 8;
        heal += originalHero.maxHp * 0.05;
        if (originalHero.pet) {
            if (originalHero.pet === 'bear') heal += originalHero.maxHp * 0.1;
            if (originalHero.pet === 'wolf') heal += originalHero.maxHp * 0.05;
        }
        if (originalHero.inventory && Array.isArray(originalHero.inventory)) {
            originalHero.inventory.forEach(item => {
                if (item && item.bonus && item.bonus.hpRegen) {
                    heal += item.bonus.hpRegen;
                }
            });
        }
        if (originalHero.morale > 70) heal *= 1.2;
        else if (originalHero.morale < 30) heal *= 0.8;
        return Math.floor(Math.max(5, heal));
    }

    function applyBattleOutcome(originalHero, battleHero) {
        if (!originalHero || !battleHero) return;
        if (!originalHero.maxHp || originalHero.maxHp <= 0) {
            let endurance = originalHero.skills?.endurance || 0;
            originalHero.maxHp = 100 + (originalHero.level - 1) * 20 + endurance * 15;
            if (originalHero.hp === undefined || originalHero.hp > originalHero.maxHp) {
                originalHero.hp = originalHero.maxHp;
            }
        }
        let startingHp = battleHero.startingHp !== undefined ? battleHero.startingHp : battleHero.maxHp;
        let damageTaken = startingHp - battleHero.hp;
        if (damageTaken < 0) damageTaken = 0;
        if (damageTaken > 0) {
            originalHero.hp = Math.max(0, (originalHero.hp || originalHero.maxHp) - damageTaken);
            if (originalHero.hp <= 0) {
                let deathRoll = Math.random() < 0.05;
                if (deathRoll) {
                    originalHero.isAlive = false;
                    originalHero.isJoined = false;
                    originalHero.isFavorite = false;
                    if (window.addWorldEvent) window.addWorldEvent("💀 ПЕРМАНЕНТНА СМЪРТ", `${originalHero.name} загина завинаги в битка!`, "💀");
                } else {
                    originalHero.hp = 1;
                    if (window.addWorldEvent) window.addWorldEvent("⚡ ЕДВА ОЦЕЛЯВАНЕ", `${originalHero.name} беше на ръба на смъртта, но оживя!`, "⚡");
                }
            }
        }
        let postHeal = Math.floor(Math.max(5, originalHero.maxHp * 0.05));
        if (postHeal > 0 && originalHero.hp > 0 && originalHero.hp < originalHero.maxHp) {
            originalHero.hp = Math.min(originalHero.maxHp, originalHero.hp + postHeal);
        }
    }

    // ========== АНИМАЦИИ И ВИЗУАЛИЗАЦИЯ ==========
    function showFloatingNumber(targetElement, value, isHeal = false) {
        const rect = targetElement.getBoundingClientRect();
        const div = document.createElement('div');
        div.className = 'damage-number';
        div.innerText = isHeal ? `+${value}` : `-${value}`;
        div.style.color = isHeal ? '#88ff88' : '#ff5555';
        div.style.left = `${rect.left + rect.width/2}px`;
        div.style.top = `${rect.top}px`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 600);
    }

    function animateCard(cardElement) {
        if (!cardElement) return;
        cardElement.classList.add('attack-animation');
        setTimeout(() => cardElement.classList.remove('attack-animation'), 150);
    }

    function screenShake(container) {
        if (!container) return;
        container.style.transform = 'translateX(4px)';
        setTimeout(() => container.style.transform = 'translateX(-3px)', 50);
        setTimeout(() => container.style.transform = 'translateX(2px)', 100);
        setTimeout(() => container.style.transform = 'translateX(0)', 150);
    }

    // ========== ПОДКРЕПЛЕНИЯ ==========
    function getReinforcements(region, playerHeroes) {
        if (!window.worldData || !window.worldData.clans) return [];
        let available = [];
        let playerHeroNames = new Set(playerHeroes.map(h => h.name));
        for (let key in window.worldData.clans) {
            let hero = window.worldData.clans[key];
            if (hero && hero.isAlive !== false && !hero.isFavorite && !playerHeroNames.has(hero.name)) {
                available.push(hero);
            }
        }
        if (available.length === 0) return [];
        let count = Math.min(2, available.length);
        for (let h of available) {
            let relation = window.clanRelations?.[h.clan] || 50;
            h._dangerScore = (h.heroPower || 100) * 0.6 + (100 - relation) * 0.4;
        }
        available.sort((a,b) => b._dangerScore - a._dangerScore);
        let selected = available.slice(0, count);
        return selected.map(hero => ({
            id: hero.id,
            name: hero.name,
            clan: hero.clan,
            power: hero.heroPower || 100,
            hp: hero.maxHp || 100,
            maxHp: hero.maxHp || 100,
            icon: "⚔️",
            isHero: true,
            heroObj: hero,
            startingHp: hero.hp || hero.maxHp || 100
        }));
    }

    // ========== АРМИЯ ЗАГУБИ ==========
    function applyArmyLossFromDamage(hero, damagePercent, addLogFn) {
        if (!hero.clanObj) return;
        let armyLossPercent = damagePercent * 0.5;
        let currentArmy = hero.clanObj.armySize || hero.armySize || 300;
        let newArmy = Math.max(10, Math.floor(currentArmy * (1 - armyLossPercent)));
        hero.clanObj.armySize = newArmy;
        hero.clanObj.currentArmy = newArmy;
        hero.armySize = newArmy;
        if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(hero.clanObj);
        if (addLogFn) addLogFn(`   📉 ${hero.name} загуби ${Math.floor(armyLossPercent * 100)}% от армията си! Остава: ${newArmy} войници.`);
    }

       // Стартира битката за турнирния двубой
    function startTournamentBattle(pending) {
        const match = pending.match;
        const playerHeroObj = (match.heroA.isPlayer ? match.heroA.heroObj : match.heroB.heroObj);
        const opponentHero = (match.heroA.isPlayer ? match.heroB : match.heroA);
        
        // ⭐ Директно използваме оригиналния герой, но добавяме нужните полета
        window._tournamentForcedHero = {
            ...playerHeroObj,   // копираме всички съществуващи полета
            // Гарантираме, че задължителните полета съществуват
            id: playerHeroObj.id,
            name: playerHeroObj.name || playerHeroObj.leaderName,
            className: playerHeroObj.currentClass || "Воевода",
            power: playerHeroObj.heroPower,
            hp: playerHeroObj.hp,
            maxHp: playerHeroObj.maxHp,
            icon: '⚔️',
            clanObj: playerHeroObj,
            troopEffects: window.BattleCore.getTroopSpecialEffects(playerHeroObj),
            armySize: playerHeroObj.armySize || 200,
            _isTournamentForced: true
        };

        // Създаваме противника като "регион" за битката
        const tournamentEnemy = {
            name: opponentHero.name,
            armySize: opponentHero.power,
            defenseLevel: 1,
            isTournamentDuel: true,
            tournamentOpponent: opponentHero
        };

        window._pendingTournamentMatch = {
            pending: pending,
            playerHeroObj: playerHeroObj,
            opponentHero: opponentHero
        };

        window.startBattle(tournamentEnemy);
    }

    // ========== ИЗЧИСЛЕНИЯ НА АТАКИТЕ (С MVP ТРАКИНГ) ==========
    function calculateHeroDamage(hero, target, currentRound, addLogFn, addNarrativeFn, animateHeroFn, animateEnemyFn, updateUIFn) {
        let baseDamage = Math.max(1, Math.floor(hero.power * (0.5 + Math.random() * 0.7)));
        let troopEffects = hero.troopEffects || {};
        let petEffects = getPetEffects(hero.clanObj);
        let skillBonuses = getAdvancedSkillCombatBonuses(hero.clanObj);
        
        let damageMultiplier = 1.0;
        let critChance = 0.15;
        let isFirstStrike = (currentRound === 1);
        let isNight = (window.gameTime && window.gameTime.seasonIndex === 3);
        
        if (troopEffects.firstStrikeBonus && isFirstStrike) {
            damageMultiplier += troopEffects.firstStrikeBonus;
            if (addLogFn) addLogFn(`   ⚡ ${hero.name} използва Пикиране от войски (първи удар)!`);
            if (addNarrativeFn) addNarrativeFn(`${hero.name} атакува пръв с Пикиране (+${Math.floor(troopEffects.firstStrikeBonus*100)}% щети).`);
        }
        if (skillBonuses.firstStrikeBonus && isFirstStrike) {
            damageMultiplier += skillBonuses.firstStrikeBonus;
            if (addLogFn) addLogFn(`   ⚡ ${hero.name} използва Първи удар от умения!`);
            if (addNarrativeFn) addNarrativeFn(`${hero.name} нанася първи удар (умения: +${Math.floor(skillBonuses.firstStrikeBonus*100)}% щети).`);
        }
        if (troopEffects.nightFuryBonus && isNight) {
            damageMultiplier += troopEffects.nightFuryBonus;
            if (addLogFn) addLogFn(`   🌙 ${hero.name} активира Нощна ярост от войски!`);
            if (addNarrativeFn) addNarrativeFn(`🌙 ${hero.name} активира Нощна ярост (+${Math.floor(troopEffects.nightFuryBonus*100)}% щети).`);
        }
        if (petEffects.damageBonus) {
            damageMultiplier += petEffects.damageBonus;
            if (addLogFn) addLogFn(`   🐾 ${hero.name} получава бонус щети от любимеца!`);
            if (addNarrativeFn) addNarrativeFn(`${hero.name} получава бонус щети от любимец (${Math.floor(petEffects.damageBonus*100)}%).`);
        }
        if (skillBonuses.damageBonus) damageMultiplier += skillBonuses.damageBonus;
        if (skillBonuses.attackBonus) baseDamage += skillBonuses.attackBonus;
        if (troopEffects.critChanceBonus) critChance += troopEffects.critChanceBonus;
        if (petEffects.critChanceBonus) critChance += petEffects.critChanceBonus;
        if (skillBonuses.critChance) critChance += skillBonuses.critChance;
        if (petEffects.fireDamage) {
            let fireBonus = petEffects.fireDamage;
            baseDamage += fireBonus;
            if (addLogFn) addLogFn(`   🔥 ${hero.name} добавя ${fireBonus} огнени щети от любимеца!`);
            if (addNarrativeFn) addNarrativeFn(`🔥 ${hero.name} изгаря врага с ${fireBonus} огнени щети (любимец).`);
        }
        if (skillBonuses.lowHpBonus && hero.hp < hero.maxHp * 0.3) {
            let lowBonus = 1 + (hero.maxHp - hero.hp) / hero.maxHp * skillBonuses.lowHpBonus;
            damageMultiplier += lowBonus - 1;
            if (addLogFn) addLogFn(`   😡 ${hero.name} активира Берсерк (ниско здраве)!`);
            if (addNarrativeFn) addNarrativeFn(`😡 ${hero.name} изпада в Берсерк и увеличава щетите!`);
        }
        
        let finalDamage = Math.floor(baseDamage * damageMultiplier);
        let isCrit = Math.random() < critChance;
        if (isCrit) {
            let critMultiplier = 1.8;
            if (skillBonuses.critDamage) critMultiplier += skillBonuses.critDamage;
            finalDamage = Math.floor(finalDamage * critMultiplier);
        }
        
        let totalLifeSteal = troopEffects.lifeSteal + petEffects.lifeSteal;
        let healAmount = 0;
        if (totalLifeSteal > 0) {
            healAmount = Math.floor(finalDamage * totalLifeSteal);
            if (healAmount > 0) {
                hero.hp = Math.min(hero.maxHp, hero.hp + healAmount);
                if (addLogFn) addLogFn(`   💚 ${hero.name} възстановява ${healAmount} живот (Кръвопиец/Любимец)!`);
                if (animateHeroFn) animateHeroFn(hero.id, healAmount, true);
                if (addNarrativeFn) addNarrativeFn(`💚 ${hero.name} възстановява ${healAmount} живот.`);
            }
        }
        
        target.hp = Math.max(0, target.hp - finalDamage);
        if (updateUIFn) updateUIFn();
        if (addLogFn) addLogFn(`   ⚔️ ${hero.name} нанася ${finalDamage} щети на ${target.name}${isCrit ? ' 💥 КРИТИЧЕН!' : ''}`);
        if (animateHeroFn) animateHeroFn(hero.id);
        if (animateEnemyFn) animateEnemyFn(target.id || (target.isMonster ? "monster" : null), finalDamage);
        if (addNarrativeFn) addNarrativeFn(`⚔️ ${hero.name} нанася ${finalDamage} щети${isCrit ? " (критичен удар!)" : ""} на ${target.name}.`);
        
        // MVP тракинг
        if (!_damageDealt[hero.id]) _damageDealt[hero.id] = 0;
        _damageDealt[hero.id] += finalDamage;
        
        return finalDamage;
    }

    function calculateEnemyDamage(enemy, target, addLogFn, addNarrativeFn, animateEnemyFn, animateHeroFn, updateUIFn, shakeFn) {
        let damage = Math.floor(enemy.power * (0.35 + Math.random() * 0.55));
        damage = Math.max(1, damage);
        
        let troopEffects = target.troopEffects || {};
        let petEffects = getPetEffects(target.clanObj);
        let skillBonuses = getAdvancedSkillCombatBonuses(target.clanObj);
        let damageReduction = 0;
        if (troopEffects.damageReduction) damageReduction += troopEffects.damageReduction;
        if (petEffects.damageReduction) damageReduction += petEffects.damageReduction;
        if (skillBonuses.damageReduction) damageReduction += skillBonuses.damageReduction;
        if (damageReduction > 0) {
            let reduced = Math.floor(damage * (1 - Math.min(0.9, damageReduction)));
            if (addLogFn) addLogFn(`   🛡️ ${target.name} намалява щетите с ${Math.floor(damageReduction*100)}%!`);
            damage = reduced;
            if (addNarrativeFn) addNarrativeFn(`${target.name} намалява щетите с ${Math.floor(damageReduction*100)}%.`);
        }
        
        let damagePercent = damage / target.maxHp;
        target.hp = Math.max(0, target.hp - damage);
        if (updateUIFn) updateUIFn();
        applyArmyLossFromDamage(target, damagePercent, addLogFn);
        
        if (addLogFn) {
            addLogFn(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            addLogFn(`👹 ${enemy.name} атакува ${target.name.toUpperCase()}!`);
            addLogFn(`   💔 Нанася ${damage} щети (${Math.floor(damagePercent * 100)}% от живота)`);
        }
        if (shakeFn) shakeFn(document.querySelector('.battle-container'));
        if (animateEnemyFn) animateEnemyFn(enemy.id || (enemy.isMonster ? "monster" : null));
        if (animateHeroFn) animateHeroFn(target.id, damage);
        if (addNarrativeFn) addNarrativeFn(`👹 ${enemy.name} нанася ${damage} щети на ${target.name} (${Math.floor(damagePercent*100)}% от здравето му).`);
        
        return damage;
    }

    // ========== ПУБЛИЧНО API ==========
    window.BattleCore = {
        addNarrative: addNarrative,
        resetNarrative: resetNarrative,
        getNarrative: getNarrative,
        generateBattleStory: generateBattleStory,
        getTroopSpecialEffects: getTroopSpecialEffects,
        getPetEffects: getPetEffects,
        getAdvancedSkillCombatBonuses: getAdvancedSkillCombatBonuses,
        calculatePostBattleHealing: calculatePostBattleHealing,
        applyBattleOutcome: applyBattleOutcome,
        showFloatingNumber: showFloatingNumber,
        animateCard: animateCard,
        screenShake: screenShake,
        getReinforcements: getReinforcements,
        applyArmyLossFromDamage: applyArmyLossFromDamage,
        collectPlayerHeroes: collectPlayerHeroes,
        calculateHeroDamage: calculateHeroDamage,
        calculateEnemyDamage: calculateEnemyDamage
    };
    
    console.log("✅ battle-core.js зареден – ФИНАЛНА ВЕРСИЯ 3.2 (без дублиране на разказите)");
})();
