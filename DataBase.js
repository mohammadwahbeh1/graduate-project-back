// db.js
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'aws-abbas.c5osoi48c22a.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: '903911865+',
    database: 'Naqalati'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = con;
