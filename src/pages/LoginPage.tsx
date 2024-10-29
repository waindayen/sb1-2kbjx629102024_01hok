import React, { useState } from 'react';
import { LogIn, Mail, Lock, UserPlus, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { signIn, signUp, resetPassword } from '../lib/auth';

type AuthView = 'login' | 'register' | 'reset-password';

const LoginPage: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Connexion en cours...');

    try {
      const { user, error } = await signIn(email, password);
      if (error) throw new Error(error.message);
      
      if (user) {
        toast.success('Connexion réussie!', {
          duration: 3000,
          icon: '✅',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur de connexion. Vérifiez vos identifiants.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas', {
        duration: 4000,
        icon: '❌',
      });
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Création du compte...');

    try {
      const { user, error } = await signUp(email, password);
      if (error) throw new Error(error.message);

      if (user) {
        toast.success('Compte créé avec succès! Vérifiez votre email pour confirmer votre compte.', {
          duration: 5000,
          icon: '✅',
        });
        setView('login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Envoi du lien de réinitialisation...');

    try {
      const { error } = await resetPassword(email);
      if (error) throw new Error(error.message);

      toast.success('Un email de réinitialisation a été envoyé.', {
        duration: 5000,
        icon: '✉️',
      });
      setView('login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'email de réinitialisation.', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            {view === 'register' ? (
              <UserPlus className="h-12 w-12 text-indigo-600" />
            ) : view === 'reset-password' ? (
              <KeyRound className="h-12 w-12 text-indigo-600" />
            ) : (
              <LogIn className="h-12 w-12 text-indigo-600" />
            )}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {view === 'register'
              ? 'Créer un compte'
              : view === 'reset-password'
              ? 'Réinitialiser le mot de passe'
              : 'Connexion'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {view === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  onClick={() => setView('register')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Inscrivez-vous
                </button>
              </>
            ) : view === 'register' ? (
              <>
                Déjà un compte ?{' '}
                <button
                  onClick={() => setView('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Connectez-vous
                </button>
              </>
            ) : null}
          </p>
        </div>

        {view === 'login' && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setView('reset-password')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="register-email" className="sr-only">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="register-password" className="sr-only">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                {loading ? 'Création...' : 'Créer un compte'}
              </button>
            </div>
          </form>
        )}

        {view === 'reset-password' && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                {loading ? 'Envoi...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;