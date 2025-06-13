const express = require('express');
const controller = require('../controllers/itemController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const offerRouter = require('./offerRoutes');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/:id/test', (req, res) => {
    console.log('Received itemId:', req.params.id);
    res.send({ 
        message: 'Test route working!',
        itemId: req.params.id,
        isValid: mongoose.Types.ObjectId.isValid(req.params.id)
    });
});

//GET /items: send all items to the user
router.get('/', controller.index);

//GET /items/new: send html form for creating a new item
router.get('/new', controller.new);

//POST /items: create a new item
router.post('/', isLoggedIn, controller.create);

//GET /items/:id: send details of item identified by id
router.get('/:id', controller.show);

//GET /items/:id/edit: send html form for editing an existing item
router.get('/:id/edit', isLoggedIn, isAuthor, controller.edit);

//PUT /items/:id: update the item identified by id
router.put('/:id', isLoggedIn, isAuthor, controller.update);

//DELETE /items/:id: delete the item identified by id
router.delete('/:id', isLoggedIn, isAuthor, controller.delete);

//GET /items/:id/offers: list all offers for item
router.use('/:id/offers', offerRouter);

module.exports = router;