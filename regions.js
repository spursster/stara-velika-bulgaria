/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ ФАЙЛ: regions.js (КАРТА, ИНСПЕКЦИЯ И ИНФРАСТРУКТУРА) 
СТАТУС: НАПЪЛНО ИЗЧИСТЕН И СИНХРОНИЗИРАН КОРЕКЦИЯ: Премахнати всички синтактични
 грешки, поправени счупени HTML низове, само clan. 
========================================================================== */ 
window.openRegionsMap = function() { const mainArea = 
document.getElementById('game-main-area'); if (!mainArea) return; if 
(!window.worldData || !window.worldData.regions) { console.error("Грешка: 
Липсват данни за регионите в world_data.js"); return; } const regions = 
window.worldData.regions; const regionKeys = Object.keys(regions); // ✅ ФИКС: 
Премахнат интервал от името на променливата const ownedRegionsFlat = 
Array.isArray(window.playerRegions) ? window.playerRegions.flat() : []; let html
 = ` 

## Карта на Регионите

Кликнете на регион за инспекция или атака

`; regionKeys.forEach(key => { const reg = regions[key]; const isPlayerOwned = 
ownedRegionsFlat.includes(key); let controllingClan = "Няма"; if 
(reg.nativeClans && reg.nativeClans.length > 0) { controllingClan = 
reg.nativeClans[0]; } const borderStyle = isPlayerOwned ? "2px solid #00ffcc" : 
"1px solid #333"; const bgStyle = isPlayerOwned ? "rgba(0, 255, 204, 0.05)" : 
"rgba(0,0,0,0.4)"; html += ` 

️

${key}

Клан: ${controllingClan}

${reg.resource}

`; }); html += ` 

Назад към Главното Меню

`; mainArea.innerHTML = html; }; /** ИНСПЕКЦИЯ И ДЕЙСТВИЯ ЗА КОНКРЕТЕН РЕГИОН ✅ 
ФИКС: Изцяло поправени счупените template literals в бутоните. */ 
window.inspectRegion = function(regionName) { if (!window.worldData || 
!window.worldData.regions || !window.worldData.regions[regionName]) return; 
const reg = window.worldData.regions[regionName]; const hero = 
window.currentHero; if (!hero) return; if (window.initializeHeroRPGData) 
window.initializeHeroRPGData(hero); const skills = hero.skills || {}; const 
ownedRegionsFlat = Array.isArray(window.playerRegions) ? 
window.playerRegions.flat() : []; const isPlayerOwned = 
ownedRegionsFlat.includes(regionName); let baseUpgradeCost = 500; let 
economyLevel = skills.economy || 0; let finalUpgradeCost = Math.max(100, 
Math.floor(baseUpgradeCost * (1 - (economyLevel * 0.10)))); let nativeClan = 
(reg.nativeClans && reg.nativeClans[0]) || "Независим"; const oldOverlay = 
document.getElementById('region-inspect-overlay'); if (oldOverlay) 
oldOverlay.remove(); const overlay = document.createElement('div'); overlay.id =
 'region-inspect-overlay'; overlay.style.cssText = `position: fixed; top: 0; 
left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-
filter: blur(6px); display: flex; justify-content: center; align-items: center; 
z-index: 50000; font-family: 'Cinzel', serif; box-sizing: border-box; padding: 
15px;`; // ✅ ЧИСТИ HTML БУТОНИ БЕЗ РАЗБИТИ BACKTICKS let actionButtonHTML = ''; 
if (isPlayerOwned) { actionButtonHTML = `️ <button class="region-action-btn" style="background:#2c5a2a;" onclick="window.upgradeRegionInfrastructure('${regionName.replace(/'/g, "\\'")}', ${finalUpgradeCost})">️ Модернизирай Инфраструктура (${finalUpgradeCost} зл.)️</button>`; } else { 
    // ✅ КЛЮЧОВА ПРОМЯНА: Добавяне на onclick събитие към бутона за атака
    // Използва се JSON.stringify, за да се предаде пълният обект на региона
    actionButtonHTML = `<button class="region-action-btn" style="background:#7a2e1a;" onclick="if(window.startBattle) window.startBattle(${JSON.stringify(reg).replace(/"/g, '&quot;')}); else alert('Грешка: Бойната система не е заредена!');">⚔️ Изпрати Войски за Завладяване ⚔️</button>`;
} overlay.innerHTML = ` 

### Инспекция: ${regionName}

⛰️ Терен: ${reg.terrain}

💰 Ресурс: ${reg.resource}

🏴 Контролиращ Клан: ${nativeClan}

🛡️ Ниво на Защита: Ниво ${reg.defenseLevel || 1}

🏗️ Инфраструктура: Ниво ${reg.infrastructureLevel || 1}

⚠️ Трудност на Терена: ${reg.difficulty}%

${actionButtonHTML} <button class="region-action-btn" style="background:#333;" onclick="this.closest('#region-inspect-overlay').remove()">🔒 Затвори</button>

`; document.body.appendChild(overlay); }; /** НАДГРАЖДАНЕ НА ИНФРАСТРУКТУРАТА */
 window.upgradeRegionInfrastructure = function(regionName, cost) { const hero = 
window.currentHero; if (!hero) return; if ((hero.gold || 0) >= cost) { hero.gold
 -= cost; if (window.worldData && window.worldData.regions && 
window.worldData.regions[regionName]) { const reg = 
window.worldData.regions[regionName]; reg.infrastructureLevel = 
(reg.infrastructureLevel || 1) + 1; reg.defenseLevel = (reg.defenseLevel || 1) +
 1; } if (window.showAdvisorMsg) { window.showAdvisorMsg(`🏗️ СТРОЕЖ: 
Инфраструктурата на регион "${regionName}" бе успешно модернизирана!`); } if 
(window.updateCharacterUI) window.updateCharacterUI(hero); const overlay = 
document.getElementById('region-inspect-overlay'); if (overlay) 
overlay.remove(); window.openRegionsMap(); window.inspectRegion(regionName); } 
else { if (window.showAdvisorMsg) { window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате 
достатъчно злато за строителни дейности!"); } } };
