import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your AI Agents!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marketing Agent Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              Marketing Agent
            </h2>
            <p className="text-gray-600 mb-4">
              Your AI-powered marketing specialist, ready to help with content creation
              and campaign optimization.
            </p>
            <a
              href="/marketing"
              className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>

          {/* Customer Discovery Agent Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-purple-600 mb-2">
              Customer Discovery Agent
            </h2>
            <p className="text-gray-600 mb-4">
              Your AI research expert for gathering customer insights and analyzing
              market trends.
            </p>
            <a
              href="/discovery"
              className="block w-full text-center bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
