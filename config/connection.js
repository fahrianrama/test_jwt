const mysql = require('mysql')
const config = require('./main')
const connection = mysql.createConnection({
    host: config.database_host,
    port: config.database_port,
    user: config.database_user,
    password: config.database_password,
    database: config.database_name
})

module.exports = connection