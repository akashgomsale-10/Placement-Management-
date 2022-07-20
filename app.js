const express=require('express');
const app=express();
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
app.set("views", path.join(__dirname, "./templates/views"));
const partials_path = path.join(__dirname, "./templates/partials");
hbs.registerPartials(partials_path);
app.use(flash());
app.use(session({
    secret:'cat is dead',
    cookie: { maxAge: 60000 }
}));

var userRoute = require('./router/user');
var logRoute = require('./router/login_out');


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'akash1045',
    database : 'placement'
});
connection.connect((err)=>{
        if(!err)
        console.log("Database is connected!!");
        else
        console.log(`Database connection is failed : ` + JSON.stringify(err,undefined,2));
    });
    
    app.use(function(req, res, next){
        //res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });


    app.listen(port,function(){
        console.log("application running on port: "+ port);
    });
 
    
    app.use( userRoute);
    app.use(logRoute); 

    app.get('/',function(req,res){
        res.sendFile(path.join(__dirname, './templates/views', 'main.html'));
    });
    app.get('/home',function(req,res){
        res.render('home',{email : req.session.emailAddress});
    });
    app.get('/profile',function(req,res){
        res.render('profile',{email : req.session.emailAddress});
    });

    app.get('/viewjob',function(req,res){
        res.render('viewjob',{email : req.session.emailAddress});
    });
    


    app.post('/delete' , function(req,res){
        
        var id = req.body.c_id;
        
        var sql = "DELETE FROM company Where c_id =?" ;
        connection.query(sql,[req.body.c_id],function (err, data, fields) {
                if(err) throw err;
                else{
                    console.log("deleted")
                    res.redirect('/companyreport')
                }
    
        });
    })


    app.post('/updatecc' , function(req,res){
        
        inputData = {   
            c_id : req.body.c_id,
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
   
        var sql = "UPDATE company SET c_name = ? , web_name = ? , c_email = ? ,contact_no = ? ,city = ? ,  country = ? , \
                    state = ? , address = ?, description = ?  WHERE c_id = ? " ;
        connection.query(sql,[inputData.c_name,inputData.web_name,inputData.c_email,inputData.contact_no,inputData.city,inputData.country,inputData.state,inputData.address,inputData.description,inputData.c_id],function (err, data, fields) {
                if(err) throw err;
                else{
                    console.log("updated")
                    res.redirect('/companyreport')
                }
    
        });
    })




    app.get('/upcompany' ,function(req,res){

        res.render('updateCom' , {  c_id:req.session.c_id,
                                    c_name:req.session.c_name ,
                                    web_name:req.session.web_name ,
                                    c_email:req.session.c_email,
                                    contact_no:req.session.contact_no, 
                                    city:req.session.city ,
                                    state:req.session.state, 
                                    country:req.session.country,
                                    address:req.session.address, 
                                    description:req.session.description          });
    })


    app.get('/edit' ,function(req,res){

        console.log(req.session.c_id)
        var sql = "SELECT * FROM company WHERE c_id =?";
        connection.query(sql,[req.session.c_id],function (err, data, fields) {
             if(err) throw err;
 
             res.send(data);
        })
 
    });   

    app.post('/update' , function(req,res){
        var sql = "SELECT * FROM company WHERE c_id =?";
       connection.query(sql,[req.body.c_id],function (err, data, fields) {
            if(err) throw err;
            // console.log(data[0].state);

            req.session.c_id = data[0].c_id;
            req.session.c_name =data[0].c_name;
            req.session.web_name = data[0].web_name;
            req.session.c_email = data[0].c_email;
            req.session.contact_no = data[0].contact_no;
            req.session.city = data[0].city;
            req.session.country = data[0].country;
            req.session.state = data[0].state;
            req.session.address = data[0].address;
            req.session.description = data[0].description;

            res.redirect('/upcompany');
            
            // res.redirect('/edit' );
            // res.send(data);

       })

    });




    
    


     // app.get('/dashboard',function(req,res){
    //     res.render(path.join(__dirname, './views', 'dashboard.hbs'));
    // });

    // app.get('/about',function(req,res){
    //     res.status(200).render("about");
    // });


    // app.get('/login',function(req,res){
    //     res.status(200).render("login");
    // });

    // app.get('/register', function(req, res, next) {
    //     res.render('registration');
    //   });
     




// app.get('/deletecompany/:id' , (req,res)=>{

//     const i = req.params.id;
//     const t = "DELETE from company where id =?" ;

//     connection.query(t,[i],(err,response)=>{
//         if(err){
//             console.log(err);
//         }
//         console.log(response);

//         res.send(response);
//     })
// })



