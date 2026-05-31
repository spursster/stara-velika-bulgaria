// social-share.js
window.ShareUtils = window.ShareUtils || {};

const SLOT_NAMES = [
  "⚔️ ОРЪЖИЕ", "🛡️ ЩИТ", "🪖 ШЛЕМ", "🦺 НАГРЪДНИК", 
  "🧤 РЪКАВИЦИ", "👖 КРАЧОЛИ", "👢 БОТУШИ", "💍 ПРЪСТЕН", 
  "💍 ПРЪСТЕН 2", "📿 АМУЛЕТ", "🧣 НАМЕТАЛО", "🔱 РЕЛИКВИЯ"
];

/**
 * Генерира 9:16 картичка, която показва:
 * - Портрет, име, клас, ниво
 * - HP/Морал + Злато/Армия/Сила
 * - ЦЯЛАТА ЕКИПИРОВКА (12 слота) с икони и бонуси
 * - Събрани артефакти + любимец
 */
window.ShareUtils.generateHeroCard = async function(hero) {
    if (!hero) return alert('⚠️ Няма активен герой.');

    const btn = document.querySelector('#share-hero-btn, .tiktok-share-btn');
    if (btn) { btn.disabled = true; btn.textContent = '📷 Генериране на картичка...'; }

    try {
        // 1. Създаваме скрит контейнер с точни TikTok размери
        const card = document.createElement('div');
        card.style.cssText = `
            position: absolute; left: -9999px; top: 0;
            width: 1080px; height: 1920px;
            background: linear-gradient(180deg, #0a0a14 0%, #15152a 50%, #1a0f2a 100%);
            color: #fff; font-family: 'Cinzel', 'Segoe UI', sans-serif;
            padding: 40px; box-sizing: border-box; display: flex; flex-direction: column;
        `;

        const portraitHTML = hero.portrait 
            ? `<img src="${hero.portrait}" crossorigin="anonymous" style="width:220px;height:220px;border-radius:50%;border:6px solid #ffd700;object-fit:cover;box-shadow:0 0 25px rgba(255,215,0,0.3);">`
            : `<div style="width:220px;height:220px;background:#2c1a0c;border-radius:50%;border:6px solid #ffd700;display:flex;align-items:center;justify-content:center;font-size:90px;">⚔️</div>`;

        const classIcon = hero.currentClass === 'Воин' ? '⚔️' : hero.currentClass === 'Магьосник' ? '🔮' : hero.currentClass === 'Стрелец' ? '🏹' : '🛡️';
        const hpPct = Math.min(100, ((hero.hp || 0) / (hero.maxHp || 1)) * 100);
        const moralePct = Math.min(100, hero.morale || 50);

        // 2. Генерираме HTML с ТОЧНАТА структура, която искаш
        card.innerHTML = `
            <!-- ЗАГЛАВИЕ -->
            <div style="text-align:center; margin-bottom:25px;">
                ${portraitHTML}
                <h1 style="font-size:58px; color:#ffd700; margin:15px 0 5px; text-shadow:0 2px 8px rgba(0,0,0,0.6);">${hero.name || 'Безименен Хан'}</h1>
                <p style="font-size:42px; color:#c9a227; margin:0;">${classIcon} ${hero.currentClass || 'Клас'} • Ниво ${hero.level || 1}</p>
            </div>

            <!-- ОСНОВНИ СТАТИСТИКИ -->
            <div style="background:rgba(13,10,7,0.7); border:2px solid #c9a87b; border-radius:16px; padding:20px; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:32px;">
                    <span>❤️ Здраве</span><span>${hero.hp||0}/${hero.maxHp||100}</span>
                </div>
                <div style="background:#2a1a0a;height:22px;border-radius:11px;overflow:hidden;margin-bottom:15px;">
                    <div style="background:${hpPct>70?'#4caf50':hpPct>30?'#ff9800':'#f44336'};width:${hpPct}%;height:100%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:32px;">
                    <span>😊 Морал</span><span>${hero.morale||50}%</span>
                </div>
                <div style="background:#2a1a0a;height:22px;border-radius:11px;overflow:hidden;">
                    <div style="background:${moralePct>70?'#2196f3':moralePct>30?'#ff9800':'#f44336'};width:${moralePct}%;height:100%;"></div>
                </div>
                <div style="display:flex; justify-content:space-around; margin-top:18px; text-align:center;">
                    <div><div style="font-size:26px;color:#888;">💰 Злато</div><div style="font-size:38px;color:#ffdd99;font-weight:bold;">${(hero.gold||0).toLocaleString('bg-BG')}</div></div>
                    <div><div style="font-size:26px;color:#888;">⚔️ Армия</div><div style="font-size:38px;color:#ffdd99;font-weight:bold;">${hero.armySize||hero.army||0}</div></div>
                    <div><div style="font-size:26px;color:#888;">💪 Сила</div><div style="font-size:38px;color:#ffdd99;font-weight:bold;">${hero.power||0}</div></div>
                </div>
            </div>

            <!-- 🔥 ЕКИПИРОВКА (12 СЛОТА) 🔥 -->
            <div style="background:rgba(13,10,7,0.6); border:2px solid #c9a87b; border-radius:16px; padding:20px; margin-bottom:15px; flex:1;">
                <h3 style="text-align:center; color:#ffdd99; font-size:34px; margin:0 0 15px; border-bottom:2px solid #3a2a1a; padding-bottom:10px;">🎒 ЕКИПИРОВКА & ИНВЕНТАР</h3>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
                    ${hero.equipment.map((item, i) => {
                        const hasItem = item && item.id;
                        const icon = hasItem ? (item.icon || '🔮') : '⬜';
                        const name = hasItem ? (item.name.length > 9 ? item.name.slice(0,8)+'..' : item.name) : SLOT_NAMES[i];
                        const bonus = hasItem ? `+${item.bonus?.heroPower || item.bonus?.goldBonus || 0}` : '';
                        return `
                        <div style="background:#1a0f0a; border:1px solid #5a4a2a; border-radius:10px; padding:8px; text-align:center; aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                            <div style="font-size:36px; margin-bottom:4px;">${icon}</div>
                            <div style="font-size:18px; color:${hasItem?'#ffdd99':'#888'}; line-height:1.1; margin-bottom:2px;">${name}</div>
                            ${hasItem ? `<div style="font-size:16px; color:#88ff88; font-weight:bold;">${bonus}</div>` : `<div style="font-size:14px; color:#555;">${SLOT_NAMES[i].slice(0,8)}</div>`}
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <!-- АРТЕФАКТИ + ЛЮБИМЕЦ -->
            <div style="display:flex; gap:15px; margin-bottom:20px;">
                <div style="flex:2; background:rgba(13,10,7,0.6); border:2px solid #c9a87b; border-radius:16px; padding:15px;">
                    <h4 style="color:#ffdd99; font-size:28px; margin:0 0 10px;">🏺 АРТЕФАКТИ</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        ${hero.inventory && hero.inventory.length > 0 
                            ? hero.inventory.filter(a=>a&&a.id).slice(0,8).map(a => `
                                <div style="background:#2c1a0c; border:1px solid #5a4a2a; border-radius:8px; padding:6px; text-align:center; width:65px;">
                                    <div style="font-size:26px;">${a.icon||'🏺'}</div>
                                    <div style="font-size:14px; color:#ffdd99;">${a.name.length>7?a.name.slice(0,6)+'..':a.name}</div>
                                </div>`).join('')
                            : `<div style="color:#aa8866; font-size:24px; padding:15px; text-align:center;">Няма събрани артефакти</div>`
                        }
                    </div>
                </div>
                <div style="flex:1; background:rgba(13,10,7,0.6); border:2px solid #c9a87b; border-radius:16px; padding:15px; text-align:center;">
                    <h4 style="color:#ffdd99; font-size:28px; margin:0 0 10px;">🐾 ЛЮБИМЕЦ</h4>
                    ${hero.pet && window.rpgDatabase?.petsDatabase?.[hero.pet] 
                        ? (() => { const p = window.rpgDatabase.petsDatabase[hero.pet]; return `<div style="font-size:48px;">${p.icon}</div><div style="font-size:22px; color:#ffaa66;">${p.name}</div><div style="font-size:16px; color:#88ff88; margin-top:5px;">${p.bonus||p.desc||''}</div>`; })()
                        : `<div style="font-size:48px; opacity:0.3;">🐾</div><div style="color:#aa8866; font-size:20px;">Няма любимец</div>`
                    }
                </div>
            </div>

            <!-- ФУТЪР -->
            <div style="text-align:center; margin-top:auto; padding-top:15px; border-top:2px solid #2a1a0a;">
                <div style="font-size:32px; color:#25F4EE; margin-bottom:8px;">🔗 Линк в Bio</div>
                <div style="font-size:28px; color:#888;">spursster.github.io/stara-velika-bulgaria</div>
                <div style="font-size:24px; color:#666; margin-top:8px;">#ВеликаБългария #Стратегия #IndieGameBG</div>
            </div>
        `;

        document.body.appendChild(card);
        await new Promise(r => setTimeout(r, 600)); // Изчакване за шрифтове/картини

        // 3. Заснемане с html2canvas
        const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0a0a14',
            logging: false,
            windowWidth: 1080,
            windowHeight: 1920
        });

        document.body.removeChild(card);

        // 4. Запазване
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(hero.name||'hero').replace(/[^\wа-яА-Я]/gi,'_')}_full_profile.png`;
            a.click();
            URL.revokeObjectURL(url);
            alert('✅ Картината е готова с ЦЕЛИЯ инвентар!\n📲 Качи я в TikTok → Add Sound → Publish');
            if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
        }, 'image/png');

    } catch (err) {
        console.error('📷 Card generation error:', err);
        alert('❌ Грешка при генериране. Провери конзолата или използвай Chrome.');
        if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
    }
};

// Обвързваща функция за твоя UI
window.shareHeroCard = function(hero) {
    window.ShareUtils.generateHeroCard(hero);
};
