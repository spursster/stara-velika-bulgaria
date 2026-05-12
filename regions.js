window.playerRegions = ["Одриско царство"]; // Начален регион

const regionData = {
    "Мизия": { income: 150, defenseBonus: 5, description: "Плодородни земи на север." },
    "Тракия": { income: 200, defenseBonus: 10, description: "Сърцето на античните български земи." },
    "Македония": { income: 180, defenseBonus: 8, description: "Стратегически регион с богати мини." },
    "Панония": { income: 120, defenseBonus: 3, description: "Равнини, идеални за конницата." }
};

function captureRegion(hero, regionName) {
    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        const log = document.getElementById('event-log');
        if (log) {
            log.innerHTML = `<p style="color: #2ecc71;">🚩 <strong>ЗАВЛАДЯВАНЕ:</strong> Регионът ${regionName} вече е под твой контрол! Данъците нарастват.</p>` + log.innerHTML;
        }
        window.updateCharacterUI(hero);
    }
}

// Нова функция за икономиката - добавя доходите от регионите
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
