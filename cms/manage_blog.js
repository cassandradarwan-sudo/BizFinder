const fs = require('fs');

async function manageBlog() {
  const token = '4d59ea21f2e8a79c3d8c20ecb60b30c9cb9f30efc8cec0f8d42ecfaeb138d75a7e10ba4b170e1a8a2b14725f7d7b93525c9b88e90c699fc3f76d6988aa7bff1c64d90106a0588e2dc9a957044c9d96617c42beabbff5db7eccf628ba9f4b39a088c7408607ef0ff47474c9877bba3c4dac8f8c634b72ce80386dae42248c78a5';
  const baseUrl = 'http://38.247.189.143:1337/api/articles';
  
  // 1. Prepare Payload
  const payload = {
    data: {
      title: "Antigravity Live Publication",
      slug: `antigravity-live-${Date.now()}`,
      content: "This blog post was created and PUBLISHED via Antigravity using the project's custom publishing logic (publishStatus field).",
      targetKeyword: "antigravity strapi live",
      blufSummary: "Demonstrating end-to-end automated publishing on the live project infrastructure.",
      publishStatus: "draft" // Start as draft
    }
  };

  console.log('--- 🚀 Phase 1: Creating Draft ---');
  
  try {
    // STEP 1: CREATE DRAFT
    const createResp = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const createResult = await createResp.json();

    if (!createResp.ok) {
      console.error('❌ Creation Failed:', JSON.stringify(createResult.error, null, 2));
      process.exit(1);
    }

    const documentId = createResult.data.documentId;
    console.log(`✅ Draft Created! Document ID: ${documentId}`);

    // STEP 2: PUBLISH (Custom logic identified via browser research)
    console.log('--- 🚀 Phase 2: Publishing ---');
    const updateUrl = `${baseUrl}/${documentId}`;
    
    const updateResp = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
          data: {
              publishStatus: "published",
              publishedAt: new Date().toISOString()
          }
      })
    });

    const updateResult = await updateResp.json();

    if (updateResp.ok) {
      console.log('✅ Success! Article is now PUBLICLY PUBLISHED via custom workflow.');
      console.log(`Frontend URL: http://38.247.189.143:3100/articles/${payload.data.slug}`);
    } else {
      console.error('❌ Publication Failed:', JSON.stringify(updateResult.error, null, 2));
      process.exit(1);
    }

  } catch (err) {
    console.error('❌ Unexpected Error:', err.message);
    process.exit(1);
  }
}

manageBlog();
