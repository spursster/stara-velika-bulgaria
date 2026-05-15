/**
 * МОДУЛ: ЕКСПЕДИЦИИ И КУЕСТОВЕ - Велика България
 * СТАТУС: ИНИЦИАЛИЗАЦИЯ
 */

window.activeExpedition = null;

window.expeditionTypes = [
    {
        title: "Проучване на Кавказ",
        description: "Старейшините изпращат експедиция за търсене на древни метали.",
        duration: 5, // хода
        progress: 0,
        reward: { gold: 500, item: "Кавказка стомана" }
    },
    {
        title: "Мисия до Панония",
        description: "Търсене на нови пасища и сключване на съюзи с местните родове.",
        duration: 3,
        progress: 0,
        reward: { power: 30, army: 100 }
    },
    {
        title: "Свещена експедиция",
        description: "Поклонение до древно светилище за благословията на Тангра.",
        duration: 4,
        progress: 0,
        reward: { power: 50, item: "Златен ритон" }
    }
];

// Функция, която се вика от logic.js на всеки ход
window.checkForQuest = function() {
    if (window.activeExpedition) {
        window.updateExpeditionProgress();
        return;
    }

    if (Math.random() < 0.15) { // 15% шанс за нов куест
        const quest = window.expeditionTypes[Math.floor(Math.random() * window.expeditionTypes.length)];
        const hero = window.currentHero;
        
        window.activeExpedition = { ...quest, ruler: hero.name, dynasty: hero.dynasty };
        
        if(window.showAdvisorMsg) {
            window.showAdvisorMsg(`СЪВЕТЪТ ГОВОРИ: Владетелю, възложена Ви е мисия: ${quest.title}!`);
        }
        window.renderExpeditionButton();
    }
};

window.updateExpeditionProgress = function() {
    if (!window.activeExpedition) return;

    window.activeExpedition.progress++;
    
    if (window.activeExpedition.progress >= window.activeExpedition.duration) {
        window.completeExpedition();
    }
};

window.renderExpeditionButton = function() {
    const sidebar = document.getElementById('left-sidebar');
    let btn = document.getElementById('btn-expedition');
    
    if (!btn && window.activeExpedition) {
        btn = document.createElement('button');
        btn.id = 'btn-expedition';
        btn.className = 'icon-btn'; // Използваме твоя стил за бутони
        btn.style.width = "100%";
        btn.style.marginTop = "10px";
        btn.style.fontSize = "12px";
        btn.innerHTML = `🧭 ЕКСПЕДИЦИЯ: ${window.activeExpedition.title}`;
        btn.onclick = () => alert(`Прогрес: ${window.activeExpedition.progress}/${window.activeExpedition.duration} хода\n${window.activeExpedition.description}`);
        sidebar.appendChild(btn);
    }
};

window.completeExpedition = function() {
    const reward = window.activeExpedition.reward;
    const hero = window.currentHero;

    if (reward.gold) hero.gold += reward.gold;
    if (reward.power) hero.heroPower += reward.power;
    if (reward.army) hero.armySize += reward.army;
    
    // Ако има предмет, го добавяме в инвентара (предвиждаме items.js)
    if (reward.item && window.addItemToTreasury) {
        window.addItemToTreasury(reward.item);
    }

    alert(`Експедицията приключи! Награда: ${reward.item || ''} ${reward.gold ? reward.gold + '💰' : ''}`);
    
    window.activeExpedition = null;
    const btn = document.getElementById('btn-expedition');
    if (btn) btn.remove();
    
    if (window.updateCharacterUI) window.updateCharacterUI(hero);
};
