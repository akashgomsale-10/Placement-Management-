const express=require('express');
const app=express();
const router = express.Router();
const hbs=require('hbs');
const mysql=require('mysql');
const path=require('path');
const flash=require('connect-flash');
const session=require('express-session');
const bodyParser = require('body-parser');
const port=process.env.port||8080;
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));
app.use(express.static('public'));

app.use("/css", express.static("css"));
app.use(express.urlencoded());

app.set('view engine','hbs');
app.set('views','views');
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(session({
    secret:'cat is dead',
    cookie: { maxAge: 60000 }
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'akash1045',
    database : 'placement',
    multipleStatements: true
});
// connection.connect((err)=>{
//     if(!err)
//     console.log("Database is connected!!");
//     else
//     console.log(`Database connection is failed : ` + JSON.stringify(err,undefined,2));
// });


router.get('/login', function(req, res, next) {
    res.render('login');
  }); 


  router.post('/login', function(req, res){
    var emailAddress = req.body.email_address;
    var password = req.body.password;
    var sql='SELECT * FROM registration WHERE email_address =? AND password =?';

    connection.query(sql, [emailAddress, password], function (err, data, fields) {
        if(err) throw err
        if(data.length>0){
            req.session.loggedinUser= true;
            req.session.emailAddress= emailAddress;
            res.redirect('/dashboard');
        }else{
            res.render('/login');
        }
    })
})




module.exports = router;