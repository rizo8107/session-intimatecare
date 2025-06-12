import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, Search, UserCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useDatabase';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    if (profile?.role === 'expert') return '/dashboard/expert';
    return '/dashboard/user';
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ExpertConnect
              </span>
            </Link>
            <Loader className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ExpertConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/explore" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Explore Experts
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3">
                  <img
                    src={profile?.avatar_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={profile?.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium">{profile?.full_name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-error-600 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/explore"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Experts
            </Link>
            
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 py-2">
                  <img
                    src={profile?.avatar_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={profile?.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium">{profile?.full_name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-error-600 hover:text-error-700 transition-colors w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="block py-2 text-primary-600 hover:text-primary-700 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;