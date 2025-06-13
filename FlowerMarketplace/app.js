//require modules
const express = require('express');
const path = require('path')
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create express app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/project5';
app.set('view engine', 'ejs');
let mongoUrl = 'mongodb+srv://achen24:935112802Alch@cluster0.jy8c4.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0';

//connect to MongoDB
mongoose.connect(mongoUrl)
.then(() => {
    //start the server
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch(err => console.log(err.message));

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Atlas cluster:', mongoose.connection.host);
    console.log('Using database:', mongoose.connection.name);
});

//mount middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoUrl,
            collectionName: 'sessions'
        }),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

//set up routes
app.get('/', (req, res) => {
    res.render('index', { cssFile: 'styles.css' });
});

app.use('/items', itemRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status);
    res.render('error', { error: err, cssFile: 'styles.css' });
});