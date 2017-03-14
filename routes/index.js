var connection = require('../connection');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;

connection.connect(); //connect to database

/*
 * GET Home Page.	
 */

exports.home = function (req, res) {
	req.session.errors = null;
	req.session.success = null;
	req.session.filter = null;
	if (req.user === undefined){
		var user = false;
	} else {
		var user = req.user.Username;
	}

	connection.query( 'SELECT * FROM Activities' , function (err1, row1, field1) {
		if (err1) console.log(err1);

		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('index',{page_title:"To do in Seoul", filter: req.session.filter, user:user, data:row1, cData:row2});
		});
	});
};


/*
 * GET Login Page.	
 */

exports.login = function (req, res) {
	res.render('login',{page_title:"Log in", message: req.flash('loginMessage')});
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
			res.render('add_new_activity',{page_title:"Add new activity", errors: req.session.errors, success: req.session.success, user:user, data:row1, cData:row2});
		});
	});
};


/*
 * POST Save New Story, saving content to DB and redirect to Home Page.
 */

 exports.save = function (req, res) {

 	//validation
 	req.check('title','Title required, 1-50 characters').isLength({min: 1, max: 50});
  req.check('categoryid','Category required').notEmpty();
  req.check('content','Activity required').notEmpty();

 	var errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/add_new_activity');
  } 
  else {
		req.session.success = true;
  	var data = {
	 		title 		: req.body.title,
	 		categoryid: req.body.categoryid,
	 		content 	: req.body.content,
	 		img				: req.file.path.split('/')[8],
	 		imgName		: req.file.originalname
	 	};

	 	connection.query( "INSERT INTO Activities (CategoryID, Title, Content, ImageSrc, ImageName) " +
	 		"VALUES ('" + data.categoryid + "', '" + data.title + "', '" + data.content + "', '" + data.img + "', '" + data.imgName + "');", function (err, row, field) {
	 		
	 		if (err) console.log(err);
	 		res.redirect('/add_new_activity');
	  });
  }
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

			res.render('edit_activity',{page_title:"Edit activity", errors: req.session.errors, success: req.session.success, user:user, data:row1, cData:row2});
		});
	});
};


/*
 * PUT Update Activity, saving content to DB and redirect to Home Page.
 */

exports.update = function (req, res) {
	var activityId = req.params.id;
	//validation
 	req.check('title','Title required, 1-50 characters').isLength({min: 1, max: 50});
  req.check('categoryid','Category required').notEmpty();
  req.check('content','Activity required').notEmpty();

 	var errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/edit_activity/'+activityId);
  } 
  else {
  	req.session.success = true;
	 	var data = {
	 		title 		: req.body.title,
	 		categoryid: req.body.categoryid,
	 		content 	: req.body.content
	 	};

	 	connection.query( "UPDATE Activities "+
	 		"SET CategoryID='" + data.categoryid + "', Title='" + data.title + "', Content='" + data.content + "' "+
	 		"WHERE ActivityID=" + activityId + ";", function (err, row, field) {
	 		
	 		if (err) console.log(err);

	 		res.redirect('/edit_activity/'+activityId);
	  });
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
        return done(null, false, req.flash('loginMessage', 'Oops, wrong password!'));
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
		req.session.filter = req.body.filter;
		//Gör filtergrejer 
		filter(req.body.filter, req, res, user);
	}
	else {
		req.session.filter = req.body.search;
		//Gör sökgrejer
		search(req.body.search, req, res, user);
	}
};


/*
 * Functions
 */

// Filter
function filter(filterType, req, res, user) {

	if (filterType === 'all') {

		connection.query( "SELECT * FROM Activities", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
			connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
				if (err2) console.log(err2);

				res.render('index',{page_title:"To do in Seoul", filter: req.session.filter, user:user, data:row1, cData:row2});
			});
		});
	}

	else {
		connection.query( "SELECT * FROM Activities WHERE CategoryID='" + filterType + "';", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
			connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
				if (err2) console.log(err2);

				res.render('index',{page_title:"To do in Seoul", filter: req.session.filter, user:user, data:row1, cData:row2});
			});
		});
	}
};

// Search
function search(searchType, req, res, user) {

	connection.query( "SELECT * FROM Activities WHERE Title LIKE '%" + searchType + "%';", function (err1, row1, field1) {
		if (err1) console.log(err1);
	
		connection.query( 'SELECT * FROM Categories' , function (err2, row2, field2) {
			if (err2) console.log(err2);

			res.render('index',{page_title:"To do in Seoul", filter: req.session.filter, user:user, data:row1, cData:row2});
		});
	});
};
