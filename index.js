require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');
const connectDB = require('./config/db');
const questionRoutes = require('./routes/questionsRoutes');
const userRoutes = require('./routes/users/userRoutes');
const feedRoutes = require('./routes/feedRoute');
const teacherRoutes = require('./routes/teacherRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Connect to MongoDB
connectDB();

// Trust proxy — required for Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.'
});
app.use(limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts, please try again later.'
});
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/signup', authLimiter);

// XSS protection
app.use(xssClean());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", questionRoutes);
app.use("/", userRoutes);
app.use("/", feedRoutes);
app.use("/", teacherRoutes);
app.use("/", authRoutes);
app.use("/", aiRoutes);

// Root — redirect to login if not logged in
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.render('index');
    } else {
        res.redirect('/login');
    }
});

app.get('/about', (req, res) => { res.render('about'); });
app.get('/login', (req, res) => { res.render('login', { error: req.query.error || null, email: null }); });
app.get('/signup', (req, res) => { res.render('signup', { error: null, username: null, email: null }); });
app.get('/comment_here', (req, res) => { res.render('comment_here'); });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});