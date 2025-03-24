const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    host: 'localhost',        // Database host (localhost if running locally)
    user: 'root',             // MySQL username (replace with your MySQL username)
    password: 'yourpassword', // MySQL password (replace with your MySQL password)
    database: 'falconflowdb', // The name of your database
    waitForConnections: true,
    connectionLimit: 10,      // The max number of simultaneous connections
    queueLimit: 0
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:');
    } else {
        console.log('Connected to MySQL database!');
        connection.release(); // Always release the connection back to the pool
    }
});




// Export the pool to be used in other files (promise-based)
module.exports = pool.promise();


