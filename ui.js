/**
 * ==========================================================================
 * ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
 * ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ И ИНСПЕКЦИЯ НА ВЛАДЕТЕЛИТЕ)
 * ОПИСАНИЕ: Управление на UI. Времето е преместено отляво. Текстът на експедициите се скрива на телефон.
 * СТАТУС: ОБНОВЕН (Обединен универсален профил: Статистики, Способности и Инвентар заедно)
 * Статистика на файловете в проекта: 15
 * ==========================================================================
 */

window.eventHistory = [];  

if (!window.autoLevelState) {
    window.autoLevelState = {};
}

/**
 * Глобална функция за превключване на Цял Екран (Full Screen)
 */
window.toggleGameFullScreen = function() {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) { docEl.requestFullscreen(); } 
        else if (docEl.mozRequestFullScreen) { docEl.mozRequestFullScreen(); } 
        else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); } 
        else if (docEl.msRequestFullscreen) { docEl.msRequestFullscreen(); }
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); } 
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); } 
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } 
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
    }
};

/**
 * Глобална функция за превключване на AUTO режима
 */
window.toggleAutoLevel = function(leaderName) {
    window.autoLevelState[leaderName] = !window.autoLevelState[leaderName];
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

/**
 * ГЕНЕРАТОР НА RPG СТАТИСТИКИ: Изчислява виртуално ниво и XP прогрес на база реалния heroPower
 */
function getCalculatedLeaderStats(leader) {
    if (!leader) return { level: 1, xpPercent: 0 };

    let power = leader.heroPower || 100;
    let calculatedLevel = Math.max(1, Math.floor((power - 100) / 25) + 1);
    
    let pointsInCurrentLevel = (power - 100) % 25;
    if (power < 100) pointsInCurrentLevel = 0;

    let percent = Math.min(100, Math.floor((pointsInCurrentLevel / 25) * 100));
    leader.level = calculatedLevel;

    return {
        level: calculatedLevel,
        xpPercent: percent
    };
}

/**
 * AUTO-LEVEL ИЗПЪЛНИТЕЛ: Автоматично разпределяне на бонуси при качено ниво
 */
function checkAndExecuteAutoLevel(leader, currentLevel) {
    if (!leader || !window.autoLevelState[leader.name]) return;

    if (!leader.lastProcessedLevel) {
        leader.lastProcessedLevel = currentLevel;
        return;
    }

    if (currentLevel > leader.lastProcessedLevel) {
        let levelsGained = currentLevel - leader.lastProcessedLevel;
        let currentClass = leader.currentClass || "Пълководец";

        if (currentClass === "Велик Кан") {
            leader.gold = (leader.gold || 0) + (levelsGained * 300);
        } else {
            leader.armySize = (leader.armySize || 0) + (levelsGained * 75);
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Кан ${leader.name} качи ниво и автоматично разпредели бонуси за род ${leader.dynasty}!`);
        }

        leader.lastProcessedLevel = currentLevel;
    }
}

/**
 * РЕНДЕРИРАНЕ НА ТОП 6 ЛЕНТАТА
 */
window.renderTop6LeadersUI = function() {
    let mainContainer = document.getElementById('game-container');
    let targetContainer = mainContainer ? mainContainer.parentNode : document.body;
    if (!targetContainer) return;

    let styleSheet = document.getElementById('top-6-responsive-style');
    if (!styleSheet) {
        styleSheet = document.createElement("style");
        styleSheet.id = 'top-6-responsive-style';
        styleSheet.innerText = `
            #top-6-leaders-bar::-webkit-scrollbar { display: none; }
            #top-6-leaders-bar { -ms-overflow-style: none; scrollbar-width: none; }
            .leader-rpg-card { flex: 1; min-width: 95px; }
            @media (max-width: 768px) {
                #top-6-leaders-bar { justify-content: flex-start !important; padding: 6px 4px !important; gap: 8px !important; margin: 4px auto !important; }
                .leader-rpg-card { flex: 0 0 calc(25% - 6px) !important; min-width: 72px !important; }
                .leader-avatar-box { width: 44px !important; height: 44px !important; font-size: 18px !important; }
                .leader-name-text { font-size: 0.60em !important; max-width: 70px !important; }
                .leader-class-text { font-size: 0.48em !important; max-width: 70px !important; }
                .leader-xp-bar-container { width: 55px !important; }
                .expedition-btn-text { display: none !important; }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    let leadersBar = document.getElementById('top-6-leaders-bar');
    if (!leadersBar) {
        leadersBar = document.createElement('div');
        leadersBar.id = 'top-6-leaders-bar';
        leadersBar.style.cssText = `
            margin: 6px auto; padding: 8px 10px; background: rgba(20, 20, 20, 0.65);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid #d4af37; border-radius: 8px; width: 96%; max-width: 900px;
            display: flex; justify-content: center; align-items: flex-start; gap: 14px;
            overflow-x: auto; scroll-snap-type: x mandatory; box-shadow: 0 0 15px rgba(212,175,55,0.2);
            font-family: 'Montserrat', sans-serif; box-sizing: border-box; z-index: 999; -webkit-overflow-scrolling: touch;
        `;
        
        if (mainContainer) {
            targetContainer.insertBefore(leadersBar, mainContainer);
        } else {
            targetContainer.insertBefore(leadersBar, targetContainer.firstChild);
        }
    }

    let allLeaders = [];
    
    if (window.currentHero) {
        let rpgStats = getCalculatedLeaderStats(window.currentHero);
        allLeaders.push({ 
            name: window.currentHero.name,
            dynasty: window.currentHero.dynasty,
            heroPower: window.currentHero.heroPower,
            gold: window.currentHero.gold,
            armySize: window.currentHero.armySize,
            age: window.currentHero.age,
            isMain: true, 
            level: rpgStats.level, 
            xpPercent: rpgStats.xpPercent, 
            currentClass: window.currentHero.currentClass || "Велик Кан" 
        });
    }
    
   if (window.worldData && window.worldData.clans) {
        Object.entries(window.worldData.clans).forEach(([clanName, ml]) => {
            // Вземаме името на водача от свойството .leader
            let actualName = ml.leader || clanName;
            if (window.currentHero && actualName === window.currentHero.name) return;
            
            if (ml.purchased || ml.owned || ml.isUnlocked || (ml.level !== undefined) || (ml.xp !== undefined) || ml.inventory) {
                // Използваме реалното ниво и XP, записани от битките, или падаме обратно на формулата
                let currentLvl = ml.level || 1;
                let xpReq = (window.rpgDatabase && window.rpgDatabase.getXPRequiredForLevel) ? window.rpgDatabase.getXPRequiredForLevel(currentLvl) : currentLvl * 150;
                let xpPct = ml.xpPercent !== undefined ? ml.xpPercent : (ml.xp ? Math.min(100, Math.floor((ml.xp / xpReq) * 100)) : 0);
                
                allLeaders.push({ 
                    name: actualName,
                    dynasty: clanName, // Ключът на масива е името на династията
                    heroPower: ml.heroPower || 100,
                    gold: ml.gold || 0,
                    armySize: ml.armySize || 0,
                    age: ml.age || 30,
                    isMain: false, 
                    level: currentLvl, 
                    xpPercent: xpPct, 
                    currentClass: ml.currentClass || "Пълководец" 
                });
            }
        });
    }

    if (allLeaders.length === 0) {
        leadersBar.style.display = 'none';
        return;
    }
    leadersBar.style.display = 'flex';

    allLeaders.sort((a, b) => b.level - a.level || b.xpPercent - a.xpPercent);
    const top6 = allLeaders.slice(0, 6);

    leadersBar.innerHTML = top6.map((leader) => {
        let icon = leader.isMain ? "🛡️" : "⚔️";
        let originalLeaderObj = leader.isMain ? window.currentHero : (window.worldData && window.worldData.clans ? Object.values(window.worldData.clans).find(l => l.name === leader.name) : null);
        
        if (originalLeaderObj) {
            checkAndExecuteAutoLevel(originalLeaderObj, leader.level);
        }

        let isAutoOn = window.autoLevelState[leader.name] || false;
        let autoBtnBg = isAutoOn ? "#00ffcc" : "rgba(212,175,55,0.12)";
        let autoBtnColor = isAutoOn ? "#000" : "#ffd700";
        let autoBtnBorder = isAutoOn ? "1px solid #00ffcc" : "1px solid rgba(212,175,55,0.4)";

        let safeName = encodeURIComponent(leader.name);

        return `
            <div class="leader-rpg-card" onclick="window.selectAndOpenLeaderInventory(decodeURIComponent('${safeName}'))" style="text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; scroll-snap-align: start;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <div class="leader-name-text" style="font-size: 0.72em; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 92px; line-height: 1.2;">${leader.name}</div>
                <div class="leader-class-text" style="font-size: 0.58em; color: #aaa; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 92px;">${leader.currentClass}</div>
                
                <div style="position: relative; display: flex; flex-direction: column; align-items: center; margin-bottom: 3px;">
                    <div style="font-size: 12px; opacity: 0.7; line-height: 1; margin-bottom: -3px; z-index: 2;">👑</div>
                    <div class="leader-avatar-box" style="width: 54px; height: 54px; background: rgba(0,0,0,0.5); border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 22px; box-sizing: border-box; border: 1px solid #d4af37;">${icon}</div>
                </div>

                <div style="font-size: 0.68em; font-weight: bold; color: #00ffcc; line-height: 1.1; margin-bottom: 3px;">Н. ${leader.level}</div>
                
                <button onclick="event.stopPropagation(); if(window.toggleAutoLevel){ window.toggleAutoLevel(decodeURIComponent('${safeName}')); window.renderTop6LeadersUI(); }" style="font-size: 8px; font-weight: bold; padding: 1px 5px; background: ${autoBtnBg}; color: ${autoBtnColor}; border: ${autoBtnBorder}; border-radius: 3px; cursor: pointer; margin-bottom: 5px; transition: all 0.15s;">
                    AUTO
                </button>

                <div class="leader-xp-bar-container" style="width: 66px; height: 4px; background: #333; border-radius: 2px; overflow: hidden; border: 1px solid rgba(212,175,55,0.2); box-sizing: border-box;">
                    <div style="width: ${leader.xpPercent}%; height: 100%; background: linear-gradient(90deg, #00ccff, #00ffcc);"></div>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * ЦЕНТРАЛНА ФУНКЦИЯ: Сега директно извиква Универсалния пълен профил за всеки един владетел!
 */
window.selectAndOpenLeaderInventory = function(leaderName) {
    if (window.worldData && window.worldData.clans) {
        let targetLeader = Object.values(window.worldData.clans).find(l => l.name === leaderName);
        
        if (!targetLeader && window.currentHero && window.currentHero.name === leaderName) {
            targetLeader = window.currentHero;
        }

        if (targetLeader && typeof window.openLeaderProfile === 'function') {
            window.openLeaderProfile(targetLeader);
        }
    }
};

/**
 * ИНСПЕКТИРАНЕ ПО ИМЕ
 */
window.inspectSpecificRulerByName = function(name) {
    if (window.selectAndOpenLeaderInventory) {
        window.selectAndOpenLeaderInventory(name);
    }
};

/**
 * ОБНОВЯВАНЕ НА ЛЕВИЯ СТРАНИЧЕН ПАНЕЛ (СЪВЕТ НА РОДОВЕТЕ)
 */
window.updateCharacterUI = function(hero) {
    if (!hero) return;

    let stats = getCalculatedLeaderStats(hero);
    const leftSidebar = document.getElementById('provinces-list');

    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div onclick="window.selectAndOpenLeaderInventory('${hero.name}')" style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.08); border: 1px solid #d4af37; border-radius: 6px; margin-bottom: 15px; cursor: pointer;" onmouseover="this.style.background='rgba(212,175,55,0.15)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.08)'">
                <h3 style="margin: 0 0 5px 0; color: #d4af37; font-family: 'Cinzel'; font-size: 11px; letter-spacing: 1px;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.15em; font-weight: bold; color: #fff; font-family: 'Cinzel', serif;">Кан ${hero.name}</div>
                <div style="font-size: 0.8em; color: #bbb; margin-top: 2px;">Род: ${hero.dynasty} | ${hero.age} г.</div>
                <div style="font-size: 0.85em; color: #00ffcc; font-weight: bold; margin-top: 4px;">Ниво ${stats.level}</div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center; font-family: 'Cinzel'; font-size: 11px; margin-top: 0;">
                    <span>СЪВЕТ НА РОДОВЕТЕ</span>
                    <span onclick="window.toggleGameFullScreen()" title="Цял Екран" style="cursor: pointer; font-size: 12px; padding: 1px 5px; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; border-radius: 4px;">📺</span>
                </h4>
                <div style="font-size: 0.85em; max-height: 130px; overflow-y: auto; background: rgba(0,0,0,0.25); padding: 6px; border-radius: 4px;">
                    ${Object.keys(window.activeDynasties || {}).map(clanName => {
                        const clan = window.activeDynasties ? window.activeDynasties[clanName] : null;
                        const isPlayer = clanName === hero.dynasty;
                        
                        let clanLeaderObj = null;
                        if (isPlayer) {
                            clanLeaderObj = window.currentHero;
                        } else if (window.worldData && window.worldData.clans) {
                            clanLeaderObj = Object.values(window.worldData.clans).find(l => l.dynasty === clanName);
                        }
                        
                        if (!clanLeaderObj) {
                            clanLeaderObj = { name: "Водач", dynasty: clanName, level: 1, heroPower: 100, skills: {} };
                        }

                        return `
                            <div onclick="window.selectAndOpenLeaderInventory('${clanLeaderObj.name}')" style="display: flex; justify-content: space-between; margin-bottom: 5px; color: ${isPlayer ? '#d4af37' : '#eee'}; cursor: pointer; padding: 2px 4px; border-radius: 3px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                <span>${isPlayer ? '👑 ' : ''}${clanName} (${clanLeaderObj.name})</span>
                                <span style="font-size: 0.85em; opacity: 0.8;">${window.activeDynasties[clanName] ? window.activeDynasties[clanName].regions || 0 : 0} зем.</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <button id="btn-expeditions" onclick="window.openExpeditionsMenu()" style="width: 100%; padding: 8px; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; border-radius: 6px; color: #fff; font-family: 'Cinzel', serif; font-size: 11px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; position: relative; transition: background 0.2s;" onmouseover="this.style.background='rgba(212, 175, 55, 0.3)'" onmouseout="this.style.background='rgba(212, 175, 55, 0.15)'">
                    <span>🧭 ЕКСПЕДИЦИИ</span>
                    <div id="expedition-badge" class="mission-badge" style="position: absolute; right: 10px; background: #ff3333; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; justify-content: center; align-items: center; font-weight: bold;">0</div>
                </button>
            </div>
        
            <div id="history-log-container" style="border-top: 1px solid #333; padding-top: 10px;">
                <h4 style="color: #d4af37; font-size: 10px; margin-bottom: 8px; letter-spacing: 0.5px; font-family: 'Cinzel';">ЛЕТОПИС</h4>
                <div id="history-log" style="font-size: 10px; color: #aaa; max-height: 180px; overflow-y: auto; line-height: 1.4;"></div>
            </div>
        `;
    }

    const goldEl = document.getElementById('stat-gold');
    const armyEl = document.getElementById('stat-army');
    const powerEl = document.getElementById('stat-power');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    window.renderHistory();
    window.renderTop6LeadersUI();

    if (window.updateTimeUI) window.updateTimeUI();
};

window.showAdvisorMsg = function(msg) {
    const year = window.gameTime ? window.gameTime.year : 681;
    const era = window.gameTime ? window.gameTime.era : "г.";
    window.eventHistory.unshift({ text: msg, time: `${year} ${era}` });
    if (window.eventHistory.length > 5) window.eventHistory.pop();
    window.renderHistory();
};

window.renderHistory = function() {
    const logEl = document.getElementById('history-log');
    if (logEl) {
        logEl.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 6px; border-bottom: 1px solid #222; padding-bottom: 4px;">
                <span style="color: #d4af37;">[${event.time}]:</span> ${event.text}
            </div>
        `).join('');
    }
};

/**
 * ФУНКЦИЯ ЗА ОБНОВЯВАНЕ НА ИНДИКАТОРА НА ЕКСПЕДИЦИИТЕ
 */
window.updateExpeditionBadge = function() {
    const badge = document.getElementById('expedition-badge');
    if (!badge) return;
    
    let availableMissions = 0;
    if (window.expeditionDatabase && window.expeditionDatabase.missions) {
        availableMissions = window.expeditionDatabase.missions.filter(mission => {
            const currentLevel = window.currentHero ? (window.currentHero.level || 1) : 1;
            const meetsLevel = currentLevel >= (mission.reqLevel || 0);
            const isNotRunning = !window.activeExpeditions || !window.activeExpeditions.some(e => e.missionId === mission.id);
            return meetsLevel && isNotRunning;
        }).length;
    } else {
        availableMissions = Math.max(0, 3 - (window.activeExpeditions ? window.activeExpeditions.length : 0));
    }
    
    badge.innerText = availableMissions;
    badge.style.display = availableMissions === 0 ? 'none' : 'flex';
};

/**
 * НАДГРАЖДАНЕ: УНИВЕРСАЛЕН ОБЕДИНЕН ПРОФИЛ (СТАТИСТИКИ + СПОСОБНОСТИ + ИНВЕНТАР НАЕДНО)
 */
window.openLeaderProfile = function(leader) {
    if (!leader) return;

    let stats = leader;
    if (typeof window.getCalculatedLeaderStats === 'function') {
        stats = window.getCalculatedLeaderStats(leader);
    }

    const currentClass = leader.characterClass || stats.characterClass || leader.currentClass || "Воевода";
    const level = leader.level || stats.level || 1;
    const power = leader.heroPower || stats.heroPower || 100;

    // --- СЕКЦИЯ 1: СПОСОБНОСТИ ---
    let skillsHTML = '<div style="margin-top: 10px; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 6px; border: 1px solid #333;">';
    skillsHTML += '<h4 style="margin: 0 0 6px 0; color: #d4af37; font-family: \'Cinzel\'; font-size: 11px; border-bottom: 1px solid #444; padding-bottom: 2px;">ПРИДОБИТИ СПОСОБНОСТИ</h4>';
    
    if (leader.skills && Object.keys(leader.skills).length > 0) {
        const skillNames = {
            endurance: { name: "Издръжливост", icon: "❤️" },
            tactics: { name: "Тактика", icon: "⚔️" },
            diplomacy: { name: "Дипломация", icon: "🤝" },
            mysticism: { name: "Мистицизъм", icon: "🔮" },
            vampirism: { name: "Вампиризъм", icon: "🦇" },
            scouting: { name: "Разузнаване", icon: "🦅" }
        };

        let hasSkills = false;
        Object.keys(leader.skills).forEach(key => {
            if (skillNames[key] && leader.skills[key] > 0) {
                hasSkills = true;
                skillsHTML += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #ccc;">
                        <span>${skillNames[key].icon} ${skillNames[key].name}:</span>
                        <span style="color: #00ffcc; font-weight: bold;">lvl ${leader.skills[key]}</span>
                    </div>
                `;
            }
        });
        if (!hasSkills) skillsHTML += '<div style="color: #666; font-size: 11px; text-align: center;">Все още няма развити способности.</div>';
    } else {
        skillsHTML += '<div style="color: #666; font-size: 11px; text-align: center;">Все още няма развити способности.</div>';
    }
    skillsHTML += '</div>';

    // --- СЕКЦИЯ 2: ИНВЕНТАР / СЪКРОВИЩНИЦА НА ВЛАДЕТЕЛЯ ---
    let inventoryHTML = '<div style="margin-top: 10px; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 6px; border: 1px solid #333;">';
    inventoryHTML += '<h4 style="margin: 0 0 6px 0; color: #d4af37; font-family: \'Cinzel\'; font-size: 11px; border-bottom: 1px solid #444; padding-bottom: 2px;">ЛИЧЕН ИНВЕНТАР</h4>';
    
    // Взимаме предметите от обекта (поддържаме и двата варианта за именуване)
    let items = leader.inventory || leader.items || [];
    
    if (items && items.length > 0) {
        inventoryHTML += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; max-height: 120px; overflow-y: auto; padding: 2px;">';
        items.forEach((item, index) => {
            let itemIcon = item.icon || "📦";
            let itemBorder = item.rarity === "epic" ? "border: 1px solid #ff00ff;" : (item.rarity === "rare" ? "border: 1px solid #00ccff;" : "border: 1px solid #666;");
            let itemBg = "background: rgba(30,30,30,0.8);";
            
            inventoryHTML += `
                <div title="${item.name || 'Предмет'}" style="width: 48px; height: 48px; ${itemBg} ${itemBorder} border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 20px; position: relative; box-sizing: border-box;">
                    ${itemIcon}
                </div>
            `;
        });
        inventoryHTML += '</div>';
    } else {
        // Празни слотове за визуализация на раницата
        inventoryHTML += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; justify-items: center;">';
        for (let i = 0; i < 4; i++) {
            inventoryHTML += '<div style="width: 46px; height: 46px; background: rgba(0,0,0,0.4); border: 1px dashed #444; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 10px; color: #555;">Празно</div>';
        }
        inventoryHTML += '</div>';
    }
    inventoryHTML += '</div>';

    // Премахваме стария застъпен прозорец, ако е отворен
    const oldModal = document.getElementById('dynamic-leader-profile');
    if (oldModal) oldModal.remove();

    // Създаване на новия пълен прозорец
    const profileModal = document.createElement('div');
    profileModal.id = 'dynamic-leader-profile';
    profileModal.style = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); display: flex; justify-content: center; align-items: center; z-index: 99999; font-family: sans-serif;';
    
    profileModal.innerHTML = `
        <div style="background: #1a1a1a; border: 2px solid #d4af37; border-radius: 10px; width: 320px; padding: 18px; box-shadow: 0 0 20px rgba(212,175,55,0.3); position: relative; color: #fff; box-sizing: border-box;">
            <button onclick="document.getElementById('dynamic-leader-profile').remove()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; color: #ff3333; font-size: 18px; cursor: pointer; font-weight: bold;">✕</button>
            
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 10px; color: #d4af37; letter-spacing: 2px; font-family: 'Cinzel'; margin-bottom: 4px;">ПРОФИЛ НА ВЛАДЕТЕЛ</div>
                <h2 style="margin: 0; color: #fff; font-family: 'Cinzel', serif; font-size: 1.5em;">Кан ${leader.name}</h2>
                <div style="font-size: 0.85em; color: #aaa; margin-top: 2px;">Род: ${leader.dynasty} ${leader.age ? `| ${leader.age} г.` : ''}</div>
            </div>

            <div style="display: flex; justify-content: space-around; background: rgba(212,175,55,0.05); padding: 8px; border-radius: 6px; border: 1px dashed rgba(212,175,55,0.3); text-align: center;">
                <div>
                    <div style="font-size: 10px; color: #888;">НИВО</div>
                    <div style="font-size: 15px; color: #00ffcc; font-weight: bold;">${level}</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #888;">КЛАС</div>
                    <div style="font-size: 12px; color: #ffaa00; font-weight: bold; text-transform: uppercase; margin-top: 2px;">${currentClass}</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #888;">МОЩ</div>
                    <div style="font-size: 15px; color: #ff3366; font-weight: bold;">⚔️ ${power}</div>
                </div>
            </div>

            ${skillsHTML}
            ${inventoryHTML}

            <button onclick="document.getElementById('dynamic-leader-profile').remove()" style="width: 100%; margin-top: 15px; padding: 10px; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; border-radius: 6px; color: #fff; font-family: 'Cinzel', serif; cursor: pointer; font-size: 11px; transition: background 0.2s;" onmouseover="this.style.background='rgba(212,175,55,0.3)'" onmouseout="this.style.background='rgba(212,175,55,0.15)'">Затвори профила</button>
        </div>
    `;

    document.body.appendChild(profileModal);
};

const UI = {
    init() {
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (window.currentHero && window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        this.cleanExpeditionButtonText();
    },
    cleanExpeditionButtonText() {}
};

window.UI = UI;

document.addEventListener('DOMContentLoaded', () => {
    window.UI.init();
    if (typeof window.updateExpeditionBadge === 'function') {
        window.updateExpeditionBadge();
    }
});
