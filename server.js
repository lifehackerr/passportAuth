const express = require('express');
const app = express();
const {connectMongoose , User} = require("./database");
const passport = require('passport');
const { initializingPassport, isAuthenticated } = require('./passportConfig');
const expressSession = require('express-session');

connectMongoose();


initializingPassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({secret: 'secret',resave: false, saveUninitialized:false}));

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})
app.get('/register', (req, res) => {
    res.render('register');
})
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/register',async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(user){
        return res.status(400).send("user already registered");
    }
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
})

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

  app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile');
})

app.listen(3030,() => {
    console.log("listening on port http://localhost:3030");
})