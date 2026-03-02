require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Export a helper function instead of the whole object
module.exports = {
    query: (text, params) => pool.query(text, params)
};