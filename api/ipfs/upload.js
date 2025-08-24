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

async function uploadToIPFS(newsData) {
  try {
    console.log("Attempting to upload data to IPFS:", JSON.stringify(newsData, null, 2));
    
    if (!storage) {
      throw new Error("ThirdwebStorage not initialized - check THIRDWEB_SECRET_KEY");
    }
    
    const uri = await storage.upload(JSON.stringify(newsData));
    console.log("Successfully uploaded to IPFS, URI:", uri);
    return uri;
  } catch (error) {
    console.error("Error uploading to IPFS via Thirdweb:", error);
    
    // Provide more specific error messages
    if (error.message.includes("secret")) {
      throw new Error("Authentication failed - check THIRDWEB_SECRET_KEY");
    } else if (error.message.includes("network")) {
      throw new Error("Network error - check internet connection");
    } else if (error.message.includes("timeout")) {
      throw new Error("Upload timeout - try again");
    } else {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("Upload request received");
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);

  const newsData = req.body;
  
  if (!newsData) {
    console.error('No data provided in request body');
    return res.status(400).json({ 
      error: 'No data provided',
      details: 'Please provide news data in the request body'
    });
  }

  // Validate required fields
  if (!newsData.title && !newsData.content) {
    console.error('Invalid data format - missing title or content');
    return res.status(400).json({ 
      error: 'Invalid data format',
      details: 'News data must contain at least a title or content field'
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
    const uri = await uploadToIPFS(newsData);
    console.log("Upload successful, returning URI:", uri);
    res.json({ 
      uri,
      message: "Successfully uploaded to IPFS",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message || "Failed to upload to IPFS",
      details: "Check the server logs for more information",
      timestamp: new Date().toISOString()
    });
  }
};
