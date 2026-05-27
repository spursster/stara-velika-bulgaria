// ==================== CHARACTER EVOLUTION SYSTEM ====================
// ВЕРСИЯ: 3.0 – 100 ДИНАМИЧНИ ТРАЙТА, ЛОГИЧЕСКА ХИБРИДИЗАЦИЯ И ДЕЙСТВИЯ

const TRAIT_CATEGORIES = {
    AGGRESSION: 'agg', // Attack/Risk
    LOYALTY: 'loy',    // Friendship/Alliances
    AMBITION: 'amb',   // Expansion/Wealth
    DIPLOMACY: 'dip',  // Trade/Peace
    RATIONALITY: 'rat' // Predictability
};

const TRAIT_DESCRIPTORS = [
    "Смел", "Предпазлив", "Безмилостен", "Честен", "Хитър", 
    "Справедлив", "Алчен", "Благороден", "Импулсивен", "Търпелив"
];

function generate100Traits() {
    const traits = [];
    Object.values(TRAIT_CATEGORIES).forEach((cat, catIdx) => {
        for (let i = 0; i < 20; i++) {
            const descriptor = TRAIT_DESCRIPTORS[i % TRAIT_DESCRIPTORS.length];
            traits.push({
                id: `${cat}_${i}`,
                name: `${descriptor} ${cat.toUpperCase()}`,
                cat: cat,
                value: i + 1, // 1 to 20
                effect: (hero) => { hero.heroPower += (i - 10) * 0.1; }
            });
        }
    });
    return traits;
}

window.CHARACTER_TRAITS = generate100Traits();

// Логика за еволюция
window.evolveHero = function(hero) {
    if (!hero) return;
    if (!hero.traits) hero.traits = [];
    
    // Взимане на случаен нов трайт за хибридизация
    const trait2 = window.CHARACTER_TRAITS[Math.floor(Math.random() * window.CHARACTER_TRAITS.length)];
    
    // Хибридизация: комбинира влиянието на старите с новото
    const newTrait = {
        id: `hybrid_${Date.now()}`,
        name: `Хибрид: ${hero.traits.length > 0 ? hero.traits[0].name : "Начало"} + ${trait2.name}`,
        cat: trait2.cat,
        value: 10 + Math.floor((Math.random() * 5)) 
    };
    
    hero.traits.push(newTrait);
    if (hero.traits.length > 5) hero.traits.shift(); 
    
    // Промяна на показателите на героя
    hero.heroPower += (newTrait.value - 10) * 5;
    if (newTrait.cat === TRAIT_CATEGORIES.AGGRESSION) hero.aggression = (hero.aggression || 0) + 0.05;
};

// Функция за автоматизация на героите
window.automateHero = function(hero) {
    if (!hero || !hero.isAuto) return;
    
    // Ако е агресивен, купува армия
    const aggression = hero.traits.filter(t => t.cat === TRAIT_CATEGORIES.AGGRESSION).length;
    if (aggression > 2 && hero.gold > 100) {
        // Случайно купуване на армия
        const troopTypes = ["infantry", "archers", "cavalry"];
        const troopId = troopTypes[Math.floor(Math.random() * troopTypes.length)];
        const qty = Math.floor(hero.gold * 0.1 / 10); // Купува армия за част от златото
        
        if (qty > 0 && window.armyMarket) {
            window.armyMarket.buy(troopId, qty, hero);
        }
    }
};

// Вземане на решение на база личност
window.getHeroAction = function(hero) {
    if (!hero.traits || hero.traits.length === 0) return "neutral";
    
    // Логика на базата на трайтове
    const aggression = hero.traits.filter(t => t.cat === TRAIT_CATEGORIES.AGGRESSION).length;
    const diplomacy = hero.traits.filter(t => t.cat === TRAIT_CATEGORIES.DIPLOMACY).length;
    
    if (aggression > diplomacy) return "attack";
    if (diplomacy > aggression) return "alliance";
    
    return "neutral";
};
