import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { PackageCard } from '../components/PackageCard';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';

export function PackagesPage() {
  const navigate = useNavigate();
  const { packages, currentIntent, setSelectedPackage } = useApp();

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    navigate('/customize');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">New Search</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {packages.length} Perfect Packages for Your Client
              </h1>
              {currentIntent && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    📍 {currentIntent.destination}
                  </div>
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                    👥 {currentIntent.passengers.adults} adults, {currentIntent.passengers.children} child
                  </div>
                  <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                    💰 Budget: ₹{currentIntent.budget.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                    📅 {new Date(currentIntent.dates.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(currentIntent.dates.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="size-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="size-4" />
                <span className="text-sm font-medium">Sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onSelect={() => handleSelectPackage(pkg)}
            />
          ))}
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">💡 AI Insights</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>• All packages stay within your ₹60,000 budget with room for agent markup</li>
            <li>• South Goa hotels recommended for "beach vibe" - quieter beaches, better for families</li>
            <li>• Mid-December is peak season - prices shown include seasonal adjustments</li>
            <li>• Consider booking within 48 hours - flight prices showing upward trend (+8%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
