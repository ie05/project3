var express = require('express');
var router = express.Router();
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
var botCreds = {
 consumer_key: '2ep9JxmzJZWRFsHBMEUjhcR0m',
 consumer_secret: '8SiofFEtnWsA7LStjCbXV7xsJh2wXGCr3yqCXR0dTqY3ejTbpw',
 access_token: '851970802543144961-IuygBxGwSjUwKokUyArh2yX4m8fEvCn',
 access_token_secret: 'SKv5ZNUZEe5BB817TravMp3W3Rii3fhoh0oILNVfKWC6K',
 timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
};
var T = new Twit(botCreds);


router.get('/', function(req, res, next) {
	// need to wrap this in a function that queries existing posts on jack b
	// then stores them in an obj, and write the object into the templete
	// fist do this by query and log to console
	// then write to the index template.
	// looking at API, I think I'll only be able to delete tweets.
	// Jack user id 851970802543144961
	T.get('statuses/user_timeline', { user_id: '851970802543144961', count: 2}, function(err, data, response) {
      if (err) {
          return next(err);
      }
          
      if (data) {
           
		// res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?'});
      
      }

});



});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', description: 'Ol\' Jack always says... what the hell?' });
});

module.exports = router;
