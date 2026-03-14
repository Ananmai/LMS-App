import mysql from 'mysql2/promise';
import { ENV } from './env';

// Determine if we need SSL (Required for Aiven, Railway, etc in Production)
const useSSL = process.env.NODE_ENV === 'production' || !!ENV.DATABASE_URL;

let poolOptions: mysql.PoolOptions = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

if (ENV.DATABASE_URL) {
    // Handle cloud DATABASE_URL (Aiven, Railway, etc.)
    try {
        const url = new URL(ENV.DATABASE_URL);
        poolOptions = {
            ...poolOptions,
            host: url.hostname,
            port: parseInt(url.port || '3306', 10),
            user: url.username,
            password: url.password,
            database: url.pathname.slice(1), // Remove leading slash
            ssl: {
                rejectUnauthorized: false // Often required for cloud DBs unless providing custom CA
            }
        };
    } catch (e) {
        console.error("Failed to parse DATABASE_URL:", e);
    }
} else {
    // Handle local setup
    poolOptions = {
        ...poolOptions,
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        user: ENV.DB_USER,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_NAME,
        ssl: useSSL ? { rejectUnauthorized: false } : undefined
    };
}

const pool = mysql.createPool(poolOptions);

// Test the connection immediately so we know if it fails in server logs
pool.getConnection()
    .then((conn) => {
        console.log("DATABASE_CONNECTED: Successfully established connection to MySQL");
        conn.release();
    })
    .catch((err) => {
        console.error("DATABASE_CONNECTION_ERROR:", {
            message: err.message,
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState
        });
    });

export default pool;
