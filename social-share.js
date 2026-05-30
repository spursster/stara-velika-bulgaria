// social-share.js
window.ShareUtils = window.ShareUtils || {};

/**
 * Генерира 9:16 TikTok видео с профила на героя
 * @param {Object} hero - Обект с данни за героя
 */
window.ShareUtils.generateHeroTikTokVideo = async function(hero) {
  if (!hero) { alert('⚠️ Няма активен герой.'); return; }

  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  const chunks = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(hero.name || 'hero').replace(/[^\wа-яА-Я]/gi, '_')}_profile.webm`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Видеото е свалено!\n📲 Качи го в TikTok и добави trending звук.');
  };

  recorder.start();
  const duration = 5000, startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  // Предварително зареди портрета (ако има)
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
    
    // === ФОН ===
    const bg = ctx.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, '#0a0a14'); bg.addColorStop(0.4, '#15152a'); bg.addColorStop(1, '#1a0f2a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1920);

    // === ПОРТРЕТ НА ГЕРОЯ (Централен елемент) ===
    if (portraitImg && portraitImg.complete && t > 0.15) {
      const p = easeOut(Math.min((t - 0.15) / 0.4, 1));
      const scale = 0.8 + 0.2 * p; // леко zoom-in ефект
      const size = 280 * scale;
      const x = 540 - size/2;
      const y = 280 + 30 * (1 - p);
      
      // Златна рамка
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(540, 280 + size/2 + 30 * (1 - p), size/2 + 10, 0, Math.PI * 2);
      ctx.stroke();
      
      // Портрет
      ctx.save();
      ctx.beginPath();
      ctx.arc(540, 280 + size/2 + 30 * (1 - p), size/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = p;
      ctx.drawImage(portraitImg, x, y, size, size);
      ctx.restore();
    } else {
      // Placeholder икона ако няма портрет
      if (t > 0.15) {
        const p = easeOut(Math.min((t - 0.15) / 0.4, 1));
        ctx.globalAlpha = p;
        ctx.font = '120px system-ui, sans-serif';
        ctx.fillText('⚔️', 540, 450 + 30 * (1 - p));
      }
    }

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = 1;

    // === ИМЕ НА ГЕРОЯ ===
    if (t > 0.3) {
      const p = easeOut(Math.min((t - 0.3) / 0.3, 1));
      ctx.globalAlpha = p;
      ctx.font = 'bold 64px system-ui, sans-serif'; ctx.fillStyle = '#ffd700';
      ctx.fillText(`${hero.name || 'Безименен Хан'}`, 540, 720 + 40 * (1 - p));
      
      // Клас и ниво
      ctx.font = '42px system-ui, sans-serif'; ctx.fillStyle = '#c9a227';
      const classIcon = hero.currentClass === 'Воин' ? '⚔️' : 
                        hero.currentClass === 'Магьосник' ? '🔮' : 
                        hero.currentClass === 'Стрелец' ? '🏹' : '🛡️';
      ctx.fillText(`${classIcon} ${hero.currentClass || 'Воин'} • Ниво ${hero.level || 1}`, 540, 790 + 30 * (1 - p));
    }

    // === ВИЗУАЛНИ ЛЕНТИ ЗА СТАТИСТИКИ ===
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
            // Лента с прогрес
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

    // === ЕКИПИРОВКА ПРЕВЮ (икони) ===
    if (t > 0.7 && hero.equipment) {
      const p = easeOut(Math.min((t - 0.7) / 0.3, 1));
      ctx.globalAlpha = p * 0.9;
      
      ctx.font = '24px system-ui, sans-serif';
      ctx.fillStyle = '#ffdd99';
      ctx.fillText('🎒 Екипировка', 540, 1420);
      
      // Покажи първите 6 слота като икони
      const slots = hero.equipment.slice(0, 6).filter(e => e);
      slots.forEach((item, i) => {
        if (item) {
          ctx.font = '32px system-ui, sans-serif';
          ctx.fillText(item.icon || '🔮', 300 + i * 80, 1470);
        }
      });
    }

    // === CTA + ХАШТАГОВЕ ===
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
};

/**
 * Wrapper функция - това ще извикаш от ui.js
 */
window.shareHeroCard = async function(hero) {
  // Тук можеш да добавиш меню за избор в бъдеще
  // Засега директно генерираме TikTok видео
  await window.ShareUtils.generateHeroTikTokVideo(hero);
};
