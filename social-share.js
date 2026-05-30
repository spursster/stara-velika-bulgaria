// social-share.js

window.ShareUtils = window.ShareUtils || {};

/**
 * Генерира вертикална картичка (1080x1920) за TikTok,
 * която показва пълния визуален профил на героя.
 */
window.ShareUtils.generateHeroCard = function(hero) {
    if (!hero) { alert('⚠️ Няма данни за героя.'); return; }

    const btn = document.querySelector('.tiktok-share-btn, #share-hero-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Създаване...'; }

    // 1. Създаваме Canvas с размери за TikTok (9:16)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 2. Функция за рисуване на всичко
    function drawCard(portraitImg) {
        // --- ФОН ---
        const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
        gradient.addColorStop(0, '#1a0f2a');
        gradient.addColorStop(0.5, '#0f0a1a');
        gradient.addColorStop(1, '#2a1a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);

        // Декоративна рамка
        ctx.strokeStyle = '#c9a227';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 1040, 1880);

        // --- ПОРТРЕТ ---
        ctx.save();
        ctx.beginPath();
        // Кръг в горната част
        const centerX = 540;
        const centerY = 400;
        const radius = 180;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.clip();

        if (portraitImg) {
            // Рисуване на портрета (fit into circle)
            const size = radius * 2;
            ctx.drawImage(portraitImg, centerX - radius, centerY - radius, size, size);
        } else {
            // Фолбек ако няма портрет
            ctx.fillStyle = '#333';
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '150px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚔️', centerX, centerY);
        }
        ctx.restore();

        // Златна рамка около портрета
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#ffd700';
        ctx.stroke();

        // --- ТЕКСТОВА ИНФОРМАЦИЯ ---
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Име
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 70px sans-serif';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        ctx.fillText(hero.name || 'Безименен Герой', 540, 700);
        ctx.shadowBlur = 0;

        // Клас и Ниво
        ctx.fillStyle = '#ffd700';
        ctx.font = '50px sans-serif';
        const classIcon = hero.currentClass === 'Воин' ? '⚔️' : 
                          hero.currentClass === 'Магьосник' ? '🔮' : 
                          hero.currentClass === 'Стрелец' ? '🏹' : '🛡️';
        ctx.fillText(`${classIcon} ${hero.currentClass || 'Клас'} • Ниво ${hero.level || 1}`, 540, 780);

        // --- СТАТИСТИКИ (Визуални ленти) ---
        let yPos = 900;
        
        // Функция за лента
        function drawBar(label, val, max, color) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '40px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(label, 150, yPos);

            // Фон на бара
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(150, yPos + 20, 780, 30);

            // Прогрес
            let pct = max > 0 ? Math.min(1, val / max) : 1;
            ctx.fillStyle = color;
            ctx.fillRect(150, yPos + 20, 780 * pct, 30);

            // Текст стойност
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`${val} / ${max}`, 930, yPos);

            yPos += 100;
        }

        // Здраве
        drawBar('❤️ Здраве', hero.hp || 0, hero.maxHp || 100, '#4caf50');
        
        // Морал
        drawBar('😊 Морал', hero.morale || 0, 100, '#2196f3');

        yPos += 20; // Разделител

        // --- ЧИСЛОВИ ДАННИ (Злато, Армия, Сила) ---
        ctx.textAlign = 'center';
        ctx.fillStyle = '#c9a227';
        ctx.font = '45px sans-serif';
        
        // Злато
        ctx.fillText(`💰 ${hero.gold ? hero.gold.toLocaleString() : 0}`, 360, yPos);
        // Армия
        ctx.fillText(`⚔️ ${hero.armySize || hero.army || 0}`, 540, yPos);
        // Сила
        ctx.fillText(`💪 ${hero.power || 0}`, 720, yPos);

        // --- ФУТЪР ---
        ctx.fillStyle = '#888';
        ctx.font = '35px sans-serif';
        ctx.fillText('🔗 spursster.github.io/stara-velika-bulgaria', 540, 1700);
        
        ctx.fillStyle = '#25F4EE';
        ctx.font = 'bold 45px sans-serif';
        ctx.fillText('👑 Велика България 👑', 540, 1800);

        // --- ЗАПАЗВАНЕ ---
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${hero.name || 'hero'}_profile.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
            alert('✅ Картината е готова!\n\n📲 Качи я в TikTok и добави любимата си музика.');
        }, 'image/png');
    }

    // 3. Зареждане на портрета (ако има)
    if (hero.portrait) {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Важно за сигурност
        img.onload = function() { drawCard(img); };
        img.onerror = function() { drawCard(null); }; // Ако портретът е счупен
        img.src = hero.portrait;
    } else {
        drawCard(null);
    }
};

// Обвързваща функция за UI
window.shareHeroCard = function(hero) {
    window.ShareUtils.generateHeroCard(hero);
};
