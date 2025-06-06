// pages/api/generate-with-v0.js - Use Vercel's v0.dev to generate actual UI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    // Call Vercel's v0.dev API to generate actual React components
    const v0Response = await fetch('https://v0.dev/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.V0_API_KEY}`, // You'd need this
      },
      body: JSON.stringify({
        prompt: prompt,
        framework: 'react',
        styling: 'tailwind',
        type: 'component'
      })
    });

    if (!v0Response.ok) {
      throw new Error('v0.dev API call failed');
    }

    const generatedCode = await v0Response.json();

    return res.status(200).json({
      success: true,
      generatedCode: generatedCode.code,
      componentName: generatedCode.componentName,
      preview: generatedCode.preview,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling v0.dev API:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate with v0.dev',
      message: error.message
    });
  }
}

// Note: This would require:
// 1. v0.dev API access (currently in beta)
// 2. API key from Vercel
// 3. Different integration approach
