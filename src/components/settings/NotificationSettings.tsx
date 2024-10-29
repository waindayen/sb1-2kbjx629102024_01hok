import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface NotificationPreferences {
  email_payment: boolean;
  email_subscription: boolean;
  email_expiry: boolean;
  push_payment: boolean;
  push_subscription: boolean;
  push_expiry: boolean;
}

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_payment: true,
    email_subscription: true,
    email_expiry: true,
    push_payment: false,
    push_subscription: false,
    push_expiry: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .single();<boltAction type="file" filePath="src/components/settings/NotificationSettings.tsx">
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setPreferences(data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast.error('Erreur lors du chargement des préférences de notification');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    try {
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key]
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...newPreferences
        });

      if (error) throw error;

      setPreferences(newPreferences);
      toast.success('Préférences mises à jour');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Erreur lors de la mise à jour des préférences');
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
        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        <p className="mt-1 text-sm text-gray-500">
          Gérez vos préférences de notification pour les paiements et les abonnements
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-900">Notifications par email</h4>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email_payment"
                      name="email_payment"
                      type="checkbox"
                      checked={preferences.email_payment}
                      onChange={() => handleToggle('email_payment')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_payment" className="font-medium text-gray-700">
                      Paiements
                    </label>
                    <p className="text-gray-500">Recevoir des notifications pour les paiements réussis ou échoués</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email_subscription"
                      name="email_subscription"
                      type="checkbox"
                      checked={preferences.email_subscription}
                      onChange={() => handleToggle('email_subscription')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_subscription" className="font-medium text-gray-700">
                      Abonnements
                    </label>
                    <p className="text-gray-500">Recevoir des notifications pour les changements d'abonnement</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email_expiry"
                      name="email_expiry"
                      type="checkbox"
                      checked={preferences.email_expiry}
                      onChange={() => handleToggle('email_expiry')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_expiry" className="font-medium text-gray-700">
                      Expiration
                    </label>
                    <p className="text-gray-500">Recevoir des rappels avant l'expiration de l'abonnement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h4 className="text-base font-medium text-gray-900">Notifications push</h4>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push_payment"
                      name="push_payment"
                      type="checkbox"
                      checked={preferences.push_payment}
                      onChange={() => handleToggle('push_payment')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="push_payment" className="font-medium text-gray-700">
                      Paiements
                    </label>
                    <p className="text-gray-500">Recevoir des notifications push pour les paiements</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push_subscription"
                      name="push_subscription"
                      type="checkbox"
                      checked={preferences.push_subscription}
                      onChange={() => handleToggle('push_subscription')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="push_subscription" className="font-medium text-gray-700">
                      Abonnements
                    </label>
                    <p className="text-gray-500">Recevoir des notifications push pour les abonnements</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push_expiry"
                      name="push_expiry"
                      type="checkbox"
                      checked={preferences.push_expiry}
                      onChange={() => handleToggle('push_expiry')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="push_expiry" className="font-medium text-gray-700">
                      Expiration
                    </label>
                    <p className="text-gray-500">Recevoir des notifications push pour l'expiration</p>
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

export default NotificationSettings;