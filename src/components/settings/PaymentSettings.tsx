import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, PaypalIcon, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { createSetupIntent, updatePaymentMethod } from '../../lib/stripe';
import toast from 'react-hot-toast';
import type { PaymentMethod } from '../../types/payment';

const PaymentSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stripe' | 'paypal' | 'config'>('stripe');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: '',
    secretKey: '',
    webhookSecret: ''
  });

  useEffect(() => {
    fetchPaymentMethods();
    fetchStripeConfig();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erreur lors du chargement des moyens de paiement');
    } finally {
      setLoading(false);
    }
  };

  const fetchStripeConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setStripeConfig(data);
      }
    } catch (error) {
      console.error('Error fetching Stripe config:', error);
    }
  };

  const handleStripeConfigSave = async () => {
    try {
      const { error } = await supabase
        .from('stripe_config')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...stripeConfig
        });

      if (error) throw error;
      toast.success('Configuration Stripe mise à jour');
    } catch (error) {
      console.error('Error saving Stripe config:', error);
      toast.error('Erreur lors de la sauvegarde de la configuration');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Moyens de paiement</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('stripe')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'stripe'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CreditCard className="h-4 w-4 inline-block mr-2" />
            Cartes bancaires
          </button>
          <button
            onClick={() => setActiveTab('paypal')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'paypal'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <PaypalIcon className="h-4 w-4 inline-block mr-2" />
            PayPal
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'config'
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4 inline-block mr-2" />
            Configuration
          </button>
        </div>
      </div>

      {activeTab === 'config' ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Configuration Stripe
            </h3>
            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="publishableKey" className="block text-sm font-medium text-gray-700">
                  Clé publique
                </label>
                <input
                  type="text"
                  id="publishableKey"
                  value={stripeConfig.publishableKey}
                  onChange={(e) => setStripeConfig(prev => ({
                    ...prev,
                    publishableKey: e.target.value
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                  Clé secrète
                </label>
                <input
                  type="password"
                  id="secretKey"
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig(prev => ({
                    ...prev,
                    secretKey: e.target.value
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="webhookSecret" className="block text-sm font-medium text-gray-700">
                  Clé secrète Webhook
                </label>
                <input
                  type="password"
                  id="webhookSecret"
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig(prev => ({
                    ...prev,
                    webhookSecret: e.target.value
                  }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="pt-5">
                <button
                  onClick={handleStripeConfigSave}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sauvegarder la configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'stripe' ? (
        // Contenu existant pour les cartes bancaires
        <div className="bg-white shadow sm:rounded-lg">
          {/* ... (code existant pour les cartes bancaires) ... */}
        </div>
      ) : (
        // Contenu existant pour PayPal
        <div className="bg-white shadow sm:rounded-lg">
          {/* ... (code existant pour PayPal) ... */}
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;