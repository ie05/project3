var express = require('express');
var passport = require('passport');
var isLoggedIn = require('../helpers/isLoggedIn');
var router = express.Router();


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