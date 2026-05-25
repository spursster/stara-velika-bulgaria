// ==================== СЪВЕТНИК ПОПАП (ЗАМЕНЯ STANDARD ALERT) ====================
window.showAdvisorPopup = function(title, message, type = "info") {
    // Премахваме стар попап, ако има
    const oldPopup = document.getElementById('advisor-popup');
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'advisor-popup';
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 300000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        animation: fadeIn 0.2s ease;
    `;

    // Икона според типа
    let icon = "📜";
    if (type === "success") icon = "✅";
    else if (type === "error") icon = "❌";
    else if (type === "warning") icon = "⚠️";

    popup.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #0a0a1a, #0a0a1a);
            border: 2px solid #d4af37;
            border-radius: 28px;
            max-width: 400px;
            width: 90%;
            padding: 24px 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.3);
            position: relative;
        ">
            <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #0a0a1a; padding: 0 12px;">
                <span style="font-size: 2rem;">📢</span>
            </div>
            <div style="margin-top: 10px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #ffd700; letter-spacing: 1px;">${icon} ${title}</div>
                <div style="height: 2px; width: 80px; background: #d4af37; margin: 12px auto;"></div>
                <div style="font-size: 1rem; color: #f0e6d0; line-height: 1.5; margin: 15px 0;">
                    ${message}
                </div>
                <button id="close-advisor-popup" style="
                    background: linear-gradient(135deg, #2c1a0c, #1f1207);
                    border: 1px solid #d4af37;
                    border-radius: 40px;
                    padding: 8px 24px;
                    color: #ffd700;
                    font-family: 'Cinzel', serif;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 10px;
                ">РАЗБРАХ, ВОЕВОДО</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('#close-advisor-popup');
    const closeHandler = () => popup.remove();
    closeBtn.addEventListener('click', closeHandler);
    popup.addEventListener('click', (e) => { if (e.target === popup) closeHandler(); });
};
