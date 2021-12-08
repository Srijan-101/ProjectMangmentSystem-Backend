const sql = require('mysql2');

const connection = sql.createConnection({
    user: 'root',
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    database: 'userLogin'
})

connection.connect((error) => {
    if (error) console.error(error);
    else console.log("Sucessful");
})


module.exports = connection;