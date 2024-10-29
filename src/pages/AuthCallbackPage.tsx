import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthCallbackPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirmation de votre email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;

        setStatus('success');
        setMessage('Email confirmé avec succès!');
        toast.success('Votre compte a été confirmé! Vous pouvez maintenant vous connecter.', {
          duration: 5000,
          icon: '✅'
        });

        // Redirection après 3 secondes
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('Erreur lors de la confirmation de votre email.');
        toast.error('Erreur lors de la confirmation. Veuillez réessayer.', {
          duration: 5000,
          icon: '❌'
        });
      }
    };

    handleEmailConfirmation();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        )}
        
        {status === 'success' && (
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        )}
        
        {status === 'error' && (
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        )}

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {message}
        </h2>

        {status === 'success' && (
          <p className="mt-2 text-sm text-gray-600">
            Redirection automatique vers la page de connexion...
          </p>
        )}

        {status === 'error' && (
          <div className="mt-4">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Retour à la page de connexion
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;