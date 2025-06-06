// pages/api/generate-with-v0.js - Integrate with v0.dev API

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Method 1: Try v0.dev API (if they have a public API)
    // Note: v0.dev doesn't currently have a public API, so this is theoretical
    
    // Method 2: Use OpenAI to generate v0.dev-style components
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a v0.dev-style React component generator. Generate modern, beautiful React components using Tailwind CSS based on user prompts. 
            
Rules:
- Always return ONLY the JSX component code, no explanations
- Use Tailwind CSS for all styling
- Make components modern, beautiful, and interactive
- Include hover effects, animations, and professional design
- Use gradients, shadows, and modern UI patterns
- Components should be responsive and accessible
- Use React hooks (useState, useEffect) when needed
- Return functional components with export default

The component should look like it came from v0.dev - professional, modern, and visually stunning.`
          },
          {
            role: 'user',
            content: `Generate a React component for: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API call failed');
    }

    const openaiData = await openaiResponse.json();
    const generatedCode = openaiData.choices[0].message.content;

    return res.status(200).json({
      success: true,
      code: generatedCode,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      generator: 'openai-v0-style'
    });

  } catch (error) {
    console.error('Error generating component:', error);
    
    // Fallback: Generate a v0.dev-style component template
    const fallbackCode = generateV0StyleFallback(prompt);
    
    return res.status(200).json({
      success: true,
      code: fallbackCode,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      generator: 'fallback-v0-style'
    });
  }
}

// Fallback generator that creates v0.dev-style components
function generateV0StyleFallback(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('vendor') || lowerPrompt.includes('dashboard')) {
    return `import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, TrendingUp, DollarSign, Users } from 'lucide-react'

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const riskMetrics = [
    { level: 'Low Risk', count: 23, color: 'bg-green-500', change: '+2' },
    { level: 'Medium Risk', count: 8, color: 'bg-yellow-500', change: '0' },
    { level: 'High Risk', count: 3, color: 'bg-red-500', change: '+1' }
  ]

  const anomalies = [
    { vendor: 'Acme Corp', issue: 'Price 22% higher than previous invoices', severity: 'high', time: '2h ago' },
    { vendor: 'TechSupply Co.', issue: 'Invoice expected May 5, not received', severity: 'medium', time: '1d ago' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Vendor Insights
            </h1>
            <p className="text-slate-600 mt-2">Intelligent vendor risk assessment & optimization</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {riskMetrics.map((metric, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${metric.color}\`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-slate-500">{metric.change}</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{metric.count}</div>
                <div className="text-slate-600 font-medium">{metric.level}</div>
              </CardContent>
            </Card>
          ))}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">$47,250</div>
              <div className="text-slate-600 font-medium">Monthly Spend</div>
              <div className="text-green-600 text-sm mt-1">↓ -3.2% vs last month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Recent Anomalies
                <Badge variant="destructive" className="ml-auto">3 New</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg hover:bg-red-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-red-900">{anomaly.vendor}</h4>
                      <p className="text-sm text-slate-600">{anomaly.issue}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500">{anomaly.time}</span>
                      <Button size="sm" variant="outline" className="ml-2 mt-1">
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Payment Opportunities
                <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">$248 Available</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">You saved $620 this month! 🎉</div>
                  <div className="text-green-600 text-sm">15% better than last month</div>
                </div>
              </div>
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-green-900">Office Supplies Co.</h4>
                    <p className="text-sm text-slate-600">2% early payment discount</p>
                    <p className="text-xs text-slate-500">Save: $48 by May 10</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Recommended Actions</CardTitle>
            <CardDescription>AI-powered suggestions for optimal vendor management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Review High-Risk Vendors', desc: '3 vendors need attention', color: 'bg-blue-600' },
                { title: 'Process Early Payments', desc: 'Save $248 this week', color: 'bg-green-600' },
                { title: 'Contact Overdue Vendors', desc: '2 invoices missing', color: 'bg-orange-600' }
              ].map((action, index) => (
                <Button 
                  key={index} 
                  className={\`\${action.color} hover:opacity-90 text-white p-6 h-auto flex-col items-start text-left transition-all hover:scale-105\`}
                >
                  <div className="font-semibold mb-1">{action.title}</div>
                  <div className="text-sm opacity-90">{action.desc}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
  }
  
  // Generic component for other prompts
  return `import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GeneratedComponent() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="hover:shadow-xl transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generated Component
            </CardTitle>
            <CardDescription className="text-lg">
              Built from your prompt: "${prompt}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Feature 1</h3>
                <p className="text-blue-700">Interactive component with modern styling</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Feature 2</h3>
                <p className="text-purple-700">Responsive design with smooth animations</p>
              </div>
            </div>
            <div className="text-center">
              <Button 
                onClick={() => setIsActive(!isActive)}
                className={\`transition-all duration-300 \${isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}\`}
              >
                {isActive ? 'Active! ✨' : 'Click to Activate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
}
