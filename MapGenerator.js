/**
 * mapGenerator.js – ЛЕКА АВТОМАТИЧНА КАРТА ЗА ВЕЛИКА БЪЛГАРИЯ
 * Версия: 1.0
 * 
 * Използва HTML5 Canvas за визуализация на регионите като цветни клетки.
 * Няма външни изображения, работи напълно процедурно.
 * Картата се генерира от worldData.regions и playerRegions.
 */

// Глобална променлива за запазване на текущия canvas контейнер
window.currentMapCanvas = null;

/**
 * Генерира карта в даден контейнер
 * @param {string} containerId - ID на HTML елемента (div), в който да се постави картата
 * @param {string} seed - Произволен низ за стабилност на подредбата (по подразбиране - името на героя)
 */
window.generateMapCanvas = function(containerId, seed = "default") {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнерът #${containerId} не съществува!`);
        return;
    }

    if (!window.worldData || !window.worldData.regions) {
        container.innerHTML = '<div style="color:#ffaa66;">Няма заредени региони.</div>';
        return;
    }

    // Определяне на размерите на картата (можете да ги промените според UI)
    const mapWidth = 800;
    const mapHeight = 600;
    const tileMargin = 2; // разстояние между клетките

    // Вземаме всички региони като масив
    let regions = Object.values(window.worldData.regions);
    if (regions.length === 0) {
        container.innerHTML = '<div style="color:#ffaa66;">Няма региони за показване.</div>';
        return;
    }

    // Сортираме регионите по име за стабилна позиция (независимо от реда в обекта)
    regions.sort((a, b) => a.name.localeCompare(b.name));

    // Изчисляваме оптимален брой колони и редове (квадратна мрежа)
    const cols = Math.ceil(Math.sqrt(regions.length));
    const rows = Math.ceil(regions.length / cols);
    const tileWidth = (mapWidth - (cols - 1) * tileMargin) / cols;
    const tileHeight = (mapHeight - (rows - 1) * tileMargin) / rows;

    // Създаваме canvas елемент
    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    canvas.style.border = '2px solid #d4af37';
    canvas.style.borderRadius = '8px';
    canvas.style.cursor = 'pointer';
    canvas.style.backgroundColor = '#1a1a2e';
    
    // Изчистваме контейнера и добавяме canvas
    container.innerHTML = '';
    container.appendChild(canvas);
    window.currentMapCanvas = canvas;

    const ctx = canvas.getContext('2d');

    // Определяне на притежаваните региони (флатен масив)
    let ownedRegions = [];
    if (window.playerRegions) {
        ownedRegions = window.playerRegions.flat ? window.playerRegions.flat() : window.playerRegions;
    }

    // Запазваме координатите на всеки регион за кликване
    const regionRects = [];

    // Рисуване на картата
    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = col * (tileWidth + tileMargin);
        const y = row * (tileHeight + tileMargin);
        const width = tileWidth;
        const height = tileHeight;

        // Определяме цвета според притежанието
        let bgColor = '#5a5a5a'; // неутрален
        if (ownedRegions.includes(region.name)) {
            bgColor = '#2c5a2a'; // зелен – ваш
        } else if (region.nativeClans && region.nativeClans.length > 0) {
            bgColor = '#8b3a3a'; // червеникав – враг
        } else {
            bgColor = '#4a4a4a'; // тъмно сив – независим
        }

        // Рисуваме заоблен правоъгълник
        ctx.fillStyle = bgColor;
        ctx.shadowBlur = 0;
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#d4af37';
        ctx.strokeRect(x, y, width, height);

        // Име на региона (съкратено, ако е дълго)
        let shortName = region.name.length > 10 ? region.name.substring(0, 8) + '..' : region.name;
        ctx.fillStyle = '#ffdd99';
        ctx.font = `${Math.min(12, Math.floor(height / 4))}px Cinzel, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(shortName, x + width / 2, y + height / 2);

        // Запазваме координатите за клик
        regionRects.push({
            region: region,
            x: x, y: y, w: width, h: height
        });
    }

    // Обработка на клик върху картата
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Намираме кой регион е кликнат
        const hit = regionRects.find(r => 
            mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h
        );
        if (hit && typeof window.inspectRegion === 'function') {
            window.inspectRegion(hit.region.name);
        } else if (hit) {
            console.log(`Кликнат регион: ${hit.region.name}`);
            alert(`Регион: ${hit.region.name}\nТерен: ${hit.region.terrain}\nРесурс: ${hit.region.resource}`);
        }
    });

    // Добавяне на подсказка при движение на мишката (hover)
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const hit = regionRects.find(r => 
            mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h
        );
        canvas.style.cursor = hit ? 'pointer' : 'default';
        if (hit) {
            canvas.title = `${hit.region.name} (Сила: ${hit.region.armySize}, Защита: ${hit.region.defenseLevel})`;
        } else {
            canvas.title = '';
        }
    });
};

/**
 * Обновява картата (прерисува я, като запазва същия контейнер)
 * @param {string} containerId - ID на контейнера (ако е празно, използва последния)
 */
window.refreshMap = function(containerId) {
    if (containerId) {
        window.generateMapCanvas(containerId);
    } else if (window.currentMapCanvas && window.currentMapCanvas.parentElement) {
        const container = window.currentMapCanvas.parentElement;
        if (container && container.id) {
            window.generateMapCanvas(container.id);
        } else {
            console.warn("Няма контейнер за опресняване на картата.");
        }
    } else {
        console.warn("Няма активна карта за опресняване.");
    }
};

/**
 * Отваря картата в модален прозорец (замества старата списъчна карта)
 * Може да се извика от бутона "Карта" в играта.
 */
window.openInteractiveMap = function() {
    // Премахваме стар модал, ако има
    const oldModal = document.getElementById('interactive-map-modal');
    if (oldModal) oldModal.remove();

    // Създаваме модал
    const modal = document.createElement('div');
    modal.id = 'interactive-map-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 200000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        padding: 20px;
        box-sizing: border-box;
    `;

    modal.innerHTML = `
        <div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; padding: 20px; max-width: 90vw; max-height: 90vh; overflow: auto; text-align: center;">
            <h2 style="color:#ffd700; margin-top:0;">🗺️ ИНТЕРАКТИВНА КАРТА</h2>
            <div id="map-container-modal" style="margin: 10px 0;"></div>
            <button id="close-map-modal" style="background:#2c1a0c; border:1px solid #d4af37; border-radius:30px; padding:8px 20px; color:#ffdd99; cursor:pointer; margin-top:15px;">Затвори</button>
        </div>
    `;

    document.body.appendChild(modal);

    const mapContainer = modal.querySelector('#map-container-modal');
    window.generateMapCanvas('map-container-modal');

    const closeBtn = modal.querySelector('#close-map-modal');
    closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

// Ако искате да замените съществуващата функция openRegionsMap, можете да направите:
// window.openRegionsMap = window.openInteractiveMap;
// Но за да не счупим нищо, оставяме новата функция отделно.

console.log("✅ mapGenerator.js зареден – интерактивна карта, напълно автоматична и лека.");
