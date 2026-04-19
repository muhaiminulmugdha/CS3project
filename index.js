require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./config/db');
const questionRoutes = require('./routes/questionsRoutes');
const userRoutes = require('./routes/users/userRoutes');
const feedRoutes = require('./routes/feedRoute');
const teacherRoutes = require('./routes/teacherRoutes');

// Connect to MongoDB
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session setup — MUST be before routes
app.use(session({
    secret: 'falconflow_secret',
    resave: false,
    saveUninitialized: false
}));

// Routes — AFTER session
app.use("/", questionRoutes);
app.use("/", userRoutes);
app.use("/", feedRoutes);
app.use("/", teacherRoutes);

app.get('/', (req, res) => { res.render('index'); });
app.get('/about', (req, res) => { res.render('about'); });
app.get('/login', (req, res) => { res.render('login', { error: null, email: null }); });
app.get('/signup', (req, res) => { res.render('signup', { error: null, username: null, email: null }); });
app.get('/comment_here', (req, res) => { res.render('comment_here'); });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});