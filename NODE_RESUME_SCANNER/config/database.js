const { createPool } = require('mysql');
console.log(process.env.DB_PORT)
const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD, // Corrected typo here
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CON_LIMIT,
})
module.exports = pool;
