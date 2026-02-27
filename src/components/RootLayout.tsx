import { Outlet, Link, useLocation } from "react-router";
import { Plane, Search, FileText, Briefcase, Bell, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function RootLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: Briefcase },
    { path: "/search", label: "New Search", icon: Search },
    { path: "/trips", label: "All Trips", icon: Plane },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">TBO TravelAgent™</div>
                  <div className="text-xs text-gray-500">Agent Workspace</div>
                </div>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  2
                </Badge>
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l">
                <div className="text-right">
                  <div className="text-sm font-medium">Agent Portal</div>
                  <div className="text-xs text-gray-500">ID: AGT-2024</div>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>© 2026 TBO TravelAgent™. B2B Travel Distribution Platform.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-900">Help Center</a>
              <a href="#" className="hover:text-gray-900">API Docs</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
