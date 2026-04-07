const fs = require('fs');

async function updatePost() {
  const token = '4d59ea21f2e8a79c3d8c20ecb60b30c9cb9f30efc8cec0f8d42ecfaeb138d75a7e10ba4b170e1a8a2b14725f7d7b93525c9b88e90c699fc3f76d6988aa7bff1c64d90106a0588e2dc9a957044c9d96617c42beabbff5db7eccf628ba9f4b39a088c7408607ef0ff47474c9877bba3c4dac8f8c634b72ce80386dae42248c78a5';
  
  // Read the Document ID from previous step
  let documentId;
  try {
    documentId = fs.readFileSync('document_id.txt', 'utf8').trim();
  } catch (err) {
    console.error('❌ Could not find document_id.txt');
    process.exit(1);
  }

  const url = `http://38.247.189.143:1337/api/articles/${documentId}`;
  
  const payload = {
    data: {
      content: "This is a sample blog post created by Antigravity. UPDATE: I have now successfully updated this post via the API!",
      publishedAt: new Date().toISOString() // Let's publish it too
    }
  };

  console.log(`--- 🚀 Updating Post Document ID: ${documentId} ---`);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Success! Article updated and published.');
    } else {
      console.error('❌ Failed:', JSON.stringify(result.error, null, 2));
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

updatePost();
