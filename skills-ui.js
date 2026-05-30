/**
=========================================================================
ВЕЛИКА БЪЛГАРИЯ – ИНТЕРФЕЙС ЗА НОВИТЕ УМЕНИЯ (skills.js)
ВЕРСИЯ: 2.0 – РАЗШИРЕН, С АВТО-РАЗПРЕДЕЛЕНИЕ, ТЪРСЕНЕ И ПОДОБРЕНА ВИЗУАЛИЗАЦИЯ
=========================================================================
*/

// Заглушка за съвместимост (сложете в началото на skills-ui.js)
if (typeof window.renderTop6HeroesUI !== 'function') {
    window.renderTop6HeroesUI = function() {
        if (typeof window.renderFavoriteHeroesBar === 'function') {
            window.renderFavoriteHeroesBar();
        }
    };
}
// Помощна функция за показване на съобщения
function showSkillsMessage(title, message, type = "info") {
    if (window.showAdvisorPopup) {
        window.showAdvisorPopup(title, message, type);
    } else if (window.showAdvisorMsg) {
        window.showAdvisorMsg(message);
    } else {
        alert(message);
    }
}

// Функция за отваряне на модал с уменията
window.openSkillsUI = function(heroParam) {
    if (document.getElementById('skills-ui-modal')) return;
    
    let hero = heroParam || null;
    if (!hero && typeof window.getStrongestHero === 'function') {
        hero = window.getStrongestHero();
    }
    if (!hero) {
        showSkillsMessage("ГРЕШКА", "Няма намерен герой за уменията!", "error");
        return;
    }
    if (!window.advancedSkills) {
        showSkillsMessage("ГРЕШКА", "Системата за умения не е заредена (skills.js липсва).", "error");
        return;
    }
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

    // Генерира HTML за едно дърво (с филтър)
    function renderTree(treeKey, tree, filterText = "") {
        let pointsInTree = getTreePoints(treeKey);
        let skillsHtml = '';
        for (let skillKey in tree.skills) {
            const skill = tree.skills[skillKey];
            const currentLevel = hero.learnedSkills[skillKey] || 0;
            const isMax = currentLevel >= skill.maxLevel;
            if (filterText && !skill.name.toLowerCase().includes(filterText) && !skill.desc.toLowerCase().includes(filterText)) {
                continue;
            }
            const canLearn = (!isMax && hero.skillPoints > 0 && hero.level >= skill.reqLevel && pointsInTree >= skill.reqPointsInTree);
            const reqMet = (hero.level >= skill.reqLevel && pointsInTree >= skill.reqPointsInTree);
            skillsHtml += `
                <div class="skill-card" style="background:rgba(20,20,30,0.6); border:1px solid #d4af37; border-radius:12px; padding:10px; margin-bottom:8px; ${!reqMet ? 'opacity:0.7;' : ''}">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-size:24px;">${skill.icon || '⭐'}</div>
                        <div style="flex:1;">
                            <div><strong style="color:#ffd700;">${skill.name}</strong> <span style="color:#aaa;">(Ниво ${currentLevel}/${skill.maxLevel})</span></div>
                            <div style="font-size:11px; color:#ccc;">${skill.desc}</div>
                            <div style="font-size:10px; color:#88ff88;">Изисква: Ниво ${skill.reqLevel}, ${skill.reqPointsInTree} т. в дървото</div>
                        </div>
                        ${!isMax ? 
                            `<button class="learn-skill-btn" data-tree="${treeKey}" data-skill="${skillKey}" style="background:#daa520; border:none; border-radius:20px; padding:4px 12px; color:#000; cursor:${canLearn ? 'pointer' : 'not-allowed'}; opacity:${canLearn ? 1 : 0.5};">📖 Научи (1 т.)</button>` : 
                            `<span style="color:#00ffcc;">✓ MAX</span>`
                        }
                    </div>
                </div>
            `;
        }
        if (skillsHtml === "") {
            skillsHtml = '<div style="text-align:center; color:#888; padding:20px;">Няма умения, отговарящи на филтъра.</div>';
        }
        return `
            <div class="skill-tree-panel" style="margin-bottom:20px;">
                <h3 style="color:#ffd700; border-bottom:1px solid #d4af37; padding-bottom:5px;">${tree.icon} ${tree.name} <span style="font-size:12px; color:#aaa;">(Точки в дървото: ${pointsInTree})</span></h3>
                <div style="max-height:400px; overflow-y:auto; padding-right:10px;">${skillsHtml}</div>
            </div>
        `;
    }

    // Генерира табове и съдържание
    let tabsHtml = '<div style="display:flex; gap:10px; border-bottom:1px solid #d4af37; margin-bottom:15px; flex-wrap:wrap; align-items:center;">';
    let panelsHtml = '';
    let first = true;
    for (let treeKey in window.advancedSkills) {
        const tree = window.advancedSkills[treeKey];
        tabsHtml += `<button class="skill-tab-btn" data-tree="${treeKey}" style="background:${first ? '#daa520' : '#2c2c3a'}; border:none; border-radius:20px; padding:6px 15px; color:${first ? '#000' : '#ffd700'}; cursor:pointer; margin-bottom:5px;">${tree.icon} ${tree.name}</button>`;
        panelsHtml += `<div class="skill-tab-panel" data-tree="${treeKey}" style="display:${first ? 'block' : 'none'};">${renderTree(treeKey, tree, "")}</div>`;
        first = false;
    }
    tabsHtml += `
        <div style="flex:1; text-align:right;">
            <input type="text" id="skills-search-input" placeholder="🔍 Търси умение..." style="background:#2c2c3a; border:1px solid #d4af37; border-radius:20px; padding:4px 12px; color:#ffd700; font-size:12px;">
        </div>
    </div>`;

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
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                <div style="background:rgba(0,0,0,0.5); padding:4px 12px; border-radius:20px;">
                    <span style="color:#aaa;">Ниво ${hero.level}</span> | 
                    <span style="color:#aaa;">Клас: ${hero.currentClass || "Багатур"}</span>
                </div>
                <div style="background:rgba(0,0,0,0.5); padding:4px 12px; border-radius:20px;">
                    <span style="color:#ffd700;">Свободни точки: <strong id="skills-available-points">${hero.skillPoints}</strong></span>
                </div>
                <button id="auto-assign-all-btn" style="background:#2c5a2a; border:1px solid #44ff44; border-radius:30px; padding:4px 12px; color:#fff; cursor:pointer;">🤖 Автоматично всички точки</button>
            </div>
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
    let currentTree = tabBtns[0]?.getAttribute('data-tree') || null;
    
    function switchTab(treeKey) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tree') === treeKey) {
                btn.style.background = '#daa520';
                btn.style.color = '#000';
            } else {
                btn.style.background = '#2c2c3a';
                btn.style.color = '#ffd700';
            }
        });
        panels.forEach(panel => {
            panel.style.display = panel.getAttribute('data-tree') === treeKey ? 'block' : 'none';
        });
        currentTree = treeKey;
        const filterInput = document.getElementById('skills-search-input');
        if (filterInput) {
            const filterText = filterInput.value.toLowerCase();
            for (let treeKeyInner in window.advancedSkills) {
                const panelDiv = document.querySelector(`.skill-tab-panel[data-tree="${treeKeyInner}"]`);
                if (panelDiv && treeKeyInner === treeKey) {
                    panelDiv.innerHTML = renderTree(treeKeyInner, window.advancedSkills[treeKeyInner], filterText);
                }
            }
            attachLearnButtons(modal);
        }
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tree = btn.getAttribute('data-tree');
            switchTab(tree);
        });
    });
    
    const searchInput = modal.querySelector('#skills-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filterText = e.target.value.toLowerCase();
            const activePanel = Array.from(panels).find(p => p.style.display === 'block');
            if (activePanel) {
                const treeKey = activePanel.getAttribute('data-tree');
                activePanel.innerHTML = renderTree(treeKey, window.advancedSkills[treeKey], filterText);
                attachLearnButtons(modal);
            }
        });
    }
    
    function attachLearnButtons(modalElement) {
        modalElement.querySelectorAll('.learn-skill-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const treeKey = newBtn.getAttribute('data-tree');
                const skillKey = newBtn.getAttribute('data-skill');
                if (!treeKey || !skillKey) return;
                if (typeof window.learnAdvancedSkill === 'function') {
                    const success = window.learnAdvancedSkill(hero, treeKey, skillKey);
                    if (success) {
                        const pointsSpan = document.getElementById('skills-available-points');
                        if (pointsSpan) pointsSpan.innerText = hero.skillPoints;
                        closeModal();
                        window.openSkillsUI(hero); // отваряме с този герой
                    }
                } else {
                    showSkillsMessage("ГРЕШКА", "Системата за умения не е заредена правилно.", "error");
                }
            });
        });
    }
    
    const autoBtn = modal.querySelector('#auto-assign-all-btn');
    if (autoBtn) {
        autoBtn.addEventListener('click', () => {
            if (hero.skillPoints <= 0) {
                showSkillsMessage("ИНФО", "Нямате свободни точки за разпределяне.", "info");
                return;
            }
            if (typeof window.autoAssignSkillPoint !== 'function') {
                showSkillsMessage("ГРЕШКА", "Функцията за автоматично разпределение липсва.", "error");
                return;
            }
            let pointsUsed = 0;
            while (hero.skillPoints > 0) {
                const oldPoints = hero.skillPoints;
                window.autoAssignSkillPoint(hero);
                if (hero.skillPoints === oldPoints) break;
                pointsUsed++;
            }
            if (pointsUsed > 0) {
                const pointsSpan = document.getElementById('skills-available-points');
                if (pointsSpan) pointsSpan.innerText = hero.skillPoints;
                showSkillsMessage("АВТО-РАЗПРЕДЕЛЕНИЕ", `🤖 Разпределени ${pointsUsed} точки за умения.`, "success");
                closeModal();
                window.openSkillsUI(hero);
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (typeof window.updateStrongestHeroUI === 'function') {
                    window.updateStrongestHeroUI();
                }
            } else {
                showSkillsMessage("ВНИМАНИЕ", "Няма достъпни умения за научаване (изпълнени ли са всички изисквания?)", "warning");
            }
        });
    }
    
    attachLearnButtons(modal);
};
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

    // Генерира HTML за едно дърво (с филтър)
    function renderTree(treeKey, tree, filterText = "") {
        let pointsInTree = getTreePoints(treeKey);
        let skillsHtml = '';
        for (let skillKey in tree.skills) {
            const skill = tree.skills[skillKey];
            const currentLevel = hero.learnedSkills[skillKey] || 0;
            const isMax = currentLevel >= skill.maxLevel;
            // Филтриране по текст
            if (filterText && !skill.name.toLowerCase().includes(filterText) && !skill.desc.toLowerCase().includes(filterText)) {
                continue;
            }
            const canLearn = (!isMax && hero.skillPoints > 0 && hero.level >= skill.reqLevel && pointsInTree >= skill.reqPointsInTree);
            const reqMet = (hero.level >= skill.reqLevel && pointsInTree >= skill.reqPointsInTree);
            skillsHtml += `
                <div class="skill-card" style="background:rgba(20,20,30,0.6); border:1px solid #d4af37; border-radius:12px; padding:10px; margin-bottom:8px; ${!reqMet ? 'opacity:0.7;' : ''}">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="font-size:24px;">${skill.icon || '⭐'}</div>
                        <div style="flex:1;">
                            <div><strong style="color:#ffd700;">${skill.name}</strong> <span style="color:#aaa;">(Ниво ${currentLevel}/${skill.maxLevel})</span></div>
                            <div style="font-size:11px; color:#ccc;">${skill.desc}</div>
                            <div style="font-size:10px; color:#88ff88;">Изисква: Ниво ${skill.reqLevel}, ${skill.reqPointsInTree} т. в дървото</div>
                        </div>
                        ${!isMax ? 
                            `<button class="learn-skill-btn" data-tree="${treeKey}" data-skill="${skillKey}" style="background:#daa520; border:none; border-radius:20px; padding:4px 12px; color:#000; cursor:${canLearn ? 'pointer' : 'not-allowed'}; opacity:${canLearn ? 1 : 0.5};">📖 Научи (1 т.)</button>` : 
                            `<span style="color:#00ffcc;">✓ MAX</span>`
                        }
                    </div>
                </div>
            `;
        }
        if (skillsHtml === "") {
            skillsHtml = '<div style="text-align:center; color:#888; padding:20px;">Няма умения, отговарящи на филтъра.</div>';
        }
        return `
            <div class="skill-tree-panel" style="margin-bottom:20px;">
                <h3 style="color:#ffd700; border-bottom:1px solid #d4af37; padding-bottom:5px;">${tree.icon} ${tree.name} <span style="font-size:12px; color:#aaa;">(Точки в дървото: ${pointsInTree})</span></h3>
                <div style="max-height:400px; overflow-y:auto; padding-right:10px;">${skillsHtml}</div>
            </div>
        `;
    }

    // Генерира табове и съдържание
    let tabsHtml = '<div style="display:flex; gap:10px; border-bottom:1px solid #d4af37; margin-bottom:15px; flex-wrap:wrap; align-items:center;">';
    let panelsHtml = '';
    let first = true;
    for (let treeKey in window.advancedSkills) {
        const tree = window.advancedSkills[treeKey];
        tabsHtml += `<button class="skill-tab-btn" data-tree="${treeKey}" style="background:${first ? '#daa520' : '#2c2c3a'}; border:none; border-radius:20px; padding:6px 15px; color:${first ? '#000' : '#ffd700'}; cursor:pointer; margin-bottom:5px;">${tree.icon} ${tree.name}</button>`;
        panelsHtml += `<div class="skill-tab-panel" data-tree="${treeKey}" style="display:${first ? 'block' : 'none'};">${renderTree(treeKey, tree, "")}</div>`;
        first = false;
    }
    tabsHtml += `
        <div style="flex:1; text-align:right;">
            <input type="text" id="skills-search-input" placeholder="🔍 Търси умение..." style="background:#2c2c3a; border:1px solid #d4af37; border-radius:20px; padding:4px 12px; color:#ffd700; font-size:12px;">
        </div>
    </div>`;

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
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                <div style="background:rgba(0,0,0,0.5); padding:4px 12px; border-radius:20px;">
                    <span style="color:#aaa;">Ниво ${hero.level}</span> | 
                    <span style="color:#aaa;">Клас: ${hero.currentClass || "Багатур"}</span>
                </div>
                <div style="background:rgba(0,0,0,0.5); padding:4px 12px; border-radius:20px;">
                    <span style="color:#ffd700;">Свободни точки: <strong id="skills-available-points">${hero.skillPoints}</strong></span>
                </div>
                <button id="auto-assign-all-btn" style="background:#2c5a2a; border:1px solid #44ff44; border-radius:30px; padding:4px 12px; color:#fff; cursor:pointer;">🤖 Автоматично всички точки</button>
            </div>
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
    let currentTree = tabBtns[0]?.getAttribute('data-tree') || null;
    
    function switchTab(treeKey) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tree') === treeKey) {
                btn.style.background = '#daa520';
                btn.style.color = '#000';
            } else {
                btn.style.background = '#2c2c3a';
                btn.style.color = '#ffd700';
            }
        });
        panels.forEach(panel => {
            panel.style.display = panel.getAttribute('data-tree') === treeKey ? 'block' : 'none';
        });
        currentTree = treeKey;
        // Обновяваме съдържанието с текущия филтър
        const filterInput = document.getElementById('skills-search-input');
        if (filterInput) {
            const filterText = filterInput.value.toLowerCase();
            for (let treeKeyInner in window.advancedSkills) {
                const panelDiv = document.querySelector(`.skill-tab-panel[data-tree="${treeKeyInner}"]`);
                if (panelDiv && treeKeyInner === treeKey) {
                    panelDiv.innerHTML = renderTree(treeKeyInner, window.advancedSkills[treeKeyInner], filterText);
                } else if (panelDiv && treeKeyInner !== treeKey) {
                    // Не обновяваме неактивните, за да не загубим скрол позиция
                }
            }
            attachLearnButtons(modal);
        }
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tree = btn.getAttribute('data-tree');
            switchTab(tree);
        });
    });
    
    // Филтър за търсене
    const searchInput = modal.querySelector('#skills-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filterText = e.target.value.toLowerCase();
            // Обновяваме само активния панел
            const activePanel = Array.from(panels).find(p => p.style.display === 'block');
            if (activePanel) {
                const treeKey = activePanel.getAttribute('data-tree');
                activePanel.innerHTML = renderTree(treeKey, window.advancedSkills[treeKey], filterText);
                attachLearnButtons(modal);
            }
        });
    }
    
    // Функция за закачане на бутоните за научаване
    function attachLearnButtons(modalElement) {
        modalElement.querySelectorAll('.learn-skill-btn').forEach(btn => {
            // Премахваме старите слушатели, за да избегнем дублиране
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const treeKey = newBtn.getAttribute('data-tree');
                const skillKey = newBtn.getAttribute('data-skill');
                if (!treeKey || !skillKey) return;
                if (typeof window.learnAdvancedSkill === 'function') {
                    const success = window.learnAdvancedSkill(hero, treeKey, skillKey);
                    if (success) {
                        const pointsSpan = document.getElementById('skills-available-points');
                        if (pointsSpan) pointsSpan.innerText = hero.skillPoints;
                        closeModal();
                        window.openSkillsUI(); // презареждаме модала с обновени данни
                    }
                } else {
                    showSkillsMessage("ГРЕШКА", "Системата за умения не е заредена правилно.", "error");
                }
            });
        });
    }
    
    // Автоматично разпределяне на всички точки
    const autoBtn = modal.querySelector('#auto-assign-all-btn');
    if (autoBtn) {
        autoBtn.addEventListener('click', () => {
            if (hero.skillPoints <= 0) {
                showSkillsMessage("ИНФО", "Нямате свободни точки за разпределяне.", "info");
                return;
            }
            if (typeof window.autoAssignSkillPoint !== 'function') {
                showSkillsMessage("ГРЕШКА", "Функцията за автоматично разпределение липсва.", "error");
                return;
            }
            let pointsUsed = 0;
            while (hero.skillPoints > 0) {
                const oldPoints = hero.skillPoints;
                window.autoAssignSkillPoint(hero);
                if (hero.skillPoints === oldPoints) break; // Защита от безкраен цикъл
                pointsUsed++;
            }
            if (pointsUsed > 0) {
                const pointsSpan = document.getElementById('skills-available-points');
                if (pointsSpan) pointsSpan.innerText = hero.skillPoints;
                showSkillsMessage("АВТО-РАЗПРЕДЕЛЕНИЕ", `🤖 Разпределени ${pointsUsed} точки за умения.`, "success");
                closeModal();
                window.openSkillsUI();
                if (window.updateCharacterUI) window.updateCharacterUI(hero);
                if (window.renderTop6HeroesUI) window.renderTop6HeroesUI();
            } else {
                showSkillsMessage("ВНИМАНИЕ", "Няма достъпни умения за научаване (изпълнени ли са всички изисквания?)", "warning");
            }
        });
    }
    
    attachLearnButtons(modal);
};



console.log("✅ skills-ui.js версия 2.0 зареден – с търсене, автоматично разпределение, подобрен интерфейс и пълна синхронизация.");
