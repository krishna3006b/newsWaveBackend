const { ThirdwebStorage } = require("@thirdweb-dev/storage");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

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

async function getFromIPFS(cid) {
  try {
    const data = await storage.downloadJSON(cid);
    return data;
  } catch (error) {
    console.error("Error fetching from IPFS via Thirdweb:", error);
    throw new Error("Failed to fetch from IPFS");
  }
}

async function getGatewayUrl(cid) {
  try {
    const url = await storage.resolveScheme(cid);
    return url;
  } catch (error) {
    console.error("Error resolving gateway URL:", error);
    throw new Error("Failed to resolve gateway URL");
  }
}

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/ipfs/upload", async (req, res) => {
  const newsData = req.body;
  try {
    const uri = await uploadToIPFS(newsData);
    res.json({ uri });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload to IPFS" });
  }
});

app.get("/api/ipfs/fetch/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const data = await getFromIPFS(cid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from IPFS" });
  }
});

app.get("/api/ipfs/gateway/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const url = await getGatewayUrl(cid);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve gateway URL" });
  }
});

app.listen(3001, () => console.log("IPFS API running on port 3001"));

module.exports = { uploadToIPFS, getFromIPFS, getGatewayUrl };