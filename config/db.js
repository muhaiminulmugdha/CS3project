const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234', // <-- change to your real password
    database: 'falconflowdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database!');
        connection.release();
    }
});

// Export pool
module.exports = pool.promise();