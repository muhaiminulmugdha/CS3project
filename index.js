const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const questionRoutes = require('./routes/questionsRoutes');
const mysql = require('mysql2');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use("/", questionRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/comment_here', (req, res) => {
    res.render('comment_here');
});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1311',
    database: 'falconflowDB'
});

con.connect(function (error) {
    if (error) throw error;
    console.log('Connected!');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});