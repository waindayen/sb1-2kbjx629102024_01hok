import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (priceId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not loaded');

    const { data: session, error } = await supabase
      .functions.invoke('create-checkout-session', {
        body: { priceId }
      });

    if (error) throw error;

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (stripeError) throw stripeError;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    toast.error('Erreur lors de la création de la session de paiement');
    throw error;
  }
};

export const createSetupIntent = async () => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not loaded');

    const { data: setupIntent, error } = await supabase
      .functions.invoke('create-setup-intent', {
        body: {}
      });

    if (error) throw error;

    const { error: stripeError } = await stripe.confirmCardSetup(
      setupIntent.client_secret
    );

    if (stripeError) throw stripeError;

    toast.success('Moyen de paiement ajouté avec succès');
  } catch (error) {
    console.error('Error creating setup intent:', error);
    toast.error('Erreur lors de l\'ajout du moyen de paiement');
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const { error } = await supabase
      .functions.invoke('cancel-subscription', {
        body: { subscriptionId }
      });

    if (error) throw error;

    toast.success('Abonnement annulé avec succès');
  } catch (error) {
    console.error('Error canceling subscription:', error);
    toast.error('Erreur lors de l\'annulation de l\'abonnement');
    throw error;
  }
};

export const updatePaymentMethod = async (paymentMethodId: string) => {
  try {
    const { error } = await supabase
      .functions.invoke('update-payment-method', {
        body: { paymentMethodId }
      });

    if (error) throw error;

    toast.success('Moyen de paiement mis à jour avec succès');
  } catch (error) {
    console.error('Error updating payment method:', error);
    toast.error('Erreur lors de la mise à jour du moyen de paiement');
    throw error;
  }
};