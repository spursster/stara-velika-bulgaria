/**
 * =========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – ЦЕНТРАЛИЗИРАНО СЪСТОЯНИЕ (GameState) GameState клас
 * Версия: 1.0
 * 
 * Единствен източник на истина за цялата игра. Всички глобални променливи
 * ще бъдат пренасочени към този обект, без да се нарушава съществуващият код.
 * =========================================================================
 */

import { EventEmitter } from './eventEmitter.js';

(function() {
    // Вътрешно състояние
    const _state = {
        // Основни данни
        worldData: null,
        playerRegions: [],
        gameTime: { seasonIndex: 0, year: 480, era: "пр.н.е." },
        gameMode: 'classic',
        currentRegion: 'Плиска',
        
        // Герои и спътници
        companions: [],
        unlockedHeroes: [],
        
        // Куестове
        activeQuests: [],
        completedQuests: [],
        
        // Други
        currentTurn: 1,
        clanRelations: {},
        prisoners: [],
        tradeRoutes: [],
        investments: [],
        economyHistory: [],
        worldEvents: [],
        visitedRegions: new Set(),
        activePortals: [],
        
        // Настройки
        economySettings: {
            inflationRate: 0.01,
            investmentReturnBase: 0.12,
            tradeRouteBaseIncome: 50,
            randomEventChance: 0.15,
            autonomousUpgradeChance: 0.25
        },
        
        // Вътрешни флагове
        _initialized: false,
        _listeners: new Map()
    };

    // GameState клас
    class GameState {
        constructor() {
            this._state = _state;
            this._initializeGlobals();
        }

        // Взимане на стойност
        get(key) {
            return this._state[key];
        }
        // Задаване на стойност (с нотификация)
        set(key, value) {
            const oldValue = this._state[key];
            this._state[key] = value;
            this.notify(key, oldValue, value);
        }
        // Обновяване на множество полета наведнъж
        update(updates) {
            for (let [key, value] of Object.entries(updates)) {
                const oldValue = this._state[key];
                this._state[key] = value;
                this.notify(key, oldValue, value);
            }
        }
        // Проверка дали ключ съществува
        has(key) {
            return key in this._state;
        }
        // Слушане за промени
        subscribe(key, callback) {
            if (!this._state._listeners.has(key)) {
                this._state._listeners.set(key, []);
            }
            const callbacks = this._state._listeners.get(key);
            callbacks.push(callback);

            return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1) callbacks.splice(index, 1);
            };
        }
        // Нотифициране на слушателите
        notify(key, oldValue, newValue) {
            const callbacks = this._state._listeners.get(key);
            if (callbacks) {
                callbacks.forEach(callback => {
                    try {
                        callback(oldValue, newValue);
                    } catch(e) {
                        console.error(`Грешка в listener за ${key}:`, e);
                    }
                });
            }
        }
        // Запазване на цялото състояние (за save game)
        export() {
            return JSON.parse(JSON.stringify({
                worldData: this._state.worldData,
                playerRegions: this._state.playerRegions,
                gameTime: this._state.gameTime,
                gameMode: this._state.gameMode,
                currentRegion: this._state.currentRegion,
                companions: this._state.companions,
                unlockedHeroes: this._state.unlockedHeroes,
                activeQuests: this._state.activeQuests,
                completedQuests: this._state.completedQuests,
                currentTurn: this._state.currentTurn,
                clanRelations: this._state.clanRelations,
                prisoners: this._state.prisoners,
                tradeRoutes: this._state.tradeRoutes,
                investments: this._state.investments,
                economyHistory: this._state.economyHistory,
                worldEvents: this._state.worldEvents,
                economySettings: this._state.economySettings
            }));
        }
        // Зареждане на състояние (от save file)
        import(data) {
            for (let key in data) {
                if (key in this._state && key !== '_listeners' && key !== '_initialized') {
                    this._state[key] = data[key];
                    this.notify(key, undefined, data[key]);
                }
            }
            if (data.visitedRegions) {
                this._state.visitedRegions = new Set(data.visitedRegions);
            }
            this._state._initialized = true;
        }
        // Инициализация на начални стойности (ако липсват)
        initDefaults() {
            if (!_state.worldData) _state.worldData = { clans: {}, regions: {} };
            if (!_state.playerRegions.length) _state.playerRegions = ['Плиска'];
            if (!_state.gameTime) _state.gameTime = { seasonIndex: 0, year: 480, era: "пр.н.е." };
            if (!_state.clanRelations) _state.clanRelations = {};
            if (!_state.prisoners) _state.prisoners = [];
            if (!_state.tradeRoutes) _state.tradeRoutes = [];
            if (!_state.investments) _state.investments = [];
            if (!_state.economyHistory) _state.economyHistory = [];
            if (!_state.worldEvents) _state.worldEvents = [];
            _state._initialized = true;
        }

        // Инициализация на глобални променливи
        _initializeGlobals() {
            // Проверка за localStorage
            if (typeof Storage === 'undefined') {
                console.error('Вашият браузър не поддържа localStorage. Функционалността може да е ограничена.');
            }

            // Обратна съвместимост с старите глобални променливи
    const legacyGlobals = [
        'worldData', 'playerRegions', 'gameTime', 'gameMode', 'currentRegion',
        'companions', 'unlockedHeroes', 'activeQuests', 'completedQuests',
        'currentTurn', 'clanRelations', 'prisoners', 'tradeRoutes', 'investments',
        'economyHistory', 'worldEvents', 'economySettings'
    ];
    
    for (let key of legacyGlobals) {
        Object.defineProperty(window, key, {
                    get() {
                        return this.get(key);
                    },
                    set(value) {
                        this.set(key, value);
                    },
            configurable: true,
            enumerable: true
        });
    }
    
            // Специални случаи
    Object.defineProperty(window, 'visitedRegions', {
                get() {
                    return this.get('visitedRegions');
                },
                set(value) {
                    this.set('visitedRegions', value);
                },
        configurable: true,
        enumerable: true
    });
    
    Object.defineProperty(window, 'activePortals', {
                get() {
                    return this.get('activePortals');
                },
                set(value) {
                    this.set('activePortals', value);
                },
        configurable: true,
        enumerable: true
    });
    
    // Инициализираме стандартни стойности
            this.initDefaults();
        }
    }
    
    // Инициализираме GameState
    const gameState = new GameState();

    // Импортираме EventEmitter за нотификации
    window.GameState = gameState;

    // Проверка за localStorage и error handling
    if (typeof Storage === 'undefined') {
        console.error('Вашият браузър не поддържа localStorage. Функционалността може да е ограничена.');
    }

    // Инициализация на GameState
    console.log("✅ gameState.js зареден – централизирано състояние, обратна съвместимост със старите глобални променливи");
})();



