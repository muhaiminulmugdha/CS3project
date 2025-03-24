const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const userRoutes = require('./routes/users/userRoutes');
const questionRoutes = require('./routes/questionsRoutes');

// const commentRoutes = require('./routes/commentsRoutes');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());




app.set('view engine', 'ejs');
// app.use("views","./views");

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Use routes
app.use("/", questionRoutes);




app.get('/', (req, res) => {
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// app.get('/ask_bros', (req, res) => {
//     res.render('ask_bros');  // This renders the form for asking questions
// });

// app.get('/help_bros', (req, res) => {
//     res.render('help_bros');  // This renders the feed of questions
// });


// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});




