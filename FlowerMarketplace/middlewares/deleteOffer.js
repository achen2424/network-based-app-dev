const Offer = require('../models/offer');

module.exports = function(doc) {
    if (doc) {
        Offer.deleteMany({item: doc._id})
            .then(() => {
                console.log(`Deleted all offers associated with item ${doc._id}`);
            })
            .catch(err => {
                console.error(`Error deleting offers for item ${doc._id}:`, err);
            });
    }
};