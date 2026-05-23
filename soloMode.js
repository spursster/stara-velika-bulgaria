// ==================== СОЛО РЕЖИМ – ВЕРСИЯ 2.1 (ФИНАЛНА) ====================
// Всички корекции: пътуване, инспекция, куестове, спътници, карта, индикатор, женски спътници

(function() {
    // ==================== ГЛОБАЛНИ НАСТРОЙКИ ====================
    window.soloSettings = window.soloSettings || {
        showNeighborsOnMap: true,      // Показва съседни региони със зелен кант
        questChance: 0.3,              // 30% шанс за нов куест при пътуване
        enableAnimations: true,        // Анимации при пътуване
        enableSounds: false,           // Звукови ефекти (само конзолен лог засега)
        showRegionIndicator: true      // Показва банер с текущия регион
    };

    let isTraveling = false;            // За предотвратяване на multiple пътувания
    if (!window.visitedRegions) window.visitedRegions = new Set();   // Брой посетени региони
     // ==================== ОСНОВНА ИНИЦИАЛИЗАЦИЯ ====================
    function initSoloMode() {
        if (window.gameMode !== 'solo') return;
        console.log("🌍 Инициализация на соло режим 2.1");

        if (!window.currentRegion) window.currentRegion = "Плиска";
        if (!window.companions) window.companions = [];
        if (!window.activeQuests) window.activeQuests = [];
        if (!window.completedQuests) window.completedQuests = [];

        window.visitedRegions.add(window.currentRegion);

        buildRegionConnections();        // Изгражда връзките между регионите
        addQuestsButton();               // Добавя бутон "📜 Куестове"
        addSoloSettingsButton();         // Добавя бутон "⚙️ Настройки"
        addRegionIndicator();            // Добавя индикатор за текущ регион
        patchRegionInspection();         // Добавя бутони в инспекцията (пътуване, атака, спътник)
        patchHireHero();                 // Блокира наемането на герои в соло режим
        patchHeroLists();                // Филтрира списъците с герои (само главен + спътници)
        setupTravelFunction();           // Дефинира функцията за пътуване
        setupBattleHook();               // Закача проверка за куестове след битка
        replaceMapWithSoloVersion();     // Заменя картата със соло версия (клик -> инспекция)
        defineRecruitCompanion();        // Дефинира функцията за намиране на спътници (мъже и жени)
        defineShowQuestsUI();            // Дефинира UI за показване на куестове
        window.updateRegionIndicator = updateRegionIndicator;   // Експортира функцията

        console.log("✅ Соло режим 2.1 е активен.");
    }
        // ==================== ВРЪЗКИ МЕЖДУ РЕГИОНИТЕ ====================
    function buildRegionConnections() {
        if (window.regionConnections) return;
        window.regionConnections = {};
        
        // Предварително дефинирани връзки за основните региони
        const predefined = {
            "Плиска": ["Преслав", "Варна", "Силистра", "Шумен"],
            "Преслав": ["Плиска", "Шумен", "Търновград", "Варна"],
            "Варна": ["Плиска", "Преслав", "Добруджа", "Бургас"],
            "Бургас": ["Варна", "Стара Загора", "Пловдив"],
            "Шумен": ["Плиска", "Преслав", "Разград"],
            "Разград": ["Шумен", "Русе", "Силистра"],
            "Силистра": ["Плиска", "Разград", "Добруджа"],
            "Добруджа": ["Силистра", "Варна", "Бесарабия"],
            "София": ["Скопие", "Ниш", "Пловдив"],
            "Пловдив": ["София", "Стара Загора", "Сяр"]
        };
        
        // Копираме предварителните връзки само за съществуващи региони
        for (let reg in predefined) {
            if (window.worldData.regions && window.worldData.regions[reg]) {
                window.regionConnections[reg] = predefined[reg];
            }
        }
        
        // За останалите региони (процедурно генерирани) създаваме случайни съседи
        for (let regName in window.worldData.regions) {
            if (!window.regionConnections[regName]) {
                let neighbors = [];
                let allRegions = Object.keys(window.worldData.regions);
                let maxNeighbors = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < maxNeighbors && neighbors.length < maxNeighbors; i++) {
                    let candidate = allRegions[Math.floor(Math.random() * allRegions.length)];
                    if (candidate !== regName && !neighbors.includes(candidate)) {
                        neighbors.push(candidate);
                    }
                }
                window.regionConnections[regName] = neighbors;
            }
        }
        console.log("🗺️ Регионални връзки готови.");
    }
        // ==================== ИНДИКАТОР ЗА ТЕКУЩ РЕГИОН ====================
    function addRegionIndicator() {
        if (!window.soloSettings.showRegionIndicator) return;
        if (document.getElementById('solo-region-indicator')) return;
        
        let container = document.querySelector('.top-bar-stats') || document.getElementById('top-bar');
        if (!container) return;
        
        const indicator = document.createElement('div');
        indicator.id = 'solo-region-indicator';
        indicator.style.cssText = 'background:rgba(0,0,0,0.5); border-radius:30px; padding:4px 12px; font-size:0.8rem; color:#ffd700; margin-left:10px;';
        indicator.innerHTML = `📍 <span id="solo-current-region">${window.currentRegion}</span> <span id="solo-region-stats" style="font-size:0.7rem;">| 🗺️ ${window.visitedRegions.size}</span>`;
        container.appendChild(indicator);
    }

    function updateRegionIndicator() {
        const span = document.getElementById('solo-current-region');
        if (span) span.innerText = window.currentRegion;
        const statsSpan = document.getElementById('solo-region-stats');
        if (statsSpan) statsSpan.innerText = `| 🗺️ ${window.visitedRegions.size}`;
    }
        // ==================== БУТОН ЗА КУЕСТОВЕ ====================
    function addQuestsButton() {
        let container = document.querySelector('.top-bar-controls') || document.getElementById('bottom-controls');
        if (!container || document.getElementById('solo-quests-btn')) return;
        if (window._questsButtonAdded) return;
        window._questsButtonAdded = true;
        
        const btn = document.createElement('button');
        btn.id = 'solo-quests-btn';
        btn.className = 'glass-btn';
        btn.innerHTML = '📜 Куестове';
        btn.onclick = () => { if (window.showQuestsUI) window.showQuestsUI(); };
        container.appendChild(btn);
    }

    // ==================== БУТОН ЗА НАСТРОЙКИ ====================
    function addSoloSettingsButton() {
        let container = document.querySelector('.top-bar-controls') || document.getElementById('bottom-controls');
        if (!container || document.getElementById('solo-settings-btn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'solo-settings-btn';
        btn.className = 'glass-btn';
        btn.innerHTML = '⚙️';
        btn.onclick = () => showSoloSettingsUI();
        container.appendChild(btn);
    }

    function showSoloSettingsUI() {
        const modal = document.createElement('div');
        modal.id = 'solo-settings-modal';
        modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:200001; display:flex; justify-content:center; align-items:center;`;
        modal.innerHTML = `
            <div style="background:#1a1a2e; border:2px solid #d4af37; border-radius:24px; padding:20px; max-width:350px; width:90%;">
                <h3 style="color:#ffd700;">⚙️ Настройки</h3>
                <label style="display:flex; justify-content:space-between; margin:8px 0;">
                    <span>🗺️ Показване на съседни региони</span>
                    <input type="checkbox" id="sett-neighbors" ${window.soloSettings.showNeighborsOnMap ? 'checked' : ''}>
                </label>
                <label style="display:flex; justify-content:space-between; margin:8px 0;">
                    <span>📜 Шанс за куест (10-50%)</span>
                    <input type="range" id="sett-chance" min="0.1" max="0.5" step="0.05" value="${window.soloSettings.questChance}" style="width:120px;">
                    <span id="chanceVal">${Math.round(window.soloSettings.questChance * 100)}%</span>
                </label>
                <label style="display:flex; justify-content:space-between; margin:8px 0;">
                    <span>✨ Анимации при пътуване</span>
                    <input type="checkbox" id="sett-anim" ${window.soloSettings.enableAnimations ? 'checked' : ''}>
                </label>
                <label style="display:flex; justify-content:space-between; margin:8px 0;">
                    <span>📍 Индикатор за регион</span>
                    <input type="checkbox" id="sett-indicator" ${window.soloSettings.showRegionIndicator ? 'checked' : ''}>
                </label>
                <button id="sett-close" style="margin-top:15px; width:100%; background:#daa520; border-radius:30px; padding:8px;">Запази</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        const slider = modal.querySelector('#sett-chance');
        const chanceSpan = modal.querySelector('#chanceVal');
        slider.oninput = () => chanceSpan.innerText = Math.round(slider.value * 100) + '%';
        
        modal.querySelector('#sett-close').onclick = () => {
            window.soloSettings.showNeighborsOnMap = modal.querySelector('#sett-neighbors').checked;
            window.soloSettings.questChance = parseFloat(slider.value);
            window.soloSettings.enableAnimations = modal.querySelector('#sett-anim').checked;
            window.soloSettings.showRegionIndicator = modal.querySelector('#sett-indicator').checked;
            
            const old = document.getElementById('solo-region-indicator');
            if (old) old.remove();
            if (window.soloSettings.showRegionIndicator) addRegionIndicator();
            
            modal.remove();
            if (window.soloSettings.showNeighborsOnMap && document.getElementById('regions-map-overlay')) {
                window.openRegionsMap();
            }
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }
        // ==================== ДОБАВЯНЕ НА БУТОНИ В ИНСПЕКЦИЯТА ====================
    function patchRegionInspection() {
        const originalInspect = window.inspectRegion;
        if (!originalInspect) return;
        
        window.inspectRegion = function(regionName) {
            originalInspect(regionName);
            setTimeout(() => {
                const modal = document.getElementById('region-inspect-overlay');
                if (!modal) return;
                const actionDiv = modal.querySelector('#action-div') || modal.querySelector('.modal-content div:last-child');
                if (!actionDiv) return;
                
                // Премахваме старите бутони, за да няма дублиране
                document.getElementById('solo-travel-btn')?.remove();
                document.getElementById('solo-attack-btn')?.remove();
                document.getElementById('solo-recruit-btn')?.remove();

                const isConnected = window.regionConnections?.[window.currentRegion]?.includes(regionName);
                
                // Бутон за пътуване (само ако е съседен)
                if (window.currentRegion !== regionName && isConnected) {
                    const travelBtn = document.createElement('button');
                    travelBtn.id = 'solo-travel-btn';
                    travelBtn.innerText = `🚶 Пътувай до ${regionName}`;
                    travelBtn.style.cssText = 'background:#2c5a2a; border:none; padding:8px 20px; border-radius:40px; color:white; width:100%; margin-bottom:10px; cursor:pointer;';
                    travelBtn.onclick = () => { modal.remove(); window.travelToRegion(regionName); };
                    actionDiv.appendChild(travelBtn);
                } else if (window.currentRegion !== regionName && !isConnected) {
                    const msg = document.createElement('div');
                    msg.innerText = `🚫 Няма пряк път от ${window.currentRegion} до ${regionName}.`;
                    msg.style.cssText = 'color:#ffaa66; font-size:12px; margin-bottom:8px;';
                    actionDiv.appendChild(msg);
                }

                // Бутон за атака (винаги)
                const attackBtn = document.createElement('button');
                attackBtn.id = 'solo-attack-btn';
                attackBtn.innerText = `⚔️ Атакувай ${regionName}`;
                attackBtn.style.cssText = 'background:#7a2e1a; border:none; padding:8px 20px; border-radius:40px; color:#ffdd99; width:100%; margin-bottom:10px; cursor:pointer;';
                attackBtn.onclick = () => { modal.remove(); if (window.startBattle) window.startBattle(regionName); };
                actionDiv.appendChild(attackBtn);

                // Бутон за спътник (ако има място)
                if (window.companions.length < 4) {
                    const recruitBtn = document.createElement('button');
                    recruitBtn.id = 'solo-recruit-btn';
                    recruitBtn.innerText = `👥 Търси спътник в ${regionName}`;
                    recruitBtn.style.cssText = 'background:#daa520; border:none; padding:8px 20px; border-radius:40px; color:#000; width:100%; margin-bottom:10px; cursor:pointer;';
                    recruitBtn.onclick = () => { modal.remove(); window.recruitCompanion(regionName); };
                    actionDiv.appendChild(recruitBtn);
                }
            }, 100);
        };
    }
        // ==================== ПЪТУВАНЕ ====================
    function setupTravelFunction() {
        window.travelToRegion = function(regionName) {
            if (isTraveling) return false;
            
            let neighbors = window.regionConnections[window.currentRegion];
            if (!neighbors || !neighbors.includes(regionName)) return false;
            
            isTraveling = true;
            setTimeout(() => {
                window.currentRegion = regionName;
                window.visitedRegions.add(regionName);
                
                if (window.showAdvisorMsg) window.showAdvisorMsg(`🚶 Пристигнахте в ${regionName}.`);
                updateRegionIndicator();
                
                if (window.checkAllQuestsProgress) {
                    window.checkAllQuestsProgress(window.currentHero, regionName, "travel");
                }
                
                let chance = window.soloSettings.questChance || 0.3;
                if (window.generateRandomQuest && Math.random() < chance) {
                    let q = window.generateRandomQuest(regionName);
                    if (q && window.addQuest) window.addQuest(q);
                }
                
                if (window.openRegionsMap) window.openRegionsMap();
                isTraveling = false;
            }, window.soloSettings.enableAnimations ? 300 : 0);
            return true;
        };
    }
        // ==================== ХУК ЗА БИТКИ ====================
    function setupBattleHook() {
        if (typeof window.endGroupBattle !== 'function') return;
        const original = window.endGroupBattle;
        window.endGroupBattle = function(isVictory, reason, ...args) {
            if (original) original(isVictory, reason, ...args);
            if (isVictory && window.currentHero && window.currentRegion && window.checkAllQuestsProgress) {
                window.checkAllQuestsProgress(window.currentHero, window.currentRegion, "battle");
            }
        };
    }
        // ==================== КАРТА (СОЛО ВЕРСИЯ) ====================
    function replaceMapWithSoloVersion() {
        window.openRegionsMap = function() {
            const old = document.getElementById('regions-map-overlay');
            if (old) old.remove();
            
            let regions = [];
            if (window.worldData && window.worldData.regions) regions = Object.values(window.worldData.regions);
            if (!regions.length) return;
            
            const owned = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];
            
            const modal = document.createElement('div');
            modal.id = 'regions-map-overlay';
            modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:200000; display:flex; align-items:center; justify-content:center; padding:15px;`;
            
            let html = `<div style="background:rgba(10,10,20,0.95); border:2px solid #d4af37; border-radius:28px; max-width:95%; max-height:90%; width:100%; display:flex; flex-direction:column; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; padding:12px 20px; border-bottom:1px solid #d4af37;">
                    <button id="closeMapBtn" style="background:rgba(255,80,80,0.2); border:1px solid #ff8888; color:#ff8888; border-radius:50%; width:36px; height:36px; cursor:pointer;">✕</button>
                    <h2 style="color:#ffd700;">🗺️ КАРТА</h2>
                    <div style="width:36px;"></div>
                </div>
                <div style="padding:20px; overflow-y:auto; display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">`;
            
            regions.forEach(region => {
                const isOwned = owned.includes(region.name);
                const isCurrent = (window.currentRegion === region.name);
                const isConnected = window.regionConnections?.[window.currentRegion]?.includes(region.name);
                
                let border = "1px solid rgba(255,215,0,0.3)";
                if (isCurrent) border = "2px solid #ffd700";
                else if (isConnected && window.soloSettings.showNeighborsOnMap) border = "2px solid #44ff44";
                
                let bg = "#2a2a3a";
                if (isOwned) bg = "#2c5a2a";
                else if (region.difficulty > 70) bg = "#5a1a1a";
                else if (region.difficulty > 40) bg = "#4a2a1a";
                
                html += `<div class="region-card" data-region="${region.name}" style="background:${bg}; border:${border}; border-radius:16px; padding:12px; width:160px; text-align:center; cursor:pointer; margin:8px;">
                            <div style="font-size:28px;">🏰</div>
                            <div style="font-weight:bold; color:#ffd700;">${region.name}</div>
                            <div style="font-size:11px;">Войска: ${region.armySize || 0}</div>
                            <div style="font-size:11px;">Защита: ниво ${region.defenseLevel || 1}</div>
                            ${isCurrent ? '<div style="margin-top:5px;"><span style="background:rgba(0,0,0,0.5); padding:2px 8px; border-radius:12px;">📍 Тук сте</span></div>' : ''}
                        </div>`;
            });
            
            html += `</div><div style="text-align:center; padding:15px;"><button id="closeMapBtnBottom" style="background:#2c2c3a; border:1px solid #d4af37; color:#ffd700; padding:8px 20px; border-radius:30px; cursor:pointer;">Затвори</button></div></div>`;
            modal.innerHTML = html;
            document.body.appendChild(modal);
            
            const close = () => modal.remove();
            modal.querySelectorAll('#closeMapBtn, #closeMapBtnBottom').forEach(btn => btn.addEventListener('click', close));
            modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
            
            modal.querySelectorAll('.region-card').forEach(card => {
                card.addEventListener('click', () => {
                    const name = card.getAttribute('data-region');
                    if (name) { close(); if (window.inspectRegion) window.inspectRegion(name); }
                });
            });
        };
    }
        // ==================== СПЪТНИЦИ (С ЖЕНСКИ ВАРИАНТИ) ====================
    function defineRecruitCompanion() {
        window.recruitCompanion = function(regionName) {
            if (window.companions.length >= 4) {
                let msg = "❌ Вече имате максимален брой спътници (4).";
                if (window.showAdvisorMsg) window.showAdvisorMsg(msg);
                else alert(msg);
                return;
            }

            const companionPool = [
                // Мъжки
                { name: "Аспарух", class: "Воевода", power: 110, icon: "⚔️" },
                { name: "Тервел", class: "Паладин", power: 120, icon: "🛡️" },
                { name: "Крум", class: "Берсерк", power: 130, icon: "🗡️" },
                { name: "Омуртаг", class: "Строител", power: 100, icon: "🏗️" },
                { name: "Борис", class: "Просветител", power: 105, icon: "📖" },
                { name: "Симеон", class: "Маг", power: 125, icon: "🔮" },
                { name: "Петър", class: "Търговец", power: 95, icon: "💰" },
                { name: "Иван Асен", class: "Владетел", power: 115, icon: "👑" },
                { name: "Калоян", class: "Ромеобоец", power: 135, icon: "🐉" },
                { name: "Александър", class: "Завоевател", power: 140, icon: "🏆" },
                // Женски
                { name: "Теодора", class: "Жрица", power: 105, icon: "🕊️" },
                { name: "Ирина", class: "Магьосница", power: 115, icon: "🧙‍♀️" },
                { name: "Елена", class: "Владетелка", power: 120, icon: "👸" },
                { name: "Райна", class: "Воителка", power: 110, icon: "⚔️" },
                { name: "Светлана", class: "Лечителка", power: 95, icon: "💚" },
                { name: "Мария", class: "Търговка", power: 90, icon: "💰" },
                { name: "Калина", class: "Стрелец", power: 100, icon: "🏹" },
                { name: "Бояна", class: "Паладинка", power: 125, icon: "🛡️" },
                { name: "Десислава", class: "Берсерк", power: 135, icon: "🗡️" },
                { name: "Цветана", class: "Маг", power: 130, icon: "🔮" }
            ];
            
            let available = companionPool.filter(c => !window.companions.some(comp => comp.name === c.name));
            if (available.length === 0) available = companionPool;
            let randomComp = available[Math.floor(Math.random() * available.length)];

            const compId = "companion_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
            const companion = {
                id: compId,
                name: randomComp.name,
                leaderName: randomComp.name,
                clan: "Спътник",
                isJoined: true,
                isCompanion: true,
                isAuto: true,
                level: 1,
                xp: 0,
                storedXP: 0,
                heroPower: randomComp.power,
                power: randomComp.power,
                gold: 0,
                armySize: 150,
                currentArmy: 150,
                currentClass: randomComp.class,
                className: randomComp.class,
                skills: { tactics: 0, endurance: 0, economy: 0, mysticism: 0, leadership: 0 },
                skillPoints: 0,
                equipment: Array(12).fill(null),
                inventory: [],
                pet: null,
                armyDetails: { infantry: 80, archers: 30, cavalry: 25, elite: 15 }
            };
            if (window.initializeHeroRPGData) window.initializeHeroRPGData(companion);
            if (window.ensureCompleteArmyDetails) window.ensureCompleteArmyDetails(companion);

            if (!window.worldData) window.worldData = {};
            if (!window.worldData.clans) window.worldData.clans = {};
            window.worldData.clans[compId] = companion;
            window.companions.push(companion);

            let msg = `👥 НОВ СПЪТНИК: ${randomComp.name} (${randomComp.class}) се присъедини към вас!`;
            if (window.showAdvisorMsg) window.showAdvisorMsg(msg);
            else alert(msg);

            if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
            if (typeof window.renderSingleBar === 'function') window.renderSingleBar();

            if (window.checkAllQuestsProgress) {
                window.checkAllQuestsProgress(window.currentHero, regionName, "companion");
            }
        };
    }
        // ==================== UI ЗА КУЕСТОВЕ ====================
    function defineShowQuestsUI() {
        window.showQuestsUI = function() {
            const modal = document.createElement('div');
            modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:200000; display:flex; justify-content:center; align-items:center;`;
            
            let html = `<div style="background:#1a1a2e; border:2px solid #d4af37; border-radius:24px; padding:20px; max-width:500px; width:90%; max-height:80vh; overflow-y:auto;">
                <h2 style="color:#ffd700;">📜 Активни куестове</h2>`;
            
            if (!window.activeQuests || window.activeQuests.length === 0) {
                html += `<p style="color:#aaa;">Няма активни куестове. Пътувайте до нови региони.</p>`;
            } else {
                window.activeQuests.forEach(q => {
                    let reward = "";
                    if (q.reward) {
                        let parts = [];
                        if (q.reward.gold) parts.push(`${q.reward.gold} злато`);
                        if (q.reward.xp) parts.push(`${q.reward.xp} XP`);
                        if (q.reward.artifact) parts.push(`Артефакт`);
                        if (q.reward.companion) parts.push(`Спътник`);
                        reward = parts.join(", ");
                    }
                    html += `<div style="background:#0d0a07; border-radius:16px; padding:12px; margin-bottom:10px;">
                                <div><strong style="color:#ffd700;">${q.title}</strong></div>
                                <div style="font-size:12px;">${q.description}</div>
                                <div style="font-size:10px; color:#88ff88;">Награда: ${reward}</div>
                                <progress value="${q.progress}" max="${q.target}" style="width:100%; margin-top:6px;"></progress>
                             </div>`;
                });
            }
            html += `<button id="close-quests-ui" style="margin-top:15px; background:#2c1a0c; border-radius:30px; padding:8px; width:100%;">Затвори</button></div>`;
            modal.innerHTML = html;
            document.body.appendChild(modal);
            modal.querySelector('#close-quests-ui').onclick = () => modal.remove();
            modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
        };
    }
        // ==================== БЛОКИРАНЕ НА НАЕМАНЕ ====================
    function patchHireHero() {
        if (typeof window.hireNewHero !== 'function') return;
        const original = window.hireNewHero;
        window.hireNewHero = function() {
            alert("В соло режим не можете да наемате герои. Можете да намирате спътници в регионите (до 4).");
        };
    }

    // ==================== ФИЛТРИРАНЕ НА СПИСЪЦИТЕ С ГЕРОИ ====================
    function patchHeroLists() {
        // Презаписваме getAllHeroes, за да връща само главен герой + спътници
        if (typeof window.getAllHeroes === 'function') {
            const original = window.getAllHeroes;
            window.getAllHeroes = function() {
                let heroes = original();
                if (window.gameMode === 'solo') {
                    let main = heroes.find(h => h.id === window.currentHero.clan);
                    let comps = heroes.filter(h => h.isCompanion === true);
                    return main ? [main, ...comps] : comps;
                }
                return heroes;
            };
        }
        
        // Презаписваме renderTop6LeadersUI, за да показва до 5 героя (главен + спътници) с иконки
        if (typeof window.renderTop6LeadersUI === 'function') {
            const originalRender = window.renderTop6LeadersUI;
            window.renderTop6LeadersUI = function() {
                if (window.gameMode === 'solo') {
                    const eliteBar = document.getElementById('top-elite-bar');
                    if (!eliteBar) return;
                    
                    let heroes = window.getAllHeroes ? window.getAllHeroes() : [];
                    heroes = heroes.filter(h => h.isCompanion || h.id === window.currentHero.clan);
                    
                    if (!heroes.length) {
                        eliteBar.innerHTML = '<div style="color:#aaa;">Няма герои</div>';
                        return;
                    }
                    
                    eliteBar.innerHTML = "";
                    // Показваме до 5 героя (вместо 6)
                    heroes.slice(0, 5).forEach(hero => {
                        const card = document.createElement('div');
                        card.className = "elite-hero-card";
                        card.style.cssText = "background: rgba(0,0,0,0.6); border-radius: 12px; padding: 6px 12px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b;";
                        card.onclick = () => { if (window.showHeroProfile) window.showHeroProfile(hero); };
                        
                        let needXP = 100 + (hero.level - 1) * 50;
                        let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
                        let xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
                        const classIcon = getClassIcon ? getClassIcon(hero.className) : "⚔️";
                        
                        card.innerHTML = `
                            <div style="font-weight:bold;color:#ffdd99;">${classIcon} ${hero.name}</div>
                            <div style="font-size:10px;color:#ccaa77;">Ниво ${hero.level}</div>
                            <div style="background:#2a1a0a;height:3px;border-radius:2px;margin:4px 0;">
                                <div style="background:#44aa44;height:100%;width:${xpPercent}%;border-radius:2px;"></div>
                            </div>
                            <button class="auto-btn" style="background:#2c1a0c;border:none;font-size:9px;padding:2px 6px;border-radius:20px;color:#ffdd99;margin-top:4px;">${hero.isAuto ? "Auto" : "Manual"}</button>
                        `;
                        eliteBar.appendChild(card);
                    });
                    return;
                } else {
                    originalRender();
                }
            };
        }
    }

    // ==================== ХУК ЗА БИТКИ (за куестове) ====================
    function setupBattleHook() {
        if (typeof window.endGroupBattle !== 'function') return;
        const original = window.endGroupBattle;
        window.endGroupBattle = function(isVictory, reason, ...args) {
            if (original) original(isVictory, reason, ...args);
            if (isVictory && window.currentHero && window.currentRegion && window.checkAllQuestsProgress) {
                window.checkAllQuestsProgress(window.currentHero, window.currentRegion, "battle");
            }
        };
    }
        // ==================== СТАРТИРАНЕ ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSoloMode);
    } else {
        initSoloMode();
    }
})();
