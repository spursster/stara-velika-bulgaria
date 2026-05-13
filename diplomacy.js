/**
 * МОДУЛ: ДИПЛОМАЦИЯ И ДИНАСТИЧНИ БРАКОВЕ
 * Управлява връзките между 13-те рода и запълва семейния профил.
 */

window.openMarriageMenu = function() {
    if (window.currentSpouse) {
        let msg = window.gameLang === "BG" ? "Вече имате съпруга!" : "You already have a spouse!";
        alert(msg);
        return;
    }

    // Списък с потенциални съпруги от други български родове
    const candidateNames = ["Мария", "Елена", "Десислава", "Тамара", "Анна", "Теодора"];
    const dynasties = Object.keys(window.bulgarianDynasties).filter(d => d !== window.currentHero.dynasty);
    
    // Генериране на 3 случайни предложения
    let options = "";
    let proposals = [];

    for (let i = 0; i < 3; i++) {
        let name = candidateNames[Math.floor(Math.random() * candidateNames.length)];
        let dynasty = dynasties[Math.floor(Math.random() * dynasties.length)];
        proposals.push({ name, dynasty });
        options += `${i + 1}. ${name} от род ${dynasty}\n`;
    }

    let choice = prompt(
        (window.gameLang === "BG" ? "Изберете съпруга за заздравяване на Империята:\n" : "Choose a spouse to strengthen the Empire:\n") + options
    );

    if (choice >= 1 && choice <= 3) {
        window.proposeMarriage(proposals[choice - 1]);
    }
};

window.proposeMarriage = function(spouseData) {
    // Шанс за успех базиран на бонуса на род Вокил (+20% успех)
    let successChance = 0.7;
    if (window.currentHero.dynasty === "Вокил") {
        successChance = window.applyPerk(successChance, "diplo", "Вокил");
    }

    if (Math.random() <= successChance) {
        window.currentSpouse = {
            name: spouseData.name,
            dynasty: spouseData.dynasty,
            icon: "assets/queen_icon.png"
        };

        // Бонус към престиж/злато при сключване на брак
        window.currentHero.gold += 200;
        
        let successMsg = window.gameLang === "BG" 
            ? `Сключен е династичен брак! ${window.currentSpouse.name} от род ${window.currentSpouse.dynasty} сега е ваша съпруга.` 
            : `A dynastic marriage is sealed! ${window.currentSpouse.name} of house ${window.currentSpouse.dynasty} is now your spouse.`;
        
        alert(successMsg);
    } else {
        let failMsg = window.gameLang === "BG"
            ? "Предложението за брак беше отхвърлено. Родът търси по-изгоден съюз."
            : "The marriage proposal was rejected. The house seeks a better alliance.";
        alert(failMsg);
    }

    // Незабавно обновяване на интерфейса, за да се появи иконата отляво
    window.updateCharacterUI(window.currentHero);
};

window.sendEnvoy = function() {
    // Бъдеща функционалност за дипломация с Румелия (Ромеите)
    let msg = window.gameLang === "BG" ? "Пратеникът замина за Константинопол..." : "The envoy has left for Constantinople...";
    alert(msg);
};

console.log("Модул Diplomacy.js е зареден. Системата за бракове е активна.");
