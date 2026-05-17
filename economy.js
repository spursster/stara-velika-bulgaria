/**
 * МОДУЛ: ИКОНОМИКА И РОДОВИ РЕСУРСИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Интеграция на 100+ Diablo Способности & ArcheAge Класове)
 * КОРЕКЦИЯ БЪГ: Добавено раздаване на пасивен опит и качване на нива на отключените герои при икономически ход.
 * Статистика на файловете в проекта: 16
 */

window.calculateEconomy = function() {
    if (!window.currentHero) return;

    const hero = window.currentHero;
    
    // Подсигуряваме, че RPG структурата на способностите съществува
    if (window.initializeHeroRPGData) {
        window.initializeHeroRPGData(hero);
    }

    let skills = hero.skills || {};

    // 1. БАЗОВ ПРИХОД И ДИАБЛО МОДИФИКАТОРИ НА СТОЛИЦАТА
    let baseIncome = 200; // Базов приход на родовата столица
    
    // Diablo пасиви: Златна треска (goldRush) и Родови пазари (bazaars)
    if ((skills.goldRush || 0) > 0) {
        baseIncome += (skills.goldRush * 25); // +25 злато за всяко ниво от златни мини
    }
    if ((skills.bazaars || 0) > 0) {
        baseIncome += (skills.bazaars * 15); // +15 злато от търговски пазари
    }

    // Добавяне на родови бонуси от притежавани територии
    let regionBonus = 0;
    if (window.playerRegions && window.playerRegions.length > 0) {
        regionBonus = window.playerRegions.length * 40; // +40 злато за всеки завоюван регион
    }

    let totalIncome = baseIncome + regionBonus;

    // 2. ПОДДРЪЖКА НА ВОЙСКАТА И ЛОГИСТИКА
    let armyCount = hero.currentArmy || 0;
    let baseMaintenanceRate = 0.5; // 0.5 злато на боец

    // ArcheAge пасиви: Тактическо снабдяване намалява поддръжката
    if ((skills.supplyLines || 0) > 0) {
        baseMaintenanceRate -= (skills.supplyLines * 0.05); // -5% разходи на точка
        baseMaintenanceRate = Math.max(0.1, baseMaintenanceRate);
    }

    let armyMaintenance = Math.floor(armyCount * baseMaintenanceRate);

    // Зимна логистична криза (Ако е зима, разходите за храна скачат)
    let isWinter = false;
    if (window.gameTime && typeof window.gameTime.getSeasonName === 'function') {
        if (window.gameTime.getSeasonName() === "Зима") isWinter = true;
    }
    if (isWinter) {
        armyMaintenance = Math.floor(armyMaintenance * 1.3); // +30% зимна поддръжка
    }

    // 3. ЧИСТ ПРОФИТ И БАЛАНС НА ХАЗНАТА
    let finalProfit = totalIncome - armyMaintenance;
    hero.gold = (hero.gold || 0) + finalProfit;

    // Предотвратяване на фалит (златото не може да бъде отрицателно)
    if (hero.gold < 0) {
        let debt = Math.abs(hero.gold);
        hero.gold = 0;
        // При фалит част от армията дезертира поради липса на заплати
        if (hero.currentArmy > 10) {
            let deserters = Math.floor(hero.currentArmy * 0.15); // 15% дезертьори
            hero.currentArmy -= deserters;
            hero.armySize = hero.currentArmy;
            if (window.showAdvisorMsg) {
                window.showAdvisorMsg(`⚠️ ДЕЗЕРТИРСТВО: Поради празна хазна и дълг от -${debt}💰, ${deserters} воини напуснаха лагера!`);
            }
        }
    }

    // 4. БАНКОВИ ЛИХВИ И СЪКРОВИЩНИЦА
    // Diablo пасив: Лихварство (usury) дава 2% пасивна лихва върху спестеното злато (макс 500)
    if ((skills.usury || 0) > 0 && hero.gold > 500) {
        let interestGained = Math.floor(hero.gold * (skills.usury * 0.02));
        interestGained = Math.min(500, interestGained); // лимит до 500 злато
        hero.gold += interestGained;
    }

    // 5. ГЛОБАЛНА СИНХРОНИЗАЦИЯ С КЛАНОВЕТЕ (worldData)
    // Записваме обновените финансови данни обратно в глобалния списък на родовете
    if (window.worldData && window.worldData.clans && hero.id) {
        if (window.worldData.clans[hero.id]) {
            window.worldData.clans[hero.id].gold = hero.gold;
            window.worldData.clans[hero.id].currentArmy = hero.currentArmy;
            window.worldData.clans[hero.id].armySize = hero.armySize;
        }
    }

    // =========================================================================
    // 🎯 АВТОМАТИЧЕН RPG ПРОГРЕС НА ВСИЧКИ КУПЕНИ ЛИДЕРИ ПРИ ИКОНОМИЧЕСКИ ХОД
    // =========================================================================
    if (window.worldData && window.worldData.clans) {
        const clans = window.worldData.clans;

        Object.keys(clans).forEach(key => {
            let leader = clans[key];

            // Проверяваме структурата на лидера според префикса и наличието на опит (r_tervel и др.)
            if (leader && leader.id && (key.startsWith('r_') || leader.xp !== undefined)) {
                // Героят трупа опит, ако е от нашия род, ако е отключен или е служебният активен Тервел
                if (leader.dynasty === hero.dynasty || leader.isUnlocked || key === 'r_tervel') {
                    
                    let xpGained = Math.floor(Math.random() * 25) + 15; // 15-40 пасивен опит от управление
                    leader.xp = (leader.xp || 0) + xpGained;
                    
                    let currentLevel = leader.level || 1;
                    let requiredXP = currentLevel * 150; // Формула: ниво * 150 XP

                    // Логика за вдигане на ниво (Level Up)
                    if (leader.xp >= requiredXP) {
                        leader.xp -= requiredXP;
                        leader.level = currentLevel + 1;
                        leader.skillPoints = (leader.skillPoints || 0) + 1;

                        // Автоматично разпределяне на магии и точки от rpg_system.js
                        if (window.autoAssignLeaderSkills) {
                            window.autoAssignLeaderSkills(leader);
                        }

                        if (window.showAdvisorMsg) {
                            window.showAdvisorMsg(`👑 ВЕЛИК ПРОГРЕС: Родовият лидер ${leader.name} достигна Ниво ${leader.level}! Спечелена е точка за способности.`);
                        }
                    }
                }
            }
        });
    }

    // 6. ЛЕТОПИС (Съобщение от Съветника за финансовото състояние)
    if (window.showAdvisorMsg) {
        let seasonName = "Текущ сезон";
        if (window.gameTime && window.gameTime.getSeasonName) {
            seasonName = window.gameTime.getSeasonName();
        } else if (window.gameTime) {
            const seasons = [\"Пролет\", \"Лято\", \"Есен\", \"Зима\"];
            seasonName = seasons[window.gameTime.seasonIndex] || "Сезон";
        }
        
        let classTitle = hero.currentClass && hero.currentClass !== "Няма клас" ? ` (${hero.currentClass})` : "";
        
        if (finalProfit >= 0) {
            window.showAdvisorMsg(`💰 Счетоводство [${seasonName}]: Владетелят ${hero.name}${classTitle} събра +${totalIncome} злато от родови земи. След поддръжка на армията (-${armyMaintenance}), чистият профит е +${finalProfit} злато.`);
        } else {
            window.showAdvisorMsg(`📉 Икономическа криза [${seasonName}]: Разходите за войската (-${armyMaintenance}) надхвърлиха приходите! Чистият дефицит е ${finalProfit} злато.`);
        }
    }

    // Моментално опресняване на интерфейсите на екрана (Топ 6 картите)
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
