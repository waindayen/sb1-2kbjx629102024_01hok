import { createClient } from '@supabase/supabase-js';
import type { VisaDocument } from '../types/visa';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Connexion réussie!');
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Inscription réussie! Vérifiez votre email pour confirmer votre compte.');
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Déconnexion réussie');
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Instructions de réinitialisation envoyées par email');
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const uploadPassportPhoto = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('passport-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('passport-photos')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const uploadVisaDocument = async (file: File): Promise<VisaDocument> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('visa-documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('visa-documents')
    .getPublicUrl(fileName);

  return {
    name: file.name,
    url: publicUrl,
    type: file.type,
    size: file.size
  };
};

export const checkPassportNumberExists = async (passportNumber: string) => {
  const { data, error } = await supabase
    .from('passports')
    .select('passport_number')
    .eq('passport_number', passportNumber)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
};