import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Price, Subscription, PaymentMethod } from '../types/payment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  useEffect(() => {
    fetchPricesAndSubscription();
    fetchPaymentMethods();
  }, []);

  const fetchPricesAndSubscription = async () => {
    try {
      // Récupérer les prix depuis Supabase
      const { data: pricesData, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .order('unit_amount');

      if (pricesError) throw pricesError;
      setPrices(pricesData);

      // Récupérer l'abonnement actif
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active')
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') throw subscriptionError;
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Erreur lors du chargement des prix');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data: methods, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erreur lors du chargement des moyens de paiement');
    }
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // Créer la session de paiement
      const { data: session, error: sessionError } = await supabase
        .functions.invoke('create-checkout-session', {
          body: { priceId }
        });

      if (sessionError) throw sessionError;

      // Rediriger vers Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Erreur lors de la souscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .functions.invoke('cancel-subscription', {
          body: { subscriptionId: subscription.id }
        });

      if (error) throw error;

      toast.success('Abonnement annulé avec succès');
      await fetchPricesAndSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // Créer la session de configuration
      const { data: session, error: sessionError } = await supabase
        .functions.invoke('create-setup-intent', {
          body: {}
        });

      if (sessionError) throw sessionError;

      // Rediriger vers la page de configuration
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (stripeError) throw stripeError;
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Erreur lors de l\'ajout du moyen de paiement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Section Abonnement */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Abonnement</h2>
          
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg">Abonnement actif</span>
              </div>
              <p className="text-gray-600">
                Prochain renouvellement le {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Annuler l'abonnement
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {prices.map((price) => (
                <div
                  key={price.id}
                  className={`border rounded-lg p-6 ${
                    selectedPrice === price.id ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{price.product}</h3>
                    <span className="text-2xl font-bold">
                      {(price.unit_amount / 100).toFixed(2)}€
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {price.type === 'recurring'
                      ? `Facturation ${price.interval_count === 1 ? '' : `tous les ${price.interval_count}`} ${
                          price.interval === 'month' ? 'mensuelle' : 'annuelle'
                        }`
                      : 'Paiement unique'}
                  </p>
                  <button
                    onClick={() => handleSubscribe(price.id)}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Souscrire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Moyens de paiement */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Moyens de paiement</h2>
          
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} ••••{method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expire {method.exp_month.toString().padStart(2, '0')}/{method.exp_year}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddPaymentMethod}
              disabled={loading}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Ajouter un moyen de paiement
            </button>
          </div>
        </div>

        {/* Section Historique des paiements */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Historique des paiements</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Exemple de ligne */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    01/03/2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    29.99€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Payé
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <a href="#" className="font-medium">
                      Télécharger
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;