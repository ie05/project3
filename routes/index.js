var express = require('express');
var router = express.Router();
var Twit = require('twit');
var paginate = require('handlebars-paginate');
var TwitterBot = require('node-twitterbot').TwitterBot;
var removeRegexChars = require('../helpers/regex');
var passport = require('passport');
var isLoggedIn = require('../helpers/isLoggedIn');

// stores API env vars
var botCreds = {
 consumer_key: '2ep9JxmzJZWRFsHBMEUjhcR0m',
 consumer_secret: '8SiofFEtnWsA7LStjCbXV7xsJh2wXGCr3yqCXR0dTqY3ejTbpw',
 access_token: '851970802543144961-IuygBxGwSjUwKokUyArh2yX4m8fEvCn',
 access_token_secret: 'SKv5ZNUZEe5BB817TravMp3W3Rii3fhoh0oILNVfKWC6K',
 timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
};
var T = new Twit(botCreds);
var user_id = '851970802543144961';

router.get('/', function(req, res, next) {

	T.get('statuses/user_timeline', { user_id: user_id}, function(err, data, response) {
      if (err) {
          return next(err);
      }
      
      if (data) {
    	 var statuses = [];
         
         // loop over data object, and parse text
         for (var i = 0; i < data.length; i++) {
               // remove Jack's catch phrase to shorten the
               // tweets overall char length when viewing on front end
               var text = data[i].text.replace('You know what ol\' Jack Burton always says? ','');
               // create an {} to hold tweet's text
               // and id, id is needed for deleting
               statuses.push(
               	{id: data[i].id_str , text: text}
               );
           }
      
      // after parsing all tweets and storing in statuses arr
      // pass the arr to the index template to be rendered as
      // li elements by hbs template	 
	  	 res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?', statuses: statuses});
      }else{
      	return res.redirect('/');
      }

	});

});

// GET /about route handler
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', description: 'Ol\' Jack always says... what the hell?' });
});

// DELETE /delete handles making API delete requests
// requests to this route are made by
// AJAX methods on the client, stored
// in scripts.js
router.delete('/delete', function(req, res, next) {
  
  T.post('statuses/destroy/:id', { id: req.body.id }, function (err, data, response) {
	   	if (err) {
	        return next(err);
	   	}
	   	if (data) {
	   		 res.status(202);
			   res.end();
	   	}else{
	   		// TODO: Add flash error if delete is not successful
	  		return res.redirect('/');
	   	}
   }); // T.post

}); // end post

// ADD /add handler, makes API request to add tweet
// requests to this route are made by
// AJAX methods on the client, stored
// in scripts.js
router.post('/add', function(req, res, next){
 	// parse tweet prior to using
  // removes any mal chars
  var tweet = removeRegexChars(req.body.tweet);
 
 	T.post('statuses/update', { status: tweet }, function(err, data, response) {
  		if (err) {
	        return next(err);
	   	}
  		
  		if (data) {
  			res.status(201);
  			res.end();
  		}
  		else{
  			// TODO: Send flash message if post fails
			return res.redirect('/');
  		}

	});
	
});

router.get('/all', function(req, res, next) {
  // get ALL tweets for acct. id 851970802543144961
  // this data is then used to initialize the view
  // delete section in the front-end admin
	T.get('statuses/user_timeline', { user_id: user_id}, function(err, data, response) {
      if (err) {
          return next(err);
      }
      
      if (data) {
    	 var statuses = [];
         for (var i = 0; i < data.length; i++) {
               var text = data[i].text.replace('You know what ol\' Jack Burton always says? ','');
               statuses.push(
               	{id: data[i].id_str , text: text}
               );
           }
       // this route is accessed via AJAX
       // so JSON is returned here
       // rather than a template	 
	  	 res.status(201);
  		 res.json(statuses);
      }else{
      	return res.redirect('/');
      }

	});

});

// GET Logout
router.get('/logout', function(req, res, next) {
  // passport middleware adds logout function to req object
  req.logout(); 
  res.redirect('/'); // redirect to home page
});


module.exports = router;
