// db.js
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12735599',
    password: 'gNza1QkttA',
    database: 'sql12735599'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = con;
