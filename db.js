const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1311',
    database: 'falconflowDB'
})

con.connect(function (error){
    if(error) throw error;
    console.log('Connected!');
})
