// api/get-latest-prompt.js - Endpoint to fetch the latest prompt
// This needs to share storage with receive.js - in production use a database

// Simple shared storage solution for demo
let sharedStorage = null;

// Import or reference the same storage from receive.js
// In production, this would be a database query
function getLatestPrompt() {
  // This is a workaround - in production you'd query your database
  return sharedStorage;
}

function setSharedPrompt(promptData) {
  sharedStorage = promptData;
}

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // In a real app, you'd query your database here
      // For now, we'll return a mock response that works with the frontend
      
      const latestPrompt = getLatestPrompt();
      
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
        processed: latestPrompt.processed || false
      });

    } catch (error) {
      console.error('Error fetching latest prompt:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch latest prompt',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
    allowedMethods: ['GET'],
    timestamp: new Date().toISOString()
  });
}

// Export function to update shared storage (called from receive.js)
export { setSharedPrompt };
