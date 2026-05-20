/** ========================================================================== 
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ ФАЙЛ: ui.js (УНИВЕРСАЛЕН ГЛОБАЛЕН ПРОФИЛ, ЛЕНТА НА ЕЛИТА
 И ИНСПЕКЦИЯ НА КЛАНОВЕТЕ) СТАТУС: НАПЪЛНО ИЗЧИСТЕН ОТ СИНТАКСИЧНИ ГРЕШКИ И 
 СИНХРОНИЗИРАН КОРЕКЦИЯ: 1. Премахнати всички = >, & &, разделени думи и счупени 
 backticks. 2. Използва се САМО clan (без dynasty). 3. Фиксирано показване на XP 
 ленти и имена на герои. 
========================================================================== */ 
window.eventHistory = []; if (!window.autoLevelState) { window.autoLevelState = 
{}; } /** Глобална функция за превключване на Цял Екран (Full Screen) */ 
window.toggleGameFullScreen = function() { if (!document.fullscreenElement && 
!document.mozFullScreenElement && !document.webkitFullscreenElement && 
!document.msFullscreenElement) { const docEl = document.documentElement; if 
(docEl.requestFullscreen) { docEl.requestFullscreen(); } else if 
(docEl.mozRequestFullScreen) { docEl.mozRequestFullScreen(); } else if 
(docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); } else if 
(docEl.msRequestFullscreen) { docEl.msRequestFullscreen(); } } else { if 
(document.exitFullscreen) { document.exitFullscreen(); } else if 
(document.mozCancelFullScreen) { document.mozCancelFullScreen(); } else if 
(document.webkitExitFullscreen) { document.webkitExitFullscreen(); } else if 
(document.msExitFullscreen) { document.msExitFullscreen(); } } }; /** ДИНАМИЧНО 
ЧЕРТАЕНЕ НА ЛЕНТАТА НА ЕЛИТА (ТОП 6 ГЕРОИ С НАЙ-ВИСОК ОПИТ) */ 
window.renderTop6LeadersUI = function() { const eliteBar = 
document.getElementById('top-elite-bar'); if (!eliteBar) return; // 
Подсигуряваме базови кланове, ако worldData все още не е зареден напълно if 
(!window.worldData || !window.worldData.clans) { if (window.currentHero) { 
window.worldData = window.worldData || {}; window.worldData.clans = 
window.worldData.clans || {}; window.worldData.clans[window.currentHero.clan] = 
window.currentHero; } else { return; } } // Взимаме всички водачи от базата 
данни let leaders = Object.entries(window.worldData.clans).map(([clanKey, data])
 => { return { clanKey: clanKey, ...data }; }); // Сортиране по Ниво и Опит в 
низходящ ред leaders.sort((a, b) => { if ((b.level || 1) !== (a.level || 1)) { 
return (b.level || 1) - (a.level || 1); } return (b.xp || 0) - (a.xp || 0); }); 
// Взимаме първите 6 лидера за елитната лента const top6 = leaders.slice(0, 6); 
eliteBar.innerHTML = ""; eliteBar.style.cssText = "display: grid; grid-template-
columns: repeat(6, 1fr); gap: 10px; width: 100%; box-sizing: border-box;"; 
top6.forEach(leader => { // Подсигуряваме инициализация на новите свойства if 
(window.initializeHeroRPGData) window.initializeHeroRPGData(leader); const card 
= document.createElement('div'); card.className = "elite-hero-card"; 
card.style.cursor = "pointer"; // Клик върху картата отваря RPG профила 
card.onclick = (e) => { if (e.target.classList.contains('auto-btn')) return; // 
Изолираме бутона AUTO if (window.openHeroRPGModal) 
window.openHeroRPGModal(leader.clanKey); }; // Изчисляване на процента прогрес 
за XP лентата let currentXP = leader.xp || 0; let reqXP = 150; // Проверка за 
налична RPG база данни if (window.rpgDatabase && 
window.rpgDatabase.getXPRequiredForLevel) { reqXP = 
window.rpgDatabase.getXPRequiredForLevel(leader.level || 1); } // Ако е в ръчен 
режим, визуализираме натрупания складиран опит спрямо текущото ниво if 
(!leader.isAuto) { currentXP = leader.storedXP || 0; } // Защита срещу деление 
на нула if (reqXP <= 0) reqXP = 1; let xpPercent = Math.min(100, 
Math.floor((currentXP / reqXP) * 100)); // Икона за любимец, ако има такъв let 
petIcon = ""; if (leader.pet && window.rpgDatabase && 
window.rpgDatabase.petsDatabase && window.rpgDatabase.petsDatabase[leader.pet]) 
{ petIcon = window.rpgDatabase.petsDatabase[leader.pet].icon; } const autoClass 
= leader.isAuto ? "auto-btn active" : "auto-btn"; const autoText = leader.isAuto
 ? "Auto" : "Manual"; card.innerHTML = ` 

${petIcon} ${leader.name || leader.hero || "Воевода"} 

Ниво ${leader.level || 1} | ${leader.currentClass || "Багатур"} 

${autoText}  `; eliteBar.appendChild(card); }); }; // Насочваме извикването от 
logic.js към същата функция window.renderTop6HeroesUI = 
window.renderTop6LeadersUI; /** ОСНОВНО ОБНОВЯВАНЕ НА ЛЕВИЯ ПАНЕЛ (ТЕКУЩ АКТИВЕН
 ИГРАЧ / ВОДАЧ) */ window.updateCharacterUI = function(hero) { if (!hero) 
return; window.currentHero = hero; // Подсигуряване на RPG структурата if 
(window.initializeHeroRPGData) window.initializeHeroRPGData(hero); // Горна 
информационен панел (Ресурси) const goldDisplay = document.getElementById('val-
gold'); if (goldDisplay) goldDisplay.innerText = hero.gold || 0; const 
armyDisplay = document.getElementById('val-army'); if (armyDisplay) 
armyDisplay.innerText = hero.armySize || 0; const powerDisplay = 
document.getElementById('val-hero-power'); if (powerDisplay) 
powerDisplay.innerText = hero.heroPower || 100; // Ляв панел - Профил на текущия
водач const profileBox = document.getElementById('active-character-profile'); 
if (profileBox) { let petStatus = "Няма"; if (hero.pet && window.rpgDatabase && 
window.rpgDatabase.petsDatabase[hero.pet]) { const p = 
window.rpgDatabase.petsDatabase[hero.pet]; petStatus = `${p.icon} ${p.name}`; } 
profileBox.innerHTML = ` 

${hero.name || "Неизвестен"} 

Род ${hero.clan || "Свободен"} | Клас: ${hero.currentClass || "Багатур"} 

Ниво: ${hero.level || 1} 

Възраст: ${hero.age || 50} г. 

Бойна Сила: ⚔️ ${hero.heroPower || 150} 

Свободни точки: ${hero.skillPoints || 0} 

Любимец: ${petStatus} 

`; } // Бутон за бърз достъп до RPG Модала от левия панел if (profileBox && 
!document.getElementById('open-rpg-modal-btn')) { const rpgBtn = 
document.createElement('button'); rpgBtn.id = "open-rpg-modal-btn"; 
rpgBtn.className = "menu-btn"; rpgBtn.style.cssText = "width:100%; margin-
top:10px; padding:8px; font-size:11px; font-family:'Cinzel';"; rpgBtn.innerText 
= " Управление на Героя"; rpgBtn.onclick = () => { if (window.openHeroRPGModal) 
window.openHeroRPGModal(window.currentHero.clan); }; 
profileBox.appendChild(rpgBtn); } // Преначертаване на Елитната хоризонтална 
лента, за да отрази промените веднага window.renderTop6LeadersUI(); }; /** 
ДОБАВЯНЕ НА СЪБИТИЕ В ЖУРНАЛА НА СЪВЕТНИКА */ window.showAdvisorMsg = 
function(msg) { const journal = document.getElementById('advisor-journal'); if 
(!journal) { console.log("Журнал съветник:", msg); return; } 
window.eventHistory.push(msg); if (window.eventHistory.length > 50) 
window.eventHistory.shift(); journal.innerHTML = window.eventHistory.map(line =>
 `

${line} 

`).reverse().join(''); }; /** ИНСПЕКЦИЯ И ДЕТАЙЛЕН СТЪКЛЕН ПРОФИЛ НА КЛАН ✅ 
ФИКС: Премахнати счупени HTML тагове и интервали. ✅ ФИКС: Използва clan вместо 
dynasty. */ window.inspectLeaderProfile = function(clanKey) { if 
(!window.worldData || !window.worldData.clans || 
!window.worldData.clans[clanKey]) { alert("Грешка: Неуспешно извличане на данни 
за избрания род."); return; } const leader = window.worldData.clans[clanKey]; //
Премахване на стар инспектор ако съществува const oldProfile = 
document.getElementById('dynamic-leader-profile'); if (oldProfile) 
oldProfile.remove(); // Генериране на HTML изглед за придобитите пасиви на клана
(Оправен синтаксис) let skillsHTML = `

#### Придобити Способности:

`; let hasSkills = false; if (leader.skills) { 
Object.entries(leader.skills).forEach(([sKey, sVal]) => { // Оправено: sVal > 0 
&& window.rpgDatabase... if (sVal > 0 && window.rpgDatabase && 
window.rpgDatabase.skillTrees[sKey]) { skillsHTML += `

• ${window.rpgDatabase.skillTrees[sKey].name}: Ниво ${sVal}

`; hasSkills = true; } }); } if (!hasSkills) skillsHTML += `

Все още няма развити умения.

`; skillsHTML += `

`; // Инвентарен преглед на оръжията let inventoryHTML = `

#### Налична Екипировка:

`; let hasEquipment = false; if (leader.equipment) { 
leader.equipment.forEach(item => { if (item) { inventoryHTML += `${item.icon}`; 
hasEquipment = true; } }); } if (!hasEquipment) inventoryHTML += `

Няма екипирани предмети.

`; inventoryHTML += `

`; const overlay = document.createElement('div'); overlay.id = "dynamic-leader-
profile"; // ✅ ФИКС: Пълен екран (100vw, 100vh) за мобилни overlay.style.cssText
= `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: 
rgba(0,0,0,0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: 
blur(8px); display: flex; align-items: center; justify-content: center; z-index:
5000; padding: 10px; box-sizing: border-box;`; overlay.innerHTML = ` 

### ${leader.name || leader.hero} 

Родов Водач 

⚔️ ${leader.heroPower || 100} Сила 

Род: ${clanKey} 

Ниво: ${leader.level || 1} 

Лично злато:  ${leader.gold || 0} 

Войска: ⚔️ ${leader.armySize || 0} 

Клас: ${leader.currentClass || "Багатур"} 

${skillsHTML} ${inventoryHTML} 

ЗАТВОРИ ПРОФИЛА 

`; document.body.appendChild(overlay); };
