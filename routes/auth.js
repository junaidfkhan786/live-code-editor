var express = require('express');
var router = express.Router();
var passport = require('passport');



router.route('/login')
.get(function(req, res, next) {
  res.render('login', { title: 'LOGIN YOUR ACCOUNT' });
})

.post(passport.authenticate('local',{
	failureRedirect:'/login'
}), function (req, res) {
	res.redirect('/')
});

router.route('/register')
.get(function(req, res, next) {
  res.render('register', { title: 'REGISTER A NEW ACCOUNT' });
})

.post(function (req, res, next) {
	req.checkBody('name','Empty name').notEmpty();
	req.checkBody('email','invalid email').isEmail();
	req.checkBody('password','Empty Password').notEmpty();
	req.checkBody('password','Password fo not match').equals(req.body.confirmpassword).notEmpty();
	var errors = req.validationErrors();

	if(errors){

		res.render('register',
			{title: 'REGISTER A NEW ACCOUNT',
			name:req.body.name,
			email:req.body.email,
			errorMessages: errors

			});
} else{

	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email,
	user.setPassword(req.body.password);
	user.save(function (err) {
		if(err){
			res.render('register',{errorMessages: err});		
		} else {
			res.redirect('/login');
		}
	})
}
});

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	router.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: '/',
	    failureRedirect: '/' }));

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});





module.exports = router;