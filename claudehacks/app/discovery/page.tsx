'use client';

import { useState } from 'react';

export default function CustomerDiscoveryDashboard() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    // Simulating API call - replace with actual API integration
    setTimeout(() => {
      setResults(prev => [`Response to: ${prompt}`, ...prev]);
      setPrompt('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">
              Customer Discovery Agent
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Prompt Input */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Ask Your Agent</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your task or question here..."
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className={`px-4 py-2 rounded-lg text-white ${
                      isLoading || !prompt.trim()
                        ? 'bg-purple-300'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } transition-colors`}
                  >
                    {isLoading ? 'Processing...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>

            {/* Results Display */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Results</h2>
              <div className="space-y-4">
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No results yet. Start by asking your agent a question!
                  </p>
                ) : (
                  results.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-700">{result}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setPrompt('Analyze my target market')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  🎯 Analyze Target Market
                </button>
                <button
                  onClick={() => setPrompt('Create customer personas')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  👥 Create Customer Personas
                </button>
                <button
                  onClick={() => setPrompt('Identify market trends')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  📈 Identify Market Trends
                </button>
                <button
                  onClick={() => setPrompt('Analyze competitors')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  🔍 Analyze Competitors
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {results.slice(0, 5).map((result, index) => (
                  <div key={index} className="text-sm text-gray-600 truncate">
                    • {result}
                  </div>
                ))}
                {results.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent activities</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 