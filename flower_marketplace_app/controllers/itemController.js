const model = require('../models/model');

exports.index = (req, res) => {
    let items = model.find();
    const searchTerm = req.query.q; 

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        items = items.filter(item => 
            item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
            item.details.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    // Sort by price
    items.sort((a, b) => a.price - b.price);

    res.render('item/items', { items, cssFile: 'items.css' });
};

exports.new = (req, res) => {
    res.render('item/new', { cssFile: 'new.css' });
}

exports.create = (req, res) => {
    let newItem = {
        id: model.nextId(), 
        title: req.body.title,
        seller: req.body.seller,
        condition: req.body.condition,
        price: req.body.price,
        details: req.body.details,
        image: req.body.image || "../images/default.jpg", 
        active: true
    };

    model.save(newItem); 
    res.redirect('/items');
};

exports.show =(req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);
    if(item){
        res.render('item/item', { item, cssFile: 'item.css' });
    } else {
        let err = new Error('Cannot find an item with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);
    if(item){
        res.render('item/edit', { item, cssFile: 'styles.css' });
    } else {
        let err = new Error('Cannot find an item with id ' + id);
        err.status = 404;
        next(err);
    }
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);

    if (!item) {
        let err = new Error('Cannot find an item with id ' + id);
        err.status = 404;
        return next(err);
    }

    let updatedItem = {
        id: item.id, 
        title: req.body.title,
        seller: req.body.seller,
        condition: req.body.condition,
        price: req.body.price,
        details: req.body.details,
        image: req.body.image || item.image,
        active: item.active 
    };

    model.updateById(id, updatedItem);
    res.redirect('/items/' + id);
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);

    if (!item) {
        let err = new Error('Cannot find an item with id ' + id);
        err.status = 404;
        return next(err);
    }

    item.active = false; 
    model.updateById(id, item);

    res.redirect('/items');
};