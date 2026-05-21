/**
МОДУЛ: ДИПЛОМАЦИЯ И БРАК (МОДАЛНА ВЕРСИЯ – С БУТОН "✕" ГОРЕ ВЛЯВО)
*/

window.clanRelations = window.clanRelations || {};
if (!window.prisoners) window.prisoners = [];

window.initDiplomacy = function() {
    const allClans = [
        "Дуло", "Комитопули", "Асеневци", "Тертер", "Даки", "Уния Траки",
        "Шишмановци", "Македони", "Птоломеи", "Одриси", "Бесараб", "Османци Дуло", "Скити"
    ];
    const hero = window.currentHero;
    let initialBonus = (hero && hero.skills && (hero.skills.leadership || 0) * 15) || 0;
    allClans.forEach(clan => {
        window.clanRelations[clan] = (hero && clan === hero.clan) ? 100 : Math.min(100, 40 + initialBonus);
    });
};

window.processClanDiplomacyAutomation = function() {
    if (!window.worldData || !window.worldData.clans) return;
    const hero = window.currentHero;
    for (let key in window.worldData.clans) {
        const clan = window.worldData.clans[key];
        if (hero && key === hero.clan) continue;
        if (window.initializeHeroRPGData) window.initializeHeroRPGData(clan);
        if ((clan.gold || 0) >= 150) {
            clan.gold -= 100;
            clan.armySize = (clan.armySize || 0) + Math.floor(Math.random() * 25) + 10;
            clan.currentArmy = clan.armySize;
        }
        if (window.gainHeroXP) window.gainHeroXP(clan, 35);
        else {
            clan.xp = (clan.xp || 0) + 35;
            let reqXP = (clan.level || 1) * 150;
            if (clan.xp >= reqXP) {
                clan.xp -= reqXP;
                clan.level = (clan.level || 1) + 1;
                clan.heroPower = (clan.heroPower || 100) + 35;
            }
        }
    }
    if (window.renderTop6LeadersUI) window.renderTop6LeadersUI();
};

window.marryPrisoner = function(index) {
    if (!window.prisoners || !window.prisoners[index]) return alert("Грешка: Пленницата не е намерена!");
    const prisoner = window.prisoners[index];
    if (!window.currentHero) return alert("Няма активен герой!");
    
    const newHeroId = "wife_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    const wifeHero = {
        id: newHeroId, name: prisoner.name, leaderName: prisoner.name, clan: "Съпруга",
        isJoined: true, level: 1, xp: 0, heroPower: 60 + (prisoner.bonus?.heroPower || 0),
        power: 60 + (prisoner.bonus?.heroPower || 0), gold: 800, armySize: 150, currentArmy: 150,
        currentClass: prisoner.name, className: prisoner.name, skills: {}, skillPoints: 0,
        equipment: Array(12).fill(null), inventory: Array(12).fill(null), pet: null, age: 25,
        race: prisoner.raceId, raceBonus: prisoner.bonus,
        armyDetails: { infantry: 80, archers: 40, cavalry: 20, elite: 10 }
    };
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(wifeHero);
    if (!window.worldData) window.worldData = {};
    if (!window.worldData.clans) window.worldData.clans = {};
    window.worldData.clans[newHeroId] = wifeHero;
    if (!window.unlockedLeaders) window.unlockedLeaders = [];
    window.unlockedLeaders.push(wifeHero);
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(wifeHero);
    window.prisoners.splice(index, 1);
    
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (typeof window.renderSingleBar === 'function') window.renderSingleBar();
    if (typeof window.renderTop6LeadersUI === 'function') window.renderTop6LeadersUI();
    
    const bonusText = Object.entries(prisoner.bonus || {}).map(([k,v]) => `${k}+${v}`).join(', ');
    if (window.showAdvisorMsg) window.showAdvisorMsg(`💍 БРАК! ${prisoner.name} се присъедини към вашия род! Бонуси: ${bonusText}`);
    alert(`💍 Оженихте се за ${prisoner.name}!\n🎉 Тя се присъедини към вашите герои!\n✨ Бонуси: ${bonusText}`);
    if (window.openRegionsMap) window.openRegionsMap();
};

window.openMarriageMenu = function() {
    if (document.getElementById('marriage-modal')) return;
    const hero = window.currentHero;
    if (!hero) return;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    
    let skills = hero.skills || {};
    let charismaDiscount = Math.min(0.50, (skills.leadership || 0) * 0.10);
    let baseMarriageCost = 300;
    let finalMarriageCost = Math.max(50, Math.floor(baseMarriageCost * (1 - charismaDiscount)));
    let diplomacyBonus = (skills.economy || 0) * 5;
    let baseSuccessChance = 50 + diplomacyBonus;
    
    let prisonersHtml = '';
    if (window.prisoners && window.prisoners.length > 0) {
        prisonersHtml = `<div style="margin-bottom:20px; border-bottom:1px solid #d4af37; padding-bottom:10px;"><h3 style="color:#ffd700;">💍 Кандидатки за брак (пленници)</h3>`;
        window.prisoners.forEach((prisoner, idx) => {
            const bonusText = Object.entries(prisoner.bonus || {}).map(([k,v]) => `${k}+${v}`).join(', ');
            prisonersHtml += `
                <div style="background:rgba(0,0,0,0.4); padding:8px; margin-bottom:8px; border-radius:8px;">
                    <div><span style="font-size:20px;">${prisoner.icon || '👸'}</span> <strong>${prisoner.name}</strong></div>
                    <div style="font-size:11px;">${prisoner.desc || ''} | Бонуси: ${bonusText}</div>
                    <button class="marry-prisoner-modal-btn" data-index="${idx}" style="background:#7a2e1a; border:none; padding:5px 12px; border-radius:20px; color:#ffdd99; cursor:pointer; margin-top:5px;">💍 Ожени се</button>
                </div>
            `;
        });
        prisonersHtml += `</div>`;
    }
    
    let clansHtml = `<div><h3 style="color:#ffd700;">🏛️ Династични бракове с кланове</h3><div style="max-height:300px; overflow-y:auto;">`;
    for (let clan in window.clanRelations) {
        if (clan !== hero.clan) {
            let rel = window.clanRelations[clan] || 40;
            clansHtml += `
                <div style="border:1px solid #333; padding:8px; margin-bottom:8px; border-radius:8px;">
                    <div>Род ${clan} (отношения: ${rel}/100)</div>
                    <div style="font-size:11px;">Цена: ${finalMarriageCost}💰 | Шанс: ${baseSuccessChance}%</div>
                    <button class="propose-marriage-modal-btn" data-clan="${clan}" style="background:#daa520; border:none; padding:5px 12px; border-radius:20px; color:#000; cursor:pointer;">💍 Предложи брак</button>
                </div>
            `;
        }
    }
    clansHtml += `</div></div>`;
    
    const modal = document.createElement('div');
    modal.id = 'marriage-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(8px);
        z-index: 200000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        padding: 20px;
        box-sizing: border-box;
    `;
    modal.innerHTML = `
        <div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; max-width: 500px; width: 90%; max-height: 90%; overflow-y: auto; padding: 20px; position: relative;">
            <!-- БУТОН ЗА ЗАТВАРЯНЕ ГОРЕ ВЛЯВО -->
            <button id="close-marriage-x" style="position: absolute; top: 10px; left: 10px; background: rgba(255,80,80,0.2); border: none; color: #ff8888; font-size: 20px; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
            <h2 style="color:#ffd700; text-align:center; margin-top:0;">💍 Династични Бракове</h2>
            ${prisonersHtml}
            ${clansHtml}
            <div style="text-align:center; margin-top:20px;">
                <button id="close-marriage-modal" style="background:#2c2c3a; border:1px solid #d4af37; color:#ffd700; padding:8px 16px; border-radius:30px; cursor:pointer;">Затвори</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Функция за затваряне на модала
    const closeModal = () => modal.remove();
    modal.querySelector('#close-marriage-x')?.addEventListener('click', closeModal);
    modal.querySelector('#close-marriage-modal')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
    // Бутони за пленници (затварят модала преди действие)
    modal.querySelectorAll('.marry-prisoner-modal-btn').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-index'));
            closeModal();
            window.marryPrisoner(idx);
        };
    });
    
    // Бутони за кланове
    modal.querySelectorAll('.propose-marriage-modal-btn').forEach(btn => {
        btn.onclick = () => {
            const clan = btn.getAttribute('data-clan');
            closeModal();
            window.proposeMarriage(clan, finalMarriageCost, baseSuccessChance);
        };
    });
};

window.proposeMarriage = function(clan, cost, successChance) {
    const hero = window.currentHero;
    if (!hero) return;
    if ((hero.gold || 0) < cost) {
        alert("❌ Нямате достатъчно злато!");
        return;
    }
    hero.gold -= cost;
    let currentRel = window.clanRelations[clan] || 40;
    let finalChance = Math.min(95, successChance + Math.floor((currentRel - 40) * 0.5));
    let roll = Math.random() * 100;
    if (roll < finalChance) {
        window.clanRelations[clan] = 100;
        const dowryMap = {
            "Дуло": "Дардания", "Комитопули": "Пелагония", "Асеневци": "Илирия",
            "Тертер": "Галатия", "Даки": "Дакия", "Уния Траки": "Мизия",
            "Шишмановци": "Месопотамия", "Македони": "Македония", "Птоломеи": "Кипър",
            "Одриси": "Тракия", "Бесараб": "Добруджа", "Османци Дуло": "Витиния", "Скити": "Сарматия"
        };
        const region = dowryMap[clan] || "Мизия";
        window.currentSpouse = { name: `Княгиня от рода ${clan}`, clan: clan };
        if (!window.playerRegions) window.playerRegions = [];
        if (window.playerRegions.length === 0 || typeof window.playerRegions[0] === 'string') {
            window.playerRegions = [window.playerRegions.flat()];
        }
        if (!window.playerRegions.flat().includes(region)) {
            window.playerRegions[0].push(region);
            if (window.worldData?.regions?.[region]) window.worldData.regions[region].armySize = 0;
        }
        if (window.showAdvisorMsg) window.showAdvisorMsg(`👑 ДИНАСТИЧЕН ТРИУМФ: Сключихте брак с род ${clan}! Получихте регион "${region}".`);
        alert(`✅ Успех! Получавате регион "${region}" като зестра!`);
    } else {
        window.clanRelations[clan] = Math.max(10, currentRel - 10);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`💔 Предложението за брак с род ${clan} беше отхвърлено.`);
        alert("❌ Предложението беше отхвърлено!");
    }
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
    if (window.armyMarket && typeof window.armyMarket.sync === 'function') window.armyMarket.sync(hero);
    if (window.openRegionsMap) window.openRegionsMap();
};
