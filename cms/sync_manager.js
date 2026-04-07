const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '.tmp/data.db');
const REMOTE_API = 'http://38.247.189.143:1337/api/articles';
const REMOTE_TOKEN = '4d59ea21f2e8a79c3d8c20ecb60b30c9cb9f30efc8cec0f8d42ecfaeb138d75a7e10ba4b170e1a8a2b14725f7d7b93525c9b88e90c699fc3f76d6988aa7bff1c64d90106a0588e2dc9a957044c9d96617c42beabbff5db7eccf628ba9f4b39a088c7408607ef0ff47474c9877bba3c4dac8f8c634b72ce80386dae42248c78a5';

async function syncAll() {
  console.log('--- 🚀 BI-DIRECTIONAL SYNC STARTED ---');
  const db = new Database(DB_PATH);

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${REMOTE_TOKEN}`
    };

    // --- PHASE 1: PULL FROM REMOTE ---
    console.log('📡 STEP 1: Pulling latest data from Remote...');
    const pullResp = await fetch(`${REMOTE_API}?status=draft&populate=*`, { headers });
    const pullData = await pullResp.json();

    if (pullData.data && pullData.data.length > 0) {
      console.log(`Found ${pullData.data.length} articles on Remote. Syncing to Local...`);
      const insert = db.prepare(`
        INSERT OR REPLACE INTO articles (document_id, title, slug, content, published_at, locale, created_at, updated_at)
        VALUES (@document_id, @title, @slug, @content, @published_at, @locale, DATETIME('now'), DATETIME('now'))
      `);

      const syncPull = db.transaction((articles) => {
        for (const item of articles) {
          insert.run({
            document_id: item.documentId,
            title: item.title,
            slug: item.slug,
            content: JSON.stringify(item.content),
            published_at: item.publishedAt || new Date().toISOString(),
            locale: item.locale || 'en'
          });
        }
      });
      syncPull(pullData.data);
      console.log('✅ Pull Success.');
    } else {
      console.log('⚠️ Remote was empty.');
    }

    // --- PHASE 2: PUSH LOCAL TO REMOTE ---
    console.log('📤 STEP 2: Pushing any Local changes to Remote...');
    const localArticles = db.prepare('SELECT * FROM articles').all();

    for (const article of localArticles) {
      // Logic: Only push if titled "Sample" or manually specified
      // For now, we push ALL to ensure remote is up-to-date
      const payload = {
        data: {
          title: article.title,
          slug: article.slug,
          content: String(article.content), // Remote accepts string for content
          publishedAt: new Date().toISOString(),
          targetKeyword: article.title.toLowerCase(),
          blufSummary: "Summary for " + article.title
        }
      };

      const pushResp = await fetch(REMOTE_API, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const pushResult = await pushResp.json();
      if (pushResp.ok) {
        console.log(`✅ Pushed "${article.title}" to Remote.`);
      } else if (pushResult.error?.name === 'ValidationError' && pushResult.error?.message?.includes('unique')) {
        console.log(`ℹ️ Article "${article.title}" already exists on Remote.`);
      } else {
        console.warn(`❌ Error pushing "${article.title}":`, pushResult.error?.message);
      }
    }

    console.log('--- 🏁 FULL SYNC FINISHED ---');

  } catch (err) {
    console.error('❌ FATAL SYNC ERROR:', err.message);
  } finally {
    db.close();
  }
}

syncAll();
