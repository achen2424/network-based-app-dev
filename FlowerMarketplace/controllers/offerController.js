const Offer = require('../models/offer');
const Item = require('../models/model');
const User = require('../models/user');

exports.create = (req, res, next) => {
    const itemId = req.params.id;
    const buyerId = req.session.user;
    const amount = parseFloat(req.body.amount);
    console.log('Creating offer for item:', itemId);

    if (isNaN(amount)) {
        console.error('Invalid amount:', req.body.amount);
        const err = new Error('Invalid offer amount');
        err.status = 400;
        return next(err);
    }
    Item.findById(itemId)
        .then(item => {
            if (!item) {
                console.error('Item not found in database. Searched for:', itemId);
                const err = new Error('Item not found or may have been removed');
                err.status = 404;
                throw err;
            }
            console.log('Found item:', item._id, 'Seller:', item.seller);
            
            if (item.seller.toString() === buyerId.toString()) {
                console.error('User tried to offer on their own item');
                const err = new Error('You cannot make an offer on your own item!');
                err.status = 403;
                throw err;
            }

            if (!item.active) {
                console.error('Item is not active');
                const err = new Error('This item is no longer available for offers');
                err.status = 400;
                throw err;
            }

            const newOffer = new Offer({
                amount: amount,
                item: itemId,
                buyer: buyerId
            });
            return newOffer.save();
        })
        .then(offer => {
            console.log('Offer created, updating item stats');
            return Item.findByIdAndUpdate(itemId, {
                $inc: { totalOffers: 1 },
                $max: { highestOffer: amount }
            }, { new: true }).then(updatedItem => {
                console.log('Item updated:', updatedItem);
                return offer;
            });
        })
        .then(() => {
            req.flash('success', 'Offer submitted successfully!');
            res.redirect('/items/' + itemId);
        })
        .catch(err => {
            console.error('Error in offer creation:', err);
            if (err.name === 'CastError') {
                err.message = 'Invalid item ID format';
                err.status = 400;
            }
            req.flash('error', err.message);
            res.redirect('/items/' + itemId);
        });
};

exports.listByItem = (req, res, next) => {
    const itemId = req.params.id;
    let itemData;

    Item.findById(itemId)
        .then(item => {
            if (!item) {
                const err = new Error('Item not found');
                err.status = 404;
                throw err;
            }
            if (item.seller.toString() !== req.session.user.toString()) {
                const err = new Error('Unauthorized to view these offers');
                err.status = 401;
                throw err;
            }
            itemData = item;
            return Offer.find({ item: itemId }).populate('buyer', 'firstName lastName');
        })
        .then(offers => {
            res.render('offers/offers', {
                item: itemData,
                offers,
                cssFile: 'offers.css'
            });
        })
        .catch(err => next(err));
};

exports.accept = (req, res, next) => {
    const offerId = req.params.offerId;
    const itemId = req.params.id;
    let itemData;

    Item.findById(itemId)
        .then(item => {
            if (!item) {
                const err = new Error('Item not found');
                err.status = 404;
                throw err;
            }
            if (item.seller.toString() !== req.session.user.toString()) {
                const err = new Error('Unauthorized to accept this offer');
                err.status = 401;
                throw err;
            }
            itemData = item;
            return Offer.findByIdAndUpdate(offerId, {status: 'accepted'});
        })
        .then(() => {
            return Offer.updateMany(
                {item: itemId, _id: {$ne: offerId} },
                {status: 'rejected'}
            );
        })
        .then(() => {
            return Item.findByIdAndUpdate(itemId, {active: false});
        })
        .then(() => {
            req.flash('success', 'Offer accepted successfully!');
            res.redirect('/items/' + itemId + '/offers');
        })
        .catch(err => next(err));
};

exports.reject = (req, res, next) => {
    const offerId = req.params.offerId;
    const itemId = req.params.id;

    Offer.findById(offerId)
        .then(offer => {
            if (!offer) {
                const err = new Error('Offer not found');
                err.status = 404;
                throw err;
            }
            return Item.findById(itemId)
                .then(item => {
                    if (!item) {
                        const err = new Error('Item not found');
                        err.status = 404;
                        throw err;
                    }
                    if (item.seller.toString() !== req.session.user.toString()) {
                        const err = new Error('Unauthorized to reject this offer');
                        err.status = 401;
                        throw err;
                    }
                    return Offer.findByIdAndUpdate(offerId, { status: 'rejected' });
                });
        })
        .then(() => {
            req.flash('success', 'Offer rejected successfully');
            res.redirect('/items/' + itemId + '/offers');
        })
        .catch(err => next(err));
};