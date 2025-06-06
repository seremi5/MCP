export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;
    
    console.log('Received prompt:', prompt);
    
    // Your logic here
    const response = {
      message: `Processed: ${prompt}`,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
