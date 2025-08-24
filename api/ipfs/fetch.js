const { ThirdwebStorage } = require("@thirdweb-dev/storage");

// Initialize storage with error handling
let storage;
try {
  storage = new ThirdwebStorage({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
} catch (error) {
  console.error("Failed to initialize ThirdwebStorage:", error);
}

async function getFromIPFS(cid) {
  try {
    console.log(`Attempting to fetch data from IPFS with CID: ${cid}`);
    
    if (!storage) {
      throw new Error("ThirdwebStorage not initialized - check THIRDWEB_SECRET_KEY");
    }
    
    const data = await storage.downloadJSON(cid);
    console.log(`Successfully fetched data from IPFS for CID: ${cid}`);
    return data;
  } catch (error) {
    console.error(`Error fetching from IPFS via Thirdweb for CID ${cid}:`, error);
    
    // Provide more specific error messages
    if (error.message.includes("not found")) {
      throw new Error(`IPFS content not found for CID: ${cid}`);
    } else if (error.message.includes("invalid")) {
      throw new Error(`Invalid CID format: ${cid}`);
    } else if (error.message.includes("timeout")) {
      throw new Error(`IPFS fetch timeout for CID: ${cid}`);
    } else {
      throw new Error(`IPFS fetch failed: ${error.message}`);
    }
  }
}

// Helper function to validate CID format
function isValidCID(cid) {
  // Basic CID validation - IPFS CIDs typically start with Qm, bafy, etc.
  const cidPattern = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{55}|bafk[a-z2-7]{55}|baf[a-z2-7]{55})$/;
  return cidPattern.test(cid);
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract CID from the URL path
  const cid = req.url.split('/').pop();
  
  console.log(`Fetch request received for CID: ${cid}`);
  console.log(`Full URL: ${req.url}`);
  console.log(`Request headers:`, req.headers);
  
  if (!cid) {
    console.error('No CID provided in request');
    return res.status(400).json({ 
      error: 'No CID provided',
      details: 'Please provide a valid IPFS CID in the URL path'
    });
  }

  // Validate CID format
  if (!isValidCID(cid)) {
    console.error(`Invalid CID format: ${cid}`);
    return res.status(400).json({ 
      error: 'Invalid CID format',
      details: `The provided CID "${cid}" does not appear to be a valid IPFS CID`,
      expectedFormat: 'CIDs should start with Qm, bafy, bafk, or baf followed by alphanumeric characters'
    });
  }

  // Check if environment variable is set
  if (!process.env.THIRDWEB_SECRET_KEY) {
    console.error('THIRDWEB_SECRET_KEY environment variable is not set');
    return res.status(500).json({ 
      error: 'Configuration error',
      details: 'THIRDWEB_SECRET_KEY environment variable is not configured'
    });
  }

  try {
    const data = await getFromIPFS(cid);
    console.log(`Successfully returning data for CID: ${cid}`);
    res.json(data);
  } catch (error) {
    console.error(`Fetch error for CID ${cid}:`, error);
    
    // Return more detailed error information
    res.status(500).json({ 
      error: error.message || "Failed to fetch from IPFS",
      cid: cid,
      timestamp: new Date().toISOString()
    });
  }
};
