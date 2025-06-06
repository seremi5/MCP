// api/receive.js

export default async function handler(req, res) {
  // Set CORS headers to allow requests from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Log the incoming request for debugging
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  if (req.method === 'POST') {
    try {
      // Extract the prompt from the request body
      const { prompt } = req.body;
      
      if (!prompt) {
        console.log('No prompt received in request body');
        return res.status(400).json({ 
          error: 'No prompt provided',
          received: req.body 
        });
      }

      console.log('Processing prompt:', prompt);

      // Here you can add your actual processing logic
      // For now, let's just echo back the prompt with some processing
      const response = {
        success: true,
        originalPrompt: prompt,
        processedResponse: `I received your message: "${prompt}". This is a response from your Vercel function!`,
        timestamp: new Date().toISOString(),
        metadata: {
          method: req.method,
          userAgent: req.headers['user-agent'] || 'Unknown',
          contentType: req.headers['content-type'] || 'Unknown'
        }
      };

      console.log('Sending response:', response);
      
      res.status(200).json(response);

    } catch (error) {
      console.error('Error processing request:', error);
      
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }

  } else if (req.method === 'GET') {
    // Handle GET requests - maybe for health checks
    res.status(200).json({
      message: 'Vercel MCP Receiver is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        POST: '/api/receive - Send a prompt in the request body',
        GET: '/api/receive - This health check endpoint'
      }
    });

  } else {
    // Method not allowed
    res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST'],
      receivedMethod: req.method
    });
  }
}
