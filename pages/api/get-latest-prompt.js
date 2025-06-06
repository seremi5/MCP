// pages/api/get-latest-prompt.js - Get the latest received prompt
import { sharedPromptStorage } from './receive.js';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Get the latest prompt from shared storage
      const latestPrompt = sharedPromptStorage.length > 0 ? 
        sharedPromptStorage[sharedPromptStorage.length - 1] : null;
      
      if (!latestPrompt) {
        return res.status(200).json({
          success: true,
          prompt: null,
          message: 'No prompts received yet',
          timestamp: new Date().toISOString(),
          stats: {
            totalPrompts: 0,
            lastReceived: null
          }
        });
      }

      return res.status(200).json({
        success: true,
        prompt: latestPrompt.prompt,
        id: latestPrompt.id,
        timestamp: latestPrompt.timestamp,
        processed: latestPrompt.processed,
        metadata: latestPrompt.metadata,
        stats: {
          totalPrompts: sharedPromptStorage.length,
          lastReceived: latestPrompt.timestamp
        }
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
