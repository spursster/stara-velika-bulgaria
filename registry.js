window.Registry = (function () {
  const state = {
    year: GameConfig.startYear,
    turn: 1,
    language: GameConfig.defaultLanguage,

    dynasties: [],
    rulers: [],
    civilizations: [],
    items: [],
    abilities: [],
    units: [],
    gods: [],
    rituals: [],
    creatures: [],
    disasters: [],
    events: [],

    council: [],
    notifications: [],
    armies: [],
    expeditions: [],

    // настройки за автоматичен режим
    npcAutomation: true,
  };

  return {
    get(key) {
      return state[key];
    },
    set(key, value) {
      state[key] = value;
    },
    patch(partial) {
      Object.assign(state, partial);
    },
    dump() {
      return JSON.parse(JSON.stringify(state));
    },
  };
})();
