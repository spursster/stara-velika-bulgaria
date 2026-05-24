/**
=========================================================================
ВЕЛИКА БЪЛГАРИЯ – ИНТЕРФЕЙС ЗА НОВИТЕ УМЕНИЯ (skills.js)
ВЕРСИЯ: 1.1 – КОРИГИРАН (ОПРАВЕНИ СИНТАКСИЧНИ ГРЕШКИ ОТ КОПИРАНЕ)
=========================================================================
*/
// Функция за отваряне на модал с уменията
window.openSkillsUI = function() {
    if (document.getElementById('skills-ui-modal')) return;
    const hero = window.currentHero;
    if (!hero) { alert("Няма активен герой!"); return; }
    if (!window.advancedSkills) { alert("Системата за умения не е заредена (skills.js липсва)."); return; }
    if (!hero.learnedSkills) hero.learnedSkills = {};

    // Изчисляваме колко точки са вложени във всяко дърво
    function getTreePoints(treeKey) {
        let total = 0;
        for (let sk in hero.learnedSkills) {
            if (window.advancedSkills[treeKey] && window.advancedSkills[treeKey].skills[sk]) {
                total += hero.learnedSkills[sk];
            }
        }
        return total;
    }

    // Генерира HTML за едно дърво
    function renderTree(treeKey, tree) {
        let pointsInTree = getTreePoints(treeKey);
        let skillsHtml = '';
        for (let skillKey in tree.skills) {
            const skill = tree.skills[skillKey];
            const currentLevel = hero.learnedSkills[skillKey] || 0;
            const isMax = currentLevel >= skill.maxLevel;
            const canLearn = (!isMax && hero.skillPoints > 0 && hero.level >= skill.reqLevel && pointsInTree >= skill.reqPointsInTree);
            skillsHtml += `
                <div class="skill-card" style="background:rgba(20,20,30,0.6); border:1px solid #d4af37; border-radius:12px; padding:10px; margin-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-size:24px;">${skill.icon || '⭐'}</div>
                        <div style="flex:1;">
                            <div><strong style="color:#ffd700;">${skill.name}</strong> <span style="color:#aaa;">(Ниво ${currentLevel}/${skill.maxLevel})</span></div>
                            <div style="font-size:11px; color:#ccc;">${skill.desc}</div>
                            <div style="font-size:10px; color:#88ff88;">Изисква: Ниво ${skill.reqLevel}, ${skill.reqPointsInTree} т. в дървото</div>
                        </div>
                        ${!isMax ? `<button class="learn-skill-btn" data-tree="${treeKey}" data-skill="${skillKey}" style="background:#daa520; border:none; border-radius:20px; padding:4px 12px; color:#000; cursor:${canLearn ? 'pointer' : 'not-allowed'}; opacity:${canLearn ? 1 : 0.5};">📖 Научи (1 т.)</button>` : `<span style="color:#00ffcc;">✓ MAX</span>`}
                    </div>
                </div>
            `;
        }
        return `
            <div class="skill-tree-panel" style="margin-bottom:20px;">
                <h3 style="color:#ffd700; border-bottom:1px solid #d4af37; padding-bottom:5px;">${tree.icon} ${tree.name} <span style="font-size:12px; color:#aaa;">(Точки в дървото: ${pointsInTree})</span></h3>
                <div style="max-height:400px; overflow-y:auto; padding-right:10px;">${skillsHtml}</div>
            </div>
        `;
    }

    // Генерира табове и съдържание
    let tabsHtml = '<div style="display:flex; gap:10px; border-bottom:1px solid #d4af37; margin-bottom:15px; flex-wrap:wrap;">';
    let panelsHtml = '';
    let first = true;
    for (let treeKey in window.advancedSkills) {
        const tree = window.advancedSkills[treeKey];
        tabsHtml += `<button class="skill-tab-btn" data-tree="${treeKey}" style="background:${first ? '#daa520' : '#2c2c3a'}; border:none; border-radius:20px; padding:6px 15px; color:${first ? '#000' : '#ffd700'}; cursor:pointer; margin-bottom:5px;">${tree.icon} ${tree.name}</button>`;
        panelsHtml += `<div class="skill-tab-panel" data-tree="${treeKey}" style="display:${first ? 'block' : 'none'};">${renderTree(treeKey, tree)}</div>`;
        first = false;
    }
    tabsHtml += '</div>';

    const modal = document.createElement('div');
    modal.id = 'skills-ui-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        z-index: 200000; display: flex; align-items: center; justify-content: center;
        font-family: 'Cinzel', serif; padding: 20px; box-sizing: border-box;
    `;
    modal.innerHTML = `
        <div style="background:#0a0a1a; border:2px solid #d4af37; border-radius:24px; max-width:800px; width:100%; max-height:90%; overflow-y:auto; padding:20px; position:relative;">
            <button id="close-skills-ui" style="position:absolute; top:10px; left:10px; background:rgba(255,80,80,0.2); border:none; color:#ff8888; font-size:20px; width:32px; height:32px; border-radius:50%; cursor:pointer;">✕</button>
            <h2 style="color:#ffd700; text-align:center;">⭐ ДЪРВЕТА НА УМЕНИЯТА ⭐</h2>
            <p style="text-align:center; color:#aaa;">Свободни точки: <span id="skills-available-points" style="color:#ffd700; font-weight:bold;">${hero.skillPoints}</span></p>
            <div id="skills-tabs-container">${tabsHtml}</div>
            <div id="skills-panels-container">${panelsHtml}</div>
            <div style="text-align:center; margin-top:20px;">
                <button id="close-skills-footer" style="background:#2c2c3a; border:1px solid #d4af37; color:#ffd700; padding:8px 20px; border-radius:30px; cursor:pointer;">Затвори</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Затваряне
    const closeModal = () => modal.remove();
    modal.querySelector('#close-skills-ui')?.addEventListener('click', closeModal);
    modal.querySelector('#close-skills-footer')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Табове
    const tabBtns = modal.querySelectorAll('.skill-tab-btn');
    const panels = modal.querySelectorAll('.skill-tab-panel');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tree = btn.getAttribute('data-tree');
            tabBtns.forEach(b => { b.style.background = '#2c2c3a'; b.style.color = '#ffd700'; });
            btn.style.background = '#daa520'; btn.style.color = '#000';
            panels.forEach(p => { p.style.display = p.getAttribute('data-tree') === tree ? 'block' : 'none'; });
        });
    });

    // Бутони за научаване на умения (делегиране)
    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('.learn-skill-btn');
        if (!btn) return;
        const treeKey = btn.getAttribute('data-tree');
        const skillKey = btn.getAttribute('data-skill');
        if (!treeKey || !skillKey) return;
        // Извикваме функцията за научаване от skills.js
        if (typeof window.learnAdvancedSkill === 'function') {
            const success = window.learnAdvancedSkill(hero, treeKey, skillKey);
            if (success) {
                const pointsSpan = document.getElementById('skills-available-points');
                if (pointsSpan) pointsSpan.innerText = hero.skillPoints;
                closeModal();
                window.openSkillsUI();
            }
        } else {
            alert("Системата за умения не е заредена правилно.");
        }
    });
};

// Добавяме бутон към RPG модала
if (typeof window.openHeroRPGModal === 'function') {
    const originalOpenModal = window.openHeroRPGModal;
    window.openHeroRPGModal = function(clanKey) {
        originalOpenModal(clanKey);
        setTimeout(() => {
            const modal = document.getElementById('hero-rpg-modal');
            if (modal && !modal.querySelector('.skills-ui-btn')) {
                const skillsBtn = document.createElement('button');
                skillsBtn.className = 'skills-ui-btn';
                skillsBtn.innerHTML = '⭐ УМЕНИЯ (НОВИ) ⭐';
                skillsBtn.style.cssText = 'margin-top:15px; width:100%; background:#daa520; border:none; border-radius:30px; padding:8px; color:#000; font-weight:bold; cursor:pointer; font-family:"Cinzel",serif;';
                skillsBtn.onclick = () => { modal.style.display = 'none'; window.openSkillsUI(); };
                const container = modal.querySelector('.modal-content > div:last-child') || modal;
                container.appendChild(skillsBtn);
            }
        }, 100);
    };
} else {
    console.warn("openHeroRPGModal не е дефинирана – не мога да добавя бутон за умения в RPG модала.");
}
console.log("✅ skills-ui.js зареден – интерфейсът за новите умения е готов.");
