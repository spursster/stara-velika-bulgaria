window.dynastyPerks = {
    "Дуло": { power: 1.0, gold: 1.0, legitimacy: 1.2, recovery: 1.0, desc: "+20% Легитимност" },
    "Комитопули": { power: 1.15, gold: 1.0, defense: 1.15, desc: "+15% Защита" },
    "Асеневци": { power: 1.0, gold: 1.0, recovery: 1.25, desc: "+25% Скорост на възстановяване" },
    "Тертер": { power: 1.1, gold: 1.0, mobility: 1.1, desc: "+10% Мобилност на конницата" },
    "Смилец": { power: 1.0, gold: 1.15, desc: "+15% Доход от злато" },
    "Шишмановци": { power: 1.0, gold: 1.0, buildCost: 0.8, desc: "-20% Цена на строежи" },
    "Македони": { power: 1.2, gold: 1.0, desc: "+20% Бойна мощ" },
    "Птоломеи": { power: 1.0, gold: 1.0, tech: 1.15, desc: "+15% Технологичен прогрес" },
    "Одриси": { power: 1.0, gold: 1.0, ritual: 1.3, desc: "+30% Ефект от Ритуали" },
    "Бесараб": { power: 1.0, gold: 1.0, fear: 1.1, desc: "+10% Страх над врага" },
    "Османци Дуло": { power: 1.0, gold: 1.0, maintenance: 0.85, desc: "-15% Поддръжка на армия" },
    "Вокил": { power: 1.0, gold: 1.0, diplo: 1.2, desc: "+20% Успех в дипломацията" },
    "Угаин": { power: 1.0, gold: 1.0, loyalty: 1.15, desc: "+15% Лоялност на регионите" }
};

window.applyPerk = function(value, type, dynasty) {
    const perk = window.dynastyPerks[dynasty];
    return perk && perk[type] ? value * perk[type] : value;
};
