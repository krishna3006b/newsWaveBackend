const { ThirdwebStorage } = require("@thirdweb-dev/storage");

const storage = new ThirdwebStorage({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

async function getGatewayUrl(cid) {
  try {
    const url = await storage.resolveScheme(cid);
    return url;
  } catch (error) {
    console.error("Error resolving gateway URL:", error);
    throw new Error("Failed to resolve gateway URL");
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
    const url = await getGatewayUrl(cid);
    res.json({ url });
  } catch (error) {
    console.error('Gateway error:', error);
    res.status(500).json({ error: "Failed to resolve gateway URL" });
  }
};
