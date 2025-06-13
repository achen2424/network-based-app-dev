const model = require('../models/user');
const Item = require('../models/model');
const Offer = require('../models/offer');

exports.new = (req, res)=>{
    return res.render('user/new', { cssFile: 'new.css' });
};

exports.create = (req, res, next)=>{
        let user = new model(req.body);
        user.save()
        .then(user => {
            req.flash('success', 'Registration successful! Please log in.'); // Add this
            res.redirect('/users/login');
        })
        .catch(err=>{
            if(err.name === 'ValidationError' ) {
                req.flash('error', err.message);  
                return res.redirect('/users/new');
            }

            if(err.code === 11000) {
                req.flash('error', 'Email has been used');  
                return res.redirect('/users/new');
            }
            
            next(err);
        });
};

exports.getUserLogin = (req, res, next) => {
        return res.render('user/login', { cssFile: 'styles.css' });
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
    
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    let user, items, offers;
    model.findById(id)
        .then(result => {
            user = result;
            return Item.find({seller: id});
        })
        .then(result => {
            items = result;
            return Offer.find({buyer: id}).populate('item');
        })
        .then(result => {
            offers = result;
            res.render('user/profile', { 
                user, 
                items, 
                offers,
                cssFile: 'styles.css' 
            });
        })

        .catch(err => next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };