const model = require('../models/model');

exports.index = (req, res, next) => {
    let searchTerm = req.query.q;
    let filter = { active: true };

    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        filter.$or = [{ title: regex }, { details: regex }];
    }

    model.find(filter).sort({ price: 1 })
        .then(items => res.render('item/items', { items, cssFile: 'items.css' }))
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('item/new', { cssFile: 'new.css' });
};

exports.create = (req, res, next) => {
    let newItem = new model({
        title: req.body.title,
        seller: req.body.seller,
        condition: formatCondition(req.body.condition),
        price: req.body.price,
        details: req.body.details,
        image: req.body.image || "/images/default.jpg",
        active: true
    });

    newItem.save()
    .then(() => res.redirect('/items'))
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    model.findById(req.params.id)
    .then(item => {
        if (item) {
            res.render('item/item', { item, cssFile: 'item.css' });
        } else {
            let err = new Error('Cannot find an item with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    model.findById(req.params.id)
    .then(item => {
        if (item) {
            res.render('item/edit', { item, cssFile: 'styles.css' });
        } else {
            let err = new Error('Cannot find an item with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let updatedItem = {
        title: req.body.title,
        seller: req.body.seller,
        condition: req.body.condition,
        price: req.body.price,
        details: req.body.details,
        image: req.body.image
    };

    model.findByIdAndUpdate(req.params.id, updatedItem, { runValidators: true })
    .then(item => {
        if (item) {
            res.redirect('/items/' + req.params.id);
        } else {
            let err = new Error('Cannot find an item with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

function formatCondition(condition) {
    const validConditions = ['Fresh', 'Blooming', 'Budding', 'Wilting Soon', 'Preserved/Dried'];
    return validConditions.find(c => c.toLowerCase() === condition.toLowerCase()) || 'Fresh';
}

exports.delete = (req, res, next) => {
    model.findByIdAndDelete(req.params.id)
    .then(item => {
        if (item) {
            res.redirect('/items');
        } else {
            let err = new Error('Cannot find an item with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};