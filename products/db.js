const Pool = require('pg').Pool;
require('dotenv').config();

const PASSWORD = process.env.DATABASE_PASSWORD;
const PORT = process.env.DATABASE_PORT;

const pool = new Pool({
    user: "postgres",
    password: PASSWORD,
    database: "shipshop_db",
    host: "localhost",
    post: PORT
});

module.exports = pool;
