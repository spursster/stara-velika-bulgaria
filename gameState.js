/**
 * =========================================================================
 * ВЕЛИКА БЪЛГАРИЯ – ЦЕНТРАЛИЗИРАНО СЪСТОЯНИЕ (GameState)
 * Версия: 1.0
 * 
 * Единствен източник на истина за цялата игра.
 * Всички глобални променливи (worldData, playerRegions, gameTime и т.н.)
 * ще бъдат пренасочени към този обект, без да се нарушава съществуващият код.
 * =========================================================================
 */

(function() {
    // ==================== ВЪТРЕШНО СЪСТОЯНИЕ ====================
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

    // ==================== ПУБЛИЧНИ МЕТОДИ ====================
    const GameState = {
        // Взимане на стойност
        get(key) {
            return _state[key];
        },
        
        // Задаване на стойност (с нотификация)
        set(key, value) {
            const oldValue = _state[key];
            _state[key] = value;
            this.notify(key, oldValue, value);
        },
        
        // Обновяване на множество полета наведнъж
        update(updates) {
            for (let [key, value] of Object.entries(updates)) {
                const oldValue = _state[key];
                _state[key] = value;
                this.notify(key, oldValue, value);
            }
        },
        
        // Проверка дали ключ съществува
        has(key) {
            return key in _state;
        },
        
        // Слушане за промени
        subscribe(key, callback) {
            if (!_state._listeners.has(key)) {
                _state._listeners.set(key, []);
            }
            _state._listeners.get(key).push(callback);
            
            // Връща функция за unsubscribe
            return () => {
                const callbacks = _state._listeners.get(key);
                if (callbacks) {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1) callbacks.splice(index, 1);
                }
            };
        },
        
        // Нотифициране на слушателите
        notify(key, oldValue, newValue) {
            const callbacks = _state._listeners.get(key);
            if (callbacks) {
                callbacks.forEach(cb => {
                    try {
                        cb(oldValue, newValue);
                    } catch(e) {
                        console.error(`Грешка в listener за ${key}:`, e);
                    }
                });
            }
        },
        
        // Запазване на цялото състояние (за save game)
        export() {
            // Връщаме копие, за да не може външен код да променя вътрешното състояние директно
            return JSON.parse(JSON.stringify({
                worldData: _state.worldData,
                playerRegions: _state.playerRegions,
                gameTime: _state.gameTime,
                gameMode: _state.gameMode,
                currentRegion: _state.currentRegion,
                companions: _state.companions,
                unlockedHeroes: _state.unlockedHeroes,
                activeQuests: _state.activeQuests,
                completedQuests: _state.completedQuests,
                currentTurn: _state.currentTurn,
                clanRelations: _state.clanRelations,
                prisoners: _state.prisoners,
                tradeRoutes: _state.tradeRoutes,
                investments: _state.investments,
                economyHistory: _state.economyHistory,
                worldEvents: _state.worldEvents,
                // visitedRegions и activePortals не се запазват (ще се регенерират)
                economySettings: _state.economySettings
            }));
        },
        
        // Зареждане на състояние (от save file)
        import(data) {
            for (let key in data) {
                if (key in _state && key !== '_listeners' && key !== '_initialized') {
                    _state[key] = data[key];
                    this.notify(key, undefined, data[key]);
                }
            }
            // Възстановяване на Set за visitedRegions, ако има данни
            if (data.visitedRegions) {
                _state.visitedRegions = new Set(data.visitedRegions);
            }
            _state._initialized = true;
        },
        
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
    };

    // ==================== ПРОНАСОЧВАНЕ НА СТАРИТЕ ГЛОБАЛНИ ПРОМЕНЛИВИ ====================
    // Това позволява на съществуващия код да продължи да работи, без да се променя,
    // докато постепенно мигрираме към GameState.
    
    // Дефинираме getter/setter за най-често използваните глобални променливи
    const legacyGlobals = [
        'worldData', 'playerRegions', 'gameTime', 'gameMode', 'currentRegion',
        'companions', 'unlockedHeroes', 'activeQuests', 'completedQuests',
        'currentTurn', 'clanRelations', 'prisoners', 'tradeRoutes', 'investments',
        'economyHistory', 'worldEvents', 'economySettings'
    ];
    
    for (let key of legacyGlobals) {
        Object.defineProperty(window, key, {
            get() { return GameState.get(key); },
            set(value) { GameState.set(key, value); },
            configurable: true,
            enumerable: true
        });
    }
    
    // Специални случаи (visitedRegions и activePortals – не са винаги в state, но ги добавяме)
    Object.defineProperty(window, 'visitedRegions', {
        get() { return GameState.get('visitedRegions'); },
        set(value) { GameState.set('visitedRegions', value); },
        configurable: true,
        enumerable: true
    });
    
    Object.defineProperty(window, 'activePortals', {
        get() { return GameState.get('activePortals'); },
        set(value) { GameState.set('activePortals', value); },
        configurable: true,
        enumerable: true
    });
    
    // Експортираме GameState глобално
    window.GameState = GameState;
    
    // Инициализираме стандартни стойности
    GameState.initDefaults();
    
    console.log("✅ gameState.js зареден – централизирано състояние, обратна съвместимост със старите глобални променливи");
})();
