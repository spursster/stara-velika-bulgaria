window.playerRegions = ["Одриско царство"]; // Начален регион

const regionData = {
    "Мизия": { 
        income: 150, 
        defenseBonus: 5, 
        name: { bg: "Мизия", en: "Moesia", ru: "Мёзия" },
        description: { bg: "Плодородни земи на север.", en: "Fertile lands to the north.", ru: "Плодородные земли на севере." } 
    },
    "Тракия": { 
        income: 200, 
        defenseBonus: 10, 
        name: { bg: "Тракия", en: "Thrace", ru: "Фракия" },
        description: { bg: "Сърцето на античните български земи.", en: "The heart of the ancient Bulgarian lands.", ru: "Сердце античных булгарских земель." } 
    },
    "Македония": { 
        income: 180, 
        defenseBonus: 8, 
        name: { bg: "Македония", en: "Macedonia", ru: "Македония" },
        description: { bg: "Стратегически регион с богати мини.", en: "Strategic region with rich mines.", ru: "Стратегический регион с богатыми рудниками." } 
    },
    "Панония": { 
        income: 120, 
        defenseBonus: 3, 
        name: { bg: "Панония", en: "Pannonia", ru: "Паннония" },
        description: { bg: "Равнини, идеални за конницата.", en: "Plains, ideal for cavalry.", ru: "Равнины, идеальные для конницы." } 
    }
};

function captureRegion(hero, regionName) {
    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        const lang = window.gameLang || 'bg';
        const regInfo = regionData[regionName];
        const dispName = regInfo ? regInfo.name[lang] : regionName;
        
        const msg = {
            bg: `🚩 ЗАВЛАДЯВАНЕ: Регионът ${dispName} вече е под твой контрол! Данъците нарастват.`,
            en: `🚩 CONQUEST: The region ${dispName} is now under your control! Taxes increase.`,
            ru: `🚩 ЗАВОЕВАНИЕ: Регион ${dispName} теперь под твоим контролем! Налоги растут.`
        };

        const log = document.getElementById('event-log');
        if (log) {
            log.innerHTML = `<p style="color: #2ecc71;"><strong>${msg[lang]}</strong></p>` + log.innerHTML;
        }
        window.updateCharacterUI(hero);
    }
}

function getRegionIncome() {
    let total = 0;
    window.playerRegions.forEach(reg => {
        if (regionData[reg]) {
            total += regionData[reg].income;
        }
    });
    return total;
}

window.captureRegion = captureRegion;
window.getRegionIncome = getRegionIncome;
