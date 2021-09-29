const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const passport = require('passport');
//login

router.get('/login',(req,res)=>{
    res.render('login.ejs', { message : req.flash('message')})
})

//register

router.get('/register',(req,res)=>{
    res.render('register')
})

//register handle
router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body;
    let errors = [];

    //check feilds

    if(!name || !email || !password || !password2)
        errors.push({ msg: 'Please fill all the feilds'});
    if(password !== password2)
        errors.push({msg: 'Passwords do not match'});
    if(password.length < 6)
        errors.push({msg:'Password should be least 6 characters'})
    if(errors.length>0)
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    else
       //validation pass
       User.findOne({email: email})
            .then(user => {
                if(user){
                    errors.push({msg: 'Email is already registered'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //hash password
                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(newUser.password, salt, (err,hash)=>{
                            if(err) throw err;
                            //set password
                            newUser.password = hash;
                            newUser.save()
                            .then( user => {
                                req.flash('success_msg','You can now login')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))

                        })
                    })
                    
                }
            })

})

//login handle
router.post('/login',(req,res,next)=>{

    console.log()
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)

});

//logout 
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})
module.exports = router;