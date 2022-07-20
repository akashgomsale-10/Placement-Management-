const express = require("express");
const app = express();
const router = express.Router();

const hbs = require("hbs");
const mysql = require("mysql");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const { Router } = require("express");
const port = process.env.port || 8080;
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use("/css", express.static("css"));
app.use(express.urlencoded());
app.set("view engine", "hbs");
app.set("views", "views");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(
  session({
    secret: "cat is dead",
    cookie: { maxAge: 60000 },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "akash1045",
  database: "placement",
  multipleStatements: true,
});

// router.get('/addcompany', function(req, res, next) {
//     res.render('addcompany')
// })


router.post('/addcompany', function (req, res, next) {

    inputData = {   
      c_name: req.body.c_name,
      web_name: req.body.web_name,
      c_email: req.body.c_email,
      city: req.body.city,
      contact_no: req.body.contact_no,
      country: req.body.country,
      state: req.body.state,
      address:req.body.address,
      description: req.body.description,
    };
    // console.log(inputData);
    // check unique email address

    var sql = "SELECT * FROM company ";
    connection.query(sql,function (err, data, fields) {
        if (err) throw err;
        // if (data.length > 1) {
        //   var msg = inputData.c_name + "was already exist";
        // }
        // if (data.length > 1) {
        //   var msg = inputData.c_email + "was already exist";
        // }
        else {
          // save users data into database
          var sql = "INSERT INTO company SET ?";
          connection.query(sql, inputData, function (err, data) {
            if (err) throw err;
          });
          var msg = "Your are successfully registered";
        }
        res.redirect("/companyreport");
      }
    );
    });

router.get('/showdatabase', function(req, res, next) {

    var sql = "SELECT * FROM company " ;
    connection.query(sql,function (err, data, fields) {
        if(err) throw err;

        else{
           
            res.send(data)
           
        }

    })

});



module.exports = router;