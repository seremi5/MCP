import React, { useState, useEffect } from 'react';

const DynamicUIGenerator = () => {
  const [lastPrompt, setLastPrompt] = useState('');
  const [lastPromptId, setLastPromptId] = useState(null);
  const [generatedUI, setGeneratedUI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);

  // Real function to check for new prompts from your Vercel API
  const checkForNewPrompts = async () => {
    try {
      const response = await fetch('/api/get-latest-prompt');
      const data = await response.json();
      
      if (data.success && data.prompt && data.id !== lastPromptId) {
        setLastPrompt(data.prompt);
        setLastPromptId(data.id);
        generateUIFromPrompt(data.prompt, data.id);
        setConnectionStatus('connected');
        setError(null);
      } else if (data.success && !data.prompt) {
        setConnectionStatus('waiting');
      }
    } catch (error) {
      console.log('Error checking for prompts:', error);
      setConnectionStatus('error');
      setError(error.message);
    }
  };

  // Function to generate UI based on prompt with enhanced AI parsing
  const generateUIFromPrompt = async (prompt, promptId) => {
    setIsLoading(true);
    
    try {
      // Parse the prompt and generate appropriate UI
      const ui = parsePromptToUI(prompt);
      setGeneratedUI(ui);
      
      // Add to history
      setHistory(prev => [...prev, {
        prompt,
        promptId,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }]);

      // Mark prompt as processed (optional API call)
      try {
        await fetch(`/api/prompts/${promptId}/processed`, { method: 'POST' });
      } catch (e) {
        // Non-critical if this fails
        console.log('Could not mark prompt as processed');
      }
    } catch (error) {
      console.error('Error generating UI:', error);
      setError('Failed to generate UI');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced prompt parser with more sophisticated detection
  const parsePromptToUI = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // AI Vendor Insights - Priority detection
    if (lowerPrompt.includes('vendor insights') || 
        lowerPrompt.includes('ai - vendor insights') ||
        (lowerPrompt.includes('vendor') && lowerPrompt.includes('invoice'))) {
      return generateVendorInsights(prompt);
    }
    
    // Dashboard detection
    if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
      return generateDashboard(prompt);
    }
    
    // Form detection
    if (lowerPrompt.includes('form') || lowerPrompt.includes('input') || 
        lowerPrompt.includes('submit') || lowerPrompt.includes('registration')) {
      return generateForm(prompt);
    }
    
    // Data table detection
    if (lowerPrompt.includes('table') || lowerPrompt.includes('list') || 
        lowerPrompt.includes('data') || lowerPrompt.includes('grid')) {
      return generateDataTable(prompt);
    }

    // Finance/accounting specific
    if (lowerPrompt.includes('finance') || lowerPrompt.includes('accounting') ||
        lowerPrompt.includes('billing') || lowerPrompt.includes('payment')) {
      return generateFinanceUI(prompt);
    }

    // E-commerce detection
    if (lowerPrompt.includes('product') || lowerPrompt.includes('shop') ||
        lowerPrompt.includes('cart') || lowerPrompt.includes('store')) {
      return generateEcommerceUI(prompt);
    }
    
    // Default: Smart content display with prompt analysis
    return generateSmartContentDisplay(prompt);
  };

  // Enhanced Vendor Insights Generator
  const generateVendorInsights = (prompt) => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🧠 AI Vendor Insights Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Generated from:</strong> "{prompt.substring(0, 100)}..."
          </p>
        </div>
        
        {/* Enhanced Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🟢</span>
                <div>
                  <p className="font-bold text-green-800 text-lg">Low Risk</p>
                  <p className="text-green-600 text-xl font-semibold">23 Vendors</p>
                </div>
              </div>
              <div className="text-green-600 text-sm">↗ +2</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🟡</span>
                <div>
                  <p className="font-bold text-yellow-800 text-lg">Medium Risk</p>
                  <p className="text-yellow-600 text-xl font-semibold">8 Vendors</p>
                </div>
              </div>
              <div className="text-yellow-600 text-sm">→ 0</div>
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🔴</span>
                <div>
                  <p className="font-bold text-red-800 text-lg">High Risk</p>
                  <p className="text-red-600 text-xl font-semibold">3 Vendors</p>
                </div>
              </div>
              <div className="text-red-600 text-sm">↑ +1</div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">$47,250</p>
              <p className="text-gray-600">Monthly Spend</p>
              <p className="text-green-600 text-sm">↓ -3.2% vs last month</p>
            </div>
          </div>
        </div>

        {/* Enhanced Anomalies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              🚨 Recent Anomalies 
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">3 New</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start p-3 bg-white rounded border-l-4 border-red-400 hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-semibold text-red-800">Acme Corp</p>
                  <p className="text-sm text-gray-600">Price 22% higher than previous 3 invoices</p>
                  <p className="text-xs text-gray-500">Expected: $1,200 | Actual: $1,464</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">2h ago</span>
                  <button className="block mt-1 text-xs text-blue-600 hover:underline">Review</button>
                </div>
              </div>
              
              <div className="flex justify-between items-start p-3 bg-white rounded border-l-4 border-yellow-400 hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-semibold text-yellow-800">TechSupply Co.</p>
                  <p className="text-sm text-gray-600">Invoice expected May 5, not received</p>
                  <p className="text-xs text-gray-500">Typical amount: ~$850</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">1d ago</span>
                  <button className="block mt-1 text-xs text-blue-600 hover:underline">Contact</button>
                </div>
              </div>

              <div className="flex justify-between items-start p-3 bg-white rounded border-l-4 border-orange-400 hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-semibold text-orange-800">Office Plus</p>
                  <p className="text-sm text-gray-600">Duplicate invoice detected</p>
                  <p className="text-xs text-gray-500">INV-2024-0847 | $425.50</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">3h ago</span>
                  <button className="block mt-1 text-xs text-red-600 hover:underline">Flag</button>
                </div>
              </div>
            </div>
          </div>

          {/* Discount Opportunities */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              💸 Payment Opportunities
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">$248 Available</span>
            </h3>
            
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-semibold">You saved $620 this month via early payments! 🎉</p>
              <p className="text-green-600 text-sm">15% better than last month</p>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-green-400">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-green-800">Office Supplies Co.</p>
                    <p className="text-sm text-gray-600">2% discount if paid by May 10</p>
                    <p className="text-xs text-gray-500">Invoice: $2,400 | Save: $48</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-green-600 font-semibold">4 days left</span>
                    <button className="block mt-1 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-blue-800">CloudTech Services</p>
                    <p className="text-sm text-gray-600">3% discount available</p>
                    <p className="text-xs text-gray-500">Invoice: $5,000 | Save: $150</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-blue-600 font-semibold">7 days left</span>
                    <button className="block mt-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-2 border-dashed border-gray-200 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4">🎯 Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="font-semibold text-blue-800">Review High-Risk Vendors</p>
              <p className="text-sm text-blue-600">3 vendors need attention</p>
            </button>
            
            <button className="p-4 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <p className="font-semibold text-green-800">Process Early Payments</p>
              <p className="text-sm text-green-600">Save $248 this week</p>
            </button>
            
            <button className="p-4 text-left bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <p className="font-semibold text-orange-800">Contact Overdue Vendors</p>
              <p className="text-sm text-orange-600">2 invoices missing</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const generateDashboard = (prompt) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">1,234</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Revenue</h3>
        <p className="text-3xl font-bold text-green-600">$56,789</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Orders</h3>
        <p className="text-3xl font-bold text-purple-600">890</p>
      </div>
    </div>
  );

  const generateForm = (prompt) => (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Generated Form</h3>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Name" 
          className="w-full p-2 border rounded-lg"
        />
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded-lg"
        />
        <textarea 
          placeholder="Message" 
          className="w-full p-2 border rounded-lg h-24"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );

  const generateDataTable = (prompt) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">Item 1</td>
            <td className="px-4 py-2">Active</td>
            <td className="px-4 py-2">2024-01-15</td>
          </tr>
          <tr className="border-t">
            <td className="px-4 py-2">Item 2</td>
            <td className="px-4 py-2">Pending</td>
            <td className="px-4 py-2">2024-01-14</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // New UI generators for enhanced functionality
  const generateFinanceUI = (prompt) => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Finance Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Revenue</h3>
            <p className="text-2xl font-bold text-green-600">$125,430</p>
            <p className="text-sm text-green-500">↑ 12% from last month</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Expenses</h3>
            <p className="text-2xl font-bold text-blue-600">$78,250</p>
            <p className="text-sm text-blue-500">↓ 5% from last month</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Profit</h3>
            <p className="text-2xl font-bold text-purple-600">$47,180</p>
            <p className="text-sm text-purple-500">↑ 28% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );

  const generateEcommerceUI = (prompt) => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛍️ E-commerce Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-3xl">📦</p>
            <p className="font-semibold">Orders</p>
            <p className="text-xl font-bold">1,247</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-3xl">💳</p>
            <p className="font-semibold">Sales</p>
            <p className="text-xl font-bold">$43,210</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-3xl">👥</p>
            <p className="font-semibold">Customers</p>
            <p className="text-xl font-bold">892</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-3xl">📈</p>
            <p className="font-semibold">Conversion</p>
            <p className="text-xl font-bold">3.2%</p>
          </div>
        </div>
      </div>
    </div>
  );

  const generateSmartContentDisplay = (prompt) => {
    // Analyze prompt for key themes
    const themes = [];
    if (prompt.toLowerCase().includes('ai')) themes.push('🤖 AI');
    if (prompt.toLowerCase().includes('data')) themes.push('📊 Data');
    if (prompt.toLowerCase().includes('analytics')) themes.push('📈 Analytics');
    if (prompt.toLowerCase().includes('dashboard')) themes.push('📋 Dashboard');
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">🎯 Smart Content Generator</h3>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Analyzed your prompt:</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <code className="text-sm">{prompt}</code>
          </div>
          {themes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Detected themes:</p>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-2 border-dashed border-gray-200 p-6 rounded-lg text-center">
          <p className="text-gray-600 mb-2">
            This is a dynamically generated interface based on your input!
          </p>
          <p className="text-sm text-gray-500">
            Prompt length: {prompt.length} characters | 
            Word count: {prompt.split(' ').length} words
          </p>
        </div>
      </div>
    );
  };

  // Enhanced status indicator
  const getStatusIndicator = () => {
    const statusConfig = {
      connected: { color: 'green', text: 'Connected', icon: '🟢' },
      waiting: { color: 'blue', text: 'Waiting for prompts', icon: '🔵' },
      connecting: { color: 'yellow', text: 'Connecting', icon: '🟡' },
      error: { color: 'red', text: 'Connection error', icon: '🔴' }
    };
    
    const config = statusConfig[connectionStatus] || statusConfig.connecting;
    
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-${config.color}-50 border border-${config.color}-200`}>
        <span className="animate-pulse">{config.icon}</span>
        <span className={`text-sm text-${config.color}-800`}>{config.text}</span>
      </div>
    );
  };

  // Poll for new prompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(checkForNewPrompts, 3000);
    return () => clearInterval(interval);
  }, [lastPromptId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 Dynamic UI Generator
          </h1>
          <p className="text-gray-600 mb-4">
            Send prompts from Claude via MCP to generate UI components in real-time
          </p>
          
          <div className="flex justify-center items-center space-x-4">
            {getStatusIndicator()}
            {lastPrompt && (
              <div className="max-w-md p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Latest:</strong> {lastPrompt.substring(0, 80)}
                  {lastPrompt.length > 80 ? '...' : ''}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </header>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Generating UI from your prompt...</p>
            <p className="text-gray-500 text-sm">This may take a few seconds</p>
          </div>
        )}

        <main className="mb-8">
          {generatedUI || (
            <div className="text-center py-16 bg-white rounded-lg shadow-lg">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-500 text-xl mb-2">
                Waiting for prompts from Claude...
              </p>
              <p className="text-gray-400">
                Send a prompt via MCP to generate a dynamic UI interface!
              </p>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-gray-600 mb-2">Try sending prompts like:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• "AI - Vendor Insights" (generates vendor dashboard)</li>
                  <li>• "Create a dashboard" (generates analytics view)</li>
                  <li>• "Build a form" (generates input form)</li>
                  <li>• "Show me data table" (generates data grid)</li>
                </ul>
              </div>
            </div>
          )}
        </main>

        {history.length > 0 && (
          <aside className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📊 Generation History 
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {history.length} generated
              </span>
            </h3>
            <div className="space-y-3">
              {history.slice(-5).reverse().map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium truncate">{item.prompt}</p>
                    <p className="text-xs text-gray-500">
                      ID: {item.promptId} • {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => generateUIFromPrompt(item.prompt, item.promptId)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DynamicUIGenerator;
