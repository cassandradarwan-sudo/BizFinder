const { Client } = require('pg');

const client = new Client({
  host: '38.247.189.143',
  port: 5432,
  database: 'strapi_db',
  user: 'strapi_user',
  password: '', // Empty as per .env
});

async function findUsers() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, email, username FROM admin_users');
    console.log('Admin Users Found:');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    await client.end();
  }
}

findUsers();
