const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '.tmp/data.db');
const REMOTE_API = 'http://38.247.189.143:1337/api/articles';
const REMOTE_TOKEN = '4d59ea21f2e8a79c3d8c20ecb60b30c9cb9f30efc8cec0f8d42ecfaeb138d75a7e10ba4b170e1a8a2b14725f7d7b93525c9b88e90c699fc3f76d6988aa7bff1c64d90106a0588e2dc9a957044c9d96617c42beabbff5db7eccf628ba9f4b39a088c7408607ef0ff47474c9877bba3c4dac8f8c634b72ce80386dae42248c78a5';

async function syncToRemote() {
  console.log('--- 🚀 Syncing Local Articles to Remote Server ---');

  const db = new Database(DB_PATH);

  try {
    // 1. Read local articles
    const localArticles = db.prepare('SELECT * FROM articles').all();
    console.log(`Found ${localArticles.length} articles locally.`);

    if (localArticles.length === 0) {
      console.warn('⚠️ No local articles found to sync.');
      return;
    }

    // 2. Push to remote
    for (const article of localArticles) {
      console.log(`📤 Pushing article: "${article.title}"...`);

      // Robust JSON Parsing
      let contentObj;
      try {
        contentObj = JSON.parse(article.content);
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (parseErr) {
        console.error(`⚠️ Could not parse content for "${article.title}". Using empty content.`);
        contentObj = [];
      }

      const payload = {
        data: {
          title: article.title,
          slug: article.slug,
          content: article.title + "\n\n" + (Array.isArray(contentObj) ? contentObj.map(node => node.children?.map(c => c.text).join('')).join('\n\n') : String(contentObj)),
          publishedAt: new Date().toISOString(),
          targetKeyword: article.title.toLowerCase(),
          blufSummary: "Summary for " + article.title
        }
      };

      try {
        const response = await fetch(REMOTE_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${REMOTE_TOKEN}`
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          console.log(`✅ Success: Article "${article.title}" is now LIVE!`);
        } else {
          console.error(`❌ Failed to push "${article.title}":`, JSON.stringify(result.error, null, 2));
        }
      } catch (postErr) {
        console.error(`❌ Network error for "${article.title}":`, postErr.message);
      }
    }

    console.log('--- 🏁 Sync Finished ---');

  } catch (err) {
    console.error('❌ Sync Error:', err.message);
  } finally {
    db.close();
  }
}

syncToRemote();
