//require modules
const express = require('express');
const itemRoutes = require('./routes/itemRoutes');
const methodOverride = require('method-override');

//create express app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
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
    if(!err.status) {
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status);
    res.render('error', {error: err, cssFile: 'styles.css'});
});

//start the server
app.listen(port, host, () => {
    console.log('Server is running on port', port);
});