var connection = require('../connection');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

connection.connect(); //connect to database

/*
 * GET Home Page.	
 */

exports.home = function (req, res) {

	if (req.user === undefined){
		var user = false;
	} else {
		var user = req.user.Username;
	}

	connection.query( 'SELECT * FROM Activities' , function (err1, row1, field1) {
		if (err1) console.log(err1);

		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('index',{page_title:"To do in Seoul", user:user, data:row1, cData:row2});
		});
	});
};


/*
 * GET Login Page.	
 */

exports.login = function (req, res) {
	res.render('login',{page_title:"Log in"});
};


/*
 * GET Add New Activity Page.	
 */

exports.add = function (req, res) {
	
	if (req.user === undefined){
		var user = false;
	} else {
		var user = req.user.Username;
	}

	connection.query( 'SELECT * FROM Activities' , function (err1, row1, field1) {
		if (err1) console.log(err1);

		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('add_new_activity',{page_title:"Add new activity", user:user, data:row1, cData:row2});
		});
	});
};


/*
 * POST Save New Story, saving content to DB and redirect to Home Page.
 */

 exports.save = function (req, res) {

 	//validation
  req.assert('title','Title required, 1-50 characters').len(1, 50);
  req.assert('categoryid','Category requred').notEmpty();
  req.assert('content','Activity required').notEmpty();

 	var errors = req.validationErrors();
  if(errors){
    res.status(400).json(errors);
    return;
  }

 	var data = {
 		title 		: req.body.title,
 		categoryid: req.body.categoryid,
 		content 	: req.body.content,
 		img				: req.body.image
 	};

 	connection.query( "INSERT INTO Activities (CategoryID, Title, Content, ImageSrc) " +
 		"VALUES ('" + data.categoryid + "', '" + data.title + "', '" + data.content + "', '" + data.img + "');", function (err, row, field) {
 		
 		if (err) console.log(err);
 		res.sendStatus(200);
  });
 };


/*
 * GET Delete Activity	
 */

exports.delete = function (req, res) {
	var activityId = req.params.id;
	connection.query( 'DELETE FROM Activities WHERE ActivityID = ?',  [activityId], function (err, row, field) {
		if (err) console.log(err);
		res.redirect('/');
	});
};



/*
 * GET Edit Story Page.	
 */

exports.edit = function (req, res) {

	var activityId = req.params.id;

	if (req.user === undefined){
		var user = false;
	}
	else {
		var user = req.user.Username;
	}

	connection.query( 'SELECT * FROM Activities WHERE ActivityID =' + activityId + ';' , function (err1, row1, field1) {
		if (err1) console.log(err1);

		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('edit_activity',{page_title:"Edit activity", user:user, data:row1, cData:row2});
		});
	});
};


/*
 * PUT Update Activity, saving content to DB and redirect to Home Page.
 */

exports.update = function (req, res) {
 	
 	//validation
  req.assert('title','Title required, 1-50 characters').len(1, 50);
  req.assert('categoryid','Category requred').notEmpty();
  req.assert('content','Activity required').notEmpty();

 	var errors = req.validationErrors();
  if(errors){
    res.status(400).json(errors);
    return;
  }
 	
 	var activityId = req.params.id;

 	var data = {
 		title 		: req.body.title,
 		categoryid: req.body.categoryid,
 		content 	: req.body.content,
 		img				: req.body.image
 	};

 	connection.query( "UPDATE Activities "+
 		"SET CategoryID='" + data.categoryid + "', Title='" + data.title + "', Content='" + data.content + "', ImageSrc='" + data.img + "' "+
 		"WHERE ActivityID=" + activityId + ";", function (err, row, field) {
 		
 		if (err) console.log(err);

 		res.sendStatus(200); //SKA FUNGERA MEN GÖR DET EJ??????
  });
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
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form
  	
    connection.query("SELECT * FROM Users WHERE Username = '" + username + "'",function(err,rows){
			if (err) {
				return done(err);
			}

			if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      } 
			
			// if the user is found but the password is wrong
      if (!( rows[0].UserPassword == password)){
        return done(null, false, req.flash('loginMessage', 'Oops, rong password!'));
      }
			
      // all is well, return successful user
      return done(null, rows[0]);			
		
		});
  }));
};


/*
 * POST Filter or Sort or Search
 */

exports.filterSearch = function (req, res) {

	if (req.user === undefined){
		var user = false;
	}
	else {
		var user = req.user.Username;
	}

	if(req.body.filter !== undefined) {
		//Gör filtergrejer 
		filter(req.body.filter, res, user);
	}
	else {
		//Gör sökgrejer
		search(req.body.search, res, user);
	}
};


/*
 * Functions
 */

// Filter
function filter(filterType, res, user) {

	if (filterType === 'all') {

		connection.query( "SELECT * FROM Activities", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
			connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
				if (err2) console.log(err2);

				res.render('index',{page_title:"To do in Seoul", user:user, data:row1, cData:row2});
			});
		});
	}

	else {
		connection.query( "SELECT * FROM Activities WHERE CategoryID='" + filterType + "';", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
			connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
				if (err2) console.log(err2);

				res.render('index',{page_title:"To do in Seoul", user:user, data:row1, cData:row2});
			});
		});
	}
};

// Search
function search(searchType, res, user) {
	
	connection.query( "SELECT * FROM Activities WHERE Title LIKE '%" + searchType + "%';", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('index',{page_title:"To do in Seoul", user:user, data:row1, cData:row2});
		});
	});
};
