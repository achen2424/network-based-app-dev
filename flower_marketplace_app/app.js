//require modules
const express = require('express');
const path = require('path')
const itemRoutes = require('./routes/itemRoutes');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

//create express app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/project3';
app.set('view engine', 'ejs');
let mongoUrl = 'mongodb+srv://achen24:935112802Alch@cluster0.jy8c4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

//connect to MongoDB
mongoose.connect(mongoUrl)
.then(() => {
    //start the server
    app.listen(port, host, () => {
        console.log('Server is running on port', port);
    });
})
.catch(err => console.log(err.message));

//mount middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

//set up routes
app.get('/', (req, res) => {
    res.render('index', { cssFile: 'styles.css' });
});

app.use('/items', itemRoutes);

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