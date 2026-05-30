// social-share.js
window.ShareUtils = window.ShareUtils || {};

/**
 * Генерира 9:16 видео с профила на героя.
 * Автоматично фолбеква към PNG при грешка.
 */
window.ShareUtils.generateHeroTikTokVideo = async function(hero) {
    if (!hero) { alert('⚠️ Няма активен герой.'); return; }

    const btn = document.querySelector('.tiktok-share-btn, #share-hero-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Генериране...'; }

    try {
        // 1. Проверка за съвместимост
        if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
            throw new Error('Браузърът не поддържа video recording. Използвай Chrome/Edge.');
        }

        const canvas = document.createElement('canvas');
        canvas.width = 1080; canvas.height = 1920;
        const ctx = canvas.getContext('2d');

        // 2. MediaRecorder с безопасен mimeType
        const videoStream = canvas.captureStream(30);
        let mimeType = 'video/webm';
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) mimeType = 'video/webm;codecs=vp8';
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) mimeType = 'video/webm;codecs=vp9';

        const recorder = new MediaRecorder(videoStream, { mimeType, videoBitsPerSecond: 2500000 });
        const chunks = [];
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            if (blob.size < 5000) throw new Error('Файлът е празен/повреден.');

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(hero.name || 'hero').replace(/[^\wа-яА-Я]/gi, '_')}.webm`;
            a.click();
            URL.revokeObjectURL(url);

            alert('✅ Видеото е свалено!\n📲 В TikTok: Upload → избери файла → Add Sound → Publish');
            if (btn) { btn.disabled = false; btn.textContent = '🎬 TikTok Видео'; }
        };

        recorder.start();

        // 3. Зареждане на портрет
        let portraitImg = null;
        if (hero.portrait) {
            portraitImg = new Image();
            portraitImg.crossOrigin = 'anonymous';
            await new Promise((res, rej) => {
                portraitImg.onload = res;
                portraitImg.onerror = rej;
                portraitImg.src = hero.portrait;
            });
        }

        // 4. Анимационен цикъл
        const duration = 4000;
        const startTime = performance.now();
        let isRunning = true;

        function draw() {
            if (!isRunning) return;
            const t = Math.min((performance.now() - startTime) / duration, 1);

            // Фон
            const bg = ctx.createLinearGradient(0, 0, 0, 1920);
            bg.addColorStop(0, '#0a0a14'); bg.addColorStop(1, '#1a0f2a');
            ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);

            // Портрет
            if (portraitImg) {
                ctx.save();
                ctx.beginPath(); ctx.arc(540, 380, 140, 0, Math.PI * 2); ctx.clip();
                ctx.drawImage(portraitImg, 400, 240, 280, 280);
                ctx.restore();
                ctx.beginPath(); ctx.arc(540, 380, 146, 0, Math.PI * 2);
                ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 8; ctx.stroke();
            } else {
                ctx.fillStyle = '#ffd700'; ctx.font = '120px sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('⚔️', 540, 380);
            }

            // Текст
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 64px sans-serif';
            ctx.fillText(hero.name || 'Безименен', 540, 620);

            ctx.fillStyle = '#ffd700'; ctx.font = '46px sans-serif';
            const cls = hero.currentClass || 'Воин';
            ctx.fillText(`🏛️ ${cls} • Ниво ${hero.level || 1}`, 540, 690);

            ctx.fillStyle = '#e0e0e0'; ctx.font = '40px sans-serif';
            ctx.fillText(`❤️ ${hero.hp}/${hero.maxHp}  |  💪 ${hero.power || 0}`, 540, 780);
            ctx.fillText(`💰 ${hero.gold || 0}  |  ⚔️ ${hero.armySize || hero.army || 0}`, 540, 840);

            // CTA
            ctx.fillStyle = '#25F4EE'; ctx.font = '50px sans-serif';
            ctx.fillText('🔗 Линк в Bio', 540, 1450);
            ctx.fillStyle = '#888'; ctx.font = '32px sans-serif';
            ctx.fillText('spursster.github.io/stara-velika-bulgaria', 540, 1520);

            if (t < 1) {
                requestAnimationFrame(draw);
            } else {
                setTimeout(() => { isRunning = false; recorder.stop(); }, 200);
            }
        }

        requestAnimationFrame(draw);

    } catch (err) {
        console.error('🎬 Video generation failed:', err);
        alert('⚠️ Не успяхме да генерираме видео. Сваляме като картинка вместо това.');
        if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
        // Автоматичен фолбек към PNG
        window.ShareUtils.generateHeroCard(hero);
    }
};

// Обвързваща функция
window.shareHeroCard = function(hero) {
    window.ShareUtils.generateHeroTikTokVideo(hero);
};
