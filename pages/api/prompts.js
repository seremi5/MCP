// pages/api/prompts.js - Get all prompts with statistics and filtering

// Shared storage (same as in receive.js)
// In production, this would be a database
let promptStorage = [];

// This should ideally import from a shared storage file, but for simplicity:
// We'll sync this with receive.js through a simple approach

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
    try {
      // Query parameters for filtering/pagination
      const { 
        limit = 10, 
        offset = 0, 
        processed,
        search 
      } = req.query;

      let filteredPrompts = [...promptStorage];

      // Filter by processed status
      if (processed !== undefined) {
        const isProcessed = processed === 'true';
        filteredPrompts = filteredPrompts.filter(p => p.processed === isProcessed);
      }

      // Search in prompt text
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredPrompts = filteredPrompts.filter(p => 
          p.prompt.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by timestamp (newest first)
      filteredPrompts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Pagination
      const startIndex = parseInt(offset);
      const endIndex = startIndex + parseInt(limit);
      const paginatedPrompts = filteredPrompts.slice(startIndex, endIndex);

      // Calculate statistics
      const stats = {
        total: promptStorage.length,
        processed: promptStorage.filter(p => p.processed).length,
        unprocessed: promptStorage.filter(p => !p.processed).length,
        filtered: filteredPrompts.length,
        returned: paginatedPrompts.length,
        hasMore: endIndex < filteredPrompts.length,
        categories: getPromptCategories(promptStorage)
      };

      return res.status(200).json({
        success: true,
        prompts: paginatedPrompts,
        stats,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: filteredPrompts.length,
          hasNext: endIndex < filteredPrompts.length,
          hasPrev: startIndex > 0
        },
        timestamp
      });

    } catch (error) {
      console.error('Error fetching prompts:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch prompts',
        message: error.message,
        timestamp
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { action, promptId } = req.body;

      if (action === 'mark_processed' && promptId) {
        const prompt = promptStorage.find(p => p.id === promptId);
        if (prompt) {
          prompt.processed = true;
          prompt.processedAt = timestamp;
          
          return res.status(200).json({
            success: true,
            message: 'Prompt marked as processed',
            prompt,
            timestamp
          });
        } else {
          return res.status(404).json({
            success: false,
            error: 'Prompt not found',
            timestamp
          });
        }
      }

      if (action === 'clear_all') {
        const clearedCount = promptStorage.length;
        promptStorage = [];
        
        return res.status(200).json({
          success: true,
          message: `Cleared ${clearedCount} prompts`,
          clearedCount,
          timestamp
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid action',
        validActions: ['mark_processed', 'clear_all'],
        timestamp
      });

    } catch (error) {
      console.error('Error processing prompt action:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process action',
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
function getPromptCategories(prompts) {
  const categories = {};
  
  prompts.forEach(prompt => {
    const lowerPrompt = prompt.prompt.toLowerCase();
    let category = 'other';
    
    if (lowerPrompt.includes('vendor') || lowerPrompt.includes('invoice')) {
      category = 'vendor_insights';
    } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
      category = 'dashboard';
    } else if (lowerPrompt.includes('form') || lowerPrompt.includes('input')) {
      category = 'forms';
    } else if (lowerPrompt.includes('table') || lowerPrompt.includes('data')) {
      category = 'data_tables';
    } else if (lowerPrompt.includes('finance') || lowerPrompt.includes('payment')) {
      category = 'finance';
    }
    
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return categories;
}

// Export function to add prompt (called from receive.js)
export function addPromptToStorage(promptData) {
  promptStorage.push(promptData);
  
  // Keep only last 100 prompts to prevent memory issues
  if (promptStorage.length > 100) {
    promptStorage = promptStorage.slice(-100);
  }
  
  return promptData;
}

// Export function to get latest prompt (called from get-latest-prompt.js)
export function getLatestPrompt() {
  return promptStorage.length > 0 ? promptStorage[promptStorage.length - 1] : null;
}
