// social-share.js
window.ShareUtils = window.ShareUtils || {};

/**
 * Генерира 9:16 (1080x1920) видео с профила на героя
 * @param {Object} hero - обект с данни за героя
 */
window.ShareUtils.generateHeroTikTokVideo = async function(hero) {
  if (!hero) {
    alert('⚠️ Няма активен герой. Запази играта и опитай отново.');
    return;
  }

  // Показваме loading състояние (опционално)
  const btn = document.querySelector('.tiktok-share-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Генериране...'; }

  // Скрит canvas за рендиране
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  // MediaRecorder настройка
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  const chunks = [];

  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hero.name?.replace(/[^\wа-яА-Я]/gi, '_') || 'hero'}_profile.webm`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Видеото е свалено!\n📲 Качи го в TikTok → добави trending звук → публикувай.');
    if (btn) { btn.disabled = false; btn.textContent = '🎬 TikTok Видео'; }
  };

  recorder.start();

  // Анимация (5 секунди)
  const duration = 5000;
  const startTime = performance.now();
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function drawFrame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    
    // Фон
    ctx.clearRect(0, 0, 1080, 1920);
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, '#0a0a14');
    bg.addColorStop(0.4, '#15152a');
    bg.addColorStop(1, '#1a0f2a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    // Декоративен лъч
    const glowAlpha = 0.05 + (t * 0.15);
    ctx.fillStyle = `rgba(100, 200, 255, ${glowAlpha})`;
    ctx.beginPath();
    ctx.arc(540, 400 + Math.sin(t * Math.PI * 2) * 15, 350, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 1. Име на героя
    if (t > 0.1) {
      const p = easeOutCubic(Math.min((t - 0.1) / 0.3, 1));
      ctx.globalAlpha = p;
      ctx.font = 'bold 84px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`🏛️ ${hero.name || 'Безименен Хан'}`, 540, 500 + 150 * (1 - p));
    }

    // 2. Статистики
    if (t > 0.35) {
      const p = easeOutCubic(Math.min((t - 0.35) / 0.4, 1));
      ctx.globalAlpha = p;
      ctx.font = '58px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#d0d0e0';
      ctx.fillText(`⭐ Ниво: ${hero.level || 1}  |  ⚔️ Мощ: ${(hero.power || 0).toLocaleString('bg-BG')}`, 540, 760 + 100 * (1 - p));
      
      ctx.fillStyle = '#c9a227';
      ctx.fillText(`🌍 Региони: ${hero.regions || 0}  |  🏆 Постижения: ${hero.achievements?.length || 0}`, 540, 880 + 80 * (1 - p));
    }

    // 3. CTA + Линк
    if (t > 0.75) {
      const p = easeOutCubic(Math.min((t - 0.75) / 0.25, 1));
      ctx.globalAlpha = p;
      ctx.font = '62px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#25F4EE';
      ctx.fillText('🔗 Линк в Bio', 540, 1460 + 40 * (1 - p));

      ctx.font = '40px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#8888aa';
      ctx.fillText('spursster.github.io/stara-velika-bulgaria', 540, 1540);

      ctx.font = '36px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#666688';
      ctx.fillText('#ВеликаБългария #Стратегия #IndieGameBG #БраузърИгра', 540, 1690);
    }

    ctx.globalAlpha = 1;

    if (t < 1) {
      requestAnimationFrame(drawFrame);
    } else {
      // Фиксираме последния кадър и спираме записа
      setTimeout(() => recorder.stop(), 100);
    }
  }

  requestAnimationFrame(drawFrame);
};
