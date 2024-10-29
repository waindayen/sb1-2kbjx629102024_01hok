import { supabase } from './supabase';
import toast from 'react-hot-toast';

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 429) {
        toast.error('Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.');
      } else {
        toast.error('Erreur de connexion. Vérifiez vos identifiants.');
      }
      throw error;
    }

    toast.success('Connexion réussie !');
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.status === 429) {
        toast.error('Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.');
      } else {
        toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
      throw error;
    }

    toast.success('Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
    return data;
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      if (error.status === 429) {
        toast.error('Trop de demandes de réinitialisation. Veuillez patienter quelques minutes avant de réessayer.');
      } else {
        toast.error('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
      }
      throw error;
    }

    toast.success('Un email de réinitialisation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
  } catch (err) {
    console.error('Reset password error:', err);
    throw err;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erreur lors de la déconnexion. Veuillez réessayer.');
      throw error;
    }
    toast.success('Déconnexion réussie !');
  } catch (err) {
    console.error('Signout error:', err);
    throw err;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe. Veuillez réessayer.');
      throw error;
    }

    toast.success('Mot de passe mis à jour avec succès !');
  } catch (err) {
    console.error('Update password error:', err);
    throw err;
  }
};