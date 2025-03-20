const items = [
    {
        id: 1,
        title: "Rose",
        seller: "Alice Chen",
        condition: "Fresh",
        price: 10.99,
        details: "A delicate bouquet of pink roses, symbolizing admiration and grace.",
        image: "../images/rose.jpg",
        active: true
    },
    {
        id: 2,
        title: "Hydrangea",
        seller: "Lipsa Sahoo",
        condition: "Blooming",
        price: 11.99,
        details: "A lush bunch of dreamy hydrangeas, representing serenity and gratitude.",
        image: "../images/hydrangea.jpg",
        active: true
    },
    {
        id: 3,
        title: "Orchid",
        seller: "Lijuan Cao",
        condition: "Budding",
        price: 9.99,
        details: "An elegant arrangement of exotic orchids, bringing sophistication and warmth.",
        image: "../images/orchid.jpg",
        active: true
    },
    {
        id: 4,
        title: "Sunflower",
        seller: "Hailey Chen",
        condition: "Fresh",
        price: 8.99,
        details: "A vibrant bundle of sunflowers, spreading happiness and positivity.",
        image: "../images/sunflower.jpg",
        active: true    
    },
    {
        id: 5,
        title: "Lily",
        seller: "Dhruv Dhamani",
        condition: "Wilting Soon",
        price: 12.99,
        details: "A bright bouquet of orange lilies, symbolizing confidence and passion.",
        image: "../images/lily.jpg",
        active: true
    },
    {
        id: 6,
        title: "Iris",
        seller: "Yonghong Yan",
        condition: "Preserved/Dried",
        price: 13.99,
        details: "A graceful selection of purple irises, representing wisdom and tranquility.",
        image: "../images/iris.jpg",
        active: true
    }
]

exports.find = () => items.filter(item => item.active);
exports.findById = (id) => items.find(item => item.id == id);
exports.findAll = () => items;

exports.nextId = () => {
    return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

exports.save = (item) => {
    item.active = true;
    items.push(item);
};

exports.updateById = (id, newItem) => {
    let index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        newItem.image = newItem.image || items[index].image;
        items[index] = { ...items[index], ...newItem };
        return true;
    }
    return false;
};

exports.deleteById = (id) => {
    let index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    }
    return false;
};

exports.addItem = (item) => {
    items.push(item);
};