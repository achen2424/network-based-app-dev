const model = require('../models/model');
const Offer = require('../models/offer');

exports.index = (req, res, next) => {
    let searchTerm = req.query.q;
    let filter = { active: true };

    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        filter.$or = [{ title: regex }, { details: regex }];
    }

    model.find(filter).populate('seller', 'firstName lastName').sort({ price: 1 })
        .then(items => res.render('item/items', { items, cssFile: 'items.css', user: req.session.user}))
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('item/new', { cssFile: 'new.css' });
};

exports.create = (req, res, next) => {
    let newItem = new model({
        title: req.body.title,
        seller: req.session.user,
        condition: formatCondition(req.body.condition),
        price: req.body.price,
        details: req.body.details,
        image: req.body.image || "/images/default.jpg",
        active: true
    });

    newItem.save()
    .then(() => {
        req.flash('success', 'Item successfully listed!');
        res.redirect('/items');
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    model.findById(req.params.id)
        .populate('seller')
        .then(item => {
            if (!item) {
                let err = new Error('Item not found');
                err.status = 404;
                throw err;
            }
            const isSeller = req.session.user && item.seller._id.toString() === req.session.user.toString();
            res.render('item/item', {
                item,
                user: req.session.user || null,
                isSeller: isSeller,
                cssFile: 'item.css'
            });
        })
        .catch(next);
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
        condition: req.body.condition,
        price: req.body.price,
        details: req.body.details,
        image: req.body.image
    };

    model.findByIdAndUpdate(req.params.id, updatedItem, { runValidators: true })
    .then(item => {
        if (item) {
            req.flash('success', 'Item updated successfully.');
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
            req.flash('success', 'Item deleted successfully.');
            res.redirect('/items');
        } else {
            let err = new Error('Cannot find an item with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};