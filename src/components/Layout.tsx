import { Outlet, Link, useLocation } from 'react-router';
import { Plane, Package, FileText, Map, Sparkles, Menu, X, Bot } from 'lucide-react';
import { useState } from 'react';
import { VoiceCopilot } from './VoiceCopilot';

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm sm:text-base">TBO TravelAgent™</h1>
                <p className="text-xs text-gray-500 hidden sm:block">AI-Powered Booking Assistant</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/') && !isActive('/trips')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span className="text-sm">New Search</span>
              </Link>
              <Link
                to="/trips"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive('/trips')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="text-sm">My Trips</span>
              </Link>
              <button
                onClick={() => setCopilotOpen(o => !o)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  copilotOpen
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span className="text-sm">AI Copilot</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  isActive('/') && !isActive('/trips')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Plane className="w-5 h-5" />
                <span>New Search</span>
              </Link>
              <Link
                to="/trips"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  isActive('/trips')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Map className="w-5 h-5" />
                <span>My Trips</span>
              </Link>
              <button
                onClick={() => { setCopilotOpen(o => !o); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors text-left ${
                  copilotOpen
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span>AI Copilot</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* AI Voice Copilot — persists across all routes */}
      <VoiceCopilot open={copilotOpen} onOpenChange={setCopilotOpen} />
    </div>
  );
}