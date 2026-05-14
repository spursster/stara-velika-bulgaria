/**
 * МОДУЛ: МЕХАНИКИ - Велика България (Пълна синхронизация - 13 Рода)
 */

window.dynastyPerks = {
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.2, desc: "+20% Легитимност" },
    "Вокил": { power: 1.1, gold: 1.05, desc: "+10% Мощ и +5% Злато" },
    "Ерми": { power: 1.0, gold: 1.2, desc: "+20% Търговски приходи" },
    "Угаин": { power: 1.15, gold: 1.0, desc: "+15% Атака" },
    "Куригир": { power: 1.0, armyCost: 0.8, desc: "-20% Цена на войската" },
    "Комитопули": { power: 1.15, defense: 1.15, desc: "+15% Защита" },
    "Асеневци": { power: 1.0, recovery: 1.25, desc: "+25% Възстановяване" },
    "Тертер": { power: 1.1, mobility: 1.1, desc: "+10% Мобилност" },
    "Смилец": { power: 1.0, gold: 1.15, desc: "+15% Доход" },
    "Шишмановци": { power: 1.0, buildCost: 0.8, desc: "-20% Сгради" },
    "Македони": { power: 1.2, gold: 1.0, desc: "+20% Бойна мощ" },
    "Птоломеи": { power: 1.0, tech: 1.2, desc: "+20% Знание" },
    "Одриси": { power: 1.0, ritual: 1.3, desc: "+30% Ритуална мощ" }
};

window.getPerkValue = function(perkType) {
    if (!window.currentHero || !window.dynastyPerks) return 1.0;
    const perk = window.dynastyPerks[window.currentHero.dynasty];
    return (perk && perk[perkType]) ? perk[perkType] : 1.0;
};
