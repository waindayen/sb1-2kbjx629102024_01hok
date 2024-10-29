import React from 'react';
import { UserPlus, List, FileText, Files, Menu, X, LogOut, Settings } from 'lucide-react';
import { signOut } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface NavigationProps {
  activeView: 'passport-form' | 'passport-list' | 'visa-form' | 'visa-list' | 'settings';
  onViewChange: (view: 'passport-form' | 'passport-list' | 'visa-form' | 'visa-list' | 'settings') => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleViewChange = (view: 'passport-form' | 'passport-list' | 'visa-form' | 'visa-list' | 'settings') => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      toast.success('Déconnexion réussie');
    } catch (err) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between h-16">
          <div className="flex space-x-8">
            <button
              onClick={() => handleViewChange('passport-form')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeView === 'passport-form'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Nouveau Passeport
            </button>
            <button
              onClick={() => handleViewChange('passport-list')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeView === 'passport-list'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <List className="h-5 w-5 mr-2" />
              Liste des Passeports
            </button>
            <button
              onClick={() => handleViewChange('visa-form')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeView === 'visa-form'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Nouveau Visa
            </button>
            <button
              onClick={() => handleViewChange('visa-list')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeView === 'visa-list'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Files className="h-5 w-5 mr-2" />
              Liste des Visas
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleViewChange('settings')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeView === 'settings'
                  ? 'border-indigo-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Paramètres
            </button>
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleViewChange('settings')}
                className={`inline-flex items-center p-2 rounded-md ${
                  activeView === 'settings'
                    ? 'text-indigo-600'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2 text-sm text-gray-500">{user?.email}</div>
              <button
                onClick={() => handleViewChange('passport-form')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'passport-form'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <UserPlus className="h-5 w-5 inline-block mr-2" />
                Nouveau Passeport
              </button>
              <button
                onClick={() => handleViewChange('passport-list')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'passport-list'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <List className="h-5 w-5 inline-block mr-2" />
                Liste des Passeports
              </button>
              <button
                onClick={() => handleViewChange('visa-form')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'visa-form'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <FileText className="h-5 w-5 inline-block mr-2" />
                Nouveau Visa
              </button>
              <button
                onClick={() => handleViewChange('visa-list')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'visa-list'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Files className="h-5 w-5 inline-block mr-2" />
                Liste des Visas
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}