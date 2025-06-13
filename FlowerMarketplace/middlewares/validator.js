const mongoose = require('mongoose');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    next();
};