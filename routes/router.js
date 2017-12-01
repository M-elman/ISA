var express = require('express');
var router = express.Router();
var User = require('../models/userSchema');
var Admin = require('../models/adminSchema');
var path = require('path');
var nodemailer = require('nodemailer');
const catastalCodes = require('../models/catastal-codes.json');
const medical_specialties = require('../models/medical_specialties.json');

  


 // GET route for reading data
router.get('/', function (req, res, next) {
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        //check if there is an active admin session
        Admin.findById(req.session.userId)
        .exec(function (error, user) {
          if (error) {
            return next(error);
          } else {
            if (user === null) {
              return res.sendFile(path.join(__dirname + '/../views/index.html'));
            } else {
              //non si potrebbe fare redirect anzichè sendFile?
              return res.sendFile(path.join(__dirname + '/../views/adminPage.html'));
            }
          }
        });
      } else {
        //gestisci se è dottore e se è admin
        //non si potrebbe fare redirect anzichè sendFile?
        return res.sendFile(path.join(__dirname + '/../views/clientPage.html'));
      }
    }
  });
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
        if(user.isDoctor==true){
          return res.send("Doctor is in");
          //return res.redirect('/doctorPage');
        }else{
          return res.redirect('/clientPage');
        }
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

//POST route for logging in an administrator
router.post('/admin_login', function (req, res, next) {
  if (req.body.adlogusername && req.body.adlogpassword) {
  
      Admin.authenticate(req.body.adlogusername, req.body.adlogpassword, function (error, admin) {
        if (error || !admin) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = admin._id;
          return res.redirect('/adminPage');
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
      isDoctor: false,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name.toLowerCase(),
      surname: req.body.surname.toLowerCase(),
      birthdate: req.body.birthdate,
      birthTown: req.body.birthTown,
      birthProvince: req.body.birthProvince.toUpperCase(),
      gender: req.body.gender,
      taxCode: req.body.taxCode.toUpperCase(),
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

//POST route for adding a new doctor
router.post('/register', function (req, res, next) {

  var userData = {
        isDoctor: true,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name.toLowerCase(),
        surname: req.body.surname.toLowerCase(), //useful to efficiently query the collection
        birthdate: req.body.birthdate,
        birthTown: req.body.birthTown,
        birthProvince: req.body.birthProvince.toUpperCase(),
        gender: req.body.gender,
        medicalRegisterProvince: req.body.medRegPrv.toUpperCase(),
        medicalRegisterNumber: req.body.medRegNum,
        /*medicalSpecialties:*/
      }

      if (req.body.specialties==undefined || req.body.specialties==""){
        userData.medicalSpecialties=null;
      }
      else if(req.body.specialties.constructor !== Array){
        userData.medicalSpecialties=new Array();
        userData.medicalSpecialties.push(req.body.specialties);
      }
      else{
        userData.medicalSpecialties=new Array();
        for (let s of req.body.specialties) {
  
          userData.medicalSpecialties.push(s);
        }
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
    text: 'Bienvenu doctor!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });    
      
      
  })

  //POST route for updating doctor
router.post('/updatedoc', function (req, res, next) {
  if(req.body.updMedRegPrv!=="" && req.body.updMedRegPrv!==undefined){
  User.findOneAndUpdate({ medicalRegisterNumber: req.body.doc_id }, { $set: { medicalRegisterProvince: req.body.updMedRegPrv,  medicalSpecialties: null}}, function(err, usr){
    if (err) {return res.send(500, { error: err });}
  });
}
      var emptyArray=new Array();
      User.findOneAndUpdate({ medicalRegisterNumber: req.body.doc_id }, { $set: { medicalSpecialties: emptyArray  }}, function(err, usr){
        if (err) {return res.send(500, { error: err });}
        else{
          if (req.body.updSpecialtiesDoc !=="" && req.body.updSpecialtiesDoc!==undefined ){
            
              if(req.body.updSpecialtiesDoc.constructor !== Array){
                User.findOneAndUpdate({ medicalRegisterNumber: req.body.doc_id }, { $push: { medicalSpecialties: req.body.updSpecialtiesDoc  }}, function(err, usr){
                if (err) {return res.send(500, { error: err });}
                else{
                  res.status(200).send("OK");                  
                }
                });
              }else{
                for (let specialty of req.body.updSpecialtiesDoc) {
                  User.findOneAndUpdate({ medicalRegisterNumber: req.body.doc_id }, { $push: { medicalSpecialties: specialty  }}, function(err, usr){
                    if (err) return res.send(500, { error: err });
                  });
                  }
                  res.status(200).send("OK");
            }
          }
          else{
            res.status(200).send("OK");
            
          }

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

//check if a tax code already exists
router.post('/taxcode', function (req, res, next) {
  User.findOne({ taxCode: req.body.taxCode })
     .exec(function (error, user) {
        if (error) {
          return next(error);
        }  else if (user) {
            res.status(449).send("This user already exists.")
        } else {
          res.status(200).send("Check ok.")
        }
  
      
  })
  })

  //check if a medical identifier already exists
router.post('/maid', function (req, res, next) {
  User.findOne({ medicalRegisterNumber: req.body.medRegNum })
     .exec(function (error, user) {
        if (error) {
          return next(error);
        }  else if (user) {
            res.status(449).send("This doctor is already registered.")
        } else {
          res.status(200).send("Check ok.")
        }
  
      
  })
  })


  router.post('/birthprovince', function (req, res, next) {
    
    if (req.body.medRegPrv==""){
        res.setHeader('content-type', 'application/json');
        res.status(404).send(JSON.stringify({medRegPrv_err: "This field cannot be left blank"}))
    }
    else{
        if(catastalCodes[req.body.medRegPrv.toUpperCase()]==undefined){
                res.setHeader('content-type', 'application/json');
                res.status(404).send(JSON.stringify({medRegPrv_err: "We have not found it in our database"}))  
        }
        else{
                res.status(200).send(JSON.stringify({medRegPrv_err: null}))
        }
        
    }
    
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
        if(catastalCodes[req.body.birthplace_provincia.toUpperCase()]==undefined){
                res.setHeader('content-type', 'application/json');
                res.status(404).send(JSON.stringify({bprov_err: "We have not found it in our database", btow_err: null}))  
        }
        else{
        for (var i = catastalCodes[req.body.birthplace_provincia.toUpperCase()].length - 1; i >= 0; i--) {
        var comune = catastalCodes[req.body.birthplace_provincia.toUpperCase()][i];
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

router.get('/specialties', function (req, res, next) {
  res.status(200).json(medical_specialties);
});


router.get('/searchdoctor', function (req, res, next) {

  if (req.query.doctorSurname !== undefined && req.query.doctorID === undefined)  {
    var surname = req.query.doctorSurname; 
    //query mongoDB and return answer
    var selectedFields = 'name surname birthdate medicalRegisterProvince medicalRegisterNumber';
    User.find({ 'surname': surname.toLowerCase(), 'isDoctor': true }, selectedFields)
      .exec(function (err, docs) {
      // docs is an array
      if (err) {
        return next(err);
      } else {
          if (docs.length==0) {
            return res.status(404).send("Doctor not found. Please check the input and specify the complete surname. ");
          }
          else{
          var data = [];
          for (var i = 0; i < docs.length; i++) {
            data.push(docs[i]);
          }
          return res.status(200).json(data);
        }
        
      }
    });
  }else if  (req.query.doctorSurname === undefined && req.query.doctorID !== undefined){
    //query mongoDB and return answer
    var selectedFields = 'name surname birthdate birthTown birthProvince gender medicalRegisterProvince medicalRegisterNumber medicalSpecialties';
    User.findOne({ 'medicalRegisterNumber': req.query.doctorID}, selectedFields)
      .exec(function (err, user) {
      if (err) {
        return next(err);
      } else {      
       
          return res.status(200).json(user);
        
      }
    });

  }
  

});

router.get('/getusername', function (req, res, next) {
  
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {      
      if (user === null) {     
        //impossible
        return next(err);
      } else {
        return res.send(user.username);
      }
    }
  });    
  
  });

  router.get('/getuserdata', function (req, res, next) {
    var selectedFields = 'name surname birthdate birthTown birthProvince email taxCode';    
    User.findById(req.session.userId, selectedFields)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {      
        if (user === null) {     
          //impossible
          return next(err);
        } else {
          return res.json(user);
        }
      }
    });    
    
    });




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


// GET route for admin page
router.get('/adminPage', function (req, res, next) {
  Admin.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.sendFile(path.join(__dirname + '/../views/adminPage.html'));
        }
      }
    });
});

// GET for logout
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