// social-share.js

window.ShareUtils = window.ShareUtils || {};

/**
 * Заснема ТОЧНО отворения профил (модала) 1:1.
 * Клонира реалния DOM елемент, премахва скролбарите и
 * прави висококачествена снимка на всичко.
 */
window.ShareUtils.captureFullProfile = function(hero) {
    if (!hero) return alert('⚠️ Няма активен герой.');

    // 1. Намираме отворения модал
    const modal = document.getElementById('ultimate-profile-modal');
    if (!modal) {
        alert('⚠️ Моля, първо отвори профила на героя (кликни върху героя), за да може да бъде заснет.');
        return;
    }

    const btn = document.querySelector('#share-hero-btn, .tiktok-share-btn');
    if (btn) { btn.disabled = true; btn.textContent = '📷 Заснемане на целия профил...'; }

    // 2. Клонираме модала, за да не пречим на играта
    const clone = modal.cloneNode(true);
    
    // 3. Настройки за заснемане (премахваме blur и скрол)
    // Премахваме backdrop-filter, защото често създава черен квадрат при снимка
    clone.style.backdropFilter = 'none'; 
    clone.style.backgroundColor = 'rgba(0,0,0,0.9)'; // Плътен фон вместо прозрачен
    
    // Премахваме ограниченията за височина, за да се види ВСИЧКО съдържание
    const contentDiv = clone.querySelector('div[style*="max-height"]') || clone.firstElementChild;
    if (contentDiv) {
        contentDiv.style.maxHeight = 'none';
        contentDiv.style.overflow = 'visible';
    }

    // Позиционираме го извън екрана
    clone.style.position = 'absolute';
    clone.style.top = '-10000px';
    clone.style.left = '0';
    clone.style.zIndex = '-1';
    
    document.body.appendChild(clone);

    // 4. Изчакваме малко и заснемаме
    setTimeout(() => {
        html2canvas(clone, {
            scale: 2,             // Двойна резолюция за яснота
            useCORS: true,        // За да зареди портрета, ако е външен линк
            backgroundColor: null,
            logging: false,
            windowWidth: 800,     // Фиксираме ширината, за да не се развали layout-а
            windowHeight: clone.scrollHeight // Височината да обхване всичко
        }).then(canvas => {
            // 5. Сваляне
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${(hero.name || 'hero').replace(/[^\wа-яА-Я]/gi, '_')}_full_profile.png`;
                a.click();
                URL.revokeObjectURL(url);
                
                alert('✅ Целият профил е заснет!\n📲 Качи го в TikTok.');
                if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
            }, 'image/png');

            // 6. Почистваме клона
            document.body.removeChild(clone);
        }).catch(err => {
            console.error('Грешка при заснемане:', err);
            alert('❌ Грешка. Увери се, че използваш Chrome.');
            document.body.removeChild(clone);
            if (btn) { btn.disabled = false; btn.textContent = '📤 Сподели визитка'; }
        });
    }, 500); // Малко забавяне, за да се рендират шрифтовете
};

// Обвързваща функция
window.shareHeroCard = function(hero) {
    window.ShareUtils.captureFullProfile(hero);
};
