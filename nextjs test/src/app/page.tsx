import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">CollabFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Content Collaboration Made Simple
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Create, manage, and distribute content across channels with AI assistance.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/register" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get started
              </Link>
            </div>
          </div>

          <div className="mt-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">Collaborative Editing</h3>
                <p className="mt-2 text-base text-gray-500">Work together on content in real-time with your entire team.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">AI-Powered Assistance</h3>
                <p className="mt-2 text-base text-gray-500">Get intelligent suggestions and automate repetitive tasks.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">Multi-Channel Publishing</h3>
                <p className="mt-2 text-base text-gray-500">Publish content to multiple platforms with a single click.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 CollabFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 