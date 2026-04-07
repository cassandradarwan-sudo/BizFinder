const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  // 1. Find the 'Public' role ID
  const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  if (!publicRole) {
    console.error('❌ Could not find Public role.');
    process.exit(1);
  }

  const actions = ['api::article.article.find', 'api::article.article.findOne'];

  for (const action of actions) {
    // 2. Create the permission if it doesn't exist
    const insertPerm = db.prepare("INSERT OR IGNORE INTO up_permissions (action) VALUES (?)");
    insertPerm.run(action);

    // 3. Get the permission ID
    const perm = db.prepare("SELECT id FROM up_permissions WHERE action = ?").get(action);

    // 4. Link permission to role in v5 bridge table
    const linkAction = db.prepare("INSERT OR IGNORE INTO up_permissions_role_lnk (permission_id, role_id) VALUES (?, ?)");
    linkAction.run(perm.id, publicRole.id);
  }

  console.log('✅ Public permissions granted for Articles (v5 schema).');
} catch (err) {
  console.error('❌ Error fixing permissions:', err.message);
} finally {
  db.close();
}
