import storage from '../lib/storage.js';

export default async function handler(req, res) {
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
}
