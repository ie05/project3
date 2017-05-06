var express = require('express');
var router = express.Router();
var Twit = require('twit');
var paginate = require('handlebars-paginate');
var TwitterBot = require('node-twitterbot').TwitterBot;
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
      
      	 // var json = JSON.stringify(statuses);
	  	 res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?', statuses: statuses});
      }else{
      	return res.redirect('/');
      }

	});

});

router.post('/delete', function(req, res, next) {
	  // res.render('about', { title: 'About', description: 'Ol\' Jack always says... what the hell?' });
	  
	  T.post('statuses/destroy/:id', { id: req.body.id }, function (err, data, response) {
		   	if (err) {
		        return next(err);
		   	}
		   	if (data) {
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
					  	 console.log('statuses is ' + JSON.stringify(statuses));
					  	 res.status(202);
					  	 res.json(statuses);
				      }else{
				      	return res.redirect('/');
				      }

					});
		   		// console.log('req.body.id is ' + req.body.id);
		   	}else{
		  		return res.redirect('/');
		   	}
	   }); // T.post

}); // end post

module.exports = router;
