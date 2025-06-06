import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, DollarSign, Users, Loader2 } from 'lucide-react';

const DynamicV0ComponentGenerator = () => {
  const [lastPrompt, setLastPrompt] = useState('');
  const [lastPromptId, setLastPromptId] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedComponent, setGeneratedComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);

  // Check for new prompts
  const checkForNewPrompts = async () => {
    try {
      const response = await fetch('/api/get-latest-prompt');
      const data = await response.json();
      
      if (data.success && data.prompt && data.id !== lastPromptId) {
        setLastPrompt(data.prompt);
        setLastPromptId(data.id);
        generateV0Component(data.prompt, data.id);
        setConnectionStatus('connected');
        setError(null);
      } else if (data.success && !data.prompt) {
        setConnectionStatus('waiting');
      }
    } catch (error) {
      console.error('Error checking for prompts:', error);
      setConnectionStatus('error');
      setError(error.message);
    }
  };

  // Generate v0.dev-style component
  const generateV0Component = async (prompt, promptId) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call our v0.dev integration API
      const response = await fetch('/api/generate-with-v0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate component');
      }

      const data = await response.json();
      
      if (data.success) {
        setGeneratedCode(data.code);
        
        // Transform the code into a renderable component
        const component = createDynamicComponent(data.code, prompt);
        setGeneratedComponent(component);
        
        // Add to history
        setHistory(prev => [...prev, {
          prompt,
          promptId,
          timestamp: new Date().toISOString(),
          code: data.code,
          generator: data.generator,
          id: Date.now()
        }]);
      } else {
        throw new Error('Component generation failed');
      }
    } catch (error) {
      console.error('Error generating v0 component:', error);
      setError(`Failed to generate component: ${error.message}`);
      
      // Fallback to a simple component
      const fallbackComponent = createFallbackComponent(prompt);
      setGeneratedComponent(fallbackComponent);
    } finally {
      setIsGenerating(false);
    }
  };

  // Create dynamic component from generated code
  const createDynamicComponent = (code, prompt) => {
    try {
      // This is a simplified version - in a real implementation, you'd need
      // a more sophisticated code transformation and execution system
      
      // For demo purposes, we'll create v0.dev-style components based on the prompt
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('vendor') || lowerPrompt.includes('dashboard')) {
        return <V0VendorDashboard prompt={prompt} />;
      } else if (lowerPrompt.includes('form')) {
        return <V0FormComponent prompt={prompt} />;
      } else if (lowerPrompt.includes('table')) {
        return <V0TableComponent prompt={prompt} />;
      } else {
        return <V0GenericComponent prompt={prompt} />;
      }
    } catch (error) {
      console.error('Error creating dynamic component:', error);
      return createFallbackComponent(prompt);
    }
  };

  // Fallback component
  const createFallbackComponent = (prompt) => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Component Generation Error</CardTitle>
        <CardDescription>Failed to generate component for: "{prompt}"</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Please try a different prompt or check the console for errors.</p>
      </CardContent>
    </Card>
  );

  // Status indicator
  const StatusBadge = () => {
    const statusConfig = {
      connected: { color: 'bg-green-500', text: 'Connected to v0.dev API', pulse: true },
      waiting: { color: 'bg-blue-500', text: 'Waiting for prompts', pulse: true },
      connecting: { color: 'bg-yellow-500', text: 'Connecting...', pulse: true },
      error: { color: 'bg-red-500', text: 'Connection error', pulse: false }
    };
    
    const config = statusConfig[connectionStatus] || statusConfig.connecting;
    
    return (
      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
        <div className={`w-2 h-2 ${config.color} rounded-full mr-2 ${config.pulse ? 'animate-pulse' : ''}`} />
        {config.text}
      </Badge>
    );
  };

  // Loading component
  const GeneratingLoader = () => (
    <div className="text-center py-16">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating v0.dev Component...</h3>
          <p className="text-gray-600">Claude is creating a beautiful React component</p>
          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">✨ Using AI to generate production-ready code</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Poll for prompts
  useEffect(() => {
    const interval = setInterval(checkForNewPrompts, 3000);
    return () => clearInterval(interval);
  }, [lastPromptId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2">⚡ v0.dev AI Generator</h1>
            <p className="text-xl opacity-90 mb-4">
              Claude → MCP → Vercel → v0.dev-style Components
            </p>
            <StatusBadge />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {isGenerating && <GeneratingLoader />}
        
        <div className={`transition-all duration-500 ${isGenerating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {generatedComponent ? (
            <div className="mb-8">
              {generatedComponent}
            </div>
          ) : (
            <WaitingForV0State />
          )}
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💻 Generated Code
                <Badge variant="secondary">React + Tailwind</Badge>
              </CardTitle>
              <CardDescription>
                v0.dev-style component generated from your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                <code>{generatedCode}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* History */}
        {history.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Component Generation History
                <Badge variant="outline">{history.length} generated</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.slice(-5).reverse().map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <p className="font-medium text-gray-800 truncate">{item.prompt}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.generator}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateV0Component(item.prompt, item.promptId)}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mt-8 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Error:</span>
                {error}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

// Waiting state component
const WaitingForV0State = () => (
  <Card className="text-center">
    <CardContent className="p-12">
      <div className="text-8xl mb-6">🎨</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Generate v0.dev Components</h2>
      <p className="text-xl text-gray-600 mb-8">
        Send a prompt from Claude to generate beautiful, production-ready React components
      </p>
      
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-800 mb-4">🚀 What you'll get:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <div className="font-medium text-violet-700">✨ AI-Generated Code</div>
            <div className="text-gray-600">Real React components with Tailwind</div>
          </div>
          <div className="text-left">
            <div className="font-medium text-purple-700">🎯 v0.dev Quality</div>
            <div className="text-gray-600">Professional, production-ready</div>
          </div>
          <div className="text-left">
            <div className="font-medium text-blue-700">📱 Responsive Design</div>
            <div className="text-gray-600">Mobile-first, accessible</div>
          </div>
          <div className="text-left">
            <div className="font-medium text-green-700">⚡ Interactive</div>
            <div className="text-gray-600">Hooks, animations, modern UX</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// v0.dev-style components that get rendered
const V0VendorDashboard = ({ prompt }) => {
  const [activeMetric, setActiveMetric] = useState(null);
  
  const metrics = [
    { title: 'Low Risk', value: 23, color: 'bg-green-500', change: '+2', icon: Users },
    { title: 'Medium Risk', value: 8, color: 'bg-yellow-500', change: '0', icon: AlertTriangle },
    { title: 'High Risk', value: 3, color: 'bg-red-500', change: '+1', icon: AlertTriangle },
    { title: 'Monthly Spend', value: '$47,250', color: 'bg-blue-500', change: '-3.2%', icon: DollarSign }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-4xl font-bold mb-2">🧠 AI Vendor Insights</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Generated from: "{prompt.substring(0, 60)}..."
              </CardDescription>
            </div>
            <Badge className="bg-white/20 text-white border-0">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Live v0.dev Component
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
              activeMetric === index ? 'ring-2 ring-blue-500 shadow-xl' : ''
            }`}
            onClick={() => setActiveMetric(activeMetric === index ? null : index)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-500 font-medium">{metric.change}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-gray-600 font-medium">{metric.title}</div>
              {activeMetric === index && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Click to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              AI-Detected Anomalies
              <Badge variant="destructive">3 New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { vendor: 'Acme Corp', issue: 'Price 22% higher than previous invoices', time: '2h ago' },
              { vendor: 'TechSupply Co.', issue: 'Invoice expected May 5, not received', time: '1d ago' }
            ].map((anomaly, index) => (
              <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg hover:bg-red-100 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-red-900">{anomaly.vendor}</h4>
                    <p className="text-sm text-gray-600">{anomaly.issue}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{anomaly.time}</span>
                    <Button size="sm" variant="outline" className="ml-2 mt-1 group-hover:bg-red-600 group-hover:text-white transition-colors">
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
              Payment Optimization
              <Badge className="ml-auto bg-green-100 text-green-800">$248 Available</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">💰 $620 Saved This Month!</div>
                <div className="text-green-600 text-sm">15% better via AI optimization</div>
              </div>
            </div>
            <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-green-900">Office Supplies Co.</h4>
                  <p className="text-sm text-gray-600">2% early payment discount available</p>
                  <p className="text-xs text-gray-500">Save $48 • Deadline: May 10</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const V0FormComponent = ({ prompt }) => (
  <Card className="max-w-md mx-auto">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        v0.dev Generated Form
      </CardTitle>
      <CardDescription>From prompt: "{prompt}"</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <input 
        type="text" 
        placeholder="Full Name" 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
      />
      <input 
        type="email" 
        placeholder="Email Address" 
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
      />
      <textarea 
        placeholder="Your Message" 
        className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
      />
      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
        Submit Form
      </Button>
    </CardContent>
  </Card>
);

const V0TableComponent = ({ prompt }) => (
  <Card>
    <CardHeader>
      <CardTitle>📊 v0.dev Data Table</CardTitle>
      <CardDescription>Generated from: "{prompt}"</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Amount</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'John Doe', status: 'Active', amount: '$1,250' },
              { name: 'Jane Smith', status: 'Pending', amount: '$850' }
            ].map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium">{row.name}</td>
                <td className="py-3 px-4">
                  <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                    {row.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-semibold">{row.amount}</td>
                <td className="py-3 px-4">
                  <Button size="sm" variant="outline">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const V0GenericComponent = ({ prompt }) => (
  <Card className="max-w-2xl mx-auto">
    <CardHeader className="text-center">
      <CardTitle className="text-3xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
        v0.dev Style Component
      </CardTitle>
      <CardDescription className="text-lg">Generated from your prompt</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-200">
        <code className="text-sm text-violet-800">"{prompt}"</code>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-blue-900 mb-2">✨ AI Generated</h3>
          <p className="text-blue-700">Production-ready React component</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all">
          <h3 className="font-semibold text-green-900 mb-2">🎯 v0.dev Quality</h3>
          <p className="text-green-700">Modern design with Tailwind CSS</p>
        </div>
      </div>
      <div className="text-center">
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-2">
          Interactive Element
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default DynamicV0ComponentGenerator;
