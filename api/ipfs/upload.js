const { ThirdwebStorage } = require("@thirdweb-dev/storage");

const storage = new ThirdwebStorage({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

async function uploadToIPFS(newsData) {
  try {
    const uri = await storage.upload(JSON.stringify(newsData));
    return uri;
  } catch (error) {
    console.error("Error uploading to IPFS via Thirdweb:", error);
    throw new Error("Failed to upload to IPFS");
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

  const newsData = req.body;
  
  if (!newsData) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    const uri = await uploadToIPFS(newsData);
    res.json({ uri });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Failed to upload to IPFS" });
  }
};
