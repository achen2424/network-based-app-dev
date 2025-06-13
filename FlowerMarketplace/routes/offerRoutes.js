const express = require('express');
const controller = require('../controllers/offerController');
const { isLoggedIn } = require('../middlewares/auth');
const router = express.Router({mergeParams: true});

//POST /items/:id/offers
router.post('/', isLoggedIn, controller.create);

//GET /items/:id/offers
router.get('/', isLoggedIn, controller.listByItem);

//POST /items/:id/offers/:offerId/accept
router.post('/:offerId/accept', isLoggedIn, controller.accept);

//POST /items/:id/offers/:offerId/reject
router.post('/:offerId/reject', isLoggedIn, controller.reject);

module.exports = router;