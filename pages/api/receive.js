import storage from '../lib/storage.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const timestamp = new Date().toISOString();

  if (req.method === 'GET') {
    const stats = storage.getStats();
    return res.status(200).json({
      message: "Vercel MCP Receiver is running",
      timestamp,
      endpoints: {
        "POST": "/api/receive - Send a prompt in the request body",
        "GET": "/api/receive - This health check endpoint",
        "GET": "/api/get-latest-prompt - Get the latest received prompt",
        "GET": "/api/prompts - Get all prompts"
      },
      stats
    });
  }

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'Prompt is required',
          timestamp
        });
      }

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

      storage.addPrompt(promptData);

      const response = {
        success: true,
        id: promptData.id,
        originalPrompt: prompt,
        processedResponse: `I received your message: "${prompt}". This prompt has been stored and is ready for UI generation!`,
        timestamp,
        metadata: promptData.metadata,
        storageInfo: storage.getStats()
      };

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

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST'],
    timestamp
  });
}
