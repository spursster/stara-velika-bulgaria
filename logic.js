window.initNewGame = function() {
    const dynasties = Object.keys(window.bulgarianDynasties);
    const randomDynastyName = dynasties[Math.floor(Math.random() * dynasties.length)];
    const dynastyData = window.bulgarianDynasties[randomDynastyName];
    
    // Избиране на случаен владетел от избраната династия
    const allRulers = [...dynastyData.rulers, ...(dynastyData.branchRulers || [])];
    const randomRuler = allRulers[Math.floor(Math.random() * allRulers.length)];

    window.currentHero = new Character(
        randomRuler.name, 
        randomDynastyName, 
        "Владетел"
    );
    
    // Прилагане на началната провинция (напр. Тракия за начало)
    window.playerRegions = ["Северна Тракия"]; 
    
    console.log(`Играта започна с династия: ${randomDynastyName}, Владетел: Кан ${randomRuler.name}`);
    window.updateCharacterUI(window.currentHero);
};
