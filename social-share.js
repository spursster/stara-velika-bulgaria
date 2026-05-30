// social-share.js
window.ShareUtils = window.ShareUtils || {};

/**
 * Заснема профила на героя 1:1 като PNG изображение.
 * Използва html2canvas за точно визуално копие на DOM елементите.
 */
window.ShareUtils.captureProfile1to1 = async function(hero) {
    if (!hero) return alert('⚠️ Няма активен герой.');
    
    const btn = document.querySelector('#share-hero-btn, .tiktok-share-btn');
    if (btn) { btn.disabled = true; btn.textContent = '📷 Заснемане...'; }

    try {
        // 1. Създаваме скрит контейнер с размери за TikTok (1080x1920)
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: fixed; left: -9999px; top: 0;
            width: 1080px; height: 1920px;
            background: linear-gradient(180deg, #1a1a2e 0%, #0d0a07 100%);
            color: #fff; font-family: 'Cinzel', serif;
            padding: 40px 30px; box-sizing: border-box;
            display: flex; flex-direction: column; align-items: center;
            overflow: hidden;
        `;

        const portraitSrc = hero.portrait || '';
        const portraitHTML = portraitSrc
            ? `<img src="${portraitSrc}" crossorigin="anonymous" style="width:260px;height:260px;border-radius:50%;border:6px solid #ffd700;object-fit:cover;box-shadow:0 0 30px rgba(255,215,0,0.3);">`
            : `<div style="width:260px;height:260px;background:#2c1a0c;border-radius:50%;border:6px solid #ffd700;display:flex;align-items:center;justify-content:center;font-size:110px;">⚔️</div>`;

        const classIcon = hero.currentClass === 'Воин' ? '⚔️' : 
                          hero.currentClass === 'Магьосник' ? '🔮' : 
                          hero.currentClass === 'Стрелец' ? '🏹' : '🛡️';

        const hpPercent = Math.min(100, (hero.hp / (hero.maxHp || 1)) * 100);
        const moralePercent = Math.min(100, hero.morale || 50);

        // 2. Генерираме HTML, идентичен с твоя модал
        wrapper.innerHTML = `
            ${portraitHTML}
            <div style="text-align:center; margin-top:30px;">
                <div style="font-size:56px;font-weight:bold;color:#ffdd99;text-shadow:0 2px 10px rgba(0,0,0,0.5);">${hero.name || 'Безименен'}</div>
                <div style="font-size:40px;color:#ccaa77;margin:10px 0;">${classIcon} ${hero.currentClass || 'Воин'} · Ниво ${hero.level || 1}</div>
            </div>

            <div style="width:92%; background:rgba(13,10,7,0.8); border-radius:16px; padding:24px; margin-top:30px; border:2px solid #c9a87b; backdrop-filter: blur(5px);">
                <div style="margin-bottom:15px;">
                    <div style="display:flex;justify-content:space-between;color:#ffaa66;font-size:32px;margin-bottom:8px;"><span>❤️ Здраве</span><span>${hero.hp}/${hero.maxHp}</span></div>
                    <div style="background:#2a1a0a;height:24px;border-radius:12px;overflow:hidden;"><div style="background:${hpPercent>70?'#4caf50':hpPercent>30?'#ff9800':'#f44336'};width:${hpPercent}%;height:100%;"></div></div>
                </div>
                <div style="margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;color:#88ccff;font-size:32px;margin-bottom:8px;"><span>😊 Морал</span><span>${hero.morale||50}%</span></div>
                    <div style="background:#2a1a0a;height:24px;border-radius:12px;overflow:hidden;"><div style="background:${moralePercent>70?'#2196f3':moralePercent>30?'#ff9800':'#f44336'};width:${moralePercent}%;height:100%;"></div></div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;text-align:center;">
                    <div style="background:#0d0a07;padding:15px;border-radius:12px;border:1px solid #3a2a1a;"><div style="font-size:24px;color:#888;">💰 Злато</div><div style="font-size:36px;color:#ffdd99;font-weight:bold;">${hero.gold?.toLocaleString('bg-BG')||0}</div></div>
                    <div style="background:#0d0a07;padding:15px;border-radius:12px;border:1px solid #3a2a1a;"><div style="font-size:24px;color:#888;">⚔️ Армия</div><div style="font-size:36px;color:#ffdd99;font-weight:bold;">${hero.armySize||hero.army||0}</div></div>
                    <div style="background:#0d0a07;padding:15px;border-radius:12px;border:1px solid #3a2a1a;"><div style="font-size:24px;color:#888;">💪 Сила</div><div style="font-size:36px;color:#ffdd99;font-weight:bold;">${hero.power||0}</div></div>
                </div>
            </div>

            ${hero.equipment?.filter(e=>e).length ? `
            <div style="width:92%; margin-top:25px;">
                <div style="color:#ffdd99;font-size:32px;margin-bottom:15px;text-align:center;">🎒 Екипировка</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:15px;">
                    ${hero.equipment.slice(0,6).filter(e=>e).map(i => `<div style="background:#2c1a0c;width:85px;height:85px;border-radius:12px;border:2px solid #c9a87b;display:flex;align-items:center;justify-content:center;font-size:38px;" title="${i.name}">${i.icon||'🔮'}</div>`).join('')}
                </div>
            </div>` : ''}

            <div style="margin-top:auto; text-align:center; color:#888; font-size:26px; padding-bottom:40px;">
                🔗 spursster.github.io/stara-velika-bulgaria<br>
                <span style="color:#25F4EE; font-weight:bold;">#ВеликаБългария</span>
            </div>
        `;

        document.body.appendChild(wrapper);
        await new Promise(r => setTimeout(r, 400)); // Изчакваме CSS/шрифтове да се рендират

        // 3. Заснемане с html2canvas
        const canvas = await html2canvas(wrapper, {
            scale: 2,           // 2x резолюция за рязък текст
            useCORS: true,      // Разрешава външни портрети
            backgroundColor: '#1a1a2e',
            logging: false
        });

        document.body.removeChild(wrapper);

        // 4. Запазване
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(hero.name||'hero').replace(/[^\wа-яА-Я]/gi,'_')}_profile.png`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert('✅ Профилът е заснет 1:1!\n📲 Качи го в TikTok → Add Sound → Publish');
            if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
        }, 'image/png');

    } catch (err) {
        console.error('📷 Capture error:', err);
        alert('❌ Грешка при заснемане. Увери се, че използваш Chrome/Edge.');
        if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
    }
};

// Обвързваща функция за твоя UI
window.shareHeroCard = function(hero) {
    window.ShareUtils.captureProfile1to1(hero);
};
