// Simple test script to verify API endpoints
// Run with: node test-api.js

const testData = {
  title: "Test News Article",
  content: "This is a test news article for testing the IPFS API.",
  timestamp: new Date().toISOString()
};

console.log('Testing NewsWave Backend API');
console.log('============================');
console.log('');

console.log('Test data:');
console.log(JSON.stringify(testData, null, 2));
console.log('');

console.log('API Endpoints:');
console.log('- POST /api/ipfs/upload - Upload news data to IPFS');
console.log('- GET  /api/ipfs/fetch/:cid - Fetch data from IPFS');
console.log('- GET  /api/ipfs/gateway/:cid - Get gateway URL');
console.log('');

console.log('To test locally:');
console.log('1. Run: npm run dev');
console.log('2. Test endpoints with your preferred API client');
console.log('3. Or use curl commands:');
console.log('');

console.log('Upload test:');
console.log('curl -X POST http://localhost:3000/api/ipfs/upload \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'' + JSON.stringify(testData) + '\'');
console.log('');

console.log('Note: Make sure to set THIRDWEB_SECRET_KEY in your .env file');
console.log('or in Vercel environment variables for production.');
