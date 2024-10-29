import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cancelSubscription } from '../../lib/stripe';
import toast from 'react-hot-toast';
import type { Subscription, Price } from '../../types/payment';

const SubscriptionSettings: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionAndPrices();
  }, []);

  const fetchSubscriptionAndPrices = async () => {
    try {
      // Récupérer l'abonnement actif
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active')
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      setSubscription(subscriptionData);

      // Récupérer les prix disponibles
      const { data: pricesData, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .order('unit_amount');

      if (pricesError) throw pricesError;
      setPrices(pricesData || []);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Erreur lors du chargement des données d\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;

    try {
      await cancelSubscription(subscription.id);
      await fetchSubscriptionAndPrices();
      toast.success('Abonnement annulé avec succès');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Erreur lors de l\'annulation de l\'abonnement');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Abonnement</h3>
        <p className="mt-1 text-sm text-gray-500">
          Gérez votre abonnement et consultez l'historique de vos paiements
        </p>
      </div>

      {subscription ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Abonnement actif
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    Votre abonnement se renouvelle le{' '}
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                <button
                  onClick={handleCancelSubscription}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                >
                  Annuler l'abonnement
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Aucun abonnement actif
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Choisissez un plan pour commencer</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prices.map((price) => (
                <div
                  key={price.id}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {price.product}
                      </h3>
                      <span className="text-lg font-bold text-gray-900">
                        {(price.unit_amount / 100).toFixed(2)}€
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {price.type === 'recurring'
                        ? `Facturation ${
                            price.interval_count === 1 ? '' : `tous les ${price.interval_count}`
                          } ${price.interval === 'month' ? 'mensuelle' : 'annuelle'}`
                        : 'Paiement unique'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Rediriger vers la page de paiement
                      window.location.href = `/checkout?price=${price.id}`;
                    }}
                    className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Souscrire
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Historique des paiements
          </h3>
          <div className="mt-4">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;