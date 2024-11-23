import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Target, Settings, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-xl text-white">LifeTasks</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'text-orange-500' : ''}`}
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>Tasks</span>
                </Link>
                <Link 
                  to="/goals" 
                  className={`nav-link ${isActive('/goals') ? 'text-orange-500' : ''}`}
                >
                  <Target className="w-5 h-5" />
                  <span>Goals</span>
                </Link>
                <Link 
                  to="/settings" 
                  className={`nav-link ${isActive('/settings') ? 'text-orange-500' : ''}`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="nav-link text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className={`nav-link ${isActive('/auth') ? 'text-orange-500' : ''}`}
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}