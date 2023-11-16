const sql = require('mysql2');

const connection = sql.createConnection({
    user: 'root',
    password: 'rootroot',
    host: '127.0.0.1',
    database: 'ProjectManagment'
})

connection.connect((error) => {
    if (error) console.error(error);
    else console.log("Sucessful");
})


module.exports = connection;