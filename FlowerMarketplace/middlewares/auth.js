const Item = require('../models/model');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'Your are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'Your need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is author of the story
exports.isAuthor = (req, res, next) => {
    const id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        const err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    Item.findById(id)
    .then(item => {
        if (!item) {
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        
        if (item.seller.toString() === req.session.user.toString()) {
            return next();
        } else {
            const err = new Error('Unauthorized access to the resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err => next(err));
};