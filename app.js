if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utils/ExpressError');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/user');
const makeRoutes = require('./routes/make');
const modelRoutes = require('./routes/model');
const serieRoutes = require('./routes/serie');
const carRoutes = require('./routes/car');
const apiRoutes = require('./routes/api');

const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/ferro';

// Database connection
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

// App Configs
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(morgan('dev'))

// Authentication Configs
const secret = process.env.SECRET || 'hellobarbiegirl!';
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', authRoutes);
app.use('/make', makeRoutes);
app.use('/model', modelRoutes);
app.use('/serie', serieRoutes);
app.use('/car', carRoutes);
app.use('/api/v1', cors(), apiRoutes);

// Default Error Midddleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// 404 Page
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})