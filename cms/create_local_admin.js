const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '.tmp/data.db');

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node create_local_admin.js <email> <password>');
    process.exit(1);
  }

  const db = new Database(DB_PATH);

  try {
    console.log(`--- Pre-registering local admin: ${email} ---`);

    // 1. Hash the password (Strapi uses bcrypt)
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // 2. Insert into admin_users table
    const insertUser = db.prepare(`
      INSERT INTO admin_users (email, password, firstname, lastname, username, registration_token, is_active, blocked, prefered_language, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NULL, 1, 0, 'en', DATETIME('now'), DATETIME('now'))
    `);

    const userResult = insertUser.run(email, passwordHash, 'Admin', 'User', email.split('@')[0]);
    const userId = userResult.lastInsertRowid;

    // 3. Link to Super Admin Role (ID 1)
    const insertRoleLink = db.prepare(`
      INSERT INTO admin_users_roles_lnk (user_id, role_id)
      VALUES (?, ?)
    `);

    insertRoleLink.run(userId, 1);

    console.log('✅ Local Admin created successfully!');
    console.log('You can now log in at http://localhost:1337/admin using these credentials.');

  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.error('❌ Error: This email is already registered locally.');
    } else {
      console.error('❌ Error creating admin:', err.message);
    }
  } finally {
    db.close();
  }
}

createAdmin();
