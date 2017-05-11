var express = require('express');
var router = express.Router();
var Twit = require('twit');
var paginate = require('handlebars-paginate');
var TwitterBot = require('node-twitterbot').TwitterBot;
var removeRegexChars = require('../helpers/regex');
var passport = require('passport');
var botCreds = {
 consumer_key: process.env.BOT_CONSUMER_KEY,
 consumer_secret: process.env.BOT_CONSUMER_SECRET,
 access_token: process.env.BOT_ACCESS_TOKEN,
 access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET,
 timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
};
var T = new Twit(botCreds);
var user_id = process.env.USER_ID;

router.get('/', function(req, res, next) {

	T.get('statuses/user_timeline', { user_id: user_id}, function(err, data, response) {
      if (err) {
          return next(err);
      }
      
      if (data) {
    	 var statuses = [];
         // console.log(data[0].text);
         for (var i = 0; i < data.length; i++) {
               var text = data[i].text.replace('You know what ol\' Jack Burton always says? ','');
               statuses.push(
               	{id: data[i].id_str , text: text}
               );
           }
      
      	 // var json = JSON.stringify(statuses);
	  	 res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?', statuses: statuses});
      }else{
      	return res.redirect('/');
      }

	});

});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', description: 'Ol\' Jack always says... what the hell?' });
});

router.delete('/delete', function(req, res, next) {
  
  T.post('statuses/destroy/:id', { id: req.body.id }, function (err, data, response) {
	   	if (err) {
	        return next(err);
	   	}
	   	if (data) {
	   		res.status(202);
			res.end();
	   		// console.log('req.body.id is ' + req.body.id);
	   	}else{
	   		// TODO: Add flash error if delete is not successful
	  		return res.redirect('/');
	   	}
   }); // T.post

}); // end post


router.post('/add', function(req, res, next){
 	var tweet = removeRegexChars(req.body.tweet);
 	// console.log(tweet);
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

	// TODO: Ask Laura about pagination, how can I emplement this?
	// Jack user id 851970802543144961
	T.get('statuses/user_timeline', { user_id: user_id}, function(err, data, response) {
      if (err) {
          return next(err);
      }
      
      if (data) {
    	 var statuses = [];
         // console.log(data[0].text);
         for (var i = 0; i < data.length; i++) {
               var text = data[i].text.replace('You know what ol\' Jack Burton always says? ','');
               statuses.push(
               	{id: data[i].id_str , text: text}
               );
           }
      	 console.log(statuses);
      	 // var json = JSON.stringify(statuses);
	  	 res.status(201);
  		 res.json(statuses);
      }else{
      	return res.redirect('/');
      }

	});

});

// start auth login

  // /* GET signup page */
  // router.get('/signup', function(req, res, next){
  //   res.render('signup');
  // });

  // /* POST signup */
  // router.post('/signup', passport.authenticate('local-signup', {
  //   successRedirect: '/admin',
  //   failureRedirect: '/signup',
  //   failureFlash: true
  // }));

/* GET secret page. Note isLoggedIn middleware to verify if user is logged in */
router.get('/admin', isLoggedIn, function(req, res, next) {
    T.get('statuses/user_timeline', { user_id: user_id}, function(err, data, response) {
        if (err) {
            return next(err);
        }
        
        if (data) {
         var statuses = [];
           // console.log(data[0].text);
           for (var i = 0; i < data.length; i++) {
                 var text = data[i].text.replace('You know what ol\' Jack Burton always says? ','');
                 statuses.push(
                  {id: data[i].id_str , text: text}
                 );
             }
        
           // var json = JSON.stringify(statuses);
         res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?', statuses: statuses, loggedin: true});
        }else{
          return res.redirect('/');
        }

    });
});

  function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
  return next();
  }
  res.redirect('/login');
  }

  /* GET login page. Any flash messages are automatically added. */
  router.get('/login', function(req, res, next){
  res.render('login');
  });


  /* POST login - this is called when clicking login button
  Very similar to signup, except using local-login method. */
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
  }));

  /* GET Logout */
  router.get('/logout', function(req, res, next) {
    //passport middleware adds logout function to req object
    req.logout(); 
    res.redirect('/'); // redirect to home page
  });


module.exports = router;
