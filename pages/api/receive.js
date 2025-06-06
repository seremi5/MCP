// api/receive.js - Enhanced version to store prompts
let promptStorage = []; // In-memory storage (for production, use a database)
let latestPrompt = null;

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const timestamp = new Date().toISOString();

  if (req.method === 'GET') {
    // Health check and status endpoint
    return res.status(200).json({
      message: "Vercel MCP Receiver is running",
      timestamp,
      endpoints: {
        "POST": "/api/receive - Send a prompt in the request body",
        "GET": "/api/receive - This health check endpoint"
      },
      stats: {
        totalPrompts: promptStorage.length,
        latestPrompt: latestPrompt?.timestamp || null
      }
    });
  }

  if (req.method === 'POST') {
    try {
      console.log('Request method:', req.method);
      console.log('Request headers:', req.headers);
      console.log('Request body:', req.body);

      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'Prompt is required',
          timestamp
        });
      }

      console.log('Processing prompt:', prompt);

      // Store the prompt with metadata
      const promptData = {
        id: Date.now(),
        prompt,
        timestamp,
        processed: false,
        metadata: {
          method: req.method,
          userAgent: req.headers['user-agent'],
          contentType: req.headers['content-type'],
          ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
        }
      };

      // Add to storage
      promptStorage.push(promptData);
      latestPrompt = promptData;

      // Keep only last 100 prompts to prevent memory issues
      if (promptStorage.length > 100) {
        promptStorage = promptStorage.slice(-100);
      }

      const response = {
        success: true,
        id: promptData.id,
        originalPrompt: prompt,
        processedResponse: `I received your message: "${prompt}". This prompt has been stored and is ready for UI generation!`,
        timestamp,
        metadata: promptData.metadata,
        storageInfo: {
          totalStored: promptStorage.length,
          promptId: promptData.id
        }
      };

      console.log('Sending response:', response);
      return res.status(200).json(response);

    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST'],
    timestamp
  });
}
