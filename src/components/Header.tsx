import React from 'react';
import { Link, useLocation } from 'react-router';
import { Plane, Building2, User, Bell } from 'lucide-react';

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
              <Plane className="size-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">TBO TravelAgent™</div>
              <div className="text-xs text-gray-500">AI-Powered B2B Platform</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium pb-0.5 transition-colors ${isActive('/')}`}>
              Search
            </Link>
            <Link to="/bookings" className={`text-sm font-medium pb-0.5 transition-colors ${isActive('/bookings')}`}>
              Bookings
            </Link>
            <Link to="/analytics" className={`text-sm font-medium pb-0.5 transition-colors ${isActive('/analytics')}`}>
              Analytics
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative">
              <Bell className="size-5" />
              <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Agent Portal</div>
                <div className="text-xs text-gray-500">ID: TBO-AG-12847</div>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="size-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
