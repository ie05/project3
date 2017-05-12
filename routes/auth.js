var express = require('express');
var passport = require('passport');
var isLoggedIn = require('../helpers/isLoggedIn');
var router = express.Router();


// CLARA: I've commented out the following
// code becuase this app is for multi users
// however, if you have issues for getting your
// user authenticated for this add, you can
// uncomment this code and use the signup route
// to create a user who will serve as admin.
// I otherwise wouldn't include this  snippet
// in my source code =)

  /* // GET signup page 
  router.get('/signup', function(req, res, next){
    res.render('signup');
  });

  // POST signup
  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/admin',
    failureRedirect: '/signup',
    failureFlash: true
  }));

*/

// GET secret 
// Note isLoggedIn middleware
// verify if user is logged in
// this code is identical to
// the / route in index.js
// however a logged in bool = true is sent
// to the template so the admin
// section is activated
router.get('/admin', isLoggedIn, function(req, res, next) {
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
        
         res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?', statuses: statuses, loggedin: true});
        }else{
          return res.redirect('/');
        }

    });
});


// GET login page.
// Any flash messages are automatically added
router.get('/login', function(req, res, next){
res.render('login');
});


// POST login - this is called when clicking login button
// Very similar to signup, except using local-login method.
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET Logout
router.get('/logout', function(req, res, next) {
  // passport middleware adds logout function to req object
  req.logout(); 
  res.redirect('/'); // redirect to home page
});

module.exports = router;