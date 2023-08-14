if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//console.log(process.env.secret )

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Joi = require('joi');// Not needed since it is required in the schema file
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const {campgroundSchema, reviewSchema} = require('./schemas.js')// JOI schema
const methodOverride = require('method-override');
const Campground = require('./models/campground.js');
const expressError = require('./utilities/expressError.js');
const catchAsync = require('./utilities/catchAsync.js')
const Review = require('./models/review')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')


const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campground.js') //Requiring the restructured campground routes
const reviewsRoutes = require('./routes/reviews.js')//Requiring the restructured review routes

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))//middleware
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig ={
    secret : 'deting',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }//cookie options

}//setting up session

app.use(session(sessionConfig))//calling the session
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));//we're telling passport to use localstrategy which has been required & the authentication method will be on the user model 

passport.serializeUser(User.serializeUser());//Serialization is How do we store a user in the session
passport.deserializeUser(User.deserializeUser());//opposite of serialization

app.use((req,res,next) => {
    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.get('/fakeuser', async(req,res) => {
    const user = new User({email: 'okwena@gmail.com', username:'Okwena'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})




// router.get('/', (req,res) =>{
//     res.render('home.ejs');
// })
app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)//To use the restructured campground routes
app.use('/campgrounds/:id/reviews', reviewsRoutes)//To use the restructures reviews routes



app.all('*',(req,res,next) => {
    next(new expressError('Page Not Found', 404))
})



app.use((err,req,res,next) => {
    
    const {statusCode =500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Oh No, Something went wrong'
    res.status(statusCode).render('error.ejs', {err});
    
})

app.listen('3000', () => {
    console.log("we're in boys 3000")
})