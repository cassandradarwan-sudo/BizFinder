const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '.tmp/data.db');
const REMOTE_API = 'http://38.247.189.143:1337/api/articles';
const REMOTE_TOKEN = '4d59ea21f2e8a79c3d8c20ecb60b30c9cb9f30efc8cec0f8d42ecfaeb138d75a7e10ba4b170e1a8a2b14725f7d7b93525c9b88e90c699fc3f76d6988aa7bff1c64d90106a0588e2dc9a957044c9d96617c42beabbff5db7eccf628ba9f4b39a088c7408607ef0ff47474c9877bba3c4dac8f8c634b72ce80386dae42248c78a5';

// Fallback Sample Articles if remote is empty
const sampleArticles = [
  {
    document_id: 'sample_001',
    title: 'Welcome to your Local Blog',
    slug: 'welcome-to-your-local-blog',
    content: JSON.stringify([{ type: 'paragraph', children: [{ text: 'This is a sample article generated locally.' }]}]),
    published_at: new Date().toISOString(),
    locale: 'en'
  }
];

async function fetchFromRemote(pageSize = 25, token = null) {
  let allArticles = [];
  let page = 1;
  let hasMore = true;

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const statuses = ['published', 'draft'];
  
  for (const status of statuses) {
    page = 1;
    hasMore = true;
    while (hasMore) {
      const url = `${REMOTE_API}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&status=${status}&populate=*`;
      
      console.log(`📡 Fetching ${status} articles (page ${page}) from remote...`);
      const response = await fetch(url, { headers });
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        allArticles = [...allArticles, ...result.data];
        const { pageCount } = result.meta.pagination;
        hasMore = page < pageCount;
        page++;
      } else {
        hasMore = false;
      }
    }
  }

  return allArticles;
}

async function startMigration() {
  const remoteToken = REMOTE_TOKEN;
  console.log('--- 🚀 Advanced Article Migration Started ---');

  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Error: Database not found at ${DB_PATH}. Run Strapi once to initialize it.`);
    process.exit(1);
  }

  const db = new Database(DB_PATH);

  try {
    let sourceData = [];

    // 1. Try to fetch from remote
    try {
      sourceData = await fetchFromRemote(25, remoteToken);
      if (sourceData.length === 0) {
        console.warn('⚠️ Remote API returned no published articles. Using local samples...');
        sourceData = sampleArticles;
      } else {
        console.log(`✅ Successfully fetched ${sourceData.length} articles from remote!`);
      }
    } catch (apiErr) {
      console.warn(`⚠️ Connection to remote failed: ${apiErr.message}`);
      console.log('Falling back to local samples...');
      sourceData = sampleArticles;
    }

    // 2. Map and Insert
    const articlesToInsert = sourceData.map(item => ({
      document_id: item.documentId || `migrate_${item.id}`,
      title: item.title || item.attributes?.title || 'Untitled',
      slug: item.slug || item.attributes?.slug || `untitled-${Date.now()}`,
      content: JSON.stringify(item.content || item.attributes?.content || []),
      published_at: item.publishedAt || item.attributes?.publishedAt || new Date().toISOString(),
      locale: item.locale || item.attributes?.locale || 'en'
    }));

    console.log(`💾 Syncing ${articlesToInsert.length} articles to local database...`);

    const insert = db.prepare(`
      INSERT OR REPLACE INTO articles (document_id, title, slug, content, published_at, locale, created_at, updated_at)
      VALUES (@document_id, @title, @slug, @content, @published_at, @locale, DATETIME('now'), DATETIME('now'))
    `);

    const syncTransaction = db.transaction((articles) => {
      for (const art of articles) insert.run(art);
    });

    syncTransaction(articlesToInsert);
    console.log('🏁 Migration completed successfully!');

  } catch (err) {
    console.error('❌ Migration Error:', err.message);
  } finally {
    db.close();
  }
}

startMigration();
