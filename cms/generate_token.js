const path = require('path');
const fs = require('fs');

async function run() {
  // We need to load Strapi to access its services
  // This is a minimal version of a Strapi bootstrap script
  try {
    const { createStrapi } = require('@strapi/strapi');
    const app = await createStrapi().load();

    console.log('📡 Generating fresh Full Access Token...');
    
    // Create the token
    const tokenService = app.service('admin::api-token');
    const name = `Sync-Manager-${Date.now()}`;
    
    const token = await tokenService.create({
      name: name,
      description: 'Automatically generated for local development and preview',
      type: 'full-access',
      lifespan: null,
    });

    const rawToken = token.accessKey;
    console.log(`✅ Token Generated: ${rawToken.substring(0, 8)}...`);

    // Update .env.local
    const envPath = path.join(__dirname, 'frontend', '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(
      /NEXT_PUBLIC_STRAPI_API_TOKEN=.*/,
      `NEXT_PUBLIC_STRAPI_API_TOKEN=${rawToken}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated frontend/.env.local with the new token.');

    // Update root .env
    const rootEnvPath = path.join(__dirname, '.env');
    let rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');
    rootEnvContent = rootEnvContent.replace(
      /STRAPI_API_TOKEN=.*/,
      `STRAPI_API_TOKEN=${rawToken}`
    );
    fs.writeFileSync(rootEnvPath, rootEnvContent);
    console.log('✅ Updated root .env with the new token.');

    console.log('🚀 SUCCESS! Please refresh your browser.');
    
    await app.destroy();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
