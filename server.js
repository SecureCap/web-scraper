//Dependencies
var express = require('express'),
    mongoose = require('mongoose'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    path = require('path'),
    favicon = require('serve-favicon');


//initalizing the app
var app = express();

//setting up the database
var config = require('./config/database');
mongoose.Promise = Promise;
mongoose
    .connect(config.database)
    .then( result => {
    console.log(`Connected to database '${result.connection[0].name}' on ${result.connection[0].host}:${result.connections[0].port}`);
})
.catch(err => console.log('There was an error with your connection:', err));

//setting up favicon middleware
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));

//setting up morgan middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//setting up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/articles',express.static(path.join(__dirname, 'public')));
app.use('/notes',express.static(path.join(__dirname, 'public')));

//setting up routes
var index = require('./routes/index'),
    articles = require('./routes/articles'),
    notes = require('./routes/notes'),
    scrape = require('./routes/scrape');

app.use('/', index);
app.use('/articles', articles);
app.use('/notes', notes);
app.use('/scrape', scrape);


//starting server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Listening on http://localhost:${PORT}`);
});