// social-share.js
window.ShareUtils = window.ShareUtils || {};

/**
 * Генерира 9:16 TikTok видео с профила на героя
 * @param {Object} hero - Обект с данни за героя
 */
window.ShareUtils.generateHeroTikTokVideo = async function(hero) {
  if (!hero) { alert('⚠️ Няма активен герой.'); return; }

  const btn = document.querySelector('.tiktok-share-btn, #share-hero-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Генериране...'; }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // === АУДИО КОНТЕКСТ ЗА ТИХ ЗВУК (критично за TikTok) ===
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext, audioDestination, audioStream;
    
    if (AudioContext) {
      audioContext = new AudioContext();
      audioDestination = audioContext.createMediaStreamDestination();
      
      // Генерираме 5 секунди тишина (0.01 amplitude, за да не е абсолютно мут)
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      gain.gain.value = 0.001; // Почти нечуваемо
      oscillator.connect(gain);
      gain.connect(audioDestination);
      oscillator.frequency.value = 20; // Много ниска честота
      oscillator.start();
      
      audioStream = audioDestination.stream;
    }

    // === MEDIA RECORDER С ПРИОРИТЕТИЗИРАНИ MIME TYPES ===
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus', 
      'video/webm;codecs=vp9',
      'video/webm'
    ];
    
    let selectedMimeType = '';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMimeType = mime;
        break;
      }
    }
    
    if (!selectedMimeType) {
      throw new Error('❌ MediaRecorder не поддържа нужните кодеци. Използвай Chrome/Edge.');
    }

    // Комбинираме видео + аудио потоци
    const videoStream = canvas.captureStream(30);
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...(audioStream ? audioStream.getAudioTracks() : [])
    ]);

    const recorder = new MediaRecorder(combinedStream, { 
      mimeType: selectedMimeType,
      videoBitsPerSecond: 2500000 // ~2.5 Mbps за добро качество
    });
    
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    
    recorder.onstop = async () => {
      // Спираме аудио генератора
      if (oscillator) { oscillator.stop(); audioContext.close(); }
      
      const blob = new Blob(chunks, { type: selectedMimeType.split(';')[0] });
      
      // Проверка дали файлът е валиден
      if (blob.size < 10000) {
        throw new Error('Файлът е твърде малък – генерирането се провали');
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(hero.name || 'hero').replace(/[^\wа-яА-Я]/gi, '_')}_tiktok.webm`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('✅ Видеото е свалено!\n📲 TikTok съвети:\n1. Използвай Chrome на десктоп за генериране\n2. В приложението добави trending звук\n3. Ако пак даде грешка → използвай PNG фолбек');
      
      if (btn) { btn.disabled = false; btn.textContent = '🎬 TikTok Видео'; }
    };

    recorder.start();

    // === ЗАРИСУВАНЕ НА КАДРИТЕ (същото като преди, с портрет) ===
    const duration = 5000, startTime = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    // Зареди портрета предварително
    let portraitImg = null;
    if (hero.portrait) {
      portraitImg = new Image();
      portraitImg.crossOrigin = 'anonymous';
      await new Promise(resolve => {
        portraitImg.onload = resolve;
        portraitImg.onerror = resolve;
        portraitImg.src = hero.portrait;
      });
    }

    function drawFrame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      ctx.clearRect(0, 0, 1080, 1920);
      
      // Фон
      const bg = ctx.createLinearGradient(0, 0, 0, 1920);
      bg.addColorStop(0, '#0a0a14'); bg.addColorStop(0.4, '#15152a'); bg.addColorStop(1, '#1a0f2a');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);

      // Портрет
      if (portraitImg && portraitImg.complete && t > 0.15) {
        const p = easeOut(Math.min((t - 0.15) / 0.4, 1));
        const size = 280 * (0.8 + 0.2 * p);
        const x = 540 - size/2;
        const y = 280 + 30 * (1 - p);
        
        ctx.strokeStyle = '#c9a227';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(540, 280 + size/2 + 30 * (1 - p), size/2 + 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(540, 280 + size/2 + 30 * (1 - p), size/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.globalAlpha = p;
        ctx.drawImage(portraitImg, x, y, size, size);
        ctx.restore();
      } else if (t > 0.15) {
        const p = easeOut(Math.min((t - 0.15) / 0.4, 1));
        ctx.globalAlpha = p;
        ctx.font = '120px system-ui, sans-serif';
        ctx.fillText('⚔️', 540, 450 + 30 * (1 - p));
      }

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = 1;

      // Име
      if (t > 0.3) {
        const p = easeOut(Math.min((t - 0.3) / 0.3, 1));
        ctx.globalAlpha = p;
        ctx.font = 'bold 64px system-ui, sans-serif'; ctx.fillStyle = '#ffd700';
        ctx.fillText(`${hero.name || 'Безименен Хан'}`, 540, 720 + 40 * (1 - p));
        
        ctx.font = '42px system-ui, sans-serif'; ctx.fillStyle = '#c9a227';
        const classIcon = hero.currentClass === 'Воин' ? '⚔️' : 
                          hero.currentClass === 'Магьосник' ? '🔮' : 
                          hero.currentClass === 'Стрелец' ? '🏹' : '🛡️';
        ctx.fillText(`${classIcon} ${hero.currentClass || 'Воин'} • Ниво ${hero.level || 1}`, 540, 790 + 30 * (1 - p));
      }

      // Статистики
      if (t > 0.5) {
        const p = easeOut(Math.min((t - 0.5) / 0.4, 1));
        ctx.globalAlpha = p;
        
        const stats = [
          { label: '❤️ Здраве', value: hero.hp, max: hero.maxHp, color: '#4caf50' },
          { label: '😊 Морал', value: hero.morale || 50, max: 100, color: '#2196f3' },
          { label: '💰 Злато', value: hero.gold, max: null, color: '#ffd700', format: true },
          { label: '⚔️ Армия', value: hero.armySize || hero.army || 0, max: null, color: '#ff6b6b', format: true },
          { label: '💪 Сила', value: hero.power, max: null, color: '#ff9800', format: true }
        ];
        
        let yPos = 920;
        stats.forEach((stat, i) => {
          const statP = easeOut(Math.min((p - i * 0.1) / 0.8, 1));
          if (statP > 0) {
            ctx.font = '36px system-ui, sans-serif';
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(stat.label, 280, yPos + i * 65 + 20 * (1 - statP));
            
            if (stat.max) {
              const percent = Math.min(100, (stat.value / stat.max) * 100);
              ctx.fillStyle = '#2a1a0a';
              ctx.fillRect(400, yPos + i * 65 - 12, 400, 24);
              ctx.fillStyle = stat.color;
              ctx.fillRect(400, yPos + i * 65 - 12, 4 * percent, 24);
              ctx.strokeStyle = '#c9a87b';
              ctx.lineWidth = 2;
              ctx.strokeRect(400, yPos + i * 65 - 12, 400, 24);
              ctx.fillStyle = '#fff';
              ctx.font = '28px system-ui, sans-serif';
              ctx.fillText(`${stat.value}/${stat.max}`, 850, yPos + i * 65);
            } else {
              ctx.fillStyle = stat.color;
              ctx.font = '32px system-ui, sans-serif';
              ctx.fillText(stat.format ? (typeof stat.value === 'number' ? stat.value.toLocaleString('bg-BG') : stat.value) : stat.value, 850, yPos + i * 65);
            }
          }
        });
      }

      // Екипировка
      if (t > 0.7 && hero.equipment) {
        const p = easeOut(Math.min((t - 0.7) / 0.3, 1));
        ctx.globalAlpha = p * 0.9;
        ctx.font = '24px system-ui, sans-serif';
        ctx.fillStyle = '#ffdd99';
        ctx.fillText('🎒 Екипировка', 540, 1420);
        const slots = hero.equipment.slice(0, 6).filter(e => e);
        slots.forEach((item, i) => {
          if (item) {
            ctx.font = '32px system-ui, sans-serif';
            ctx.fillText(item.icon || '🔮', 300 + i * 80, 1470);
          }
        });
      }

      // CTA
      if (t > 0.85) {
        const p = easeOut(Math.min((t - 0.85) / 0.15, 1));
        ctx.globalAlpha = p;
        ctx.font = '48px system-ui, sans-serif'; ctx.fillStyle = '#25F4EE';
        ctx.fillText('🔗 Линк в Bio', 540, 1650);
        ctx.font = '32px system-ui, sans-serif'; ctx.fillStyle = '#8888aa';
        ctx.fillText('spursster.github.io/stara-velika-bulgaria', 540, 1720);
        ctx.font = '28px system-ui, sans-serif'; ctx.fillStyle = '#666688';
        ctx.fillText('#ВеликаБългария #Стратегия #IndieGameBG', 540, 1800);
      }

      if (t < 1) requestAnimationFrame(drawFrame);
      else setTimeout(() => recorder.stop(), 100);
    }
    
    requestAnimationFrame(drawFrame);

  } catch (err) {
    console.error('Video generation error:', err);
    
    // === ФОЛБЕК КЪМ PNG ===
    if (btn) { btn.disabled = false; btn.textContent = '📥 Свали като PNG'; }
    
    const usePng = confirm(`⚠️ Видео генерирането се провали:\n${err.message}\n\nИскаш ли да свалиш като PNG картинка вместо това?`);
    
    if (usePng) {
      // Генерираме същия визуален дизайн, но като статично изображение
      const pngCanvas = document.createElement('canvas');
      pngCanvas.width = 1080; pngCanvas.height = 1920;
      const pCtx = pngCanvas.getContext('2d');
      
      // Рисуваме финалния кадър (t=1)
      // [Тук можеш да копираш drawFrame логиката с t=1, или да използваш по-прост вариант]
      
      // За бързина: минимален дизайн за PNG
      const bg = pCtx.createLinearGradient(0, 0, 0, 1920);
      bg.addColorStop(0, '#0a0a14'); bg.addColorStop(1, '#1a0f2a');
      pCtx.fillStyle = bg; pCtx.fillRect(0, 0, 1080, 1920);
      
      pCtx.textAlign = 'center'; pCtx.fillStyle = '#fff';
      pCtx.font = 'bold 84px system-ui';
      pCtx.fillText(`🏛️ ${hero.name || 'Безименен'}`, 540, 400);
      pCtx.font = '56px system-ui'; pCtx.fillStyle = '#c9a227';
      pCtx.fillText(`⭐ Ниво ${hero.level} • ⚔️ ${(hero.power||0).toLocaleString()}`, 540, 520);
      pCtx.font = '40px system-ui'; pCtx.fillStyle = '#888';
      pCtx.fillText('🔗 spursster.github.io/stara-velika-bulgaria', 540, 1800);
      
      pngCanvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${(hero.name||'hero').replace(/[^\wа-яА-Я]/gi,'_')}_profile.png`;
        a.click();
        alert('✅ PNG свалено!\n📲 Качи го в TikTok като снимка + добави звук в приложението.');
      }, 'image/png');
    }
    
    if (btn) { btn.disabled = false; btn.textContent = '🎬 TikTok Видео'; }
  }
};

/**
 * Wrapper функция - това ще извикаш от ui.js
 */
window.shareHeroCard = async function(hero) {
  // Тук можеш да добавиш меню за избор в бъдеще
  // Засега директно генерираме TikTok видео
  await window.ShareUtils.generateHeroTikTokVideo(hero);
};
