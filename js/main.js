// main.js
// Основен файл за стартиране на Phaser играта и инициализация на мениджърите.

// Конфигурация на Phaser
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#000000',
  parent: 'game-container',
  scene: [], // сцени ще се регистрират динамично
  audio: {
    disableWebAudio: false
  }
};

// Създаваме играта
window.game = new Phaser.Game(config);
console.log('Phaser game created.');

// Регистриране/стартиране на MapScene (ако е дефинирана)
try {
  if (window.MapSceneClass && window.game && window.game.scene) {
    if (!window.game.scene.keys['MapScene']) {
      window.game.scene.add('MapScene', window.MapSceneClass, true);
      console.log('MapScene registered and started.');
    } else {
      console.log('MapScene already registered.');
    }
  } else {
    console.log('MapSceneClass not found at main.js load time.');
  }
} catch (e) {
  console.warn('Error while registering MapScene:', e);
}

// Ако UIScene е дефиниран (от scene_ui.js), регистрираме го безопасно
try {
  if (window.UISceneClass && window.game && window.game.scene) {
    if (!window.game.scene.keys['UIScene']) {
      window.game.scene.add('UIScene', window.UISceneClass, true);
      console.log('UIScene registered from UISceneClass');
    } else {
      console.log('UIScene already registered');
    }
  } else {
    console.log('UISceneClass not present at main.js load time.');
  }
} catch (e) {
  console.warn('Failed to register UIScene automatically', e);
}

// Инициализация на registry и мениджъри (TurnManager, Explore, Council и т.н.)
(function initRegistryAndManagers() {
  const registry = (window.game && window.game.registry) ? window.game.registry : null;

  if (registry) {
    console.log('Registry found — инициализирам TurnManager и Explore.');
    if (window.TurnManager && typeof window.TurnManager.init === 'function') {
      try {
        window.TurnManager.init({ registry: registry });
        console.log('TurnManager initialized via main.js');
      } catch (e) {
        console.warn('TurnManager init error:', e);
      }
    } else {
      console.log('TurnManager not found at main.js load time.');
    }

    if (window.Explore && typeof window.Explore.init === 'function') {
      try {
        window.Explore.init({ registry: registry });
        console.log('Explore manager initialized via main.js');
      } catch (e) {
        console.warn('Explore init error:', e);
      }
    } else {
      console.log('Explore manager not found at main.js load time.');
    }

    if (window.Council && typeof window.Council.init === 'function') {
      try {
        window.Council.init({ registry: registry });
        console.log('Council initialized via main.js');
      } catch (e) {
        console.warn('Council init error:', e);
      }
    } else {
      console.log('Council not found in registry — UIScene ще се погрижи за инициализацията.');
    }
  } else {
    console.log('Registry not available yet — managers will initialize when registry is ready.');
  }
})();

// Малък helper за рестартиране/resume на AudioContext при първо потребителско действие
(function setupAudioResume() {
  function resumeAudio() {
    try {
      if (window.Howler && Howler.ctx && Howler.ctx.state === 'suspended') Howler.ctx.resume();
    } catch (e) {}
    try {
      if (window.AudioContext && window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();
    } catch (e) {}
    window.removeEventListener('pointerdown', resumeAudio);
  }
  window.addEventListener('pointerdown', resumeAudio);
})();

// Експорт/експониране за тестове и дебъг
window.mainInitialized = true;
