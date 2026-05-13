const unitTypes = {
    "ЛЕКА_ПЕХОТА": { 
        name: { bg: "Леки пехотинци", en: "Light Infantry", ru: "Легкая пехота" }, 
        cost: 100, 
        power: 15, 
        description: { 
            bg: "Бързи и евтини за поддръжка.", 
            en: "Fast and cheap to maintain.", 
            ru: "Быстрые и дешевые в обслуживании." 
        } 
    },
    "КОННИЦА": { 
        name: { bg: "Елитна конница", en: "Elite Cavalry", ru: "Элитная конница" }, 
        cost: 300, 
        power: 50, 
        description: { 
            bg: "Основната ударна мощ на античните българи.", 
            en: "The main striking force of the Ancient Bulgarians.", 
            ru: "Основная ударная сила античных булгар." 
        } 
    },
    "СТРЕЛЦИ": { 
        name: { bg: "Стрелци с лък", en: "Archers", ru: "Лучники" }, 
        cost: 150, 
        power: 25, 
        description: { 
            bg: "Осигуряват поддръжка от разстояние.", 
            en: "Provide support from a distance.", 
            ru: "Обеспечивают поддержку с расстояния." 
        } 
    }
};

function recruitUnit(hero, unitKey) {
    const lang = window.gameLang || 'bg';
    const unit = unitTypes[unitKey];
    
    // Локализирани системни съобщения
    const msg = {
        invalid: { bg: "Невалидна единица.", en: "Invalid unit.", ru: "Неверный юнит." },
        success: { bg: `⚔️ Успешно наехте ${unit ? unit.name[lang] : ''}! Твоята мощ нарасна.`, en: `⚔️ Successfully recruited ${unit ? unit.name[lang] : ''}! Your power grew.`, ru: `⚔️ Успешно наняты ${unit ? unit.name[lang] : ''}! Ваша мощь возросла.` },
        noGold: { bg: "🪙 Нямаш достатъчно злато.", en: "🪙 Not enough gold.", ru: "🪙 Недостаточно золота." }
    };

    if (!unit) return msg.invalid[lang];

    if (window.gameGold >= unit.cost) {
        window.gameGold -= unit.cost;
        hero.armySize += unit.power * 2; 
        
        // Подсигуряваме, че методът съществува в Character обекта
        if (typeof hero.updateRank === 'function') {
            hero.updateRank(); 
        }
        
        // Синхронизация с другите модули
        window.updateGoldDisplay();
        window.updateCharacterUI(hero);
        
        return msg.success[lang];
    } else {
        return msg.noGold[lang];
    }
}

window.unitTypes = unitTypes;
window.recruitUnit = recruitUnit;
