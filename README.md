<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Велика България – Стратегическа Игра</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
  <style>
    /* ==================== ОСНОВНИ СТИЛОВЕ ==================== */
    :root {
      --bg-dark: #0a0a12; --bg-glass: rgba(20,20,35,0.85); --gold: #d4af37;
      --gold-light: #ffd700; --text-main: #e0e0e0; --radius: 12px;
      --font-main: 'Montserrat', sans-serif; --font-header: 'Cinzel', serif;
      --top-h: 64px; --bottom-h: 60px;
    }
    *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0; padding: 0; height: 100vh;
      background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJuReyp2P1EHVmb8i_LXu6AQhvvvByWOCKKl4sVeQTuIKnvmu0dZ64-jCPAw7hisWSrzei_lJeAS3tvQvYHuV5vKWGvc4ZRWsd5XZpgkX-KbUA0o9C2MMXiV1H0NGzVhJEj1iRxeT67HYEAe1VTmjmeI__JKiOCkz6hVVbo6O7gbqfsABylSvdnA-P7VAq/s3072/_d012d68d-c196-4d76-be3e-0a44b9f7ccfa.jpeg') no-repeat center/cover fixed;
      font-family: var(--font-main); color: var(--text-main); overflow-x: hidden;
    }
    #app-wrapper { display: flex; flex-direction: column; height: 100vh; position: relative; }
    
    /* ГОРНА ЛЕНТА */
    #top-bar {
      height: var(--top-h); background: var(--bg-glass); backdrop-filter: blur(10px);
      border-bottom: 2px solid var(--gold); padding: 0 12px;
      display: flex; align-items: center; justify-content: space-between; z-index: 100; flex-shrink: 0;
    }
    .top-left, .top-right { display: flex; align-items: center; gap: 8px; }
    .game-logo { font-family: var(--font-header); color: var(--gold-light); font-size: 0.95rem; letter-spacing: 1px; }
    .top-stats { display: flex; gap: 6px; overflow-x: auto; flex: 1; justify-content: center; padding: 0 8px; }
    .stat-box { font-family: var(--font-header); font-weight: 700; color: var(--gold-light); font-size: 0.85rem; white-space: nowrap; display: flex; align-items: center; gap: 4px; }
    .icon-btn { background: none; border: none; font-size: 1.3rem; color: var(--gold-light); cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; }
    .icon-btn:hover { background: rgba(255,215,0,0.15); transform: scale(1.1); }
    
    /* СТРАНИЧНО МЕНЮ */
    #side-menu {
      position: fixed; top: 0; left: 0; width: 260px; height: 100%; background: var(--bg-glass);
      backdrop-filter: blur(14px); border-right: 2px solid var(--gold); padding: 16px;
      z-index: 200; transform: translateX(-100%); transition: transform 0.3s ease;
    }
    #side-menu.visible { transform: translateX(0); }
    #side-menu.hidden { display: none; }
    .menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--gold); font-family: var(--font-header); color: var(--gold-light); font-size: 1.2rem; }
    .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .menu-item {
      background: rgba(255,215,0,0.05); border: 1px solid rgba(212,175,55,0.3); color: var(--text-main);
      padding: 10px; border-radius: var(--radius); cursor: pointer; transition: 0.2s; text-align: center; font-weight: 500;
    }
    .menu-item:hover { background: rgba(212,175,55,0.15); border-color: var(--gold-light); transform: translateX(5px); }
    #menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 150; backdrop-filter: blur(4px); }
    #menu-overlay.hidden { display: none; }
    
    /* ЛЕНТА С ГЕРОИ */
    #hero-bar { background: rgba(10,10,15,0.6); padding: 8px 0; border-bottom: 1px solid rgba(212,175,55,0.3); flex-shrink: 0; }
    #hero-list { display: flex; gap: 10px; padding: 0 16px; overflow-x: auto; scrollbar-width: none; white-space: nowrap; }
    #hero-list::-webkit-scrollbar { display: none; }
    .hero-card {
      min-width: 85px; padding: 8px; background: var(--bg-glass); border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius); text-align: center; cursor: pointer; transition: all 0.2s;
    }
    .hero-card:hover { transform: translateY(-3px); border-color: var(--gold); }
    .hero-img { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--gold-dark); margin: 0 auto 6px; object-fit: cover; background: #222; }
    .hero-name { font-size: 0.75rem; font-weight: bold; color: var(--gold-light); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .hero-level { font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px; }
    .hero-hp-bar { height: 3px; background: #222; border-radius: 2px; overflow: hidden; }
    .hero-hp-fill { height: 100%; background: linear-gradient(90deg, #4caf50, #81c784); transition: width 0.3s; }
    
    /* ОСНОВЕН КОНТЕЙНЕР */
    #game-container { display: grid; grid-template-columns: 280px 1fr 280px; gap: 16px; padding: 16px; overflow-y: auto; flex: 1; min-height: 0; }
    #sidebar-left, #sidebar-right { display: flex; flex-direction: column; gap: 12px; }
    #game-main-area {
      background: rgba(10,10,15,0.5); backdrop-filter: blur(10px); border: 1px solid rgba(212,175,55,0.2);
      border-radius: var(--radius); padding: 16px; overflow-y: auto; position: relative;
    }
    .character-card, .clans-section { background: var(--bg-glass); border-radius: var(--radius); padding: 12px; border: 1px solid rgba(212,175,55,0.3); }
    
    /* ЛЕТОПИС & ПОРТАЛ */
    #journal-box { background: var(--bg-glass); border: 1px solid var(--gold); border-radius: var(--radius); padding: 10px; margin-bottom: 12px; max-height: 150px; overflow-y: auto; transition: max-height 0.3s; position: relative; }
    .journal-header { font-family: var(--font-header); color: var(--gold); border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 4px; margin-bottom: 6px; font-weight: bold; font-size: 0.9rem; }
    .journal-content p { margin: 4px 0; padding-left: 8px; border-left: 2px solid var(--gold); font-size: 0.85rem; line-height: 1.4; }
    .fab-btn { position: absolute; bottom: -12px; right: 12px; width: 24px; height: 24px; background: var(--gold); border: none; border-radius: 50%; cursor: pointer; font-weight: bold; color: #000; }
    .portal-widget {
      position: absolute; top: 10px; right: 10px; background: rgba(50,0,80,0.75); border: 1px solid #a020f0;
      border-radius: var(--radius); padding: 6px 10px; display: flex; align-items: center; gap: 6px;
      font-size: 0.8rem; color: #e0b0ff; cursor: pointer; animation: pulse 2s infinite; z-index: 50;
    }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 5px #a020f0; } 50% { box-shadow: 0 0 15px #a020f0; } }
    .portal-widget.hidden { display: none; }
    
    #content-area { min-height: 200px; text-align: center; padding-top: 20px; }
    .welcome-screen h1 { font-family: var(--font-header); color: var(--gold-light); margin: 0 0 10px; font-size: 2rem; }
    .welcome-screen p { color: #aaa; font-size: 1.1rem; margin-bottom: 25px; }
    .main-action {
      background: linear-gradient(135deg, var(--gold-dark), var(--gold-primary));
      border: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 1.1rem;
      cursor: pointer; margin-top: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); color: #000;
    }
    
    /* ДОЛНА ЛЕНТА */
    #bottom-nav {
      height: var(--bottom-h); background: var(--bg-glass); backdrop-filter: blur(10px);
      border-top: 2px solid var(--gold); display: flex; justify-content: space-around; align-items: center;
      padding: 8px 0; flex-shrink: 0; z-index: 100;
    }
    .nav-btn { background: none; border: none; font-size: 1.4rem; color: #777; cursor: pointer; transition: 0.2s; }
    .nav-btn.active { color: var(--gold-light); transform: translateY(-4px); }
    .nav-btn.fab {
      background: var(--gold); color: #000; width: 48px; height: 48px; border-radius: 50%;
      font-size: 1.8rem; margin-top: -24px; border: 3px solid var(--bg-dark); box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }
    .nav-btn.fab:active { transform: scale(0.92); }
    
    /* БУТОНИ */
    .menu-btn, .action-btn {
      background: rgba(30,30,30,0.9); border: 1px solid rgba(212,175,55,0.5); color: var(--gold);
      padding: 12px 20px; font-family: var(--font-header); cursor: pointer; border-radius: 8px; transition: 0.3s;
    }
    .menu-btn:hover, .action-btn:hover { border-color: var(--gold-light); background: rgba(212,175,55,0.15); }
    
    /* МОДАЛИ */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 300000;
      display: flex; align-items: center; justify-content: center; padding: 16px;
    }
    .modal-content {
      background: #151520; border: 2px solid var(--gold); border-radius: 24px;
      padding: 20px; max-width: 600px; width: 95%; max-height: 85vh; overflow-y: auto;
      box-shadow: 0 0 50px rgba(212,175,55,0.2);
    }
    
    /* АДАПТИВЕН ДИЗАЙН */
    @media (max-width: 768px) {
      #game-container { grid-template-columns: 1fr; padding: 10px; }
      #sidebar-left, #sidebar-right { order: 2; }
      #game-main-area { order: 1; min-height: 400px; }
      .game-logo { display: none; }
      .top-stats { justify-content: flex-start; }
      .stat-box { font-size: 0.75rem; padding: 2px 4px; }
      #bottom-nav { display: flex; }
      #menu-toggle { display: block; }
    }
    @media (min-width: 769px) {
      #bottom-nav, #side-menu, #menu-overlay { display: none !important; }
      .top-bar-controls { display: flex; gap: 10px; }
      #game-wrapper {
        grid-template-rows: var(--top-h) auto auto;
        grid-template-columns: 280px 1fr 280px;
        height: calc(100vh - var(--top-h));
        overflow: hidden;
      }
      #hero-bar { grid-column: 1 / -1; }
      #game-main-area { 
        grid-column: 1 / -1; 
        max-height: calc(100vh - var(--top-h) - 100px);
        background: var(--bg-glass); border-radius: 16px; margin: 16px;
        border: var(--border-gold); backdrop-filter: blur(8px);
      }
    }
  </style>
</head>
<body>
  <div id="app-wrapper">
    <!-- ГОРНА ЛЕНТА -->
    <header id="top-bar">
      <div class="top-left">
        <button id="menu-toggle" class="icon-btn" aria-label="Меню">☰</button>
        <span class="game-logo">ВЕЛИКА БЪЛГАРИЯ</span>
      </div>
      <div class="top-stats">
        <span class="stat-box">⚔️ <span id="val-army">0</span></span>
        <span class="stat-box">💰 <span id="val-gold">0</span></span>
        <span class="stat-box">💪 <span id="val-hero-power">100</span></span>
        <span class="stat-box">⏳ <span id="current-time-info">...</span></span>
      </div>
      <div class="top-right">
        <button id="power-indicator" class="icon-btn">👑</button>
      </div>
    </header>

    <!-- СТРАНИЧНО МЕНЮ -->
    <nav id="side-menu" class="hidden">
      <div class="menu-header">
        <span>⚙️ МЕНЮ</span>
        <button id="menu-close" class="icon-btn">✕</button>
      </div>
      <div class="menu-grid">
        <button class="menu-item" id="btn-tavern">🏰 Таверна</button>
        <button class="menu-item" id="btn-barracks">⚔️ Казарми</button>
        <button class="menu-item" id="btn-diplomacy">💍 Дипломация</button>
        <button class="menu-item" id="btn-expeditions">🧭 Експедиции</button>
        <button class="menu-item" id="btn-events">📜 Събития</button>
        <button class="menu-item" id="btn-market">🛒 Пазар</button>
      </div>
    </nav>
    <div id="menu-overlay" class="hidden"></div>

    <!-- ЛЕНТА С ГЕРОИ -->
    <section id="hero-bar">
      <div id="hero-list" class="hero-scroll"></div>
      <div id="hero-bar-progress" class="progress-track"><div class="progress-fill"></div></div>
    </section>

    <!-- ОСНОВЕН КОНТЕЙНЕР -->
    <main id="game-container">
      <aside id="sidebar-left">
        <div id="active-character-profile" class="character-card">
          <div style="text-align:center; color:#888;">Избери герой...</div>
        </div>
        <div id="clans-container" class="clans-section"></div>
      </aside>

      <section id="game-main-area">
        <div id="journal-box">
          <div class="journal-header">📜 ЛЕТОПИС</div>
          <div id="advisor-journal" class="journal-content">
            <p class="placeholder">Добре дошли, Кане...</p>
          </div>
          <button id="toggle-journal" class="fab-btn">↕</button>
        </div>
        <div id="portal-indicator-container" class="portal-widget hidden">
          <span class="portal-icon">🌀</span>
          <span id="portal-status" class="portal-text">Портал: Затворен</span>
        </div>
        <div id="content-area">
          <div class="welcome-screen">
            <h1>ЕВАЛА ДАРА!</h1>
            <p>Води своя род към величие</p>
            <button id="btn-start-quest" class="action-btn main-action">► ХОД</button>
          </div>
        </div>
      </section>

      <aside id="sidebar-right"></aside>
    </main>

    <!-- ДОЛНА НАВИГАЦИЯ -->
    <footer id="bottom-nav">
      <button class="nav-btn active" data-tab="home">🏠</button>
      <button class="nav-btn" data-tab="map">🗺️</button>
      <button class="nav-btn fab" id="nav-action">+</button>
      <button class="nav-btn" data-tab="battle">⚔️</button>
      <button class="nav-btn" data-tab="profile">👤</button>
    </footer>
  </div>

  <script>
    // ==================== ЯДРО НА ИГРАТА ====================
    window.rpgDatabase = window.rpgDatabase || {};
    window.rpgDatabase.getXPRequiredForLevel = function(level) {
      return Math.floor(100 + (level - 1) * 50 + Math.pow(level - 1, 1.5) * 5);
    };
    window.rpgDatabase.petsDatabase = {
      "falcon": { id: "falcon", name: "Родов Сокол", icon: "🦅", desc: "Тактическа бойна мощ: +15% обща сила при щурм." },
      "wolf": { id: "wolf", name: "Вълк Единак", icon: "🐺", desc: "Удар на глутницата: +10% шанс за критичен удар." },
      "stallion": { id: "stallion", name: "Степен Жребец", icon: "🐎", desc: "Конна тактика: Намалява щетите над войската с 15%." },
      "bear": { id: "bear", name: "Балканска Мечка", icon: "🐻", desc: "Родова мощ: Повишава издръжливостта на армията при защита с 20%." },
      "viper": { id: "viper", name: "Усойница", icon: "🐍", desc: "Отровено острие: Премахва 5% от вражеската защита на ход." },
      "dragonling": { id: "dragonling", name: "Млад дракон", icon: "🐉", desc: "Огнено дихание: +20% щети при атака." },
      "phoenix": { id: "phoenix", name: "Феникс", icon: "🔥", desc: "Възкресение: 30% шанс да се съживи след смърт." }
    };

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    window.initializeHeroRPGData = function(hero) {
      if (!hero) return;
      hero.level = hero.level || 1;
      hero.xp = hero.xp || 0;
      hero.storedXP = hero.storedXP || 0;
      hero.skillPoints = hero.skillPoints || 0;
      hero.skills = hero.skills || {};
      hero.currentClass = hero.currentClass || "Багатур";
      hero.heroPower = hero.heroPower || 150;
      hero.isAuto = (hero.isAuto !== undefined) ? hero.isAuto : true;
      hero.army = hero.army || 0;
      hero.battlesWon = hero.battlesWon || 0;
      hero.battlesLost = hero.battlesLost || 0;
      if (!hero.equipment) hero.equipment = Array(12).fill(null);
      if (!hero.inventory) hero.inventory = [];
      if (hero.pet === undefined) hero.pet = null;
      if (hero.learnedSkills === undefined) hero.learnedSkills = {};
      if (hero.titles === undefined) hero.titles = [];
      if (hero.prestige === undefined) hero.prestige = 0;
      if (!hero.actionLog) hero.actionLog = [];
      if (hero.morale === undefined) hero.morale = 50;
      let endurance = (hero.skills && hero.skills.endurance) || 0;
      let levelBonus = (hero.level - 1) * 20;
      let newMaxHp = 100 + levelBonus + endurance * 15;
      if (isNaN(newMaxHp) || newMaxHp <= 0) newMaxHp = 100;
      hero.maxHp = newMaxHp;
      if (isNaN(hero.hp) || hero.hp === undefined || hero.hp > hero.maxHp) hero.hp = hero.maxHp;
      hero.isAlive = true;
    };

    // ==================== ОПИТ И НИВА ====================
    window.gainHeroXP = function(hero, amount) {
      if (!hero) return;
      window.initializeHeroRPGData(hero);
      if (hero.isAuto) {
        hero.xp += amount;
        let requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        let leveledUp = false;
        while (hero.xp >= requiredXP && hero.level < 100) {
          hero.xp -= requiredXP;
          hero.level++;
          hero.skillPoints++;
          hero.heroPower += 25;
          leveledUp = true;
          requiredXP = window.rpgDatabase.getXPRequiredForLevel(hero.level);
        }
        if (leveledUp) {
          let oldMaxHp = hero.maxHp;
          let endurance = hero.skills?.endurance || 0;
          let newMaxHp = 100 + (hero.level - 1) * 20 + endurance * 15;
          hero.maxHp = newMaxHp;
          hero.hp = hero.hp + (newMaxHp - oldMaxHp);
          if (hero.hp > hero.maxHp) hero.hp = hero.maxHp;
          // ✅ ФИЛТЪР: Само за любими герои
          // if (window.addHeroLog) window.addHeroLog(hero, "⬆️", `Достигна ниво ${hero.level}`);
          // if (window.addWorldEvent) {
          //   window.addWorldEvent("🆙 НИВО НАГОРЕ", `${hero.name} достигна Ниво ${hero.level}! (+1 точка умения)`, "🆙");
          // }
        }
      } else {
        hero.storedXP += amount;
        // window.consumeStoredXPForHero(hero);
      }
    };

    // ==================== ИКОНКА ЗА КЛАС ====================
    window.getClassIcon = function(className) {
      if (!className) return "⚔️";
      const lower = className.toLowerCase();
      if (lower.includes("маг") || lower.includes("колобър") || lower.includes("мистик") || lower.includes("wizard") || lower.includes("mage")) return "🧙";
      if (lower.includes("магьосница")) return "🧙‍♀️";
      if (lower.includes("стрелец") || lower.includes("арчер") || lower.includes("archer") || lower.includes("ranger")) return "🏹";
      if (lower.includes("върховен") || lower.includes("боил") || lower.includes("king") || lower.includes("lord") || lower.includes("владетел")) return "👑";
      if (lower.includes("владетелка")) return "👸";
      if (lower.includes("жрица")) return "🕊️";
      if (lower.includes("воителка")) return "⚔️";
      if (lower.includes("лечителка")) return "💚";
      if (lower.includes("търговка")) return "💰";
      if (lower.includes("паладинка")) return "🛡️";
      if (lower.includes("нощен") || lower.includes("острие") || lower.includes("сенчест") || lower.includes("shadow") || lower.includes("assassin")) return "🗡️";
      if (lower.includes("иконом") || lower.includes("търговец") || lower.includes("merchant") || lower.includes("trader")) return "💰";
      if (lower.includes("кръвожаден") || lower.includes("blood")) return "🩸";
      if (lower.includes("пазител") || lower.includes("guardian") || lower.includes("paladin")) return "🛡️";
      if (lower.includes("берсерк") || lower.includes("berserker")) return "😠";
      if (lower.includes("воевод") || lower.includes("voivode")) return "⚔️";
      if (lower.includes("легенда") || lower.includes("legend")) return "⭐";
      if (lower.includes("герой") || lower.includes("hero")) return "🏅";
      return "⚔️";
    };

    // ==================== ГЕНЕРИРАНЕ НА ПОРТРЕТ ====================
    window.generateHeroPortrait = async function(hero, retries = 2) {
      if (!hero) return;
      if (hero.portrait) return hero.portrait;
      const prompt = `fantasy rpg character portrait of ${hero.name} the ${hero.currentClass || hero.className || "warrior"}, digital painting, D&D style, face front, detailed, cinematic lighting, high quality, 512x512`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&seed=${Math.floor(Math.random()*10000)}`;
      const attempt = async (remaining) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            hero.portrait = url;
            resolve(url);
          };
          img.onerror = () => {
            if (remaining > 0) setTimeout(() => attempt(remaining - 1).then(resolve).catch(reject), 1500);
            else reject(new Error(`Грешка при зареждане на портрет за ${hero.name}`));
          };
          img.src = url;
        });
      };
      try { return await attempt(retries); } catch(e) { console.warn(`❌ ${e.message}`); return null; }
    };

    // ==================== ЛЮБИМИ ГЕРОИ ====================
    let favoriteHeroes = new Set();
    window.favoriteHeroes = favoriteHeroes;
    try {
      let saved = localStorage.getItem('favoriteHeroesFinal');
      if (saved) JSON.parse(saved).forEach(id => favoriteHeroes.add(id));
    } catch(e) {}
    function saveFavorites() { localStorage.setItem('favoriteHeroesFinal', JSON.stringify([...favoriteHeroes])); }
    function isFavorite(id) { return favoriteHeroes.has(id); }
    function toggleFavorite(id) {
      if (favoriteHeroes.has(id)) favoriteHeroes.delete(id);
      else favoriteHeroes.add(id);
      saveFavorites();
      renderSingleBar();
    }

    // ==================== AUTO СИСТЕМА ====================
    let autoState = {};
    try {
      let saved = localStorage.getItem('heroAutoState');
      if (saved) autoState = JSON.parse(saved);
    } catch(e) {}
    function saveAuto() { localStorage.setItem('heroAutoState', JSON.stringify(autoState)); }
    function isAuto(id) { return autoState[id] === true; }
    function setAuto(id, enabled) {
      if (enabled) autoState[id] = true;
      else delete autoState[id];
      saveAuto();
    }

    // ==================== ДАННИ ЗА ГЕРОИТЕ ====================
    function getAllHeroes() {
      let heroes = [];
      if (window.worldData && window.worldData.clans) {
        for (let key in window.worldData.clans) {
          let clan = window.worldData.clans[key];
          if (clan.isJoined === true) {
            heroes.push({
              id: key, name: clan.leaderName || clan.name || key, level: clan.level || 1,
              className: clan.currentClass || "Воевода", xp: clan.xp || 0, storedXP: clan.storedXP || 0,
              isAuto: clan.isAuto !== undefined ? clan.isAuto : true, power: clan.heroPower || 100,
              gold: clan.gold || 1500, army: clan.armySize || 300, skills: clan.skills || {},
              pet: clan.pet || null, skillPoints: clan.skillPoints || 0,
              equipment: clan.equipment || Array(12).fill(null),
              isCompanion: clan.isCompanion === true, portrait: clan.portrait
            });
          }
        }
      }
      if (heroes.length === 0 && window.currentHero) {
        heroes.push({
          id: window.currentHero.clan || "hero", name: window.currentHero.name || "Воевода",
          level: window.currentHero.level || 1, className: window.currentHero.currentClass || "Багатур",
          xp: window.currentHero.xp || 0, storedXP: window.currentHero.storedXP || 0,
          isAuto: window.currentHero.isAuto !== undefined ? window.currentHero.isAuto : true,
          power: window.currentHero.heroPower || 100, gold: window.currentHero.gold || 1500,
          army: window.currentHero.armySize || 500, skills: window.currentHero.skills || {},
          pet: window.currentHero.pet || null, skillPoints: window.currentHero.skillPoints || 0,
          equipment: window.currentHero.equipment || Array(12).fill(null),
          isCompanion: window.currentHero.isCompanion === true, portrait: window.currentHero.portrait
        });
      }
      if (window.gameMode === 'solo') {
        let mainId = window.currentHero ? (window.currentHero.clan || "hero") : null;
        heroes = heroes.filter(h => h.id === mainId || h.isCompanion === true);
      }
      heroes.sort((a,b) => b.level - a.level);
      return heroes;
    }

    // ==================== ПРОФИЛ НА ГЕРОЯ ====================
    window.showHeroProfile = function(hero) {
      let needXP = 100 + (hero.level - 1) * 50;
      let currentXP = hero.isAuto ? (hero.xp || 0) : (hero.storedXP || 0);
      let xpPercent = Math.min(100, Math.floor((currentXP / needXP) * 100));
      let autoOn = isAuto(hero.id);
      let slotNames = ["⚔️ ОРЪЖИЕ", "🛡️ ЩИТ", "🪖 ШЛЕМ", "🦺 НАГРЪДНИК", "🧤 РЪКАВИЦИ", "👖 КРАЧОЛИ", "👢 БОТУШИ", "💍 ПРЪСТЕН", "💍 ПРЪСТЕН 2", "📿 АМУЛЕТ", "🧣 НАМЕТАЛО", "🔱 РЕЛИКВИЯ"];
      let inventoryHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🎒 ЕКИПИРОВКА</h4><div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">';
      for (let i = 0; i < 12; i++) {
        let item = hero.equipment && hero.equipment[i] ? hero.equipment[i] : null;
        let slotName = slotNames[i];
        inventoryHtml += `<div class="equip-slot" data-slot="${i}" style="background:#2c1a0c; border-radius:8px; padding:8px; text-align:center; border:1px solid #c9a87b; cursor:pointer;"><div style="font-size:20px;">${item ? (item.icon || '🔮') : '⬜'}</div><div style="font-size:8px; color:#ffdd99;">${item ? (item.name.length >10?item.name.substring(0,8)+'..':item.name) : slotName}</div></div>`;
      }
      inventoryHtml += '</div></div>';
      let petHtml = '<div style="background:#0d0a07; border-radius:12px; padding:12px; margin-top:10px;"><h4 style="color:#ffdd99; margin:0 0 10px 0;">🐾 ДОМАШЕН ЛЮБИМЕЦ</h4>';
      if (hero.pet && window.rpgDatabase?.petsDatabase?.[hero.pet]) {
        let pet = window.rpgDatabase.petsDatabase[hero.pet];
        petHtml += `<div style="display:flex; align-items:center; gap:12px;"><span style="font-size:32px;">${pet.icon}</span><div><div style="color:#ffaa66;">${pet.name}</div><div style="font-size:10px;">${pet.desc || 'Специален бонус'}</div></div></div>`;
      } else { petHtml += '<div style="color:#aa8866; text-align:center;">Няма любимец</div>'; }
      petHtml += '</div>';
      let autoBtnHtml = `<button id="auto-mode-btn" style="background:${autoOn ? '#4a6a2a' : '#2c1a0c'}; border:none; border-radius:20px; color:#ffdd99; padding:8px 16px; margin-top:10px; cursor:pointer; width:100%;">${autoOn ? '✅ AUTO РЕЖИМ: ВКЛЮЧЕН' : '🤖 AUTO РЕЖИМ: ИЗКЛЮЧЕН'}</button>`;
      let oldModal = document.getElementById('ultimate-profile-modal');
      if (oldModal) oldModal.remove();
      let modal = document.createElement('div');
      modal.id = 'ultimate-profile-modal';
      modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:100000; display:flex; justify-content:center; align-items:center; font-family:'Cinzel',serif;`;
      modal.innerHTML = `
        <div style="background:#1a1a2e; border-radius:24px; padding:20px; max-width:500px; width:90%; max-height:85vh; overflow-y:auto; border:2px solid #c9a87b;">
          <div style="text-align:center;">
            <div style="font-size:48px;">⚔️</div>
            <div style="font-size:22px; font-weight:bold; color:#ffdd99;">${hero.name}</div>
            <div style="color:#ccaa77;">${window.getClassIcon(hero.currentClass)} ${hero.currentClass} · Ниво ${hero.level}</div>
            <div style="background:#2a1a0a; height:8px; border-radius:4px; margin:10px 0;"><div style="background:#d4a373; height:100%; width:${xpPercent}%; border-radius:4px;"></div></div>
            <div style="font-size:11px; color:#ffaa66;">⚡ ${Math.floor(currentXP)}/${needXP} XP</div>
            <div style="margin-top:15px; display:flex; justify-content:space-between; gap:10px;">
              <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>💰 Злато</div><div style="color:#ffdd99;">${hero.gold}</div></div>
              <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>⚔️ Армия</div><div style="color:#ffdd99;">${hero.army}</div></div>
              <div style="background:#0d0a07; border-radius:12px; padding:8px; flex:1;"><div>💪 Сила</div><div style="color:#ffdd99;">${hero.power}</div></div>
            </div>
            ${inventoryHtml}
            ${petHtml}
            ${autoBtnHtml}
            <button id="close-profile-modal" style="background:#2c1a0c; border:none; padding:8px 20px; border-radius:40px; color:#ffdd99; margin-top:15px; cursor:pointer; width:100%;">🔒 ЗАТВОРИ</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('close-profile-modal').onclick = () => modal.remove();
      modal.querySelector('#auto-mode-btn').onclick = () => {
        let newState = !isAuto(hero.id);
        setAuto(hero.id, newState);
        if (window.worldData && window.worldData.clans && window.worldData.clans[hero.id]) window.worldData.clans[hero.id].isAuto = newState;
        hero.isAuto = newState;
        modal.remove();
        showHeroProfile(hero);
      };
    };

    // ==================== ЛЕНТА НА ЕЛИТА ====================
    window.renderTop6LeadersUI = function() {
      const list = document.getElementById('hero-list');
      if (!list) return;
      list.innerHTML = '';
      let heroes = [];
      if (window.worldData && window.worldData.clans) {
        heroes = Object.entries(window.worldData.clans).filter(([k,c]) => c.isJoined).map(([k,c]) => ({...c, id: k}));
      }
      if (window.gameMode === 'solo' && window.currentHero) {
        const main = window.currentHero.clan;
        heroes = heroes.filter(h => h.id === main || h.isCompanion);
      }
      heroes.sort((a,b) => (b.level||1) - (a.level||1));
      const top = heroes.slice(0, 5);
      top.forEach(h => {
        const xp = h.isAuto ? (h.xp||0) : (h.storedXP||0);
        const req = (window.rpgDatabase && typeof window.rpgDatabase.getXPRequiredForLevel === 'function') ? window.rpgDatabase.getXPRequiredForLevel(h.level||1) : 150;
        const pct = Math.min(100, Math.floor((xp/Math.max(1,req))*100));
        const icon = window.getClassIcon(h.currentClass);
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.innerHTML = `
          <img src="${h.portrait || 'https://via.placeholder.com/36'}" class="hero-img" onerror="this.src='https://via.placeholder.com/36?text=${icon}'">
          <div class="hero-name">${h.name || h.leaderName || 'Герой'}</div>
          <div class="hero-level">Lv.${h.level||1}</div>
          <div class="hero-hp-bar"><div class="hero-hp-fill" style="width:${pct}%"></div></div>
        `;
        card.onclick = () => window.showHeroProfile && window.showHeroProfile(h);
        list.appendChild(card);
      });
      const fill = document.querySelector('#hero-bar-progress .progress-fill');
      if (fill && window.currentHero) {
        const cur = window.currentHero.isAuto ? (window.currentHero.xp||0) : (window.currentHero.storedXP||0);
        fill.style.width = `${(cur/Math.max(1,(window.currentHero.level||1)*150))*100}%`;
      }
    };

    // ==================== ОСНОВНО ОБНОВЯВАНЕ ====================
    window.updateCharacterUI = function(hero) {
      if (!hero) return;
      if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
      const g = document.getElementById('val-gold'); if(g) g.innerText = hero.gold || 0;
      const a = document.getElementById('val-army'); if(a) a.innerText = hero.armySize || 0;
      const p = document.getElementById('val-hero-power'); if(p) p.innerText = hero.heroPower || 100;
      const profileBox = document.getElementById('active-character-profile');
      if (profileBox) {
        let petStatus = "Няма";
        if (hero.pet && window.rpgDatabase && window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[hero.pet]) {
          const pet = window.rpgDatabase.petsDatabase[hero.pet];
          petStatus = pet.icon + " " + pet.name;
        }
        profileBox.innerHTML = `
          <div style="text-align:center;">
            <div style="font-weight:bold;font-size:1.2rem;">${hero.name || "Неизвестен"}</div>
            <div>Клан ${hero.clan || "Свободен"} | ${window.getClassIcon(hero.currentClass)} Клас: ${hero.currentClass || "Багатур"}</div>
            <div>Ниво: ${hero.level || 1}</div>
            <div>Възраст: ${hero.age || 50} г.</div>
            <div>Бойна Сила: ⚔️ ${hero.heroPower || 150}</div>
            <div>Свободни точки: ${hero.skillPoints || 0}</div>
            <div>Любимец: ${petStatus}</div>
          </div>`;
      }
      if (hero.portrait) {
        const profileBox = document.getElementById('active-character-profile');
        if (profileBox) {
          let existingImg = profileBox.querySelector('.hero-portrait-img');
          if (!existingImg) {
            const img = document.createElement('img');
            img.className = 'hero-portrait-img';
            img.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px; border: 2px solid #d4af37; object-fit: cover;';
            profileBox.insertBefore(img, profileBox.firstChild);
            existingImg = img;
          }
          existingImg.src = hero.portrait;
        }
      } else {
        const profileBox = document.getElementById('active-character-profile');
        if (profileBox) {
          const oldImg = profileBox.querySelector('.hero-portrait-img');
          if (oldImg) oldImg.remove();
        }
      }
      window.renderTop6LeadersUI();
    };

    // ==================== ЖУРНАЛ НА СЪВЕТНИКА ====================
    window.showAdvisorMsg = function(msg) {
      const journal = document.getElementById('advisor-journal');
      if (!journal) { console.log("Журнал съветник:", msg); return; }
      // ✅ ФИЛТЪР ЗА СЪОБЩЕНИЯ: само ако не е изключена категорията
      const lower = msg.toLowerCase();
      let allowed = false;
      const categories = {
        myHeroes: { enabled: true, keywords: ['героят ви','героите ви','спечели','получи'] },
        otherHeroes: { enabled: true, keywords: ['клан','съперник','враг','нападна'] },
        economy: { enabled: true, keywords: ['злато','търговия','доход','данък'] },
        battles: { enabled: true, keywords: ['битка','победа','загуба','сражение'] },
        diplomacy: { enabled: true, keywords: ['брак','съюз','пленник'] },
        events: { enabled: true, keywords: ['събитие','портал','експедиция'] },
        time: { enabled: true, keywords: ['сезон','година','пролет','лято'] },
        system: { enabled: true, keywords: ['запазване','зареждане'] }
      };
      for(let catKey in categories) {
        const cat = categories[catKey];
        if (!cat.enabled) continue;
        for(let kw of cat.keywords) {
          if(lower.includes(kw.toLowerCase())) { allowed = true; break; }
        }
        if(allowed) break;
      }
      if(!allowed) return; // ❌ Не показвай съобщението
      window.eventHistory.push(msg);
      if (window.eventHistory.length > 50) window.eventHistory.shift();
      journal.innerHTML = window.eventHistory.map(line => `<p>📜 ${line}</p>`).reverse().join('');
    };

    // ==================== ВРЕМЕ ====================
    window.updateTimeUI = function() {
      if (!window.gameTime) return;
      const el = document.getElementById('current-time-info');
      if (!el) return;
      const s = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
      el.innerText = `⏳ ${s[window.gameTime.seasonIndex]} ${window.gameTime.year} г.`;
    };

    // ==================== НАВИГАЦИЯ ====================
    function handleNavClick(id) {
      document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(`nav-${id}`)?.classList.add('active');
      const area = document.getElementById('content-area');
      if (!area) return;
      if (id === 'home') {
        area.innerHTML = `<div class="welcome-screen"><h1>ЕВАЛА ДАРА!</h1><p>Води своя род към величие</p><button id="btn-start-quest" class="action-btn main-action" onclick="if(window.processTime)window.processTime()">► ХОД</button></div>`;
      } else if (id === 'map') {
        area.innerHTML = `<div class="welcome-screen"><h2>🗺️ КАРТА</h2><button class="menu-btn" onclick="if(window.openRegionsMap)window.openRegionsMap()">Отвори Картата</button></div>`;
      } else if (id === 'battle') {
        area.innerHTML = `<div class="welcome-screen"><h2>⚔️ АРЕНА</h2><button class="menu-btn" onclick="if(window.startBattle)window.startBattle('Тестов Регион')">Започни Битка</button></div>`;
      } else if (id === 'profile') {
        if (window.currentHero && window.showHeroProfile) window.showHeroProfile(window.currentHero);
      }
    }

    // ==================== МЕНЮ ====================
    function toggleMenu(show) {
      const menu = document.getElementById('side-menu');
      const overlay = document.getElementById('menu-overlay');
      if (!menu) return;
      if (show) { menu.classList.remove('hidden'); menu.classList.add('visible'); overlay.classList.remove('hidden'); }
      else { menu.classList.add('hidden'); menu.classList.remove('visible'); overlay.classList.add('hidden'); }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    document.addEventListener('DOMContentLoaded', () => {
      // Бутони за меню
      document.getElementById('menu-toggle')?.addEventListener('click', () => toggleMenu(true));
      document.getElementById('menu-close')?.addEventListener('click', () => toggleMenu(false));
      document.getElementById('menu-overlay')?.addEventListener('click', () => toggleMenu(false));
      // Навигация
      document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', () => handleNavClick(btn.getAttribute('data-tab')));
      });
      // Основни бутони
      const btnMap = {
        'btn-tavern': 'openTavernUI', 'btn-barracks': 'openBarracksUI', 'btn-diplomacy': 'openMarriageMenu',
        'btn-expeditions': 'openExpeditionsMenu', 'btn-events': 'openEventsMenu', 'btn-market': 'armyMarket'
      };
      for (const [id, mod] of Object.entries(btnMap)) {
        const btn = document.getElementById(id);
        if (btn) btn.onclick = () => {
          toggleMenu(false);
          if (typeof window[mod] === 'function') window[mod]();
          else if (window[mod] && typeof window[mod].show === 'function') window[mod].show();
        };
      }
      // Старт бутон
      document.getElementById('btn-start-quest')?.addEventListener('click', () => {
        if (window.processTime) window.processTime();
      });
      // Летопис
      document.getElementById('toggle-journal')?.addEventListener('click', function() {
        const box = document.getElementById('journal-box');
        box.style.maxHeight = box.style.maxHeight === '150px' ? '40px' : '150px';
        this.textContent = box.style.maxHeight === '150px' ? '↕' : '↑';
      });
      // Портал индикатор
      const portalBox = document.getElementById('portal-indicator-container');
      if (portalBox) {
        portalBox.onclick = () => window.openExpeditionsMenu && window.openExpeditionsMenu();
        window.updatePortalContainerUI = function() {
          const state = window.currentPortalState;
          if (!state) return portalBox.classList.add('hidden');
          portalBox.classList.remove('hidden');
          document.getElementById('portal-status').textContent = state.isOpen ? '🟢 ОТВОРЕН' : '🔴 ЗАТВОРЕН';
          portalBox.style.borderColor = state.isOpen ? '#00ffcc' : '#a020f0';
        };
      }
      // Стартиране
      if (!window.gameTime) window.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };
      if (!window.worldData) window.worldData = { clans: {} };
      if (!window.currentHero) {
        window.currentHero = {
          name: "Кубрат", clan: "Дуло", gold: 1500, armySize: 400, heroPower: 130,
          level: 1, xp: 0, storedXP: 0, isAuto: true, skillPoints: 0,
          skills: { tactics:0, endurance:0, economy:0, mysticism:0, leadership:0 },
          equipment: Array(12).fill(null), inventory: [], pet: null, age: 30, learnedSkills: {}
        };
        window.initializeHeroRPGData(window.currentHero);
        window.worldData.clans["Дуло"] = window.currentHero;
      }
      window.updateCharacterUI(window.currentHero);
      window.renderTop6LeadersUI();
      window.updateTimeUI();
      console.log("✅ Велика България заредена успешно!");
    });

    // ==================== ПРОЦЕС НА ИГРАТА ====================
    window.processTime = function() {
      if (!window.gameTime) return;
      window.gameTime.seasonIndex = (window.gameTime.seasonIndex + 1) % 4;
      if (window.gameTime.seasonIndex === 0) {
        window.gameTime.year++;
        if (window.showAdvisorMsg) window.showAdvisorMsg(`⏳ Нова година: ${window.gameTime.year} г.`);
      }
      // Автоматичен опит за авто герои
      if (window.currentHero && window.currentHero.isAuto) {
        window.gainHeroXP(window.currentHero, 10 + Math.floor(Math.random() * 20));
      }
      window.updateTimeUI();
      window.updateCharacterUI(window.currentHero);
      if (window.showAdvisorMsg) {
        const seasons = ["🌱 Пролет", "☀️ Лято", "🍂 Есен", "❄️ Зима"];
        window.showAdvisorMsg(`${seasons[window.gameTime.seasonIndex]} ${window.gameTime.year} г. – Родът ти процъфтява!`);
      }
    };
  </script>
</body>
</html>
