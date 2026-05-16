/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * СТАТУС: МОБИЛНО ОПТИМИЗИРАН (Топ 6 лента с 4 видими заоблени карти на телефон, прогрес барове и инвентар)
 * Статистика на файловете в проекта: 16
 */

window.eventHistory = [];  

/**
 * Функция за динамично генериране на Топ 6 най-опитни владетели
 */
window.renderTop6LeadersUI = function() {
    let targetContainer = document.getElementById('game-time-display')?.parentNode || document.querySelector('.main-content') || document.body;
    if (!targetContainer) return;

    // Инжектираме CSS стилове за мобилна адаптивност, ако все още не съществуват
    let styleSheet = document.getElementById('top-6-responsive-style');
    if (!styleSheet) {
        styleSheet = document.createElement("style");
        styleSheet.id = 'top-6-responsive-style';
        styleSheet.innerText = `
            /* Скриване на системния скролбар за чист интерфейс */
            #top-6-leaders-bar::-webkit-scrollbar { display: none; }
            #top-6-leaders-bar { -ms-overflow-style: none; scrollbar-width: none; }
            
            /* Дефолтни карти за голям екран */
            .leader-rpg-card {
                flex: 1;
                min-width: 95px;
            }
            
            /* МОБИЛНА ОПТИМИЗАЦИЯ: Точно 4 иконки видими на екрана на телефон */
            @media (max-width: 768px) {
                #top-6-leaders-bar {
                    justify-content: flex-start !important;
                    padding: 8px 6px !important;
                    gap: 10px !important;
                }
                .leader-rpg-card {
                    /* Изчислява се така, че точно 4 карти да запълнят 100% от ширината, минус разстоянията */
                    flex: 0 0 calc(25% - 8px) !important;
                    min-width: 78px !important;
                }
                .leader-avatar-box {
                    width: 50px !important;
                    height: 50px !important;
                    font-size: 20px !important;
                }
                .leader-name-text {
                    font-size: 0.65em !important;
                    max-width: 76px !important;
                }
                .leader-class-text {
                    font-size: 0.52em !important;
                    max-width: 76px !important;
                }
                .leader-xp-bar-container {
                    width: 60px !important;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    let leadersBar = document.getElementById('top-6-leaders-bar');
    if (!leadersBar) {
        leadersBar = document.createElement('div');
        leadersBar.id = 'top-6-leaders-bar';
        leadersBar.style.cssText = `
            margin: 12px auto;
            padding: 10px;
            background: linear-gradient(180deg, #141414, #1f1802);
            border: 2px solid #d4af37;
            border-radius: 8px;
            width: 96%;
            max-width: 900px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 14px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            box-shadow: 0 0 20px rgba(212,175,55,0.3);
            font-family: 'Georgia', serif;
            box-sizing: border-box;
            z-index: 999;
            -webkit-overflow-scrolling: touch;
        `;
        
        const timeEl = document.getElementById('game-time-display');
        if (timeEl) {
            timeEl.parentNode.insertBefore(leadersBar, timeEl.nextSibling);
        } else {
            targetContainer.insertBefore(leadersBar, targetContainer.firstChild);
        }
    }

    // Събиране на реалните водачи от играта
    let allLeaders = [];
    if (window.currentHero) {
        allLeaders.push({ 
            ...window.currentHero, 
            isMain: true,
            level: window.currentHero.level || 1,
            xp: window.currentHero.xp || 0,
            maxXp: window.currentHero.maxXp || 100,
            currentClass: window.currentHero.currentClass || "Велик Кан"
        });
    }
    
    if (window.mightyLeaders && window.mightyLeaders.length > 0) {
        window.mightyLeaders.forEach(ml => { 
            allLeaders.push({ 
                ...ml, 
                isMain: false,
                level: ml.level || 1,
                xp: ml.xp || 0,
                maxXp: ml.maxXp || 100,
                currentClass: ml.currentClass || "Пълководец"
            }); 
        });
    }

    if (allLeaders.length === 0) {
        leadersBar.style.display = 'none';
        return;
    }

    leadersBar.style.display = 'flex';

    // Сортиране по ниво и опит в низходящ ред
    allLeaders.sort((a, b) => (b.level !== a.level) ? (b.level - a.level) : (b.xp - a.xp));
    const top6 = allLeaders.slice(0, 6);
    
    window.realMainHeroReference = window.currentHero;

    leadersBar.innerHTML = top6.map((leader, index) => {
        let icon = leader.isMain ? "🛡️" : "⚔️";
        let xpPercent = Math.min(100, Math.floor((leader.xp / (leader.maxXp || 100)) * 100));
        let borderGlow = index === 0 ? "border: 2px solid #ffd700; box-shadow: 0 0 8px rgba(255,215,0,0.4);" : "border: 1px solid #d4af37;";
        let crownSize = index === 0 ? "18px" : "14px";
        let crownGlow = index === 0 ? "filter: drop-shadow(0 0 5px #ffd700);" : "opacity: 0.7;";

        return `
            <div class="leader-rpg-card" 
                 onclick="window.inspectSpecificRuler(${index}, ${JSON.stringify(leader).replace(/"/g, '&quot;')})" 
                 style="text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; scroll-snap-align: start;" 
                 onmouseover="this.style.transform='scale(1.05)'" 
                 onmouseout="this.style.transform='scale(1)'">
                
                <div class="leader-name-text" style="font-size: 0.72em; font-weight: bold; color: #ffd700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 92px; line-height: 1.2;">
                    ${leader.name}
                </div>
                <div class="leader-class-text" style="font-size: 0.58em; color: #aaa; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 92px;">
                    ${leader.currentClass}
                </div>

                <div style="position: relative; display: flex; flex-direction: column; align-items: center; margin-bottom: 4px;">
                    <div style="font-size: ${crownSize}; ${crownGlow}; line-height: 1; margin-bottom: -3px; z-index: 2;">👑</div>
                    <div class="leader-avatar-box" style="
                        width: 58px;
                        height: 58px;
                        background: rgba(0,0,0,0.5);
                        border-radius: 8px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 24px;
                        box-sizing: border-box;
                        ${borderGlow}
                    ">
                        ${icon}
                    </div>
                </div>
                
                <div style="font-size: 0.68em; font-weight: bold; color: #00ffcc; line-height: 1.1; margin-bottom: 2px;">
                    Н. ${leader.level}
                </div>
                <div class="leader-xp-bar-container" style="width: 66px; height: 4px; background: #333; border-radius: 2px; overflow: hidden; border: 1px solid rgba(212,175,55,0.2); box-sizing: border-box;">
                    <div style="width: ${xpPercent}%; height: 100%; background: linear-gradient(90deg, #00ccff, #00ffcc);"></div>
                </div>
            </div>
        `;
    }).join('');
};

/**
 * Интелигентно превключване за инспектиране на инвентар
 */
window.inspectSpecificRuler = function(index, leaderData) {
    if (!leaderData) return;
    window.currentHero = leaderData;

    if (typeof window.toggleRulerInventory === 'function') {
        const existingModal = document.getElementById('inventory-modal');
        if (existingModal) existingModal.remove();

        window.toggleRulerInventory();

        setTimeout(() => {
            const closeBtn = document.querySelector("#inventory-modal button");
            if (closeBtn) {
                closeBtn.onclick = function() {
                    const modal = document.getElementById('inventory-modal');
                    if (modal) modal.remove();
                    
                    if (window.realMainHeroReference) {
                        window.currentHero = window.realMainHeroReference;
                    }
                    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
                };
            }
        }, 100);
    } else {
        alert(`Кан ${leaderData.name}\nРод ${leaderData.dynasty} [cite: 2026-02-03]\nНиво: ${leaderData.level}`);
    }
};

window.updateCharacterUI = function(hero) {
    if (!hero) return;

    // --- 1. ЛЯВ ПАНЕЛ (Владетел, Родове и Летопис) ---
    const leftSidebar = document.getElementById('provinces-list');
    if (leftSidebar) {
        leftSidebar.innerHTML = `
            <div style="text-align: center; padding: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #d4af37;">ВЛАДЕТЕЛ</h3>
                <div style="font-size: 1.2em; margin-top: 5px;">Кан ${hero.name}</div>
                <div style="font-size: 0.85em; color: #aaa;">Род: ${hero.dynasty} | ${hero.age} г.</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #d4af37; border-bottom: 1px solid #444; padding-bottom: 5px; letter-spacing: 1px;">СЪВЕТ НА РОДОВЕТЕ</h4>
                <div style="font-size: 0.85em; max-height: 150px; overflow-y: auto; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
                    ${Object.keys(window.activeDynasties || {}).map(clanName => {
                        const clan = window.activeDynasties[clanName];
                        const isPlayer = clanName === hero.dynasty;
                        return `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: ${isPlayer ? '#d4af37' : '#fff'}">
                                <span>${isPlayer ? '👑 ' : ''}${clanName}</span>
                                <span style="font-size: 0.85em; opacity: 0.8;">${clan ? clan.regions || 0 : 0} зем.</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="history-log-container" style="border-top: 1px solid #333; padding-top: 10px;">
                <h4 style="color: #d4af37; font-size: 11px; margin-bottom: 10px; letter-spacing: 1px;">ЛЕТОПИС</h4>
                <div id="history-log" style="font-size: 10px; color: #aaa; max-height: 200px; overflow-y: auto; line-height: 1.4;">
                </div>
            </div>
        `;
    }

    // --- 2. ГОРЕН ПАНЕЛ (Ресурси) ---
    const goldEl = document.getElementById('stat-gold');
    const armyEl = document.getElementById('stat-army');
    const powerEl = document.getElementById('stat-power');

    if (goldEl) goldEl.innerText = Math.floor(hero.gold);
    if (armyEl) armyEl.innerText = hero.armySize;
    if (powerEl) powerEl.innerText = hero.heroPower;
    
    window.renderHistory();

    // Автоматично извикване при всяко опресняване
    window.renderTop6LeadersUI();

    if (window.updateTimeUI) window.updateTimeUI();
};

/**
 * ДОБАВЯНЕ НА СЪОБЩЕНИЕ И ВИЗУАЛИЗАЦИЯ
 */
window.showAdvisorMsg = function(msg) {
    const year = window.gameTime ? window.gameTime.year : 1;
    const era = window.gameTime ? window.gameTime.era : "от н.е.";
    
    window.eventHistory.unshift({ text: msg, time: `${year} ${era}` });
    
    if (window.eventHistory.length > 5) {
        window.eventHistory.pop();
    }
    
    window.renderHistory();
};

window.renderHistory = function() {
    const logEl = document.getElementById('history-log');
    if (logEl) {
        logEl.innerHTML = window.eventHistory.map(event => `
            <div style="margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 4px;">
                <span style="color: #d4af37;">[${event.time} г.]:</span> ${event.text}
            </div>
        `).join('');
    }
};
