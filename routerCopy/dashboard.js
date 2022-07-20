const express=require('express');
const app=express();
const router = express.Router();
const mysql=require('mysql');
const flash=require('connect-flash');
const bodyParser=require('body-parser');
const { route } = require('./registration');
app.use(flash());
app.use(express.static(__dirname+'/views'));
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'akash1045',
    database : 'placement',
    multipleStatements: true
});

var email_a;
var x;
/* GET users listing. */

router.get('/dashboard', function(req, res, next) {
    // x = (req.session.loggedinUser);
    email_a = (req.session.emailAddress);
    if(req.session.loggedinUser){
        res.render('dashboard',{email:req.session.emailAddress})
    }else{
        res.redirect('/login');
    }
    // res.render('dashboard',{email: email_a})

});

// console.log(`x value is => ${x}  and Email is ${email_a}`)


router.get('/addcompany', function(req, res, next) {
    
    res.render('addcompany' ,{email_a} )
})

router.get('/companyreport', function(req, res, next) {
    res.render('companyreport' , {email_a} )
})

router.get('/dash', function(req, res, next) {
    res.render('dashhome' , {email_a} )
})





module.exports = router;