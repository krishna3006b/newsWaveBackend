# NewsWave Backend

A serverless IPFS storage API built for Vercel deployment.

## Features

- Upload news data to IPFS via Thirdweb Storage
- Fetch data from IPFS using CID
- Resolve gateway URLs for IPFS content
- Serverless architecture optimized for Vercel

## API Endpoints

### POST /api/ipfs/upload
Upload news data to IPFS.

**Request Body:**
```json
{
  "title": "News Title",
  "content": "News content...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "uri": "ipfs://Qm..."
}
```

### GET /api/ipfs/fetch/:cid
Fetch data from IPFS using CID.

**Response:**
```json
{
  "title": "News Title",
  "content": "News content...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### GET /api/ipfs/gateway/:cid
Get gateway URL for IPFS content.

**Response:**
```json
{
  "url": "https://gateway.url/ipfs/Qm..."
}
```

## Environment Variables

### Local Development
Create a `.env` file in your project root:
```
THIRDWEB_SECRET_KEY=your_secret_key_here
```

### Vercel Deployment
Set environment variables in your Vercel project dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `THIRDWEB_SECRET_KEY`
   - **Value**: Your Thirdweb secret key
   - **Environment**: Select all environments (Production, Preview, Development)
4. Click **Save**
5. Redeploy your project

**Important**: Never commit your `.env` file to version control. The `.gitignore` file already excludes it.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Thirdweb secret key:
   ```
   THIRDWEB_SECRET_KEY=your_secret_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   npm run deploy
   ```

3. Set environment variables in your Vercel dashboard (see Environment Variables section above)

## Project Structure

```
├── api/
│   └── ipfs/
│       ├── upload.js      # Upload endpoint
│       ├── fetch.js       # Fetch endpoint
│       └── gateway.js     # Gateway endpoint
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Notes

- The original `ipfs.js` file has been converted to individual serverless functions
- Each endpoint is now a separate file in the `api/ipfs/` directory
- CORS is enabled for all endpoints
- The API is optimized for serverless execution on Vercel
- Environment variables are set directly in Vercel dashboard, not in vercel.json
