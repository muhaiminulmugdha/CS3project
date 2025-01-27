const express= require('express');
const app = express();
const mySqlPool = require("./config/db.js")

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use("/api/v1/user", require('./routes/userRoutes'));

mySqlPool
    .query("SELECT 1")
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch((error) => {
        console.error(error);
})

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
});

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/login',(req,res)=>{
    res.render('login');
});


app.get('/signup',(req,res)=>{
    res.render('signup');
});