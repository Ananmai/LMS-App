const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'password', 'admin', '1234', '12345678', 'admin@123', 'rootroot', 'mysql', 'Admin@123', 'root@123'];

async function testConnection() {
    for (const password of passwords) {
        console.log(`Testing password: "${password}"...`);
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: password,
                connectTimeout: 2000
            });
            console.log(`SUCCESS! Password is: "${password}"`);
            await connection.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed: ${err.message}`);
        }
    }
    console.log('Final result: All password attempts failed.');
    process.exit(1);
}

testConnection();
