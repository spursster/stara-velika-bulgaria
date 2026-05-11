// js/main.js
// Основен bootstrap за Phaser, стартиране на сцени и инициализация на глобални мениджъри (TurnManager, Explore, Council).
// Потребителят поиска пълен файл за замяна — това е актуализирана версия.

window.gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1200,
  height: 780,
  backgroundColor: '#071021',
  scene: [] // ще попълним след като класовете са дефинирани
};

(function() {
  // Създава Phaser играта след зареждане на страницата и дефиниране на сцените
  function createGame() {
    // Съберете наличните сцени (BootScene, MapScene, UIScene) ако са дефинирани глобално
    const scenes = [];
    if (typeof BootScene !== 'undefined') scenes.push(BootScene);
    if (typeof MapScene !== 'undefined') scenes.push(MapScene);
    if (typeof UIScene !== 'undefined') scenes.push(UIScene);

    // Ако няма сцени, логваме и ще опитаме пак по-късно
    if (scenes.length === 0) {
      console.warn('Няма намерени сцени (BootScene/MapScene/UIScene). Увери се, че js файловете са заредени преди main.js.');
    }

    const config = Object.assign({}, window.gameConfig, { scene: scenes });
    // Създаваме играта и експонираме инстанцията глобално
    try {
      window.game = new Phaser.Game(config);
      console.log('Phaser game created.');
    } catch (e) {
      console.error('Failed to create Phaser game', e);
      return;
    }

    // След създаване: опит за инициализация на TurnManager и Explore когато registry стане наличен.
    // BootScene записва dynasties в registry; изчакаме registry да бъде готово.
    waitForRegistryAndInit(window.game);
  }

  // Периодично проверява за наличието на registry и инициализира глобалните мениджъри.
  function waitForRegistryAndInit(game) {
    let attempts = 0;
    const maxAttempts = 60; // ~60 * 500ms = 30s
    const interval = 500;
    const timer = setInterval(() => {
      attempts++;
      try {
        // Phaser има глобален registry на game, но понякога registry е на сцена; BootScene записва в this.registry (game.registry)
        const registry = (game && game.registry) ? game.registry : (window.game && window.game.registry) ? window.game.registry : null;
        // Ако registry не е налично, опитваме да вземем registry от някоя сцена, ако е стартирана
        let fallbackRegistry = registry;
        if (!fallbackRegistry && game && game.scene) {
          const keys = Object.keys(game.scene.keys || {});
          for (const k of keys) {
            const s = game.scene.getScene(k);
            if (s && s.registry) { fallbackRegistry = s.registry; break; }
          }
        }

        if (fallbackRegistry) {
          clearInterval(timer);
          console.log('Registry found — инициализирам TurnManager и Explore.');

          // Инициализация на TurnManager (ако е наличен)
          if (window.TurnManager && typeof window.TurnManager.init === 'function') {
            try {
              window.TurnManager.init({ registry: fallbackRegistry });
              console.log('TurnManager initialized via main.js');
            } catch (e) {
              console.error('TurnManager init error', e);
            }
          } else {
            console.warn('TurnManager не е намерен (window.TurnManager). Увери се, че js/turn_manager.js е зареден.');
          }

          // Инициализация на Explore manager (ако е наличен)
          if (window.Explore && typeof window.Explore.init === 'function') {
            try {
              window.Explore.init({ registry: fallbackRegistry });
              console.log('Explore manager initialized via main.js');
            } catch (e) {
              console.error('Explore init error', e);
            }
          } else {
            console.warn('Explore manager не е намерен (window.Explore). Увери се, че js/explore.js е зареден.');
          }

          // Ако има Council данни/клас, опитваме да инициализираме и него (без да пренаписваме вече съхранено)
          if (window.Council && typeof window.Council.initFromData === 'function') {
            try {
              // опитваме да заредим от registry (ако има)
              const regCouncil = fallbackRegistry.get('council');
              if (regCouncil) {
                window.Council.initFromData(regCouncil, fallbackRegistry);
                console.log('Council initialized from registry.');
              } else {
                // ако няма, оставяме UIScene да се погрижи (тя опитва fetch на data/council.json или elect)
                console.log('Council not found in registry — UIScene ще се погрижи за инициализацията.');
              }
            } catch (e) {
              console.error('Council init error', e);
            }
          }

          // expose registry globally for quick console debugging
          window.gameRegistry = fallbackRegistry;
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(timer);
          console.warn('Не успях да намеря registry след няколко опита. Увери се, че BootScene стартира и записва данни в registry.');
        }
      } catch (err) {
        console.error('Error while waiting for registry', err);
      }
    }, interval);
  }

  // Стартираме създаването на играта при load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // малък timeout за да сме сигурни, че другите скриптове са заредени
    setTimeout(createGame, 50);
  } else {
    window.addEventListener('load', () => setTimeout(createGame, 50));
  }

  // Удобни глобални helper функции за бързи тестове от конзолата
  window.svb = window.svb || {};
  window.svb.nextTurn = function() {
    if (window.TurnManager && typeof window.TurnManager.nextTurn === 'function') return window.TurnManager.nextTurn();
    console.warn('TurnManager не е наличен.');
  };
  window.svb.startExpedition = function(opts) {
    if (window.Explore && typeof window.Explore.startExpedition === 'function') return window.Explore.startExpedition(opts || {});
    console.warn('Explore manager не е наличен.');
  };
  window.svb.getGameState = function() {
    return (window.TurnManager && window.TurnManager.getState) ? window.TurnManager.getState() : (window.gameState || {});
  };

})();
