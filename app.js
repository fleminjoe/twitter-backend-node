const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const intitilzePassport = require('./config/passport')
const app = express();

require('dotenv').config();

//passport config
intitilzePassport(passport);

const PORT = process.env.PORT || 3000;

//db

const db = process.env.monogoURI;
//connect db
mongoose.connect(db,{ useNewUrlParser:true })
    .then(()=>{
        console.log('connected')
    })
    .catch(err => console.log(err));
//ejs
app.set('view engine','ejs');
//bodyparser
app.use(express.urlencoded(({ extended: false })));


//exxpress- session middleware
app.use(session({
    secret: "twitter",
    resave: true,
    saveUninitialized: true,
    
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// app.get('/', (req,res) => {
//     res.render('index.ejs')
// })

// app.get('/login', (req,res) => {
//     res.render('login.ejs')
// })

// app.post('/login', (req,res) => {
//     res.render('login.ejs')
// })


// app.get('/register', (req,res) => {
//     res.render('register.ejs')
// })

// app.post('/register', (req,res) => {
    
// })

app.listen(PORT)