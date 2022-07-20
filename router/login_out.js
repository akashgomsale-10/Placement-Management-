const express=require('express');
const app=express();
const router = express.Router();
const mysql=require('mysql');


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'akash1045',
    database : 'placement',
    multipleStatements: true
});


// register 


router.get("/register", function (req, res, next) {
  res.render("registration");
});

router.post("/register", function (req, res, next) {
  inputData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    gender: req.body.gender,
    phone_no: req.body.phone_no,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  };
  
  // check unique email address
  var sql = "SELECT * FROM registration WHERE email_address =?";

  connection.query(sql,[inputData.email_address],function (err, data, fields) {
      if (err) throw err;
      if (data.length > 1) {
        var msg = inputData.email_address + "was already exist";
      } else if (inputData.confirm_password != inputData.password) {
        var msg = "Password & Confirm Password is not Matched";
      } else {
        // save users data into database
 
        var sql = "INSERT INTO registration SET ?";

        connection.query(sql, inputData, function (err, data) {
          if (err) throw err;
        });
        var msg = "Your are successfully registered";
      }
      res.render("login", { alertMsg: msg });
    }
  );
});




// login js

router.get('/login', function(req, res, next) {
    res.render('login');
  }); 


  router.post('/login', function(req, res){
    var adminEmail = 'admin@gmail.com';
    var adminPass = 'admin@123' ;
    var emailAddress = req.body.email_address;
    var loginpassword = req.body.password;

    
    
    var sql='SELECT * FROM registration WHERE email_address =? AND password =?';
    connection.query(sql, [emailAddress, loginpassword], function (err, data, fields) {      
        
        if(err) throw err;

          if (data.length == 0) {
            req.flash('error', 'Please correct enter email and Password!')
            res.redirect('/login')
          }
          else if(data[0].id == 1 && data.length>0){
            req.session.loggedinUser= true;
              req.session.emailAddress= emailAddress;
              res.redirect('/dashboard');
          }
          else if(data.length > 0){
              req.session.loggedinUser= true;
              req.session.emailAddress= emailAddress;
              res.redirect('/home');
          }
        
    })
})



/* GET users listing. */
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;





// var sql_1='SELECT * FROM registration WHERE id = 1';
    // connection.query(sql_1, function (err, row, fields) {
    //   if(err) throw err;
    //   adminEmail = row[0].email_address;
    //   adminPass = row[0].password;

    //   if(row[0].email_address == adminEmail && row[0].password == loginpassword){
    //     req.session.loggedinUser= true;
    //     req.session.emailAddress= emailAddress;
    //     res.redirect('/dashboard');
    //   }else{
    //       res.redirect('/login');
    //   }

      
    // });

    // console.log("admin = " + adminEmail + ", pass = " + adminPass);       // CONSOLE //
