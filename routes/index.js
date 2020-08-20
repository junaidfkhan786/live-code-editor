var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LIVE CODE EDITOR' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'ABOUT' });
});

router.route('/contact')
.get(function(req, res, next){
	res.render('contact',{ title: 'CONTACT' });
})

.post(function(req, res, next){
	req.checkBody('name','Empty name').notEmpty();
	req.checkBody('email','invalid email').isEmail();
	req.checkBody('message','Empty message').notEmpty();
	var errors = req.validationErrors();

	if(errors){

		res.render('contact',
			{title: 'CONTACT',
			name:req.body.name,
			email:req.body.email,
			message:req.body.message,
			errorMessages: errors

			});
		
	}else {

			var mailoptions ={
				from: 'arkpmailportal@gmail.com',
				to: req.body.email,
				subject:'you got new msg from visiter',
				text: req.body.message
			};

			transporter.sendMail(mailoptions, function(error, info){
				if(error){
						return console.log('error')
				}
				res.render('thank',{ title: 'THANK YOU' });
			});
		}
	
}) ;

router.route('/task-share')
.get(function(req, res, next){
	res.render('task-share',{ title: 'Share' });
})

.post(function(req, res, next){
	req.checkBody('email','invalid email').isEmail();
	req.checkBody('message','Empty message').notEmpty();
	var errors = req.validationErrors();

	if(errors){

		res.render('task-share',
			{title: 'Task',
			email:req.body.email,
			message:req.body.message,
			errorMessages: errors

			});
		
	}else {

			var mailoptions ={
				from: 'arkpmailportal@gmail.com',
				to: req.body.email,
				subject:'you got URL from {{req.body.email}}',
				text: req.body.message
			};

			transporter.sendMail(mailoptions, function(error, info){
				if(error){
						return console.log('error')
				}
				res.render('task-share',{ title: 'THANK YOU' });
			});
		}
	
}) ;


module.exports = router;
