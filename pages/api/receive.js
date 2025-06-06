// pages/api/receive.js - Enhanced with shared storage
import { addPromptToStorage } from './prompts.js';

// Simple shared storage reference
let sharedPromptStorage = [];

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
    // Health check and status
    const stats = {
      totalPrompts: sharedPromptStorage.length,
      latestPrompt: sharedPromptStorage.length > 0 ? 
        sharedPromptStorage[sharedPromptStorage.length - 1].timestamp : null
    };

    return res.status(200).json({
      message: "Vercel MCP Receiver is running",
      timestamp,
      endpoints: {
        "POST": "/api/receive - Send a prompt in the request body",
        "GET": "/api/receive - This health check endpoint",
        "GET": "/api/get-latest-prompt - Get the latest received prompt",
        "GET": "/api/prompts - Get all prompts with filtering and stats"
      },
      stats
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
          ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
          promptLength: prompt.length,
          wordCount: prompt.split(' ').length
        }
      };

      // Add to shared storage
      sharedPromptStorage.push(promptData);
      
      // Keep only last 100 prompts
      if (sharedPromptStorage.length > 100) {
        sharedPromptStorage = sharedPromptStorage.slice(-100);
      }

      // Also add to prompts.js storage (if the import works)
      try {
        addPromptToStorage(promptData);
      } catch (error) {
        console.log('Could not sync with prompts.js storage:', error);
      }

      const response = {
        success: true,
        id: promptData.id,
        originalPrompt: prompt,
        processedResponse: `I received your message: "${prompt}". This prompt has been stored and is ready for UI generation!`,
        timestamp,
        metadata: promptData.metadata,
        storageInfo: {
          totalStored: sharedPromptStorage.length,
          promptId: promptData.id,
          category: categorizePrompt(prompt)
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

// Helper function to categorize prompts
function categorizePrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('vendor') || lowerPrompt.includes('invoice')) {
    return 'vendor_insights';
  } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
    return 'dashboard';
  } else if (lowerPrompt.includes('form') || lowerPrompt.includes('input')) {
    return 'forms';
  } else if (lowerPrompt.includes('table') || lowerPrompt.includes('data')) {
    return 'data_tables';
  } else if (lowerPrompt.includes('finance') || lowerPrompt.includes('payment')) {
    return 'finance';
  }
  
  return 'other';
}

// Export storage for other files to access
export { sharedPromptStorage };
