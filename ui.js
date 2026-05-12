class Character {
    constructor(name, dynasty) {
        this.name = name;
        this.dynasty = dynasty;
        this.inventory = {
            head: null,    // Шлем
            neck: null,    // Амулет
            body: null,    // Доспехи
            mainHand: null,// Оръжие
            offHand: null, // Щит
            ring1: null,
            ring2: null,
            feet: null,    // Ботуши
            relic: null    // Артефакт
        };
        this.level = 1;
        this.children = [];
    }
}
