const mysql = require("mysql2");

const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "bc_db",
})