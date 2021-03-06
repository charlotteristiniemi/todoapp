var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var passport = require('passport');
var flash = require('connect-flash');
var multer = require('multer');

var routes = require('./routes');

var server = express();

var uploading = multer({
  dest: __dirname + '/public/uploads/'
})


// View setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');



// Middleware
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
server.use(bodyParser.json());
server.use(session({ secret: 'itssosecret', resave: false, saveUninitialized: false }));
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());
server.use(expressValidator());



// Log all /GET, /POST, /PUT request
server.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});



// Run user authenication
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
server.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
server.get('/add_new_activity', routes.add);
server.post('/add_new_activity', uploading.single('image'), routes.save);
server.get('/delete_activity/:id', routes.delete);
server.get('/edit_activity/:id', routes.edit);
server.post('/edit_activity/:id', routes.update);



// Start Server
var server = server.listen(3000,function(){
  console.log("Listening to port %s",server.address().port);
});