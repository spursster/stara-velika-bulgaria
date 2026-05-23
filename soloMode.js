// ==================== СОЛО РЕЖИМ – ВЕРСИЯ 2.0 ====================
// Нови функции: настройки, индикатор за регион, визуални ефекти, статистика

(function() {
    // ==================== ГЛОБАЛНИ НАСТРОЙКИ ====================
    window.soloSettings = window.soloSettings || {
        showNeighborsOnMap: true,      // Показва съседни региони със зелен кант
        questChance: 0.3,              // 30% шанс за нов куест при пътуване
        enableAnimations: true,        // Анимации при пътуване
        enableSounds: false,            // Звукови ефекти (само конзолен лог засега)
        showRegionIndicator: true       // Показва банер с текущия регион
    };

    let isTraveling = false;            // За предотвратяване на multiple пътувания
    let visitedRegions = new Set();     // Брой посетени региони (статистика)

    // ==================== ОСНОВНА ИНИЦИАЛИЗАЦИЯ ====================
    function initSoloMode() {
        if (window.gameMode !== 'solo') return;
        console.log("🌍 Инициализация на соло режим (RPG отворен свят) – версия 2.0");

        if (!window.currentRegion) window.currentRegion = "Плиска";
        if (!window.companions) window.companions = [];
        if (!window.activeQuests) window.activeQuests = [];
        if (!window.completedQuests) window.completedQuests = [];

        // Инициализация на посетени региони
        visitedRegions.add(window.currentRegion);
        updateRegionStats();

        buildRegionConnections();
        addQuestsButton();
        addSoloSettingsButton();
        addRegionIndicator();
        patchRegionInspection();
        patchHireHero();
        patchHeroLists();
        setupTravelFunction();
        setupBattleHook();
        patchMapToOpenInspection();
        defineRecruitCompanion();
        defineShowQuestsUI();

        console.log("✅ Соло режим 2.0 е активен. Използвайте ⚙️ за настройки.");
    }

    // ==================== СТАТИСТИКА ЗА РЕГИОНИТЕ ====================
    function updateRegionStats() {
        let statsEl = document.getElementById('solo-region-stats');
        if (statsEl) {
            statsEl.innerHTML = `📍 ${window.currentRegion} | 🗺️ Посетени: ${visitedRegions.size}`;
        }
    }

    // ==================== ИНДИКАТОР ЗА ТЕКУЩ РЕГИОН ====================
    function addRegionIndicator() {
        if (!window.soloSettings.showRegionIndicator) return;
        if (document.getElementById('solo-region-indicator')) return;

        let container = document.querySelector('.top-bar-stats') || document.getElementById('top-bar');
        if (!container) return;

        const indicator = document.createElement('div');
        indicator.id = 'solo-region-indicator';
        indicator.style.cssText = `
            background: rgba(0,0,0,0.5);
            border-radius: 30px;
            padding: 4px 12px;
            font-size: 0.8rem;
            color: #ffd700;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 10px;
        `;
        indicator.innerHTML = `
            <span>📍</span>
            <span id="solo-current-region">${window.currentRegion}</span>
            <span id="solo-region-stats" style="font-size:0.7rem; color:#aaa;">| 🗺️ Посетени: ${visitedRegions.size}</span>
        `;
        container.appendChild(indicator);
    }

    function updateRegionIndicator() {
        const regionSpan = document.getElementById('solo-current-region');
        if (regionSpan) regionSpan.innerText = window.currentRegion;
        updateRegionStats();
    }

    // ==================== БУТОН ЗА НАСТРОЙКИ ====================
    function addSoloSettingsButton() {
        let container = document.querySelector('.top-bar-controls') || document.getElementById('bottom-controls');
        if (!container || document.getElementById('solo-settings-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'solo-settings-btn';
        btn.className = 'glass-btn';
        btn.innerHTML = '⚙️';
        btn.title = 'Настройки на соло режима';
        btn.onclick = () => showSoloSettingsUI();
        container.appendChild(btn);
    }

    function showSoloSettingsUI() {
        const modal = document.createElement('div');
        modal.id = 'solo-settings-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
            z-index: 200001; display: flex; justify-content: center; align-items: center;
        `;
        modal.innerHTML = `
            <div style="background:#1a1a2e; border:2px solid #d4af37; border-radius:24px; padding:20px; max-width:350px; width:90%;">
                <h3 style="color:#ffd700; text-align:center;">⚙️ Настройки на соло режима</h3>
                <div style="margin:15px 0;">
                    <label style="display:flex; justify-content:space-between; margin:8px 0;">
                        <span>🗺️ Показване на съседни региони на картата</span>
                        <input type="checkbox" id="sett-show-neighbors" ${window.soloSettings.showNeighborsOnMap ? 'checked' : ''}>
                    </label>
                    <label style="display:flex; justify-content:space-between; margin:8px 0;">
                        <span>📜 Шанс за нов куест (10-50%)</span>
                        <input type="range" id="sett-quest-chance" min="0.1" max="0.5" step="0.05" value="${window.soloSettings.questChance}" style="width:120px;">
                        <span id="sett-quest-chance-value">${Math.round(window.soloSettings.questChance * 100)}%</span>
                    </label>
                    <label style="display:flex; justify-content:space-between; margin:8px 0;">
                        <span>✨ Анимации при пътуване</span>
                        <input type="checkbox" id="sett-animations" ${window.soloSettings.enableAnimations ? 'checked' : ''}>
                    </label>
                    <label style="display:flex; justify-content:space-between; margin:8px 0;">
                        <span>📍 Индикатор за текущ регион</span>
                        <input type="checkbox" id="sett-region-indicator" ${window.soloSettings.showRegionIndicator ? 'checked' : ''}>
                    </label>
                </div>
                <button id="sett-close" style="width:100%; background:#daa520; border:none; border-radius:30px; padding:8px; color:#000; cursor:pointer;">Запази и затвори</button>
            </div>
        `;
        document.body.appendChild(modal);

        const chanceSlider = modal.querySelector('#sett-quest-chance');
        const chanceValue = modal.querySelector('#sett-quest-chance-value');
        chanceSlider.oninput = () => { chanceValue.innerText = Math.round(chanceSlider.value * 100) + '%'; };

        modal.querySelector('#sett-close').onclick = () => {
            window.soloSettings.showNeighborsOnMap = modal.querySelector('#sett-show-neighbors').checked;
            window.soloSettings.questChance = parseFloat(chanceSlider.value);
            window.soloSettings.enableAnimations = modal.querySelector('#sett-animations').checked;
            window.soloSettings.showRegionIndicator = modal.querySelector('#sett-region-indicator').checked;

            const oldIndicator = document.getElementById('solo-region-indicator');
            if (oldIndicator) oldIndicator.remove();
            if (window.soloSettings.showRegionIndicator) addRegionIndicator();

            modal.remove();
            if (window.soloSettings.showNeighborsOnMap && document.getElementById('regions-map-overlay')) {
                window.openRegionsMap();
            }
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    // ==================== ВРЪЗКИ МЕЖДУ РЕГИОНИТЕ ====================
    function buildRegionConnections() {
        if (window.regionConnections) return;
        window.regionConnections = {};

        const predefinedConnections = {
            "Плиска": ["Преслав", "Варна", "Силистра", "Шумен"],
            "Преслав": ["Плиска", "Шумен", "Търновград", "Варна"],
            "Варна": ["Плиска", "Преслав", "Добруджа", "Бургас"],
            "Бургас": ["Варна", "Стара Загора", "Пловдив"],
            "Шумен": ["Плиска", "Преслав", "Разград"],
            "Разград": ["Шумен", "Русе", "Силистра"],
            "Силистра": ["Плиска", "Разград", "Добруджа"],
            "Добруджа": ["Силистра", "Варна", "Бесарабия"],
            "Бесарабия": ["Добруджа", "Тирана"],
            "Тирана": ["Бесарабия", "Драч", "Скопие"],
            "Драч": ["Тирана", "Скопие", "Солун"],
            "Скопие": ["Тирана", "Драч", "Солун", "Ниш", "София"],
            "Солун": ["Драч", "Скопие", "Сяр", "Битоля"],
            "Сяр": ["Солун", "Битоля", "Пловдив"],
            "Битоля": ["Солун", "Сяр", "Охрид", "Преспа"],
            "Охрид": ["Битоля", "Преспа", "Костур"],
            "Преспа": ["Битоля", "Охрид", "Костур"],
            "Костур": ["Преспа", "Охрид", "Янина"],
            "Янина": ["Костур", "Арта"],
            "Арта": ["Янина", "Патра"],
            "Патра": ["Арта", "Коринт"],
            "Коринт": ["Патра", "Атина"],
            "Атина": ["Коринт", "Солун"],
            "София": ["Скопие", "Ниш", "Пловдив", "Кюстендил"],
            "Ниш": ["Скопие", "София", "Белград"],
            "Белград": ["Ниш", "Букурещ", "Сараево"],
            "Пловдив": ["София", "Стара Загора", "Сяр", "Кърджали"],
            "Стара Загора": ["Пловдив", "Бургас", "Хасково", "Сливен"],
            "Хасково": ["Стара Загора", "Кърджали", "Одрин"],
            "Кърджали": ["Хасково", "Пловдив", "Одрин"],
            "Одрин": ["Кърджали", "Хасково", "Цариград"],
            "Цариград": ["Одрин", "Малоазия", "Солун"],
            "Малоазия": ["Цариград", "Анкара", "Смирна"],
            "Анкара": ["Малоазия", "Кония", "Трапезунд"],
            "Кония": ["Анкара", "Тарс"],
            "Тарс": ["Кония", "Антиохия"],
            "Антиохия": ["Тарс", "Дамаск"],
            "Дамаск": ["Антиохия", "Йерусалим"],
            "Йерусалим": ["Дамаск", "Каиро"],
            "Каиро": ["Йерусалим", "Александрия"],
            "Александрия": ["Каиро", "Мемфис"],
            "Мемфис": ["Александрия", "Тива"],
            "Тива": ["Мемфис", "Асуан"],
            "Трапезунд": ["Анкара", "Тбилиси", "Батуми"],
            "Тбилиси": ["Трапезунд", "Баку", "Дербент"],
            "Баку": ["Тбилиси", "Дербент", "Техеран"],
            "Техеран": ["Баку", "Исфахан", "Табриз"],
            "Исфахан": ["Техеран", "Шираз", "Персеполис"],
            "Шираз": ["Исфахан", "Бендер Абас"],
            "Табриз": ["Техеран", "Ереван", "Мосул"],
            "Киев": ["Чернигов", "Переяслав", "Минск"],
            "Москва": ["Владимир", "Твер", "Рязан"],
            "Новгород": ["Твер", "Псков", "Санкт Петербург"],
            "Пекин": ["Нанкин", "Сиан", "Хангжу"]
        };

        for (let reg in predefinedConnections) {
            if (window.worldData.regions && window.worldData.regions[reg]) {
                window.regionConnections[reg] = predefinedConnections[reg].filter(name => window.worldData.regions[name]);
            }
        }

        for (let regName in window.worldData.regions) {
            if (!window.regionConnections[regName]) {
                let neighbors = [];
                let allRegions = Object.keys(window.worldData.regions);
                let maxNeighbors = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < maxNeighbors && neighbors.length < maxNeighbors; i++) {
                    let candidate = allRegions[Math.floor(Math.random() * allRegions.length)];
                    if (candidate !== regName && !neighbors.includes(candidate) && (!window.regionConnections[candidate] || !window.regionConnections[candidate].includes(regName))) {
                        neighbors.push(candidate);
                    }
                }
                window.regionConnections[regName] = neighbors;
            }
        }
        console.log("🗺️ Регионалните връзки са генерирани.");
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
        btn.onclick = () => { if (window.showQuestsUI) window.showQuestsUI(); else alert("Куестовете не са активни"); };
        container.appendChild(btn);
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
                
                if (document.getElementById('solo-attack-btn')) return;

                const isConnected = window.regionConnections[window.currentRegion]?.includes(regionName);
                
                if (window.currentRegion !== regionName && isConnected) {
                    const travelBtn = document.createElement('button');
                    travelBtn.id = 'solo-travel-btn';
                    travelBtn.innerText = `🚶 Пътувай до ${regionName}`;
                    travelBtn.style.cssText = 'background:#2c5a2a; border:none; border-bottom:2px solid #1e3a1e; padding:8px 20px; border-radius:40px; color:white; cursor:pointer; font-weight:bold; width:100%; margin-bottom:10px; transition:transform 0.2s;';
                    travelBtn.onmouseenter = () => travelBtn.style.transform = 'scale(1.02)';
                    travelBtn.onmouseleave = () => travelBtn.style.transform = 'scale(1)';
                    travelBtn.onclick = () => { modal.remove(); window.travelToRegion(regionName); };
                    actionDiv.appendChild(travelBtn);
                } else if (window.currentRegion !== regionName && !isConnected) {
                    const msgDiv = document.createElement('div');
                    msgDiv.innerText = `🚫 Няма пряк път от ${window.currentRegion} до ${regionName}.`;
                    msgDiv.style.cssText = 'color:#ffaa66; font-size:12px; margin-bottom:8px; padding:4px; background:rgba(0,0,0,0.3); border-radius:8px;';
                    actionDiv.appendChild(msgDiv);
                }

                const attackBtn = document.createElement('button');
                attackBtn.id = 'solo-attack-btn';
                attackBtn.innerText = `⚔️ Атакувай ${regionName}`;
                attackBtn.style.cssText = 'background:#7a2e1a; border:none; border-bottom:2px solid #5a1e0a; padding:8px 20px; border-radius:40px; color:#ffdd99; cursor:pointer; font-weight:bold; width:100%; margin-bottom:10px; transition:transform 0.2s;';
                attackBtn.onmouseenter = () => attackBtn.style.transform = 'scale(1.02)';
                attackBtn.onmouseleave = () => attackBtn.style.transform = 'scale(1)';
                attackBtn.onclick = () => { modal.remove(); if (window.startBattle) window.startBattle(regionName); };
                actionDiv.appendChild(attackBtn);

                if (window.companions.length < 4) {
                    const recruitBtn = document.createElement('button');
                    recruitBtn.id = 'solo-recruit-btn';
                    recruitBtn.innerText = `👥 Търси спътник в ${regionName}`;
                    recruitBtn.style.cssText = 'background:#daa520; border:none; border-bottom:2px solid #b8860b; padding:8px 20px; border-radius:40px; color:#000; cursor:pointer; font-weight:bold; width:100%; margin-bottom:10px; transition:transform 0.2s;';
                    recruitBtn.onmouseenter = () => recruitBtn.style.transform = 'scale(1.02)';
                    recruitBtn.onmouseleave = () => recruitBtn.style.transform = 'scale(1)';
                    recruitBtn.onclick = () => { modal.remove(); window.recruitCompanion(regionName); };
                    actionDiv.appendChild(recruitBtn);
                }
            }, 50);
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
        if (typeof window.renderTop6LeadersUI === 'function') {
            const originalRender = window.renderTop6LeadersUI;
            window.renderTop6LeadersUI = function() {
                if (window.gameMode === 'solo') {
                    const eliteBar = document.getElementById('top-elite-bar');
                    if (!eliteBar) return;
                    let heroes = window.getAllHeroes ? window.getAllHeroes() : [];
                    heroes = heroes.filter(h => h.isCompanion || h.id === window.currentHero.clan);
                    
                    if (!heroes || heroes.length === 0) {
                        eliteBar.innerHTML = '<div style="color:#aaa; padding:10px;">Няма герои</div>';
                        return;
                    }
                    
                    eliteBar.innerHTML = "";
                    heroes.slice(0, 5).forEach(hero => {
                        const card = document.createElement('div');
                        card.className = "elite-hero-card";
                        card.style.cssText = "background: rgba(0,0,0,0.6); border-radius: 12px; padding: 6px 12px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b; transition:transform 0.2s;";
                        card.onmouseenter = () => card.style.transform = 'translateY(-2px)';
                        card.onmouseleave = () => card.style.transform = 'translateY(0)';
                        card.onclick = () => { if (window.showHeroProfile) window.showHeroProfile(hero); };
                        let needXP = 100 + (hero.level - 1) * 50;
                        let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
                        let xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
                        card.innerHTML = `
                            <div style="font-weight:bold;color:#ffdd99;">${hero.name}</div>
                            <div style="font-size:10px;color:#ccaa77;">Ниво ${hero.level}</div>
                            <div style="background:#2a1a0a;height:3px;border-radius:2px;margin:4px 0;"><div style="background:#44aa44;height:100%;width:${xpPercent}%;border-radius:2px;"></div></div>
                            <button class="auto-btn" style="background:#2c1a0c;border:none;font-size:9px;padding:2px 6px;border-radius:20px;color:#ffdd99;margin-top:4px;cursor:pointer;">${hero.isAuto ? "Auto" : "Manual"}</button>
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

    // ==================== ПЪТУВАНЕ ====================
    function setupTravelFunction() {
        window.travelToRegion = function(regionName) {
            if (isTraveling) {
                if (window.showAdvisorMsg) window.showAdvisorMsg("⏳ Изчакайте, все още пътувате...");
                return false;
            }
            
            let neighbors = window.regionConnections[window.currentRegion];
            if (!neighbors || !neighbors.includes(regionName)) {
                let msg = `❌ Няма пряк път от ${window.currentRegion} до ${regionName}.`;
                if (window.showAdvisorMsg) window.showAdvisorMsg(msg);
                else alert(msg);
                return false;
            }
            
            isTraveling = true;
            
            if (window.soloSettings.enableAnimations) {
                if (window.showAdvisorMsg) window.showAdvisorMsg(`🚀 Подготвя се пътуване до ${regionName}...`);
            }
            
            setTimeout(() => {
                window.currentRegion = regionName;
                visitedRegions.add(regionName);
                updateRegionIndicator();
                
                if (window.showAdvisorMsg) window.showAdvisorMsg(`🚶 Пристигнахте в ${regionName}.`);
                if (window.soloSettings.enableSounds) console.log("🔊 Звук: пристигане");
                
                if (window.checkAllQuestsProgress) {
                    window.checkAllQuestsProgress(window.currentHero, regionName, "travel");
                }
                
                let chance = window.soloSettings.questChance || 0.3;
                if (window.generateRandomQuest && typeof window.generateRandomQuest === 'function' && Math.random() < chance) {
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

    // ==================== КАРТАТА ДА ОТВАРЯ ИНСПЕКЦИЯ ====================
    function patchMapToOpenInspection() {
        const originalOpen = window.openRegionsMap;
        if (!originalOpen) return;
        window.openRegionsMap = function() {
            originalOpen();
            setTimeout(() => {
                const modal = document.getElementById('regions-map-overlay');
                if (!modal) return;
                const cards = modal.querySelectorAll('.region-card');
                cards.forEach(card => {
                    card.removeAttribute('onclick');
                    card.style.cursor = 'pointer';
                    card.style.transition = 'all 0.2s ease';
                    
                    if (window.soloSettings.showNeighborsOnMap) {
                        const regionName = card.getAttribute('data-region');
                        const isConnected = window.regionConnections[window.currentRegion]?.includes(regionName);
                        if (isConnected && regionName !== window.currentRegion) {
                            card.style.border = '2px solid #44ff44';
                            card.style.boxShadow = '0 0 10px rgba(68,255,68,0.5)';
                        } else if (regionName === window.currentRegion) {
                            card.style.border = '2px solid #ffd700';
                            card.style.boxShadow = '0 0 10px rgba(255,215,0,0.5)';
                        }
                    }
                    
                    card.onmouseenter = () => { card.style.transform = 'translateY(-5px)'; };
                    card.onmouseleave = () => { card.style.transform = 'translateY(0)'; };
                });
                
                if (window._soloMapHandler) modal.removeEventListener('click', window._soloMapHandler);
                window._soloMapHandler = function(e) {
                    const card = e.target.closest('.region-card');
                    if (!card) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const regionName = card.getAttribute('data-region');
                    if (regionName) {
                        modal.remove();
                        if (typeof window.inspectRegion === 'function') window.inspectRegion(regionName);
                    }
                };
                modal.addEventListener('click', window._soloMapHandler);
            }, 100);
        };
    }

    // ==================== СПЪТНИЦИ ====================
    function defineRecruitCompanion() {
        window.recruitCompanion = function(regionName) {
            if (!window.companions) window.companions = [];
            if (window.companions.length >= 4) {
                let msg = "❌ Вече имате максимален брой спътници (4).";
                if (window.showAdvisorMsg) window.showAdvisorMsg(msg);
                else alert(msg);
                return;
            }

            const companionPool = [
                { name: "Аспарух", class: "Воевода", power: 110 },
                { name: "Тервел", class: "Паладин", power: 120 },
                { name: "Крум", class: "Берсерк", power: 130 },
                { name: "Омуртаг", class: "Строител", power: 100 },
                { name: "Борис", class: "Просветител", power: 105 },
                { name: "Симеон", class: "Маг", power: 125 },
                { name: "Петър", class: "Търговец", power: 95 },
                { name: "Иван Асен", class: "Владетел", power: 115 },
                { name: "Калоян", class: "Ромеобоец", power: 135 },
                { name: "Александър", class: "Завоевател", power: 140 }
            ];
            let available = companionPool.filter(c => !window.companions.some(comp => comp.name === c.name));
            if (available.length === 0) available = companionPool;
            let randomComp = available[Math.floor(Math.random() * available.length)];

            const compId = "companion_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
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
            let html = `<div style="background:#1a1a2e; border:2px solid #d4af37; border-radius:24px; padding:20px; max-width:500px; width:90%; max-height:80vh; overflow-y:auto;"><h2 style="color:#ffd700;">📜 Активни куестове</h2>`;
            if (!window.activeQuests || window.activeQuests.length === 0) {
                html += `<p style="color:#aaa;">Няма активни куестове. Пътувайте до нови региони, за да получите такива.</p>`;
            } else {
                window.activeQuests.forEach(q => {
                    let rewardText = "";
                    if (q.reward) {
                        let parts = [];
                        if (q.reward.gold) parts.push(`${q.reward.gold} злато`);
                        if (q.reward.xp) parts.push(`${q.reward.xp} XP`);
                        if (q.reward.artifact) parts.push(`Артефакт`);
                        if (q.reward.companion) parts.push(`Спътник`);
                        rewardText = parts.join(", ");
                    }
                    html += `<div style="background:#0d0a07; border-radius:16px; padding:12px; margin-bottom:10px;">
                                <div><strong style="color:#ffd700;">${q.title}</strong></div>
                                <div style="font-size:12px;">${q.description}</div>
                                <div style="font-size:10px; color:#88ff88;">Награда: ${rewardText}</div>
                                <progress value="${q.progress}" max="${q.target}" style="width:100%; margin-top:6px;"></progress>
                             </div>`;
                });
            }
            html += `<button id="close-quests-ui" style="margin-top:15px; background:#2c1a0c; border:none; border-radius:30px; padding:8px; width:100%; color:#ffd700;">Затвори</button></div>`;
            modal.innerHTML = html;
            document.body.appendChild(modal);
            modal.querySelector('#close-quests-ui').onclick = () => modal.remove();
            modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
        };
    }

    // Стартиране
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSoloMode);
    else initSoloMode();
})();
