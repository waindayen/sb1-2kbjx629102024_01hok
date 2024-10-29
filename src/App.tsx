import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import PassportForm from './components/PassportForm';
import PassportList from './components/PassportList';
import VisaForm from './components/VisaForm';
import VisaList from './components/VisaList';
import Navigation from './components/Navigation';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import AuthCallbackPage from './pages/AuthCallbackPage';

function App() {
  const [session, setSession] = useState(null);
  const [activeView, setActiveView] = useState<'passport-form' | 'passport-list' | 'visa-form' | 'visa-list'>('passport-list');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Vérifier si nous sommes sur la page de callback
  const isAuthCallback = window.location.pathname === '/auth/callback';
  if (isAuthCallback) {
    return <AuthCallbackPage />;
  }

  if (!session) {
    return (
      <>
        <Auth />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderActiveView()}
      </div>
      <Toaster position="top-right" />
    </div>
  );

  function renderActiveView() {
    switch (activeView) {
      case 'passport-form':
        return <PassportForm />;
      case 'passport-list':
        return <PassportList />;
      case 'visa-form':
        return <VisaForm />;
      case 'visa-list':
        return <VisaList />;
      default:
        return <PassportList />;
    }
  }
}

export default App;