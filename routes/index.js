var connection = require('../connection');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

connection.connect(); //connect to database

/*
 * GET Home Page.	
 */

exports.home = function (req, res) {

	// console.log('------------------------------');
	// console.log(req.cookies);
	// console.log('------------------------------');
	// console.log('Signed Cookies: ', req.signedCookies)
	// console.log('------------------------------');

	connection.query( 'SELECT * FROM Activities' , function (err1, row1, field1) {
		if (err1) console.log(err1);

		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('index',{page_title:"Att göra i Seoul", page_loginOrOut:"Logga in", data:row1, cData:row2});
		});
	});
};


/*
 * GET Login Page.	
 */

exports.login = function (req, res) {
	res.render('login',{page_title:"Logga in", page_loginOrOut:"Logga in"});
};



/*
 * POST Filter or Sort or Search
 */

exports.filterSearch = function (req, res) {

	if(req.body.filter !== undefined) {
		//Gör filtergrejer 
		filter(req.body.filter, res);
	}
	else {
		//Gör sökgrejer
		search(req.body.search, res);
	}
};


/*
 * User authentication
 */

exports.passportAuthentication = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
  	done(null, user.UserID);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM Users where UserID = " + id, function(err,rows){	
  		done(err, rows[0]);
  	});
  });

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form
  	
    connection.query("SELECT * FROM Users WHERE Email = '" + email + "'",function(err,rows){
			if (err) {
				return done(err);
			}

			if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      } 
			
			// if the user is found but the password is wrong
      if (!( rows[0].UserPassword == password)){
      	console.log('fel lösenord'); 
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
			
      // all is well, return successful user
      return done(null, rows[0]);			
		
		});
  }));
};


/*
 * Functions
 */

// Filter
function filter(filterType, res) {

	if (filterType === 'all') {

		connection.query( "SELECT * FROM Activities", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
			connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
				if (err2) console.log(err2);

				res.render('index',{page_title:"Att göra i Seoul", page_loginOrOut:"Logga in", data:row1, cData:row2});
			});
		});
	}

	else {
		connection.query( "SELECT * FROM Activities WHERE CategoryID='" + filterType + "';", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
			connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
				if (err2) console.log(err2);

				res.render('index',{page_title:"Att göra i Seoul", page_loginOrOut:"Logga in", data:row1, cData:row2});
			});
		});
	}
};

// Search
function search(searchType, res) {
	
	connection.query( "SELECT * FROM Activities WHERE Title LIKE '%" + searchType + "%';", function (err1, row1, field1) {
	
		if (err1) console.log(err1);
	
		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
	
			if (err2) console.log(err2);

			res.render('index',{page_title:"Att göra i Seoul", page_loginOrOut:"Logga in", data:row1, cData:row2});
		});
	});
};
