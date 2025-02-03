const express= require('express');
const app = express();
const mySqlPool = require("./config/db.js")

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use("/api/v1/user", require('./routes/userRoutes'));

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
});

app.get('/',(req,res)=>{
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render('about');
})

app.get('/login',(req,res)=>{
    res.render('login');
});


app.get('/signup',(req,res)=>{
    res.render('signup');
});

app.get('/ask_bros', (req, res) => {
    res.render('ask_bros');
});

app.get('/help_bros', (req, res) => {
    res.render('help_bros');
});

app.get('/comment_here', (req, res) => {
    res.render('comment_here');
});