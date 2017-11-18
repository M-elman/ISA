var express = require('express');
var router = express.Router();
var User = require('../models/userSchema');
var path = require('path');
var nodemailer = require('nodemailer');
const catastalCodes = require('../models/catastal-codes.json')


// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/views/index.html'));
});


//POST route for logging in
router.post('/login', function (req, res, next) {
if (req.body.logusername && req.body.logpassword) {

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
      birthProvince: req.body.birthProvince,
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
      } else {
        res.status(200).send("The username you provided is fresh.")
      }

    
})
})

router.post('/birthplace', function (req, res, next) {
    
    if (req.body.birthplace_provincia=="" && req.body.birthplace==""){
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({bprov_err: "This field cannot be left blank", btow_err: "This field cannot be left blank"}))
    }
    else if (req.body.birthplace_provincia!="" && req.body.birthplace==""){
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({bprov_err: null, btow_err: "This field cannot be left blank"}))
    }
    else if (req.body.birthplace_provincia=="" && req.body.birthplace!=""){
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({bprov_err: "This field cannot be left blank", btow_err: null}))
    }
    else{
        var found=false;
        if(catastalCodes[req.body.birthplace_provincia]==undefined){
                res.setHeader('content-type', 'application/json');
                res.status(404).send(JSON.stringify({bprov_err: "We have not found it in our database", btow_err: null}))  
        }
        else{
        for (var i = catastalCodes[req.body.birthplace_provincia].length - 1; i >= 0; i--) {
        var comune = catastalCodes[req.body.birthplace_provincia][i];
        if(comune[0] == req.body.birthplace.trim().toUpperCase()) found=true;
        }
        if (found==false) {
                res.setHeader('content-type', 'application/json');
                res.status(404).send(JSON.stringify({bprov_err: null, btow_err: "We have not found it in our database"}))
        }
        else {
                res.status(200).send(JSON.stringify({bprov_err: null, btow_err: null}))
        }
        }
        
    }
    
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