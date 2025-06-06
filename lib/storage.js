// lib/storage.js - Centralized storage for prompts
class PromptStorage {
  constructor() {
    this.prompts = [];
    this.latestPrompt = null;
  }

  addPrompt(promptData) {
    this.prompts.push(promptData);
    this.latestPrompt = promptData;
    
    // Keep only last 100 prompts
    if (this.prompts.length > 100) {
      this.prompts = this.prompts.slice(-100);
    }
    
    return promptData;
  }

  getLatestPrompt() {
    return this.latestPrompt;
  }

  getAllPrompts() {
    return this.prompts;
  }

  getPromptById(id) {
    return this.prompts.find(p => p.id === id);
  }

  markAsProcessed(id) {
    const prompt = this.getPromptById(id);
    if (prompt) {
      prompt.processed = true;
      return prompt;
    }
    return null;
  }

  getStats() {
    return {
      total: this.prompts.length,
      processed: this.prompts.filter(p => p.processed).length,
      unprocessed: this.prompts.filter(p => !p.processed).length,
      latest: this.latestPrompt?.timestamp || null
    };
  }
}

// Create singleton instance
const storage = new PromptStorage();

export default storage;

// Updated api/receive.js using centralized storage
export const receiveHandler = async (req, res) => {
  // Add CORS headers
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

      // Create prompt data
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

      // Store the prompt
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
};

// Updated api/get-latest-prompt.js
export const getLatestHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const latestPrompt = storage.getLatestPrompt();
      
      if (!latestPrompt) {
        return res.status(200).json({
          success: true,
          prompt: null,
          message: 'No prompts received yet',
          timestamp: new Date().toISOString()
        });
      }

      return res.status(200).json({
        success: true,
        prompt: latestPrompt.prompt,
        id: latestPrompt.id,
        timestamp: latestPrompt.timestamp,
        processed: latestPrompt.processed
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch latest prompt',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    timestamp: new Date().toISOString()
  });
};

// New api/prompts.js - Get all prompts
export const promptsHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const allPrompts = storage.getAllPrompts();
      const stats = storage.getStats();

      return res.status(200).json({
        success: true,
        prompts: allPrompts,
        stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch prompts',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    timestamp: new Date().toISOString()
  });
};
