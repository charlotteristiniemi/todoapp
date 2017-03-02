var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var passport = require('passport');
var flash = require('connect-flash');

var routes = require('./routes');

var server = express();


// View setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// Join Public folder with current directory 
server.use(express.static(path.join(__dirname, 'public')));
// Enable cookies
server.use(cookieParser());
// Enable req.body parsing
server.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
server.use(bodyParser.json());
server.use(session({ secret: 'itssosecret', resave: false, saveUninitialized: true }));
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());
// Enable validetaion of forms
server.use(expressValidator());

server.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

routes.passportAuthentication(passport);

// GET, POST and PUT request to browser
server.get('/', routes.home);
server.post('/', routes.filterSearch);
server.get('/login', routes.login);
server.post('/login', passport.authenticate('local-login', { 
	successRedirect: '/', 
	failureRedirect: '/login',
	failureFlash: true 
}));

// Start Server
var server = server.listen(3000,function(){
  console.log("Listening to port %s",server.address().port);
});

