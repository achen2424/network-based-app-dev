/*const items = [
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
] */
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    
    const itemSchema = new Schema({
        title: {type: String, required: [true, 'title is required']},
        seller: {type: String, required: [true, 'author is required']},
        condition: {type: String, required: [true, 'condition is required'], 
            enum: ['Fresh', 'Blooming', 'Budding', 'Wilting Soon', 'Preserved/Dried']},
        price: {type: Number, required: [true, 'price is required'], min: 0.01},
        details: {type: String, required: [true, 'content is required'], 
            minLength: [10, 'content should have at least 10 characters']},
        image: {type: String, required: [true, 'image is required'], default: "/images/default.jpg" },
        active: {type: Boolean, default: true, required: [true, 'active is required']}
    },
    {timestamps: true}
    );
    
    module.exports = mongoose.model('Item', itemSchema);