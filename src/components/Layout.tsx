import { Outlet, Link, useLocation } from 'react-router';
import { Plane, Map, Menu, X, Bot } from 'lucide-react';
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
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              {/* tbo.com Globe Logo */}
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0">
                {/* Outer dashed orbit ring */}
                <circle cx="22" cy="22" r="20" stroke="#1e3a8a" strokeWidth="1.6" strokeDasharray="3.8 2.6" fill="none"/>
                {/* Arrow head top-right */}
                <path d="M35.5 8.5 L39.5 7 L37.5 11.5" fill="#1e3a8a"/>
                {/* Arrow head bottom-left */}
                <path d="M8.5 35.5 L4.5 37 L6.5 32.5" fill="#1e3a8a"/>
                {/* Globe circle */}
                <circle cx="22" cy="22" r="12.5" stroke="#1e3a8a" strokeWidth="1.6" fill="none"/>
                {/* Equator */}
                <line x1="9.5" y1="22" x2="34.5" y2="22" stroke="#1e3a8a" strokeWidth="1" opacity="0.65"/>
                {/* Prime meridian */}
                <line x1="22" y1="9.5" x2="22" y2="34.5" stroke="#1e3a8a" strokeWidth="1" opacity="0.65"/>
                {/* Upper latitude arc */}
                <path d="M11 16.5 Q22 12.5 33 16.5" stroke="#1e3a8a" strokeWidth="1" fill="none" opacity="0.65"/>
                {/* Lower latitude arc */}
                <path d="M11 27.5 Q22 31.5 33 27.5" stroke="#1e3a8a" strokeWidth="1" fill="none" opacity="0.65"/>
                {/* Left longitude arc */}
                <path d="M22 9.5 Q15.5 15.5 15.5 22 Q15.5 28.5 22 34.5" stroke="#1e3a8a" strokeWidth="1" fill="none" opacity="0.65"/>
                {/* Right longitude arc */}
                <path d="M22 9.5 Q28.5 15.5 28.5 22 Q28.5 28.5 22 34.5" stroke="#1e3a8a" strokeWidth="1" fill="none" opacity="0.65"/>
              </svg>
              <div>
                <div className="font-extrabold text-[#1e3a8a] text-base sm:text-lg leading-tight tracking-tight">tbo.com</div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 font-semibold tracking-[0.18em] uppercase hidden sm:block">Travel Simplified</div>
              </div>
            </Link>

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