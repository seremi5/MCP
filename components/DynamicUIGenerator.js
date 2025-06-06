import React, { useState, useEffect } from 'react';

const DynamicUIGenerator = () => {
  const [lastPrompt, setLastPrompt] = useState('');
  const [lastPromptId, setLastPromptId] = useState(null);
  const [generatedUI, setGeneratedUI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);

  // Check for new prompts from Vercel API
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
      console.error('Error checking for prompts:', error);
      setConnectionStatus('error');
      setError(error.message);
    }
  };

  // Generate UI based on prompt
  const generateUIFromPrompt = async (prompt, promptId) => {
    setIsLoading(true);
    
    // Simulate generation time for better UX
    setTimeout(() => {
      try {
        const ui = parsePromptToUI(prompt);
        setGeneratedUI(ui);
        
        // Add to history
        setHistory(prev => [...prev, {
          prompt,
          promptId,
          timestamp: new Date().toISOString(),
          id: Date.now()
        }]);

      } catch (error) {
        console.error('Error generating UI:', error);
        setError('Failed to generate UI');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  // Enhanced prompt parser
  const parsePromptToUI = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('vendor insights') || lowerPrompt.includes('ai - vendor insights')) {
      return <VendorInsightsDashboard prompt={prompt} />;
    } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
      return <AnalyticsDashboard prompt={prompt} />;
    } else if (lowerPrompt.includes('form')) {
      return <FormInterface prompt={prompt} />;
    } else if (lowerPrompt.includes('table') || lowerPrompt.includes('data')) {
      return <DataTable prompt={prompt} />;
    } else {
      return <SmartInterface prompt={prompt} />;
    }
  };

  // Status indicator component
  const StatusIndicator = () => {
    const statusConfig = {
      connected: { color: 'green', text: 'Connected & Generating', icon: '🟢' },
      waiting: { color: 'blue', text: 'Waiting for prompts', icon: '🔵' },
      connecting: { color: 'yellow', text: 'Connecting...', icon: '🟡' },
      error: { color: 'red', text: 'Connection error', icon: '🔴' }
    };
    
    const config = statusConfig[connectionStatus] || statusConfig.connecting;
    
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
        <div className={`w-3 h-3 bg-${config.color}-400 rounded-full animate-pulse`}></div>
        <span className="text-sm font-medium text-white">{config.text}</span>
      </div>
    );
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="text-center py-16">
      <div className="bg-white rounded-2xl shadow-xl p-12 inline-block">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Generating Beautiful UI...</h3>
        <p className="text-gray-600">Claude is crafting your interface with AI precision</p>
      </div>
    </div>
  );

  // Poll for new prompts
  useEffect(() => {
    const interval = setInterval(checkForNewPrompts, 3000);
    return () => clearInterval(interval);
  }, [lastPromptId]);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🚀 AI UI Generator</h1>
            <p className="text-xl opacity-90 mb-6">Transform Claude prompts into beautiful interfaces via MCP</p>
            <StatusIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {isLoading && <LoadingSpinner />}
        
        <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          {generatedUI || <WaitingState />}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                📊 Generation History
                <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {history.length}
                </span>
              </h3>
              <div className="space-y-3">
                {history.slice(-5).reverse().map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <p className="font-medium text-gray-800 truncate">{item.prompt}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {item.promptId} • {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => generateUIFromPrompt(item.prompt, item.promptId)}
                        className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800"><strong>Error:</strong> {error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Waiting State Component
const WaitingState = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
    <div className="text-8xl mb-6">⏳</div>
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Waiting for your prompt...</h2>
    <p className="text-xl text-gray-600 mb-8">Send a prompt from Claude via MCP to generate stunning interfaces</p>
    
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-2xl mx-auto">
      <h3 className="font-semibold text-gray-800 mb-4">✨ Try these prompts:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {[
          { code: 'AI - Vendor Insights', desc: 'Financial dashboard', color: 'blue' },
          { code: 'Create dashboard', desc: 'Analytics interface', color: 'green' },
          { code: 'Build a form', desc: 'Input interface', color: 'purple' },
          { code: 'Data table', desc: 'Data grid', color: 'orange' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 text-left shadow-sm hover:shadow-md transition-shadow">
            <code className={`text-${item.color}-600`}>"{item.code}"</code>
            <p className="text-gray-500 mt-1">→ {item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Vendor Insights Dashboard Component
const VendorInsightsDashboard = ({ prompt }) => (
  <div className="space-y-8 animate-fadeIn">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-2">🧠 AI Vendor Insights</h2>
          <p className="text-blue-100">Intelligent vendor risk assessment & optimization</p>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="text-2xl font-bold">$47,250</div>
          <div className="text-sm opacity-90">Monthly Spend</div>
        </div>
      </div>
    </div>

    {/* Risk Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { icon: '🟢', title: 'Low Risk', value: '23', change: '+2', color: 'green' },
        { icon: '🟡', title: 'Medium Risk', value: '8', change: '0', color: 'yellow' },
        { icon: '🔴', title: 'High Risk', value: '3', change: '+1', color: 'red' },
        { icon: '💰', title: 'Saved', value: '$620', change: 'This Month', color: 'blue' }
      ].map((item, idx) => (
        <div key={idx} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 rounded-xl p-6 border border-${item.color}-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-${item.color}-500 rounded-xl flex items-center justify-center`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <div className={`text-${item.color}-600 text-sm font-medium`}>
              {item.change.startsWith('+') || item.change.startsWith('-') ? `↗ ${item.change}` : item.change}
            </div>
          </div>
          <div className={`text-3xl font-bold text-${item.color}-800 mb-1`}>{item.value}</div>
          <div className={`text-${item.color}-700 font-medium`}>{item.title}</div>
        </div>
      ))}
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Anomalies */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">🚨 Recent Anomalies</h3>
          <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">3 New</span>
        </div>
        
        <div className="space-y-4">
          {[
            { company: 'Acme Corp', issue: 'Price 22% higher than previous 3 invoices', detail: 'Expected: $1,200 | Actual: $1,464', time: '2h ago', color: 'red', action: 'Review' },
            { company: 'TechSupply Co.', issue: 'Invoice expected May 5, not received', detail: 'Typical amount: ~$850', time: '1d ago', color: 'yellow', action: 'Contact' }
          ].map((item, idx) => (
            <div key={idx} className={`border-l-4 border-${item.color}-400 bg-${item.color}-50 p-4 rounded-r-xl hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-bold text-${item.color}-800`}>{item.company}</h4>
                  <p className="text-sm text-gray-600">{item.issue}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{item.time}</div>
                  <button className={`bg-${item.color}-600 text-white text-xs px-3 py-1 rounded-lg mt-1 hover:bg-${item.color}-700 transition-colors`}>
                    {item.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">💸 Payment Opportunities</h3>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">$248 Available</span>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">You saved $620 this month! 🎉</div>
            <div className="text-green-600 text-sm">15% better than last month via smart payments</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-xl hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-green-800">Office Supplies Co.</h4>
                <p className="text-sm text-gray-600">2% early payment discount</p>
                <p className="text-xs text-gray-500 mt-1">Invoice: $2,400 | Save: $48</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-semibold">4 days left</div>
                <button className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg mt-1 hover:bg-green-700 transition-colors">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Action Items */}
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 Recommended Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🔍', title: 'Review High-Risk Vendors', desc: '3 vendors need attention', color: 'blue' },
          { icon: '💰', title: 'Process Early Payments', desc: 'Save $248 this week', color: 'green' },
          { icon: '📞', title: 'Contact Overdue Vendors', desc: '2 invoices missing', color: 'orange' }
        ].map((item, idx) => (
          <button key={idx} className={`bg-${item.color}-600 hover:bg-${item.color}-700 text-white p-6 rounded-xl text-left transition-all hover:shadow-lg hover:-translate-y-1`}>
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm opacity-90">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Other components (simplified)
const AnalyticsDashboard = ({ prompt }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
    <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Analytics Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'Users', value: '12,345', color: 'blue' },
        { title: 'Revenue', value: '$89,123', color: 'green' },
        { title: 'Orders', value: '1,456', color: 'purple' }
      ].map((stat, idx) => (
        <div key={idx} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1`}>
          <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
          <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const FormInterface = ({ prompt }) => (
  <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Generated Form</h2>
    <div className="space-y-4">
      <input type="text" placeholder="Full Name" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
      <input type="email" placeholder="Email Address" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
      <textarea placeholder="Your Message" className="w-full p-4 border border-gray-300 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-1">
        Submit Form
      </button>
    </div>
  </div>
);

const DataTable = ({ prompt }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
      <h2 className="text-2xl font-bold text-gray-800">📋 Data Table</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Status', 'Date', 'Amount'].map(header => (
              <th key={header} className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[
            { name: 'John Doe', status: 'Active', date: '2024-01-15', amount: '$1,250', statusColor: 'green' },
            { name: 'Jane Smith', status: 'Pending', date: '2024-01-14', amount: '$850', statusColor: 'yellow' }
          ].map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
              <td className="px-6 py-4">
                <span className={`bg-${row.statusColor}-100 text-${row.statusColor}-800 px-2 py-1 rounded-full text-xs font-medium`}>
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{row.date}</td>
              <td className="px-6 py-4 font-semibold text-gray-900">{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SmartInterface = ({ prompt }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Smart Generated Interface</h2>
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
      <p className="text-gray-700 mb-4">Analyzed your prompt:</p>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <code className="text-sm text-gray-600">{prompt}</code>
      </div>
    </div>
    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
      <div className="text-4xl mb-4">🎨</div>
      <p className="text-xl text-gray-600">This is a dynamically generated interface based on your input!</p>
      <p className="text-gray-500 mt-2">Prompt length: {prompt.length} characters</p>
    </div>
  </div>
);

export default DynamicUIGenerator;
