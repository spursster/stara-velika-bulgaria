// ==================== СОЛО РЕЖИМ – RPG ОТКРИТ СВЯТ ====================
(function() {
    // Изчакваме играта да се инициализира
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSoloMode);
    } else {
        initSoloMode();
    }

    function initSoloMode() {
        // Ако не сме в соло режим, не правим нищо
        if (window.gameMode !== 'solo') return;

        console.log("🌍 Инициализация на соло режим (RPG отворен свят)");

        // 1. Начален регион (ако няма зададен)
        if (!window.currentRegion) window.currentRegion = "Плиска";

        // 2. Масив за спътници (до 4)
        if (!window.companions) window.companions = [];

        // 3. Куестове
        if (!window.activeQuests) window.activeQuests = [];
        if (!window.completedQuests) window.completedQuests = [];

        // 4. Построяване на връзките между регионите (съседство)
        buildRegionConnections();

        // 5. Добавяне на бутон за куестове в интерфейса
        addQuestsButton();

        // 6. Патч на функцията за инспекция на регион – добавяме "Пътуване" и "Намери спътник"
        patchRegionInspection();

        // 7. Патч на hireNewHero – блокиране на наемане на герои в соло режим
        patchHireHero();

        // 8. Патч на getHeroes списъците – да връщат само главния герой и спътниците
        patchHeroLists();

        console.log("✅ Соло режимът е активен. Използвайте картата, за да пътувате между регионите.");
    }

    // ==================== ВРЪЗКИ МЕЖДУ РЕГИОНИТЕ ====================
    function buildRegionConnections() {
        // Ако вече има, не презаписваме
        if (window.regionConnections) return;

        window.regionConnections = {};

        // За предварително дефинираните региони създаваме връзки въз основа на реална география (приблизително)
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
            "Пекин": ["Нанкин", "Сиан", "Хангжу"],
            // ... може да добавите още
        };

        // Копираме предварителните връзки
        for (let reg in predefinedConnections) {
            if (window.worldData.regions[reg]) {
                window.regionConnections[reg] = predefinedConnections[reg].filter(name => window.worldData.regions[name]);
            }
        }

        // За процедурно генерираните региони създаваме случайни връзки (макс 4 съседа)
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

    // ==================== НАВИГАЦИЯ – ПЪТУВАНЕ ====================
    function patchRegionInspection() {
        // Запазваме оригиналната функция, ако съществува
        const originalInspect = window.inspectRegion;
        if (!originalInspect) return;

        window.inspectRegion = function(regionName) {
            // Извикваме оригиналната инспекция
            originalInspect(regionName);

            // След като се покаже модалът, добавяме бутони за пътуване и намиране на спътник
            setTimeout(() => {
                const modal = document.getElementById('region-inspect-overlay');
                if (!modal) return;

                const actionDiv = modal.querySelector('#action-div') || modal.querySelector('.modal-content div:last-child');
                if (!actionDiv) return;

                // Проверка дали вече има бутон за пътуване
                if (document.getElementById('solo-travel-btn')) return;

                const isConnected = window.regionConnections[window.currentRegion] && window.regionConnections[window.currentRegion].includes(regionName);
                const isCurrent = (window.currentRegion === regionName);

                if (!isCurrent) {
                    const travelBtn = document.createElement('button');
                    travelBtn.id = 'solo-travel-btn';
                    travelBtn.innerText = isConnected ? `🚶 Пътувай до ${regionName}` : `🚫 Няма пряк път до ${regionName} (търсете път през съседни региони)`;
                    travelBtn.style.cssText = `background:${isConnected ? '#2c5a2a' : '#5a2a2a'}; border:none; border-bottom:2px solid #1e3a1e; padding:8px 20px; border-radius:40px; color:white; cursor:${isConnected ? 'pointer' : 'not-allowed'}; font-weight:bold; width:100%; margin-bottom:10px;`;
                    if (isConnected) {
                        travelBtn.onclick = () => {
                            window.currentRegion = regionName;
                            modal.remove();
                            if (window.showAdvisorMsg) window.showAdvisorMsg(`🚶 Пристигнахте в ${regionName}.`);
                            if (window.openRegionsMap) window.openRegionsMap(); // обновява картата
                        };
                    }
                    actionDiv.appendChild(travelBtn);
                }

                // Бутон за намиране на спътник (само ако имаме по-малко от 4)
                if (window.companions.length < 4) {
                    const recruitBtn = document.createElement('button');
                    recruitBtn.innerText = `👥 Търси спътник в ${regionName}`;
                    recruitBtn.style.cssText = `background:#daa520; border:none; border-bottom:2px solid #b8860b; padding:8px 20px; border-radius:40px; color:#000; cursor:pointer; font-weight:bold; width:100%; margin-bottom:10px;`;
                    recruitBtn.onclick = () => {
                        recruitCompanion(regionName);
                        modal.remove();
                    };
                    actionDiv.appendChild(recruitBtn);
                }
            }, 50);
        };
    }

    // ==================== СПЪТНИЦИ ====================
    function recruitCompanion(regionName) {
        if (window.companions.length >= 4) {
            if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Вече имате максимален брой спътници (4).");
            return;
        }

        // Пул от възможни спътници (имена, класове, сила)
        const companionPool = [
            { name: "Аспарух", class: "Воевода", power: 110, icon: "⚔️" },
            { name: "Тервел", class: "Паладин", power: 120, icon: "🛡️" },
            { name: "Крум", class: "Берсерк", power: 130, icon: "🗡️" },
            { name: "Омуртаг", class: "Строител", power: 100, icon: "🏗️" },
            { name: "Борис", class: "Просветител", power: 105, icon: "📖" },
            { name: "Симеон", class: "Маг", power: 125, icon: "🔮" },
            { name: "Петър", class: "Търговец", power: 95, icon: "💰" },
            { name: "Иван Асен", class: "Владетел", power: 115, icon: "👑" },
            { name: "Калоян", class: "Ромеобоец", power: 135, icon: "🐉" },
            { name: "Александър", class: "Завоевател", power: 140, icon: "🏆" }
        ];
        let available = companionPool.filter(c => !window.companions.some(comp => comp.name === c.name));
        if (available.length === 0) available = companionPool;
        let randomComp = available[Math.floor(Math.random() * available.length)];

        // Създаваме нов герой-спътник
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

        if (window.showAdvisorMsg) window.showAdvisorMsg(`👥 НОВ СПЪТНИК: ${randomComp.name} (${randomComp.class}) се присъедини към вас!`);
        if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
        if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    }

    // ==================== БЛОКИРАНЕ НА НАЕМАНЕ НА ГЕРОИ ====================
    function patchHireHero() {
        if (typeof window.hireNewHero !== 'function') return;
        const originalHire = window.hireNewHero;
        window.hireNewHero = function() {
            alert("В соло режим не можете да наемате допълнителни герои. Можете да намирате спътници в различните региони (до 4).");
        };
    }

    // ==================== ПАТЧ НА СПИСЪЦИТЕ С ГЕРОИ ====================
    function patchHeroLists() {
        // Патч на getAllHeroes (ui.js)
        if (typeof window.getAllHeroes === 'function') {
            const originalGetAll = window.getAllHeroes;
            window.getAllHeroes = function() {
                let heroes = originalGetAll();
                if (window.gameMode === 'solo') {
                    // Връщаме само главния герой + спътниците
                    let main = heroes.find(h => h.id === window.currentHero.clan);
                    let comps = heroes.filter(h => h.isCompanion === true);
                    return main ? [main, ...comps] : comps;
                }
                return heroes;
            };
        }

        // Патч на renderTop6LeadersUI (ui.js) – да показва главния герой и спътниците
        if (typeof window.renderTop6LeadersUI === 'function') {
            const originalRender = window.renderTop6LeadersUI;
            window.renderTop6LeadersUI = function() {
                if (window.gameMode === 'solo') {
                    const eliteBar = document.getElementById('top-elite-bar');
                    if (!eliteBar) return;
                    let heroes = window.getAllHeroes ? window.getAllHeroes() : [];
                    heroes = heroes.filter(h => h.isCompanion || h.id === window.currentHero.clan);
                    // Рендерираме само тях (до 6)
                    // ... (може да ползваме оригиналния render, но с филтрирани герои)
                    eliteBar.innerHTML = "";
                    heroes.slice(0, 6).forEach(hero => {
                        const card = document.createElement('div');
                        card.className = "elite-hero-card";
                        card.style.cssText = "background: rgba(0,0,0,0.6); border-radius: 12px; padding: 6px 12px; min-width: 100px; text-align: center; cursor: pointer; border: 1px solid #c9a87b;";
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

    // ==================== КУЕСТОВЕ ====================
    function addQuestsButton() {
        // Добавяме бутон в горната лента или в долното меню
        let container = document.querySelector('.top-bar-controls');
        if (!container) container = document.getElementById('bottom-controls');
        if (!container) return;

        if (document.getElementById('solo-quests-btn')) return;
        const questBtn = document.createElement('button');
        questBtn.id = 'solo-quests-btn';
        questBtn.className = 'glass-btn';
        questBtn.innerHTML = '📜 Куестове';
        questBtn.onclick = () => showQuestsUI();
        container.appendChild(questBtn);
    }

    function showQuestsUI() {
        // Опростен прозорец с куестове
        const modal = document.createElement('div');
        modal.id = 'solo-quests-modal';
        modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:200000; display:flex; justify-content:center; align-items:center;`;
        let html = `<div style="background:#1a1a2e; border:2px solid #d4af37; border-radius:24px; padding:20px; max-width:500px; width:90%; max-height:80vh; overflow-y:auto;"><h2 style="color:#ffd700;">📜 Активни куестове</h2>`;
        if (window.activeQuests.length === 0) {
            html += `<p style="color:#aaa;">Няма активни куестове. Открийте нови, докато изследвате света!</p>`;
        } else {
            window.activeQuests.forEach((q, idx) => {
                html += `<div style="background:#0d0a07; border-radius:16px; padding:12px; margin-bottom:10px;">
                            <div><strong style="color:#ffd700;">${q.title}</strong></div>
                            <div style="font-size:12px;">${q.desc}</div>
                            <div style="font-size:10px; color:#88ff88;">Награда: ${q.reward}</div>
                            <progress value="${q.progress}" max="${q.target}" style="width:100%; margin-top:6px;"></progress>
                         </div>`;
            });
        }
        html += `<button id="close-quests-btn" style="margin-top:15px; background:#2c1a0c; border:none; border-radius:30px; padding:8px; width:100%; color:#ffd700;">Затвори</button></div>`;
        modal.innerHTML = html;
        document.body.appendChild(modal);
        modal.querySelector('#close-quests-btn').onclick = () => modal.remove();
        modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
    }

    // Примерни куестове (може да се добавят динамично)
    window.addQuest = function(title, desc, reward, target, checkFunction) {
        window.activeQuests.push({
            id: Date.now(),
            title, desc, reward, target, progress: 0,
            check: checkFunction
        });
    };

    // След всяка битка или събитие проверяваме куестовете
    if (typeof window.afterBattle === 'function') {
        const originalAfterBattle = window.afterBattle;
        window.afterBattle = function(...args) {
            originalAfterBattle(...args);
            checkQuestsProgress();
        };
    } else {
        window.checkQuestsProgress = function() {
            // Може да се извиква ръчно
        };
    }
})();
