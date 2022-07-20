const express=require('express');
const app=express();
const router = express.Router();
// const mysql=require('mysql');



router.get('/home', function(req, res, next) {
    res.render('home')
})

module.exports = router;