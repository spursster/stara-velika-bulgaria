window.updateCharacterUI = function(hero) {
    const lang = window.gameLang || 'bg';
    const panel = document.getElementById('character-panel');
    if (!panel) return;

    // Дефиниране на преводи за секциите
    const sectionTitles = {
        bg: { possessions: "🗺️ ВЛАДЕНИЯ", management: "📜 УПРАВЛЕНИЕ", barracks: "⚔️ КАЗАРМА", nextYear: "Година +1", battle: "Битка", marriage: "Брак", ritual: "Ритуал" },
        en: { possessions: "🗺️ POSSESSIONS", management: "📜 MANAGEMENT", barracks: "⚔️ BARRACKS", nextYear: "Year +1", battle: "Battle", marriage: "Marriage", ritual: "Ritual" }
    };
    const t = sectionTitles[lang] || sectionTitles.bg;

    panel.innerHTML = `
        <!-- Име и Титла -->
        <h2 style="color: #d4af37; margin: 10px 0;">Кан ${hero.name}</h2>
        <div style="font-size: 24px; margin-bottom: 5px;">✨</div>
        <p style="margin: 0; font-size: 14px;">${hero.armySize} воини</p>

        <!-- Бутон за цял екран (като в op2_2.png) -->
        <div style="background: #222; color: #444; padding: 5px; margin: 15px 0; font-size: 12px; border-radius: 3px;">
            ⛶ ЦЯЛ ЕКРАН
        </div>

        <!-- Секция Владения -->
        <h3 style="font-size: 14px; color: #d4af37; margin-top: 20px;">${t.possessions}</h3>
        <div class="provinces-container">
            ${window.playerRegions.map(reg => `
                <div class="province-slot" style="border: 1px solid #d4af37; background: #1a1a1a;">
                    <div class="province-name" style="font-size: 10px; padding: 5px;">${reg}</div>
                    <img src="path_to_image.jpg" style="width: 100%; height: 40px; background: #333; display: block;">
                </div>
            `).join('')}
        </div>

        <!-- Секция Управление -->
        <h3 style="font-size: 14px; color: #d4af37; margin-top: 20px;">${t.management}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <button class="action-btn" style="background: #333; color: white;" onclick="window.advanceYear(window.currentHero)">${t.nextYear}</button>
            <button class="action-btn" style="background: #7b1a1a; color: white;" onclick="window.simulateBattle(window.currentHero)">${t.battle}</button>
            <button class="action-btn" style="background: #1a7b3a; color: white;" onclick="window.proposeMarriage(window.currentHero, 'Ромеи')">${t.marriage}</button>
            <button class="action-btn" style="background: #8e44ad; color: white;">${t.ritual}</button>
        </div>

        <!-- Секция Казарма -->
        <h3 style="font-size: 14px; color: #d4af37;">${t.barracks}</h3>
        <div style="background: #1a1a1a; border: 1px solid #444; padding: 10px; border-radius: 5px; text-align: left;">
            <div style="font-size: 14px; cursor: pointer;" onclick="window.buyUnits('infantry')">
                🏹 Пехота (100 🪙)
            </div>
        </div>
    `;
};
