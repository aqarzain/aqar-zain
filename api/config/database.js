const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'real_estate_db',
    user: process.env.DB_USER || 'u0_a373',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.on('connect', () => {
    console.log('✅ متصل بقاعدة البيانات');
});

pool.on('error', (err) => {
    console.error('❌ خطأ في قاعدة البيانات:', err);
    process.exit(-1);
});

const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`📊 استعلام (${duration}ms):`, text.substring(0, 50) + '...');
        return result;
    } catch (error) {
        console.error('❌ خطأ في الاستعلام:', error);
        throw error;
    }
};

const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
