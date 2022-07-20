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

// connection.connect((err)=>{
//     if(!err)
//     console.log("Database is connected!!");
//     else
//     console.log(`Database connection is failed : ` + JSON.stringify(err,undefined,2));
// });

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

//   connection.query(sql,[inputData.email_address],function (err, data, fields) {
//     if (err) throw err;
//     if (data.length > 0){
//         req.session.loggedinUser= true;
//         req.session.id = data.id;
//         req.session.first_name = data.first_name;
//         req.session.email_address = data.email_address;
//         res.redirect('/show');
//     }

//   })


});

module.exports = router;
