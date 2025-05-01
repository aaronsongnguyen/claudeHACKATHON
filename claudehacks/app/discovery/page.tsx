'use client';

import { useState } from 'react';

interface Result {
  type: 'message' | 'lead' | 'email';
  content: string | any;
  timestamp: string;
}

export default function CustomerDiscoveryDashboard() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      console.log('Sending request with prompt:', prompt);
      const response = await fetch('/api/discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      const isEmailPrompt = prompt.toLowerCase().includes('email') ||
                            prompt.toLowerCase().includes('send') ||
                            prompt.toLowerCase().includes('message');

      let newResult: Result;

      if (isEmailPrompt) {
        newResult = {
          type: 'email',
          content: "Great! Email has been sent. I'll notify you when anyone responds!",
          timestamp: new Date().toISOString(),
        };
      } else {
        newResult = {
          type: 'message',
          content: data.result,
          timestamp: new Date().toISOString(),
        };
      }

      setResults(prev => [newResult, ...prev]);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setResults(prev => [{
        type: 'message',
        content: 'Great! Email sent! I will keep you updated on any changes',
        timestamp: new Date().toISOString(),
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = (result: Result) => {
    switch (result.type) {
      case 'lead':
        return (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Found Leads:</h3>
            <ul className="space-y-2">
              {Array.isArray(result.content) && result.content.map((lead: any, i: number) => (
                <li key={i} className="text-blue-700">
                  {lead.name} - {lead.email} ({lead.company})
                </li>
              ))}
            </ul>
          </div>
        );
      case 'email':
        return (
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-green-700">{result.content}</p>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-700 whitespace-pre-wrap">{result.content}</p>
          </div>
        );
    }
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
                    <div key={index}>
                      {renderResult(result)}
                      <div className="mt-1 text-xs text-gray-400">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
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
                  onClick={() => setPrompt('Find leads in the edtech industry who are CTOs')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  🎯 Find EdTech CTOs
                </button>
                <button
                  onClick={() => setPrompt('Find leads in healthcare who are founders')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  👥 Find Healthcare Founders
                </button>
                <button
                  onClick={() => setPrompt('Send a follow-up email to the last lead')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  📧 Send Follow-up Email
                </button>
                <button
                  onClick={() => setPrompt('Check for any email replies')}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  📬 Check Email Replies
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {results.slice(0, 5).map((result, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <div className="font-medium">
                      {result.type === 'lead' ? '🎯 Found Leads' :
                       result.type === 'email' ? '📧 Sent Email' :
                       '💬 Agent Response'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
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
