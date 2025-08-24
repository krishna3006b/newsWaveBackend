const { ThirdwebStorage } = require("@thirdweb-dev/storage");

const storage = new ThirdwebStorage({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

async function getFromIPFS(cid) {
  try {
    const data = await storage.downloadJSON(cid);
    return data;
  } catch (error) {
    console.error("Error fetching from IPFS via Thirdweb:", error);
    throw new Error("Failed to fetch from IPFS");
  }
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
  
  if (!cid) {
    return res.status(400).json({ error: 'No CID provided' });
  }

  try {
    const data = await getFromIPFS(cid);
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: "Failed to fetch from IPFS" });
  }
};
