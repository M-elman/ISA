var express = require('express');
var router = express.Router();
var User = require('../models/userSchema');
var path = require('path');
var nodemailer = require('nodemailer');

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/views/index.html'));
});


//POST route for logging in
router.post('/login', function (req, res, next) {
if (req.body.logusername && req.body.logpassword) {
    console.log(req.body.logusername)
    console.log(req.body.logpassword)

    User.authenticate(req.body.logusername, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/clientPage');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

//POST route for adding a new user
router.post('/signup', function (req, res, next) {
var userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      birthdate: req.body.birthdate,
      birthTown: req.body.birthTown,
      gender: req.body.gender,
      taxCode: req.body.taxCode,
    }


User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
          res.send("OK");
        //return res.redirect('/profile');
      }
    });
    
 var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: 'fastalert.healthmonitoring@gmail.com',
    pass: 'tf7nb39uj1'
  },
   tls: {
        rejectUnauthorized: false
    }
});

var mailOptions = {
  from: 'fastalert.healthmonitoring@gmail.com',
  to: req.body.email,
  subject: 'Welcome to FAHM',
  text: 'Bienvenu!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});    
    
    
})

//check if a username already exists
router.post('/username', function (req, res, next) {
User.findOne({ username: req.body.username })
   .exec(function (error, user) {
      if (error) {
        return next(error);
      }  else if (user) {
          res.status(449).send("The username you chose already exists.")
      }
    
})
})


// GET route after registering
router.get('/clientPage', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.sendFile(path.join(__dirname + '/../views/clientPage.html'));
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;